import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-eventual-consistency',
  summary:
    'Eventual Consistency chỉ hứa rằng nếu ngừng ghi, các bản sao sẽ hội tụ về cùng một giá trị. Nó không hứa thời gian và không hứa đọc được giá trị mới nhất, đổi lại có độ trễ thấp và tính sẵn sàng cao.',
  tags: ['Nhất quán', 'Replication'],
  related: ['cloud-consistency', 'cloud-cap', 'cloud-replication', 'cloud-s3', 'etl-idempotency', 'db-relational-nosql'],
  sections: {
    definition: `**Eventual Consistency (Nhất quán sau cùng)** là đảm bảo: nếu không có ghi mới, sau một thời gian mọi bản sao sẽ có cùng giá trị. Trong thời gian đó, hai người đọc có thể thấy hai giá trị khác nhau.`,

    origin: `Giữ mọi bản giống hệt nhau đòi hỏi chờ mạng ở mỗi lần ghi, và hệ thống bị dừng khi mất đa số. Dynamo của Amazon (2007) chọn ghi trước vào vài bản rồi lan ra sau, để giỏ hàng luôn nhận được thao tác. DNS là ví dụ lâu đời hơn của cùng một ý tưởng.`,

    whyUse: `Vẫn phục vụ được ở cả hai phía khi có partition, và không phải chờ bản ở xa. Hợp với dữ liệu lớn mà sai lệch ngắn không gây hại.`,

    mechanism: `Các bản được kéo về một giá trị bằng ba cơ chế:

- **Read Repair:** khi đọc thấy bản cũ, sửa luôn bản đó.
- **Anti-Entropy:** các nút định kỳ so sánh dữ liệu, thường bằng Merkle Tree để không phải gửi hết.
- **Hinted Handoff:** nút khác giữ hộ các ghi khi một nút tạm thời mất.

**Khi hai ghi xung đột:** hội tụ không có nghĩa là không mất dữ liệu.

- **Last-Writer-Wins:** giữ ghi có thời gian lớn nhất, đơn giản nhưng âm thầm mất ghi còn lại.
- **Version Vector:** phát hiện xung đột để ứng dụng tự gộp.
- **CRDT:** kiểu dữ liệu tự gộp được, như bộ đếm.

**Với [[cloud-s3|S3]]:** object đã strong từ tháng 12/2020, nhưng cấu hình bucket vẫn là eventual, và Cross-Region Replication là bất đồng bộ.`,

    example: `DynamoDB có GSI theo \`status\`. Job chốt sổ chạy ngay sau khi đơn cuối cùng được ghi và đọc qua GSI, nên thiếu 120 trong 2 triệu đơn, vì GSI luôn là eventual. Nhóm sửa bằng cách chạy job sau độ trễ an toàn 5 phút và đối soát số lượng.`,

    prosCons: {
      pros: ['Độ trễ thấp vì đọc và ghi ở bản gần.', 'Vẫn phục vụ được khi có partition.'],
      cons: ['Ứng dụng phải tự xử lý dữ liệu cũ và xung đột.', 'Không có giới hạn thời gian, khó kiểm thử.'],
    },

    whenToUse: {
      use: ['Lượt xem, gợi ý, dữ liệu phân tích, nơi sai lệch ngắn không gây hại.'],
      avoid: ['Kiểm tra số dư, tồn kho, ngăn trùng khóa chính.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Eventual', 'Strong'],
      rows: [
        ['Đọc ngay sau ghi', 'Có thể thấy giá trị cũ', 'Luôn thấy giá trị mới'],
        ['Độ trễ', 'Thấp', 'Cao hơn'],
        ['Khi có partition', 'Vẫn trả lời', 'Có thể từ chối'],
      ],
    },

    misconceptions: [
      {
        myth: '"Sau cùng" nghĩa là chỉ vài mili giây.',
        truth: 'Thường rất nhanh, nhưng định nghĩa không hứa thời gian. Khi có sự cố, độ trễ có thể lên tới hàng giờ.',
      },
      {
        myth: 'Hội tụ nghĩa là không mất dữ liệu.',
        truth: 'Last-Writer-Wins vẫn hội tụ, nhưng bằng cách bỏ đi một ghi.',
      },
    ],
  },
})
