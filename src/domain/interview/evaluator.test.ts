import { describe, expect, it } from 'vitest'
import type { InterviewQuestion, KeyPoint } from '../types'
import { KeywordEvaluator, matchKeyPoints, scoreBand, scoreFromPoints } from './evaluator'
import { buildInterviewQuestions, filterInterviewPool } from './session'

const points: KeyPoint[] = [
  { text: 'Tối ưu toàn cục', keywords: ['toi uu', 'optimize'], weight: 2 },
  { text: 'Tránh tính toán thừa', keywords: ['tinh toan thua'] },
  { text: 'Dựng DAG', keywords: ['dag'] },
]

describe('KeywordEvaluator', () => {
  it('nhận từ khóa không dấu và tính điểm theo trọng số', async () => {
    const result = await new KeywordEvaluator().evaluate({
      question: 'q',
      referenceAnswer: 'r',
      keyPoints: points,
      answer: 'Spark dựng DAG để tối ưu cả pipeline',
    })
    expect(result.matchedPoints).toEqual([0, 2])
    expect(result.score).toBe(8)
    expect(result.isHeuristic).toBe(true)
  })

  it('câu trả lời rỗng được 0 điểm', () => {
    expect(matchKeyPoints('   ', points)).toEqual([])
    expect(scoreFromPoints(points, [])).toBe(0)
  })
})

describe('scoreBand', () => {
  it('ánh xạ đúng biên điểm', () => {
    expect(scoreBand(10).label).toBe('Xuất sắc')
    expect(scoreBand(9).label).toBe('Xuất sắc')
    expect(scoreBand(8).label).toBe('Tốt')
    expect(scoreBand(4).label).toBe('Đạt mức cơ bản')
    expect(scoreBand(0).label).toBe('Chưa đạt')
  })
})

function interview(id: string, overrides: Partial<InterviewQuestion> = {}): InterviewQuestion {
  return {
    id,
    topicId: 'spark',
    category: 'c',
    conceptIds: ['x'],
    interviewTypes: ['de'],
    levels: ['junior'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'q',
    referenceAnswer: 'r',
    keyPoints: points,
    followUps: [],
    commonMistakes: [],
    ...overrides,
  }
}

describe('buildInterviewQuestions', () => {
  it('lọc theo loại và cấp độ', () => {
    const bank = [interview('a'), interview('b', { levels: ['senior'] }), interview('c', { interviewTypes: ['ds'] })]
    expect(filterInterviewPool(bank, 'de', 'junior').map((q) => q.id)).toEqual(['a'])
  })

  it('ưu tiên câu First Principles và xếp từ dễ đến khó', () => {
    const pool = [
      interview('fp1', { firstPrinciples: true, difficulty: 'chuyen-sau' }),
      interview('fp2', { firstPrinciples: true, difficulty: 'trung-binh' }),
      interview('n1', { difficulty: 'co-ban' }),
      interview('n2'),
      interview('n3'),
    ]
    const picked = buildInterviewQuestions(pool, 3)
    expect(picked).toHaveLength(3)
    expect(picked.filter((q) => q.firstPrinciples)).toHaveLength(2)
    expect(picked.at(-1)!.id).toBe('fp1')
  })

  it('không đủ câu First Principles thì lấy câu thường bù vào', () => {
    const pool = [interview('fp1', { firstPrinciples: true }), interview('n1'), interview('n2')]
    expect(buildInterviewQuestions(pool, 3)).toHaveLength(3)
  })
})
