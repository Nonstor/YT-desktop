import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  Cpu, 
  Layers, 
  FolderDown, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Plugin } from '../types';
import { generateTauriProjectFiles, exportTauriProjectAsZip, GeneratedFile } from '../utils/tauriCodeGenerator';

interface TauriStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  plugins: Plugin[];
}

export const TauriStudioModal: React.FC<TauriStudioModalProps> = ({
  isOpen,
  onClose,
  plugins,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const files = generateTauriProjectFiles(plugins);
  const currentFile = files[selectedFileIndex] || files[0];

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await exportTauriProjectAsZip(plugins);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'yt-desktop-tauri2-piped.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Ошибка экспорта архива:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <h2 className="text-base font-semibold text-slate-100">
                Tauri 2.0 Source Studio & Архитектура Сборки
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Rust + Native WebView
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Нативное приложение весом ~15 МБ, потребление памяти ~30–50 МБ ОЗУ (вместо ~400 МБ в Electron)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Генерация ZIP...' : 'Скачать проект (.zip)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Tech Specs Bar */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>ОЗУ: <strong className="text-slate-100 font-mono">35-50 MB</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Вес инсталлятора: <strong className="text-slate-100 font-mono">~15 MB</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Команда сборки: <code className="text-emerald-300 font-mono text-[11px] bg-slate-800 px-1 rounded">cargo tauri build</code></span>
            </div>
          </div>
        </div>

        {/* Content: Left file list + Right code preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-64 border-r border-slate-800 bg-slate-950/40 flex flex-col">
            <div className="p-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              Дерево файлов проекта
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {files.map((file, idx) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-mono flex items-center gap-2 transition-colors ${
                    selectedFileIndex === idx
                      ? 'bg-slate-800 text-white font-medium border border-slate-700/80'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${
                    file.language === 'rust' ? 'text-amber-400' :
                    file.language === 'json' ? 'text-cyan-400' :
                    file.language === 'yaml' ? 'text-rose-400' :
                    file.language === 'javascript' ? 'text-yellow-400' :
                    file.language === 'css' ? 'text-purple-400' : 'text-slate-400'
                  }`} />
                  <span className="truncate">{file.path}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-slate-950">
            {/* Action Bar */}
            <div className="px-5 py-2.5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-slate-200 font-semibold">{currentFile.path}</span>
                <span className="text-slate-400 ml-2 text-[11px]">{currentFile.description}</span>
              </div>

              <button
                onClick={handleCopyCode}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Скопировано!' : 'Копировать'}</span>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto p-4">
              <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre selection:bg-red-600/30">
                {currentFile.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
