import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-metrics',
  summary:
    'Chỉ số chất lượng biến luật thành con số theo dõi được, thường là tỷ lệ đạt theo từng luật. Scorecard gom các chỉ số theo chiều, theo bảng và theo đội, nhưng luật nghiêm trọng phải được xét riêng, không được trung bình cùng các luật khác.',
  tags: ['Chỉ số', 'Scorecard', 'Ngưỡng'],
  related: ['dq-dimensions', 'dq-overview', 'dq-incremental', 'dq-tools', 'etl-data-quality', 'arch-observability'],
  sections: {
    definition: `**Data Quality Metric (Chỉ số chất lượng dữ liệu)** là một con số đo được cho một luật hoặc một chiều, ví dụ tỷ lệ dòng đạt luật, số phút trễ, số dòng trùng.

**Data Quality Scorecard (Bảng điểm chất lượng)** gom các chỉ số theo bảng, theo chiều và theo đội để thấy xu hướng và biết chỗ nào cần ưu tiên.`,

    origin: `Nếu chỉ có các luật đạt hoặc không đạt, sẽ không biết chất lượng đang tốt lên hay xấu đi, và chỉ biết có vấn đề khi đã vượt ngưỡng. Khi số lượng bảng lên đến hàng nghìn, lãnh đạo và các đội cần một cách nhìn tổng hợp để ưu tiên. Scorecard ra đời để trả lời câu hỏi đó. Vận hành hằng ngày và cảnh báo thì xem thêm ở [[arch-observability]].`,

    whyUse: `- **Thấy xu hướng trước khi hỏng:** tỷ lệ null tăng dần trong 2 tuần vẫn có thể chưa vượt ngưỡng.
- **Có thứ tự ưu tiên:** biết đội nào, bảng nào có nhiều vấn đề nhất.
- **Đặt được cam kết:** ví dụ 99,9% đơn hàng có mặt trước 7:00.`,

    mechanism: `**1. Định nghĩa rõ tử số và mẫu số.** Tỷ lệ đạt bằng số dòng đạt chia cho số dòng được xét. Có cần tính cả dòng null không? Nếu chỉ tính dòng không null, một cột thiếu 90% vẫn có thể đạt 100% Validity. Vì thế mỗi cột cần cả chỉ số Completeness.

**2. Đo theo mức ảnh hưởng, không chỉ số dòng.** 0,1% đơn hàng sai nhưng chiếm 20% doanh thu thì nghiêm trọng hơn nhiều. Nên có chỉ số theo giá trị, nếu dữ liệu cho phép.

**3. Đặt mức độ nghiêm trọng.** Mỗi luật có một mức: nghiêm trọng thì chặn pipeline, cảnh báo thì thông báo, thông tin thì chỉ ghi lại. Chính sách cụ thể khi có lỗi xem ở [[etl-data-quality]].

**4. Đặt ngưỡng.**
- **Ngưỡng cố định:** phù hợp với luật có đáp án rõ, như khóa chính không được trùng.
- **Ngưỡng theo lịch sử:** phù hợp với chỉ số dao động, như số dòng mỗi ngày. So với cùng thứ trong tuần của các tuần trước, vì thứ Bảy thường thấp hơn thứ Hai.

**5. Tổng hợp cẩn thận.** Không lấy trung bình tất cả luật thành một số:

- Luật nghiêm trọng xét riêng như một cổng: có một luật không đạt thì trạng thái là đỏ, dù điểm cao.
- Phần còn lại mới dùng trung bình có trọng số theo mức quan trọng.
- Luôn cho phép xem chi tiết đến từng luật và từng ngày.

**6. Theo dõi hiệu quả của chính hệ thống:** thời gian phát hiện, thời gian khắc phục, tỷ lệ cảnh báo giả, và số sự cố do người dùng báo trước khi hệ thống báo.

**Giới hạn:** khi điểm trở thành mục tiêu, người ta có xu hướng làm đẹp điểm, như thêm các luật dễ đạt hoặc nới ngưỡng. Đây là **Goodhart's Law**: chỉ số bị dùng làm mục tiêu sẽ không còn là thước đo tốt. Vì thế nên theo dõi thêm số sự cố thực tế.`,

    example: `Bảng \`orders\` có 40 luật, trong đó 38 luật đạt 100%. Điểm trung bình đạt 97%, nghe có vẻ tốt.

Nhưng hai luật không đạt là: khóa \`order_id\` trùng 2,1% và \`amount\` sai đơn vị ở một đối tác, ảnh hưởng 6% doanh thu. Với cách gom đúng, bảng có trạng thái **đỏ** dù điểm 97%.

Đội cũng đổi ngưỡng số dòng từ "trên 100.000" sang "trong khoảng cho phép so với 4 tuần trước, cùng thứ". Sau đổi, số cảnh báo giả mỗi tháng giảm từ 22 xuống 3, và không bỏ sót sự cố nào trong quý.`,

    prosCons: {
      pros: [
        '**Biến chất lượng thành thứ theo dõi được,** so sánh được theo thời gian.',
        '**Tạo động lực và trách nhiệm** rõ ràng cho các đội sở hữu dữ liệu.',
        '**Phát hiện xu hướng xấu** trước khi nó thành sự cố.',
      ],
      cons: [
        '**Dễ bị làm đẹp** khi điểm trở thành mục tiêu đánh giá.',
        '**Khó so sánh giữa các bảng,** vì bộ luật và độ khó không giống nhau.',
        '**Không đo được tính đại diện và độ đúng của nhãn,** nên điểm cao chưa nói lên mức độ phù hợp.',
      ],
    },

    whenToUse: {
      use: [
        'Khi có nhiều bảng và nhiều đội, cần biết ưu tiên ở đâu.',
        'Khi muốn cam kết chất lượng với bên dùng dữ liệu.',
        'Khi muốn phát hiện xu hướng xấu dần, không chỉ lỗi đột ngột.',
      ],
      avoid: [
        'Không dùng một con số trung bình để quyết định có dùng được dữ liệu không.',
        'Không so điểm giữa các đội để thưởng phạt, vì sẽ khuyến khích làm đẹp điểm.',
      ],
    },

    comparison: {
      intro: 'Hai cách đặt ngưỡng, thường được dùng kết hợp:',
      headers: ['Tiêu chí', 'Ngưỡng cố định', 'Ngưỡng theo lịch sử'],
      rows: [
        ['Phù hợp với', 'Luật có đáp án rõ: khóa, miền giá trị', 'Chỉ số dao động: số dòng, tỷ lệ null'],
        ['Dữ liệu cần có', 'Không cần lịch sử', 'Cần vài tuần lịch sử'],
        ['Khi có mùa vụ', 'Dễ báo động giả', 'Xử lý được nếu so cùng chu kỳ'],
        ['Khi xấu đi từ từ', 'Phát hiện khi vượt ngưỡng', 'Có thể bỏ sót vì lịch sử xấu dần theo'],
        ['Giải thích', 'Rất dễ', 'Khó hơn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Điểm chất lượng cao thì dữ liệu dùng được.',
        truth: 'Điểm chỉ phản ánh các luật đã viết, thường là lớp nội tại. Nó có thể cao mà dữ liệu vẫn lệch, hoặc chỉ có toàn luật dễ đạt.',
      },
      {
        myth: 'Ngưỡng theo lịch sử luôn tốt hơn ngưỡng cố định.',
        truth: 'Nếu chất lượng giảm chậm, lịch sử giảm theo và không báo gì. Luật có đáp án rõ thì nên dùng ngưỡng cố định.',
      },
      {
        myth: 'Càng nhiều luật thì càng tốt.',
        truth: 'Nhiều luật không ai xử lý tạo ra quá tải cảnh báo, khiến người ta bỏ qua cả cảnh báo thật. Hãy bắt đầu từ luật gắn với việc sử dụng.',
      },
    ],
  },
})
