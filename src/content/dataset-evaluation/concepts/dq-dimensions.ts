import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-dimensions',
  summary:
    'Sáu chiều chất lượng dữ liệu gồm Completeness, Accuracy, Consistency, Validity, Uniqueness và Timeliness. Mỗi chiều phát hiện một kiểu lỗi khác nhau, và đo cả sáu cũng chưa chứng minh dữ liệu là đúng hay đủ đại diện.',
  tags: ['Chiều chất lượng', 'Định nghĩa', 'Đo lường'],
  related: ['dq-overview', 'dq-metrics', 'dq-profiling', 'etl-data-quality', 'etl-validation', 'eda-missing-values'],
  sections: {
    definition: `**Data Quality Dimensions (Các chiều chất lượng dữ liệu)** là các góc nhìn đo được của chất lượng nội tại. Bộ sáu chiều phổ biến nhất do DAMA UK đưa ra:

- **Completeness (Tính đầy đủ):** dữ liệu cần có thì có mặt.
- **Accuracy (Tính chính xác):** giá trị khớp với thực tế.
- **Consistency (Tính nhất quán):** không mâu thuẫn giữa các nơi hoặc các cột.
- **Validity (Tính hợp lệ):** giá trị đúng định dạng, kiểu và miền cho phép.
- **Uniqueness (Tính duy nhất):** mỗi thực thể chỉ được ghi một lần.
- **Timeliness (Tính kịp thời):** dữ liệu có mặt đủ sớm cho việc cần dùng.`,

    origin: `Trước đây, chất lượng dữ liệu thường được hiểu đơn giản là độ chính xác. Wang và Strong năm 1996 cho thấy người dùng còn quan tâm đến độ kịp thời và độ đầy đủ. Về sau, DAMA UK rút gọn thành sáu chiều dễ đo. Con số sáu là quy ước, không phải định lý: có khung dùng nhiều chiều hơn.`,

    whyUse: `Tách thành nhiều chiều giúp biết **lỗi thuộc loại gì và phải sửa ở đâu**. "Dữ liệu sai" là một lời phàn nàn khó xử lý. "Cột email thiếu 12% từ ngày 5/3" là một lỗi Completeness, có thời điểm và có thể lần ra hệ thống gây lỗi.`,

    mechanism: `**Cách đo từng chiều, và điểm cần chú ý:**

- **Completeness:** tỷ lệ giá trị khác null trong các cột bắt buộc. Cần đo cả mức dòng: số bản ghi kỳ vọng so với số bản ghi nhận được. Cột không null vẫn có thể thiếu nguyên một ngày dữ liệu. Nguyên nhân thiếu xem ở [[eda-missing-values]].
- **Validity:** tỷ lệ giá trị đúng định dạng, miền, khoảng. Đo được hoàn toàn tự động vì chỉ cần luật, không cần sự thật bên ngoài.
- **Accuracy:** tỷ lệ giá trị khớp với nguồn đáng tin, như hóa đơn gốc hoặc kiểm tra thủ công trên một mẫu. **Đây là chiều khó đo nhất** vì cần một sự thật để so sánh.
- **Consistency:** so giữa hai hệ thống, hoặc giữa các cột, ví dụ tổng theo dòng có bằng tổng hóa đơn không.
- **Uniqueness:** số dòng so với số khóa khác nhau, sau khi đã xác định khóa nghiệp vụ. Có thể tồn tại cùng một khách hàng dưới hai mã khác nhau.
- **Timeliness:** khoảng cách giữa lúc sự kiện xảy ra và lúc dữ liệu dùng được, so với cam kết.

**Vì sao không thể gộp các chiều:** chúng độc lập với nhau. Một ngày sinh \`1990-02-14\` hợp lệ, đầy đủ, duy nhất, đến đúng giờ, nhưng vẫn có thể sai so với thực tế. Validity nói giá trị **có thể đúng**, chỉ Accuracy mới nói giá trị **thật sự đúng**.

**Đo xong phải đặt ngưỡng theo mục đích:** thiếu 2% email chấp nhận được với báo cáo, nhưng là lỗi nghiêm trọng với chiến dịch gửi email hợp đồng. Cách biến thành số liệu xem ở [[dq-metrics]].`,

    example: `Bảng \`orders\` có 50 triệu dòng được đánh giá trước khi dùng cho báo cáo tài chính:

- **Completeness:** \`customer_id\` thiếu 0,4%, nhưng ngày 12/6 chỉ có 3.000 dòng so với mức thường là 140.000. Đây mới là lỗi nặng.
- **Validity:** 0,1% \`amount\` âm. Sau khi hỏi nghiệp vụ, đây là đơn hoàn tiền, nên luật cần sửa, không phải dữ liệu.
- **Uniqueness:** 8.200 \`order_id\` xuất hiện hai lần do producer gửi lại theo [[kafka-at-least-once|At-least-once]].
- **Consistency:** tổng doanh thu lệch 0,8% với hệ thống kế toán.
- **Accuracy:** đối chiếu 500 đơn ngẫu nhiên với hóa đơn gốc, thấy 3 đơn sai số tiền.
- **Timeliness:** dữ liệu về lúc 7:40, muộn hơn cam kết 7:00.`,

    prosCons: {
      pros: [
        '**Chẩn đoán được loại lỗi,** từ đó biết hệ thống nào cần sửa.',
        '**Dễ giao tiếp,** vì đây là bộ từ vựng được dùng rộng rãi trong ngành.',
      ],
      cons: [
        '**Không nói gì về tính đại diện:** cả sáu chiều đều có thể đạt mà dữ liệu vẫn lệch.',
        '**Dễ thành hình thức** nếu đo đủ sáu chiều cho mọi cột mà không gắn với mục đích.',
      ],
    },

    whenToUse: {
      use: [
        'Khi viết luật kiểm tra cho một bảng, để không bỏ sót loại lỗi.',
        'Khi báo cáo chất lượng cho người không chuyên về kỹ thuật.',
        'Khi phân tích nguyên nhân gốc của một sự cố dữ liệu.',
      ],
      avoid: [
        'Không đo mọi chiều cho mọi cột: chọn các cột quan trọng với quyết định.',
        'Không dùng để kết luận dữ liệu phù hợp cho mô hình, phải xét thêm các lớp khác trong [[dq-overview]].',
      ],
    },

    comparison: {
      intro: 'So sánh các chiều theo cách đo và chi phí:',
      headers: ['Chiều', 'Câu hỏi chính', 'Cách đo', 'Mức tự động'],
      rows: [
        ['Completeness', 'Có đủ không?', 'Tỷ lệ non-null, số dòng so với kỳ vọng', 'Cao'],
        ['Validity', 'Có đúng luật không?', 'Tỷ lệ đạt định dạng, miền, khoảng', 'Cao'],
        ['Uniqueness', 'Có trùng không?', 'Số dòng so với số khóa khác nhau', 'Cao, nhưng trùng thực thể thì khó'],
        ['Timeliness', 'Có kịp không?', 'Độ trễ so với cam kết', 'Cao'],
        ['Consistency', 'Có mâu thuẫn không?', 'Đối chiếu giữa cột hoặc giữa hệ thống', 'Trung bình'],
        ['Accuracy', 'Có đúng thực tế không?', 'Đối chiếu nguồn tin cậy trên một mẫu', 'Thấp'],
      ],
    },

    misconceptions: [
      {
        myth: 'Validity và Accuracy là một.',
        truth: 'Giá trị hợp lệ chỉ là giá trị có thể đúng. Số điện thoại đúng định dạng vẫn có thể là số của người khác.',
      },
      {
        myth: 'Không có null nghĩa là đầy đủ.',
        truth: 'Thiếu cả dòng thì không tạo ra null nào. Hệ thống nguồn cũng có thể dùng giá trị thay thế như 0, "N/A", hoặc 1900-01-01.',
      },
      {
        myth: 'Timeliness chỉ là dữ liệu mới.',
        truth: 'Timeliness được so với nhu cầu sử dụng. Báo cáo quý chấp nhận trễ một ngày, nhưng phát hiện gian lận thì không chấp nhận trễ một giờ.',
      },
    ],
  },
})
