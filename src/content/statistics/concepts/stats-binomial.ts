import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-binomial',
  summary:
    'Phân phối nhị thức mô tả số lần thành công trong n lần thử độc lập, cùng xác suất p. Mean là np, phương sai là np(1-p), nền tảng của SE tỷ lệ trong A/B test.',
  tags: ['Binomial', 'Bernoulli', 'A/B test', 'Tỷ lệ'],
  related: ['stats-distributions', 'stats-poisson', 'stats-normal', 'stats-probability', 'stats-confidence-interval', 'stats-hypothesis'],
  sections: {
    definition: `**Binomial Distribution (Phân phối nhị thức)** mô tả số lần thành công trong \`n\` lần thử, với bốn điều kiện: \`n\` cố định, mỗi lần chỉ có hai kết quả, các lần độc lập, cùng xác suất \`p\`.

\`P(X = k) = C(n, k) × p^k × (1 - p)^(n - k)\`

Một lần thử đơn lẻ là phân phối **Bernoulli**.`,

    origin: `10 người có 3 người mua, tỷ lệ thật có phải 30% không? Cách làm kém hơn là coi tỷ lệ quan sát là sự thật, không tính đến dao động do mẫu nhỏ. Jacob Bernoulli xây nền tảng cho bài toán này trong *Ars Conjectandi* (1713).`,

    whyUse: `Mọi metric tỷ lệ đều dùng nó để tính độ dao động: \`SE = sqrt(p(1 - p) / n)\` là cơ sở của [[stats-hypothesis|kiểm định]] và tính cỡ mẫu.`,

    mechanism: `**Vì sao có mean và phương sai này.** X là tổng của n biến Bernoulli độc lập, mỗi biến có mean \`p\`, phương sai \`p(1 - p)\`. Độc lập nên phương sai cộng được: \`Var(X) = np(1 - p)\`.

**Với tỷ lệ** \`X / n\`, phương sai chia cho \`n²\`, nên SE giảm theo \`sqrt(n)\`.

**Xấp xỉ chuẩn** dùng được khi \`np\` và \`n(1 - p)\` đều từ khoảng 10 trở lên. Với p nhỏ, n lớn, nó xấp xỉ [[stats-poisson|Poisson]].`,

    example: `Tỷ lệ mua 20%, xét 10 khách: mean = 2, phương sai = 1,6, \`P(X = 2) = 45 × 0,04 × 0,168 ≈ 30,2%\`, \`P(X ≥ 1) = 1 - 0,8^10 ≈ 89,3%\`.

**A/B test:** tỷ lệ 10% với n = 10.000 có SE = 0,3 điểm phần trăm. Nếu đó là lượt xem của 1.000 người, mỗi người 10 lượt với hành vi gần giống nhau, số quan sát thực gần 1.000 hơn, nên SE thật có thể lên gần 0,95.`,

    prosCons: {
      pros: ['Chỉ hai tham số, tính được cỡ mẫu trước khi thu dữ liệu.'],
      cons: ['Rất nhạy với giả định độc lập, nhất là khi đơn vị phân tích sai.'],
    },

    whenToUse: {
      use: ['Tỷ lệ theo người dùng, mỗi người được tính một lần.'],
      avoid: ['Không dùng khi tính theo lượt xem mà phân nhóm theo người dùng.', 'Không dùng khi thử đến khi thành công mới dừng.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Binomial', 'Poisson', 'Normal'],
      rows: [
        ['Dữ liệu', 'Đếm, tối đa n', 'Đếm, không giới hạn', 'Liên tục'],
        ['Tham số', '`n`, `p`', '`λ`', '`μ`, `σ`'],
        ['Phương sai so với mean', 'Nhỏ hơn', 'Bằng', 'Không ràng buộc'],
      ],
    },

    misconceptions: [
      {
        myth: 'Có số đếm thành công và tổng số thì luôn dùng được nhị thức.',
        truth: 'Cần độc lập. Lượt xem của cùng một người có tương quan, làm p-value nhỏ đi giả tạo.',
      },
      {
        myth: 'p càng gần 0,5 thì càng cần ít mẫu.',
        truth: 'Ngược lại, `p(1 - p)` lớn nhất tại 0,5. Nhưng p nhỏ vẫn cần nhiều mẫu nếu muốn phát hiện thay đổi tương đối.',
      },
    ],
  },
})
