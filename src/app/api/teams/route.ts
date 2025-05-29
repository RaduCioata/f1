import { NextRequest, NextResponse } from 'next/server';
import prisma from '../db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET /api/teams - Get all teams with their drivers
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        drivers: true
      }
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: { name }
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 