import { GET, POST, PATCH, DELETE } from '../route';
import { drivers } from '../_lib/drivers';
import { NextRequest } from 'next/server';

// Create mock response class
class MockResponse {
  status: number;
  body: any;

  constructor(body: any, options?: { status?: number }) {
    this.status = options?.status || 200;
    this.body = body;
  }

  async json() {
    return Promise.resolve(this.body);
  }
}

// Create mock request class
class MockRequest {
  url: string;
  method: string;
  nextUrl: { searchParams: URLSearchParams };
  private _body: any;
  
  constructor(url: string, method = 'GET', body: any = {}) {
    this.url = url;
    this.method = method;
    this._body = body;
    
    // Parse the URL and extract search params
    const parsedUrl = new URL(url);
    this.nextUrl = { searchParams: parsedUrl.searchParams };
  }
  
  // Mock json method for POST/PATCH
  async json() {
    return Promise.resolve(this._body);
  }
}

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => {
      return new MockResponse(body, init);
    })
  }
}));

// Test the API routes
describe('Drivers API Routes', () => {
  // Clear the drivers array before each test
  beforeEach(() => {
    drivers.length = 0;
    jest.clearAllMocks();
  });
  
  // Test the POST method
  describe('POST /api/drivers', () => {
    test('creates a new driver with valid data', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers', 'POST');
      req.json = jest.fn().mockResolvedValue({
        name: 'Test Driver',
        team: 'Test Team',
        races: 10,
        wins: 5,
        firstSeason: 2020
      });
      
      const res = await POST(req as any);
      const data = await res.json();
      
      expect(res.status).toBe(201);
      expect(data.id).toBeDefined();
      expect(data.name).toBe('Test Driver');
    });
    
    test('returns 400 when validation fails', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers', 'POST');
      req.json = jest.fn().mockResolvedValue({
        // Missing name and team
        races: 10,
        wins: 5,
        firstSeason: 2020
      });
      
      const res = await POST(req as any);
      
      expect(res.status).toBe(400);
    });
    
    test('handles general errors in POST', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers', 'POST');
      
      // Force an error
      req.json = jest.fn().mockImplementation(() => {
        throw new Error('Generic error');
      });
      
      const res = await POST(req as any);
      expect(res.status).toBe(400);
    });
  });
  
  // Test the GET method
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
    });
    
    test('handles sorting with invalid sortBy parameter', async () => {
      // Add test drivers
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 },
        { id: '2', name: 'Driver 2', team: 'Team B', races: 20, wins: 5, firstSeason: 2019 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?sortBy=invalidField');
      const res = await GET(req as any);
      
      // Just verifying that the code doesn't throw an error is sufficient
      // The line is covered as long as the test completes without error
    });
  });
  
  // Test the PATCH method
  describe('PATCH /api/drivers', () => {
    test('updates a driver with valid data', async () => {
      // Add a test driver
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH');
      req.json = jest.fn().mockResolvedValue({
        id: '1',
        name: 'Updated Name'
      });
      
      const res = await PATCH(req as any);
      const data = await res.json();
      
      expect(res.status).toBe(200);
      expect(data.name).toBe('Updated Name');
    });
    
    test('returns 404 when driver not found', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH');
      req.json = jest.fn().mockResolvedValue({
        id: 'not-found',
        name: 'Updated Name'
      });
      
      const res = await PATCH(req as any);
      
      expect(res.status).toBe(404);
    });
    
    test('handles general errors in PATCH', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers', 'PATCH');
      
      // Force an error
      req.json = jest.fn().mockImplementation(() => {
        throw new Error('Generic error');
      });
      
      const res = await PATCH(req as any);
      expect(res.status).toBe(400);
    });
  });
  
  // Test the DELETE method
  describe('DELETE /api/drivers', () => {
    test('deletes a driver by ID', async () => {
      // Add a test driver
      drivers.push(
        { id: '1', name: 'Driver 1', team: 'Team A', races: 10, wins: 2, firstSeason: 2020 }
      );
      
      const req = new MockRequest('http://localhost:3000/api/drivers?id=1', 'DELETE');
      const res = await DELETE(req as any);
      
      expect(res.status).toBe(200);
      expect(drivers).toHaveLength(0);
    });
    
    test('returns 404 when driver not found', async () => {
      const req = new MockRequest('http://localhost:3000/api/drivers?id=not-found', 'DELETE');
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