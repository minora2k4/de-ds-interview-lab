import { ArrowLeft, ArrowRight, BookOpenCheck, Eye, Play, Shuffle, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Markdown } from '@/components/content/markdown'
import { PageHeader } from '@/components/common/page-header'
import { EmptyState, ErrorState, LoadingState } from '@/components/common/states'
import { TopicBadge } from '@/components/question/badges'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ALL_CONCEPTS, TOPICS, conceptPath, getConceptEntry } from '@/content/catalog'
import { shuffled } from '@/domain/random'
import type { ConceptContent } from '@/domain/types'
import { useAsync } from '@/hooks/use-async'
import { plainSnippet } from '@/lib/format'
import { contentRepository } from '@/services/content-repository'
import { useProgressStore } from '@/stores/progress'
import { useSessionStore } from '@/stores/session'
import { buildActiveQuiz } from '../quiz/start-quiz'
import { useQuizBank } from '../quiz/use-quiz-bank'

/** Tệp được nạp theo tên, nên phải sắp lại theo thứ tự học trong danh mục. */
function inCatalogOrder(concepts: ConceptContent[]): ConceptContent[] {
  const position = new Map(ALL_CONCEPTS.map((entry, index) => [entry.id, index]))
  return [...concepts].sort((a, b) => (position.get(a.id) ?? 0) - (position.get(b.id) ?? 0))
}

function FlashcardDeck({ concepts }: { concepts: ConceptContent[] }) {
  const [order, setOrder] = useState(() => inCatalogOrder(concepts))
  const [index, setIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  const card = order[index]
  const entry = getConceptEntry(card.id)

  const move = (delta: number) => {
    setIndex((value) => (value + delta + order.length) % order.length)
    setShowBack(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground tabular-nums">
          Thẻ {index + 1}/{order.length}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setOrder((current) => shuffled(current))
            setIndex(0)
            setShowBack(false)
          }}
        >
          <Shuffle aria-hidden />
          Xáo trộn
        </Button>
      </div>

      <div className="min-h-64 rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold tracking-tight">{entry?.title ?? card.id}</h2>
        {entry?.viTitle && <p className="mt-1 text-sm text-muted-foreground">{entry.viTitle}</p>}
        {showBack ? (
          <div className="mt-4 space-y-3 border-t pt-4">
            <p className="font-medium">{card.summary}</p>
            <Markdown className="text-sm">{card.sections.definition}</Markdown>
            <Link
              to={conceptPath(card.id)}
              className="inline-block text-sm text-accent-foreground underline decoration-current/30 underline-offset-3 hover:decoration-current"
            >
              Đọc đầy đủ
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Hãy tự nhắc lại định nghĩa và cơ chế của khái niệm này, rồi lật thẻ để kiểm tra.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button variant="outline" onClick={() => move(-1)} aria-label="Thẻ trước">
          <ArrowLeft aria-hidden />
          <span className="hidden sm:inline">Thẻ trước</span>
        </Button>
        <Button variant={showBack ? 'outline' : 'default'} onClick={() => setShowBack((value) => !value)}>
          <Eye aria-hidden />
          {showBack ? 'Ẩn định nghĩa' : 'Lật thẻ'}
        </Button>
        <Button variant="outline" onClick={() => move(1)} aria-label="Thẻ sau">
          <span className="hidden sm:inline">Thẻ sau</span>
          <ArrowRight aria-hidden />
        </Button>
      </div>
    </div>
  )
}

function Flashcards() {
  const [topicId, setTopicId] = useState(TOPICS.find((t) => t.id === 'spark')?.id ?? TOPICS[0].id)
  const { data, loading, error } = useAsync(
    () => contentRepository.loadConceptsOfTopic(topicId),
    topicId,
  )
  return (
    <div>
      <div className="mb-5 max-w-sm space-y-1">
        <Label htmlFor="flashcard-topic" className="text-xs text-muted-foreground">
          Chủ đề
        </Label>
        <Select value={topicId} onValueChange={setTopicId}>
          <SelectTrigger id="flashcard-topic" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOPICS.map((topic) => (
              <SelectItem key={topic.id} value={topic.id}>
                {topic.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {loading && <LoadingState />}
      {!!error && <ErrorState />}
      {data && data.length === 0 && (
        <EmptyState
          icon={BookOpenCheck}
          title="Chủ đề này đang được biên soạn"
          description="Hãy chọn một chủ đề khác để ôn tập."
        />
      )}
      {data && data.length > 0 && <FlashcardDeck key={topicId} concepts={data} />}
    </div>
  )
}

function WeakQuestions() {
  const navigate = useNavigate()
  const stats = useProgressStore((s) => s.stats)
  const startQuiz = useSessionStore((s) => s.startQuiz)
  const { bank, loading, error } = useQuizBank()

  const weak = useMemo(
    () =>
      bank
        .filter((q) => (stats[q.id]?.wrong ?? 0) > 0)
        .sort((a, b) => stats[b.id].wrong - stats[a.id].wrong),
    [bank, stats],
  )

  if (loading) return <LoadingState />
  if (error) return <ErrorState />
  if (weak.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Chưa có câu nào cần ôn lại"
        description="Sau khi làm quiz, những câu bạn trả lời sai sẽ xuất hiện ở đây."
        action={
          <Button asChild variant="outline">
            <Link to="/quiz">Làm một bài quiz</Link>
          </Button>
        }
      />
    )
  }

  const practice = () => {
    const questions = weak.slice(0, 20)
    startQuiz(
      buildActiveQuiz({
        title: `Ôn ${questions.length} câu hay sai`,
        source: 'review',
        questions,
        shuffleOptions: true,
      }),
    )
    navigate('/quiz/session')
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{weak.length} câu bạn từng trả lời sai</p>
        <Button onClick={practice}>
          <Play aria-hidden />
          Ôn tối đa 20 câu sai nhiều nhất
        </Button>
      </div>
      <ul className="divide-y overflow-hidden rounded-lg border bg-card">
        {weak.slice(0, 50).map((question) => (
          <li key={question.id} className="px-4 py-3">
            <p className="text-sm">{plainSnippet(question.prompt)}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <TopicBadge topicId={question.topicId} />
              <span className="text-xs text-muted-foreground tabular-nums">
                Sai {stats[question.id].wrong} lần, đúng {stats[question.id].correct} lần
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ReviewPage() {
  return (
    <>
      <PageHeader
        title="Ôn tập kiến thức"
        description="Ôn định nghĩa bằng flashcard và luyện lại những câu bạn hay trả lời sai."
      />
      <Tabs defaultValue="flashcards">
        <TabsList className="mb-5">
          <TabsTrigger value="flashcards">Flashcard</TabsTrigger>
          <TabsTrigger value="weak">Câu hay sai</TabsTrigger>
        </TabsList>
        <TabsContent value="flashcards">
          <Flashcards />
        </TabsContent>
        <TabsContent value="weak">
          <WeakQuestions />
        </TabsContent>
      </Tabs>
    </>
  )
}
