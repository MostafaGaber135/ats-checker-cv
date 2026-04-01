// ============================================================
// POST /api/analyze
// Accepts multipart form data: file (PDF/DOCX) + optional
// jobDescription and targetRole text fields.
// Returns AnalysisResult JSON.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { parseDOCX } from '@/lib/parsers/docxParser';
import { analyzeCV } from '@/lib/analysis/atsAnalyzer';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Max file size: 5 MB
const MAX_BYTES = 5 * 1024 * 1024;

function mapAnalyzeError(err: unknown): { message: string; status: number } {
  const message = err instanceof Error ? err.message : 'Internal server error';

  if (message.includes('مفتاح Groq غير موجود')) {
    return { message, status: 500 };
  }

  if (
    message.includes('مفتاح Groq غير صالح') ||
    message.includes('فشل التحقق من Groq') ||
    message.includes('GROQ_API_KEY')
  ) {
    return { message, status: 500 };
  }

  if (message.toLowerCase().includes('timeout')) {
    return {
      message: 'Analysis timed out. Please try again with a smaller file or try again in a moment.',
      status: 504,
    };
  }

  return { message, status: 500 };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ── 1. Validate and extract file ─────────────────────────
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5 MB.' },
        { status: 413 }
      );
    }

    const fileName = file.name.toLowerCase();
    const isPDF = fileName.endsWith('.pdf');
    const isDOCX = fileName.endsWith('.docx');

    if (!isPDF && !isDOCX) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or DOCX.' },
        { status: 415 }
      );
    }

    // ── 2. Parse file to text ─────────────────────────────────
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = isPDF
      ? await parsePDF(buffer, file.name)
      : await parseDOCX(buffer, file.name);

    // Sanity check: must have meaningful content
    const wordCount = parsed.text.split(/\s+/).filter(Boolean).length;
    if (wordCount < 30) {
      return NextResponse.json(
        {
          error:
            'Could not extract enough text from the file. Ensure it is not scanned/image-based.',
        },
        { status: 422 }
      );
    }

    // ── 3. Extract optional fields ───────────────────────────
    const jobDescription =
      (formData.get('jobDescription') as string | null)?.trim() || undefined;
    const targetRole =
      (formData.get('targetRole') as string | null)?.trim() || undefined;

    // ── 4. Run ATS analysis ───────────────────────────────────
    const result = await analyzeCV({
      cvText: parsed.text,
      jobDescription,
      targetRole,
    });

    // ── 5. Return result ──────────────────────────────────────
    return NextResponse.json({
      success: true,
      fileName: file.name,
      wordCount,
      result,
    });
  } catch (err: unknown) {
    console.error('[/api/analyze] Error full:', err);
    if (err instanceof Error && err.stack) {
      console.error('[/api/analyze] Error stack:', err.stack);
    }

    const { message, status } = mapAnalyzeError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
