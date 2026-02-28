import { create } from 'zustand';

interface UIState {
  darkMode: boolean;
  zoomLevel: number;
  selectedTemplate: 'modern' | 'corporate' | 'creative' | 'minimalist' | 'professional' | 'techfocus' | 'executive';
  
  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  setZoomLevel: (level: number) => void;
  setSelectedTemplate: (template: 'modern' | 'corporate' | 'creative' | 'minimalist' | 'professional' | 'techfocus' | 'executive') => void;
}

// Get initial dark mode from localStorage or system preference
const getInitialDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem('app-dark-mode');
    if (stored !== null) {
      return stored === 'true';
    }
  } catch (e) {
    console.error('Error reading darkMode from localStorage:', e);
  }
  
  // Fallback to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useUIStore = create<UIState>((set) => ({
  darkMode: getInitialDarkMode(),
  zoomLevel: 100,
  selectedTemplate: 'modern',

  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.darkMode;
    // Persist to localStorage
    try {
      localStorage.setItem('app-dark-mode', String(newDarkMode));
    } catch (e) {
      console.error('Error saving darkMode to localStorage:', e);
    }
    // Update DOM immediately
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { darkMode: newDarkMode };
  }),

  setDarkMode: (isDark: boolean) => set(() => {
    try {
      localStorage.setItem('app-dark-mode', String(isDark));
    } catch (e) {
      console.error('Error saving darkMode to localStorage:', e);
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { darkMode: isDark };
  }),
  
  setZoomLevel: (level: number) => set({ zoomLevel: level }),
  
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
}));
