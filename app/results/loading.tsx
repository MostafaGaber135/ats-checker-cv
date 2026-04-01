// ============================================================
// app/results/loading.tsx
// Shown by Next.js while the results page component loads.
// Matches the visual structure of the real results page.
// ============================================================
export default function ResultsLoading() {
  return (
    <main className="min-h-screen grid-bg">
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">

        {/* Top bar skeleton */}
        <div className="mb-8">
          <div className="h-3 w-32 bg-slate-800 rounded animate-pulse mb-3" />
          <div className="h-7 w-56 bg-slate-800 rounded animate-pulse mb-2" />
          <div className="h-3 w-44 bg-slate-800/60 rounded animate-pulse" />
        </div>

        {/* Score dashboard skeleton */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Ring placeholder */}
            <div className="w-44 h-44 rounded-full bg-slate-800 animate-pulse flex-shrink-0" />
            {/* Sub-score bars */}
            <div className="flex-1 w-full space-y-5">
              {[80, 65, 90, 50, 72].map((w, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <div className="h-3 w-28 bg-slate-800 rounded animate-pulse" />
                    <div className="h-3 w-8 bg-slate-800 rounded animate-pulse" />
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-700 rounded-full animate-pulse"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab row skeleton */}
        <div className="flex gap-1.5 mb-6">
          {[100, 90, 80, 70, 100, 80].map((w, i) => (
            <div
              key={i}
              className="h-9 bg-slate-800 rounded-lg animate-pulse flex-shrink-0"
              style={{ width: `${w}px` }}
            />
          ))}
        </div>

        {/* Content skeleton cards */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="h-5 w-40 bg-slate-800 rounded animate-pulse mb-5" />
            <div className="space-y-3">
              {[70, 90, 55, 80].map((w, i) => (
                <div key={i} className="h-4 bg-slate-800 rounded animate-pulse" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="h-5 w-48 bg-slate-800 rounded animate-pulse mb-5" />
            <div className="flex flex-wrap gap-2">
              {[60, 90, 70, 80, 50, 65, 75, 85].map((w, i) => (
                <div key={i} className="h-7 bg-slate-800 rounded-md animate-pulse" style={{ width: `${w}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
