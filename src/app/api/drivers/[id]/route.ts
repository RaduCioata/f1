import { NextResponse } from 'next/server';
import prisma from '../../db';

// Force dynamic rendering and enable dynamic route parameters
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// GET /api/drivers/[id]
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const driver = await prisma.driver.findUnique({
    where: { id: parseInt(params.id) },
    include: { team: true }
  });
  return NextResponse.json(driver || { error: 'Driver not found' });
}

// PATCH /api/drivers/[id] 
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const driver = await prisma.driver.update({
    where: { id: parseInt(params.id) },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      nationality: body.nationality,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      driverNumber: body.driverNumber ? parseInt(body.driverNumber) : undefined,
      teamId: body.teamId ? parseInt(body.teamId) : undefined
    },
    include: { team: true }
  });
  return NextResponse.json(driver);
}