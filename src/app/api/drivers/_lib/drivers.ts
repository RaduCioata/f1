// Define the Driver interface
export interface Driver {
  id: string;
  name: string;
  team: string;
  races: number;
  wins: number;
  firstSeason: number;
}

// "Database" of drivers
export let drivers: Driver[] = [];

// Helper to get the next ID
export const getNextId = (): string => {
  if (drivers.length === 0) return "1";
  return String(Math.max(...drivers.map(d => parseInt(d.id))) + 1);
};

// Bulk replace all drivers
export const replaceAllDrivers = (newDrivers: Omit<Driver, "id">[]): Driver[] => {
  // Clear existing drivers
  drivers.length = 0;
  
  // Add all new drivers with IDs
  const addedDrivers: Driver[] = [];
  let nextId = 1;
  
  for (const driverData of newDrivers) {
    const driver: Driver = {
      id: String(nextId++),
      name: driverData.name,
      team: driverData.team,
      races: driverData.races,
      wins: driverData.wins,
      firstSeason: driverData.firstSeason
    };
    
    drivers.push(driver);
    addedDrivers.push(driver);
  }
  
  return addedDrivers;
}; 