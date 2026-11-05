import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-precision',
  summary:
    'Precision là tỷ lệ đúng trong số các mẫu mô hình báo dương: TP / (TP + FP). Chỉ số này phụ thuộc vào tỷ lệ lớp dương trong dữ liệu.',
  tags: ['Phân loại', 'Ngưỡng'],
  related: ['eval-recall', 'eval-f1', 'eval-confusion-matrix', 'eval-pr-auc', 'stats-bayes'],
  sections: {
    definition: `**Precision (Tỷ lệ dự đoán dương đúng)** trả lời câu hỏi: trong những mẫu mô hình báo dương, bao nhiêu mẫu thật sự dương? Công thức là \`TP / (TP + FP)\`, lấy từ [[eval-confusion-matrix]].`,

    origin: `Khái niệm này đến từ truy xuất thông tin: trong các tài liệu trả về, bao nhiêu tài liệu đúng nhu cầu? Accuracy không trả lời được, vì số tài liệu không liên quan quá lớn.`,

    whyUse: `Precision đo chi phí của việc hành động theo cảnh báo. Mỗi FP là một lần gọi điện, khóa thẻ hay kiểm tra vô ích.`,

    mechanism: `Mẫu số là số mẫu **được báo dương**, nên Precision chịu ảnh hưởng của cả hai lớp.

Tăng ngưỡng thường làm Precision tăng, nhưng không phải lúc nào cũng tăng đều. Nếu không báo mẫu nào, Precision không xác định.

**Precision phụ thuộc tỷ lệ lớp.** Với cùng Recall và FPR, Precision viết được theo [[stats-bayes|Bayes]]: \`Recall x p / (Recall x p + FPR x (1 - p))\`, trong đó p là tỷ lệ lớp dương.`,

    example: `Cùng một mô hình có Recall 80%, FPR 3,23%, xét 10.000 mẫu:

- **Tỷ lệ dương 10%:** TP = 800, FP = 291, Precision khoảng 73%.
- **Tỷ lệ dương 1%:** TP = 80, FP = 320, Precision là 20%.
- **Tỷ lệ dương 0,1%:** TP = 8, FP = 323, Precision khoảng 2,4%.

Mô hình không đổi, chỉ có tỷ lệ lớp đổi.`,

    prosCons: {
      pros: ['Gắn trực tiếp với chi phí của cảnh báo sai.', 'Dễ giải thích: cứ 5 cảnh báo có 1 cảnh báo đúng.'],
      cons: [
        'Có thể rất cao nếu chỉ báo vài ca chắc chắn.',
        'Khó so sánh giữa các tập có tỷ lệ lớp khác nhau.',
      ],
    },

    whenToUse: {
      use: ['Mỗi cảnh báo tốn nhiều chi phí xử lý, như khóa tài khoản.', 'Năng lực có hạn, nên đo Precision@k trên k mẫu điểm cao nhất.'],
      avoid: ['Bỏ sót rất đắt, khi đó ưu tiên [[eval-recall]].', 'Không báo cáo Precision đo trên dữ liệu đã cân bằng lại như con số thực tế.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Precision', 'Recall', 'FPR'],
      rows: [
        ['Mẫu số', 'Số báo dương', 'Số dương thật', 'Số âm thật'],
        ['Ô sai được tính', 'FP', 'FN', 'FP'],
        ['Khi tỷ lệ dương đổi', 'Thay đổi', 'Thường giữ nguyên', 'Thường giữ nguyên'],
      ],
    },

    misconceptions: [
      {
        myth: 'Precision là tính chất riêng của mô hình.',
        truth: 'Nó phụ thuộc cả tỷ lệ lớp và ngưỡng, như ví dụ trên.',
      },
      {
        myth: 'Precision 100% nghĩa là mô hình hoàn hảo.',
        truth: 'Chỉ cần báo đúng một ca chắc chắn nhất là đạt 100%, dù bỏ sót gần hết.',
      },
    ],
  },
})
