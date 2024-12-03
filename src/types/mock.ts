export interface User {
  id: string;
  email: string;
  fullName: string;
  password: string;
  created_at: string;
  preferences?: UserPreferences;
  lastLogin?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  emailNotifications: boolean;
  gradeScale: 'US' | 'UK' | 'Nigeria';
  language: 'en' | 'fr';
}

export interface Course {
  id: string;
  userId: string;
  name: string;
  code: string;
  type: string;
  credit: number;
  grade: number;
  semester: string;
  created_at: string;
  year: number;
  isCore?: boolean;
  notes?: string;
  status: 'completed' | 'in_progress' | 'planned';
  units: number;
}

export interface Semester {
  id: string;
  userId: string;
  year: number;
  term: 'first' | 'second';
  gpa: number;
  totalUnits: number;
  isCompleted: boolean;
  courses: string[]; // Array of course IDs
}

export interface CGPARecord {
  id: string;
  userId: string;
  semesterId: string;
  semesterGPA: number;
  cumulativeGPA: number;
  totalCredits: number;
  calculated_at: string;
  breakdown: {
    totalAs: number;
    totalBs: number;
    totalCs: number;
    totalDs: number;
    totalEs: number;
    totalFs: number;
  };
  performance: {
    trend: 'improving' | 'declining' | 'stable';
    percentageChange: number;
  };
}

export interface AcademicGoal {
  id: string;
  userId: string;
  targetCGPA: number;
  deadline: string;
  strategies: string[];
  status: 'active' | 'achieved' | 'missed';
  requiredGPA: number;
  createdAt: string;
  updatedAt: string;
}

export interface GradeDistribution {
  grade: string;
  count: number;
  percentage: number;
}

export interface PerformanceStats {
  userId: string;
  bestSubjects: string[];
  weakestSubjects: string[];
  averageUnitsPerSemester: number;
  gradeDistribution: GradeDistribution[];
  semesterPerformance: {
    semesterId: string;
    gpa: number;
    improvement: number;
  }[];
}

export interface BackupData {
  id: string;
  userId: string;
  timestamp: string;
  data: {
    user: User;
    courses: Course[];
    semesters: Semester[];
    cgpaRecords: CGPARecord[];
    academicGoals: AcademicGoal[];
    performanceStats: PerformanceStats;
  };
}

export interface StudySession {
  id: string;
  userId: string;
  courseId: string;
  startTime: string;
  endTime: string;
  duration: number;
  topic: string;
  efficiency: number; // 1-10 rating
  notes: string;
}

export interface Assignment {
  id: string;
  userId: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed' | 'overdue';
  expectedGrade: string;
  actualGrade?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface GradePrediction {
  courseId: string;
  predictedGrade: string;
  confidence: number;
  requiredScore: number;
  suggestedStudyHours: number;
}

export interface CourseRecommendation {
  courseCode: string;
  courseName: string;
  difficulty: number;
  expectedGrade: string;
  prerequisites: string[];
  reason: string;
}

export interface ImprovementSuggestion {
  type: 'study' | 'assignment' | 'course' | 'general';
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  actionItems: string[];
}

export interface PerformancePattern {
  courseType: string;
  averageGrade: number;
  timeOfDay: string;
  studyHours: number;
  assignmentCompletion: number;
  attendanceRate: number;
}

export interface GradePredictionModel {
  courseId: string;
  predictedGrade: number;
  confidence: number;
  factors: {
    historicalPerformance: number;
    studyHabits: number;
    assignmentScore: number;
    attendanceImpact: number;
    timeManagement: number;
  };
  recommendations: string[];
}

export interface PredictionMetrics {
  accuracy: number;
  reliability: number;
  lastUpdated: string;
  sampleSize: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface StorageData {
  users: User[];
  courses: Course[];
  cgpaRecords: CGPARecord[];
  currentUser: User | null;
  semesters: Semester[];
  academicGoals: AcademicGoal[];
  performanceStats: Record<string, PerformanceStats>;
  studyTracking: StudySession[];
  assignments: Assignment[];
  backups: Record<string, BackupData[]>;
}

import { AuthResponse } from './auth';

export interface MockStorage {
  currentUser: User | null;
  session: { user: User | null };
  init: () => void;
  getData: () => StorageData;
  saveData: (data: StorageData) => void;
  users: {
    create: (data: Omit<User, "id" | "created_at">) => User;
    update: (id: string, data: Partial<User>) => User;
    delete: (id: string) => void;
    get: (id: string) => User | null;
    getAll: () => User[];
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    logout: () => void;
  };
  studyTracking: {
    create: (data: Omit<StudySession, "id">) => StudySession;
    update: (id: string, data: Partial<StudySession>) => StudySession;
    delete: (id: string) => void;
    get: (id: string) => StudySession | null;
    getAll: (userId: string) => StudySession[];
  };
  assignments: {
    create: (data: Omit<Assignment, "id">) => Assignment;
    update: (id: string, data: Partial<Assignment>) => Assignment;
    delete: (id: string) => void;
    get: (id: string) => Assignment | null;
    getAll: (userId: string) => Assignment[];
  };
  utils: {
    calculateGPA: (courses: Course[]) => number;
    generateId: () => string;
  };
  backups: {
    create: (userId: string, data: Omit<BackupData, "id" | "timestamp">) => BackupData;
    restore: (backupId: string) => void;
    getAll: (userId: string) => BackupData[];
    getById: (backupId: string) => BackupData;
    delete: (backupId: string) => void;
  };
  performanceStats: {
    calculate: (userId: string) => PerformanceStats;
    get: (userId: string) => PerformanceStats;
  };
}
