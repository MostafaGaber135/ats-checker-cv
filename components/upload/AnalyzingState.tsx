'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  { icon: '📄', label: 'Extracting resume text…' },
  { icon: '🔍', label: 'Detecting sections & structure…' },
  { icon: '🎯', label: 'Matching keywords & skills…' },
  { icon: '📊', label: 'Scoring content quality & impact…' },
  { icon: '✍️', label: 'Generating AI improvements…' },
  { icon: '✅', label: 'Compiling results dashboard…' },
];

export default function AnalyzingState() {
  const [step, setStep]     = useState(0);
  const [dots, setDots]     = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 2200);
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => { clearInterval(interval); clearInterval(dotInterval); };
  }, []);

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Animated rings */}
        <div className="relative w-32 h-32 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full border-2 border-violet-500/20 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          <div className="absolute inset-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-4xl">
            {STEPS[step].icon}
          </div>
        </div>

        <h2 className="font-syne text-2xl font-700 text-white mb-2">
          Analyzing Your Resume
        </h2>
        <p className="text-blue-300 font-body mb-10 min-h-[24px]">
          {STEPS[step].label}{dots}
        </p>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-500
                ${i === step
                  ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                  : i < step
                  ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800/50 border border-slate-700 text-slate-600'
                }`}
            >
              {i < step ? '✓' : s.icon}
              <span className="font-body">{s.label.replace('…', '')}</span>
            </div>
          ))}
        </div>

        <p className="text-slate-600 text-xs mt-8 font-body">
          Typical analysis takes 15–30 seconds
        </p>
      </div>
    </main>
  );
}
