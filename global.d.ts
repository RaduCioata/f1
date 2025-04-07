import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

declare global {
  var socketServer: {
    server: HTTPServer;
    io: SocketIOServer;
  } | null;
} 