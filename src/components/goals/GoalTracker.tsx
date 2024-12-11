import React, { useState, useEffect } from 'react';
import { Trophy, Target, TrendingUp, Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../../config/supabase';

interface Goal {
  id: number;
  user_id: string;
  title: string;
  targetGPA: number;
  deadline: string;
  created_at?: string;
  status?: 'pending' | 'completed' | 'failed';
  progress?: number;
}

interface NewGoal {
  title: string;
  targetGPA: number;
  deadline: string;
}

export const GoalTracker: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoal, setNewGoal] = useState<NewGoal>({
    title: '',
    targetGPA: 0,
    deadline: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch goals when component mounts or user changes
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setGoals(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Failed to fetch goals. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const addGoal = async () => {
    if (!user) {
      setError('Please log in to create goals');
      return;
    }

    if (!newGoal.title || newGoal.targetGPA <= 0) {
      setError('Please provide a valid goal title and target GPA');
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .insert([{
          user_id: user.id,
          title: newGoal.title,
          targetGPA: newGoal.targetGPA,
          deadline: newGoal.deadline,
          status: 'pending'
        } as Partial<Goal>])
        .select();

      if (error) throw error;

      setGoals([...goals, data[0]]);
      setNewGoal({ title: '', targetGPA: 0, deadline: '' });
      setError(null);
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Failed to add goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGoal = async (goalId: number) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressUpdate = (goalId: number, progress: number) => {
    if (typeof progress === 'undefined') return;
    
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, progress } : goal
    ));
  };

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-4">
        Please log in to manage your goals
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Target className="mr-2" /> Goal Tracker
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Goal Input Form */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Goal Title"
          value={newGoal.title}
          onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
          className="flex-grow p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Target GPA"
          value={newGoal.targetGPA}
          onChange={(e) => setNewGoal({...newGoal, targetGPA: parseFloat(e.target.value)})}
          className="w-24 p-2 border rounded"
          step="0.1"
          min="0"
          max="5.0"
        />
        <input
          type="date"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
          className="w-32 p-2 border rounded"
        />
        <button
          onClick={addGoal}
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center"
        >
          <PlusCircle className="mr-1" /> Add Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-2">
        {goals.map((goal) => (
          <div 
            key={goal.id} 
            className={`flex items-center justify-between p-3 rounded ${
              goal.status === 'completed' 
                ? 'bg-green-100 border-green-200' 
                : 'bg-blue-100 border-blue-200'
            }`}
          >
            <div>
              <h3 className="font-semibold">{goal.title}</h3>
              <p>Target GPA: {goal.targetGPA}</p>
              <p>Status: {goal.status || 'In Progress'}</p>
              {goal.deadline && (
                <p>Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
              )}
              {goal.progress !== undefined && (
                <p>Progress: {goal.progress}%</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => deleteGoal(goal.id)}
                disabled={isLoading}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
