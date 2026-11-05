import { useEffect, useState } from 'react'

export interface AsyncState<T> {
  data: T | undefined
  loading: boolean
  error: unknown
}

/** Tải dữ liệu bất đồng bộ, bỏ qua kết quả cũ khi `key` thay đổi giữa chừng. */
export function useAsync<T>(load: () => Promise<T>, key: string): AsyncState<T> {
  const [state, setState] = useState<{ key: string; data?: T; error?: unknown } | null>(null)

  useEffect(() => {
    let cancelled = false
    load().then(
      (data) => {
        if (!cancelled) setState({ key, data })
      },
      (error) => {
        if (!cancelled) setState({ key, error })
      },
    )
    return () => {
      cancelled = true
    }
    // `load` được tạo mới mỗi lần render, `key` mới là thứ quyết định việc tải lại.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const settled = state?.key === key
  return {
    data: settled ? state?.data : undefined,
    error: settled ? state?.error : undefined,
    loading: !settled,
  }
}
