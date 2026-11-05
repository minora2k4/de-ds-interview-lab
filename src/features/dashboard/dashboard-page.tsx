import { ChevronRight, ListChecks, MessagesSquare, BookOpenCheck } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '@/components/common/page-header'
import { StatTile } from '@/components/common/stat-tile'
import { LoadingState } from '@/components/common/states'
import { ALL_CONCEPTS, DOMAINS, conceptCount, topicPath, topicsOfDomain } from '@/content/catalog'
import { averageScore } from '@/domain/interview/session'
import { summarizeAttempt } from '@/domain/quiz/summary'
import { formatDateTime } from '@/lib/format'
import { useProgressStore } from '@/stores/progress'
import { accuracyByTopic } from '../progress/progress-data'
import { useQuizBank } from '../quiz/use-quiz-bank'
import { ResumeQuizBanner } from '../quiz/resume-quiz-banner'

const QUICK_ACTIONS = [
  {
    to: '/quiz',
    title: 'Tạo bài quiz',
    description: 'Chọn chủ đề, độ khó và dạng câu theo nhu cầu.',
    icon: ListChecks,
  },
  {
    to: '/interview',
    title: 'Luyện phỏng vấn',
    description: 'Trả lời từng câu rồi đối chiếu với đáp án tham khảo.',
    icon: MessagesSquare,
  },
  {
    to: '/review',
    title: 'Ôn tập nhanh',
    description: 'Flashcard định nghĩa và những câu bạn hay sai.',
    icon: BookOpenCheck,
  },
]

export function DashboardPage() {
  const attempts = useProgressStore((s) => s.attempts)
  const interviews = useProgressStore((s) => s.interviews)
  const stats = useProgressStore((s) => s.stats)
  const bookmarkCount = useProgressStore((s) => Object.keys(s.bookmarks).length)
  const { bank, byId, loading } = useQuizBank()

  const weakTopics = useMemo(
    () => accuracyByTopic(stats, byId).filter((topic) => topic.value < 70).slice(0, 5),
    [byId, stats],
  )
  const statValues = Object.values(stats)
  const answered = statValues.reduce((sum, s) => sum + s.seen, 0)
  const correct = statValues.reduce((sum, s) => sum + s.correct, 0)

  return (
    <>
      <PageHeader
        title="Tổng quan"
        description="Hệ thống hóa kiến thức và luyện phỏng vấn vị trí Data Engineer, Data Scientist."
      />
      <ResumeQuizBanner />

      <div className="grid gap-3 sm:grid-cols-3">
        {QUICK_ACTIONS.map(({ to, title, description, icon: Icon }) => (
          <Link key={to} to={to} className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
            <Icon className="mb-2 size-5 text-primary" aria-hidden />
            <p className="font-medium">{title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label="Tỷ lệ chính xác"
          value={answered === 0 ? 'Chưa có' : `${Math.round((correct / answered) * 100)}%`}
          hint={answered === 0 ? undefined : `${answered} lượt trả lời`}
        />
        <StatTile
          label="Câu đã làm"
          value={statValues.length}
          hint={loading ? undefined : `trên tổng ${bank.length} câu`}
        />
        <StatTile
          label="Điểm phỏng vấn"
          value={
            interviews.length === 0
              ? 'Chưa có'
              : `${averageScore(interviews.flatMap((i) => i.answers.map((a) => a.score)))}/10`
          }
          hint={interviews.length === 0 ? undefined : `${interviews.length} buổi`}
        />
        <StatTile label="Câu đã lưu" value={bookmarkCount} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Chủ đề cần củng cố</h2>
          {loading ? (
            <LoadingState />
          ) : weakTopics.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Chưa thấy chủ đề yếu. Chủ đề có độ chính xác dưới 70% sẽ hiện ở đây sau khi bạn làm quiz.
            </p>
          ) : (
            <ul className="divide-y overflow-hidden rounded-lg border bg-card">
              {weakTopics.map((topic) => (
                <li key={topic.topicId}>
                  <Link
                    to={topicPath(topic.topicId)}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <span className="min-w-0 flex-1 text-sm">{topic.label}</span>
                    <span className="text-sm font-medium tabular-nums">{topic.value}%</span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">Bài làm gần đây</h2>
          {attempts.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              Bạn chưa làm bài nào.
            </p>
          ) : (
            <ul className="divide-y overflow-hidden rounded-lg border bg-card">
              {attempts.slice(0, 5).map((attempt) => {
                const summary = summarizeAttempt(attempt)
                return (
                  <li key={attempt.id}>
                    <Link
                      to={`/quiz/result/${attempt.id}`}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{attempt.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {formatDateTime(attempt.finishedAt)}
                        </span>
                      </span>
                      <span className="text-sm font-medium tabular-nums">{summary.accuracy}%</span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-8">
        <h2 className="mb-1 text-lg font-semibold tracking-tight">Bản đồ kiến thức</h2>
        <p className="mb-3 text-sm text-muted-foreground">{ALL_CONCEPTS.length} khái niệm thuộc hai lĩnh vực.</p>
        <div className="grid gap-6 lg:grid-cols-2">
          {DOMAINS.map((domain) => (
            <div key={domain.id}>
              <h3 className="mb-2 text-sm font-medium">{domain.title}</h3>
              <ul className="divide-y overflow-hidden rounded-lg border bg-card">
                {topicsOfDomain(domain.id).map((topic) => (
                  <li key={topic.id}>
                    <Link
                      to={topicPath(topic.id, domain.id)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted/50"
                    >
                      <span className="min-w-0 flex-1">{topic.title}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {conceptCount(topic)} khái niệm
                      </span>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
