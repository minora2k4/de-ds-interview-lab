import { ChevronLeft, ChevronRight, Flag, ListChecks, Timer } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/states'
import { DifficultyBadge, QuestionTypeBadge, SkillBadge, TopicBadge } from '@/components/question/badges'
import { BookmarkButton } from '@/components/question/bookmark-button'
import { QuestionFeedback } from '@/components/question/question-feedback'
import { QuestionView } from '@/components/question/question-view'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { ActiveQuiz, QuizAnswer } from '@/domain/types'
import { formatClock } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/stores/progress'
import { useSessionStore } from '@/stores/session'
import { buildAttempt } from './finish-quiz'
import { useQuizBank } from './use-quiz-bank'

function isAnswered(answer: QuizAnswer | undefined): boolean {
  if (answer === undefined) return false
  if (typeof answer === 'string') return answer.trim() !== ''
  if (Array.isArray(answer)) return answer.length > 0
  return true
}

function useCountdown(deadlineAt: number | null, onExpire: () => void): number | null {
  const [remaining, setRemaining] = useState<number | null>(() =>
    deadlineAt ? deadlineAt - Date.now() : null,
  )
  const expire = useRef(onExpire)
  useEffect(() => {
    expire.current = onExpire
  }, [onExpire])

  useEffect(() => {
    if (!deadlineAt) return
    const tick = () => {
      const left = deadlineAt - Date.now()
      setRemaining(left)
      if (left <= 0) {
        clearInterval(timer)
        expire.current()
      }
    }
    const timer = setInterval(tick, 1000)
    tick()
    return () => clearInterval(timer)
  }, [deadlineAt])

  return remaining
}

function QuestionPalette({ quiz, onPick }: { quiz: ActiveQuiz; onPick: (index: number) => void }) {
  return (
    <nav aria-label="Danh sách câu hỏi" className="flex flex-wrap gap-1.5">
      {quiz.questionIds.map((id, index) => {
        const current = quiz.currentIndex === index
        const answered = isAnswered(quiz.answers[id])
        return (
          <button
            key={id}
            type="button"
            aria-current={current ? 'step' : undefined}
            aria-label={`Câu ${index + 1}${answered ? ', đã trả lời' : ', chưa trả lời'}`}
            onClick={() => onPick(index)}
            className={cn(
              'size-8 rounded-md border text-xs tabular-nums transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              answered ? 'bg-accent font-medium text-accent-foreground' : 'bg-card hover:bg-muted',
              current && 'ring-2 ring-primary/70',
            )}
          >
            {index + 1}
          </button>
        )
      })}
    </nav>
  )
}

