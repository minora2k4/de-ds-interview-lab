import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-bias-variance',
  summary:
    'Sai số kỳ vọng của hồi quy tách thành Bias bình phương, Variance và Noise. Mô hình đơn giản thường bias cao, mô hình linh hoạt thường variance cao, và noise thì không giảm được.',
  tags: ['Độ khớp', 'Lý thuyết', 'First Principles'],
  related: ['eval-overfitting', 'eval-underfitting', 'eval-cross-validation', 'stats-variance-std', 'dq-sufficiency'],
  sections: {
    definition: `**Bias-Variance Tradeoff (Đánh đổi giữa độ lệch và phương sai)** là cách giải thích sai số trên dữ liệu mới bằng ba thành phần, khi hình dung mô hình được huấn luyện lại trên nhiều bộ dữ liệu khác nhau:

- **Bias (Độ lệch):** dự đoán trung bình cách giá trị đúng bao xa. Đây là sai số có hệ thống.
- **Variance (Phương sai):** dự đoán dao động bao nhiêu khi đổi bộ dữ liệu huấn luyện.
- **Noise (Nhiễu):** phần không thể giảm, vì đặc trưng hiện có không chứa đủ thông tin.`,

    origin: `Sai số Train giảm dần khi mô hình phức tạp hơn, nhưng sai số thật không như vậy. Geman, Bienenstock và Doursat phân tích điều này năm 1992 khi nghiên cứu mạng nơ-ron, chỉ ra vì sao mô hình rất linh hoạt lại có thể kém khi dữ liệu có hạn. Phép phân tách cho biết sai số đến từ đâu, thay vì chỉ cho biết tổng lớn hay nhỏ.`,

    whyUse: `Mỗi loại sai số có cách chữa khác nhau, và chữa sai thì tốn tiền vô ích:

- Thêm dữ liệu giảm variance, nhưng không giảm bias.
- Tăng độ phức tạp giảm bias, nhưng thường tăng variance.
- Noise chỉ giảm được khi có đặc trưng mới hoặc nhãn tốt hơn.`,

    mechanism: `Với sai số bình phương, tại một điểm x:

\`E[(y - ŷ)^2] = Bias^2 + Variance + Noise\`

Kỳ vọng được lấy trên nhiều bộ dữ liệu huấn luyện và trên nhiễu của y. Vì vậy một mô hình đã huấn luyện không có "bias" và "variance" đo trực tiếp được. Đây là tính chất của cả quy trình huấn luyện.

**Các nút điều chỉnh:**

- **Độ phức tạp:** cây sâu hơn hay nhiều đặc trưng hơn làm bias giảm, variance tăng.
- **Regularization:** chấp nhận thêm một ít bias để giảm nhiều variance.
- **Bagging:** lấy trung bình nhiều mô hình variance cao, nên chủ yếu giảm variance. Với n mô hình có phương sai s và tương quan r, phương sai trung bình là \`r x s + (1 - r) x s / n\`. Phần \`r x s\` không giảm khi thêm mô hình, nên Random Forest chọn ngẫu nhiên đặc trưng để giảm tương quan.
- **Boosting:** học dần từ sai số còn lại, nên chủ yếu giảm bias, nhưng có thể tăng variance nếu chạy quá lâu.

**Chẩn đoán bằng learning curve:** điểm Train thấp là dấu hiệu bias cao. Khoảng cách lớn giữa Train và Validation là dấu hiệu variance cao.

**Giới hạn:** công thức cộng gọn gàng này đúng cho sai số bình phương. Với sai số 0-1 không có dạng tương tự đơn giản. Hình chữ U cũng không phải quy luật tuyệt đối: mô hình cực lớn có thể gặp **Double Descent**, sai số thật giảm lại sau điểm khớp hoàn toàn. Điều này không phủ nhận phép phân tách, chỉ cho thấy variance không nhất thiết tăng mãi theo số tham số.`,

    diagram: {
      mermaid: `flowchart TD
  A["Đo điểm Train và Validation"] --> B["Điểm Train có thấp không?"]
  B -->|"Có"| C["Bias cao: thêm đặc trưng, tăng độ phức tạp"]
  B -->|"Không"| D["Khoảng cách với Validation có lớn không?"]
  D -->|"Có"| E["Variance cao: thêm dữ liệu, regularization, Bagging"]
  D -->|"Không"| F["Đạt mục tiêu hoặc đã gần giới hạn của nhiễu"]`,
      caption: 'Chẩn đoán trước khi sửa. Hai nhánh cần hai hướng xử lý gần như ngược nhau.',
    },

    example: `Giá trị đúng tại một điểm là 100, Noise là 25. Huấn luyện mỗi mô hình trên 5 bộ dữ liệu:

- **Mô hình đơn giản** dự đoán 80, 82, 78, 81, 79. Trung bình 80, nên Bias^2 = 400. Variance = (0 + 4 + 4 + 1 + 1) / 5 = 2. Tổng sai số là 400 + 2 + 25 = 427.
- **Mô hình linh hoạt** dự đoán 90, 110, 95, 105, 100. Trung bình 100, nên Bias^2 = 0. Variance = (100 + 100 + 25 + 25 + 0) / 5 = 50. Tổng sai số là 0 + 50 + 25 = 75.

Mô hình linh hoạt thắng dù dao động nhiều hơn. Nếu lấy trung bình 100 bản của nó với tương quan r = 0,3, phương sai còn 0,3 x 50 + 0,7 x 50 / 100 = 15,35.`,

    prosCons: {
      pros: [
        '**Cho biết nên làm gì tiếp:** thêm dữ liệu hay đổi mô hình.',
        '**Giải thích được** vì sao Bagging và Boosting hiệu quả theo những cách khác nhau.',
      ],
      cons: [
        '**Không đo trực tiếp được** trên dữ liệu thật, vì không có nhiều bộ dữ liệu độc lập và không biết hàm đúng.',
        '**Chỉ gọn gàng với sai số bình phương,** các hàm mất mát khác cần cách định nghĩa riêng.',
      ],
    },

    whenToUse: {
      use: [
        'Chẩn đoán trước khi quyết định thu thập thêm dữ liệu hay đổi mô hình.',
        'Giải thích lựa chọn regularization hoặc ensemble.',
      ],
      avoid: [
        'Không dùng hình chữ U để suy luận máy móc với mô hình rất lớn.',
        'Không gọi mọi khoảng cách Train và Validation là variance khi hai tập có thể khác phân phối.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Bias cao', 'Variance cao', 'Noise cao'],
      rows: [
        ['Biểu hiện', 'Train và Validation đều kém', 'Train tốt, Validation kém', 'Mọi mô hình đều chững ở một mức'],
        ['Thêm dữ liệu', 'Gần như không giúp', 'Giúp rõ', 'Không giúp'],
        ['Hướng xử lý', 'Mô hình linh hoạt hơn', 'Regularization, Bagging', 'Đặc trưng mới, nhãn tốt hơn'],
        ['Liên hệ', '[[eval-underfitting|Underfitting]]', '[[eval-overfitting|Overfitting]]', '[[dq-label-quality|Chất lượng nhãn]]'],
      ],
    },

    misconceptions: [
      {
        myth: 'Bias và variance luôn phải đánh đổi, giảm cái này thì tăng cái kia.',
        truth: 'Thêm dữ liệu giảm variance mà không tăng bias. Đặc trưng tốt có thể giảm bias mà không tăng variance đáng kể. Đánh đổi chỉ xảy ra khi điều chỉnh độ linh hoạt.',
      },
      {
        myth: 'Train error thấp nghĩa là cả bias và variance đều thấp.',
        truth: 'Train error thấp không cho biết về variance. Mô hình ghi nhớ dữ liệu có Train error bằng 0 nhưng variance có thể rất cao.',
      },
      {
        myth: 'Mô hình phức tạp hơn luôn có sai số thật cao hơn khi vượt một điểm nào đó.',
        truth: 'Mô hình rất lớn có thể gặp Double Descent, nên phải đo trên Validation thay vì suy luận từ số tham số.',
      },
    ],
  },
})
