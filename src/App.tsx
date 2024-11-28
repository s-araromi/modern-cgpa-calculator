import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, History, MessageSquare, HelpCircle } from 'lucide-react';
import CGPAForm from './components/CGPAForm';
import ScaleConverter from './components/ScaleConverter';
import AcademicJourney from './components/AcademicJourney';
import FeedbackForm from './components/FeedbackForm';
import HelpDocs from './components/HelpDocs';
import Tooltip from './components/Tooltip';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'converter' | 'journey' | 'feedback' | 'help'>('calculator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          {/* App Name with Gradient Text */}
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
            GRADIENT
          </h1>
          
          {/* Main Title */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            CGPA Calculator and Converter
          </h2>
          
          {/* Tagline with Subtle Animation */}
          <p className="text-lg text-gray-600 mb-2 animate-fade-in">
            From Grades to Greatness...
          </p>
          
          {/* Description */}
          <p className="text-lg text-gray-600">
            Calculate, convert, and track your academic performance
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Tooltip text="Calculate your CGPA with course grades and units">
            <button
              onClick={() => setActiveTab('calculator')}
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
              onClick={() => setActiveTab('converter')}
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
              onClick={() => setActiveTab('journey')}
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
              onClick={() => setActiveTab('feedback')}
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
              onClick={() => setActiveTab('help')}
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

        <div className="mb-8">
          {activeTab === 'calculator' && <CGPAForm />}
          {activeTab === 'converter' && <ScaleConverter />}
          {activeTab === 'journey' && <AcademicJourney />}
          {activeTab === 'feedback' && <FeedbackForm />}
          {activeTab === 'help' && <HelpDocs />}
        </div>

        <footer className="text-center text-gray-600 text-sm py-4 mt-auto">
          <p>Designed and developed by{' '}
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
}