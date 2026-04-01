// ============================================================
// useScoreHistory — persists up to 10 recent ATS scores
// in localStorage so users can track progress over time.
// ============================================================
'use client';

import { useEffect, useState, useCallback } from 'react';

export interface HistoryEntry {
  id: string;
  fileName: string;
  overallScore: number;
  grade: string;
  roleAlignment: string;
  analyzedAt: string; // ISO string
  subScores: {
    keywords: number;
    contentQuality: number;
    structure: number;
    impact: number;
    skillsMatch: number;
  };
}

const STORAGE_KEY = 'ats_score_history';
const MAX_ENTRIES = 10;

export function useScoreHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount (client-only)
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore malformed data */
    }
  }, []);

  // Persist whenever history changes
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      /* localStorage might be full */
    }
  }, [history, mounted]);

  /** Add a new entry; trims to MAX_ENTRIES */
  const addEntry = useCallback((entry: Omit<HistoryEntry, 'id' | 'analyzedAt'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id:          crypto.randomUUID(),
      analyzedAt:  new Date().toISOString(),
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, MAX_ENTRIES));
    return newEntry;
  }, []);

  /** Clear all history */
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addEntry, clearHistory, mounted };
}
