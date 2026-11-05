import { CircleAlert } from 'lucide-react'
import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { EmptyState } from '@/components/common/states'
import { Button } from '@/components/ui/button'

export function RouteError() {
  const error = useRouteError()
  const isLoadFailure = error instanceof Error && !isRouteErrorResponse(error)

  return (
    <div className="mx-auto max-w-xl p-6">
      <EmptyState
        icon={CircleAlert}
        title={isLoadFailure ? 'Trang gặp lỗi khi hiển thị' : 'Không tìm thấy trang'}
        description={
          isLoadFailure
            ? 'Hãy tải lại trang. Nếu vừa có bản cập nhật mới, tải lại sẽ lấy phiên bản mới nhất.'
            : 'Đường dẫn này không tồn tại.'
        }
        action={
          isLoadFailure ? (
            <Button onClick={() => window.location.reload()}>Tải lại trang</Button>
          ) : (
            <Button asChild>
              <Link to="/">Về trang Tổng quan</Link>
            </Button>
          )
        }
      />
    </div>
  )
}
