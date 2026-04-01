'use client';

import { useState } from 'react';

interface ImprovedSummaryCardProps {
  summary: string;
}

export default function ImprovedSummaryCard({ summary }: ImprovedSummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-violet-900/20 to-blue-900/20 border border-violet-500/20 rounded-2xl p-6 fade-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-syne font-700 text-white text-lg">✨ AI-Rewritten Summary</h3>
          <p className="text-slate-500 text-xs font-body mt-0.5">
            ATS-optimized professional summary ready to use
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-body transition-all duration-200 border
            ${copied
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-violet-500/30 bg-violet-500/10 text-violet-300 hover:border-violet-400/50'
            }`}
        >
          {copied ? '✓ Copied!' : '⎘ Copy'}
        </button>
      </div>

      <div className="relative">
        <div className="absolute -top-1 -left-2 text-violet-300/20 font-syne text-6xl leading-none select-none">
          "
        </div>
        <blockquote className="relative z-10 text-slate-200 text-sm leading-relaxed font-body pl-4 border-l-2 border-violet-500/40">
          {summary}
        </blockquote>
      </div>

      <p className="text-slate-600 text-xs font-body mt-4">
        💡 Customize this with your specific company names, metrics, and personal details before using.
      </p>
    </div>
  );
}
