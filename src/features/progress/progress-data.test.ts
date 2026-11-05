import { describe, expect, it } from 'vitest'
import type { QuestionStat, QuizAttempt, QuizQuestion } from '@/domain/types'
import { accuracyByDifficulty, accuracyByTopic, activityByDay } from './progress-data'

const stat = (correct: number, wrong: number): QuestionStat => ({
  seen: correct + wrong,
  correct,
  wrong,
  lastAt: 1,
  lastCorrect: wrong === 0,
})
const question = (id: string, topicId: string, difficulty: QuizQuestion['difficulty']) =>
  [id, { id, topicId, difficulty } as QuizQuestion] as const

describe('progress-data', () => {
  const byId = new Map([
    question('a', 'spark', 'co-ban'),
    question('b', 'spark', 'nang-cao'),
    question('c', 'kafka', 'co-ban'),
  ])
  const stats = { a: stat(3, 1), b: stat(1, 3), c: stat(0, 2), ghost: stat(9, 0) }

  it('tính theo chủ đề, chủ đề yếu lên trước, bỏ câu không còn tồn tại', () => {
    const rows = accuracyByTopic(stats, byId)
    expect(rows.map((r) => [r.topicId, r.value])).toEqual([
      ['kafka', 0],
      ['spark', 50],
    ])
  })

  it('tính theo độ khó và giữ đúng thứ tự độ khó', () => {
    const rows = accuracyByDifficulty(stats, byId)
    expect(rows.map((r) => [r.label, r.value])).toEqual([
      ['Cơ bản', 50],
      ['Nâng cao', 25],
    ])
  })

  it('đếm câu theo ngày, không tính câu bỏ qua và bài ngoài 14 ngày', () => {
    const now = new Date(2026, 10, 20, 12).getTime()
    const attempt = (finishedAt: number): QuizAttempt => ({
      id: String(finishedAt),
      title: 't',
      source: 'builder',
      startedAt: finishedAt,
      finishedAt,
      results: [
        { questionId: 'a', answer: 'x', status: 'correct', score: 1 },
        { questionId: 'b', answer: null, status: 'skipped', score: 0 },
      ],
    })
    const rows = activityByDay([attempt(now), attempt(now - 40 * 86_400_000)], now)
    expect(rows).toHaveLength(14)
    expect(rows.at(-1)!.value).toBe(1)
    expect(rows.reduce((sum, r) => sum + r.value, 0)).toBe(1)
  })
})
