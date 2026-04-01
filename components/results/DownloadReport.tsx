'use client';

import { useState } from 'react';
import { AnalysisResult } from '@/lib/types';

interface DownloadReportProps {
  result: AnalysisResult;
  fileName: string;
}

export default function DownloadReport({ result, fileName }: DownloadReportProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/export-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result, fileName }),
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `ats-report-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700
          bg-slate-800/60 text-slate-300 text-sm font-body hover:border-slate-500
          hover:text-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-slate-600 border-t-slate-300 rounded-full animate-spin" />
            Exporting…
          </>
        ) : (
          <>
            ⬇ Download Full Report
          </>
        )}
      </button>
      {error && <p className="text-rose-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
