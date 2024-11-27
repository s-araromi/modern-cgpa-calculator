import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Line, Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface PerformanceTrendsProps {
  cgpa: number | null;
  previousCGPA: number | null;
  scale: '4.0' | '5.0' | '7.0';
  consecutiveImprovement: number;
  totalCredits: number;
  courses?: Course[];
}

const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({
  cgpa,
  previousCGPA,
  scale,
  consecutiveImprovement,
  totalCredits,
  courses = [] // Provide default empty array
}) => {
  // Calculate grade distribution
  const calculateGradeDistribution = () => {
    if (!courses || courses.length === 0) return {};
    
    const distribution: Record<string, number> = {};
    courses.forEach(course => {
      if (course.grade) {
        distribution[course.grade] = (distribution[course.grade] || 0) + 1;
      }
    });
    return distribution;
  };

  // Calculate performance trend
  const calculatePerformanceTrend = () => {
    if (cgpa === null || previousCGPA === null) {
      return {
        trend: 'N/A',
        improvement: 0
      };
    }

    const improvement = cgpa - previousCGPA;
    let trend = 'Stable';
    if (improvement > 0) trend = 'Improving';
    if (improvement < 0) trend = 'Declining';

    return {
      trend,
      improvement: Number(improvement.toFixed(2))
    };
  };

  const performanceTrend = calculatePerformanceTrend();
  const gradeDistribution = calculateGradeDistribution();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Performance Analysis</h3>
      
      <div className="space-y-6">
        {/* Current Performance */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Current Standing</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">CGPA</p>
              <p className="text-2xl font-bold text-indigo-600">
                {cgpa?.toFixed(2) || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-indigo-600">{totalCredits}</p>
            </div>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Performance Trend</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Trend</p>
              <p className={`text-lg font-semibold ${
                performanceTrend.trend === 'Improving' ? 'text-green-600' :
                performanceTrend.trend === 'Declining' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {performanceTrend.trend}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Change</p>
              <p className={`text-lg font-semibold ${
                performanceTrend.improvement > 0 ? 'text-green-600' :
                performanceTrend.improvement < 0 ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {performanceTrend.improvement > 0 ? '+' : ''}
                {performanceTrend.improvement}
              </p>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        {Object.keys(gradeDistribution).length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Grade Distribution</h4>
            <div className="space-y-2">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="flex justify-between items-center">
                  <span className="font-medium">Grade {grade}</span>
                  <span className="text-gray-600">{count} course(s)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PerformanceTrends.defaultProps = {
  cgpa: null,
  previousCGPA: null,
  scale: '4.0',
  consecutiveImprovement: 0,
  totalCredits: 0,
  courses: []
};

export default PerformanceTrends;
