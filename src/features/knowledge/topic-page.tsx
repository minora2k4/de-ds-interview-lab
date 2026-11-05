import { ChevronRight, ListChecks } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { PageHeader } from '@/components/common/page-header'
import { RouteError } from '@/app/route-error'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { conceptPath, getConceptEntry, getDomain, getTopic } from '@/content/catalog'
import type { ConceptEntry } from '@/domain/types'
import { contentRepository } from '@/services/content-repository'
import { Breadcrumbs } from './breadcrumbs'
import { useCurrentDomain } from './use-current-domain'

function ConceptRow({ concept, domainId }: { concept: ConceptEntry; domainId: 'de' | 'ds' }) {
  const ready = contentRepository.hasConcept(concept.id)
  return (
    <Link
      to={conceptPath(concept.id, domainId)}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{concept.title}</p>
        {concept.viTitle && <p className="text-xs text-muted-foreground">{concept.viTitle}</p>}
      </div>
      {!ready && <Badge variant="outline">Đang biên soạn</Badge>}
      {ready && concept.tier === 'A' && <Badge variant="secondary">Trọng tâm</Badge>}
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  )
}

export function TopicPage() {
  const { topicId = '' } = useParams()
  const domainId = useCurrentDomain()
  const topic = getTopic(topicId)
  if (!topic || !topic.domains.includes(domainId)) return <RouteError />

  return (
    <>
      <Breadcrumbs
        items={[
          { label: getDomain(domainId).title, to: `/${domainId}` },
          { label: topic.title },
        ]}
      />
      <PageHeader
        title={topic.title}
        description={topic.description}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to={`/quiz?topic=${topic.id}`}>
              <ListChecks aria-hidden />
              Làm quiz chủ đề này
            </Link>
          </Button>
        }
      />
      <div className="space-y-6">
        {topic.subtopics.map((subtopic) => {
          const shared = (subtopic.sharedConceptIds ?? []).flatMap((id) => {
            const entry = getConceptEntry(id)
            return entry ? [entry] : []
          })
          return (
            <section key={subtopic.id}>
              <h2 className="mb-2 text-sm font-medium text-muted-foreground">{subtopic.title}</h2>
              <div className="divide-y overflow-hidden rounded-lg border bg-card">
                {[...subtopic.concepts, ...shared].map((concept) => (
                  <ConceptRow key={concept.id} concept={concept} domainId={domainId} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
