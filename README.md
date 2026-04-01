# ATS CV Checker

Production-ready AI-powered ATS resume analyzer. Upload a PDF or DOCX and get a real score with section feedback, keyword gaps, AI bullet rewrites, and a full action plan — in ~20 seconds.

## Features

- ATS Score 0–100 (5 sub-dimensions: Keywords, Content Quality, Structure, Impact, Skills Match)
- Keyword gap analysis vs. job description
- Section-by-section grading with specific feedback and AI-rewritten bullets
- Interactive bullet point rewriter (any bullet, on-demand)
- Skills matrix (technical + soft)
- ATS formatting issue detection
- AI-rewritten professional summary (copy-ready)
- Full .txt report download
- Role-based analysis (30+ roles)

## Tech Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Anthropic Claude (claude-opus-4-5-20251101)
- pdf-parse + mammoth for file parsing

## Setup

### 1. Install

    npm install

### 2. Environment

    cp .env.example .env.local
    # Add your ANTHROPIC_API_KEY

### 3. Run

    npm run dev        # http://localhost:3000
    npm run build      # production build
    npm start          # production server

## Project Structure

    app/
      page.tsx                  # Landing page
      results/page.tsx          # Results dashboard
      api/analyze/route.ts      # Main analysis endpoint
      api/rewrite-bullet/route.ts
      api/export-report/route.ts
    components/
      upload/                   # UploadZone, RoleSelector, JobDescriptionInput, AnalyzingState
      results/                  # ScoreDashboard, KeywordsCard, SkillsCard, SectionsCard,
                                # FormattingCard, SuggestionsCard, ImprovedSummaryCard,
                                # BulletRewriter, DownloadReport
    lib/
      types/index.ts            # All TypeScript types
      utils.ts                  # Score helpers
      parsers/                  # pdfParser, docxParser
      analysis/atsAnalyzer.ts   # Claude prompt + result parser

## API Reference

### POST /api/analyze
Accepts multipart/form-data: file (PDF/DOCX, max 5MB), jobDescription (optional), targetRole (optional).
Returns full AnalysisResult JSON.

### POST /api/rewrite-bullet
Body: { bullet, role? }. Returns { improved, explanation }.

### POST /api/export-report
Body: { result, fileName }. Returns text/plain .txt attachment.

## Environment Variables

    ANTHROPIC_API_KEY=sk-ant-xxx   # Required
    ANTHROPIC_MODEL=...            # Optional, defaults to claude-opus-4-5-20251101

## Privacy

Resumes are never stored. Parsed in memory, result held in browser sessionStorage only.

## License

MIT
