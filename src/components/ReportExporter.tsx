import React from 'react';
import { Download } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface Props {
  courses: Course[];
  cgpa: number;
  totalCredits: number;
  scale: string;
}

const ReportExporter: React.FC<Props> = ({ courses, cgpa, totalCredits, scale }) => {
  const generateReport = () => {
    const timestamp = new Date().toLocaleString();
    const report = `CGPA Report - Generated on ${timestamp}
    
Overall CGPA: ${cgpa.toFixed(2)} (${scale} scale)
Total Credits: ${totalCredits}

Course Breakdown:
${courses.map(course => `${course.name}: Grade ${course.grade} (${course.credits} credits)`).join('\n')}
`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cgpa-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generateReport}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
    >
      <Download className="w-4 h-4" />
      Export Report
    </button>
  );
};

export default ReportExporter;
