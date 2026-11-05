import { shuffled, type Rng } from '../random'
import { DIFFICULTIES } from '../labels'
import type { QuestionStat, QuizConfig, QuizField, QuizQuestion, Topic } from '../types'

export function questionFields(question: QuizQuestion, topic: Topic | undefined): QuizField[] {
  return question.fields ?? topic?.fields ?? []
}

/** Câu đã từng làm sai và lần gần nhất vẫn sai, hoặc có số lần sai lớn hơn 0. */
export function isWrongQuestion(stat: QuestionStat | undefined): boolean {
  return !!stat && stat.wrong > 0
}

export function filterPool(
  bank: QuizQuestion[],
  config: QuizConfig,
  stats: Record<string, QuestionStat>,
  getTopic: (id: string) => Topic | undefined,
): QuizQuestion[] {
  const topicSet = new Set(config.topicIds)
  const difficultySet = new Set(config.difficulties)
  const typeSet = new Set(config.types)
  const fieldSet = new Set(config.fields)

  return bank.filter((q) => {
    if (fieldSet.size > 0) {
      const fields = questionFields(q, getTopic(q.topicId))
      if (!fields.some((f) => fieldSet.has(f))) return false
    }
    if (topicSet.size > 0 && !topicSet.has(q.topicId)) return false
    if (difficultySet.size > 0 && !difficultySet.has(q.difficulty)) return false
    if (typeSet.size > 0 && !typeSet.has(q.type)) return false

    const stat = stats[q.id]
    if (config.onlyUnseen && config.onlyWrong) {
      return !stat || isWrongQuestion(stat)
    }
    if (config.onlyUnseen && stat) return false
    if (config.onlyWrong && !isWrongQuestion(stat)) return false
    return true
  })
}

/** Rút lần lượt từ từng chủ đề để một chủ đề nhiều câu không lấn át các chủ đề khác. */
function pickBalanced(pool: QuizQuestion[], count: number, rng: Rng): QuizQuestion[] {
  const byTopic = new Map<string, QuizQuestion[]>()
  for (const q of shuffled(pool, rng)) {
    const list = byTopic.get(q.topicId)
    if (list) list.push(q)
    else byTopic.set(q.topicId, [q])
  }
  const queues = shuffled([...byTopic.values()], rng)
  const picked: QuizQuestion[] = []
  while (picked.length < count && queues.some((q) => q.length > 0)) {
    for (const queue of queues) {
      const next = queue.pop()
      if (next) picked.push(next)
      if (picked.length === count) break
    }
  }
  return picked
}

/**
 * `shuffle` chỉ quyết định thứ tự hiển thị. Câu hỏi luôn được rút ngẫu nhiên,
 * nếu không thì tắt xáo trộn sẽ luôn cho cùng một bộ đề.
 */
export function selectQuestions(
  pool: QuizQuestion[],
  count: number,
  shuffle: boolean,
  rng: Rng = Math.random,
): QuizQuestion[] {
  const picked = pickBalanced(pool, count, rng)
  if (shuffle) return shuffled(picked, rng)
  return [...picked].sort(
    (a, b) =>
      DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty) ||
      a.topicId.localeCompare(b.topicId),
  )
}

export function buildOptionOrder(
  questions: QuizQuestion[],
  shuffle: boolean,
  rng: Rng = Math.random,
): Record<string, string[]> {
  const order: Record<string, string[]> = {}
  for (const q of questions) {
    if ('options' in q) {
      const ids = q.options.map((o) => o.id)
      order[q.id] = shuffle ? shuffled(ids, rng) : ids
    }
  }
  return order
}
