'use client';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function ResultsError({ error, reset }: ErrorProps) {
  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-5">📊</div>
        <h1 className="font-syne text-xl font-700 text-white mb-3">
          Could not load results
        </h1>
        <p className="text-slate-400 font-body text-sm mb-6 leading-relaxed">
          {error.message || 'There was a problem loading your analysis results.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-syne font-600 text-sm
              hover:bg-blue-500 transition-colors"
          >
            Retry
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300
              font-body text-sm hover:border-slate-500 transition-colors"
          >
            Start Over
          </a>
        </div>
      </div>
    </main>
  );
}
