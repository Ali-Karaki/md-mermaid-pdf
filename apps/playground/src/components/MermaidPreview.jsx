import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

export function MermaidPreview({ markdown }) {
  const ref = useRef(null)

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' })
  }, [])

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
  }, [markdown])

  return <div ref={ref} className="min-h-[200px] p-4" />
}
