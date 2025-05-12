"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import PopulateButton from "./PopulateButton";

export default function DriverList() {
  const [drivers, setDrivers] = useState<Array<{
    id: number;
    firstName: string;
    lastName: string;
    nationality: string;
    dateOfBirth: string;
    driverNumber: number;
    team: { id: number; name: string };
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDrivers() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:4000/drivers");
        if (!res.ok) throw new Error("Failed to fetch drivers");
        const data = await res.json();
        setDrivers(data);
      } catch (err) {
        setError("Failed to load drivers");
      } finally {
        setLoading(false);
      }
    }
    fetchDrivers();
  }, []);

  const handleEdit = (id: number) => {
    window.location.href = `/edit-driver/${id}`;
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:4000/drivers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete driver');
      // Refresh the list
      const refreshed = await fetch("http://localhost:4000/drivers");
      setDrivers(await refreshed.json());
    } catch (err) {
      setError('Failed to delete driver');
    } finally {
      setLoading(false);
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
            <Link
              href="/add-driver"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add Driver
            </Link>
          </div>
        </div>
        <div className="mb-6">
          <PopulateButton />
          <p className="text-sm text-gray-500 mt-2">
            Click the button above to populate the database with test drivers.
          </p>
        </div>
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 my-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : drivers.length === 0 ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 my-4">
            <p className="text-yellow-700">No drivers found. Please add some drivers using the "Add Driver" button.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">First Name</th>
                  <th className="p-2 text-left">Last Name</th>
                  <th className="p-2 text-left">Team</th>
                  <th className="p-2 text-left">Nationality</th>
                  <th className="p-2 text-left">Date of Birth</th>
                  <th className="p-2 text-left">Driver Number</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, index) => (
                  <tr key={`${driver.id}-${index}`} className="border-t hover:bg-gray-50">
                    <td className="p-2">{driver.firstName}</td>
                    <td className="p-2">{driver.lastName}</td>
                    <td className="p-2">{driver.team?.name}</td>
                    <td className="p-2">{driver.nationality}</td>
                    <td className="p-2">{new Date(driver.dateOfBirth).toLocaleDateString()}</td>
                    <td className="p-2">{driver.driverNumber}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(driver.id)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id)}
                        className="text-red-600 hover:text-red-800 underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
} 