'use server';

import { headers } from 'next/headers';

// Server action to populate the database with F1 drivers

// Get base URL for API requests
function getBaseUrl() {
  const headersList = headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

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

// Function to add a driver through the API
async function addDriver(driver: {
  name: string;
  team: string;
  firstSeason: number;
  races: number;
  wins: number;
}) {
  try {
    // Get base URL for API calls
    const baseUrl = getBaseUrl();
    
    // Use absolute URL with the host
    const response = await fetch(`${baseUrl}/api/drivers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driver),
    });

    if (!response.ok) {
      throw new Error(`Failed to add driver ${driver.name}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error adding driver ${driver.name}:`, error);
    throw error;
  }
}

// Server action to populate F1 drivers
export async function populateF1Drivers() {
  const results = {
    success: false,
    driversAdded: 0,
    message: ''
  };
  
  try {
    // Get base URL for API calls
    const baseUrl = getBaseUrl();
    
    // First, get existing drivers using absolute URL
    const response = await fetch(`${baseUrl}/api/drivers`);
    if (!response.ok) {
      throw new Error(`Failed to fetch drivers: ${response.status}`);
    }
    
    const existingDrivers = await response.json();
    
    // Delete each driver first
    for (const driver of existingDrivers) {
      const deleteResponse = await fetch(`${baseUrl}/api/drivers?id=${driver.id}`, {
        method: 'DELETE',
      });
      
      if (!deleteResponse.ok) {
        console.warn(`Warning: Failed to delete driver ${driver.name}: ${deleteResponse.status}`);
      }
    }
    
    // Add each driver
    for (const driver of f1Drivers) {
      try {
        await addDriver(driver);
        results.driversAdded++;
      } catch (error) {
        console.error(`Failed to add driver ${driver.name}.`);
      }
    }
    
    results.success = results.driversAdded > 0;
    results.message = `Successfully added ${results.driversAdded} 2025 F1 drivers!`;
    
  } catch (error) {
    console.error('Error populating drivers:', error);
    results.message = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
  
  return results;
} 