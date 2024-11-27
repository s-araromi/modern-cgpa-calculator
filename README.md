# GRADIENT - Modern CGPA Calculator

A modern, intuitive CGPA Calculator built with React and TypeScript, designed to provide a seamless academic performance tracking experience.

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

### 1. Multi-Scale CGPA Calculator
- **Flexible Grading Scales**: Support for 4.0, 5.0, and 7.0 scales
- **Real-time Calculation**: Instant CGPA updates as you input courses
- **Detailed Grade Information**: Comprehensive grade ranges and point values
- **Smart Input Validation**: Prevents common input errors
- **Course Management**: Easy addition and removal of courses

### 2. Academic Journey Tracking
- **Semester Management**: Track progress across multiple semesters
- **Course History**: Detailed record of all courses and grades
- **Performance Analytics**: 
  - Average CGPA tracking
  - Performance trend analysis
  - Consistency metrics
  - Visual progress indicators
- **PDF Export**: Generate professional PDF reports of your academic journey

### 3. Performance Analytics Dashboard
- **Real-time Metrics**: Track your academic progress instantly
- **Trend Analysis**: Visualize your performance trends
- **Consistency Tracking**: Measure your academic stability
- **Achievement System**: Track and celebrate academic milestones

### 4. User-Friendly Interface
- **Intuitive Design**: Clean and modern UI with clear labels
- **Responsive Layout**: Works perfectly on all devices
- **Helpful Documentation**: Built-in guides and tooltips
- **Visual Feedback**: Clear indicators for actions and results

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/s-araromi/modern-cgpa-calculator.git
cd modern-cgpa-calculator
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Build for production
```bash
npm run build
# or
yarn build
```

## Tech Stack

- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Generation**: html2pdf.js
- **State Management**: React Hooks
- **Form Handling**: Native React state
- **Animations**: Tailwind CSS transitions

## Responsive Design

The application is fully responsive and tested on:
- Desktop (1920x1080 and higher)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (320x568 and higher)

## Usage Guide

### Calculating Your CGPA

1. **Choose Your Grading Scale**
   - Select from 4.0, 5.0, or 7.0 scales
   - Review the grade ranges and points
   - Understand your institution's scale

2. **Adding Courses**
   - Click "Add Course" button
   - Enter the course name
   - Select your grade (includes percentage range)
   - Input course units (typically 1-6)

3. **Managing Courses**
   - Remove courses using the trash icon
   - Edit course details at any time
   - Add as many courses as needed

4. **Tracking Progress**
   - View real-time CGPA calculations
   - Monitor performance trends
   - Export academic records to PDF
   - Analyze consistency metrics

## Privacy & Security

- **Client-Side Processing**: All calculations performed locally
- **No Data Storage**: No personal information collected
- **No External Dependencies**: Works offline after initial load
- **No API Calls**: Complete privacy of academic data

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch
```bash
git checkout -b feature/YourFeature
```
3. Commit your changes
```bash
git commit -m 'Add YourFeature'
```
4. Push to the branch
```bash
git push origin feature/YourFeature
```
5. Open a Pull Request

## Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Custom grading scale support
- [ ] Academic goal setting
- [ ] Performance predictions
- [ ] Course recommendation system
- [ ] Dark mode support
- [ ] Data import/export
- [ ] Mobile app version

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React and TypeScript communities
- Tailwind CSS team
- All contributors and users

## Contact

- GitHub: [s-araromi](https://github.com/s-araromi)
- Project Link: [modern-cgpa-calculator](https://github.com/s-araromi/modern-cgpa-calculator)

## Development

### Project Structure
```
src/
├── components/        # React components
│   ├── CGPAForm/     # Main calculator component
│   ├── AcademicJourney/  # Progress tracking
│   └── Analytics/    # Performance analytics
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

### Key Components
- `CGPAForm`: Main calculator interface
- `AcademicJourney`: Semester and progress tracking
- `Analytics`: Performance metrics and visualizations
- `PDFExport`: Report generation functionality

### Best Practices
- TypeScript for type safety
- Functional components with hooks
- Responsive design principles
- Progressive enhancement
- Accessibility considerations
