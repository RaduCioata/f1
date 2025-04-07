import { drivers, getNextId, replaceAllDrivers } from '../_lib/drivers';

beforeEach(() => {
  // Empty the drivers array
  drivers.length = 0;
});

describe('Drivers Library', () => {
  test('getNextId returns "1" when no drivers exist', () => {
    // Ensure drivers array is empty
    drivers.length = 0;
    
    const id = getNextId();
    
    expect(id).toBe('1');
  });
  
  test('getNextId returns correct ID when drivers exist', () => {
    // Add some drivers with sequential IDs
    drivers.push(
      { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 },
      { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 }
    );
    
    const id = getNextId();
    
    expect(id).toBe('3'); // Should be one more than the highest ID
  });
  
  test('getNextId handles non-sequential IDs correctly', () => {
    // Add some drivers with non-sequential IDs
    drivers.push(
      { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 },
      { id: '5', name: 'Driver 5', team: 'Team C', races: 15, wins: 3, firstSeason: 2018 }
    );
    
    const id = getNextId();
    
    expect(id).toBe('6'); // Should be one more than the highest ID
  });
  
  // Add tests for replaceAllDrivers function
  describe('replaceAllDrivers', () => {
    test('replaces all drivers with new ones', () => {
      // Add some initial drivers
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 },
        { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 }
      );
      
      // Define new drivers
      const newDrivers = [
        { name: 'New Driver 1', team: 'New Team A', races: 15, wins: 3, firstSeason: 2022 },
        { name: 'New Driver 2', team: 'New Team B', races: 25, wins: 6, firstSeason: 2021 },
        { name: 'New Driver 3', team: 'New Team C', races: 5, wins: 1, firstSeason: 2023 }
      ];
      
      // Replace all drivers
      const result = replaceAllDrivers(newDrivers);
      
      // Check that the result contains the added drivers
      expect(result).toHaveLength(3);
      expect(result[0]!.name).toBe('New Driver 1');
      expect(result[1]!.name).toBe('New Driver 2');
      expect(result[2]!.name).toBe('New Driver 3');
      
      // Check that the drivers array has been updated
      expect(drivers).toHaveLength(3);
      expect(drivers[0]!.name).toBe('New Driver 1');
      expect(drivers[1]!.name).toBe('New Driver 2');
      expect(drivers[2]!.name).toBe('New Driver 3');
      
      // Check that IDs were assigned correctly
      expect(drivers[0]!.id).toBe('1');
      expect(drivers[1]!.id).toBe('2');
      expect(drivers[2]!.id).toBe('3');
    });
    
    test('works with empty input array', () => {
      // Add some initial drivers
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 }
      );
      
      // Replace with empty array
      const result = replaceAllDrivers([]);
      
      // Check that the result is empty
      expect(result).toHaveLength(0);
      
      // Check that the drivers array is now empty
      expect(drivers).toHaveLength(0);
    });
    
    test('assigns sequential IDs starting from 1', () => {
      // Replace with new drivers
      const newDrivers = [
        { name: 'New Driver 1', team: 'New Team A', races: 15, wins: 3, firstSeason: 2022 },
        { name: 'New Driver 2', team: 'New Team B', races: 25, wins: 6, firstSeason: 2021 }
      ];
      
      const result = replaceAllDrivers(newDrivers);
      
      // Check that IDs start from 1 and are sequential
      expect(result[0]!.id).toBe('1');
      expect(result[1]!.id).toBe('2');
    });
  });
}); 