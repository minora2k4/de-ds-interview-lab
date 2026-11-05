import { Flag, MessagesSquare, Send, Sparkle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Markdown } from '@/components/content/markdown'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/states'
import { DifficultyBadge } from '@/components/question/badges'
import { BookmarkButton } from '@/components/question/bookmark-button'
import { ConceptLinks } from '@/components/question/concept-links'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  SCORE_RUBRIC,
  defaultEvaluator,
  scoreBand,
  scoreFromPoints,
} from '@/domain/interview/evaluator'
import { INTERVIEW_TYPE_LABEL, LEVEL_LABEL } from '@/domain/labels'
import type { InterviewAnswerResult, InterviewQuestion } from '@/domain/types'
import { useProgressStore } from '@/stores/progress'
import { useSessionStore } from '@/stores/session'
import { useInterviewBank } from './use-interview-bank'

function ScoreRubric({ score }: { score: number }) {
  const current = scoreBand(score)
  return (
    <ul className="space-y-1">
      {SCORE_RUBRIC.map((band) => {
        const isCurrent = band === current
        return (
          <li
            key={band.label}
            aria-current={isCurrent ? 'true' : undefined}
            className={`rounded-md border px-3 py-2 text-sm ${isCurrent ? 'border-primary/50 bg-accent' : 'bg-card'}`}
          >
            <span className="font-medium tabular-nums">
              {band.min}–{band.max} điểm · {band.label}
            </span>
            <span className="block text-xs text-muted-foreground">{band.description}</span>
          </li>
        )
      })}
    </ul>
  )
}

