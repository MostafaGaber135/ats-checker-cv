'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '@/lib/types';
import { useScoreHistory } from '@/lib/hooks/useScoreHistory';
import ScoreDashboard      from '@/components/results/ScoreDashboard';
import KeywordsCard        from '@/components/results/KeywordsCard';
import SkillsCard          from '@/components/results/SkillsCard';
import SectionsCard        from '@/components/results/SectionsCard';
import FormattingCard      from '@/components/results/FormattingCard';
import SuggestionsCard     from '@/components/results/SuggestionsCard';
import ImprovedSummaryCard from '@/components/results/ImprovedSummaryCard';
import DownloadReport      from '@/components/results/DownloadReport';
import ShareScore          from '@/components/results/ShareScore';
import BulletRewriter      from '@/components/results/BulletRewriter';
import ScoreHistoryPanel   from '@/components/results/ScoreHistoryPanel';

// ─── Types ───────────────────────────────────────────────────
interface StoredResult {
  fileName: string;
  wordCount: number;
  result: AnalysisResult;
}

// ─── Tab config ──────────────────────────────────────────────
const TABS = [
  { id: 'overview',    label: '📊 Overview' },
  { id: 'sections',    label: '📋 Sections' },
  { id: 'keywords',    label: '🔑 Keywords' },
  { id: 'skills',      label: '🛠️ Skills' },
  { id: 'suggestions', label: '💡 Action Plan' },
  { id: 'rewriter',    label: '✍️ Rewriter' },
  { id: 'history',     label: '📈 History' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function ResultsPage() {
  const router                              = useRouter();
  const [data, setData]                     = useState<StoredResult | null>(null);
  const [activeTab, setTab]                 = useState<TabId>('overview');
  const [currentEntryId, setCurrentEntryId] = useState<string | undefined>();
  const { history, addEntry, clearHistory, mounted } = useScoreHistory();

  // ── Load stored result from sessionStorage ─────────────────
  useEffect(() => {
    const raw = sessionStorage.getItem('atsResult');
    if (!raw) { router.replace('/'); return; }
    try { setData(JSON.parse(raw)); }
    catch { router.replace('/'); }
  }, [router]);

  // ── Save this analysis to history once data + hook ready ───
  const saveToHistory = useCallback(() => {
    if (!data || !mounted || currentEntryId) return;
    const { result, fileName } = data;
    const entry = addEntry({
      fileName,
      overallScore:   result.atsScore.overall,
      grade:          result.atsScore.grade,
      roleAlignment:  result.roleAlignment,
      subScores:      result.atsScore.subScores,
    });
    setCurrentEntryId(entry.id);
  }, [data, mounted, currentEntryId, addEntry]);

  useEffect(() => { saveToHistory(); }, [saveToHistory]);

  // ── Loading state ──────────────────────────────────────────
  if (!data) {
    return (
      <main className="min-h-screen grid-bg flex items-center justify-center">
        <div className="text-slate-500 font-body animate-pulse">Loading results…</div>
      </main>
    );
  }

  const { result, fileName, wordCount } = data;
  const historyCount = history.length;

  return (
    <main className="min-h-screen grid-bg">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">

        {/* ── Top bar ─────────────────────────────────────── */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-slate-500 hover:text-slate-300 text-sm font-body flex items-center gap-1.5 mb-2 transition-colors group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Analyze another resume
            </button>
            <h1 className="font-syne font-800 text-2xl text-white">ATS Analysis Results</h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-body flex-wrap">
              <span>📄 {fileName}</span>
              <span className="text-slate-700">·</span>
              <span>{wordCount} words</span>
              {result.roleAlignment && (
                <>
                  <span className="text-slate-700">·</span>
                  <span>{result.roleAlignment}</span>
                </>
              )}
              <span className="text-slate-700">·</span>
              <span className="capitalize">{result.experienceLevel}-level</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
          <ShareScore result={result} />
          <button type="button" onClick={() => window.open("/print","_blank")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all">🖨️ Print</button>
          <DownloadReport result={result} fileName={fileName} />
        </div>
        </div>

        {/* ── Score dashboard — always visible ────────────── */}
        <div className="mb-8">
          <ScoreDashboard
            atsScore={result.atsScore}
            roleAlignment={result.roleAlignment}
            experienceLevel={result.experienceLevel}
            executiveSummary={result.executiveSummary}
          />
        </div>

        {/* ── Tab navigation ──────────────────────────────── */}
        <div
          className="flex gap-1.5 mb-6 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {TABS.map((tab) => {
            // Badge count for history tab
            const badge = tab.id === 'history' && historyCount > 0 ? historyCount : null;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTab(tab.id)}
                className={`relative px-4 py-2 rounded-lg text-sm font-body transition-all whitespace-nowrap flex-shrink-0
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700 hover:border-slate-600'
                  }`}
              >
                {tab.label}
                {badge && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-syne font-700
                    ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-600/30 text-blue-300'}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Tab content ─────────────────────────────────── */}
        <div className="space-y-6">

          {activeTab === 'overview' && (
            <>
              {result.improvedSummary && (
                <ImprovedSummaryCard summary={result.improvedSummary} />
              )}
              <FormattingCard issues={result.formattingIssues} />
              <KeywordsCard   keywords={result.keywords} />
            </>
          )}

          {activeTab === 'sections' && (
            <SectionsCard sections={result.sections} />
          )}

          {activeTab === 'keywords' && (
            <KeywordsCard keywords={result.keywords} />
          )}

          {activeTab === 'skills' && (
            <SkillsCard skills={result.skills} />
          )}

          {activeTab === 'suggestions' && (
            <SuggestionsCard suggestions={result.suggestions} />
          )}

          {activeTab === 'rewriter' && (
            <BulletRewriter role={result.roleAlignment} />
          )}

          {activeTab === 'history' && (
            <ScoreHistoryPanel
              history={history}
              currentId={currentEntryId}
              onClear={clearHistory}
            />
          )}
        </div>

        {/* ── Footer CTA ──────────────────────────────────── */}
        <div className="mt-12 p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-center">
          <p className="text-slate-400 font-syne font-600 mb-1">
            Implement the suggestions, then re-analyze to track progress.
          </p>
          <p className="text-slate-600 text-sm font-body mb-5">
            Candidates typically improve 15–30 points after one revision cycle.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600
                text-white font-syne font-600 text-sm hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]
                transition-all duration-200 active:scale-[0.98]"
            >
              ⚡ Analyze Updated Resume
            </button>
            <div className="flex items-center gap-2">
          <ShareScore result={result} />
          <button type="button" onClick={() => window.open("/print","_blank")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body border border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all">🖨️ Print</button>
          <DownloadReport result={result} fileName={fileName} />
        </div>
          </div>
        </div>

      </div>
    </main>
  );
}
