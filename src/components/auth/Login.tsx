import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }

      // Attempt sign in
      const success = await signIn(email, password);

      if (success) {
        // Redirect to dashboard on successful login
        navigate('/dashboard');
      } else {
        // Generic error if sign in fails
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      // Catch any unexpected errors
      console.error('Login error:', err);
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

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Login Form">
          {error && (
            <div 
              className="bg-red-500 bg-opacity-20 text-white p-4 rounded-lg text-center"
              role="alert"
            >
              {error}
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
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-20 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent 
              text-white placeholder-gray-300"
              placeholder="Enter your password"
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/forgot-password" 
            className="text-sm text-white hover:underline block mb-2"
          >
            Forgot Password?
          </Link>
          <p className="text-sm text-white">
            Don't have an account? {' '}
            <Link 
              to="/register" 
              className="font-semibold text-white hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
