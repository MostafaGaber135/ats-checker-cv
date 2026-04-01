'use client';

import { useState } from 'react';
import { Suggestion } from '@/lib/types';
import { priorityColor } from '@/lib/utils';

interface SuggestionsCardProps {
  suggestions: Suggestion[];
}

const TYPE_ICONS: Record<string, string> = {
  keyword:     '🔑',
  skill:       '🛠️',
  achievement: '📈',
  summary:     '📝',
  formatting:  '🖨️',
  general:     '💡',
};

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low'];

type FilterType = 'all' | Suggestion['priority'];

export default function SuggestionsCard({ suggestions }: SuggestionsCardProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const visible = filter === 'all'
    ? suggestions
    : suggestions.filter((s) => s.priority === filter);

  // Sort by priority
  const sorted = [...visible].sort(
    (a, b) => PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
  );

  const counts = {
    critical: suggestions.filter((s) => s.priority === 'critical').length,
    high:     suggestions.filter((s) => s.priority === 'high').length,
    medium:   suggestions.filter((s) => s.priority === 'medium').length,
    low:      suggestions.filter((s) => s.priority === 'low').length,
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 fade-up">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h3 className="font-syne font-700 text-white text-lg">💡 Action Plan</h3>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'critical', 'high', 'medium', 'low'] as FilterType[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-body transition-colors capitalize
                ${filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                }`}
            >
              {f === 'all' ? `All (${suggestions.length})` : `${f} (${counts[f as keyof typeof counts]})`}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-slate-600 text-sm font-body">No suggestions for this priority level.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((s, i) => (
            <div
              key={i}
              className="border border-slate-700/50 rounded-xl p-4 bg-slate-800/30 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0 mt-0.5">{TYPE_ICONS[s.type] ?? '💡'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-md border text-xs font-body capitalize ${priorityColor(s.priority)}`}>
                      {s.priority}
                    </span>
                    <span className="text-slate-600 text-xs capitalize font-body">{s.type}</span>
                  </div>
                  <p className="text-slate-200 text-sm font-body leading-relaxed">{s.suggestion}</p>
                  {s.example && (
                    <div className="mt-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                      <p className="text-blue-300/80 text-xs font-body">
                        <span className="text-blue-400 font-600">Example: </span>
                        {s.example}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
