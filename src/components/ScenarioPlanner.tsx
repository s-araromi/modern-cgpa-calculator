import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface Scenario {
  id: string;
  name: string;
  courses: Course[];
  resultingCGPA: number;
  improvement: number;
}

type GradeScale = '4.0' | '5.0' | '7.0';

interface ScenarioPlannerProps {
  currentCourses: Course[];
  scale: GradeScale;
  gradePoints: Record<GradeScale, Record<string, number>>;
  currentCGPA: number | null;
}

const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({
  currentCourses,
  scale,
  gradePoints,
  currentCGPA,
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [newScenario, setNewScenario] = useState<Course[]>([]);
  const [scenarioName, setScenarioName] = useState<string>('');

  const calculateScenarioCGPA = (courses: Course[]): number => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      if (course.grade && course.credits) {
        const points = gradePoints[scale][course.grade];
        if (typeof points === 'number') {
          totalPoints += points * course.credits;
          totalCredits += course.credits;
        }
      }
    });

    return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
  };

  const addCourseToScenario = () => {
    setNewScenario([
      ...newScenario,
      { id: Date.now().toString(), name: '', grade: '', credits: 3 },
    ]);
  };

  const updateScenarioCourse = (
    id: string,
    field: keyof Course,
    value: string | number
  ) => {
    setNewScenario(
      newScenario.map((course) =>
        course.id === id ? { ...course, [field]: value } : course
      )
    );
  };

  const removeCourseFromScenario = (id: string) => {
    setNewScenario(newScenario.filter((course) => course.id !== id));
  };

  const saveScenario = () => {
    if (newScenario.length === 0 || !scenarioName.trim()) return;

    const resultingCGPA = calculateScenarioCGPA([...currentCourses, ...newScenario]);
    const improvement = currentCGPA ? resultingCGPA - currentCGPA : 0;

    const scenario: Scenario = {
      id: Date.now().toString(),
      name: scenarioName,
      courses: [...newScenario],
      resultingCGPA,
      improvement,
    };

    setScenarios([...scenarios, scenario]);
    setNewScenario([]);
    setScenarioName('');
  };

  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter((scenario) => scenario.id !== id));
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Scenario Planner</h3>

      {/* Create New Scenario */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scenario Name
          </label>
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="e.g., Best Case Scenario"
          />
        </div>

        {newScenario.map((course) => (
          <div key={course.id} className="flex gap-4 mb-2">
            <input
              type="text"
              value={course.name}
              onChange={(e) => updateScenarioCourse(course.id, 'name', e.target.value)}
              className="flex-1 p-2 border rounded-md"
              placeholder="Course Name"
            />
            <select
              value={course.grade}
              onChange={(e) => updateScenarioCourse(course.id, 'grade', e.target.value)}
              className="w-24 p-2 border rounded-md"
            >
              <option value="">Grade</option>
              {Object.keys(gradePoints[scale]).map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={course.credits}
              onChange={(e) =>
                updateScenarioCourse(course.id, 'credits', parseInt(e.target.value) || 0)
              }
              className="w-24 p-2 border rounded-md"
              placeholder="Credits"
            />
            <button
              onClick={() => removeCourseFromScenario(course.id)}
              className="p-2 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        <div className="flex gap-4 mt-4">
          <button
            onClick={addCourseToScenario}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Course
          </button>
          <button
            onClick={saveScenario}
            disabled={newScenario.length === 0 || !scenarioName.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Scenario
          </button>
        </div>
      </div>

      {/* Saved Scenarios */}
      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-gray-800">{scenario.name}</h4>
              <button
                onClick={() => deleteScenario(scenario.id)}
                className="p-1 text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>Courses: {scenario.courses.length}</p>
              <p>Resulting CGPA: {scenario.resultingCGPA.toFixed(2)}</p>
              <p>
                Change:{' '}
                <span
                  className={
                    scenario.improvement >= 0 ? 'text-green-600' : 'text-red-600'
                  }
                >
                  {scenario.improvement >= 0 ? '+' : ''}
                  {scenario.improvement.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScenarioPlanner;
