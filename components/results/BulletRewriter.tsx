'use client';

import { useState } from 'react';

interface BulletRewriterProps {
  role?: string;
}

export default function BulletRewriter({ role }: BulletRewriterProps) {
  const [bullet,      setBullet]      = useState('');
  const [result,      setResult]      = useState<{ improved: string; explanation: string } | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [copiedOrig,  setCopiedOrig]  = useState(false);
  const [copiedNew,   setCopiedNew]   = useState(false);

  const handleRewrite = async () => {
    if (!bullet.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res  = await fetch('/api/rewrite-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rewrite failed');
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string, which: 'orig' | 'new') => {
    await navigator.clipboard.writeText(text);
    if (which === 'orig') { setCopiedOrig(true); setTimeout(() => setCopiedOrig(false), 2000); }
    else                  { setCopiedNew(true);  setTimeout(() => setCopiedNew(false),  2000); }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 fade-up">
      <h3 className="font-syne font-700 text-white text-lg mb-1">✍️ Bullet Point Rewriter</h3>
      <p className="text-slate-500 text-xs font-body mb-5">
        Paste any weak bullet point and get an AI-powered rewrite with strong action verbs and metrics.
      </p>

      <textarea
        rows={3}
        placeholder="e.g. Helped with the development of the new payment system..."
        value={bullet}
        onChange={(e) => setBullet(e.target.value)}
        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-3
          text-slate-200 placeholder:text-slate-600 text-sm font-body leading-relaxed
          focus:outline-none focus:border-blue-500 transition-colors resize-none"
      />

      <button
        type="button"
        onClick={handleRewrite}
        disabled={!bullet.trim() || loading}
        className="mt-3 px-5 py-2.5 rounded-lg bg-linear-to-r from-blue-600 to-violet-600
          text-white font-syne font-600 text-sm transition-all
          hover:shadow-[0_0_20px_rgba(99,102,241,0.35)]
          disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Rewriting…
          </span>
        ) : (
          '⚡ Rewrite Bullet'
        )}
      </button>

      {error && (
        <p className="mt-3 text-rose-400 text-sm font-body">{error}</p>
      )}

      {result && (
        <div className="mt-5 rounded-xl overflow-hidden border border-slate-700">
          {/* Before */}
          <div className="bg-rose-500/5 border-b border-slate-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-rose-400 text-xs font-syne font-600 uppercase tracking-wider">Before</span>
              <button
                type="button"
                onClick={() => copy(bullet, 'orig')}
                className="text-slate-600 hover:text-slate-400 text-xs font-body transition-colors"
              >
                {copiedOrig ? '✓ Copied' : 'Copy'}
              </button>
            </div>
            <p className="text-slate-400 text-sm font-body leading-relaxed">{bullet}</p>
          </div>

          {/* After */}
          <div className="bg-emerald-500/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-400 text-xs font-syne font-600 uppercase tracking-wider">After ✨</span>
              <button
                type="button"
                onClick={() => copy(result.improved, 'new')}
                className="text-slate-400 hover:text-slate-200 text-xs font-body transition-colors border border-slate-600 px-2 py-0.5 rounded"
              >
                {copiedNew ? '✓ Copied!' : '⎘ Copy'}
              </button>
            </div>
            <p className="text-slate-100 text-sm font-body leading-relaxed font-500">{result.improved}</p>
            <p className="mt-3 text-blue-300/70 text-xs font-body border-t border-slate-700 pt-3">
              💡 {result.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
