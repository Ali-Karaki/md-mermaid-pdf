# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Docs:** live demo links and **`package.json` `homepage`** point at the **Railway** deployment (not Vercel); marketing-site section matches **`dev:api` + Vite proxy** (no `VITE_PDF_API`)
- **Playground removed from this repo** — the Vite marketing + demo app now lives in [**md-mermaid-pdf-site**](https://github.com/Ali-Karaki/md-mermaid-pdf-site). CI workflow `playground.yml` removed; use that repository’s workflow instead.

### Added

- CLI `--theme`, `--mermaid-source`, `--document-theme` — Mermaid theme and source selection
- CLI glob expansion (fast-glob): `npx md-mermaid-pdf "docs/**/*.md"`
- CLI stdout: `-o -` writes PDF to stdout for piping
- CDN preflight fallback: when `mermaidSource` is CDN or auto, preflight CDN and fall back to bundled Mermaid on failure
- `mermaidAutofix: true` — optional regex transforms on mermaid blocks (e.g. trim trailing whitespace)
- `documentTheme: 'light' | 'dark'` — preset body styles for dark/light PDF pages
- `outputCache: true | { dir }` — hash-based cache to skip conversion when input unchanged
- `hashOutput: true` — emit `<dest>.sha256` sidecar after PDF write
- Front matter `md_mermaid_pdf:` namespace — nest options to avoid YAML collisions (see README)
- Examples: `report/report.md`, docs/slides README pointers
- `scripts/capture-readme-assets.mjs` — generate sample.pdf and PNG screenshots (poppler)
- NestJS recipe in [docs/recipes.md](docs/recipes.md)
- Marketing site (now **md-mermaid-pdf-site** repo): optional local PDF API (`npm run dev:api` + `npm run dev` with Vite `/api` proxy); production deploy on Railway (Docker) serves `/api/pdf`
- `mdToPdfAuto(inputPath, partialConfig?)` — zero-config: basedir, dest beside input, mermaidSource auto
- CLI alias: `npx mmdpdf` (shorter than `md-mermaid-pdf`)
- `docs/recipes.md` — integration snippets for Express, Next.js API route, GitHub Action
- `mdToPdfFromFiles(paths, config, { separator })` — concatenate multiple .md files into one PDF
- CLI `--concat a.md b.md -o book.pdf`; front-matter: only first file used (see [docs/compose.md](docs/compose.md))
- `mdToPdfBatch` incremental mode: `{ incremental: true, cacheDir }` skips unchanged files; [docs/determinism.md](docs/determinism.md) documents PDF non-determinism
- Richer Mermaid errors: include diagram count when multiple diagrams; `onMermaidError: (err, meta) => 'skip' | 'throw'` for soft-fail
- `preset: 'slides'` — landscape, larger text, `---` as page breaks
- Vite + React web demo — see **md-mermaid-pdf-site** repository (Mermaid preview; real PDF from browser needs local API + CLI stack)
- `packages/vscode-md-mermaid-pdf` — VS Code extension scaffold (Export Markdown to PDF command)
- Docker: `Dockerfile` and README section for containerized usage
- GitHub Action: composite action in `action/` wrapping `npx md-mermaid-pdf`
- `mermaidExportImages` — export Mermaid diagrams to PNG or SVG
- `failOnMermaidError: true` — throw on Mermaid parse errors
- `toc: true` — heading-based table of contents
- Style presets: `preset: 'github'` and `preset: 'minimal'` for bundled CSS
- CLI `--watch` — rebuild PDF on file change
- `mdToPdfBatch(paths, config, { concurrency })` — batch conversion
- CLI: multiple input files `md-mermaid-pdf a.md b.md`
- `beforeRender(page)`, `afterRender(page)` — async hooks for injecting CSS, tweak DOM
- `debug: true` — write intermediate HTML to `.md-mermaid-pdf-debug.html`, log Mermaid errors to stderr
- `mermaidWaitUntil`, `mermaidRenderTimeoutMs` — tune Mermaid render wait for CI-safe builds
- Package keywords: mermaid-diagrams, markdown-to-pdf, docs-generator, diagram-rendering
- Stronger README tagline
- README: "Why not md-to-pdf?" comparison table and SEO phrasing for mermaid-not-rendering-pdf
- Examples: docs/ and slides/ templates with mermaid diagrams
- Smart Mermaid detection: skip Mermaid script when markdown has no ` ```mermaid ` block (faster, no network)
- `mermaidSource: 'cdn' | 'bundled' | 'auto'` — use bundled Mermaid for offline/CI (no network)
- `mermaid` package as dependency for bundled mode
- `mermaidConfig` — pass options to `mermaid.initialize()` (theme, flowchart, etc.)

## [0.1.4] - 2026-03-21

### Fixed

- Resolve preset CSS via `require.resolve('md-mermaid-pdf/package.json')` + `presets/` (better for static analysis / bundlers than `__dirname/../presets`)
- Export `./package.json` in `package.json` `exports` so `require.resolve('md-mermaid-pdf/package.json')` is valid under Node’s package exports rules

## [0.1.3] - 2026-03-21

### Removed

- README “Visual result” / before–after comparison; `assets/before-code-block.svg` and `assets/after-rendered.svg`

## [0.1.2] - 2026-03-21

### Changed

- README: npmjs.com rendering — absolute URLs for comparison images and docs links; npm version badge; quick links table (live demo, repository, issues); marketing section leads with hosted demo URL

## [0.1.1] - 2025-03-20

### Changed

- CI: use npm Trusted Publishing (OIDC), drop NPM_TOKEN
- CI: workflow permissions, latest npm, `--provenance` for publish
- Engines: Node ≥ 20.16, npm ≥ 10.8
- Package metadata: author, homepage, bugs

## [0.1.0] - 2025-03-20

### Added

- Initial release: Markdown to PDF with Mermaid diagrams via md-to-pdf + Puppeteer
- CLI and programmatic API (`mdToPdf`)
- Configurable Mermaid CDN URL

[Unreleased]: https://github.com/Ali-Karaki/md-mermaid-pdf/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/Ali-Karaki/md-mermaid-pdf/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/Ali-Karaki/md-mermaid-pdf/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/Ali-Karaki/md-mermaid-pdf/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Ali-Karaki/md-mermaid-pdf/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Ali-Karaki/md-mermaid-pdf/releases/tag/v0.1.0
