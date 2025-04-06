'use client';

import { useEffect, useState } from 'react';
import { Driver, useDrivers } from '../context/DriverContext';

interface EndlessDriverListProps {
  initialDrivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (driver: Driver) => void;
  showStats: boolean;
}

export default function EndlessDriverList({ 
  initialDrivers,
  onEdit,
  onDelete,
  showStats
}: EndlessDriverListProps) {
  const { fetchDrivers, loading, error, isOffline } = useDrivers();
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState<keyof Driver>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [mounted, setMounted] = useState(false);
  
  const ITEMS_PER_PAGE = 10;

  // Mark component as mounted after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update drivers when initialDrivers changes
  useEffect(() => {
    if (!isLoading) {
      setDrivers(initialDrivers);
      setPage(1);
    }
  }, [initialDrivers, isLoading]);

  // Load more drivers when clicking the "Load More" button
  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    
    try {
      setIsLoading(true);
      
      const nextPage = page + 1;
      const skipCount = (nextPage - 1) * ITEMS_PER_PAGE;
      
      console.log(`Loading more drivers: page=${nextPage}, skip=${skipCount}, limit=${ITEMS_PER_PAGE}`);
      
      const response = await fetchDrivers(
        { skip: skipCount, limit: ITEMS_PER_PAGE },
        { sortBy: sortField, sortOrder: sortOrder }
      );
      
      if (Array.isArray(response) && response.length > 0) {
        // Check for duplicates
        const existingIds = new Set(drivers.map(d => d.id));
        const newDrivers = response.filter(d => !existingIds.has(d.id));
        
        if (newDrivers.length === 0) {
          console.log('No new drivers to add');
          setHasMore(false);
        } else {
          console.log(`Adding ${newDrivers.length} new drivers`);
          setDrivers(prev => [...prev, ...newDrivers]);
          setPage(nextPage);
        }
      } else {
        console.log('No more drivers available');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sorting
  const handleSort = async (field: keyof Driver) => {
    if (isLoading) return;
    
    // Determine new sort order
    let newOrder: 'asc' | 'desc';
    if (field === sortField) {
      newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      setSortOrder(newOrder);
    } else {
      newOrder = 'asc';
      setSortField(field);
      setSortOrder(newOrder);
    }
    
    try {
      setIsLoading(true);
      
      // Reset pagination
      setPage(1);
      setHasMore(true);
      
      // Fetch sorted data
      await fetchDrivers(
        { skip: 0, limit: ITEMS_PER_PAGE },
        { sortBy: field, sortOrder: newOrder }
      );
    } catch (error) {
      console.error('Error sorting drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render sort indicator
  const renderSortIndicator = (field: keyof Driver) => {
    if (sortField !== field) return null;
    
    return (
      <span className="ml-1">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Offline mode indicator - only shown after client-side hydration */}
      {mounted && isOffline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <p className="text-yellow-700">
            You are currently in offline mode. Some features may be limited.
          </p>
        </div>
      )}
      
      {/* Drivers table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th 
                className="p-2 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('name')}
              >
                Driver {renderSortIndicator('name')}
              </th>
              <th 
                className="p-2 text-left cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('team')}
              >
                Team {renderSortIndicator('team')}
              </th>
              {showStats && (
                <>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('firstSeason')}
                  >
                    First Season {renderSortIndicator('firstSeason')}
                  </th>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('races')}
                  >
                    Races {renderSortIndicator('races')}
                  </th>
                  <th 
                    className="p-2 text-left cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort('wins')}
                  >
                    Wins {renderSortIndicator('wins')}
                  </th>
                </>
              )}
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, index) => (
              <tr 
                key={`${driver.id}-${index}`} 
                className="border-t hover:bg-gray-50"
                data-testid={`driver-row-${driver.id}-${index}`}
              >
                <td className="p-2">{driver.name}</td>
                <td className="p-2">{driver.team}</td>
                {showStats && (
                  <>
                    <td className="p-2">{driver.firstSeason}</td>
                    <td className="p-2">{driver.races}</td>
                    <td className="p-2">{driver.wins}</td>
                  </>
                )}
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => onEdit(driver)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(driver)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Manual pagination controls */}
      <div className="flex justify-center items-center p-4 mt-4">
        {isLoading || loading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        ) : hasMore ? (
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load More
          </button>
        ) : (
          <p className="text-gray-500">No more drivers to load</p>
        )}
      </div>
      
      {/* Error indicator - only shown after client-side hydration */}
      {mounted && error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 mt-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
} 