export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AcademicGoal {
  id: string;
  userId: string;
  targetCGPA: number;
  currentCGPA: number;
  deadline: string;
  strategies: string[];
  progress: number;
  status: 'pending' | 'in-progress' | 'achieved' | 'missed';
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  courseId: string;
  topic: string;
  startTime: string;
  endTime: string | null;
  duration: number;
  efficiency: number;
  notes: string;
}

export interface Course {
  id: string;
  userId: string;
  code: string;
  title: string;
  units: number;
  semester: string;
  grade?: string;
  score?: number;
}
