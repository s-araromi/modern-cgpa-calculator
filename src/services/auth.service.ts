import { mockStorage } from './mockStorage';
import type { User, LoginCredentials, RegisterData } from '../types/mock';
import { hashPassword, comparePasswords, generateToken } from '../utils/auth';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user by email
      const user = await mockStorage.users.findByEmail(credentials.email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const isValid = await comparePasswords(credentials.password, user.password);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

      // Set as current user
      mockStorage.currentUser = user;

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        token: generateToken(user.id),
      };
    } catch (error) {
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if email already exists
      const existingUser = await mockStorage.users.findByEmail(data.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const user = await mockStorage.users.create({
        ...data,
        password: hashedPassword
      });

      // Set as current user
      mockStorage.currentUser = user;

      return {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        token: generateToken(user.id),
      };
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return mockStorage.currentUser;
  }

  async logout(): Promise<void> {
    mockStorage.currentUser = null;
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    try {
      // Verify current user
      if (!mockStorage.currentUser || mockStorage.currentUser.id !== userId) {
        throw new Error('Unauthorized');
      }

      // Update user
      const updatedUser = await mockStorage.users.update(userId, updates);
      
      // Update current user
      mockStorage.currentUser = updatedUser;

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthService();
