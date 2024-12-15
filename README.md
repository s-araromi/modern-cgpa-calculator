# Modern CGPA Calculator 📊🎓

## Overview
Modern CGPA Calculator is an advanced, user-friendly web application designed to help students track, calculate, and analyze their academic performance with precision and ease.

## 🌟 Features
- **CGPA Calculator**: Accurately calculate your cumulative GPA
- **Scale Converter**: Convert GPAs between different grading scales (4.0, 5.0, 7.0)
- **Academic Journey Tracking**: Monitor your academic progress
- **Performance Analysis**: Gain insights into your academic performance
- **Responsive Design**: Works seamlessly across devices

## 🚀 Technologies
- **Frontend**: React with TypeScript
- **State Management**: React Hooks
- **Styling**: Tailwind CSS
- **Authentication**: Supabase
- **Build Tool**: Vite
- **Package Manager**: Yarn

## 🔧 Prerequisites
- Node.js (v18+)
- Yarn package manager
- Supabase account

## 🚀 Deployment Guide

### Environment Variables
Create a `.env` file in the project root with the following:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment Options

#### 1. Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel`

#### 2. Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Login to Netlify: `netlify login`
3. Deploy: `netlify deploy`
   - For production: `netlify deploy --prod`

#### 3. Render
1. Create a `render.yaml` in project root:
```yaml
services:
  - type: web
    name: modern-cgpa-calculator
    env: static
    buildCommand: yarn build
    staticPublishPath: ./dist
```
2. Connect your GitHub repository on Render

#### 4. GitHub Pages
1. Install gh-pages: `yarn add -D gh-pages`
2. Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "yarn build",
    "deploy": "gh-pages -d dist"
  }
}
```
3. Deploy: `yarn deploy`

### Post-Deployment
- Ensure Supabase project is configured
- Set up CORS in Supabase
- Configure environment variables in deployment platform

## 🛠 Local Development
1. Clone the repository
2. Install dependencies: `yarn install`
3. Set up environment variables
4. Run development server: `yarn dev`

## 📊 Usage
1. Sign up or log in
2. Select your grading scale
3. Enter course details (code, units, grades)
4. Calculate and track your CGPA
5. Use the scale converter to compare different grading systems

## 📊 Grading Scales Supported
- 4.0 Scale
- 5.0 Scale
- 7.0 Scale

## 🔒 Authentication
Secure authentication powered by Supabase, ensuring your academic data remains private.

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact
Sulaimon Araromi - [@s_araromi](https://twitter.com/s_araromi)
Project Link: [https://github.com/s-araromi/modern-cgpa-calculator](https://github.com/s-araromi/modern-cgpa-calculator)

## 🙏 Acknowledgements
- React
- TypeScript
- Supabase
- Tailwind CSS
- Vite
