import { ChevronRight, History } from 'lucide-react'
import { Link } from 'react-router'
import { EmptyState } from '@/components/common/states'
import { Button } from '@/components/ui/button'
import { summarizeAttempt } from '@/domain/quiz/summary'
import { formatDateTime, formatDuration } from '@/lib/format'
import { useProgressStore } from '@/stores/progress'

export function QuizHistory() {
  const attempts = useProgressStore((s) => s.attempts)

  if (attempts.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="Chưa có bài làm nào"
        description="Các bài quiz bạn đã nộp sẽ xuất hiện ở đây."
        action={
          <Button asChild variant="outline">
            <Link to="/quiz?tab=builder">Tạo quiz đầu tiên</Link>
          </Button>
        }
      />
    )
  }

  return (
    <ul className="divide-y overflow-hidden rounded-lg border bg-card">
      {attempts.map((attempt) => {
        const summary = summarizeAttempt(attempt)
        return (
          <li key={attempt.id}>
            <Link
              to={`/quiz/result/${attempt.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{attempt.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {formatDateTime(attempt.finishedAt)} · {formatDuration(summary.durationMs)}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-semibold tabular-nums">{summary.accuracy}%</span>
                <span className="block text-xs text-muted-foreground tabular-nums">
                  {summary.correct}/{summary.total} câu đúng
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
