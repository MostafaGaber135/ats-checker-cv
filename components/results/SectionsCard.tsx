'use client';

import { useState } from 'react';
import { SectionAnalysis } from '@/lib/types';
import { scoreColor, scoreBgColor } from '@/lib/utils';

interface SectionsCardProps {
  sections: SectionAnalysis[];
}

function SectionPanel({ section }: { section: SectionAnalysis }) {
  const [expanded, setExpanded] = useState(false);

  const statusIcon = !section.detected
    ? { icon: '✗', cls: 'text-rose-400' }
    : section.score >= 80
    ? { icon: '✓', cls: 'text-emerald-400' }
    : section.score >= 50
    ? { icon: '~', cls: 'text-amber-400' }
    : { icon: '!', cls: 'text-orange-400' };

  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-800/30">
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-800/50 transition-colors"
      >
        <span className={`font-syne font-700 text-lg w-6 ${statusIcon.cls}`}>
          {statusIcon.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-syne font-600 text-slate-200 text-sm">{section.name}</span>
            <span className={`font-syne font-700 text-sm flex-shrink-0 ${scoreColor(section.score)}`}>
              {section.detected ? `${section.score}/100` : 'Missing'}
            </span>
          </div>
          {section.detected && (
            <div className="mt-1.5 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${scoreBgColor(section.score)} bar-fill`}
                style={{ width: `${section.score}%` }}
              />
            </div>
          )}
        </div>
        <span className={`text-slate-500 text-xs transition-transform duration-200 flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-5 border-t border-slate-800/80 pt-4 space-y-4">
          {!section.detected ? (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
              <p className="text-rose-300 text-sm font-body">
                ⚠ This section was not detected in your resume. Add a clearly labeled "{section.name}" section.
              </p>
              {section.improvements.map((imp, i) => (
                <p key={i} className="text-rose-200/70 text-xs mt-1 font-body">→ {imp}</p>
              ))}
            </div>
          ) : (
            <>
              {section.strengths.length > 0 && (
                <div>
                  <h5 className="text-emerald-400 text-xs font-syne font-600 uppercase tracking-wider mb-2">
                    ✓ Strengths
                  </h5>
                  <ul className="space-y-1">
                    {section.strengths.map((s, i) => (
                      <li key={i} className="text-slate-300 text-sm font-body flex gap-2">
                        <span className="text-emerald-500 flex-shrink-0">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.weaknesses.length > 0 && (
                <div>
                  <h5 className="text-rose-400 text-xs font-syne font-600 uppercase tracking-wider mb-2">
                    ✗ Weaknesses
                  </h5>
                  <ul className="space-y-1">
                    {section.weaknesses.map((w, i) => (
                      <li key={i} className="text-slate-300 text-sm font-body flex gap-2">
                        <span className="text-rose-500 flex-shrink-0">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.improvements.length > 0 && (
                <div>
                  <h5 className="text-blue-400 text-xs font-syne font-600 uppercase tracking-wider mb-2">
                    → How to Improve
                  </h5>
                  <ul className="space-y-1">
                    {section.improvements.map((imp, i) => (
                      <li key={i} className="text-slate-300 text-sm font-body flex gap-2">
                        <span className="text-blue-500 flex-shrink-0">→</span> {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.rewrittenBullets && section.rewrittenBullets.length > 0 && (
                <div>
                  <h5 className="text-violet-400 text-xs font-syne font-600 uppercase tracking-wider mb-3">
                    ✍ AI-Rewritten Bullets
                  </h5>
                  <div className="space-y-3">
                    {section.rewrittenBullets.map((b, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-slate-700">
                        <div className="bg-rose-500/5 border-b border-slate-700 p-3">
                          <p className="text-rose-300/70 text-xs font-body uppercase tracking-wider mb-1">Before</p>
                          <p className="text-slate-400 text-sm font-body leading-relaxed">{b.original}</p>
                        </div>
                        <div className="bg-emerald-500/5 p-3">
                          <p className="text-emerald-300/70 text-xs font-body uppercase tracking-wider mb-1">After ✨</p>
                          <p className="text-slate-200 text-sm font-body leading-relaxed">{b.improved}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function SectionsCard({ sections }: SectionsCardProps) {
  const detected  = sections.filter((s) => s.detected).length;
  const missing   = sections.filter((s) => !s.detected).length;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 fade-up">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-syne font-700 text-white text-lg">📋 Section Analysis</h3>
        <div className="flex gap-3 text-xs font-body">
          <span className="text-emerald-400">{detected} detected</span>
          {missing > 0 && <span className="text-rose-400">{missing} missing</span>}
        </div>
      </div>
      <p className="text-slate-500 text-xs font-body mb-4">
        Click any section to expand detailed feedback and AI-rewritten bullets.
      </p>
      <div className="space-y-2">
        {sections.map((section) => (
          <SectionPanel key={section.name} section={section} />
        ))}
      </div>
    </div>
  );
}
