import { useMemo } from 'react'
import type { InterviewQuestion } from '@/domain/types'
import { useAsync } from '@/hooks/use-async'
import { contentRepository } from '@/services/content-repository'

export function useInterviewBank() {
  const { data, loading, error } = useAsync(() => contentRepository.loadAllInterview(), 'interview-bank')
  const bank = useMemo(() => data ?? [], [data])
  const byId = useMemo(() => new Map<string, InterviewQuestion>(bank.map((q) => [q.id, q])), [bank])
  return { bank, byId, loading, error }
}
