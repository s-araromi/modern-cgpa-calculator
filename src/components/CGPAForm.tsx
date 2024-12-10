import { useState, type FC, useEffect } from 'react';
import { 
  BookOpen, 
  ArrowLeftRight, 
  GraduationCap,
  Calculator,
  RefreshCcw,
  Target,
  Trash2,
  PlusCircle
} from 'lucide-react';
import CourseImpactAnalysis from './CourseImpactAnalysis';
import ReportExporter from './ReportExporter';
import ScaleConverter from './ScaleConverter';
import SemesterList from './semester/SemesterList';
import AcademicJourney from './AcademicJourney';
import { GoalTracker } from './goals/GoalTracker';
import { StudyTracker } from './study/StudyTracker';
import { useAuth } from './auth/AuthContext';
import { supabase } from '../config/supabase';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface CGPARecord {
  id?: number;
  semester: number;
  gpa: number;
  total_credits: number;
  courses: Course[];
}

type GradeScale = '4.0' | '5.0' | '7.0';
type GradePoints = Record<GradeScale, Record<string, number>>;

type ActiveTab = 'CGPA calculator' | 'CGPA converter' | 'semester' | 'goals' | 'study';

const CGPAForm: FC = () => {
  const { user } = useAuth();
  const [scale, setScale] = useState<GradeScale>('4.0');
  const [courses, setCourses] = useState<Course[]>([]);
  const [cgpa, setCGPA] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('CGPA calculator');
  const [savedRecords, setSavedRecords] = useState<CGPARecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const gradePoints: GradePoints = {
    '4.0': {
      'A': 4.0,  // 70% and above
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
      'F': 0.0   // Below 40%
    },
    '7.0': {
      'A': 7.0,  // 70-100%
      'B+': 6.0, // 65-69%
      'B': 5.0,  // 60-64%
      'C+': 4.0, // 55-59%
      'C': 3.0,  // 50-54%
      'D': 2.0,  // 45-49%
      'E': 1.0,  // 40-44%
      'F': 0.0   // Below 40%
    }
  };

  // Fetch saved academic records when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchCGPARecords();
    }
  }, [user]);

  const fetchCGPARecords = async () => {
    try {
      const { data, error } = await supabase
        .from('cgpa_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('semester', { ascending: true });

      if (error) throw error;
      setSavedRecords(data || []);
    } catch (error) {
      console.error('Error fetching CGPA records:', error);
    }
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      grade: '',
      credits: 0
    };
    setCourses([...courses, newCourse]);
  };

  const handleCourseChange = (index: number, field: keyof Course, value: string | number) => {
    const updatedCourses = [...courses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: value
    };
    setCourses(updatedCourses);
  };

  const removeCourse = (index: number) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const calculateCGPA = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (courses.length === 0) {
        setError('Please add at least one course');
        return;
      }

      // Validate courses
      for (const course of courses) {
        if (!course.name.trim() || !course.grade || course.credits <= 0) {
          setError('Please fill in all course details (code, grade, and units)');
          return;
        }
      }

      let totalPoints = 0;
      let credits = 0;

      courses.forEach(course => {
        const points = gradePoints[scale][course.grade];
        if (points === undefined) {
          throw new Error(`Invalid grade ${course.grade} for scale ${scale}`);
        }
        totalPoints += points * course.credits;
        credits += course.credits;
      });

      if (credits === 0) {
        setError('Total credits cannot be zero');
        return;
      }

      const calculatedCGPA = Number((totalPoints / credits).toFixed(2));
      setCGPA(calculatedCGPA);
      setTotalCredits(credits);
    } catch (error: any) {
      console.error('Error calculating CGPA:', error);
      setError(error.message || 'Failed to calculate CGPA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate courses
      if (courses.length === 0) {
        throw new Error('Please add at least one course');
      }

      const invalidCourses = courses.filter(
        course => !course.name || !course.grade || !course.credits
      );

      if (invalidCourses.length > 0) {
        throw new Error('Please fill in all course details');
      }

      const gpa = calculateGPA(courses);
      const total_credits = courses.reduce((sum, course) => sum + course.credits, 0);

      // Save to Supabase
      const { data, error } = await supabase
        .from('cgpa_records')
        .insert({
          user_id: user?.id,
          semester: 1,
          gpa,
          total_credits,
          courses: JSON.stringify(courses)
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setSavedRecords([...savedRecords, data]);
      setSuccess('CGPA calculation saved successfully!');

      // Reset form
      setCourses([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateGPA = (courses: Course[]): number => {
    const gradePoints: { [key: string]: number } = {
      'A': 5.0, 'B': 4.0, 'C': 3.0, 'D': 2.0, 'E': 1.0, 'F': 0.0
    };

    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.grade && course.credits) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits === 0 ? 0 : Number((totalPoints / totalCredits).toFixed(2));
  };

  const getCGPAClassification = (cgpa: number, scale: GradeScale): string => {
    if (scale === '4.0') {
      if (cgpa >= 3.5) return 'First Class Honours';
      if (cgpa >= 3.0) return 'Second Class Honours (Upper Division)';
      if (cgpa >= 2.0) return 'Second Class Honours (Lower Division)';
      if (cgpa >= 1.0) return 'Third Class Honours';
      return 'Fail';
    }
    if (scale === '5.0') {
      if (cgpa >= 4.5) return 'First Class Honours';
      if (cgpa >= 3.5) return 'Second Class Honours (Upper Division)';
      if (cgpa >= 2.4) return 'Second Class Honours (Lower Division)';
      if (cgpa >= 1.5) return 'Third Class Honours';
      return 'Fail';
    }
    if (scale === '7.0') {
      if (cgpa >= 6.0) return 'First Class Honours';
      if (cgpa >= 5.0) return 'Second Class Honours (Upper Division)';
      if (cgpa >= 4.0) return 'Second Class Honours (Lower Division)';
      if (cgpa >= 3.0) return 'Third Class Honours';
      return 'Fail';
    }
    return '';
  };

  const renderCourseInputs = () => {
    return courses.map((course, index) => (
      <div key={course.id} className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Course Name"
          value={course.name}
          onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={course.grade}
          onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
          className="w-24 p-2 border rounded"
        >
          <option value="">Grade</option>
          {Object.keys(gradePoints[scale]).map(grade => (
            <option key={grade} value={grade}>{grade}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Credits"
          value={course.credits || ''}
          onChange={(e) => handleCourseChange(index, 'credits', parseInt(e.target.value) || 0)}
          className="w-24 p-2 border rounded"
          min="0"
          max="6"
        />
        <button
          onClick={() => removeCourse(index)}
          className="p-2 text-red-500 hover:bg-red-100 rounded"
        >
          <Trash2 size={20} />
        </button>
      </div>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Gradient Logo */}
      <div className="text-center mb-8 flex flex-col items-center">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-700 
            rounded-full flex items-center justify-center shadow-lg">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              className="fill-white w-10 h-10"
            >
              <path d="M12 3L1 9l11 6 9-4.9V17h2V9z"/>
              <path d="M2.24 9.99L12 15.48l9.77-5.49-1.54-.84L12 13.06 3.79 9.15z"/>
              <path d="M12 16.48L4.24 11.99 2.24 13.01 12 18.52l9.77-5.51-2-1.02z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-700 
            mb-2">Gradient</h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700">
          CGPA Calculator and Converter
        </h2>
      </div>

      <div className="flex space-x-4 justify-center">
        <button
          onClick={() => setActiveTab('CGPA calculator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'CGPA calculator'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calculator className="w-5 h-5" />
          CGPA Calculator
        </button>
        <button
          onClick={() => setActiveTab('CGPA converter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'CGPA converter'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <RefreshCcw className="w-5 h-5" />
          CGPA Converter
        </button>
        <button
          onClick={() => setActiveTab('semester')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'semester'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          Academic Journey
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'goals'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Target className="w-5 h-5" />
          Goals
        </button>
        <button
          onClick={() => setActiveTab('study')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'study'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Study Tracker
        </button>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        {activeTab === 'CGPA calculator' ? (
          <>
            <div>
              <h3 className="text-lg font-semibold mb-2">Choose your Grading Scale</h3>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value as GradeScale)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="4.0">4.0 Scale (Standard US Scale)</option>
                <option value="5.0">5.0 Scale (Nigerian Universities)</option>
                <option value="7.0">7.0 Scale (Advanced Scale)</option>
              </select>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Grade Scale Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {scale === '4.0' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">A (70% and above)</div>
                      <div className="text-sm text-gray-600">4.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">B (60-69%)</div>
                      <div className="text-sm text-gray-600">3.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">C (50-59%)</div>
                      <div className="text-sm text-gray-600">2.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">D (45-49%)</div>
                      <div className="text-sm text-gray-600">1.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">E (40-44%)</div>
                      <div className="text-sm text-gray-600">0.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">F (Below 40%)</div>
                      <div className="text-sm text-gray-600">0.0 points</div>
                    </div>
                  </>
                )}
                {scale === '5.0' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">A (70-100%)</div>
                      <div className="text-sm text-gray-600">5.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">B (60-69%)</div>
                      <div className="text-sm text-gray-600">4.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">C (50-59%)</div>
                      <div className="text-sm text-gray-600">3.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">D (45-49%)</div>
                      <div className="text-sm text-gray-600">2.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">E (40-44%)</div>
                      <div className="text-sm text-gray-600">1.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">F (0-39%)</div>
                      <div className="text-sm text-gray-600">0.0 points</div>
                    </div>
                  </>
                )}
                {scale === '7.0' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">A (70-100%)</div>
                      <div className="text-sm text-gray-600">7.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">B+ (65-69%)</div>
                      <div className="text-sm text-gray-600">6.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">B (60-64%)</div>
                      <div className="text-sm text-gray-600">5.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">C+ (55-59%)</div>
                      <div className="text-sm text-gray-600">4.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">C (50-54%)</div>
                      <div className="text-sm text-gray-600">3.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">D (45-49%)</div>
                      <div className="text-sm text-gray-600">2.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">E (40-44%)</div>
                      <div className="text-sm text-gray-600">1.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">F (0-39%)</div>
                      <div className="text-sm text-gray-600">0.0 points</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Degree Classification</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scale === '4.0' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">First Class Honours</div>
                      <div className="text-sm text-gray-600">3.50 - 4.00</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Second Class Honours (Upper Division)</div>
                      <div className="text-sm text-gray-600">3.00 - 3.49</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Second Class Honours (Lower Division)</div>
                      <div className="text-sm text-gray-600">2.00 - 2.99</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Third Class Honours</div>
                      <div className="text-sm text-gray-600">1.00 - 1.99</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Fail</div>
                      <div className="text-sm text-gray-600">Below 1.00</div>
                    </div>
                  </>
                )}
                {scale === '5.0' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">First Class Honours</div>
                      <div className="text-sm text-gray-600">4.50 - 5.00</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Second Class Honours (Upper Division)</div>
                      <div className="text-sm text-gray-600">3.50 - 4.49</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Second Class Honours (Lower Division)</div>
                      <div className="text-sm text-gray-600">2.40 - 3.49</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Third Class Honours</div>
                      <div className="text-sm text-gray-600">1.50 - 2.39</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Fail</div>
                      <div className="text-sm text-gray-600">Below 1.50</div>
                    </div>
                  </>
                )}
                {scale === '7.0' && (
                  <>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">First Class Honours</div>
                      <div className="text-sm text-gray-600">6.00 - 7.00</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Second Class Honours (Upper Division)</div>
                      <div className="text-sm text-gray-600">5.00 - 5.99</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Second Class Honours (Lower Division)</div>
                      <div className="text-sm text-gray-600">4.00 - 4.99</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Third Class Honours</div>
                      <div className="text-sm text-gray-600">3.00 - 3.99</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">Fail</div>
                      <div className="text-sm text-gray-600">Below 3.00</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Understanding Grade Scales:</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><span className="font-semibold">4.0 Scale:</span> Standard US grading system used by most universities. A = 4.0 (Excellent), F = 0.0 (Fail)</li>
                <li><span className="font-semibold">5.0 Scale:</span> Common in Nigerian universities. A = 5.0 (Excellent), F = 0.0 (Fail)</li>
                <li><span className="font-semibold">7.0 Scale:</span> Advanced scale with more grade points for finer differentiation. A = 7.0 (Excellent), F = 0.0 (Fail)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How to Use:</h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>Select your institution's grading scale</li>
                <li>Add your courses using the "Add Course" button</li>
                <li>For each course:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Enter the course name</li>
                    <li>Select your grade (includes percentage range)</li>
                    <li>Enter course units/credits (typically 1-6)</li>
                  </ul>
                </li>
                <li>Click "Calculate CGPA" to see your results</li>
              </ol>
            </div>

            <div className="space-y-4">
              {renderCourseInputs()}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={addCourse}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white"
              >
                <PlusCircle className="w-5 h-5" />
                Add Course
              </button>
              <button
                onClick={calculateCGPA}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                Calculate CGPA
              </button>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            {cgpa !== null && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-4">Results</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-700">Your CGPA:</span>
                      <span className="text-4xl font-bold text-green-600">{cgpa.toFixed(2)}</span>
                      <span className="text-gray-500">on {scale} scale</span>
                    </div>

                    <div>
                      <span className="text-gray-700">Degree Classification: </span>
                      <span className="text-indigo-600 font-semibold">
                        {getCGPAClassification(cgpa, scale)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-700">Total Credits: </span>
                      <span className="font-semibold">{totalCredits}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Course Summary:</h4>
                    {courses.map(course => (
                      <div key={course.id} className="flex justify-between py-2 border-b">
                        <span>{course.name}</span>
                        <span className="text-gray-600">
                          Grade: {course.grade} | Credits: {course.credits}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-4">Performance Analysis</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Current Standing</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-600">CGPA</div>
                            <div className="text-2xl font-bold text-indigo-600">{cgpa.toFixed(2)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Total Credits</div>
                            <div className="text-2xl font-bold text-indigo-600">{totalCredits}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Performance Trend</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-600">Trend</div>
                            <div className="text-lg">N/A</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Change</div>
                            <div className="text-lg">0</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Grade Distribution</h4>
                      <div className="space-y-2">
                        {Object.entries(
                          courses.reduce((acc, course) => {
                            acc[course.grade] = (acc[course.grade] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([grade, count]) => (
                          <div key={grade} className="flex justify-between">
                            <span>Grade {grade}</span>
                            <span>{count} course(s)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <CourseImpactAnalysis
                    courses={courses}
                    cgpa={cgpa}
                    scale={scale}
                    gradePoints={gradePoints}
                  />
                  
                  <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Impact Analysis Summary</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• High-impact courses (≥25% impact) should be prioritized for maintaining or improving grades</li>
                      <li>• Courses with higher credit units have more significant effects on your CGPA</li>
                      <li>• Focus on courses with the highest potential improvement percentage</li>
                      <li>• Consider the balance between course difficulty and potential impact</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'CGPA converter' ? (
          <ScaleConverter />
        ) : activeTab === 'semester' ? (
          <AcademicJourney />
        ) : activeTab === 'goals' ? (
          <GoalTracker />
        ) : (
          <StudyTracker />
        )}
      </div>



      {user ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-bold mb-2">Saved Academic Records</h3>
          <div>
            <label className="block text-lg font-large text-gray-700">
              Semester
            </label>
            <input
              type="number"
              value={1}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Courses */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Courses</h2>
              <button
                type="button"
                onClick={addCourse}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Course
              </button>
            </div>

            {renderCourseInputs()}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Saving...' : 'Calculate and Save CGPA'}
            </button>
          </div>
        </form>

      ) : (
        <p className="text-red-500">Please log in to save your academic records</p>
      )}

      <div className="mt-4">
                {savedRecords.map(record => (
          <div key={record.id} className="border p-2 mb-2">
            <p>Semester GPA: {record.gpa}</p>
            <p>Academic Year: {record.semester}</p>
            <p>Courses: {record.courses.length}</p>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-600">
        Designed and developed by{' '}
        <a 
          href="https://github.com/s-araromi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Sulaimon Araromi
        </a>
      </div>
    </div>
  );
};

export default CGPAForm;