import { ArrowLeft, ArrowRight, Check, Hourglass, Minus, Plus, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { RouteError } from '@/app/route-error'
import { ComparisonTable } from '@/components/content/comparison-table'
import { Markdown } from '@/components/content/markdown'
import { MermaidDiagram } from '@/components/content/mermaid-diagram'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/states'
import { Badge } from '@/components/ui/badge'
import {
  conceptPath,
  getConceptEntry,
  getDomain,
  getSubtopicTitle,
  getTopic,
  topicPath,
} from '@/content/catalog'
import type { ConceptContent, InterviewQuestion, QuizQuestion } from '@/domain/types'
import { useAsync } from '@/hooks/use-async'
import { contentRepository } from '@/services/content-repository'
import { Breadcrumbs } from './breadcrumbs'
import { ConceptTocCollapsible, ConceptTocRail, type TocItem } from './concept-toc'
import { useCurrentDomain } from './use-current-domain'
import { InlineQuiz } from './inline-quiz'
import { InterviewList } from './interview-list'

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} tabIndex={-1} className="scroll-mt-16 outline-none">
      <h2 className="mb-2 text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  )
}

function BulletPanel({
  title,
  items,
  icon: Icon,
  iconClassName,
}: {
  title: string
  items: string[]
  icon: typeof Plus
  iconClassName: string
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="mb-2 text-sm font-medium">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-relaxed">
            <Icon className={`mt-1 size-3.5 shrink-0 ${iconClassName}`} aria-hidden />
            <Markdown className="min-w-0 flex-1 text-sm leading-relaxed">{item}</Markdown>
          </li>
        ))}
      </ul>
    </div>
  )
}

function buildToc(hasInterview: boolean, hasQuiz: boolean): TocItem[] {
  const items: TocItem[] = [
    { id: 'dinh-nghia', label: '1. Định nghĩa' },
    { id: 'muc-dich', label: '2. Mục đích ra đời' },
    { id: 'tai-sao', label: '3. Tại sao cần sử dụng' },
    { id: 'co-che', label: '4. Cơ chế hoạt động' },
    { id: 'vi-du', label: '5. Ví dụ thực tế' },
    { id: 'uu-nhuoc', label: '6. Ưu điểm và nhược điểm' },
    { id: 'khi-nao', label: '7. Trường hợp nên sử dụng' },
    { id: 'so-sanh', label: '8. So sánh' },
    { id: 'hieu-sai', label: '9. Những lỗi hiểu sai phổ biến' },
  ]
  if (hasInterview) items.push({ id: 'phong-van', label: '10. Câu hỏi phỏng vấn' })
  if (hasQuiz) items.push({ id: 'kiem-tra', label: 'Kiểm tra kiến thức' })
  items.push({ id: 'lien-quan', label: 'Khái niệm liên quan' })
  return items
}

interface ConceptBundle {
  concept: ConceptContent | null
  quiz: QuizQuestion[]
  interview: InterviewQuestion[]
}

async function loadBundle(conceptId: string, topicId: string): Promise<ConceptBundle> {
  const [concept, quiz, interview] = await Promise.all([
    contentRepository.loadConcept(conceptId),
    contentRepository.loadQuizOfTopic(topicId),
    contentRepository.loadInterviewOfTopic(topicId),
  ])
  return {
    concept,
    quiz: quiz.filter((q) => q.conceptIds.includes(conceptId)),
    interview: interview.filter((q) => q.conceptIds.includes(conceptId)),
  }
}

