import { NextRequest, NextResponse } from 'next/server';
import { parseDOCX } from '@/lib/parsers/docxParser';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { analyzeCV } from '@/lib/analysis/atsAnalyzer';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
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
    const isDOCX = fileName.endsWith('.docx');
    const isPDF = fileName.endsWith('.pdf');

    if (!isDOCX && !isPDF) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a DOCX or PDF file.' },
        { status: 415 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parsed = isPDF
      ? await parsePDF(buffer, file.name)
      : await parseDOCX(buffer, file.name);

    const result = await analyzeCV({
      cvText: parsed.text,
      jobDescription: (formData.get('jobDescription') as string | null)?.trim() || undefined,
      targetRole: (formData.get('targetRole') as string | null)?.trim() || undefined,
    });

    return NextResponse.json({
      success: true,
      fileName: file.name,
      wordCount: parsed.text.split(/\s+/).filter(Boolean).length,
      result,
    });
  } catch (err: unknown) {
    console.error('[/api/analyze] DOCX debug error:', err);

    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}