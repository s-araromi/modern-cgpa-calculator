export type GradeScale = '4.0' | '5.0' | '7.0';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type GradePoints = Record<GradeScale, Record<Grade, number>>;
export type ActiveTab = 
  | 'CGPA calculator' 
  | 'CGPA converter' 
  | 'semester' 
  | 'goals' 
  | 'study';

export const gradePoints: GradePoints = {
  '4.0': {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'E': 0.5,
    'F': 0.0
  },
  '5.0': {
    'A': 5.0,
    'B': 4.0,
    'C': 3.0,
    'D': 2.0,
    'E': 1.0,
    'F': 0.0
  },
  '7.0': {
    'A': 7.0,
    'B': 6.0,
    'C': 5.0,
    'D': 4.0,
    'E': 3.0,
    'F': 0.0
  }
};
