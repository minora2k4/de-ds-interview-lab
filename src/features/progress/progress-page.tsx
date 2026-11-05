import { TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '@/components/common/page-header'
import { StatTile } from '@/components/common/stat-tile'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/states'
import { Button } from '@/components/ui/button'
import { averageScore } from '@/domain/interview/session'
import { useProgressStore } from '@/stores/progress'
import { useQuizBank } from '../quiz/use-quiz-bank'
import { ActivityColumns, ChartCard, HorizontalBars, TrendChart } from './charts'
import {
  accuracyByDifficulty,
  accuracyByTopic,
  accuracyTrend,
  activityByDay,
  interviewTrend,
} from './progress-data'

export function ProgressPage() {
  const attempts = useProgressStore((s) => s.attempts)
  const interviews = useProgressStore((s) => s.interviews)
  const stats = useProgressStore((s) => s.stats)
  const { bank, byId, loading, error } = useQuizBank()

  const trend = useMemo(() => accuracyTrend(attempts), [attempts])
  const byTopic = useMemo(() => accuracyByTopic(stats, byId), [byId, stats])
  const byDifficulty = useMemo(() => accuracyByDifficulty(stats, byId), [byId, stats])
  const activity = useMemo(() => activityByDay(attempts), [attempts])
  const interviewScores = useMemo(() => interviewTrend(interviews), [interviews])

  const statValues = Object.values(stats)
  const answered = statValues.reduce((sum, s) => sum + s.seen, 0)
  const correct = statValues.reduce((sum, s) => sum + s.correct, 0)
  const overall = answered === 0 ? 0 : Math.round((correct / answered) * 100)
  const uniqueDone = statValues.length

  const header = (
    <PageHeader
      title="Tiến độ học tập"
      description="Thống kê được tính từ lịch sử làm quiz và phỏng vấn trên thiết bị này."
    />
  )

  if (loading) {
    return (
      <>
        {header}
        <LoadingState />
      </>
    )
  }
  if (error) {
    return (
      <>
        {header}
        <ErrorState />
      </>
    )
  }
  if (answered === 0 && interviews.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={TrendingUp}
          title="Chưa có dữ liệu"
          description="Làm một bài quiz hoặc một buổi phỏng vấn để bắt đầu theo dõi tiến độ."
          action={
            <Button asChild>
              <Link to="/quiz">Làm bài quiz đầu tiên</Link>
            </Button>
          }
        />
      </>
    )
  }

  return (
    <>
      {header}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Tỷ lệ chính xác" value={`${overall}%`} hint={`${answered} lượt trả lời`} />
        <StatTile label="Câu đã làm" value={uniqueDone} hint={`trên tổng ${bank.length} câu`} />
        <StatTile label="Bài quiz" value={attempts.length} />
        <StatTile
          label="Điểm phỏng vấn"
          value={
            interviews.length > 0
              ? `${averageScore(interviews.flatMap((i) => i.answers.map((a) => a.score)))}/10`
              : 'Chưa có'
          }
          hint={interviews.length > 0 ? `${interviews.length} buổi` : undefined}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {trend.length > 0 && (
          <ChartCard title="Độ chính xác theo thời gian" description="20 bài quiz gần nhất, đơn vị %" points={trend} unit="%">
            <TrendChart points={trend} unit="%" domainMax={100} />
          </ChartCard>
        )}
        <ChartCard title="Số câu đã trả lời" description="14 ngày gần nhất" points={activity} unit=" câu">
          <ActivityColumns points={activity} unit=" câu" />
        </ChartCard>
        {byTopic.length > 0 && (
          <ChartCard title="Độ chính xác theo chủ đề" description="Chủ đề yếu nhất ở trên cùng" points={byTopic} unit="%">
            <HorizontalBars points={byTopic} unit="%" domainMax={100} />
          </ChartCard>
        )}
        {byDifficulty.length > 0 && (
          <ChartCard title="Độ chính xác theo độ khó" points={byDifficulty} unit="%">
            <HorizontalBars points={byDifficulty} unit="%" domainMax={100} />
          </ChartCard>
        )}
        {interviewScores.length > 0 && (
          <ChartCard title="Điểm phỏng vấn" description="Điểm trung bình mỗi buổi, thang 10" points={interviewScores} unit="/10">
            <TrendChart points={interviewScores} unit="/10" domainMax={10} />
          </ChartCard>
        )}
      </div>
    </>
  )
}
