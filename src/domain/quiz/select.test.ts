import { describe, expect, it } from 'vitest'
import type { QuestionStat, QuizConfig, QuizQuestion, Topic } from '../types'
import { filterPool, selectQuestions } from './select'

function question(id: string, overrides: Partial<QuizQuestion> = {}): QuizQuestion {
  return {
    id,
    topicId: 'spark',
    category: 'c',
    conceptIds: ['x'],
    difficulty: 'co-ban',
    skill: 'essence',
    tags: [],
    prompt: 'p',
    explanation: 'e',
    type: 'true-false',
    correct: true,
    wrongExplanation: 'w',
    ...overrides,
  } as QuizQuestion
}

const topics: Record<string, Topic> = {
  spark: { id: 'spark', title: '', description: '', domains: ['de'], fields: ['de', 'bigdata'], subtopics: [] },
  stats: { id: 'stats', title: '', description: '', domains: ['ds'], fields: ['ds'], subtopics: [] },
}
const getTopic = (id: string) => topics[id]

const config: QuizConfig = {
  fields: [],
  topicIds: [],
  difficulties: [],
  types: [],
  count: 10,
  shuffle: true,
  timeLimitMinutes: null,
  feedback: 'end',
  onlyUnseen: false,
  onlyWrong: false,
}

const stat = (wrong: number): QuestionStat => ({
  seen: 1,
  correct: wrong ? 0 : 1,
  wrong,
  lastAt: 1,
  lastCorrect: !wrong,
})

describe('filterPool', () => {
  const bank = [
    question('a'),
    question('b', { topicId: 'stats', difficulty: 'nang-cao' }),
    question('c', { topicId: 'stats', fields: ['ds', 'bigdata'] }),
  ]

  it('lọc theo lĩnh vực, ưu tiên fields riêng của câu hỏi', () => {
    const ids = filterPool(bank, { ...config, fields: ['bigdata'] }, {}, getTopic).map((q) => q.id)
    expect(ids).toEqual(['a', 'c'])
  })

  it('lọc theo chủ đề và độ khó', () => {
    const ids = filterPool(
      bank,
      { ...config, topicIds: ['stats'], difficulties: ['nang-cao'] },
      {},
      getTopic,
    ).map((q) => q.id)
    expect(ids).toEqual(['b'])
  })

  it('chỉ lấy câu chưa làm', () => {
    const ids = filterPool(bank, { ...config, onlyUnseen: true }, { a: stat(0) }, getTopic).map((q) => q.id)
    expect(ids).toEqual(['b', 'c'])
  })

  it('chỉ lấy câu đã sai', () => {
    const ids = filterPool(bank, { ...config, onlyWrong: true }, { a: stat(0), b: stat(2) }, getTopic).map((q) => q.id)
    expect(ids).toEqual(['b'])
  })

  it('bật cả hai thì lấy hợp của câu chưa làm và câu đã sai', () => {
    const ids = filterPool(
      bank,
      { ...config, onlyUnseen: true, onlyWrong: true },
      { a: stat(0), b: stat(2) },
      getTopic,
    ).map((q) => q.id)
    expect(ids).toEqual(['b', 'c'])
  })
})

describe('selectQuestions', () => {
  const pool = [
    ...Array.from({ length: 20 }, (_, i) => question(`s${i}`)),
    question('t1', { topicId: 'stats' }),
    question('t2', { topicId: 'stats' }),
  ]

  it('không vượt quá số câu yêu cầu và không trùng', () => {
    const picked = selectQuestions(pool, 10, true)
    expect(picked).toHaveLength(10)
    expect(new Set(picked.map((q) => q.id)).size).toBe(10)
  })

  it('trả về hết nếu không đủ câu', () => {
    expect(selectQuestions(pool, 50, true)).toHaveLength(pool.length)
  })

  it('cân bằng giữa các chủ đề, chủ đề ít câu vẫn được chọn', () => {
    const picked = selectQuestions(pool, 4, true)
    expect(picked.filter((q) => q.topicId === 'stats')).toHaveLength(2)
  })

  it('tắt xáo trộn thì xếp từ dễ đến khó', () => {
    const mixed = [
      question('hard', { difficulty: 'chuyen-sau' }),
      question('easy', { difficulty: 'co-ban' }),
      question('mid', { difficulty: 'trung-binh' }),
    ]
    expect(selectQuestions(mixed, 3, false).map((q) => q.id)).toEqual(['easy', 'mid', 'hard'])
  })
})
