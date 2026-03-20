# PDF determinism and caching

## PDF bytes are not deterministic

Across Puppeteer/Chrome versions, system fonts, or even different runs, the **exact PDF bytes** for the same input can differ. Timestamps, embedded metadata, and font subsetting contribute to this. Do not rely on byte-identical PDFs for caching or diffing.

## Input hashing for incremental batch

For `mdToPdfBatch` with `incremental: true`, we use a **content hash of the markdown input** (SHA-256) to decide whether to skip conversion. If the hash matches the cache and the output PDF exists, we skip. This speeds up repeated builds (e.g. docs pipelines) when only some files changed.

```javascript
await mdToPdfBatch(['a.md', 'b.md'], {}, {
  incremental: true,
  cacheDir: '.md-mermaid-pdf-cache',
});
```

Cache is stored in `cacheDir/batch-hash.json`. Add `cacheDir/` to `.gitignore`.

## CI caching

For CI, cache the `.md-mermaid-pdf-cache` directory between jobs. The hash is based on markdown content only; config changes (themes, margins) are not reflected. If you change config, clear the cache or use a different `cacheDir`.
