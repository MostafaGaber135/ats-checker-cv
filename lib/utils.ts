// ============================================================
// Shared utility helpers
// ============================================================
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Return color token based on a 0–100 score */
export function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-rose-400';
}

/** Return background color for progress bars */
export function scoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400';
  if (score >= 60) return 'bg-amber-400';
  if (score >= 40) return 'bg-orange-400';
  return 'bg-rose-400';
}

/** Human-readable grade label */
export function gradeLabel(grade: string): string {
  const labels: Record<string, string> = {
    A: 'Excellent',
    B: 'Good',
    C: 'Needs Work',
    D: 'Poor',
    F: 'Critical',
  };
  return labels[grade] ?? grade;
}

/** Priority badge color */
export function priorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    case 'high':     return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'medium':   return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    default:         return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
}

/** Severity badge color */
export function severityColor(severity: string): string {
  switch (severity) {
    case 'high':   return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    case 'medium': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    default:       return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
}
