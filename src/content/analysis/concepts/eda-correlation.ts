import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eda-correlation',
  summary:
    'Phân tích tương quan đo mức hai biến thay đổi cùng nhau. Tương quan bằng 0 không có nghĩa là độc lập, và tương quan cao không có nghĩa là nhân quả.',
  tags: ['EDA', 'Tương quan'],
  related: ['eda-overview', 'stats-correlation-causation', 'stats-covariance', 'fe-selection', 'eda-leakage', 'eda-outliers'],
  sections: {
    definition: `**Correlation Analysis (Phân tích tương quan)** đo mức hai biến thay đổi cùng nhau. **Pearson** đo quan hệ tuyến tính. **Spearman** đo quan hệ đơn điệu, tức một biến tăng thì biến kia luôn tăng hoặc luôn giảm.`,

    origin: `[[stats-covariance|Covariance]] phụ thuộc đơn vị nên khó so sánh. Pearson chia cho tích hai độ lệch chuẩn để đưa về khoảng -1 đến 1. Spearman chuyển sang hạng để bớt nhạy với giá trị cực đoan.`,

    whyUse: `Tương quan giúp tìm đặc trưng liên quan đến nhãn. Cột có tương quan gần 1 với nhãn cần được kiểm tra [[eda-leakage|rò rỉ]].`,

    mechanism: `Pearson tính trên độ lệch so với trung bình, nên một điểm xa tâm có thể tạo ra hoặc xóa đi tương quan. Spearman là Pearson tính trên hạng.

Các bẫy khi đọc kết quả:

- **Tương quan 0 chưa phải độc lập:** với \`y = x²\` trên khoảng đối xứng, r bằng 0 dù y phụ thuộc hoàn toàn vào x.
- **Xu hướng chung:** hai chuỗi cùng tăng theo thời gian có r cao mà không liên quan gì nhau.
- **Mẫu lớn:** với 1 triệu dòng, r = 0,02 vẫn có p-value rất nhỏ nhưng gần như vô dụng.

[[stats-correlation-causation|Tương quan không phải nhân quả]]. Xét từng cặp cũng có thể bỏ sót đặc trưng chỉ có ích khi đi cùng nhau, xem [[fe-selection]].`,

    example: `Với 5.000 cửa hàng, ngân sách quảng cáo và doanh thu có Pearson 0,31 nhưng Spearman 0,82. Biểu đồ cho thấy doanh thu tăng rồi bão hòa. Kết luận "quảng cáo ít tác dụng" là sai: quan hệ vẫn mạnh, chỉ là không tuyến tính.`,

    prosCons: {
      pros: ['Nhanh, không có đơn vị, so sánh được nhiều cặp.'],
      cons: ['Chỉ thấy quan hệ từng cặp theo dạng đã giả định.'],
    },

    whenToUse: {
      use: ['Quét nhanh quan hệ với nhãn, rồi vẽ biểu đồ các cặp đáng chú ý.'],
      avoid: ['Không dùng Pearson với chuỗi thời gian có xu hướng mà chưa xử lý xu hướng.'],
    },

    comparison: {
      headers: ['Thước đo', 'Dùng cho', 'Đo được'],
      rows: [
        ['Pearson', 'Hai biến số', 'Quan hệ tuyến tính'],
        ['Spearman', 'Biến số hoặc thứ bậc', 'Quan hệ đơn điệu'],
        ['Cramér\'s V', 'Hai biến phân loại', 'Mức liên kết, không có hướng'],
        ['Mutual Information', 'Mọi loại biến', 'Phụ thuộc nói chung, kể cả phi tuyến'],
      ],
    },

    misconceptions: [
      {
        myth: 'Spearman luôn tốt hơn Pearson.',
        truth: 'Hai số trả lời hai câu hỏi khác nhau. Spearman bỏ qua khoảng cách về độ lớn, còn Pearson giữ lại.',
      },
      {
        myth: 'Hai đặc trưng tương quan cao thì luôn phải bỏ một cái.',
        truth: 'Điều này chủ yếu quan trọng khi cần diễn giải hệ số.',
      },
    ],
  },
})
