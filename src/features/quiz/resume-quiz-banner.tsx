import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useSessionStore } from '@/stores/session'

export function ResumeQuizBanner() {
  const quiz = useSessionStore((s) => s.quiz)
  if (!quiz) return null
  const answered = Object.keys(quiz.answers).length
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-accent/50 px-4 py-3">
      <p className="text-sm">
        Bạn đang có bài <span className="font-medium">{quiz.title}</span> làm dở ({answered}/
        {quiz.questionIds.length} câu).
      </p>
      <Button asChild size="sm">
        <Link to="/quiz/session">Làm tiếp</Link>
      </Button>
    </div>
  )
}
