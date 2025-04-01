import { GET } from '../route';
import { drivers } from '../../_lib/drivers';
import { MockRequest, NextResponseMock } from '../../__mocks__/nextMock';

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

describe('Driver By ID API', () => {
  test('returns a driver when it exists', async () => {
    // Add test driver
    drivers.push(
      { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 }
    );
    
    const req = new MockRequest('http://localhost:3000/api/drivers/1');
    const params = { id: '1' };
    const res = await GET(req as any, { params });
    const data = await res.json();
    
    expect(data.id).toBe('1');
    expect(data.name).toBe('Driver 1');
    expect(data.team).toBe('Team A');
  });
  
  test('returns 404 when driver does not exist', async () => {
    const req = new MockRequest('http://localhost:3000/api/drivers/999');
    const params = { id: '999' };
    const res = await GET(req as any, { params });
    
    expect(res.status).toBe(404);
  });
}); 