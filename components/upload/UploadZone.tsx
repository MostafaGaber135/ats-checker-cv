'use client';

import { useCallback, useState } from 'react';

interface UploadZoneProps {
  file: File | null;
  onChange: (f: File | null) => void;
}

const ACCEPTED = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_MB = 5;

export default function UploadZone({ file, onChange }: UploadZoneProps) {
  const [isDragging, setDragging] = useState(false);
  const [uploadError, setError]   = useState<string | null>(null);

  const validate = (f: File): string | null => {
    if (!ACCEPTED.includes(f.type) && !f.name.match(/\.(pdf|docx)$/i))
      return 'Please upload a PDF or DOCX file.';
    if (f.size > MAX_MB * 1024 * 1024)
      return `File must be under ${MAX_MB} MB.`;
    return null;
  };

  const handleFile = useCallback((f: File) => {
    const err = validate(f);
    if (err) { setError(err); return; }
    setError(null);
    onChange(f);
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    if (chosen) handleFile(chosen);
  }, [handleFile]);

  const fileIcon = file?.name.endsWith('.pdf') ? '📄' : file ? '📝' : '📤';

  return (
    <div>
      <label
        htmlFor="cv-upload"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          relative flex flex-col items-center justify-center gap-4 p-10 rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-blue-400 bg-blue-500/10 scale-[1.01]'
            : file
            ? 'border-emerald-500/50 bg-emerald-500/5'
            : 'border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/60'
          }
        `}
      >
        <input
          id="cv-upload"
          type="file"
          accept=".pdf,.docx"
          className="sr-only"
          onChange={onInput}
        />

        {file ? (
          <>
            <div className="text-5xl">{fileIcon}</div>
            <div className="text-center">
              <p className="text-emerald-400 font-syne font-600 text-lg">{file.name}</p>
              <p className="text-slate-500 text-sm mt-1">
                {(file.size / 1024).toFixed(0)} KB · Click to replace
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onChange(null); }}
              className="absolute top-3 right-3 text-slate-600 hover:text-slate-300 text-xl leading-none"
            >
              ×
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl">
              📤
            </div>
            <div className="text-center">
              <p className="text-slate-300 font-syne font-600 text-lg">
                Drop your resume here
              </p>
              <p className="text-slate-500 text-sm mt-1">
                PDF or DOCX · Max {MAX_MB} MB
              </p>
            </div>
            <span className="px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm">
              Browse Files
            </span>
          </>
        )}
      </label>

      {uploadError && (
        <p className="mt-2 text-rose-400 text-sm text-center">{uploadError}</p>
      )}
    </div>
  );
}
