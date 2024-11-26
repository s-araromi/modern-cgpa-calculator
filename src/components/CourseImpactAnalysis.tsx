import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface CourseImpact {
  course: Course;
  impact: number;
  contribution: number;
  potentialImprovement: number;
  recommendation: string;
}

interface CourseImpactAnalysisProps {
  courses: Course[];
  scale: '4.0' | '5.0' | '7.0';
  gradePoints: Record<string, Record<string, number>>;
  currentCGPA: number;
}

const CourseImpactAnalysis: React.FC<CourseImpactAnalysisProps> = ({
  courses,
  scale,
  gradePoints,
  currentCGPA
}) => {
  const calculateImpact = (courses: Course[]): CourseImpact[] => {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const maxGradePoint = Math.max(...Object.values(gradePoints[scale]));
    
    return courses.map(course => {
      const coursePoints = course.grade ? gradePoints[scale][course.grade] : 0;
      const contribution = (coursePoints * course.credits) / totalCredits;
      const maxPossibleContribution = (maxGradePoint * course.credits) / totalCredits;
      const potentialImprovement = maxPossibleContribution - contribution;
      
      let impact = (coursePoints * course.credits) / totalCredits;
      impact = Number((impact / currentCGPA * 100).toFixed(1));

      let recommendation = '';
      if (!course.grade) {
        recommendation = 'Grade not set';
      } else if (coursePoints === maxGradePoint) {
        recommendation = 'Excellent! Maintain this performance';
      } else if (course.credits >= 3 && potentialImprovement > 0.3) {
        recommendation = 'High-impact course - focus on improvement';
      } else if (potentialImprovement > 0) {
        recommendation = 'Room for improvement';
      }

      return {
        course,
        impact,
        contribution,
        potentialImprovement,
        recommendation
      };
    });
  };

  const courseImpacts = calculateImpact(courses);
  const sortedImpacts = [...courseImpacts].sort((a, b) => b.impact - a.impact);

  const getImpactColor = (impact: number) => {
    if (impact >= 25) return 'text-green-600';
    if (impact >= 15) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getImpactIcon = (course: CourseImpact) => {
    const currentPoints = course.course.grade ? gradePoints[scale][course.course.grade] : 0;
    const maxPoints = Math.max(...Object.values(gradePoints[scale]));
    
    if (currentPoints === maxPoints) {
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    }
    if (currentPoints === 0 || !course.course.grade) {
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
    return <Minus className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <div className="mt-8 p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Impact Analysis</h3>
      
      <div className="space-y-4">
        {sortedImpacts.map((courseImpact) => (
          <div
            key={courseImpact.course.id}
            className="p-4 bg-white/70 rounded-lg shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {getImpactIcon(courseImpact)}
                  <h4 className="font-medium text-gray-800">
                    {courseImpact.course.name || 'Unnamed Course'}
                  </h4>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {courseImpact.course.credits} credit units | Grade: {courseImpact.course.grade || 'Not set'}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${getImpactColor(courseImpact.impact)}`}>
                  {courseImpact.impact}% Impact
                </div>
                <div className="text-sm text-gray-500">
                  {courseImpact.potentialImprovement > 0
                    ? `+${(courseImpact.potentialImprovement * 100 / courseImpact.contribution).toFixed(1)}% potential`
                    : 'Maximum grade achieved'}
                </div>
              </div>
            </div>
            
            <div className="mt-2 text-sm">
              <span className="text-indigo-600 font-medium">Recommendation: </span>
              <span className="text-gray-600">{courseImpact.recommendation}</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{
                  width: `${(courseImpact.contribution / Math.max(...courseImpacts.map(c => c.contribution + c.potentialImprovement))) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Impact Analysis Summary</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• High-impact courses (≥25% impact) should be prioritized for maintaining or improving grades</li>
          <li>• Courses with higher credit units have more significant effects on your CGPA</li>
          <li>• Focus on courses with the highest potential improvement percentage</li>
          <li>• Consider the balance between course difficulty and potential impact</li>
        </ul>
      </div>
    </div>
  );
};

export default CourseImpactAnalysis;
