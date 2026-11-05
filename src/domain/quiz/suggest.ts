import { matchKeyPoints, scoreFromPoints } from '../interview/evaluator'
import type { KeyPoint } from '../types'

/** Điểm gợi ý cho câu trả lời ngắn. Người học có thể đổi lại khi tự chấm. */
export function suggestSelfGrade(answer: string, keyPoints: KeyPoint[]): number {
  const score = scoreFromPoints(keyPoints, matchKeyPoints(answer, keyPoints))
  if (score >= 8) return 1
  if (score >= 4) return 0.5
  return 0
}
