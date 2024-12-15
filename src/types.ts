export type BaseGrade = 'A' | 'B' | 'C' | 'D' | 'F';
export type ExtendedGrade = BaseGrade | 'A+' | 'B+' | 'C+' | 'D+';
export type Grade = BaseGrade | ExtendedGrade;

export type GradeScale = '4.0' | '5.0' | '7.0';

export const gradePoints: Record<BaseGrade, number> = {
  'A': 4.0,
  'B': 3.0,
  'C': 2.0,
  'D': 1.0,
  'F': 0.0
};

export const extendedGradePoints: Record<ExtendedGrade, number> = {
  ...gradePoints,
  'A+': 4.5,
  'B+': 3.5,
  'C+': 2.5,
  'D+': 1.5
};

export type GradePoints = typeof gradePoints;

export type ActiveTab = 
  | 'calculator' 
  | 'converter' 
  | 'journey' 
  | 'analysis' 
  | 'feedback' 
  | 'help';
