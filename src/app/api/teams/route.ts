import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:4000/teams');
  const teams = await res.json();
  return NextResponse.json(teams);
} 