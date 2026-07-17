import { useEffect, useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';
import SettingsModal from './SettingsModal';
import AIImportModal from './AIImportModal';
import { Search, Moon, Sun, Plus, Copy, Trash2, LogOut, Eye, Settings, Sparkles } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Dashboard = () => {
  const { resumes, currentResume, createResume, setCurrentResume, duplicateResume, deleteResume, syncCurrentResume } =
    useResumeStore();
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => {
    // If no resumes exist, create a default one
    if (resumes.length === 0) {
      createResume('My Resume');
      return;
    }

    if (!currentResume) {
      syncCurrentResume();
    }
  }, [resumes.length, currentResume, createResume, syncCurrentResume]);

  const handleCreateResume = () => {
    const name = prompt('Enter resume name:');
    if (name?.trim()) {
      createResume(name.trim());
    }
  };

  if (!currentResume) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4 font-bold">Loading your resume...</p>
          <div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-700 border-t-primary rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex flex-wrap xl:flex-nowrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
              <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain dark:invert" />
            </div>
            <div className="min-w-0">
              <h1 className="font-extrabold tracking-tight text-md text-slate-850 dark:text-slate-50">Resume Studio</h1>
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-450 truncate">Practical builder with live preview</p>
            </div>
          </div>

          <div className="relative w-full sm:w-72 lg:w-96 order-3 xl:order-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 outline-none"
              placeholder="Search resumes..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-655 flex items-center justify-center transition-all"
              title="AI Settings"
            >
              <Settings className="w-5 h-5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100" />
            </button>
            <button
              onClick={() => toggleDarkMode()}
              className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-655 flex items-center justify-center transition-all"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-slate-500 dark:text-slate-450" /> : <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
            </button>
            <button
              onClick={logout}
              className="h-10 px-3 rounded-xl border border-red-200 dark:border-red-900/40 text-red-655 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-400 dark:hover:border-red-700 flex items-center gap-2 text-sm font-semibold transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 pb-3 flex flex-wrap items-center gap-2 sm:gap-3 border-t border-slate-100 dark:border-slate-800/70">
          <select
            value={currentResume.id}
            onChange={(e) => setCurrentResume(e.target.value)}
            className="h-10 min-w-[220px] max-w-full px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/30"
          >
            {resumes.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreateResume}
            className="h-10 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 transition-all text-sm font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
          <button
            onClick={() => setIsImportOpen(true)}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-semibold flex items-center gap-2"
            title="Import Resume / LinkedIn Profile using Gemini AI"
          >
            <Sparkles className="w-4 h-4 text-slate-550" />
            Import (AI)
          </button>
          <button
            onClick={() => duplicateResume(currentResume.id)}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-sm font-semibold flex items-center gap-2"
          >
            <Copy className="w-4 h-4 text-slate-550" />
            Duplicate
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this resume?')) {
                deleteResume(currentResume.id);
              }
            }}
            className="h-10 px-3 rounded-xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-slate-850 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-sm font-semibold flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <div className="ml-auto hidden md:flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <Eye className="w-4 h-4" />
            <span>Editing as {user?.displayName || user?.email?.split('@')[0] || 'User'}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-hidden p-3 sm:p-4">
        <div className="h-full min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <section className="min-h-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col">
            <ResumeEditor />
          </section>
          <section className="min-h-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col">
            <ResumePreview />
          </section>
        </div>
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AIImportModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
      />
    </div>
  );
};

export default Dashboard;
