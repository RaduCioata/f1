// Driver Service - Interface with the backend API

import { Driver } from '../context/DriverContext';

const API_BASE_URL = '/api/drivers';

// Common headers to prevent caching
const CACHE_HEADERS = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// Helper function to add cache-busting parameter
const addCacheBuster = (params: URLSearchParams) => {
  params.append('_t', Date.now().toString());
  return params;
};

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
    
    // Build the URL with query parameters
    const url = `/api/drivers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    // Make the request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch drivers: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
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