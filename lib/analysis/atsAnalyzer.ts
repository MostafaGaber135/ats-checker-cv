// ============================================================
// ATS Analysis Engine
// Builds structured prompts for deep CV analysis via Groq
// Returns strongly-typed AnalysisResult
// ============================================================
import { AnalysisResult, AnalyzeRequest } from '@/lib/types';
import Groq from 'groq-sdk';

// ─── Client Factory ──────────────────────────────────────────
function createGroqClient() {
  const apiKey = process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(
      'مفتاح Groq غير موجود. أضف GROQ_API_KEY داخل ملف .env.local أو متغيرات البيئة.'
    );
  }

  return new Groq({ apiKey });
}

function mapGroqError(err: unknown): Error {
  const message = err instanceof Error ? err.message : '';

  if (
    message.includes('authentication') ||
    message.includes('invalid api key') ||
    message.includes('401')
  ) {
    return new Error(
      'فشل التحقق من Groq: مفتاح API غير صالح أو منتهي. تحقق من GROQ_API_KEY.'
    );
  }

  if (message.includes('rate_limit') || message.includes('429')) {
    return new Error('تجاوزت حد الطلبات. انتظر قليلاً ثم حاول مرة أخرى.');
  }

  return err instanceof Error
    ? err
    : new Error('حدث خطأ غير متوقع أثناء تحليل السيرة الذاتية.');
}

// ─── Prompt Builder ──────────────────────────────────────────
function buildAnalysisPrompt(req: AnalyzeRequest): string {
  return `You are an expert ATS (Applicant Tracking System) analyst and senior career coach with 15+ years of experience reviewing resumes for Fortune 500 companies. Perform a deep, realistic, and actionable analysis of the resume below.

${req.jobDescription ? `TARGET JOB DESCRIPTION:\n"""\n${req.jobDescription}\n"""\n` : ''}
${req.targetRole ? `TARGET ROLE: ${req.targetRole}\n` : ''}

RESUME TEXT:
"""
${req.cvText}
"""

Perform a comprehensive ATS analysis. Return ONLY valid JSON (no markdown, no explanation outside JSON) matching this exact structure:

{
  "atsScore": {
    "overall": <0-100 integer>,
    "subScores": {
      "keywords": <0-100>,
      "contentQuality": <0-100>,
      "structure": <0-100>,
      "impact": <0-100>,
      "skillsMatch": <0-100>
    },
    "grade": <"A"|"B"|"C"|"D"|"F">,
    "passesATS": <boolean, true if overall >= 70>
  },
  "sections": [
    {
      "name": <"Contact Information"|"Professional Summary"|"Work Experience"|"Education"|"Skills"|"Certifications"|"Projects"|"Awards">,
      "detected": <boolean>,
      "score": <0-100>,
      "strengths": [<specific strength strings>],
      "weaknesses": [<specific weakness strings>],
      "improvements": [<actionable specific improvement strings>],
      "rewrittenBullets": [
        { "original": <original bullet text>, "improved": <rewritten with strong action verb + metric> }
      ]
    }
  ],
  "keywords": {
    "matched": [<keywords found in both resume and JD>],
    "missing": [<important keywords from JD missing in resume>],
    "density": <0-100 percentage of keyword coverage>,
    "jobMatchPercent": <0-100>
  },
  "skills": {
    "technical": {
      "found": [<technical skills detected>],
      "missing": [<relevant technical skills not present>]
    },
    "soft": {
      "found": [<soft skills detected>],
      "missing": [<relevant soft skills not present>]
    }
  },
  "formattingIssues": [
    {
      "severity": <"high"|"medium"|"low">,
      "issue": <specific issue description>,
      "fix": <how to fix it>
    }
  ],
  "suggestions": [
    {
      "type": <"keyword"|"skill"|"achievement"|"summary"|"formatting"|"general">,
      "priority": <"critical"|"high"|"medium"|"low">,
      "suggestion": <specific actionable suggestion>,
      "example": <optional concrete example of the improved text>
    }
  ],
  "improvedSummary": <a rewritten professional summary that is ATS-optimized, 3-4 sentences>,
  "executiveSummary": <one paragraph overall honest assessment of this resume>,
  "roleAlignment": <detected or inferred target role>,
  "experienceLevel": <"entry"|"mid"|"senior"|"executive">
}

SCORING RULES (be honest, not generous):
- keywords (${req.jobDescription ? 'based on JD match' : 'general industry relevance'}): penalize heavily for missing critical terms
- contentQuality: check for action verbs, passive voice, vague language, quantified results
- structure: penalize missing sections, wrong order, no contact info, missing LinkedIn/GitHub
- impact: score based on measurable achievements (numbers, percentages, revenue, scale)
- skillsMatch: technical and soft skills alignment with ${req.targetRole || 'inferred role'}

CRITICAL RULES:
- Be SPECIFIC in feedback, never generic (e.g. "Add metrics to line 3" not "add more metrics")
- Rewrite at least 3 weak bullet points with strong action verbs and quantified results
- Missing sections that are standard must be flagged
- ATS formatting issues: tables, headers/footers, text boxes, special characters
- Do NOT be overly generous — give the score the resume actually deserves
- Provide exactly the JSON structure, nothing else`;
}

// ─── Main Analyzer ───────────────────────────────────────────
export async function analyzeCV(req: AnalyzeRequest): Promise<AnalysisResult> {
  const prompt = buildAnalysisPrompt(req);

  try {
    const client = createGroqClient();
    const modelName = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

    const completion = await client.chat.completions.create({
      model: modelName,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = completion.choices[0]?.message?.content ?? '';

    // Strip any accidental markdown fences
    const jsonText = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let result: AnalysisResult;
    try {
      result = JSON.parse(jsonText);
    } catch {
      console.error('[ATS Analyzer] Failed to parse LLM response:', jsonText.slice(0, 500));
      throw new Error('محرك التحليل أعاد استجابة غير صالحة. حاول مرة أخرى.');
    }

    return result;
  } catch (err: unknown) {
    throw mapGroqError(err);
  }
}
