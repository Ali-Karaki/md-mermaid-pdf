import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const PDF_FORMATS = ['A4', 'Letter']
const MERMAID_THEMES = ['neutral', 'dark', 'default', 'forest', 'base']
const MARGIN_PRESETS = ['20mm', '15mm', '25mm']

export function SettingsPanel({
  pdfFormat,
  onPdfFormatChange,
  pageTheme,
  onPageThemeChange,
  mermaidTheme,
  onMermaidThemeChange,
  margin,
  onMarginChange,
}) {
  const [exportOpen, setExportOpen] = useState(false)
  const snippet = 'npx md-mermaid-pdf input.md output.pdf'

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs">PDF format</Label>
        <Select value={pdfFormat} onValueChange={onPdfFormatChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PDF_FORMATS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Page theme</Label>
        <Select value={pageTheme} onValueChange={onPageThemeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="light">Light</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Mermaid theme</Label>
        <Select value={mermaidTheme} onValueChange={onMermaidThemeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MERMAID_THEMES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs">Margin</Label>
        <Select value={margin} onValueChange={onMarginChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MARGIN_PRESETS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" size="sm">
            <FileDown className="size-4" />
            Export PDF
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export PDF</DialogTitle>
            <DialogDescription>
              PDF generation runs locally with <code className="rounded bg-muted px-1">npx md-mermaid-pdf</code>.
              Use the CLI to generate PDFs from your Markdown files.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 mt-4">
            <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
              {snippet}
            </code>
            <Button variant="outline" size="sm" onClick={copySnippet}>
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
