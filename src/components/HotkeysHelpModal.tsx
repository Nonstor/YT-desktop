import React from 'react';
import { X, Keyboard, MousePointer, Sparkles } from 'lucide-react';
import { HOTKEYS_LIST } from '../data/sampleVideos';

interface HotkeysHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HotkeysHelpModal: React.FC<HotkeysHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const categories = ['Воспроизведение', 'Навигация', 'Звук', 'Экран'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                Горячие клавиши и жесты мыши
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Полноценное десктопное управление через инъекцию src/main.js
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {categories.map((cat) => (
            <div key={cat} className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {cat}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HOTKEYS_LIST.filter(h => h.category === cat).map((hk, i) => (
                  <div 
                    key={i}
                    className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="text-slate-300">{hk.description}</span>
                    <kbd className="px-2 py-0.8 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px] font-semibold shrink-0 shadow-inner">
                      {hk.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Mouse Gestures Highlight Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-800/40">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs mb-2">
              <MousePointer className="w-4 h-4" />
              <span>Управление мышью</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Прокрутка колесика</strong> над видеоплеером плавно регулирует уровень громкости.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Двойной клик</strong> по левой трети плеера отматывает 5 секунд назад, по правой — 5 вперед.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span><strong>Правый клик</strong> открывает нативное контекстное меню (копирование ссылки, зацикливание).</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Нажмите <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-slate-300">?</kbd> в любой момент для вызова этой подсказки</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
