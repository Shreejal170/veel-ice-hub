import { useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';

const STAGES = [
  'Sending interactions to AI engine…',
  'Classifying intents…',
  'Extracting entities & tags…',
  'Drafting suggested replies…',
  'Finalising results…',
];

export default function ScanAnimation() {
  const [dots, setDots] = useState('');
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const dotTimer = setInterval(
      () => setDots((d) => (d.length >= 3 ? '' : d + '.')),
      400
    );
    const stageTimer = setInterval(
      () => setStageIdx((i) => (i + 1) % STAGES.length),
      1800
    );
    return () => {
      clearInterval(dotTimer);
      clearInterval(stageTimer);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-20 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-7"
      style={{ background: 'rgba(2, 6, 23, 0.90)', backdropFilter: 'blur(10px)' }}
    >
      {/* Sweeping scan line */}
      <div className="scan-line" />

      {/* Concentric ring pulse */}
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-ping" />
        <div
          className="absolute inset-2 rounded-full border border-cyan-400/25 animate-ping"
          style={{ animationDelay: '0.5s' }}
        />
        <div
          className="absolute inset-4 rounded-full border border-violet-300/15 animate-ping"
          style={{ animationDelay: '1s' }}
        />
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.7)]">
          <BrainCircuit className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Status */}
      <div className="text-center flex flex-col items-center gap-2">
        <p className="text-sm font-bold tracking-[0.12em] text-violet-300 uppercase">
          Batch AI Analysis{dots}
        </p>
        <p className="text-xs text-slate-400 transition-all duration-500 min-h-[1.2em]">
          {STAGES[stageIdx]}
        </p>
      </div>

      {/* Indeterminate shimmer bar */}
      <div className="w-64 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
        <div
          className="h-full w-1/3 rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500"
          style={{ animation: 'shimmer-slide 1.6s ease-in-out infinite' }}
        />
      </div>
    </div>
  );
}