function SubmittedReview({
  question,
  result,
  onChange,
}: {
  question: InterviewQuestion
  result: InterviewAnswerResult
  onChange: (matchedPoints: number[]) => void
}) {
  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-1 text-sm font-medium">Câu trả lời của bạn</h3>
        <p className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
          {result.answer.trim() || 'Bạn chưa nhập câu trả lời.'}
        </p>
      </section>

      <section>
        <h3 className="mb-1 text-sm font-medium">Câu trả lời tham khảo</h3>
        <Markdown>{question.referenceAnswer}</Markdown>
      </section>

      <section>
        <h3 className="mb-1 text-sm font-medium">Những ý quan trọng cần có</h3>
        <p className="mb-2 text-xs text-muted-foreground">
          Các ô được tick sẵn theo từ khóa tìm thấy trong câu trả lời, đây chỉ là gợi ý. Hãy tự đối
          chiếu rồi sửa lại cho đúng, điểm sẽ cập nhật theo.
        </p>
        <ul className="space-y-1.5">
          {question.keyPoints.map((point, index) => {
            const id = `${question.id}-point-${index}`
            const checked = result.matchedPoints.includes(index)
            return (
              <li key={point.text}>
                <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 rounded-md border bg-card p-2.5 text-sm">
                  <Checkbox
                    id={id}
                    checked={checked}
                    className="mt-0.5"
                    onCheckedChange={(next) =>
                      onChange(
                        next
                          ? [...result.matchedPoints, index]
                          : result.matchedPoints.filter((i) => i !== index),
                      )
                    }
                  />
                  <span>{point.text}</span>
                </label>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 text-sm font-medium">
          Thang điểm: bạn được <span className="tabular-nums">{result.score}/10</span>
        </h3>
        <ScoreRubric score={result.score} />
      </section>

      {question.followUps.length > 0 && (
        <section>
          <h3 className="mb-1 text-sm font-medium">Người phỏng vấn có thể hỏi tiếp</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {question.followUps.map((followUp) => (
              <li key={followUp}>{followUp}</li>
            ))}
          </ul>
        </section>
      )}

      {question.commonMistakes.length > 0 && (
        <section>
          <h3 className="mb-1 text-sm font-medium">Lỗi thường gặp khi trả lời</h3>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {question.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </section>
      )}

      <ConceptLinks conceptIds={question.conceptIds} />
    </div>
  )
}

export function InterviewSessionPage() {
  const navigate = useNavigate()
  const interview = useSessionStore((s) => s.interview)
  const update = useSessionStore((s) => s.updateInterview)
  const endInterview = useSessionStore((s) => s.endInterview)
  const recordInterview = useProgressStore((s) => s.recordInterview)
  const { byId, loading, error } = useInterviewBank()
  const [quitOpen, setQuitOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!interview) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="Không có buổi phỏng vấn đang làm"
        action={
          <Button asChild>
            <Link to="/interview">Tạo buổi mới</Link>
          </Button>
        }
      />
    )
  }
  if (loading) return <LoadingState label="Đang chuẩn bị câu hỏi..." />
  if (error) return <ErrorState />

  const questionId = interview.questionIds[interview.currentIndex]
  const question = byId.get(questionId)
  if (!question) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="Không tìm thấy câu hỏi"
        description="Câu hỏi trong buổi này không còn tồn tại, có thể do nội dung vừa được cập nhật."
        action={
          <Button
            onClick={() => {
              endInterview()
              navigate('/interview')
            }}
          >
            Hủy buổi này
          </Button>
        }
      />
    )
  }

  const total = interview.questionIds.length
  const draft = interview.drafts[questionId] ?? ''
  const submitted = !!interview.submitted[questionId]
  const result = interview.answers[questionId]
  const isLast = interview.currentIndex === total - 1

  const submit = async () => {
    setSubmitting(true)
    try {
      const evaluation = await defaultEvaluator.evaluate({
        question: question.question,
        answer: draft,
        keyPoints: question.keyPoints,
        referenceAnswer: question.referenceAnswer,
      })
      update({
        answers: {
          ...interview.answers,
          [questionId]: {
            questionId,
            answer: draft,
            matchedPoints: evaluation.matchedPoints,
            score: evaluation.score,
          },
        },
        submitted: { ...interview.submitted, [questionId]: true },
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateMatched = (matchedPoints: number[]) => {
    update({
      answers: {
        ...interview.answers,
        [questionId]: {
          ...result,
          matchedPoints,
          score: scoreFromPoints(question.keyPoints, matchedPoints),
        },
      },
    })
  }

  const finish = () => {
    const answers = interview.questionIds.flatMap((id) => {
      const answer = interview.answers[id]
      return answer ? [answer] : []
    })
    recordInterview({
      id: interview.id,
      type: interview.type,
      level: interview.level,
      startedAt: interview.startedAt,
      finishedAt: Date.now(),
      answers,
    })
    endInterview()
    navigate(`/interview/result/${interview.id}`, { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm text-muted-foreground">
          {INTERVIEW_TYPE_LABEL[interview.type]} · {LEVEL_LABEL[interview.level]}
        </p>
        <Button variant="ghost" size="sm" onClick={() => setQuitOpen(true)}>
          Thoát
        </Button>
      </div>
      <Progress
        value={((interview.currentIndex + (submitted ? 1 : 0)) / total) * 100}
        className="mb-5 h-1"
        aria-label="Tiến độ buổi phỏng vấn"
      />

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-sm font-medium">
          Câu {interview.currentIndex + 1}/{total}
        </span>
        <DifficultyBadge difficulty={question.difficulty} />
        {question.firstPrinciples && (
          <Badge variant="secondary">
            <Sparkle aria-hidden />
            First Principles
          </Badge>
        )}
        <span className="ml-auto">
          <BookmarkButton questionId={question.id} kind="interview" />
        </span>
      </div>
      <h1 className="mb-4 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
        {question.question}
      </h1>

      {!submitted && (
        <div className="space-y-3">
          <Textarea
            aria-label="Câu trả lời của bạn"
            placeholder="Trả lời như đang nói với người phỏng vấn: nêu bản chất, cơ chế, đánh đổi và ví dụ."
            value={draft}
            className="min-h-56 text-base sm:text-sm"
            onChange={(event) =>
              update({ drafts: { ...interview.drafts, [questionId]: event.target.value } })
            }
          />
          <div className="flex justify-end">
            <Button onClick={submit} disabled={submitting || draft.trim() === ''}>
              <Send aria-hidden />
              Gửi câu trả lời
            </Button>
          </div>
        </div>
      )}

      {submitted && result && (
        <>
          <SubmittedReview question={question} result={result} onChange={updateMatched} />
          <div className="mt-6 flex justify-end border-t pt-4">
            {isLast ? (
              <Button onClick={finish}>
                <Flag aria-hidden />
                Xem tổng kết
              </Button>
            ) : (
              <Button
                onClick={() => {
                  update({ currentIndex: interview.currentIndex + 1 })
                  window.scrollTo(0, 0)
                }}
              >
                Câu tiếp theo
              </Button>
            )}
          </div>
        </>
      )}

      <AlertDialog open={quitOpen} onOpenChange={setQuitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thoát khỏi buổi phỏng vấn?</AlertDialogTitle>
            <AlertDialogDescription>
              Buổi đang làm dở sẽ bị hủy và không được lưu vào lịch sử.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Làm tiếp</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                endInterview()
                navigate('/interview')
              }}
            >
              Hủy buổi này
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
