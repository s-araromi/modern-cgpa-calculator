import React, { useState } from 'react';
import { PlusCircle, Trash2, Sparkles, Target } from 'lucide-react';
import CourseImpactAnalysis from './CourseImpactAnalysis';
import PerformanceTrends from './PerformanceTrends';
import ScenarioPlanner from './ScenarioPlanner';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface Prediction {
  predictedCGPA: number;
  recommendations: string[];
  targetAchievable: boolean;
}

const CGPAForm = () => {
  const [scale, setScale] = useState<'4.0' | '5.0' | '7.0'>('4.0');
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: '', credits: 3 },
  ]);
  const [cgpa, setCGPA] = useState<number | null>(null);
  const [targetCGPA, setTargetCGPA] = useState<string>('');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [remainingUnits, setRemainingUnits] = useState<number>(0);

  const gradePoints = {
    '4.0': {
      'A': 4.0,  // 70% and above
      'B': 3.0,  // 60-69%
      'C': 2.0,  // 50-59%
      'D': 1.0,  // 45-49%
      'E': 0.0,  // 40-44%
      'F': 0.0   // Below 40%
    },
    '5.0': {
      'A': 5.0,  // 70% and above
      'B': 4.0,  // 60-69%
      'C': 3.0,  // 50-59%
      'D': 2.0,  // 45-49%
      'F': 0.0   // Below 45%
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

  const gradeRanges = {
    '4.0': {
      'A': '70% and above',
      'B': '60-69%',
      'C': '50-59%',
      'D': '45-49%',
      'E': '40-44%',
      'F': 'Below 40%'
    },
    '5.0': {
      'A': '70% and above',
      'B': '60-69%',
      'C': '50-59%',
      'D': '45-49%',
      'F': 'Below 45%'
    },
    '7.0': {
      'A': '70-100%',
      'B+': '65-69%',
      'B': '60-64%',
      'C+': '55-59%',
      'C': '50-54%',
      'D': '45-49%',
      'E': '40-44%',
      'F': 'Below 40%'
    }
  };

  // Course difficulty patterns (simplified AI simulation)
  const courseDifficulty = {
    'calculus': 0.8,
    'physics': 0.75,
    'programming': 0.7,
    'history': 0.6,
    'literature': 0.65,
    'chemistry': 0.75,
    'biology': 0.7,
    'economics': 0.65,
  };

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: '', grade: '', credits: 3 }]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateCGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      if (course.grade && course.credits) {
        const points = gradePoints[scale][course.grade as keyof typeof gradePoints['4.0']];
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      }
    });

    if (totalCredits === 0) return;
    const calculated = Number((totalPoints / totalCredits).toFixed(2));
    setCGPA(calculated);
    return calculated;
  };

  const predictFutureCGPA = () => {
    const currentCGPA = calculateCGPA();
    if (!currentCGPA || !targetCGPA) return;

    const target = parseFloat(targetCGPA);
    const coursePatterns = courses.map(course => {
      const lowercaseName = course.name.toLowerCase();
      let difficulty = 0.7; // default difficulty
      
      // Find matching difficulty patterns
      Object.entries(courseDifficulty).forEach(([key, value]) => {
        if (lowercaseName.includes(key)) {
          difficulty = value;
        }
      });
      
      return {
        name: course.name,
        difficulty,
        grade: course.grade,
      };
    });

    // Predict based on current performance and course patterns
    const averagePerformance = coursePatterns.reduce((acc, course) => {
      if (course.grade) {
        const gradeValue = gradePoints[scale][course.grade as keyof typeof gradePoints['4.0']];
        return acc + (gradeValue / parseFloat(scale) * course.difficulty);
      }
      return acc;
    }, 0) / coursePatterns.filter(c => c.grade).length;

    const predictedCGPA = Number((currentCGPA * 0.7 + averagePerformance * 0.3).toFixed(2));
    const targetAchievable = predictedCGPA >= target - 0.5;

    // Generate smart recommendations
    const recommendations = [];
    if (predictedCGPA < target) {
      if (coursePatterns.some(c => c.difficulty > 0.7)) {
        recommendations.push("Consider balancing difficult courses across semesters");
      }
      if (coursePatterns.filter(c => c.grade).length < 4) {
        recommendations.push("Take more courses to improve prediction accuracy");
      }
      recommendations.push(`Focus on courses with difficulty level ${(target / parseFloat(scale) * 0.7).toFixed(2)} or lower`);
    }

    setPrediction({
      predictedCGPA,
      recommendations,
      targetAchievable,
    });
  };

  // Function to calculate required grades for target CGPA
  const calculateRequiredGrades = (currentCGPA: number, target: number, remainingUnits: number) => {
    const scaleMaxPoints = {
      '4.0': 4.0,
      '5.0': 5.0,
      '7.0': 7.0
    };

    const currentTotalPoints = currentCGPA * getTotalCredits();
    const targetTotalPoints = target * (getTotalCredits() + remainingUnits);
    const requiredPoints = targetTotalPoints - currentTotalPoints;
    const requiredAverage = requiredPoints / remainingUnits;

    const recommendations: string[] = [];
    const maxPoint = scaleMaxPoints[scale];
    const isAchievable = requiredAverage <= maxPoint;

    if (!isAchievable) {
      recommendations.push(`Target CGPA of ${target} is not achievable with ${remainingUnits} remaining units.`);
      recommendations.push(`Even with all A grades, the maximum achievable CGPA would be ${((currentTotalPoints + (maxPoint * remainingUnits)) / (getTotalCredits() + remainingUnits)).toFixed(2)}`);
    } else {
      const gradeNeeded = getRequiredGrade(requiredAverage);
      recommendations.push(`To achieve a CGPA of ${target}:`);
      recommendations.push(`- You need to maintain an average grade of ${gradeNeeded} or better in your remaining ${remainingUnits} units`);
      recommendations.push(`- This means scoring at least ${(requiredAverage).toFixed(2)} grade points per course`);
      
      if (requiredAverage > currentCGPA) {
        recommendations.push(`- This requires improving your current performance by ${((requiredAverage - currentCGPA) * 100 / currentCGPA).toFixed(1)}%`);
      }
    }

    return {
      predictedCGPA: target,
      recommendations,
      targetAchievable: isAchievable
    };
  };

  // Helper function to get required grade letter based on point average
  const getRequiredGrade = (pointAverage: number): string => {
    const gradeRanges = {
      '4.0': [
        { min: 3.5, grade: 'A' },
        { min: 2.5, grade: 'B' },
        { min: 1.5, grade: 'C' },
        { min: 0.5, grade: 'D' },
        { min: 0, grade: 'F' }
      ],
      '5.0': [
        { min: 4.5, grade: 'A' },
        { min: 3.5, grade: 'B' },
        { min: 2.5, grade: 'C' },
        { min: 1.5, grade: 'D' },
        { min: 0, grade: 'F' }
      ],
      '7.0': [
        { min: 6.0, grade: 'A' },
        { min: 5.0, grade: 'B+' },
        { min: 4.0, grade: 'B' },
        { min: 3.0, grade: 'C+' },
        { min: 2.0, grade: 'C' },
        { min: 1.0, grade: 'D' },
        { min: 0, grade: 'F' }
      ]
    };

    const grades = gradeRanges[scale];
    for (const { min, grade } of grades) {
      if (pointAverage >= min) return grade;
    }
    return 'F';
  };

  const getTotalCredits = () => {
    return courses.reduce((acc, course) => acc + course.credits, 0);
  };

  return (
    <div className="space-y-6">
      {/* Scale Selection */}
      <div className="flex gap-4 justify-center mb-6">
        {(['4.0', '5.0', '7.0'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setScale(s)}
            className={`px-4 py-2 rounded-lg transition-all ${
              scale === s
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white/50 hover:bg-white text-gray-600'
            }`}
          >
            {s} Scale
          </button>
        ))}
      </div>

      {/* Target CGPA Input */}
      <div className="flex gap-4 items-center bg-white/50 p-4 rounded-lg">
        <Target className="w-5 h-5 text-indigo-600" />
        <input
          type="number"
          step="0.01"
          placeholder="Set your target CGPA"
          value={targetCGPA}
          onChange={(e) => setTargetCGPA(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-[1fr,120px,100px,48px] gap-4 mb-2 px-1">
        <div className="text-sm font-medium text-gray-700">Course Name</div>
        <div className="text-sm font-medium text-gray-700">Grade</div>
        <div className="text-sm font-medium text-gray-700">Course Unit</div>
        <div></div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        {courses.map((course) => (
          <div key={course.id} className="grid grid-cols-[1fr,120px,100px,48px] gap-4 items-center animate-fadeIn">
            <input
              type="text"
              placeholder="Enter course name"
              value={course.name}
              onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="w-32">
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Grade</option>
                {Object.entries(gradePoints[scale]).map(([grade, point]) => (
                  <option key={grade} value={grade}>
                    {grade} ({gradeRanges[scale][grade]})
                  </option>
                ))}
              </select>
            </div>
            <input
              type="number"
              min="0"
              max="6"
              value={course.credits}
              onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => removeCourse(course.id)}
              className="p-2 text-red-500 hover:text-red-600 transition-colors"
              aria-label="Remove course"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={addCourse}
          className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Add Course
        </button>
        <div className="flex gap-2">
          <button
            onClick={calculateCGPA}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Calculate CGPA
          </button>
          <button
            onClick={predictFutureCGPA}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Predict
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {cgpa !== null && (
          <div className="mt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800">Your CGPA</h3>
              <div className="mt-2 text-4xl font-bold text-indigo-600">{cgpa.toFixed(2)}</div>
              <p className="mt-2 text-gray-600">
                Based on {courses.length} course{courses.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Course Impact Analysis */}
            <CourseImpactAnalysis
              courses={courses}
              scale={scale}
              gradePoints={gradePoints}
              currentCGPA={cgpa}
            />

            {/* Performance Trends */}
            <PerformanceTrends
              courses={courses}
              scale={scale}
              gradePoints={gradePoints}
              currentCGPA={cgpa}
            />

            {/* Scenario Planner */}
            <ScenarioPlanner
              currentCourses={courses}
              scale={scale}
              gradePoints={gradePoints}
              currentCGPA={cgpa}
            />
          </div>
        )}

        {prediction && (
          <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-700">AI Predictions</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                <span className="text-gray-600">Predicted CGPA</span>
                <span className="text-xl font-bold text-purple-600">{prediction.predictedCGPA}</span>
              </div>
              
              <div className="p-4 bg-white rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Target Analysis</h4>
                <div className={`text-sm ${prediction.targetAchievable ? 'text-green-600' : 'text-amber-600'}`}>
                  {prediction.targetAchievable 
                    ? "✨ Your target CGPA appears achievable!"
                    : "⚠️ Reaching your target CGPA may be challenging"}
                </div>
              </div>

              {prediction.recommendations.length > 0 && (
                <div className="p-4 bg-white rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {prediction.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-purple-600">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Target CGPA Section */}
      {cgpa !== null && (
        <div className="mt-8 p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Set Your CGPA Goal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target CGPA
              </label>
              <input
                type="number"
                value={targetCGPA}
                onChange={(e) => setTargetCGPA(e.target.value)}
                step="0.01"
                min="0"
                max={scale}
                className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Enter target CGPA (max ${scale})`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remaining Credit Units
              </label>
              <input
                type="number"
                value={remainingUnits}
                onChange={(e) => setRemainingUnits(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter remaining units"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (targetCGPA && remainingUnits > 0) {
                const prediction = calculateRequiredGrades(cgpa, Number(targetCGPA), remainingUnits);
                setPrediction(prediction);
              }
            }}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Calculate Required Grades
          </button>

          {prediction && (
            <div className="mt-4 p-4 rounded-lg bg-white/70">
              <h4 className="font-semibold text-gray-800 mb-2">
                Goal Analysis
              </h4>
              <div className="space-y-2">
                {prediction.recommendations.map((rec, index) => (
                  <p key={index} className={`text-sm ${index === 0 ? 'font-medium' : ''} ${prediction.targetAchievable ? 'text-gray-600' : 'text-red-600'}`}>
                    {rec}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CGPAForm;