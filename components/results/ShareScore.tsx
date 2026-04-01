'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/lib/types';

interface ShareScoreProps {
  result: AnalysisResult;
}

export default function ShareScore({ result }: ShareScoreProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const { overall, grade, subScores } = result.atsScore;
    const text = [
      `📊 My ATS Resume Score: ${overall}/100 (Grade ${grade})`,
      ``,
      `Sub-scores:`,
      `  🔑 Keywords       ${subScores.keywords}/100`,
      `  ✍️  Content Quality ${subScores.contentQuality}/100`,
      `  🏗️  Structure       ${subScores.structure}/100`,
      `  📈 Impact          ${subScores.impact}/100`,
      `  🛠️  Skills Match    ${subScores.skillsMatch}/100`,
      ``,
      result.roleAlignment ? `Target role: ${result.roleAlignment}` : '',
      ``,
      `Analyzed with ATS CV Checker`,
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked — fail silently */
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      title="Copy score summary to clipboard"
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-body transition-all border
        ${copied
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
        }`}
    >
      {copied ? '✓ Copied!' : '↗ Share Score'}
    </button>
  );
}
