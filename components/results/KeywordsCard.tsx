'use client';

import { KeywordAnalysis } from '@/lib/types';

interface KeywordsCardProps {
  keywords: KeywordAnalysis;
}

export default function KeywordsCard({ keywords }: KeywordsCardProps) {
  const { matched, missing, density, jobMatchPercent } = keywords;
  const hasJD = jobMatchPercent > 0;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 fade-up fade-up-delay-2">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-syne font-700 text-white text-lg">🔑 Keyword Analysis</h3>
        <div className="flex gap-3">
          <div className="text-right">
            <div className="font-syne font-700 text-emerald-400 text-xl">{density}%</div>
            <div className="text-slate-600 text-xs">Density</div>
          </div>
          {hasJD && (
            <div className="text-right">
              <div className="font-syne font-700 text-blue-400 text-xl">{jobMatchPercent}%</div>
              <div className="text-slate-600 text-xs">JD Match</div>
            </div>
          )}
        </div>
      </div>

      {/* Progress bar for JD match */}
      {hasJD && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Job Description Match</span>
            <span>{jobMatchPercent}%</span>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 bar-fill"
              style={{ width: `${jobMatchPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched keywords */}
        <div>
          <h4 className="text-emerald-400 text-sm font-syne font-600 mb-3 flex items-center gap-2">
            <span>✓</span> Found ({matched.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {matched.length > 0 ? matched.map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-body"
              >
                {kw}
              </span>
            )) : (
              <p className="text-slate-600 text-sm">No keywords matched yet.</p>
            )}
          </div>
        </div>

        {/* Missing keywords */}
        <div>
          <h4 className="text-rose-400 text-sm font-syne font-600 mb-3 flex items-center gap-2">
            <span>✗</span> Missing ({missing.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {missing.length > 0 ? missing.map((kw) => (
              <span
                key={kw}
                className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-body"
              >
                {kw}
              </span>
            )) : (
              <p className="text-slate-500 text-sm">
                {hasJD ? 'Great — no critical keywords missing!' : 'Paste a job description to see missing keywords.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {!hasJD && (
        <p className="mt-5 text-center text-slate-600 text-xs font-body border-t border-slate-800 pt-4">
          💡 Paste a job description on the upload page for precise keyword & match analysis
        </p>
      )}
    </div>
  );
}
