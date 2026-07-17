import { useState, useRef } from 'react';
import { X, Sparkles, AlertCircle, FileText, Settings, Upload, File, Clipboard } from 'lucide-react';
import { hasGeminiApiKey, parseResumeText } from '../../utils/gemini';
import { useResumeStore } from '../../store/resumeStore';
import { extractTextFromPdf, extractTextFromTxt } from '../../utils/pdfExtractor';

interface AIImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export default function AIImportModal({ isOpen, onClose, onOpenSettings }: AIImportModalProps) {
  const [importMethod, setImportMethod] = useState<'paste' | 'file'>('file');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createResume, updateResume } = useResumeStore();

  if (!isOpen) return null;

  const keyConfigured = hasGeminiApiKey();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setExtracting(true);
    setError(null);
    setInputText('');

    try {
      let extractedText = '';
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        extractedText = await extractTextFromPdf(file);
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        extractedText = await extractTextFromTxt(file);
      } else {
        throw new Error('Unsupported file type. Please upload a .pdf or .txt file.');
      }

      if (!extractedText.trim()) {
        throw new Error('No text content could be extracted from this file.');
      }

      setInputText(extractedText);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error reading file.');
      setSelectedFile(null);
    } finally {
      setExtracting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleImport = async () => {
    if (!inputText.trim()) {
      setError(importMethod === 'file' ? 'Please upload a file first.' : 'Please paste some text first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsedResume = await parseResumeText(inputText.trim());
      
      // Determine new resume name
      const candidateName = parsedResume.personalInfo?.fullName?.trim();
      const resumeName = candidateName ? `${candidateName}'s Resume` : 'AI Imported Resume';

      // Create new empty resume
      createResume(resumeName);
      
      // Fetch the newly created resume to update it
      const newResume = useResumeStore.getState().currentResume;
      
      if (newResume) {
        updateResume(newResume.id, {
          personalInfo: {
            fullName: parsedResume.personalInfo?.fullName || '',
            email: parsedResume.personalInfo?.email || '',
            phone: parsedResume.personalInfo?.phone || '',
            location: parsedResume.personalInfo?.location || '',
            title: parsedResume.personalInfo?.title || '',
            summary: parsedResume.personalInfo?.summary || '',
          },
          education: parsedResume.education?.map((edu: any, idx: number) => ({
            id: `edu-${Date.now()}-${idx}`,
            institution: edu.institution || '',
            degree: edu.degree || '',
            field: edu.field || '',
            startDate: edu.startDate || '',
            endDate: edu.endDate || '',
            gpa: edu.gpa || '',
            description: edu.description || '',
          })) || [],
          experience: parsedResume.experience?.map((exp: any, idx: number) => ({
            id: `exp-${Date.now()}-${idx}`,
            company: exp.company || '',
            position: exp.position || '',
            location: exp.location || '',
            startDate: exp.startDate || '',
            endDate: exp.endDate || '',
            current: exp.current || false,
            description: Array.isArray(exp.description) ? exp.description : [exp.description || ''],
          })) || [],
          projects: parsedResume.projects?.map((proj: any, idx: number) => ({
            id: `proj-${Date.now()}-${idx}`,
            name: proj.name || '',
            description: proj.description || '',
            technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
            startDate: proj.startDate || '',
            endDate: proj.endDate || '',
          })) || [],
          skills: parsedResume.skills?.map((sk: any, idx: number) => ({
            id: `sk-${Date.now()}-${idx}`,
            category: sk.category || 'Skills',
            skills: Array.isArray(sk.skills) ? sk.skills : [sk.skills || ''],
          })) || [],
          certifications: parsedResume.certifications?.map((cert: any, idx: number) => ({
            id: `cert-${Date.now()}-${idx}`,
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
          })) || [],
          achievements: parsedResume.achievements?.map((ach: any, idx: number) => ({
            id: `ach-${Date.now()}-${idx}`,
            title: ach.title || '',
            description: ach.description || '',
            date: ach.date || '',
          })) || [],
          links: parsedResume.links?.map((link: any, idx: number) => ({
            id: `link-${Date.now()}-${idx}`,
            type: link.type || 'other',
            url: link.url || '',
            label: link.label || '',
          })) || [],
        });
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while parsing. Please check your API key or input format.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFile = () => {
    setSelectedFile(null);
    setInputText('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-slate-950 dark:to-slate-900 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-850 dark:text-white">Import Profile / Resume with AI</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-all"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {!keyConfigured ? (
            <div className="p-6 border border-yellow-200 dark:border-yellow-900/40 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-2xl text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto" />
              <h4 className="font-bold text-yellow-800 dark:text-yellow-350">Gemini API Key Required</h4>
              <p className="text-sm text-slate-655 dark:text-slate-400 max-w-md mx-auto">
                To use the AI-powered LinkedIn and Resume importer, please configure your Gemini API Key in the settings first.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-sm transition-all"
              >
                <Settings className="w-4 h-4" />
                Configure API Key
              </button>
            </div>
          ) : (
            <>
              {/* Tab Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-xs shrink-0">
                <button
                  type="button"
                  onClick={() => { setImportMethod('file'); handleResetFile(); }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    importMethod === 'file'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Profile PDF
                </button>
                <button
                  type="button"
                  onClick={() => { setImportMethod('paste'); handleResetFile(); }}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    importMethod === 'paste'
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
                  }`}
                >
                  <Clipboard className="w-3.5 h-3.5" />
                  Paste Profile Text
                </button>
              </div>

              {importMethod === 'file' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-850 dark:text-slate-200">How to get your LinkedIn Profile PDF:</p>
                      <ol className="list-decimal pl-4 mt-1 space-y-0.5">
                        <li>Navigate to your LinkedIn Profile page.</li>
                        <li>Click the **"More"** button next to your profile photo.</li>
                        <li>Select **"Save to PDF"** to download your complete profile details.</li>
                        <li>Upload or drag-and-drop the PDF file below!</li>
                      </ol>
                    </div>
                  </div>

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 text-center hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-all bg-slate-50/40 dark:bg-slate-800/20"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.txt"
                        className="hidden"
                      />
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Drag and drop your LinkedIn PDF/Text file here
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Supports .pdf and .txt files up to 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl relative">
                      <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                        <File className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={handleResetFile}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg transition-all"
                        disabled={loading || extracting}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-655 dark:text-slate-400 leading-relaxed">
                    Paste raw text copied from your LinkedIn profile or old resume. Gemini will parse all work experience, skills, projects, and education dynamically.
                  </p>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste LinkedIn Profile summary, experience bullets, projects, education here..."
                    className="w-full h-60 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none text-sm font-sans transition-all text-slate-900 dark:text-slate-100 resize-none"
                    disabled={loading}
                  />
                </div>
              )}

              {error && (
                <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-150 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm flex gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {(loading || extracting) && (
                <div className="py-8 flex flex-col items-center justify-center space-y-3 shrink-0">
                  <div className="w-10 h-10 border-4 border-slate-350 dark:border-slate-700 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-650 dark:text-slate-400 font-semibold animate-pulse text-center">
                    {extracting 
                      ? 'Reading file contents...' 
                      : 'Gemini is extracting & organizing your resume...'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {keyConfigured && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              disabled={loading || extracting}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-150 dark:hover:bg-slate-850 text-sm font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={loading || extracting || !inputText.trim()}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              <FileText className="w-4 h-4" />
              Parse & Import
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
