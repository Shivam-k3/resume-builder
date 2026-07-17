import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useUIStore } from '../../store/uiStore';
import { Plus, Trash2, GripVertical, Sparkles, LayoutTemplate, Loader2 } from 'lucide-react';
import { KeywordSuggester } from './KeywordSuggester';
import { hasGeminiApiKey, optimizeText } from '../../utils/gemini';
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
  
  const [optimizingId, setOptimizingId] = useState<string | null>(null);

  const handleOptimizeText = async (
    type: 'summary' | 'experience' | 'project',
    itemId: string,
    fieldName: string,
    extraContext?: { role?: string; company?: string }
  ) => {
    if (!currentResume) return;

    let textToOptimize = '';
    let role = extraContext?.role || currentResume.personalInfo.title || 'Professional';
    let company = extraContext?.company || 'Company';

    if (type === 'summary') {
      textToOptimize = currentResume.personalInfo.summary;
    } else if (type === 'experience') {
      const expItem = currentResume.experience.find(e => e.id === itemId);
      if (expItem) {
        textToOptimize = expItem.description.join('\n');
        role = expItem.position || role;
        company = expItem.company || company;
      }
    } else if (type === 'project') {
      const projItem = currentResume.projects.find(p => p.id === itemId);
      if (projItem) {
        textToOptimize = projItem.description;
        role = projItem.name || role;
      }
    }

    if (!textToOptimize.trim()) {
      alert('Please enter some text to optimize first.');
      return;
    }

    const stateKey = `${itemId}-${fieldName}`;
    setOptimizingId(stateKey);

    try {
      const optimized = await optimizeText(role, company, textToOptimize, type);
      
      if (type === 'summary') {
        updatePersonalInfo({ summary: optimized });
      } else if (type === 'experience') {
        const lines = optimized.split('\n')
          .map(l => l.replace(/^[\s*-•+]+/g, '').trim())
          .filter(l => l.length > 0);
        updateExperience(itemId, { description: lines });
      } else if (type === 'project') {
        updateProject(itemId, { description: optimized });
      }
    } catch (err: any) {
      console.error(err);
      alert('AI Optimization failed: ' + (err.message || 'Unknown error'));
    } finally {
      setOptimizingId(null);
    }
  };

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
    <div className="h-full min-h-0 overflow-auto bg-slate-50 dark:bg-slate-950">
      <div className="w-full p-4 sm:p-6 space-y-5">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Edit Resume</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {currentResume.profileType === 'student' 
                  ? '👨‍🎓 Student Profile - Showing: Education (Priority), Projects (Priority), Skills, Certifications & Achievements' 
                  : '💼 Professional Profile - Showing: Experience (Priority), Education, Skills, Projects & Certifications'}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 px-3 py-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4 text-slate-550" />
              ATS Ready
            </div>
          </div>
        </div>

        {/* Profile Type Selector */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm">
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
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-750 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100'
                }`}
              >
                👨‍🎓 Student
              </button>
              <button
                onClick={() => updateProfileType('professional')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  currentResume.profileType === 'professional'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-750 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100'
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Personal Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-655 dark:text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                value={currentResume.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500/30 dark:bg-slate-800 dark:text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-655 dark:text-slate-400">
                Professional Title
              </label>
              <input
                type="text"
                value={currentResume.personalInfo.title}
                onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500/30 dark:bg-slate-800 dark:text-white"
                placeholder="Software Engineer"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-655 dark:text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={currentResume.personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500/30 dark:bg-slate-800 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1 text-slate-655 dark:text-slate-400">
                  Phone
                </label>
                <input
                  type="tel"
                  value={currentResume.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500/30 dark:bg-slate-800 dark:text-white"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-slate-655 dark:text-slate-400">
                Location
              </label>
              <input
                type="text"
                value={currentResume.personalInfo.location}
                onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500/30 dark:bg-slate-800 dark:text-white"
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-bold text-slate-655 dark:text-slate-400">
                  Summary
                </label>
                {hasGeminiApiKey() && currentResume.personalInfo.summary.trim() && (
                  <button
                    onClick={() => handleOptimizeText('summary', 'personalInfo', 'summary')}
                    disabled={optimizingId === 'personalInfo-summary'}
                    className="text-[10px] bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-2 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm transition-all disabled:opacity-50 shrink-0"
                  >
                    {optimizingId === 'personalInfo-summary' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    {optimizingId === 'personalInfo-summary' ? 'Optimizing...' : 'Optimize with AI'}
                  </button>
                )}
              </div>
              <textarea
                value={currentResume.personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                rows={4}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/30 dark:bg-slate-800 dark:text-white text-sm"
                placeholder="Brief professional summary..."
                disabled={optimizingId === 'personalInfo-summary'}
              />
            </div>
          </div>
        </div>

        {/* Experience Section - For Working Professionals */}
        {currentResume.profileType === 'professional' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Experience</h3>
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
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-805 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
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
                        className="w-full text-sm border-none outline-none bg-transparent text-slate-600 dark:text-slate-400 font-medium"
                        placeholder="Company"
                      />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) =>
                            updateExperience(exp.id, { location: e.target.value })
                          }
                          className="w-full text-xs bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300"
                          placeholder="Location (e.g. San Francisco, CA)"
                        />
                        <div className="flex items-center gap-1.5 px-1">
                          <input
                            type="checkbox"
                            checked={exp.current || false}
                            onChange={(e) =>
                              updateExperience(exp.id, { current: e.target.checked })
                            }
                            id={`exp-current-${exp.id}`}
                            className="rounded border-slate-300 dark:border-slate-700 text-orange-500 focus:ring-orange-500/30 w-3.5 h-3.5"
                          />
                          <label htmlFor={`exp-current-${exp.id}`} className="text-xs text-slate-650 dark:text-slate-400 font-medium">
                            Current Role
                          </label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="space-y-0.5">
                          <label className="text-[9px] uppercase font-bold text-slate-500 block">Start Date</label>
                          <input
                            type="month"
                            value={exp.startDate || ''}
                            onChange={(e) =>
                              updateExperience(exp.id, { startDate: e.target.value })
                            }
                            className="w-full text-xs bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300"
                          />
                        </div>
                        {!exp.current && (
                          <div className="space-y-0.5">
                            <label className="text-[9px] uppercase font-bold text-slate-500 block">End Date</label>
                            <input
                              type="month"
                              value={exp.endDate || ''}
                              onChange={(e) =>
                                updateExperience(exp.id, { endDate: e.target.value })
                              }
                              className="w-full text-xs bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-700 dark:text-slate-300"
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-2.5 space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[9px] uppercase font-bold text-slate-500">
                            Description (One bullet per line)
                          </label>
                          {hasGeminiApiKey() && exp.description.join('\n').trim() && (
                            <button
                              type="button"
                              onClick={() => handleOptimizeText('experience', exp.id, 'description', { role: exp.position, company: exp.company })}
                              disabled={optimizingId === `${exp.id}-description`}
                              className="text-[9px] bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-650 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-sm transition-all transform hover:scale-105 disabled:opacity-50"
                            >
                              {optimizingId === `${exp.id}-description` ? (
                                <Loader2 className="w-2.5 h-2.5 animate-spin" />
                              ) : (
                                <Sparkles className="w-2.5 h-2.5" />
                              )}
                              {optimizingId === `${exp.id}-description` ? 'Optimizing...' : 'Optimize with AI'}
                            </button>
                          )}
                        </div>
                        <textarea
                          value={exp.description ? exp.description.join('\n') : ''}
                          onChange={(e) =>
                            updateExperience(exp.id, { description: e.target.value.split('\n') })
                          }
                          className="w-full text-xs border border-slate-205 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-750 dark:text-slate-300 focus:ring-2 focus:ring-orange-500/30 outline-none"
                          placeholder="e.g. Led a team of 3 developers to launch the product.&#10;Optimized API performance, reducing response times by 30%."
                          rows={4}
                          disabled={optimizingId === `${exp.id}-description`}
                        />
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
        )}

        {/* Education Section - For Both but emphasized for Students */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
              {currentResume.profileType === 'student' ? (
                <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Education ✨ (Priority)</h3>
              ) : (
                <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Education</h3>
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
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-805 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Projects ✨ (Priority)</h3>
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
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-805 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
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
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold text-slate-500">Description</label>
                      {hasGeminiApiKey() && proj.description.trim() && (
                        <button
                          type="button"
                          onClick={() => handleOptimizeText('project', proj.id, 'description', { role: proj.name })}
                          disabled={optimizingId === `${proj.id}-description`}
                          className="text-[9px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-sm transition-all transform hover:scale-105 disabled:opacity-50 shrink-0"
                        >
                          {optimizingId === `${proj.id}-description` ? (
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-2.5 h-2.5" />
                          )}
                          {optimizingId === `${proj.id}-description` ? 'Optimizing...' : 'Optimize with AI'}
                        </button>
                      )}
                    </div>
                    <textarea
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-green-500/30"
                      placeholder="Project Description"
                      rows={2}
                      disabled={optimizingId === `${proj.id}-description`}
                    />
                  </div>
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Skills</h3>
            </div>
            <button
              onClick={() =>
                addSkill({
                  category: '',
                  skills: [],
                })
              }
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-805 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Certifications</h3>
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
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-805 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Achievements</h3>
            </div>
            <button
              onClick={() =>
                addAchievement({
                  title: '',
                  description: '',
                  date: '',
                })
              }
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-805 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
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
        {/* Links Section */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Links</h3>
            </div>
            <button
              onClick={() =>
                addLink({
                  type: 'github',
                  url: '',
                  label: '',
                })
              }
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-805 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
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
        {/* Custom Sections */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
              <h3 className="text-md font-bold text-slate-800 dark:text-slate-100">Custom Sections</h3>
            </div>
            <button
              onClick={() =>
                addCustomSection({
                  title: '',
                  content: '',
                })
              }
              className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-805 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-slate-500" />
              Select Template
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {(['modern', 'corporate', 'creative', 'minimalist', 'professional', 'techfocus', 'executive'] as const).map((template) => (
              <button
                key={template}
                onClick={() => setSelectedTemplate(template)}
                className={`p-3 border rounded-lg capitalize text-xs font-bold transition-all ${
                  selectedTemplate === template
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:border-slate-900 dark:hover:border-slate-100 hover:bg-slate-50 dark:hover:bg-slate-850'
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
