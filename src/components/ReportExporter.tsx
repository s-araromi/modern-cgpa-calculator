import React, { useRef } from 'react';
import { Download, FileSpreadsheet, FilePdf } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

interface Scenario {
  id: string;
  name: string;
  courses: Course[];
  resultingCGPA: number;
  improvement: number;
}

interface ReportExporterProps {
  courses: Course[];
  scale: '4.0' | '5.0' | '7.0';
  currentCGPA: number;
  scenarios?: Scenario[];
  gradePoints: Record<string, Record<string, number>>;
}

const ReportExporter: React.FC<ReportExporterProps> = ({
  courses,
  scale,
  currentCGPA,
  scenarios = [],
  gradePoints,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    const pdf = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    // Add header
    pdf.setFontSize(20);
    pdf.text('CGPA Report', 105, 15, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text(`Generated on ${currentDate}`, 105, 22, { align: 'center' });
    pdf.text(`Scale: ${scale}`, 105, 27, { align: 'center' });

    // Current CGPA
    pdf.setFontSize(16);
    pdf.text('Current CGPA', 20, 40);
    pdf.setFontSize(14);
    pdf.text(currentCGPA.toFixed(2), 20, 48);

    // Course List
    pdf.setFontSize(16);
    pdf.text('Course Details', 20, 65);
    
    const courseData = courses.map(course => [
      course.name || 'Unnamed Course',
      course.grade,
      course.credits.toString(),
      gradePoints[scale][course.grade]?.toString() || '0'
    ]);

    (pdf as any).autoTable({
      startY: 70,
      head: [['Course Name', 'Grade', 'Credits', 'Grade Points']],
      body: courseData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Scenarios if available
    if (scenarios.length > 0) {
      const finalY = (pdf as any).lastAutoTable.finalY || 70;
      pdf.setFontSize(16);
      pdf.text('Future Scenarios', 20, finalY + 20);

      const scenarioData = scenarios.map(scenario => [
        scenario.name,
        scenario.courses.length.toString(),
        scenario.resultingCGPA.toFixed(2),
        (scenario.improvement >= 0 ? '+' : '') + scenario.improvement.toFixed(2)
      ]);

      (pdf as any).autoTable({
        startY: finalY + 25,
        head: [['Scenario', 'Courses', 'Projected CGPA', 'Change']],
        body: scenarioData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }
      });
    }

    // Save the PDF
    pdf.save('cgpa-report.pdf');
  };

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();

    // Current Courses Sheet
    const courseData = courses.map(course => ({
      'Course Name': course.name || 'Unnamed Course',
      'Grade': course.grade,
      'Credits': course.credits,
      'Grade Points': gradePoints[scale][course.grade] || 0,
      'Quality Points': (gradePoints[scale][course.grade] || 0) * course.credits
    }));

    const ws = XLSX.utils.json_to_sheet(courseData);
    XLSX.utils.book_append_sheet(wb, ws, 'Current Courses');

    // Summary Sheet
    const summaryData = [
      { 'Metric': 'Current CGPA', 'Value': currentCGPA.toFixed(2) },
      { 'Metric': 'Total Courses', 'Value': courses.length },
      { 'Metric': 'Total Credits', 'Value': courses.reduce((sum, course) => sum + course.credits, 0) },
      { 'Metric': 'Scale', 'Value': scale }
    ];

    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Scenarios Sheet (if available)
    if (scenarios.length > 0) {
      const scenarioData = scenarios.map(scenario => ({
        'Scenario Name': scenario.name,
        'Number of Courses': scenario.courses.length,
        'Projected CGPA': scenario.resultingCGPA.toFixed(2),
        'CGPA Change': (scenario.improvement >= 0 ? '+' : '') + scenario.improvement.toFixed(2)
      }));

      const scenarioWs = XLSX.utils.json_to_sheet(scenarioData);
      XLSX.utils.book_append_sheet(wb, scenarioWs, 'Scenarios');
    }

    // Save the Excel file
    XLSX.writeFile(wb, 'cgpa-report.xlsx');
  };

  return (
    <div className="mt-8 p-6 bg-white/50 backdrop-blur-md rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Export Report</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={generatePDF}
          className="flex items-center justify-center gap-2 p-4 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
        >
          <FilePdf className="w-5 h-5 text-red-600" />
          <span className="text-red-700 font-medium">Export as PDF</span>
        </button>

        <button
          onClick={generateExcel}
          className="flex items-center justify-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
        >
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">Export as Excel</span>
        </button>
      </div>

      <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">About Reports</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• PDF reports include detailed course information and visualizations</li>
          <li>• Excel reports provide raw data for further analysis</li>
          <li>• Both formats include current CGPA and future scenarios</li>
          <li>• Use these reports for academic planning and record-keeping</li>
        </ul>
      </div>

      {/* Hidden report template for PDF generation */}
      <div ref={reportRef} className="hidden">
        <div id="report-content">
          <h1>CGPA Report</h1>
          <p>Scale: {scale}</p>
          <p>Current CGPA: {currentCGPA.toFixed(2)}</p>
          {/* Add more content as needed */}
        </div>
      </div>
    </div>
  );
};

export default ReportExporter;
