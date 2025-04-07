"use client";

import Link from "next/link";
import { useDrivers } from "../context/DriverContext";
import { useState, useEffect, useRef, useCallback } from "react";
import { Driver } from "../context/DriverContext";
import PopulateButton from "./PopulateButton";
import EndlessDriverList from "./EndlessDriverList";

export default function DriverList() {
  const { drivers, loading, error, fetchDrivers, deleteDriver } = useDrivers();
  const [showStats, setShowStats] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);
  const [initialDrivers, setInitialDrivers] = useState<Driver[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Use a ref to track initialization to prevent duplicate fetches
  const isInitializedRef = useRef(false);

  // Load initial batch of drivers on component mount - only once
  useEffect(() => {
    // Only load on first render
    if (isInitializedRef.current) {
      return;
    }
    
    async function loadInitialDrivers() {
      try {
        console.log('Starting initial driver load');
        setIsInitialLoading(true);
        
        // Start with first 10 drivers
        const initialDrivers = await fetchDrivers(
          { skip: 0, limit: 10 },
          { sortBy: 'name', sortOrder: 'asc' }
        );
        
        console.log(`Loaded ${initialDrivers.length} initial drivers`);
        
        // Only update if we actually got drivers
        if (initialDrivers && initialDrivers.length > 0) {
          setInitialDrivers(initialDrivers);
          isInitializedRef.current = true;
        }
      } catch (error) {
        console.error('Error loading initial drivers:', error);
      } finally {
        setIsInitialLoading(false);
      }
    }

    void loadInitialDrivers();
  }, [fetchDrivers]);

  const handleEditDriver = useCallback((driver: Driver) => {
    // Navigate to edit page for this driver
    window.location.href = `/edit-driver/${driver.id}`;
  }, []);

  const handleDeleteDriver = useCallback(async (driver: Driver) => {
    if (window.confirm(`Are you sure you want to delete ${driver.name}?`)) {
      try {
        await deleteDriver(driver.id);
        
        // After deletion, refresh the initial list
        const refreshedDrivers = await fetchDrivers(
          { skip: 0, limit: 10 },
          { sortBy: 'name', sortOrder: 'asc' }
        );
        
        setInitialDrivers(refreshedDrivers);
      } catch (error) {
        console.error("Error deleting driver:", error);
      }
    }
  }, [deleteDriver, fetchDrivers]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600 p-4">
      <div className="w-full max-w-5xl rounded-xl bg-white p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">F1 Drivers</h1>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Back to Home
            </Link>
            <button
              onClick={() => setShowStats(!showStats)}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {showStats ? "Hide Stats" : "Show Stats"}
            </button>
            <Link
              href="/add-driver"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add Driver
            </Link>
          </div>
        </div>

        {/* Testing/Demo tools */}
        <div className="mb-6">
          <PopulateButton />
          <p className="text-sm text-gray-500 mt-2">
            Click the button above to populate the database with test drivers.
          </p>
        </div>

        {/* Loading state for initial load */}
        {isInitialLoading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 my-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : initialDrivers.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 my-4">
            <p className="text-yellow-700">No drivers found. Please add some drivers using the "Add Driver" button.</p>
          </div>
        ) : (
          <EndlessDriverList
            initialDrivers={initialDrivers}
            onEdit={handleEditDriver}
            onDelete={handleDeleteDriver}
            showStats={showStats}
          />
        )}
      </div>
    </main>
  );
} 