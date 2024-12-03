import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { mockStorage } from '../../services/mockStorage';
import type { AcademicGoal } from '../../types/mock';

export const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<AcademicGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<AcademicGoal | null>(null);
  const [currentCGPA, setCurrentCGPA] = useState<number>(0);

  // Form states
  const [targetCGPA, setTargetCGPA] = useState('');
  const [deadline, setDeadline] = useState('');
  const [strategies, setStrategies] = useState<string[]>(['']);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = mockStorage.currentUser;
      if (!currentUser) return;

      const userId = currentUser.id;
      const userGoals = mockStorage.academicGoals.getAll(userId);
      setGoals(userGoals);
      
      // Get latest CGPA from CGPA records
      const cgpaRecords = mockStorage.cgpaRecords
        .filter(record => record.userId === userId)
        .sort((a, b) => new Date(b.calculated_at).getTime() - new Date(a.calculated_at).getTime());
      
      const latestCGPA = cgpaRecords.length > 0 ? cgpaRecords[0].cumulativeGPA : 0;
      setCurrentCGPA(latestCGPA);

      // Check goal statuses
      mockStorage.academicGoals.checkStatus(userId);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleOpenDialog = (goal?: AcademicGoal) => {
    if (goal) {
      setEditingGoal(goal);
      setTargetCGPA(goal.targetCGPA.toString());
      setDeadline(goal.deadline.split('T')[0]);
      setStrategies(goal.strategies || ['']);
    } else {
      setEditingGoal(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setTargetCGPA('');
    setDeadline('');
    setStrategies(['']);
  };

  const handleSubmit = () => {
    const currentUser = mockStorage.currentUser;
    if (!currentUser) return;

    const userId = currentUser.id;
    const goalData = {
      userId,
      targetCGPA: parseFloat(targetCGPA),
      deadline,
      strategies: strategies.filter(s => s.trim() !== ''),
    };

    if (editingGoal) {
      const updated = mockStorage.academicGoals.update(editingGoal.id, goalData);
      setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
    } else {
      const created = mockStorage.academicGoals.create(goalData);
      setGoals(prev => [...prev, created]);
    }

    setDialogOpen(false);
    resetForm();
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

  const getProgressColor = (goal: AcademicGoal) => {
    const progress = (currentCGPA / goal.targetCGPA) * 100;
    if (progress >= 100) return 'success';
    if (progress >= 75) return 'info';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  const calculateProgress = (goal: AcademicGoal) => {
    return Math.min((currentCGPA / goal.targetCGPA) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'primary';
      case 'achieved': return 'success';
      case 'missed': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Academic Goals</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Goal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} md={6} key={goal.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">
                    Target CGPA: {goal.targetCGPA}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(goal)}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box my={2}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(goal)}
                    color={getProgressColor(goal)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="body2">Current: {currentCGPA}</Typography>
                    <Typography variant="body2">Target: {goal.targetCGPA}</Typography>
                  </Box>
                </Box>

                <Box mb={2}>
                  <Chip
                    label={`Status: ${goal.status}`}
                    color={getStatusColor(goal.status)}
                    size="small"
                  />
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </Typography>
                </Box>

                {goal.strategies && goal.strategies.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Action Plan:
                    </Typography>
                    {goal.strategies.map((strategy, index) => (
                      <Typography key={index} variant="body2" color="textSecondary">
                        • {strategy}
                      </Typography>
                    ))}
                  </Box>
                )}

                <Box mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    Required GPA: {goal.requiredGPA.toFixed(2)} per semester
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Goal Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGoal ? 'Edit Goal' : 'New Academic Goal'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Target CGPA"
            type="number"
            value={targetCGPA}
            onChange={(e) => setTargetCGPA(e.target.value)}
            margin="normal"
            inputProps={{ min: 0, max: 5, step: 0.1 }}
          />
          <TextField
            fullWidth
            type="date"
            label="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Action Plan
          </Typography>
          {strategies.map((strategy, index) => (
            <Box key={index} display="flex" gap={1} mb={1}>
              <TextField
                fullWidth
                label={`Strategy ${index + 1}`}
                value={strategy}
                onChange={(e) => handleStrategyChange(index, e.target.value)}
              />
              {strategies.length > 1 && (
                <IconButton onClick={() => handleRemoveStrategy(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddStrategy}
            sx={{ mt: 1 }}
          >
            Add Strategy
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingGoal ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
