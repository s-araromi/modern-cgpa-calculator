import React from 'react';
import CGPAForm from './components/CGPAForm';
import { AuthProvider } from './components/auth/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            CGPA Calculator
          </h1>
          <CGPAForm />
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;