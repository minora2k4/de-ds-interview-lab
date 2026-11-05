import { useEffect, useId, useState } from 'react'
import type { ConceptDiagram } from '@/domain/types'

/** Mermaid khá nặng nên chỉ tải khi trang thực sự có sơ đồ. */
async function renderDiagram(id: string, code: string): Promise<string> {
  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'dark',
    fontFamily: 'Inter Variable, system-ui, sans-serif',
    themeVariables: { fontSize: '14px' },
    // Giữ kích thước tự nhiên để chữ đọc được, sơ đồ rộng thì cuộn ngang trong khung.
    flowchart: { useMaxWidth: false },
    sequence: { useMaxWidth: false },
    state: { useMaxWidth: false },
    er: { useMaxWidth: false },
  })
  const { svg } = await mermaid.render(id, code)
  return svg
}

export function MermaidDiagram({ diagram }: { diagram: ConceptDiagram }) {
  const reactId = useId()
  const [result, setResult] = useState<{ key: string; svg?: string; failed?: boolean } | null>(null)
  const key = diagram.mermaid

  useEffect(() => {
    let cancelled = false
    const renderId = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`
    renderDiagram(renderId, diagram.mermaid).then(
      (svg) => {
        if (!cancelled) setResult({ key, svg })
      },
      () => {
        if (!cancelled) setResult({ key, failed: true })
      },
    )
    return () => {
      cancelled = true
    }
  }, [diagram.mermaid, key, reactId])

  const current = result?.key === key ? result : null

  return (
    <figure className="my-4 rounded-lg border bg-card">
      <div className="mermaid-frame min-h-24 overflow-x-auto p-4">
        {current?.svg && <div dangerouslySetInnerHTML={{ __html: current.svg }} />}
        {current?.failed && (
          <pre className="text-xs whitespace-pre-wrap text-muted-foreground">{diagram.mermaid}</pre>
        )}
        {!current && <p className="py-6 text-center text-sm text-muted-foreground">Đang vẽ sơ đồ...</p>}
      </div>
      <figcaption className="border-t px-4 py-2 text-xs text-muted-foreground">
        {diagram.caption}
      </figcaption>
    </figure>
  )
}
