'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import UploadZone        from '@/components/upload/UploadZone';
import JobDescriptionInput from '@/components/upload/JobDescriptionInput';
import RoleSelector      from '@/components/upload/RoleSelector';
import AnalyzingState    from '@/components/upload/AnalyzingState';

const FEATURES = [
  { icon: '🎯', title: 'ATS Score 0–100',     desc: 'Weighted composite score with 5 sub-dimensions' },
  { icon: '🔑', title: 'Keyword Gap Analysis', desc: 'Matched & missing terms vs. job description' },
  { icon: '📋', title: 'Section Scoring',      desc: 'Every section graded with specific feedback' },
  { icon: '✍️', title: 'AI Bullet Rewrites',   desc: 'Weak bullets rewritten with action verbs + metrics' },
  { icon: '🛠️', title: 'Skills Matrix',        desc: 'Technical & soft skills found and suggested' },
  { icon: '⬇', title: 'Full Report Export',   desc: 'Download a complete .txt analysis report' },
];

export default function HomePage() {
  const router = useRouter();
  const [file,          setFile]          = useState<File | null>(null);
  const [jobDescription, setJobDesc]      = useState('');
  const [targetRole,    setTargetRole]    = useState('');
  const [isAnalyzing,   setIsAnalyzing]   = useState(false);
  const [error,         setError]         = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    setError(null);
    setIsAnalyzing(true);

    try {
      const form = new FormData();
      form.append('file', file);
      if (jobDescription) form.append('jobDescription', jobDescription);
      if (targetRole)     form.append('targetRole',     targetRole);

      const res  = await fetch('/api/analyze', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      sessionStorage.setItem('atsResult', JSON.stringify(data));
      router.push('/results');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsAnalyzing(false);
    }
  }, [file, jobDescription, targetRole, router]);

  if (isAnalyzing) return <AnalyzingState />;

  return (
    <main className="min-h-screen grid-bg">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full bg-blue-600/8 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">

        {/* ── Hero ──────────────────────────────────────────── */}
        <div className="text-center mb-14 fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/25
            bg-blue-500/8 text-blue-300 text-sm font-body mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 pulse-glow inline-block" />
            Powered by Claude AI · Real ATS Analysis
          </div>

          <h1 className="font-syne text-5xl md:text-6xl font-800 text-white leading-[1.1] mb-6 tracking-tight">
            Will Your Resume<br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Beat the ATS?
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-body font-300 leading-relaxed">
            Upload your CV and get a{' '}
            <span className="text-slate-200 font-500">real ATS score with actionable feedback</span>
            {' '}— section analysis, keyword gaps, AI bullet rewrites, and a full improvement plan.
          </p>
        </div>

        {/* ── Stats ─────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-10 fade-up fade-up-delay-1">
          {[
            { label: 'Analysis Checks',   value: '50+',    sub: 'per resume'     },
            { label: 'Avg Score Boost',   value: '+28pts', sub: 'after revision' },
            { label: 'Processing Time',   value: '~20s',   sub: 'per analysis'   },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="font-syne text-2xl font-700 text-white">{s.value}</div>
              <div className="text-slate-300 text-xs mt-0.5 font-body">{s.label}</div>
              <div className="text-slate-600 text-xs font-body">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Upload Card ───────────────────────────────────── */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-7 backdrop-blur-sm fade-up fade-up-delay-2 glow-blue">
          <UploadZone file={file} onChange={setFile} />

          <div className="mt-6">
            <RoleSelector value={targetRole} onChange={setTargetRole} />
          </div>

          <JobDescriptionInput value={jobDescription} onChange={setJobDesc} />

          {error && (
            <div className="mt-4 p-3.5 rounded-lg bg-rose-500/8 border border-rose-500/20 text-rose-300 text-sm font-body">
              ⚠ {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file}
            className="mt-6 w-full py-4 rounded-xl font-syne font-700 text-lg transition-all duration-200
              bg-gradient-to-r from-blue-600 to-violet-600 text-white
              hover:from-blue-500 hover:to-violet-500
              hover:shadow-[0_0_40px_rgba(99,102,241,0.45)]
              active:scale-[0.99]
              disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {file ? '⚡ Analyze My Resume' : '↑ Upload a Resume to Begin'}
          </button>

          <p className="text-center text-slate-600 text-xs font-body mt-3">
            Your resume is never stored — processed in memory and discarded immediately.
          </p>
        </div>

        {/* ── Feature grid ──────────────────────────────────── */}
        <div className="mt-16 fade-up fade-up-delay-3">
          <h2 className="font-syne font-700 text-center text-slate-300 text-lg mb-6">
            What the analysis covers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-4 rounded-xl border border-slate-800/70 bg-slate-900/30
                  hover:border-slate-700 hover:bg-slate-900/50 transition-all group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="font-syne font-600 text-slate-200 text-sm mb-1">{f.title}</h3>
                <p className="text-slate-600 text-xs font-body leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── How it works ──────────────────────────────────── */}
        <div className="mt-14 fade-up fade-up-delay-4">
          <h2 className="font-syne font-700 text-center text-slate-300 text-lg mb-8">
            How it works
          </h2>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-6 left-[calc(16.67%_+_12px)] right-[calc(16.67%_+_12px)] h-px bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-blue-600/20 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '01', icon: '📤', title: 'Upload',  desc: 'Drop your PDF or DOCX resume' },
                { step: '02', icon: '🤖', title: 'Analyze', desc: 'AI runs 50+ ATS checks in ~20 seconds' },
                { step: '03', icon: '📊', title: 'Improve', desc: 'Get your score, feedback & rewrites' },
              ].map((step) => (
                <div key={step.step} className="flex flex-col items-center text-center">
                  <div className="relative w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl mb-3 z-10">
                    {step.icon}
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-syne font-700 text-white">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-syne font-600 text-slate-200 mb-1">{step.title}</h3>
                  <p className="text-slate-600 text-sm font-body">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="mt-16 text-center text-slate-700 text-xs font-body">
          Built with Next.js, TypeScript, Tailwind CSS & Claude AI
        </div>
      </div>
    </main>
  );
}
