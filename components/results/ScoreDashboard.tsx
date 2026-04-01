'use client';

import { ATSScore } from '@/lib/types';
import { scoreColor, scoreBgColor, gradeLabel } from '@/lib/utils';

interface ScoreDashboardProps {
  atsScore: ATSScore;
  roleAlignment: string;
  experienceLevel: string;
  executiveSummary: string;
}

// Sub-score labels with icons
const SUB_LABELS: Record<string, { label: string; icon: string; desc: string }> = {
  keywords:       { label: 'Keywords',       icon: '🔑', desc: 'Keyword density & relevance' },
  contentQuality: { label: 'Content Quality', icon: '✍️', desc: 'Action verbs, clarity, tone' },
  structure:      { label: 'Structure',       icon: '🏗️', desc: 'Section completeness & order' },
  impact:         { label: 'Impact',          icon: '📈', desc: 'Measurable achievements' },
  skillsMatch:    { label: 'Skills Match',    icon: '🎯', desc: 'Technical & soft skills' },
};

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45; // r=45
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    score >= 80 ? '#34d399' :
    score >= 60 ? '#fbbf24' :
    score >= 40 ? '#fb923c' : '#f87171';

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
        {/* Fill */}
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 6px ${strokeColor}80)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-syne text-4xl font-800 ${scoreColor(score)}`}>{score}</span>
        <span className="text-slate-500 text-xs font-body">/ 100</span>
      </div>
    </div>
  );
}

function SubScoreBar({ label, icon, desc, value }: { label: string; icon: string; desc: string; value: number }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-slate-300 text-sm font-body">{label}</span>
        </div>
        <span className={`font-syne font-700 text-sm ${scoreColor(value)}`}>{value}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${scoreBgColor(value)} bar-fill`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="text-slate-600 text-xs mt-1 font-body">{desc}</p>
    </div>
  );
}

export default function ScoreDashboard({
  atsScore,
  roleAlignment,
  experienceLevel,
  executiveSummary,
}: ScoreDashboardProps) {
  const { overall, subScores, grade, passesATS } = atsScore;

  return (
    <div className="space-y-6">
      {/* Main score card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 fade-up">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Ring */}
          <div className="flex-shrink-0">
            <ScoreRing score={overall} />
            <div className="text-center mt-3 space-y-1">
              <div className={`font-syne font-700 text-lg ${scoreColor(overall)}`}>
                {gradeLabel(grade)} · Grade {grade}
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-body border
                ${passesATS
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                }`}>
                {passesATS ? '✓ ATS Passes' : '✗ Fails ATS Threshold'}
              </div>
            </div>
          </div>

          {/* Sub scores */}
          <div className="flex-1 w-full space-y-4">
            {Object.entries(subScores).map(([key, value]) => {
              const meta = SUB_LABELS[key];
              if (!meta) return null;
              return (
                <SubScoreBar key={key} {...meta} value={value} />
              );
            })}
          </div>
        </div>
      </div>

      {/* Role & level badges + executive summary */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 fade-up fade-up-delay-1">
        <div className="flex flex-wrap gap-3 mb-4">
          {roleAlignment && (
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-body">
              🎯 {roleAlignment}
            </span>
          )}
          <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-body capitalize">
            📊 {experienceLevel}-level
          </span>
        </div>
        <h3 className="font-syne font-600 text-white mb-2">Overall Assessment</h3>
        <p className="text-slate-400 text-sm leading-relaxed font-body">{executiveSummary}</p>
      </div>
    </div>
  );
}
