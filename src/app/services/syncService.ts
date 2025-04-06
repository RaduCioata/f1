import * as driverService from './driverService';
import { 
  getPendingOperations, 
  removePendingOperation, 
  saveLocalDrivers,
  getLocalDrivers,
} from './offlineStorage';
import { Driver } from '../context/DriverContext';

/**
 * Synchronizes pending operations with the server
 * @returns {Promise<{success: boolean, synced: number, failed: number, message: string}>}
 */
export const syncWithServer = async (): Promise<{
  success: boolean;
  synced: number;
  failed: number;
  message: string;
}> => {
  const pendingOperations = getPendingOperations();
  
  if (pendingOperations.length === 0) {
    return {
      success: true,
      synced: 0,
      failed: 0,
      message: 'No pending operations to sync'
    };
  }
  
  let synced = 0;
  let failed = 0;
  
  // Process operations in the order they were created
  const sortedOperations = [...pendingOperations].sort((a, b) => a.timestamp - b.timestamp);
  
  for (const operation of sortedOperations) {
    try {
      switch (operation.type) {
        case 'ADD':
          if (operation.data) {
            await driverService.addDriver(operation.data);
            synced++;
            removePendingOperation(operation.id);
          }
          break;
          
        case 'UPDATE':
          if (operation.driverId && operation.data) {
            // Skip updates for local IDs that haven't been synced yet
            if (operation.driverId.startsWith('local-')) {
              failed++;
              continue;
            }
            
            await driverService.updateDriver(operation.driverId, operation.data);
            synced++;
            removePendingOperation(operation.id);
          }
          break;
          
        case 'DELETE':
          if (operation.driverId) {
            // Skip deletes for local IDs that haven't been synced yet
            if (operation.driverId.startsWith('local-')) {
              failed++;
              continue;
            }
            
            await driverService.deleteDriver(operation.driverId);
            synced++;
            removePendingOperation(operation.id);
          }
          break;
      }
    } catch (error) {
      console.error(`Error syncing operation ${operation.id}:`, error);
      failed++;
    }
  }
  
  // After syncing, update the local storage with the latest data from the server
  try {
    const latestDrivers = await driverService.fetchDrivers();
    saveLocalDrivers(latestDrivers);
  } catch (error) {
    console.error('Error fetching latest drivers after sync:', error);
  }
  
  return {
    success: failed === 0,
    synced,
    failed,
    message: failed === 0
      ? `Successfully synced ${synced} operations`
      : `Synced ${synced} operations, ${failed} operations failed`
  };
};

/**
 * Checks if there are local operations that need to be synced
 * @returns {boolean}
 */
export const hasPendingOperations = (): boolean => {
  return getPendingOperations().length > 0;
};

/**
 * Gets the count of pending operations
 * @returns {number}
 */
export const getPendingOperationsCount = (): number => {
  return getPendingOperations().length;
};

/**
 * Checks for locally modified drivers and updates the local storage
 * @param {Driver[]} serverDrivers - Drivers from the server
 * @returns {Driver[]} - Updated driver list with both server and pending local changes
 */
export const mergeWithLocalChanges = (serverDrivers: Driver[]): Driver[] => {
  const pendingOperations = getPendingOperations();
  const localDrivers = getLocalDrivers();
  
  // If no pending operations, just use server drivers
  if (pendingOperations.length === 0) {
    saveLocalDrivers(serverDrivers);
    return serverDrivers;
  }
  
  // Start with server drivers
  let mergedDrivers = [...serverDrivers];
  
  // Add local-only drivers
  const localOnlyDrivers = localDrivers.filter(d => d.id.startsWith('local-'));
  mergedDrivers = [...mergedDrivers, ...localOnlyDrivers];
  
  // Apply pending updates and deletes to the merged list
  pendingOperations.forEach(op => {
    if (op.type === 'UPDATE' && op.driverId && !op.driverId.startsWith('local-')) {
      const driverIndex = mergedDrivers.findIndex(d => d.id === op.driverId);
      if (driverIndex !== -1 && op.data) {
        const driverToUpdate = mergedDrivers[driverIndex];
        if (driverToUpdate) {
          mergedDrivers[driverIndex] = {
            ...driverToUpdate,
            ...op.data,
            id: driverToUpdate.id // Ensure id is preserved
          };
        }
      }
    } else if (op.type === 'DELETE' && op.driverId && !op.driverId.startsWith('local-')) {
      mergedDrivers = mergedDrivers.filter(d => d.id !== op.driverId);
    }
  });
  
  return mergedDrivers;
}; 