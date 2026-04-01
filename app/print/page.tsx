'use client';

// ============================================================
// /print — Printer-friendly version of the analysis results.
// Opens as a new tab and auto-triggers window.print().
// Shows all sections on one page without tabs or animations.
// ============================================================
import { useEffect, useState } from 'react';
import { AnalysisResult } from '@/lib/types';
import { scoreColor, scoreBgColor, gradeLabel, severityColor, priorityColor } from '@/lib/utils';

interface StoredResult {
  fileName: string;
  wordCount: number;
  result: AnalysisResult;
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-slate-200 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}

export default function PrintPage() {
  const [data, setData] = useState<StoredResult | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('atsResult');
    if (raw) {
      try { setData(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  // Auto-print once data is loaded
  useEffect(() => {
    if (data) {
      const t = setTimeout(() => window.print(), 800);
      return () => clearTimeout(t);
    }
  }, [data]);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400 text-sm">
        No analysis data. Please run an analysis first.
      </div>
    );
  }

  const { result, fileName } = data;
  const { atsScore, sections, keywords, skills, formattingIssues, suggestions, improvedSummary, executiveSummary, roleAlignment, experienceLevel } = result;

  return (
    <main className="bg-white text-slate-900 min-h-screen p-10 max-w-[900px] mx-auto print:p-0 print:max-w-none font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      {/* Print button */}
      <div className="no-print mb-6 flex gap-3">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          🖨️ Print / Save as PDF
        </button>
        <button
          onClick={() => window.close()}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors text-slate-600"
        >
          Close
        </button>
      </div>

      {/* Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">ATS Resume Analysis Report</h1>
        <p className="text-slate-500 text-sm mt-1">
          {fileName} · {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
          {roleAlignment ? ` · ${roleAlignment}` : ''} · {experienceLevel}-level
        </p>
      </div>

      {/* Score block */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-slate-200 rounded-xl p-5">
          <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-3">ATS Score</h2>
          <div className={`text-5xl font-bold mb-1 ${scoreColor(atsScore.overall)}`}>
            {atsScore.overall}
            <span className="text-xl text-slate-400 font-normal">/100</span>
          </div>
          <div className="text-sm text-slate-500">
            Grade {atsScore.grade} — {gradeLabel(atsScore.grade)} ·{' '}
            <span className={atsScore.passesATS ? 'text-emerald-600' : 'text-red-600'}>
              {atsScore.passesATS ? '✓ Passes ATS' : '✗ Below ATS threshold'}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {Object.entries(atsScore.subScores).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-xs text-slate-500 mb-0.5">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className={scoreColor(val)}>{val}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div className={`h-full rounded-full ${scoreBgColor(val)}`} style={{ width: `${val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-5">
          <h2 className="text-xs uppercase tracking-wider text-slate-400 mb-3">Assessment</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{executiveSummary}</p>
          <div className="mt-4 space-y-1">
            <Row label="Keyword Density"   value={`${keywords.density}%`} />
            {keywords.jobMatchPercent > 0 && (
              <Row label="JD Match"         value={`${keywords.jobMatchPercent}%`} />
            )}
            <Row label="Keywords Matched"  value={keywords.matched.length} />
            <Row label="Keywords Missing"  value={keywords.missing.length} />
          </div>
        </div>
      </div>

      {/* Keywords */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">Keywords</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-emerald-600 font-medium mb-2">Matched ({keywords.matched.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.matched.map(k => (
                <span key={k} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs">{k}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-red-500 font-medium mb-2">Missing ({keywords.missing.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {keywords.missing.map(k => (
                <span key={k} className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded text-xs">{k}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">Skills</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium mb-2">Technical — Found</p>
            <p className="text-sm text-slate-600">{skills.technical.found.join(', ') || 'None detected'}</p>
            <p className="text-xs text-slate-400 font-medium mt-3 mb-1">Suggested to Add</p>
            <p className="text-sm text-slate-500">{skills.technical.missing.join(', ') || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-2">Soft Skills — Found</p>
            <p className="text-sm text-slate-600">{skills.soft.found.join(', ') || 'None detected'}</p>
            <p className="text-xs text-slate-400 font-medium mt-3 mb-1">Suggested to Add</p>
            <p className="text-sm text-slate-500">{skills.soft.missing.join(', ') || '—'}</p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">Section Analysis</h2>
        <div className="space-y-4">
          {sections.map(sec => (
            <div key={sec.name} className="border border-slate-100 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sm text-slate-800">{sec.name}</span>
                <span className={`text-sm font-semibold ${sec.detected ? scoreColor(sec.score) : 'text-red-500'}`}>
                  {sec.detected ? `${sec.score}/100` : 'Missing'}
                </span>
              </div>
              {!sec.detected ? (
                <p className="text-red-600 text-xs">This section was not detected. Add a "{sec.name}" heading.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 text-xs">
                  {sec.strengths.length > 0 && (
                    <div>
                      <p className="text-emerald-600 font-medium mb-1">Strengths</p>
                      <ul className="space-y-0.5">{sec.strengths.map((s,i) => <li key={i} className="text-slate-500">• {s}</li>)}</ul>
                    </div>
                  )}
                  {sec.weaknesses.length > 0 && (
                    <div>
                      <p className="text-red-500 font-medium mb-1">Weaknesses</p>
                      <ul className="space-y-0.5">{sec.weaknesses.map((w,i) => <li key={i} className="text-slate-500">• {w}</li>)}</ul>
                    </div>
                  )}
                  {sec.improvements.length > 0 && (
                    <div>
                      <p className="text-blue-600 font-medium mb-1">Improvements</p>
                      <ul className="space-y-0.5">{sec.improvements.map((imp,i) => <li key={i} className="text-slate-500">→ {imp}</li>)}</ul>
                    </div>
                  )}
                </div>
              )}
              {sec.rewrittenBullets && sec.rewrittenBullets.length > 0 && (
                <div className="mt-3 border-t border-slate-100 pt-3 space-y-2">
                  {sec.rewrittenBullets.map((b, i) => (
                    <div key={i} className="text-xs">
                      <p className="text-red-400 line-through mb-0.5">{b.original}</p>
                      <p className="text-emerald-700 font-medium">✓ {b.improved}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Formatting issues */}
      {formattingIssues.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">Formatting Issues</h2>
          <div className="space-y-2">
            {formattingIssues.map((f, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border h-fit flex-shrink-0 ${severityColor(f.severity)}`}>
                  {f.severity}
                </span>
                <div>
                  <p className="text-slate-700">{f.issue}</p>
                  <p className="text-blue-600 text-xs mt-0.5">→ {f.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Improved summary */}
      {improvedSummary && (
        <section className="mb-8">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">AI-Rewritten Professional Summary</h2>
          <blockquote className="pl-4 border-l-2 border-blue-400 text-sm text-slate-600 leading-relaxed italic">
            {improvedSummary}
          </blockquote>
        </section>
      )}

      {/* Action plan */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-4">
          Action Plan ({suggestions.length} items)
        </h2>
        <div className="space-y-2">
          {[...suggestions]
            .sort((a, b) => ['critical','high','medium','low'].indexOf(a.priority) - ['critical','high','medium','low'].indexOf(b.priority))
            .map((s, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border h-fit flex-shrink-0 capitalize ${priorityColor(s.priority)}`}>
                  {s.priority}
                </span>
                <div>
                  <p className="text-slate-700">{s.suggestion}</p>
                  {s.example && <p className="text-blue-600 text-xs mt-0.5 italic">Example: {s.example}</p>}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
        Generated by ATS CV Checker · {new Date().toUTCString()}
      </div>
    </main>
  );
}
