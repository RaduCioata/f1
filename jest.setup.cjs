import '@testing-library/jest-dom'; 

// Mock Next.js Request and Response objects
global.Request = class Request {
  constructor(input, init) {
    this.url = input;
    this.method = init?.method || 'GET';
    this.headers = new Headers(init?.headers || {});
    this.body = init?.body;
  }
};

global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.statusText = init?.statusText || '';
    this.headers = new Headers(init?.headers || {});
  }

  // Mock json method
  json() {
    return Promise.resolve(
      typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    );
  }
};

global.Headers = class Headers {
  constructor(init) {
    this.headers = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key, value);
      });
    }
  }

  get(name) {
    return this.headers.get(name);
  }

  set(name, value) {
    this.headers.set(name, value);
  }
}; 