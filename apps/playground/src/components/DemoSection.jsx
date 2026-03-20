import { useState } from 'react'
import { FileDown, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { MermaidPreview } from '@/components/MermaidPreview'
import { SAMPLE_MD, EMPTY_MD } from '@/demo/SAMPLE_MD'

export function DemoSection() {
  const [md, setMd] = useState(EMPTY_MD)

  return (
    <section id="demo" className="w-full max-w-6xl mx-auto mt-16 md:mt-24">
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
            <div className="min-h-[300px] border rounded-md bg-muted/30 overflow-auto">
              <MermaidPreview markdown={md} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="py-3">
            <h3 className="text-sm font-medium">Settings</h3>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            <p>Format, theme, margins — coming in next batch.</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile/Tablet: Tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="markdown" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
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
                <div className="min-h-[250px] border rounded-md bg-muted/30 overflow-auto">
                  <MermaidPreview markdown={md} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
