import { describe, expect, it } from 'vitest'
import type { QuizQuestion } from '../types'
import { gradeQuestion } from './grade'

const base = {
  id: 'q',
  topicId: 't',
  category: 'c',
  conceptIds: ['x'],
  difficulty: 'co-ban' as const,
  skill: 'essence' as const,
  tags: [],
  prompt: 'p',
  explanation: 'e',
}

const options = [
  { id: 'a', text: 'A', explanation: 'x' },
  { id: 'b', text: 'B', explanation: 'x' },
  { id: 'c', text: 'C', explanation: 'x' },
]

describe('gradeQuestion', () => {
  it('chấm câu một đáp án', () => {
    const q: QuizQuestion = { ...base, type: 'single', options, correct: 'a' }
    expect(gradeQuestion(q, 'a').status).toBe('correct')
    expect(gradeQuestion(q, 'b').status).toBe('wrong')
    expect(gradeQuestion(q, undefined).status).toBe('skipped')
  })

  it('chấm câu tình huống như câu một đáp án', () => {
    const q: QuizQuestion = { ...base, type: 'scenario', scenario: 's', options, correct: 'b' }
    expect(gradeQuestion(q, 'b').score).toBe(1)
    expect(gradeQuestion(q, 'a').score).toBe(0)
  })

  it('câu nhiều đáp án phải chọn đúng toàn bộ, không phụ thuộc thứ tự', () => {
    const q: QuizQuestion = { ...base, type: 'multiple', options, correct: ['a', 'c'] }
    expect(gradeQuestion(q, ['c', 'a']).status).toBe('correct')
    expect(gradeQuestion(q, ['a']).status).toBe('wrong')
    expect(gradeQuestion(q, ['a', 'b', 'c']).status).toBe('wrong')
    expect(gradeQuestion(q, []).status).toBe('skipped')
  })

  it('chấm Đúng / Sai, kể cả khi đáp án đúng là false', () => {
    const q: QuizQuestion = { ...base, type: 'true-false', correct: false, wrongExplanation: 'w' }
    expect(gradeQuestion(q, false).status).toBe('correct')
    expect(gradeQuestion(q, true).status).toBe('wrong')
  })

  it('điền khuyết không phân biệt hoa thường, dấu và dấu câu', () => {
    const q: QuizQuestion = {
      ...base,
      type: 'fill-blank',
      acceptedAnswers: ['Đánh giá trì hoãn', 'lazy evaluation'],
    }
    expect(gradeQuestion(q, 'danh gia tri hoan').status).toBe('correct')
    expect(gradeQuestion(q, '  Lazy-Evaluation. ').status).toBe('correct')
    expect(gradeQuestion(q, 'eager').status).toBe('wrong')
    expect(gradeQuestion(q, '   ').status).toBe('skipped')
  })

  it('câu trả lời ngắn lấy điểm từ phần tự chấm', () => {
    const q: QuizQuestion = {
      ...base,
      type: 'short-answer',
      referenceAnswer: 'r',
      keyPoints: [
        { text: 'a', keywords: ['a'] },
        { text: 'b', keywords: ['b'] },
      ],
    }
    expect(gradeQuestion(q, 'câu trả lời', 1).status).toBe('correct')
    expect(gradeQuestion(q, 'câu trả lời', 0.5)).toEqual({ status: 'partial', score: 0.5 })
    expect(gradeQuestion(q, 'câu trả lời', 0).status).toBe('wrong')
    expect(gradeQuestion(q, 'câu trả lời').status).toBe('wrong')
    expect(gradeQuestion(q, '', 1).status).toBe('skipped')
  })
})
