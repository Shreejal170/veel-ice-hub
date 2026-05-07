import { Play, Radio } from 'lucide-react';
import type { Platform } from '../../types';

const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; activeColor: string; glow: string }> = {
  youtube:   { label: 'YouTube',   color: 'text-slate-400', activeColor: 'text-red-400',    glow: 'shadow-[0_0_16px_rgba(248,113,113,0.5)]' },
  instagram: { label: 'Instagram', color: 'text-slate-400', activeColor: 'text-pink-400',   glow: 'shadow-[0_0_16px_rgba(244,114,182,0.5)]' },
  tiktok:    { label: 'TikTok',    color: 'text-slate-400', activeColor: 'text-cyan-400',   glow: 'shadow-[0_0_16px_rgba(34,211,238,0.5)]' },
  twitter:   { label: 'Twitter/X', color: 'text-slate-400', activeColor: 'text-sky-400',    glow: 'shadow-[0_0_16px_rgba(56,189,248,0.5)]' },
};

interface ContextSectionProps {
  activePlatform: Platform;
  onPlatformChange: (p: Platform) => void;
  disabled: boolean;
}

export default function ContextSection({ activePlatform, onPlatformChange, disabled }: ContextSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Video Thumbnail */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/10"
           style={{ aspectRatio: '16/5', background: 'linear-gradient(135deg, rgba(139,92,246,0.25) 0%, rgba(34,211,238,0.15) 50%, rgba(99,102,241,0.20) 100%)' }}>
        {/* Animated mesh blobs */}
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="absolute top-[-30%] left-[-10%] w-64 h-64 rounded-full bg-violet-600/30 blur-3xl animate-pulse" />
        <div className="absolute bottom-[-30%] right-[-5%] w-56 h-56 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Scan-line overlay */}
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(139,92,246,0.3) 3px, rgba(139,92,246,0.3) 4px)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400" />
            </span>
            <span className="text-xs font-bold tracking-[0.2em] text-red-400 uppercase">Live Feed</span>
          </div>

          <div className="w-14 h-14 rounded-full glass-card border-white/20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform glow-violet">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>

          <p className="text-sm text-slate-300 font-medium tracking-wide">
            Creator Dashboard — Interaction Feed
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <Radio className="w-3 h-3" /> Monitoring 4 platforms in real-time
          </p>
        </div>
      </div>

      {/* Platform Tab Switcher */}
      <div className="flex gap-2 p-1 glass-card rounded-xl border-white/10">
        {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((platform) => {
          const cfg = PLATFORM_CONFIG[platform];
          const isActive = platform === activePlatform;
          return (
            <button
              key={platform}
              onClick={() => !disabled && onPlatformChange(platform)}
              disabled={disabled}
              className={`platform-tab flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? `bg-white/10 ${cfg.activeColor} ${cfg.glow} border border-white/15`
                  : `${cfg.color} hover:text-slate-200 hover:bg-white/5 border border-transparent`
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
