import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-broker',
  summary:
    'Broker là máy chủ Kafka, lưu log của các Partition và phục vụ ghi đọc. Mỗi Broker làm Leader cho một số Partition và Follower cho số khác, còn metadata do Controller trong KRaft quản lý.',
  tags: ['Broker', 'Kiến trúc', 'KRaft'],
  related: ['kafka-overview', 'kafka-partition', 'kafka-replication', 'kafka-leader-follower'],
  sections: {
    definition: `**Broker (Máy chủ Kafka)** là tiến trình nhận dữ liệu từ Producer, lưu xuống đĩa và trả cho Consumer. Nhiều Broker tạo thành cụm. Trong KRaft, \`process.roles\` quyết định một máy là \`broker\`, \`controller\` hay cả hai.`,

    origin: `Một máy đơn bị giới hạn dung lượng và là điểm lỗi duy nhất, nên Kafka chia [[kafka-partition|Partition]] lên nhiều Broker. Trước đây metadata nằm ở ZooKeeper. Từ bản 4.0, các Controller dùng Raft để giữ metadata ngay trong Kafka.`,

    whyUse: `Hầu hết vấn đề vận hành, như đĩa đầy, Leader lệch hay ISR co lại, đều xuất phát từ cách Partition được đặt trên các Broker.`,

    mechanism: `- **Kết nối.** Client dùng vài địa chỉ bootstrap để lấy metadata, rồi nối thẳng tới Leader của từng Partition.
- **Lưu trữ.** Mỗi Partition là một thư mục gồm nhiều segment, mặc định tối đa 1 GiB mỗi segment.
- **Phục vụ đọc.** Dữ liệu đi từ page cache ra socket bằng \`sendfile\` (zero-copy). Bật TLS thì không dùng được cơ chế này, nên CPU tăng.
- **Khi hỏng.** Controller phát hiện qua heartbeat, rồi bầu [[kafka-leader-follower|Leader]] mới từ ISR.
- **Khi thêm máy.** Broker mới **không tự nhận** Partition cũ, phải chạy công cụ phân bổ lại.`,

    example: `Cụm 3 Broker có đĩa đầy 85%. Thêm 3 Broker nhưng đĩa máy cũ vẫn đầy, vì dữ liệu không tự di chuyển. Nhóm phải phân bổ lại khoảng 20 TB với giới hạn băng thông, mất hơn một ngày.`,

    prosCons: {
      pros: ['Thêm Broker tăng cả dung lượng và thông lượng.', 'Page cache và zero-copy phục vụ nhiều Consumer với chi phí thấp.'],
      cons: ['Broker giữ dữ liệu trên đĩa, nên thêm bớt máy đều phải di chuyển dữ liệu.'],
    },

    whenToUse: {
      use: ['Tách riêng Controller khỏi Broker ở môi trường quan trọng.', 'Tắt `auto.create.topics.enable` ở production.'],
      avoid: ['Không dùng chế độ kết hợp cho cụm quan trọng: tài liệu chính thức không khuyến nghị.'],
    },

    comparison: {
      intro: 'Trong KRaft, Broker và Controller là hai vai trò khác nhau:',
      headers: ['Tiêu chí', 'Broker', 'Controller'],
      rows: [
        ['Nhiệm vụ', 'Lưu và phục vụ dữ liệu', 'Quản lý metadata, bầu Leader'],
        ['Số lượng', 'Theo tải và dung lượng', 'Thường 3 hoặc 5'],
        ['Khi mất máy', 'Bản sao khác làm Leader', 'Còn đa số thì vẫn chạy'],
      ],
    },

    misconceptions: [
      {
        myth: 'Thêm Broker thì tải tự cân bằng lại.',
        truth: 'Broker mới không nhận Partition cũ cho tới khi được phân bổ lại. Chỉ Topic mới tạo mới đặt lên máy mới.',
      },
      {
        myth: 'Danh sách bootstrap phải chứa mọi Broker.',
        truth: 'Nó chỉ dùng để lấy metadata lần đầu, nên vài địa chỉ là đủ.',
      },
    ],
  },
})
