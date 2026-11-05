import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-variance-std',
  summary:
    'Variance là trung bình bình phương độ lệch so với mean, standard deviation là căn bậc hai của nó, cùng đơn vị với dữ liệu. Cả hai đo độ phân tán và đều nhạy với ngoại lai.',
  tags: ['Variance', 'Standard Deviation', 'Bessel', 'Standard Error'],
  related: ['stats-central-tendency', 'stats-covariance', 'stats-normal', 'stats-confidence-interval', 'fe-standardization', 'eda-outliers'],
  sections: {
    definition: `**Variance (Phương sai)** của mẫu: \`s² = tổng (x - mean)² / (n - 1)\`.

**Standard Deviation (Độ lệch chuẩn):** \`s = sqrt(s²)\`, cùng đơn vị với dữ liệu nên dễ diễn giải hơn.`,

    origin: `Hai cửa hàng cùng trung bình 140 đơn mỗi ngày, nhưng một nơi ổn định, một nơi lúc 20 lúc 400. Mean không phân biệt được, trong khi kế hoạch tồn kho lại phụ thuộc vào điều này.

Cộng thẳng các độ lệch luôn bằng 0. Trị tuyệt đối khắc phục được, nhưng bình phương có tính chất rất có lợi: phương sai của tổng các biến độc lập bằng tổng các phương sai.`,

    whyUse: `Độ phân tán quyết định độ chính xác của ước lượng. \`SE = s / sqrt(n)\` là nền của [[stats-confidence-interval|khoảng tin cậy]] và cỡ mẫu A/B test.`,

    mechanism: `**Vì sao chia cho n - 1.** Mean mẫu tính từ chính dữ liệu đó, nên dữ liệu nằm gần nó hơn so với mean thật, làm tổng bình phương bị thấp. Chia cho \`n - 1\` (hiệu chỉnh Bessel) bù lại. Cách nhìn khác: các độ lệch có tổng bằng 0, nên chỉ \`n - 1\` độ lệch là tự do.

**Cộng phương sai.** \`Var(X + Y) = Var(X) + Var(Y) + 2 × Cov(X, Y)\`. Khi độc lập, [[stats-covariance|Cov]] bằng 0.

**Std khác SE.** Std mô tả độ phân tán của từng quan sát và không giảm khi thêm dữ liệu. SE mô tả độ dao động của mean ước lượng và giảm theo \`sqrt(n)\`.`,

    example: `Số đơn trong 5 ngày: 100, 120, 130, 150, 200. Mean = 140.

- Bình phương độ lệch: 1.600, 400, 100, 100, 3.600, tổng 5.800.
- \`s² = 5.800 / 4 = 1.450\`, suy ra \`s ≈ 38,1\` đơn.

Riêng ngày 200 đơn đóng góp 62% tổng, cho thấy bình phương khuếch đại giá trị xa mean.`,

    prosCons: {
      pros: ['Có tính chất đại số đẹp, là nền của suy luận thống kê.'],
      cons: ['Nhạy với ngoại lai, kém ý nghĩa với đuôi rất dài.'],
    },

    whenToUse: {
      use: ['Dữ liệu gần đối xứng, hoặc khi tính SE và cỡ mẫu.'],
      avoid: ['Không dùng std làm thước đo duy nhất cho dữ liệu lệch mạnh, hãy thêm IQR hoặc MAD.'],
    },

    comparison: {
      headers: ['Thước đo', 'Đơn vị', 'Chịu ngoại lai'],
      rows: [
        ['Variance', 'Bình phương đơn vị gốc', 'Kém'],
        ['Standard Deviation', 'Như dữ liệu', 'Kém'],
        ['IQR (p75 - p25)', 'Như dữ liệu', 'Tốt'],
        ['MAD (trung vị độ lệch tuyệt đối)', 'Như dữ liệu', 'Rất tốt'],
      ],
    },

    misconceptions: [
      {
        myth: 'Có nhiều dữ liệu hơn thì std sẽ giảm.',
        truth: 'Std chỉ ổn định dần quanh giá trị thật. SE mới giảm theo `sqrt(n)`.',
      },
      {
        myth: 'Chia cho n - 1 làm cả variance và std đều không thiên lệch.',
        truth: 'Chỉ `s²` không thiên lệch. Phép căn là phi tuyến nên `s` vẫn hơi thấp hơn std thật.',
      },
    ],
  },
})
