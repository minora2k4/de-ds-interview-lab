import { DIFFICULTIES } from '../labels'
import { shuffled, type Rng } from '../random'
import type { InterviewQuestion, InterviewType, Level } from '../types'

export function filterInterviewPool(
  bank: InterviewQuestion[],
  type: InterviewType,
  level: Level,
): InterviewQuestion[] {
  return bank.filter((q) => q.interviewTypes.includes(type) && q.levels.includes(level))
}

/**
 * Dành khoảng một nửa buổi cho câu First Principles nếu có đủ, phần còn lại rút
 * ngẫu nhiên, rồi xếp từ dễ đến khó như một buổi phỏng vấn thật.
 */
export function buildInterviewQuestions(
  pool: InterviewQuestion[],
  count: number,
  rng: Rng = Math.random,
): InterviewQuestion[] {
  const firstPrinciples = shuffled(
    pool.filter((q) => q.firstPrinciples),
    rng,
  )
  const others = shuffled(
    pool.filter((q) => !q.firstPrinciples),
    rng,
  )
  const targetFirstPrinciples = Math.ceil(count / 2)
  const picked = firstPrinciples.slice(0, targetFirstPrinciples)
  const remaining = [...others, ...firstPrinciples.slice(targetFirstPrinciples)]
  picked.push(...remaining.slice(0, count - picked.length))
  return picked.sort(
    (a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty),
  )
}

export function averageScore(scores: number[]): number {
  if (scores.length === 0) return 0
  return Math.round((scores.reduce((sum, s) => sum + s, 0) / scores.length) * 10) / 10
}
