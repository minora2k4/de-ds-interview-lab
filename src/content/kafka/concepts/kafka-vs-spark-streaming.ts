import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-vs-spark-streaming',
  summary:
    'Kafka lưu và vận chuyển sự kiện, còn Spark Structured Streaming tính toán trên sự kiện đó. DStream là API cũ đã ngừng cập nhật, Structured Streaming là API hiện hành.',
  tags: ['So sánh', 'Spark', 'Streaming'],
  related: ['kafka-overview', 'kafka-exactly-once', 'kafka-offset', 'spark-overview', 'arch-streaming'],
  sections: {
    definition: `**Kafka** là tầng lưu trữ và vận chuyển sự kiện. **Spark Streaming** là cách gọi chung việc xử lý luồng bằng [[spark-overview|Spark]]. Chúng thường đi cùng nhau, không phải chọn một trong hai.`,

    origin: `Spark Streaming đời đầu dùng **DStream**, chia luồng thành các RDD nhỏ. Tài liệu Spark hiện nay ghi rõ đây là **dự án cũ, không còn được cập nhật**, và khuyến nghị dùng **Structured Streaming**, xây trên DataFrame và Spark SQL.`,

    whyUse: `Kafka giữ dữ liệu bền và đọc lại được, Spark lo join và tổng hợp theo cửa sổ. Công cụ so sánh trực tiếp với Spark là Kafka Streams hoặc Flink.`,

    mechanism: `**Theo Spark 4.3, Structured Streaming có các chế độ:**

- **Micro-batch (mặc định):** độ trễ khoảng 100 ms, hỗ trợ mọi thao tác.
- **Real-time Mode (từ 4.1.0):** độ trễ cỡ mili giây, chưa hỗ trợ đủ mọi thao tác.
- **Continuous Processing:** vẫn thử nghiệm, bị xem là cũ.

**Khi đọc từ Kafka:**

- Mặc định một Kafka Partition ứng với một Spark Partition.
- **Spark tự quản lý Offset** qua checkpoint, không commit về Kafka.
- \`startingOffsets\` mặc định \`latest\` cho truy vấn luồng, chỉ áp dụng khi truy vấn mới bắt đầu.

**Về exactly-once:** Spark đạt được khi nguồn đọc lại được và đích lũy đẳng. **Khi ghi vào Kafka, tài liệu Spark nói rõ chỉ là At-least-once**, nên bên đọc phải khử trùng theo khóa.`,

    diagram: {
      mermaid: `flowchart TD
  A["Producer ghi sự kiện"] --> B["Kafka: lưu và vận chuyển"]
  B --> C["Structured Streaming: tính toán"]
  C --> D["Checkpoint lưu Offset và trạng thái"]
  C --> E["Data Lake: đích lũy đẳng"]
  C --> F["Topic Kafka: At-least-once"]`,
      caption: 'Kafka là tầng vận chuyển, Spark là tầng xử lý. Tiến độ đọc nằm trong checkpoint của Spark.',
    },

    example: `Pipeline đọc 30 Partition, tính doanh thu theo cửa sổ 5 phút rồi ghi Delta Lake. Khi Spark lỗi, nó đọc lại từ Offset trong checkpoint. Xóa checkpoint làm truy vấn bắt đầu lại từ \`latest\`, nên mất phần dữ liệu ở giữa.`,

    prosCons: {
      pros: ['Tách lưu trữ và tính toán, nên đọc lại được khi sửa logic.'],
      cons: ['Micro-batch có độ trễ cao hơn xử lý từng bản ghi.', 'Offset nằm ở checkpoint, nên phải bảo vệ thư mục này.'],
    },

    whenToUse: {
      use: ['Spark khi đã có đội ngũ Spark, cần join và tổng hợp với dữ liệu lớn.'],
      avoid: ['Không viết mới bằng DStream.'],
    },

    comparison: {
      intro: 'Hai tầng khác nhau của cùng một pipeline:',
      headers: ['Tiêu chí', 'Kafka', 'Spark Structured Streaming'],
      rows: [
        ['Vai trò', 'Lưu và vận chuyển', 'Tính toán'],
        ['Lưu tiến độ', 'Offset của nhóm', 'Checkpoint'],
      ],
    },

    misconceptions: [
      {
        myth: 'Spark Streaming có thể thay thế Kafka.',
        truth: 'Spark không lưu luồng sự kiện lâu dài cho nhiều bên đọc. Nó cần một nguồn đọc lại được như Kafka.',
      },
      {
        myth: 'Spark exactly-once nên ghi sang Kafka cũng không trùng.',
        truth: 'Tài liệu Spark nêu rõ ghi vào Kafka chỉ là At-least-once, và có thể sinh bản trùng.',
      },
    ],
  },
})
