import { normalizeText } from '../text/normalize'
import type { GradedAnswer, QuizAnswer, QuizQuestion } from '../types'

function isEmptyAnswer(answer: QuizAnswer | null | undefined): boolean {
  if (answer === null || answer === undefined) return true
  if (typeof answer === 'string') return answer.trim() === ''
  if (Array.isArray(answer)) return answer.length === 0
  return false
}

const WRONG: GradedAnswer = { status: 'wrong', score: 0 }
const CORRECT: GradedAnswer = { status: 'correct', score: 1 }
const SKIPPED: GradedAnswer = { status: 'skipped', score: 0 }

/**
 * Chấm một câu. Riêng câu trả lời ngắn lấy điểm từ `selfGrade` vì người học
 * tự chốt sau khi đối chiếu với đáp án tham khảo.
 */
export function gradeQuestion(
  question: QuizQuestion,
  answer: QuizAnswer | null | undefined,
  selfGrade?: number,
): GradedAnswer {
  if (isEmptyAnswer(answer)) return SKIPPED

  switch (question.type) {
    case 'single':
    case 'scenario':
      return answer === question.correct ? CORRECT : WRONG
    case 'multiple': {
      if (!Array.isArray(answer)) return WRONG
      const chosen = new Set(answer)
      const isExact =
        chosen.size === question.correct.length && question.correct.every((id) => chosen.has(id))
      return isExact ? CORRECT : WRONG
    }
    case 'true-false':
      return answer === question.correct ? CORRECT : WRONG
    case 'fill-blank': {
      if (typeof answer !== 'string') return WRONG
      const given = normalizeText(answer)
      return question.acceptedAnswers.some((a) => normalizeText(a) === given) ? CORRECT : WRONG
    }
    case 'short-answer': {
      if (selfGrade === undefined) return WRONG
      if (selfGrade >= 1) return CORRECT
      if (selfGrade > 0) return { status: 'partial', score: 0.5 }
      return WRONG
    }
  }
}
