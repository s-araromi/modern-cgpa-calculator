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

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
    statusText: 'OK',
  } as Response)
);

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
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
