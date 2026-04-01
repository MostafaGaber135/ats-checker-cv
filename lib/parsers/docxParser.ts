// ============================================================
// DOCX Text Extractor
// Uses mammoth to convert .docx files to plain text
// Preserves structure while stripping OOXML complexity
// ============================================================
import mammoth from 'mammoth';
import { ParsedFile } from '@/lib/types';

export async function parseDOCX(buffer: Buffer, fileName: string): Promise<ParsedFile> {
  try {
    // Extract raw text (better for ATS analysis than HTML)
    const result = await mammoth.extractRawText({ buffer });

    if (result.messages.length > 0) {
      // Log any conversion warnings (non-fatal)
      console.warn('[DOCX Parser] Conversion warnings:', result.messages);
    }

    const cleaned = result.value
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[^\S\n]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleaned || cleaned.length < 50) {
      throw new Error('DOCX file appears to be empty or contains only images.');
    }

    return {
      text: cleaned,
      fileName,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to parse DOCX';
    throw new Error(`DOCX parsing error: ${message}`);
  }
}
