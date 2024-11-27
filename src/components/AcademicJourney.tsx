import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Trophy, Star, TrendingUp, Award, Download, BarChart2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface Semester {
  id: string;
  name: string;
  cgpa: number;
  achievements: string[];
  courses: number;
  courseList: {
    name: string;
    grade: string;
    units: number;
  }[];
}

const AcademicJourney = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [newSemester, setNewSemester] = useState({
    name: '',
    cgpa: '',
    achievement: '',
    courses: '',
    courseList: [],
  });
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Performance Analytics
  const calculatePerformanceMetrics = () => {
    if (semesters.length === 0) return null;

    const averageCGPA = semesters.reduce((acc, sem) => acc + sem.cgpa, 0) / semesters.length;
    const trend = semesters.length > 1 
      ? semesters[semesters.length - 1].cgpa - semesters[semesters.length - 2].cgpa 
      : 0;
    const totalCourses = semesters.reduce((acc, sem) => acc + sem.courses, 0);

    return {
      averageCGPA: averageCGPA.toFixed(2),
      trend: trend.toFixed(2),
      totalCourses,
      bestSemester: [...semesters].sort((a, b) => b.cgpa - a.cgpa)[0],
      consistency: calculateConsistency(),
    };
  };

  const calculateConsistency = () => {
    if (semesters.length < 2) return 'N/A';
    const cgpas = semesters.map(s => s.cgpa);
    const variance = cgpas.reduce((acc, val) => acc + Math.pow(val - (cgpas.reduce((a, b) => a + b) / cgpas.length), 2), 0) / cgpas.length;
    return variance < 0.25 ? 'High' : variance < 0.5 ? 'Medium' : 'Low';
  };

  // Export to PDF
  const exportToPDF = () => {
    const content = document.getElementById('academic-journey');
    if (!content) return;

    const opt = {
      margin: 1,
      filename: 'academic-journey.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(content).save();
  };

  const addSemester = () => {
    if (!newSemester.name || !newSemester.cgpa) return;

    setSemesters([
      ...semesters,
      {
        id: Date.now().toString(),
        name: newSemester.name,
        cgpa: parseFloat(newSemester.cgpa),
        achievements: newSemester.achievement ? [newSemester.achievement] : [],
        courses: parseInt(newSemester.courses) || 0,
        courseList: newSemester.courseList,
      },
    ]);

    setNewSemester({ name: '', cgpa: '', achievement: '', courses: '', courseList: [] });
  };

  const removeSemester = (id: string) => {
    setSemesters(semesters.filter((sem) => sem.id !== id));
  };

  const getProgressIndicator = (cgpa: number, index: number) => {
    if (index === 0) return null;
    const prevCGPA = semesters[index - 1].cgpa;
    if (cgpa > prevCGPA) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (cgpa < prevCGPA) return <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />;
    return <TrendingUp className="w-4 h-4 text-yellow-500 transform rotate-90" />;
  };

  const getAchievementIcon = (achievement: string) => {
    if (achievement.toLowerCase().includes('dean')) return <Award className="w-4 h-4" />;
    if (achievement.toLowerCase().includes('scholarship')) return <Trophy className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  return (
    <div className="p-6" id="academic-journey">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Academic Journey</h2>
        <div className="space-x-4">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <BarChart2 className="w-5 h-5" />
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
        </div>
      </div>

      {showAnalytics && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Performance Analytics</h3>
          {calculatePerformanceMetrics() && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Average CGPA</p>
                <p className="text-2xl font-bold text-blue-600">{calculatePerformanceMetrics()?.averageCGPA}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Current Trend</p>
                <p className={`text-2xl font-bold ${Number(calculatePerformanceMetrics()?.trend) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(calculatePerformanceMetrics()?.trend) > 0 ? '+' : ''}{calculatePerformanceMetrics()?.trend}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Consistency</p>
                <p className="text-2xl font-bold text-purple-600">{calculatePerformanceMetrics()?.consistency}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Semester Form */}
      <div className="bg-white/50 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Semester</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Semester Name (e.g., Fall 2023)"
            value={newSemester.name}
            onChange={(e) => setNewSemester({ ...newSemester, name: e.target.value })}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            step="0.01"
            placeholder="CGPA"
            value={newSemester.cgpa}
            onChange={(e) => setNewSemester({ ...newSemester, cgpa: e.target.value })}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="number"
            placeholder="Number of Courses"
            value={newSemester.courses}
            onChange={(e) => setNewSemester({ ...newSemester, courses: e.target.value })}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Achievement (optional)"
            value={newSemester.achievement}
            onChange={(e) => setNewSemester({ ...newSemester, achievement: e.target.value })}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={addSemester}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Add Semester
        </button>
      </div>

      {/* Timeline */}
      {semesters.length > 0 && (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Semester Cards */}
          <div className="space-y-6">
            {semesters.map((semester, index) => (
              <div
                key={semester.id}
                className="relative pl-20 animate-fadeIn"
              >
                {/* Timeline Dot */}
                <div className="absolute left-7 top-6 w-3 h-3 rounded-full bg-indigo-600 transform -translate-x-1/2" />

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{semester.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold text-indigo-600">{semester.cgpa.toFixed(2)}</span>
                        {getProgressIndicator(semester.cgpa, index)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {semester.courses} {semester.courses === 1 ? 'course' : 'courses'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSemester(semester.id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {semester.achievements.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {semester.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          {getAchievementIcon(achievement)}
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {semesters.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Add your first semester to start tracking your academic journey!</p>
        </div>
      )}
    </div>
  );
};

export default AcademicJourney;