import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const alternativePort = parseInt(process.env.PORT || '3000', 10) === 3000 ? 3001 : 3002; // Try different ports

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Attach socket server to Node.js global object
// Need to use globalThis instead of process for TypeScript compatibility
globalThis.socketServer = null;

app.prepare().then(() => {
  // Create the HTTP server
  const server = createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url || '', true);
      
      // Let Next.js handle the request
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling the request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });
  
  // Initialize Socket.IO with the HTTP server
  const io = new Server(server, {
    path: '/api/socket-io',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true // Allow compatibility with older clients
  });
  
  // Save a reference to the Socket.IO server on the global object
  globalThis.socketServer = { server, io };
  
  // Socket connection handler
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Send connection established message
    socket.emit('connection_established', { 
      message: 'Connected to F1 real-time data server',
      timestamp: Date.now()
    });
    
    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Client disconnected (${socket.id}): ${reason}`);
    });
    
    // Handle ping (for debugging)
    socket.on('ping', (data) => {
      console.log(`Received ping from ${socket.id}:`, data);
      socket.emit('pong', {
        received: data,
        timestamp: Date.now(),
        message: 'Server received your ping'
      });
    });
  });
  
  // Generate driver updates every 5 seconds
  function generateRandomDriverStat(driverId = 1) {
    const drivers = [
      { id: 1, name: "Lewis Hamilton", team: "Mercedes" },
      { id: 2, name: "Max Verstappen", team: "Red Bull Racing" },
      { id: 3, name: "Charles Leclerc", team: "Ferrari" },
      { id: 4, name: "Lando Norris", team: "McLaren" },
      { id: 5, name: "Carlos Sainz", team: "Ferrari" },
      { id: 6, name: "George Russell", team: "Mercedes" },
      { id: 7, name: "Sergio Perez", team: "Red Bull Racing" },
      { id: 8, name: "Fernando Alonso", team: "Aston Martin" },
      { id: 9, name: "Oscar Piastri", team: "McLaren" },
      { id: 10, name: "Lance Stroll", team: "Aston Martin" }
    ];
    
    // Find driver or default to first driver
    const driver = drivers.find(d => d.id === driverId) || drivers[0];
    
    return {
      driverId: driver.id,
      name: driver.name,
      team: driver.team,
      position: Math.floor(Math.random() * 10) + 1,
      lastLapTime: 90 + (Math.random() * 5),
      gapToLeader: `+${(Math.random() * 10).toFixed(3)}s`,
      pitStops: Math.floor(Math.random() * 3),
      timestamp: Date.now()
    };
  }
  
  // Start emitting updates if clients are connected
  setInterval(() => {
    const clientCount = io.engine.clientsCount;
    if (clientCount === 0) {
      return; // No clients connected, don't send updates
    }
    
    // Generate random driver update for a random driver
    const driverId = Math.floor(Math.random() * 10) + 1;
    const driverUpdate = generateRandomDriverStat(driverId);
    
    console.log(`Emitting driver update to ${clientCount} clients:`, driverUpdate);
    io.emit('driver_update', driverUpdate);
    
    // Emit chart data update
    const chartData = {
      timestamp: Date.now(),
      totalRaces: Math.floor(Math.random() * 100) + 500,
      totalWins: Math.floor(Math.random() * 50) + 200,
      teamWins: {
        'Red Bull Racing': Math.floor(Math.random() * 10) + 30,
        'Mercedes': Math.floor(Math.random() * 10) + 25,
        'Ferrari': Math.floor(Math.random() * 10) + 20,
        'McLaren': Math.floor(Math.random() * 10) + 15,
        'Aston Martin': Math.floor(Math.random() * 5) + 5
      }
    };
    
    io.emit('chart_data_update', chartData);
    console.log('Emitted chart data update');
  }, 5000);
  
  // Handle server startup with error recovery
  const startServer = (portToUse) => {
    try {
      server.listen(portToUse, () => {
        console.log(`> Ready on http://${hostname}:${portToUse}`);
        console.log(`> Socket.IO server initialized at path: /api/socket-io`);
        
        // Store the actual port we're running on
        globalThis.socketServer.port = portToUse;
      });
    } catch (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  };
  
  // Store an already attempted port to avoid infinite loops
  let attemptedAlternativePort = false;
  
  // Attempt to start on primary port
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (!attemptedAlternativePort) {
        console.log(`Port ${port} is busy, trying alternative port ${alternativePort}`);
        attemptedAlternativePort = true;
        startServer(alternativePort);
      } else {
        console.error('All configured ports are busy. Please free a port or specify a different one with the PORT environment variable.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
  
  startServer(port);
}); 