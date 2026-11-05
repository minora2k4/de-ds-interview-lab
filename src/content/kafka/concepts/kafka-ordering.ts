import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-ordering',
  summary:
    'Kafka chỉ đảm bảo thứ tự trong một Partition, không đảm bảo trên toàn Topic. Muốn giữ thứ tự theo thực thể thì dùng key, và tránh các thao tác làm key đổi Partition.',
  tags: ['Thứ tự', 'Partition', 'First Principles'],
  related: ['kafka-partition', 'kafka-producer', 'kafka-consumer-group', 'kafka-exactly-once'],
  sections: {
    definition: `**Message Ordering (Thứ tự thông điệp)**: trong **một [[kafka-partition|Partition]]**, Consumer đọc đúng thứ tự thông điệp đã được ghi. **Không có đảm bảo nào giữa các Partition hay giữa các Topic.**`,

    origin: `Thứ tự toàn cục đòi hỏi mọi thông điệp đi qua một điểm duy nhất, nên thông lượng bị giới hạn bởi một máy. Kafka từ bỏ nó để mở rộng được. Phần lớn nghiệp vụ thực ra chỉ cần thứ tự theo thực thể, như theo từng đơn hàng.`,

    whyUse: `Xử lý sai thứ tự sẽ cho ra trạng thái sai, ví dụ áp dụng "hủy đơn" trước "tạo đơn".`,

    mechanism: `- **Giữ theo thực thể.** Cùng key vào cùng Partition, miễn là số Partition không đổi.
- **Ở Producer.** Bật idempotence thì thứ tự được giữ, kể cả khi có tới 5 request đang gửi. Tắt idempotence, có retry và nhiều request đồng thời thì batch gửi lại có thể đứng sau batch mới hơn.
- **Ở Consumer.** Mỗi Partition có một người đọc trong nhóm, nên thứ tự đọc được giữ.

**Thứ tự bị phá khi:**

- Thêm Partition hoặc đổi cách chọn key.
- Consumer xử lý đa luồng mà không gom theo key.
- Đẩy bản ghi lỗi sang Topic thử lại, các bản ghi sau của key đó đi trước.
- Dùng Share Group.`,

    example: `Topic giao dịch tài khoản có 12 Partition, không đặt key. Sự kiện "nạp 100" và "rút 80" của cùng tài khoản rơi vào hai Partition, nên đôi khi "rút" xử lý trước và bị từ chối sai. Đặt key là \`account_id\` đã giải quyết được, mà vẫn giữ 12 Partition song song.`,

    prosCons: {
      pros: ['Thứ tự theo key đủ cho hầu hết nghiệp vụ, mà vẫn mở rộng được.'],
      cons: ['Không có thứ tự giữa các key.'],
    },

    whenToUse: {
      use: ['Xác định phạm vi thứ tự hẹp nhất mà nghiệp vụ thực sự cần, rồi đặt key theo đó.'],
      avoid: ['Không dùng một Partition chỉ để có thứ tự toàn cục, trừ khi lưu lượng rất nhỏ.'],
    },

    comparison: {
      intro: 'Các mức thứ tự và cái giá phải trả:',
      headers: ['Phạm vi', 'Cách làm', 'Đánh đổi'],
      rows: [
        ['Toàn Topic', 'Một Partition', 'Thông lượng của một Partition'],
        ['Theo thực thể', 'Đặt key', 'Phải chọn key, có thể lệch tải'],
      ],
    },

    misconceptions: [
      {
        myth: 'Kafka đảm bảo thứ tự trên toàn Topic.',
        truth: 'Chỉ trong một Partition. Đọc Topic nhiều Partition thì không có thứ tự toàn cục.',
      },
      {
        myth: 'Có Consumer Group là thứ tự xử lý luôn đúng.',
        truth: 'Nhóm chỉ giữ thứ tự khi đọc. Xử lý đa luồng bên trong Consumer vẫn có thể phá thứ tự.',
      },
    ],
  },
})
