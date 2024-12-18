export type Grade = 
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'B+'
  | 'C+';

export type GradeWithRange = 
  | 'A (70-100%)'
  | 'B (60-69%)'
  | 'C (50-59%)'
  | 'D (45-49%)'
  | 'E (40-44%)'
  | 'F (0-39%)'
  | 'B+ (65-69%)'
  | 'C+ (55-59%)'
  | 'B (60-64%)'
  | 'C (50-54%)';

export type GradeScale = '4.0' | '5.0' | '7.0';

export type GradePoints = {
  '4.0': Record<Grade, number>;
  '5.0': Record<Grade, number>;
  '7.0': Record<Grade, number>;
};

export type ActiveTab = 'CGPA calculator' | 'CGPA converter' | 'semester';

export const gradePoints: GradePoints = {
  '4.0': {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'E': 0.5,
    'F': 0.0,
    'B+': 3.5,
    'C+': 2.5
  },
  '5.0': {
    'A': 5.0,
    'B': 4.0,
    'C': 3.0,
    'D': 2.0,
    'E': 1.0,
    'F': 0.0,
    'B+': 4.5,
    'C+': 3.5
  },
  '7.0': {
    'A': 7.0,
    'B': 5.0,
    'C': 3.0,
    'D': 2.0,
    'E': 1.0,
    'F': 0.0,
    'B+': 6.0,
    'C+': 4.0
  }
};
