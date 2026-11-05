import { z } from 'zod'

const text = z.string().trim().min(1)
const textList = z.array(text)

const difficulty = z.enum(['co-ban', 'trung-binh', 'nang-cao', 'chuyen-sau'])
const skill = z.enum([
  'essence',
  'mechanism',
  'comparison',
  'tradeoff',
  'choice',
  'problem-solving',
  'design',
  'recall',
])
const keyPoint = z.object({
  text,
  keywords: z.array(text).min(1),
  weight: z.number().positive().optional(),
})
const option = z.object({ id: text, text, explanation: text })

export const conceptSchema = z.object({
  id: text,
  summary: text,
  tags: textList,
  related: textList,
  sections: z.object({
    definition: text,
    origin: text,
    whyUse: text,
    mechanism: text,
    diagram: z.object({ mermaid: text, caption: text }).optional(),
    example: text,
    prosCons: z.object({ pros: textList.min(1), cons: textList.min(1) }),
    whenToUse: z.object({ use: textList.min(1), avoid: textList.min(1) }),
    comparison: z.object({
      intro: text.optional(),
      headers: textList.min(2),
      rows: z.array(textList).min(1),
      note: text.optional(),
    }),
    misconceptions: z.array(z.object({ myth: text, truth: text })).min(1),
  }),
})

const quizBase = {
  id: text,
  topicId: text,
  category: text,
  conceptIds: textList.min(1),
  fields: z.array(z.enum(['de', 'ds', 'bigdata'])).optional(),
  difficulty,
  skill,
  tags: textList,
  prompt: text,
  explanation: text,
}

export const quizSchema = z.discriminatedUnion('type', [
  z.object({ ...quizBase, type: z.literal('single'), options: z.array(option).min(3), correct: text }),
  z.object({
    ...quizBase,
    type: z.literal('scenario'),
    scenario: text,
    options: z.array(option).min(3),
    correct: text,
  }),
  z.object({
    ...quizBase,
    type: z.literal('multiple'),
    options: z.array(option).min(3),
    correct: textList.min(2),
  }),
  z.object({
    ...quizBase,
    type: z.literal('true-false'),
    correct: z.boolean(),
    wrongExplanation: text,
  }),
  z.object({
    ...quizBase,
    type: z.literal('fill-blank'),
    acceptedAnswers: textList.min(1),
  }),
  z.object({
    ...quizBase,
    type: z.literal('short-answer'),
    referenceAnswer: text,
    keyPoints: z.array(keyPoint).min(2),
  }),
])

export const interviewSchema = z.object({
  id: text,
  topicId: text,
  category: text,
  conceptIds: textList.min(1),
  interviewTypes: z.array(z.enum(['de', 'ds', 'bigdata', 'system-design'])).min(1),
  levels: z.array(z.enum(['fresher', 'junior', 'middle', 'senior'])).min(1),
  difficulty,
  firstPrinciples: z.boolean(),
  question: text,
  referenceAnswer: text,
  keyPoints: z.array(keyPoint).min(2),
  followUps: textList,
  commonMistakes: textList,
})
