import { useState } from 'react';
import { getSuggestedKeywords, POPULAR_JOB_TITLES, type KeywordSuggestion } from '../../utils/keywordSuggestions';
import { Plus, Sparkles, AlertCircle } from 'lucide-react';
import { generateKeywords, hasGeminiApiKey } from '../../utils/gemini';

interface KeywordSuggesterProps {
  currentJobProfile: string;
  onJobProfileChange: (profile: string) => void;
  onAddKeyword: (keyword: string, category: string) => void;
}

export const KeywordSuggester = ({
  currentJobProfile,
  onJobProfileChange,
  onAddKeyword,
}: KeywordSuggesterProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<KeywordSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const staticSuggestions = getSuggestedKeywords(currentJobProfile);
  const suggestions = useAI && aiSuggestions.length > 0 ? aiSuggestions : staticSuggestions;

  const fetchAISuggestions = async () => {
    if (!currentJobProfile.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateKeywords(currentJobProfile.trim());
      setAiSuggestions(result);
      setUseAI(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate keywords');
      setUseAI(false);
    } finally {
      setLoading(false);
    }
  };

  const handleJobProfileInput = (value: string) => {
    onJobProfileChange(value);
    setUseAI(false);
    setAiSuggestions([]);
    if (value.trim()) {
      const filtered = POPULAR_JOB_TITLES.filter((title) =>
        title.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTitles(filtered);
    } else {
      setFilteredTitles([]);
    }
  };

  const selectJobTitle = (title: string) => {
    onJobProfileChange(title);
    setFilteredTitles([]);
    setUseAI(false);
    setAiSuggestions([]);
  };

  const keyConfigured = hasGeminiApiKey();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></div>
          <h3 className="text-md font-bold text-slate-850 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-500" />
            AI Keyword Suggester
          </h3>
        </div>
        {useAI && (
          <span className="px-2 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-bold border border-slate-200 dark:border-slate-700 animate-pulse">
            Gemini Live
          </span>
        )}
      </div>

      <p className="text-sm text-slate-655 dark:text-slate-400 mb-3">
        Enter your target job title to get keyword suggestions for your resume
      </p>

      <div className="relative mb-4 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={currentJobProfile}
            onChange={(e) => handleJobProfileInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 dark:bg-slate-800 dark:text-white text-sm"
            placeholder="e.g., Software Engineer, Product Manager, Data Scientist..."
            disabled={loading}
          />

          {filteredTitles.length > 0 && showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-15">
              {filteredTitles.map((title) => (
                <button
                  key={title}
                  onClick={() => selectJobTitle(title)}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm"
                >
                  {title}
                </button>
              ))}
            </div>
          )}
        </div>

        {keyConfigured && currentJobProfile.trim() && (
          <button
            onClick={fetchAISuggestions}
            disabled={loading}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 shrink-0"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'AI Sug...' : 'AI Suggest'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs flex gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !suggestions.length && (
        <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          Thinking...
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((group, idx) => (
            <div key={idx} className="bg-slate-50/40 dark:bg-slate-800/30 rounded-lg p-3 border border-slate-100 dark:border-slate-800/40">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.keywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => onAddKeyword(keyword, group.category)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-semibold transition-all flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                  >
                    <Plus className="w-3 h-3 text-slate-400" />
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!suggestions.length && currentJobProfile.trim() && !loading && (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          No specific suggestions for this job title. Try "Software Engineer", "Product Manager", "Data Scientist", etc.
        </p>
      )}
    </div>
  );
};
