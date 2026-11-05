import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BookmarkKind } from '@/domain/types'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/stores/progress'

interface BookmarkButtonProps {
  questionId: string
  kind: BookmarkKind
  showLabel?: boolean
}

export function BookmarkButton({ questionId, kind, showLabel }: BookmarkButtonProps) {
  const saved = useProgressStore((s) => !!s.bookmarks[questionId])
  const toggle = useProgressStore((s) => s.toggleBookmark)
  const label = saved ? 'Bỏ lưu câu hỏi' : 'Lưu câu hỏi'

  return (
    <Button
      type="button"
      variant="ghost"
      size={showLabel ? 'sm' : 'icon'}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      onClick={() => toggle(questionId, kind)}
    >
      <Bookmark className={cn('size-4', saved && 'fill-current text-primary')} aria-hidden />
      {showLabel && (saved ? 'Đã lưu' : 'Lưu lại')}
    </Button>
  )
}
