import { Badge } from '@/components/ui/badge'
import { getTopic } from '@/content/catalog'
import { DIFFICULTY_LABEL, GRADE_STATUS_LABEL, QUESTION_TYPE_LABEL, SKILL_LABEL } from '@/domain/labels'
import type { Difficulty, GradeStatus, QuestionType, Skill } from '@/domain/types'
import { Check, CircleDashed, CircleMinus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return <Badge variant="outline">{DIFFICULTY_LABEL[difficulty]}</Badge>
}

export function QuestionTypeBadge({ type }: { type: QuestionType }) {
  return <Badge variant="outline">{QUESTION_TYPE_LABEL[type]}</Badge>
}

export function SkillBadge({ skill }: { skill: Skill }) {
  return <Badge variant="secondary">{SKILL_LABEL[skill]}</Badge>
}

export function TopicBadge({ topicId }: { topicId: string }) {
  return <Badge variant="secondary">{getTopic(topicId)?.title ?? topicId}</Badge>
}

const STATUS_STYLE: Record<GradeStatus, { className: string; icon: typeof Check }> = {
  correct: { className: 'bg-success-soft text-success', icon: Check },
  partial: { className: 'bg-warning-soft text-warning', icon: CircleMinus },
  wrong: { className: 'bg-danger-soft text-danger', icon: X },
  skipped: { className: 'bg-muted text-muted-foreground', icon: CircleDashed },
}

/** Trạng thái chấm luôn đi cùng icon và chữ, không chỉ dựa vào màu. */
export function GradeBadge({ status }: { status: GradeStatus }) {
  const { className, icon: Icon } = STATUS_STYLE[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {GRADE_STATUS_LABEL[status]}
    </span>
  )
}
