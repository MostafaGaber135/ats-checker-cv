// ============================================================
// POST /api/export-report
// Body: { result: AnalysisResult; fileName: string }
// Returns: plain-text ATS report as a downloadable .txt file
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { AnalysisResult } from '@/lib/types';

function buildReport(result: AnalysisResult, fileName: string): string {
  const line = '─'.repeat(60);
  const hr   = '═'.repeat(60);

  const gradeMap: Record<string, string> = {
    A: 'Excellent', B: 'Good', C: 'Needs Work', D: 'Poor', F: 'Critical',
  };

  const lines: string[] = [
    hr,
    '  ATS CV CHECKER — FULL ANALYSIS REPORT',
    hr,
    `  File       : ${fileName}`,
    `  Role       : ${result.roleAlignment || 'Not specified'}`,
    `  Level      : ${result.experienceLevel}`,
    `  Generated  : ${new Date().toUTCString()}`,
    hr,
    '',
    '  OVERALL ATS SCORE',
    line,
    `  Score  : ${result.atsScore.overall} / 100`,
    `  Grade  : ${result.atsScore.grade} — ${gradeMap[result.atsScore.grade] ?? ''}`,
    `  Status : ${result.atsScore.passesATS ? '✓ PASSES ATS threshold (≥70)' : '✗ FAILS ATS threshold (<70)'}`,
    '',
    '  SUB-SCORES',
    line,
    `  Keywords        : ${result.atsScore.subScores.keywords}/100`,
    `  Content Quality : ${result.atsScore.subScores.contentQuality}/100`,
    `  Structure       : ${result.atsScore.subScores.structure}/100`,
    `  Impact          : ${result.atsScore.subScores.impact}/100`,
    `  Skills Match    : ${result.atsScore.subScores.skillsMatch}/100`,
    '',
    '  OVERALL ASSESSMENT',
    line,
    ...wordWrap(result.executiveSummary, 58).map((l) => `  ${l}`),
    '',
  ];

  // Keywords
  lines.push('  KEYWORD ANALYSIS', line);
  lines.push(`  Keyword Density   : ${result.keywords.density}%`);
  if (result.keywords.jobMatchPercent > 0) {
    lines.push(`  Job Description Match : ${result.keywords.jobMatchPercent}%`);
  }
  lines.push('');
  lines.push('  Matched Keywords:');
  lines.push(`  ${result.keywords.matched.join(', ') || 'None detected'}`);
  lines.push('');
  lines.push('  Missing Keywords (add these):');
  lines.push(`  ${result.keywords.missing.join(', ') || 'None — great coverage!'}`);
  lines.push('');

  // Skills
  lines.push('  SKILLS ANALYSIS', line);
  lines.push('  Technical — Found:');
  lines.push(`  ${result.skills.technical.found.join(', ') || 'None detected'}`);
  lines.push('  Technical — Suggested to Add:');
  lines.push(`  ${result.skills.technical.missing.join(', ') || 'None'}`);
  lines.push('  Soft Skills — Found:');
  lines.push(`  ${result.skills.soft.found.join(', ') || 'None detected'}`);
  lines.push('  Soft Skills — Suggested to Add:');
  lines.push(`  ${result.skills.soft.missing.join(', ') || 'None'}`);
  lines.push('');

  // Sections
  lines.push('  SECTION-BY-SECTION ANALYSIS', line);
  for (const section of result.sections) {
    lines.push(`  ▶ ${section.name.toUpperCase()} — ${section.detected ? `Score: ${section.score}/100` : 'MISSING'}`);
    if (!section.detected) {
      lines.push(`    ✗ This section was not found. Add a "${section.name}" heading.`);
    } else {
      if (section.strengths.length) {
        lines.push('    Strengths:');
        section.strengths.forEach((s) => lines.push(`    • ${s}`));
      }
      if (section.weaknesses.length) {
        lines.push('    Weaknesses:');
        section.weaknesses.forEach((w) => lines.push(`    • ${w}`));
      }
      if (section.improvements.length) {
        lines.push('    How to Improve:');
        section.improvements.forEach((i) => lines.push(`    → ${i}`));
      }
      if (section.rewrittenBullets?.length) {
        lines.push('    AI-Rewritten Bullets:');
        section.rewrittenBullets.forEach((b) => {
          lines.push(`    BEFORE: ${b.original}`);
          lines.push(`    AFTER:  ${b.improved}`);
          lines.push('');
        });
      }
    }
    lines.push('');
  }

  // Formatting issues
  if (result.formattingIssues.length > 0) {
    lines.push('  ATS FORMATTING ISSUES', line);
    result.formattingIssues.forEach((f) => {
      lines.push(`  [${f.severity.toUpperCase()}] ${f.issue}`);
      lines.push(`         Fix: ${f.fix}`);
    });
    lines.push('');
  }

  // Improved summary
  if (result.improvedSummary) {
    lines.push('  AI-REWRITTEN PROFESSIONAL SUMMARY', line);
    wordWrap(result.improvedSummary, 58).forEach((l) => lines.push(`  ${l}`));
    lines.push('');
  }

  // Action plan
  lines.push('  ACTION PLAN (sorted by priority)', line);
  const order = ['critical', 'high', 'medium', 'low'];
  const sorted = [...result.suggestions].sort(
    (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority),
  );
  sorted.forEach((s, i) => {
    lines.push(`  ${i + 1}. [${s.priority.toUpperCase()}] ${s.suggestion}`);
    if (s.example) lines.push(`     Example: ${s.example}`);
  });
  lines.push('');
  lines.push(hr);
  lines.push('  Report generated by ATS CV Checker');
  lines.push('  Improve your resume and re-analyze to track your progress.');
  lines.push(hr);

  return lines.join('\n');
}

function wordWrap(text: string, maxLen: number): string[] {
  const words = text.split(' ');
  const result: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxLen) {
      if (current) result.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) result.push(current);
  return result;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { result, fileName } = body as { result: AnalysisResult; fileName: string };

    if (!result || !result.atsScore) {
      return NextResponse.json({ error: 'Invalid analysis result.' }, { status: 400 });
    }

    const report = buildReport(result, fileName || 'resume');

    return new NextResponse(report, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="ats-report-${Date.now()}.txt"`,
      },
    });
  } catch (err: unknown) {
    console.error('[/api/export-report]', err);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
