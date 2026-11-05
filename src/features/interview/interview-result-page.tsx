import { MessagesSquare } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { PageHeader } from '@/components/common/page-header'
import { StatTile } from '@/components/common/stat-tile'
import { EmptyState, LoadingState } from '@/components/common/states'
import { BookmarkButton } from '@/components/question/bookmark-button'
import { ConceptLinks } from '@/components/question/concept-links'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { scoreBand } from '@/domain/interview/evaluator'
import { averageScore } from '@/domain/interview/session'
import { INTERVIEW_TYPE_LABEL, LEVEL_LABEL } from '@/domain/labels'
import { formatDateTime, formatDuration } from '@/lib/format'
import { useProgressStore } from '@/stores/progress'
import { InterviewAnswerDetail } from '../knowledge/interview-list'
import { useInterviewBank } from './use-interview-bank'

export function InterviewResultPage() {
  const { sessionId = '' } = useParams()
  const session = useProgressStore((s) => s.interviews.find((i) => i.id === sessionId))
  const { byId, loading } = useInterviewBank()

  if (!session) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="Không tìm thấy buổi phỏng vấn"
        action={
          <Button asChild>
            <Link to="/interview">Về Luyện phỏng vấn</Link>
          </Button>
        }
      />
    )
  }
  if (loading) return <LoadingState />

  const average = averageScore(session.answers.map((a) => a.score))
  const band = scoreBand(Math.round(average))
  const missed = session.answers.flatMap((answer) => {
    const question = byId.get(answer.questionId)
    if (!question) return []
    return question.keyPoints
      .filter((_, index) => !answer.matchedPoints.includes(index))
      .map((point) => ({ text: point.text, question: question.question }))
  })
  const weakConceptIds = [
    ...new Set(
      session.answers
        .filter((answer) => answer.score < 7)
        .flatMap((answer) => byId.get(answer.questionId)?.conceptIds ?? []),
    ),
  ]

  return (
    <>
      <PageHeader
        title="Tổng kết buổi phỏng vấn"
        description={`${INTERVIEW_TYPE_LABEL[session.type]} · ${LEVEL_LABEL[session.level]} · ${formatDateTime(session.finishedAt)}`}
        actions={
          <Button asChild>
            <Link to="/interview">Phỏng vấn buổi mới</Link>
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Điểm trung bình" value={`${average}/10`} />
        <StatTile label="Xếp loại" value={band.label} />
        <StatTile label="Số câu" value={session.answers.length} />
        <StatTile label="Thời gian" value={formatDuration(session.finishedAt - session.startedAt)} />
      </div>

      <section className="mt-4 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium text-muted-foreground">Nhận xét</h2>
        <p className="mt-1 text-sm">{band.description}</p>
        {weakConceptIds.length > 0 && (
          <div className="mt-3">
            <ConceptLinks conceptIds={weakConceptIds} />
          </div>
        )}
      </section>

      {missed.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">Những ý bạn còn thiếu</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {missed.map((item, index) => (
              <li key={index}>{item.text}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Xem lại từng câu</h2>
        <Accordion type="multiple" className="rounded-lg border bg-card">
          {session.answers.map((answer, index) => {
            const question = byId.get(answer.questionId)
            if (!question) return null
            return (
              <AccordionItem key={answer.questionId} value={answer.questionId} className="px-4">
                <AccordionTrigger className="text-left">
                  <span className="flex min-w-0 flex-1 items-start justify-between gap-3">
                    <span>
                      {index + 1}. {question.question}
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums">{answer.score}/10</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mb-4">
                    <p className="mb-1 text-sm font-medium">Câu trả lời của bạn</p>
                    <p className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
                      {answer.answer}
                    </p>
                  </div>
                  <InterviewAnswerDetail question={question} />
                  <div className="mt-3 flex justify-end">
                    <BookmarkButton questionId={question.id} kind="interview" showLabel />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </section>
    </>
  )
}
