import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ToggleChipProps {
  pressed: boolean
  onClick: () => void
  disabled?: boolean
  children: ReactNode
  className?: string
}

/** Nút chọn dạng thẻ. Trạng thái chọn có cả dấu tick, không chỉ dựa vào màu. */
export function ToggleChip({ pressed, onClick, disabled, children, className }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-9 items-center gap-1.5 rounded-md border px-3 py-1.5 text-left text-sm transition-colors',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        pressed
          ? 'border-primary/50 bg-accent font-medium text-accent-foreground'
          : 'bg-card hover:bg-muted',
        className,
      )}
    >
      {pressed && <Check className="size-3.5 shrink-0" aria-hidden />}
      {children}
    </button>
  )
}
