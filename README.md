# Mini ESG Report Pipeline

**Live Demo**: https://coback-esg.vercel.app/

A simplified end-to-end ESG reporting feature with data entry, persistent storage, visualization, AI strategy generation, and PDF report download.

## Tech Stack

- **Framework**: Next.js 16 (Pages Router) with TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Charts**: Recharts (bar chart with per-scope coloring)
- **AI**: OpenAI GPT-4o-mini (optional) with deterministic mock fallback
- **PDF**: @react-pdf/renderer (SVG-based charts in PDF)
- **Storage**: Server-side JSON file (`data/esg-data.json`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

### A) Data Entry & Storage
- Form with required fields (company name, reporting year, Scope 1/2 tCO2e) and optional fields (Scope 3, energy consumption, notes)
- Server-side validation + client-side validation with clear error messages
- Data persists to `data/esg-data.json` — survives page reload
- "View Results" button toggles between form and results view
- Saving new data clears previously generated strategies

### B) Visualization
- Data summary panel alongside the emissions bar chart in a side-by-side layout
- Bar chart with separate bars per scope: Scope 1 (red), Scope 2 (orange), Scope 3 (blue)
- Chart updates automatically after saving modified data
- Missing optional Scope 3 is handled gracefully

### C) Strategy Generation
- "Generate Strategy" button produces 3 text variants:
  - **Short**: 2-4 sentences (executive summary)
  - **Neutral**: 5-8 sentences (balanced analysis)
  - **Detailed**: Structured with specific measures and targets
- All variants reference the actual entered numbers
- User selects exactly one variant; selection persists across refresh

### D) Report Download (Bonus)
- PDF download containing emissions table, SVG chart, and selected strategy
- Generated client-side via @react-pdf/renderer with COBACK branding
- Selectable paper sizes: A4 (default), Letter, A3, Legal
- On-screen preview matching the selected paper size

## AI Integration

The strategy generation supports two modes:

1. **With OpenAI API key**: Set `OPENAI_API_KEY` in `.env.local` for real LLM-generated strategies using GPT-4o-mini
2. **Without API key (default)**: Uses a deterministic mock that generates contextually relevant strategies referencing the actual entered numbers

### Production Integration
To connect a real LLM in production:
1. Install the OpenAI SDK: `npm install openai`
2. Set `OPENAI_API_KEY` in environment variables
3. The system automatically detects the key and uses the OpenAI API
4. Falls back to mock if the API call fails

## AI Tools Usage

Claude Code (Anthropic) was used to assist with code generation and project scaffolding.

## Project Structure

```
pages/
  index.tsx            → Main page (state owner, form/results toggle)
  api/esg.ts           → GET/POST ESG data endpoint
  api/strategy.ts      → Strategy generation & selection endpoint
components/
  Navbar.tsx           → Top navigation bar with dark mode toggle
  EsgForm.tsx          → Data entry form with validation
  DataSummary.tsx      → Key-value summary of entered data
  EmissionsChart.tsx   → Recharts bar chart (separate bars per scope)
  StrategyPanel.tsx    → Strategy generation + variant selection
  ReportPreview.tsx    → PDF report preview + download (@react-pdf/renderer)
lib/
  types.ts             → TypeScript interfaces
  storage.ts           → JSON file read/write helpers
  generate-strategy.ts → OpenAI + mock strategy generation
data/
  esg-data.json        → Persisted ESG data (created at runtime)
```
