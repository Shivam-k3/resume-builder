import { useRef, useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { useUIStore } from '../../store/uiStore';
import ModernTemplate from '../templates/ModernTemplate';
import CorporateTemplate from '../templates/CorporateTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import MinimalistTemplate from '../templates/MinimalistTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import TechFocusTemplate from '../templates/TechFocusTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import { ZoomIn, ZoomOut, Download, Maximize2, Globe } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import PortfolioExportModal from './PortfolioExportModal';

const ResumePreview = () => {
  const { currentResume } = useResumeStore();
  const { zoomLevel, setZoomLevel, selectedTemplate } = useUIStore();
  const printRef = useRef<HTMLDivElement>(null);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: currentResume?.name || 'Resume',
  });

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100 dark:bg-background-dark">
        <p className="text-slate-500 dark:text-slate-400">No resume selected</p>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'corporate':
        return <CorporateTemplate resume={currentResume} />;
      case 'creative':
        return <CreativeTemplate resume={currentResume} />;
      case 'minimalist':
        return <MinimalistTemplate resume={currentResume} />;
      case 'professional':
        return <ProfessionalTemplate resume={currentResume} />;
      case 'techfocus':
        return <TechFocusTemplate resume={currentResume} />;
      case 'executive':
        return <ExecutiveTemplate resume={currentResume} />;
      default:
        return <ModernTemplate resume={currentResume} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 dark:bg-slate-950">
      {/* Preview Controls */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex flex-wrap justify-between items-center gap-3 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-slate-200 dark:border-slate-705 bg-white dark:bg-slate-800 p-1">
          <button
            onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold min-w-14 text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(100)}
            className="h-10 px-3 rounded-xl border border-slate-205 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center gap-2 transition-all"
          >
            <Maximize2 className="w-4 h-4" />
            Fit
          </button>
          <button
            onClick={() => setIsPortfolioOpen(true)}
            className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold flex items-center gap-2 transition-all"
          >
            <Globe className="w-4 h-4" />
            Create Portfolio
          </button>
          <button
            onClick={handlePrint}
            className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 min-h-0 overflow-auto p-4 sm:p-6">
        <div
          className="mx-auto shadow-2xl rounded-md overflow-hidden w-fit"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s',
          }}
        >
          <div ref={printRef}>{renderTemplate()}</div>
        </div>
      </div>

      {/* Portfolio Export Dialog */}
      <PortfolioExportModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        resume={currentResume}
      />
    </div>
  );
};

export default ResumePreview;
