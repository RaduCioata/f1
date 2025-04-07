import { Server as SocketIOServer } from 'socket.io';
import { NextRequest, NextResponse } from 'next/server';

// Global variables to store the Socket.IO server instance
let io: SocketIOServer | null = null;

// Global interval ID for updates
let globalIntervalId: NodeJS.Timeout | null = null;

// Function to generate random driver stats
function generateRandomDriverStat(driverId: number) {
  const randomWins = Math.floor(Math.random() * 3);
  const randomRaces = Math.floor(Math.random() * 5) + 1;
  
  return {
    driverId,
    timestamp: Date.now(),
    winsAdded: randomWins,
    racesAdded: randomRaces
  };
}

// Function to emit real-time updates
function startRealTimeUpdates() {
  if (!io) return;
  
  console.log('Starting real-time updates');
  
  // Clear any existing interval
  if (globalIntervalId) {
    clearInterval(globalIntervalId);
  }
  
  // Set up interval to send updates every 5 seconds
  globalIntervalId = setInterval(() => {
    if (!io || io.engine.clientsCount === 0) {
      console.log('No clients connected, skipping update');
      return;
    }
    
    // Generate data for a random driver
    const driverId = Math.floor(Math.random() * 10) + 1;
    const driverUpdate = generateRandomDriverStat(driverId);
    
    console.log(`Emitting driver update to ${io.engine.clientsCount} clients:`, driverUpdate);
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
}

export function GET(req: NextRequest) {
  // This would be used for health check
  return NextResponse.json({
    success: true,
    message: 'Socket.IO server is available',
    socketPath: '/api/socket-io'
  });
}

export async function POST(req: NextRequest) {
  // Handle the Socket.IO initialization and connections
  try {
    // Only initialize once
    if (!io) {
      console.log('Initializing Socket.IO server');
      
      // @ts-ignore - NextJS doesn't export the httpServer type
      const httpServer = (process as any).socket.server;
      
      if (!httpServer) {
        console.error('HTTP server not found, cannot initialize Socket.IO');
        return NextResponse.json({ 
          success: false,
          error: 'HTTP server not available'
        }, { status: 500 });
      }
      
      io = new SocketIOServer(httpServer, {
        path: '/api/socket-io',
        addTrailingSlash: false,
        cors: {
          origin: '*',
          methods: ['GET', 'POST']
        }
      });
      
      // Start the updates interval
      startRealTimeUpdates();
      
      // Handle client connections
      io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        console.log(`Total clients: ${io?.engine.clientsCount}`);
        
        // Send welcome message
        socket.emit('connection_established', {
          message: 'Connected to F1 real-time data',
          clientId: socket.id,
          timestamp: Date.now()
        });
        
        // Send initial data
        socket.emit('driver_update', generateRandomDriverStat(1));
        socket.emit('chart_data_update', {
          timestamp: Date.now(),
          totalRaces: 550,
          totalWins: 220,
          teamWins: {
            'Red Bull Racing': 35,
            'Mercedes': 30,
            'Ferrari': 25,
            'McLaren': 20,
            'Aston Martin': 10
          }
        });
        
        // Handle disconnect
        socket.on('disconnect', (reason) => {
          console.log(`Client ${socket.id} disconnected: ${reason}`);
          console.log(`Remaining clients: ${io?.engine.clientsCount}`);
        });
        
        // Handle ping/pong for testing
        socket.on('ping', (data) => {
          console.log(`Received ping from ${socket.id}:`, data);
          socket.emit('pong', {
            received: data,
            timestamp: Date.now(),
            message: 'Server received your ping'
          });
        });
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Socket.IO server initialized',
      clientsCount: io.engine.clientsCount
    });
  } catch (error: any) {
    console.error('Error initializing Socket.IO:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
} 