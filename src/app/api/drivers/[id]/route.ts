import { NextRequest, NextResponse } from 'next/server';
import { Driver, drivers } from '../_lib/drivers';

type Props = {
  params: {
    id: string
  }
}

// GET handler for a specific driver
export async function GET(
  request: NextRequest,
  props: Props
) {
  const id = props.params.id;
  
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