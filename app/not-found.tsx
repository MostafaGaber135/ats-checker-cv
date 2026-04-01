import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-syne text-8xl font-800 text-slate-800 mb-4">404</div>
        <h1 className="font-syne text-2xl font-700 text-white mb-3">Page Not Found</h1>
        <p className="text-slate-500 font-body mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600
            text-white font-syne font-600 text-sm hover:opacity-90 transition-opacity"
        >
          ← Back to Analyzer
        </Link>
      </div>
    </main>
  );
}
