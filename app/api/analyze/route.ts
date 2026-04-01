import { NextRequest, NextResponse } from 'next/server';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { parseDOCX } from '@/lib/parsers/docxParser';
import { analyzeCV } from '@/lib/analysis/atsAnalyzer';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_BYTES = 5 * 1024 * 1024;

function mapAnalyzeError(err: unknown): { message: string; status: number } {
  const message = err instanceof Error ? err.message : 'Internal server error';
  return { message, status: 500 };
}

export async function POST(req: NextRequest) {
  try {
    console.log('[/api/analyze] request started');

    const formData = await req.formData();
    console.log('[/api/analyze] formData parsed');

    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    console.log('[/api/analyze] file received:', {
      name: file.name,
      size: file.size,
      type: file.type,
    });

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

    const arrayBuffer = await file.arrayBuffer();
    console.log('[/api/analyze] arrayBuffer created');

    const buffer = Buffer.from(arrayBuffer);
    console.log('[/api/analyze] buffer created');

    const parsed = isPDF
      ? await parsePDF(buffer, file.name)
      : await parseDOCX(buffer, file.name);

    console.log('[/api/analyze] parsing done', {
      extractedLength: parsed?.text?.length || 0,
    });

    const wordCount = parsed.text.split(/\s+/).filter(Boolean).length;
    console.log('[/api/analyze] wordCount:', wordCount);

    if (wordCount < 30) {
      return NextResponse.json(
        {
          error: 'Could not extract enough text from the file. Ensure it is not scanned/image-based.',
        },
        { status: 422 }
      );
    }

    const jobDescription =
      (formData.get('jobDescription') as string | null)?.trim() || undefined;
    const targetRole =
      (formData.get('targetRole') as string | null)?.trim() || undefined;

    console.log('[/api/analyze] before analyzeCV', {
      hasJobDescription: !!jobDescription,
      hasTargetRole: !!targetRole,
      groqKeyExists: !!process.env.GROQ_API_KEY,
    });

    const result = await analyzeCV({
      cvText: parsed.text,
      jobDescription,
      targetRole,
    });

    console.log('[/api/analyze] analyzeCV success');

    return NextResponse.json({
      success: true,
      fileName: file.name,
      wordCount,
      result,
    });
  } catch (err: unknown) {
    console.error('[/api/analyze] ERROR FULL:', err);

    if (err instanceof Error) {
      console.error('[/api/analyze] ERROR MESSAGE:', err.message);
      console.error('[/api/analyze] ERROR STACK:', err.stack);
    }

    const { message, status } = mapAnalyzeError(err);
    return NextResponse.json({ error: message }, { status });
  }
}