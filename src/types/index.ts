export type GradeScale = '4.0' | '5.0' | '7.0';
export type BaseGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type ExtendedGrade = BaseGrade | 'B+' | 'C+';
export type GradePoints = {
  '4.0': Record<BaseGrade, number>;
  '5.0': Record<BaseGrade, number>;
  '7.0': Record<ExtendedGrade, number>;
};
export type ActiveTab = 'CGPA calculator' | 'CGPA converter' | 'semester';

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
    'B+': 6.0,
    'B': 5.0,
    'C+': 4.0,
    'C': 3.0,
    'D': 2.0,
    'E': 1.0,
    'F': 0.0
  }
};
