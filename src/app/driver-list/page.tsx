"use client";

import Link from "next/link";
import { useDrivers } from "../context/DriverContext";
import { useState, useEffect } from "react";
import { Driver } from "../context/DriverContext";
import PopulateButton from "./PopulateButton";
import EndlessDriverList from "./EndlessDriverList";

export default function DriverList() {
  const { drivers, loading, error, fetchDrivers, deleteDriver } = useDrivers();
  const [showStats, setShowStats] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);

  // Load drivers on component mount
  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleEditDriver = (driver: Driver) => {
    // Navigate to edit page for this driver
    window.location.href = `/edit-driver/${driver.id}`;
  };

  const handleDeleteDriver = async (driver: Driver) => {
    if (window.confirm(`Are you sure you want to delete ${driver.name}?`)) {
      try {
        await deleteDriver(driver.id);
      } catch (error) {
        console.error("Error deleting driver:", error);
      }
    }
  };

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

        {/* Populate Button - Prominently displayed */}
        <div className="mb-6">
          <PopulateButton />
        </div>

        {loading && drivers.length === 0 ? (
          <div className="flex justify-center items-center h-32 mt-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error && drivers.length === 0 ? (
          <div className="bg-red-100 border-left-4 border-red-500 p-4 mt-4">
            <p className="text-red-700">{error}</p>
            <p className="text-red-700 mt-2">Please try refreshing the page.</p>
          </div>
        ) : (
          // Use EndlessDriverList for endless scrolling
          <EndlessDriverList 
            initialDrivers={drivers}
            onEdit={handleEditDriver}
            onDelete={handleDeleteDriver}
            showStats={showStats}
          />
        )}
      </div>
    </main>
  );
} 