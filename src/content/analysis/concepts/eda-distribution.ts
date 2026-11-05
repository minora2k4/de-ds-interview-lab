import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eda-distribution',
  summary:
    'Phân phối cho biết giá trị của một biến trải ra thế nào. Hình dạng phân phối quyết định nên tóm tắt bằng số nào, có cần tách nhóm hay biến đổi không.',
  tags: ['EDA', 'Phân phối', 'Trực quan hóa'],
  related: ['eda-overview', 'eda-skew-kurtosis', 'eda-outliers', 'stats-distributions', 'stats-central-tendency', 'dq-distribution-comparison'],
  sections: {
    definition: `**Data Distribution (Phân phối của dữ liệu)** mô tả mỗi giá trị hoặc khoảng giá trị xuất hiện thường xuyên đến đâu trong mẫu. Đây là phân phối quan sát được, khác với [[stats-distributions|phân phối xác suất]] lý thuyết dùng để mô hình hóa nó.`,

    origin: `Trung bình nén cả cột về một điểm nên mất hình dạng. Histogram và các biểu đồ EDA của Tukey giúp nhìn lại phần bị mất đó.`,

    whyUse: `Hình dạng quyết định [[stats-central-tendency|số tóm tắt]] phù hợp, cách biến đổi và ngưỡng phát hiện [[eda-outliers|ngoại lai]].`,

    mechanism: `Đọc phân phối theo ba câu hỏi:

- **Hình dạng:** đối xứng hay [[eda-skew-kurtosis|lệch]], đuôi nhẹ hay nặng.
- **Số đỉnh:** hai đỉnh thường là hai nhóm bị trộn, nên tách ra trước khi tóm tắt.
- **Điểm dị thường:** cột đứng tại 0, 999 hoặc số tròn thường là giá trị mặc định hay thói quen nhập liệu, không phải hành vi thật.

Để so sánh train với test, xem [[dq-distribution-comparison]].`,

    example: `180.000 đơn giao hàng có thời gian trung bình 2,85 ngày. Histogram cho thấy hai đỉnh: 70% đơn nội tỉnh quanh 1,5 ngày, 30% đơn liên tỉnh quanh 6 ngày. Rất ít đơn nằm quanh 2,85 ngày, nên cam kết theo số trung bình sai với cả hai nhóm. Quyết định: đặt cam kết theo phân vị 90 của từng nhóm.`,

    prosCons: {
      pros: ['Nhìn nhanh ra nhóm bị trộn, giá trị mặc định và đuôi dài.'],
      cons: ['Mỗi biểu đồ che một thứ, và khó xem hết khi có hàng nghìn cột.'],
    },

    whenToUse: {
      use: ['Xem cho từng biến quan trọng, tách theo nhãn hoặc theo thời gian.'],
      avoid: ['Không kết luận từ một histogram duy nhất, vì độ rộng khoảng có thể tạo hoặc che mất đỉnh.'],
    },

    comparison: {
      headers: ['Biểu đồ', 'Cho thấy rõ', 'Điểm yếu'],
      rows: [
        ['Histogram', 'Hình dạng, số đỉnh', 'Phụ thuộc độ rộng khoảng'],
        ['Boxplot', 'Phân vị, so sánh nhiều nhóm', 'Che mất hai đỉnh'],
        ['ECDF', 'Phân vị chính xác, không chia khoảng', 'Khó đọc hình dạng'],
        ['Q-Q plot', 'Lệch so với phân phối lý thuyết, nhất là ở đuôi', 'Cần chọn phân phối để so'],
      ],
    },

    misconceptions: [
      {
        myth: 'Đặc trưng phải có phân phối chuẩn thì mô hình mới dùng được.',
        truth: 'Hồi quy tuyến tính không đòi hỏi điều này. Giả định chuẩn áp dụng cho phần dư, và chủ yếu liên quan đến suy luận khi mẫu nhỏ.',
      },
      {
        myth: 'Kiểm định chuẩn bị bác bỏ thì phải biến đổi dữ liệu.',
        truth: 'Với hàng triệu dòng, kiểm định bác bỏ cả sai lệch rất nhỏ. Q-Q plot và tác động lên quyết định quan trọng hơn p-value.',
      },
    ],
  },
})
