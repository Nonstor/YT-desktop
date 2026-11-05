import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, CornerDownRight, Send } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  text: string;
  likes: number;
}

const SAMPLE_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'Rustacean_Dev',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    timeAgo: '4 часа назад',
    text: 'Перешел с официального приложения YouTube на связку Tauri v2 + Piped. Разница колоссальная: память упала с 800 МБ до 42 МБ! А система плагинов через папку plugins/ позволяет писать моды буквально на коленке.',
    likes: 412,
  },
  {
    id: 'c2',
    author: 'LinuxEnjoyer',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    timeAgo: '1 день назад',
    text: 'Огромный плюс — SponsorBlock встроен на уровне хуков. Никаких раздражающих интеграций VPN и курсов посреди видео, все плавно скипается.',
    likes: 189,
  },
  {
    id: 'c3',
    author: 'FrontEndNinja',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    timeAgo: '2 дня назад',
    text: 'Управление мышью (громкость скроллом) и клавишами J/K/L — это именно то, чего всегда не хватает в браузерной версии. Спасибо за открытый код!',
    likes: 95,
  },
];

export const CommentsSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(SAMPLE_COMMENTS);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj: Comment = {
      id: Date.now().toString(),
      author: 'Вы (Локальный пользователь)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      timeAgo: 'Только что',
      text: newComment.trim(),
      likes: 1,
    };

    setComments([commentObj, ...comments]);
    setNewComment('');
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-800">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
        <MessageSquare className="w-4 h-4 text-slate-400" />
        <span>Комментарии ({comments.length})</span>
      </div>

      {/* New Comment Input */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 font-semibold text-xs flex items-center justify-center shrink-0">
          U
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            placeholder="Оставьте комментарий к видео..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          {newComment.trim() && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>Отправить</span>
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-4 pt-2">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 text-xs">
            <img
              src={c.avatar}
              alt={c.author}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700/80"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">{c.author}</span>
                <span className="text-[11px] text-slate-400">{c.timeAgo}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{c.text}</p>
              <div className="flex items-center gap-3 pt-1 text-slate-400 text-[11px]">
                <button className="flex items-center gap-1 hover:text-white transition-colors">
                  <ThumbsUp className="w-3 h-3" />
                  <span className="font-mono">{c.likes}</span>
                </button>
                <button className="hover:text-white transition-colors">Ответить</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
