import type { StateStorage } from 'zustand/middleware'

/** Dùng bộ nhớ tạm khi LocalStorage bị chặn, ví dụ ở chế độ riêng tư. */
const memory = new Map<string, string>()

/** Bọc LocalStorage để lỗi đọc ghi không làm hỏng ứng dụng. */
export const safeStorage: StateStorage = {
  getItem(name) {
    try {
      return localStorage.getItem(name) ?? memory.get(name) ?? null
    } catch {
      return memory.get(name) ?? null
    }
  },
  setItem(name, value) {
    memory.set(name, value)
    try {
      localStorage.setItem(name, value)
    } catch (error) {
      console.warn('Không ghi được vào LocalStorage, dữ liệu chỉ còn trong phiên này.', error)
    }
  },
  removeItem(name) {
    memory.delete(name)
    try {
      localStorage.removeItem(name)
    } catch {
      /* Không còn gì để làm khi storage bị chặn. */
    }
  },
}

export const STORAGE_KEYS = {
  progress: 'ddlab-progress',
  session: 'ddlab-session',
  settings: 'ddlab-settings',
} as const
