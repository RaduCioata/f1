// Define mock objects for Next.js API routes testing
export class MockRequest {
  url: string;
  method: string;
  headers: Headers;
  private _body: any;
  nextUrl: URL;

  constructor(url: string, method = 'GET', body?: any) {
    this.url = url;
    this.method = method;
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this._body = body;
    this.nextUrl = new URL(url);
  }

  async json() {
    return Promise.resolve(this._body);
  }
}

export class MockResponse {
  status: number;
  statusText: string;
  headers: Headers;
  private _body: any;

  constructor(body?: any, options?: { status?: number; statusText?: string; headers?: Record<string, string> }) {
    this.status = options?.status || 200;
    this.statusText = options?.statusText || '';
    this.headers = new Headers(options?.headers || {});
    this._body = body;
  }

  async json() {
    return Promise.resolve(this._body);
  }
}

export const NextResponseMock = {
  json: (body: any, init?: { status?: number }) => {
    return new MockResponse(body, { status: init?.status });
  }
};

// Helper function to parse URL search params
export const parseSearchParams = (url: string): Record<string, string> => {
  const parsed = new URL(url);
  const params: Record<string, string> = {};
  
  parsed.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}; 