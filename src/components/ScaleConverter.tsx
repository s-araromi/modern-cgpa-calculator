import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function ScaleConverter() {
  const [fromScale, setFromScale] = useState<'4.0' | '5.0' | '7.0'>('4.0');
  const [toScale, setToScale] = useState<'4.0' | '5.0' | '7.0'>('5.0');
  const [value, setValue] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const convertCGPA = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    let standardized = numValue / parseFloat(fromScale);
    let converted = standardized * parseFloat(toScale);
    setResult(Number(converted.toFixed(2)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-center">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">From Scale</label>
          <select
            value={fromScale}
            onChange={(e) => setFromScale(e.target.value as '4.0' | '5.0' | '7.0')}
            className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="4.0">4.0</option>
            <option value="5.0">5.0</option>
            <option value="7.0">7.0</option>
          </select>
        </div>

        <ArrowRight className="w-6 h-6 text-gray-400 mt-8" />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">To Scale</label>
          <select
            value={toScale}
            onChange={(e) => setToScale(e.target.value as '4.0' | '5.0' | '7.0')}
            className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="4.0">4.0</option>
            <option value="5.0">5.0</option>
            <option value="7.0">7.0</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Enter CGPA</label>
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter your ${fromScale} scale CGPA`}
          className="w-full px-4 py-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={convertCGPA}
        className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Convert
      </button>

      {result !== null && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-lg text-center animate-fadeIn">
          <h3 className="text-lg font-semibold text-gray-700">Converted CGPA</h3>
          <p className="text-3xl font-bold text-indigo-600">{result}</p>
          <p className="text-sm text-gray-600 mt-2">
            {value} ({fromScale} scale) = {result} ({toScale} scale)
          </p>
        </div>
      )}
    </div>
  );
}