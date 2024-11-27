import { useState } from 'react';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

type GradeScale = '4.0' | '5.0' | '7.0';
type GradePoints = Record<GradeScale, Record<string, number>>;

interface ReportExporterProps {
  courses: Course[];
  scale: GradeScale;
  currentCGPA: number | null;
  gradePoints: GradePoints;
}

const ReportExporter: React.FC<ReportExporterProps> = ({
  courses,
  scale,
  currentCGPA,
  gradePoints,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('Academic Performance Report', 20, 20);
      
      // CGPA Summary
      doc.setFontSize(16);
      doc.text(`Current CGPA: ${currentCGPA?.toFixed(2) || 'N/A'}`, 20, 40);
      doc.text(`Grading Scale: ${scale}`, 20, 50);
      
      // Course Table
      doc.setFontSize(12);
      const tableData = courses.map(course => [
        course.name,
        course.grade,
        course.credits.toString(),
        (gradePoints[scale][course.grade] * course.credits).toFixed(2)
      ]);
      
      doc.autoTable({
        head: [['Course', 'Grade', 'Credits', 'Points']],
        body: tableData,
        startY: 70,
      });
      
      // Save the PDF
      doc.save('academic-report.pdf');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = () => {
    setIsExporting(true);
    try {
      const workbook = XLSX.utils.book_new();
      
      // Course data
      const courseData = courses.map(course => ({
        'Course Name': course.name,
        'Grade': course.grade,
        'Credits': course.credits,
        'Grade Points': gradePoints[scale][course.grade],
        'Total Points': gradePoints[scale][course.grade] * course.credits
      }));
      
      const courseSheet = XLSX.utils.json_to_sheet(courseData);
      XLSX.utils.book_append_sheet(workbook, courseSheet, 'Courses');
      
      // Summary data
      const summaryData = [
        { 'Metric': 'Current CGPA', 'Value': currentCGPA?.toFixed(2) || 'N/A' },
        { 'Metric': 'Grading Scale', 'Value': scale },
        { 'Metric': 'Total Courses', 'Value': courses.length },
        { 'Metric': 'Total Credits', 'Value': courses.reduce((sum, c) => sum + c.credits, 0) }
      ];
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      
      // Save the file
      XLSX.writeFile(workbook, 'academic-report.xlsx');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export Excel file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Export Report</h3>
      
      <div className="flex gap-4">
        <button
          onClick={exportToPDF}
          disabled={isExporting || !courses.length}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown className="w-5 h-5" />
          Export PDF
        </button>
        
        <button
          onClick={exportToExcel}
          disabled={isExporting || !courses.length}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Export Excel
        </button>
      </div>
    </div>
  );
};

export default ReportExporter;
