import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-underfitting',
  summary:
    'Underfitting là khi mô hình quá đơn giản để học được quy luật, nên điểm thấp trên cả Train lẫn Validation. Thêm dữ liệu thường không giúp được.',
  tags: ['Độ khớp', 'Bias'],
  related: ['eval-overfitting', 'eval-bias-variance', 'eval-train-val-test', 'fe-extraction'],
  sections: {
    definition: `**Underfitting (Chưa khớp)** là khi mô hình không đủ khả năng biểu diễn quy luật trong dữ liệu, nên dự đoán kém ngay cả trên dữ liệu đã học.`,

    origin: `Khi nói về chất lượng mô hình, người ta thường chỉ lo overfit và ưu tiên mô hình đơn giản. Underfitting là vế còn lại: quá đơn giản hoặc regularization quá mạnh cũng gây sai số, và đây là phần bias trong [[eval-bias-variance]].`,

    whyUse: `Phân biệt underfit với overfit giúp tránh đi sai hướng. Với underfit, thu thập thêm dữ liệu chỉ tốn tiền mà điểm số gần như không đổi.`,

    mechanism: `Mô hình bị giới hạn bởi dạng hàm của nó. Đường thẳng không thể khớp quan hệ phi tuyến dù có bao nhiêu dữ liệu, nên sai số còn lại là có hệ thống.

**Dấu hiệu:** điểm Train và Validation đều thấp và gần nhau. Trên learning curve, hai đường sớm đi ngang ở mức kém. Muốn biết thế nào là thấp, cần so với một mốc: mô hình cơ sở, hoặc giới hạn do nhiễu của dữ liệu.

**Cách xử lý:** thêm đặc trưng có thông tin, dùng mô hình linh hoạt hơn, giảm regularization, huấn luyện đủ lâu.`,

    example: `Dự báo giá nhà bằng hồi quy tuyến tính có RMSE 42 triệu trên Train, 43 triệu trên Validation. Tăng gấp đôi dữ liệu, RMSE vẫn gần như vậy. Thêm đặc trưng tương tác và đổi sang Gradient Boosting cho RMSE 20 triệu trên Train, 24 triệu trên Validation.`,

    prosCons: {
      pros: ['Dễ phát hiện vì điểm Train đã thấp.', 'Mô hình đơn giản dễ giải thích và ổn định.'],
      cons: ['Bỏ sót quy luật có thật, và thêm dữ liệu không bù được.'],
    },

    whenToUse: {
      use: ['Nghĩ đến underfit khi điểm Train thấp hơn mức nghiệp vụ cần hoặc thấp hơn mô hình cơ sở.'],
      avoid: ['Không kết luận underfit khi nhãn có nhiều nhiễu. Khi đó có thể mô hình đã gần giới hạn của dữ liệu.'],
    },

    comparison: {
      headers: ['Hành động', 'Với Underfitting', 'Với Overfitting'],
      rows: [
        ['Thêm dữ liệu', 'Gần như không giúp', 'Thường giúp'],
        ['Thêm độ phức tạp', 'Giúp', 'Làm nặng thêm'],
        ['Tăng regularization', 'Làm nặng thêm', 'Giúp'],
        ['Thêm đặc trưng có thông tin', 'Giúp', 'Tùy, cần kiểm tra'],
      ],
    },

    misconceptions: [
      {
        myth: 'Train và Validation gần nhau nghĩa là mô hình tốt.',
        truth: 'Khoảng cách nhỏ chỉ cho biết phương sai thấp. Nếu cả hai đều thấp thì mô hình đang underfit.',
      },
      {
        myth: 'Mô hình chưa tốt thì cứ thu thập thêm dữ liệu.',
        truth: 'Thêm dòng không tăng khả năng biểu diễn. Hãy nhìn learning curve trước khi bỏ tiền thu thập.',
      },
    ],
  },
})
