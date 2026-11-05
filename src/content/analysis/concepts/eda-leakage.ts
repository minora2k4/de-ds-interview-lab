import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eda-leakage',
  summary:
    'Rò rỉ dữ liệu xảy ra khi mô hình dùng thông tin không có tại thời điểm dự đoán thật. Target Leakage nằm ở đặc trưng, Train-Test Contamination nằm ở quy trình, và cả hai đều làm chỉ số đánh giá cao hơn thực tế.',
  tags: ['Rò rỉ', 'Đánh giá', 'First Principles'],
  related: ['eval-train-val-test', 'eval-cross-validation', 'eda-imbalanced', 'eda-missing-values', 'dq-time-series', 'eval-overfitting', 'fe-selection'],
  sections: {
    definition: `**Data Leakage (Rò rỉ dữ liệu)** xảy ra khi quá trình xây mô hình dùng thông tin không có được tại thời điểm dự đoán thật, khiến chỉ số đánh giá cao hơn năng lực thật. Có hai dạng chính:

- **Target Leakage (Rò rỉ nhãn):** đặc trưng chứa thông tin về nhãn mà lúc dự đoán chưa có, thường vì nó được sinh ra sau hoặc do chính kết quả.
- **Train-Test Contamination (Nhiễm chéo giữa train và test):** thông tin của tập đánh giá lọt vào quá trình huấn luyện hoặc tiền xử lý, nên tập này không còn là dữ liệu chưa từng thấy.`,

    origin: `Kaufman, Rosset và Perlich (2011) hệ thống hóa vấn đề này, và đề xuất **learn-predict separation**: tách rõ dữ liệu dùng để học với dữ liệu chỉ có sau thời điểm dự đoán. Nguyên nhân gốc là kho dữ liệu thường lưu trạng thái hiện tại, không lưu thời điểm mỗi giá trị được biết.`,

    whyUse: `Rò rỉ dẫn đến quyết định triển khai dựa trên chỉ số ảo. Khi chỉ số tụt ở production, quy trình nghiệp vụ đã dựa vào mô hình. Nhận ra rò rỉ sớm giúp có một con số đáng tin để so sánh với giải pháp hiện tại.`,

    mechanism: `**Vì sao khó phát hiện:** Overfitting lộ ra vì train cao mà test thấp. Target Leakage thì không: đặc trưng rò rỉ có mặt ở cả train và test, nên test cũng cao. Validation và Cross Validation đều đồng ý với nhau, chỉ có production phản đối.

**Target Leakage thường đến từ:**

- Đặc trưng sinh sau sự kiện, như \`num_collection_calls\` khi dự đoán vỡ nợ.
- Giá trị bị ghi đè, như \`total_orders\` lấy từ bảng hiện tại thay vì tại thời điểm dự đoán.
- [[eda-missing-values|Mẫu hình thiếu]]: trường chỉ được điền cho một nhãn.

**Train-Test Contamination thường đến từ:**

- Fit phép biến đổi trên toàn bộ dữ liệu. Quy tắc của scikit-learn là không bao giờ gọi \`fit\` trên dữ liệu test. Mức độ thiệt hại khác nhau: scaler trên dữ liệu lớn thường ít ảnh hưởng, nhưng chọn đặc trưng theo nhãn rất nặng. Tài liệu của thư viện này minh họa accuracy 0,76 trên nhãn hoàn toàn ngẫu nhiên, thay vì 0,5.
- Resampling trước khi tách, xem [[eda-imbalanced]].
- Cùng một thực thể ở hai tập, như nhiều ảnh của một bệnh nhân.
- Tách ngẫu nhiên [[dq-time-series|dữ liệu thời gian]], tức học từ tương lai để đoán quá khứ.
- Dùng tập test nhiều lần để chọn mô hình.

**Cách kiểm tra:** với mỗi đặc trưng, hỏi "tại thời điểm dự đoán, giá trị này đã có chưa, và có đúng là giá trị này không?". Dấu hiệu nghi ngờ: một đặc trưng chiếm phần lớn importance, chỉ số tốt hơn mức nghiệp vụ tin được, hoặc tụt mạnh khi đổi sang tách theo thời gian hay theo nhóm.

**Cách phòng:** đặt mốc dự đoán cho từng dòng, tách tập trước, gói biến đổi vào pipeline để fit trong từng fold, và giữ tập test chỉ dùng một lần.`,

    diagram: {
      mermaid: `flowchart TD
  A["Mốc dự đoán T cho từng dòng"] --> B["Đặc trưng: chỉ dữ liệu biết trước T"]
  A --> C["Nhãn: sự kiện sau T"]
  B --> D["Tách train, test theo thời gian và theo nhóm"]
  C --> D
  D --> E["Fit tiền xử lý chỉ trên train"]
  E --> F["Đánh giá trên test một lần"]`,
      caption: 'Quy trình chống rò rỉ bắt đầu từ mốc thời gian, trước cả khi tách tập. Chỉ tách tập cẩn thận thì không loại được Target Leakage.',
    },

    example: `Mô hình dự đoán vỡ nợ trên 300.000 khoản vay đạt AUC 0,97 khi thử nghiệm, nhưng chỉ 0,62 ở production.

- \`num_collection_calls\` chiếm 70% importance, và chỉ tăng sau khi khách đã quá hạn. Bỏ cột này, AUC còn 0,74.
- Target Encoding của \`occupation\` được tính trên toàn bộ dữ liệu. Đưa vào pipeline, AUC còn 0,71.
- Dữ liệu được tách ngẫu nhiên. Chuyển sang học năm 2023, kiểm tra năm 2024, AUC còn 0,69.

Lần triển khai sau đạt 0,68. Con số trên giấy thấp hơn nhưng dự báo đúng thực tế.`,

    prosCons: {
      pros: [
        '**Chỉ số thử nghiệm sát thực tế,** nên quyết định triển khai đáng tin.',
      ],
      cons: [
        '**Tốn công dữ liệu:** cần lịch sử theo thời gian, trong khi nhiều hệ thống chỉ lưu trạng thái hiện tại.',
        '**Chỉ số trên giấy giảm,** khó giải thích với người đã xem con số cũ.',
        '**Không có kiểm tra tự động nào tìm hết:** vẫn cần hiểu quy trình nghiệp vụ.',
      ],
    },

    whenToUse: {
      use: [
        'Tách theo thời gian khi mô hình dự đoán tương lai.',
        'Tách theo nhóm khi một thực thể có nhiều dòng.',
      ],
      avoid: [
        'Không loại đặc trưng chỉ vì nó mạnh. Nếu giá trị có trước mốc dự đoán, đó là tín hiệu thật.',
        'Không dùng Stratified Split để chữa Target Leakage. Cách tách không loại được đặc trưng rò rỉ.',
        'Không chạy tiền xử lý một lần trên toàn bộ dữ liệu trước Cross Validation.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Target Leakage', 'Train-Test Contamination', 'Overfitting'],
      rows: [
        ['Bản chất', 'Đặc trưng chứa thông tin tương lai về nhãn', 'Thông tin tập đánh giá lọt vào huấn luyện', 'Mô hình học cả nhiễu của train'],
        ['Dấu hiệu', 'Train và test đều rất cao', 'Test cao hơn thực tế, mức độ tùy lỗi', 'Train cao, test thấp rõ'],
        ['Phát hiện bằng', 'Mốc thời gian, nghiệp vụ, importance', 'Rà thứ tự các bước, đổi cách tách', 'So sánh train với validation'],
        ['Cách sửa', 'Bỏ hoặc tính lại đặc trưng', 'Tách trước, fit trong pipeline', 'Đơn giản hóa, thêm dữ liệu'],
      ],
    },

    misconceptions: [
      {
        myth: 'Cross Validation bảo vệ khỏi rò rỉ.',
        truth: 'Đặc trưng rò rỉ có trong mọi fold, nên CV vẫn cho điểm cao. Nếu tiền xử lý chạy trước CV, chính CV cũng bị nhiễm chéo.',
      },
      {
        myth: 'Fit scaler trên toàn bộ dữ liệu không sao vì không dùng nhãn.',
        truth: 'Đó vẫn là rò rỉ, chỉ là thường nhẹ. Cùng thói quen đó sẽ gây hậu quả lớn với Target Encoding hay chọn đặc trưng.',
      },
      {
        myth: 'Đặc trưng có importance cao nhất chắc chắn là rò rỉ.',
        truth: 'Importance cao chỉ là lý do để kiểm tra. Tiêu chí quyết định là giá trị đó đã có tại thời điểm dự đoán hay chưa.',
      },
    ],
  },
})
