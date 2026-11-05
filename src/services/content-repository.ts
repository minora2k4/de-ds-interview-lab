import type { ConceptContent, InterviewQuestion, QuizQuestion } from '../domain/types'

type Loader<T> = () => Promise<{ default: T }>

const conceptLoaders = import.meta.glob<{ default: ConceptContent }>('../content/*/concepts/*.ts')
const quizLoaders = import.meta.glob<{ default: QuizQuestion[] }>('../content/*/quiz/*.ts')
const interviewLoaders = import.meta.glob<{ default: InterviewQuestion[] }>(
  '../content/*/interview/*.ts',
)

function topicOfPath(path: string): string {
  return path.split('/')[2]
}

function loadersOfTopic<T>(loaders: Record<string, Loader<T>>, topicId: string): Loader<T>[] {
  return Object.entries(loaders)
    .filter(([path]) => topicOfPath(path) === topicId)
    .map(([, loader]) => loader)
}

function memoize<T>(fn: (key: string) => Promise<T>): (key: string) => Promise<T> {
  const cache = new Map<string, Promise<T>>()
  return (key) => {
    let pending = cache.get(key)
    if (!pending) {
      pending = fn(key).catch((error) => {
        cache.delete(key)
        throw error
      })
      cache.set(key, pending)
    }
    return pending
  }
}

/**
 * Lớp truy cập nội dung cho toàn bộ giao diện. Hiện đọc từ file trong bundle,
 * sau này có thể đổi sang gọi API mà không phải sửa các trang.
 */
export const contentRepository = {
  loadConcept: memoize(async (id: string): Promise<ConceptContent | null> => {
    const entry = Object.entries(conceptLoaders).find(([path]) => path.endsWith(`/${id}.ts`))
    if (!entry) return null
    return (await entry[1]()).default
  }),

  hasConcept(id: string): boolean {
    return Object.keys(conceptLoaders).some((path) => path.endsWith(`/${id}.ts`))
  },

  loadConceptsOfTopic: memoize(async (topicId: string): Promise<ConceptContent[]> => {
    const modules = await Promise.all(loadersOfTopic(conceptLoaders, topicId).map((l) => l()))
    return modules.map((m) => m.default)
  }),

  loadQuizOfTopic: memoize(async (topicId: string): Promise<QuizQuestion[]> => {
    const modules = await Promise.all(loadersOfTopic(quizLoaders, topicId).map((l) => l()))
    return modules.flatMap((m) => m.default)
  }),

  loadInterviewOfTopic: memoize(async (topicId: string): Promise<InterviewQuestion[]> => {
    const modules = await Promise.all(loadersOfTopic(interviewLoaders, topicId).map((l) => l()))
    return modules.flatMap((m) => m.default)
  }),

  loadAllQuiz: memoize(async (): Promise<QuizQuestion[]> => {
    const modules = await Promise.all(Object.values(quizLoaders).map((l) => l()))
    return modules.flatMap((m) => m.default)
  }).bind(null, 'all'),

  loadAllInterview: memoize(async (): Promise<InterviewQuestion[]> => {
    const modules = await Promise.all(Object.values(interviewLoaders).map((l) => l()))
    return modules.flatMap((m) => m.default)
  }).bind(null, 'all'),
}
