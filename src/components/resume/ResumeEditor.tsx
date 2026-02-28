import { useResumeStore } from '../../store/resumeStore';
import { useUIStore } from '../../store/uiStore';
import { Plus, Trash2, GripVertical, Sparkles, LayoutTemplate } from 'lucide-react';
import { KeywordSuggester } from './KeywordSuggester';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

const SortableItem = ({ id, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="bg-gradient-to-r from-white to-emerald-50 dark:from-slate-900 dark:to-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-emerald-100 dark:hover:bg-emerald-800/40 rounded transition-colors"
          >
            <GripVertical className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </button>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

const ResumeEditor = () => {
  const {
    currentResume,
    updatePersonalInfo,
    addExperience,
    deleteExperience,
    updateExperience,
    updateResume,
    addEducation,
    updateEducation,
    deleteEducation,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addCertification,
    updateCertification,
    deleteCertification,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addLink,
    updateLink,
    deleteLink,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    updateProfileType,
    updateTargetJobProfile,
  } = useResumeStore();
  const { selectedTemplate, setSelectedTemplate } = useUIStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No resume selected</p>
      </div>
    );
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentResume.experience.findIndex((exp) => exp.id === active.id);
      const newIndex = currentResume.experience.findIndex((exp) => exp.id === over.id);

      const newOrder = arrayMove(currentResume.experience, oldIndex, newIndex);
      updateResume(currentResume.id, { experience: newOrder });
    }
  };

  return (
    <div className="h-full min-h-0 overflow-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="w-full p-4 sm:p-6 space-y-5">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-blue-900/20 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Edit Resume</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {currentResume.profileType === 'student' 
                  ? '👨‍🎓 Student Profile - Showing: Education (Priority), Projects (Priority), Skills, Certifications & Achievements' 
                  : '💼 Professional Profile - Showing: Experience (Priority), Education, Skills, Projects & Certifications'}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-700 dark:text-amber-300 px-3 py-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              ATS Ready
            </div>
          </div>
        </div>

        {/* Profile Type Selector */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Profile Type</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select your profile to customize the resume sections</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateProfileType('student')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  currentResume.profileType === 'student'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-400'
                }`}
              >
                👨‍🎓 Student
              </button>
              <button
                onClick={() => updateProfileType('professional')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  currentResume.profileType === 'professional'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-400'
                }`}
              >
                💼 Working Professional
              </button>
            </div>
          </div>
        </div>

        {/* Keyword Suggester */}
        <KeywordSuggester
          currentJobProfile={currentResume.targetJobProfile}
          onJobProfileChange={updateTargetJobProfile}
          onAddKeyword={(keyword, category) => {
            const existingCategory = currentResume.skills.find(s => s.category === category);
            if (existingCategory) {
              if (!existingCategory.skills.includes(keyword)) {
                updateSkill(existingCategory.id, { skills: [...existingCategory.skills, keyword] });
              }
            } else {
              addSkill({ category, skills: [keyword] });
            }
          }}
        />

        {/* Personal Info Section */}
        <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"></div>
            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">Personal Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                value={currentResume.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">
                Professional Title
              </label>
              <input
                type="text"
                value={currentResume.personalInfo.title}
                onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white"
                placeholder="Software Engineer"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={currentResume.personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">
                  Phone
                </label>
                <input
                  type="tel"
                  value={currentResume.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">
                Location
              </label>
              <input
                type="text"
                value={currentResume.personalInfo.location}
                onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-600 dark:text-slate-400">
                Summary
              </label>
              <textarea
                value={currentResume.personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                rows={4}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white"
                placeholder="Brief professional summary..."
              />
            </div>
          </div>
        </div>

        {/* Experience Section - For Working Professionals */}
        {currentResume.profileType === 'professional' && (
        <div className="bg-gradient-to-br from-white to-orange-50 dark:from-slate-900 dark:to-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-200">Experience</h3>
            </div>
            <button
              onClick={() =>
                addExperience({
                  company: '',
                  position: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: [''],
                })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>

          {currentResume.experience.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No experience added yet</p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentResume.experience.map((exp) => exp.id)}
                strategy={verticalListSortingStrategy}
              >
                {currentResume.experience.map((exp) => (
                  <SortableItem key={exp.id} id={exp.id}>
                    <div className="space-y-2">
                      <div className="flex justify-between gap-3">
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) =>
                            updateExperience(exp.id, { position: e.target.value })
                          }
                          className="flex-1 font-semibold border-none outline-none bg-transparent text-slate-800 dark:text-white"
                          placeholder="Position"
                        />
                        <button
                          onClick={() => deleteExperience(exp.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, { company: e.target.value })
                        }
                        className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                        placeholder="Company"
                      />
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
        )}

        {/* Education Section - For Both but emphasized for Students */}
        <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-slate-900 dark:to-cyan-950/30 rounded-xl border border-cyan-200 dark:border-cyan-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              {currentResume.profileType === 'student' ? (
                <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-200">Education ✨ (Priority)</h3>
              ) : (
                <h3 className="text-lg font-semibold text-cyan-900 dark:text-cyan-200">Education</h3>
              )}
            </div>
            <button
              onClick={() =>
                addEducation({
                  institution: '',
                  degree: '',
                  field: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>

          {currentResume.education.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No education added yet</p>
          ) : (
            <div className="space-y-3">
              {currentResume.education.map((edu) => (
                <div key={edu.id} className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between gap-3">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      className="flex-1 font-semibold border-none outline-none bg-transparent text-slate-800 dark:text-white"
                      placeholder="Degree"
                    />
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Institution"
                  />
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Field of Study"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      className="text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    />
                    <input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      className="text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    />
                  </div>
                  <textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Description"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects Section - For Students */}
        {currentResume.profileType === 'student' && (
        <div className="bg-gradient-to-br from-white to-green-50 dark:from-slate-900 dark:to-green-950/30 rounded-xl border border-green-200 dark:border-green-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">Projects ✨ (Priority)</h3>
            </div>
            <button
              onClick={() =>
                addProject({
                  name: '',
                  description: '',
                  technologies: [],
                  link: '',
                  startDate: '',
                  endDate: '',
                })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          </div>

          {currentResume.projects.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No projects added yet</p>
          ) : (
            <div className="space-y-3">
              {currentResume.projects.map((proj) => (
                <div key={proj.id} className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between gap-3">
                    <input
                      type="text"
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      className="flex-1 font-semibold border-none outline-none bg-transparent text-slate-800 dark:text-white"
                      placeholder="Project Name"
                    />
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Description"
                    rows={2}
                  />
                  <input
                    type="text"
                    value={proj.technologies.join(', ')}
                    onChange={(e) =>
                      updateProject(proj.id, {
                        technologies: e.target.value.split(',').map((t) => t.trim()),
                      })
                    }
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Technologies (comma separated)"
                  />
                  <input
                    type="url"
                    value={proj.link || ''}
                    onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Project Link"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Skills Section - For Both */}
        <div className="bg-gradient-to-br from-white to-pink-50 dark:from-slate-900 dark:to-pink-950/30 rounded-xl border border-pink-200 dark:border-pink-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
              <h3 className="text-lg font-semibold text-pink-900 dark:text-pink-200">Skills</h3>
            </div>
            <button
              onClick={() =>
                addSkill({
                  category: '',
                  skills: [],
                })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Skill Category
            </button>
          </div>

          {currentResume.skills.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No skills added yet</p>
          ) : (
            <div className="space-y-3">
              {currentResume.skills.map((skill) => (
                <div key={skill.id} className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between gap-3">
                    <input
                      type="text"
                      value={skill.category}
                      onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                      className="flex-1 font-semibold border-none outline-none bg-transparent text-slate-800 dark:text-white"
                      placeholder="Category (e.g. Languages)"
                    />
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={skill.skills.join(', ')}
                    onChange={(e) =>
                      updateSkill(skill.id, { skills: e.target.value.split(',').map((s) => s.trim()) })
                    }
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Skills (comma separated)"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certifications Section */}
        <div className="bg-gradient-to-br from-white to-amber-50 dark:from-slate-900 dark:to-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200">Certifications</h3>
            </div>
            <button
              onClick={() =>
                addCertification({
                  name: '',
                  issuer: '',
                  date: '',
                  link: '',
                })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          </div>

          {currentResume.certifications.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No certifications added yet</p>
          ) : (
            <div className="space-y-3">
              {currentResume.certifications.map((cert) => (
                <div key={cert.id} className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between gap-3">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                      className="flex-1 font-semibold border-none outline-none bg-transparent text-slate-800 dark:text-white"
                      placeholder="Certification Name"
                    />
                    <button
                      onClick={() => deleteCertification(cert.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Issuer"
                  />
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                    className="text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                  />
                  <input
                    type="url"
                    value={cert.link || ''}
                    onChange={(e) => updateCertification(cert.id, { link: e.target.value })}
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Certification Link"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200">Achievements</h3>
            </div>
            <button
              onClick={() =>
                addAchievement({
                  title: '',
                  description: '',
                  date: '',
                })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Achievement
            </button>
          </div>

          {currentResume.achievements.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No achievements added yet</p>
          ) : (
            <div className="space-y-3">
              {currentResume.achievements.map((ach) => (
                <div key={ach.id} className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between gap-3">
                    <input
                      type="text"
                      value={ach.title}
                      onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                      className="flex-1 font-semibold border-none outline-none bg-transparent text-slate-800 dark:text-white"
                      placeholder="Achievement Title"
                    />
                    <button
                      onClick={() => deleteAchievement(ach.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={ach.description}
                    onChange={(e) => updateAchievement(ach.id, { description: e.target.value })}
                    className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                    placeholder="Description"
                    rows={2}
                  />
                  <input
                    type="month"
                    value={ach.date}
                    onChange={(e) => updateAchievement(ach.id, { date: e.target.value })}
                    className="text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Links Section */}
        <div className="bg-gradient-to-br from-white to-teal-50 dark:from-slate-900 dark:to-teal-950/30 rounded-xl border border-teal-200 dark:border-teal-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"></div>
              <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-200">Links</h3>
            </div>
            <button
              onClick={() =>
                addLink({
                  type: 'github',
                  url: '',
                  label: '',
                })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>
          </div>

          {currentResume.links.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No links added yet</p>
          ) : (
            <div className="space-y-3">
              {currentResume.links.map((link) => (
                <div key={link.id} className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between gap-3 items-start">
                    <div className="flex-1 space-y-2">
                      <select
                        value={link.type}
                        onChange={(e) =>
                          updateLink(link.id, { type: e.target.value as any })
                        }
                        className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                      >
                        <option value="github">GitHub</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateLink(link.id, { label: e.target.value })}
                        className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                        placeholder="Label"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, { url: e.target.value })}
                        className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400"
                        placeholder="URL"
                      />
                    </div>
                    <button
                      onClick={() => deleteLink(link.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Sections */}
        <div className="bg-gradient-to-br from-white to-lime-50 dark:from-slate-900 dark:to-lime-950/30 rounded-xl border border-lime-200 dark:border-lime-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-lime-500 to-green-500"></div>
              <h3 className="text-lg font-semibold text-lime-900 dark:text-lime-200">Custom Sections</h3>
            </div>
            <button
              onClick={() =>
                addCustomSection({
                  title: '',
                  content: '',
                })
              }
              className="flex items-center gap-2 bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Custom Section
            </button>
          </div>

          {currentResume.customSections.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">No custom sections added yet. Add your own sections like Languages, Volunteer Work, etc.</p>
          ) : (
            <div className="space-y-3">
              {currentResume.customSections.map((section) => (
                <div key={section.id} className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between gap-3">
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                      className="flex-1 font-semibold border-none outline-none bg-transparent text-slate-800 dark:text-white"
                      placeholder="Section Title (e.g., Languages, Volunteer Work)"
                    />
                    <button
                      onClick={() => deleteCustomSection(section.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateCustomSection(section.id, { content: e.target.value })}
                    className="w-full text-sm border border-slate-300 dark:border-slate-600 rounded-lg p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-lime-500"
                    placeholder="Enter section content..."
                    rows={4}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Template Selector */}
        <div className="bg-gradient-to-br from-white to-violet-50 dark:from-slate-900 dark:to-violet-950/30 rounded-xl border border-violet-200 dark:border-violet-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"></div>
            <h3 className="text-lg font-semibold text-violet-900 dark:text-violet-200 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5" />
              Select Template
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {(['modern', 'corporate', 'creative', 'minimalist', 'professional', 'techfocus', 'executive'] as const).map((template) => (
              <button
                key={template}
                onClick={() => setSelectedTemplate(template)}
                className={`p-3 border-2 rounded-lg capitalize text-sm font-semibold transition-all ${
                  selectedTemplate === template
                    ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/40 dark:to-purple-900/40 text-violet-600 dark:text-violet-300 shadow-md'
                    : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                }`}
              >
                {template.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
