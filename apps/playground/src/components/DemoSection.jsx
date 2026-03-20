import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileDown, RotateCcw } from 'lucide-react'

const MotionSection = motion.section
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { MermaidPreview } from '@/components/MermaidPreview'
import { SettingsPanel } from '@/components/SettingsPanel'
import { SAMPLE_MD, EMPTY_MD } from '@/demo/SAMPLE_MD'

export function DemoSection() {
  const [md, setMd] = useState(EMPTY_MD)
  const [pdfFormat, setPdfFormat] = useState('A4')
  const [pageTheme, setPageTheme] = useState('dark')
  const [mermaidTheme, setMermaidTheme] = useState('neutral')
  const [margin, setMargin] = useState('20mm')

  const previewClass = pageTheme === 'light'
    ? 'min-h-[300px] border rounded-md bg-white text-black overflow-auto'
    : 'min-h-[300px] border rounded-md bg-muted/30 overflow-auto'

  const previewClassMobile = pageTheme === 'light'
    ? 'min-h-[250px] border rounded-md bg-white text-black overflow-auto'
    : 'min-h-[250px] border rounded-md bg-muted/30 overflow-auto'

  return (
    <MotionSection
      id="demo"
      className="w-full max-w-6xl mx-auto mt-16 md:mt-24"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Demo</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setMd(SAMPLE_MD)}>
            <FileDown className="size-4" />
            Load example
          </Button>
          <Button variant="outline" size="sm" onClick={() => setMd(EMPTY_MD)}>
            <RotateCcw className="size-4" />
            Clear
          </Button>
        </div>
      </div>

      {/* Desktop: 3 columns */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-3">
            <h3 className="text-sm font-medium">Markdown</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <Textarea
              value={md}
              onChange={(e) => setMd(e.target.value)}
              placeholder="Paste Markdown with ```mermaid blocks…"
              className="min-h-[300px] font-mono text-sm resize-y"
              spellCheck={false}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <h3 className="text-sm font-medium">Preview</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={previewClass}>
              <MermaidPreview markdown={md} theme={mermaidTheme} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <h3 className="text-sm font-medium">Settings</h3>
          </CardHeader>
          <CardContent className="pt-0">
            <SettingsPanel
              markdown={md}
              pdfFormat={pdfFormat}
              onPdfFormatChange={setPdfFormat}
              pageTheme={pageTheme}
              onPageThemeChange={setPageTheme}
              mermaidTheme={mermaidTheme}
              onMermaidThemeChange={setMermaidTheme}
              margin={margin}
              onMarginChange={setMargin}
            />
          </CardContent>
        </Card>
      </div>

      {/* Mobile/Tablet: Tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="markdown" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="markdown">
            <Card>
              <CardContent className="p-4">
                <Textarea
                  value={md}
                  onChange={(e) => setMd(e.target.value)}
                  placeholder="Paste Markdown with ```mermaid blocks…"
                  className="min-h-[250px] font-mono text-sm resize-y"
                  spellCheck={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview">
            <Card>
              <CardContent className="p-4">
                <div className={previewClassMobile}>
                  <MermaidPreview markdown={md} theme={mermaidTheme} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardContent className="p-4">
                <SettingsPanel
                  markdown={md}
                  pdfFormat={pdfFormat}
                  onPdfFormatChange={setPdfFormat}
                  pageTheme={pageTheme}
                  onPageThemeChange={setPageTheme}
                  mermaidTheme={mermaidTheme}
                  onMermaidThemeChange={setMermaidTheme}
                  margin={margin}
                  onMarginChange={setMargin}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MotionSection>
  )
}
