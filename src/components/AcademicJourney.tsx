import React, { useState } from 'react';
import { PlusCircle, Trash2, Trophy, Star, TrendingUp, Award } from 'lucide-react';

interface Semester {
  id: string;
  name: string;
  cgpa: number;
  achievements: string[];
  courses: number;
}

export function AcademicJourney() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [newSemester, setNewSemester] = useState({
    name: '',
    cgpa: '',
    achievement: '',
    courses: '',
  });

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
      },
    ]);

    setNewSemester({ name: '', cgpa: '', achievement: '', courses: '' });
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
    <div className="space-y-8">
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
}