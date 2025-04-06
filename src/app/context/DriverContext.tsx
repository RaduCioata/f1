"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as driverService from "../services/driverService";
import { useNetworkStatus } from "../utils/networkStatus";
import * as offlineStorage from "../services/offlineStorage";
import * as syncService from "../services/syncService";

export interface Driver {
  id: string;
  name: string;
  team: string;
  firstSeason: number;
  races: number;
  wins: number;
}

interface DriverContextType {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  hasPendingChanges: boolean;
  pendingChangesCount: number;
  addDriver: (driver: Omit<Driver, "id">) => Promise<void>;
  updateDriver: (id: string, driver: Omit<Driver, "id">) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  getDriver: (id: string) => Driver | undefined;
  fetchDrivers: (
    filters?: {
      team?: string;
      name?: string;
      minWins?: number;
      skip?: number;
      limit?: number;
    },
    sort?: {
      sortBy?: keyof Driver;
      sortOrder?: 'asc' | 'desc';
    }
  ) => Promise<Driver[]>;
  syncChanges: () => Promise<{ success: boolean; message: string }>;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export function DriverProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOnline, isServerAvailable } = useNetworkStatus();
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(false);
  const [pendingChangesCount, setPendingChangesCount] = useState<number>(0);

  // Compute if we're in offline mode
  const isOffline = !isOnline || !isServerAvailable;

  // Initialize by loading from local storage first for quick startup
  useEffect(() => {
    const localDrivers = offlineStorage.getLocalDrivers();
    if (localDrivers.length > 0) {
      setDrivers(localDrivers);
      setLoading(false);
    }

    // Check for pending operations
    updatePendingChangesStatus();
    
    // Load from server if online
    if (!isOffline) {
      fetchDrivers();
    }
  }, [isOffline]);

  // Sync with server when coming back online
  useEffect(() => {
    if (!isOffline && hasPendingChanges) {
      syncChanges();
    }
  }, [isOffline, hasPendingChanges]);

  // Update pending changes status
  const updatePendingChangesStatus = () => {
    const count = syncService.getPendingOperationsCount();
    setHasPendingChanges(count > 0);
    setPendingChangesCount(count);
  };

  const fetchDrivers = async (
    filters?: {
      team?: string;
      name?: string;
      minWins?: number;
      skip?: number;
      limit?: number;
    },
    sort?: {
      sortBy?: keyof Driver;
      sortOrder?: 'asc' | 'desc';
    }
  ) => {
    try {
      setLoading(true);
      setError(null);

      if (isOffline) {
        // In offline mode, use local storage with filtering/sorting
        const localDrivers = offlineStorage.getLocalDrivers();
        const filteredDrivers = offlineStorage.filterSortLocalDrivers(
          localDrivers,
          filters,
          sort
        );
        setDrivers(filteredDrivers);
        return filteredDrivers;
      } else {
        // Online mode - fetch from server
        const serverDrivers = await driverService.fetchDrivers(filters, sort);
        
        // Merge with local changes if there are pending operations
        if (hasPendingChanges) {
          const mergedDrivers = syncService.mergeWithLocalChanges(serverDrivers);
          setDrivers(mergedDrivers);
          return mergedDrivers;
        } else {
          setDrivers(serverDrivers);
          // Update local storage for offline use
          offlineStorage.saveLocalDrivers(serverDrivers);
          return serverDrivers;
        }
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("Failed to fetch drivers. Please try again.");
      
      // Fall back to local storage if server fetch fails
      const localDrivers = offlineStorage.getLocalDrivers();
      if (localDrivers.length > 0) {
        setDrivers(localDrivers);
        return localDrivers;
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (driver: Omit<Driver, "id">) => {
    try {
      setLoading(true);
      setError(null);

      let newDriver: Driver;

      if (isOffline) {
        // In offline mode, add to local storage
        newDriver = offlineStorage.addLocalDriver(driver);
      } else {
        // Online mode - add through API
        newDriver = await driverService.addDriver(driver);
        // Update local storage
        const updatedDrivers = [...drivers, newDriver];
        offlineStorage.saveLocalDrivers(updatedDrivers);
      }

      setDrivers((prevDrivers) => [...prevDrivers, newDriver]);
      updatePendingChangesStatus();
    } catch (err) {
      console.error("Error adding driver:", err);
      setError("Failed to add driver. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDriver = async (id: string, updatedDriver: Omit<Driver, "id">) => {
    try {
      setLoading(true);
      setError(null);

      let driver: Driver | null;

      if (isOffline) {
        // In offline mode, update in local storage
        driver = offlineStorage.updateLocalDriver(id, updatedDriver);
        if (!driver) {
          throw new Error("Driver not found");
        }
      } else {
        // Online mode - update through API
        driver = await driverService.updateDriver(id, updatedDriver);
        // Update local storage
        const updatedDrivers = drivers.map((d) => (d.id === id ? driver! : d));
        offlineStorage.saveLocalDrivers(updatedDrivers);
      }

      setDrivers((prevDrivers) =>
        prevDrivers.map((d) => (d.id === id ? driver! : d))
      );
      updatePendingChangesStatus();
    } catch (err) {
      console.error("Error updating driver:", err);
      setError("Failed to update driver. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDriver = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      if (isOffline) {
        // In offline mode, delete from local storage
        const success = offlineStorage.deleteLocalDriver(id);
        if (!success) {
          throw new Error("Driver not found");
        }
      } else {
        // Online mode - delete through API
        await driverService.deleteDriver(id);
        // Update local storage
        const updatedDrivers = drivers.filter((driver) => driver.id !== id);
        offlineStorage.saveLocalDrivers(updatedDrivers);
      }

      setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id !== id));
      updatePendingChangesStatus();
    } catch (err) {
      console.error("Error deleting driver:", err);
      setError("Failed to delete driver. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDriver = (id: string) => {
    return drivers.find((driver) => driver.id === id);
  };

  const syncChanges = async () => {
    if (isOffline) {
      return {
        success: false,
        message: "Cannot sync while offline. Please check your connection."
      };
    }

    try {
      setLoading(true);
      const result = await syncService.syncWithServer();
      
      // Refresh drivers after sync
      if (result.success) {
        await fetchDrivers();
      }
      
      updatePendingChangesStatus();
      return {
        success: result.success,
        message: result.message
      };
    } catch (error) {
      console.error("Error syncing changes:", error);
      return {
        success: false,
        message: "Failed to sync changes. Please try again."
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <DriverContext.Provider
      value={{ 
        drivers, 
        loading, 
        error, 
        isOffline,
        hasPendingChanges,
        pendingChangesCount,
        addDriver, 
        updateDriver, 
        deleteDriver, 
        getDriver, 
        fetchDrivers,
        syncChanges
      }}
    >
      {children}
    </DriverContext.Provider>
  );
}

export function useDrivers() {
  const context = useContext(DriverContext);
  if (context === undefined) {
    throw new Error("useDrivers must be used within a DriverProvider");
  }
  return context;
} 