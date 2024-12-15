export type BaseGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type ExtendedGrade = BaseGrade | 'A+' | 'B+' | 'C+' | 'D+';
export type Grade = BaseGrade | ExtendedGrade;

export type GradeScale = '4.0' | '5.0' | '7.0';

export const gradePoints: Record<GradeScale, Record<Grade, number>> = {
  '4.0': {
    'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'E': 0.5, 'F': 0.0,
    'A+': 4.0, 'B+': 3.0, 'C+': 2.0, 'D+': 1.0
  },
  '5.0': {
    'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0,
    'A+': 5.0, 'B+': 4.0, 'C+': 3.0, 'D+': 2.0
  },
  '7.0': {
    'A': 7.0, 'B': 6.0, 'C': 5.0, 'D': 4.0, 'E': 3.0, 'F': 0.0,
    'A+': 7.0, 'B+': 6.0, 'C+': 5.0, 'D+': 4.0
  }
};

export type GradePoints = typeof gradePoints;

export type ActiveTab = 
  | 'CGPA calculator' 
  | 'CGPA converter' 
  | 'semester' 
  | 'goals' 
  | 'help';
