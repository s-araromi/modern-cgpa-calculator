import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Calculator, ArrowRightLeft, History, MessageSquare, HelpCircle } from 'lucide-react';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/Dashboard';
import CGPAForm from './components/CGPAForm';
import ScaleConverter from './components/ScaleConverter';
import AcademicJourney from './components/AcademicJourney';
import FeedbackForm from './components/FeedbackForm';
import HelpDocs from './components/HelpDocs';
import Tooltip from './components/Tooltip';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/calculator" element={
            <ProtectedRoute>
              <CGPAForm />
            </ProtectedRoute>
          } />
          
          <Route path="/converter" element={
            <ProtectedRoute>
              <ScaleConverter />
            </ProtectedRoute>
          } />
          
          <Route path="/journey" element={
            <ProtectedRoute>
              <AcademicJourney />
            </ProtectedRoute>
          } />
          
          <Route path="/feedback" element={
            <ProtectedRoute>
              <FeedbackForm />
            </ProtectedRoute>
          } />
          
          <Route path="/help" element={
            <ProtectedRoute>
              <HelpDocs />
            </ProtectedRoute>
          } />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;