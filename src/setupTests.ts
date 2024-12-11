import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Extend global interfaces to avoid type issues
declare global {
  interface Window {
    fetchMock?: jest.MockedFunction<typeof fetch>;
  }
}

// Create a comprehensive mock response wrapper
class MockResponseWrapper implements Response {
  private _response: Response;
  private _data: any;
  private _body: Blob;

  constructor(data: any, options: { 
    status?: number, 
    statusText?: string, 
    headers?: Record<string, string> 
  } = {}) {
    // Create a base Response object
    this._body = new Blob([JSON.stringify(data)]);
    this._data = data;
    this._response = new Response(this._body, {
      status: options.status || 200,
      statusText: options.statusText || 'OK',
      headers: new Headers(options.headers)
    });
  }

  // Delegate most properties and methods to the underlying Response
  get status() { return this._response.status; }
  get statusText() { return this._response.statusText; }
  get ok() { return this._response.ok; }
  get headers() { return this._response.headers; }
  get type() { return this._response.type; }
  get url() { return this._response.url; }
  get redirected() { return this._response.redirected; }
  get body() { return this._response.body; }
  get bodyUsed() { return this._response.bodyUsed; }

  // Implement Response methods
  json() { return Promise.resolve(this._data); }
  text() { return this._response.text(); }
  blob() { return this._response.blob(); }
  arrayBuffer() { return this._response.arrayBuffer(); }
  
  // Add missing formData method
  formData(): Promise<FormData> {
    const formData = new FormData();
    if (typeof this._data === 'object') {
      Object.entries(this._data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }
    return Promise.resolve(formData);
  }
  
  clone(): Response {
    return new MockResponseWrapper(this._data, {
      status: this.status,
      statusText: this.statusText,
      headers: Object.fromEntries(this.headers)
    });
  }
}

// Create a flexible mock fetch implementation
const createMockFetch = () => {
  const mockResponses = new Map<string, any>();

  const mockFetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Determine the URL
    const url = input instanceof Request 
      ? input.url 
      : (typeof input === 'string' ? input : input.toString());

    // Get response or use default
    const responseData = mockResponses.get(url) || { 
      data: null, 
      status: 404, 
      statusText: 'Not Found' 
    };

    // Return a mock response that matches the Response interface
    return new MockResponseWrapper(responseData.data, {
      status: responseData.status,
      statusText: responseData.statusText
    });
  }) as jest.MockedFunction<typeof fetch>;

  return {
    mockFetch,
    mockFetchResponse: (url: string, response: any) => {
      mockResponses.set(url, response);
    },
    clearMockResponses: () => {
      mockResponses.clear();
    }
  };
};

// Set up global fetch mock
const { mockFetch, mockFetchResponse, clearMockResponses } = createMockFetch();
(global as any).fetch = mockFetch;
(global as any).window = { 
  ...global.window, 
  fetchMock: mockFetch 
};

// Export utility functions
export { mockFetchResponse, clearMockResponses };

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});
