import { Sparkle } from 'lucide-react'
import { Markdown } from '@/components/content/markdown'
import { BookmarkButton } from '@/components/question/bookmark-button'
import { DifficultyBadge } from '@/components/question/badges'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { DIFFICULTIES, LEVEL_LABEL } from '@/domain/labels'
import type { InterviewQuestion } from '@/domain/types'

export function InterviewAnswerDetail({ question }: { question: InterviewQuestion }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-1 text-sm font-medium">Câu trả lời tham khảo</p>
        <Markdown>{question.referenceAnswer}</Markdown>
      </div>
      <div>
        <p className="mb-1 text-sm font-medium">Các ý quan trọng cần có</p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {question.keyPoints.map((point) => (
            <li key={point.text}>{point.text}</li>
          ))}
        </ul>
      </div>
      {question.followUps.length > 0 && (
        <div>
          <p className="mb-1 text-sm font-medium">Câu hỏi đào sâu</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {question.followUps.map((followUp) => (
              <li key={followUp}>{followUp}</li>
            ))}
          </ul>
        </div>
      )}
      {question.commonMistakes.length > 0 && (
        <div>
          <p className="mb-1 text-sm font-medium">Lỗi thường gặp khi trả lời</p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {question.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function InterviewList({ questions }: { questions: InterviewQuestion[] }) {
  const sorted = [...questions].sort(
    (a, b) => DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty),
  )
  return (
    <Accordion type="multiple" className="rounded-lg border bg-card">
      {sorted.map((question) => (
        <AccordionItem key={question.id} value={question.id} className="px-4">
          <AccordionTrigger className="text-left">
            <span className="flex flex-col gap-1.5">
              <span>{question.question}</span>
              <span className="flex flex-wrap gap-1.5 font-normal">
                <DifficultyBadge difficulty={question.difficulty} />
                {question.firstPrinciples && (
                  <Badge variant="secondary">
                    <Sparkle aria-hidden />
                    First Principles
                  </Badge>
                )}
                <Badge variant="outline">
                  {question.levels.map((level) => LEVEL_LABEL[level]).join(', ')}
                </Badge>
              </span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <InterviewAnswerDetail question={question} />
            <div className="mt-3 flex justify-end">
              <BookmarkButton questionId={question.id} kind="interview" showLabel />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
