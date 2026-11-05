import { Check, X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Markdown } from '@/components/content/markdown'
import type { QuizAnswer, QuizOption, QuizQuestion } from '@/domain/types'
import { cn } from '@/lib/utils'

interface QuestionViewProps {
  question: QuizQuestion
  optionOrder?: string[]
  answer: QuizAnswer | undefined
  onAnswer?: (answer: QuizAnswer) => void
  /** Đã khóa và hiện đáp án. */
  revealed: boolean
}

function orderedOptions(options: QuizOption[], order?: string[]): QuizOption[] {
  if (!order) return options
  const byId = new Map(options.map((o) => [o.id, o]))
  const sorted = order.flatMap((id) => {
    const option = byId.get(id)
    return option ? [option] : []
  })
  return sorted.length === options.length ? sorted : options
}

function optionTone(revealed: boolean, isChosen: boolean, isCorrect: boolean): string {
  if (!revealed) {
    return isChosen ? 'border-primary/60 bg-accent' : 'bg-card hover:bg-muted/60'
  }
  if (isCorrect) return 'border-success/50 bg-success-soft'
  if (isChosen) return 'border-danger/50 bg-danger-soft'
  return 'bg-card'
}

function RevealMark({ isChosen, isCorrect }: { isChosen: boolean; isCorrect: boolean }) {
  if (isCorrect) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
        <Check className="size-3.5" aria-hidden /> Đáp án đúng
      </span>
    )
  }
  if (isChosen) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-danger">
        <X className="size-3.5" aria-hidden /> Bạn đã chọn
      </span>
    )
  }
  return null
}

function OptionBody({
  option,
  revealed,
  isChosen,
  isCorrect,
}: {
  option: QuizOption
  revealed: boolean
  isChosen: boolean
  isCorrect: boolean
}) {
  return (
    <div className="min-w-0 flex-1">
      <Markdown className="text-sm leading-relaxed">{option.text}</Markdown>
      {revealed && (
        <div className="mt-1.5 space-y-1">
          <RevealMark isChosen={isChosen} isCorrect={isCorrect} />
          <Markdown className="text-[0.8125rem] leading-relaxed text-muted-foreground">
            {option.explanation}
          </Markdown>
        </div>
      )}
    </div>
  )
}

function SingleChoice({
  question,
  optionOrder,
  answer,
  onAnswer,
  revealed,
}: QuestionViewProps & { question: Extract<QuizQuestion, { type: 'single' | 'scenario' }> }) {
  return (
    <RadioGroup
      value={typeof answer === 'string' ? answer : ''}
      onValueChange={(value) => onAnswer?.(value)}
      disabled={revealed}
      className="gap-2"
    >
      {orderedOptions(question.options, optionOrder).map((option) => {
        const isChosen = answer === option.id
        const isCorrect = question.correct === option.id
        const inputId = `${question.id}-${option.id}`
        return (
          <label
            key={option.id}
            htmlFor={inputId}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
              revealed && 'cursor-default',
              optionTone(revealed, isChosen, isCorrect),
            )}
          >
            <RadioGroupItem id={inputId} value={option.id} className="mt-1" />
            <OptionBody option={option} revealed={revealed} isChosen={isChosen} isCorrect={isCorrect} />
          </label>
        )
      })}
    </RadioGroup>
  )
}

function MultipleChoice({
  question,
  optionOrder,
  answer,
  onAnswer,
  revealed,
}: QuestionViewProps & { question: Extract<QuizQuestion, { type: 'multiple' }> }) {
  const chosen = Array.isArray(answer) ? answer : []
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Chọn tất cả đáp án đúng.</p>
      {orderedOptions(question.options, optionOrder).map((option) => {
        const isChosen = chosen.includes(option.id)
        const isCorrect = question.correct.includes(option.id)
        const inputId = `${question.id}-${option.id}`
        return (
          <label
            key={option.id}
            htmlFor={inputId}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors',
              revealed && 'cursor-default',
              optionTone(revealed, isChosen, isCorrect),
            )}
          >
            <Checkbox
              id={inputId}
              checked={isChosen}
              disabled={revealed}
              className="mt-1"
              onCheckedChange={(checked) =>
                onAnswer?.(
                  checked ? [...chosen, option.id] : chosen.filter((id) => id !== option.id),
                )
              }
            />
            <OptionBody option={option} revealed={revealed} isChosen={isChosen} isCorrect={isCorrect} />
          </label>
        )
      })}
    </div>
  )
}

function TrueFalse({
  question,
  answer,
  onAnswer,
  revealed,
}: QuestionViewProps & { question: Extract<QuizQuestion, { type: 'true-false' }> }) {
  const choices: { value: boolean; label: string }[] = [
    { value: true, label: 'Đúng' },
    { value: false, label: 'Sai' },
  ]
  return (
    <div role="radiogroup" aria-label="Đúng hoặc Sai" className="grid gap-2 sm:grid-cols-2">
      {choices.map(({ value, label }) => {
        const isChosen = answer === value
        const isCorrect = question.correct === value
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={isChosen}
            disabled={revealed}
            onClick={() => onAnswer?.(value)}
            className={cn(
              'flex min-h-11 flex-col items-start gap-1 rounded-md border p-3 text-left text-sm font-medium transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              optionTone(revealed, isChosen, isCorrect),
            )}
          >
            {label}
            {revealed && <RevealMark isChosen={isChosen} isCorrect={isCorrect} />}
          </button>
        )
      })}
    </div>
  )
}

export function QuestionView(props: QuestionViewProps) {
  const { question, answer, onAnswer, revealed } = props
  return (
    <div className="space-y-4">
      {question.type === 'scenario' && (
        <div className="rounded-md border-l-2 border-primary/60 bg-muted/50 px-4 py-3">
          <p className="mb-1 text-xs font-medium text-muted-foreground">Tình huống</p>
          <Markdown className="text-sm">{question.scenario}</Markdown>
        </div>
      )}
      <Markdown className="font-medium">{question.prompt}</Markdown>

      {(question.type === 'single' || question.type === 'scenario') && (
        <SingleChoice {...props} question={question} />
      )}
      {question.type === 'multiple' && <MultipleChoice {...props} question={question} />}
      {question.type === 'true-false' && <TrueFalse {...props} question={question} />}
      {question.type === 'fill-blank' && (
        <Input
          aria-label="Câu trả lời điền khuyết"
          placeholder="Nhập đáp án của bạn"
          autoComplete="off"
          value={typeof answer === 'string' ? answer : ''}
          disabled={revealed}
          onChange={(event) => onAnswer?.(event.target.value)}
          className="text-base sm:text-sm"
        />
      )}
      {question.type === 'short-answer' && (
        <Textarea
          aria-label="Câu trả lời của bạn"
          placeholder="Viết câu trả lời của bạn"
          value={typeof answer === 'string' ? answer : ''}
          disabled={revealed}
          onChange={(event) => onAnswer?.(event.target.value)}
          className="min-h-32 text-base sm:text-sm"
        />
      )}
    </div>
  )
}
