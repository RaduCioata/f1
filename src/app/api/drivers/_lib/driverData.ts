// Define the Driver interface
export interface Driver {
  id: string;
  name: string;
  team: string;
  races: number;
  wins: number;
  firstSeason: number;
}

// This file contains all drivers data
// You can paste additional drivers in this array in the same format as the existing ones

// Defining drivers without the id field as it will be assigned when adding to the database
export const initialDrivers: Array<Omit<Driver, "id">> = [
  // Current F1 drivers data for 2025 season (first 20 already implemented elsewhere)
  {
    name: "Max Verstappen",
    team: "Red Bull Racing",
    firstSeason: 2015,
    races: 213,
    wins: 57
  },
  {
    name: "Sergio Perez",
    team: "Red Bull Racing",
    firstSeason: 2011,
    races: 267,
    wins: 6
  },
  {
    name: "Lewis Hamilton",
    team: "Mercedes",
    firstSeason: 2007,
    races: 346,
    wins: 103
  },
  {
    name: "George Russell",
    team: "Mercedes",
    firstSeason: 2019,
    races: 117,
    wins: 2
  },
  {
    name: "Charles Leclerc",
    team: "Ferrari",
    firstSeason: 2018,
    races: 143,
    wins: 5
  },
  {
    name: "Carlos Sainz",
    team: "Ferrari",
    firstSeason: 2015,
    races: 206,
    wins: 3
  },
  {
    name: "Lando Norris",
    team: "McLaren",
    firstSeason: 2019,
    races: 129,
    wins: 4
  },
  {
    name: "Oscar Piastri",
    team: "McLaren",
    firstSeason: 2023,
    races: 46,
    wins: 1
  },
  {
    name: "Fernando Alonso",
    team: "Aston Martin",
    firstSeason: 2001,
    races: 389,
    wins: 32
  },
  {
    name: "Lance Stroll",
    team: "Aston Martin",
    firstSeason: 2017,
    races: 155,
    wins: 0
  },
  {
    name: "Esteban Ocon",
    team: "Alpine",
    firstSeason: 2016,
    races: 140,
    wins: 1
  },
  {
    name: "Pierre Gasly",
    team: "Alpine",
    firstSeason: 2017,
    races: 147,
    wins: 1
  },
  {
    name: "Alexander Albon",
    team: "Williams",
    firstSeason: 2019,
    races: 98,
    wins: 0
  },
  {
    name: "Franco Colapinto",
    team: "Williams",
    firstSeason: 2024,
    races: 12,
    wins: 0
  },
  {
    name: "Yuki Tsunoda",
    team: "RB F1 Team",
    firstSeason: 2021,
    races: 87,
    wins: 0
  },
  {
    name: "Liam Lawson",
    team: "RB F1 Team",
    firstSeason: 2023,
    races: 5,
    wins: 0
  },
  {
    name: "Nico Hulkenberg",
    team: "Sauber",
    firstSeason: 2010,
    races: 214,
    wins: 0
  },
  {
    name: "Valtteri Bottas",
    team: "Sauber",
    firstSeason: 2013,
    races: 231,
    wins: 10
  },
  {
    name: "Kevin Magnussen",
    team: "Haas F1 Team",
    firstSeason: 2014,
    races: 178,
    wins: 0
  },
  {
    name: "Oliver Bearman",
    team: "Haas F1 Team",
    firstSeason: 2024,
    races: 1,
    wins: 0
  },
  
  // Paste additional drivers here in the same format
  // These will be historic F1 drivers, with correct career statistics
  {
    name: "Michael Schumacher",
    team: "Historical",
    firstSeason: 1991,
    races: 306,
    wins: 91
  },
  {
    name: "Ayrton Senna",
    team: "Historical",
    firstSeason: 1984,
    races: 161,
    wins: 41
  },
  {
    name: "Alain Prost",
    team: "Historical",
    firstSeason: 1980,
    races: 199,
    wins: 51
  },
  {
    name: "Niki Lauda",
    team: "Historical",
    firstSeason: 1971,
    races: 171,
    wins: 25
  },
  {
    name: "Jackie Stewart",
    team: "Historical",
    firstSeason: 1965,
    races: 99,
    wins: 27
  }

  // You can paste more drivers here - they need to have the same structure
  // as the examples above (name, team, firstSeason, races, wins)
];

// This makes the data available for importing elsewhere in the app
export default initialDrivers; 