import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-normal',
  summary:
    'Phân phối chuẩn có dạng chuông đối xứng, xác định bởi mean và std. Nó quan trọng vì CLT: mean của mẫu đủ lớn xấp xỉ chuẩn, dù dữ liệu gốc không chuẩn.',
  tags: ['Normal', 'CLT', 'Z-score', 'First Principles'],
  related: ['stats-distributions', 'stats-binomial', 'stats-variance-std', 'stats-confidence-interval', 'stats-hypothesis', 'fe-standardization', 'eda-outliers'],
  sections: {
    definition: `**Normal Distribution (Phân phối chuẩn)** là phân phối liên tục, đối xứng, xác định bởi mean \`μ\` và std \`σ\`. Khoảng 68%, 95% và 99,7% giá trị nằm trong 1, 2 và 3 std quanh mean.

**Z-score** \`z = (x - μ) / σ\` cho biết một giá trị cách mean bao nhiêu std.`,

    origin: `Bài toán thực tế là tính xác suất cho tổng của rất nhiều yếu tố nhỏ. Liệt kê mọi tổ hợp gần như không khả thi khi n lớn. De Moivre tìm ra đường cong này khi xấp xỉ nhị thức, Gauss dùng cho sai số đo, Laplace giải thích vì sao nó xuất hiện khắp nơi.`,

    whyUse: `Hầu hết A/B test dựa vào nó: hiệu giữa hai mean xấp xỉ chuẩn khi mẫu đủ lớn, nên tính được p-value mà không cần biết hình dạng dữ liệu gốc.`,

    mechanism: `**CLT (Central Limit Theorem, Định lý giới hạn trung tâm):** với quan sát độc lập, cùng phân phối, phương sai hữu hạn, mean mẫu xấp xỉ chuẩn khi n đủ lớn, với \`SE = σ / sqrt(n)\`.

**Vì sao như vậy:** các giá trị lệch về hai phía bù trừ nhau khi lấy trung bình, và tổ hợp vừa phải nhiều hơn hẳn tổ hợp cực đoan.

**Vì sao có số 1,96:** 95% diện tích nằm trong ±1,96, mỗi đuôi chiếm 2,5%.`,

    example: `Số đơn mỗi ngày có mean 500, std 100, gần chuẩn. Ngày có 700 đơn cho \`z = 2\`, xác suất vượt mức này khoảng 2,3%.

Giá trị đơn hàng thì lệch phải, std 100 nghìn đồng. Với 400 đơn, \`SE = 100 / sqrt(400) = 5\`, nên mean mẫu dao động khoảng ±9,8 nghìn đồng. Dữ liệu lệch, nhưng mean mẫu vẫn xấp xỉ chuẩn.`,

    prosCons: {
      pros: ['Chỉ cần hai tham số, và nhờ CLT áp dụng được cho mean của nhiều loại dữ liệu.'],
      cons: ['Đánh giá thấp xác suất ở đuôi với dữ liệu đuôi dày như doanh thu.'],
    },

    whenToUse: {
      use: ['Với mean hoặc tỷ lệ của mẫu lớn, các quan sát độc lập.'],
      avoid: ['Không dùng quy tắc 3 std để bắt ngoại lai trên dữ liệu lệch mạnh.'],
    },

    comparison: {
      headers: ['Phân phối', 'Hình dạng', 'Dùng khi'],
      rows: [
        ['Normal', 'Đối xứng, đuôi mỏng', 'Biết `σ` hoặc mẫu lớn'],
        ['Student t', 'Đối xứng, đuôi dày hơn', 'Mẫu nhỏ, phải ước lượng `σ`'],
        ['Log-normal', 'Lệch phải, chỉ có giá trị dương', 'Giá trị giao dịch, độ trễ'],
      ],
    },

    misconceptions: [
      {
        myth: 'CLT làm dữ liệu trở nên chuẩn khi có nhiều dữ liệu.',
        truth: 'Dữ liệu giữ nguyên hình dạng. Chỉ phân phối của mean mẫu mới tiến về chuẩn.',
      },
      {
        myth: 'Cứ n ≥ 30 là CLT áp dụng được.',
        truth: 'Đây chỉ là mẹo cho dữ liệu khá đối xứng. Doanh thu mỗi người có thể cần hàng nghìn quan sát.',
      },
    ],
  },
})
