import { DIFFICULTIES } from '../labels'
import type { Difficulty, QuestionResult, QuizAttempt, QuizQuestion } from '../types'

export interface AttemptSummary {
  total: number
  correct: number
  partial: number
  wrong: number
  skipped: number
  /** Thang 0–100, câu đúng một phần tính nửa điểm. */
  accuracy: number
  durationMs: number
}

export function summarizeResults(results: QuestionResult[]): Omit<AttemptSummary, 'durationMs'> {
  const count = (status: QuestionResult['status']) =>
    results.filter((r) => r.status === status).length
  const earned = results.reduce((sum, r) => sum + r.score, 0)
  return {
    total: results.length,
    correct: count('correct'),
    partial: count('partial'),
    wrong: count('wrong'),
    skipped: count('skipped'),
    accuracy: results.length === 0 ? 0 : Math.round((earned / results.length) * 100),
  }
}

export function summarizeAttempt(attempt: QuizAttempt): AttemptSummary {
  return {
    ...summarizeResults(attempt.results),
    durationMs: attempt.finishedAt - attempt.startedAt,
  }
}

const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  'co-ban': 1,
  'trung-binh': 1.5,
  'nang-cao': 2,
  'chuyen-sau': 2.5,
}

export interface CompetenceAssessment {
  /** Thang 0–100, câu khó được tính nặng hơn. */
  weightedScore: number
  label: string
  advice: string
  weakTopicIds: string[]
}

const COMPETENCE_BANDS: { min: number; label: string; advice: string }[] = [
  {
    min: 85,
    label: 'Sẵn sàng phỏng vấn',
    advice: 'Bạn nắm vững phần này. Hãy chuyển sang câu Nâng cao, Chuyên sâu hoặc luyện phỏng vấn.',
  },
  {
    min: 70,
    label: 'Vững kiến thức',
    advice: 'Nền tảng đã tốt. Xem lại các câu sai để lấp nốt những chỗ hiểu chưa kỹ.',
  },
  {
    min: 50,
    label: 'Hiểu cơ bản',
    advice: 'Bạn nắm khái niệm nhưng chưa chắc phần cơ chế và đánh đổi. Hãy đọc lại các trang liên quan.',
  },
  {
    min: 0,
    label: 'Cần củng cố nền tảng',
    advice: 'Nên học lại các chủ đề yếu, rồi làm lại quiz ở mức Cơ bản trước khi tăng độ khó.',
  },
]

export function assessCompetence(
  results: QuestionResult[],
  questionsById: Map<string, QuizQuestion>,
): CompetenceAssessment {
  let earned = 0
  let possible = 0
  const byTopic = new Map<string, { earned: number; total: number }>()

  for (const result of results) {
    const question = questionsById.get(result.questionId)
    if (!question) continue
    const weight = DIFFICULTY_WEIGHT[question.difficulty]
    earned += result.score * weight
    possible += weight
    const topic = byTopic.get(question.topicId) ?? { earned: 0, total: 0 }
    topic.earned += result.score
    topic.total += 1
    byTopic.set(question.topicId, topic)
  }

  const weightedScore = possible === 0 ? 0 : Math.round((earned / possible) * 100)
  const band = COMPETENCE_BANDS.find((b) => weightedScore >= b.min)!
  const weakTopicIds = [...byTopic.entries()]
    .filter(([, t]) => t.total > 0 && t.earned / t.total < 0.6)
    .sort((a, b) => a[1].earned / a[1].total - b[1].earned / b[1].total)
    .map(([id]) => id)

  return { weightedScore, label: band.label, advice: band.advice, weakTopicIds }
}

export function difficultyBreakdown(
  results: QuestionResult[],
  questionsById: Map<string, QuizQuestion>,
): { difficulty: Difficulty; total: number; accuracy: number }[] {
  return DIFFICULTIES.map((difficulty) => {
    const scoped = results.filter(
      (r) => questionsById.get(r.questionId)?.difficulty === difficulty,
    )
    const earned = scoped.reduce((sum, r) => sum + r.score, 0)
    return {
      difficulty,
      total: scoped.length,
      accuracy: scoped.length === 0 ? 0 : Math.round((earned / scoped.length) * 100),
    }
  }).filter((row) => row.total > 0)
}
