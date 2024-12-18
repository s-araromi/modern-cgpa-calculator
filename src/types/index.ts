export type GradeScale = '4.0' | '5.0' | '7.0';
export type Grade = 
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
export type GradePoints = {
  '4.0': Record<Grade, number>;
  '5.0': Record<Grade, number>;
  '7.0': Record<Grade, number>;
};
export type ActiveTab = 'CGPA calculator' | 'CGPA converter' | 'semester';

export const gradePoints: GradePoints = {
  '4.0': {
    'A (70-100%)': 4.0,
    'B (60-69%)': 3.0,
    'C (50-59%)': 2.0,
    'D (45-49%)': 1.0,
    'E (40-44%)': 0.5,
    'F (0-39%)': 0.0
  },
  '5.0': {
    'A (70-100%)': 5.0,
    'B (60-69%)': 4.0,
    'C (50-59%)': 3.0,
    'D (45-49%)': 2.0,
    'E (40-44%)': 1.0,
    'F (0-39%)': 0.0
  },
  '7.0': {
    'A (70-100%)': 7.0,
    'B+ (65-69%)': 6.0,
    'B (60-64%)': 5.0,
    'C+ (55-59%)': 4.0,
    'C (50-54%)': 3.0,
    'D (45-49%)': 2.0,
    'E (40-44%)': 1.0,
    'F (0-39%)': 0.0
  }
};
