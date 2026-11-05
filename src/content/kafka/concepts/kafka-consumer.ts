import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-consumer',
  summary:
    'Consumer là client kéo dữ liệu từ Partition theo Offset và tự quyết định khi nào commit vị trí đã đọc. Thứ tự giữa xử lý và commit quyết định ngữ nghĩa giao nhận.',
  tags: ['Consumer', 'Pull', 'Cấu hình'],
  related: ['kafka-offset', 'kafka-consumer-group', 'kafka-delivery-semantics', 'kafka-exactly-once'],
  sections: {
    definition: `**Consumer (Bên đọc)** là client đọc dữ liệu bằng cách **kéo (pull)**: gửi yêu cầu fetch kèm [[kafka-offset|Offset]] và nhận về một đoạn log từ vị trí đó. Consumer thường chạy trong [[kafka-consumer-group|Consumer Group]] để chia việc.`,

    origin: `Trong mô hình đẩy (push), Broker quyết định tốc độ nên dễ làm quá tải bên chậm, và phải theo dõi trạng thái từng thông điệp. Kafka chọn pull, vị trí đọc chỉ là một số nguyên cho mỗi Partition, nên xác nhận rất rẻ và tua lại được.`,

    whyUse: `Consumer tự điều tiết tốc độ và lấy batch lớn khi có nhiều dữ liệu. Khi không có dữ liệu, long poll giúp chờ tại Broker thay vì hỏi liên tục.`,

    mechanism: `Vòng lặp cơ bản là \`poll\`, xử lý rồi commit. Các mặc định cần biết:

- \`max.poll.records=500\`: số bản ghi tối đa mỗi lần \`poll\`.
- \`max.poll.interval.ms\` là 5 phút: quá hạn mà chưa \`poll\` lại thì bị xem là lỗi và gây rebalance.
- \`enable.auto.commit=true\`, commit mỗi 5 giây, không gắn với việc xử lý xong.
- \`auto.offset.reset=latest\`: nhóm chưa có Offset đọc từ cuối log. Khi thêm Partition, giá trị này có thể gây mất dữ liệu âm thầm.
- \`isolation.level=read_uncommitted\`: vẫn thấy bản ghi của transaction đã hủy.`,

    example: `Mỗi lần \`poll\` nhận 500 bản ghi, mỗi bản ghi gọi API mất 500 ms, tổng 250 giây. Khi API chậm lên 1 giây, tổng thành 500 giây, vượt 5 phút. Consumer bị đẩy khỏi nhóm, rebalance liên tục. Giảm \`max.poll.records\` xuống 100 đã xử lý được.`,

    prosCons: {
      pros: ['Bên đọc không bị Broker làm quá tải.', 'Tua lại được mà không cần bên gửi gửi lại.'],
      cons: ['Xử lý chậm có thể gây rebalance dù tiến trình vẫn sống.', 'Ứng dụng phải tự lo thứ tự giữa xử lý và commit.'],
    },

    whenToUse: {
      use: ['Tắt auto commit và commit sau khi xử lý xong với dữ liệu quan trọng.'],
      avoid: ['Không giữ mặc định `latest` nếu nhóm mới cần đọc cả dữ liệu cũ: đặt `earliest`.'],
    },

    comparison: {
      intro: 'Pull và push khác nhau ở chỗ ai kiểm soát tốc độ:',
      headers: ['Tiêu chí', 'Pull (Kafka)', 'Push'],
      rows: [
        ['Kiểm soát tốc độ', 'Consumer', 'Broker'],
        ['Khi bên đọc chậm', 'Lag tăng', 'Có thể quá tải'],
        ['Khi không có dữ liệu', 'Long poll', 'Không gửi gì'],
      ],
    },

    misconceptions: [
      {
        myth: 'Commit Offset là xóa thông điệp.',
        truth: 'Commit chỉ lưu vị trí đọc của nhóm. Dữ liệu còn cho tới khi Retention xóa.',
      },
      {
        myth: 'Thêm Consumer luôn làm tăng tốc độ đọc.',
        truth: 'Mỗi Partition chỉ giao cho một Consumer trong nhóm. Số Consumer vượt số Partition sẽ ngồi không.',
      },
    ],
  },
})