export function QuizSessionPage() {
  const navigate = useNavigate()
  const quiz = useSessionStore((s) => s.quiz)
  const answerQuestion = useSessionStore((s) => s.answerQuestion)
  const revealQuestion = useSessionStore((s) => s.revealQuestion)
  const setSelfGrade = useSessionStore((s) => s.setSelfGrade)
  const goToQuestion = useSessionStore((s) => s.goToQuestion)
  const endQuiz = useSessionStore((s) => s.endQuiz)
  const recordAttempt = useProgressStore((s) => s.recordAttempt)
  const { byId, loading, error } = useQuizBank()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [quitOpen, setQuitOpen] = useState(false)

  const finish = useCallback(() => {
    const current = useSessionStore.getState().quiz
    if (!current) return
    const attempt = buildAttempt(current, byId)
    recordAttempt(attempt)
    endQuiz()
    navigate(`/quiz/result/${attempt.id}`, { replace: true })
  }, [byId, endQuiz, navigate, recordAttempt])

  const remaining = useCountdown(loading ? null : (quiz?.deadlineAt ?? null), finish)

  if (!quiz) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Không có bài đang làm"
        description="Hãy tạo một bài quiz mới ở Trung tâm Quiz."
        action={
          <Button asChild>
            <Link to="/quiz">Về Trung tâm Quiz</Link>
          </Button>
        }
      />
    )
  }
  if (loading) return <LoadingState label="Đang tải câu hỏi..." />
  if (error) return <ErrorState />

  const questionId = quiz.questionIds[quiz.currentIndex]
  const question = byId.get(questionId)
  if (!question) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Không tìm thấy câu hỏi"
        description="Câu hỏi trong bài này không còn tồn tại, có thể do nội dung vừa được cập nhật."
        action={
          <Button
            onClick={() => {
              endQuiz()
              navigate('/quiz')
            }}
          >
            Hủy bài và quay lại
          </Button>
        }
      />
    )
  }

  const total = quiz.questionIds.length
  const answer = quiz.answers[questionId]
  const revealed = !!quiz.revealed[questionId]
  const answeredCount = quiz.questionIds.filter((id) => isAnswered(quiz.answers[id])).length
  const unanswered = total - answeredCount
  const isLast = quiz.currentIndex === total - 1
  const lowTime = remaining !== null && remaining < 60_000

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium">
          Câu {quiz.currentIndex + 1}/{total}
        </p>
        <div className="flex items-center gap-1">
          {remaining !== null && (
            <span
              role="timer"
              className={cn(
                'mr-1 inline-flex items-center gap-1 text-sm font-medium tabular-nums',
                lowTime && 'text-danger',
              )}
            >
              <Timer className="size-4" aria-hidden />
              {formatClock(remaining)}
            </span>
          )}
          <BookmarkButton questionId={question.id} kind="quiz" />
          <Button variant="ghost" size="sm" onClick={() => setQuitOpen(true)}>
            Thoát
          </Button>
        </div>
      </div>
      <Progress value={(answeredCount / total) * 100} className="mb-5 h-1" aria-label="Tiến độ làm bài" />

      <div className="mb-3 flex flex-wrap gap-1.5">
        <TopicBadge topicId={question.topicId} />
        <DifficultyBadge difficulty={question.difficulty} />
        <QuestionTypeBadge type={question.type} />
        {revealed && <SkillBadge skill={question.skill} />}
      </div>

      <QuestionView
        key={question.id}
        question={question}
        optionOrder={quiz.optionOrder[question.id]}
        answer={answer}
        onAnswer={(value) => answerQuestion(question.id, value)}
        revealed={revealed}
      />

      {revealed && (
        <div className="mt-4">
          <QuestionFeedback
            question={question}
            answer={answer}
            selfGrade={quiz.selfGrades[question.id]}
            onSelfGrade={(grade) => setSelfGrade(question.id, grade)}
          />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="outline"
          disabled={quiz.currentIndex === 0}
          onClick={() => goToQuestion(quiz.currentIndex - 1)}
        >
          <ChevronLeft aria-hidden />
          Câu trước
        </Button>
        <div className="flex flex-wrap gap-2">
          {quiz.feedback === 'immediate' && !revealed && (
            <Button
              variant={isAnswered(answer) ? 'default' : 'outline'}
              disabled={!isAnswered(answer)}
              onClick={() => revealQuestion(question.id)}
            >
              Kiểm tra đáp án
            </Button>
          )}
          {isLast ? (
            <Button onClick={() => (unanswered > 0 ? setConfirmOpen(true) : finish())}>
              <Flag aria-hidden />
              Nộp bài
            </Button>
          ) : (
            <Button
              variant={quiz.feedback === 'immediate' && !revealed ? 'outline' : 'default'}
              onClick={() => goToQuestion(quiz.currentIndex + 1)}
            >
              Câu tiếp theo
              <ChevronRight aria-hidden />
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Đã trả lời {answeredCount}/{total} câu
          </p>
          {!isLast && (
            <Button variant="ghost" size="sm" onClick={() => (unanswered > 0 ? setConfirmOpen(true) : finish())}>
              Nộp bài sớm
            </Button>
          )}
        </div>
        <QuestionPalette quiz={quiz} onPick={goToQuestion} />
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nộp bài khi còn câu chưa trả lời?</AlertDialogTitle>
            <AlertDialogDescription>
              Còn {unanswered} câu chưa trả lời. Các câu này sẽ được tính là bỏ qua.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Làm tiếp</AlertDialogCancel>
            <AlertDialogAction onClick={finish}>Nộp bài</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={quitOpen} onOpenChange={setQuitOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thoát khỏi bài này?</AlertDialogTitle>
            <AlertDialogDescription>
              Bài làm dở sẽ bị hủy và không được lưu vào lịch sử.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Làm tiếp</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                endQuiz()
                navigate('/quiz')
              }}
            >
              Hủy bài
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
