import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

const MERMAID_THEMES = ['neutral', 'dark', 'default', 'forest', 'base']

export function MermaidPreview({ markdown, theme = 'neutral' }) {
  const ref = useRef(null)

  useEffect(() => {
    const validTheme = MERMAID_THEMES.includes(theme) ? theme : 'neutral'
    mermaid.initialize({ startOnLoad: false, theme: validTheme })
  }, [theme])

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const parts = markdown.split(/(```\s*mermaid\n[\s\S]*?```)/gi)
    let html = ''
    for (const p of parts) {
      const mm = p.match(/^```\s*mermaid\n([\s\S]*?)```$/i)
      if (mm) {
        const id = 'm-' + Math.random().toString(36).slice(2)
        html += `<div class="mermaid" id="${id}">${mm[1].trim()}</div>`
      } else {
        html += `<pre class="text-sm overflow-x-auto">${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`
      }
    }
    el.innerHTML = html
    mermaid.run({ nodes: el.querySelectorAll('.mermaid') }).catch(console.error)
  }, [markdown, theme])

  return <div ref={ref} className="min-h-[200px] p-4" />
}
