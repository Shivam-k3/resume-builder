import { useState, useRef } from 'react';
import { X, Sparkles, AlertCircle, FileText, Upload, Clipboard } from 'lucide-react';
import { parseResumeText } from '../../utils/gemini';
import { useResumeStore } from '../../store/resumeStore';
import { extractTextFromPdf, extractTextFromTxt } from '../../utils/pdfExtractor';

interface AIImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIImportModal({ isOpen, onClose }: AIImportModalProps) {
  const [importMethod, setImportMethod] = useState<'paste' | 'file'>('file');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createResume, updateResume } = useResumeStore();

  if (!isOpen) return null;

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
      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPdf(file);
      } else if (file.type === 'text/plain') {
        text = await extractTextFromTxt(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
      }

      if (!text.trim()) {
        throw new Error('Could not extract any readable text from the file.');
      }

      setInputText(text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to extract text from the file.');
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
    if (loading || extracting) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleResetFile = () => {
    setSelectedFile(null);
    setInputText('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImport = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const parsedResume = await parseResumeText(inputText);
      
      // Create a new resume with a default title or candidate name
      const candidateName = parsedResume.personalInfo?.fullName || 'Imported Resume';
      const timestamp = new Date().toLocaleDateString();
      const newResumeName = `AI Import - ${candidateName} (${timestamp})`;
      
      // Store in store
      const resumeId = Date.now().toString();
      createResume(newResumeName);
      
      // Update store with parsed content
      // We wait a tiny bit to let createResume complete and register in state
      setTimeout(() => {
        updateResume(resumeId, {
          personalInfo: {
            fullName: parsedResume.personalInfo?.fullName || '',
            email: parsedResume.personalInfo?.email || '',
            phone: parsedResume.personalInfo?.phone || '',
            location: parsedResume.personalInfo?.location || '',
            title: parsedResume.personalInfo?.title || '',
            summary: parsedResume.personalInfo?.summary || '',
          },
          education: parsedResume.education || [],
          experience: parsedResume.experience || [],
          projects: parsedResume.projects || [],
          skills: parsedResume.skills || [],
          certifications: parsedResume.certifications || [],
          achievements: parsedResume.achievements || [],
          links: parsedResume.links || [],
          customSections: parsedResume.customSections || [],
        });
      }, 100);

      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'AI failed to parse the profile. Please check the text format and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-[80vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-slate-800 dark:text-slate-100" />
            <div>
              <h3 className="text-md font-bold text-slate-900 dark:text-slate-100">Import Profile with AI</h3>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Gemini will parse your LinkedIn Profile PDF or text to build your resume</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Tab Selector */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-xs shrink-0">
            <button
              type="button"
              onClick={() => { setImportMethod('file'); handleResetFile(); }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                importMethod === 'file'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
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
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" />
              Paste Profile Text
            </button>
          </div>

          {importMethod === 'file' ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 rounded-xl flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <Sparkles className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mb-0.5">Where to get your LinkedIn PDF profile:</p>
                  <ol className="list-decimal pl-4 space-y-1 mt-1 font-semibold text-[11px]">
                    <li>Go to your LinkedIn profile.</li>
                    <li>Click the <strong className="text-slate-800 dark:text-slate-100">"More"</strong> button in your introduction card.</li>
                    <li>Select <strong className="text-slate-800 dark:text-slate-100">"Save to PDF"</strong>.</li>
                    <li>Upload that PDF file right here!</li>
                  </ol>
                </div>
              </div>

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-250 dark:border-slate-750 hover:border-slate-400 dark:hover:border-slate-600 rounded-2xl p-10 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-slate-900/20"
                >
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-350">
                    Drag and drop your LinkedIn Profile PDF here, or <span className="text-slate-900 dark:text-slate-100 underline decoration-slate-400">browse</span>
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">Supports PDF and TXT files</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.txt"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-800">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-8 h-8 text-slate-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold font-mono">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetFile}
                    disabled={loading || extracting}
                    className="text-xs font-bold text-slate-500 hover:text-red-500 border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-900/40 px-3 py-1.5 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Paste raw profile or CV text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste copied content from your LinkedIn profile, biography page, or plain text resume here..."
                rows={12}
                disabled={loading || extracting}
                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl p-4 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-slate-500/30 focus:border-slate-500 outline-none transition-all resize-none"
              />
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl flex gap-3 text-xs leading-relaxed text-red-650 dark:text-red-400 font-bold shrink-0">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {(loading || extracting) && (
            <div className="py-8 flex flex-col items-center justify-center space-y-3 shrink-0">
              <div className="w-10 h-10 border-4 border-slate-350 dark:border-slate-700 border-t-slate-900 dark:border-t-slate-100 rounded-full animate-spin"></div>
              <p className="text-sm text-slate-650 dark:text-slate-400 font-semibold animate-pulse text-center">
                {extracting 
                  ? 'Reading file contents...' 
                  : 'Gemini is extracting & organizing your resume...'}
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={loading || extracting}
            className="px-4 py-2 border border-slate-205 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-850 text-sm font-semibold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={loading || extracting || !inputText.trim()}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-slate-205 text-white dark:text-slate-900 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:transform-none"
          >
            <FileText className="w-4 h-4" />
            Parse & Import
          </button>
        </div>
      </div>
    </div>
  );
}
