import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { QuizConfig } from '@/domain/types'
import { safeStorage, STORAGE_KEYS } from '@/services/storage'

export const DEFAULT_QUIZ_CONFIG: QuizConfig = {
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

interface SettingsState {
  quizDefaults: QuizConfig
  setQuizDefaults: (patch: Partial<QuizConfig>) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      quizDefaults: DEFAULT_QUIZ_CONFIG,
      setQuizDefaults: (patch) =>
        set((state) => ({ quizDefaults: { ...state.quizDefaults, ...patch } })),
      reset: () => set({ quizDefaults: DEFAULT_QUIZ_CONFIG }),
    }),
    {
      name: STORAGE_KEYS.settings,
      version: 2,
      // Bỏ trường theme còn lại trong LocalStorage của các phiên bản cũ.
      migrate: (persistedState) => {
        const legacy = persistedState as Partial<SettingsState>
        return { quizDefaults: legacy.quizDefaults ?? DEFAULT_QUIZ_CONFIG }
      },
      storage: createJSONStorage(() => safeStorage),
    },
  ),
)
