import { mockStorage } from './mockStorage';
import type { AcademicGoal, Semester, BackupData } from '../types/mock';

export const academicService = {
  // Goal Management
  createGoal: async (userId: string, goalData: Omit<AcademicGoal, "id" | "userId" | "createdAt" | "updatedAt" | "status" | "requiredGPA">) => {
    try {
      return mockStorage.goals.create(userId, goalData);
    } catch (error) {
      console.error('Error creating academic goal:', error);
      throw new Error('Failed to create academic goal');
    }
  },

  updateGoal: async (goalId: string, updates: Partial<Omit<AcademicGoal, "id" | "userId" | "createdAt">>) => {
    try {
      return mockStorage.goals.update(goalId, updates);
    } catch (error) {
      console.error('Error updating academic goal:', error);
      throw new Error('Failed to update academic goal');
    }
  },

  deleteGoal: async (goalId: string) => {
    try {
      mockStorage.goals.delete(goalId);
    } catch (error) {
      console.error('Error deleting academic goal:', error);
      throw new Error('Failed to delete academic goal');
    }
  },

  getAllGoals: async (userId: string) => {
    try {
      return mockStorage.goals.getAll(userId);
    } catch (error) {
      console.error('Error fetching academic goals:', error);
      throw new Error('Failed to fetch academic goals');
    }
  },

  getGoalById: async (goalId: string) => {
    try {
      return mockStorage.goals.getById(goalId);
    } catch (error) {
      console.error('Error fetching academic goal:', error);
      throw new Error('Failed to fetch academic goal');
    }
  },

  // Semester Management
  updateSemester: async (semesterId: string, updates: Partial<Semester>) => {
    try {
      return mockStorage.semesters.update(semesterId, updates);
    } catch (error) {
      console.error('Error updating semester:', error);
      throw new Error('Failed to update semester');
    }
  },

  // Backup Management
  createBackup: async (userId: string) => {
    try {
      const storage = mockStorage.getData();
      
      // Gather all user-related data
      const user = storage.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      const backupData: Omit<BackupData, "id" | "timestamp"> = {
        data: {
          user,
          courses: storage.courses.filter(c => c.userId === userId),
          semesters: storage.semesters.filter(s => s.userId === userId),
          cgpaRecords: storage.cgpaRecords.filter(r => r.userId === userId),
          academicGoals: storage.goals.getAll(userId),
          performanceStats: storage.stats.calculate(userId)
        }
      };

      return mockStorage.backups.create(userId, backupData);
    } catch (error) {
      console.error('Error creating backup:', error);
      throw new Error('Failed to create backup');
    }
  },

  restoreBackup: async (backupId: string) => {
    try {
      return mockStorage.backups.restore(backupId);
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw new Error('Failed to restore backup');
    }
  },

  getAllBackups: async (userId: string) => {
    try {
      return mockStorage.backups.getAll(userId);
    } catch (error) {
      console.error('Error fetching backups:', error);
      throw new Error('Failed to fetch backups');
    }
  },

  deleteBackup: async (backupId: string) => {
    try {
      return mockStorage.backups.delete(backupId);
    } catch (error) {
      console.error('Error deleting backup:', error);
      throw new Error('Failed to delete backup');
    }
  }
};
