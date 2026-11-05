import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-log-loss',
  summary:
    'Log Loss đo chất lượng xác suất dự đoán, phạt rất nặng các dự đoán tự tin mà sai. Phải so với mốc của mô hình luôn đoán bằng tỷ lệ lớp dương.',
  tags: ['Phân loại', 'Xác suất'],
  related: ['eval-calibration', 'eval-roc-auc', 'eval-confusion-matrix', 'stats-probability'],
  sections: {
    definition: `**Log Loss (Hàm mất mát logarit)**, còn gọi là Cross-Entropy, đo xác suất dự đoán khớp với nhãn thật đến đâu:

\`Log Loss = -(1/N) x tổng của [y x ln(p) + (1 - y) x ln(1 - p)]\`

Giá trị càng nhỏ càng tốt, và 0 là hoàn hảo.`,

    origin: `Accuracy xem dự đoán 0,51 và 0,99 là như nhau, nên không đánh giá được xác suất. Log Loss chính là âm log-likelihood của mô hình Bernoulli, nên nhiều mô hình phân loại tối ưu trực tiếp theo nó.`,

    whyUse: `Khi xác suất dùng để ra quyết định như định giá, cần chỉ số đo được chính giá trị đó. Log Loss là một **Proper Scoring Rule (Quy tắc chấm điểm đúng đắn):** điểm kỳ vọng tốt nhất đạt được khi báo đúng xác suất thật.`,

    mechanism: `Mỗi mẫu bị phạt bằng \`-ln\` của xác suất dành cho nhãn đúng:

- p = 0,9: phạt 0,105.
- p = 0,5: phạt 0,693.
- p = 0,1: phạt 2,303.
- p = 0,01: phạt 4,605.

Khi xác suất cho nhãn đúng tiến về 0, mức phạt tiến ra vô cùng, nên scikit-learn cắt xác suất vào \`[eps, 1 - eps]\`.

**Mốc so sánh:** mô hình luôn đoán bằng tỷ lệ dương p có Log Loss bằng \`-[p x ln(p) + (1 - p) x ln(1 - p)]\`. Với p = 50% là 0,693, với p = 1% chỉ là 0,056.`,

    example: `Bốn mẫu với nhãn và xác suất: (1; 0,9), (0; 0,2), (1; 0,6), (0; 0,1). Mức phạt lần lượt là 0,105, 0,223, 0,511, 0,105. Log Loss = 0,944 / 4 = 0,236.

Trên dữ liệu 1% dương, Log Loss 0,05 chỉ tốt hơn mốc 0,056 một chút.`,

    prosCons: {
      pros: ['Đo cả khả năng tách và chất lượng xác suất.', 'Không phụ thuộc ngưỡng.'],
      cons: ['Khó giải thích với nghiệp vụ, và phụ thuộc tỷ lệ lớp.', 'Vài mẫu tự tin mà sai có thể chi phối kết quả.'],
    },

    whenToUse: {
      use: ['Xác suất dùng trực tiếp trong quyết định.'],
      avoid: ['Chỉ cần xếp hạng: dùng [[eval-roc-auc]].', 'Nhãn có nhiều lỗi.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Log Loss', 'Brier Score', 'ROC-AUC'],
      rows: [
        ['Đo chất lượng xác suất', 'Có', 'Có', 'Không'],
        ['Mức phạt lớn nhất', 'Vô hạn, nếu không cắt', 'Có giới hạn, tối đa 1', 'Không áp dụng'],
        ['Nhạy với sai tự tin', 'Rất cao', 'Vừa phải', 'Không'],
      ],
    },

    misconceptions: [
      {
        myth: 'Log Loss 0,05 luôn là rất tốt.',
        truth: 'Với 1% ca dương, mô hình không học gì đã đạt 0,056.',
      },
      {
        myth: 'Log Loss chỉ đo Calibration.',
        truth: 'Nó gộp cả khả năng tách và [[eval-calibration|Calibration]].',
      },
    ],
  },
})
