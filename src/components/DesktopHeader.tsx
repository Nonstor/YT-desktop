import React, { useState } from 'react';
import { 
  Search, 
  Link as LinkIcon, 
  Puzzle, 
  FolderOpen, 
  Keyboard, 
  Code2, 
  Compass, 
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Plugin } from '../types';

interface DesktopHeaderProps {
  onSearch: (query: string) => void;
  onLoadCustomUrl: (url: string) => void;
  onOpenPlugins: () => void;
  onOpenFolder: () => void;
  onOpenHotkeys: () => void;
  onOpenTauriStudio: () => void;
  activePluginsCount: number;
  totalPluginsCount: number;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  onSearch,
  onLoadCustomUrl,
  onOpenPlugins,
  onOpenFolder,
  onOpenHotkeys,
  onOpenTauriStudio,
  activePluginsCount,
  totalPluginsCount,
}) => {
  const [query, setQuery] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlDialog, setShowUrlDialog] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onLoadCustomUrl(customUrl.trim());
      setCustomUrl('');
      setShowUrlDialog(false);
    }
  };

  return (
    <header className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Quick Navigation / Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span className="text-red-500 font-black">▶</span> Piped Desktop
            </span>
          </div>

          {/* Quick categories */}
          <div className="hidden lg:flex items-center gap-1 ml-4 text-xs text-slate-400">
            {['Главная', 'В тренде', 'Подписки', 'История'].map((tab, idx) => (
              <button
                key={tab}
                onClick={() => onSearch(tab === 'Главная' ? '' : tab)}
                className={`px-2.5 py-1 rounded-md transition-colors ${idx === 0 ? 'bg-slate-800 text-white font-medium' : 'hover:text-slate-200 hover:bg-slate-800/40'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Search Bar & URL Loader */}
        <div className="flex-1 max-w-xl mx-2 flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск видео через Piped API или название..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950/70 border border-slate-700/80 rounded-full text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors shadow-inner"
            />
          </form>

          {/* Direct URL input trigger */}
          <button
            onClick={() => setShowUrlDialog(!showUrlDialog)}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors shrink-0"
            title="Открыть прямой URL или YouTube ID"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Plugins manager button */}
          <button
            onClick={onOpenPlugins}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Puzzle className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Плагины</span>
            <span className="font-mono text-[10px] bg-red-950/80 text-red-300 px-1.5 py-0.2 rounded border border-red-800">
              {activePluginsCount}
            </span>
          </button>

          {/* Open folder button */}
          <button
            onClick={onOpenFolder}
            className="hidden sm:flex px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium items-center gap-1.5 transition-colors"
            title="Открыть папку plugins/"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Папка plugins/</span>
          </button>

          {/* Tauri 2.0 Studio */}
          <button
            onClick={onOpenTauriStudio}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Исходный код Tauri 2.0 и экспорт в .zip"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tauri 2.0 Сборка</span>
          </button>
        </div>
      </div>

      {/* Direct URL Modal / Dropdown */}
      {showUrlDialog && (
        <div className="mt-2.5 p-3 bg-slate-950 border border-slate-800 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <input
            type="text"
            placeholder="Вставьте ссылку на MP4 поток или YouTube (например: https://commondatastorage.googleapis.com/...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono focus:border-red-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={handleUrlSubmit}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
          >
            <span>Запустить</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
};
