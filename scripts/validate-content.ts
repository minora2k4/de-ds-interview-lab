/**
 * Kiểm tra toàn bộ nội dung trước khi build.
 *
 *   npm run validate:content                 kiểm tra đủ mọi chủ đề
 *   npm run validate:content -- --topic spark   chỉ yêu cầu đủ nội dung cho chủ đề này
 */
import { readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { JSDOM } from 'jsdom'
import { ALL_CONCEPTS, TOPICS, getConceptEntry, getTopic } from '../src/content/catalog'
import { DIFFICULTIES, LEVELS, QUESTION_TYPES } from '../src/domain/labels'
import { conceptSchema, interviewSchema, quizSchema } from '../src/domain/schemas'
import { normalizeText } from '../src/domain/text/normalize'
import type { ConceptContent, InterviewQuestion, QuizQuestion, Tier } from '../src/domain/types'

const ROOT = path.resolve(import.meta.dirname, '../src/content')

const TARGETS: Record<Tier, { words: number; quiz: number; interview: number }> = {
  A: { words: 700, quiz: 6, interview: 3 },
  B: { words: 300, quiz: 3, interview: 1 },
}
const MAX_RECALL_RATIO = 0.2
const MIN_REFERENCE_WORDS = 80

/** Các câu First Principles bắt buộc phải có theo đặc tả và theo yêu cầu bổ sung. */
const REQUIRED_INTERVIEW: { topicId: string; phrase: string }[] = [
  { topicId: 'spark', phrase: 'Tại sao Spark sử dụng Lazy Evaluation' },
  { topicId: 'spark', phrase: 'Tại sao JOIN có thể gây ra Data Skew' },
  { topicId: 'kafka', phrase: 'Khi nào Kafka không cần thiết' },
  { topicId: 'etl', phrase: 'Thiết kế một Incremental ETL Pipeline' },
  { topicId: 'evaluation', phrase: 'Tại sao ROC-AUC chưa đủ' },
  { topicId: 'statistics', phrase: 'Correlation và Causation khác nhau' },
  { topicId: 'dataset-evaluation', phrase: 'Làm sao biết một bộ dữ liệu là tốt' },
  { topicId: 'dataset-evaluation', phrase: 'Bảng 10 TB' },
  { topicId: 'dataset-evaluation', phrase: 'Chuỗi thời gian cần kiểm tra gì' },
]

const errors: string[] = []
const warnings: string[] = []
const fail = (where: string, message: string) => errors.push(`${where}: ${message}`)

function parseScope(): Set<string> {
  const scope = new Set<string>()
  const args = process.argv.slice(2)
  args.forEach((arg, i) => {
    if (arg === '--topic' && args[i + 1]) scope.add(args[i + 1])
  })
  for (const id of scope) {
    if (!getTopic(id)) throw new Error(`Không có chủ đề "${id}" trong catalog`)
  }
  return scope
}

function listFiles(topicId: string, kind: 'concepts' | 'quiz' | 'interview'): string[] {
  const dir = path.join(ROOT, topicId, kind)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => path.join(dir, f))
}

async function load<T>(file: string): Promise<T> {
  const mod = await import(pathToFileURL(file).href)
  return mod.default as T
}

function wordCount(text: string): number {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

function collectConceptText(concept: ConceptContent): string[] {
  const s = concept.sections
  return [
    concept.summary,
    s.definition,
    s.origin,
    s.whyUse,
    s.mechanism,
    s.example,
    ...s.prosCons.pros,
    ...s.prosCons.cons,
    ...s.whenToUse.use,
    ...s.whenToUse.avoid,
    s.comparison.intro ?? '',
    s.comparison.note ?? '',
    ...s.comparison.rows.flat(),
    ...s.misconceptions.flatMap((m) => [m.myth, m.truth]),
  ]
}

function checkLinks(where: string, text: string) {
  for (const match of text.matchAll(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g)) {
    if (!getConceptEntry(match[1])) fail(where, `liên kết tới khái niệm không tồn tại: ${match[1]}`)
  }
}

const VIETNAMESE_MARKS = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i

/** Đoạn văn tiếng Việt viết đúng luôn có nhiều từ mang dấu. */
function checkDiacritics(where: string, text: string) {
  const prose = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ')
  const words = prose.split(/\s+/).filter((w) => /\p{L}/u.test(w))
  if (words.length < 25) return
  const marked = words.filter((w) => VIETNAMESE_MARKS.test(w)).length
  if (marked / words.length < 0.15) {
    fail(where, `nội dung có vẻ thiếu dấu tiếng Việt (${marked}/${words.length} từ có dấu)`)
  }
}

async function setupMermaid() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>')
  Object.assign(globalThis, { window: dom.window, document: dom.window.document })
  const mermaid = (await import('mermaid')).default
  mermaid.initialize({ startOnLoad: false })
  return mermaid
}

