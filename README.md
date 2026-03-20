# md-mermaid-pdf

[![CI](https://github.com/Ali-Karaki/md-mermaid-pdf/actions/workflows/ci.yml/badge.svg)](https://github.com/Ali-Karaki/md-mermaid-pdf/actions/workflows/ci.yml)

**Live demo:** [md-mermaid-pdf-site.vercel.app](https://md-mermaid-pdf-site.vercel.app/)

**Markdown to PDF with Mermaid diagrams that actually render** — a drop-in replacement for md-to-pdf. No more Mermaid shown as plain code blocks; diagrams render in the final PDF.

### Why not md-to-pdf?

| Feature | md-to-pdf | md-mermaid-pdf |
|---------|-----------|----------------|
| Mermaid diagrams rendered | No (shows as code) | Yes |
| Same config surface | — | Yes (drop-in) |
| Zero extra setup for Mermaid | — | Yes |

Built on **[md-to-pdf](https://github.com/simonhaenisch/md-to-pdf)** (Marked + Puppeteer). Same configuration surface as `md-to-pdf`, with:

- Fenced ` ```mermaid ` blocks turned into `<div class="mermaid">` for the browser
- Mermaid loaded from a CDN (configurable), then `await mermaid.run()` before `page.pdf()`
- **Smart detection:** If the markdown has no ` ```mermaid ` block, the Mermaid script is skipped (faster, no network)

Requires network access at PDF generation time unless you inject a local script via `config.script`.

For `pdf_options`, `launch_options`, stylesheets, and other options, see the [md-to-pdf documentation](https://github.com/simonhaenisch/md-to-pdf#options).

**Export Mermaid images:** `mermaidExportImages: 'out/diagrams'` or `{ dir: 'out', format: 'svg' }` saves each diagram as PNG (default) or SVG.
**Fail on Mermaid error:** `failOnMermaidError: true` throws if Mermaid fails to parse a diagram (e.g. invalid syntax). Use `onMermaidError: (err, { diagramCount }) => 'skip'` to continue on error instead of throwing.
**Table of contents:** `toc: true` prepends a heading-based TOC to the document.
**Style presets:** `preset: 'github'`, `preset: 'minimal'`, or `preset: 'slides'` (landscape, full-page sections with `---` as slide breaks).

### Visual result

| Before (md-to-pdf) | After (md-mermaid-pdf) |
|--------------------|------------------------|
| Mermaid shown as code block | Diagram rendered in PDF |
| ![Before](assets/before-code-block.svg) | ![After](assets/after-rendered.svg) |

Run `npx md-mermaid-pdf examples/sample.md` to see the output. Maintainers: `npm run capture-readme-assets` generates `examples/sample.pdf` and, with [poppler](https://poppler.freedesktop.org/) installed, `assets/readme-sample.png` for README use.

## Docker

Build and run with Docker:

```bash
docker build -t md-mermaid-pdf .
docker run --rm -v "$(pwd):/work" -w /work md-mermaid-pdf input.md output.pdf
```

Mount your working directory at `/work` so the container can read your markdown and write the PDF.

## GitHub Action

A composite action is available in `action/`. Use it in a workflow:

```yaml
- uses: actions/checkout@v4
- uses: Ali-Karaki/md-mermaid-pdf/action@main
  with:
    input: docs/readme.md
    output: readme.pdf  # optional
```
## Install

Requires **Node ≥ 20.16** and **npm ≥ 10.8** (see `engines` in `package.json`).

```bash
npm install md-mermaid-pdf
```

## Programmatic use

```javascript
const { mdToPdf } = require('md-mermaid-pdf');

(async () => {
  await mdToPdf(
    { path: 'slides.md' },
    { dest: 'slides.pdf', basedir: __dirname },
  );
})();
```

**Zero-config:** `mdToPdfAuto('slides.md')` sets `basedir`, `dest` beside input, and `mermaidSource: 'auto'`:

```javascript
const { mdToPdfAuto } = require('md-mermaid-pdf');
await mdToPdfAuto('slides.md');  // writes slides.pdf
```

(`convertMdToPdfMermaid` also writes when `dest` is a non-empty path, matching `md-to-pdf`.)

Optional: override the Mermaid bundle URL, use bundled (offline), or pass Mermaid config:

```javascript
await mdToPdf({ path: 'doc.md' }, {
  dest: 'doc.pdf',
  basedir: __dirname,
  mermaidCdnUrl: 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js',
});

// Export Mermaid diagrams as images
await mdToPdf({ path: 'doc.md' }, {
  dest: 'doc.pdf',
  mermaidExportImages: { dir: 'diagrams', format: 'svg' },
});

// Throw on Mermaid parse errors
await mdToPdf({ path: 'doc.md' }, { dest: 'doc.pdf', failOnMermaidError: true });

// Table of contents
await mdToPdf({ path: 'doc.md' }, { dest: 'doc.pdf', toc: true });

// Style preset
await mdToPdf({ path: 'doc.md' }, { dest: 'doc.pdf', preset: 'github' });

// Slides: landscape, --- as slide breaks
await mdToPdf({ path: 'slides.md' }, { dest: 'slides.pdf', preset: 'slides' });

// Offline / CI: use bundled Mermaid (no network)
await mdToPdf({ path: 'doc.md' }, {
  dest: 'doc.pdf',
  basedir: __dirname,
  mermaidSource: 'bundled',  // or 'auto' — uses local mermaid package
});

// Customize Mermaid (theme, flowchart, etc.)
await mdToPdf({ path: 'doc.md' }, {
  dest: 'doc.pdf',
  basedir: __dirname,
  mermaidConfig: {
    theme: 'dark',
    flowchart: { curve: 'basis' },
  },
});

// Page hooks: inject CSS, tweak DOM before/after PDF
await mdToPdf({ path: 'doc.md' }, {
  dest: 'doc.pdf',
  basedir: __dirname,
  async beforeRender(page) {
    await page.addStyleTag({ content: 'body { font-size: 14px; }' });
  },
});
```

## CLI

```bash
npx md-mermaid-pdf input.md
npx md-mermaid-pdf input.md output.pdf
npx md-mermaid-pdf input.md --watch   # rebuild on save
npx md-mermaid-pdf slides.md --slides   # slides preset
npx md-mermaid-pdf a.md b.md c.md   # batch: each writes alongside
npx md-mermaid-pdf --concat a.md b.md -o book.pdf   # single PDF from multiple files
npx md-mermaid-pdf "docs/**/*.md"   # glob: expand to .md files
npx md-mermaid-pdf input.md -o -   # write PDF to stdout
npx md-mermaid-pdf input.md --theme dark   # Mermaid theme
npx mmdpdf input.md   # shorter alias
npx md-mermaid-pdf examples/sample.md
```

## Front matter

YAML front matter at the top of your markdown is parsed and merged into the config. Supported keys include `mermaidConfig`, `preset`, `toc`, `documentTheme`, `pdf_options`, and other md-to-pdf options.

```yaml
---
preset: github
toc: true
documentTheme: dark
mermaidConfig:
  theme: forest
pdf_options:
  format: A4
  margin: 20mm
---
```

To avoid collisions with unrelated YAML (e.g. CMS metadata), nest options under `md_mermaid_pdf`:

```yaml
---
title: My doc
md_mermaid_pdf:
  preset: slides
  toc: true
  mermaidConfig:
    theme: dark
---
```

## Integration recipes

See [docs/recipes.md](docs/recipes.md) for Express, Next.js API route, and GitHub Action snippets.

## Marketing site and VS Code extension

- **Marketing site / live demo:** [md-mermaid-pdf-site](https://github.com/Ali-Karaki/md-mermaid-pdf-site) — Vite + React; hero, interactive Markdown + Mermaid preview, and marketing sections. Clone that repo and run `npm ci && npm run dev`. Optional local PDF from the UI: `npm run dev:api` plus `VITE_PDF_API=1 npm run dev` (requires Node + Chromium via the `md-mermaid-pdf` package).
- **VS Code extension:** `packages/vscode-md-mermaid-pdf` — Command "Export Markdown to PDF (Mermaid)" for the active editor

## Module system

This library is **CommonJS** (`require`). Use `require('md-mermaid-pdf')` in Node. ESM `import` works only via interop (e.g. `createRequire` or bundler resolution).

## Troubleshooting

- **Offline / air-gapped:** Mermaid loads from a CDN by default. Use `config.script` to inject a local Mermaid bundle instead.
- **Puppeteer / Chromium on CI or Linux:** Puppeteer downloads Chromium on first run. On minimal Linux images, you may need `libgbm1`, `libnss3`, or similar. See [Puppeteer troubleshooting](https://pptr.dev/guides/configuration#chrome-does-not-launch-on-linux).
- **Debug:** `debug: true` writes intermediate HTML to `.md-mermaid-pdf-debug.html` and logs Mermaid errors to stderr.
- **CI / flaky renders:** Use `mermaidWaitUntil: 'domcontentloaded'` or `mermaidRenderTimeoutMs: 10000` to tune wait behavior.

## API exports

| Export | Purpose |
|--------|---------|
| `mdToPdf` | Main entry (default export), mirrors `md-to-pdf` + Mermaid |
| `mdToPdfAuto` | Zero-config: `mdToPdfAuto(path)` — basedir, dest, mermaidSource auto |
| `mdToPdfFromFiles` | Concatenate files into one PDF: `mdToPdfFromFiles(paths, config, { separator })` — see [docs/compose.md](docs/compose.md) |
| `mdToPdfBatch` | Convert multiple files: `mdToPdfBatch(paths, config, { concurrency, incremental, cacheDir })` — see [docs/determinism.md](docs/determinism.md) |
| `DEFAULT_MERMAID_CDN_URL` | Default jsDelivr URL pinned in this package |
| `createMermaidMarkedRenderer` | Marked renderer for ` ```mermaid ` only |
| `convertMdToPdfMermaid` | Lower level: HTML → PDF with Mermaid wait (expects merged md-to-pdf config + `browser`) |
| `generateOutputMermaid` | Lowest level: `generateOutput` fork |

## License

MIT
