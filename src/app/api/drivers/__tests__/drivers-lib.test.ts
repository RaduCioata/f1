import { drivers, getNextId } from '../_lib/drivers';

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
}); 