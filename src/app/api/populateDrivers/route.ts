import { NextRequest, NextResponse } from "next/server";
import { replaceAllDrivers } from "../drivers/_lib/drivers";

// Current F1 drivers data for 2025 season
const f1Drivers = [
  {
    name: "Max Verstappen",
    team: "Red Bull Racing",
    firstSeason: 2015,
    races: 210,
    wins: 64
  },
  {
    name: "Yuki Tsunoda",
    team: "Red Bull Racing",
    firstSeason: 2021,
    races: 97,
    wins: 0
  },
  {
    name: "Charles Leclerc",
    team: "Ferrari",
    firstSeason: 2018,
    races: 146,
    wins: 7
  },
  {
    name: "Lewis Hamilton",
    team: "Ferrari",
    firstSeason: 2007,
    races: 354,
    wins: 104
  },
  {
    name: "George Russell",
    team: "Mercedes",
    firstSeason: 2019,
    races: 123,
    wins: 3
  },
  {
    name: "Kimi Antonelli",
    team: "Mercedes",
    firstSeason: 2025,
    races: 1,
    wins: 0
  },
  {
    name: "Lando Norris",
    team: "McLaren",
    firstSeason: 2019,
    races: 123,
    wins: 3
  },
  {
    name: "Oscar Piastri",
    team: "McLaren",
    firstSeason: 2023,
    races: 48,
    wins: 2
  },
  {
    name: "Fernando Alonso",
    team: "Aston Martin",
    firstSeason: 2001,
    races: 402,
    wins: 32
  },
  {
    name: "Lance Stroll",
    team: "Aston Martin",
    firstSeason: 2017,
    races: 170,
    wins: 0
  },
  {
    name: "Pierre Gasly",
    team: "Alpine",
    firstSeason: 2017,
    races: 167,
    wins: 1
  },
  {
    name: "Jack Doohan",
    team: "Alpine",
    firstSeason: 2025,
    races: 1,
    wins: 0
  },
  {
    name: "Alexander Albon",
    team: "Williams",
    firstSeason: 2019,
    races: 109,
    wins: 0
  },
  {
    name: "Carlos Sainz",
    team: "Williams",
    firstSeason: 2015,
    races: 183,
    wins: 2
  },
  {
    name: "Isack Hadjar",
    team: "Racing Bulls",
    firstSeason: 2025,
    races: 1,
    wins: 0
  },
  {
    name: "Liam Lawson",
    team: "Racing Bulls",
    firstSeason: 2023,
    races: 6,
    wins: 0
  },
  {
    name: "Nico Hulkenberg",
    team: "Sauber",
    firstSeason: 2010,
    races: 229,
    wins: 0
  },
  {
    name: "Gabriel Bortoleto",
    team: "Sauber",
    firstSeason: 2025,
    races: 1,
    wins: 0
  },
  {
    name: "Esteban Ocon",
    team: "Haas F1 Team",
    firstSeason: 2016,
    races: 146,
    wins: 1
  },
  {
    name: "Oliver Bearman",
    team: "Haas F1 Team",
    firstSeason: 2024,
    races: 2,
    wins: 0
  }
];


// Track if population is in progress
let isPopulating = false;

// API route handler
export async function POST(req: NextRequest) {
  // Prevent concurrent population attempts
  if (isPopulating) {
    return NextResponse.json({
      success: false,
      driversAdded: 0,
      message: "Population already in progress. Please try again later."
    }, { status: 429 });
  }
  
  try {
    isPopulating = true;
    
    // Use the bulk replace function to add all drivers at once
    const addedDrivers = replaceAllDrivers(f1Drivers);
    
    return NextResponse.json({
      success: addedDrivers.length > 0,
      driversAdded: addedDrivers.length,
      message: `Successfully added ${addedDrivers.length} 2025 F1 drivers!`
    });
    
  } catch (error) {
    console.error('Error in populate drivers route:', error);
    return NextResponse.json(
      { 
        success: false,
        driversAdded: 0,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      },
      { status: 500 }
    );
  } finally {
    // Always reset the population flag when done
    isPopulating = false;
  }
} 