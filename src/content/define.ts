import type { ConceptContent, InterviewQuestion, QuizQuestion } from '../domain/types'

/** Các hàm định danh này chỉ để TypeScript kiểm tra file nội dung khi viết. */
export function defineConcept(concept: ConceptContent): ConceptContent {
  return concept
}

export function defineQuiz(questions: QuizQuestion[]): QuizQuestion[] {
  return questions
}

export function defineInterview(questions: InterviewQuestion[]): InterviewQuestion[] {
  return questions
}
