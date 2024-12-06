import React, { useState, useEffect } from 'react';
import { semesterAPI } from '../../services/api';
import CourseForm from './CourseForm';

interface Semester {
  id: string;
  title: string;
  level: number;
  gpa: number;
  totalUnits: number;
  isCompleted: boolean;
  courses: Course[];
}

interface Course {
  id: string;
  code: string;
  title: string;
  units: number;
  grade?: string;
  score?: number;
}

const SemesterList: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSemester, setActiveSemester] = useState<string | null>(null);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await semesterAPI.getAll();
      setSemesters(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch semesters');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSemester = async () => {
    try {
      const newSemester = {
        title: `Semester ${semesters.length + 1}`,
        level: 100,
      };
      await semesterAPI.create(newSemester);
      fetchSemesters();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add semester');
    }
  };

  const calculateOverallCGPA = () => {
    let totalPoints = 0;
    let totalUnits = 0;

    semesters.forEach(semester => {
      semester.courses.forEach(course => {
        if (course.grade && course.units) {
          const gradePoints = getGradePoints(course.grade);
          totalPoints += gradePoints * course.units;
          totalUnits += course.units;
        }
      });
    });

    return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00';
  };

  const getGradePoints = (grade: string): number => {
    const gradePoints: { [key: string]: number } = {
      'A': 5.0,
      'B': 4.0,
      'C': 3.0,
      'D': 2.0,
      'E': 1.0,
      'F': 0.0,
    };
    return gradePoints[grade] || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Semesters</h1>
          <p className="mt-2 text-sm text-gray-600">
            Overall CGPA: <span className="font-bold text-indigo-600">{calculateOverallCGPA()}</span>
          </p>
        </div>
        <button
          onClick={handleAddSemester}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Semester
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {semesters.map(semester => (
          <div
            key={semester.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {semester.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Level {semester.level} • GPA: {semester.gpa.toFixed(2)}
              </p>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="space-y-4">
                {semester.courses.map(course => (
                  <div key={course.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{course.code}</p>
                      <p className="text-sm text-gray-500">{course.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{course.grade || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{course.units} units</p>
                    </div>
                  </div>
                ))}
              </div>
              {activeSemester === semester.id && (
                <div className="mt-4">
                  <CourseForm
                    semesterId={semester.id}
                    onCourseAdded={() => {
                      fetchSemesters();
                      setActiveSemester(null);
                    }}
                  />
                </div>
              )}
              <button
                onClick={() => setActiveSemester(activeSemester === semester.id ? null : semester.id)}
                className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {activeSemester === semester.id ? 'Cancel' : 'Add Course'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemesterList;
