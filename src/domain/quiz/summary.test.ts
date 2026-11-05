import { describe, expect, it } from 'vitest'
import type { QuestionResult, QuizQuestion } from '../types'
import { assessCompetence, summarizeResults } from './summary'

const result = (questionId: string, score: number): QuestionResult => ({
  questionId,
  answer: 'x',
  score,
  status: score === 1 ? 'correct' : score === 0 ? 'wrong' : 'partial',
})

describe('summarizeResults', () => {
  it('tính cả câu đúng một phần', () => {
    const summary = summarizeResults([result('a', 1), result('b', 0.5), result('c', 0), result('d', 0.5)])
    expect(summary).toMatchObject({ total: 4, correct: 1, partial: 2, wrong: 1, accuracy: 50 })
  })

  it('không chia cho 0 khi chưa có kết quả', () => {
    expect(summarizeResults([]).accuracy).toBe(0)
  })
})

describe('assessCompetence', () => {
  const q = (id: string, topicId: string, difficulty: QuizQuestion['difficulty']) =>
    [id, { id, topicId, difficulty } as QuizQuestion] as const

  it('câu khó có trọng số lớn hơn và chỉ ra chủ đề yếu', () => {
    const questions = new Map([q('a', 'spark', 'co-ban'), q('b', 'kafka', 'chuyen-sau')])
    const assessment = assessCompetence([result('a', 1), result('b', 0)], questions)
    expect(assessment.weightedScore).toBe(29)
    expect(assessment.weakTopicIds).toEqual(['kafka'])
    expect(assessment.label).toBe('Cần củng cố nền tảng')
  })

  it('điểm cao được đánh giá sẵn sàng phỏng vấn', () => {
    const questions = new Map([q('a', 'spark', 'nang-cao')])
    expect(assessCompetence([result('a', 1)], questions).label).toBe('Sẵn sàng phỏng vấn')
  })
})
