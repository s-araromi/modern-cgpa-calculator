import React, { useState, useEffect } from 'react';
import { mockStorage } from '../../services/mockStorage';
import { AcademicGoal } from '../../types/mock';

export const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<AcademicGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<AcademicGoal | null>(null);

  // Form states
  const [targetCGPA, setTargetCGPA] = useState('');
  const [deadline, setDeadline] = useState('');
  const [strategies, setStrategies] = useState<string[]>(['']);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const user = mockStorage.currentUser || { id: '1' }; // Use default user if none exists
      const userGoals = mockStorage.academicGoals.getAll(user.id);
      setGoals(userGoals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    try {
      const user = mockStorage.currentUser || { id: '1' }; // Use default user if none exists
      const newGoal = {
        id: Date.now().toString(),
        userId: user.id,
        targetCGPA: parseFloat(targetCGPA),
        currentCGPA: 0,
        deadline,
        strategies: strategies.filter(s => s.trim() !== ''),
        progress: 0,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockStorage.academicGoals.add(newGoal);
      await loadGoals();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const handleUpdateGoal = async () => {
    if (!editingGoal) return;

    try {
      const updatedGoal = {
        ...editingGoal,
        targetCGPA: parseFloat(targetCGPA),
        deadline,
        strategies: strategies.filter(s => s.trim() !== ''),
        updatedAt: new Date().toISOString(),
      };

      mockStorage.academicGoals.update(editingGoal.id, updatedGoal);
      await loadGoals();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      mockStorage.academicGoals.delete(goalId);
      await loadGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const handleOpenDialog = (goal?: AcademicGoal) => {
    if (goal) {
      setEditingGoal(goal);
      setTargetCGPA(goal.targetCGPA.toString());
      setDeadline(goal.deadline);
      setStrategies(goal.strategies);
    } else {
      setEditingGoal(null);
      setTargetCGPA('');
      setDeadline('');
      setStrategies(['']);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingGoal(null);
    setTargetCGPA('');
    setDeadline('');
    setStrategies(['']);
  };

  const handleAddStrategy = () => {
    setStrategies([...strategies, '']);
  };

  const handleStrategyChange = (index: number, value: string) => {
    const newStrategies = [...strategies];
    newStrategies[index] = value;
    setStrategies(newStrategies);
  };

  const handleRemoveStrategy = (index: number) => {
    setStrategies(strategies.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Academic Goals</h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
          onClick={() => handleOpenDialog()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Goal
        </button>
      </div>

      <div className="grid gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  Target CGPA: {goal.targetCGPA}
                </h3>
                <p className="text-gray-600">
                  Current CGPA: {goal.currentCGPA}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 text-gray-600 hover:text-indigo-600"
                  onClick={() => handleOpenDialog(goal)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  className="p-2 text-gray-600 hover:text-red-600"
                  onClick={() => handleDeleteGoal(goal.id)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                Status: <span className="capitalize">{goal.status}</span>
              </p>
            </div>

            {goal.strategies.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Strategies:</h4>
                <div className="flex flex-wrap gap-2">
                  {goal.strategies.map((strategy, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {strategy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {editingGoal ? 'Edit Goal' : 'Add New Goal'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={targetCGPA}
                  onChange={(e) => setTargetCGPA(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Strategies
                </label>
                {strategies.map((strategy, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      value={strategy}
                      onChange={(e) => handleStrategyChange(index, e.target.value)}
                      placeholder={`Strategy ${index + 1}`}
                    />
                    <button
                      className="p-2 text-gray-600 hover:text-red-600 disabled:opacity-50"
                      onClick={() => handleRemoveStrategy(index)}
                      disabled={strategies.length === 1}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                  onClick={handleAddStrategy}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Strategy
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={handleCloseDialog}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
              >
                {editingGoal ? 'Update' : 'Add'} Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
