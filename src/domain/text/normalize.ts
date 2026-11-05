/**
 * Chuẩn hóa chuỗi để so khớp: bỏ dấu tiếng Việt, về chữ thường, bỏ dấu câu.
 * Dùng cho Điền khuyết, chấm theo từ khóa và tìm kiếm.
 */
export function normalizeText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

/** Khớp theo ranh giới từ để "acid" không khớp với "placid". */
export function containsPhrase(normalizedHaystack: string, phrase: string): boolean {
  const needle = normalizeText(phrase)
  if (!needle) return false
  return ` ${normalizedHaystack} `.includes(` ${needle} `)
}
