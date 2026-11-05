import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-profiling',
  summary:
    'Data Profiling là việc tính thống kê mô tả dữ liệu để biết dữ liệu thực sự trông thế nào, khác với điều tài liệu nói. Kết quả là đầu vào để viết luật kiểm tra, và dùng làm mốc so sánh về sau.',
  tags: ['Profiling', 'Khám phá', 'Metadata'],
  related: ['dq-dimensions', 'dq-metrics', 'dq-tabular', 'dq-tools', 'eda-overview', 'eda-distribution'],
  sections: {
    definition: `**Data Profiling (Lập hồ sơ dữ liệu)** là việc tính các thống kê mô tả từng cột, quan hệ giữa các cột và giữa các bảng, để biết **dữ liệu thực sự trông thế nào** thay vì tin vào tài liệu.`,

    origin: `Tài liệu và schema thường lỗi thời: cột kiểu chuỗi có thể chứa số, cột "bắt buộc" có thể có 30% rỗng. Viết tay từng truy vấn thì tốn công và dễ bỏ sót, nên các công cụ tự sinh báo cáo cho toàn bộ cột, và Deequ còn gợi ý luật từ kết quả này.`,

    whyUse: `Không có profile thì không biết nên kiểm tra gì và ngưỡng nào là hợp lý. Profile đầu tiên cũng trở thành **mốc chuẩn (baseline)**: các lần sau chỉ cần so sánh để phát hiện thay đổi.`,

    mechanism: `Profiling đi từ rẻ đến đắt, vì càng về sau số phép so sánh càng tăng:

1. **Một cột:** số null, số giá trị khác nhau, min, max, độ dài, phân vị, top giá trị, và mẫu định dạng như \`DDD-DDDD\`. Tốn một lượt quét.
2. **Nhiều cột:** tương quan, phụ thuộc hàm như \`zip_code\` quyết định \`city\`. Số tổ hợp tăng nhanh theo số cột, nên chỉ chọn cặp có ý nghĩa.
3. **Nhiều bảng:** khóa ứng viên và tỷ lệ \`orders.customer_id\` nằm trong \`customers\`, gợi ý ràng buộc tham chiếu.

Khác với [[eda-overview|EDA]] đi tìm hiểu quan hệ để phân tích, profiling tập trung vào cấu trúc và độ tin cậy, và có thể chạy tự động. Với bảng lớn, dùng [[dq-approximate|thuật toán xấp xỉ]] thay vì đếm chính xác.`,

    example: `Profile bảng \`customers\` 12 triệu dòng cho thấy: \`phone\` có 3 mẫu định dạng khác nhau; \`country\` có 214 giá trị, trong đó \`VN\`, \`Vietnam\` và \`VIỆT NAM\` là một; \`birth_date\` có 41.000 dòng là \`1900-01-01\`, thực chất là giá trị thiếu đội lốt. Không có kiểm tra null nào phát hiện được điều cuối cùng.`,

    prosCons: {
      pros: ['Tìm được lỗi chưa từng nghĩ đến để viết luật.', 'Tạo mốc so sánh cho các lần chạy sau.'],
      cons: ['Chỉ mô tả, không tự nói giá trị đúng hay sai.', 'Chạy đầy đủ trên bảng rất rộng và rất lớn thì tốn kém.'],
    },

    whenToUse: {
      use: ['Khi nhận một nguồn dữ liệu mới.', 'Trước khi viết luật kiểm tra hoặc thiết kế mô hình dữ liệu.'],
      avoid: ['Không chạy profile đầy đủ mỗi giờ trên bảng lớn: hãy theo dõi một số chỉ số đã chọn.', 'Không biến mọi đặc điểm của profile thành luật cứng, vì dễ báo động giả.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Profiling', 'Validation', 'EDA'],
      rows: [
        ['Câu hỏi', 'Dữ liệu trông thế nào?', 'Có đúng luật không?', 'Dữ liệu cho biết gì?'],
        ['Kết quả', 'Thống kê mô tả', 'Đạt hoặc không đạt', 'Hiểu biết, giả thuyết'],
      ],
      note: 'Luật kiểm tra được trình bày ở [[etl-validation]].',
    },

    misconceptions: [
      { myth: 'Profiling và validation là một.', truth: 'Profiling mô tả mà không phán xét. Validation so với luật. Profile là đầu vào để viết luật.' },
      { myth: 'Profile trên mẫu nhỏ là đủ.', truth: 'Mẫu nhỏ có thể bỏ sót giá trị hiếm, mà giá trị hiếm thường là lỗi, xem [[dq-sampling]].' },
    ],
  },
})
