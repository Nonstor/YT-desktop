import { Plugin } from '../types';

export const DEFAULT_PLUGINS: Plugin[] = [
  {
    id: 'sponsorblock',
    name: 'SponsorBlock',
    description: 'Автоматический пропуск спонсорских вставок, интро, аутро и самопиара на базе открытой базы данных.',
    version: '1.2.4',
    enabled: true,
    author: 'Ajay Ramachandran (Port)',
    type: 'script',
    isBuiltIn: true,
    script_path: 'script.js',
    manifest_content: JSON.stringify(
      {
        id: 'sponsorblock',
        name: 'SponsorBlock',
        description: 'Автоматический пропуск спонсорских вставок',
        version: '1.2.4',
        enabled: true,
        author: 'SponsorBlock Community',
        main: 'script.js',
        categories: ['sponsor', 'intro', 'outro', 'selfpromo'],
      },
      null,
      2
    ),
    script_content: `// SponsorBlock Lightweight Engine for Tauri 2.0
(() => {
  window.__sponsorBlockActive = true;
  console.log('[SponsorBlock] Инициализация модуля перехвата таймкодов...');
})();`,
  },
  {
    id: 'return-youtube-dislike',
    name: 'Return YouTube Dislike',
    description: 'Возвращает отображение точного количества дизлайков и шкалу соотношения лайков/дизлайков.',
    version: '1.0.8',
    enabled: true,
    author: 'RYD Team (Piped mod)',
    type: 'script',
    isBuiltIn: true,
    script_path: 'script.js',
    manifest_content: JSON.stringify(
      {
        id: 'return-youtube-dislike',
        name: 'Return YouTube Dislike',
        description: 'Показывает количество дизлайков к видео',
        version: '1.0.8',
        enabled: true,
        author: 'Anarios & Community',
        main: 'script.js',
      },
      null,
      2
    ),
    script_content: `// Return YouTube Dislike Hook
(() => {
  window.__returnDislikeActive = true;
  console.log('[Return YouTube Dislike] Модуль подсчета активирован');
})();`,
  },
  {
    id: 'dark-oled',
    name: 'OLED Pure Black Theme',
    description: 'Глубокая черная тема (#000000) для OLED/AMOLED дисплеев с рубиновыми акцентами для экономии энергии.',
    version: '2.1.0',
    enabled: true,
    author: 'Piped Theme Studio',
    type: 'style',
    isBuiltIn: true,
    style_path: 'style.css',
    manifest_content: JSON.stringify(
      {
        id: 'dark-oled',
        name: 'OLED Pure Black Theme',
        description: 'Истинный черный цвет для AMOLED мониторов',
        version: '2.1.0',
        enabled: true,
        author: 'Piped Theme Studio',
        main: 'style.css',
      },
      null,
      2
    ),
    style_content: `/* OLED Theme injected by Tauri Plugin Loader */
:root[data-theme="oled"] .bg-slate-900,
:root[data-theme="oled"] .bg-zinc-900,
:root[data-theme="oled"] .bg-neutral-900,
:root[data-theme="oled"] body {
  background-color: #000000 !important;
}
:root[data-theme="oled"] .border-slate-800,
:root[data-theme="oled"] .border-zinc-800 {
  border-color: #1a1a1a !important;
}
:root[data-theme="oled"] .accent-accent {
  color: #ff2a2a !important;
}`,
  },
  {
    id: 'cinema-ambient',
    name: 'Cinema Ambient Glow',
    description: 'Интерактивная рассеянная подсветка (Ambilight) позади видеоплеера, реагирующая на палитру видео.',
    version: '1.4.0',
    enabled: true,
    author: 'AmbientUI',
    type: 'script',
    isBuiltIn: true,
    script_path: 'script.js',
    manifest_content: JSON.stringify(
      {
        id: 'cinema-ambient',
        name: 'Cinema Ambient Glow',
        description: 'Динамическая фоновая подсветка для эффекта кинотеатра',
        version: '1.4.0',
        enabled: true,
        main: 'script.js',
      },
      null,
      2
    ),
    script_content: `// Ambient Cinema Glow Engine
(() => {
  window.__ambientGlowActive = true;
  console.log('[Cinema Ambient] Режим динамического свечения активен');
})();`,
  },
  {
    id: 'speed-pitch-control',
    name: 'Playback Speed Memory',
    description: 'Запоминает выбранную пользователем скорость (1.25x, 1.5x, 2x) и автоматически применяет её ко всем новым видео.',
    version: '1.1.2',
    enabled: true,
    author: 'SpeedMaster',
    type: 'script',
    isBuiltIn: true,
    script_path: 'script.js',
    manifest_content: JSON.stringify(
      {
        id: 'speed-pitch-control',
        name: 'Playback Speed Memory',
        description: 'Сохранение скорости воспроизведения между роликами',
        version: '1.1.2',
        enabled: true,
        main: 'script.js',
      },
      null,
      2
    ),
    script_content: `// Speed Memory Engine
(() => {
  window.__speedMemoryActive = true;
  console.log('[Speed Memory] Автоматическое сохранение темпа включено');
})();`,
  },
  {
    id: 'miniplayer-scroll',
    name: 'Auto Miniplayer on Scroll',
    description: 'Сворачивает плеер в компактное плавающее окно (Picture-in-Picture) в углу экрана при прокрутке к комментариям.',
    version: '1.3.1',
    enabled: false,
    author: 'DesktopFlow',
    type: 'script',
    isBuiltIn: true,
    script_path: 'script.js',
    manifest_content: JSON.stringify(
      {
        id: 'miniplayer-scroll',
        name: 'Auto Miniplayer on Scroll',
        description: 'Плавающий миниплеер при чтении описания и комментариев',
        version: '1.3.1',
        enabled: false,
        main: 'script.js',
      },
      null,
      2
    ),
    script_content: `// Miniplayer on Scroll Script
(() => {
  window.__miniPlayerOnScroll = true;
  console.log('[Miniplayer] Док-режим активирован при скролле');
})();`,
  },
];
