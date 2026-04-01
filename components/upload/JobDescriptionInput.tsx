'use client';

import { useState } from 'react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (v: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors font-body"
      >
        <span className={`text-blue-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>▶</span>
        {open ? 'Hide' : 'Paste'} Job Description{' '}
        <span className="text-slate-600">(optional — enables keyword matching)</span>
      </button>

      {open && (
        <div className="mt-3">
          <textarea
            rows={8}
            placeholder="Paste the full job description here…&#10;The more detail, the better the keyword and skills matching will be."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-3
              text-slate-200 placeholder:text-slate-600 text-sm font-body leading-relaxed
              focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
          {value && (
            <p className="text-slate-600 text-xs mt-1 text-right">
              {value.split(/\s+/).length} words
            </p>
          )}
        </div>
      )}
    </div>
  );
}
