import { User, Course, Semester, AcademicGoal } from '../types/mock';

class MockStorage {
  private users: User[] = [];
  private courses: Course[] = [];
  private semesters: Semester[] = [];
  private goals: AcademicGoal[] = [];

  getUser(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  setUser(user: User): void {
    const existingIndex = this.users.findIndex(u => u.id === user.id);
    if (existingIndex !== -1) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  getGoals(userId: string): AcademicGoal[] {
    return this.goals.filter(goal => goal.userId === userId);
  }

  addGoal(goal: AcademicGoal): void {
    this.goals.push(goal);
  }

  setGoals(goals: AcademicGoal[]): void {
    this.goals = goals;
  }
}

export const mockStorage = new MockStorage();
