import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  const res = await fetch('http://localhost:4000/drivers');
  const drivers = await res.json();
  return NextResponse.json(drivers);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch('http://localhost:4000/drivers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
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