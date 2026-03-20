# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `mdToPdfBatch(paths, config, { concurrency })` — batch conversion
- CLI: multiple input files `md-mermaid-pdf a.md b.md`
- `beforeRender(page)`, `afterRender(page)` — async hooks for injecting CSS, tweak DOM
- `debug: true` — write intermediate HTML to `.md-mermaid-pdf-debug.html`, log Mermaid errors to stderr
- `mermaidWaitUntil`, `mermaidRenderTimeoutMs` — tune Mermaid render wait for CI-safe builds
- Package keywords: mermaid-diagrams, markdown-to-pdf, docs-generator, diagram-rendering
- Stronger README tagline
- README: "Why not md-to-pdf?" comparison table and SEO phrasing for mermaid-not-rendering-pdf
- README: Visual result section with before/after assets
- Examples: docs/ and slides/ templates with mermaid diagrams
- Smart Mermaid detection: skip Mermaid script when markdown has no ` ```mermaid ` block (faster, no network)
- `mermaidSource: 'cdn' | 'bundled' | 'auto'` — use bundled Mermaid for offline/CI (no network)
- `mermaid` package as dependency for bundled mode
- `mermaidConfig` — pass options to `mermaid.initialize()` (theme, flowchart, etc.)

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

[Unreleased]: https://github.com/Ali-Karaki/md-mermaid-pdf/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/Ali-Karaki/md-mermaid-pdf/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Ali-Karaki/md-mermaid-pdf/releases/tag/v0.1.0
