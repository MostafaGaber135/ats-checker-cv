// ============================================================
// middleware.ts — Edge Middleware
// Adds security headers to every response and rate-limits
// the /api/analyze endpoint by IP (simple in-memory store).
// In production, swap the in-memory store for Redis/Upstash.
// ============================================================
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limit: 10 requests per IP per 10 minutes
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX       = 10;

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // New window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}

// Clean up old entries every hour to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 60 * 60 * 1000);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Rate limit analysis endpoint ─────────────────────────
  if (pathname === '/api/analyze' && req.method === 'POST') {
    const ip = getClientIP(req);
    const { allowed, remaining } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before analyzing again.' },
        {
          status: 429,
          headers: {
            'Retry-After': '600',
            'X-RateLimit-Limit':     String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const res = NextResponse.next();
    res.headers.set('X-RateLimit-Limit',     String(RATE_LIMIT_MAX));
    res.headers.set('X-RateLimit-Remaining', String(remaining));
    applySecurityHeaders(res);
    return res;
  }

  // ── Apply security headers to all responses ───────────────
  const res = NextResponse.next();
  applySecurityHeaders(res);
  return res;
}

function applySecurityHeaders(res: NextResponse) {
  // Prevent clickjacking
  res.headers.set('X-Frame-Options', 'DENY');
  // Stop MIME-type sniffing
  res.headers.set('X-Content-Type-Options', 'nosniff');
  // Referrer policy
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy — restrict sensitive APIs
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  // Basic XSS protection for older browsers
  res.headers.set('X-XSS-Protection', '1; mode=block');
  // HSTS (enable in production behind HTTPS)
  // res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
}

export const config = {
  matcher: [
    // Apply to all routes except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
