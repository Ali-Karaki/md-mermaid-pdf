# md-mermaid-pdf playground

A minimal web demo for md-mermaid-pdf. Paste Markdown with Mermaid blocks, preview rendered output, and (mock) export PDF.

**Note:** Real PDF generation requires Node + Puppeteer and runs server-side. This app renders Mermaid in-browser for preview; the "Export PDF" action is a placeholder. Use `npx md-mermaid-pdf` for actual PDF generation.

## Run

```bash
cd apps/playground
npm install
npm run dev
```
