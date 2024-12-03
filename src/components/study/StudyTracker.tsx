import React, { useState, useEffect } from 'react';
import type { StudySession, Course } from '../../types/mock';
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
  Rating,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { PlayArrow, Stop, Timer } from '@mui/icons-material';
import mockStorage from '../../services/mockStorage';
import { useAuth } from '../auth/AuthContext';

export const StudyTracker = () => {
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [topic, setTopic] = useState('');
  const [efficiency, setEfficiency] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userCourses = mockStorage.courses.filter(c => c.userId === user.id);
      const userSessions = mockStorage.studyTracking.getAll(user.id);
      setCourses(userCourses);
      setStudySessions(userSessions);
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleCreateSession = (sessionData: Omit<StudySession, 'id'>) => {
    if (user) {
      const newSession = mockStorage.studyTracking.create({
        ...sessionData,
        userId: user.id
      });
      setStudySessions(prev => [...prev, newSession]);
      setActiveSession(newSession);
      setTimer(0);
    }
  };

  const handleUpdateSession = (id: string, data: Partial<StudySession>) => {
    if (user) {
      const updatedSession = mockStorage.studyTracking.update(id, data);
      setStudySessions(prev => prev.map(s => s.id === id ? updatedSession : s));
    }
  };

  const handleDeleteSession = (id: string) => {
    if (user) {
      mockStorage.studyTracking.delete(id);
      setStudySessions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleStartSession = () => {
    if (!selectedCourse || !topic) return;

    const sessionData = {
      courseId: selectedCourse.id,
      topic,
      startTime: new Date().toISOString(),
      efficiency: 0,
      notes: ''
    };

    handleCreateSession(sessionData);
  };

  const handleEndSession = () => {
    if (!activeSession) return;
    setDialogOpen(true);
  };

  const handleConfirmEndSession = () => {
    if (!activeSession) return;

    const data = {
      endTime: new Date().toISOString(),
      efficiency,
      notes
    };

    handleUpdateSession(activeSession.id, data);
    setActiveSession(null);
    setEfficiency(0);
    setNotes('');
    setDialogOpen(false);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCourseSelect = (courseId: string) => {
    const selected = courses.find(c => c.id === courseId);
    setSelectedCourse(selected || null);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Study Tracker
      </Typography>

      <Grid container spacing={3}>
        {/* Study Session Controls */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {activeSession ? 'Active Session' : 'Start New Session'}
              </Typography>

              {!activeSession ? (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Course</InputLabel>
                    <Select
                      value={selectedCourse?.id || ''}
                      onChange={(e) => handleCourseSelect(e.target.value)}
                      label="Course"
                    >
                      <MenuItem value="">Select a course</MenuItem>
                      {courses.map(course => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayArrow />}
                    onClick={handleStartSession}
                    disabled={!selectedCourse || !topic}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Start Session
                  </Button>
                </>
              ) : (
                <Box>
                  <Typography variant="h3" align="center" sx={{ my: 3 }}>
                    {formatTime(timer)}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom>
                    Course: {selectedCourse?.name}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Topic: {activeSession.topic}
                  </Typography>

                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<Stop />}
                    onClick={handleEndSession}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    End Session
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Study History */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Study Sessions
              </Typography>

              {studySessions.slice(-5).reverse().map(session => (
                <Card key={session.id} sx={{ mb: 2, bgcolor: 'background.paper' }}>
                  <CardContent>
                    <Typography variant="subtitle1">
                      {courses.find(c => c.id === session.courseId)?.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Topic: {session.topic}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <Timer sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        Duration: {Math.round(session.duration)} minutes
                      </Typography>
                    </Box>
                    {session.efficiency > 0 && (
                      <Box display="flex" alignItems="center" mt={1}>
                        <Rating value={session.efficiency / 2} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Efficiency: {session.efficiency}/10
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* End Session Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>End Study Session</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Rate your study session efficiency:
          </Typography>
          <Rating
            value={efficiency / 2}
            onChange={(_, newValue) => setEfficiency(newValue ? newValue * 2 : 0)}
            precision={0.5}
            max={5}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            margin="normal"
            label="Session Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmEndSession} color="primary">
            End Session
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
