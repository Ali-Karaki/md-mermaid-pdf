# Multi-file composition

`mdToPdfFromFiles` concatenates multiple markdown files into a single PDF.

## Front matter

Only the **first file's** front matter is used. Subsequent files have their front matter stripped before concatenation, so YAML blocks in later files become plain content or are discarded (gray-matter parses the first `---` block only on the merged string).

**Recommendation:** Put shared config (title, pdf_options, mermaid theme) in the first file's front matter. Use plain markdown in the rest.

## API

```javascript
const { mdToPdfFromFiles } = require('md-mermaid-pdf');

await mdToPdfFromFiles(
  ['intro.md', 'chapter1.md', 'chapter2.md'],
  { dest: 'book.pdf', basedir: __dirname, toc: true },
  { separator: '\n\n---\n\n' },  // optional
);
```

## CLI

```bash
npx md-mermaid-pdf --concat intro.md chapter1.md chapter2.md -o book.pdf
```

`-o` or `--output` is required when using `--concat`.
