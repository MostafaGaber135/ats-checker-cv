import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Required for pdf-parse and mammoth to work in Next.js server components
  serverExternalPackages: ['pdf-parse', 'mammoth'],

  // Enable standalone output for Docker deployment
  output: 'standalone',

  // Security: prevent index page from being crawled in preview/staging
  // headers() is used via proxy.ts for runtime headers

  // Increase the body size limit for file uploads (default 4MB)
  experimental: {},
};

export default nextConfig;
