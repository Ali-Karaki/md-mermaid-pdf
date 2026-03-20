# md-mermaid-pdf

[![CI](https://github.com/Ali-Karaki/md-mermaid-pdf/actions/workflows/ci.yml/badge.svg)](https://github.com/Ali-Karaki/md-mermaid-pdf/actions/workflows/ci.yml)

Convert Markdown to PDF with **[Mermaid](https://mermaid.js.org/)** diagrams rendered (not shown as plain code blocks).

Built on **[md-to-pdf](https://github.com/simonhaenisch/md-to-pdf)** (Marked + Puppeteer). Same configuration surface as `md-to-pdf`, with:

- Fenced ` ```mermaid ` blocks turned into `<div class="mermaid">` for the browser
- Mermaid loaded from a CDN (configurable), then `await mermaid.run()` before `page.pdf()`

Requires network access at PDF generation time unless you inject a local script via `config.script`.

For `pdf_options`, `launch_options`, stylesheets, and other options, see the [md-to-pdf documentation](https://github.com/simonhaenisch/md-to-pdf#options).

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

(`convertMdToPdfMermaid` also writes when `dest` is a non-empty path, matching `md-to-pdf`.)

Optional: override the Mermaid bundle URL:

```javascript
await mdToPdf({ path: 'doc.md' }, {
  dest: 'doc.pdf',
  basedir: __dirname,
  mermaidCdnUrl: 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js',
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
npx md-mermaid-pdf examples/sample.md
```

## Module system

This library is **CommonJS** (`require`). Use `require('md-mermaid-pdf')` in Node. ESM `import` works only via interop (e.g. `createRequire` or bundler resolution).

## Troubleshooting

- **Offline / air-gapped:** Mermaid loads from a CDN by default. Use `config.script` to inject a local Mermaid bundle instead.
- **Puppeteer / Chromium on CI or Linux:** Puppeteer downloads Chromium on first run. On minimal Linux images, you may need `libgbm1`, `libnss3`, or similar. See [Puppeteer troubleshooting](https://pptr.dev/guides/configuration#chrome-does-not-launch-on-linux).

## API exports

| Export | Purpose |
|--------|---------|
| `mdToPdf` | Main entry (default export), mirrors `md-to-pdf` + Mermaid |
| `DEFAULT_MERMAID_CDN_URL` | Default jsDelivr URL pinned in this package |
| `createMermaidMarkedRenderer` | Marked renderer for ` ```mermaid ` only |
| `convertMdToPdfMermaid` | Lower level: HTML → PDF with Mermaid wait (expects merged md-to-pdf config + `browser`) |
| `generateOutputMermaid` | Lowest level: `generateOutput` fork |

## License

MIT
