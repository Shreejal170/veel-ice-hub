import { useState } from 'react';
import { Copy, Check, Tag, MessageSquare, Zap } from 'lucide-react';
import type { AnalyzeResponse } from '../types';

interface ResultsCardProps {
  data: AnalyzeResponse;
}

// Intent → color mapping
const INTENT_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  sponsorship:   { bg: 'bg-violet-500/20', border: 'border-violet-500/40', text: 'text-violet-300', dot: 'bg-violet-400' },
  collaboration: { bg: 'bg-cyan-500/20',   border: 'border-cyan-500/40',   text: 'text-cyan-300',   dot: 'bg-cyan-400' },
  feedback:      { bg: 'bg-amber-500/20',  border: 'border-amber-500/40',  text: 'text-amber-300',  dot: 'bg-amber-400' },
  question:      { bg: 'bg-sky-500/20',    border: 'border-sky-500/40',    text: 'text-sky-300',    dot: 'bg-sky-400' },
  complaint:     { bg: 'bg-red-500/20',    border: 'border-red-500/40',    text: 'text-red-300',    dot: 'bg-red-400' },
  praise:        { bg: 'bg-emerald-500/20',border: 'border-emerald-500/40',text: 'text-emerald-300',dot: 'bg-emerald-400' },
  other:         { bg: 'bg-slate-500/20',  border: 'border-slate-500/40',  text: 'text-slate-300',  dot: 'bg-slate-400' },
};

function getIntentStyle(intent: string) {
  const key = intent.toLowerCase();
  return INTENT_COLORS[key] ?? INTENT_COLORS['other'];
}

export default function ResultsCard({ data }: ResultsCardProps) {
  const [copied, setCopied] = useState(false);
  const intentStyle = getIntentStyle(data.intent);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data.suggested_reply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: select text
    }
  };

  return (
    <div className="flex flex-col gap-5 results-enter">
      {/* Section label */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-violet-500" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          AI Analysis
        </span>
        <span className="ml-auto text-[10px] text-slate-600 font-mono">#{data.id}</span>
      </div>

      {/* Intent Badge */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Detected Intent</span>
        </div>
        <div
          className={`inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full text-sm font-semibold border ${intentStyle.bg} ${intentStyle.border} ${intentStyle.text}`}
        >
          <span className={`w-2 h-2 rounded-full ${intentStyle.dot} animate-pulse`} />
          {data.intent}
        </div>
      </div>

      {/* Suggested Reply — only render if the API returned text */}
      {data.suggested_reply && <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Reply</span>
        </div>
        <div className="relative glass-card p-4 border-violet-500/20">
          <p className="text-sm text-slate-200 leading-relaxed pr-8">
            {data.suggested_reply}
          </p>
          {/* Copy button */}
          <button
            id="copy-reply-btn"
            onClick={handleCopy}
            title="Copy to clipboard"
            className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all duration-200 ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
        {copied && (
          <p className="text-[11px] text-emerald-400 text-right animate-pulse">
            ✓ Copied to clipboard
          </p>
        )}
      </div>}

      {/* Extracted Tags */}
      {data.extracted_tags && data.extracted_tags.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Extracted Tags
              <span className="ml-1.5 text-slate-700">({data.extracted_tags.length})</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.extracted_tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/20 transition-colors duration-150 cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
