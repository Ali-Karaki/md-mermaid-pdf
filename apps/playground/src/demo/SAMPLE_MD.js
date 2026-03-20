export const SAMPLE_MD = `# Project Architecture

This document shows a simple service flow.

\`\`\`mermaid
flowchart TD
    A[Client] --> B[API Gateway]
    B --> C[App Server]
    C --> D[Database]
\`\`\`

## Release Flow

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
