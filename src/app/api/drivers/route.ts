import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Driver, drivers as driversData, getNextId } from './_lib/drivers';

// Use a local reference to the imported drivers
let drivers = driversData;

// Driver validation schema
const driverSchema = z.object({
  name: z.string().min(1, { message: "driver name is required" }),
  team: z.string().min(1, { message: "team is required" }),
  races: z.number().int().min(0, { message: "races must be a positive number" }),
  wins: z.number().int().min(0, { message: "wins must be a positive number" }),
  firstSeason: z.number().int().max(new Date().getFullYear(), { 
    message: "first season cannot be in the future" 
  }),
});

// Function to validate that wins don't exceed races
const validateWinsRaces = (data: any) => {
  if (data.wins > data.races) {
    return { success: false, error: "wins cannot exceed races" };
  }
  return { success: true };
};

// GET handler
export async function GET(request: NextRequest) {
  // Get query parameters - Support both URL and NextURL
  const url = request.nextUrl || new URL(request.url);
  const { searchParams } = url;
  
  // Get filter parameters
  const teamFilter = searchParams.get('team');
  const nameFilter = searchParams.get('name');
  const minWins = searchParams.get('minWins');
  
  // Get sort parameters
  const sortBy = searchParams.get('sortBy');
  const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;
  
  // Apply filters
  let filteredDrivers = [...drivers];
  
  if (teamFilter) {
    filteredDrivers = filteredDrivers.filter(driver => 
      driver.team.toLowerCase().includes(teamFilter.toLowerCase())
    );
  }
  
  if (nameFilter) {
    filteredDrivers = filteredDrivers.filter(driver => 
      driver.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }
  
  if (minWins) {
    const minimumWins = parseInt(minWins);
    if (!isNaN(minimumWins)) {
      filteredDrivers = filteredDrivers.filter(driver => driver.wins >= minimumWins);
    }
  }
  
 
  if (sortBy && ['name', 'team', 'races', 'wins', 'firstSeason'].includes(sortBy)) {
    filteredDrivers.sort((a, b) => {
      if (a[sortBy as keyof Driver] < b[sortBy as keyof Driver]) return -1 * sortOrder;
      if (a[sortBy as keyof Driver] > b[sortBy as keyof Driver]) return 1 * sortOrder;
      return 0;
    });
  }
  
  return NextResponse.json(filteredDrivers);
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate with Zod schema
    const result = driverSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() }, 
        { status: 400 }
      );
    }
    
    // Additional validation
    const winsRacesValidation = validateWinsRaces(body);
    if (!winsRacesValidation.success) {
      return NextResponse.json(
        { error: winsRacesValidation.error }, 
        { status: 400 }
      );
    }
    
    // Create new driver
    const newDriver: Driver = {
      id: getNextId(),
      name: body.name,
      team: body.team,
      races: Number(body.races),
      wins: Number(body.wins),
      firstSeason: Number(body.firstSeason),
    };
    
    // Add to our "database" with proper locking
    const driversCopy = [...drivers]; // Create a copy of current drivers
    drivers.push(newDriver); // Add new driver
    
    // Make sure driversData references the same data
    // This avoids duplication issues when testing
    driversData.length = 0; // Clear original array
    for (const driver of drivers) {
      driversData.push({...driver}); // Copy each driver to ensure deep copy
    }
    
    return NextResponse.json(newDriver, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" }, 
      { status: 400 }
    );
  }
}

// PATCH handler
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if id exists
    if (!body.id) {
      return NextResponse.json(
        { error: "Driver ID is required" }, 
        { status: 400 }
      );
    }
    
    // Find the driver
    const driverIndex = drivers.findIndex(d => d.id === body.id);
    if (driverIndex === -1) {
      return NextResponse.json(
        { error: "Driver not found" }, 
        { status: 404 }
      );
    }
    
    // Get the current driver (we already confirmed it exists with the check above)
    const currentDriver = drivers[driverIndex];
    
    // TypeScript safety check
    if (!currentDriver) {
      return NextResponse.json(
        { error: "Driver not found" }, 
        { status: 404 }
      );
    }
    
    // Create a new driver object
    const updatedDriver: Driver = {
      id: currentDriver.id, // Ensure ID doesn't change
      name: body.name !== undefined ? body.name : currentDriver.name,
      team: body.team !== undefined ? body.team : currentDriver.team,
      races: body.races !== undefined ? Number(body.races) : currentDriver.races,
      wins: body.wins !== undefined ? Number(body.wins) : currentDriver.wins,
      firstSeason: body.firstSeason !== undefined ? Number(body.firstSeason) : currentDriver.firstSeason,
    };
    
    // Validate with Zod schema (partial)
    const partialSchema = driverSchema.partial();
    const result = partialSchema.safeParse(updatedDriver);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.format() }, 
        { status: 400 }
      );
    }
    
    // Additional validation
    const winsRacesValidation = validateWinsRaces(updatedDriver);
    if (!winsRacesValidation.success) {
      return NextResponse.json(
        { error: winsRacesValidation.error }, 
        { status: 400 }
      );
    }
    
    // Update driver in our "database"
    drivers[driverIndex] = updatedDriver;
    
    // Update the original array to keep it in sync
    // Clear out the original array and replace it with our current drivers array
    driversData.length = 0;
    drivers.forEach(driver => driversData.push(driver));
    
    return NextResponse.json(updatedDriver);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" }, 
      { status: 400 }
    );
  }
}

// DELETE handler
export async function DELETE(request: NextRequest) {
  // Get query parameters - Support both URL and NextURL
  const url = request.nextUrl || new URL(request.url);
  const { searchParams } = url;
  
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: "Driver ID is required" }, 
      { status: 400 }
    );
  }
  
  const initialLength = drivers.length;
  drivers = drivers.filter(driver => driver.id !== id);
  
  // Update the original array to keep it in sync
  // Clear out the original array and replace it with our current drivers array
  driversData.length = 0;
  drivers.forEach(driver => driversData.push(driver));
  
  if (drivers.length === initialLength) {
    return NextResponse.json(
      { error: "Driver not found" }, 
      { status: 404 }
    );
  }
  
  return NextResponse.json(
    { message: "Driver deleted successfully" }
  );
} 