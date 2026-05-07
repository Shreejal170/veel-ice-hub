import { useState, useCallback } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import IdleState from './components/IdleState';
import SkeletonLoader from './components/SkeletonLoader';
import ResultsCard from './components/ResultsCard';
import ErrorToast from './components/ErrorToast';
import SimulationPage from './components/simulation/SimulationPage';
import { analyzeInteraction } from './api';
import type { AnalyzeRequest, AnalyzeResponse, AppState } from './types';

export default function App() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: AnalyzeRequest) => {
    setAppState('loading');
    setResult(null);
    setErrorMessage(null);

    try {
      const response = await analyzeInteraction(data);
      setResult(response);
      setAppState('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setErrorMessage(msg);
      setAppState('error');
      // Revert to idle after a moment so user can retry
      setTimeout(() => setAppState('idle'), 100);
    }
  }, []);

  const dismissError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  // ── Routing ────────────────────────────────────────────────────────────────
  if (window.location.pathname === '/simulation') {
    return (
      <>
        <Header />
        <SimulationPage />
      </>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* Animated mesh background */}
      <div className="bg-mesh" aria-hidden="true" />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Main content */}
        <main className="flex-1 flex flex-col lg:flex-row gap-0 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* ─── Left: Input Form ────────────────────────────── */}
          <section
            aria-label="Interaction Input Form"
            className="w-full lg:w-[48%] lg:pr-4"
          >
            <div className="glass-card p-6 h-full flex flex-col glow-violet" style={{ minHeight: '520px' }}>
              <InputForm
                onSubmit={handleSubmit}
                isSubmitting={appState === 'loading'}
              />
            </div>
          </section>

          {/* Divider on desktop */}
          <div className="hidden lg:flex flex-col items-center justify-center w-[4%] gap-3 py-8">
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="w-8 h-8 rounded-full glass-card border-white/10 flex items-center justify-center text-slate-600 text-xs font-bold">
              →
            </div>
            <div className="flex-1 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          </div>

          {/* Mobile divider */}
          <div className="lg:hidden flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-slate-700 text-xs">↓ Results</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ─── Right: Results Area ─────────────────────────── */}
          <section
            aria-label="Analysis Results"
            className="w-full lg:w-[48%] lg:pl-4"
          >
            <div className="glass-card p-6 h-full overflow-y-auto" style={{ minHeight: '520px' }}>
              {appState === 'idle' || appState === 'error' ? (
                <IdleState />
              ) : appState === 'loading' ? (
                <SkeletonLoader />
              ) : result ? (
                <ResultsCard data={result} />
              ) : null}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-4 text-[11px] text-slate-700 border-t border-white/5">
          Veel ICE-Hub &mdash; Interaction Classification Engine &copy; {new Date().getFullYear()}
        </footer>
      </div>

      {/* Error Toast */}
      {errorMessage && (
        <ErrorToast message={errorMessage} onClose={dismissError} />
      )}
    </div>
  );
}
