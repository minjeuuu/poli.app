import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Menu, Minus, Plus, ChevronLeft, ChevronRight, Wand2, X,
  List, Highlighter, PenTool, StickyNote, AlertCircle, Bot, Sparkles,
  Languages, FileText, Search, Loader2, BookOpen, Share2, Type, Palette,
  MousePointerClick, Music, Volume2, Quote, Copy, Check, Settings,
  Grid, AlignLeft, AlignCenter, AlignJustify, Eye
} from 'lucide-react';
import {
  fetchBookStructure,
  streamChapterContent,
  askReaderQuestion
} from '../services/libraryService';
import { BookStructure } from '../types';
import LoadingScreen from './LoadingScreen';
import { playSFX } from '../services/soundService';
import { playTextAsSpeech } from '../services/audioService';

interface ReaderViewProps {
  title: string;
  author: string;
  onClose: () => void;
  onNavigate?: (type: string, payload: any) => void;
  type?: string;
}

const ReaderView: React.FC<ReaderViewProps> = ({
  title,
  author,
  onClose,
  onNavigate,
  type = 'Book'
}) => {
  // Book data
  const [structure, setStructure] = useState<BookStructure | null>(null);
  const [loadingStructure, setLoadingStructure] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [chapterContent, setChapterContent] = useState('');
  const [loadingChapter, setLoadingChapter] = useState(false);

  // Appearance
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [currentFont, setCurrentFont] = useState(FONTS[0]);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [textAlign, setTextAlign] = useState<'left' | 'justify' | 'center'>('justify');
  const [showSettings, setShowSettings] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'Theme' | 'Type'>('Theme');

  // AI Interaction
  const [showAI, setShowAI] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Selection
  const [selection, setSelection] = useState<string | null>(null);
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);

  // Citation
  const [showCitation, setShowCitation] = useState(false);
  const [citationSearch, setCitationSearch] = useState('');
  const [citationFormat, setCitationFormat] = useState('APA');
  const [generatedCitation, setGeneratedCitation] = useState('');
  const [citationCopied, setCitationCopied] = useState(false);

  // Audio
  const [isPlaying, setIsPlaying] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // Load book structure
  useEffect(() => {
    setLoadingStructure(true);
    fetchBookStructure(title)
      .then(setStructure)
      .finally(() => setLoadingStructure(false));
  }, [title]);

  // Load chapter content
  useEffect(() => {
    if (!structure) return;
    setLoadingChapter(true);
    streamChapterContent(structure.chapters[currentChapterIndex])
      .then(setChapterContent)
      .finally(() => setLoadingChapter(false));
  }, [structure, currentChapterIndex]);

  // AI query handler
  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return;
    setIsAiThinking(true);
    const response = await askReaderQuestion(title, aiQuery);
    setAiResponse(response);
    setIsAiThinking(false);
  };

  // Navigation
  const goToChapter = (index: number) => {
    if (!structure || index < 0 || index >= structure.chapters.length) return;
    setCurrentChapterIndex(index);
  };

  // Audio playback
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      playTextAsSpeech.stop();
    } else {
      setIsPlaying(true);
      playTextAsSpeech(chapterContent, () => setIsPlaying(false));
    }
  };

  if (loadingStructure) return <LoadingScreen />;

  return (
    <div className={`${currentTheme.bg} ${currentFont.class} relative w-full h-full`}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <button onClick={onClose}><ArrowLeft /></button>
        <h1 className={`${currentTheme.text}`}>{title}</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)}><Settings /></button>
          <button onClick={togglePlay}>{isPlaying ? <Volume2 /> : <Music />}</button>
        </div>
      </header>

      {/* Main content */}
      <main
        ref={contentRef}
        className={`${currentTheme.text} p-6`}
        style={{ fontSize, lineHeight, textAlign }}
      >
        {loadingChapter ? <Loader2 /> : chapterContent}
      </main>

      {/* TOC */}
      {showTOC && structure && (
        <aside className="absolute right-0 top-0 h-full w-80 bg-gray-50 border-l p-4 overflow-y-auto">
          <h2>Table of Contents</h2>
          <ul>
            {structure.chapters.map((c, i) => (
              <li key={c.id} className="cursor-pointer" onClick={() => goToChapter(i)}>
                {c.title}
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* AI Panel */}
      {showAI && (
        <div className="absolute bottom-0 left-0 w-full bg-white p-4 border-t">
          <textarea
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask a question"
            className="w-full p-2 border"
          />
          <button onClick={handleAIQuery}>Ask</button>
          {isAiThinking ? <Loader2 /> : <p>{aiResponse}</p>}
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-0 right-0 w-80 h-full bg-gray-50 border-l p-4 overflow-y-auto">
          <h2>Settings</h2>
          {/* Theme / Font / Size / Line height */}
        </div>
      )}

      {/* Citation Panel */}
      {showCitation && (
        <div className="absolute bottom-0 left-0 w-full bg-gray-100 p-4 border-t">
          <input
            type="text"
            value={citationSearch}
            onChange={(e) => setCitationSearch(e.target.value)}
            placeholder="Search citation"
            className="w-full p-2 border"
          />
          <select value={citationFormat} onChange={(e) => setCitationFormat(e.target.value)}>
            {CITATION_FORMATS.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <button>Generate</button>
          {generatedCitation && <p>{generatedCitation}</p>}
        </div>
      )}
    </div>
  );
};

export default ReaderView;