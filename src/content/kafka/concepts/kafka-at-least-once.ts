import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-at-least-once',
  summary:
    'At-least-once đảm bảo không mất thông điệp nhưng có thể lặp. Đây là mặc định của Kafka: Producer gửi lại khi không chắc chắn, Consumer commit sau khi xử lý xong. Xử lý lũy đẳng ở phía đích giúp kết quả cuối vẫn đúng.',
  tags: ['Ngữ nghĩa giao nhận', 'Độ tin cậy', 'Lũy đẳng'],
  related: ['kafka-delivery-semantics', 'kafka-at-most-once', 'kafka-exactly-once', 'etl-idempotency', 'kafka-consumer'],
  sections: {
    definition: `**At-least-once (Giao ít nhất một lần)** là ngữ nghĩa trong đó mỗi thông điệp được xử lý một hoặc nhiều lần. Khi có lỗi, thông điệp **không mất** nhưng **có thể lặp**. Đây là đảm bảo mặc định của Kafka.`,

    origin: `Với phần lớn nghiệp vụ, mất dữ liệu tệ hơn lặp, vì lặp có thể xử lý ở phía sau. Vì vậy hệ thống gửi lại khi không chắc chắn, và chỉ đánh dấu xong khi đã xong.`,

    whyUse: `Kết hợp với [[etl-idempotency|tính lũy đẳng]] ở phía đích, At-least-once cho kết quả cuối đúng mà không cần transaction.`,

    mechanism: `**Hai nguồn gây lặp:**

1. **Producer gửi lại.** Mất phản hồi nên gửi lại bản đã ghi thành công. Idempotent Producer đã loại được loại trùng này trong một phiên.
2. **Consumer xử lý lại.** Xử lý xong nhưng chết hoặc bị rebalance trước khi commit. Consumer mới đọc lại từ Offset cũ, **idempotence ở Producer không giúp được**.

**Phía đích** xử lý lặp bằng một trong các cách ở bảng dưới.`,

    example: `Consumer nạp đơn hàng vào kho dữ liệu, 1.000 bản ghi một lô. Mỗi đợt triển khai, khoảng 1.000 bản ghi được xử lý lại vì chưa kịp commit. Dùng \`INSERT\` thì số đơn bị tăng khống. Chuyển sang upsert theo \`order_id\` thì đọc lại không làm sai kết quả.`,

    prosCons: {
      pros: ['Không mất dữ liệu khi cấu hình đúng.', 'Đơn giản hơn và thông lượng cao hơn Transactions.'],
      cons: ['Phía đích phải xử lý được trùng lặp.', 'Gửi email hay cộng dồn không tự lũy đẳng được.'],
    },

    whenToUse: {
      use: ['Hầu hết pipeline nạp dữ liệu vào kho hoặc cơ sở dữ liệu có khóa.'],
      avoid: ['Phép cộng dồn không có khóa chống lặp.'],
    },

    comparison: {
      intro: 'Các cách xử lý trùng lặp ở phía đích:',
      headers: ['Cách làm', 'Phù hợp khi', 'Đánh đổi'],
      rows: [
        ['Upsert theo khóa', 'Đích có khóa chính', 'Không hợp với phép cộng dồn'],
        ['Bảng đã xử lý', 'Có mã sự kiện ổn định', 'Bảng lớn dần, phải dọn'],
        ['Lưu Offset cùng kết quả', 'Đích có giao dịch', 'Phải tự quản lý Offset'],
      ],
    },

    misconceptions: [
      {
        myth: 'Đã bật Idempotent Producer thì Consumer không thể xử lý trùng.',
        truth: 'Nó chỉ chống trùng khi ghi vào Kafka. Consumer đọc lại sau rebalance vẫn xử lý trùng.',
      },
      {
        myth: 'Auto commit luôn đảm bảo At-least-once.',
        truth: 'Chỉ khi xử lý xong trước lần `poll` kế tiếp. Xử lý ở luồng khác có thể làm Offset vượt trước, gây mất dữ liệu.',
      },
    ],
  },
})
