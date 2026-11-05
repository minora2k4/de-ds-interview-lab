import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-f1',
  summary:
    'F1-score là trung bình điều hòa của Precision và Recall, nên chỉ cao khi cả hai cùng cao. F1 phụ thuộc ngưỡng, không dùng TN và không tính đến chi phí lỗi.',
  tags: ['Phân loại', 'Ngưỡng', 'Mất cân bằng'],
  related: ['eval-precision', 'eval-recall', 'eval-confusion-matrix', 'eval-pr-auc', 'eda-imbalanced'],
  sections: {
    definition: `**F1-score (Trung bình điều hòa của Precision và Recall)** gộp hai chỉ số thành một: \`F1 = 2 x P x R / (P + R)\`. Viết theo [[eval-confusion-matrix]] là \`2TP / (2TP + FP + FN)\`.`,

    origin: `Precision và Recall là hai con số nên khó xếp hạng mô hình, còn trung bình cộng lại che điểm yếu. van Rijsbergen đề xuất một độ đo gộp trong truy xuất thông tin năm 1979.`,

    whyUse: `F1 cho một con số để so sánh khi lớp dương quan trọng và chi phí hai loại lỗi chưa rõ.`,

    mechanism: `**Vì sao dùng trung bình điều hòa?** Vì nó bị kéo về giá trị nhỏ hơn. Với P = 1 và R = 0,01, trung bình cộng là 0,505, còn F1 chỉ 0,0198.

**F-beta** tổng quát hóa F1: \`(1 + b^2) x P x R / (b^2 x P + R)\`. Với b > 1, Recall được coi trọng hơn.

**Với đa lớp:**

- **Macro:** trung bình đều giữa các lớp.
- **Micro:** cộng dồn trước khi tính. Với bài toán một nhãn, Micro F1 bằng Accuracy.
- **Weighted:** trung bình theo số mẫu.`,

    example: `Với TP = 80, FP = 320, FN = 20: P = 0,2, R = 0,8, F1 = 2 x 0,2 x 0,8 / 1,0 = 0,32. Trung bình cộng là 0,5.

Ngưỡng cao hơn cho TP = 60, FP = 80, FN = 40: F1 = 120 / 240 = 0,5. F1 thích ngưỡng này, nhưng nếu một FN đắt gấp 100 lần một FP, ngưỡng trước lại rẻ hơn.`,

    prosCons: {
      pros: ['Phạt được việc lệch hẳn về một phía.', 'Không bị TN áp đảo.'],
      cons: ['Phụ thuộc ngưỡng và tỷ lệ lớp.', 'Không phản ánh chi phí thật, bỏ qua TN.'],
    },

    whenToUse: {
      use: ['Lớp dương hiếm, cần một con số nhanh để so sánh.', 'Chưa có chi phí nghiệp vụ.'],
      avoid: ['Lớp âm cũng quan trọng.', 'Cần so sánh không phụ thuộc ngưỡng: dùng [[eval-pr-auc]].'],
    },

    comparison: {
      headers: ['Tiêu chí', 'F1', 'Accuracy', 'PR-AUC'],
      rows: [
        ['Cần ngưỡng', 'Có', 'Có', 'Không'],
        ['Dùng TN', 'Không', 'Có', 'Không'],
      ],
    },

    misconceptions: [
      {
        myth: 'F1 luôn là chỉ số đúng cho dữ liệu mất cân bằng.',
        truth: 'F1 ngầm cho hai loại lỗi trọng số bằng nhau. Đã biết chi phí thì nên tính thẳng chi phí.',
      },
      {
        myth: 'Micro F1 phù hợp để bảo vệ lớp hiếm.',
        truth: 'Với bài toán một nhãn, Micro F1 bằng Accuracy nên lớp lớn chi phối. Hãy dùng Macro F1.',
      },
    ],
  },
})
