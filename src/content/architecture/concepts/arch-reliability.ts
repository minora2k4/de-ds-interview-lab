import { defineConcept } from '../../define'

export default defineConcept({
  id: 'arch-reliability',
  summary:
    'Data Reliability là khả năng cung cấp dữ liệu đúng, đủ và đúng hạn theo cam kết, kể cả khi có lỗi. Nó được đo bằng SLI, SLO và duy trì nhờ idempotency, kiểm tra chất lượng và đường phục hồi.',
  tags: ['Vận hành', 'Độ tin cậy', 'SLA', 'First Principles'],
  related: ['arch-observability', 'arch-monitoring-logging', 'etl-idempotency', 'etl-data-quality', 'cloud-fault-tolerance', 'cloud-high-availability', 'kafka-exactly-once'],
  sections: {
    definition: `**Data Reliability (Độ tin cậy của dữ liệu)** là khả năng cung cấp dữ liệu **đúng, đủ và đúng hạn** theo cam kết với người dùng, ngay cả khi có sự cố. Hệ thống vẫn chạy mà số liệu sai thì vẫn là không tin cậy.`,

    origin: `Khi dữ liệu trở thành đầu vào cho quyết định, một báo cáo sai có thể gây thiệt hại như một dịch vụ bị sập. Vì vậy cần thay lời hứa chung chung bằng cam kết đo được.`,

    whyUse: `Cam kết rõ ràng giúp ưu tiên giữa sửa lỗi với làm tính năng mới.`,

    mechanism: `**Đo bằng ba khái niệm** theo Google SRE: **SLI** là chỉ số đo được, **SLO** là mục tiêu cho chỉ số đó, **SLA** là cam kết kèm hệ quả nếu vi phạm. Ví dụ, SLO là bảng sẵn sàng trước 7 giờ trong 95% số ngày, tức được trễ khoảng 1,5 ngày mỗi 30 ngày. Phần cho phép đó gọi là **error budget**.

**Duy trì bằng các cơ chế:**

- **[[etl-idempotency|Idempotency]]:** retry và chạy lại không tạo dữ liệu trùng.
- **Công bố nguyên tử và cổng chất lượng:** không lộ dữ liệu dở dang hay dữ liệu xấu.
- **Backfill an toàn:** chạy từng phần, ghi vào bảng tạm, so sánh rồi mới chuyển đổi.

Đúng và đúng hạn thường phải đánh đổi: khi nguồn thiếu dữ liệu, nên công bố đúng hạn kèm cảnh báo, hay chờ cho đủ? Điều này cần thống nhất trước với người dùng.`,

    example: `Báo cáo doanh thu có SLO trước 7 giờ trong 95% số ngày. Tháng này đã trễ 2 ngày, nhiều hơn mức cho phép. Đội dữ liệu tạm dừng tính năng mới để xử lý một nguồn hay đến muộn.`,

    prosCons: {
      pros: ['Cam kết đo được giúp ưu tiên đúng việc.'],
      cons: ['Cổng kiểm tra và đối soát làm tăng chi phí và độ trễ.'],
    },

    whenToUse: {
      use: ['Đặt SLO cho bộ dữ liệu quan trọng, phân tầng theo mức ảnh hưởng.'],
      avoid: ['Không đặt mục tiêu không đo được, như "dữ liệu luôn chính xác".'],
    },

    comparison: {
      headers: ['Khái niệm', 'Câu hỏi', 'Ví dụ'],
      rows: [
        ['SLI', 'Đo cái gì?', 'Thời điểm bảng sẵn sàng'],
        ['SLO', 'Mục tiêu là bao nhiêu?', 'Trước 7 giờ trong 95% số ngày'],
        ['SLA', 'Hứa gì, vi phạm thì sao?', 'Bồi thường nếu dưới 90%'],
      ],
    },

    misconceptions: [
      {
        myth: 'Pipeline không báo lỗi nghĩa là dữ liệu tin cậy.',
        truth: 'Lỗi nguy hiểm nhất là lỗi âm thầm. Độ tin cậy được đo ở dữ liệu người dùng nhận, không phải ở trạng thái job.',
      },
    ],
  },
})
