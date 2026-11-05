import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-offset',
  summary:
    'Offset là số thứ tự của thông điệp trong một Partition. Consumer Group commit Offset vào Topic nội bộ để biết chỗ đọc tiếp, nên tua lại được mà không ảnh hưởng nhóm khác.',
  tags: ['Offset', 'Commit', 'Đọc lại'],
  related: ['kafka-partition', 'kafka-consumer', 'kafka-consumer-group', 'kafka-delivery-semantics'],
  sections: {
    definition: `**Offset (Vị trí trong Partition)** là số nguyên tăng dần, định danh thông điệp trong một [[kafka-partition|Partition]]. Offset 100 của hai Partition là hai thông điệp khác nhau. **Position** là thông điệp kế tiếp Consumer sẽ đọc, còn **committed offset** là vị trí đã lưu lại để dùng khi khởi động lại.`,

    origin: `Nhiều message broker lưu trạng thái từng thông điệp, vừa tốn tài nguyên vừa khó đồng bộ. Kafka thay bằng một con số cho mỗi Partition, vì mỗi Partition chỉ có một Consumer trong nhóm.`,

    whyUse: `Offset giúp khôi phục sau lỗi và đọc lại khi sửa lỗi. Khoảng cách giữa Offset cuối log và Offset đã commit chính là **consumer lag**, chỉ số vận hành quan trọng nhất.`,

    mechanism: `- **Nơi lưu.** Topic nội bộ \`__consumer_offsets\`, dùng compaction để giữ giá trị mới nhất.
- **Ý nghĩa.** Commit Offset N nghĩa là thông điệp kế tiếp cần đọc là N.
- **Hết hạn.** \`offsets.retention.minutes\` mặc định 7 ngày. Nhóm rỗng quá lâu sẽ mất Offset, rồi \`auto.offset.reset\` quyết định đọc từ đâu.
- **Tua lại.** Dùng công cụ quản lý nhóm hoặc \`seek\` để về một vị trí hay một mốc thời gian.
- **Không liền nhau.** Có thể có khoảng trống do compaction hoặc bản ghi đánh dấu transaction.`,

    example: `Nhóm nạp kho triển khai bản lỗi lúc 9 giờ, đến 11 giờ mới phát hiện. Họ đưa Offset về mốc 9 giờ rồi chạy lại 2 giờ dữ liệu. Kho dùng upsert theo mã sự kiện nên dòng trùng được ghi đè đúng.`,

    prosCons: {
      pros: ['Trạng thái đọc rất nhỏ, và tua lại rất dễ.'],
      cons: ['Khó bỏ qua riêng một thông điệp lỗi rồi quay lại sau.', 'Thứ tự commit và xử lý sai sẽ gây mất hoặc trùng.'],
    },

    whenToUse: {
      use: ['Commit sau khi xử lý xong với dữ liệu quan trọng.', 'Lưu Offset cùng giao dịch với kết quả khi cần đảm bảo mạnh, xem [[kafka-exactly-once]].'],
      avoid: ['Không dựa vào Offset liên tiếp để phát hiện thông điệp thiếu.'],
    },

    comparison: {
      intro: 'So với cách theo dõi của hàng đợi truyền thống:',
      headers: ['Tiêu chí', 'Offset', 'Xác nhận từng thông điệp'],
      rows: [
        ['Trạng thái', 'Một số cho mỗi Partition', 'Một trạng thái cho mỗi thông điệp'],
        ['Thông điệp lỗi', 'Có thể chặn cả Partition', 'Xử lý riêng được'],
      ],
    },

    misconceptions: [
      {
        myth: 'Offset là định danh duy nhất trong toàn Topic.',
        truth: 'Offset chỉ duy nhất trong một Partition. Định danh đầy đủ cần Topic, Partition và Offset.',
      },
      {
        myth: 'Commit nghĩa là thông điệp đã xử lý thành công.',
        truth: 'Commit chỉ lưu vị trí. Auto commit có thể commit cả thông điệp chưa xử lý xong.',
      },
    ],
  },
})
