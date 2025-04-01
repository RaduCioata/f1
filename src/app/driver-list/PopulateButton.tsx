'use client';

import { useState } from 'react';
import { useDrivers } from '../context/DriverContext';

export default function PopulateButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { fetchDrivers } = useDrivers();

  const handlePopulate = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setResult(null);
      
      // Confirm with the user
      const confirmed = window.confirm(
        'This will replace all existing drivers with the 2025 F1 grid. Continue?'
      );
      
      if (!confirmed) {
        setLoading(false);
        return;
      }
      
      // Call our API route
      const response = await fetch('/api/populateDrivers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          // Population already in progress
          setResult({
            success: false,
            message: data.message || "Population already in progress. Please wait a moment and refresh the page."
          });
        } else {
          throw new Error(`Failed to populate drivers: ${response.status} - ${data.message || "Unknown error"}`);
        }
      } else {
        setResult(data);
        
        // Wait a moment to ensure backend processing is complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Force a window refresh to ensure everything is updated
        if (data.success) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error populating drivers:', error);
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <button
        onClick={handlePopulate}
        disabled={loading}
        className={`px-4 py-2 rounded ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {loading ? 'Adding Drivers...' : 'Populate with 2025 F1 Grid'}
      </button>
      
      {result && (
        <div className={`mt-2 p-2 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
} 