import { useState } from 'react';
import { getSuggestedKeywords, POPULAR_JOB_TITLES } from '../../utils/keywordSuggestions';
import { Plus, Sparkles } from 'lucide-react';

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

  const suggestions = getSuggestedKeywords(currentJobProfile);

  const handleJobProfileInput = (value: string) => {
    onJobProfileChange(value);
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
  };

  return (
    <div className="bg-gradient-to-br from-white to-yellow-50 dark:from-slate-900 dark:to-yellow-950/30 rounded-xl border border-yellow-200 dark:border-yellow-800 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"></div>
        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI Keyword Suggester
        </h3>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
        Enter your target job title to get keyword suggestions for your resume
      </p>

      <div className="relative mb-4">
        <input
          type="text"
          value={currentJobProfile}
          onChange={(e) => handleJobProfileInput(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 dark:bg-slate-800 dark:text-white"
          placeholder="e.g., Software Engineer, Product Manager, Data Scientist..."
        />

        {filteredTitles.length > 0 && showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg z-10">
            {filteredTitles.map((title) => (
              <button
                key={title}
                onClick={() => selectJobTitle(title)}
                className="w-full text-left px-3 py-2 hover:bg-yellow-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-sm"
              >
                {title}
              </button>
            ))}
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((group, idx) => (
            <div key={idx} className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {group.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.keywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => onAddKeyword(keyword, group.category)}
                    className="px-3 py-1.5 bg-gradient-to-r from-yellow-200 to-orange-200 dark:from-yellow-900/40 dark:to-orange-900/40 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-semibold hover:shadow-md transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!suggestions.length && currentJobProfile.trim() && (
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">
          No specific suggestions for this job title. Try "Software Engineer", "Product Manager", "Data Scientist", etc.
        </p>
      )}
    </div>
  );
};
