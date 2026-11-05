import { ChevronRight, CircleAlert, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PageHeader } from '@/components/common/page-header'
import { ErrorState, LoadingState } from '@/components/common/states'
import { ToggleChip } from '@/components/common/toggle-chip'
import { Button } from '@/components/ui/button'
import { averageScore, buildInterviewQuestions, filterInterviewPool } from '@/domain/interview/session'
import {
  INTERVIEW_TYPES,
  INTERVIEW_TYPE_DESCRIPTION,
  INTERVIEW_TYPE_LABEL,
  LEVELS,
  LEVEL_LABEL,
} from '@/domain/labels'
import { createId } from '@/domain/random'
import type { InterviewType, Level } from '@/domain/types'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/stores/progress'
import { useSessionStore } from '@/stores/session'
import { useInterviewBank } from './use-interview-bank'

const COUNT_OPTIONS = [5, 10, 15]

export function InterviewSetupPage() {
  const navigate = useNavigate()
  const { bank, loading, error } = useInterviewBank()
  const active = useSessionStore((s) => s.interview)
  const startInterview = useSessionStore((s) => s.startInterview)
  const history = useProgressStore((s) => s.interviews)
  const [type, setType] = useState<InterviewType>('de')
  const [level, setLevel] = useState<Level>('junior')
  const [count, setCount] = useState(5)

  const pool = useMemo(() => filterInterviewPool(bank, type, level), [bank, level, type])
  const firstPrinciples = pool.filter((q) => q.firstPrinciples).length

  const start = () => {
    const questions = buildInterviewQuestions(pool, count)
    startInterview({
      id: createId('interview'),
      type,
      level,
      questionIds: questions.map((q) => q.id),
      currentIndex: 0,
      answers: {},
      drafts: {},
      submitted: {},
      startedAt: Date.now(),
    })
    navigate('/interview/session')
  }

  return (
    <>
      <PageHeader
        title="Luyện phỏng vấn"
        description="Mô phỏng buổi phỏng vấn: mỗi lần một câu, bạn tự trả lời, sau đó đối chiếu với đáp án tham khảo và thang điểm."
      />

      {active && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-accent/50 px-4 py-3">
          <p className="text-sm">
            Bạn đang có buổi <span className="font-medium">{INTERVIEW_TYPE_LABEL[active.type]}</span> làm dở.
          </p>
          <Button asChild size="sm">
            <Link to="/interview/session">Làm tiếp</Link>
          </Button>
        </div>
      )}

      {loading && <LoadingState label="Đang tải câu hỏi phỏng vấn..." />}
      {!!error && <ErrorState />}
      {!loading && !error && (
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Loại phỏng vấn</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {INTERVIEW_TYPES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={type === option}
                    onClick={() => setType(option)}
                    className={cn(
                      'rounded-lg border p-3 text-left transition-colors',
                      'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                      type === option ? 'border-primary/50 bg-accent' : 'bg-card hover:bg-muted/50',
                    )}
                  >
                    <span className="block text-sm font-medium">{INTERVIEW_TYPE_LABEL[option]}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {INTERVIEW_TYPE_DESCRIPTION[option]}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Cấp độ</legend>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((option) => (
                  <ToggleChip key={option} pressed={level === option} onClick={() => setLevel(option)}>
                    {LEVEL_LABEL[option]}
                  </ToggleChip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Số câu hỏi</legend>
              <div className="flex flex-wrap gap-2">
                {COUNT_OPTIONS.map((option) => (
                  <ToggleChip key={option} pressed={count === option} onClick={() => setCount(option)}>
                    {option} câu
                  </ToggleChip>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="self-start rounded-lg border bg-card p-4 lg:sticky lg:top-16">
            <p className="text-sm" aria-live="polite">
              Có <span className="font-semibold">{pool.length}</span> câu phù hợp, trong đó{' '}
              <span className="font-semibold">{firstPrinciples}</span> câu First Principles.
            </p>
            {pool.length > 0 && pool.length < count && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-warning">
                <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Không đủ {count} câu, buổi này sẽ có {pool.length} câu.
              </p>
            )}
            {pool.length === 0 && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-warning">
                <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Chưa có câu hỏi cho lựa chọn này. Hãy đổi loại hoặc cấp độ.
              </p>
            )}
            <Button className="mt-4 w-full" disabled={pool.length === 0} onClick={start}>
              <Play aria-hidden />
              Bắt đầu phỏng vấn
            </Button>
          </aside>
        </div>
      )}

      {history.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">Các buổi đã làm</h2>
          <ul className="divide-y overflow-hidden rounded-lg border bg-card">
            {history.map((session) => (
              <li key={session.id}>
                <Link
                  to={`/interview/result/${session.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {INTERVIEW_TYPE_LABEL[session.type]} · {LEVEL_LABEL[session.level]}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {formatDateTime(session.finishedAt)} · {session.answers.length} câu
                    </span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums">
                    {averageScore(session.answers.map((a) => a.score))}/10
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
