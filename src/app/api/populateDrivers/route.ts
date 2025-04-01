import { NextRequest, NextResponse } from "next/server";
import { replaceAllDrivers } from "../drivers/_lib/drivers";

// Current F1 drivers data for 2025 season
const f1Drivers = [
  {
    name: "Max Verstappen",
    team: "Red Bull Racing",
    firstSeason: 2015,
    races: 209,
    wins: 62
  },
  {
    name: "Sergio Perez",
    team: "Red Bull Racing",
    firstSeason: 2011,
    races: 279,
    wins: 6
  },
  {
    name: "Lewis Hamilton",
    team: "Ferrari",
    firstSeason: 2007,
    races: 353,
    wins: 104
  },
  {
    name: "Charles Leclerc",
    team: "Ferrari",
    firstSeason: 2018,
    races: 145,
    wins: 7
  },
  {
    name: "George Russell",
    team: "Mercedes",
    firstSeason: 2019,
    races: 122,
    wins: 3
  },
  {
    name: "Kimi Antonelli",
    team: "Mercedes",
    firstSeason: 2025,
    races: 0,
    wins: 0
  },
  {
    name: "Lando Norris",
    team: "McLaren",
    firstSeason: 2019,
    races: 122,
    wins: 3
  },
  {
    name: "Oscar Piastri",
    team: "McLaren",
    firstSeason: 2023,
    races: 47,
    wins: 2
  },
  {
    name: "Fernando Alonso",
    team: "Aston Martin",
    firstSeason: 2001,
    races: 401,
    wins: 32
  },
  {
    name: "Lance Stroll",
    team: "Aston Martin",
    firstSeason: 2017,
    races: 169,
    wins: 0
  },
  {
    name: "Pierre Gasly",
    team: "Alpine",
    firstSeason: 2017,
    races: 166,
    wins: 1
  },
  {
    name: "Jack Doohan",
    team: "Alpine",
    firstSeason: 2025,
    races: 0,
    wins: 0
  },
  {
    name: "Yuki Tsunoda",
    team: "Racing Bulls",
    firstSeason: 2021,
    races: 96,
    wins: 0
  },
  {
    name: "Liam Lawson",
    team: "Racing Bulls",
    firstSeason: 2023,
    races: 5,
    wins: 0
  },
  {
    name: "Alexander Albon",
    team: "Williams",
    firstSeason: 2019,
    races: 108,
    wins: 0
  },
  {
    name: "Franco Colapinto",
    team: "Williams",
    firstSeason: 2024,
    races: 8,
    wins: 0
  },
  {
    name: "Nico Hulkenberg",
    team: "Sauber",
    firstSeason: 2010,
    races: 228,
    wins: 0
  },
  {
    name: "Valtteri Bottas",
    team: "Sauber",
    firstSeason: 2013,
    races: 241,
    wins: 10
  },
  {
    name: "Kevin Magnussen",
    team: "Haas F1 Team",
    firstSeason: 2014,
    races: 188,
    wins: 0
  },
  {
    name: "Oliver Bearman",
    team: "Haas F1 Team",
    firstSeason: 2024,
    races: 1,
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