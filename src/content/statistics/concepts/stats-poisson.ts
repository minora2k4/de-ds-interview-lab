import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-poisson',
  summary:
    'Phân phối Poisson mô tả số sự kiện trong một khoảng cố định, khi sự kiện độc lập với tốc độ không đổi λ. Đặc trưng của nó là mean bằng phương sai, bằng λ.',
  tags: ['Poisson', 'Đếm sự kiện', 'Overdispersion', 'Cảnh báo'],
  related: ['stats-distributions', 'stats-binomial', 'stats-normal', 'stats-variance-std', 'arch-monitoring-logging'],
  sections: {
    definition: `**Poisson Distribution (Phân phối Poisson)** mô tả số sự kiện trong một khoảng cố định, với tốc độ trung bình \`λ\`:

\`P(X = k) = e^(-λ) × λ^k / k!\`

Mean và phương sai đều bằng \`λ\`.`,

    origin: `Bài toán thực tế là đếm sự kiện không biết trước số lần thử: số lỗi mỗi giờ, số đơn mỗi phút. Nhị thức cần n và p, trong khi ở đây chỉ đo được tốc độ. Cách làm kém hơn là đặt ngưỡng cảnh báo theo cảm giác, không tính đến dao động tự nhiên. Poisson công bố dạng này năm 1837, Bortkiewicz làm nó nổi tiếng năm 1898 với dữ liệu lính Phổ chết do ngựa đá.`,

    whyUse: `Cho biết một số đếm là dao động bình thường hay bất thường, nên hữu ích khi đặt ngưỡng cảnh báo.`,

    mechanism: `**Vì sao ra công thức này.** Chia khoảng thời gian thành n đoạn rất nhỏ, mỗi đoạn có xác suất sự kiện \`λ / n\`, độc lập nhau. Đó là một [[stats-binomial|nhị thức]], và giới hạn khi n tiến ra vô cùng là Poisson.

**Tính theo khoảng:** 4 lỗi mỗi giờ tương đương 2 lỗi mỗi 30 phút.

**Kiểm tra giả định:** phương sai lớn hơn mean nhiều là **overdispersion**, thường do sự kiện đến theo cụm. Khi đó nên dùng Negative Binomial.`,

    example: `API có trung bình 4 lỗi mỗi giờ:

- \`P(X = 0) = e^(-4) ≈ 1,8%\`.
- \`P(X ≤ 1) = 5 × e^(-4) ≈ 9,2%\`.
- \`P(X ≥ 10) ≈ 0,8%\`, một ngưỡng cảnh báo hợp lý.

Nếu dữ liệu có mean 4 nhưng phương sai 20, lỗi đang đến theo cụm, nên ngưỡng trên sẽ báo động quá nhiều.

**Xấp xỉ nhị thức:** n = 1.000, p = 0,002 nên \`λ = 2\`. Poisson cho \`P(X = 0) ≈ 13,53%\`, nhị thức cho 13,51%.`,

    prosCons: {
      pros: ['Chỉ một tham số, không cần biết tổng số lần thử.'],
      cons: ['Mean bằng phương sai là ràng buộc rất chặt, dữ liệu thực thường vi phạm.'],
    },

    whenToUse: {
      use: ['Đếm sự kiện độc lập trong khoảng ngắn, nơi tốc độ gần như không đổi.'],
      avoid: ['Không dùng khi sự kiện kéo theo nhau, như một lỗi gây hàng loạt lần thử lại.', 'Không dùng một `λ` chung cho cả ngày khi lưu lượng dao động mạnh.'],
    },

    comparison: {
      headers: ['Phân phối', 'Phương sai so với mean', 'Dùng khi'],
      rows: [
        ['Binomial', 'Nhỏ hơn', 'Có số lần thử cố định'],
        ['Poisson', 'Bằng', 'Sự kiện độc lập, tốc độ đều'],
        ['Negative Binomial', 'Lớn hơn', 'Sự kiện theo cụm'],
      ],
    },

    misconceptions: [
      {
        myth: 'Poisson chỉ dùng cho sự kiện hiếm.',
        truth: 'Quan trọng là độc lập và tốc độ đều. `λ` có thể lớn, khi đó Poisson gần giống phân phối chuẩn.',
      },
      {
        myth: 'Mọi dữ liệu đếm đều theo Poisson.',
        truth: 'Lưu lượng web thường theo cụm và theo chu kỳ trong ngày, nên phương sai lớn hơn mean nhiều.',
      },
    ],
  },
})
