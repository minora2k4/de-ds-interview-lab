import { BookOpen } from 'lucide-react'
import { Link } from 'react-router'
import { conceptPath, getConceptEntry } from '@/content/catalog'

export function ConceptLinks({ conceptIds }: { conceptIds: string[] }) {
  const entries = conceptIds.flatMap((id) => {
    const entry = getConceptEntry(id)
    return entry ? [entry] : []
  })
  if (entries.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <BookOpen className="size-3.5" aria-hidden />
        Kiến thức liên quan:
      </span>
      {entries.map((entry) => (
        <Link
          key={entry.id}
          to={conceptPath(entry.id)}
          className="text-accent-foreground underline decoration-current/30 underline-offset-3 hover:decoration-current"
        >
          {entry.title}
        </Link>
      ))}
    </div>
  )
}
