import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { mockStorage } from '../../services/mockStorage';
import type { Assignment, Course } from '../../types/mock';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const AssignmentManager: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [expectedGrade, setExpectedGrade] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    const userId = mockStorage.session.getCurrentUser()?.id;
    if (userId) {
      setCourses(mockStorage.courses.getAll(userId));
      setAssignments(mockStorage.assignments.getAll(userId));
      // Check for overdue assignments
      mockStorage.assignments.checkDeadlines(userId);
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (assignment?: Assignment) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setTitle(assignment.title);
      setDescription(assignment.description);
      setCourseId(assignment.courseId);
      setDeadline(assignment.deadline.split('T')[0]);
      setExpectedGrade(assignment.expectedGrade);
      setPriority(assignment.priority);
    } else {
      setEditingAssignment(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCourseId('');
    setDeadline('');
    setExpectedGrade('');
    setPriority('medium');
  };

  const handleSubmit = () => {
    const userId = mockStorage.session.getCurrentUser()?.id;
    if (!userId) return;

    const assignmentData = {
      userId,
      courseId,
      title,
      description,
      deadline: new Date(deadline).toISOString(),
      expectedGrade,
      priority,
    };

    if (editingAssignment) {
      const updated = mockStorage.assignments.update(editingAssignment.id, assignmentData);
      setAssignments(prev => prev.map(a => a.id === updated.id ? updated : a));
    } else {
      const created = mockStorage.assignments.create(assignmentData);
      setAssignments(prev => [...prev, created]);
    }

    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    const userId = mockStorage.session.getCurrentUser()?.id;
    if (!userId) return;

    mockStorage.assignments.update(id, { status: 'completed' });
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const filterAssignments = (status: 'pending' | 'completed' | 'overdue') => {
    return assignments.filter(a => a.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Assignment Manager</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          New Assignment
        </Button>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Pending" />
        <Tab label="Completed" />
        <Tab label="Overdue" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={2}>
          {filterAssignments('pending').map((assignment) => (
            <Grid item xs={12} md={6} key={assignment.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{assignment.title}</Typography>
                    <Box>
                      <IconButton size="small" onClick={() => handleOpenDialog(assignment)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(assignment.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    {courses.find(c => c.id === assignment.courseId)?.name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {assignment.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                      label={`Priority: ${assignment.priority}`}
                      color={getPriorityColor(assignment.priority)}
                      size="small"
                    />
                    <Typography variant="body2" color="textSecondary">
                      Due: {new Date(assignment.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={2}>
          {filterAssignments('completed').map((assignment) => (
            // Similar card layout for completed assignments
            <Grid item xs={12} md={6} key={assignment.id}>
              <Card sx={{ opacity: 0.7 }}>
                <CardContent>
                  {/* Similar content structure */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={2}>
          {filterAssignments('overdue').map((assignment) => (
            // Similar card layout for overdue assignments
            <Grid item xs={12} md={6} key={assignment.id}>
              <Card sx={{ borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
                <CardContent>
                  {/* Similar content structure */}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Assignment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingAssignment ? 'Edit Assignment' : 'New Assignment'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Course</InputLabel>
            <Select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              label="Course"
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="date"
            label="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Expected Grade"
            value={expectedGrade}
            onChange={(e) => setExpectedGrade(e.target.value)}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
              label="Priority"
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary">
            {editingAssignment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
