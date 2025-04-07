# Socket.IO Integration Guide

This guide explains how to run and troubleshoot the Socket.IO integration in the Formula One Dashboard.

## Running the Application with Real-time Features

The recommended way to run the application with Socket.IO is to use our combined script:

```bash
# This will first kill any processes using our required ports, then start both servers
pnpm start:clean
```

This script:
1. Kills any processes using ports 3000, 3001, and 3002
2. Starts the Next.js application on port 3000
3. Starts the Socket.IO server on port 3002

## Alternative Run Methods

You can also run the servers separately:

```bash
# Run only the Next.js app (without Socket.IO)
pnpm dev

# Run only the Socket.IO server
pnpm dev:socket

# Run the Socket.IO server on a specific port
pnpm dev:socket:3001
pnpm dev:socket:3002
```

## Troubleshooting

If you're experiencing connection issues:

1. **Check for port conflicts**: Make sure no other applications are using ports 3000-3002
   ```bash
   # Kill processes on specific ports
   pnpm kill:3000
   pnpm kill:3001
   pnpm kill:3002
   
   # Kill all ports used by this application
   pnpm kill:all
   ```

2. **Use the Debug Page**: Visit `/debug` in your browser to:
   - Check connection status
   - Test all potential ports
   - View detailed socket information
   - Send ping messages to verify connectivity

3. **Check Browser Console**: Look for Socket.IO connection errors in your browser's developer tools

4. **Verify Data Flow**: The `/dashboard` page shows real-time data when connected

## Socket.IO Architecture

- The Socket.IO server runs separately from the Next.js server
- Both servers are integrated through a custom `server.js` implementation
- Clients connect to the Socket.IO server through the `/api/socket-io` path
- The server broadcasts data updates every 5 seconds to all connected clients

## Socket Events

The following events are available:

- `driver_update`: Sends real-time F1 driver data
- `chart_data_update`: Sends updated statistical data for charts
- `ping`/`pong`: Used for testing connectivity

## Development Notes

- The Socket.IO implementation automatically tries alternative ports if the default is busy
- In development, it will first try port 3000, then 3002
- The client-side `useSocket` hook handles reconnection and error states
- Socket connections are cleaned up when components unmount 