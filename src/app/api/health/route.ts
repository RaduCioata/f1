import { NextRequest, NextResponse } from "next/server";

// Simple health check endpoint to verify server availability
export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}

// HEAD request support for lightweight health checks
export async function HEAD(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
} 