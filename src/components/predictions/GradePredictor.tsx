import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';
import { mockStorage } from '../../services/mockStorage';
import type { GradePredictionModel, PerformancePattern, PredictionMetrics, Course } from '../../types/mock';

interface GradePredictorProps {
  userId: string;
}

const GradePredictor: React.FC<GradePredictorProps> = ({ userId }) => {
  const [predictions, setPredictions] = useState<GradePredictionModel[]>([]);
  const [patterns, setPatterns] = useState<PerformancePattern[]>([]);
  const [metrics, setMetrics] = useState<PredictionMetrics | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<GradePredictionModel | null>(null);
  const [studyAnalysis, setStudyAnalysis] = useState<{
    optimalStudyTime: string;
    recommendedDuration: number;
    effectivenessByTime: { [key: string]: number };
  } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [prediction, setPrediction] = useState<GradePredictionModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const userCourses = await mockStorage.courses.getAll(userId);
        const newPredictions = userCourses
          .filter((course: Course) => course.status === 'in_progress')
          .map((course: Course) => mockStorage.predictions.generatePrediction(userId, course.id));
        setPredictions(newPredictions);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    const fetchPatterns = async () => {
      try {
        setPatterns(mockStorage.predictions.getPerformancePatterns(userId));
      } catch (error) {
        console.error('Error fetching patterns:', error);
      }
    };

    const fetchMetrics = async () => {
      try {
        setMetrics(mockStorage.predictions.getPredictionMetrics(userId));
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    const fetchStudyAnalysis = async () => {
      try {
        setStudyAnalysis(mockStorage.predictions.analyzeStudyEffectiveness(userId));
      } catch (error) {
        console.error('Error fetching study analysis:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const userCourses = await mockStorage.courses.getAll(userId);
        setCourses(userCourses.filter(course => course.status === 'in_progress'));
      } catch (error) {
        setError('Error fetching courses');
        console.error('Error fetching courses:', error);
      }
    };

    fetchPredictions();
    fetchPatterns();
    fetchMetrics();
    fetchStudyAnalysis();
    fetchCourses();
  }, [userId]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'info';
    if (confidence >= 40) return 'warning';
    return 'error';
  };

  const formatTimeOfDay = (time: string) => {
    return time.charAt(0).toUpperCase() + time.slice(1);
  };

  const handleCourseSelect = async (event: SelectChangeEvent<string>) => {
    const courseId = event.target.value;
    if (!courseId) {
      setPrediction(null);
      setSelectedCourse('');
      return;
    }
    
    setSelectedCourse(courseId);
    setLoading(true);
    setError(null);

    try {
      const newPrediction = await mockStorage.predictions.predictGrade(courseId);
      setPrediction(newPrediction);
    } catch (error) {
      setError('Error predicting grade');
      console.error('Error predicting grade:', error);
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictionSelect = (courseId: string) => {
    if (!courseId) return;
    handleCourseSelect({ target: { value: courseId } } as SelectChangeEvent<string>);
  };

  return (
    <Box p={3}>
      {/* Metrics Overview */}
      {metrics && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Prediction Accuracy
                </Typography>
                <Typography variant="h4">
                  {(metrics.accuracy * 100).toFixed(1)}%
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Reliability Score
                </Typography>
                <Typography variant="h4">
                  {(metrics.reliability * 100).toFixed(1)}%
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Sample Size
                </Typography>
                <Typography variant="h4">
                  {metrics.sampleSize}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {new Date(metrics.lastUpdated).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Study Effectiveness */}
      {studyAnalysis && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Study Effectiveness Analysis
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Optimal Study Time
                </Typography>
                <Typography variant="h6">
                  {formatTimeOfDay(studyAnalysis.optimalStudyTime)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Recommended Duration
                </Typography>
                <Typography variant="h6">
                  {studyAnalysis.recommendedDuration} minutes
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Time Slot Effectiveness
                </Typography>
                <Box>
                  {Object.entries(studyAnalysis.effectivenessByTime).map(([slot, effectiveness]) => (
                    <Tooltip key={slot} title={`${(effectiveness * 100).toFixed(1)}% effective`}>
                      <Chip
                        label={formatTimeOfDay(slot)}
                        color={slot === studyAnalysis.optimalStudyTime ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Course Predictions */}
      <Grid container spacing={3}>
        {predictions.map((prediction: GradePredictionModel) => (
          <Grid item xs={12} md={6} key={prediction.courseId}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {mockStorage.courses.getAll(mockStorage.currentUser?.id).find((c: Course) => c.id === prediction.courseId)?.name}
                  </Typography>
                  <Chip
                    label={`${prediction.confidence.toFixed(1)}% Confidence`}
                    color={getConfidenceColor(prediction.confidence)}
                    size="small"
                  />
                </Box>
                <LinearProgress variant="determinate" value={prediction.confidence} />
                <Typography variant="body2" color="textSecondary" mt={2}>
                  Predicted Grade: {prediction.predictedGrade.toFixed(2)}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handlePredictionSelect(prediction.courseId)}
                  sx={{ mt: 1 }}
                >
                  Select This Course
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Performance Patterns */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Performance Patterns
        </Typography>
        <Grid container spacing={3}>
          {patterns.map((pattern: PerformancePattern, index: number) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {pattern.courseType} Courses
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <SchoolIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Average Grade"
                        secondary={pattern.averageGrade.toFixed(2)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Preferred Study Time"
                        secondary={formatTimeOfDay(pattern.timeOfDay)}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Average Study Hours"
                        secondary={`${pattern.studyHours.toFixed(1)} hours`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Assignment Completion"
                        secondary={`${pattern.assignmentCompletion.toFixed(1)}%`}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select Course</InputLabel>
        <Select<string>
          value={selectedCourse}
          onChange={handleCourseSelect}
          label="Select Course"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.code} - {course.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading && <LinearProgress sx={{ my: 2 }} />}

      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}

      {prediction && !loading && (
        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Predicted Grade: {prediction.predictedGrade.toFixed(2)}
              </Typography>
              <Typography
                color={getConfidenceColor(prediction.confidence)}
                gutterBottom
              >
                Confidence: {(prediction.confidence * 100).toFixed(1)}%
              </Typography>
              {prediction.courseId && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handlePredictionSelect(prediction.courseId)}
                  sx={{ mt: 1 }}
                >
                  Select This Course
                </Button>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contributing Factors
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(prediction.factors).map(([factor, value]) => (
                  <Grid item xs={12} sm={6} key={factor}>
                    <Typography variant="body2" color="text.secondary">
                      {factor.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={value * 100}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {prediction.recommendations.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                {prediction.recommendations.map((rec, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    • {rec}
                  </Typography>
                ))}
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default GradePredictor;
