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
  courses: Course[];
  scale: '4.0' | '5.0' | '7.0';
  gradePoints: Record<string, Record<string, number>>;
  currentCGPA: number;
}

const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({
  courses,
  scale,
  gradePoints,
  currentCGPA
}) => {
  // Calculate grade distribution
  const calculateGradeDistribution = () => {
    const distribution: Record<string, number> = {};
    courses.forEach(course => {
      if (course.grade) {
        distribution[course.grade] = (distribution[course.grade] || 0) + 1;
      }
    });
    return distribution;
  };

  // Calculate subject area performance
  const calculateSubjectPerformance = () => {
    const subjectAreas = courses.reduce((acc: Record<string, { total: number; count: number }>, course) => {
      if (!course.grade || !course.name) return acc;
      
      // Extract subject area from course name (first word)
      const subjectArea = course.name.split(' ')[0];
      if (!acc[subjectArea]) {
        acc[subjectArea] = { total: 0, count: 0 };
      }
      acc[subjectArea].total += gradePoints[scale][course.grade];
      acc[subjectArea].count += 1;
      return acc;
    }, {});

    return Object.entries(subjectAreas).reduce((acc: Record<string, number>, [subject, data]) => {
      acc[subject] = data.total / data.count;
      return acc;
    }, {});
  };

  // Calculate credit unit distribution
  const calculateCreditDistribution = () => {
    return courses.reduce((acc: number[], course) => {
      acc[course.credits] = (acc[course.credits] || 0) + 1;
      return acc;
    }, []);
  };

  const gradeDistribution = calculateGradeDistribution();
  const subjectPerformance = calculateSubjectPerformance();
  const creditDistribution = calculateCreditDistribution();

  // Grade Distribution Chart
  const gradeDistributionData = {
    labels: Object.keys(gradeDistribution),
    datasets: [
      {
        label: 'Grade Distribution',
        data: Object.values(gradeDistribution),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  // Subject Performance Radar Chart
  const subjectPerformanceData = {
    labels: Object.keys(subjectPerformance),
    datasets: [
      {
        label: 'Average Grade Points',
        data: Object.values(subjectPerformance),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  // Credit Unit Distribution Chart
  const creditDistributionData = {
    labels: creditDistribution.map((_, i) => `${i} Units`).filter((_, i) => creditDistribution[i] > 0),
    datasets: [
      {
        label: 'Number of Courses',
        data: creditDistribution.filter(count => count > 0),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1,
      },
    ],
  };

  // Common options for charts
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Calculate performance insights
  const calculateInsights = () => {
    const insights = [];
    
    // Grade distribution insights
    const grades = Object.keys(gradeDistribution);
    const topGrade = grades[0];
    const topGradeCount = gradeDistribution[topGrade];
    insights.push(`Most common grade: ${topGrade} (${topGradeCount} courses)`);

    // Subject performance insights
    const subjects = Object.entries(subjectPerformance);
    const bestSubject = subjects.reduce((a, b) => a[1] > b[1] ? a : b);
    const worstSubject = subjects.reduce((a, b) => a[1] < b[1] ? a : b);
    insights.push(`Strongest subject area: ${bestSubject[0]} (${bestSubject[1].toFixed(2)} avg)`);
    insights.push(`Area for improvement: ${worstSubject[0]} (${worstSubject[1].toFixed(2)} avg)`);

    return insights;
  };

  const insights = calculateInsights();

  return (
    <div className="mt-8 p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Trends</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grade Distribution Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Grade Distribution</h4>
          <div className="h-64">
            <Bar data={gradeDistributionData} options={commonOptions} />
          </div>
        </div>

        {/* Subject Performance Radar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Subject Area Performance</h4>
          <div className="h-64">
            <Radar data={subjectPerformanceData} options={commonOptions} />
          </div>
        </div>

        {/* Credit Unit Distribution */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Credit Unit Distribution</h4>
          <div className="h-64">
            <Bar data={creditDistributionData} options={commonOptions} />
          </div>
        </div>

        {/* Performance Insights */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Performance Insights</h4>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-600" />
                <p className="text-gray-600">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Understanding Your Performance</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• The Grade Distribution chart shows your most common grades</li>
          <li>• Subject Area Performance highlights your strengths and areas for improvement</li>
          <li>• Credit Unit Distribution helps you understand your course load</li>
          <li>• Use these insights to focus your study efforts and improve your CGPA</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceTrends;
