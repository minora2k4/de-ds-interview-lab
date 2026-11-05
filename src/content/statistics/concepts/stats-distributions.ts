import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-distributions',
  summary:
    'Phân phối xác suất mô tả các giá trị một biến có thể nhận và khả năng của từng giá trị. Chọn phân phối theo cơ chế sinh ra dữ liệu, rồi kiểm tra lại bằng dữ liệu thật.',
  tags: ['Phân phối', 'PMF', 'PDF', 'CDF'],
  related: ['stats-normal', 'stats-binomial', 'stats-poisson', 'stats-probability', 'eda-distribution', 'eda-skew-kurtosis', 'dq-distribution-comparison'],
  sections: {
    definition: `**Probability Distribution (Phân phối xác suất)** cho biết một biến ngẫu nhiên nhận những giá trị nào, với khả năng ra sao.

- **PMF:** biến rời rạc, cho \`P(X = x)\`.
- **PDF:** biến liên tục, xác suất là diện tích dưới đường cong.
- **CDF:** \`P(X ≤ x)\`, dùng được cho cả hai loại.`,

    origin: `Bài toán thực tế là trả lời về điều chưa xảy ra: xác suất có hơn 10 lỗi trong giờ tới là bao nhiêu? Chỉ đếm trong dữ liệu quá khứ thì không nói được về vùng chưa quan sát, và dao động mạnh khi ít dữ liệu. Phân phối nén dữ liệu thành vài tham số, đổi lại phải chấp nhận giả định.`,

    whyUse: `Đây là nền của [[stats-hypothesis|kiểm định]], [[stats-confidence-interval|khoảng tin cậy]] và mô phỏng.`,

    mechanism: `1. **Bắt đầu từ cơ chế sinh dữ liệu:** đếm hay đo, có giới hạn trên không, có độc lập không.
2. **Chọn họ phân phối,** vì cơ chế cho biết phần đuôi hoạt động ra sao, điều mà dữ liệu ít khó tiết lộ.
3. **Ước lượng tham số** từ dữ liệu.
4. **Đối chiếu bằng biểu đồ,** nhất là phần đuôi.`,

    diagram: {
      mermaid: `flowchart TD
  A["Biến cần mô hình hóa"] --> B["Đếm số lần"]
  A --> C["Đo liên tục"]
  B --> D["n lần thử, mỗi lần đạt hoặc không: Binomial"]
  B --> E["Số sự kiện trong một khoảng thời gian: Poisson"]
  C --> F["Tổng của nhiều yếu tố nhỏ: Normal"]
  C --> G["Giá trị dương, đuôi phải dài: Log-normal"]`,
      caption: 'Điểm xuất phát để chọn phân phối là cơ chế sinh ra dữ liệu, sau đó mới kiểm tra lại bằng dữ liệu thật.',
    },

    example: `Giá trị giao dịch có mean 500 nghìn đồng, std 1,5 triệu đồng. Giả định Normal cho \`z = (0 - 500) / 1.500 ≈ -0,33\`, tức khoảng 37% giao dịch có giá trị âm. Điều này vô lý, và std gấp 3 lần mean cho thấy đuôi phải rất dài. Log-normal phù hợp hơn nhiều.`,

    prosCons: {
      pros: ['Nén dữ liệu thành vài tham số, trả lời được cả vùng chưa quan sát.'],
      cons: ['Chọn sai thường sai nhất ở phần đuôi, nơi rủi ro lớn nhất.'],
    },

    whenToUse: {
      use: ['Khi cần tính xác suất, đặt ngưỡng cảnh báo hoặc mô phỏng kịch bản.'],
      avoid: ['Không mặc định mọi thứ là Normal khi chưa xem biểu đồ.'],
    },

    comparison: {
      headers: ['Phân phối', 'Loại', 'Tham số', 'Ví dụ'],
      rows: [
        ['[[stats-binomial|Binomial]]', 'Rời rạc', '`n`, `p`', 'Số người mua trong 1.000 người'],
        ['[[stats-poisson|Poisson]]', 'Rời rạc', '`λ`', 'Số lỗi mỗi giờ'],
        ['[[stats-normal|Normal]]', 'Liên tục', '`μ`, `σ`', 'Mean của mẫu lớn'],
        ['Log-normal', 'Liên tục, dương', '`μ`, `σ` của log', 'Giá trị giao dịch'],
      ],
    },

    misconceptions: [
      {
        myth: 'Giá trị PDF tại một điểm là xác suất, nên không thể lớn hơn 1.',
        truth: 'PDF là mật độ. Phân phối đều trên đoạn từ 0 đến 0,5 có mật độ bằng 2. Chỉ diện tích mới là xác suất.',
      },
      {
        myth: 'Có đủ dữ liệu thì mọi biến đều theo phân phối chuẩn.',
        truth: 'Thêm dữ liệu chỉ làm lộ rõ hình dạng thật. Thứ tiến về chuẩn là mean của mẫu.',
      },
    ],
  },
})
