// ============================================================
// POST /api/rewrite-bullet
// Body: { bullet: string; role?: string; context?: string }
// Returns: { improved: string; explanation: string }
// Allows the UI to request on-demand rewrites of any bullet.
// Powered by Groq (Llama 3)
// ============================================================
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY ?? '' });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bullet, role, context } = body as {
      bullet: string;
      role?: string;
      context?: string;
    };

    if (!bullet || bullet.trim().length < 5) {
      return NextResponse.json({ error: 'No bullet text provided.' }, { status: 400 });
    }

    const prompt = `You are an expert resume writer specializing in ATS-optimized resumes.

Rewrite the following resume bullet point to be stronger, more impactful, and ATS-friendly.

RULES:
- Start with a strong past-tense action verb (Led, Built, Increased, Reduced, Designed, etc.)
- Add or infer quantified metrics if none exist (e.g. "improved performance by ~30%")
- Be specific about the outcome or impact
- Keep it to one concise sentence (max 20 words)
- Do NOT use buzzwords like "leveraged", "synergized", "utilized"
- Do NOT start with "I"
${role ? `- Tailor for a ${role} role` : ''}
${context ? `- Context: ${context}` : ''}

ORIGINAL BULLET:
"${bullet}"

Return ONLY valid JSON, no markdown:
{
  "improved": "<rewritten bullet>",
  "explanation": "<one sentence explaining the key improvement made>"
}`;

    const modelName = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

    const completion = await client.chat.completions.create({
      model: modelName,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const rawText = completion.choices[0]?.message?.content ?? '';
    const clean = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error('[/api/rewrite-bullet]', err);
    const message = err instanceof Error ? err.message : 'Rewrite failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
