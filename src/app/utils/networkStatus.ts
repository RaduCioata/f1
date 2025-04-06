import { create } from 'zustand';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Define the store interface
interface NetworkStatusStore {
  isOnline: boolean;
  isServerAvailable: boolean;
  setOnlineStatus: (status: boolean) => void;
  setServerStatus: (status: boolean) => void;
  checkServerAvailability: () => Promise<void>;
}

// Create the store
export const useNetworkStatus = create<NetworkStatusStore>((set) => ({
  isOnline: isBrowser ? navigator.onLine : true, // Default to true on server
  isServerAvailable: true,
  setOnlineStatus: (status: boolean) => set({ isOnline: status }),
  setServerStatus: (status: boolean) => set({ isServerAvailable: status }),
  checkServerAvailability: async () => {
    if (!isBrowser) return; // Don't run on server
    
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      set({ isServerAvailable: response.ok });
    } catch (error) {
      set({ isServerAvailable: false });
    }
  }
}));

// Initialize network status listeners
export const initNetworkStatusListeners = () => {
  if (!isBrowser) return; // Don't run on server
  
  // Attach event listeners for online/offline status
  window.addEventListener('online', () => {
    useNetworkStatus.getState().setOnlineStatus(true);
    useNetworkStatus.getState().checkServerAvailability();
  });
  
  window.addEventListener('offline', () => {
    useNetworkStatus.getState().setOnlineStatus(false);
    useNetworkStatus.getState().setServerStatus(false);
  });
  
  // Check server availability periodically
  const checkServer = () => {
    if (isBrowser && navigator.onLine) {
      useNetworkStatus.getState().checkServerAvailability();
    }
  };
  
  // Check immediately and then every 30 seconds when online
  checkServer();
  setInterval(checkServer, 30000);
}; 