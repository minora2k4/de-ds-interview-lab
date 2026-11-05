import { containsPhrase, normalizeText } from '../text/normalize'
import type { KeyPoint } from '../types'

export interface EvaluationInput {
  question: string
  answer: string
  keyPoints: KeyPoint[]
  referenceAnswer: string
}

export interface EvaluationResult {
  /** Chỉ số của các ý đã đạt trong keyPoints. */
  matchedPoints: number[]
  score: number
  /** true khi kết quả chỉ là gợi ý và người học cần tự xác nhận. */
  isHeuristic: boolean
}

/**
 * Điểm cắm cho việc chấm câu trả lời. Sau này chỉ cần thêm một lớp gọi API AI
 * cùng interface này, giao diện không phải thay đổi.
 */
export interface AnswerEvaluator {
  evaluate(input: EvaluationInput): Promise<EvaluationResult>
}

/** Điểm thang 0–10 theo tổng trọng số các ý đã đạt. */
export function scoreFromPoints(keyPoints: KeyPoint[], matchedPoints: number[]): number {
  const total = keyPoints.reduce((sum, point) => sum + (point.weight ?? 1), 0)
  if (total === 0) return 0
  const earned = matchedPoints.reduce((sum, i) => sum + (keyPoints[i]?.weight ?? 1), 0)
  return Math.round((earned / total) * 10)
}

export function matchKeyPoints(answer: string, keyPoints: KeyPoint[]): number[] {
  const normalized = normalizeText(answer)
  if (!normalized) return []
  return keyPoints.flatMap((point, index) =>
    point.keywords.some((keyword) => containsPhrase(normalized, keyword)) ? [index] : [],
  )
}

/** So khớp từ khóa, không phân biệt dấu. Chỉ là gợi ý, người học tự chốt điểm. */
export class KeywordEvaluator implements AnswerEvaluator {
  async evaluate({ answer, keyPoints }: EvaluationInput): Promise<EvaluationResult> {
    const matchedPoints = matchKeyPoints(answer, keyPoints)
    return {
      matchedPoints,
      score: scoreFromPoints(keyPoints, matchedPoints),
      isHeuristic: true,
    }
  }
}

export const defaultEvaluator: AnswerEvaluator = new KeywordEvaluator()

export interface ScoreBand {
  min: number
  max: number
  label: string
  description: string
}

export const SCORE_RUBRIC: ScoreBand[] = [
  {
    min: 9,
    max: 10,
    label: 'Xuất sắc',
    description: 'Đủ ý, giải thích được cơ chế và đánh đổi, có ví dụ thực tế.',
  },
  {
    min: 7,
    max: 8,
    label: 'Tốt',
    description: 'Đúng bản chất và cơ chế, còn thiếu một vài chi tiết hoặc đánh đổi.',
  },
  {
    min: 4,
    max: 6,
    label: 'Đạt mức cơ bản',
    description: 'Nêu được ý chính nhưng chưa giải thích được tại sao.',
  },
  {
    min: 0,
    max: 3,
    label: 'Chưa đạt',
    description: 'Thiếu nhiều ý quan trọng hoặc hiểu sai bản chất.',
  },
]

export function scoreBand(score: number): ScoreBand {
  return SCORE_RUBRIC.find((band) => score >= band.min) ?? SCORE_RUBRIC[SCORE_RUBRIC.length - 1]
}
