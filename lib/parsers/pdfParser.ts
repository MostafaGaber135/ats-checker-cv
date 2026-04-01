// ============================================================
// PDF Text Extractor
// Uses pdf-parse to extract raw text from PDF buffers
// ============================================================

import pdfParse from 'pdf-parse';
import { ParsedFile } from '@/lib/types';

export async function parsePDF(buffer: Buffer, fileName: string): Promise<ParsedFile> {
  try {
    const data = await pdfParse(buffer);

    const cleaned = data.text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[^\S\n]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleaned || cleaned.length < 50) {
      throw new Error('PDF appears to be scanned or image-based. Please provide a text-based PDF.');
    }

    return {
      text: cleaned,
      pageCount: data.numpages,
      fileName,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to parse PDF';
    throw new Error(`PDF parsing error: ${message}`);
  }
}
