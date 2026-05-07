import { useState, type FormEvent } from 'react';
import {
  Send,
  Play,
  Camera,
  Hash,
  Music2,
  AtSign,
  User,
  MessageSquare,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import type { Platform, AnalyzeRequest } from '../types';

interface InputFormProps {
  onSubmit: (data: AnalyzeRequest) => void;
  isSubmitting: boolean;
}

const PLATFORM_OPTIONS: { value: Platform; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'youtube',   label: 'YouTube',   icon: <Play className="w-4 h-4" />,    color: 'text-red-400' },
  { value: 'instagram', label: 'Instagram', icon: <Camera className="w-4 h-4" />,  color: 'text-pink-400' },
  { value: 'tiktok',    label: 'TikTok',    icon: <Music2 className="w-4 h-4" />,  color: 'text-cyan-400' },
  { value: 'twitter',   label: 'Twitter/X', icon: <AtSign className="w-4 h-4" />,  color: 'text-sky-400' },
];

export default function InputForm({ onSubmit, isSubmitting }: InputFormProps) {
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [username, setUsername] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !comment.trim()) return;
    onSubmit({
      platform,
      author_username: username.trim(),
      text_content: comment.trim(),
      creator_id: 'creator_001',
    });
  };

  const selectedPlatform = PLATFORM_OPTIONS.find(p => p.value === platform)!;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-full">
      {/* Section Label */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-cyan-400" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Interaction Input
        </span>
      </div>

      {/* Platform Selector */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="platform-select" className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <span className={selectedPlatform.color}>{selectedPlatform.icon}</span>
          Platform
        </label>
        <div className="relative">
          <select
            id="platform-select"
            value={platform}
            onChange={e => setPlatform(e.target.value as Platform)}
            className="input-field appearance-none pr-9 cursor-pointer"
          >
            {PLATFORM_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </div>
        {/* Platform pill indicators */}
        <div className="flex gap-2 mt-1">
          {PLATFORM_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPlatform(opt.value)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-200 ${
                platform === opt.value
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
              }`}
            >
              <span className={platform === opt.value ? 'text-violet-300' : opt.color}>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Username Input */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username-input" className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-violet-400" />
          Author Username
        </label>
        <input
          id="username-input"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="@creator_username"
          className="input-field"
          required
        />
      </div>

      {/* Comment Textarea */}
      <div className="flex flex-col gap-1.5 flex-1">
        <label htmlFor="comment-textarea" className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          Comment / Interaction
        </label>
        <textarea
          id="comment-textarea"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Paste the fan's comment here — e.g. 'Hey! I'd love to sponsor your next video, we make mechanical keyboards...'"
          className="input-field resize-none flex-1 min-h-[140px] leading-relaxed"
          required
        />
        <div className="flex justify-end">
          <span className={`text-[11px] ${comment.length > 800 ? 'text-amber-400' : 'text-slate-600'}`}>
            {comment.length} chars
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        id="analyze-btn"
        type="submit"
        disabled={isSubmitting || !username.trim() || !comment.trim()}
        className="btn-analyze w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-violet-600 to-violet-500 glow-violet disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all duration-300"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Analyze Interaction
          </>
        )}
      </button>
    </form>
  );
}
