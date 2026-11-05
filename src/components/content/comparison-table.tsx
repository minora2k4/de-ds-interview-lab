import type { ConceptComparison } from '@/domain/types'
import { Markdown } from './markdown'

export function ComparisonTable({ comparison }: { comparison: ConceptComparison }) {
  return (
    <div className="space-y-3">
      {comparison.intro && <Markdown>{comparison.intro}</Markdown>}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="bg-muted/60">
              {comparison.headers.map((header) => (
                <th key={header} scope="col" className="border-b px-3 py-2 text-left font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b align-top last:border-b-0">
                {row.map((cell, cellIndex) =>
                  cellIndex === 0 ? (
                    <th key={cellIndex} scope="row" className="px-3 py-2 text-left font-medium">
                      <Markdown className="text-sm leading-relaxed font-medium">{cell}</Markdown>
                    </th>
                  ) : (
                    <td key={cellIndex} className="px-3 py-2">
                      <Markdown className="text-sm leading-relaxed">{cell}</Markdown>
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {comparison.note && <Markdown className="text-sm text-muted-foreground">{comparison.note}</Markdown>}
    </div>
  )
}
