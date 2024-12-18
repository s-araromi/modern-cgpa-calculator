import React, { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setIsLoading(true);

    try {
      // Validate email
      if (!email) {
        setError('Please enter your email address');
        return;
      }

      // Send password reset request
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset link has been sent to your email. Please check your inbox.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 p-6 relative overflow-hidden">
      {/* 3D Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 transform -skew-y-12 -rotate-6 scale-125 opacity-20"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Forgot Password</h2>
          <p className="text-white text-opacity-80">
            Enter your email and we'll send you a password reset link
          </p>
        </div>

        <form onSubmit={handlePasswordReset} className="space-y-6" aria-label="Forgot Password Form">
          {error && (
            <div 
              className="bg-red-500 bg-opacity-20 text-white p-4 rounded-lg text-center"
              role="alert"
            >
              {error}
            </div>
          )}

          {message && (
            <div 
              className="bg-green-500 bg-opacity-20 text-white p-4 rounded-lg text-center"
              role="alert"
            >
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-20 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
              text-white placeholder-gray-300"
              placeholder="Enter your email"
              aria-required="true"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {isLoading ? 'Sending...' : 'Reset Password'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-white">
            Remember your password? {' '}
            <Link 
              to="/login" 
              className="font-semibold text-white hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
