import { useState, useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import './App.css'

const SAMPLE = `# Project Architecture

This document shows a simple service flow.

\`\`\`mermaid
flowchart TD
    A[Client] --> B[API Gateway]
    B --> C[App Server]
    C --> D[Database]
\`\`\`

## Release Flow

\`\`\`mermaid
sequenceDiagram
    participant Dev
    participant CI
    participant Prod
    Dev->>CI: Push code
    CI->>Prod: Deploy release
\`\`\`
`

function App() {
  const [md, setMd] = useState(SAMPLE)
  const previewRef = useRef(null)

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false, theme: 'neutral' })
  }, [])

  useEffect(() => {
    if (!previewRef.current) return
    const el = previewRef.current
    const parts = md.split(/(```mermaid\n[\s\S]*?```)/g)
    let html = ''
    for (const p of parts) {
      const mm = p.match(/^```mermaid\n([\s\S]*?)```$/)
      if (mm) {
        const id = 'm-' + Math.random().toString(36).slice(2)
        html += `<div class="mermaid" id="${id}">${mm[1].trim()}</div>`
      } else {
        html += `<pre>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`
      }
    }
    el.innerHTML = html
    mermaid.run({ nodes: el.querySelectorAll('.mermaid') }).catch(console.error)
  }, [md])

  return (
    <div className="app">
      <header>
        <h1>md-mermaid-pdf playground</h1>
        <p>Paste Markdown with Mermaid, preview below. PDF export requires <code>npx md-mermaid-pdf</code>.</p>
      </header>
      <div className="panels">
        <div className="panel">
          <h2>Markdown</h2>
          <textarea value={md} onChange={(e) => setMd(e.target.value)} spellCheck={false} />
        </div>
        <div className="panel">
          <h2>Preview</h2>
          <div ref={previewRef} className="preview" />
        </div>
      </div>
    </div>
  )
}

export default App
