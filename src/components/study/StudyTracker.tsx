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
import { mockStorage } from '../../services/mockStorage';
import type { StudySession, Course } from '../../types/mock';

export const StudyTracker: React.FC = () => {
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [topic, setTopic] = useState('');
  const [efficiency, setEfficiency] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const userId = mockStorage.session.getCurrentUser()?.id;
    if (userId) {
      setCourses(mockStorage.courses.getAll(userId));
      setSessions(mockStorage.studyTracking.getSessions(userId));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleStartSession = () => {
    if (!selectedCourse || !topic) return;

    const userId = mockStorage.session.getCurrentUser()?.id;
    if (!userId) return;

    const session = mockStorage.studyTracking.startSession({
      userId,
      courseId: selectedCourse,
      topic,
      startTime: new Date().toISOString(),
      efficiency: 0,
      notes: ''
    });

    setActiveSession(session);
    setTimer(0);
  };

  const handleEndSession = () => {
    if (!activeSession) return;
    setDialogOpen(true);
  };

  const handleConfirmEndSession = () => {
    if (!activeSession) return;

    const updatedSession = mockStorage.studyTracking.endSession(
      activeSession.id,
      efficiency,
      notes
    );

    setSessions(prev => [...prev, updatedSession]);
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
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
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
                    Course: {courses.find(c => c.id === activeSession.courseId)?.name}
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

              {sessions.slice(-5).reverse().map((session) => (
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