async function main() {
  const scope = parseScope()
  const inScope = (topicId: string) => scope.size === 0 || scope.has(topicId)

  const concepts = new Map<string, ConceptContent>()
  const quiz: QuizQuestion[] = []
  const interview: InterviewQuestion[] = []
  const mermaid = await setupMermaid()

  const knownFolders = new Set(TOPICS.map((t) => t.id))
  for (const entry of readdirSync(ROOT, { withFileTypes: true })) {
    if (entry.isDirectory() && !knownFolders.has(entry.name)) {
      fail(`content/${entry.name}`, 'thư mục không khớp chủ đề nào trong catalog')
    }
  }

  // Khi chạy theo chủ đề, tệp đang viết dở của chủ đề khác không được làm hỏng kết quả.
  for (const topic of TOPICS.filter((t) => inScope(t.id))) {
    for (const file of listFiles(topic.id, 'concepts')) {
      const where = path.relative(ROOT, file)
      const concept = await load<ConceptContent>(file)
      const parsed = conceptSchema.safeParse(concept)
      if (!parsed.success) {
        fail(where, parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
        continue
      }
      if (path.basename(file, '.ts') !== concept.id) fail(where, `tên file khác id "${concept.id}"`)
      const entry = getConceptEntry(concept.id)
      if (!entry) {
        fail(where, 'id không có trong catalog')
        continue
      }
      if (entry.topicId !== topic.id) fail(where, `khái niệm thuộc chủ đề ${entry.topicId}`)
      concepts.set(concept.id, concept)

      for (const id of concept.related) {
        if (!getConceptEntry(id)) fail(where, `related trỏ tới khái niệm không tồn tại: ${id}`)
        if (id === concept.id) fail(where, 'related trỏ tới chính nó')
      }
      if (concept.related.length === 0) fail(where, 'chưa có khái niệm liên quan')

      const texts = collectConceptText(concept)
      texts.forEach((t) => checkLinks(where, t))
      checkDiacritics(where, texts.join(' '))

      const target = TARGETS[entry.tier]
      const words = wordCount(texts.join(' '))
      if (words < target.words) fail(where, `quá ngắn cho mức ${entry.tier}: ${words}/${target.words} từ`)

      const width = concept.sections.comparison.headers.length
      concept.sections.comparison.rows.forEach((row, i) => {
        if (row.length !== width) fail(where, `dòng ${i} của bảng so sánh có ${row.length}/${width} cột`)
      })

      if (concept.sections.diagram) {
        try {
          await mermaid.parse(concept.sections.diagram.mermaid)
        } catch (error) {
          fail(where, `sơ đồ Mermaid sai cú pháp: ${String(error).split('\n')[0]}`)
        }
      }
    }

    for (const file of listFiles(topic.id, 'quiz')) {
      const where = path.relative(ROOT, file)
      for (const q of await load<QuizQuestion[]>(file)) {
        const parsed = quizSchema.safeParse(q)
        if (!parsed.success) {
          fail(`${where} (${q.id})`, parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
          continue
        }
        checkQuestion(where, q, topic.id)
        quiz.push(q)
      }
    }

    for (const file of listFiles(topic.id, 'interview')) {
      const where = path.relative(ROOT, file)
      for (const q of await load<InterviewQuestion[]>(file)) {
        const parsed = interviewSchema.safeParse(q)
        if (!parsed.success) {
          fail(`${where} (${q.id})`, parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
          continue
        }
        checkInterview(where, q, topic.id)
        interview.push(q)
      }
    }
  }

  const ids = new Map<string, number>()
  for (const q of [...quiz, ...interview]) ids.set(q.id, (ids.get(q.id) ?? 0) + 1)
  for (const [id, count] of ids) if (count > 1) fail('câu hỏi', `ID bị trùng ${count} lần: ${id}`)

  const prompts = new Map<string, string>()
  for (const q of quiz) {
    const key = normalizeText(q.prompt)
    const previous = prompts.get(key)
    if (previous && 'scenario' in q === false) warnings.push(`Câu hỏi có thể trùng: ${previous} và ${q.id}`)
    prompts.set(key, q.id)
  }

  checkCoverage(concepts, quiz, interview, inScope)
  checkRecallRatio(quiz, inScope)
  checkTopicBalance(quiz, interview, inScope)
  for (const { topicId, phrase } of REQUIRED_INTERVIEW) {
    if (!inScope(topicId)) continue
    const needle = normalizeText(phrase)
    if (!interview.some((q) => normalizeText(q.question).includes(needle))) {
      fail('phỏng vấn', `thiếu câu bắt buộc: "${phrase}"`)
    }
  }

  report(concepts, quiz, interview, inScope)
  if (warnings.length > 0) {
    console.log(`\nCảnh báo (${warnings.length}):`)
    warnings.forEach((w) => console.log(`  - ${w}`))
  }
  if (errors.length > 0) {
    console.error(`\nLỖI (${errors.length}):`)
    errors.slice(0, 200).forEach((e) => console.error(`  - ${e}`))
    if (errors.length > 200) console.error(`  ... và ${errors.length - 200} lỗi khác`)
    process.exit(1)
  }
  console.log('\nNội dung hợp lệ.')
  process.exit(0)
}

function checkQuestion(where: string, q: QuizQuestion, folderTopic: string) {
  const at = `${where} (${q.id})`
  if (q.topicId !== folderTopic) fail(at, `topicId ${q.topicId} khác thư mục`)
  if (!getTopic(q.topicId)?.subtopics.some((s) => s.id === q.category)) {
    fail(at, `category "${q.category}" không phải chủ đề con của ${q.topicId}`)
  }
  for (const id of q.conceptIds) {
    if (!getConceptEntry(id)) fail(at, `conceptIds trỏ tới khái niệm không tồn tại: ${id}`)
  }
  checkLinks(at, q.prompt)
  checkLinks(at, q.explanation)
  checkDiacritics(at, `${q.prompt} ${q.explanation}`)

  if ('options' in q) {
    const optionIds = q.options.map((o) => o.id)
    if (new Set(optionIds).size !== optionIds.length) fail(at, 'ID lựa chọn bị trùng')
    const correct = Array.isArray(q.correct) ? q.correct : [q.correct]
    for (const id of correct) if (!optionIds.includes(id)) fail(at, `đáp án "${id}" không có trong lựa chọn`)
    if (correct.length >= optionIds.length) fail(at, 'phải có ít nhất một lựa chọn sai')
  }
  if (q.type === 'fill-blank' && !q.prompt.includes('____')) fail(at, 'câu điền khuyết thiếu chuỗi ____')
}

function checkInterview(where: string, q: InterviewQuestion, folderTopic: string) {
  const at = `${where} (${q.id})`
  if (q.topicId !== folderTopic) fail(at, `topicId ${q.topicId} khác thư mục`)
  if (!getTopic(q.topicId)?.subtopics.some((s) => s.id === q.category)) {
    fail(at, `category "${q.category}" không phải chủ đề con của ${q.topicId}`)
  }
  for (const id of q.conceptIds) {
    if (!getConceptEntry(id)) fail(at, `conceptIds trỏ tới khái niệm không tồn tại: ${id}`)
  }
  checkLinks(at, q.referenceAnswer)
  checkDiacritics(at, `${q.question} ${q.referenceAnswer}`)
  const words = wordCount(q.referenceAnswer)
  if (words < MIN_REFERENCE_WORDS) fail(at, `đáp án tham khảo quá ngắn: ${words}/${MIN_REFERENCE_WORDS} từ`)
}

function checkCoverage(
  concepts: Map<string, ConceptContent>,
  quiz: QuizQuestion[],
  interview: InterviewQuestion[],
  inScope: (topicId: string) => boolean,
) {
  for (const entry of ALL_CONCEPTS) {
    if (!inScope(entry.topicId)) continue
    if (!concepts.has(entry.id)) {
      fail(`catalog/${entry.topicId}`, `thiếu file khái niệm: ${entry.id}`)
      continue
    }
    const target = TARGETS[entry.tier]
    const quizCount = quiz.filter((q) => q.conceptIds[0] === entry.id).length
    const interviewCount = interview.filter((q) => q.conceptIds[0] === entry.id).length
    if (quizCount < target.quiz) fail(entry.id, `thiếu câu quiz: ${quizCount}/${target.quiz}`)
    if (interviewCount < target.interview) {
      fail(entry.id, `thiếu câu phỏng vấn: ${interviewCount}/${target.interview}`)
    }
  }
}

function checkRecallRatio(quiz: QuizQuestion[], inScope: (topicId: string) => boolean) {
  for (const topic of TOPICS) {
    if (!inScope(topic.id)) continue
    const scoped = quiz.filter((q) => q.topicId === topic.id)
    if (scoped.length === 0) continue
    const ratio = scoped.filter((q) => q.skill === 'recall').length / scoped.length
    if (ratio > MAX_RECALL_RATIO) {
      fail(topic.id, `câu chỉ kiểm tra định nghĩa chiếm ${Math.round(ratio * 100)}%, tối đa 20%`)
    }
  }
}

function checkTopicBalance(
  quiz: QuizQuestion[],
  interview: InterviewQuestion[],
  inScope: (topicId: string) => boolean,
) {
  for (const topic of TOPICS) {
    if (!inScope(topic.id)) continue
    const scopedQuiz = quiz.filter((q) => q.topicId === topic.id)
    const scopedInterview = interview.filter((q) => q.topicId === topic.id)
    if (scopedQuiz.length === 0) continue

    for (const type of QUESTION_TYPES) {
      if (!scopedQuiz.some((q) => q.type === type)) fail(topic.id, `chưa có câu dạng ${type}`)
    }
    for (const difficulty of DIFFICULTIES) {
      if (!scopedQuiz.some((q) => q.difficulty === difficulty)) {
        fail(topic.id, `chưa có câu quiz độ khó ${difficulty}`)
      }
    }
    for (const level of LEVELS) {
      if (!scopedInterview.some((q) => q.levels.includes(level))) {
        fail(topic.id, `chưa có câu phỏng vấn cấp độ ${level}`)
      }
    }
    if (!scopedInterview.some((q) => q.firstPrinciples)) {
      fail(topic.id, 'chưa có câu phỏng vấn First Principles')
    }
  }
}

function report(
  concepts: Map<string, ConceptContent>,
  quiz: QuizQuestion[],
  interview: InterviewQuestion[],
  inScope: (topicId: string) => boolean,
) {
  const rows = TOPICS.filter((t) => inScope(t.id)).map((topic) => {
    const pages = topic.subtopics.flatMap((s) => s.concepts)
    const written = pages.filter((c) => concepts.has(c.id))
    const topicQuiz = quiz.filter((q) => q.topicId === topic.id)
    const words = written.reduce(
      (sum, c) => sum + wordCount(collectConceptText(concepts.get(c.id)!).join(' ')),
      0,
    )
    return {
      'Chủ đề': topic.id,
      Trang: `${written.length}/${pages.length}`,
      'Số từ': words,
      Quiz: topicQuiz.length,
      'Phỏng vấn': interview.filter((q) => q.topicId === topic.id).length,
      'Sơ đồ': written.filter((c) => concepts.get(c.id)!.sections.diagram).length,
      'Dạng câu': new Set(topicQuiz.map((q) => q.type)).size,
      'Độ khó %': DIFFICULTIES.map((d) =>
        Math.round((topicQuiz.filter((q) => q.difficulty === d).length / (topicQuiz.length || 1)) * 100),
      ).join('/'),
      'Định nghĩa %': Math.round(
        (topicQuiz.filter((q) => q.skill === 'recall').length / (topicQuiz.length || 1)) * 100,
      ),
    }
  })
  console.table(rows)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
