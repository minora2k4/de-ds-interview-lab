import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-retention',
  summary:
    'Retention quy định Kafka giữ dữ liệu bao lâu, mặc định 7 ngày và không giới hạn dung lượng. Việc xóa theo từng segment, độc lập với việc đã có ai đọc. Log Compaction thì giữ giá trị mới nhất của mỗi key.',
  tags: ['Retention', 'Log Compaction', 'Lưu trữ'],
  related: ['kafka-topic', 'kafka-partition', 'kafka-offset', 'dw-data-lake'],
  sections: {
    definition: `**Retention (Thời hạn giữ dữ liệu)** quyết định khi nào dữ liệu cũ bị xóa. Có hai chính sách theo \`cleanup.policy\`: **\`delete\`** (mặc định) xóa theo thời gian hoặc dung lượng, và **\`compact\` (Log Compaction)** giữ ít nhất giá trị mới nhất của mỗi key.`,

    origin: `Hàng đợi truyền thống xóa khi đã xác nhận, nên không đọc lại được và backlog lớn là gánh nặng. Kafka tách việc xóa khỏi việc đọc. Compaction được thêm cho dữ liệu dạng thay đổi theo khóa, nơi chỉ cần trạng thái cuối.`,

    whyUse: `Retention quyết định cửa sổ đọc lại và chi phí đĩa. Consumer tụt lại quá cửa sổ này thì dữ liệu chưa đọc bị xóa và mất thật sự.`,

    mechanism: `- **Thời gian.** \`log.retention.hours=168\`, tức 7 ngày.
- **Dung lượng.** \`retention.bytes=-1\`, không giới hạn. Giá trị này tính **cho từng Partition**.
- **Xóa theo segment.** Chỉ xóa nguyên segment đã đóng. Segment đóng khi đạt 1 GiB hoặc sau 7 ngày, nên dữ liệu có thể tồn tại lâu hơn mức cấu hình.
- **Compaction.** Giữ bản mới nhất của mỗi key, không đổi thứ tự và Offset. Giá trị null là **tombstone** để xóa key, được giữ thêm theo \`delete.retention.ms\` (1 ngày).
- **Tiered Storage.** Sẵn sàng cho production từ 3.9, đẩy segment cũ lên kho từ xa như S3.`,

    example: `Topic 30 Partition đặt \`retention.bytes\` là 100 GB, với ý định giới hạn cả Topic. Thực tế giới hạn tính theo Partition, nên Topic có thể chiếm 3 TB, nhân 3 bản sao là 9 TB.`,

    prosCons: {
      pros: ['Compaction giữ trạng thái đầy đủ mà không giữ toàn bộ lịch sử.'],
      cons: ['Thời điểm xóa không chính xác.', 'Retention dài tốn đĩa, nhân lên theo số bản sao.'],
    },

    whenToUse: {
      use: ['Đặt cửa sổ đủ để sửa lỗi qua cuối tuần.', 'Dùng `compact` cho CDC hoặc bảng tham chiếu.'],
      avoid: ['Không thay [[dw-data-lake|Data Lake]] bằng Kafka để lưu dài hạn.'],
    },

    comparison: {
      intro: 'Hai chính sách phục vụ hai nhu cầu khác nhau:',
      headers: ['Tiêu chí', '`delete`', '`compact`'],
      rows: [
        ['Giữ lại', 'Mọi thứ trong cửa sổ', 'Bản mới nhất của mỗi key'],
        ['Phù hợp', 'Sự kiện, log', 'Trạng thái, CDC'],
      ],
    },

    misconceptions: [
      {
        myth: 'Kafka xóa thông điệp khi mọi nhóm đã đọc xong.',
        truth: 'Việc đọc không ảnh hưởng tới việc xóa. Thông điệp chưa ai đọc vẫn bị xóa khi hết hạn.',
      },
      {
        myth: 'Compaction chỉ giữ đúng một bản ghi cho mỗi key.',
        truth: 'Nó đảm bảo giữ ít nhất bản mới nhất. Segment đang ghi chưa được dọn nên vẫn có nhiều bản.',
      },
    ],
  },
})
