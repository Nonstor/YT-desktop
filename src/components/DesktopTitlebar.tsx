import React, { useState } from 'react';
import { 
  Minus, 
  Square, 
  X, 
  FolderOpen, 
  Puzzle, 
  Keyboard, 
  Code2, 
  Globe, 
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react';
import { PipedInstance } from '../types';

interface DesktopTitlebarProps {
  currentInstance: PipedInstance;
  onOpenPlugins: () => void;
  onOpenFolder: () => void;
  onOpenHotkeys: () => void;
  onOpenTauriStudio: () => void;
  onSelectInstance: (instance: PipedInstance) => void;
  instances: PipedInstance[];
  activePluginsCount: number;
}

export const DesktopTitlebar: React.FC<DesktopTitlebarProps> = ({
  currentInstance,
  onOpenPlugins,
  onOpenFolder,
  onOpenHotkeys,
  onOpenTauriStudio,
  onSelectInstance,
  instances,
  activePluginsCount,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [showInstanceMenu, setShowInstanceMenu] = useState(false);
  const [windowActionFeedback, setWindowActionFeedback] = useState<string | null>(null);

  const triggerWindowAction = (action: string) => {
    setWindowActionFeedback(action);
    setTimeout(() => setWindowActionFeedback(null), 1500);
    if (action === 'maximize') {
      setIsMaximized(!isMaximized);
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 select-none flex flex-col z-40">
      {/* Top Window Drag Area / Chrome */}
      <div className="h-9 px-3 flex items-center justify-between text-xs font-medium">
        {/* Left: Window Identity & Menu Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center shadow-sm">
              <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="font-semibold text-slate-100 tracking-tight">
              YouTube Desktop
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Tauri v2 · Piped
            </span>
          </div>

          <div className="h-3.5 w-px bg-slate-700/60 mx-1 hidden sm:block" />

          {/* Native Menu Options */}
          <div className="hidden md:flex items-center gap-1 text-[11px] text-slate-300">
            <button
              onClick={onOpenPlugins}
              className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Puzzle className="w-3 h-3 text-red-400" />
              <span>Плагины</span>
              <span className="bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300 rounded font-mono">
                {activePluginsCount}
              </span>
            </button>

            <button
              onClick={onOpenFolder}
              className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5"
              title="Открыть папку plugins/ (src-tauri/plugins)"
            >
              <FolderOpen className="w-3 h-3 text-amber-400" />
              <span>Папка plugins/</span>
            </button>

            <button
              onClick={onOpenHotkeys}
              className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Keyboard className="w-3 h-3 text-cyan-400" />
              <span>Горячие клавиши (?)</span>
            </button>

            <button
              onClick={onOpenTauriStudio}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-emerald-400 font-medium hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-3 h-3" />
              <span>Tauri 2.0 Сборка</span>
            </button>
          </div>
        </div>

        {/* Center: Piped Instance Selector Badge */}
        <div className="relative">
          <button
            onClick={() => setShowInstanceMenu(!showInstanceMenu)}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs transition-colors"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <Globe className="w-3 h-3 text-slate-400" />
            <span className="text-slate-300">{currentInstance.name}</span>
            <span className="font-mono text-[10px] text-slate-400">{currentInstance.ping}ms</span>
          </button>

          {showInstanceMenu && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-64 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-1.5 z-50 text-left">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Инстансы Piped API
              </div>
              {instances.map((inst) => (
                <button
                  key={inst.url}
                  onClick={() => {
                    onSelectInstance(inst);
                    setShowInstanceMenu(false);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded text-left text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                    inst.url === currentInstance.url ? 'bg-slate-800 text-white font-medium' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div>{inst.name}</div>
                    <div className="text-[10px] text-slate-400">{inst.location}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-emerald-400">{inst.ping}ms</span>
                    {inst.url === currentInstance.url && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Native Window Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center gap-2">
          {windowActionFeedback && (
            <span className="text-[10px] text-slate-400 font-mono transition-opacity">
              [Tauri Event: {windowActionFeedback}]
            </span>
          )}

          <div className="flex items-center -mr-1">
            <button
              onClick={() => triggerWindowAction('minimize')}
              className="w-8 h-7 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Свернуть"
              aria-label="Свернуть окно"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => triggerWindowAction('maximize')}
              className="w-8 h-7 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title={isMaximized ? "Восстановить" : "Развернуть"}
              aria-label="Развернуть окно"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={() => triggerWindowAction('close')}
              className="w-8 h-7 flex items-center justify-center hover:bg-red-600 hover:text-white text-slate-400 transition-colors"
              title="Закрыть"
              aria-label="Закрыть окно"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
