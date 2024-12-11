import React, { useState } from 'react';

const ScaleConverter: React.FC = () => {
  const [fromScale, setFromScale] = useState<'4.0' | '5.0'>('4.0');
  const [toScale, setToScale] = useState<'4.0' | '5.0'>('5.0');
  const [cgpa, setCgpa] = useState<string>('');
  const [convertedCgpa, setConvertedCgpa] = useState<string | null>(null);

  const convertCGPA = () => {
    if (!cgpa) return;

    const parsedCgpa = parseFloat(cgpa);
    
    // Simple conversion logic (you may want to refine this)
    if (fromScale === '4.0' && toScale === '5.0') {
      setConvertedCgpa((parsedCgpa * 5 / 4).toFixed(2));
    } else if (fromScale === '5.0' && toScale === '4.0') {
      setConvertedCgpa((parsedCgpa * 4 / 5).toFixed(2));
    } else {
      setConvertedCgpa(cgpa);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">From Scale</label>
          <select
            value={fromScale}
            onChange={(e) => setFromScale(e.target.value as '4.0' | '5.0')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="4.0">4.0 Scale</option>
            <option value="5.0">5.0 Scale</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">To Scale</label>
          <select
            value={toScale}
            onChange={(e) => setToScale(e.target.value as '4.0' | '5.0')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="4.0">4.0 Scale</option>
            <option value="5.0">5.0 Scale</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Enter CGPA</label>
        <input
          type="number"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter your CGPA"
          step="0.01"
          min="0"
          max="5"
        />
      </div>

      <button
        onClick={convertCGPA}
        className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Convert CGPA
      </button>

      {convertedCgpa !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">Converted CGPA</h3>
          <p className="text-2xl font-bold text-indigo-600">{convertedCgpa}</p>
        </div>
      )}
    </div>
  );
};

export default ScaleConverter;