# Examples

Example markdown files for `md-mermaid-pdf`. See the main [README](../README.md) for CLI usage.

**Export images:** `node examples/export-images.js` — writes PDF and SVG diagrams to `examples/diagrams/`.

| Folder | Description |
|--------|-------------|
| `sample.md` | General sample with flowchart and sequence diagram |
| `docs/` | Docs-style example (architecture diagram) |
| `slides/` | Slide-style example |

```bash
npx md-mermaid-pdf examples/sample.md
npx md-mermaid-pdf examples/docs/getting-started.md
npx md-mermaid-pdf examples/slides/intro.md
```
