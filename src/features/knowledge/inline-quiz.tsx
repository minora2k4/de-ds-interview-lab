import { RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { QuestionFeedback } from '@/components/question/question-feedback'
import { QuestionView } from '@/components/question/question-view'
import { Button } from '@/components/ui/button'
import { shuffled } from '@/domain/random'
import { gradeQuestion } from '@/domain/quiz/grade'
import { buildOptionOrder } from '@/domain/quiz/select'
import { suggestSelfGrade } from '@/domain/quiz/suggest'
import type { QuizAnswer, QuizQuestion } from '@/domain/types'
import { useProgressStore } from '@/stores/progress'

const QUESTIONS_PER_ROUND = 5

/** Quiz ngắn ngay trong trang khái niệm, luôn hiện đáp án sau mỗi câu. */
export function InlineQuiz({ questions }: { questions: QuizQuestion[] }) {
  const recordResult = useProgressStore((s) => s.recordQuestionResult)
  const [round, setRound] = useState(0)
  const deck = useMemo(() => {
    void round
    return shuffled(questions).slice(0, QUESTIONS_PER_ROUND)
  }, [questions, round])
  const optionOrder = useMemo(() => buildOptionOrder(deck, true), [deck])
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<QuizAnswer | undefined>(undefined)
  const [selfGrade, setSelfGrade] = useState<number | undefined>(undefined)
  const [revealed, setRevealed] = useState(false)
  const [scores, setScores] = useState<number[]>([])

  const question = deck[index]
  const finished = index >= deck.length

  const resetQuestion = () => {
    setAnswer(undefined)
    setSelfGrade(undefined)
    setRevealed(false)
  }

  const restart = () => {
    setRound((value) => value + 1)
    setIndex(0)
    setScores([])
    resetQuestion()
  }

  if (finished) {
    const total = scores.reduce((sum, s) => sum + s, 0)
    return (
      <div className="rounded-lg border bg-card p-4">
        <p className="font-medium">
          Bạn được {total}/{deck.length} điểm
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Kết quả đã được tính vào thống kê câu hỏi của bạn.
        </p>
        <Button className="mt-3" variant="outline" size="sm" onClick={restart}>
          <RotateCcw aria-hidden />
          Làm lại
        </Button>
      </div>
    )
  }

  const hasAnswer =
    answer !== undefined && answer !== '' && !(Array.isArray(answer) && answer.length === 0)

  const next = () => {
    const effective =
      question.type === 'short-answer' && typeof answer === 'string'
        ? (selfGrade ?? suggestSelfGrade(answer, question.keyPoints))
        : selfGrade
    const grade = gradeQuestion(question, answer, effective)
    recordResult({ questionId: question.id, status: grade.status, score: grade.score })
    setScores((list) => [...list, grade.score])
    setIndex((value) => value + 1)
    resetQuestion()
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <p className="text-xs text-muted-foreground">
        Câu {index + 1}/{deck.length}
      </p>
      <QuestionView
        key={`${round}-${question.id}`}
        question={question}
        optionOrder={optionOrder[question.id]}
        answer={answer}
        onAnswer={setAnswer}
        revealed={revealed}
      />
      {revealed && (
        <QuestionFeedback
          question={question}
          answer={answer}
          selfGrade={selfGrade}
          onSelfGrade={setSelfGrade}
        />
      )}
      <div className="flex justify-end">
        {revealed ? (
          <Button size="sm" onClick={next}>
            {index + 1 === deck.length ? 'Xem kết quả' : 'Câu tiếp theo'}
          </Button>
        ) : (
          <Button size="sm" disabled={!hasAnswer} onClick={() => setRevealed(true)}>
            Kiểm tra đáp án
          </Button>
        )}
      </div>
    </div>
  )
}
