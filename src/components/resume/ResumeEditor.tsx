import { useResumeStore } from '../../store/resumeStore';
import { useUIStore } from '../../store/uiStore';
import { Plus, Trash2, GripVertical, Sparkles, LayoutTemplate } from 'lucide-react';
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
  const { currentResume, updatePersonalInfo, addExperience, deleteExperience, updateResume } = useResumeStore();
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
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update content on the left and review live output on the right.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-700 dark:text-amber-300 px-3 py-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              ATS Ready
            </div>
          </div>
        </div>

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

        {/* Experience Section */}
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
                            useResumeStore
                              .getState()
                              .updateExperience(exp.id, { position: e.target.value })
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
                          useResumeStore
                            .getState()
                            .updateExperience(exp.id, { company: e.target.value })
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
