import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-topic',
  summary:
    'Topic là tên logic của một luồng sự kiện cùng loại. Dữ liệu thực sự nằm trong các Partition, còn các cấu hình như Retention hay số bản sao được đặt theo từng Topic.',
  tags: ['Topic', 'Lưu trữ', 'Cấu hình'],
  related: ['kafka-partition', 'kafka-retention', 'kafka-replication', 'kafka-overview'],
  sections: {
    definition: `**Topic (Luồng thông điệp có tên)** là tên logic mà Producer ghi vào và Consumer đăng ký đọc. Một Topic gồm một hoặc nhiều [[kafka-partition|Partition]], nơi dữ liệu thực sự nằm. Topic không phải một tệp hay một vị trí vật lý.`,

    origin: `Nếu mọi sự kiện đi chung một luồng, mỗi bên đọc phải tự lọc phần mình cần, và mọi loại dữ liệu phải dùng chung một cấu hình. Topic tách dữ liệu theo loại, đơn giản hơn định tuyến theo nội dung của message broker truyền thống.`,

    whyUse: `Log debug có thể giữ 1 ngày với 2 bản sao, trong khi sự kiện thanh toán giữ 30 ngày với 3 bản sao. Quyền truy cập cũng thường cấp theo Topic.`,

    mechanism: `- **Mặc định khi tạo.** \`num.partitions=1\` và \`default.replication.factor=1\`.
- **Tự tạo Topic.** \`auto.create.topics.enable\` mặc định là \`true\`. Gõ nhầm tên có thể tạo ra Topic một Partition, không có bản sao dự phòng.
- **Cấu hình riêng.** Ví dụ \`retention.ms\`, \`cleanup.policy\`, \`min.insync.replicas\`.
- **Thay đổi.** Có thể tăng số Partition, nhưng **không giảm được**. Muốn giảm phải tạo Topic mới.
- **Topic nội bộ.** \`__consumer_offsets\` lưu Offset đã commit, \`__transaction_state\` lưu trạng thái transaction.`,

    example: `Một đội đặt \`orders.events\` có 24 Partition và giữ 7 ngày, \`orders.snapshot\` dùng compaction, và \`app.logs\` chỉ giữ 1 ngày. Nếu gộp cả ba, log phải giữ tới 7 ngày, tốn thêm hàng chục TB đĩa, và mọi bên đọc phải lọc dữ liệu không liên quan.`,

    prosCons: {
      pros: ['Cấu hình riêng cho từng loại dữ liệu.', 'Bên đọc chỉ đăng ký Topic liên quan.'],
      cons: ['Quá nhiều Topic làm tăng Partition và metadata.', 'Không có thứ tự giữa các Topic.'],
    },

    whenToUse: {
      use: ['Tách Topic khi schema, Retention hoặc bên đọc khác nhau.', 'Gộp sự kiện của một thực thể vào một Topic nếu cần thứ tự giữa chúng.'],
      avoid: ['Không tạo Topic riêng cho từng khách hàng khi số khách hàng rất lớn.'],
    },

    comparison: {
      intro: 'Topic thường bị nhầm với các khái niệm gần giống:',
      headers: ['Tiêu chí', 'Topic', 'Partition', 'Bảng cơ sở dữ liệu'],
      rows: [
        ['Bản chất', 'Tên logic', 'Log vật lý', 'Tập dòng có schema'],
        ['Thứ tự', 'Không có toàn cục', 'Có', 'Theo truy vấn'],
        ['Cập nhật', 'Chỉ nối thêm', 'Chỉ nối thêm', 'Tại chỗ'],
      ],
    },

    misconceptions: [
      {
        myth: 'Topic đảm bảo thứ tự như một hàng đợi.',
        truth: 'Thứ tự chỉ có trong từng Partition, không có trên toàn Topic.',
      },
      {
        myth: 'Có thể giảm số Partition khi không cần nhiều nữa.',
        truth: 'Kafka không hỗ trợ giảm. Phải tạo Topic mới rồi chuyển bên đọc, bên ghi sang đó.',
      },
    ],
  },
})
