import { Check, Circle } from 'lucide-react'
import { useMemo } from 'react'
import { Markdown } from '@/components/content/markdown'
import { Button } from '@/components/ui/button'
import { matchKeyPoints } from '@/domain/interview/evaluator'
import { gradeQuestion } from '@/domain/quiz/grade'
import { suggestSelfGrade } from '@/domain/quiz/suggest'
import type { QuizAnswer, QuizQuestion } from '@/domain/types'
import { BookmarkButton } from './bookmark-button'
import { GradeBadge } from './badges'
import { ConceptLinks } from './concept-links'

interface QuestionFeedbackProps {
  question: QuizQuestion
  answer: QuizAnswer | null | undefined
  selfGrade?: number
  onSelfGrade?: (grade: number) => void
  hideVerdict?: boolean
}

const SELF_GRADES: { value: number; label: string }[] = [
  { value: 1, label: 'Đúng' },
  { value: 0.5, label: 'Đúng một phần' },
  { value: 0, label: 'Sai' },
]

function ShortAnswerReview({
  question,
  answer,
  selfGrade,
  onSelfGrade,
}: {
  question: Extract<QuizQuestion, { type: 'short-answer' }>
  answer: QuizAnswer | null | undefined
  selfGrade?: number
  onSelfGrade?: (grade: number) => void
}) {
  const text = typeof answer === 'string' ? answer : ''
  const matched = useMemo(() => matchKeyPoints(text, question.keyPoints), [text, question.keyPoints])
  const suggested = suggestSelfGrade(text, question.keyPoints)
  const hasAnswer = text.trim() !== ''

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1 text-sm font-medium">Đáp án tham khảo</p>
        <Markdown className="text-sm">{question.referenceAnswer}</Markdown>
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">Các ý cần có</p>
        <ul className="space-y-1">
          {question.keyPoints.map((point, index) => {
            const hit = matched.includes(index)
            return (
              <li key={point.text} className="flex items-start gap-2 text-sm">
                {hit ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-label="Đã nhắc đến" />
                ) : (
                  <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-label="Chưa thấy" />
                )}
                <span>{point.text}</span>
              </li>
            )
          })}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Dấu tick chỉ là gợi ý so khớp từ khóa, có thể bỏ sót khi bạn diễn đạt khác đi. Hãy tự đối
          chiếu rồi chọn điểm bên dưới.
        </p>
      </div>
      {onSelfGrade && hasAnswer && (
        <div>
          <p className="mb-1.5 text-sm font-medium">Bạn tự chấm</p>
          <div className="flex flex-wrap gap-2">
            {SELF_GRADES.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={(selfGrade ?? suggested) === value ? 'default' : 'outline'}
                aria-pressed={(selfGrade ?? suggested) === value}
                onClick={() => onSelfGrade(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Phần giải thích sau khi hiện đáp án, dùng chung cho mọi nơi hiển thị câu hỏi. */
export function QuestionFeedback({
  question,
  answer,
  selfGrade,
  onSelfGrade,
  hideVerdict,
}: QuestionFeedbackProps) {
  const effectiveSelfGrade =
    question.type === 'short-answer' && typeof answer === 'string'
      ? (selfGrade ?? suggestSelfGrade(answer, question.keyPoints))
      : selfGrade
  const grade = gradeQuestion(question, answer, effectiveSelfGrade)

  return (
    <div className="space-y-3 rounded-md border bg-muted/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {hideVerdict ? <span /> : <GradeBadge status={grade.status} />}
        <BookmarkButton questionId={question.id} kind="quiz" showLabel />
      </div>

      {question.type === 'fill-blank' && (
        <p className="text-sm">
          <span className="font-medium">Đáp án đúng: </span>
          {question.acceptedAnswers.join(' / ')}
        </p>
      )}
      {question.type === 'true-false' && (
        <p className="text-sm">
          <span className="font-medium">Đáp án đúng: </span>
          {question.correct ? 'Đúng' : 'Sai'}
        </p>
      )}
      {question.type === 'short-answer' && (
        <ShortAnswerReview
          question={question}
          answer={answer}
          selfGrade={selfGrade}
          onSelfGrade={onSelfGrade}
        />
      )}

      <div>
        <p className="mb-1 text-sm font-medium">Giải thích</p>
        <Markdown className="text-sm">{question.explanation}</Markdown>
      </div>

      {question.type === 'true-false' && (
        <div>
          <p className="mb-1 text-sm font-medium">
            Vì sao phương án {question.correct ? '"Sai"' : '"Đúng"'} không chính xác
          </p>
          <Markdown className="text-sm">{question.wrongExplanation}</Markdown>
        </div>
      )}

      <ConceptLinks conceptIds={question.conceptIds} />
    </div>
  )
}
