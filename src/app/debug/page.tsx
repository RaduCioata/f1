'use client';

import { useState, useEffect } from 'react';
import { useSocket, getSocketUrl } from '../hooks/useSocket';
import Link from 'next/link';

export default function DebugPage() {
  const { 
    socket,
    isConnected, 
    connectionError,
    reconnectAttempts,
    driverUpdate,
    chartData,
    lastPong,
    sendPing,
    reconnect,
    getSocketDetails
  } = useSocket();
  
  const [socketDetails, setSocketDetails] = useState<any>(null);
  const [logs, setLogs] = useState<{timestamp: number, message: string, type: 'info' | 'error' | 'success'}[]>([]);
  const [serverInfo, setServerInfo] = useState<any>(null);
  
  
  // Add log entries
  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogs(prev => [...prev, { timestamp: Date.now(), message, type }]);
  };
  
  // Get socket server info
  const checkServerInfo = async () => {
    try {
      addLog('Checking socket server info...', 'info');
      const response = await fetch('/api/socket');
      const data = await response.json();
      setServerInfo(data);
      addLog(`Server info: ${data.success ? 'Available' : 'Not available'}`, data.success ? 'success' : 'error');
      
      // Also add window.location info for debugging
      const locationInfo = {
        href: window.location.href,
        origin: window.location.origin,
        protocol: window.location.protocol,
        host: window.location.host,
        hostname: window.location.hostname,
        port: window.location.port,
        pathname: window.location.pathname
      };
      
      addLog(`Window location: ${JSON.stringify(locationInfo)}`, 'info');
    } catch (error) {
      addLog(`Error checking server: ${error instanceof Error ? error.message : String(error)}`, 'error');
      setServerInfo({ error: String(error) });
    }
  };
  
  // Update socket details
  useEffect(() => {
    const details = getSocketDetails();
    setSocketDetails(details);
  }, [isConnected, socket, getSocketDetails]);
  
  // Log connection status changes
  useEffect(() => {
    if (isConnected) {
      addLog('Socket connected', 'success');
    } else {
      addLog('Socket disconnected', 'error');
    }
  }, [isConnected]);
  
  // Log connection errors
  useEffect(() => {
    if (connectionError) {
      addLog(`Connection error: ${connectionError}`, 'error');
    }
  }, [connectionError]);
  
  // Log data updates
  useEffect(() => {
    if (driverUpdate) {
      addLog(`Driver update received: ${driverUpdate.name} (${driverUpdate.team})`, 'info');
    }
  }, [driverUpdate]);
  
  useEffect(() => {
    if (chartData) {
      addLog(`Chart data update received at ${new Date(chartData.timestamp).toLocaleTimeString()}`, 'info');
    }
  }, [chartData]);
  
  useEffect(() => {
    if (lastPong) {
      addLog(`Pong received: ${lastPong.message}`, 'success');
    }
  }, [lastPong]);
  
  // Handle manual reconnect
  const handleReconnect = () => {
    addLog('Manual reconnect initiated', 'info');
    reconnect();
  };
  
  // Handle ping
  const handlePing = () => {
    addLog('Sending ping to server', 'info');
    sendPing();
  };
  
  // Check server info on mount
  useEffect(() => {
    checkServerInfo();
  }, []);
  
  // Function to test connections to multiple potential socket servers
  const testMultiplePorts = async () => {
    addLog('Testing connections to multiple potential socket servers...', 'info');
    
    // Standard ports to test
    const portsToTest = [3000, 3001, 3002];
    
    for (const port of portsToTest) {
      try {
        const testUrl = `http://${window.location.hostname}:${port}`;
        addLog(`Testing connection to ${testUrl}...`, 'info');
        
        const response = await fetch(`${testUrl}/api/socket`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          // Short timeout to avoid hanging
          signal: AbortSignal.timeout(2000)
        });
        
        if (response.ok) {
          const data = await response.json();
          addLog(`✅ Port ${port} responded: ${JSON.stringify(data)}`, 'success');
        } else {
          addLog(`❌ Port ${port} responded with status: ${response.status}`, 'error');
        }
      } catch (error) {
        addLog(`❌ Failed to connect to port ${port}: ${error instanceof Error ? error.message : String(error)}`, 'error');
      }
    }
    
    addLog('Port test completed', 'info');
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <Link 
          href="/" 
          className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        <h1 className="text-2xl font-bold mb-4">WebSocket Debug</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Connection Status */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="mr-2">Status:</span>
              <span className={`px-2 py-1 rounded text-white ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div>Socket URL: {getSocketUrl()}</div>
            {socket && <div>Socket ID: {socket.id || 'Not available'}</div>}
            <div>Reconnect Attempts: {reconnectAttempts}</div>
            {connectionError && (
              <div className="text-red-500">Error: {connectionError}</div>
            )}
            <div className="mt-4 space-x-2">
              <button
                onClick={handleReconnect}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reconnect
              </button>
              <button
                onClick={handlePing}
                disabled={!isConnected}
                className={`px-4 py-2 text-white rounded ${
                  isConnected ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Send Ping
              </button>
              <button
                onClick={checkServerInfo}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Check Server
              </button>
              <button
                onClick={testMultiplePorts}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Test All Ports
              </button>
            </div>
          </div>
        </div>
        
        {/* Socket Details */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Socket Details</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-auto max-h-60">
            {JSON.stringify(socketDetails, null, 2) || 'No socket details available'}
          </pre>
          <h3 className="text-lg font-semibold mt-4 mb-2">Server Info</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-sm overflow-auto max-h-60">
            {JSON.stringify(serverInfo, null, 2) || 'No server info available'}
          </pre>
        </div>
        
        {/* Data Display */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Latest Driver Update</h2>
          {driverUpdate ? (
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded">
              <div><strong>Driver:</strong> {driverUpdate.name}</div>
              <div><strong>Team:</strong> {driverUpdate.team}</div>
              <div><strong>Position:</strong> {driverUpdate.position}</div>
              <div><strong>Last Lap:</strong> {driverUpdate.lastLapTime.toFixed(3)}s</div>
              <div><strong>Gap to Leader:</strong> {driverUpdate.gapToLeader}</div>
              <div><strong>Pit Stops:</strong> {driverUpdate.pitStops}</div>
              <div><strong>Timestamp:</strong> {new Date(driverUpdate.timestamp).toLocaleTimeString()}</div>
            </div>
          ) : (
            <div className="text-gray-500">No driver update received yet</div>
          )}
          
          <h2 className="text-xl font-semibold mt-4 mb-2">Latest Chart Data</h2>
          {chartData ? (
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded">
              <div><strong>Timestamp:</strong> {new Date(chartData.timestamp).toLocaleTimeString()}</div>
              <div><strong>Total Races:</strong> {chartData.totalRaces}</div>
              <div><strong>Total Wins:</strong> {chartData.totalWins}</div>
              <div>
                <strong>Team Wins:</strong>
                <ul className="ml-4 list-disc">
                  {Object.entries(chartData.teamWins).map(([team, wins]) => (
                    <li key={team}>{team}: {wins}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">No chart data received yet</div>
          )}
        </div>
        
        {/* Event Logs */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Event Logs</h2>
          <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded h-80 overflow-auto">
            {logs.length > 0 ? (
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded ${
                      log.type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                      log.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                      'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    <span className="text-xs font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="ml-2">{log.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No events logged yet</div>
            )}
          </div>
          <div className="mt-2">
            <button
              onClick={() => setLogs([])}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 