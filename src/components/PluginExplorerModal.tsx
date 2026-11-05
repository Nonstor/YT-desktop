import React, { useState } from 'react';
import { 
  X, 
  Folder, 
  FileCode, 
  Palette, 
  FileText, 
  Save, 
  Play, 
  Check, 
  Copy, 
  FolderPlus, 
  FilePlus, 
  Trash2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Plugin } from '../types';

interface PluginExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plugins: Plugin[];
  onSavePluginFiles: (pluginId: string, updates: Partial<Plugin>) => void;
  onCreatePlugin: (newPlugin: Plugin) => void;
  onDeletePlugin: (pluginId: string) => void;
  initialSelectedPluginId?: string | null;
}

export const PluginExplorerModal: React.FC<PluginExplorerModalProps> = ({
  isOpen,
  onClose,
  plugins,
  onSavePluginFiles,
  onCreatePlugin,
  onDeletePlugin,
  initialSelectedPluginId,
}) => {
  const [selectedPluginId, setSelectedPluginId] = useState<string>(
    initialSelectedPluginId || (plugins[0]?.id ?? 'sponsorblock')
  );
  const [selectedFile, setSelectedFile] = useState<'manifest' | 'code'>('manifest');
  const [editedCode, setEditedCode] = useState<string>('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);

  // New plugin creation wizard state
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPluginForm, setNewPluginForm] = useState({
    id: '',
    name: '',
    description: '',
    type: 'script' as 'script' | 'style',
    author: 'MyDev',
  });

  const selectedPlugin = plugins.find(p => p.id === selectedPluginId) || plugins[0];

  // Sync edited code when plugin or file changes
  React.useEffect(() => {
    if (selectedPlugin) {
      if (selectedFile === 'manifest') {
        setEditedCode(selectedPlugin.manifest_content || '');
      } else {
        setEditedCode(
          selectedPlugin.type === 'style'
            ? selectedPlugin.style_content || ''
            : selectedPlugin.script_content || ''
        );
      }
    }
  }, [selectedPluginId, selectedFile, selectedPlugin]);

  if (!isOpen) return null;

  const virtualFsPath = `~/.local/share/com.yt.desktop/plugins/${selectedPlugin?.id || ''}`;

  const handleCopyPath = () => {
    navigator.clipboard.writeText(virtualFsPath);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const handleSave = () => {
    if (!selectedPlugin) return;
    if (selectedFile === 'manifest') {
      try {
        const parsed = JSON.parse(editedCode);
        onSavePluginFiles(selectedPlugin.id, {
          manifest_content: editedCode,
          name: parsed.name || selectedPlugin.name,
          description: parsed.description || selectedPlugin.description,
          version: parsed.version || selectedPlugin.version,
        });
      } catch {
        onSavePluginFiles(selectedPlugin.id, { manifest_content: editedCode });
      }
    } else {
      if (selectedPlugin.type === 'style') {
        onSavePluginFiles(selectedPlugin.id, { style_content: editedCode });
      } else {
        onSavePluginFiles(selectedPlugin.id, { script_content: editedCode });
      }
    }
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleCreateNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = newPluginForm.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!cleanId) return;

    const manifest = {
      id: cleanId,
      name: newPluginForm.name || cleanId,
      description: newPluginForm.description || 'Пользовательский модуль для YouTube Desktop',
      version: '1.0.0',
      enabled: true,
      author: newPluginForm.author,
      main: newPluginForm.type === 'style' ? 'style.css' : 'script.js',
    };

    const starterCode =
      newPluginForm.type === 'style'
        ? `/* Custom Style Module for ${newPluginForm.name} */\n.video-container {\n  border: 2px solid #ef4444;\n}`
        : `// Custom Script Module: ${newPluginForm.name}\n(() => {\n  console.log('[${newPluginForm.name}] Модуль успешно запущен в Tauri WebView!');\n})();`;

    const newPlugin: Plugin = {
      id: cleanId,
      name: newPluginForm.name || cleanId,
      description: newPluginForm.description || 'Пользовательский модуль',
      version: '1.0.0',
      enabled: true,
      author: newPluginForm.author,
      type: newPluginForm.type,
      manifest_content: JSON.stringify(manifest, null, 2),
      script_content: newPluginForm.type === 'script' ? starterCode : undefined,
      style_content: newPluginForm.type === 'style' ? starterCode : undefined,
      script_path: newPluginForm.type === 'script' ? 'script.js' : undefined,
      style_path: newPluginForm.type === 'style' ? 'style.css' : undefined,
      isBuiltIn: false,
    };

    onCreatePlugin(newPlugin);
    setSelectedPluginId(cleanId);
    setSelectedFile('code');
    setIsCreatingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col h-[82vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: System Folder Explorer Bar */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-xs text-slate-100 font-mono">
                Папка plugins/ (Tauri Native FS)
              </span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            {/* System path indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 font-mono text-[11px] text-slate-300">
              <span className="truncate max-w-sm">{virtualFsPath}</span>
              <button 
                onClick={handleCopyPath}
                className="hover:text-white transition-colors"
                title="Копировать путь"
              >
                {copiedPath ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreatingNew(true)}
              className="px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Новый модуль</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body: 3-column Layout (Folders | Files | Code Editor) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Column 1: Folder Tree (plugins/) */}
          <div className="w-56 border-r border-slate-800 bg-slate-950/30 flex flex-col">
            <div className="p-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/60">
              Директории модулей
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {plugins.map((plugin) => (
                <button
                  key={plugin.id}
                  onClick={() => {
                    setSelectedPluginId(plugin.id);
                    setIsCreatingNew(false);
                  }}
                  className={`w-full px-2.5 py-2 rounded-lg text-left text-xs font-mono flex items-center justify-between transition-colors ${
                    selectedPluginId === plugin.id && !isCreatingNew
                      ? 'bg-red-600/15 text-red-300 border border-red-500/30 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className={`w-3.5 h-3.5 shrink-0 ${selectedPluginId === plugin.id ? 'text-red-400' : 'text-amber-400'}`} />
                    <span className="truncate">{plugin.id}/</span>
                  </div>
                  {plugin.enabled && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Включен" />
                  )}
                </button>
              ))}
            </div>

            {!selectedPlugin?.isBuiltIn && selectedPlugin && (
              <div className="p-2 border-t border-slate-800">
                <button
                  onClick={() => onDeletePlugin(selectedPlugin.id)}
                  className="w-full px-2 py-1.5 rounded text-left text-xs text-red-400 hover:bg-red-950/30 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Удалить папку {selectedPlugin.id}</span>
                </button>
              </div>
            )}
          </div>

          {/* Column 2: Files in Selected Folder */}
          <div className="w-48 border-r border-slate-800 bg-slate-900/60 flex flex-col">
            <div className="p-2.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/60 flex items-center justify-between">
              <span>Файлы</span>
              <span className="font-mono text-[10px] text-slate-400">
                {selectedPlugin?.id}
              </span>
            </div>
            <div className="p-2 space-y-1">
              {/* Manifest */}
              <button
                onClick={() => setSelectedFile('manifest')}
                className={`w-full px-2.5 py-1.5 rounded-md text-left text-xs font-mono flex items-center gap-2 transition-colors ${
                  selectedFile === 'manifest'
                    ? 'bg-slate-800 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>manifest.json</span>
              </button>

              {/* Code File */}
              {selectedPlugin && (
                <button
                  onClick={() => setSelectedFile('code')}
                  className={`w-full px-2.5 py-1.5 rounded-md text-left text-xs font-mono flex items-center gap-2 transition-colors ${
                    selectedFile === 'code'
                      ? 'bg-slate-800 text-white font-medium shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {selectedPlugin.type === 'style' ? (
                    <Palette className="w-3.5 h-3.5 text-purple-400" />
                  ) : (
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>{selectedPlugin.type === 'style' ? 'style.css' : 'script.js'}</span>
                </button>
              )}
            </div>

            <div className="mt-auto p-3 bg-slate-950/40 border-t border-slate-800 text-[11px] text-slate-400">
              <div className="font-semibold text-slate-300 mb-1">{selectedPlugin?.name}</div>
              <div className="text-[10px] text-slate-400">Статус: {selectedPlugin?.enabled ? 'Включен' : 'Отключен'}</div>
            </div>
          </div>

          {/* Column 3: Live File Editor */}
          <div className="flex-1 flex flex-col bg-slate-950">
            {isCreatingNew ? (
              /* Create Plugin Wizard */
              <div className="p-8 max-w-md mx-auto my-auto w-full">
                <h3 className="text-base font-semibold text-slate-100 mb-1">
                  Создание нового модуля (плагина)
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Создаст новую папку в plugins/ с готовым manifest.json и кодом
                </p>

                <form onSubmit={handleCreateNewSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Идентификатор (ID папки, латиница):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="custom-feature-mod"
                      value={newPluginForm.id}
                      onChange={(e) => setNewPluginForm({ ...newPluginForm, id: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 font-mono focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Отображаемое название:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Мой кастомный плагин"
                      value={newPluginForm.name}
                      onChange={(e) => setNewPluginForm({ ...newPluginForm, name: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Описание:
                    </label>
                    <input
                      type="text"
                      placeholder="Что делает плагин..."
                      value={newPluginForm.description}
                      onChange={(e) => setNewPluginForm({ ...newPluginForm, description: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Тип модуля:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewPluginForm({ ...newPluginForm, type: 'script' })}
                        className={`p-2.5 rounded border text-left transition-colors ${
                          newPluginForm.type === 'script'
                            ? 'bg-red-600/20 border-red-500 text-white font-medium'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="font-semibold">JavaScript (.js)</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Логика, хоткеи, перехват событий</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewPluginForm({ ...newPluginForm, type: 'style' })}
                        className={`p-2.5 rounded border text-left transition-colors ${
                          newPluginForm.type === 'style'
                            ? 'bg-red-600/20 border-red-500 text-white font-medium'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="font-semibold">CSS (.css)</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Кастомная тема, цвета, скрытие элементов</div>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded transition-colors"
                    >
                      Создать модуль
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNew(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Code Editor Area */
              <>
                {/* Editor Bar */}
                <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span>
                      plugins/{selectedPlugin?.id}/{selectedFile === 'manifest' ? 'manifest.json' : selectedPlugin?.type === 'style' ? 'style.css' : 'script.js'}
                    </span>
                    {isSavedNotice && (
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-sans font-medium">
                        <Check className="w-3.5 h-3.5" /> Сохранено & Hot-Reload!
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSave}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-sans font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Сохранить в файл</span>
                  </button>
                </div>

                {/* Code Textarea */}
                <div className="flex-1 relative">
                  <textarea
                    value={editedCode}
                    onChange={(e) => setEditedCode(e.target.value)}
                    spellCheck={false}
                    className="w-full h-full p-4 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-red-600/40"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
