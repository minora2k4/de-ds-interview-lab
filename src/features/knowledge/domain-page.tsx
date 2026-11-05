import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { PageHeader } from '@/components/common/page-header'
import { conceptCount, getDomain, topicPath, topicsOfDomain } from '@/content/catalog'
import { useCurrentDomain } from './use-current-domain'

export function DomainPage() {
  const domainId = useCurrentDomain()
  const domain = getDomain(domainId)
  const topics = topicsOfDomain(domainId)

  return (
    <>
      <PageHeader title={domain.title} description={domain.description} />
      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={topicPath(topic.id, domainId)}
            className="group flex flex-col rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-medium">{topic.title}</h2>
              <ChevronRight
                className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-foreground"
                aria-hidden
              />
            </div>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{topic.description}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {topic.subtopics.length} chủ đề con · {conceptCount(topic)} khái niệm
            </p>
          </Link>
        ))}
      </div>
    </>
  )
}
