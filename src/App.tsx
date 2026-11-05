/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DesktopTitlebar } from './components/DesktopTitlebar';
import { DesktopHeader } from './components/DesktopHeader';
import { VideoPlayer } from './components/VideoPlayer';
import { VideoDetails } from './components/VideoDetails';
import { VideoSidebar } from './components/VideoSidebar';
import { CommentsSection } from './components/CommentsSection';
import { PluginsModal } from './components/PluginsModal';
import { PluginExplorerModal } from './components/PluginExplorerModal';
import { TauriStudioModal } from './components/TauriStudioModal';
import { HotkeysHelpModal } from './components/HotkeysHelpModal';
import { DEFAULT_PLUGINS } from './data/defaultPlugins';
import { SAMPLE_VIDEOS, PIPED_INSTANCES } from './data/sampleVideos';
import { Plugin, VideoItem, PipedInstance } from './types';
import { 
  Puzzle, 
  FolderOpen, 
  Keyboard, 
  Code2, 
  ShieldCheck, 
  Cpu, 
  Info,
  Tv
} from 'lucide-react';

export default function App() {
  const [plugins, setPlugins] = useState<Plugin[]>(DEFAULT_PLUGINS);
  const [currentVideo, setCurrentVideo] = useState<VideoItem>(SAMPLE_VIDEOS[0]);
  const [currentInstance, setCurrentInstance] = useState<PipedInstance>(PIPED_INSTANCES[0]);
  const [searchFilter, setSearchFilter] = useState('');
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Modals state
  const [isPluginsOpen, setIsPluginsOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isTauriStudioOpen, setIsTauriStudioOpen] = useState(false);
  const [isHotkeysOpen, setIsHotkeysOpen] = useState(false);
  const [explorerPluginId, setExplorerPluginId] = useState<string | null>(null);

  // Dynamic CSS injection for active style plugins (OLED theme, custom styles)
  useEffect(() => {
    plugins.forEach(p => {
      const tagId = `plugin-style-${p.id}`;
      let tag = document.getElementById(tagId);
      if (p.enabled && p.style_content) {
        if (!tag) {
          tag = document.createElement('style');
          tag.id = tagId;
          document.head.appendChild(tag);
        }
        tag.textContent = p.style_content;
      } else if (tag) {
        tag.remove();
      }
    });

    // Check if dark-oled plugin is active
    const oledPlugin = plugins.find(p => p.id === 'dark-oled');
    if (oledPlugin && oledPlugin.enabled) {
      document.documentElement.setAttribute('data-theme', 'oled');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [plugins]);

  // Global hotkeys for quick access (Ctrl+P / Cmd+P for plugins, ? for hotkeys)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPluginsOpen(prev => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsHotkeysOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Toggle plugin on/off (simulates Rust toggle_plugin command)
  const handleTogglePlugin = (id: string, enabled: boolean) => {
    setPlugins(prev =>
      prev.map(p => (p.id === id ? { ...p, enabled } : p))
    );
  };

  // Update plugin files (from live code editor)
  const handleSavePluginFiles = (pluginId: string, updates: Partial<Plugin>) => {
    setPlugins(prev =>
      prev.map(p => (p.id === pluginId ? { ...p, ...updates } : p))
    );
  };

  // Create new plugin
  const handleCreatePlugin = (newPlugin: Plugin) => {
    setPlugins(prev => [...prev, newPlugin]);
  };

  // Delete plugin
  const handleDeletePlugin = (pluginId: string) => {
    setPlugins(prev => prev.filter(p => p.id !== pluginId));
  };

  // Open explorer for specific plugin
  const handleOpenCodeEditor = (plugin: Plugin) => {
    setExplorerPluginId(plugin.id);
    setIsExplorerOpen(true);
  };

  // Search filter
  const filteredVideos = SAMPLE_VIDEOS.filter(v => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      v.title.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.uploaderName.toLowerCase().includes(q) ||
      v.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  // Custom URL or YouTube ID loader
  const handleLoadCustomUrl = (input: string) => {
    const isUrl = input.startsWith('http://') || input.startsWith('https://');
    const newVideo: VideoItem = {
      id: `custom-${Date.now()}`,
      title: isUrl ? `Пользовательский видеопоток (${new URL(input).pathname.split('/').pop() || 'Стрим'})` : `Пользовательское видео (ID: ${input})`,
      uploaderName: 'Custom Piped Source',
      uploaderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      uploaderVerified: false,
      views: 1,
      uploadedDate: 'Только что',
      duration: 120,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
      description: `Поток загружен напрямую через кастомный URL:\n${input}\nПоддерживает все функции Tauri: горячие клавиши, управление громкостью колесиком мыши и плагины.`,
      likes: 10,
      dislikes: 0,
      category: 'Пользовательское',
      videoUrl: isUrl ? input : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      tags: ['custom', 'stream'],
      sponsorSegments: [],
    };
    setCurrentVideo(newVideo);
  };

  const activePluginsCount = plugins.filter(p => p.enabled).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600/30 selection:text-white">
      {/* Native Desktop Window Titlebar (Tauri 2.0 Chrome) */}
      <DesktopTitlebar
        currentInstance={currentInstance}
        onOpenPlugins={() => setIsPluginsOpen(true)}
        onOpenFolder={() => {
          setExplorerPluginId(null);
          setIsExplorerOpen(true);
        }}
        onOpenHotkeys={() => setIsHotkeysOpen(true)}
        onOpenTauriStudio={() => setIsTauriStudioOpen(true)}
        onSelectInstance={setCurrentInstance}
        instances={PIPED_INSTANCES}
        activePluginsCount={activePluginsCount}
      />

      {/* Main Top Header & Navigation Bar */}
      <DesktopHeader
        onSearch={setSearchFilter}
        onLoadCustomUrl={handleLoadCustomUrl}
        onOpenPlugins={() => setIsPluginsOpen(true)}
        onOpenFolder={() => {
          setExplorerPluginId(null);
          setIsExplorerOpen(true);
        }}
        onOpenHotkeys={() => setIsHotkeysOpen(true)}
        onOpenTauriStudio={() => setIsTauriStudioOpen(true)}
        activePluginsCount={activePluginsCount}
        totalPluginsCount={plugins.length}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full max-w-[1500px] mx-auto p-4 md:p-6">
        {/* Cinema Mode Layout vs Standard 2-Column Desktop Grid */}
        {isCinemaMode ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-lg text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-400" />
                <span>Режим кинотеатра (Cinema Mode) активен</span>
              </span>
              <button
                onClick={() => setIsCinemaMode(false)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
              >
                Вернуться к обычному виду (T)
              </button>
            </div>

            <VideoPlayer
              video={currentVideo}
              plugins={plugins}
              isCinemaMode={true}
              onToggleCinemaMode={() => setIsCinemaMode(false)}
              onOpenPlugins={() => setIsPluginsOpen(true)}
            />

            <div className="max-w-4xl mx-auto space-y-6">
              <VideoDetails
                video={currentVideo}
                plugins={plugins}
                onOpenPlugins={() => setIsPluginsOpen(true)}
              />
              <CommentsSection />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Video Player & Details */}
            <div className="lg:col-span-8 space-y-5">
              <VideoPlayer
                video={currentVideo}
                plugins={plugins}
                isCinemaMode={false}
                onToggleCinemaMode={() => setIsCinemaMode(true)}
                onOpenPlugins={() => setIsPluginsOpen(true)}
              />

              <VideoDetails
                video={currentVideo}
                plugins={plugins}
                onOpenPlugins={() => setIsPluginsOpen(true)}
              />

              <CommentsSection />
            </div>

            {/* Right 4 Cols: Video Sidebar / Recommendations */}
            <div className="lg:col-span-4">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 sticky top-16">
                <VideoSidebar
                  videos={filteredVideos}
                  currentVideoId={currentVideo.id}
                  onSelectVideo={(v) => {
                    setCurrentVideo(v);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Desktop Native Status Strip (Footer) */}
      <footer className="px-4 py-2 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Tauri 2.0 IPC Связка активна</span>
          </div>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-slate-300">38 MB RAM</span>
            <span className="text-slate-400">(в 8 раз легче Electron)</span>
          </div>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Модули в plugins/: <strong className="text-slate-200 font-mono">{activePluginsCount}/{plugins.length}</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHotkeysOpen(true)}
            className="hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <Keyboard className="w-3 h-3 text-cyan-400" />
            <span>Горячие клавиши (?)</span>
          </button>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <button
            onClick={() => setIsTauriStudioOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center gap-1"
          >
            <Code2 className="w-3 h-3" />
            <span>Скачать проект Tauri 2.0 (.zip)</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <PluginsModal
        isOpen={isPluginsOpen}
        onClose={() => setIsPluginsOpen(false)}
        plugins={plugins}
        onTogglePlugin={handleTogglePlugin}
        onOpenFolder={() => {
          setIsPluginsOpen(false);
          setIsExplorerOpen(true);
        }}
        onOpenCodeEditor={(p) => {
          setIsPluginsOpen(false);
          handleOpenCodeEditor(p);
        }}
        onCreateNewPlugin={() => {
          setIsPluginsOpen(false);
          setIsExplorerOpen(true);
        }}
      />

      <PluginExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        plugins={plugins}
        onSavePluginFiles={handleSavePluginFiles}
        onCreatePlugin={handleCreatePlugin}
        onDeletePlugin={handleDeletePlugin}
        initialSelectedPluginId={explorerPluginId}
      />

      <TauriStudioModal
        isOpen={isTauriStudioOpen}
        onClose={() => setIsTauriStudioOpen(false)}
        plugins={plugins}
      />

      <HotkeysHelpModal
        isOpen={isHotkeysOpen}
        onClose={() => setIsHotkeysOpen(false)}
      />
    </div>
  );
}
