import { useState, useEffect } from 'react';
import { X, Download, Copy, Check, Globe, Laptop, Feather, Building, ExternalLink } from 'lucide-react';
import type { Resume } from '../../types/resume';
import { generatePortfolioHTML, type PortfolioTheme } from '../../utils/portfolioTemplates';

interface PortfolioExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: Resume;
}

export default function PortfolioExportModal({ isOpen, onClose, resume }: PortfolioExportModalProps) {
  const [selectedTheme, setSelectedTheme] = useState<PortfolioTheme>('developer');
  const [copied, setCopied] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  // Re-generate HTML whenever the theme or resume changes
  useEffect(() => {
    if (isOpen) {
      const html = generatePortfolioHTML(resume, selectedTheme);
      setHtmlContent(html);
    }
  }, [isOpen, selectedTheme, resume]);

  if (!isOpen) return null;

  // Handle Download HTML File
  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_portfolio.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle Copy Source Code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy html code:', err);
    }
  };

  // Preview in new tab
  const handleOpenNewTab = () => {
    const win = window.open();
    if (win) {
      win.document.write(htmlContent);
      win.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[88vh] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-slate-800 dark:text-slate-100" />
            <div>
              <h3 className="text-md font-bold text-slate-900 dark:text-slate-100">Convert to Web Portfolio</h3>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Generate a responsive standalone website from your resume</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
          
          {/* Left Panel: Options */}
          <div className="w-full lg:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-3">1. Select Portfolio Style</h4>
                <div className="space-y-2">
                  
                  {/* Theme Option 1: Developer */}
                  <button
                    onClick={() => setSelectedTheme('developer')}
                    className={`w-full flex items-center gap-3 p-3 border.5 rounded-xl transition text-left ${
                      selectedTheme === 'developer'
                        ? 'border-slate-900 dark:border-slate-100 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Laptop className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Modern Developer</p>
                      <p className="text-[10px] opacity-75">Dark layout, code styling, tech tags</p>
                    </div>
                  </button>

                  {/* Theme Option 2: Creative */}
                  <button
                    onClick={() => setSelectedTheme('creative')}
                    className={`w-full flex items-center gap-3 p-3 border.5 rounded-xl transition text-left ${
                      selectedTheme === 'creative'
                        ? 'border-slate-900 dark:border-slate-100 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Feather className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Minimalist Creative</p>
                      <p className="text-[10px] opacity-75">Light layout, serif serif fonts, clean space</p>
                    </div>
                  </button>

                  {/* Theme Option 3: Corporate */}
                  <button
                    onClick={() => setSelectedTheme('corporate')}
                    className={`w-full flex items-center gap-3 p-3 border.5 rounded-xl transition text-left ${
                      selectedTheme === 'corporate'
                        ? 'border-slate-900 dark:border-slate-100 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Building className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Executive Corporate</p>
                      <p className="text-[10px] opacity-75">Navy/slate details, experiences grid</p>
                    </div>
                  </button>

                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                💡 **Host it for free**: You can upload the generated HTML file directly to hosting servers like GitHub Pages, Vercel, Netlify, or Surge to get your own custom URL!
              </div>
            </div>

            {/* Left Panel Actions */}
            <div className="space-y-2 pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                Download Website (.html)
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopy}
                  className="py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <button
                  onClick={handleOpenNewTab}
                  className="py-2.5 px-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Full Preview
                </button>
              </div>
            </div>

          </div>

          {/* Right Panel: Live Dynamic Iframe Preview */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">Live Interactive Viewport Preview</p>
            </div>
            <div className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white overflow-hidden shadow-sm relative">
              <iframe
                title="Portfolio Webpage Preview"
                srcDoc={htmlContent}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-popups"
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
