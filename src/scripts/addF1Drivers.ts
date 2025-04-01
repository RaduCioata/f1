// Script to add current F1 drivers to the database

// Function to add a driver through the API
async function addDriver(driver: {
  name: string;
  team: string;
  firstSeason: number;
  races: number;
  wins: number;
}) {
  try {
    const response = await fetch('http://localhost:3001/api/drivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driver),
    });

    if (!response.ok) {
      throw new Error(`Failed to add driver ${driver.name}: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Added driver: ${driver.name}`);
    return data;
  } catch (error) {
    console.error(`Error adding driver ${driver.name}:`, error);
    throw error;
  }
}

// Current F1 drivers data as of 2025 season
const f1Drivers = [
  {
    name: "Max Verstappen",
    team: "Red Bull Racing",
    firstSeason: 2015,
    races: 210,
    wins: 65
  },
  {
    name: "Yuki Tsunoda",
    team: "Red Bull Racing",
    firstSeason: 2021,
    races: 97,
    wins: 0
  },
  {
    name: "Lewis Hamilton",
    team: "Ferrari",
    firstSeason: 2007,
    races: 350,
    wins: 103
  },
  {
    name: "Charles Leclerc",
    team: "Ferrari",
    firstSeason: 2018,
    races: 146,
    wins: 7
  },
  {
    name: "George Russell",
    team: "Mercedes",
    firstSeason: 2019,
    races: 123,
    wins: 5
  },
  {
    name: "Andrea Kimi Antonelli",
    team: "Mercedes",
    firstSeason: 2025,
    races: 2,
    wins: 0
  },
  {
    name: "Lando Norris",
    team: "McLaren",
    firstSeason: 2019,
    races: 123,
    wins: 4
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
    races: 2,
    wins: 0
  },
  {
    name: "Carlos Sainz",
    team: "Williams",
    firstSeason: 2015,
    races: 210,
    wins: 3
  },
  {
    name: "Alexander Albon",
    team: "Williams",
    firstSeason: 2019,
    races: 109,
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
    races: 2,
    wins: 0
  },
  {
    name: "Esteban Ocon",
    team: "Haas F1 Team",
    firstSeason: 2016,
    races: 164,
    wins: 1
  },
  {
    name: "Oliver Bearman",
    team: "Haas F1 Team",
    firstSeason: 2025,
    races: 2,
    wins: 0
  },
  {
    name: "Liam Lawson",
    team: "Racing Bulls",
    firstSeason: 2023,
    races: 22,
    wins: 0
  },
  {
    name: "Isack Hadjar",
    team: "Racing Bulls",
    firstSeason: 2025,
    races: 2,
    wins: 0
  }
];


// Function to add all drivers
async function addAllDrivers() {
  console.log('Starting to add F1 drivers...');
  
  // First, let's clear existing drivers
  try {
    const response = await fetch('http://localhost:3001/api/drivers');
    if (!response.ok) {
      throw new Error(`Failed to fetch drivers: ${response.status}`);
    }
    
    const existingDrivers = await response.json();
    
    // Delete each driver
    for (const driver of existingDrivers) {
      const deleteResponse = await fetch(`http://localhost:3001/api/drivers?id=${driver.id}`, {
        method: 'DELETE',
      });
      
      if (!deleteResponse.ok) {
        console.warn(`Warning: Failed to delete driver ${driver.name}: ${deleteResponse.status}`);
      } else {
        console.log(`Deleted existing driver: ${driver.name}`);
      }
    }
    
    console.log('Cleared existing drivers successfully');
  } catch (error) {
    console.error('Error clearing existing drivers:', error);
    // Continue anyway
  }
  
  // Add each driver
  for (const driver of f1Drivers) {
    try {
      await addDriver(driver);
    } catch (error) {
      console.error(`Failed to add driver ${driver.name}. Continuing with next driver...`);
    }
  }
  
  console.log('Finished adding all F1 drivers!');
}

// Run the function
addAllDrivers().catch(error => {
  console.error('An error occurred:', error);
});

// To run this script, use:
// ts-node src/scripts/addF1Drivers.ts
// or
// node --loader ts-node/esm src/scripts/addF1Drivers.ts 