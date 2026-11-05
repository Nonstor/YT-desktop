import React from 'react';
import { Play, Sparkles, MessageSquare } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoSidebarProps {
  videos: VideoItem[];
  currentVideoId: string;
  onSelectVideo: (video: VideoItem) => void;
}

export const VideoSidebar: React.FC<VideoSidebarProps> = ({
  videos,
  currentVideoId,
  onSelectVideo,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + ' млн';
    if (views >= 1000) return (views / 1000).toFixed(0) + ' тыс.';
    return views.toString();
  };

  const relatedVideos = videos.filter(v => v.id !== currentVideoId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span>Следующие видео (Piped Feed)</span>
        <span className="text-[11px] font-mono text-slate-400">Автовоспроизведение</span>
      </div>

      <div className="space-y-3">
        {relatedVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video)}
            className="group flex gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            {/* Thumbnail with duration */}
            <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/60">
              <img
                src={video.thumbnail}
                alt={video.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-white font-mono text-[10px] font-medium">
                {formatTime(video.duration)}
              </span>
              {video.sponsorSegments && video.sponsorSegments.length > 0 && (
                <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 font-mono text-[9px]">
                  SB
                </span>
              )}
            </div>

            {/* Video Meta */}
            <div className="flex flex-col justify-start text-xs min-w-0">
              <h3 className="font-medium text-slate-200 line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
                {video.title}
              </h3>
              <div className="text-[11px] text-slate-400 mt-1">
                {video.uploaderName}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                <span>{formatViews(video.views)} просмотров</span>
                <span className="mx-1">·</span>
                <span>{video.uploadedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
