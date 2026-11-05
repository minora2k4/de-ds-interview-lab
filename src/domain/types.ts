export type Markdown = string

export type DomainId = 'de' | 'ds'
export type QuizField = 'de' | 'ds' | 'bigdata'
export type Difficulty = 'co-ban' | 'trung-binh' | 'nang-cao' | 'chuyen-sau'
export type QuestionType =
  | 'single'
  | 'multiple'
  | 'true-false'
  | 'fill-blank'
  | 'scenario'
  | 'short-answer'
export type Skill =
  | 'essence'
  | 'mechanism'
  | 'comparison'
  | 'tradeoff'
  | 'choice'
  | 'problem-solving'
  | 'design'
  | 'recall'
export type Tier = 'A' | 'B'
export type InterviewType = 'de' | 'ds' | 'bigdata' | 'system-design'
export type Level = 'fresher' | 'junior' | 'middle' | 'senior'

/* ---------- Danh mục kiến thức ---------- */

export interface ConceptEntry {
  id: string
  title: string
  viTitle?: string
  tier: Tier
  overview?: boolean
  topicId: string
  subtopicId: string
}

export interface Subtopic {
  id: string
  title: string
  concepts: ConceptEntry[]
  /** Khái niệm thuộc chủ đề khác nhưng cũng hiển thị trong chủ đề con này. */
  sharedConceptIds?: string[]
}

export interface Topic {
  id: string
  title: string
  description: string
  domains: DomainId[]
  fields: QuizField[]
  subtopics: Subtopic[]
}

export interface Domain {
  id: DomainId
  title: string
  description: string
}

/* ---------- Nội dung khái niệm ---------- */

export interface ConceptDiagram {
  mermaid: string
  caption: string
}

export interface ConceptComparison {
  intro?: Markdown
  headers: string[]
  rows: string[][]
  note?: Markdown
}

export interface ConceptSections {
  definition: Markdown
  origin: Markdown
  whyUse: Markdown
  mechanism: Markdown
  diagram?: ConceptDiagram
  example: Markdown
  prosCons: { pros: string[]; cons: string[] }
  whenToUse: { use: string[]; avoid: string[] }
  comparison: ConceptComparison
  misconceptions: { myth: string; truth: string }[]
}

export interface ConceptContent {
  id: string
  summary: string
  tags: string[]
  related: string[]
  sections: ConceptSections
}

/* ---------- Câu hỏi quiz ---------- */

export interface QuizOption {
  id: string
  text: string
  /** Vì sao lựa chọn này đúng hoặc sai. */
  explanation: string
}

export interface KeyPoint {
  text: string
  /** Chỉ cần xuất hiện một trong các từ khóa là tính đã đạt ý này. */
  keywords: string[]
  weight?: number
}

interface QuizQuestionBase {
  id: string
  topicId: string
  /** Chủ đề con, dùng làm danh mục câu hỏi. */
  category: string
  conceptIds: string[]
  /** Mặc định lấy theo chủ đề. Chỉ khai báo khi câu hỏi thuộc thêm lĩnh vực khác. */
  fields?: QuizField[]
  difficulty: Difficulty
  skill: Skill
  tags: string[]
  prompt: Markdown
  explanation: Markdown
}

export interface SingleChoiceQuestion extends QuizQuestionBase {
  type: 'single'
  options: QuizOption[]
  correct: string
}

export interface ScenarioQuestion extends QuizQuestionBase {
  type: 'scenario'
  scenario: Markdown
  options: QuizOption[]
  correct: string
}

export interface MultipleChoiceQuestion extends QuizQuestionBase {
  type: 'multiple'
  options: QuizOption[]
  correct: string[]
}

export interface TrueFalseQuestion extends QuizQuestionBase {
  type: 'true-false'
  correct: boolean
  /** Vì sao phương án ngược lại là sai. */
  wrongExplanation: string
}

export interface FillBlankQuestion extends QuizQuestionBase {
  type: 'fill-blank'
  /** Chuỗi `____` trong prompt đánh dấu chỗ trống. */
  acceptedAnswers: string[]
}

export interface ShortAnswerQuestion extends QuizQuestionBase {
  type: 'short-answer'
  referenceAnswer: Markdown
  keyPoints: KeyPoint[]
}

export type QuizQuestion =
  | SingleChoiceQuestion
  | ScenarioQuestion
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | ShortAnswerQuestion

/* ---------- Câu hỏi phỏng vấn ---------- */

export interface InterviewQuestion {
  id: string
  topicId: string
  category: string
  conceptIds: string[]
  interviewTypes: InterviewType[]
  levels: Level[]
  difficulty: Difficulty
  firstPrinciples: boolean
  question: string
  referenceAnswer: Markdown
  keyPoints: KeyPoint[]
  followUps: string[]
  commonMistakes: string[]
}

/* ---------- Dữ liệu người dùng ---------- */

export type QuizAnswer = string | string[] | boolean

export type GradeStatus = 'correct' | 'partial' | 'wrong' | 'skipped'

export interface GradedAnswer {
  status: GradeStatus
  /** 0, 0.5 hoặc 1. */
  score: number
}

export interface QuizConfig {
  fields: QuizField[]
  topicIds: string[]
  difficulties: Difficulty[]
  types: QuestionType[]
  count: number
  shuffle: boolean
  timeLimitMinutes: number | null
  feedback: 'immediate' | 'end'
  onlyUnseen: boolean
  onlyWrong: boolean
}

export type QuizSource = 'builder' | 'retry' | 'saved' | 'review'

export interface ActiveQuiz {
  id: string
  title: string
  source: QuizSource
  feedback: 'immediate' | 'end'
  questionIds: string[]
  optionOrder: Record<string, string[]>
  answers: Record<string, QuizAnswer>
  revealed: Record<string, boolean>
  /** Điểm tự chấm cho câu trả lời ngắn: 0, 0.5 hoặc 1. */
  selfGrades: Record<string, number>
  currentIndex: number
  startedAt: number
  deadlineAt: number | null
}

export interface QuestionResult {
  questionId: string
  answer: QuizAnswer | null
  status: GradeStatus
  score: number
}

export interface QuizAttempt {
  id: string
  title: string
  source: QuizSource
  startedAt: number
  finishedAt: number
  results: QuestionResult[]
}

export interface QuestionStat {
  seen: number
  correct: number
  wrong: number
  lastAt: number
  lastCorrect: boolean
}

export interface InterviewAnswerResult {
  questionId: string
  answer: string
  /** Chỉ số các ý đã đạt trong keyPoints. */
  matchedPoints: number[]
  score: number
}

export interface ActiveInterview {
  id: string
  type: InterviewType
  level: Level
  questionIds: string[]
  currentIndex: number
  answers: Record<string, InterviewAnswerResult>
  /** Bản nháp câu trả lời chưa gửi. */
  drafts: Record<string, string>
  submitted: Record<string, boolean>
  startedAt: number
}

export interface InterviewSessionResult {
  id: string
  type: InterviewType
  level: Level
  startedAt: number
  finishedAt: number
  answers: InterviewAnswerResult[]
}

export type BookmarkKind = 'quiz' | 'interview'

export interface Bookmark {
  kind: BookmarkKind
  at: number
}

