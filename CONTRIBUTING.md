# Contributing

## Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/Ali-Karaki/md-mermaid-pdf.git
   cd md-mermaid-pdf
   npm ci
   ```

2. Run tests:

   ```bash
   npm test
   ```

   Tests use Puppeteer and require network access (Mermaid CDN). Ensure you can reach the internet when running `npm test`.

## Pull requests

- Open a branch, make your changes, and run `npm test` before submitting.
- PRs target `main`; branch protection may require review before merge.
- For bug reports or feature ideas, use the [issue templates](.github/ISSUE_TEMPLATE/).
