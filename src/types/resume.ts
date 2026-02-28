export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
  id: string;
  category: string;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface Link {
  id: string;
  type: 'github' | 'linkedin' | 'portfolio' | 'other';
  url: string;
  label: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export type SectionType = 
  | 'personalInfo'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'certifications'
  | 'achievements'
  | 'links';

export type ProfileType = 'student' | 'professional';

export interface Resume {
  id: string;
  name: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  achievements: Achievement[];
  links: Link[];
  customSections: CustomSection[];
  sectionOrder: SectionType[];
  template: 'modern' | 'corporate' | 'creative' | 'minimalist' | 'professional' | 'techfocus' | 'executive';
  profileType: ProfileType;
  targetJobProfile: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  isGuest: boolean;
}
