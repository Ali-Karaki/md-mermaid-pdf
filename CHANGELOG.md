# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CLI `--watch` — rebuild PDF on file change

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
