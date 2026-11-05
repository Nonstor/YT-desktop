import React, { useState } from 'react';
import { 
  X, 
  FolderOpen, 
  Plus, 
  Search, 
  Code, 
  Palette, 
  FileCode, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { Plugin } from '../types';

interface PluginsModalProps {
  isOpen: boolean;
  onClose: () => void;
  plugins: Plugin[];
  onTogglePlugin: (id: string, enabled: boolean) => void;
  onOpenFolder: () => void;
  onOpenCodeEditor: (plugin: Plugin) => void;
  onCreateNewPlugin: () => void;
}

export const PluginsModal: React.FC<PluginsModalProps> = ({
  isOpen,
  onClose,
  plugins,
  onTogglePlugin,
  onOpenFolder,
  onOpenCodeEditor,
  onCreateNewPlugin,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'script' | 'style'>('all');

  if (!isOpen) return null;

  const filteredPlugins = plugins.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  const activeCount = plugins.filter(p => p.enabled).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-100 tracking-tight">
                Управление модулями (Plugins)
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/60">
                {activeCount} / {plugins.length} активны
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Модули изолированно внедряются в WebView без перезапуска всего приложения
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Primary Action Button: "Открыть папку с плагинами" (Step 3 & button requested) */}
          <div className="flex items-center gap-2">
            <button
              id="open-folder-btn"
              onClick={onOpenFolder}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-2 transition-colors shadow-sm"
              title="Открыть системную папку plugins/ в проводнике"
            >
              <FolderOpen className="w-4 h-4 text-amber-400" />
              <span>Открыть папку с плагинами</span>
            </button>

            <button
              onClick={onCreateNewPlugin}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-slate-400" />
              <span>Создать плагин</span>
            </button>
          </div>

          {/* Search & Type filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Поиск по плагинам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-800/80 border border-slate-700/60 rounded-md text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 w-44"
              />
            </div>

            <div className="flex items-center p-0.5 bg-slate-800 rounded-md text-[11px]">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-0.5 rounded transition-colors ${filterType === 'all' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Все
              </button>
              <button
                onClick={() => setFilterType('script')}
                className={`px-2 py-0.5 rounded transition-colors ${filterType === 'script' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Скрипты
              </button>
              <button
                onClick={() => setFilterType('style')}
                className={`px-2 py-0.5 rounded transition-colors ${filterType === 'style' ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Темы
              </button>
            </div>
          </div>
        </div>

        {/* Plugin Cards List */}
        <div id="plugin-list" className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredPlugins.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Плагины не найдены по запросу «{searchQuery}»
            </div>
          ) : (
            filteredPlugins.map((plugin) => (
              <div 
                key={plugin.id}
                className={`p-4 rounded-xl border transition-all ${
                  plugin.enabled 
                    ? 'bg-slate-800/40 border-slate-700/70 shadow-sm' 
                    : 'bg-slate-900/60 border-slate-800/60 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 text-sm">
                        {plugin.name}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        v{plugin.version}
                      </span>
                      {plugin.type === 'style' ? (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950/70 text-purple-300 border border-purple-800/50 flex items-center gap-1 font-mono">
                          <Palette className="w-2.5 h-2.5" /> CSS
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/70 text-amber-300 border border-amber-800/50 flex items-center gap-1 font-mono">
                          <FileCode className="w-2.5 h-2.5" /> JS
                        </span>
                      )}
                      {plugin.isBuiltIn && (
                        <span className="text-[10px] text-slate-400">
                          (Встроенный)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {plugin.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5 text-[11px] text-slate-400">
                      <span>Автор: {plugin.author || 'Сообщество'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-400">
                        plugins/{plugin.id}/
                      </span>
                      <span aria-hidden="true">·</span>
                      <button
                        onClick={() => onOpenCodeEditor(plugin)}
                        className="text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                      >
                        <Code className="w-3 h-3" />
                        <span>Исходный код</span>
                      </button>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <div className="shrink-0 pt-0.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={plugin.enabled}
                        onChange={(e) => onTogglePlugin(plugin.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rust IPC: Команда get_plugins и динамическая инъекция в WebView2</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            ОЗУ: ~35-50 МБ
          </span>
        </div>
      </div>
    </div>
  );
};
