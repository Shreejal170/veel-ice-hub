import { Bot, ArrowRight } from 'lucide-react';

export default function IdleState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 py-12 text-center float-anim">
      {/* Icon orb */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 180deg, rgba(139,92,246,0.15), rgba(34,211,238,0.10), rgba(139,92,246,0.15))',
            border: '1px solid rgba(139,92,246,0.25)',
            boxShadow: '0 0 40px rgba(139,92,246,0.15)',
          }}
        >
          <Bot className="w-9 h-9 text-slate-500" strokeWidth={1.5} />
        </div>
        {/* Orbiting ring */}
        <div
          className="absolute inset-0 rounded-full border border-dashed border-violet-500/20"
          style={{ animation: 'spin 12s linear infinite' }}
        />
        {/* Glow dots */}
        <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-violet-400 blur-[2px] opacity-60" />
        <span className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[2px] opacity-50" />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold text-slate-300">Awaiting Comment</h2>
        <p className="text-sm text-slate-600 max-w-[220px] leading-relaxed">
          Fill in the form and press{' '}
          <span className="text-violet-400 font-medium">Analyze Interaction</span> to get AI-powered insights.
        </p>
      </div>

      {/* Arrow hint */}
      <div className="flex items-center gap-1.5 text-xs text-slate-700">
        <ArrowRight className="w-3.5 h-3.5" />
        Results will appear here
      </div>

      {/* Decorative capabilities list */}
      <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
        {[
          { label: 'Intent Detection', color: 'text-violet-400', dot: 'bg-violet-400' },
          { label: 'Suggested Reply', color: 'text-cyan-400',   dot: 'bg-cyan-400' },
          { label: 'Tag Extraction',   color: 'text-emerald-400',dot: 'bg-emerald-400' },
        ].map(({ label, color, dot }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg glass-card border-white/5 text-left"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
            <span className={`text-xs font-medium ${color}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
