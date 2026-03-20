import { motion } from 'framer-motion'
import { FileText, Play, Download, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const MotionSection = motion.section

const GITHUB_URL = 'https://github.com/Ali-Karaki/md-mermaid-pdf'
const README_URL = `${GITHUB_URL}#readme`

const howItWorksSteps = [
  { icon: FileText, title: 'Write Markdown', desc: 'Add your content and Mermaid diagrams in fenced ` ```mermaid ` blocks.' },
  { icon: Play, title: 'Render Mermaid', desc: 'Tool builds HTML, loads Mermaid (CDN, bundled, or auto with fallback), runs mermaid.run().' },
  { icon: Download, title: 'Export PDF', desc: 'Puppeteer prints to PDF. Smart detection: if no mermaid block, the script is skipped (faster, less network).' },
]

const comparisonRows = [
  { aspect: 'Mermaid in PDF', mdToPdf: 'Shown as code', ours: 'Rendered as diagrams' },
  { aspect: 'Config surface', mdToPdf: 'baseline', ours: 'Same baseline + Mermaid-specific options' },
  { aspect: 'Extra setup for diagrams', mdToPdf: 'Manual hacks', ours: 'Built-in' },
]

const featureGroups = [
  {
    title: 'Core',
    items: [
      'Mermaid diagrams render in PDF',
      'Drop-in API vs md-to-pdf (mdToPdf, pdf_options, launch_options)',
      'Input: { path } or { content }; dest: "" returns Buffer',
      'as_html: true — emit HTML instead of PDF',
    ],
  },
  {
    title: 'Mermaid & rendering',
    items: [
      'mermaidConfig → mermaid.initialize() (theme, flowchart, etc.)',
      'mermaidSource: cdn | bundled | auto',
      'mermaidCdnUrl override; CDN preflight with fallback to bundled',
      'mermaidWaitUntil, mermaidRenderTimeoutMs for CI',
      'failOnMermaidError, onMermaidError with diagram count',
      'mermaidAutofix — conservative transforms on mermaid blocks',
      'mermaidExportImages — export diagrams as PNG or SVG',
    ],
  },
  {
    title: 'Document styling',
    items: [
      'preset: github | minimal | slides (landscape, --- slide breaks)',
      'documentTheme: light | dark',
      'toc: true — heading-based table of contents',
      'beforeRender / afterRender page hooks',
      'debug: true — debug HTML file + stderr logging',
    ],
  },
  {
    title: 'CLI (md-mermaid-pdf / mmdpdf)',
    items: [
      'input.md → PDF beside file; input.md output.pdf',
      'Multiple inputs → batch (one PDF per file)',
      '--concat a.md b.md -o book.pdf',
      'Glob patterns: "docs/**/*.md"',
      '-o - / --output - — PDF to stdout',
      '--watch — single-file rebuild on save',
      '--slides, --theme, --document-theme, --mermaid-source',
    ],
  },
  {
    title: 'API & ecosystem',
    items: [
      'mdToPdf, mdToPdfAuto, mdToPdfFromFiles, mdToPdfBatch',
      'Docker, GitHub Action, VS Code extension',
      'Recipes: Express, Next.js, NestJS, GitHub Action',
      'Examples: sample, docs, slides, report',
      'YAML front matter; md_mermaid_pdf: namespace',
      'outputCache, hashOutput',
    ],
  },
]

const cliCommands = [
  'npx md-mermaid-pdf doc.md',
  'npx md-mermaid-pdf doc.md out.pdf',
  'npx md-mermaid-pdf "docs/**/*.md"',
  'npx md-mermaid-pdf --concat part1.md part2.md -o book.pdf',
  'npx md-mermaid-pdf doc.md -o - > out.pdf',
  'npx md-mermaid-pdf slides.md --slides',
  'npx mmdpdf doc.md   # alias',
]

const useCases = [
  'Engineering & architecture docs',
  'Runbooks, ADRs, internal wikis exported to PDF',
  'Reports, study notes, team handbooks',
  'Slide-style PDFs (preset: slides)',
  'CI-generated PDF artifacts (Action + mermaidSource: bundled)',
]

export function MarketingSections() {
  return (
    <>
      <MotionSection
        className="w-full max-w-4xl mt-20 md:mt-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.35 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-8">Why not md-to-pdf?</h2>
        <Card className="border-border/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left p-4 font-medium">Aspect</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">md-to-pdf</th>
                  <th className="text-left p-4 font-medium text-primary">md-mermaid-pdf</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-border/40 last:border-0">
                    <td className="p-4">{row.aspect}</td>
                    <td className="p-4 text-muted-foreground">{row.mdToPdf}</td>
                    <td className="p-4">{row.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </MotionSection>

      <MotionSection
        className="w-full max-w-4xl mt-20 md:mt-28"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.35 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-8">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {howItWorksSteps.map((item, i) => {
            const StepIcon = item.icon
            return (
              <Card key={i} className="border-border/60">
                <CardContent className="p-6 text-center">
                  <StepIcon className="mx-auto mb-3 size-8 text-primary" />
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </MotionSection>

      <MotionSection
        className="w-full max-w-5xl mt-16 md:mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-8">Features</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featureGroups.map((group, gi) => (
            <Card key={gi} className="border-border/60">
              <CardContent className="p-6">
                <h3 className="font-medium mb-3 text-sm">{group.title}</h3>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {group.items.map((item, ii) => (
                    <li key={ii} className="flex gap-1.5">
                      <span className="text-primary shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </MotionSection>

      <MotionSection
        className="w-full max-w-4xl mt-16 md:mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.35 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-8">Before vs after</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h3 className="font-medium text-muted-foreground">md-to-pdf</h3>
              <img src="/before-code-block.svg" alt="Mermaid shown as code block" className="mt-3 w-full max-w-sm h-auto rounded" />
              <p className="text-sm mt-2">Mermaid shown as plain code block in the PDF.</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h3 className="font-medium text-primary">md-mermaid-pdf</h3>
              <img src="/after-rendered.svg" alt="Mermaid rendered as diagram in PDF" className="mt-3 w-full max-w-[200px] h-auto" />
              <p className="text-sm mt-2">Diagrams rendered directly in the PDF.</p>
            </CardContent>
          </Card>
        </div>
      </MotionSection>

      <MotionSection
        className="w-full max-w-4xl mt-16 md:mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28, duration: 0.35 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-8">CLI cheat sheet</h2>
        <Card className="border-border/60">
          <CardContent className="p-6">
            <pre className="text-sm font-mono bg-muted/30 rounded-md p-4 overflow-x-auto">
              {cliCommands.join('\n')}
            </pre>
            <p className="text-xs text-muted-foreground mt-3">
              Windows: quote glob patterns so the shell does not expand them, e.g. <code className="rounded bg-muted/50 px-1">"docs/**/*.md"</code>.
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <a href={README_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4 mr-1.5" />
                Full README & programmatic API
              </a>
            </Button>
          </CardContent>
        </Card>
      </MotionSection>

      <MotionSection
        className="w-full max-w-4xl mt-16 md:mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.35 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-8">Use cases</h2>
        <ul className="space-y-2 text-sm text-muted-foreground max-w-xl mx-auto">
          {useCases.map((u, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-primary shrink-0">→</span>
              {u}
            </li>
          ))}
        </ul>
      </MotionSection>
    </>
  )
}
