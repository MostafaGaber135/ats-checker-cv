'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to an error reporting service in production (e.g. Sentry)
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="font-syne text-2xl font-700 text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-slate-400 font-body text-sm mb-6 leading-relaxed">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        {error.digest && (
          <p className="text-slate-600 text-xs font-body mb-6">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600
              text-white font-syne font-600 text-sm hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl border border-slate-700
              text-slate-300 font-body text-sm hover:border-slate-500 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </main>
  );
}
