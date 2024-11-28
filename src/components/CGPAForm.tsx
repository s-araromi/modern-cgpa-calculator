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

  const calculateCGPA = () => {
    console.log('Starting CGPA calculation...');
    console.log('Current courses:', courses);
    
    try {
      if (courses.length === 0) {
        console.log('No courses found');
        setError('Please add at least one course');
        return;
      }

      let totalPoints = 0;
      let totalCredits = 0;

      // Validate and calculate for each course
      for (const course of courses) {
        console.log('Processing course:', course);
        
        if (!course.name.trim() || !course.grade || course.credits <= 0) {
          console.log('Invalid course data:', { name: course.name, grade: course.grade, credits: course.credits });
          setError('Please fill in all course details (name, grade, and credits)');
          return;
        }

        const points = gradePoints[scale][course.grade];
        console.log('Grade points for', course.grade, ':', points);
        
        if (points === undefined) {
          console.log('Invalid grade points for:', course.grade);
          setError(`Invalid grade ${course.grade} for scale ${scale}`);
          return;
        }

        const coursePoints = points * course.credits;
        console.log('Course points:', coursePoints);
        
        totalPoints += coursePoints;
        totalCredits += course.credits;
      }

      console.log('Total points:', totalPoints);
      console.log('Total credits:', totalCredits);

      if (totalCredits === 0) {
        console.log('Total credits is zero');
        setError('Total credits cannot be zero');
        return;
      }

      // Calculate and update CGPA
      const newCGPA = Number((totalPoints / totalCredits).toFixed(2));
      console.log('Calculated CGPA:', newCGPA);
      
      setError(null);
      setTotalCredits(totalCredits);
      setCGPA(newCGPA);
      setPreviousCGPA(cgpa);
      
      console.log('Updated state:', {
        cgpa: newCGPA,
        totalCredits,
        error: null
      });
    } catch (err) {
      console.error('Error calculating CGPA:', err);
      setError('An error occurred while calculating CGPA');
    }
  };

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
        <h2 className="text-2xl md:text-2xl font-bold mb-4">Choose your Grading Scale</h2>
        <div className="flex gap-4 mb-4">
          <select
            value={scale}
            onChange={(e) => setScale(e.target.value as GradeScale)}
            className="border rounded px-3 py-2 w-full text-base md:text-base"
          >
            <option value="4.0">4.0 Scale (Standard US Scale)</option>
            <option value="5.0">5.0 Scale (Nigerian Scale)</option>
            <option value="7.0">7.0 Scale (Advanced Scale)</option>
          </select>
        </div>

        {/* Grade Scale Information */}
        <div className="mb-6 bg-white p-4 md:p-4 rounded-lg shadow">
          <h3 className="text-lg md:text-lg font-semibold mb-2">Grade Scale Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {getGradeOptions(scale).map(({ grade, point, range }) => (
              <div key={grade} className="bg-gray-50 p-2 md:p-2 rounded text-sm md:text-base">
                <span className="font-semibold">{grade}</span>
                <span className="text-gray-600 ml-2">({range})</span>
                <span className="block text-sm text-gray-500">{point} points</span>
              </div>
            ))}
          </div>
          
          {/* Help and Documentation */}
          <div className="mt-4 text-sm md:text-base text-gray-600">
            <h4 className="font-semibold mb-2 text-base md:text-base">Understanding Grade Scales:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>4.0 Scale:</strong> Standard US grading system used by most universities. A = 4.0 (Excellent), F = 0.0 (Fail)</li>
              <li><strong>5.0 Scale:</strong> Common in Nigerian universities. A = 5.0 (Excellent), F = 0.0 (Fail)</li>
              <li><strong>7.0 Scale:</strong> Advanced scale with more grade points for finer differentiation. A = 7.0 (Excellent), F = 0.0 (Fail)</li>
            </ul>
            <h4 className="font-semibold mt-4 mb-2 text-base md:text-base">How to Use:</h4>
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

        {/* Course List */}
        <div className="space-y-4">
          {/* Course Entry Labels */}
          <div className="grid grid-cols-[auto,1fr,auto,auto] gap-2 md:gap-4 px-2 md:px-4">
            <label className="text-sm md:text-sm font-medium text-gray-700 w-24 md:w-32">Course Unit</label>
            <label className="text-sm md:text-sm font-medium text-gray-700">Course Code</label>
            <label className="text-sm md:text-sm font-medium text-gray-700 w-32 md:w-48">Grade</label>
            <div className="w-10"></div>
          </div>
          
          {courses.map((course) => (
            <div key={course.id} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 bg-white p-3 md:p-4 rounded-lg shadow">
              <input
                type="number"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                min="0"
                max="6"
                className="w-full md:w-32 border rounded px-3 py-3 text-base md:text-base"
                placeholder="Units"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                placeholder="Enter course code"
                className="flex-1 border rounded px-3 py-3 text-base md:text-base w-full md:w-auto"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="border rounded px-3 py-3 text-base md:text-base w-full md:w-48"
              >
                <option value="">Select grade</option>
                {getGradeOptions(scale).map(({ grade, range }) => (
                  <option key={grade} value={grade}>
                    {grade} ({range})
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeCourse(course.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded w-full md:w-auto flex justify-center md:block"
                title="Remove course"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <button
            onClick={addCourse}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-base md:text-base w-full md:w-auto"
          >
            <PlusCircle className="w-5 h-5" />
            Add Course
          </button>
          <button
            onClick={calculateCGPA}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-base md:text-base w-full md:w-auto"
            disabled={courses.length === 0}
          >
            Calculate CGPA
          </button>
        </div>

        {/* Results Section */}
        {cgpa !== null && !error && (
          <div className="mt-8 p-4 md:p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Results</h3>
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-lg md:text-xl font-semibold">Your CGPA:</span>
                <span className="text-2xl md:text-3xl font-bold text-green-600">{cgpa.toFixed(2)}</span>
                <span className="text-base md:text-base text-gray-500">on {scale} scale</span>
              </div>
              
              <div className="text-base md:text-lg">
                <span className="font-medium">Degree Classification:</span>
                <span className="ml-2 text-indigo-600 font-semibold">{getDegreeClassification(cgpa, scale)}</span>
              </div>

              <div className="text-base md:text-lg">
                <span className="font-medium">Total Credits:</span>
                <span className="ml-2">{totalCredits}</span>
              </div>

              <div className="mt-4 p-3 md:p-4 bg-gray-50 rounded-lg text-sm md:text-base">
                <h4 className="font-semibold mb-2">Course Summary:</h4>
                <div className="space-y-2">
                  {courses.map(course => (
                    <div key={course.id} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-1 md:gap-0">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-gray-600">
                        Grade: {course.grade} | Credits: {course.credits}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm md:text-base">
            {error}
          </div>
        )}
      </div>

      {/* Performance Analysis Section */}
      {cgpa !== null && (
        <div className="mt-8 grid grid-cols-1 gap-6">
          <PerformanceTrends
            cgpa={cgpa}
            previousCGPA={previousCGPA}
            scale={scale}
            consecutiveImprovement={consecutiveImprovement}
            totalCredits={totalCredits}
            courses={courses}
          />
          <CourseImpactAnalysis
            courses={courses}
            scale={scale}
            gradePoints={gradePoints}
            currentCGPA={cgpa}
          />
        </div>
      )}
    </div>
  );
};

export default CGPAForm;