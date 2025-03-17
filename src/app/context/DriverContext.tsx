"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  addDriver: (driver: Omit<Driver, "id">) => void;
  updateDriver: (id: string, driver: Omit<Driver, "id">) => void;
  deleteDriver: (id: string) => void;
  getDriver: (id: string) => Driver | undefined;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export function DriverProvider({ children }: { children: ReactNode }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Load drivers from localStorage on initial render
  useEffect(() => {
    const storedDrivers = localStorage.getItem("f1drivers");
    if (storedDrivers) {
      setDrivers(JSON.parse(storedDrivers));
    }
  }, []);

  // Save drivers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("f1drivers", JSON.stringify(drivers));
  }, [drivers]);

  const addDriver = (driver: Omit<Driver, "id">) => {
    const newDriver = {
      ...driver,
      id: Date.now().toString(),
    };
    setDrivers((prevDrivers) => [...prevDrivers, newDriver]);
  };

  const updateDriver = (id: string, updatedDriver: Omit<Driver, "id">) => {
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) =>
        driver.id === id ? { ...updatedDriver, id } : driver
      )
    );
  };

  const deleteDriver = (id: string) => {
    setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id !== id));
  };

  const getDriver = (id: string) => {
    return drivers.find((driver) => driver.id === id);
  };

  return (
    <DriverContext.Provider
      value={{ drivers, addDriver, updateDriver, deleteDriver, getDriver }}
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