import axios from 'axios';

// For development, use mock API
const IS_MOCK = true;
const BASE_URL = IS_MOCK ? '' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock API responses
const mockResponses: Record<string, any> = {
  '/auth/register': {
    token: 'mock-token',
    user: {
      id: 1,
      email: '',
      fullName: '',
    },
  },
  '/auth/login': {
    token: 'mock-token',
    user: {
      id: 1,
      email: '',
      fullName: '',
    },
  },
  '/auth/me': {
    id: 1,
    email: '',
    fullName: '',
  },
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with mock support
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (IS_MOCK && error.config?.url) {
      // Mock successful response
      const mockData = mockResponses[error.config.url];
      if (mockData) {
        if (error.config.method === 'post' && error.config.data) {
          const requestData = JSON.parse(error.config.data);
          if ('user' in mockData) {
            mockData.user.email = requestData.email;
            mockData.user.fullName = requestData.fullName;
          } else {
            mockData.email = requestData.email;
            mockData.fullName = requestData.fullName;
          }
        }
        return Promise.resolve({ data: mockData });
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
