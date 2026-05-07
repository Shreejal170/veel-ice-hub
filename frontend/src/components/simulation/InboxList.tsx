import type { AnalyzeRequest, Platform } from '../../types';

const PLATFORM_BADGE: Record<Platform, { label: string; cls: string }> = {
  youtube:   { label: 'YT',  cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  instagram: { label: 'IG',  cls: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  tiktok:    { label: 'TT',  cls: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  twitter:   { label: 'X',   cls: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
};

function getInitials(username: string) {
  const clean = username.replace('@', '');
  return clean.slice(0, 2).toUpperCase();
}

function getAvatarColor(username: string) {
  const colors = [
    'from-violet-500 to-purple-700',
    'from-cyan-500 to-blue-600',
    'from-pink-500 to-rose-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-sky-500 to-indigo-600',
  ];
  const idx = username.charCodeAt(1) % colors.length;
  return colors[idx];
}

interface InboxListProps {
  interactions: AnalyzeRequest[];
  activePlatform: Platform;
}

export default function InboxList({ interactions, activePlatform }: InboxListProps) {
  const filtered = interactions.filter((i) => i.platform === activePlatform);
  const badge = PLATFORM_BADGE[activePlatform];

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-600 gap-2">
        <span className="text-4xl">📭</span>
        <p className="text-sm">No interactions for this platform</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Incoming Interactions
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls}`}>
          {badge.label} · {filtered.length} comments
        </span>
      </div>

      {filtered.map((item, idx) => (
        <div
          key={idx}
          className="stagger-in flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-150"
          style={{ animationDelay: `${idx * 40}ms` }}
        >
          {/* Avatar */}
          <div
            className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(item.author_username)} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
          >
            {getInitials(item.author_username)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-violet-300 truncate">
                {item.author_username}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badge.cls} flex-shrink-0`}>
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
              {item.text_content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
