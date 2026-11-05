import { useMemo } from 'react'
import type { QuizQuestion } from '@/domain/types'
import { useAsync } from '@/hooks/use-async'
import { contentRepository } from '@/services/content-repository'

export function useQuizBank() {
  const { data, loading, error } = useAsync(() => contentRepository.loadAllQuiz(), 'quiz-bank')
  const bank = useMemo(() => data ?? [], [data])
  const byId = useMemo(() => new Map<string, QuizQuestion>(bank.map((q) => [q.id, q])), [bank])
  return { bank, byId, loading, error }
}