function SiblingNav({ conceptId }: { conceptId: string }) {
  const domainId = useCurrentDomain()
  const entry = getConceptEntry(conceptId)!
  const siblings = getTopic(entry.topicId)!.subtopics.flatMap((s) => s.concepts)
  const index = siblings.findIndex((c) => c.id === conceptId)
  const previous = siblings[index - 1]
  const next = siblings[index + 1]
  return (
    <nav aria-label="Khái niệm trước và sau" className="mt-10 grid gap-3 border-t pt-6 sm:grid-cols-2">
      {previous ? (
        <Link to={conceptPath(previous.id, domainId)} className="rounded-lg border bg-card p-3 hover:bg-muted/50">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="size-3" aria-hidden /> Trước
          </span>
          <span className="mt-0.5 block text-sm font-medium">{previous.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link to={conceptPath(next.id, domainId)} className="rounded-lg border bg-card p-3 text-right hover:bg-muted/50">
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            Sau <ArrowRight className="size-3" aria-hidden />
          </span>
          <span className="mt-0.5 block text-sm font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}

function ConceptBody({ bundle, conceptId }: { bundle: ConceptBundle; conceptId: string }) {
  const { concept, quiz, interview } = bundle
  const toc = useMemo(
    () => buildToc(interview.length > 0, quiz.length > 0),
    [interview.length, quiz.length],
  )
  if (!concept) {
    return (
      <EmptyState
        icon={Hourglass}
        title="Nội dung đang được biên soạn"
        description="Khái niệm này đã có trong danh mục nhưng chưa được viết xong."
      />
    )
  }
  const { sections } = concept

  return (
    <div className="flex gap-10">
      <article className="min-w-0 flex-1 xl:max-w-3xl">
        <ConceptTocCollapsible items={toc} />
        <div className="space-y-8">
          <Section id="dinh-nghia" title="1. Định nghĩa">
            <Markdown>{sections.definition}</Markdown>
          </Section>
          <Section id="muc-dich" title="2. Mục đích ra đời">
            <Markdown>{sections.origin}</Markdown>
          </Section>
          <Section id="tai-sao" title="3. Tại sao cần sử dụng">
            <Markdown>{sections.whyUse}</Markdown>
          </Section>
          <Section id="co-che" title="4. Cơ chế hoạt động">
            <Markdown>{sections.mechanism}</Markdown>
            {sections.diagram && <MermaidDiagram diagram={sections.diagram} />}
          </Section>
          <Section id="vi-du" title="5. Ví dụ thực tế">
            <Markdown>{sections.example}</Markdown>
          </Section>
          <Section id="uu-nhuoc" title="6. Ưu điểm và nhược điểm">
            <div className="grid gap-3 md:grid-cols-2">
              <BulletPanel
                title="Ưu điểm"
                items={sections.prosCons.pros}
                icon={Plus}
                iconClassName="text-success"
              />
              <BulletPanel
                title="Nhược điểm"
                items={sections.prosCons.cons}
                icon={Minus}
                iconClassName="text-danger"
              />
            </div>
          </Section>
          <Section id="khi-nao" title="7. Trường hợp nên sử dụng">
            <div className="grid gap-3 md:grid-cols-2">
              <BulletPanel
                title="Nên dùng khi"
                items={sections.whenToUse.use}
                icon={Check}
                iconClassName="text-success"
              />
              <BulletPanel
                title="Không nên dùng khi"
                items={sections.whenToUse.avoid}
                icon={X}
                iconClassName="text-danger"
              />
            </div>
          </Section>
          <Section id="so-sanh" title="8. So sánh">
            <ComparisonTable comparison={sections.comparison} />
          </Section>
          <Section id="hieu-sai" title="9. Những lỗi hiểu sai phổ biến">
            <ul className="space-y-3">
              {sections.misconceptions.map((item) => (
                <li key={item.myth} className="rounded-lg border bg-card p-4">
                  <p className="flex items-start gap-2 text-sm font-medium">
                    <X className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                    <span>
                      <span className="sr-only">Hiểu sai: </span>
                      {item.myth}
                    </span>
                  </p>
                  <div className="mt-2 flex items-start gap-2">
                    <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden />
                    <Markdown className="min-w-0 flex-1 text-sm">{item.truth}</Markdown>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
          {interview.length > 0 && (
            <Section id="phong-van" title="10. Câu hỏi phỏng vấn">
              <InterviewList questions={interview} />
            </Section>
          )}
          {quiz.length > 0 && (
            <Section id="kiem-tra" title="Kiểm tra kiến thức">
              <InlineQuiz questions={quiz} />
            </Section>
          )}
          <Section id="lien-quan" title="Khái niệm liên quan">
            <div className="flex flex-wrap gap-2">
              {concept.related.map((id) => {
                const related = getConceptEntry(id)
                if (!related) return null
                return (
                  <Link
                    key={id}
                    to={conceptPath(id)}
                    className="rounded-md border bg-card px-3 py-1.5 text-sm hover:bg-muted"
                  >
                    {related.title}
                  </Link>
                )
              })}
            </div>
          </Section>
        </div>
        <SiblingNav conceptId={conceptId} />
      </article>
      <ConceptTocRail items={toc} />
    </div>
  )
}

export function ConceptPage() {
  const { topicId = '', conceptId = '' } = useParams()
  const domainId = useCurrentDomain()
  const entry = getConceptEntry(conceptId)
  const topic = getTopic(topicId)
  const { data, loading, error } = useAsync(() => loadBundle(conceptId, topicId), conceptId)

  if (!entry || !topic || entry.topicId !== topicId || !topic.domains.includes(domainId)) {
    return <RouteError />
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: getDomain(domainId).title, to: `/${domainId}` },
          { label: topic.title, to: topicPath(topic.id, domainId) },
          { label: entry.title },
        ]}
      />
      <header className="mb-6">
        <p className="text-xs text-muted-foreground">{getSubtopicTitle(topic.id, entry.subtopicId)}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{entry.title}</h1>
        {entry.viTitle && <p className="mt-1 text-muted-foreground">{entry.viTitle}</p>}
        {data?.concept && (
          <>
            <p className="mt-3 max-w-3xl leading-relaxed">{data.concept.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {entry.tier === 'A' && <Badge>Trọng tâm</Badge>}
              {data.concept.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        )}
      </header>
      {loading && <LoadingState />}
      {!!error && <ErrorState />}
      {data && <ConceptBody key={conceptId} bundle={data} conceptId={conceptId} />}
    </>
  )
}
