import type { ProgressData } from '@/stores/progress'
import { useProgressStore } from '@/stores/progress'
import { useSettingsStore } from '@/stores/settings'
import type { QuizConfig } from '@/domain/types'

const BACKUP_VERSION = 1

interface BackupSettings {
  quizDefaults: QuizConfig
}

export interface BackupFile {
  app: 'de-ds-interview-lab'
  version: number
  exportedAt: number
  progress: ProgressData
  settings: BackupSettings
}

export function serializeBackup(): string {
  const { attempts, interviews, stats, bookmarks } = useProgressStore.getState()
  const { quizDefaults } = useSettingsStore.getState()
  const backup: BackupFile = {
    app: 'de-ds-interview-lab',
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    progress: { attempts, interviews, stats, bookmarks },
    settings: { quizDefaults },
  }
  return JSON.stringify(backup)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Kiểm tra cấu trúc trước khi ghi đè dữ liệu hiện có. Sai cấu trúc thì ném lỗi. */
export function parseBackup(text: string): BackupFile {
  const data: unknown = JSON.parse(text)
  if (!isRecord(data) || data.app !== 'de-ds-interview-lab') throw new Error('Sai định dạng')
  if (data.version !== BACKUP_VERSION) throw new Error('Phiên bản không được hỗ trợ')
  const { progress, settings } = data
  if (
    !isRecord(progress) ||
    !Array.isArray(progress.attempts) ||
    !Array.isArray(progress.interviews) ||
    !isRecord(progress.stats) ||
    !isRecord(progress.bookmarks)
  ) {
    throw new Error('Thiếu dữ liệu tiến độ')
  }
  if (!isRecord(settings) || !isRecord(settings.quizDefaults)) throw new Error('Thiếu cài đặt')
  return data as unknown as BackupFile
}
