import React, { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { 
  BookOpen, 
  ArrowLeftRight, 
  Calculator,
  GraduationCap, 
  RefreshCcw,
  Target,
  Trash2,
  PlusCircle,
  Calendar,
  BookOpenCheck
} from 'lucide-react';
import CourseImpactAnalysis from './CourseImpactAnalysis';
import ReportExporter from './ReportExporter';
import ScaleConverter from './ScaleConverter';
import SemesterList from './semester/SemesterList';
import AcademicJourney from './AcademicJourney';
import FeedbackForm from './FeedbackForm';
import HelpDocs from './HelpDocs';
import { supabase } from '../config/supabase';
import { GradeScale, Grade, GradePoints, gradePoints, ActiveTab } from '../types';

interface Course {
  id: string;
  name: string;
  grade: Grade;
  credits: number;
}

interface SavedRecord {
  id: string;
  user_id: string;
  semester: number;
  gpa: number;
  courses: Course[];
  created_at: string;
}

// Initial course state
const initialCourse: Course = {
  id: crypto.randomUUID(),
  name: '',
  grade: 'F',
  credits: 0
};

const CGPAForm: FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scale, setScale] = useState<GradeScale>('4.0');
  const [courses, setCourses] = useState<Course[]>([initialCourse]);
  const [cgpa, setCGPA] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('CGPA calculator');

  const gradeOptions = Object.keys(gradePoints[scale]);

  const tabItems = [
    {
      icon: Calculator,
      label: 'CGPA calculator',
      value: 'CGPA calculator'
    },
    {
      icon: RefreshCcw,
      label: 'CGPA converter',
      value: 'CGPA converter'
    },
    {
      icon: Calendar,
      label: 'Academic Journey',
      value: 'semester'
    },
    {
      icon: Target,
      label: 'Feedback',
      value: 'goals'
    },
    {
      icon: BookOpenCheck,
      label: 'Help Docs',
      value: 'study'
    }
  ];

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
      id: crypto.randomUUID(),
      name: '',
      grade: 'F',
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
    setLoading(true);
    setCGPA(null);
    
    try {
      if (courses.length === 0) {
        throw new Error('Please add at least one course');
      }

      // Validate courses
      courses.forEach((course) => {
        if (!course.name.trim() || !course.grade || course.credits <= 0) {
          throw new Error('Please fill in all course details (code, grade, and units)');
        }
      });

      // Calculate total points and credits
      const { totalPoints, credits } = courses.reduce((acc, course) => {
        const gradePoint = gradePoints[scale][course.grade];
        return {
          totalPoints: acc.totalPoints + (gradePoint * course.credits),
          credits: acc.credits + course.credits
        };
      }, { totalPoints: 0, credits: 0 });

      if (credits === 0) {
        throw new Error('Total credits cannot be zero');
      }

      const calculatedCGPA = Number((totalPoints / credits).toFixed(2));
      setCGPA(calculatedCGPA);
    } catch (error: any) {
      console.error('Error calculating CGPA:', error);
      setCGPA(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCGPA(null);

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
      setCGPA(gpa);
    } catch (err) {
      console.error('Error saving CGPA record:', err);
      setCGPA(null);
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
      <div key={index} className="grid grid-cols-3 gap-4 items-center">
        {/* Course Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Code
          </label>
          <input
            type="text"
            value={course.name}
            onChange={(e) => {
              const newCourses = [...courses];
              newCourses[index].name = e.target.value;
              setCourses(newCourses);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. MTH101"
          />
        </div>

        {/* Credits */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Course Unit
          </label>
          <input
            type="number"
            value={course.credits}
            onChange={(e) => {
              const newCourses = [...courses];
              newCourses[index].credits = Number(e.target.value);
              setCourses(newCourses);
            }}
            min="1"
            max="6"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Course Unit"
          />
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Grade
          </label>
          <select
            value={course.grade}
            onChange={(e) => {
              const newCourses = [...courses];
              newCourses[index].grade = e.target.value as Grade;
              setCourses(newCourses);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Grade</option>
            {gradeOptions.map((gradeOption) => (
              <option key={gradeOption} value={gradeOption}>
                {gradeOption}
              </option>
            ))}
          </select>
        </div>

        {/* Remove Course Button */}
        {courses.length > 1 && (
          <button
            type="button"
            onClick={() => {
              const newCourses = courses.filter((_, i) => i !== index);
              setCourses(newCourses);
            }}
            className="text-red-500 hover:text-red-700 mt-6"
          >
            Remove
          </button>
        )}
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
        {tabItems.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              activeTab === tab.value
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
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
                      <div className="text-sm text-gray-600">0.5 points</div>
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
                      <div className="font-semibold">B (65-69%)</div>
                      <div className="text-sm text-gray-600">6.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">C (60-64%)</div>
                      <div className="text-sm text-gray-600">5.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">D (55-59%)</div>
                      <div className="text-sm text-gray-600">4.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">E (50-54%)</div>
                      <div className="text-sm text-gray-600">3.0 points</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="font-semibold">F (0-49%)</div>
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
                    <li>Enter the course code</li>
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

            {loading && (
              <div className="p-4 bg-blue-50 text-blue-600 rounded-lg">
                Calculating CGPA...
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
                      <span className="font-semibold">{courses.reduce((sum, course) => sum + course.credits, 0)}</span>
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
                            <div className="text-2xl font-bold text-indigo-600">{courses.reduce((sum, course) => sum + course.credits, 0)}</div>
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
          <ScaleConverter scale={scale} onScaleChange={(newScale) => setScale(newScale)} />
        ) : activeTab === 'semester' ? (
          <AcademicJourney />
        ) : activeTab === 'goals' ? (
          <FeedbackForm />
        ) : (
          <HelpDocs />
        )}
      </div>

      <div className="text-center text-sm text-gray-600 mt-4">
        Designed and Developed by{' '}
        <a 
          href="https://github.com/s-araromi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Sulaimon Araromi
        </a>
      </div>

      {/* Sign Out Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={async () => {
            try {
              await signOut();
              navigate('/login', { replace: true });
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default CGPAForm;