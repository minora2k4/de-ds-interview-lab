import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-calibration',
  summary:
    'Mô hình được hiệu chỉnh tốt khi trong các mẫu có xác suất dự đoán 0,8, khoảng 80% thật sự dương. Kiểm tra bằng Reliability Diagram và Brier Score, sửa bằng Platt Scaling hoặc Isotonic Regression trên dữ liệu riêng.',
  tags: ['Xác suất', 'Độ tin cậy', 'First Principles'],
  related: ['eval-log-loss', 'eval-roc-auc', 'eval-train-val-test', 'eda-imbalanced', 'dq-drift'],
  sections: {
    definition: `**Model Calibration (Hiệu chỉnh xác suất của mô hình)** là mức xác suất dự đoán khớp với tần suất thực tế. Trong các mẫu được cho xác suất khoảng 0,8, phải có khoảng 80% thật sự thuộc lớp dương.

Calibration khác với **khả năng tách (Discrimination):** [[eval-roc-auc]] đo thứ tự, còn Calibration đo giá trị.`,

    origin: `Brier (1950) đề xuất điểm số cho dự báo thời tiết, vì câu nói "70% khả năng mưa" cần kiểm chứng được. Trong học máy, nhiều thuật toán được tối ưu cho việc phân loại chứ không cho xác suất. Platt (1999) đưa ra cách biến điểm của SVM thành xác suất. Zadrozny và Elkan (2002) dùng Isotonic Regression. Niculescu-Mizil và Caruana (2005) so sánh các phương pháp này trên nhiều thuật toán.`,

    whyUse: `Cần Calibration khi **giá trị xác suất đi vào phép tính**, không chỉ để xếp hạng:

- **Tổn thất kỳ vọng:** xác suất vỡ nợ nhân với dư nợ.
- **Chọn ngưỡng theo chi phí:** công thức ngưỡng chỉ đúng nếu xác suất đúng.`,

    mechanism: `**Vì sao xác suất bị lệch:** Random Forest lấy trung bình nên ít khi cho giá trị gần 0 hoặc 1. Mô hình biên lớn như SVM cho đường cong dạng chữ S. Naive Bayes đẩy xác suất về hai đầu. Lấy mẫu lại để cân bằng lớp làm xác suất cao hơn thực tế.

**Reliability Diagram (Biểu đồ độ tin cậy):** chia dự đoán thành các khoảng, mỗi khoảng vẽ một điểm với trục ngang là xác suất dự đoán trung bình, trục dọc là tỷ lệ dương thực tế. Đường chéo là hoàn hảo, nằm dưới đường chéo là dự đoán cao hơn thực tế. Nếu dữ liệu mất cân bằng, nên chia theo phân vị, vì chia đều thì hầu hết mẫu rơi vào khoảng đầu.

**Brier Score:** \`trung bình (p - y)^2\`, càng nhỏ càng tốt. Mốc của mô hình luôn đoán tỷ lệ dương p là \`p x (1 - p)\`, tức 0,0099 khi p = 1%. Lưu ý Brier và [[eval-log-loss]] gộp cả khả năng tách và Calibration. Tài liệu scikit-learn nêu rõ Brier thấp hơn chưa hẳn là hiệu chỉnh tốt hơn.

**Hai cách hiệu chỉnh phổ biến:**

- **Platt Scaling:** học hàm \`p = 1 / (1 + exp(A x f + B))\` trên điểm số f. Chỉ có hai tham số nên ít overfit, nhưng giả định độ lệch có dạng chữ S. Đơn điệu nghiêm ngặt nên giữ nguyên thứ tự.
- **Isotonic Regression:** học hàm bậc thang không giảm, không giả định dạng. Linh hoạt hơn nhưng cần nhiều dữ liệu, theo scikit-learn là trên khoảng 1.000 mẫu. Nó tạo ra các giá trị hòa nên AUC có thể đổi nhẹ.

Từ phiên bản 1.8, scikit-learn có thêm Temperature Scaling, tự nhiên hơn cho bài toán đa lớp.

**Quy tắc quan trọng:** bộ hiệu chỉnh phải học trên dữ liệu không dùng để huấn luyện mô hình, vì điểm số trên Train quá lạc quan. Có thể dùng tập riêng hoặc dự đoán ngoài fold. Test vẫn chỉ dùng để đánh giá lần cuối.`,

    diagram: {
      mermaid: `flowchart TD
  A["Train: huấn luyện mô hình"] --> B["Điểm số trên tập hiệu chỉnh riêng"]
  B --> C["Học Platt hoặc Isotonic"]
  C --> D["Test: Reliability Diagram, Brier, AUC"]
  D --> E["Triển khai mô hình kèm bộ hiệu chỉnh"]
  E --> F["Theo dõi: tỷ lệ lớp đổi thì hiệu chỉnh lại"]`,
      caption: 'Dùng ba phần dữ liệu riêng biệt. Xác suất có thể lệch dần theo thời gian kể cả khi thứ tự vẫn tốt.',
    },

    example: `**Tính tay Brier:** bốn mẫu có (p; y) là (0,9; 1), (0,8; 0), (0,3; 0), (0,1; 0). Brier = (0,01 + 0,64 + 0,09 + 0,01) / 4 = 0,1875. Riêng mẫu 0,8 đã chiếm phần lớn.

**Tình huống:** Random Forest chấm điểm tín dụng có AUC 0,82, được huấn luyện trên dữ liệu đã cân bằng 1:1, trong khi tỷ lệ vỡ nợ thật là 5%. Với 1.000 khách có điểm khoảng 0,20, thực tế chỉ 80 người vỡ nợ, tức 8%. Nếu mỗi khoản vay mất 100 triệu đồng khi vỡ nợ, mô hình dự tính tổn thất 20 tỷ đồng, trong khi thực tế là 8 tỷ đồng.

Học Platt Scaling trên 20.000 mẫu có tỷ lệ thật, nhóm này được chỉnh về khoảng 0,09. AUC giữ nguyên 0,82 vì thứ tự không đổi, Brier giảm từ 0,071 xuống 0,052.`,

    prosCons: {
      pros: [
        '**Làm cho xác suất dùng được** trong phép tính nghiệp vụ.',
        '**Áp dụng sau huấn luyện** mà không phải đổi mô hình gốc.',
        '**Platt giữ nguyên thứ tự,** nên không ảnh hưởng ROC-AUC.',
      ],
      cons: [
        '**Cần thêm dữ liệu riêng,** làm giảm dữ liệu huấn luyện hoặc phải dùng Cross Validation.',
        '**Không tạo thêm khả năng tách:** mô hình xếp hạng kém vẫn kém.',
        '**Lệch theo thời gian** khi tỷ lệ lớp hoặc phân phối thay đổi.',
      ],
    },

    whenToUse: {
      use: [
        'Xác suất được dùng để tính tiền, định giá, hoặc đặt ngưỡng theo chi phí.',
        'Mô hình dạng cây, biên lớn, hoặc đã lấy mẫu lại dữ liệu.',
        'Chọn Platt khi dữ liệu ít, Isotonic khi có nhiều dữ liệu.',
      ],
      avoid: [
        'Chỉ cần thứ tự, như lấy top k mẫu.',
        'Không hiệu chỉnh trên chính dữ liệu Train hoặc trên Test.',
        'Không dùng Isotonic với quá ít mẫu, vì dễ overfit.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Platt Scaling', 'Isotonic Regression', 'Temperature Scaling'],
      rows: [
        ['Dạng hàm', 'Chữ S, 2 tham số', 'Bậc thang không giảm', 'Một tham số T'],
        ['Cần dữ liệu', 'Ít', 'Nhiều, trên khoảng 1.000 mẫu', 'Ít'],
        ['Rủi ro', 'Sai nếu độ lệch không có dạng chữ S', 'Overfit khi ít mẫu', 'Kém linh hoạt'],
        ['Ảnh hưởng tới AUC', 'Giữ nguyên', 'Có thể đổi nhẹ do hòa', 'Giữ nguyên thứ tự lớp được chọn'],
      ],
    },

    misconceptions: [
      {
        myth: 'AUC cao nghĩa là xác suất đáng tin.',
        truth: 'AUC chỉ phụ thuộc thứ tự. Trong ví dụ, AUC 0,82 đi cùng xác suất cao gấp 2,5 lần thực tế.',
      },
      {
        myth: 'Mô hình hiệu chỉnh tốt là mô hình tốt.',
        truth: 'Luôn đoán bằng tỷ lệ lớp dương là hiệu chỉnh tốt, nhưng không tách được gì. Cần xem cả hai mặt.',
      },
      {
        myth: 'Brier thấp hơn nghĩa là hiệu chỉnh tốt hơn.',
        truth: 'Brier gộp cả khả năng tách, nên mô hình tách tốt hơn có thể có Brier thấp hơn dù hiệu chỉnh kém hơn.',
      },
    ],
  },
})
