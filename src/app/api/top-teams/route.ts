import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const res = await fetch('http://localhost:4000/top-teams');
    const teams = await res.json();
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch top teams' }, { status: 500 });
  }
} 