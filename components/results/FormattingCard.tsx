'use client';

import { FormattingIssue } from '@/lib/types';
import { severityColor } from '@/lib/utils';

interface FormattingCardProps {
  issues: FormattingIssue[];
}

export default function FormattingCard({ issues }: FormattingCardProps) {
  if (issues.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-6 fade-up">
        <h3 className="font-syne font-700 text-white text-lg mb-3">🖨️ ATS Formatting</h3>
        <div className="flex items-center gap-3 text-emerald-400">
          <span className="text-2xl">✓</span>
          <p className="font-body text-sm">No major formatting issues detected. Your resume should parse cleanly in ATS systems.</p>
        </div>
      </div>
    );
  }

  const high   = issues.filter((i) => i.severity === 'high');
  const medium = issues.filter((i) => i.severity === 'medium');
  const low    = issues.filter((i) => i.severity === 'low');

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 fade-up">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-syne font-700 text-white text-lg">🖨️ ATS Formatting Issues</h3>
        <div className="flex gap-2 text-xs">
          {high.length   > 0 && <span className="text-rose-400">{high.length} high</span>}
          {medium.length > 0 && <span className="text-amber-400">{medium.length} medium</span>}
          {low.length    > 0 && <span className="text-slate-400">{low.length} low</span>}
        </div>
      </div>

      <div className="space-y-3">
        {issues.map((issue, i) => (
          <div
            key={i}
            className="border border-slate-700/50 rounded-xl p-4 bg-slate-800/30 flex gap-4"
          >
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-md border text-xs font-body h-fit capitalize ${severityColor(issue.severity)}`}>
              {issue.severity}
            </span>
            <div>
              <p className="text-slate-200 text-sm font-body mb-1">{issue.issue}</p>
              <p className="text-blue-300/70 text-xs font-body">→ {issue.fix}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
