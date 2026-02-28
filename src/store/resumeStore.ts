import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Resume, SectionType } from '../types/resume';

interface ResumeState {
  resumes: Resume[];
  currentResumeId: string | null;
  currentResume: Resume | null;
  syncCurrentResume: () => void;
  
  // Actions
  createResume: (name: string) => void;
  updateResume: (id: string, data: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  duplicateResume: (id: string) => void;
  setCurrentResume: (id: string) => void;
  updateSectionOrder: (order: SectionType[]) => void;
  addEducation: (education: any) => void;
  updateEducation: (id: string, data: any) => void;
  deleteEducation: (id: string) => void;
  addExperience: (experience: any) => void;
  updateExperience: (id: string, data: any) => void;
  deleteExperience: (id: string) => void;
  addProject: (project: any) => void;
  updateProject: (id: string, data: any) => void;
  deleteProject: (id: string) => void;
  addSkill: (skill: any) => void;
  updateSkill: (id: string, data: any) => void;
  deleteSkill: (id: string) => void;
  addCertification: (certification: any) => void;
  updateCertification: (id: string, data: any) => void;
  deleteCertification: (id: string) => void;
  addAchievement: (achievement: any) => void;
  updateAchievement: (id: string, data: any) => void;
  deleteAchievement: (id: string) => void;
  addLink: (link: any) => void;
  updateLink: (id: string, data: any) => void;
  deleteLink: (id: string) => void;
  updatePersonalInfo: (data: any) => void;
}

const createEmptyResume = (name: string): Resume => ({
  id: Date.now().toString(),
  name,
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
  },
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  achievements: [],
  links: [],
  sectionOrder: ['personalInfo', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'links'],
  template: 'modern',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: [],
      currentResumeId: null,
      currentResume: null,

      syncCurrentResume: () => {
        const state = get();
        if (state.resumes.length === 0) {
          set({ currentResumeId: null, currentResume: null });
          return;
        }

        const byId = state.currentResumeId
          ? state.resumes.find((r) => r.id === state.currentResumeId) || null
          : null;

        if (byId) {
          set({ currentResume: byId });
          return;
        }

        const fallback = state.resumes[0];
        set({ currentResumeId: fallback.id, currentResume: fallback });
      },

      createResume: (name: string) => {
        const newResume = createEmptyResume(name);
        set((state) => ({
          resumes: [...state.resumes, newResume],
          currentResumeId: newResume.id,
          currentResume: newResume,
        }));
      },

      updateResume: (id: string, data: Partial<Resume>) => {
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          ),
          currentResume:
            state.currentResumeId === id
              ? { ...state.currentResume!, ...data, updatedAt: new Date().toISOString() }
              : state.currentResume,
        }));
      },

      deleteResume: (id: string) => {
        set((state) => {
          const filteredResumes = state.resumes.filter((r) => r.id !== id);
          const deletingCurrent = state.currentResumeId === id;
          const nextCurrent = deletingCurrent ? (filteredResumes[0] ?? null) : state.currentResume;

          return {
            resumes: filteredResumes,
            currentResumeId: deletingCurrent ? (nextCurrent?.id ?? null) : state.currentResumeId,
            currentResume: nextCurrent,
          };
        });
      },

      duplicateResume: (id: string) => {
        const resume = get().resumes.find((r) => r.id === id);
        if (resume) {
          const duplicated = {
            ...resume,
            id: Date.now().toString(),
            name: `${resume.name} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          set((state) => ({
            resumes: [...state.resumes, duplicated],
            currentResumeId: duplicated.id,
            currentResume: duplicated,
          }));
        }
      },

      setCurrentResume: (id: string) => {
        if (!id) {
          return;
        }
        const resume = get().resumes.find((r) => r.id === id);
        if (resume) {
          set({ currentResumeId: id, currentResume: resume });
        }
      },

      updateSectionOrder: (order: SectionType[]) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          const updated = { ...currentResume, sectionOrder: order };
          get().updateResume(currentResume.id, updated);
        }
      },

      addEducation: (education: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            education: [...currentResume.education, { ...education, id: Date.now().toString() }],
          });
        }
      },

      updateEducation: (id: string, data: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            education: currentResume.education.map((e) => (e.id === id ? { ...e, ...data } : e)),
          });
        }
      },

      deleteEducation: (id: string) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            education: currentResume.education.filter((e) => e.id !== id),
          });
        }
      },

      addExperience: (experience: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            experience: [...currentResume.experience, { ...experience, id: Date.now().toString() }],
          });
        }
      },

      updateExperience: (id: string, data: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            experience: currentResume.experience.map((e) => (e.id === id ? { ...e, ...data } : e)),
          });
        }
      },

      deleteExperience: (id: string) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            experience: currentResume.experience.filter((e) => e.id !== id),
          });
        }
      },

      addProject: (project: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            projects: [...currentResume.projects, { ...project, id: Date.now().toString() }],
          });
        }
      },

      updateProject: (id: string, data: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            projects: currentResume.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
          });
        }
      },

      deleteProject: (id: string) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            projects: currentResume.projects.filter((p) => p.id !== id),
          });
        }
      },

      addSkill: (skill: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            skills: [...currentResume.skills, { ...skill, id: Date.now().toString() }],
          });
        }
      },

      updateSkill: (id: string, data: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            skills: currentResume.skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
          });
        }
      },

      deleteSkill: (id: string) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            skills: currentResume.skills.filter((s) => s.id !== id),
          });
        }
      },

      addCertification: (certification: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            certifications: [...currentResume.certifications, { ...certification, id: Date.now().toString() }],
          });
        }
      },

      updateCertification: (id: string, data: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            certifications: currentResume.certifications.map((c) => (c.id === id ? { ...c, ...data } : c)),
          });
        }
      },

      deleteCertification: (id: string) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            certifications: currentResume.certifications.filter((c) => c.id !== id),
          });
        }
      },

      addAchievement: (achievement: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            achievements: [...currentResume.achievements, { ...achievement, id: Date.now().toString() }],
          });
        }
      },

      updateAchievement: (id: string, data: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            achievements: currentResume.achievements.map((a) => (a.id === id ? { ...a, ...data } : a)),
          });
        }
      },

      deleteAchievement: (id: string) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            achievements: currentResume.achievements.filter((a) => a.id !== id),
          });
        }
      },

      addLink: (link: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            links: [...currentResume.links, { ...link, id: Date.now().toString() }],
          });
        }
      },

      updateLink: (id: string, data: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            links: currentResume.links.map((l) => (l.id === id ? { ...l, ...data } : l)),
          });
        }
      },

      deleteLink: (id: string) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            links: currentResume.links.filter((l) => l.id !== id),
          });
        }
      },

      updatePersonalInfo: (data: any) => {
        const currentResume = get().currentResume;
        if (currentResume) {
          get().updateResume(currentResume.id, {
            personalInfo: { ...currentResume.personalInfo, ...data },
          });
        }
      },
    }),
    {
      name: 'resume-storage',
    }
  )
);
