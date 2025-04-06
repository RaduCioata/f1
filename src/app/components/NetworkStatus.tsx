'use client';

import { useNetworkStatus } from '../utils/networkStatus';
import { useDrivers } from '../context/DriverContext';
import { useState, useEffect } from 'react';

export default function NetworkStatus() {
  const { isOnline, isServerAvailable } = useNetworkStatus();
  const { hasPendingChanges, pendingChangesCount, syncChanges } = useDrivers();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  // Only render after component has mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSync = async () => {
    if (!isOnline || !isServerAvailable || !hasPendingChanges) return;
    
    setIsSyncing(true);
    setSyncResult(null);
    
    try {
      const result = await syncChanges();
      setSyncResult(result);
      
      // Clear result after 5 seconds
      setTimeout(() => {
        setSyncResult(null);
      }, 5000);
    } finally {
      setIsSyncing(false);
    }
  };

  // Don't render anything until client-side
  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Network status indicator */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-lg mb-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        <div className="w-px h-5 bg-gray-300 mx-2"></div>
        
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isServerAvailable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="text-sm font-medium">
            {isServerAvailable ? 'Server Available' : 'Server Down'}
          </span>
        </div>
      </div>
      
      {/* Sync button (only shown when there are pending changes) */}
      {hasPendingChanges && (
        <div className="bg-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium mr-3">
              {pendingChangesCount} pending {pendingChangesCount === 1 ? 'change' : 'changes'}
            </span>
            
            <button
              onClick={handleSync}
              disabled={!isOnline || !isServerAvailable || isSyncing}
              className={`px-3 py-1 rounded text-sm font-medium ${
                !isOnline || !isServerAvailable || isSyncing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
          
          {/* Sync result message */}
          {syncResult && (
            <div className={`mt-2 p-2 rounded text-sm ${
              syncResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {syncResult.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 