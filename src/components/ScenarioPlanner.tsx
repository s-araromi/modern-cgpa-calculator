import React, { useState } from 'react';
import { TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

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

interface ScenarioPlannerProps {
  currentCourses: Course[];
  scale: '4.0' | '5.0' | '7.0';
  gradePoints: Record<string, Record<string, number>>;
  currentCGPA: number;
}

const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({
  currentCourses,
  scale,
  gradePoints,
  currentCGPA,
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [newScenario, setNewScenario] = useState<{
    name: string;
    numCourses: number;
    defaultGrade: string;
    defaultCredits: number;
  }>({
    name: '',
    numCourses: 5,
    defaultGrade: 'A',
    defaultCredits: 3,
  });

  const calculateNewCGPA = (additionalCourses: Course[]): number => {
    const allCourses = [...currentCourses, ...additionalCourses];
    let totalPoints = 0;
    let totalCredits = 0;

    allCourses.forEach(course => {
      if (course.grade && course.credits) {
        const points = gradePoints[scale][course.grade];
        totalPoints += points * course.credits;
        totalCredits += course.credits;
      }
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const createScenario = () => {
    if (!newScenario.name || newScenario.numCourses <= 0) return;

    const newCourses: Course[] = Array.from({ length: newScenario.numCourses }, (_, i) => ({
      id: `scenario-${Date.now()}-${i}`,
      name: `Future Course ${i + 1}`,
      grade: newScenario.defaultGrade,
      credits: newScenario.defaultCredits,
    }));

    const resultingCGPA = calculateNewCGPA(newCourses);
    const improvement = resultingCGPA - currentCGPA;

    const scenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: newScenario.name,
      courses: newCourses,
      resultingCGPA,
      improvement,
    };

    setScenarios([...scenarios, scenario]);
    setNewScenario({
      name: '',
      numCourses: 5,
      defaultGrade: 'A',
      defaultCredits: 3,
    });
  };

  const createPresetScenario = (preset: 'optimistic' | 'realistic' | 'conservative') => {
    const presetConfigs = {
      optimistic: {
        name: 'Best Case Scenario',
        grade: 'A',
        description: 'All A grades',
      },
      realistic: {
        name: 'Realistic Scenario',
        grade: 'B',
        description: 'All B grades',
      },
      conservative: {
        name: 'Conservative Scenario',
        grade: 'C',
        description: 'All C grades',
      },
    };

    const config = presetConfigs[preset];
    const newCourses: Course[] = Array.from({ length: 5 }, (_, i) => ({
      id: `preset-${Date.now()}-${i}`,
      name: `Future Course ${i + 1}`,
      grade: config.grade,
      credits: 3,
    }));

    const resultingCGPA = calculateNewCGPA(newCourses);
    const improvement = resultingCGPA - currentCGPA;

    const scenario: Scenario = {
      id: `preset-${Date.now()}`,
      name: config.name,
      courses: newCourses,
      resultingCGPA,
      improvement,
    };

    setScenarios([...scenarios, scenario]);
  };

  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  return (
    <div className="mt-8 p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Scenario Planning</h3>

      {/* Quick Scenarios */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Quick Scenarios</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => createPresetScenario('optimistic')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
          >
            <div className="flex items-center gap-2 text-green-700 font-medium">
              <TrendingUp className="w-4 h-4" />
              Best Case
            </div>
            <p className="text-sm text-green-600 mt-1">All A grades next semester</p>
          </button>

          <button
            onClick={() => createPresetScenario('realistic')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <div className="flex items-center gap-2 text-blue-700 font-medium">
              <Sparkles className="w-4 h-4" />
              Realistic
            </div>
            <p className="text-sm text-blue-600 mt-1">All B grades next semester</p>
          </button>

          <button
            onClick={() => createPresetScenario('conservative')}
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors"
          >
            <div className="flex items-center gap-2 text-yellow-700 font-medium">
              <AlertCircle className="w-4 h-4" />
              Conservative
            </div>
            <p className="text-sm text-yellow-600 mt-1">All C grades next semester</p>
          </button>
        </div>
      </div>

      {/* Custom Scenario Creator */}
      <div className="mb-6 p-4 bg-white rounded-lg">
        <h4 className="text-lg font-medium text-gray-700 mb-3">Create Custom Scenario</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scenario Name
            </label>
            <input
              type="text"
              value={newScenario.name}
              onChange={(e) => setNewScenario({ ...newScenario, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Spring 2024"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Courses
            </label>
            <input
              type="number"
              value={newScenario.numCourses}
              onChange={(e) => setNewScenario({ ...newScenario, numCourses: parseInt(e.target.value) })}
              min="1"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Grade
            </label>
            <select
              value={newScenario.defaultGrade}
              onChange={(e) => setNewScenario({ ...newScenario, defaultGrade: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.keys(gradePoints[scale]).map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Credits
            </label>
            <input
              type="number"
              value={newScenario.defaultCredits}
              onChange={(e) => setNewScenario({ ...newScenario, defaultCredits: parseInt(e.target.value) })}
              min="1"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={createScenario}
          disabled={!newScenario.name || newScenario.numCourses <= 0}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Scenario
        </button>
      </div>

      {/* Scenarios List */}
      {scenarios.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-700">Your Scenarios</h4>
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-gray-800">{scenario.name}</h5>
                  <p className="text-sm text-gray-600">
                    {scenario.courses.length} courses | {scenario.courses[0].credits} credits each
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {scenario.resultingCGPA.toFixed(2)}
                  </div>
                  <div className={`text-sm font-medium ${scenario.improvement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {scenario.improvement >= 0 ? '+' : ''}{scenario.improvement.toFixed(2)} points
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  All courses with grade {scenario.courses[0].grade}
                </div>
                <button
                  onClick={() => deleteScenario(scenario.id)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Using the Scenario Planner</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Use quick scenarios to instantly see potential outcomes</li>
          <li>• Create custom scenarios with different course counts and grades</li>
          <li>• Compare multiple scenarios to make informed decisions</li>
          <li>• Plan your course load and grade targets strategically</li>
        </ul>
      </div>
    </div>
  );
};

export default ScenarioPlanner;
