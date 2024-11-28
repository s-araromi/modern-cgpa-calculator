# GRADIENT - Modern CGPA Calculator

A modern, intuitive CGPA Calculator built with React and TypeScript, designed to help students track and analyze their academic performance with ease. Try it live at [Modern CGPA Calculator](https://modern-cgpa-calculator.vercel.app/)

[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

### Smart CGPA Calculation
- Support for multiple grading scales (4.0, 5.0, and 7.0)
- Real-time CGPA updates as you input courses
- Intelligent input validation
- Easy course management with add/remove functionality

### Performance Analytics
- Comprehensive grade distribution analysis
- Performance trend tracking
- Detailed course summary
- Visual progress indicators

### Modern User Interface
- Clean and intuitive design
- Fully responsive layout
- Accessible on all devices
- Real-time feedback and validation

### Cross-Platform Support
- Works seamlessly on desktop and mobile
- Optimized for various screen sizes
- Consistent experience across devices

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

## Tech Stack

- **Frontend**: React 18.2.0 with TypeScript
- **Styling**: Tailwind CSS for modern UI
- **Build Tool**: Vite for fast development
- **Icons**: Lucide React for beautiful icons
- **Deployment**: Vercel for seamless hosting

## Responsive Design

Fully tested and optimized for:
- Desktop (1920x1080+)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (320x568+)

## Usage Guide

### Calculating Your CGPA

1. **Select Your Grading Scale**
   - Choose between 4.0, 5.0, or 7.0 scales
   - View detailed grade ranges and points

2. **Add Your Courses**
   - Click "Add Course" button
   - Enter course name
   - Select your grade
   - Input course credits (1-6)

3. **Calculate CGPA**
   - Click "Calculate CGPA"
   - View your CGPA and performance analysis
   - Track your academic progress

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

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

## Future Enhancements

- Advanced analytics dashboard
- Custom grading scale support
- Academic goal setting
- Performance predictions
- Course recommendation system
- Dark mode support
- Data import/export
- Mobile app version

## Support

If you found this project helpful, please consider giving it a star on GitHub!
