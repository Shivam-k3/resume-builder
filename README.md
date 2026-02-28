# ATS-Optimized Resume Builder

A modern, web-based resume builder with real-time preview, smart suggestions, and ATS-optimized templates built with React, TypeScript, and Vite.

## Features

### Core Features
- ✅ **Real-time Preview** - See your resume update as you type
- ✅ **Multiple Templates** - Choose from Modern, Corporate, and Creative designs
- ✅ **PDF Export** - High-quality, ATS-readable PDF export
- ✅ **Smart Sections** - Modular resume sections with drag-and-drop

### Authentication
- Email/Password authentication
- Google OAuth integration (ready to implement)
- Guest mode for temporary resumes

### Resume Sections
All sections are fully modular with Add/Edit/Delete and drag-and-drop reordering:
- Personal Information
- Professional Experience
- Education
- Projects
- Skills
- Certifications
- Achievements
- Links (GitHub, LinkedIn, Portfolio)

### Premium UX Features
- **Inline Editing** - Edit directly in place, no ugly forms
- **Dark Mode** - Easy on the eyes
- **Template Switching** - Change templates with one click
- **Auto-save** - Never lose your work (localStorage persistence)
- **Multiple Resumes** - Create and manage multiple versions
- **Duplicate Resume** - Clone resumes easily
- **Zoom Controls** - Perfect your layout

## Tech Stack

### Frontend
- **React** with **Vite** - Fast development and building
- **TypeScript** - Type safety
- **Tailwind CSS** - Rapid UI development
- **Zustand** - Simple state management with persistence
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Beautiful icons
- **react-to-print** - PDF generation

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Usage Guide

### Creating Your First Resume

1. **Sign In** - Use email/password, Google, or continue as guest
2. **Create Resume** - Click "New Resume" and give it a name
3. **Fill Information** - Add your personal info, experience, education, etc.
4. **Choose Template** - Select from Modern, Corporate, or Creative
5. **Preview & Adjust** - Use zoom controls to review
6. **Export** - Click "Export PDF" to download

### Managing Resumes

- **Switch Resumes** - Use the dropdown to switch between resumes
- **Duplicate** - Click the copy icon to clone a resume
- **Delete** - Click the trash icon to remove a resume

### Drag & Drop

Reorder experience items by dragging the grip icon (⋮⋮) on the left side of each entry.

## Templates

### Modern Template
- Clean, minimal design
- Blue accent colors
- Perfect for tech professionals

### Corporate Template
- Traditional ATS-friendly layout
- Professional gray header
- Ideal for corporate positions

### Creative Template
- Two-column layout with colored sidebar
- Avatar placeholder
- Great for designers and creative roles

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── Login.tsx           # Authentication component
│   ├── resume/
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── ResumeEditor.tsx    # Resume editing panel
│   │   └── ResumePreview.tsx   # Live preview panel
│   └── templates/
│       ├── ModernTemplate.tsx      # Modern/Minimal template
│       ├── CorporateTemplate.tsx   # ATS-friendly template
│       └── CreativeTemplate.tsx    # Designer template
├── store/
│   ├── authStore.ts           # Authentication state
│   ├── resumeStore.ts         # Resume data state
│   └── uiStore.ts            # UI preferences
├── types/
│   └── resume.ts             # TypeScript interfaces
└── utils/                    # Utility functions
```

## License

MIT License
