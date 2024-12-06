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
  cgpa: number;
  classification: string;
  totalCredits: number;
}

const ReportExporter: React.FC<ReportExporterProps> = ({
  courses,
  scale,
  cgpa,
  classification,
  totalCredits,
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
      doc.text(`CGPA: ${cgpa.toFixed(2)}`, 20, 40);
      doc.text(`Classification: ${classification}`, 20, 50);
      doc.text(`Grading Scale: ${scale}`, 20, 60);
      doc.text(`Total Credits: ${totalCredits}`, 20, 70);
      
      // Course Table
      doc.setFontSize(12);
      const tableData = courses.map(course => [
        course.name,
        course.grade,
        course.credits.toString()
      ]);
      
      doc.autoTable({
        head: [['Course Code', 'Grade', 'Units']],
        body: tableData,
        startY: 90,
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
        'Course Code': course.name,
        'Grade': course.grade,
        'Units': course.credits
      }));
      
      const courseSheet = XLSX.utils.json_to_sheet(courseData);
      XLSX.utils.book_append_sheet(workbook, courseSheet, 'Courses');
      
      // Summary data
      const summaryData = [
        { 'Metric': 'CGPA', 'Value': cgpa.toFixed(2) },
        { 'Metric': 'Classification', 'Value': classification },
        { 'Metric': 'Grading Scale', 'Value': scale },
        { 'Metric': 'Total Courses', 'Value': courses.length },
        { 'Metric': 'Total Credits', 'Value': totalCredits }
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
    <div className="flex gap-2">
      <button
        onClick={exportToPDF}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        title="Export as PDF"
      >
        <FileDown className="w-4 h-4" />
        PDF
      </button>
      <button
        onClick={exportToExcel}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        title="Export as Excel"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Excel
      </button>
    </div>
  );
};

export default ReportExporter;
