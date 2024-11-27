import { useState, type FC, useEffect, useCallback, useMemo } from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import CourseImpactAnalysis from './CourseImpactAnalysis';
import PerformanceTrends from './PerformanceTrends';
import ReportExporter from './ReportExporter';
import AchievementSystem from './AchievementSystem';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

type GradeScale = '4.0' | '5.0' | '7.0';
type GradePoints = Record<GradeScale, Record<string, number>>;

const CGPAForm: FC = () => {
  const [scale, setScale] = useState<GradeScale>('4.0');
  const [courses, setCourses] = useState<Course[]>([]);
  const [cgpa, setCGPA] = useState<number | null>(null);
  const [previousCGPA, setPreviousCGPA] = useState<number | null>(null);
  const [consecutiveImprovement, setConsecutiveImprovement] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [courses]);

  const gradePoints: GradePoints = {
    '4.0': {
      'A': 4.0,  // 70-100%
      'B': 3.0,  // 60-69%
      'C': 2.0,  // 50-59%
      'D': 1.0,  // 45-49%
      'E': 0.0,  // 40-44%
      'F': 0.0   // Below 40%
    },
    '5.0': {
      'A': 5.0,  // 70-100%
      'B': 4.0,  // 60-69%
      'C': 3.0,  // 50-59%
      'D': 2.0,  // 45-49%
      'E': 1.0,  // 40-44%
      'F': 0.0   // 0-39%
    },
    '7.0': {
      'A': 7.0,   // 70-100%
      'B+': 6.0,  // 65-69%
      'B': 5.0,   // 60-64%
      'C+': 4.0,  // 55-59%
      'C': 3.0,   // 50-54%
      'D': 2.0,   // 45-49%
      'E': 1.0,   // 40-44%
      'F': 0.0    // Below 40%
    }
  };

  const degreeClassification: Record<GradeScale, { min: number; max: number; class: string }[]> = {
    '4.0': [
      { min: 3.5, max: 4.0, class: 'First Class Honours' },
      { min: 3.0, max: 3.49, class: 'Second Class Honours (Upper Division)' },
      { min: 2.0, max: 2.99, class: 'Second Class Honours (Lower Division)' },
      { min: 1.0, max: 1.99, class: 'Third Class Honours' },
      { min: 0, max: 0.99, class: 'Fail' }
    ],
    '5.0': [
      { min: 4.5, max: 5.0, class: 'First Class' },
      { min: 3.5, max: 4.49, class: 'Second Class Upper' },
      { min: 2.5, max: 3.49, class: 'Second Class Lower' },
      { min: 1.5, max: 2.49, class: 'Third Class' },
      { min: 1.0, max: 1.49, class: 'Pass' },
      { min: 0, max: 0.99, class: 'Fail' }
    ],
    '7.0': [
      { min: 6.0, max: 7.0, class: 'First Class Honours' },
      { min: 5.0, max: 5.99, class: 'Second Class Honours (Upper Division)' },
      { min: 4.0, max: 4.99, class: 'Second Class Honours (Lower Division)' },
      { min: 3.0, max: 3.99, class: 'Third Class Honours' },
      { min: 0, max: 2.99, class: 'Fail' }
    ]
  };

  const getDegreeClassification = (cgpa: number | null, scale: GradeScale): string => {
    if (cgpa === null) return 'Not Available';
    
    const classification = degreeClassification[scale].find(
      (cls) => cgpa >= cls.min && cgpa <= cls.max
    );
    
    return classification ? classification.class : 'Not Available';
  };

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: '', grade: '', credits: 3 }]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => {
      if (course.id === id) {
        if (field === 'credits') {
          const numValue = Number(value);
          if (numValue < 0) return course;
          if (numValue > 6) return { ...course, credits: 6 };
          return { ...course, credits: numValue };
        }
        return { ...course, [field]: value };
      }
      return course;
    }));
  };

  const calculateCGPA = useCallback(() => {
    try {
      console.log('Starting CGPA calculation');
      console.log('Current courses:', courses);
      setError(null);

      if (courses.length === 0) {
        setError('Please add at least one course');
        return;
      }

      let totalPoints = 0;
      let totalCredits = 0;

      const validCourses = courses.filter(course => 
        course.name.trim() !== '' && 
        course.grade && 
        course.credits > 0 && 
        gradePoints[scale][course.grade] !== undefined
      );

      console.log('Valid courses:', validCourses);

      if (validCourses.length === 0) {
        setError('Please enter valid course details (name, grade, and credits) for at least one course');
        return;
      }

      validCourses.forEach((course) => {
        const points = gradePoints[scale][course.grade];
        console.log(`Course: ${course.name}, Grade: ${course.grade}, Points: ${points}, Credits: ${course.credits}`);
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      });

      console.log('Total points:', totalPoints);
      console.log('Total credits:', totalCredits);

      const newCGPA = Number((totalPoints / totalCredits).toFixed(2));
      console.log('Calculated CGPA:', newCGPA);
      
      if (cgpa !== null) {
        setPreviousCGPA(cgpa);
        setConsecutiveImprovement(newCGPA > cgpa ? prev => prev + 1 : 0);
      }

      setTotalCredits(totalCredits);
      setCGPA(newCGPA);
    } catch (err) {
      console.error('Error calculating CGPA:', err);
      setError('An error occurred while calculating CGPA');
    }
  }, [courses, scale, cgpa, gradePoints]);

  const getGradeOptions = (scale: GradeScale) => {
    const ranges = {
      '4.0': {
        'A': '70-100%',
        'B': '60-69%',
        'C': '50-59%',
        'D': '45-49%',
        'E': '40-44%',
        'F': '0-39%'
      },
      '5.0': {
        'A': '70-100%',
        'B': '60-69%',
        'C': '50-59%',
        'D': '45-49%',
        'E': '40-44%',
        'F': '0-39%'
      },
      '7.0': {
        'A': '70-100%',
        'B+': '65-69%',
        'B': '60-64%',
        'C+': '55-59%',
        'C': '50-54%',
        'D': '45-49%',
        'E': '40-44%',
        'F': '0-39%'
      }
    };

    return Object.entries(gradePoints[scale]).map(([grade, point]) => ({
      grade,
      point,
      range: ranges[scale][grade]
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Choose your Grading Scale</h2>
        <div className="flex gap-4 mb-4">
          <select
            value={scale}
            onChange={(e) => setScale(e.target.value as GradeScale)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="4.0">4.0 Scale (Standard US Scale)</option>
            <option value="5.0">5.0 Scale (Nigerian Scale)</option>
            <option value="7.0">7.0 Scale (Advanced Scale)</option>
          </select>
        </div>

        {/* Grade Scale Information */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Grade Scale Information</h3>
          <div className="grid grid-cols-3 gap-4">
            {getGradeOptions(scale).map(({ grade, point, range }) => (
              <div key={grade} className="bg-gray-50 p-2 rounded">
                <span className="font-semibold">{grade}</span>
                <span className="text-gray-600 ml-2">({range})</span>
                <span className="block text-sm text-gray-500">{point} points</span>
              </div>
            ))}
          </div>
          
          {/* Help and Documentation */}
          <div className="mt-4 text-sm text-gray-600">
            <h4 className="font-semibold mb-2">Understanding Grade Scales:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>4.0 Scale:</strong> Standard US grading system used by most universities. A = 4.0 (Excellent), F = 0.0 (Fail)</li>
              <li><strong>5.0 Scale:</strong> Common in Nigerian universities. A = 5.0 (Excellent), F = 0.0 (Fail)</li>
              <li><strong>7.0 Scale:</strong> Advanced scale with more grade points for finer differentiation. A = 7.0 (Excellent), F = 0.0 (Fail)</li>
            </ul>
            <h4 className="font-semibold mt-4 mb-2">How to Use:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select your institution's grading scale</li>
              <li>Add your courses using the "Add Course" button</li>
              <li>For each course:
                <ul className="list-disc pl-5 mt-1">
                  <li>Enter the course name</li>
                  <li>Select your grade (includes percentage range)</li>
                  <li>Enter course units/credits (typically 1-6)</li>
                </ul>
              </li>
              <li>Click "Calculate CGPA" to see your results</li>
            </ol>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Course List */}
        <div className="space-y-4">
          {/* Course Entry Labels */}
          <div className="grid grid-cols-[1fr,auto,auto,auto] gap-4 px-4">
            <label className="text-sm font-medium text-gray-700">Select Course Name</label>
            <label className="text-sm font-medium text-gray-700 w-48">Select Grade</label>
            <label className="text-sm font-medium text-gray-700 w-32">Select Course Unit</label>
            <div className="w-10"></div>
          </div>
          
          {courses.map((course) => (
            <div key={course.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                placeholder="Enter course name"
                className="flex-1 border rounded px-3 py-2"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="border rounded px-3 py-2 w-48"
              >
                <option value="">Select your grade</option>
                {getGradeOptions(scale).map(({ grade, range }) => (
                  <option key={grade} value={grade}>
                    {grade} ({range})
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                min="0"
                max="6"
                className="w-32 border rounded px-3 py-2"
                placeholder="Enter units"
              />
              <button
                onClick={() => removeCourse(course.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
                title="Remove course"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={addCourse}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PlusCircle className="w-5 h-5" />
            Add Course
          </button>
          <button
            onClick={calculateCGPA}
            disabled={courses.length === 0}
            className={`px-4 py-2 text-white rounded-lg ${
              courses.length === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Calculate CGPA
          </button>
        </div>
      </div>

      {/* Display CGPA and Classification */}
      {cgpa !== null && !error && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <div className="text-xl font-semibold mb-2">
            Current CGPA: {cgpa?.toFixed(2)}
          </div>
          <div className="text-lg">
            Degree Classification: {getDegreeClassification(cgpa, scale)}
          </div>
          {previousCGPA !== null && (
            <div className="mt-2 text-sm">
              Previous CGPA: {previousCGPA?.toFixed(2)}
              <span className="ml-2">
                {cgpa > previousCGPA ? (
                  <span className="text-green-600">↑ Improved</span>
                ) : cgpa < previousCGPA ? (
                  <span className="text-red-600">↓ Decreased</span>
                ) : (
                  <span className="text-gray-600">→ Maintained</span>
                )}
              </span>
            </div>
          )}
          <div className="mt-2 text-sm text-gray-600">
            Total Credits: {totalCredits}
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {cgpa !== null && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CourseImpactAnalysis
            courses={courses}
            gradePoints={gradePoints}
            scale={scale}
          />
          <PerformanceTrends
            cgpa={cgpa}
            previousCGPA={previousCGPA}
            scale={scale}
            consecutiveImprovement={consecutiveImprovement}
            totalCredits={totalCredits}
          />
        </div>
      )}
    </div>
  );
};

export default CGPAForm;