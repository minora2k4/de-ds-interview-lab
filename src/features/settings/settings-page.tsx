import { Download, Trash2, Upload } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/page-header'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { parseBackup, serializeBackup } from '@/services/backup'
import { useProgressStore } from '@/stores/progress'
import { useSessionStore } from '@/stores/session'
import { useSettingsStore } from '@/stores/settings'

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="font-medium">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-3">{children}</div>
    </section>
  )
}

export function SettingsPage() {
  const quizDefaults = useSettingsStore((s) => s.quizDefaults)
  const setQuizDefaults = useSettingsStore((s) => s.setQuizDefaults)
  const attemptsCount = useProgressStore((s) => s.attempts.length)
  const interviewsCount = useProgressStore((s) => s.interviews.length)
  const bookmarksCount = useProgressStore((s) => Object.keys(s.bookmarks).length)
  const fileInput = useRef<HTMLInputElement>(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const exportData = () => {
    const blob = new Blob([serializeBackup()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `de-ds-lab-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Đã xuất dữ liệu.')
  }

  const importData = async (file: File) => {
    try {
      const data = parseBackup(await file.text())
      useProgressStore.getState().replaceAll(data.progress)
      useSettingsStore.setState(data.settings)
      toast.success('Đã nhập dữ liệu.')
    } catch {
      toast.error('Tệp không hợp lệ, dữ liệu hiện tại vẫn được giữ nguyên.')
    }
  }

  const clearAll = () => {
    useProgressStore.getState().clearAll()
    useSessionStore.getState().endQuiz()
    useSessionStore.getState().endInterview()
    setConfirmClear(false)
    toast.success('Đã xóa toàn bộ dữ liệu học tập.')
  }

  return (
    <>
      <PageHeader title="Cài đặt" description="Dữ liệu chỉ lưu trong trình duyệt của thiết bị này." />
      <div className="max-w-2xl space-y-4">
        <Panel title="Mặc định khi tạo quiz">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="default-immediate" className="font-normal">
                Hiện đáp án ngay sau mỗi câu
              </Label>
              <Switch
                id="default-immediate"
                checked={quizDefaults.feedback === 'immediate'}
                onCheckedChange={(on) => setQuizDefaults({ feedback: on ? 'immediate' : 'end' })}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="default-shuffle" className="font-normal">
                Xáo trộn câu hỏi
              </Label>
              <Switch
                id="default-shuffle"
                checked={quizDefaults.shuffle}
                onCheckedChange={(shuffle) => setQuizDefaults({ shuffle })}
              />
            </div>
          </div>
        </Panel>

        <Panel
          title="Sao lưu dữ liệu"
          description="Dữ liệu trên máy tính và điện thoại không tự đồng bộ. Hãy xuất từ thiết bị này rồi nhập vào thiết bị kia. Nhập sẽ thay thế dữ liệu hiện có."
        >
          <p className="mb-3 text-sm text-muted-foreground">
            Hiện có {attemptsCount} bài quiz, {interviewsCount} buổi phỏng vấn, {bookmarksCount} câu đã lưu.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData}>
              <Download aria-hidden />
              Xuất dữ liệu JSON
            </Button>
            <Button variant="outline" onClick={() => fileInput.current?.click()}>
              <Upload aria-hidden />
              Nhập dữ liệu JSON
            </Button>
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              tabIndex={-1}
              aria-label="Chọn tệp sao lưu JSON"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void importData(file)
                event.target.value = ''
              }}
            />
          </div>
        </Panel>

        <Panel title="Xóa dữ liệu" description="Xóa lịch sử làm bài, thống kê và các câu đã lưu trên thiết bị này.">
          <Button variant="destructive" onClick={() => setConfirmClear(true)}>
            <Trash2 aria-hidden />
            Xóa toàn bộ dữ liệu học tập
          </Button>
        </Panel>
      </div>

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa toàn bộ dữ liệu học tập?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này không thể hoàn tác. Hãy xuất dữ liệu trước nếu bạn muốn giữ lại.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={clearAll}>Xóa dữ liệu</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
