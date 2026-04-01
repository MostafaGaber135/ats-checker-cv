import type { Metadata } from 'next';
import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ats-checker.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default:  'ATS CV Checker — Score Your Resume Instantly',
    template: '%s | ATS CV Checker',
  },
  description:
    'AI-powered ATS resume analysis. Get a real score with section feedback, keyword gaps, bullet rewrites, and an action plan — in 20 seconds.',
  keywords: ['ATS checker', 'resume checker', 'CV analyzer', 'job application', 'AI resume feedback', 'ATS score'],
  openGraph: {
    title:       'ATS CV Checker — Score Your Resume Instantly',
    description: 'Upload your CV and get a real ATS score with keyword gap analysis, section feedback, and AI-rewritten bullet points.',
    url:         APP_URL,
    siteName:    'ATS CV Checker',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'ATS CV Checker — Score Your Resume',
    description: 'Real ATS analysis powered by AI. Score, feedback, rewrites, keyword gaps — in 20 seconds.',
  },
  robots: {
    index:  true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080c14] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
