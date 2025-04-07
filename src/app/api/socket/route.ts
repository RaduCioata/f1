import { Server as SocketIOServer } from 'socket.io';
import { NextRequest, NextResponse } from 'next/server';
import { Server as NetServer } from 'http';

// Socket.IO server instance
let io: SocketIOServer | null = null;

// Store server instance since we need to reuse it
let netServer: NetServer | null = null;

// Port for the WebSocket server
const SOCKET_PORT = parseInt(process.env.SOCKET_PORT || '3001', 10);

// URL to connect to the WebSocket server
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || `http://localhost:${SOCKET_PORT}`;

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

export function GET(req: NextRequest) {
  // Check if Socket.IO server is initialized
  if (globalThis.socketServer && globalThis.socketServer.io) {
    const serverPort = globalThis.socketServer.port || 3000;
    
    return NextResponse.json({
      success: true,
      message: 'Socket.IO server is available',
      clientsCount: globalThis.socketServer.io.engine.clientsCount,
      path: '/api/socket-io',
      port: serverPort
    });
  }
  
  // For development - return success even if server isn't initialized yet
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.json({
      success: true,
      message: 'Development mode: Socket.IO server should be available',
      path: '/api/socket-io',
      port: 3001 // Suggest trying the alternative port in development
    });
  }
  
  return NextResponse.json({
    success: false,
    message: 'Socket.IO server is not initialized',
    path: '/api/socket-io'
  }, { status: 503 }); // Service Unavailable
}

// Handle WebSocket upgrade requests
export async function POST(req: NextRequest) {
  // This endpoint is just for health checks now
  if (globalThis.socketServer && globalThis.socketServer.io) {
    return NextResponse.json({
      success: true,
      message: 'Socket.IO server is running',
      clientsCount: globalThis.socketServer.io.engine.clientsCount
    });
  }
  
  return NextResponse.json({
    success: false,
    message: 'Socket.IO server is not initialized'
  }, { status: 503 }); // Service Unavailable
} 