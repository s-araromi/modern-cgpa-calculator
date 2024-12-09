import { AcademicGoal, StudySession, Course, User } from '../types/mock';

class MockStorage {
  private goals: AcademicGoal[] = [];
  private sessions: StudySession[] = [];
  public courses: Course[] = [];
  public currentUser: User | null = null;

  // Academic Goals
  academicGoals = {
    getAll: (userId: string) => {
      return this.goals.filter(goal => goal.userId === userId);
    },
    add: (goal: AcademicGoal) => {
      this.goals.push(goal);
      return goal;
    },
    update: (goalId: string, updates: Partial<AcademicGoal>) => {
      const index = this.goals.findIndex(g => g.id === goalId);
      if (index !== -1) {
        this.goals[index] = { ...this.goals[index], ...updates };
        return this.goals[index];
      }
      return null;
    },
    delete: (goalId: string) => {
      const index = this.goals.findIndex(g => g.id === goalId);
      if (index !== -1) {
        this.goals.splice(index, 1);
        return true;
      }
      return false;
    }
  };

  // Study Tracking
  studyTracking = {
    getAll: (userId: string) => {
      return this.sessions.filter(session => session.userId === userId);
    },
    add: (session: StudySession) => {
      this.sessions.push(session);
      return session;
    },
    update: (sessionId: string, updates: Partial<StudySession>) => {
      const index = this.sessions.findIndex(s => s.id === sessionId);
      if (index !== -1) {
        this.sessions[index] = { ...this.sessions[index], ...updates };
        return this.sessions[index];
      }
      return null;
    }
  };

  // CGPA Records
  cgpaRecords = {
    latest: (userId: string) => {
      // Mock implementation - returns a random CGPA between 2.0 and 4.0
      return parseFloat((Math.random() * 2 + 2).toFixed(2));
    }
  };
}

export const mockStorage = new MockStorage();
export default mockStorage;
