# ATS-Optimized Resume Builder

A modern, web-based resume builder with real-time preview, smart suggestions, and ATS-optimized templates built with React, TypeScript, and Vite.

## Features

### Core Features
- ✅ **Real-time Preview** - See your resume update as you type
- ✅ **Multiple Templates** - Choose from 7 professional designs (Modern, Corporate, Creative, Minimalist, Professional, TechFocus, Executive)
- ✅ **PDF Export** - High-quality, ATS-readable PDF export
- ✅ **Smart Sections** - Modular resume sections with drag-and-drop
- ✅ **Profile-Based Customization** - Different section visibility for Student vs Professional profiles
- ✅ **Custom Sections** - Add unlimited custom sections with flexible content
- ✅ **AI Keyword Suggester** - Get intelligent keyword suggestions based on target job profile (9+ job categories)

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
- Custom Sections (create unlimited custom sections)

### Profile Types
Choose between Student or Working Professional profile to get tailored section recommendations:
- **Student Profile** - Emphasizes Education (✨ Priority) and Projects (✨ Priority), hides Professional Experience
- **Professional Profile** - Shows all sections including Professional Experience and Certifications

### AI Keyword Suggester
Get intelligent keyword suggestions based on your target job role:
- 9 pre-configured job profiles: Software Engineer, Web Developer, Data Scientist, Product Manager, UX Designer, Sales Executive, Marketing Manager, Project Manager, DevOps Engineer
- Smart matching algorithm to find relevant keywords
- One-click keyword auto-add to your skills section
- Fully customizable with job title autocomplete

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

### Using Profile Types

1. **Select Your Profile Type** - Choose between "Student" or "Professional" at the top of the editor
2. **View Dynamic Sections** - The available sections change based on your profile type
3. **Students See**: Education (Priority ✨), Projects (Priority ✨), Skills, Certifications, Achievements, Personal Info, Custom Sections
4. **Professionals See**: All sections including Professional Experience

### Using the AI Keyword Suggester

1. **Enter Target Job** - Type the job title you're targeting (e.g., "Software Engineer", "Product Manager")
2. **Get Suggestions** - The suggester will show relevant keywords organized by category
3. **Auto-Add Keywords** - Click the "+" button next to any keyword to automatically add it to your skills
4. **Customize** - Edit suggested keywords or add your own custom keywords

## Templates

Choose from 7 professionally-designed templates, each optimized for different industries:

### Modern Template
- Clean, minimal design with blue accent colors
- Perfect for tech professionals and startups

### Corporate Template
- Traditional ATS-friendly layout with professional gray header
- Ideal for corporate and formal positions

### Creative Template
- Two-column layout with colored sidebar and avatar placeholder
- Great for designers and creative roles

### Minimalist Template
- Ultra-clean design focused on content
- Best for traditional industries

### Professional Template
- Classic resume layout with traditional styling
- Suitable for all professional backgrounds

### TechFocus Template
- Modern design emphasizing technical skills and projects
- Optimized for software engineers and developers

### Executive Template
- Premium, sophisticated design for leadership roles
- Perfect for C-suite and executive positions

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── Login.tsx                    # Authentication component
│   ├── resume/
│   │   ├── Dashboard.tsx                # Main dashboard
│   │   ├── ResumeEditor.tsx             # Resume editing panel
│   │   ├── ResumePreview.tsx            # Live preview panel
│   │   └── KeywordSuggester.tsx         # AI keyword suggester component
│   └── templates/
│       ├── ModernTemplate.tsx           # Modern/Minimal template
│       ├── CorporateTemplate.tsx        # ATS-friendly template
│       ├── CreativeTemplate.tsx         # Designer template
│       ├── MinimalistTemplate.tsx       # Clean minimalist template
│       ├── ProfessionalTemplate.tsx     # Traditional professional template
│       ├── TechFocusTemplate.tsx        # Tech-focused template
│       └── ExecutiveTemplate.tsx        # Executive-level template
├── store/
│   ├── authStore.ts                     # Authentication state
│   ├── resumeStore.ts                   # Resume data state with profile support
│   └── uiStore.ts                       # UI preferences
├── types/
│   └── resume.ts                        # TypeScript interfaces
└── utils/
    └── keywordSuggestions.ts            # AI keyword suggestion engine
```

## License

MIT License
