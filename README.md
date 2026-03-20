# md-mermaid-pdf

Convert Markdown to PDF with **[Mermaid](https://mermaid.js.org/)** diagrams rendered (not shown as plain code blocks).

Built on **[md-to-pdf](https://github.com/simonhaenisch/md-to-pdf)** (Marked + Puppeteer). Same configuration surface as `md-to-pdf`, with:

- Fenced ` ```mermaid ` blocks turned into `<div class="mermaid">` for the browser
- Mermaid loaded from a CDN (configurable), then `await mermaid.run()` before `page.pdf()`

Requires network access at PDF generation time unless you inject a local script via `config.script`.

## Install

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
```

## CLI

```bash
npx md-mermaid-pdf input.md
npx md-mermaid-pdf input.md output.pdf
```

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
