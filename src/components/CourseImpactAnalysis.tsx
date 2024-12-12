import React from 'react';

import { supabase } from '../config/supabase';


interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

type GradeScale = '4.0' | '5.0' | '7.0';
type GradePoints = Record<GradeScale, Record<string, number>>;

interface Props {
  courses: Course[];
  cgpa: number;
  scale: GradeScale;
  gradePoints: GradePoints;
}

const CourseImpactAnalysis: React.FC<Props> = ({ courses, cgpa, scale, gradePoints }) => {
  const calculateImpact = (course: Course): number => {
    const currentPoints = gradePoints[scale][course.grade] * course.credits;
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    const totalPoints = cgpa * totalCredits;
    
    // Calculate CGPA without this course
    const newTotalCredits = totalCredits - course.credits;
    const newTotalPoints = totalPoints - currentPoints;
    const newCGPA = newTotalCredits > 0 ? newTotalPoints / newTotalCredits : cgpa;
    
    return Number((cgpa - newCGPA).toFixed(2));
  };

  const getImpactColor = (impact: number): string => {
    if (impact > 0.1) return 'text-green-600';
    if (impact < -0.1) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="mt-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Course Impact Analysis</h4>
      <div className="space-y-2">
        {courses.map(course => {
          const impact = calculateImpact(course);
          return (
            <div key={course.id} className="flex justify-between items-center p-2 bg-white rounded-lg shadow-sm">
              <div className="flex-1">
                <span className="font-medium">{course.name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({course.credits} credits, Grade: {course.grade})
                </span>
              </div>
              <div className={`font-semibold ${getImpactColor(impact)}`}>
                {impact > 0 ? '+' : ''}{impact}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Numbers indicate how each course affects your overall CGPA. 
        Positive values mean the course improves your CGPA, negative values mean it lowers it.
      </p>
    </div>
  );
};

export default CourseImpactAnalysis;
