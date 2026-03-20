import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
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

const hasPdfApi = import.meta.env.VITE_PDF_API === '1' || import.meta.env.VITE_PDF_API === 'true'

export function SettingsPanel({
  markdown,
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
  const [generating, setGenerating] = useState(false)
  const [apiError, setApiError] = useState(null)
  const snippet = 'npx md-mermaid-pdf input.md output.pdf'

  const copySnippet = () => {
    navigator.clipboard.writeText(snippet)
  }

  const generatePdfLocal = async () => {
    if (!markdown?.trim()) {
      setApiError('Add some markdown first')
      return
    }
    setGenerating(true)
    setApiError(null)
    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          markdown,
          mermaidConfig: { theme: mermaidTheme },
          documentTheme: pageTheme,
          pdf_format: pdfFormat,
          margin,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'document.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setApiError(e.message)
    } finally {
      setGenerating(false)
    }
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
      <Dialog open={exportOpen} onOpenChange={(o) => { setExportOpen(o); setApiError(null) }}>
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
              {hasPdfApi
                ? 'Generate a real PDF from your markdown (requires the local PDF API running).'
                : 'PDF generation runs locally with npx md-mermaid-pdf. Start the API with npm run dev:api and VITE_PDF_API=1 for real PDF export.'}
            </DialogDescription>
          </DialogHeader>
          {hasPdfApi ? (
            <div className="mt-4 space-y-2">
              <Button
                className="w-full"
                size="sm"
                onClick={generatePdfLocal}
                disabled={generating}
              >
                {generating ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
                {generating ? 'Generating…' : 'Generate PDF (local)'}
              </Button>
              {apiError && (
                <p className="text-sm text-destructive">{apiError}</p>
              )}
            </div>
          ) : (
            <div className="flex gap-2 mt-4">
              <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono">
                {snippet}
              </code>
              <Button variant="outline" size="sm" onClick={copySnippet}>
                Copy
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
