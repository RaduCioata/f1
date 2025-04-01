"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as driverService from "../services/driverService";

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
  addDriver: (driver: Omit<Driver, "id">) => Promise<void>;
  updateDriver: (id: string, driver: Omit<Driver, "id">) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  getDriver: (id: string) => Driver | undefined;
  fetchDrivers: (filters?: any, sort?: any) => Promise<void>;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export function DriverProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load drivers from API on initial render
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async (
    filters?: {
      team?: string;
      name?: string;
      minWins?: number;
    },
    sort?: {
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ) => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverService.fetchDrivers(filters, sort);
      setDrivers(data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("Failed to fetch drivers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addDriver = async (driver: Omit<Driver, "id">) => {
    try {
      setLoading(true);
      setError(null);
      const newDriver = await driverService.addDriver(driver);
      setDrivers((prevDrivers) => [...prevDrivers, newDriver]);
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
      const driver = await driverService.updateDriver(id, updatedDriver);
      setDrivers((prevDrivers) =>
        prevDrivers.map((d) => (d.id === id ? driver : d))
      );
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
      await driverService.deleteDriver(id);
      setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id !== id));
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

  return (
    <DriverContext.Provider
      value={{ 
        drivers, 
        loading, 
        error, 
        addDriver, 
        updateDriver, 
        deleteDriver, 
        getDriver, 
        fetchDrivers 
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