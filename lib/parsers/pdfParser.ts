// ============================================================
// PDF Text Extractor
// Uses pdf-parse to extract raw text from PDF buffers
// ============================================================

// ── الكود القديم (pdf-parse v1) — تم تعليقه لأن v2 غيّر الـ API
// eslint-disable-next-line @typescript-eslint/no-require-imports
// const pdfParse = require('pdf-parse') as (buffer: Buffer, options?: object) => Promise<{ text: string; numpages: number }>;

// ── الكود الجديد: pdf-parse v2 يستخدم كلاس PDFParse بدلًا من دالة مباشرة
import { PDFParse } from 'pdf-parse';
import { ParsedFile } from '@/lib/types';

export async function parsePDF(buffer: Buffer, fileName: string): Promise<ParsedFile> {
  try {
    // pdf-parse v2: ننشئ instance بـ Uint8Array (Buffer متوافق)، ثم نستدعي getText()
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const data = await parser.getText({ pageJoiner: '\n' });

    // Clean up extracted text: normalize whitespace, remove control characters
    const cleaned = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[^\S\n]+/g, ' ')   // collapse horizontal whitespace
      .replace(/\n{3,}/g, '\n\n')   // max 2 consecutive newlines
      .trim();

    if (!cleaned || cleaned.length < 50) {
      throw new Error('PDF appears to be scanned or image-based. Please provide a text-based PDF.');
    }

    return {
      text: cleaned,
      // pageCount: data.numpages, // pdf-parse v1 كانت تُعيد numpages
      pageCount: data.pages.length, // pdf-parse v2 تُعيد مصفوفة pages
      fileName,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to parse PDF';
    throw new Error(`PDF parsing error: ${message}`);
  }
}
