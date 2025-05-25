import { NextRequest, NextResponse } from 'next/server';
import { Driver, drivers } from '../_lib/drivers';

// GET handler for a specific driver
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  
  // Find the driver with the matching ID
  const driver = drivers.find((d: Driver) => d.id === id);
  
  // If no driver is found, return a 404 response
  if (!driver) {
    return NextResponse.json(
      { error: "Driver not found" }, 
      { status: 404 }
    );
  }
  
  // Return the driver data
  return NextResponse.json(driver);
} 