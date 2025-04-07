import { NextRequest, NextResponse } from 'next/server';
import { initialDrivers, Driver } from './_lib/driverData';

// In-memory storage for the drivers - adding IDs to the initial drivers
let drivers: Driver[] = initialDrivers.map((driver, index) => ({
  ...driver,
  id: String(index + 1)
}));

interface GetDriversParams {
  team?: string;
  name?: string;
  minWins?: number;
  skip?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const params: GetDriversParams = {
      team: searchParams.get('team') || undefined,
      name: searchParams.get('name') || undefined,
      minWins: searchParams.get('minWins') ? parseInt(searchParams.get('minWins')!) : undefined,
      skip: searchParams.get('skip') ? parseInt(searchParams.get('skip')!) : 0,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc'
    };

    // Apply filters
    let filteredDrivers = [...drivers];
    
    if (params.team) {
      filteredDrivers = filteredDrivers.filter(driver => 
        driver.team.toLowerCase().includes(params.team!.toLowerCase())
      );
    }
    
    if (params.name) {
      filteredDrivers = filteredDrivers.filter(driver => 
        driver.name.toLowerCase().includes(params.name!.toLowerCase())
      );
    }
    
    if (params.minWins !== undefined) {
      filteredDrivers = filteredDrivers.filter(driver => 
        driver.wins >= params.minWins!
      );
    }

    // Apply sorting
    if (params.sortBy) {
      filteredDrivers.sort((a, b) => {
        const fieldA = a[params.sortBy as keyof typeof a];
        const fieldB = b[params.sortBy as keyof typeof b];
        
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return params.sortOrder === 'asc' 
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        } else {
          // Assuming numbers for non-string fields
          return params.sortOrder === 'asc'
            ? (fieldA as number) - (fieldB as number)
            : (fieldB as number) - (fieldA as number);
        }
      });
    }

    // Get total before pagination
    const total = filteredDrivers.length;

    // Apply pagination
    const paginatedDrivers = filteredDrivers.slice(
      params.skip,
      params.skip! + params.limit!
    );

    // Determine if there are more results
    const hasMore = params.skip! + params.limit! < total;

    // Add artificial delay to simulate network latency (for demo purposes)
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      drivers: paginatedDrivers,
      total,
      hasMore
    });
  } catch (error) {
    console.error('Error in GET /api/drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

interface NewDriverRequest {
  name: string;
  team: string;
  firstSeason?: number;
  races?: number;
  wins?: number;
}

export async function POST(request: NextRequest) {
  try {
    const newDriverData = await request.json() as NewDriverRequest;
    
    // Validate required fields
    if (!newDriverData.name || !newDriverData.team) {
      return NextResponse.json(
        { error: 'Name and team are required' },
        { status: 400 }
      );
    }
    
    // Get the next ID (highest ID + 1)
    const nextId = String(Math.max(...drivers.map(d => parseInt(d.id))) + 1);
    
    // Create a new driver with all required fields
    const newDriver: Driver = {
      id: nextId,
      name: newDriverData.name,
      team: newDriverData.team,
      firstSeason: newDriverData.firstSeason ?? new Date().getFullYear(),
      races: newDriverData.races ?? 0,
      wins: newDriverData.wins ?? 0
    };
    
    // Add to drivers array
    drivers.unshift(newDriver);
    
    return NextResponse.json(newDriver, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/drivers:', error);
    return NextResponse.json(
      { error: 'Failed to add driver' },
      { status: 500 }
    );
  }
}

interface UpdateDriverRequest {
  id: string;
  name?: string;
  team?: string;
  firstSeason?: number;
  races?: number;
  wins?: number;
}

export async function PATCH(request: NextRequest) {
  try {
    const updateData = await request.json() as UpdateDriverRequest;
    
    // Validate required fields
    if (!updateData.id) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      );
    }
    
    // Find the driver
    const index = drivers.findIndex(d => d.id === updateData.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }
    
    // Update individual fields if they are provided
    if (updateData.name !== undefined) {
      drivers[index].name = updateData.name;
    }
    
    if (updateData.team !== undefined) {
      drivers[index].team = updateData.team;
    }
    
    if (updateData.firstSeason !== undefined) {
      drivers[index].firstSeason = updateData.firstSeason;
    }
    
    if (updateData.races !== undefined) {
      drivers[index].races = updateData.races;
    }
    
    if (updateData.wins !== undefined) {
      drivers[index].wins = updateData.wins;
    }
    
    return NextResponse.json(drivers[index]);
  } catch (error) {
    console.error('Error in PATCH /api/drivers:', error);
    return NextResponse.json(
      { error: 'Failed to update driver' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      );
    }
    
    // Find the driver
    const index = drivers.findIndex(d => d.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }
    
    // Remove the driver
    const deletedDriver = drivers[index];
    drivers.splice(index, 1);
    
    return NextResponse.json(deletedDriver);
  } catch (error) {
    console.error('Error in DELETE /api/drivers:', error);
    return NextResponse.json(
      { error: 'Failed to delete driver' },
      { status: 500 }
    );
  }
} 