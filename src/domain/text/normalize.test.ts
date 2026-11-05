import { describe, expect, it } from 'vitest'
import { containsPhrase, normalizeText } from './normalize'

describe('normalizeText', () => {
  it('bỏ dấu tiếng Việt và chữ đ', () => {
    expect(normalizeText('Đánh Giá Trì Hoãn')).toBe('danh gia tri hoan')
  })

  it('bỏ dấu câu và gom khoảng trắng', () => {
    expect(normalizeText('  At-least-once, (Kafka)!  ')).toBe('at least once kafka')
  })
})

describe('containsPhrase', () => {
  it('khớp không phân biệt dấu', () => {
    expect(containsPhrase(normalizeText('Spark dùng đánh giá trì hoãn'), 'danh gia tri hoan')).toBe(true)
  })

  it('chỉ khớp nguyên từ', () => {
    expect(containsPhrase(normalizeText('this is placid'), 'acid')).toBe(false)
    expect(containsPhrase(normalizeText('tính chất ACID'), 'acid')).toBe(true)
  })

  it('từ khóa rỗng không khớp', () => {
    expect(containsPhrase('abc', '...')).toBe(false)
  })
})
