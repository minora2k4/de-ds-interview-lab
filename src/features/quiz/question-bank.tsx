import { ChevronDown, Search, SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/common/states'
import { DifficultyBadge, QuestionTypeBadge, TopicBadge } from '@/components/question/badges'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TOPICS, getTopic } from '@/content/catalog'
import {
  DIFFICULTIES,
  DIFFICULTY_LABEL,
  QUESTION_TYPES,
  QUESTION_TYPE_LABEL,
  QUIZ_FIELDS,
  QUIZ_FIELD_LABEL,
} from '@/domain/labels'
import { questionFields } from '@/domain/quiz/select'
import { normalizeText } from '@/domain/text/normalize'
import type { QuestionStat, QuizQuestion } from '@/domain/types'
import { plainSnippet } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/stores/progress'
import { QuestionReview } from './question-review'

const PAGE_SIZE = 20
const ALL = 'all'

type StatusFilter = typeof ALL | 'saved' | 'often-wrong' | 'unseen' | 'done'

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="min-w-0 space-y-1">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function accuracyOf(stat: QuestionStat | undefined): number | null {
  if (!stat || stat.seen === 0) return null
  return Math.round((stat.correct / stat.seen) * 100)
}

/** Câu "hay sai" khi số lần sai nhiều hơn hoặc bằng số lần đúng. */
function isOftenWrong(stat: QuestionStat | undefined): boolean {
  return !!stat && stat.wrong > 0 && stat.wrong >= stat.correct
}

function searchableText(question: QuizQuestion): string {
  return normalizeText(
    [
      question.prompt,
      question.type === 'scenario' ? question.scenario : '',
      question.tags.join(' '),
      question.id,
    ].join(' '),
  )
}

export function QuestionBank({ bank }: { bank: QuizQuestion[] }) {
  const stats = useProgressStore((s) => s.stats)
  const bookmarks = useProgressStore((s) => s.bookmarks)
  const [query, setQuery] = useState('')
  const [field, setField] = useState<string>(ALL)
  const [topic, setTopic] = useState<string>(ALL)
  const [difficulty, setDifficulty] = useState<string>(ALL)
  const [type, setType] = useState<string>(ALL)
  const [status, setStatus] = useState<StatusFilter>(ALL)
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [openId, setOpenId] = useState<string | null>(null)

  const index = useMemo(
    () => new Map(bank.map((q) => [q.id, searchableText(q)])),
    [bank],
  )

  const results = useMemo(() => {
    const words = normalizeText(query).split(' ').filter(Boolean)
    return bank.filter((q) => {
      if (field !== ALL && !questionFields(q, getTopic(q.topicId)).includes(field as never)) return false
      if (topic !== ALL && q.topicId !== topic) return false
      if (difficulty !== ALL && q.difficulty !== difficulty) return false
      if (type !== ALL && q.type !== type) return false
      const stat = stats[q.id]
      if (status === 'saved' && !bookmarks[q.id]) return false
      if (status === 'often-wrong' && !isOftenWrong(stat)) return false
      if (status === 'unseen' && stat) return false
      if (status === 'done' && !stat) return false
      const text = index.get(q.id) ?? ''
      return words.every((word) => text.includes(word))
    })
  }, [bank, bookmarks, difficulty, field, index, query, stats, status, topic, type])

  const ordered = useMemo(() => {
    if (status !== 'often-wrong') return results
    return [...results].sort((a, b) => (stats[b.id]?.wrong ?? 0) - (stats[a.id]?.wrong ?? 0))
  }, [results, stats, status])

  const resetPaging = () => {
    setLimit(PAGE_SIZE)
    setOpenId(null)
  }

  return (
    <div>
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search
            className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            aria-label="Tìm kiếm câu hỏi"
            placeholder="Tìm kiếm câu hỏi, có dấu hoặc không dấu"
            value={query}
            className="pl-8 text-base sm:text-sm"
            onChange={(event) => {
              setQuery(event.target.value)
              resetPaging()
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <FilterSelect
            id="bank-field"
            label="Lĩnh vực"
            value={field}
            onChange={(value) => {
              setField(value)
              resetPaging()
            }}
            options={[
              { value: ALL, label: 'Tất cả' },
              ...QUIZ_FIELDS.map((f) => ({ value: f, label: QUIZ_FIELD_LABEL[f] })),
            ]}
          />
          <FilterSelect
            id="bank-topic"
            label="Chủ đề"
            value={topic}
            onChange={(value) => {
              setTopic(value)
              resetPaging()
            }}
            options={[
              { value: ALL, label: 'Tất cả' },
              ...TOPICS.map((t) => ({ value: t.id, label: t.title })),
            ]}
          />
          <FilterSelect
            id="bank-difficulty"
            label="Độ khó"
            value={difficulty}
            onChange={(value) => {
              setDifficulty(value)
              resetPaging()
            }}
            options={[
              { value: ALL, label: 'Tất cả' },
              ...DIFFICULTIES.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] })),
            ]}
          />
          <FilterSelect
            id="bank-type"
            label="Dạng câu"
            value={type}
            onChange={(value) => {
              setType(value)
              resetPaging()
            }}
            options={[
              { value: ALL, label: 'Tất cả' },
              ...QUESTION_TYPES.map((t) => ({ value: t, label: QUESTION_TYPE_LABEL[t] })),
            ]}
          />
          <FilterSelect
            id="bank-status"
            label="Trạng thái"
            value={status}
            onChange={(value) => {
              setStatus(value as StatusFilter)
              resetPaging()
            }}
            options={[
              { value: ALL, label: 'Tất cả' },
              { value: 'saved', label: 'Yêu thích' },
              { value: 'often-wrong', label: 'Hay trả lời sai' },
              { value: 'done', label: 'Đã làm' },
              { value: 'unseen', label: 'Chưa làm' },
            ]}
          />
        </div>
      </div>

      <p className="mb-2 text-sm text-muted-foreground" aria-live="polite">
        {ordered.length} câu hỏi
      </p>

      {ordered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Không tìm thấy câu hỏi"
          description="Hãy thử từ khóa khác hoặc bỏ bớt bộ lọc."
        />
      ) : (
        <ul className="divide-y overflow-hidden rounded-lg border bg-card">
          {ordered.slice(0, limit).map((question) => {
            const stat = stats[question.id]
            const accuracy = accuracyOf(stat)
            const open = openId === question.id
            return (
              <li key={question.id}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : question.id)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">{plainSnippet(question.prompt)}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <TopicBadge topicId={question.topicId} />
                      <DifficultyBadge difficulty={question.difficulty} />
                      <QuestionTypeBadge type={question.type} />
                      {accuracy !== null && (
                        <span className="text-xs text-muted-foreground">
                          Đúng {accuracy}% trong {stat!.seen} lần
                        </span>
                      )}
                    </span>
                  </span>
                  <ChevronDown
                    className={cn('mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
                    aria-hidden
                  />
                </button>
                {open && (
                  <div className="border-t bg-muted/20 p-3">
                    <QuestionReview question={question} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {ordered.length > limit && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
            Xem thêm
          </Button>
        </div>
      )}
    </div>
  )
}
