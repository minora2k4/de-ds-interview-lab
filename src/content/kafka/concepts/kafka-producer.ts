import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-producer',
  summary:
    'Producer là client ghi thông điệp vào Kafka: chọn Partition theo key, gom batch, gửi tới Leader và chờ xác nhận theo acks. Từ Kafka 3.0, mặc định là acks=all và bật Idempotent Producer.',
  tags: ['Producer', 'acks', 'Cấu hình'],
  related: ['kafka-partition', 'kafka-replication', 'kafka-exactly-once', 'kafka-ordering'],
  sections: {
    definition: `**Producer (Bên gửi)** là client ghi thông điệp vào [[kafka-topic|Topic]]. Nó quyết định thông điệp vào [[kafka-partition|Partition]] nào và chờ xác nhận tới mức nào, nên độ bền dữ liệu được quyết định một phần ở client.`,

    origin: `Gửi từng thông điệp tốn một vòng mạng cho mỗi thông điệp. Kafka đưa việc gom batch và chọn Partition về client, để client gửi thẳng tới Leader. Mặc định cũ \`acks=1\` có thể mất dữ liệu khi Leader chết, nên bản 3.0 đổi sang mặc định an toàn hơn.`,

    whyUse: `Cấu hình Producer là nơi đánh đổi trực tiếp giữa độ bền, độ trễ và thông lượng.`,

    mechanism: `1. **Chọn Partition.** Có key thì băm key. Không có key thì dùng **sticky partitioning**: giữ một Partition đến khi đủ batch rồi đổi.
2. **Gom batch.** \`batch.size\` mặc định 16 KB. \`linger.ms\` mặc định **5 ms từ bản 4.0**, trước đó là 0.
3. **Chờ xác nhận.** \`acks=all\` là mặc định, chờ toàn bộ ISR.
4. **Gửi lại.** \`retries\` rất lớn, bị chặn bởi \`delivery.timeout.ms\` (2 phút). \`enable.idempotence=true\` giúp Broker loại bản trùng do gửi lại.

Nếu đặt \`acks=1\` mà không bật idempotence tường minh, Kafka **âm thầm tắt** nó. Nếu đã bật tường minh, Producer báo \`ConfigException\`.`,

    example: `Hệ thống clickstream ghi 100.000 sự kiện mỗi giây. Đặt \`linger.ms=20\` và nén \`lz4\` giúp số request giảm khoảng 10 lần, đổi lại độ trễ tăng khoảng 15 ms. Với clickstream, đánh đổi này rất đáng.`,

    prosCons: {
      pros: ['Batch và nén tăng thông lượng rất nhiều.', 'Mặc định hiện nay đã an toàn.'],
      cons: ['`send()` bất đồng bộ, không kiểm tra callback thì lỗi bị bỏ qua.', 'Dữ liệu trong bộ đệm mất nếu tiến trình chết.'],
    },

    whenToUse: {
      use: ['Giữ `acks=all` và idempotence cho dữ liệu nghiệp vụ.', 'Đặt key khi cần thứ tự theo thực thể.'],
      avoid: ['Không tự viết vòng lặp gửi lại ở ứng dụng, vì Broker không nhận ra bản trùng.'],
    },

    comparison: {
      intro: 'Ba mức `acks`:',
      headers: ['acks', 'Chờ gì', 'Rủi ro mất dữ liệu'],
      rows: [
        ['`0`', 'Không chờ', 'Cao, Producer không biết có lỗi'],
        ['`1`', 'Leader đã ghi', 'Leader chết trước khi Follower sao chép'],
        ['`all` (mặc định)', 'Toàn bộ ISR hiện tại', 'Thấp, phụ thuộc `min.insync.replicas`'],
      ],
    },

    misconceptions: [
      {
        myth: '`acks=all` nghĩa là mọi bản sao được gán đều đã nhận.',
        truth: 'Chỉ cần các bản sao đang trong ISR. ISR co còn mỗi Leader thì một bản cũng đủ, trừ khi đặt `min.insync.replicas`.',
      },
      {
        myth: 'Bật idempotence là hết mọi loại trùng lặp.',
        truth: 'Nó chỉ loại trùng do gửi lại nội bộ trong một phiên Producer. Ứng dụng gọi `send()` lại vẫn tạo trùng.',
      },
    ],
  },
})
