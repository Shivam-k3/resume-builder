import { useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import ResumeEditor from './ResumeEditor';
import ResumePreview from './ResumePreview';
import { Search, Moon, Sun, Plus, Copy, Trash2, LogOut, FileText, Eye } from 'lucide-react';

const Dashboard = () => {
  const { resumes, currentResume, createResume, setCurrentResume, duplicateResume, deleteResume, syncCurrentResume } =
    useResumeStore();
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();

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
          <p className="text-slate-600 dark:text-slate-400 mb-4">Loading your resume...</p>
          <div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-700 border-t-primary rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-white/90 to-blue-50/90 dark:from-slate-900/90 dark:to-blue-900/90 backdrop-blur sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex flex-wrap xl:flex-nowrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="font-black tracking-tight text-lg bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Resume Studio</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Practical builder with live preview</p>
            </div>
          </div>

          <div className="relative w-full sm:w-72 lg:w-96 order-3 xl:order-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none"
              placeholder="Search resumes..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => toggleDarkMode()}
              className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 flex items-center justify-center transition-all"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-orange-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>
            <button
              onClick={logout}
              className="h-10 px-3 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 dark:hover:border-red-700 flex items-center gap-2 text-sm font-semibold transition-all"
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
            className="h-10 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all transform hover:scale-105 text-sm font-semibold flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
          <button
            onClick={() => duplicateResume(currentResume.id)}
            className="h-10 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all text-sm font-semibold flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this resume?')) {
                deleteResume(currentResume.id);
              }
            }}
            className="h-10 px-3 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-400 dark:hover:border-red-700 transition-all text-sm font-semibold flex items-center gap-2"
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
    </div>
  );
};

export default Dashboard;
