# Examples

Example markdown files for `md-mermaid-pdf`. See the main [README](../README.md) for CLI usage.

**Export images:** `node examples/export-images.js` — writes PDF and SVG diagrams to `examples/diagrams/`.

| Folder | Description |
|--------|-------------|
| `sample.md` | General sample with flowchart and sequence diagram |
| `report/` | Multi-heading report with TOC and Mermaid (see [report/report.md](report/report.md)) |
| `docs/` | Docs-style example (see [docs/README.md](docs/README.md)) |
| `slides/` | Slide-style example (see [slides/README.md](slides/README.md)) |

```bash
npx md-mermaid-pdf examples/sample.md
npx md-mermaid-pdf examples/report/report.md -o report.pdf
npx md-mermaid-pdf examples/docs/getting-started.md
npx md-mermaid-pdf examples/slides/intro.md -o intro.pdf --slides
```
