// Driver Service - Interface with the backend API

import { Driver } from '../context/DriverContext';

const API_BASE_URL = '/api/drivers';

// Common headers to prevent caching
const CACHE_HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// Debounce mechanism to prevent multiple identical calls at once
const pendingRequests = new Map<string, Promise<any>>();

// Helper function to add cache-busting parameter
const addCacheBuster = (params: URLSearchParams) => {
  params.append('_t', Date.now().toString());
  return params;
};

// Response structure for paginated drivers
export interface DriversResponse {
  drivers: Driver[];
  total: number;
  hasMore: boolean;
}

// Fetch drivers with optional filtering and sorting
export async function fetchDrivers(
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
): Promise<Driver[]> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Add filtering parameters if provided
    if (filters) {
      if (filters.team) queryParams.append('team', filters.team);
      if (filters.name) queryParams.append('name', filters.name);
      if (filters.minWins !== undefined) queryParams.append('minWins', filters.minWins.toString());
      if (filters.skip !== undefined) queryParams.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) queryParams.append('limit', filters.limit.toString());
    }
    
    // Add sorting parameters if provided
    if (sort) {
      if (sort.sortBy) queryParams.append('sortBy', sort.sortBy.toString());
      if (sort.sortOrder) queryParams.append('sortOrder', sort.sortOrder);
    }
    
    // Build the URL with query parameters (excluding cache buster to create request key)
    const baseUrl = `${API_BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    // Create a request key for deduplication
    const requestKey = baseUrl;
    
    // Check if this exact request is already in progress
    if (pendingRequests.has(requestKey)) {
      console.log('Reusing existing request for:', requestKey);
      return await pendingRequests.get(requestKey)!;
    }
    
    // Add cache buster to actual URL
    addCacheBuster(queryParams);
    const url = `${API_BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log('Fetching drivers from URL:', url);
    
    // Create the request promise
    const requestPromise = (async () => {
      try {
        // Make the request
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...CACHE_HEADERS
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch drivers: ${response.status} ${response.statusText}`);
        }
        
        const data: DriversResponse = await response.json();
        
        console.log('Received data:', {
          drivers: data.drivers?.length || 0,
          total: data.total,
          hasMore: data.hasMore
        });
        
        // Store hasMore in sessionStorage for the EndlessDriverList component to use
        if (data.hasMore !== undefined) {
          sessionStorage.setItem('driversHasMore', data.hasMore.toString());
        }
        
        // Store total in sessionStorage for pagination purposes
        if (data.total !== undefined) {
          sessionStorage.setItem('driversTotalCount', data.total.toString());
        }
        
        // Return just the drivers array to maintain backward compatibility
        return data.drivers || [];
      } finally {
        // Clean up the pending request regardless of success/failure
        setTimeout(() => {
          pendingRequests.delete(requestKey);
        }, 100);
      }
    })();
    
    // Store the promise for potential reuse
    pendingRequests.set(requestKey, requestPromise);
    
    return await requestPromise;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
}

// Get a single driver by ID
export async function getDriver(id: string): Promise<Driver> {
  try {
    const params = addCacheBuster(new URLSearchParams());
    const response = await fetch(`${API_BASE_URL}/${id}?${params.toString()}`, {
      headers: CACHE_HEADERS,
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching driver: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching driver ${id}:`, error);
    throw error;
  }
}

// Add a new driver
export async function addDriver(driver: Omit<Driver, "id">): Promise<Driver> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...CACHE_HEADERS
      },
      body: JSON.stringify(driver),
    });
    
    if (!response.ok) {
      throw new Error(`Error adding driver: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding driver:', error);
    throw error;
  }
}

// Update an existing driver
export async function updateDriver(id: string, driver: Omit<Driver, "id">): Promise<Driver> {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...CACHE_HEADERS
      },
      body: JSON.stringify({
        id,
        ...driver,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating driver: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating driver ${id}:`, error);
    throw error;
  }
}

// Delete a driver
export async function deleteDriver(id: string): Promise<void> {
  try {
    const params = addCacheBuster(new URLSearchParams());
    params.append('id', id);
    
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      method: 'DELETE',
      headers: CACHE_HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting driver: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting driver ${id}:`, error);
    throw error;
  }
} 