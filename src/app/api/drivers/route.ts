import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../db';
import { Driver } from '../../../entities/Driver';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const drivers = await dataSource.getRepository(Driver).find({
      relations: ["team"]
    });
    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dataSource = await getDataSource();
    const driverRepo = dataSource.getRepository(Driver);
    
    const newDriver = driverRepo.create(body);
    await driverRepo.save(newDriver);
    
    return NextResponse.json(newDriver, { status: 201 });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { error: 'Failed to create driver' },
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
    const dataSource = await getDataSource();
    const driverRepo = dataSource.getRepository(Driver);
    const driver = await driverRepo.findOne({
      where: { id: updateData.id },
      relations: ["team"]
    });
    
    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }
    
    // Update individual fields if they are provided
    if (updateData.name !== undefined) {
      driver.name = updateData.name;
    }
    
    if (updateData.team !== undefined) {
      driver.team = updateData.team;
    }
    
    if (updateData.firstSeason !== undefined) {
      driver.firstSeason = updateData.firstSeason;
    }
    
    if (updateData.races !== undefined) {
      driver.races = updateData.races;
    }
    
    if (updateData.wins !== undefined) {
      driver.wins = updateData.wins;
    }
    
    await driverRepo.save(driver);
    return NextResponse.json(driver);
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
    const dataSource = await getDataSource();
    const driverRepo = dataSource.getRepository(Driver);
    const driver = await driverRepo.findOne({
      where: { id: id },
      relations: ["team"]
    });
    
    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }
    
    // Remove the driver
    await driverRepo.remove(driver);
    
    return NextResponse.json(driver);
  } catch (error) {
    console.error('Error in DELETE /api/drivers:', error);
    return NextResponse.json(
      { error: 'Failed to delete driver' },
      { status: 500 }
    );
  }
} 