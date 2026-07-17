import { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Save, Trash2, X, Sparkles } from 'lucide-react';
import { getGeminiApiKey, saveGeminiApiKey, clearGeminiApiKey } from '../../utils/gemini';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getGeminiApiKey());
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveGeminiApiKey(apiKey);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    clearGeminiApiKey();
    setApiKey('');
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700 dark:text-slate-350" />
            <h3 className="font-bold text-slate-850 dark:text-white">AI Assistant Settings</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AQ.Ab8RN6..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 outline-none text-sm pr-10 font-mono transition-all text-slate-900 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-slate-550 dark:text-slate-400">
              The API Key is stored safely on your local device. We support Google AI Studio's new key format starting with <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-700 dark:text-slate-350">AQ.</code>.
            </p>
            <div className="mt-2.5 p-3 bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
              🔒 <strong className="text-slate-800 dark:text-slate-100">Local Browser Storage Only</strong>: Storing your key here is fully secure. It stays inside your private local browser database, is never sent to our servers, and is never baked into the public source code bundle.
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-850 rounded-xl flex gap-3">
            <Sparkles className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-655 dark:text-slate-400 leading-relaxed">
              <p className="font-semibold text-slate-850 dark:text-slate-200 mb-1">How to get a free API Key:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Go to <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-slate-800 dark:text-slate-300 hover:underline font-semibold">Google AI Studio</a>.</li>
                <li>Sign in with your Google account.</li>
                <li>Click <strong className="text-slate-800 dark:text-slate-200">"Create API Key"</strong> and copy the generated key.</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-3">
          <button
            onClick={handleClear}
            disabled={!apiKey}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-605 dark:text-slate-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-655 dark:hover:text-red-400 disabled:opacity-50 text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-705 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Key'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
