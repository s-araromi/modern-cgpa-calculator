import { jest } from '@jest/globals';
import authService from '../auth.service';
import api from '../api';

jest.mock('../api', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockResponse = {
      token: 'mock-token',
      user: {
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
      },
    };

    it('should successfully login user', async () => {
      const mockApiResponse = { data: mockResponse };
      (api.post as jest.MockedFunction<typeof api.post>)
        .mockResolvedValueOnce(mockApiResponse);

      const result = await authService.login(mockCredentials);

      expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
      expect(result).toEqual(mockResponse);
    });

    it('should handle login error', async () => {
      const errorMessage = 'Invalid credentials';
      const mockError = {
        response: { data: { message: errorMessage } },
      };
      (api.post as jest.MockedFunction<typeof api.post>)
        .mockRejectedValueOnce(mockError);

      await expect(authService.login(mockCredentials)).rejects.toThrow(errorMessage);
    });
  });

  describe('register', () => {
    const mockRegisterData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const mockResponse = {
      token: 'mock-token',
      user: {
        id: 1,
        email: 'test@example.com',
        fullName: 'Test User',
      },
    };

    it('should successfully register user', async () => {
      const mockApiResponse = { data: mockResponse };
      (api.post as jest.MockedFunction<typeof api.post>)
        .mockResolvedValueOnce(mockApiResponse);

      const result = await authService.register(mockRegisterData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', mockRegisterData);
      expect(result).toEqual(mockResponse);
    });

    it('should handle registration error', async () => {
      const errorMessage = 'Email already exists';
      const mockError = {
        response: { data: { message: errorMessage } },
      };
      (api.post as jest.MockedFunction<typeof api.post>)
        .mockRejectedValueOnce(mockError);

      await expect(authService.register(mockRegisterData)).rejects.toThrow(errorMessage);
    });
  });

  describe('getCurrentUser', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      fullName: 'Test User',
    };

    it('should successfully get current user', async () => {
      const mockApiResponse = { data: mockUser };
      (api.get as jest.MockedFunction<typeof api.get>)
        .mockResolvedValueOnce(mockApiResponse);

      const result = await authService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });

    it('should handle getCurrentUser error', async () => {
      const errorMessage = 'Unauthorized';
      const mockError = {
        response: { data: { message: errorMessage } },
      };
      (api.get as jest.MockedFunction<typeof api.get>)
        .mockRejectedValueOnce(mockError);

      await expect(authService.getCurrentUser()).rejects.toThrow(errorMessage);
    });
  });
});
