import { beforeEach, describe, expect, it } from 'vitest'
import { useProgressStore } from '@/stores/progress'
import { parseBackup, serializeBackup } from './backup'

describe('backup', () => {
  beforeEach(() => useProgressStore.getState().clearAll())

  it('xuất rồi nhập lại giữ nguyên dữ liệu', () => {
    useProgressStore.getState().toggleBookmark('q1', 'quiz')
    useProgressStore.getState().recordQuestionResult({ questionId: 'q2', status: 'wrong', score: 0 })
    const restored = parseBackup(serializeBackup())
    expect(restored.progress.bookmarks.q1.kind).toBe('quiz')
    expect(restored.progress.stats.q2.wrong).toBe(1)
  })

  it('từ chối tệp không hợp lệ', () => {
    expect(() => parseBackup('không phải JSON')).toThrow()
    expect(() => parseBackup('{"app":"khac"}')).toThrow()
    expect(() => parseBackup('{"app":"de-ds-interview-lab","version":99}')).toThrow()
    expect(() =>
      parseBackup('{"app":"de-ds-interview-lab","version":1,"progress":{},"settings":{}}'),
    ).toThrow()
  })

  it('vẫn nhập được bản sao lưu cũ có thiết lập giao diện', () => {
    const legacy = JSON.stringify({
      app: 'de-ds-interview-lab',
      version: 1,
      exportedAt: 0,
      progress: { attempts: [], interviews: [], stats: {}, bookmarks: {} },
      settings: { theme: 'light', quizDefaults: {} },
    })
    expect(parseBackup(legacy).settings.quizDefaults).toEqual({})
  })
})
