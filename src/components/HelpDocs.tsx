import React from 'react';
import { HelpCircle, Calculator, ArrowRightLeft, History } from 'lucide-react';

const HelpDocs = () => {
  const sections = [
    {
      title: 'CGPA Calculator',
      icon: <Calculator className="w-6 h-6" />,
      content: [
        'Enter your course details including name, grade, and credit units',
        'Select from 4.0 or 5.0 grading scales',
        'Grades are automatically converted to grade points',
        'Your CGPA is calculated instantly',
        'Set target CGPA to get improvement suggestions'
      ]
    },
    {
      title: 'CGPA Converter',
      icon: <ArrowRightLeft className="w-6 h-6" />,
      content: [
        'Convert between different grading scales (4.0, 5.0)',
        'See equivalent grades across scales',
        'Understand your academic standing in different systems'
      ]
    },
    {
      title: 'Academic Journey',
      icon: <History className="w-6 h-6" />,
      content: [
        'Track your academic progress over time',
        'Visualize your grade improvements',
        'Set and monitor academic goals'
      ]
    }
  ];

  const gradingScales = {
    '4.0 Scale': [
      { grade: 'A', points: '4.0', range: '70% and above' },
      { grade: 'B', points: '3.0', range: '60-69%' },
      { grade: 'C', points: '2.0', range: '50-59%' },
      { grade: 'D', points: '1.0', range: '45-49%' },
      { grade: 'E', points: '0.0', range: '40-44%' },
      { grade: 'F', points: '0.0', range: 'Below 40%' }
    ],
    '5.0 Scale': [
      { grade: 'A', points: '5.0', range: '70% and above' },
      { grade: 'B', points: '4.0', range: '60-69%' },
      { grade: 'C', points: '3.0', range: '50-59%' },
      { grade: 'D', points: '2.0', range: '45-49%' },
      { grade: 'F', points: '0.0', range: 'Below 45%' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <HelpCircle className="w-8 h-8 text-indigo-600" />
          Help & Documentation
        </h2>
        <p className="text-gray-600 mt-2">
          Learn how to use the Modern CGPA Calculator effectively
        </p>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              {section.icon}
              <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.content.map((item, index) => (
                <li key={index} className="text-gray-600 flex items-start gap-2">
                  <span className="text-indigo-600 mt-1">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Grading Scales Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Grading Scales</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(gradingScales).map(([scale, grades]) => (
            <div key={scale} className="p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">{scale}</h4>
              <div className="space-y-2">
                {grades.map((grade) => (
                  <div key={grade.grade} className="text-sm text-gray-600">
                    <span className="font-medium">{grade.grade}</span> ({grade.points}) - {grade.range}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div className="p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              How is CGPA calculated?
            </h4>
            <p className="text-gray-600">
              CGPA is calculated by multiplying each course's grade point by its credit units, summing these products, and dividing by the total credit units.
            </p>
          </div>
          <div className="p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              How do I convert between different scales?
            </h4>
            <p className="text-gray-600">
              Use the CGPA Converter tab to convert between 4.0 and 5.0 scales. The converter automatically adjusts for different grade ranges and weightings.
            </p>
          </div>
          <div className="p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              What should I do if I find an error?
            </h4>
            <p className="text-gray-600">
              Use the feedback form to report any issues or suggest improvements. Include as much detail as possible to help us understand and fix the problem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpDocs;
