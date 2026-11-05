import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  FastForward, 
  Rewind, 
  Settings, 
  Check, 
  Sparkles,
  ShieldAlert,
  Info,
  Tv
} from 'lucide-react';
import { VideoItem, SponsorSegment, Plugin } from '../types';

interface VideoPlayerProps {
  video: VideoItem;
  plugins: Plugin[];
  isCinemaMode: boolean;
  onToggleCinemaMode: () => void;
  onOpenPlugins: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  plugins,
  isCinemaMode,
  onToggleCinemaMode,
  onOpenPlugins,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.duration || 180);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hudMessage, setHudMessage] = useState<string | null>(null);
  const [doubleClickFeedback, setDoubleClickFeedback] = useState<'left' | 'right' | null>(null);
  const [sponsorSkipToast, setSponsorSkipToast] = useState<{ segment: SponsorSegment; undoTime: number } | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSkippedSegmentRef = useRef<string | null>(null);

  const isSponsorBlockEnabled = plugins.some(p => p.id === 'sponsorblock' && p.enabled);
  const isCinemaGlowEnabled = plugins.some(p => p.id === 'cinema-ambient' && p.enabled);
  const isSpeedMemoryEnabled = plugins.some(p => p.id === 'speed-pitch-control' && p.enabled);

  // Load saved speed if speed memory plugin is on
  useEffect(() => {
    if (isSpeedMemoryEnabled) {
      const savedSpeed = localStorage.getItem('piped_preferred_speed');
      if (savedSpeed) {
        const speedVal = parseFloat(savedSpeed);
        setPlaybackSpeed(speedVal);
        if (videoRef.current) {
          videoRef.current.playbackRate = speedVal;
        }
      }
    }
  }, [isSpeedMemoryEnabled, video.id]);

  // Show transient HUD message
  const triggerHud = (message: string) => {
    setHudMessage(message);
    setTimeout(() => {
      setHudMessage(prev => (prev === message ? null : prev));
    }, 1200);
  };

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        triggerHud('Воспроизведение');
      }).catch(err => {
        console.warn('Автовоспроизведение заблокировано браузером:', err);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      triggerHud('Пауза');
    }
  }, []);

  // Seek relative seconds
  const seekRelative = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    triggerHud(seconds > 0 ? `+${seconds}с` : `${seconds}с`);
  }, [duration]);

  // Set volume
  const changeVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    if (videoRef.current) {
      videoRef.current.volume = clamped;
      videoRef.current.muted = clamped === 0;
      setIsMuted(clamped === 0);
    }
    triggerHud(`Громкость: ${Math.round(clamped * 100)}%`);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    triggerHud(newMuted ? 'Звук выключен' : `Громкость: ${Math.round(volume * 100)}%`);
  }, [volume]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => console.error(err));
    }
  }, []);

  // Set playback speed
  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    if (isSpeedMemoryEnabled) {
      localStorage.setItem('piped_preferred_speed', speed.toString());
    }
    triggerHud(`Скорость: ${speed}x`);
  };

  // Keyboard shortcut listener (as specified in Step 5 of prompt)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is writing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyT':
          e.preventDefault();
          onToggleCinemaMode();
          break;
        case 'ArrowLeft':
        case 'KeyJ':
          e.preventDefault();
          seekRelative(-5);
          break;
        case 'ArrowRight':
        case 'KeyL':
          e.preventDefault();
          seekRelative(5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          changeVolume(volume + 0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          changeVolume(volume - 0.05);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'Digit0':
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9': {
          e.preventDefault();
          const percent = parseInt(e.code.replace('Digit', ''), 10) / 10;
          if (videoRef.current) {
            const targetTime = duration * percent;
            videoRef.current.currentTime = targetTime;
            setCurrentTime(targetTime);
            triggerHud(`Переход: ${Math.round(percent * 100)}%`);
          }
          break;
        }
        case 'BracketLeft':
          e.preventDefault();
          changeSpeed(Math.max(0.5, playbackSpeed - 0.25));
          break;
        case 'BracketRight':
          e.preventDefault();
          changeSpeed(Math.min(2.5, playbackSpeed + 0.25));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, onToggleCinemaMode, seekRelative, changeVolume, toggleMute, volume, duration, playbackSpeed]);

  // Mouse wheel volume listener over container
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    changeVolume(volume + delta);
  };

  // Double click handling for rewind/forward
  const handleContainerDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.35) {
      seekRelative(-5);
      setDoubleClickFeedback('left');
      setTimeout(() => setDoubleClickFeedback(null), 700);
    } else if (clickX > width * 0.65) {
      seekRelative(5);
      setDoubleClickFeedback('right');
      setTimeout(() => setDoubleClickFeedback(null), 700);
    } else {
      toggleFullscreen();
    }
  };

  // Mouse movement hides controls after 2.5s
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  // Time update and SponsorBlock detection
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // SponsorBlock logic: if plugin enabled, check for sponsor segments
    if (isSponsorBlockEnabled && video.sponsorSegments && video.sponsorSegments.length > 0) {
      for (const segment of video.sponsorSegments) {
        const segKey = `${video.id}_${segment.start}_${segment.end}`;
        if (curr >= segment.start && curr < segment.end - 0.5) {
          if (lastSkippedSegmentRef.current !== segKey) {
            lastSkippedSegmentRef.current = segKey;
            const originalTime = curr;
            videoRef.current.currentTime = segment.end;
            setCurrentTime(segment.end);
            setSponsorSkipToast({ segment, undoTime: originalTime });
            setTimeout(() => setSponsorSkipToast(null), 5000);
          }
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || video.duration || 180);
      videoRef.current.volume = volume;
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  // Undo sponsor skip
  const undoSponsorSkip = () => {
    if (sponsorSkipToast && videoRef.current) {
      videoRef.current.currentTime = sponsorSkipToast.undoTime;
      setCurrentTime(sponsorSkipToast.undoTime);
      setSponsorSkipToast(null);
      triggerHud('Пропуск отменен');
    }
  };

  // Helper format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Right click native-like context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenuPos(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  return (
    <div className={`relative transition-all duration-300 ${isCinemaMode ? 'w-full max-w-6xl mx-auto my-2' : 'w-full'}`}>
      {/* Cinema Ambient Glow Plugin Effect */}
      {isCinemaGlowEnabled && (
        <div 
          className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-red-600/20 via-amber-500/15 to-purple-600/20 blur-2xl -z-10 pointer-events-none transition-opacity duration-700"
          style={{ opacity: isPlaying ? 0.8 : 0.3 }}
        />
      )}

      {/* Main Video Container */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onDoubleClick={handleContainerDoubleClick}
        onContextMenu={handleContextMenu}
        className="relative group aspect-video bg-black rounded-lg overflow-hidden select-none border border-slate-800 shadow-2xl cursor-pointer"
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnail}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
          className="w-full h-full object-contain"
          playsInline
        />

        {/* Center Play/Pause Overlay indicator when clicking */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform">
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Transient HUD Notification in Top Center */}
        {hudMessage && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-900/90 border border-slate-700/80 text-white text-xs font-medium rounded-full shadow-lg backdrop-blur-md pointer-events-none animate-in fade-in zoom-in-95 duration-150">
            {hudMessage}
          </div>
        )}

        {/* Double-click Rewind / Forward Ripple Animations */}
        {doubleClickFeedback === 'left' && (
          <div className="absolute left-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-white/90 bg-black/60 px-5 py-4 rounded-full pointer-events-none animate-ping duration-300">
            <Rewind className="w-8 h-8" />
            <span className="text-xs font-bold font-mono">-5 сек</span>
          </div>
        )}
        {doubleClickFeedback === 'right' && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 text-white/90 bg-black/60 px-5 py-4 rounded-full pointer-events-none animate-ping duration-300">
            <FastForward className="w-8 h-8" />
            <span className="text-xs font-bold font-mono">+5 сек</span>
          </div>
        )}

        {/* SponsorBlock Auto-Skip Banner Toast */}
        {sponsorSkipToast && (
          <div className="absolute bottom-18 left-4 right-4 sm:left-auto sm:right-4 max-w-md bg-emerald-950/95 border border-emerald-500/60 text-emerald-100 p-3 rounded-lg shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 z-30 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2.5 text-xs">
              <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-emerald-300 font-mono text-[11px] block">
                  [SponsorBlock Tauri Plugin]
                </span>
                <span className="text-emerald-100 line-clamp-1">
                  {sponsorSkipToast.segment.description}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                undoSponsorSkip();
              }}
              className="px-2.5 py-1 text-xs font-medium bg-emerald-800 hover:bg-emerald-700 text-white rounded transition-colors shrink-0"
            >
              Отменить
            </button>
          </div>
        )}

        {/* Video Control Bar */}
        <div 
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-4 pt-6 pb-2 transition-opacity duration-200 ${
            showControls || !isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Timeline / Scrubber Bar with SponsorBlock Segments */}
          <div className="relative group/scrubber h-3 flex items-center cursor-pointer mb-2">
            {/* Background Track */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden relative group-hover/scrubber:h-2 transition-all">
              {/* Progress Played */}
              <div 
                className="h-full bg-red-600 relative"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />

              {/* SponsorBlock Colored Segment Stripes */}
              {isSponsorBlockEnabled && video.sponsorSegments?.map((seg, idx) => {
                const leftPercent = (seg.start / (duration || 1)) * 100;
                const widthPercent = ((seg.end - seg.start) / (duration || 1)) * 100;
                const colorClass = 
                  seg.category === 'sponsor' ? 'bg-emerald-500/80' :
                  seg.category === 'intro' ? 'bg-cyan-500/80' :
                  seg.category === 'outro' ? 'bg-purple-500/80' : 'bg-amber-500/80';
                return (
                  <div
                    key={idx}
                    title={`[SponsorBlock] ${seg.description}`}
                    className={`absolute top-0 bottom-0 ${colorClass}`}
                    style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                  />
                );
              })}
            </div>

            {/* Click / Drag Target */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setCurrentTime(val);
                if (videoRef.current) {
                  videoRef.current.currentTime = val;
                }
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white text-xs">
            {/* Left Controls: Play, Seek, Volume, Timers */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-1 hover:text-red-400 transition-colors"
                title={isPlaying ? "Пауза (Space / K)" : "Воспроизведение (Space / K)"}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => seekRelative(-5)}
                className="p-1 hover:text-slate-300 transition-colors"
                title="Назад на 5 секунд (J / ←)"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={() => seekRelative(5)}
                className="p-1 hover:text-slate-300 transition-colors"
                title="Вперед на 5 секунд (L / →)"
              >
                <FastForward className="w-4 h-4" />
              </button>

              {/* Volume Slider with Hover */}
              <div className="flex items-center gap-1.5 group/volume">
                <button
                  onClick={toggleMute}
                  className="p-1 hover:text-slate-300 transition-colors"
                  title="Звук (M)"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 accent-red-600 bg-white/20 rounded-lg cursor-pointer"
                  title="Громкость (Колесико мыши или ↑ / ↓)"
                />
              </div>

              {/* Current / Duration Timer */}
              <div className="font-mono text-[11px] text-slate-300 ml-1">
                <span>{formatTime(currentTime)}</span>
                <span className="mx-1 text-slate-500">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Speed, Cinema, Fullscreen, Plugins shortcut */}
            <div className="flex items-center gap-2">
              {/* Playback speed selector */}
              <div className="relative group/speed">
                <button className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-mono transition-colors">
                  {playbackSpeed}x
                </button>
                <div className="absolute bottom-full right-0 mb-1 hidden group-hover/speed:flex flex-col bg-slate-900 border border-slate-700 rounded shadow-xl py-1 z-40 min-w-20">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`px-3 py-1 text-left text-xs font-mono hover:bg-slate-800 flex items-center justify-between ${
                        playbackSpeed === s ? 'text-red-400 font-bold' : 'text-slate-200'
                      }`}
                    >
                      <span>{s}x</span>
                      {playbackSpeed === s && <Check className="w-3 h-3 text-red-400" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cinema Mode Toggle */}
              <button
                onClick={onToggleCinemaMode}
                className={`p-1.5 rounded transition-colors ${isCinemaMode ? 'text-red-400 bg-white/10' : 'hover:text-slate-300'}`}
                title="Режим кинотеатра (T)"
              >
                <Tv className="w-4 h-4" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-1.5 rounded hover:text-slate-300 transition-colors"
                title="Полный экран (F)"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Desktop Context Menu */}
      {contextMenuPos && (
        <div 
          className="fixed bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-1.5 z-50 text-xs text-slate-200 min-w-56 backdrop-blur-md"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-[10px] uppercase font-semibold tracking-wider text-slate-400 border-b border-slate-800">
            Tauri WebView2 Player
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(video.videoUrl);
              triggerHud('Ссылка на видео скопирована');
              setContextMenuPos(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-slate-800 flex items-center gap-2"
          >
            <span>Копировать URL видео</span>
          </button>
          <button
            onClick={() => {
              const urlWithTime = `${video.videoUrl}#t=${Math.floor(currentTime)}`;
              navigator.clipboard.writeText(urlWithTime);
              triggerHud(`URL с таймкодом ${formatTime(currentTime)} скопирован`);
              setContextMenuPos(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-slate-800 flex items-center gap-2"
          >
            <span>Копировать URL с таймкодом ({formatTime(currentTime)})</span>
          </button>
          <button
            onClick={() => {
              if (videoRef.current) videoRef.current.loop = !videoRef.current.loop;
              triggerHud(videoRef.current?.loop ? 'Зацикливание включено' : 'Зацикливание выключено');
              setContextMenuPos(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-slate-800 flex items-center justify-between"
          >
            <span>Повтор видео (Loop)</span>
            {videoRef.current?.loop && <Check className="w-3.5 h-3.5 text-red-400" />}
          </button>
          <div className="h-px bg-slate-800 my-1" />
          <button
            onClick={() => {
              onOpenPlugins();
              setContextMenuPos(null);
            }}
            className="w-full px-3 py-1.5 text-left hover:bg-slate-800 flex items-center gap-2 text-red-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Настройки плагинов...</span>
          </button>
        </div>
      )}
    </div>
  );
};
