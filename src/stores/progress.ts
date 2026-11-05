import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  Bookmark,
  BookmarkKind,
  GradeStatus,
  InterviewSessionResult,
  QuestionResult,
  QuestionStat,
  QuizAttempt,
} from '@/domain/types'
import { safeStorage, STORAGE_KEYS } from '@/services/storage'

/** Giữ lịch sử có giới hạn để không chạm hạn mức khoảng 5 MB của LocalStorage. */
const MAX_ATTEMPTS = 200
const MAX_INTERVIEWS = 100

export interface ProgressData {
  attempts: QuizAttempt[]
  interviews: InterviewSessionResult[]
  stats: Record<string, QuestionStat>
  bookmarks: Record<string, Bookmark>
}

interface ProgressState extends ProgressData {
  recordAttempt: (attempt: QuizAttempt) => void
  recordQuestionResult: (result: Pick<QuestionResult, 'questionId' | 'score' | 'status'>) => void
  recordInterview: (session: InterviewSessionResult) => void
  /** Đổi điểm tự chấm của câu trả lời ngắn sau khi đã nộp bài. */
  adjustAttemptResult: (attemptId: string, questionId: string, score: number) => void
  toggleBookmark: (id: string, kind: BookmarkKind) => void
  replaceAll: (data: ProgressData) => void
  clearAll: () => void
}

const EMPTY: ProgressData = { attempts: [], interviews: [], stats: {}, bookmarks: {} }

function applyResult(
  stats: Record<string, QuestionStat>,
  result: Pick<QuestionResult, 'questionId' | 'score' | 'status'>,
  at: number,
): Record<string, QuestionStat> {
  if (result.status === 'skipped') return stats
  const previous = stats[result.questionId] ?? {
    seen: 0,
    correct: 0,
    wrong: 0,
    lastAt: 0,
    lastCorrect: false,
  }
  const isCorrect = result.score >= 1
  return {
    ...stats,
    [result.questionId]: {
      seen: previous.seen + 1,
      correct: previous.correct + (isCorrect ? 1 : 0),
      wrong: previous.wrong + (isCorrect ? 0 : 1),
      lastAt: at,
      lastCorrect: isCorrect,
    },
  }
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...EMPTY,
      recordAttempt: (attempt) =>
        set((state) => {
          let stats = state.stats
          for (const result of attempt.results) {
            stats = applyResult(stats, result, attempt.finishedAt)
          }
          return { attempts: [attempt, ...state.attempts].slice(0, MAX_ATTEMPTS), stats }
        }),
      recordQuestionResult: (result) =>
        set((state) => ({ stats: applyResult(state.stats, result, Date.now()) })),
      recordInterview: (session) =>
        set((state) => ({
          interviews: [session, ...state.interviews].slice(0, MAX_INTERVIEWS),
        })),
      adjustAttemptResult: (attemptId, questionId, score) =>
        set((state) => {
          const attempt = state.attempts.find((a) => a.id === attemptId)
          const previous = attempt?.results.find((r) => r.questionId === questionId)
          if (!attempt || !previous || previous.score === score) return state

          const status: GradeStatus = score >= 1 ? 'correct' : score > 0 ? 'partial' : 'wrong'
          const attempts = state.attempts.map((a) =>
            a.id !== attemptId
              ? a
              : {
                  ...a,
                  results: a.results.map((r) =>
                    r.questionId === questionId ? { ...r, score, status } : r,
                  ),
                },
          )

          const stat = state.stats[questionId]
          const wasCorrect = previous.score >= 1
          const isCorrect = score >= 1
          if (!stat || wasCorrect === isCorrect) return { attempts }
          const delta = isCorrect ? 1 : -1
          return {
            attempts,
            stats: {
              ...state.stats,
              [questionId]: {
                ...stat,
                correct: stat.correct + delta,
                wrong: stat.wrong - delta,
                lastCorrect: isCorrect,
              },
            },
          }
        }),
      toggleBookmark: (id, kind) =>
        set((state) => {
          const bookmarks = { ...state.bookmarks }
          if (bookmarks[id]) delete bookmarks[id]
          else bookmarks[id] = { kind, at: Date.now() }
          return { bookmarks }
        }),
      replaceAll: (data) => set(data),
      clearAll: () => set(EMPTY),
    }),
    {
      name: STORAGE_KEYS.progress,
      version: 1,
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)
