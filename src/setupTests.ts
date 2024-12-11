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

interface MockResponse {
  data?: any;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
}

interface MockRequest {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  data?: any;
}

// Extend the global fetch type to include our mock implementation
declare global {
  interface Window {
    fetchMock?: jest.Mock;
  }
}

const createMockResponse = (response: MockResponse): Response => ({
  json: () => Promise.resolve(response.data),
  status: response.status || 200,
  statusText: response.statusText || 'OK',
  ok: (response.status || 200) >= 200 && (response.status || 200) < 300,
  headers: new Headers(response.headers),
  text: () => Promise.resolve(JSON.stringify(response.data)),
  blob: () => Promise.resolve(new Blob([JSON.stringify(response.data)])),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
  clone: () => createMockResponse(response) as Response,
} as Response);

const mockFetch = jest.fn((input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input.toString();
  const mockResponses = new Map<string, MockResponse>();

  const defaultResponse: MockResponse = {
    status: 404,
    statusText: 'Not Found',
    data: null
  };

  const response = mockResponses.get(url) || defaultResponse;
  return Promise.resolve(createMockResponse(response));
});

// Override global fetch with our mock
global.fetch = mockFetch;
global.fetchMock = mockFetch;

// Utility functions for testing
export const mockFetchResponse = (url: string, response: MockResponse) => {
  const mockResponses = new Map<string, MockResponse>();
  mockResponses.set(url, {
    status: 200,
    statusText: 'OK',
    ...response
  });
};

export const clearMockFetchResponses = () => {
  const mockResponses = new Map<string, MockResponse>();
  mockResponses.clear();
};

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
