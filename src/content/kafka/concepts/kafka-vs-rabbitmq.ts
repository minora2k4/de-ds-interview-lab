import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-vs-rabbitmq',
  summary:
    'Kafka là log phân tán: đọc không xóa, hợp với luồng sự kiện lớn và đọc lại. RabbitMQ là message broker: định tuyến linh hoạt và xác nhận từng thông điệp, hợp với hàng đợi tác vụ.',
  tags: ['So sánh', 'RabbitMQ', 'Chọn công nghệ'],
  related: ['kafka-overview', 'kafka-messaging', 'kafka-consumer-group', 'kafka-ordering'],
  sections: {
    definition: `**Kafka** lưu thông điệp trong log, Consumer tự giữ vị trí đọc. **RabbitMQ** nhận thông điệp qua **exchange**, định tuyến vào **queue** theo **binding**, rồi giao cho Consumer. Thông điệp bị xóa khỏi queue sau khi được xác nhận.`,

    origin: `RabbitMQ theo mô hình message broker (AMQP), tập trung vào định tuyến và giao nhận từng thông điệp. Kafka ra đời để xử lý luồng rất lớn cho nhiều bên đọc lại.`,

    whyUse: `Chọn đúng giúp tránh dùng Kafka làm hàng đợi tác vụ nhỏ, hoặc dùng queue thông thường cho luồng cần đọc lại.`,

    mechanism: `**Điểm khác cốt lõi là ai giữ trạng thái.** RabbitMQ theo dõi từng thông điệp, nên hỗ trợ tốt:

- Định tuyến theo exchange: \`direct\`, \`fanout\`, \`topic\`, \`headers\`.
- Độ ưu tiên, TTL, dead letter exchange.

Kafka chỉ giữ một Offset cho mỗi Partition, nên mở rộng rất tốt và đọc lại dễ, nhưng định tuyến phải làm ở ứng dụng.

**Hai bên đang tiến lại gần nhau:**

- **RabbitMQ Streams** (từ 3.9): log chỉ nối thêm, đọc không xóa, đọc lại theo Offset.
- **RabbitMQ 4.0** bỏ classic mirrored queues, dùng quorum queues (Raft) để sao chép.
- **Kafka Share Group** (sẵn sàng cho production từ 4.2): xác nhận từng bản ghi, đếm số lần giao.`,

    example: `500 ảnh mỗi phút cho worker thu nhỏ, mỗi việc độc lập, cần thử lại riêng và ưu tiên khách trả phí: RabbitMQ hợp hơn. 80 MB/giây clickstream cho 5 hệ thống đọc, cần đọc lại 3 ngày: Kafka hợp hơn.`,

    prosCons: {
      pros: ['RabbitMQ: định tuyến và xử lý từng thông điệp linh hoạt.', 'Kafka: thông lượng cao, nhiều bên đọc, đọc lại.'],
      cons: ['Kafka: không có định tuyến.'],
    },

    whenToUse: {
      use: ['RabbitMQ cho hàng đợi tác vụ, định tuyến phức tạp.', 'Kafka cho luồng sự kiện, CDC, log, xử lý luồng.'],
      avoid: ['Không chọn theo độ nổi tiếng. Hãy hỏi có cần đọc lại và có bao nhiêu bên đọc.'],
    },

    comparison: {
      intro: 'So sánh theo mô hình mặc định của mỗi bên:',
      headers: ['Tiêu chí', 'Kafka', 'RabbitMQ (queue)'],
      rows: [
        ['Sau khi đọc', 'Vẫn giữ theo Retention', 'Xóa sau khi xác nhận'],
        ['Trạng thái', 'Offset theo Partition', 'Theo từng thông điệp'],
        ['Thứ tự', 'Trong Partition', 'FIFO, có thể đổi khi giao lại'],
      ],
    },

    misconceptions: [
      {
        myth: 'RabbitMQ không đọc lại được.',
        truth: 'RabbitMQ Streams cho đọc lại theo Offset. Câu này chỉ đúng với queue thông thường.',
      },
      {
        myth: 'Kafka luôn tốt hơn RabbitMQ vì nhanh hơn.',
        truth: 'Với hàng đợi tác vụ, RabbitMQ thường đơn giản và phù hợp hơn.',
      },
    ],
  },
})
