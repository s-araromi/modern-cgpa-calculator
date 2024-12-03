import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { mockStorage } from '../../services/mockStorage';
import type { PerformanceStats, GradeDistribution, CGPARecord } from '../../types/mock';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF0000'];

export const PerformanceAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [cgpaData, setCgpaData] = useState<Array<{
    date: string;
    cgpa: number;
    semesterGPA: number;
  }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = mockStorage.currentUser;
      if (!currentUser) return;

      const userId = currentUser.id;
      const performanceStats = mockStorage.performanceStats[userId];
      setStats(performanceStats);

      // Get CGPA progression data
      const records = mockStorage.cgpaRecords.filter(record => record.userId === userId);
      const cgpaProgression = records.map((record: CGPARecord) => ({
        date: new Date(record.calculated_at).toLocaleDateString(),
        cgpa: record.cumulativeGPA,
        semesterGPA: record.semesterGPA,
      }));
      setCgpaData(cgpaProgression);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const formatGradeData = (distribution: GradeDistribution[]) => {
    return distribution.map(item => ({
      grade: item.grade,
      count: item.count,
      percentage: item.percentage,
    }));
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Performance Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* CGPA Progression */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                CGPA Progression
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={cgpaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cgpa"
                    stroke="#8884d8"
                    name="Cumulative GPA"
                  />
                  <Line
                    type="monotone"
                    dataKey="semesterGPA"
                    stroke="#82ca9d"
                    name="Semester GPA"
                  />
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
                <PieChart>
                  <Pie
                    data={formatGradeData(stats.gradeDistribution)}
                    dataKey="count"
                    nameKey="grade"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {stats.gradeDistribution.map((entry, index) => (
                      <Cell key={entry.grade} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Box mt={2}>
                <Typography variant="subtitle1">Best Performing Subjects</Typography>
                {stats.bestSubjects.map((subject, index) => (
                  <Box key={subject} mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      {subject}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={((stats.bestSubjects.length - index) / stats.bestSubjects.length) * 100}
                      color="success"
                    />
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1">Areas for Improvement</Typography>
                {stats.weakestSubjects.map((subject, index) => (
                  <Box key={subject} mb={1}>
                    <Typography variant="body2" color="textSecondary">
                      {subject}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={((index + 1) / stats.weakestSubjects.length) * 100}
                      color="error"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Semester Performance */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Semester Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.semesterPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semesterId" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gpa" fill="#8884d8" name="GPA" />
                  <Bar dataKey="improvement" fill="#82ca9d" name="Improvement" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">
                    Average Units per Semester
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {stats.averageUnitsPerSemester.toFixed(1)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">
                    Total Courses Taken
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    {stats.gradeDistribution.reduce((sum, item) => sum + item.count, 0)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">
                    Performance Trend
                  </Typography>
                  <Typography
                    variant="h4"
                    color={
                      stats.semesterPerformance[stats.semesterPerformance.length - 1]
                        ?.improvement > 0
                        ? 'success.main'
                        : 'error.main'
                    }
                  >
                    {stats.semesterPerformance[stats.semesterPerformance.length - 1]
                      ?.improvement > 0
                      ? '↑ Improving'
                      : '↓ Declining'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
