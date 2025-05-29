import { NextRequest, NextResponse } from 'next/server';
import prisma from '../db';

interface UpdateDriverRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  dateOfBirth?: string;
  driverNumber?: string;
  teamId?: string;
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/drivers - Get all drivers
export async function GET() {
  const drivers = await prisma.driver.findMany({
    include: { team: true }
  });
  return NextResponse.json(drivers);
}

// POST /api/drivers - Create a new driver
export async function POST(request: NextRequest) {
  const body = await request.json();
  const driver = await prisma.driver.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      nationality: body.nationality,
      dateOfBirth: new Date(body.dateOfBirth),
      driverNumber: parseInt(body.driverNumber),
      teamId: parseInt(body.teamId)
    },
    include: { team: true }
  });
  return NextResponse.json(driver);
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as UpdateDriverRequest;
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      );
    }

    const driverId = parseInt(body.id);
    if (isNaN(driverId)) {
      return NextResponse.json(
        { error: 'Invalid driver ID' },
        { status: 400 }
      );
    }

    const existingDriver = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!existingDriver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    if (body.teamId) {
      const teamId = parseInt(body.teamId);
      if (isNaN(teamId)) {
        return NextResponse.json(
          { error: 'Invalid team ID' },
          { status: 400 }
        );
      }

      const team = await prisma.team.findUnique({
        where: { id: teamId }
      });
      if (!team) {
        return NextResponse.json(
          { error: 'Team not found' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (body.firstName) updateData.firstName = body.firstName;
    if (body.lastName) updateData.lastName = body.lastName;
    if (body.nationality) updateData.nationality = body.nationality;
    if (body.dateOfBirth) updateData.dateOfBirth = new Date(body.dateOfBirth);
    if (body.driverNumber) updateData.driverNumber = parseInt(body.driverNumber);
    if (body.teamId) updateData.teamId = parseInt(body.teamId);

    const updatedDriver = await prisma.driver.update({
      where: { id: driverId },
      data: updateData,
      include: {
        team: true
      }
    });

    return NextResponse.json(updatedDriver);
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/drivers?id=X - Delete a driver
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const driver = await prisma.driver.delete({
    where: { id: parseInt(searchParams.get('id') || '') },
    include: { team: true }
  });
  return NextResponse.json(driver);
} 