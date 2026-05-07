import { useState } from 'react';
import { Check, X, ChevronDown, Tag, MessageSquare, Zap, ShieldAlert, AlertTriangle } from 'lucide-react';
import type { AnalyzeRequest, AnalyzeResponse, Platform } from '../../types';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SimResult {
  interaction: AnalyzeRequest;
  response: AnalyzeResponse | null;
  pending: boolean;
  error?: string;
  approved: boolean;
  rejected: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const FILTER_LABELS: Record<string, string> = {
  all: 'All',
  sponsorship: 'Sponsorship',
  fan_support: 'Fan Support',
  spam: 'Spam',
  security_threat: 'Security Threat',
};

const FILTER_COLORS: Record<string, { base: string; active: string; glow: string }> = {
  all:              { base: 'border-white/10 text-slate-400',    active: 'border-violet-500/60 text-violet-300 bg-violet-500/15',  glow: 'shadow-[0_0_14px_rgba(139,92,246,0.4)]' },
  sponsorship:      { base: 'border-white/10 text-slate-400',    active: 'border-violet-500/60 text-violet-300 bg-violet-500/15',  glow: 'shadow-[0_0_14px_rgba(139,92,246,0.4)]' },
  fan_support:      { base: 'border-white/10 text-slate-400',    active: 'border-emerald-500/60 text-emerald-300 bg-emerald-500/15', glow: 'shadow-[0_0_14px_rgba(52,211,153,0.4)]' },
  spam:             { base: 'border-white/10 text-slate-400',    active: 'border-orange-500/60 text-orange-300 bg-orange-500/15',  glow: 'shadow-[0_0_14px_rgba(251,146,60,0.4)]' },
  security_threat:  { base: 'border-white/10 text-slate-400',    active: 'border-red-500/60 text-red-300 bg-red-500/15',           glow: 'shadow-[0_0_14px_rgba(248,113,113,0.4)]' },
};

const INTENT_BADGE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  sponsorship:      { bg: 'bg-violet-500/20',  text: 'text-violet-300',  border: 'border-violet-500/40',  dot: 'bg-violet-400' },
  collaboration:    { bg: 'bg-cyan-500/20',    text: 'text-cyan-300',    border: 'border-cyan-500/40',    dot: 'bg-cyan-400' },
  fan_support:      { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', dot: 'bg-emerald-400' },
  praise:           { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40', dot: 'bg-emerald-400' },
  question:         { bg: 'bg-sky-500/20',     text: 'text-sky-300',     border: 'border-sky-500/40',     dot: 'bg-sky-400' },
  feedback:         { bg: 'bg-amber-500/20',   text: 'text-amber-300',   border: 'border-amber-500/40',   dot: 'bg-amber-400' },
  complaint:        { bg: 'bg-red-500/20',     text: 'text-red-300',     border: 'border-red-500/40',     dot: 'bg-red-400' },
  spam:             { bg: 'bg-orange-500/20',  text: 'text-orange-300',  border: 'border-orange-500/40',  dot: 'bg-orange-400' },
  security_threat:  { bg: 'bg-red-700/25',     text: 'text-red-300',     border: 'border-red-600/50',     dot: 'bg-red-500' },
  other:            { bg: 'bg-slate-500/20',   text: 'text-slate-300',   border: 'border-slate-500/40',   dot: 'bg-slate-400' },
};

const PLATFORM_BADGE: Record<Platform, string> = {
  youtube:   'bg-red-500/15 text-red-400 border-red-500/30',
  instagram: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  tiktok:    'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  twitter:   'bg-sky-500/15 text-sky-400 border-sky-500/30',
};

function normalizeIntent(intent: string): string {
  return intent.toLowerCase().replace(/[\s-]+/g, '_');
}

function getIntentStyle(intent: string) {
  const key = normalizeIntent(intent);
  return INTENT_BADGE[key] ?? INTENT_BADGE['other'];
}

function matchesFilter(intent: string, filter: string): boolean {
  if (filter === 'all') return true;
  const norm = normalizeIntent(intent);
  // fan_support bucket includes praise
  if (filter === 'fan_support') return norm === 'fan_support' || norm === 'praise';
  return norm === filter;
}

function getInitials(username: string) {
  return username.replace('@', '').slice(0, 2).toUpperCase();
}

function getAvatarGradient(username: string) {
  const g = ['from-violet-500 to-purple-700', 'from-cyan-500 to-blue-600', 'from-pink-500 to-rose-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600', 'from-sky-500 to-indigo-600'];
  return g[username.charCodeAt(1) % g.length];
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FilterBar({ results, activeFilter, onFilterChange }: { results: SimResult[]; activeFilter: string; onFilterChange: (f: string) => void; }) {
  const answered = results.filter((r) => r.response);
  const counts: Record<string, number> = {
    all: answered.length,
    sponsorship: answered.filter((r) => matchesFilter(r.response!.intent, 'sponsorship')).length,
    fan_support: answered.filter((r) => matchesFilter(r.response!.intent, 'fan_support')).length,
    spam: answered.filter((r) => matchesFilter(r.response!.intent, 'spam')).length,
    security_threat: answered.filter((r) => matchesFilter(r.response!.intent, 'security_threat')).length,
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(FILTER_LABELS).map((key) => {
        const isActive = activeFilter === key;
        const cfg = FILTER_COLORS[key];
        return (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`filter-pill px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              isActive ? `${cfg.active} ${cfg.glow}` : `${cfg.base} hover:bg-white/5`
            }`}
          >
            {FILTER_LABELS[key]}
            <span className="ml-1.5 opacity-70">({counts[key] ?? 0})</span>
          </button>
        );
      })}
    </div>
  );
}

function EntitiesDropdown({ tags }: { tags: string[] }) {
  const [open, setOpen] = useState(false);
  if (!tags || tags.length === 0) return null;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-colors"
      >
        <Tag className="w-3 h-3 text-cyan-400" />
        Entities <span className="text-cyan-400 font-bold">({tags.length})</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-30 p-2 glass-card border-white/10 rounded-xl min-w-[180px] shadow-xl shadow-black/50">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ result, onApprove, onReject }: { result: SimResult; onApprove: () => void; onReject: () => void; }) {
  const { interaction, response, pending, error, approved, rejected } = result;
  const isSponsorship = response && normalizeIntent(response.intent) === 'sponsorship';
  const isSecurityThreat = response && normalizeIntent(response.intent) === 'security_threat';
  const isSpam = response && normalizeIntent(response.intent) === 'spam';
  const intentStyle = response ? getIntentStyle(response.intent) : null;

  const cardBorder = isSecurityThreat
    ? 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]'
    : isSpam
    ? 'border-orange-500/20'
    : isSponsorship
    ? 'border-violet-500/25 shadow-[0_0_20px_rgba(139,92,246,0.12)]'
    : 'border-white/8';

  return (
    <div className={`results-enter glass-card p-4 flex flex-col gap-3 transition-all duration-300 ${cardBorder} ${rejected ? 'opacity-40 scale-[0.98]' : ''} ${approved ? 'border-emerald-500/30 shadow-[0_0_16px_rgba(52,211,153,0.12)]' : ''}`}>
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarGradient(interaction.author_username)} flex items-center justify-center text-white text-xs font-bold`}>
          {getInitials(interaction.author_username)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-violet-300">{interaction.author_username}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${PLATFORM_BADGE[interaction.platform]}`}>
              {interaction.platform.toUpperCase()}
            </span>
            {isSecurityThreat && <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
            {isSpam && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{interaction.text_content}</p>
        </div>
      </div>

      {/* Pending / error / result */}
      {pending && (
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <div className="w-4 h-4 border-2 border-violet-500/50 border-t-violet-400 rounded-full animate-spin" />
          Classifying…
        </div>
      )}
      {error && <p className="text-xs text-red-400 italic">⚠ {error}</p>}

      {response && intentStyle && (
        <>
          {/* Intent badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider">
              <Zap className="w-3 h-3" /> Intent
            </div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${intentStyle.bg} ${intentStyle.border} ${intentStyle.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${intentStyle.dot} animate-pulse`} />
              {response.intent}
            </div>
            {isSponsorship && <EntitiesDropdown tags={response.extracted_tags} />}
          </div>

          {/* Suggested Reply — Sponsorship only gets the full box */}
          {isSponsorship && response.suggested_reply && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider">
                <MessageSquare className="w-3 h-3" /> AI Suggested Reply
              </div>
              <div className="bg-slate-800/60 border border-violet-500/20 rounded-xl p-3 text-slate-200 text-xs leading-relaxed">
                {response.suggested_reply}
              </div>
            </div>
          )}

          {/* Approve / Reject — Sponsorship only */}
          {isSponsorship && (
            <div className="flex items-center gap-3 pt-1">
              <button
                id={`approve-${interaction.author_username}`}
                onClick={onApprove}
                disabled={approved || rejected}
                title="Approve"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  approved
                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.5)]'
                    : 'bg-white/5 border-white/15 text-slate-500 hover:bg-emerald-500/20 hover:border-emerald-400/60 hover:text-emerald-300 glow-green'
                } disabled:cursor-default`}
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                id={`reject-${interaction.author_username}`}
                onClick={onReject}
                disabled={approved || rejected}
                title="Reject"
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  rejected
                    ? 'bg-red-500/30 border-red-400 text-red-300 shadow-[0_0_16px_rgba(239,68,68,0.5)]'
                    : 'bg-white/5 border-white/15 text-slate-500 hover:bg-red-500/20 hover:border-red-400/60 hover:text-red-300 glow-red'
                } disabled:cursor-default`}
              >
                <X className="w-4 h-4" />
              </button>
              {approved && <span className="text-[11px] text-emerald-400 font-medium">Approved ✓</span>}
              {rejected && <span className="text-[11px] text-red-400 font-medium">Rejected ✗</span>}
            </div>
          )}

          {/* Non-sponsorship tags (compact) */}
          {!isSponsorship && response.extracted_tags && response.extracted_tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {response.extracted_tags.map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 border border-white/10 text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
interface ResultsDashboardProps {
  results: SimResult[];
  onApprove: (idx: number) => void;
  onReject: (idx: number) => void;
}

export default function ResultsDashboard({ results, onApprove, onReject }: ResultsDashboardProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const visibleResults = results.filter((r) => {
    if (!r.response) return true; // always show pending
    return matchesFilter(r.response.intent, activeFilter);
  });

  const answeredCount = results.filter((r) => r.response).length;
  const totalCount = results.length;

  return (
    <div className="flex flex-col gap-4">
      {/* Progress summary */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-300">
          {answeredCount < totalCount ? (
            <>{answeredCount} / {totalCount} classified <span className="text-violet-400 animate-pulse">· processing…</span></>
          ) : (
            <span className="text-emerald-400">✓ All {totalCount} interactions classified</span>
          )}
        </span>
      </div>

      <FilterBar results={results} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <div className="flex flex-col gap-3">
        {visibleResults.length === 0 ? (
          <div className="text-center py-10 text-slate-600 text-sm">No results for this filter yet.</div>
        ) : (
          visibleResults.map((result, idx) => {
            const globalIdx = results.indexOf(result);
            return (
              <ResultCard
                key={globalIdx}
                result={result}
                onApprove={() => onApprove(globalIdx)}
                onReject={() => onReject(globalIdx)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
