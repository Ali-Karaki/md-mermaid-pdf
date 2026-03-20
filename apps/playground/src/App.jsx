import { motion } from 'framer-motion'
import { Github, Package } from 'lucide-react'

const MotionSection = motion.section
const MotionLi = motion.li
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DemoSection } from '@/components/DemoSection'

const NPM_URL = 'https://www.npmjs.com/package/md-mermaid-pdf'
const GITHUB_URL = 'https://github.com/Ali-Karaki/md-mermaid-pdf'

function scrollToDemo() {
  document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
}

const trustBullets = [
  'No install needed for preview — try it in the browser',
  'Mermaid diagrams rendered, not shown as code blocks',
  'PDF export runs locally with npx md-mermaid-pdf',
  'Built for developers — drop-in replacement for md-to-pdf',
]

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 flex flex-col items-center px-6 py-16 md:py-24">
        <MotionSection
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            md-mermaid-pdf
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Markdown to PDF with Mermaid diagrams that actually render
          </p>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Not shown as plain code blocks — a drop-in fix for Mermaid in PDFs
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <Button size="lg" onClick={scrollToDemo}>
              Try the demo
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={NPM_URL} target="_blank" rel="noopener noreferrer">
                <Package className="size-4" />
                npm
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="size-4" />
                GitHub
              </a>
            </Button>
          </div>
        </MotionSection>

        <MotionSection
          className="w-full max-w-4xl mt-16 md:mt-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="border-border/60">
            <CardContent className="p-6 md:p-8">
              <ul className="grid gap-4 sm:grid-cols-2">
                {trustBullets.map((text, i) => (
                  <MotionLi
                    key={i}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <span className="text-primary mt-0.5 shrink-0">✓</span>
                    <span>{text}</span>
                  </MotionLi>
                ))}
              </ul>
            </CardContent>
          </Card>
        </MotionSection>

        <div className="w-full px-6">
          <DemoSection />
        </div>
      </main>

      <footer className="border-t border-border/60 py-6 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>MIT · Open source</span>
          <div className="flex gap-6">
            <a
              href={NPM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <Package className="size-4" />
              npm
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors inline-flex items-center gap-1.5"
            >
              <Github className="size-4" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
