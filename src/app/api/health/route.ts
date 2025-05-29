import { NextRequest, NextResponse } from "next/server";

// GET /api/health - Simple health check endpoint
export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

// HEAD request support for lightweight health checks
export async function HEAD(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
} 