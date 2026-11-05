import { ListChecks, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PageHeader } from '@/components/common/page-header'
import { StatTile } from '@/components/common/stat-tile'
import { EmptyState, LoadingState } from '@/components/common/states'
import { ToggleChip } from '@/components/common/toggle-chip'
import { Button } from '@/components/ui/button'
import { getTopic, topicPath } from '@/content/catalog'
import { DIFFICULTY_LABEL } from '@/domain/labels'
import { assessCompetence, difficultyBreakdown, summarizeAttempt } from '@/domain/quiz/summary'
import type { QuizQuestion } from '@/domain/types'
import { formatDuration } from '@/lib/format'
import { useProgressStore } from '@/stores/progress'
import { useSessionStore } from '@/stores/session'
import { QuestionReview } from './question-review'
import { buildActiveQuiz } from './start-quiz'
import { useQuizBank } from './use-quiz-bank'

type ReviewFilter = 'all' | 'wrong'

export function QuizResultPage() {
  const { attemptId = '' } = useParams()
  const navigate = useNavigate()
  const attempt = useProgressStore((s) => s.attempts.find((a) => a.id === attemptId))
  const adjustResult = useProgressStore((s) => s.adjustAttemptResult)
  const startQuiz = useSessionStore((s) => s.startQuiz)
  const { byId, loading } = useQuizBank()
  const [filter, setFilter] = useState<ReviewFilter>('all')

  const wrongQuestions = useMemo<QuizQuestion[]>(
    () =>
      (attempt?.results ?? []).flatMap((r) => {
        const question = byId.get(r.questionId)
        return question && r.score < 1 ? [question] : []
      }),
    [attempt, byId],
  )

  if (!attempt) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Không tìm thấy kết quả"
        description="Bài này có thể đã bị xóa khỏi lịch sử."
        action={
          <Button asChild>
            <Link to="/quiz">Về Trung tâm Quiz</Link>
          </Button>
        }
      />
    )
  }
  if (loading) return <LoadingState />

  const summary = summarizeAttempt(attempt)
  const competence = assessCompetence(attempt.results, byId)
  const breakdown = difficultyBreakdown(attempt.results, byId)
  const visibleResults =
    filter === 'all' ? attempt.results : attempt.results.filter((r) => r.score < 1)

  const retryWrong = () => {
    startQuiz(
      buildActiveQuiz({
        title: `Làm lại ${wrongQuestions.length} câu sai`,
        source: 'retry',
        questions: wrongQuestions,
        shuffleOptions: true,
      }),
    )
    navigate('/quiz/session')
  }

  return (
    <>
      <PageHeader
        title="Kết quả bài làm"
        description={attempt.title}
        actions={
          <>
            {wrongQuestions.length > 0 && (
              <Button onClick={retryWrong}>
                <RotateCcw aria-hidden />
                Làm lại câu sai
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to="/quiz">Tạo quiz mới</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatTile label="Tổng điểm" value={`${summary.accuracy}/100`} />
        <StatTile label="Số câu đúng" value={summary.correct} hint={summary.partial ? `và ${summary.partial} câu đúng một phần` : undefined} />
        <StatTile label="Số câu sai" value={summary.wrong} hint={summary.skipped ? `và ${summary.skipped} câu bỏ qua` : undefined} />
        <StatTile label="Tỷ lệ chính xác" value={`${summary.accuracy}%`} />
        <StatTile label="Thời gian" value={formatDuration(summary.durationMs)} />
      </div>

      <section className="mt-4 rounded-lg border bg-card p-4">
        <h2 className="text-sm font-medium text-muted-foreground">Đánh giá năng lực</h2>
        <p className="mt-1 text-lg font-semibold">{competence.label}</p>
        <p className="mt-1 text-sm">{competence.advice}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Điểm năng lực {competence.weightedScore}/100, câu khó được tính nặng hơn.
        </p>
        {breakdown.length > 1 && (
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {breakdown.map((row) => (
              <li key={row.difficulty}>
                <span className="text-muted-foreground">{DIFFICULTY_LABEL[row.difficulty]}: </span>
                <span className="font-medium">{row.accuracy}%</span>
                <span className="text-muted-foreground"> ({row.total} câu)</span>
              </li>
            ))}
          </ul>
        )}
        {competence.weakTopicIds.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Nên ôn lại:</span>
            {competence.weakTopicIds.map((id) => (
              <Link
                key={id}
                to={topicPath(id)}
                className="text-accent-foreground underline decoration-current/30 underline-offset-3 hover:decoration-current"
              >
                {getTopic(id)?.title ?? id}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight">Xem lại từng câu</h2>
          <div className="flex gap-2">
            <ToggleChip pressed={filter === 'all'} onClick={() => setFilter('all')}>
              Tất cả
            </ToggleChip>
            <ToggleChip pressed={filter === 'wrong'} onClick={() => setFilter('wrong')}>
              Chưa đúng ({wrongQuestions.length})
            </ToggleChip>
          </div>
        </div>
        {visibleResults.length === 0 && (
          <p className="text-sm text-muted-foreground">Bạn đã trả lời đúng tất cả các câu.</p>
        )}
        <div className="space-y-4">
          {visibleResults.map((result) => {
            const question = byId.get(result.questionId)
            if (!question) return null
            return (
              <QuestionReview
                key={result.questionId}
                index={attempt.results.indexOf(result)}
                question={question}
                answer={result.answer}
                status={result.status}
                selfGrade={question.type === 'short-answer' ? result.score : undefined}
                onSelfGrade={
                  question.type === 'short-answer'
                    ? (grade) => adjustResult(attempt.id, result.questionId, grade)
                    : undefined
                }
              />
            )
          })}
        </div>
      </section>
    </>
  )
}
