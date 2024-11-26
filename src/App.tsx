import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, GraduationCap, History, Dna } from 'lucide-react';
import { CGPAForm } from './components/CGPAForm';
import { ScaleConverter } from './components/ScaleConverter';
import { AcademicJourney } from './components/AcademicJourney';
import { AcademicDNAProfiler } from './components/AcademicDNAProfiler';
import { Tooltip } from './components/Tooltip';

export default function App() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'converter' | 'journey' | 'dna'>('calculator');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white/30 backdrop-blur-lg rounded-2xl mb-4">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            CGPA Calculator
          </h1>
          <p className="text-gray-600">Track your academic progress and achievements</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Tooltip text="Calculate your CGPA with course grades and units. Get smart predictions for improvement.">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                activeTab === 'calculator'
                  ? 'bg-white shadow-lg text-indigo-600'
                  : 'bg-white/50 hover:bg-white/70 text-gray-600'
              }`}
            >
              <Calculator className="w-5 h-5" />
              <span>Calculator</span>
            </button>
          </Tooltip>

          <Tooltip text="Convert your CGPA between different scales easily and accurately.">
            <button
              onClick={() => setActiveTab('converter')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                activeTab === 'converter'
                  ? 'bg-white shadow-lg text-indigo-600'
                  : 'bg-white/50 hover:bg-white/70 text-gray-600'
              }`}
            >
              <ArrowRightLeft className="w-5 h-5" />
              <span>Converter</span>
            </button>
          </Tooltip>

          <Tooltip text="Track your progress over semesters and celebrate your academic achievements.">
            <button
              onClick={() => setActiveTab('journey')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                activeTab === 'journey'
                  ? 'bg-white shadow-lg text-indigo-600'
                  : 'bg-white/50 hover:bg-white/70 text-gray-600'
              }`}
            >
              <History className="w-5 h-5" />
              <span>Journey</span>
            </button>
          </Tooltip>

          <Tooltip text="Discover your unique academic learning patterns and optimize your study approach.">
            <button
              onClick={() => setActiveTab('dna')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                activeTab === 'dna'
                  ? 'bg-white shadow-lg text-indigo-600'
                  : 'bg-white/50 hover:bg-white/70 text-gray-600'
              }`}
            >
              <Dna className="w-5 h-5" />
              <span>Academic DNA</span>
            </button>
          </Tooltip>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl mb-8">
          {activeTab === 'calculator' && <CGPAForm />}
          {activeTab === 'converter' && <ScaleConverter />}
          {activeTab === 'journey' && <AcademicJourney />}
          {activeTab === 'dna' && <AcademicDNAProfiler />}
        </div>

        {/* Footer */}
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