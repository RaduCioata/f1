import { Driver } from '../context/DriverContext';

// Keys for storage
const DRIVERS_STORAGE_KEY = 'f1_drivers';
const PENDING_OPERATIONS_KEY = 'f1_pending_ops';

// Types for pending operations
type OperationType = 'ADD' | 'UPDATE' | 'DELETE';

export interface PendingOperation {
  id: string;
  type: OperationType;
  timestamp: number;
  data?: Omit<Driver, 'id'>;
  driverId?: string;
}

// Get drivers from local storage
export const getLocalDrivers = (): Driver[] => {
  try {
    const driversJson = localStorage.getItem(DRIVERS_STORAGE_KEY);
    return driversJson ? JSON.parse(driversJson) : [];
  } catch (error) {
    console.error('Error retrieving drivers from local storage:', error);
    return [];
  }
};

// Save drivers to local storage
export const saveLocalDrivers = (drivers: Driver[]): void => {
  try {
    localStorage.setItem(DRIVERS_STORAGE_KEY, JSON.stringify(drivers));
  } catch (error) {
    console.error('Error saving drivers to local storage:', error);
  }
};

// Get pending operations
export const getPendingOperations = (): PendingOperation[] => {
  try {
    const opsJson = localStorage.getItem(PENDING_OPERATIONS_KEY);
    return opsJson ? JSON.parse(opsJson) : [];
  } catch (error) {
    console.error('Error retrieving pending operations from local storage:', error);
    return [];
  }
};

// Save pending operations
export const savePendingOperations = (operations: PendingOperation[]): void => {
  try {
    localStorage.setItem(PENDING_OPERATIONS_KEY, JSON.stringify(operations));
  } catch (error) {
    console.error('Error saving pending operations to local storage:', error);
  }
};

// Add a pending operation
export const addPendingOperation = (operation: Omit<PendingOperation, 'id' | 'timestamp'>): void => {
  const operations = getPendingOperations();
  
  const newOperation: PendingOperation = {
    ...operation,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };
  
  operations.push(newOperation);
  savePendingOperations(operations);
};

// Remove a pending operation
export const removePendingOperation = (operationId: string): void => {
  const operations = getPendingOperations();
  const updatedOperations = operations.filter(op => op.id !== operationId);
  savePendingOperations(updatedOperations);
};

// Add a driver in offline mode
export const addLocalDriver = (driver: Omit<Driver, 'id'>): Driver => {
  const drivers = getLocalDrivers();
  
  // Generate a temporary local ID
  const newId = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newDriver: Driver = {
    ...driver,
    id: newId
  };
  
  drivers.push(newDriver);
  saveLocalDrivers(drivers);
  
  // Add pending operation
  addPendingOperation({
    type: 'ADD',
    data: driver
  });
  
  return newDriver;
};

// Update a driver in offline mode
export const updateLocalDriver = (id: string, driverData: Omit<Driver, 'id'>): Driver | null => {
  const drivers = getLocalDrivers();
  const driverIndex = drivers.findIndex(d => d.id === id);
  
  if (driverIndex === -1) return null;
  
  const updatedDriver: Driver = {
    ...drivers[driverIndex],
    ...driverData,
    id // Preserve the original ID
  };
  
  drivers[driverIndex] = updatedDriver;
  saveLocalDrivers(drivers);
  
  // Add pending operation
  addPendingOperation({
    type: 'UPDATE',
    driverId: id,
    data: driverData
  });
  
  return updatedDriver;
};

// Delete a driver in offline mode
export const deleteLocalDriver = (id: string): boolean => {
  const drivers = getLocalDrivers();
  const filteredDrivers = drivers.filter(d => d.id !== id);
  
  if (filteredDrivers.length === drivers.length) {
    return false; // Driver not found
  }
  
  saveLocalDrivers(filteredDrivers);
  
  // Add pending operation
  addPendingOperation({
    type: 'DELETE',
    driverId: id
  });
  
  return true;
};

// Filter and sort drivers locally
export const filterSortLocalDrivers = (
  drivers: Driver[],
  filters?: {
    team?: string;
    name?: string;
    minWins?: number;
  },
  sort?: {
    sortBy?: keyof Driver;
    sortOrder?: 'asc' | 'desc';
  }
): Driver[] => {
  let result = [...drivers];
  
  // Apply filters
  if (filters) {
    if (filters.team) {
      result = result.filter(d => 
        d.team.toLowerCase().includes(filters.team!.toLowerCase())
      );
    }
    
    if (filters.name) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(filters.name!.toLowerCase())
      );
    }
    
    if (filters.minWins !== undefined) {
      result = result.filter(d => d.wins >= filters.minWins!);
    }
  }
  
  // Apply sorting
  if (sort && sort.sortBy) {
    const { sortBy, sortOrder = 'asc' } = sort;
    const direction = sortOrder === 'asc' ? 1 : -1;
    
    result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1 * direction;
      if (a[sortBy] > b[sortBy]) return 1 * direction;
      return 0;
    });
  }
  
  return result;
}; 