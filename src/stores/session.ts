import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { ActiveInterview, ActiveQuiz, QuizAnswer } from '@/domain/types'
import { safeStorage, STORAGE_KEYS } from '@/services/storage'

/** Bài đang làm dở. Lưu lại để tải lại trang trên điện thoại không bị mất. */
interface SessionState {
  quiz: ActiveQuiz | null
  interview: ActiveInterview | null
  startQuiz: (quiz: ActiveQuiz) => void
  answerQuestion: (questionId: string, answer: QuizAnswer) => void
  revealQuestion: (questionId: string) => void
  setSelfGrade: (questionId: string, grade: number) => void
  goToQuestion: (index: number) => void
  endQuiz: () => void
  startInterview: (interview: ActiveInterview) => void
  updateInterview: (patch: Partial<ActiveInterview>) => void
  endInterview: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      quiz: null,
      interview: null,
      startQuiz: (quiz) => set({ quiz }),
      answerQuestion: (questionId, answer) =>
        set((state) =>
          state.quiz
            ? { quiz: { ...state.quiz, answers: { ...state.quiz.answers, [questionId]: answer } } }
            : state,
        ),
      revealQuestion: (questionId) =>
        set((state) =>
          state.quiz
            ? { quiz: { ...state.quiz, revealed: { ...state.quiz.revealed, [questionId]: true } } }
            : state,
        ),
      setSelfGrade: (questionId, grade) =>
        set((state) =>
          state.quiz
            ? {
                quiz: {
                  ...state.quiz,
                  selfGrades: { ...state.quiz.selfGrades, [questionId]: grade },
                },
              }
            : state,
        ),
      goToQuestion: (index) =>
        set((state) => (state.quiz ? { quiz: { ...state.quiz, currentIndex: index } } : state)),
      endQuiz: () => set({ quiz: null }),
      startInterview: (interview) => set({ interview }),
      updateInterview: (patch) =>
        set((state) => (state.interview ? { interview: { ...state.interview, ...patch } } : state)),
      endInterview: () => set({ interview: null }),
    }),
    {
      name: STORAGE_KEYS.session,
      version: 1,
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)
