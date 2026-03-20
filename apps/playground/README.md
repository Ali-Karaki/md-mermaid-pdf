# md-mermaid-pdf playground

A minimal web demo for md-mermaid-pdf. Paste Markdown with Mermaid blocks and preview rendered output. Use the CLI for PDF generation, or run the optional local PDF API for real PDF export from the UI.

This app implements [docs/website-prompt-exhaustive.md](../../docs/website-prompt-exhaustive.md); deploy from this directory (e.g. Vercel/Netlify root = `apps/playground`).

## Run

```bash
cd apps/playground
npm install
npm run dev
```

## Optional: real PDF from playground

For "Generate PDF (local)" in the Export dialog:

1. Run the PDF API: `npm run dev:api` (in a separate terminal)
2. Start the app with `VITE_PDF_API=1 npm run dev`

Requires Node + Chromium (Puppeteer). The API is local-only; not for static deploys unless hosted separately.
