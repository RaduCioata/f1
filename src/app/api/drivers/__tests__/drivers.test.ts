import { GET, POST, PATCH, DELETE } from '../route';
import { drivers } from '../_lib/drivers';
import { MockRequest, NextResponseMock } from '../__mocks__/nextMock';
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Mock next/server
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => 
      NextResponseMock.json(body, init)
    )
  }
}));

// Clear the drivers array before each test
beforeEach(() => {
  // Empty the drivers array
  drivers.length = 0;
  
  // Clear mock calls
  jest.clearAllMocks();
});

describe('Drivers API', () => {
  // Clear drivers array before all tests
  beforeEach(() => {
    console.log('BEFORE TEST: Clearing drivers array');
    drivers.length = 0;
  });
  
  describe('GET /api/drivers', () => {
    test('returns empty array when no drivers exist', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers');
      const res = await GET(req as any);
      const data = await res.json();
      
      expect(data).toEqual([]);
    });
    
    test('returns all drivers when they exist', async () => {
      // Add test drivers
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 },
        { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers');
      const res = await GET(req as any);
      const data = await res.json();
      
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Driver 1');
      expect(data[1].name).toBe('Driver 2');
    });
    
    test('filters drivers by team', async () => {
      // Add test drivers
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 },
        { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?team=Team%20A');
      const res = await GET(req as any);
      const data = await res.json();
      
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Driver 1');
    });
    
    test('sorts drivers by wins in descending order', async () => {
      // Add test drivers
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 },
        { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?sortBy=wins&sortOrder=desc');
      const res = await GET(req as any);
      const data = await res.json();
      
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Driver 2');
      expect(data[1].name).toBe('Driver 1');
    });
    
    test('filters drivers by minimum wins', async () => {
      // Add test drivers with different win counts
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 },
        { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?minWins=3');
      const res = await GET(req as any);
      const data = await res.json();
      
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Driver 2'); // Only driver with more than 3 wins
    });

    test('handles invalid minWins parameter gracefully', async () => {
      // Add test drivers
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 },
        { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?minWins=invalid');
      const res = await GET(req as any);
      const data = await res.json();
      
      // Should ignore invalid minWins and return all drivers
      expect(data).toHaveLength(2);
    });

    test('filters drivers by name case-insensitively', async () => {
      drivers.push(
        { id: '1', name: 'Lewis Hamilton', team: 'Mercedes', races: 100, wins: 50, firstSeason: 2007 },
        { id: '2', name: 'Max Verstappen', team: 'Red Bull', races: 80, wins: 40, firstSeason: 2015 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?name=lewis');
      const res = await GET(req as any);
      const data = await res.json();
      
      expect(data).toHaveLength(1);
      expect(data[0].name).toBe('Lewis Hamilton');
    });
    
    test('handles sorting when no sortBy parameter is provided', async () => {
      drivers.push(
        { id: '1', name: 'Lewis Hamilton', team: 'Mercedes', races: 100, wins: 50, firstSeason: 2007 },
        { id: '2', name: 'Max Verstappen', team: 'Red Bull', races: 80, wins: 40, firstSeason: 2015 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers');
      const res = await GET(req as any);
      const data = await res.json();
      
      expect(data).toHaveLength(2);
      // Order should be preserved when no sort is specified
      expect(data[0].id).toBe('1');
      expect(data[1].id).toBe('2');
    });
    
    test('handles sorting with invalid sortBy parameter', async () => {
      drivers.push(
        { id: '1', name: 'Lewis Hamilton', team: 'Mercedes', races: 100, wins: 50, firstSeason: 2007 },
        { id: '2', name: 'Max Verstappen', team: 'Red Bull', races: 80, wins: 40, firstSeason: 2015 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?sortBy=invalidField');
      const res = await GET(req as any);
      const data = await res.json();
      
      expect(data).toHaveLength(2);
      // Order should be preserved when invalid sort field is specified
      expect(data[0].id).toBe('1');
      expect(data[1].id).toBe('2');
    });
    
    test('sorts drivers in ascending order by firstSeason', async () => {
      drivers.push(
        { id: '1', name: 'Lewis Hamilton', team: 'Mercedes', races: 100, wins: 50, firstSeason: 2007 },
        { id: '2', name: 'Max Verstappen', team: 'Red Bull', races: 80, wins: 40, firstSeason: 2015 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?sortBy=firstSeason&sortOrder=asc');
      const res = await GET(req as any);
      const data = await res.json();
      
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Lewis Hamilton'); // Earlier first season
      expect(data[1].name).toBe('Max Verstappen');
    });
  });
  
  describe('POST /api/drivers', () => {
    test('creates a new driver with valid data', async () => {
      const driverData = {
        name: 'New Driver',
        team: 'New Team',
        races: 15,
        wins: 3,
        firstSeason: 2020
      };
      
      // Make sure drivers array is empty
      drivers.length = 0;
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'POST', driverData);
      const res = await POST(req as any);
      const data = await res.json();
      
      expect(res.status).toBe(201);
      expect(data.name).toBe('New Driver');
      expect(data.id).toBeDefined();
      expect(drivers.length).toBe(1);
    });
    
    test('returns 400 when name is missing', async () => {
      const invalidData = {
        team: 'New Team',
        races: 15,
        wins: 3,
        firstSeason: 2020
      };
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'POST', invalidData);
      const res = await POST(req as any);
      
      expect(res.status).toBe(400);
    });
    
    test('returns 400 when wins exceed races', async () => {
      const invalidData = {
        name: 'New Driver',
        team: 'New Team',
        races: 10,
        wins: 15, // More wins than races
        firstSeason: 2020
      };
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'POST', invalidData);
      const res = await POST(req as any);
      
      expect(res.status).toBe(400);
    });
    
    test('returns 400 when first season is in the future', async () => {
      const currentYear = new Date().getFullYear();
      const invalidData = {
        name: 'New Driver',
        team: 'New Team',
        races: 10,
        wins: 2,
        firstSeason: currentYear + 1 // Next year
      };
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'POST', invalidData);
      const res = await POST(req as any);
      
      expect(res.status).toBe(400);
    });
    
    test('handles JSON parsing errors in POST', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers', 'POST');
      // Mock json method to throw an error
      req.json = jest.fn().mockRejectedValue(new Error('Invalid JSON'));
      
      const res = await POST(req as any);
      
      expect(res.status).toBe(400);
    });

    test('handles malformed JSON in the request body', async () => {
      // Create a request with a json method that rejects
      const req = new MockRequest('http://localhost:3000/api/drivers', 'POST');
      req.json = jest.fn().mockRejectedValue(new SyntaxError('Unexpected token in JSON'));
      
      const res = await POST(req as any);
      
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual(expect.objectContaining({ 
        error: expect.stringContaining('Invalid request body') 
      }));
    });
  });
  
  describe('PATCH /api/drivers', () => {
    test('updates a driver with valid data', async () => {
      // Add a test driver
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 }
      );
      
      const updateData = {
        id: '1',
        name: 'Updated Driver',
        team: 'Updated Team'
      };
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH', updateData);
      const res = await PATCH(req as any);
      const data = await res.json();
      
      expect(data.name).toBe('Updated Driver');
      expect(data.team).toBe('Updated Team');
      expect(data.races).toBe(10); // Unchanged
      expect(data.wins).toBe(2); // Unchanged
    });
    
    test('returns 404 when updating non-existent driver', async () => {
      const updateData = {
        id: 'non-existent',
        name: 'Updated Driver'
      };
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH', updateData);
      const res = await PATCH(req as any);
      
      expect(res.status).toBe(404);
    });
    
    test('returns 400 when ID is missing', async () => {
      const updateData = {
        name: 'Updated Driver'
      };
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH', updateData);
      const res = await PATCH(req as any);
      
      expect(res.status).toBe(400);
    });

    test('validates all driver fields correctly on update', async () => {
      // Add a test driver
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 }
      );
      
      // Update with invalid values (future first season and negative races)
      const updateData = {
        id: '1',
        firstSeason: new Date().getFullYear() + 1, // Future year
        races: -5 // Negative value
      };
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH', updateData);
      const res = await PATCH(req as any);
      
      expect(res.status).toBe(400);
    });
    
    test('handles driver not found gracefully', async () => {
      const updateData = {
        id: 'non-existent-id',
        name: 'Updated Driver'
      };
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH', updateData);
      const res = await PATCH(req as any);
      
      expect(res.status).toBe(404);
    });
    
    test('handles wins exceeding races validation in PATCH', async () => {
      // Add a test driver
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 }
      );
      
      // Update with wins > races
      const updateData = {
        id: '1',
        wins: 20, // More wins than races (10)
      };
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH', updateData);
      const res = await PATCH(req as any);
      
      expect(res.status).toBe(400);
    });
    
    test('handles malformed JSON in PATCH request', async () => {
      // Create a request with a json method that rejects
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH');
      req.json = jest.fn().mockRejectedValue(new SyntaxError('Unexpected token in JSON'));
      
      const res = await PATCH(req as any);
      
      expect(res.status).toBe(400);
      expect(await res.json()).toEqual(expect.objectContaining({ 
        error: expect.stringContaining('Invalid request body') 
      }));
    });
  });
  
  describe('DELETE /api/drivers', () => {
    test('deletes a driver by ID', async () => {
      // Add a test driver
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?id=1', 'DELETE');
      const res = await DELETE(req as any);
      
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(drivers).toHaveLength(0);
      expect(data.message).toBe("Driver deleted successfully");
    });
    
    test('returns 404 when deleting non-existent driver', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers?id=non-existent', 'DELETE');
      const res = await DELETE(req as any);
      
      expect(res.status).toBe(404);
    });
    
    test('returns 400 when ID is missing', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers', 'DELETE');
      const res = await DELETE(req as any);
      
      expect(res.status).toBe(400);
    });
  });
}); 