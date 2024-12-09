import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  login: async (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getCurrentUser: async () => api.get('/auth/me'),
};

// Semester API
export const semesterAPI = {
  getAll: async () => api.get('/semesters'),
  getOne: async (id: string) => api.get(`/semesters/${id}`),
  create: async (data: any) => api.post('/semesters', data),
  update: async (id: string, data: any) => api.put(`/semesters/${id}`, data),
  delete: async (id: string) => api.delete(`/semesters/${id}`),
};

// Course API
export const courseAPI = {
  getAll: async (semesterId: string) => api.get(`/semesters/${semesterId}/courses`),
  getOne: async (semesterId: string, courseId: string) => 
    api.get(`/semesters/${semesterId}/courses/${courseId}`),
  create: async (semesterId: string, data: any) => 
    api.post(`/semesters/${semesterId}/courses`, data),
  update: async (semesterId: string, courseId: string, data: any) => 
    api.put(`/semesters/${semesterId}/courses/${courseId}`, data),
  delete: async (semesterId: string, courseId: string) => 
    api.delete(`/semesters/${semesterId}/courses/${courseId}`),
};

// Analytics API
export const analyticsAPI = {
  getSemesterAnalytics: async (semesterId: string) => 
    api.get(`/analytics/semester/${semesterId}`),
  getOverallAnalytics: async () => api.get('/analytics/overall'),
};

// Goals API
export const goalsAPI = {
  getAll: async () => api.get('/goals'),
  create: async (data: any) => api.post('/goals', data),
  update: async (id: string, data: any) => api.put(`/goals/${id}`, data),
  delete: async (id: string) => api.delete(`/goals/${id}`),
};

export default api;
