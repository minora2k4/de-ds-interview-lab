import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-confusion-matrix',
  summary:
    'Confusion Matrix đếm dự đoán theo nhãn thật và nhãn dự đoán, tại một ngưỡng cụ thể. Mọi chỉ số như Accuracy, Precision, Recall, F1 đều tính từ bốn ô TP, FP, FN, TN.',
  tags: ['Phân loại', 'Ngưỡng', 'Mất cân bằng'],
  related: ['eval-accuracy', 'eval-precision', 'eval-recall', 'eval-f1', 'eval-roc-auc', 'stats-type-errors', 'eda-imbalanced'],
  sections: {
    definition: `**Confusion Matrix (Ma trận nhầm lẫn)** là bảng đếm số mẫu theo hai chiều: nhãn thật và nhãn dự đoán. Với bài toán nhị phân có bốn ô:

- **TP (True Positive):** thật là dương, đoán dương.
- **FP (False Positive):** thật là âm, đoán dương. Tương ứng sai lầm loại I trong [[stats-type-errors|kiểm định]].
- **FN (False Negative):** thật là dương, đoán âm. Tương ứng sai lầm loại II.
- **TN (True Negative):** thật là âm, đoán âm.`,

    origin: `Bảng chéo đã có từ thống kê, và được dùng trong chẩn đoán y khoa để tách hai loại sai. Trong phân loại, nó khắc phục điểm yếu của cách chỉ báo một con số Accuracy: con số đó không cho biết mô hình sai theo hướng nào, trong khi bỏ sót một ca ung thư khác xa với báo nhầm một ca khỏe mạnh.`,

    whyUse: `- **Thấy rõ loại sai,** từ đó gắn được chi phí nghiệp vụ cho từng loại.
- **Là nguồn của các chỉ số:** nhớ được bốn ô thì suy ra được mọi công thức.
- **Phát hiện mô hình đoán theo lớp đa số,** điều Accuracy che mất.
- **Với đa lớp,** cho biết cặp lớp nào hay bị nhầm với nhau.`,

    mechanism: `1. Mô hình cho điểm số hoặc xác suất cho mỗi mẫu.
2. So với **ngưỡng** để ra nhãn dự đoán. Vì vậy mỗi ngưỡng có một ma trận riêng.
3. Đếm vào bốn ô.
4. Tính chỉ số theo mẫu số phù hợp với câu hỏi cần trả lời.

| Chỉ số | Công thức | Câu hỏi |
|---|---|---|
| Accuracy | (TP + TN) / N | Đúng bao nhiêu trên tổng số? |
| Precision | TP / (TP + FP) | Trong số báo dương, đúng bao nhiêu? |
| Recall | TP / (TP + FN) | Trong số dương thật, bắt được bao nhiêu? |
| FPR | FP / (FP + TN) | Trong số âm thật, báo nhầm bao nhiêu? |

**Khi đổi ngưỡng:** tăng ngưỡng thì ít mẫu được báo dương hơn, nên FP giảm và FN tăng. Không có ngưỡng nào giảm được cả hai với cùng một mô hình, nên việc chọn ngưỡng là quyết định nghiệp vụ.

**Cách đọc bảng:** scikit-learn đặt hàng là nhãn thật, cột là nhãn dự đoán, thứ tự nhãn tăng dần. Với nhị phân, ô trên trái là TN, không phải TP như nhiều sách. Hãy đọc nhãn trục trước khi đọc số.

**Với đa lớp,** bảng có kích thước K x K. Đường chéo là phần đúng. Ô chia cho tổng hàng cho Recall của lớp, chia cho tổng cột cho Precision của lớp.`,

    diagram: {
      mermaid: `flowchart TD
  A["Điểm số của mô hình"] --> B["So với ngưỡng"]
  B --> C["Đoán dương"]
  B --> D["Đoán âm"]
  C --> E["Đúng: TP, sai: FP"]
  D --> F["Đúng: TN, sai: FN"]
  E --> G["Tính chỉ số và chi phí"]
  F --> G`,
      caption: 'Ma trận chỉ tồn tại sau khi có ngưỡng. Đổi ngưỡng thì mẫu chuyển giữa các ô, nhưng tổng số dương thật không đổi.',
    },

    example: `Có 10.000 giao dịch, 100 giao dịch gian lận (1%). Tại ngưỡng A, mô hình cho kết quả:

| | Đoán gian lận | Đoán bình thường | Tổng |
|---|---|---|---|
| **Thật gian lận** | TP = 80 | FN = 20 | 100 |
| **Thật bình thường** | FP = 320 | TN = 9.580 | 9.900 |

- **Accuracy** = (80 + 9.580) / 10.000 = 96,6%, thấp hơn mức 99% của việc luôn đoán bình thường.
- **Precision** = 80 / 400 = 20%: cứ 5 cảnh báo có 1 cảnh báo đúng.
- **Recall** = 80 / 100 = 80%.
- **F1** = 2 x 80 / (2 x 80 + 320 + 20) = 0,32.
- **FPR** = 320 / 9.900 = 3,2%.

Giả sử bỏ sót một ca mất 5 triệu đồng, kiểm tra nhầm một ca mất 50 nghìn đồng. Ngưỡng A tốn 20 x 5 triệu + 320 x 50 nghìn = 116 triệu đồng. Ngưỡng B cao hơn cho TP = 60, FN = 40, FP = 80, TN = 9.820, có F1 = 0,5 và Accuracy 98,8%, nhưng tốn 40 x 5 triệu + 80 x 50 nghìn = 204 triệu đồng. Cả F1 và Accuracy đều chọn B, còn nghiệp vụ nên chọn A. Luôn đoán bình thường thì tốn 500 triệu đồng.`,

    prosCons: {
      pros: [
        '**Đầy đủ thông tin** tại một ngưỡng, không gộp các loại sai lại.',
        '**Dễ gắn với chi phí** để so sánh các ngưỡng bằng tiền.',
      ],
      cons: [
        '**Chỉ mô tả một ngưỡng,** muốn đánh giá khả năng xếp hạng cần [[eval-roc-auc]] hoặc [[eval-pr-auc]].',
        '**Khó so sánh mô hình** vì là bốn con số thay vì một.',
        '**Bỏ mất mức độ tự tin,** dự đoán 0,51 và 0,99 được tính như nhau.',
      ],
    },

    whenToUse: {
      use: [
        'Khi đã có ngưỡng và cần giải thích kết quả cho nghiệp vụ.',
        'Khi hai loại sai có chi phí khác nhau.',
        'Khi muốn biết các lớp nào hay bị nhầm trong bài toán đa lớp.',
      ],
      avoid: [
        'Không chọn ngưỡng trên Test, vì đó là một quyết định về mô hình.',
        'Không chỉ nhìn số đếm khi các lớp lệch nhiều, hãy chuẩn hóa theo hàng để thấy tỷ lệ.',
      ],
    },

    comparison: {
      intro: 'So với các cách đánh giá phân loại khác:',
      headers: ['Tiêu chí', 'Confusion Matrix', 'F1', 'ROC-AUC', 'Log Loss'],
      rows: [
        ['Cần ngưỡng', 'Có', 'Có', 'Không', 'Không'],
        ['Số giá trị', 'Bốn ô', 'Một', 'Một', 'Một'],
        ['Tách loại sai', 'Có', 'Không', 'Không', 'Không'],
        ['Đo chất lượng xác suất', 'Không', 'Không', 'Không', 'Có'],
      ],
    },

    misconceptions: [
      {
        myth: 'Ô trên trái của ma trận luôn là TP.',
        truth: 'Tùy công cụ. scikit-learn sắp nhãn tăng dần nên ô trên trái là TN. Đọc sai thì Precision và Recall sai theo.',
      },
      {
        myth: 'Mô hình chỉ có một Confusion Matrix.',
        truth: 'Mỗi ngưỡng có một ma trận. Ngưỡng 0,5 chỉ là mặc định, và với dữ liệu mất cân bằng thường không phải lựa chọn tốt.',
      },
      {
        myth: 'Tỷ lệ FP thấp nghĩa là ít cảnh báo sai.',
        truth: 'FPR 3,2% nghe rất nhỏ, nhưng trên 9.900 ca âm vẫn là 320 cảnh báo sai, gấp 4 lần số cảnh báo đúng.',
      },
    ],
  },
})
