import { CircleAlert, Play } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { ToggleChip } from '@/components/common/toggle-chip'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { TOPICS, getTopic } from '@/content/catalog'
import {
  DIFFICULTIES,
  DIFFICULTY_LABEL,
  QUESTION_TYPES,
  QUESTION_TYPE_LABEL,
  QUIZ_FIELDS,
  QUIZ_FIELD_LABEL,
} from '@/domain/labels'
import { filterPool, selectQuestions } from '@/domain/quiz/select'
import type { QuizConfig, QuizQuestion } from '@/domain/types'
import { useProgressStore } from '@/stores/progress'
import { useSessionStore } from '@/stores/session'
import { useSettingsStore } from '@/stores/settings'
import { buildActiveQuiz } from './start-quiz'

const COUNT_OPTIONS = [5, 10, 20, 30, 50]
const TIME_OPTIONS = [5, 10, 15, 30, 45, 60]

function toggled<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item]
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{label}</legend>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
    </fieldset>
  )
}

function SwitchRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string
  label: string
  hint?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <Label htmlFor={id} className="flex flex-col items-start gap-0.5 font-normal">
        <span className="text-sm">{label}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export function QuizBuilder({ bank }: { bank: QuizQuestion[] }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const defaults = useSettingsStore((s) => s.quizDefaults)
  const saveDefaults = useSettingsStore((s) => s.setQuizDefaults)
  const stats = useProgressStore((s) => s.stats)
  const activeQuiz = useSessionStore((s) => s.quiz)
  const startQuiz = useSessionStore((s) => s.startQuiz)
  const presetTopic = params.get('topic')

  const [config, setConfig] = useState<QuizConfig>(() =>
    presetTopic && getTopic(presetTopic)
      ? { ...defaults, fields: [], topicIds: [presetTopic] }
      : defaults,
  )
  const patch = (next: Partial<QuizConfig>) => setConfig((current) => ({ ...current, ...next }))

  const visibleTopics = useMemo(
    () =>
      config.fields.length === 0
        ? TOPICS
        : TOPICS.filter(
            (t) =>
              t.fields.some((f) => config.fields.includes(f)) ||
              bank.some(
                (q) => q.topicId === t.id && q.fields?.some((f) => config.fields.includes(f)),
              ),
          ),
    [bank, config.fields],
  )

  // Chủ đề đã chọn nhưng không còn thuộc lĩnh vực đang chọn thì không được tính.
  const selectedTopicIds = useMemo(() => {
    const allowed = new Set(visibleTopics.map((t) => t.id))
    return config.topicIds.filter((id) => allowed.has(id))
  }, [config.topicIds, visibleTopics])

  const effectiveConfig = useMemo(
    () => ({ ...config, topicIds: selectedTopicIds }),
    [config, selectedTopicIds],
  )

  const pool = useMemo(
    () => filterPool(bank, effectiveConfig, stats, getTopic),
    [bank, effectiveConfig, stats],
  )
  const allTopicsSelected =
    visibleTopics.length > 0 && visibleTopics.every((t) => selectedTopicIds.includes(t.id))

  const start = () => {
    saveDefaults(effectiveConfig)
    const questions = selectQuestions(pool, config.count, config.shuffle)
    startQuiz(
      buildActiveQuiz({
        title: `Quiz ${questions.length} câu`,
        source: 'builder',
        questions,
        shuffleOptions: config.shuffle,
        feedback: config.feedback,
        timeLimitMinutes: config.timeLimitMinutes,
      }),
    )
    navigate('/quiz/session')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
      <div className="space-y-6">
        <Field label="Lĩnh vực" hint="Để trống là lấy tất cả lĩnh vực.">
          <div className="flex flex-wrap gap-2">
            {QUIZ_FIELDS.map((field) => (
              <ToggleChip
                key={field}
                pressed={config.fields.includes(field)}
                onClick={() => patch({ fields: toggled(config.fields, field) })}
              >
                {QUIZ_FIELD_LABEL[field]}
              </ToggleChip>
            ))}
          </div>
        </Field>

        <Field label="Chủ đề" hint="Chọn một, nhiều chủ đề, hoặc để trống để lấy toàn bộ lĩnh vực.">
          <div className="flex flex-wrap gap-2">
            <ToggleChip
              pressed={allTopicsSelected}
              onClick={() =>
                patch({ topicIds: allTopicsSelected ? [] : visibleTopics.map((t) => t.id) })
              }
            >
              Tất cả chủ đề
            </ToggleChip>
            {visibleTopics.map((topic) => (
              <ToggleChip
                key={topic.id}
                pressed={selectedTopicIds.includes(topic.id)}
                onClick={() => patch({ topicIds: toggled(selectedTopicIds, topic.id) })}
              >
                {topic.title}
              </ToggleChip>
            ))}
          </div>
        </Field>

        <Field label="Độ khó" hint="Để trống là lấy mọi độ khó.">
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((difficulty) => (
              <ToggleChip
                key={difficulty}
                pressed={config.difficulties.includes(difficulty)}
                onClick={() => patch({ difficulties: toggled(config.difficulties, difficulty) })}
              >
                {DIFFICULTY_LABEL[difficulty]}
              </ToggleChip>
            ))}
          </div>
        </Field>

        <Field label="Số lượng câu hỏi">
          <div className="flex flex-wrap gap-2">
            {COUNT_OPTIONS.map((count) => (
              <ToggleChip
                key={count}
                pressed={config.count === count}
                onClick={() => patch({ count })}
              >
                {count} câu
              </ToggleChip>
            ))}
          </div>
        </Field>

        <Field label="Dạng câu hỏi" hint="Để trống là lấy mọi dạng câu.">
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPES.map((type) => (
              <ToggleChip
                key={type}
                pressed={config.types.includes(type)}
                onClick={() => patch({ types: toggled(config.types, type) })}
              >
                {QUESTION_TYPE_LABEL[type]}
              </ToggleChip>
            ))}
          </div>
        </Field>
      </div>

      <aside className="space-y-5 self-start rounded-lg border bg-card p-4 lg:sticky lg:top-16">
        <h2 className="text-sm font-medium">Tùy chọn</h2>
        <SwitchRow
          id="quiz-shuffle"
          label="Xáo trộn câu hỏi"
          hint="Tắt thì xếp từ dễ đến khó."
          checked={config.shuffle}
          onChange={(shuffle) => patch({ shuffle })}
        />
        <SwitchRow
          id="quiz-immediate"
          label="Hiện đáp án ngay sau mỗi câu"
          hint="Tắt thì hiện sau khi nộp bài."
          checked={config.feedback === 'immediate'}
          onChange={(on) => patch({ feedback: on ? 'immediate' : 'end' })}
        />
        <SwitchRow
          id="quiz-unseen"
          label="Chỉ câu chưa từng làm"
          checked={config.onlyUnseen}
          onChange={(onlyUnseen) => patch({ onlyUnseen })}
        />
        <SwitchRow
          id="quiz-wrong"
          label="Chỉ câu đã trả lời sai"
          checked={config.onlyWrong}
          onChange={(onlyWrong) => patch({ onlyWrong })}
        />
        <div className="space-y-1.5">
          <Label htmlFor="quiz-time">Giới hạn thời gian</Label>
          <Select
            value={config.timeLimitMinutes ? String(config.timeLimitMinutes) : 'none'}
            onValueChange={(value) =>
              patch({ timeLimitMinutes: value === 'none' ? null : Number(value) })
            }
          >
            <SelectTrigger id="quiz-time" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Không giới hạn</SelectItem>
              {TIME_OPTIONS.map((minutes) => (
                <SelectItem key={minutes} value={String(minutes)}>
                  {minutes} phút
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm" aria-live="polite">
            Có <span className="font-semibold">{pool.length}</span> câu phù hợp
          </p>
          {pool.length > 0 && pool.length < config.count && (
            <p className="mt-1 flex items-start gap-1.5 text-xs text-warning">
              <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Không đủ {config.count} câu, bài sẽ có {pool.length} câu.
            </p>
          )}
          {pool.length === 0 && (
            <p className="mt-1 flex items-start gap-1.5 text-xs text-warning">
              <CircleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Không có câu nào khớp. Hãy nới lỏng bộ lọc.
            </p>
          )}
          <Button className="mt-3 w-full" disabled={pool.length === 0} onClick={start}>
            <Play aria-hidden />
            Bắt đầu làm bài
          </Button>
          {activeQuiz && (
            <p className="mt-2 text-xs text-muted-foreground">
              Bài đang làm dở sẽ bị thay thế khi bạn bắt đầu bài mới.
            </p>
          )}
        </div>
      </aside>
    </div>
  )
}
