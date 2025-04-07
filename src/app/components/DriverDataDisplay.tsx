'use client';

import { useState, useEffect } from 'react';
import { useSocket, DriverUpdate } from '../hooks/useSocket';

export default function DriverDataDisplay() {
  const { isConnected, driverUpdate, connectionError } = useSocket();
  const [recentUpdates, setRecentUpdates] = useState<DriverUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Update recent updates when new driver data arrives
  useEffect(() => {
    try {
      if (driverUpdate) {
        console.log('Received driver update in display component:', driverUpdate);
        setRecentUpdates(prev => {
          // Add to beginning, maintain up to 5 recent updates
          const newUpdates = [driverUpdate, ...prev];
          return newUpdates.slice(0, 5);
        });
        // Clear any previous errors when we get successful data
        setError(null);
      }
    } catch (err) {
      console.error('Error processing driver update:', err);
      setError('Failed to process driver update data');
    }
  }, [driverUpdate]);
  
  return (
    <div className="w-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Driver Updates</h2>
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      {connectionError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          Connection Error: {connectionError}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
          {error}
        </div>
      )}
      
      {recentUpdates.length > 0 ? (
        <div className="space-y-3">
          {recentUpdates.map((update, index) => (
            <div 
              key={`${update.driverId}-${index}`}
              className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border-l-4 border-blue-500"
            >
              <div className="flex justify-between">
                <h3 className="font-bold">{update.name || `Driver #${update.driverId}`}</h3>
                <span className="text-xs text-gray-500">
                  {new Date(update.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div><span className="font-medium">Team:</span> {update.team || 'N/A'}</div>
                <div><span className="font-medium">Position:</span> {update.position || 'N/A'}</div>
                <div><span className="font-medium">Last Lap:</span> {update.lastLapTime ? `${update.lastLapTime.toFixed(3)}s` : 'N/A'}</div>
                <div><span className="font-medium">Gap:</span> {update.gapToLeader || 'N/A'}</div>
                <div><span className="font-medium">Pit Stops:</span> {update.pitStops !== undefined ? update.pitStops : 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center text-gray-500">
          {isConnected ? 'Waiting for driver updates...' : 'Connect to receive driver updates'}
        </div>
      )}
    </div>
  );
} 