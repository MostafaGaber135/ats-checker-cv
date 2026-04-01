'use client';

import { SkillsAnalysis } from '@/lib/types';

interface SkillsCardProps {
  skills: SkillsAnalysis;
}

function SkillGroup({
  title,
  icon,
  found,
  missing,
  color,
}: {
  title: string;
  icon: string;
  found: string[];
  missing: string[];
  color: 'blue' | 'violet';
}) {
  const foundStyle =
    color === 'blue'
      ? 'bg-blue-500/10 border-blue-500/20 text-blue-300'
      : 'bg-violet-500/10 border-violet-500/20 text-violet-300';

  return (
    <div className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50">
      <h4 className="font-syne font-600 text-white mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h4>

      {found.length > 0 && (
        <div className="mb-4">
          <p className="text-emerald-400 text-xs font-body mb-2 uppercase tracking-wider">Detected</p>
          <div className="flex flex-wrap gap-2">
            {found.map((s) => (
              <span key={s} className={`px-2.5 py-1 rounded-md border text-xs font-body ${foundStyle}`}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div>
          <p className="text-slate-500 text-xs font-body mb-2 uppercase tracking-wider">Suggested to Add</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-md border border-dashed border-slate-600 text-slate-400 text-xs font-body"
              >
                + {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SkillsCard({ skills }: SkillsCardProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 fade-up">
      <h3 className="font-syne font-700 text-white text-lg mb-5">🛠️ Skills Analysis</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <SkillGroup
          title="Technical Skills"
          icon="💻"
          found={skills.technical.found}
          missing={skills.technical.missing}
          color="blue"
        />
        <SkillGroup
          title="Soft Skills"
          icon="🤝"
          found={skills.soft.found}
          missing={skills.soft.missing}
          color="violet"
        />
      </div>
    </div>
  );
}
