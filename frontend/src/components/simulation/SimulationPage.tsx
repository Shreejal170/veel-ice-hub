import { useState, useCallback } from 'react';
import { BrainCircuit, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';
import { analyzeBatch } from '../../api';
import { SIMULATION_INTERACTIONS } from '../../data/simulationData';
import type { Platform } from '../../types';
import ContextSection from './ContextSection';
import InboxList from './InboxList';
import ScanAnimation from './ScanAnimation';
import ResultsDashboard, { type SimResult } from './ResultsDashboard';

type Phase = 'inbox' | 'scanning' | 'results' | 'error';

export default function SimulationPage() {
  const [phase, setPhase] = useState<Phase>('inbox');
  const [activePlatform, setActivePlatform] = useState<Platform>('youtube');
  const [results, setResults] = useState<SimResult[]>([]);
  const [batchError, setBatchError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    setBatchError(null);
    setPhase('scanning');

    // Minimum 2 s scan animation runs in parallel with the API call
    const minDelay = new Promise<void>((res) => setTimeout(res, 2000));

    try {
      const [responses] = await Promise.all([
        analyzeBatch(SIMULATION_INTERACTIONS),
        minDelay,
      ]);

      // Merge each interaction with its API response
      const merged: SimResult[] = SIMULATION_INTERACTIONS.map((interaction, i) => ({
        interaction,
        response: responses[i] ?? null,
        pending: false,
        approved: false,
        rejected: false,
      }));

      setResults(merged);
      setPhase('results');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error during batch analysis.';
      setBatchError(msg);
      setPhase('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setPhase('inbox');
    setResults([]);
    setBatchError(null);
  }, []);

  const handleApprove = useCallback((idx: number) => {
    setResults((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], approved: true, rejected: false };
      return next;
    });
  }, []);

  const handleReject = useCallback((idx: number) => {
    setResults((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], rejected: true, approved: false };
      return next;
    });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      <div className="bg-mesh" aria-hidden="true" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Page header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-violet-400" />
              Simulation Sandbox
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {SIMULATION_INTERACTIONS.length} synthetic interactions · Single-batch AI analysis
            </p>
          </div>
          {phase !== 'inbox' && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card border-white/10 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>

        <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto w-full flex flex-col gap-6">
          {/* Context Section — always visible; tabs disabled while scanning/results */}
          <ContextSection
            activePlatform={activePlatform}
            onPlatformChange={setActivePlatform}
            disabled={phase !== 'inbox'}
          />

          {/* Main panel */}
          <div className="relative glass-card p-5 glow-violet" style={{ minHeight: '480px' }}>
            {/* ── INBOX ── */}
            {phase === 'inbox' && (
              <div className="flex flex-col gap-4">
                {/* Panel header: label + CTA button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-400 to-cyan-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      Comment Inbox
                    </span>
                  </div>
                  <button
                    id="simulate-analyze-btn"
                    onClick={handleAnalyze}
                    className="btn-analyze flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide bg-gradient-to-r from-violet-600 to-violet-500 text-white border border-violet-400/30 glow-violet"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Simulate AI Analysis
                    <span className="text-violet-200/60 font-normal hidden sm:inline">
                      ({SIMULATION_INTERACTIONS.length})
                    </span>
                  </button>
                </div>
                <InboxList
                  interactions={SIMULATION_INTERACTIONS}
                  activePlatform={activePlatform}
                />
              </div>
            )}

            {/* ── SCANNING ── blurred inbox + overlay */}
            {phase === 'scanning' && (
              <>
                <div className="opacity-20 pointer-events-none blur-sm select-none">
                  <InboxList
                    interactions={SIMULATION_INTERACTIONS}
                    activePlatform={activePlatform}
                  />
                </div>
                <ScanAnimation />
              </>
            )}

            {/* ── RESULTS ── */}
            {phase === 'results' && (
              <ResultsDashboard
                results={results}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            )}

            {/* ── ERROR ── */}
            {phase === 'error' && (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-red-300">Batch Request Failed</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">{batchError}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Try Again
                </button>
              </div>
            )}
          </div>

        </main>

        <footer className="text-center py-3 text-[11px] text-slate-700 border-t border-white/5">
          Veel ICE-Hub — Simulation Sandbox &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
