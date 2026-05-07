import { Zap, Sparkles, FlaskConical } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-md bg-white/[0.03]">
      {/* Logo + Brand */}
      <div className="flex items-center gap-3">
        {/* Hexagonal icon */}
        <div className="relative flex items-center justify-center w-10 h-10">
          <svg viewBox="0 0 40 40" className="w-10 h-10 absolute" fill="none">
            <polygon
              points="20,2 36,11 36,29 20,38 4,29 4,11"
              stroke="url(#hex-grad)"
              strokeWidth="1.5"
              fill="rgba(139,92,246,0.12)"
            />
            <defs>
              <linearGradient id="hex-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <Zap className="w-4 h-4 text-violet-400 relative z-10" strokeWidth={2.5} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-tight leading-none">
            <span className="text-white">Veel</span>
            <span className="ml-1.5 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 text-glow-violet">
              ICE-Hub
            </span>
          </h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-0.5">
            Interaction Classification Engine
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-1">
        <a
          href="/"
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            window.location.pathname === '/'
              ? 'text-violet-300 bg-violet-500/15'
              : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          Analyze
        </a>
        <a
          href="/simulation"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            window.location.pathname === '/simulation'
              ? 'text-cyan-300 bg-cyan-500/15'
              : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Simulation
        </a>
      </nav>

      {/* Right side badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-white/10">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-xs font-medium text-slate-300">AI-Powered</span>
        {/* Pulsing live dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
      </div>
    </header>
  );
}
