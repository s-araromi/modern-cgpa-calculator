import { mockStorage } from './mockStorage';

// Mock API response delay
const DELAY = 500;

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API response wrapper
const mockResponse = async <T>(data: T): Promise<{ data: T }> => {
  await delay(DELAY);
  return { data };
};

// Mock error response
const mockError = (message: string) => {
  throw new Error(message);
};

// Auth API
export const mockAuthAPI = {
  getCurrentUser: async () => {
    const user = mockStorage.getUser();
    if (!user) {
      // For development, create a mock user if none exists
      const mockUser = {
        id: '1',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'student' as const,
      };
      mockStorage.setUser(mockUser);
      return mockResponse(mockUser);
    }
    return mockResponse(user);
  },
};

// Goals API
export const mockGoalsAPI = {
  getAll: async () => {
    const goals = mockStorage.getGoals();
    return mockResponse(goals);
  },

  create: async (data: any) => {
    const newGoal = {
      id: Date.now().toString(),
      ...data,
      currentCGPA: 0,
      progress: 0,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStorage.addGoal(newGoal);
    return mockResponse(newGoal);
  },

  update: async (id: string, data: any) => {
    const goals = mockStorage.getGoals();
    const goalIndex = goals.findIndex(g => g.id === id);
    if (goalIndex === -1) {
      return mockError('Goal not found');
    }
    const updatedGoal = {
      ...goals[goalIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    goals[goalIndex] = updatedGoal;
    mockStorage.setGoals(goals);
    return mockResponse(updatedGoal);
  },

  delete: async (id: string) => {
    const goals = mockStorage.getGoals();
    const filteredGoals = goals.filter(g => g.id !== id);
    mockStorage.setGoals(filteredGoals);
    return mockResponse({ success: true });
  },
};
