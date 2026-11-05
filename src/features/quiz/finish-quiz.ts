import { gradeQuestion } from '@/domain/quiz/grade'
import { suggestSelfGrade } from '@/domain/quiz/suggest'
import type { ActiveQuiz, QuestionResult, QuizAttempt, QuizQuestion } from '@/domain/types'

/** Chuyển bài đang làm thành kết quả. Câu trả lời ngắn chưa tự chấm dùng điểm gợi ý. */
export function buildAttempt(quiz: ActiveQuiz, byId: Map<string, QuizQuestion>): QuizAttempt {
  const results = quiz.questionIds.flatMap((questionId): QuestionResult[] => {
    const question = byId.get(questionId)
    if (!question) return []
    const answer = quiz.answers[questionId] ?? null
    let selfGrade = quiz.selfGrades[questionId]
    if (selfGrade === undefined && question.type === 'short-answer' && typeof answer === 'string') {
      selfGrade = suggestSelfGrade(answer, question.keyPoints)
    }
    const grade = gradeQuestion(question, answer, selfGrade)
    return [{ questionId, answer, status: grade.status, score: grade.score }]
  })
  return {
    id: quiz.id,
    title: quiz.title,
    source: quiz.source,
    startedAt: quiz.startedAt,
    finishedAt: Date.now(),
    results,
  }
}
