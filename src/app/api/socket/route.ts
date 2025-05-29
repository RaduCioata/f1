import { Server as SocketIOServer } from 'socket.io';
import { NextRequest, NextResponse } from 'next/server';
import { Server as NetServer } from 'http';

// Socket server configuration
const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || '3001', 10);
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || `http://localhost:${SOCKET_PORT}`;

// Server instances
let io: SocketIOServer | null = null;
let netServer: NetServer | null = null;

// Function to generate random driver stats (for simulation)
function generateRandomDriverStat(driverId: number) {
  // Random stats to simulate real-time race data
  const randomWins = Math.floor(Math.random() * 3);
  const randomRaces = Math.floor(Math.random() * 5) + 1;
  
  return {
    driverId,
    timestamp: Date.now(),
    winsAdded: randomWins,
    racesAdded: randomRaces
  };
}

// Global interval ID for updates
let globalIntervalId: NodeJS.Timeout | null = null;

// Start the background thread that simulates real-time data generation
function startRealTimeUpdates() {
  console.log('Starting global real-time updates');
  
  // Clear any existing interval
  if (globalIntervalId) {
    clearInterval(globalIntervalId);
  }
  
  // Set up interval to simulate data generation (every 5 seconds)
  globalIntervalId = setInterval(() => {
    if (!io || io.engine.clientsCount === 0) {
      console.log('No clients connected, skipping update');
      return;
    }
    
    // Generate data for a random driver (using ID 1-10)
    const driverId = Math.floor(Math.random() * 10) + 1;
    const driverUpdate = generateRandomDriverStat(driverId);
    
    console.log(`Emitting driver update for driver ${driverId} to all clients:`, driverUpdate);
    
    // Emit the update to all connected clients
    io.emit('driver_update', driverUpdate);
    
    // Emit a chart data update with some random metrics
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
    console.log('Emitted chart data update to all clients');
  }, 5000);
}

// GET /api/socket - Get socket server status
export async function GET() {
  return NextResponse.json({
    status: 'available',
    url: SOCKET_URL,
    port: SOCKET_PORT
  });
}

// POST /api/socket - Initialize socket server
export async function POST() {
  try {
    // Only initialize once
    if (io) {
      return NextResponse.json({ status: 'Socket server already running' });
    }

    // Get HTTP server instance
    const httpServer = (process as any).socket?.server;
    if (!httpServer) {
      return NextResponse.json({ error: 'HTTP server not available' }, { status: 500 });
    }

    // Initialize Socket.IO server
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // Store net server reference
    netServer = httpServer;

    return NextResponse.json({ status: 'Socket server initialized', url: SOCKET_URL });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Socket initialization failed' },
      { status: 500 }
    );
  }
} 