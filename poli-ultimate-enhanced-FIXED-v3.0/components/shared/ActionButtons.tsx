// components/shared/ActionButtons.tsx
// UNIVERSAL ACTION BUTTONS FOR ALL DETAIL SCREENS

import React, { useState } from 'react';
import {
  Download,
  Share2,
  Save,
  Printer,
  FileText,
  FileSpreadsheet,
  Image,
  Code,
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  ChevronDown,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { exportContent, shareContent, printContent, ExportFormat } from '../../utils/exportUtils';

interface ActionButtonsProps {
  title: string;
  content: any;
  metadata?: {
    author?: string;
    date?: string;
    source?: string;
    [key: string]: any;
  };
  onSave?: () => void;
  isSaved?: boolean;
  element?: HTMLElement;
  className?: string;
  compact?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  title,
  content,
  metadata,
  onSave,
  isSaved = false,
  element,
  className = '',
  compact = false
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Export handlers
  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    try {
      await exportContent({ title, content, metadata }, format);
      setShowExportMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Share handlers
  const handleShare = async (platform?: 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy') => {
    try {
      await shareContent({ title, content, metadata }, platform);
      setShowShareMenu(false);
      if (platform === 'copy') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // Print handler
  const handlePrint = () => {
    printContent(element);
  };

  // Save handler
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Save Button */}
        {onSave && (
          <button
            onClick={handleSave}
            className={`p-2 rounded-lg transition-all ${
              isSaved
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={isSaved ? 'Saved' : 'Save'}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        )}

        {/* Export Button */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          {showExportMenu && (
            <ExportMenu onExport={handleExport} onClose={() => setShowExportMenu(false)} />
          )}
        </div>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {showShareMenu && (
            <ShareMenu onShare={handleShare} onClose={() => setShowShareMenu(false)} copied={copied} />
          )}
        </div>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          title="Print"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Save Button */}
      {onSave && (
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isSaved
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-4 h-4" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4" />
              <span>Save</span>
            </>
          )}
        </button>
      )}

      {/* Download/Export Button */}
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>{exporting ? 'Exporting...' : 'Download'}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {showExportMenu && (
          <ExportMenu onExport={handleExport} onClose={() => setShowExportMenu(false)} />
        )}
      </div>

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {showShareMenu && (
          <ShareMenu onShare={handleShare} onClose={() => setShowShareMenu(false)} copied={copied} />
        )}
      </div>

      {/* Print Button */}
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-600 hover:bg-gray-700 text-white transition-all"
      >
        <Printer className="w-4 h-4" />
        <span>Print</span>
      </button>
    </div>
  );
};

// Export Menu Component
const ExportMenu: React.FC<{
  onExport: (format: ExportFormat) => void;
  onClose: () => void;
}> = ({ onExport, onClose }) => {
  const exportOptions = [
    { format: 'pdf' as ExportFormat, icon: FileText, label: 'PDF Document', color: 'text-red-600' },
    { format: 'docx' as ExportFormat, icon: FileText, label: 'Word Document', color: 'text-blue-600' },
    { format: 'pptx' as ExportFormat, icon: FileSpreadsheet, label: 'PowerPoint', color: 'text-orange-600' },
    { format: 'html' as ExportFormat, icon: Code, label: 'HTML Page', color: 'text-green-600' },
    { format: 'md' as ExportFormat, icon: FileText, label: 'Markdown', color: 'text-gray-600' },
    { format: 'txt' as ExportFormat, icon: FileText, label: 'Plain Text', color: 'text-gray-500' },
    { format: 'json' as ExportFormat, icon: Code, label: 'JSON Data', color: 'text-yellow-600' },
    { format: 'csv' as ExportFormat, icon: FileSpreadsheet, label: 'CSV Spreadsheet', color: 'text-teal-600' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[220px] animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Download As
          </p>
        </div>
        {exportOptions.map(({ format, icon: Icon, label, color }) => (
          <button
            key={format}
            onClick={() => onExport(format)}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

// Share Menu Component
const ShareMenu: React.FC<{
  onShare: (platform?: 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy') => void;
  onClose: () => void;
  copied: boolean;
}> = ({ onShare, onClose, copied }) => {
  const shareOptions = [
    { platform: 'twitter' as const, icon: Twitter, label: 'Twitter', color: 'text-sky-500' },
    { platform: 'facebook' as const, icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
    { platform: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700' },
    { platform: 'email' as const, icon: Mail, label: 'Email', color: 'text-gray-600' },
    { platform: 'copy' as const, icon: copied ? Check : Copy, label: copied ? 'Copied!' : 'Copy Link', color: copied ? 'text-green-600' : 'text-gray-600' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Share Via
          </p>
        </div>
        {shareOptions.map(({ platform, icon: Icon, label, color }) => (
          <button
            key={platform}
            onClick={() => onShare(platform)}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          </button>
        ))}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
          <button
            onClick={() => onShare()}
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
          >
            <Share2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">More Options...</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ActionButtons;
