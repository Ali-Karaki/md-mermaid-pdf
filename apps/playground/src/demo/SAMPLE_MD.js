export const SAMPLE_MD = `# Project Architecture

This document shows a simple service flow and a release sequence.

- Renders **Mermaid** in the preview
- Same fenced blocks work with the CLI for PDF

## Stack

\`\`\`text
Markdown → HTML → Mermaid.run() → Puppeteer → PDF
\`\`\`

## Service flow

\`\`\`mermaid
flowchart TD
    A[Client] --> B[API Gateway]
    B --> C[App Server]
    C --> D[Database]
\`\`\`

## Release flow

\`\`\`mermaid
sequenceDiagram
    participant Dev
    participant CI
    participant Prod
    Dev->>CI: Push code
    CI->>Prod: Deploy release
\`\`\`
`

export const EMPTY_MD = ''
