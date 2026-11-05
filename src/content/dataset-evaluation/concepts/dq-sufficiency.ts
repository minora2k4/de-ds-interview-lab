import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-sufficiency',
  summary:
    'Biết đã đủ dữ liệu chưa bằng Learning Curve: nếu thêm dữ liệu không còn cải thiện thì thu thêm cùng loại ít có ích. Baseline Model cho biết dữ liệu có tín hiệu thật không, và số lượng cần xét là số mẫu độc lập của lớp hiếm.',
  tags: ['Learning Curve', 'Baseline', 'Cỡ mẫu'],
  related: ['dq-overview', 'dq-label-quality', 'eval-overfitting', 'eval-underfitting', 'eda-imbalanced', 'fe-iv'],
  sections: {
    definition: `**Data Sufficiency (Tính đủ của dữ liệu)** hỏi dữ liệu có **đủ tín hiệu và đủ số lượng** cho bài toán không.

**Learning Curve (Đường học)** là đồ thị kết quả mô hình theo số mẫu huấn luyện. **Baseline Model (Mô hình cơ sở)** là mô hình rất đơn giản, dùng làm mốc để so sánh.`,

    origin: `Không có công thức chung để tính đủ bao nhiêu dòng, vì nó tùy vào độ khó bài toán, độ nhiễu và số đặc trưng. Các quy tắc ngón tay cái dễ gây hiểu lầm, nên người ta chuyển sang **đo bằng thực nghiệm**.`,

    whyUse: `Thu thêm và gán nhãn dữ liệu rất tốn kém. Đo trước giúp tránh trả tiền cho thứ không cải thiện gì, và giúp phát hiện dữ liệu không có tín hiệu trước khi đầu tư vào mô hình phức tạp.`,

    mechanism: `**Baseline trước:** so với dự đoán lớp phổ biến nhất, rồi một mô hình đơn giản. Nếu mô hình đơn giản không hơn dự đoán lớp phổ biến, có thể dữ liệu không có tín hiệu. Có thể kiểm tra thêm bằng cách **xáo trộn nhãn**: kết quả phải rơi về mức ngẫu nhiên, nếu không thì quy trình đánh giá đang có lỗi. [[fe-iv|Information Value]] cũng đo được tín hiệu từng đặc trưng.

**Learning Curve:** huấn luyện trên 10%, 20%, 50%, 100% dữ liệu, rồi xem kết quả trên một tập đánh giá cố định:

- **Đường còn đi lên:** thêm dữ liệu có khả năng giúp ích.
- **Đường đã phẳng, gần với kết quả train:** thêm dữ liệu ít tác dụng. Cần đặc trưng tốt hơn hoặc nhãn tốt hơn.
- **Đường đã phẳng, cách xa kết quả train:** cần giảm [[eval-overfitting|overfitting]] hoặc sửa nhãn nhiễu.

**Đếm đúng cái cần đếm:** 1 triệu dòng với 300 ca dương tính nghĩa là chỉ có 300 ca để học lớp đó. Một khách hàng có 1.000 dòng cũng không phải 1.000 mẫu độc lập. Hãy đếm theo lớp hiếm và theo từng nhóm con quan trọng.`,

    example: `Đội phân tích định thu thêm 2 triệu đơn với giá 40.000 USD. Learning Curve cho thấy AUC đạt 0,78 tại 400.000 đơn, 0,79 tại 800.000 đơn, và vẫn 0,79 tại 1,6 triệu đơn. Đường đã phẳng, nên họ dùng ngân sách để thêm đặc trưng hành vi và đạt 0,85.`,

    prosCons: {
      pros: ['Trả lời trực tiếp câu hỏi có nên thu thêm dữ liệu không.', 'Baseline chi phí thấp, phát hiện sớm dữ liệu không có tín hiệu.'],
      cons: ['Kết quả phụ thuộc vào loại mô hình đang dùng.', 'Không phát hiện được dữ liệu lệch, vì tập đánh giá lệch cùng cách.'],
    },

    whenToUse: {
      use: ['Trước khi mua hoặc gán nhãn thêm dữ liệu.', 'Trước khi đầu tư vào mô hình phức tạp.'],
      avoid: ['Không tin quy tắc kiểu "mỗi đặc trưng cần 10 dòng" cho mọi bài toán.', 'Không đếm tổng số dòng khi lớp cần học rất hiếm.'],
    },

    comparison: {
      headers: ['Dấu hiệu', 'Ý nghĩa', 'Nên làm'],
      rows: [
        ['Baseline không hơn dự đoán lớp phổ biến', 'Có thể thiếu tín hiệu', 'Xem lại đặc trưng và nhãn'],
        ['Đường đánh giá còn đi lên', 'Thiếu dữ liệu', 'Thu thêm dữ liệu'],
        ['Đường đã phẳng', 'Thêm dữ liệu ít giá trị', 'Sửa đặc trưng hoặc nhãn'],
      ],
    },

    misconceptions: [
      { myth: 'Mô hình chưa tốt thì cần thêm dữ liệu.', truth: 'Nếu Learning Curve đã phẳng, thêm dữ liệu sẽ không giúp gì. Vấn đề có thể nằm ở đặc trưng hoặc nhãn.' },
      { myth: 'Có hàng triệu dòng là đủ.', truth: 'Thứ quan trọng là số mẫu độc lập của lớp và nhóm cần học, có thể chỉ vài trăm.' },
    ],
  },
})
