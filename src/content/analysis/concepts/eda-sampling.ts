import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eda-sampling',
  summary:
    'Lấy mẫu là chọn một phần để suy ra toàn bộ. Stratified Sampling giảm sai số ngẫu nhiên, nhưng phân tầng và cỡ mẫu lớn đều không sửa được sai lệch khi lấy mẫu.',
  tags: ['Lấy mẫu', 'Sai lệch', 'Thống kê'],
  related: ['dq-representativeness', 'dq-sampling', 'eval-train-val-test', 'eval-cross-validation', 'eda-imbalanced', 'stats-confidence-interval'],
  sections: {
    definition: `**Sampling (Lấy mẫu)** là chọn một phần của tổng thể để suy ra tính chất của toàn bộ. **Stratified Sampling (Lấy mẫu phân tầng)** chia tổng thể thành các tầng theo một biến đã biết, rồi lấy mẫu riêng trong từng tầng.`,

    origin: `Mẫu ngẫu nhiên đơn giản có thể thiếu nhóm nhỏ do tình cờ. Neyman (1934) đặt nền móng cho việc phân bổ mẫu giữa các tầng để giảm sai số.`,

    whyUse: `Phân tầng bảo đảm nhóm hiếm có mặt, nên được dùng khi tách [[eval-train-val-test|train, test]] với dữ liệu [[eda-imbalanced|mất cân bằng]].`,

    mechanism: `Phân tầng giảm phương sai vì khác biệt giữa các tầng không còn tính vào sai số. **Phân bổ theo tỷ lệ** giữ nguyên tỷ trọng. **Neyman Allocation** lấy nhiều hơn ở tầng lớn và biến động mạnh. Lấy khác tỷ lệ thì phải gán trọng số ngược với xác suất chọn khi ước lượng.

Các sai lệch khi lấy mẫu, chi tiết ở [[dq-representativeness]]:

- **Undercoverage (Khung mẫu thiếu):** một phần tổng thể không thể vào mẫu, như chỉ khảo sát khách dùng app.
- **Non-response (Không phản hồi):** người không trả lời khác người trả lời.
- **Self-selection (Tự chọn):** người tự tham gia có động cơ riêng.
- **Survivorship (Sống sót):** chỉ thấy đối tượng còn lại, như bỏ qua khách đã rời đi.

Tăng cỡ mẫu không làm giảm các sai lệch này. Phân tầng cũng không sửa được, vì nó chỉ làm việc trong khung đã có.`,

    example: `1 triệu khách có 5% VIP, cần ước lượng chi tiêu trung bình với 2.000 mẫu. Mẫu ngẫu nhiên có khoảng 100 VIP. Phân tầng lấy 800 VIP và 1.200 khách thường, vì VIP biến động mạnh. VIP chiếm 40% mẫu thay vì 5%, nên phải gán trọng số 50.000 / 800 = 62,5 và 950.000 / 1.200 ≈ 792.`,

    prosCons: {
      pros: ['Sai số nhỏ hơn, cùng chi phí.'],
      cons: ['Cần biết biến phân tầng từ trước.'],
    },

    whenToUse: {
      use: ['Khi các nhóm khác nhau hoặc có nhóm hiếm.'],
      avoid: ['Không dùng phân tầng theo nhãn thay cho tách theo thời gian hay theo nhóm.'],
    },

    comparison: {
      headers: ['Cách lấy mẫu', 'Phù hợp khi', 'Đánh đổi'],
      rows: [
        ['Ngẫu nhiên đơn giản', 'Có danh sách đầy đủ', 'Nhóm nhỏ có thể thiếu'],
        ['Phân tầng', 'Các nhóm khác nhau rõ', 'Cần trọng số nếu lệch tỷ lệ'],
        ['Theo cụm', 'Lấy từng cá thể quá tốn kém', 'Phương sai cao hơn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Mẫu càng lớn càng đại diện.',
        truth: 'Năm 1936, Literary Digest nhận khoảng 2,4 triệu phiếu nhưng vẫn dự đoán sai người thắng cử, vì khung mẫu và nhóm phản hồi đều lệch.',
      },
    ],
  },
})
