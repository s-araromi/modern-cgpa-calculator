import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { academicService } from '../../services/academic.service';

export const Dashboard: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<any>(null);
  const [predictions, setPredictions] = React.useState<any[]>([]);
  const [recommendations, setRecommendations] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = 'current-user-id'; // Replace with actual user ID
        const performanceStats = await academicService.getPerformanceStats(userId);
        setStats(performanceStats);
        // Add more data fetching here
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Academic Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* CGPA Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                CGPA Progress
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats?.semesterPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="gpa" stroke={theme.palette.primary.main} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Grade Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Grade Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.gradeDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Course Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Course Performance
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle1">Best Performing Courses:</Typography>
                {stats?.bestSubjects?.map((subject: string) => (
                  <Typography key={subject} color="primary">
                    {subject}
                  </Typography>
                ))}
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle1">Areas for Improvement:</Typography>
                {stats?.weakestSubjects?.map((subject: string) => (
                  <Typography key={subject} color="error">
                    {subject}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Predictions & Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Predictions & Recommendations
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle1">Grade Predictions:</Typography>
                {predictions.map((prediction) => (
                  <Typography key={prediction.courseId}>
                    {prediction.courseName}: Expected {prediction.predictedGrade}
                  </Typography>
                ))}
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle1">Recommended Actions:</Typography>
                {recommendations.map((rec) => (
                  <Typography key={rec.id}>{rec.suggestion}</Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
