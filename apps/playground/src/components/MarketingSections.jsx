import { motion } from 'framer-motion'
import { FileText, Play, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const MotionSection = motion.section

const howItWorksSteps = [
  { icon: FileText, title: 'Write Markdown', desc: 'Add your content and Mermaid diagrams in fenced code blocks.' },
  { icon: Play, title: 'Preview', desc: 'See diagrams rendered in the browser—no install needed.' },
  { icon: Download, title: 'Export PDF', desc: 'Run npx md-mermaid-pdf to generate PDFs with rendered diagrams.' },
]

const features = [
  'Mermaid diagrams rendered, not shown as code',
  'Same config surface as md-to-pdf',
  'Zero extra setup for Mermaid',
  'CDN or bundled Mermaid (offline CI)',
  'TOC, presets (github, minimal, slides)',
  'Export diagrams as PNG/SVG',
]

const useCases = [
  'Technical documentation with flowcharts and sequence diagrams',
  'Architecture docs and system design',
  'Slides and presentations',
  'CI/CD pipelines (GitHub Action included)',
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
        className="w-full max-w-4xl mt-16 md:mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-8">Features</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-primary">•</span>
              {f}
            </li>
          ))}
        </ul>
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
              <p className="text-sm mt-2">Mermaid shown as plain code block in the PDF.</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-6">
              <h3 className="font-medium text-primary">md-mermaid-pdf</h3>
              <p className="text-sm mt-2">Diagrams rendered directly in the PDF.</p>
            </CardContent>
          </Card>
        </div>
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
