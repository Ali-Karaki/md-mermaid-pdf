---
preset: github
toc: true
documentTheme: light
---

# Quarterly Report

A multi-section report example with table of contents and Mermaid diagrams.

## Executive summary

This document demonstrates `md-mermaid-pdf` with a report-style layout: headings, TOC, and embedded Mermaid diagrams.

## Process flow

```mermaid
flowchart TB
  subgraph Input
    A[Raw data]
    B[Requirements]
  end
  subgraph Analysis
    C[Process]
    D[Validation]
  end
  subgraph Output
    E[Report PDF]
  end
  A --> C
  B --> C
  C --> D
  D --> E
```

## Metrics

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|-----|
| Revenue | 100 | 120 | 135 | 150 |
| Growth  | —   | 20% | 12% | 11% |

## Timeline

```mermaid
gantt
  title Project phases
  dateFormat YYYY-MM-DD
  section Phase 1
  Planning    :a1, 2024-01-01, 30d
  Design      :a2, after a1, 20d
  section Phase 2
  Development :b1, after a2, 60d
  Testing     :b2, after b1, 15d
```

## Conclusion

Run: `npx md-mermaid-pdf examples/report/report.md` to generate the PDF.
