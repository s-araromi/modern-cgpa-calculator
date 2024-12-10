export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

export interface Semester {
  id: string;
  name: string;
  courses: Course[];
}

export interface AcademicGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetCGPA: number;
  status: 'active' | 'completed' | 'abandoned';
}

export interface PerformanceStats {
  cgpa: number;
  totalCredits: number;
  gradeDistribution: Record<string, number>;
}

export interface MockStorage {
  users: User[];
  courses: Course[];
  semesters: Semester[];
  goals: AcademicGoal[];
}
