import { createId } from '@/domain/random'
import { buildOptionOrder } from '@/domain/quiz/select'
import type { ActiveQuiz, QuizQuestion, QuizSource } from '@/domain/types'

interface BuildActiveQuizInput {
  title: string
  source: QuizSource
  /** Câu hỏi đã theo đúng thứ tự sẽ hiển thị. */
  questions: QuizQuestion[]
  shuffleOptions?: boolean
  feedback?: ActiveQuiz['feedback']
  timeLimitMinutes?: number | null
}

export function buildActiveQuiz({
  title,
  source,
  questions,
  shuffleOptions = false,
  feedback = 'immediate',
  timeLimitMinutes = null,
}: BuildActiveQuizInput): ActiveQuiz {
  const startedAt = Date.now()
  return {
    id: createId('quiz'),
    title,
    source,
    feedback,
    questionIds: questions.map((q) => q.id),
    optionOrder: buildOptionOrder(questions, shuffleOptions),
    answers: {},
    revealed: {},
    selfGrades: {},
    currentIndex: 0,
    startedAt,
    deadlineAt: timeLimitMinutes ? startedAt + timeLimitMinutes * 60_000 : null,
  }
}
