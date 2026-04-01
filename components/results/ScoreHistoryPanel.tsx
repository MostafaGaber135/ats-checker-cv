'use client';

import { HistoryEntry } from '@/lib/hooks/useScoreHistory';
import { scoreColor, scoreBgColor } from '@/lib/utils';

interface ScoreHistoryPanelProps {
  history: HistoryEntry[];
  currentId?: string;
  onClear: () => void;
}

export default function ScoreHistoryPanel({
  history,
  currentId,
  onClear,
}: ScoreHistoryPanelProps) {
  if (history.length === 0) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      hour:  '2-digit',
      minute:'2-digit',
    });

  // Trend arrow between consecutive scores
  const trendIcon = (current: HistoryEntry, prev?: HistoryEntry) => {
    if (!prev) return null;
    const diff = current.overallScore - prev.overallScore;
    if (diff > 0)  return <span className="text-emerald-400 text-xs">↑{diff}</span>;
    if (diff < 0)  return <span className="text-rose-400 text-xs">↓{Math.abs(diff)}</span>;
    return <span className="text-slate-500 text-xs">→0</span>;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 fade-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-syne font-700 text-white text-lg">📈 Score History</h3>
          <p className="text-slate-500 text-xs font-body mt-0.5">
            Your last {history.length} analysis{history.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-slate-600 hover:text-slate-400 text-xs font-body transition-colors"
        >
          Clear history
        </button>
      </div>

      <div className="space-y-2">
        {history.map((entry, idx) => {
          const isCurrent = entry.id === currentId;
          const prev      = history[idx + 1]; // older entry

          return (
            <div
              key={entry.id}
              className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all
                ${isCurrent
                  ? 'border-blue-500/30 bg-blue-500/8'
                  : 'border-slate-800/80 bg-slate-800/20'
                }`}
            >
              {/* Score pill */}
              <div className="flex-shrink-0 text-center min-w-[48px]">
                <div className={`font-syne font-800 text-lg leading-none ${scoreColor(entry.overallScore)}`}>
                  {entry.overallScore}
                </div>
                <div className="text-slate-600 text-[10px]">/ 100</div>
              </div>

              {/* Mini bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-slate-300 text-xs font-body truncate">
                    {entry.fileName}
                  </span>
                  {isCurrent && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-600/20 text-blue-300 flex-shrink-0">
                      current
                    </span>
                  )}
                  {trendIcon(entry, prev)}
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${scoreBgColor(entry.overallScore)}`}
                    style={{ width: `${entry.overallScore}%`, transition: 'width 0.6s ease' }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-600 text-[10px] font-body">{formatDate(entry.analyzedAt)}</span>
                  {entry.roleAlignment && (
                    <span className="text-slate-700 text-[10px] font-body">· {entry.roleAlignment}</span>
                  )}
                </div>
              </div>

              {/* Grade badge */}
              <div className={`flex-shrink-0 font-syne font-700 text-sm ${scoreColor(entry.overallScore)}`}>
                {entry.grade}
              </div>
            </div>
          );
        })}
      </div>

      {/* Best score callout */}
      {history.length >= 2 && (() => {
        const best  = Math.max(...history.map((h) => h.overallScore));
        const first = history[history.length - 1].overallScore;
        const diff  = best - first;
        if (diff <= 0) return null;
        return (
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs font-body text-slate-500">
            <span className="text-emerald-400">🏆</span>
            Best score: <span className="text-emerald-400 font-600">{best}</span>
            {diff > 0 && (
              <span className="text-slate-600">
                (+{diff} pts from your first analysis)
              </span>
            )}
          </div>
        );
      })()}
    </div>
  );
}
