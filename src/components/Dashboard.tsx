import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRightLeft, History, MessageSquare, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from './auth/AuthContext';
import Tooltip from './Tooltip';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'calculator' | 'converter' | 'journey' | 'feedback' | 'help'>('calculator');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              GRADIENT
            </h1>
            <p className="text-gray-600">Welcome, {user?.fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            CGPA Calculator and Converter
          </h2>
          <p className="text-lg text-gray-600 mb-2 animate-fade-in">
            From Grades to Greatness...
          </p>
          <p className="text-lg text-gray-600">
            Calculate, convert, and track your academic performance
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Tooltip text="Calculate your CGPA with course grades and units">
            <button
              onClick={() => handleTabChange('calculator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'calculator'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700'
              } transition-all`}
            >
              <Calculator className="w-5 h-5" />
              <span>CGPA Calculator</span>
            </button>
          </Tooltip>

          <Tooltip text="Convert between different CGPA scales">
            <button
              onClick={() => handleTabChange('converter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'converter'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700'
              } transition-all`}
            >
              <ArrowRightLeft className="w-5 h-5" />
              <span>CGPA Converter</span>
            </button>
          </Tooltip>

          <Tooltip text="Track your academic progress">
            <button
              onClick={() => handleTabChange('journey')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'journey'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700'
              } transition-all`}
            >
              <History className="w-5 h-5" />
              <span>Academic Journey</span>
            </button>
          </Tooltip>

          <Tooltip text="Share your feedback">
            <button
              onClick={() => handleTabChange('feedback')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'feedback'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700'
              } transition-all`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Feedback</span>
            </button>
          </Tooltip>

          <Tooltip text="View help and documentation">
            <button
              onClick={() => handleTabChange('help')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'help'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700'
              } transition-all`}
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help</span>
            </button>
          </Tooltip>
        </div>

        <footer className="text-center text-gray-600 text-sm py-4 mt-auto">
          <p>
            Designed and developed by{' '}
            <a
              href="https://github.com/s-araromi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300 hover:underline"
            >
              Sulaimon Araromi
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
