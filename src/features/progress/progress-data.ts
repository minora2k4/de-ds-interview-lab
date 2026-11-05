import { getTopic } from '@/content/catalog'
import { averageScore } from '@/domain/interview/session'
import { DIFFICULTIES, DIFFICULTY_LABEL } from '@/domain/labels'
import { summarizeAttempt } from '@/domain/quiz/summary'
import type {
  InterviewSessionResult,
  QuestionStat,
  QuizAttempt,
  QuizQuestion,
} from '@/domain/types'
import { formatShortDate } from '@/lib/format'
import type { ChartPoint } from './charts'

const DAY_MS = 86_400_000

export function accuracyTrend(attempts: QuizAttempt[]): ChartPoint[] {
  return [...attempts]
    .sort((a, b) => a.finishedAt - b.finishedAt)
    .slice(-20)
    .map((attempt) => {
      const summary = summarizeAttempt(attempt)
      return {
        label: formatShortDate(attempt.finishedAt),
        value: summary.accuracy,
        detail: `${attempt.title}, đúng ${summary.correct}/${summary.total} câu`,
      }
    })
}

interface Tally {
  correct: number
  seen: number
}

function tally<K>(
  stats: Record<string, QuestionStat>,
  byId: Map<string, QuizQuestion>,
  keyOf: (question: QuizQuestion) => K,
): Map<K, Tally> {
  const groups = new Map<K, Tally>()
  for (const [id, stat] of Object.entries(stats)) {
    const question = byId.get(id)
    if (!question) continue
    const key = keyOf(question)
    const group = groups.get(key) ?? { correct: 0, seen: 0 }
    group.correct += stat.correct
    group.seen += stat.seen
    groups.set(key, group)
  }
  return groups
}

const percent = ({ correct, seen }: Tally) => (seen === 0 ? 0 : Math.round((correct / seen) * 100))

/** Xếp chủ đề yếu nhất lên trước vì đó là thứ người học cần thấy đầu tiên. */
export function accuracyByTopic(
  stats: Record<string, QuestionStat>,
  byId: Map<string, QuizQuestion>,
): (ChartPoint & { topicId: string })[] {
  return [...tally(stats, byId, (q) => q.topicId).entries()]
    .map(([topicId, group]) => ({
      topicId,
      label: getTopic(topicId)?.title ?? topicId,
      value: percent(group),
      detail: `${group.seen} lượt trả lời`,
    }))
    .sort((a, b) => a.value - b.value)
}

export function accuracyByDifficulty(
  stats: Record<string, QuestionStat>,
  byId: Map<string, QuizQuestion>,
): ChartPoint[] {
  const groups = tally(stats, byId, (q) => q.difficulty)
  return DIFFICULTIES.flatMap((difficulty) => {
    const group = groups.get(difficulty)
    if (!group) return []
    return [
      {
        label: DIFFICULTY_LABEL[difficulty],
        value: percent(group),
        detail: `${group.seen} lượt trả lời`,
      },
    ]
  })
}

/** Số câu trả lời trong 14 ngày gần nhất, tính cả ngày không học. */
export function activityByDay(attempts: QuizAttempt[], now = Date.now()): ChartPoint[] {
  const startOfToday = new Date(now).setHours(0, 0, 0, 0)
  const days = Array.from({ length: 14 }, (_, index) => {
    const start = startOfToday - (13 - index) * DAY_MS
    return { start, value: 0, label: formatShortDate(start) }
  })
  for (const attempt of attempts) {
    const day = days.find((d) => attempt.finishedAt >= d.start && attempt.finishedAt < d.start + DAY_MS)
    if (day) day.value += attempt.results.filter((r) => r.status !== 'skipped').length
  }
  return days.map(({ label, value }) => ({ label, value }))
}

export function interviewTrend(sessions: InterviewSessionResult[]): ChartPoint[] {
  return [...sessions]
    .sort((a, b) => a.finishedAt - b.finishedAt)
    .slice(-20)
    .map((session) => ({
      label: formatShortDate(session.finishedAt),
      value: averageScore(session.answers.map((a) => a.score)),
      detail: `${session.answers.length} câu`,
    }))
}
