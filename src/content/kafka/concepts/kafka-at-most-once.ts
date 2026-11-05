import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-at-most-once',
  summary:
    'At-most-once đảm bảo thông điệp được xử lý tối đa một lần, nên có thể mất nhưng không bao giờ lặp. Trong Kafka, cách làm là tắt gửi lại ở Producer và commit Offset trước khi xử lý.',
  tags: ['Ngữ nghĩa giao nhận', 'Độ tin cậy'],
  related: ['kafka-delivery-semantics', 'kafka-at-least-once', 'kafka-producer', 'kafka-offset'],
  sections: {
    definition: `**At-most-once (Giao tối đa một lần)** là ngữ nghĩa trong đó mỗi thông điệp được xử lý không quá một lần. Khi có lỗi, thông điệp **có thể mất**, nhưng **không bao giờ lặp**.`,

    origin: `Đây là mức đơn giản nhất của [[kafka-delivery-semantics|ngữ nghĩa giao nhận]]: không gửi lại khi không chắc chắn. Nó tồn tại vì có những dữ liệu mà một bản trùng còn tệ hơn việc mất một bản, hoặc giá trị từng bản ghi rất thấp.`,

    whyUse: `Cách này có độ trễ thấp nhất và chi phí phối hợp ít nhất, vì không phải chờ xác nhận hay theo dõi gửi lại.`,

    mechanism: `Tài liệu Kafka mô tả cách làm là tắt gửi lại ở Producer và commit Offset trước khi xử lý.

- **Producer:** đặt \`retries=0\`, hoặc \`acks=0\` nếu không cần biết kết quả. Với \`acks=0\`, cấu hình \`retries\` không có tác dụng, và Offset trả về luôn là -1.
- **Consumer:** commit Offset **trước** khi xử lý. Nếu chết sau khi commit mà chưa xử lý, Consumer mới bắt đầu từ vị trí đã commit và bỏ qua phần đó.

Hai cấu hình này xung đột với idempotence mặc định, nên idempotence sẽ tự tắt.`,

    example: `Hệ thống giám sát gửi 500.000 điểm số liệu mỗi giây, mỗi điểm lặp lại sau 10 giây. Dùng \`acks=0\` giúp giảm độ trễ. Khi một Broker khởi động lại, khoảng vài nghìn điểm bị mất, biểu đồ chỉ có một khoảng trống nhỏ.`,

    prosCons: {
      pros: ['Độ trễ thấp nhất, cấu hình đơn giản.', 'Không có bản trùng ở phía đích.'],
      cons: ['Mất dữ liệu mà có thể không ai biết.', 'Không kiểm tra được đã mất bao nhiêu nếu dùng `acks=0`.'],
    },

    whenToUse: {
      use: ['Số liệu giám sát, log gỡ lỗi, dữ liệu mẫu.', 'Dữ liệu được gửi lại định kỳ, bản sau thay thế bản trước.'],
      avoid: ['Giao dịch, đơn hàng hoặc bất kỳ dữ liệu nào cần đối soát.'],
    },

    comparison: {
      intro: 'At-most-once và At-least-once là hai hướng lệch của cùng một vấn đề:',
      headers: ['Tiêu chí', 'At-most-once', 'At-least-once'],
      rows: [
        ['Khi có lỗi', 'Có thể mất', 'Có thể lặp'],
        ['Thứ tự ở Consumer', 'Commit rồi xử lý', 'Xử lý rồi commit'],
        ['Producer', 'Không gửi lại', 'Gửi lại'],
      ],
    },

    misconceptions: [
      {
        myth: 'Chỉ cần đặt `acks=0` là có At-most-once cho cả luồng.',
        truth: 'Đó mới là phía ghi. Consumer commit sau khi xử lý thì phía đọc vẫn có thể lặp.',
      },
      {
        myth: 'At-most-once nghĩa là thường xuyên mất dữ liệu.',
        truth: 'Khi hệ thống khỏe, gần như không mất. Dữ liệu chỉ mất khi có lỗi trong đúng khoảng thời gian đó.',
      },
    ],
  },
})
