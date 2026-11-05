import { useSearchParams } from 'react-router'
import { PageHeader } from '@/components/common/page-header'
import { ErrorState, LoadingState } from '@/components/common/states'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QuestionBank } from './question-bank'
import { QuizBuilder } from './quiz-builder'
import { QuizHistory } from './quiz-history'
import { ResumeQuizBanner } from './resume-quiz-banner'
import { useQuizBank } from './use-quiz-bank'

const TAB_VALUES = ['builder', 'bank', 'history']

export function QuizCenterPage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('tab')
  const tab = requested && TAB_VALUES.includes(requested) ? requested : 'builder'
  const { bank, loading, error } = useQuizBank()

  return (
    <>
      <PageHeader
        title="Trung tâm Quiz"
        description="Tự tạo bài kiểm tra theo nhu cầu, tra cứu ngân hàng câu hỏi và xem lại các bài đã làm."
      />
      <ResumeQuizBanner />
      <Tabs
        value={tab}
        onValueChange={(value) =>
          setParams(
            (current) => {
              const next = new URLSearchParams(current)
              next.set('tab', value)
              return next
            },
            { replace: true },
          )
        }
      >
        <TabsList className="mb-5">
          <TabsTrigger value="builder">Tạo quiz</TabsTrigger>
          <TabsTrigger value="bank">Ngân hàng câu hỏi</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>
        {loading && <LoadingState label="Đang tải ngân hàng câu hỏi..." />}
        {!!error && <ErrorState />}
        {!loading && !error && (
          <>
            <TabsContent value="builder">
              <QuizBuilder bank={bank} />
            </TabsContent>
            <TabsContent value="bank">
              <QuestionBank bank={bank} />
            </TabsContent>
            <TabsContent value="history">
              <QuizHistory />
            </TabsContent>
          </>
        )}
      </Tabs>
    </>
  )
}
