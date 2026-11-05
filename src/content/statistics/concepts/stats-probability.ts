import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-probability',
  summary:
    'Xác suất là con số từ 0 đến 1 đo khả năng xảy ra của một sự kiện. Mọi quy tắc tính đều suy ra từ vài tiên đề, và phải phân biệt rõ xung khắc với độc lập.',
  tags: ['Xác suất', 'Độc lập', 'Xung khắc'],
  related: ['stats-conditional', 'stats-bayes', 'stats-distributions', 'stats-binomial', 'stats-type-errors'],
  sections: {
    definition: `**Probability (Xác suất)** \`P(A)\` là con số từ 0 đến 1, đo khả năng xảy ra của sự kiện A. Ba tiên đề Kolmogorov: xác suất không âm, toàn bộ không gian mẫu có xác suất 1, và xác suất hợp của các sự kiện xung khắc bằng tổng các xác suất.`,

    origin: `Bài toán thực tế là ra quyết định khi chưa biết kết quả. Cách làm kém hơn là dựa vào cảm giác, vốn rất hay sai với sự kiện hiếm hoặc lặp lại nhiều lần. Có hai cách diễn giải. **Tần suất:** tỷ lệ dài hạn khi lặp lại. **Bayes:** mức độ tin tưởng, cập nhật khi có bằng chứng mới.`,

    whyUse: `Đây là ngôn ngữ chung của [[stats-hypothesis|kiểm định]], [[stats-distributions|phân phối]] và mô hình dự đoán, đồng thời giúp ước tính rủi ro của hệ thống nhiều thành phần.`,

    mechanism: `- **Phần bù:** \`P(không A) = 1 - P(A)\`. Câu hỏi "ít nhất một lần" gần như luôn dễ hơn khi tính qua phần bù.
- **Phép cộng:** \`P(A hoặc B) = P(A) + P(B) - P(A và B)\`. Phải trừ phần giao vì nó bị đếm hai lần.
- **Phép nhân khi độc lập:** \`P(A và B) = P(A) × P(B)\`.
- **Luật số lớn:** tần suất quan sát hội tụ về xác suất thật khi số lần thử tăng. Nó không nói kết quả ngắn hạn sẽ tự cân bằng lại.`,

    example: `Pipeline có 5 bước độc lập, mỗi bước thành công 99%. Cả pipeline thành công với xác suất \`0,99^5 ≈ 95,1%\`, tức khoảng 1 ngày trong 20 ngày có lỗi.

Nếu 5 bước cùng phụ thuộc một cụm máy, chúng hay lỗi cùng lúc nên giả định độc lập sai. Tương tự, kiểm định 20 metric ở mức 5% cho \`1 - 0,95^20 ≈ 64%\` khả năng có ít nhất một [[stats-type-errors|báo động nhầm]].`,

    prosCons: {
      pros: ['Định lượng được sự không chắc chắn, thay cho nhận định cảm tính.'],
      cons: ['Kết quả chỉ đúng khi giả định đúng, nhất là giả định độc lập.'],
    },

    whenToUse: {
      use: ['Khi ước tính rủi ro lỗi, tỷ lệ chuyển đổi, hoặc "ít nhất một lần" qua nhiều lần thử.'],
      avoid: ['Không nhân xác suất khi các sự kiện có chung nguyên nhân.'],
    },

    comparison: {
      intro: 'Hai khái niệm rất hay bị nhầm:',
      headers: ['Tiêu chí', 'Xung khắc', 'Độc lập'],
      rows: [
        ['Ý nghĩa', 'Không thể cùng xảy ra', 'Biết A không đổi xác suất của B'],
        ['`P(A và B)`', 'Bằng 0', '`P(A) × P(B)`'],
        ['Ví dụ', 'Đơn hàng vừa đã hủy vừa đã giao', 'Hai người dùng không liên quan cùng mua'],
      ],
    },

    misconceptions: [
      {
        myth: 'Hai sự kiện xung khắc thì độc lập với nhau.',
        truth: 'Ngược lại. Với xác suất dương, biết A xảy ra thì chắc chắn B không xảy ra, nên chúng phụ thuộc.',
      },
      {
        myth: 'Tung đồng xu ra sấp 5 lần liên tiếp thì lần sau dễ ra ngửa hơn.',
        truth: 'Đây là ngụy biện của người đánh bạc. Các lần tung độc lập, nên xác suất vẫn là 50%.',
      },
    ],
  },
})
