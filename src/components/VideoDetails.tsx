import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Download, 
  Bookmark, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  CornerDownRight
} from 'lucide-react';
import { VideoItem, Plugin } from '../types';

interface VideoDetailsProps {
  video: VideoItem;
  plugins: Plugin[];
  onOpenPlugins: () => void;
}

export const VideoDetails: React.FC<VideoDetailsProps> = ({
  video,
  plugins,
  onOpenPlugins,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const isReturnDislikeEnabled = plugins.some(p => p.id === 'return-youtube-dislike' && p.enabled);
  const isSponsorBlockEnabled = plugins.some(p => p.id === 'sponsorblock' && p.enabled);

  const totalVotes = video.likes + video.dislikes;
  const likePercentage = Math.round((video.likes / totalVotes) * 100);

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
      setIsDisliked(false);
    }
  };

  const handleDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      setIsLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(video.videoUrl);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + ' млн';
    if (num >= 1000) return (num / 1000).toFixed(1) + ' тыс';
    return num.toLocaleString('ru-RU');
  };

  return (
    <div className="space-y-4 text-slate-100">
      {/* Title */}
      <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-100 leading-snug">
        {video.title}
      </h1>

      {/* Primary Row: Channel info + Actions (Like, Dislike, Share) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        {/* Channel Info */}
        <div className="flex items-center gap-3">
          <img
            src={video.uploaderAvatar}
            alt={video.uploaderName}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover border border-slate-700/80 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-sm text-slate-200">
              <span>{video.uploaderName}</span>
              {video.uploaderVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 fill-slate-400/20" />
              )}
            </div>
            <div className="text-xs text-slate-400">
              128 тыс. подписчиков
            </div>
          </div>

          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`ml-3 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors shadow-sm ${
              isSubscribed
                ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                : 'bg-white text-slate-900 hover:bg-slate-200'
            }`}
          >
            {isSubscribed ? 'Вы подписаны' : 'Подписаться'}
          </button>
        </div>

        {/* Action Buttons with Return YouTube Dislike & Ratio Bar */}
        <div className="flex items-center gap-2">
          {/* Like / Dislike Segmented Pill */}
          <div className="flex flex-col">
            <div className="flex items-center bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-full overflow-hidden text-xs transition-colors">
              <button
                onClick={handleLike}
                className={`px-3 py-1.5 flex items-center gap-1.5 hover:text-white transition-colors ${
                  isLiked ? 'text-red-400 font-semibold' : 'text-slate-200'
                }`}
                title="Нравится"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="font-mono tabular-nums">
                  {formatNumber(video.likes + (isLiked ? 1 : 0))}
                </span>
              </button>

              <div className="w-px h-4 bg-slate-700" />

              <button
                onClick={handleDislike}
                className={`px-3 py-1.5 flex items-center gap-1.5 hover:text-white transition-colors ${
                  isDisliked ? 'text-red-400 font-semibold' : 'text-slate-200'
                }`}
                title={isReturnDislikeEnabled ? "Не нравится (плагин RYD активен)" : "Не нравится"}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                {isReturnDislikeEnabled ? (
                  <span className="font-mono tabular-nums text-slate-300">
                    {formatNumber(video.dislikes + (isDisliked ? 1 : 0))}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Дизлайк</span>
                )}
              </button>
            </div>

            {/* Return YouTube Dislike Ratio Bar */}
            {isReturnDislikeEnabled && (
              <div 
                className="w-full h-1 bg-slate-700/80 rounded-full mt-1 overflow-hidden"
                title={`Рейтинг одобрения: ${likePercentage}% (${video.likes} / ${video.dislikes})`}
              >
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${likePercentage}%` }}
                />
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{copyFeedback ? 'Скопировано!' : 'Поделиться'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Description Box */}
      <div className="p-3.5 rounded-xl bg-slate-800/50 hover:bg-slate-800/70 border border-slate-800 transition-colors text-xs">
        <div className="flex items-center gap-3 font-semibold text-slate-300 mb-2">
          <span>{formatNumber(video.views)} просмотров</span>
          <span aria-hidden="true">·</span>
          <span>{video.uploadedDate}</span>
          <span aria-hidden="true">·</span>
          <span className="text-red-400 font-medium">#{video.category}</span>
        </div>

        <p className={`text-slate-300 leading-relaxed whitespace-pre-line ${isDescExpanded ? '' : 'line-clamp-2'}`}>
          {video.description}
        </p>

        {/* SponsorBlock segments info if present */}
        {isSponsorBlockEnabled && video.sponsorSegments && video.sponsorSegments.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldAlert className="w-3 h-3" />
              SponsorBlock:
            </span>
            {video.sponsorSegments.map((seg, i) => (
              <span 
                key={i}
                className="px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 text-[10px] font-mono"
              >
                {Math.floor(seg.start / 60)}:{Math.floor(seg.start % 60).toString().padStart(2, '0')} - {Math.floor(seg.end / 60)}:{Math.floor(seg.end % 60).toString().padStart(2, '0')} ({seg.category})
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="mt-2 text-slate-400 hover:text-white font-medium flex items-center gap-1"
        >
          <span>{isDescExpanded ? 'Свернуть' : 'Ещё'}</span>
          {isDescExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
