import { beforeEach, describe, expect, it } from 'vitest'
import type { QuizAttempt } from '@/domain/types'
import { useProgressStore } from './progress'

const attempt = (id: string, results: QuizAttempt['results']): QuizAttempt => ({
  id,
  title: id,
  source: 'builder',
  startedAt: 1,
  finishedAt: 2,
  results,
})

describe('useProgressStore', () => {
  beforeEach(() => useProgressStore.getState().clearAll())

  it('cập nhật thống kê câu hỏi, không tính câu bỏ qua', () => {
    useProgressStore.getState().recordAttempt(
      attempt('a', [
        { questionId: 'q1', answer: 'x', status: 'correct', score: 1 },
        { questionId: 'q2', answer: 'x', status: 'wrong', score: 0 },
        { questionId: 'q3', answer: null, status: 'skipped', score: 0 },
      ]),
    )
    const { stats } = useProgressStore.getState()
    expect(stats.q1).toMatchObject({ seen: 1, correct: 1, wrong: 0, lastCorrect: true })
    expect(stats.q2).toMatchObject({ seen: 1, correct: 0, wrong: 1, lastCorrect: false })
    expect(stats.q3).toBeUndefined()
  })

  it('câu đúng một phần chưa được tính là đúng', () => {
    useProgressStore
      .getState()
      .recordQuestionResult({ questionId: 'q', status: 'partial', score: 0.5 })
    expect(useProgressStore.getState().stats.q).toMatchObject({ correct: 0, wrong: 1 })
  })

  it('đánh dấu rồi bỏ đánh dấu', () => {
    const { toggleBookmark } = useProgressStore.getState()
    toggleBookmark('q', 'quiz')
    expect(useProgressStore.getState().bookmarks.q?.kind).toBe('quiz')
    toggleBookmark('q', 'quiz')
    expect(useProgressStore.getState().bookmarks.q).toBeUndefined()
  })

  it('đổi điểm tự chấm thì cập nhật cả bài làm và thống kê', () => {
    const store = useProgressStore.getState()
    store.recordAttempt(
      attempt('a', [{ questionId: 'q', answer: 'x', status: 'partial', score: 0.5 }]),
    )
    expect(useProgressStore.getState().stats.q).toMatchObject({ correct: 0, wrong: 1 })

    store.adjustAttemptResult('a', 'q', 1)
    let state = useProgressStore.getState()
    expect(state.attempts[0].results[0]).toMatchObject({ score: 1, status: 'correct' })
    expect(state.stats.q).toMatchObject({ correct: 1, wrong: 0, lastCorrect: true })

    store.adjustAttemptResult('a', 'q', 0)
    state = useProgressStore.getState()
    expect(state.attempts[0].results[0]).toMatchObject({ score: 0, status: 'wrong' })
    expect(state.stats.q).toMatchObject({ correct: 0, wrong: 1, lastCorrect: false })
  })

  it('giới hạn số bài lưu trong lịch sử', () => {
    for (let i = 0; i < 205; i++) useProgressStore.getState().recordAttempt(attempt(`a${i}`, []))
    const { attempts } = useProgressStore.getState()
    expect(attempts).toHaveLength(200)
    expect(attempts[0].id).toBe('a204')
  })
})
