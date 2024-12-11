import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await signIn(email, password);
      if (success) {
        navigate('/');
      } else {
        setError(authError || 'Failed to sign in');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 p-6 relative overflow-hidden">
      {/* 3D Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 transform -skew-y-12 -rotate-6 scale-125 opacity-20"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
        {/* Gradient Logo */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-700 
              rounded-full flex items-center justify-center shadow-lg">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                className="fill-white w-10 h-10"
              >
                <path d="M12 3L1 9l11 6 9-4.9V17h2V9z"/>
                <path d="M2.24 9.99L12 15.48l9.77-5.49-1.54-.84L12 13.06 3.79 9.15z"/>
                <path d="M12 16.48L4.24 11.99 2.24 13.01 12 18.52l9.77-5.51-2-1.02z"/>
              </svg>
            </div>
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent 
              bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-700 
              mb-2">Gradient</h1>
          </div>
          <h2 className="text-2xl font-semibold text-white">
            CGPA Calculator and Converter
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || authError) && (
            <div className="bg-red-500 bg-opacity-20 text-white p-4 rounded-lg text-center">
              {error || authError}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-20 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
              text-white placeholder-gray-300"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-20 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
              text-white placeholder-gray-300"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-all duration-300 
              ${loading 
                ? 'bg-purple-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-white text-sm">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-blue-300 hover:text-blue-200 underline transition duration-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
