'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
  
  // Keep track of initial drivers to prevent infinite updates
  const initialDriversRef = useRef<string>('');
  
  // Refs for endless scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef<boolean>(false);
  const totalLoadedRef = useRef<number>(initialDrivers.length);
  
  const ITEMS_PER_PAGE = 10;

  // Mark component as mounted after hydration
  useEffect(() => {
    setMounted(true);
    
    // Store initial drivers JSON to compare for changes
    initialDriversRef.current = JSON.stringify(initialDrivers);
  }, []);

  // Update drivers ONLY when initialDrivers actually changes
  useEffect(() => {
    // Skip if loading or if initialDrivers is empty
    if (!initialDrivers.length || isLoadingRef.current) {
      return;
    }
    
    // Check if initialDrivers actually changed by comparing JSON
    const newDriversJSON = JSON.stringify(initialDrivers);
    if (newDriversJSON !== initialDriversRef.current) {
      console.log('Initial drivers changed, updating state');
      setDrivers(initialDrivers);
      totalLoadedRef.current = initialDrivers.length;
      setPage(1);
      // Update our reference
      initialDriversRef.current = newDriversJSON;
    }
  }, [initialDrivers]);
  
  // Set up IntersectionObserver for endless scrolling
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Clean up any existing observer
    if (observer.current) {
      observer.current.disconnect();
    }
    
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      if (entries.length === 0) return;
      
      const target = entries[0];
      if (target && target.isIntersecting && hasMore && !isLoadingRef.current) {
        console.log('Loading element is visible - loading more drivers');
        void loadMore();
      }
    };
    
    // Create new observer with a larger rootMargin to trigger earlier
    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '150px',
      threshold: 0.1
    });
    
    // Observe the loading div if it exists
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }
    
    // Clean up observer on unmount
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore]);

  // Load more drivers function
  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) {
      console.log('Skipping loadMore: already loading or no more data');
      return;
    }
    
    try {
      console.log('Starting to load more drivers');
      isLoadingRef.current = true;
      setIsLoading(true);
      
      const nextPage = page + 1;
      const skipCount = (nextPage - 1) * ITEMS_PER_PAGE;
      
      console.log(`Loading more drivers: page=${nextPage}, skip=${skipCount}, limit=${ITEMS_PER_PAGE}`);
      
      const newDrivers = await fetchDrivers(
        { skip: skipCount, limit: ITEMS_PER_PAGE },
        { sortBy: sortField, sortOrder: sortOrder }
      );
      
      // Get hasMore from sessionStorage (set by driverService)
      const hasMoreStored = sessionStorage.getItem('driversHasMore');
      if (hasMoreStored !== null) {
        console.log(`Setting hasMore from sessionStorage: ${hasMoreStored}`);
        setHasMore(hasMoreStored === 'true');
      } else if (newDrivers.length < ITEMS_PER_PAGE) {
        console.log('Setting hasMore to false based on returned data length');
        setHasMore(false);
      }
      
      if (Array.isArray(newDrivers) && newDrivers.length > 0) {
        // Check for duplicates
        const existingIds = new Set(drivers.map(d => d.id));
        const uniqueNewDrivers = newDrivers.filter(d => !existingIds.has(d.id));
        
        if (uniqueNewDrivers.length === 0) {
          console.log('No new drivers to add');
          setHasMore(false);
        } else {
          console.log(`Adding ${uniqueNewDrivers.length} new drivers`);
          setDrivers(prev => [...prev, ...uniqueNewDrivers]);
          totalLoadedRef.current += uniqueNewDrivers.length;
          setPage(nextPage);
        }
      } else {
        console.log('No more drivers available');
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more drivers:', error);
      setHasMore(false); // Prevent further loading attempts on error
    } finally {
      console.log('Finished loading drivers');
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [fetchDrivers, page, sortField, sortOrder, drivers, hasMore]);

  // Handle sorting
  const handleSort = async (field: keyof Driver) => {
    if (isLoading || isLoadingRef.current) return;
    
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
      isLoadingRef.current = true;
      setIsLoading(true);
      
      // Reset pagination
      setPage(1);
      setHasMore(true);
      totalLoadedRef.current = 0;
      
      // Fetch sorted data
      const sortedDrivers = await fetchDrivers(
        { skip: 0, limit: ITEMS_PER_PAGE },
        { sortBy: field, sortOrder: newOrder }
      );
      
      // Get hasMore from sessionStorage (set by driverService)
      const hasMoreStored = sessionStorage.getItem('driversHasMore');
      if (hasMoreStored !== null) {
        setHasMore(hasMoreStored === 'true');
      } else if (sortedDrivers.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
      
      if (Array.isArray(sortedDrivers)) {
        setDrivers(sortedDrivers);
        totalLoadedRef.current = sortedDrivers.length;
      }
    } catch (error) {
      console.error('Error sorting drivers:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
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
      
      {/* Loading indicator and observer target */}
      <div className="flex justify-center items-center p-4 mt-4">
        {(isLoading || loading || isLoadingRef.current) ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        ) : hasMore ? (
          <div ref={loadingRef} className="h-10">
            <p className="text-gray-500">Scroll to load more</p>
          </div>
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