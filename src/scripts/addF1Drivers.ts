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

// Current F1 drivers data as of 2024 season
const f1Drivers = [
  {
    name: "Max Verstappen",
    team: "Red Bull Racing",
    firstSeason: 2015,
    races: 188,
    wins: 57
  },
  {
    name: "Sergio Perez",
    team: "Red Bull Racing",
    firstSeason: 2011,
    races: 258,
    wins: 6
  },
  {
    name: "Lewis Hamilton",
    team: "Mercedes",
    firstSeason: 2007,
    races: 332,
    wins: 103
  },
  {
    name: "George Russell",
    team: "Mercedes",
    firstSeason: 2019,
    races: 101,
    wins: 2
  },
  {
    name: "Charles Leclerc",
    team: "Ferrari",
    firstSeason: 2018,
    races: 124,
    wins: 5
  },
  {
    name: "Carlos Sainz",
    team: "Ferrari",
    firstSeason: 2015,
    races: 188,
    wins: 3
  },
  {
    name: "Lando Norris",
    team: "McLaren",
    firstSeason: 2019,
    races: 101,
    wins: 2
  },
  {
    name: "Oscar Piastri",
    team: "McLaren",
    firstSeason: 2023,
    races: 26,
    wins: 1
  },
  {
    name: "Fernando Alonso",
    team: "Aston Martin",
    firstSeason: 2001,
    races: 380,
    wins: 32
  },
  {
    name: "Lance Stroll",
    team: "Aston Martin",
    firstSeason: 2017,
    races: 148,
    wins: 0
  },
  {
    name: "Esteban Ocon",
    team: "Alpine",
    firstSeason: 2016,
    races: 142,
    wins: 1
  },
  {
    name: "Pierre Gasly",
    team: "Alpine",
    firstSeason: 2017,
    races: 145,
    wins: 1
  },
  {
    name: "Daniel Ricciardo",
    team: "RB",
    firstSeason: 2011,
    races: 243,
    wins: 8
  },
  {
    name: "Yuki Tsunoda",
    team: "RB",
    firstSeason: 2021,
    races: 75,
    wins: 0
  },
  {
    name: "Alexander Albon",
    team: "Williams",
    firstSeason: 2019,
    races: 87,
    wins: 0
  },
  {
    name: "Logan Sargeant",
    team: "Williams",
    firstSeason: 2023,
    races: 24,
    wins: 0
  },
  {
    name: "Valtteri Bottas",
    team: "Kick Sauber",
    firstSeason: 2013,
    races: 220,
    wins: 10
  },
  {
    name: "Zhou Guanyu",
    team: "Kick Sauber",
    firstSeason: 2022,
    races: 50,
    wins: 0
  },
  {
    name: "Kevin Magnussen",
    team: "Haas F1 Team",
    firstSeason: 2014,
    races: 167,
    wins: 0
  },
  {
    name: "Nico Hulkenberg",
    team: "Haas F1 Team",
    firstSeason: 2010,
    races: 207,
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