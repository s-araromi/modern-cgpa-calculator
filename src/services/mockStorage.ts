import type {
  User,
  Course,
  Semester,
  CGPARecord,
  AcademicGoal,
  StudySession,
  Assignment,
  GradePredictionModel,
  CourseRecommendation,
  ImprovementSuggestion,
  PerformancePattern,
  PredictionMetrics,
  PerformanceStats,
  BackupData
} from '../types/mock';

const STORAGE_KEY = 'cgpa_calculator_data';

interface StorageData {
  users: User[];
  courses: Course[];
  semesters: Semester[];
  cgpaRecords: CGPARecord[];
  academicGoals: AcademicGoal[];
  studySessions: StudySession[];
  assignments: Assignment[];
  performanceStats: Record<string, PerformanceStats>;
  gradePredictions: Record<string, GradePredictionModel[]>;
  courseRecommendations: Record<string, CourseRecommendation[]>;
  improvementSuggestions: Record<string, ImprovementSuggestion[]>;
  backups: Record<string, BackupData[]>;
  goals: AcademicGoal[];
}

const defaultData: StorageData = {
  users: [],
  courses: [],
  semesters: [],
  cgpaRecords: [],
  academicGoals: [],
  studySessions: [],
  assignments: [],
  performanceStats: {},
  gradePredictions: {},
  courseRecommendations: {},
  improvementSuggestions: {},
  backups: {},
  goals: []
};

