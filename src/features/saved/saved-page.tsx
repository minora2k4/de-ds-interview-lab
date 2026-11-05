import { Bookmark, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/states'
import { ToggleChip } from '@/components/common/toggle-chip'
import { BookmarkButton } from '@/components/question/bookmark-button'
import { ConceptLinks } from '@/components/question/concept-links'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { TOPICS, getTopic } from '@/content/catalog'
import { contentRepository } from '@/services/content-repository'
import { useAsync } from '@/hooks/use-async'
import { plainSnippet } from '@/lib/format'
import { useProgressStore } from '@/stores/progress'
import { useSessionStore } from '@/stores/session'
import { InterviewAnswerDetail } from '../knowledge/interview-list'
import { QuestionReview } from '../quiz/question-review'
import { buildActiveQuiz } from '../quiz/start-quiz'

type KindFilter = 'all' | 'quiz' | 'interview'

async function loadBanks() {
  const [quiz, interview] = await Promise.all([
    contentRepository.loadAllQuiz(),
    contentRepository.loadAllInterview(),
  ])
  return { quiz, interview }
}

export function SavedPage() {
  const navigate = useNavigate()
  const bookmarks = useProgressStore((s) => s.bookmarks)
  const startQuiz = useSessionStore((s) => s.startQuiz)
  const { data, loading, error } = useAsync(loadBanks, 'saved-banks')
  const [kind, setKind] = useState<KindFilter>('all')
  const [topicId, setTopicId] = useState<string>('all')

  const quiz = useMemo(
    () => (data?.quiz ?? []).filter((q) => bookmarks[q.id]),
    [bookmarks, data],
  )
  const interview = useMemo(
    () => (data?.interview ?? []).filter((q) => bookmarks[q.id]),
    [bookmarks, data],
  )
  const savedTopicIds = new Set([...quiz, ...interview].map((q) => q.topicId))
  const visibleQuiz = quiz.filter((q) => topicId === 'all' || q.topicId === topicId)
  const visibleInterview = interview.filter((q) => topicId === 'all' || q.topicId === topicId)
  const total = quiz.length + interview.length

  const practice = () => {
    startQuiz(
      buildActiveQuiz({
        title: `Ôn ${visibleQuiz.length} câu đã lưu`,
        source: 'saved',
        questions: visibleQuiz,
        shuffleOptions: true,
      }),
    )
    navigate('/quiz/session')
  }

  return (
    <>
      <PageHeader
        title="Câu hỏi đã lưu"
        description="Những câu bạn đã đánh dấu để ôn lại."
        actions={
          visibleQuiz.length > 0 && kind !== 'interview' ? (
            <Button onClick={practice}>
              <Play aria-hidden />
              Làm quiz từ {visibleQuiz.length} câu này
            </Button>
          ) : undefined
        }
      />
      {loading && <LoadingState />}
      {!!error && <ErrorState />}
      {!loading && !error && total === 0 && (
        <EmptyState
          icon={Bookmark}
          title="Chưa lưu câu hỏi nào"
          description="Bấm biểu tượng dấu trang ở bất kỳ câu hỏi nào để lưu lại đây."
          action={
            <Button asChild variant="outline">
              <Link to="/quiz?tab=bank">Mở ngân hàng câu hỏi</Link>
            </Button>
          }
        />
      )}
      {!loading && !error && total > 0 && (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <ToggleChip pressed={kind === 'all'} onClick={() => setKind('all')}>
              Tất cả ({total})
            </ToggleChip>
            <ToggleChip pressed={kind === 'quiz'} onClick={() => setKind('quiz')}>
              Quiz ({quiz.length})
            </ToggleChip>
            <ToggleChip pressed={kind === 'interview'} onClick={() => setKind('interview')}>
              Phỏng vấn ({interview.length})
            </ToggleChip>
          </div>
          {savedTopicIds.size > 1 && (
            <div className="mb-5 flex flex-wrap gap-2">
              <ToggleChip pressed={topicId === 'all'} onClick={() => setTopicId('all')}>
                Mọi chủ đề
              </ToggleChip>
              {TOPICS.filter((t) => savedTopicIds.has(t.id)).map((topic) => (
                <ToggleChip
                  key={topic.id}
                  pressed={topicId === topic.id}
                  onClick={() => setTopicId(topic.id)}
                >
                  {topic.title}
                </ToggleChip>
              ))}
            </div>
          )}

          {kind !== 'interview' && visibleQuiz.length > 0 && (
            <Accordion type="multiple" className="mb-6 rounded-lg border bg-card">
              {visibleQuiz.map((question) => (
                <AccordionItem key={question.id} value={question.id} className="px-4">
                  <AccordionTrigger className="text-left">
                    <span>
                      {plainSnippet(question.prompt)}
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">
                        Quiz · {getTopic(question.topicId)?.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <QuestionReview question={question} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {kind !== 'quiz' && visibleInterview.length > 0 && (
            <Accordion type="multiple" className="rounded-lg border bg-card">
              {visibleInterview.map((question) => (
                <AccordionItem key={question.id} value={question.id} className="px-4">
                  <AccordionTrigger className="text-left">
                    <span>
                      {question.question}
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">
                        Phỏng vấn · {getTopic(question.topicId)?.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <InterviewAnswerDetail question={question} />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <ConceptLinks conceptIds={question.conceptIds} />
                      <BookmarkButton questionId={question.id} kind="interview" showLabel />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </>
      )}
    </>
  )
}
