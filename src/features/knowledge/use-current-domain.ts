import { useLocation } from 'react-router'
import type { DomainId } from '@/domain/types'

export function useCurrentDomain(): DomainId {
  const { pathname } = useLocation()
  return pathname.startsWith('/ds') ? 'ds' : 'de'
}