// Utility function to generate unique IDs
const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const mockStorage = {
  // Current user state
  currentUser: null as User | null,

  // Data management
  init: () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
  },

  getData: (): StorageData => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
  },

  saveData: (data: StorageData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // User management
  users: {
    create: (data: Omit<User, 'id' | 'created_at'>): User => {
      const storage = mockStorage.getData();
      const newUser: User = {
        ...data,
        id: generateId(),
        created_at: new Date().toISOString()
      };
      storage.users.push(newUser);
      mockStorage.saveData(storage);
      return newUser;
    },

    findByEmail: (email: string): User | null => {
      const storage = mockStorage.getData();
      return storage.users.find(u => u.email === email) || null;
    },

    update: (id: string, data: Partial<User>): User => {
      const storage = mockStorage.getData();
      const index = storage.users.findIndex(u => u.id === id);
      if (index === -1) throw new Error('User not found');
      
      storage.users[index] = { ...storage.users[index], ...data };
      mockStorage.saveData(storage);
      return storage.users[index];
    },

    delete: (id: string): void => {
      const storage = mockStorage.getData();
      storage.users = storage.users.filter(u => u.id !== id);
      mockStorage.saveData(storage);
    },

    get: (id: string): User | null => {
      const storage = mockStorage.getData();
      return storage.users.find(u => u.id === id) || null;
    },

    authenticate: (email: string, password: string): User | null => {
      const storage = mockStorage.getData();
      const user = storage.users.find(u => u.email === email && u.password === password);
      if (user) {
        mockStorage.currentUser = user;
        mockStorage.users.update(user.id, { lastLogin: new Date().toISOString() });
      }
      return user || null;
    },

    logout: () => {
      mockStorage.currentUser = null;
    }
  },

  // Course management
  courses: {
    create: (data: Omit<Course, 'id' | 'created_at'>): Course => {
      const storage = mockStorage.getData();
      const newCourse: Course = {
        ...data,
        id: generateId(),
        created_at: new Date().toISOString()
      };
      storage.courses.push(newCourse);
      mockStorage.saveData(storage);
      return newCourse;
    },

    update: (id: string, data: Partial<Course>): Course => {
      const storage = mockStorage.getData();
      const index = storage.courses.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Course not found');
      
      storage.courses[index] = { ...storage.courses[index], ...data };
      mockStorage.saveData(storage);
      return storage.courses[index];
    },

    delete: (id: string): void => {
      const storage = mockStorage.getData();
      storage.courses = storage.courses.filter(c => c.id !== id);
      mockStorage.saveData(storage);
    },

    get: (id: string): Course | null => {
      const storage = mockStorage.getData();
      return storage.courses.find(c => c.id === id) || null;
    },

    getAll: (userId: string): Course[] => {
      const storage = mockStorage.getData();
      return storage.courses.filter(c => c.userId === userId);
    }
  },

  get cgpaRecords(): CGPARecord[] {
    return mockStorage.getData().cgpaRecords;
  },

  get performanceStats(): Record<string, PerformanceStats> {
    return mockStorage.getData().performanceStats;
  },

  // Academic goals management
  academicGoals: {
    create: (data: Omit<AcademicGoal, 'id' | 'status' | 'requiredGPA' | 'createdAt' | 'updatedAt'>): AcademicGoal => {
      const storage = mockStorage.getData();
      const newGoal: AcademicGoal = {
        ...data,
        id: generateId(),
        status: 'active',
        requiredGPA: 0, // Will be calculated
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      storage.academicGoals.push(newGoal);
      mockStorage.saveData(storage);
      return newGoal;
    },

    update: (id: string, data: Partial<AcademicGoal>): AcademicGoal => {
      const storage = mockStorage.getData();
      const index = storage.academicGoals.findIndex(g => g.id === id);
      if (index === -1) throw new Error('Goal not found');
      
      storage.academicGoals[index] = {
        ...storage.academicGoals[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      mockStorage.saveData(storage);
      return storage.academicGoals[index];
    },

    delete: (id: string): void => {
      const storage = mockStorage.getData();
      storage.academicGoals = storage.academicGoals.filter(g => g.id !== id);
      mockStorage.saveData(storage);
    },

    get: (id: string): AcademicGoal | null => {
      const storage = mockStorage.getData();
      return storage.academicGoals.find(g => g.id === id) || null;
    },

    getAll: (userId: string): AcademicGoal[] => {
      const storage = mockStorage.getData();
      return storage.academicGoals.filter(g => g.userId === userId);
    },

    checkStatus: (userId: string): void => {
      const storage = mockStorage.getData();
      const goals = storage.academicGoals.filter(g => g.userId === userId && g.status === 'active');
      const cgpaRecords = storage.cgpaRecords.filter(r => r.userId === userId);
      
      goals.forEach(goal => {
        const deadline = new Date(goal.deadline);
        const now = new Date();
        const latestCGPA = cgpaRecords.length > 0 ? 
          cgpaRecords.sort((a, b) => new Date(b.calculated_at).getTime() - new Date(a.calculated_at).getTime())[0].cumulativeGPA : 
          0;

        if (deadline < now) {
          mockStorage.academicGoals.update(goal.id, {
            status: latestCGPA >= goal.targetCGPA ? 'achieved' : 'missed'
          });
        }
      });
    }
  },

  // Predictions and performance analysis
  predictions: {
    generatePrediction: (userId: string, courseId: string): GradePredictionModel => {
      const storage = mockStorage.getData();
      const course = storage.courses.find(c => c.id === courseId);
      if (!course) throw new Error('Course not found');

      const studySessions = storage.studySessions.filter(s => s.courseId === courseId);
      const assignments = storage.assignments.filter(a => a.courseId === courseId);
      
      // Calculate prediction factors
      const historicalPerformance = course.grade || 0;
      const studyHabits = studySessions.reduce((sum, s) => sum + s.efficiency, 0) / (studySessions.length || 1);
      const assignmentScore = assignments.filter(a => a.status === 'completed').length / (assignments.length || 1);
      const attendanceImpact = Math.random() * 0.2 + 0.8; // Mock attendance impact
      const timeManagement = Math.random() * 0.2 + 0.8; // Mock time management score

      const prediction: GradePredictionModel = {
        courseId,
        predictedGrade: Math.min(5.0, (historicalPerformance * 0.3 + 
          studyHabits * 0.25 + 
          assignmentScore * 0.25 + 
          attendanceImpact * 0.1 + 
          timeManagement * 0.1) * 1.1),
        confidence: Math.min(100, (studySessions.length * 10 + assignments.length * 5) / 2),
        factors: {
          historicalPerformance,
          studyHabits,
          assignmentScore,
          attendanceImpact,
          timeManagement
        },
        recommendations: []
      };

      // Generate recommendations based on factors
      if (studyHabits < 0.7) {
        prediction.recommendations.push('Increase study session efficiency');
      }
      if (assignmentScore < 0.8) {
        prediction.recommendations.push('Complete more assignments on time');
      }
      if (timeManagement < 0.85) {
        prediction.recommendations.push('Improve time management skills');
      }

      // Store prediction
      if (!storage.gradePredictions[userId]) {
        storage.gradePredictions[userId] = [];
      }
      const existingIndex = storage.gradePredictions[userId].findIndex(p => p.courseId === courseId);
      if (existingIndex >= 0) {
        storage.gradePredictions[userId][existingIndex] = prediction;
      } else {
        storage.gradePredictions[userId].push(prediction);
      }
      mockStorage.saveData(storage);

      return prediction;
    },
    predictGrade: async (courseId: string): Promise<GradePredictionModel> => {
      const storage = mockStorage.getData();
      const course = storage.courses.find(c => c.id === courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        courseId,
        predictedGrade: 4.0,
        confidence: 0.85,
        factors: {
          historicalPerformance: 0.8,
          studyHabits: 0.75,
          assignmentScore: 0.9,
          attendanceImpact: 0.85,
          timeManagement: 0.8
        },
        recommendations: [
          'Maintain current study habits',
          'Consider increasing assignment completion rate'
        ]
      };
    },
    updatePredictionModel: (userId: string, courseId: string, newData: Partial<GradePredictionModel>): void => {
      const storage = mockStorage.getData();
      if (!storage.gradePredictions[userId]) return;

      const index = storage.gradePredictions[userId].findIndex(p => p.courseId === courseId);
      if (index >= 0) {
        storage.gradePredictions[userId][index] = {
          ...storage.gradePredictions[userId][index],
          ...newData
        };
        mockStorage.saveData(storage);
      }
    },

    getPerformancePatterns: (userId: string): PerformancePattern[] => {
      const storage = mockStorage.getData();
      const courses = storage.courses.filter(c => c.userId === userId);
      const studySessions = storage.studySessions.filter(s => s.userId === userId);
      const assignments = storage.assignments.filter(a => a.userId === userId);

      // Group courses by type
      const courseTypes = [...new Set(courses.map(c => c.type))];
      
      return courseTypes.map(type => {
        const typeCourses = courses.filter(c => c.type === type);
        const typeStudySessions = studySessions.filter(s => 
          typeCourses.some(c => c.id === s.courseId)
        );
        const typeAssignments = assignments.filter(a => 
          typeCourses.some(c => c.id === a.courseId)
        );

        // Calculate patterns
        const averageGrade = typeCourses.reduce((sum, c) => sum + c.grade, 0) / typeCourses.length;
        const studyHours = typeStudySessions.reduce((sum, s) => sum + s.duration, 0);
        const completedAssignments = typeAssignments.filter(a => a.status === 'completed').length;

        return {
          courseType: type,
          averageGrade,
          timeOfDay: typeStudySessions.length > 0 ? 
            ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)] : 'afternoon',
          studyHours,
          assignmentCompletion: typeAssignments.length > 0 ? 
            completedAssignments / typeAssignments.length * 100 : 100,
          attendanceRate: Math.random() * 20 + 80 // Mock attendance rate
        };
      });
    },

    getPredictionMetrics: (userId: string): PredictionMetrics => {
      const storage = mockStorage.getData();
      const predictions = storage.gradePredictions[userId] || [];
      const courses = storage.courses.filter(c => c.userId === userId);

      // Calculate accuracy based on predicted vs actual grades
      let totalAccuracy = 0;
      let count = 0;
      predictions.forEach(prediction => {
        const course = courses.find(c => c.id === prediction.courseId);
        if (course && course.grade) {
          const accuracy = 1 - Math.abs(prediction.predictedGrade - course.grade) / 5;
          totalAccuracy += accuracy;
          count++;
        }
      });

      return {
        accuracy: count > 0 ? totalAccuracy / count : 0.8,
        reliability: Math.min(1, (predictions.length * 0.1) + 0.5),
        lastUpdated: new Date().toISOString(),
        sampleSize: predictions.length
      };
    },

    analyzeStudyEffectiveness: (userId: string) => {
      const storage = mockStorage.getData();
      const studySessions = storage.studySessions.filter(s => s.userId === userId);
      
      // Group sessions by time of day
      const timeSlots = ['morning', 'afternoon', 'evening'];
      const effectivenessByTime: { [key: string]: number } = {};
      
      timeSlots.forEach(slot => {
        const slotSessions = studySessions.filter(s => {
          const hour = new Date(s.startTime).getHours();
          return (
            (slot === 'morning' && hour >= 5 && hour < 12) ||
            (slot === 'afternoon' && hour >= 12 && hour < 17) ||
            (slot === 'evening' && hour >= 17 && hour < 22)
          );
        });
        
        effectivenessByTime[slot] = slotSessions.length > 0 ?
          slotSessions.reduce((sum, s) => sum + s.efficiency, 0) / slotSessions.length :
          0.7;
      });

      // Find optimal study time
      const optimalTime = Object.entries(effectivenessByTime)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];

      return {
        optimalStudyTime: optimalTime,
        recommendedDuration: 120, // 2 hours recommended session length
        effectivenessByTime
      };
    }
  },

  stats: {
    calculate: (userId: string): PerformanceStats => {
      const storage = mockStorage.getData();
      const userCourses = storage.courses.filter(c => c.userId === userId);
      const userSemesters = storage.semesters.filter(s => s.userId === userId);
      
      // Calculate best and worst subjects
      const subjectPerformance = userCourses.reduce((acc, course) => {
        if (!acc[course.code]) {
          acc[course.code] = { total: 0, count: 0 };
        }
        acc[course.code].total += course.grade;
        acc[course.code].count += 1;
        return acc;
      }, {} as Record<string, { total: number; count: number }>);

      const subjectAverages = Object.entries(subjectPerformance).map(([code, perf]) => ({
        code,
        average: perf.total / perf.count
      }));

      const sortedSubjects = subjectAverages.sort((a, b) => b.average - a.average);
      
      return {
        userId,
        bestSubjects: sortedSubjects.slice(0, 3).map(s => s.code),
        weakestSubjects: sortedSubjects.slice(-3).map(s => s.code),
        averageUnitsPerSemester: userSemesters.reduce((acc, sem) => acc + sem.totalUnits, 0) / (userSemesters.length || 1),
        gradeDistribution: calculateGradeDistribution(userCourses),
        semesterPerformance: userSemesters.map(sem => ({
          semesterId: sem.id,
          gpa: sem.gpa,
          improvement: calculateSemesterImprovement(userId, sem)
        }))
      };
    }
  },

  semesters: {
    create: (data: Omit<Semester, 'id'>): Semester => {
      const storage = mockStorage.getData();
      const semester: Semester = {
        ...data,
        id: generateId()
      };
      storage.semesters.push(semester);
      mockStorage.saveData(storage);
      return semester;
    },
    getAll: (userId: string): Semester[] => {
      const storage = mockStorage.getData();
      return storage.semesters.filter(s => s.userId === userId);
    },
    update: (semesterId: string, updates: Partial<Semester>): Semester => {
      const storage = mockStorage.getData();
      const index = storage.semesters.findIndex(s => s.id === semesterId);
      if (index === -1) {
        throw new Error('Semester not found');
      }
      storage.semesters[index] = {
        ...storage.semesters[index],
        ...updates
      };
      mockStorage.saveData(storage);
      return storage.semesters[index];
    }
  },

  backups: {
    create: (userId: string, backupData: Omit<BackupData, "id" | "userId" | "timestamp">) => {
      const storage = mockStorage.getData();
      const newBackup: BackupData = {
        id: generateId(),
        userId,
        timestamp: new Date().toISOString(),
        data: backupData.data
      };

      if (!storage.backups[userId]) {
        storage.backups[userId] = [];
      }
      storage.backups[userId].push(newBackup);
      mockStorage.saveData(storage);
      return newBackup;
    },

    restore: (backupId: string): void => {
      const storage = mockStorage.getData();
      let foundBackup: BackupData | null = null;
      
      // Find the backup across all users
      for (const userBackups of Object.values(storage.backups)) {
        const backup = userBackups.find(b => b.id === backupId);
        if (backup) {
          foundBackup = backup;
          break;
        }
      }

      if (!foundBackup) {
        throw new Error('Backup not found');
      }

      // Restore the data
      const { data } = foundBackup;
      storage.courses = data.courses;
      storage.semesters = data.semesters;
      storage.cgpaRecords = data.cgpaRecords;
      storage.academicGoals = data.academicGoals;
      
      // Create a record for performance stats
      if (!storage.performanceStats[foundBackup.userId]) {
        storage.performanceStats[foundBackup.userId] = {};
      }
      storage.performanceStats[foundBackup.userId] = data.performanceStats;
      
      mockStorage.saveData(storage);
    },

    getAll: (userId: string): BackupData[] => {
      const storage = mockStorage.getData();
      return storage.backups[userId] || [];
    },

    getById: (backupId: string): BackupData => {
      const storage = mockStorage.getData();
      
      for (const userBackups of Object.values(storage.backups)) {
        const backup = userBackups.find(b => b.id === backupId);
        if (backup) {
          return backup;
        }
      }
      
      throw new Error('Backup not found');
    },

    delete: (backupId: string): void => {
      const storage = mockStorage.getData();
      
      for (const userId in storage.backups) {
        const index = storage.backups[userId].findIndex(b => b.id === backupId);
        if (index !== -1) {
          storage.backups[userId].splice(index, 1);
          mockStorage.saveData(storage);
          return;
        }
      }
      
      throw new Error('Backup not found');
    }
  },

  utils: {
    calculateGPA: (courses: Course[]): number => {
      if (courses.length === 0) return 0;
      
      const totalPoints = courses.reduce((sum, course) => sum + (course.grade * course.units), 0);
      const totalUnits = courses.reduce((sum, course) => sum + course.units, 0);
      
      return totalPoints / totalUnits;
    },

    calculateRequiredGPA: (targetCGPA: number, currentCGPA: number, remainingSemesters: number): number => {
      if (remainingSemesters <= 0) return targetCGPA;
      
      // Calculate required GPA for remaining semesters to achieve target CGPA
      const totalSemesters = mockStorage.utils.getTotalSemesters();
      const completedSemesters = totalSemesters - remainingSemesters;
      
      if (completedSemesters <= 0) return targetCGPA;
      
      return ((targetCGPA * totalSemesters) - (currentCGPA * completedSemesters)) / remainingSemesters;
    },

    calculateRemainingSemesters: (deadline: Date): number => {
      const now = new Date();
      const monthsUntilDeadline = (deadline.getFullYear() - now.getFullYear()) * 12 + deadline.getMonth() - now.getMonth();
      return Math.ceil(monthsUntilDeadline / 6); // Assuming 2 semesters per year
    },

    getTotalSemesters: (): number => {
      return 8; // Assuming 4-year program with 2 semesters per year
    }
  },

  cgpa: {
    calculate: (userId: string): number => {
      const storage = mockStorage.getData();
      const userCourses = storage.courses.filter(c => c.userId === userId);
      return mockStorage.utils.calculateGPA(userCourses);
    },
    update: (userId: string): void => {
      const storage = mockStorage.getData();
      const newCGPA = mockStorage.cgpa.calculate(userId);
      const userIndex = storage.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        storage.users[userIndex].cgpa = newCGPA;
        mockStorage.saveData(storage);
      }
    }
  },

  getUserStats: (userId: string) => {
    const storage = mockStorage.getData();
    const user = storage.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    const userCourses = storage.courses.filter(c => c.userId === userId);
    const cgpaRecords = storage.cgpaRecords.filter(r => r.userId === userId);
    const latestCGPA = cgpaRecords.length > 0 ? 
      cgpaRecords.sort((a, b) => new Date(b.calculated_at).getTime() - new Date(a.calculated_at).getTime())[0].cumulativeGPA : 
      0;

    return {
      totalCourses: userCourses.length,
      completedCourses: userCourses.filter(c => c.status === 'completed').length,
      currentCGPA: latestCGPA
    };
  },

  goals: {
    create: (userId: string, goal: Omit<AcademicGoal, "id" | "userId" | "createdAt" | "updatedAt" | "status" | "requiredGPA">) => {
      const storage = mockStorage.getData();
      const now = new Date().toISOString();
      
      // First spread the goal data, then add our computed/default values
      const newGoal: AcademicGoal = {
        ...goal,
        id: generateId(),
        userId,
        createdAt: now,
        updatedAt: now,
        status: 'active',
        requiredGPA: mockStorage.utils.calculateRequiredGPA(goal.targetCGPA, 0, mockStorage.utils.calculateRemainingSemesters(new Date(goal.deadline)))
      };
      
      storage.goals.push(newGoal);
      mockStorage.saveData(storage);
      return newGoal;
    },

    update: (goalId: string, updates: Partial<Omit<AcademicGoal, "id" | "userId" | "createdAt">>) => {
      const storage = mockStorage.getData();
      const goalIndex = storage.goals.findIndex(g => g.id === goalId);
      if (goalIndex === -1) throw new Error('Goal not found');

      const existingGoal = storage.goals[goalIndex];
      const updatedGoal: AcademicGoal = {
        ...existingGoal,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      storage.goals[goalIndex] = updatedGoal;
      mockStorage.saveData(storage);
      return updatedGoal;
    },

    delete: (goalId: string): void => {
      const storage = mockStorage.getData();
      const goalIndex = storage.goals.findIndex(g => g.id === goalId);
      if (goalIndex === -1) throw new Error('Goal not found');

      storage.goals.splice(goalIndex, 1);
      mockStorage.saveData(storage);
    },

    getAll: (userId: string): AcademicGoal[] => {
      const storage = mockStorage.getData();
      return storage.goals.filter(g => g.userId === userId);
    },

    getById: (goalId: string): AcademicGoal => {
      const storage = mockStorage.getData();
      const goal = storage.goals.find(g => g.id === goalId);
      if (!goal) throw new Error('Goal not found');
      return goal;
    }
  }
};

export default mockStorage;

function calculateGradeDistribution(courses: Course[]): { grade: string; count: number; percentage: number }[] {
  const grades = ['A', 'B', 'C', 'D', 'F'];
  const gradeCounts: { [grade: string]: number } = {};

  grades.forEach(grade => {
    gradeCounts[grade] = 0;
  });

  courses.forEach(course => {
    const grade = course.grade;
    if (grade) {
      gradeCounts[grade]++;
    }
  });

  const totalCourses = courses.length;
  return grades.map(grade => ({
    grade,
    count: gradeCounts[grade],
    percentage: (gradeCounts[grade] / totalCourses) * 100
  }));
}

function calculateSemesterImprovement(userId: string, semester: Semester): number {
  const storage = mockStorage.getData();
  const userCourses = storage.courses.filter(c => c.userId === userId);
  const semesterCourses = userCourses.filter(c => c.semesterId === semester.id);

  const semesterGPA = mockStorage.utils.calculateGPA(semesterCourses);
  const previousSemesterGPA = semester.id === '1' ? 0 : mockStorage.utils.calculateGPA(userCourses.filter(c => c.semesterId < semester.id));

  return semesterGPA - previousSemesterGPA;
}
