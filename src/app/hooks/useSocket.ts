'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Socket URL is based on the current hostname
export const getSocketUrl = () => {
  // First, check if we're already on the socket server port
  const currentPort = window.location.port;
  
  // Use the current origin as the base URL
  const baseUrl = window.location.origin;
  
  // Return different socket URLs depending on the environment
  // If we're in development and on port 3001 or 3002, assume that's the socket server
  if (currentPort === '3001' || currentPort === '3002') {
    return baseUrl; // Already on the socket server port, use current origin
  }
  
  // If we're on localhost and the server is running on port 3000
  if (window.location.hostname === 'localhost' && currentPort === '3000') {
    // Try port 3002 first, as that's what our dev:all script uses
    console.log('Attempting to connect to Socket.IO server on port 3002');
    return baseUrl.replace(':3000', ':3002');
  }
  
  // Default: use the current origin (works in production)
  return baseUrl;
};

// Types for socket data
export interface DriverUpdate {
  driverId: number;
  name: string;
  team: string;
  position: number;
  lastLapTime: number;
  gapToLeader: string;
  pitStops: number;
  timestamp: number;
}

export interface ChartDataUpdate {
  timestamp: number;
  totalRaces: number;
  totalWins: number;
  teamWins: {
    [team: string]: number;
  };
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [driverUpdate, setDriverUpdate] = useState<DriverUpdate | null>(null);
  const [chartData, setChartData] = useState<ChartDataUpdate | null>(null);
  const [lastPong, setLastPong] = useState<{received: any, timestamp: number, message: string} | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = getSocketUrl();
    console.log('Attempting to connect to Socket.IO at:', socketUrl);
    
    // Initialize socket with reconnection options
    const socketInstance = io(socketUrl, {
      path: '/api/socket-io',
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });
    
    setSocket(socketInstance);
    
    // Cleanup on unmount
    return () => {
      if (socketInstance) {
        console.log('Cleaning up socket connection');
        socketInstance.disconnect();
      }
    };
  }, []);
  
  // Set up event handlers when socket is available
  useEffect(() => {
    if (!socket) return;
    
    const onConnect = () => {
      console.log('Socket connected!');
      setIsConnected(true);
      setConnectionError(null);
      setReconnectAttempts(0);
    };
    
    const onDisconnect = (reason: string) => {
      console.log(`Socket disconnected: ${reason}`);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, need to reconnect manually
        socket.connect();
      }
    };
    
    const onConnectError = (error: Error) => {
      setConnectionError(`Connection error: ${error.message}`);
      setIsConnected(false);
      setReconnectAttempts(prev => prev + 1);
      console.error('Socket connection error:', error);
    };
    
    const onReconnectAttempt = (attempt: number) => {
      console.log(`Reconnect attempt ${attempt}`);
      setReconnectAttempts(attempt);
    };
    
    const onDriverUpdate = (data: DriverUpdate) => {
      console.log('Received driver update:', data);
      setDriverUpdate(data);
    };
    
    const onChartDataUpdate = (data: ChartDataUpdate) => {
      console.log('Received chart data update:', data);
      setChartData(data);
    };
    
    const onPong = (data: {received: any, timestamp: number, message: string}) => {
      console.log('Received pong:', data);
      setLastPong(data);
    };
    
    // Register event handlers
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('driver_update', onDriverUpdate);
    socket.on('chart_data_update', onChartDataUpdate);
    socket.on('pong', onPong);
    
    // Cleanup event handlers
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('reconnect_attempt', onReconnectAttempt);
      socket.off('driver_update', onDriverUpdate);
      socket.off('chart_data_update', onChartDataUpdate);
      socket.off('pong', onPong);
    };
  }, [socket]);
  
  // Function to manually attempt reconnection
  const reconnect = useCallback(() => {
    if (socket) {
      console.log('Manually attempting to reconnect...');
      socket.connect();
    }
  }, [socket]);
  
  // Function to send a ping to test the connection
  const sendPing = useCallback(() => {
    if (socket && isConnected) {
      console.log('Sending ping...');
      socket.emit('ping', { 
        message: 'Ping from client',
        timestamp: Date.now(),
        browser: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
      });
    } else {
      console.warn('Cannot send ping: socket not connected');
      setConnectionError('Cannot send ping: socket not connected');
    }
  }, [socket, isConnected]);
  
  // Function to emit any event through the socket
  const emitEvent = useCallback((eventName: string, data: any) => {
    if (socket && isConnected) {
      console.log(`Emitting ${eventName}:`, data);
      socket.emit(eventName, data);
      return true;
    } else {
      console.warn(`Cannot emit ${eventName}: socket not connected`);
      setConnectionError(`Cannot emit ${eventName}: socket not connected`);
      return false;
    }
  }, [socket, isConnected]);
  
  // Get socket details for debugging
  const getSocketDetails = useCallback(() => {
    if (!socket) return null;
    
    try {
      return {
        id: socket.id,
        connected: socket.connected,
        disconnected: socket.disconnected,
        active: socket.active,
        // @ts-ignore - These might be available on the socket instance
        reconnection: socket.io?.opts?.reconnection,
        reconnectionAttempts: socket.io?.opts?.reconnectionAttempts,
        reconnectionDelay: socket.io?.opts?.reconnectionDelay,
        timeout: socket.io?.opts?.timeout,
        transport: socket.io?._readyState
      };
    } catch (error) {
      console.error('Error getting socket details:', error);
      return {
        error: 'Failed to retrieve socket details',
        message: error instanceof Error ? error.message : String(error)
      };
    }
  }, [socket]);
  
  return {
    socket,
    isConnected,
    connectionError,
    reconnectAttempts,
    driverUpdate,
    chartData,
    lastPong,
    sendPing,
    emitEvent,
    reconnect,
    getSocketDetails
  };
} 