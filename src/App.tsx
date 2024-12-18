import React, { useEffect } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider,
  Navigate
} from 'react-router-dom';
import CGPAForm from './components/CGPAForm';
import { AuthProvider } from './components/auth/AuthContext';
import AdminDashboard from './components/admin/AdminDashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { injectAuthTestScript } from './utils/injectAuthTest';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute requiredRole="admin">
        {(currentUser) => 
          currentUser?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      </PrivateRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        {() => (
          <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                CGPA Calculator
              </h1>
              <CGPAForm />
            </div>
          </div>
        )}
      </PrivateRoute>
    )
  }
]);

const App: React.FC = () => {
  useEffect(() => {
    // Inject authentication test script in development
    injectAuthTestScript();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;