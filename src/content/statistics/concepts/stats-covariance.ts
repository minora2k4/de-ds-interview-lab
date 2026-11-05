import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-covariance',
  summary:
    'Covariance đo hai biến cùng lệch khỏi mean theo một chiều đến mức nào. Dấu cho biết chiều quan hệ, còn độ lớn phụ thuộc đơn vị, nên muốn so sánh phải chuẩn hóa thành correlation.',
  tags: ['Covariance', 'Pearson', 'Var(X+Y)'],
  related: ['stats-variance-std', 'stats-correlation-causation', 'eda-correlation', 'fe-standardization'],
  sections: {
    definition: `**Covariance (Hiệp phương sai)** đo mức độ hai biến cùng biến động:

\`Cov(X, Y) = tổng (x - mean_x)(y - mean_y) / (n - 1)\`

Dương nghĩa là thường cùng lệch về một phía so với mean, âm nghĩa là ngược phía.`,

    origin: `Bài toán thực tế là tính độ biến động của một tổng. Hai sản phẩm cùng bán chạy vào mùa lễ làm tổng doanh thu dao động mạnh hơn so với khi chúng bù trừ cho nhau. Cộng thẳng phương sai là cách làm kém, vì ngầm giả định độc lập.`,

    whyUse: `Nó là nền của [[stats-correlation-causation|hệ số tương quan]], PCA và CUPED, kỹ thuật dùng dữ liệu trước thí nghiệm để giảm phương sai metric trong A/B test.`,

    mechanism: `**Vì sao nhân hai độ lệch.** Cùng dấu thì tích dương, trái dấu thì tích âm. Lấy trung bình cho biết xu hướng chung.

**Vì sao phụ thuộc đơn vị.** Đổi doanh thu từ triệu đồng sang nghìn đồng làm Cov nhân 1.000, dù quan hệ không đổi. Vì vậy phải chuẩn hóa: \`r = Cov(X, Y) / (s_x × s_y)\`.

**Cộng phương sai:** \`Var(X + Y) = Var(X) + Var(Y) + 2 × Cov(X, Y)\`. Tương quan âm làm tổng ổn định hơn, đây là cơ sở của đa dạng hóa.`,

    example: `Ngân sách quảng cáo x: 1, 2, 3, 4. Doanh thu y: 10, 20, 20, 30 (triệu đồng). Mean là 2,5 và 20.

- Tích các độ lệch: 15, 0, 0, 15, tổng 30, nên \`Cov = 30 / 3 = 10\`.
- \`s_x ≈ 1,29\`, \`s_y ≈ 8,16\`, nên \`r ≈ 0,95\`.

Đổi y sang nghìn đồng: Cov thành 10.000, r vẫn là 0,95. Và r cao cũng chưa cho biết quảng cáo tạo ra doanh thu.`,

    prosCons: {
      pros: ['Xuất hiện trực tiếp trong công thức phương sai của tổng.'],
      cons: ['Phụ thuộc đơn vị, và chỉ đo quan hệ tuyến tính.'],
    },

    whenToUse: {
      use: ['Khi tính độ biến động của tổng, làm PCA, hoặc giảm phương sai metric.'],
      avoid: ['Không dùng độ lớn của Cov để so sánh mức độ quan hệ giữa các cặp biến.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Covariance', 'Pearson correlation'],
      rows: [
        ['Đơn vị', 'Tích đơn vị của hai biến', 'Không có đơn vị'],
        ['Khoảng giá trị', 'Không giới hạn', 'Từ -1 đến 1'],
        ['So sánh giữa các cặp', 'Không được', 'Được'],
      ],
    },

    misconceptions: [
      {
        myth: 'Cov lớn nghĩa là quan hệ mạnh.',
        truth: 'Độ lớn phụ thuộc đơn vị đo. Độ mạnh phải đọc qua r.',
      },
      {
        myth: 'Cov = 0 nghĩa là hai biến độc lập.',
        truth: 'Với x = -2, -1, 0, 1, 2 và y = x², Cov = 0 nhưng y hoàn toàn phụ thuộc vào x.',
      },
    ],
  },
})
