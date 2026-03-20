# Integration recipes

Minimal examples for common server and CI setups.

## Express (buffer response)

```javascript
const express = require('express');
const { mdToPdf } = require('md-mermaid-pdf');
const path = require('path');

const app = express();

app.get('/pdf/:filename', async (req, res) => {
  const mdPath = path.join(__dirname, 'docs', `${req.params.filename}.md`);
  const result = await mdToPdf(
    { path: mdPath },
    { dest: '', basedir: path.dirname(mdPath) },
  );
  if (!result?.content) {
    return res.status(500).send('Failed to generate PDF');
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="doc.pdf"');
  res.send(result.content);
});
```

## Next.js API route

```javascript
// pages/api/pdf.js (Pages Router) or app/api/pdf/route.js (App Router)
import { mdToPdf } from 'md-mermaid-pdf';
import path from 'path';

export default async function handler(req, res) {
  const { file } = req.query;
  if (!file) return res.status(400).json({ error: '?file=path required' });

  const mdPath = path.join(process.cwd(), 'content', `${file}.md`);
  const result = await mdToPdf(
    { path: mdPath },
    { dest: '', basedir: path.dirname(mdPath) },
  );
  if (!result?.content) {
    return res.status(500).json({ error: 'PDF generation failed' });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="doc.pdf"');
  res.send(result.content);
}
```

## GitHub Action with local npm ci

When your Action needs to build PDFs from checked-out markdown:

```yaml
- uses: actions/checkout@v4

- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

- run: npm ci

- uses: Ali-Karaki/md-mermaid-pdf/action@main
  with:
    input: docs/readme.md
    output: dist/readme.pdf
```

Or with local package (no npm publish):

```yaml
- uses: actions/checkout@v4

- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

- run: npm ci

- run: npx md-mermaid-pdf docs/readme.md dist/readme.pdf
```

For offline / no CDN, add `mermaidSource: 'bundled'` via config or use the API directly in a custom step.
