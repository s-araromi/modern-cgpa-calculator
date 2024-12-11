import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock TextEncoder/TextDecoder before requiring jsdom
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Initialize jsdom environment
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  features: {
    QuerySelector: true,
  },
  runScripts: 'dangerously',
});

// Set up global objects
const { window } = dom;
const { document } = window;

Object.defineProperty(global, 'window', { value: window });
Object.defineProperty(global, 'document', { value: document });
Object.defineProperty(global, 'navigator', { value: window.navigator });
Object.defineProperty(global, 'Element', { value: window.Element });
Object.defineProperty(global, 'HTMLElement', { value: window.HTMLElement });
Object.defineProperty(global, 'HTMLDivElement', { value: window.HTMLDivElement });
Object.defineProperty(global, 'getComputedStyle', { value: window.getComputedStyle });

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Extend global interfaces to avoid type issues
declare global {
  interface Window {
    fetchMock?: jest.Mock<
      Promise<Response>, 
      [input: RequestInfo | URL, init?: RequestInit]
    >;
  }
}

// Mock Response type to handle different input scenarios
class MockResponse implements Response {
  private _data: any;
  private _status: number;
  private _statusText: string;
  private _headers: Headers;

  constructor(data: any, options: { 
    status?: number, 
    statusText?: string, 
    headers?: Record<string, string> 
  } = {}) {
    this._data = data;
    this._status = options.status || 200;
    this._statusText = options.statusText || 'OK';
    this._headers = new Headers(options.headers);
  }

  get status() { return this._status; }
  get statusText() { return this._statusText; }
  get ok() { return this._status >= 200 && this._status < 300; }
  get headers() { return this._headers; }

  json() { return Promise.resolve(this._data); }
  text() { return Promise.resolve(JSON.stringify(this._data)); }
  blob() { return Promise.resolve(new Blob([JSON.stringify(this._data)])); }
  arrayBuffer() { return Promise.resolve(new ArrayBuffer(0)); }
  clone() { return new MockResponse(this._data, { 
    status: this._status, 
    statusText: this._statusText, 
    headers: Object.fromEntries(this._headers) 
  }); }
}

// Custom fetch mock that handles various input types
const createMockFetch = () => {
  const mockResponses = new Map<string, any>();

  const mockFetch = jest.fn(
    (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      // Convert input to string URL
      const url = input instanceof Request 
        ? input.url 
        : (typeof input === 'string' ? input : input.toString());

      // Get response or use default
      const responseData = mockResponses.get(url) || { 
        data: null, 
        status: 404, 
        statusText: 'Not Found' 
      };

      return Promise.resolve(
        new MockResponse(responseData.data, {
          status: responseData.status,
          statusText: responseData.statusText
        })
      );
    }
  );

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

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor() {}

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn(() => []);
}

(window as any).IntersectionObserver = MockIntersectionObserver;

// Increase test timeout
jest.setTimeout(30000);
