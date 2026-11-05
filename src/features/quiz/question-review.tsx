import { DifficultyBadge, GradeBadge, QuestionTypeBadge, TopicBadge } from '@/components/question/badges'
import { QuestionFeedback } from '@/components/question/question-feedback'
import { QuestionView } from '@/components/question/question-view'
import type { GradeStatus, QuizAnswer, QuizQuestion } from '@/domain/types'

interface QuestionReviewProps {
  index?: number
  question: QuizQuestion
  answer?: QuizAnswer | null
  status?: GradeStatus
  selfGrade?: number
  onSelfGrade?: (grade: number) => void
}

/** Một câu hỏi ở trạng thái đã khóa, kèm đáp án và toàn bộ giải thích. */
export function QuestionReview({
  index,
  question,
  answer,
  status,
  selfGrade,
  onSelfGrade,
}: QuestionReviewProps) {
  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        {index !== undefined && <span className="mr-1 text-sm font-medium">Câu {index + 1}</span>}
        {status && <GradeBadge status={status} />}
        <TopicBadge topicId={question.topicId} />
        <DifficultyBadge difficulty={question.difficulty} />
        <QuestionTypeBadge type={question.type} />
      </div>
      <QuestionView question={question} answer={answer ?? undefined} revealed />
      <div className="mt-4">
        <QuestionFeedback
          question={question}
          answer={answer}
          selfGrade={selfGrade}
          onSelfGrade={onSelfGrade}
          hideVerdict
        />
      </div>
    </article>
  )
}
