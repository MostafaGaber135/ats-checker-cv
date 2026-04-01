// ============================================================
// ATS CV Checker — Core Type Definitions
// ============================================================

export interface SubScores {
  keywords: number;       // 0–100: keyword density & relevance
  contentQuality: number; // 0–100: writing quality, action verbs
  structure: number;      // 0–100: section completeness & order
  impact: number;         // 0–100: measurable achievements
  skillsMatch: number;    // 0–100: technical & soft skills alignment
}

export interface ATSScore {
  overall: number;        // Weighted composite 0–100
  subScores: SubScores;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  passesATS: boolean;     // Whether score exceeds 70
}

export interface SectionAnalysis {
  name: string;
  detected: boolean;
  score: number;          // 0–100
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  rewrittenBullets?: { original: string; improved: string }[];
}

export interface KeywordAnalysis {
  matched: string[];
  missing: string[];
  density: number;        // percentage
  jobMatchPercent: number;
}

export interface SkillsAnalysis {
  technical: { found: string[]; missing: string[] };
  soft: { found: string[]; missing: string[] };
}

export interface FormattingIssue {
  severity: 'high' | 'medium' | 'low';
  issue: string;
  fix: string;
}

export interface Suggestion {
  type: 'keyword' | 'skill' | 'achievement' | 'summary' | 'formatting' | 'general';
  priority: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
  example?: string;
}

export interface AnalysisResult {
  atsScore: ATSScore;
  sections: SectionAnalysis[];
  keywords: KeywordAnalysis;
  skills: SkillsAnalysis;
  formattingIssues: FormattingIssue[];
  suggestions: Suggestion[];
  improvedSummary?: string;
  executiveSummary: string;     // One-paragraph overall assessment
  roleAlignment: string;        // Detected or matched role
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
}

export interface AnalyzeRequest {
  cvText: string;
  jobDescription?: string;
  targetRole?: string;
}

export interface ParsedFile {
  text: string;
  pageCount?: number;
  fileName: string;
}
