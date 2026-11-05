import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-recall',
  summary:
    'Recall là tỷ lệ ca dương thật được mô hình bắt được: TP / (TP + FN). Còn gọi là Sensitivity hoặc TPR.',
  tags: ['Phân loại', 'Ngưỡng'],
  related: ['eval-precision', 'eval-f1', 'eval-confusion-matrix', 'eval-roc-auc', 'dq-label-quality'],
  sections: {
    definition: `**Recall (Tỷ lệ bắt được ca dương)** trả lời câu hỏi: trong các ca thật sự dương, mô hình bắt được bao nhiêu? Công thức là \`TP / (TP + FN)\`. Còn gọi là **Sensitivity (Độ nhạy)** hoặc **True Positive Rate (TPR)**.`,

    origin: `Tên gọi đến từ truy xuất thông tin: trong các tài liệu liên quan, hệ thống tìm lại được bao nhiêu? Y khoa gọi đây là độ nhạy, vì xét nghiệm tốt phải phát hiện được người bệnh, điều Accuracy không nói lên.`,

    whyUse: `Recall đo chi phí của việc bỏ sót. Với sàng lọc ung thư, một FN có thể đắt gấp nhiều lần một FP, nên đây thường là ràng buộc đầu tiên.`,

    mechanism: `Mẫu số chỉ gồm ca dương thật, nên nếu phân phối điểm của lớp dương không đổi, Recall không đổi khi tỷ lệ lớp thay đổi.

Hạ ngưỡng thì Recall không giảm. Báo tất cả là dương thì Recall 100%, nên phải xem cùng [[eval-precision]].

**Điểm khó trong thực tế:** với gian lận, các ca không được báo thường không có nhãn, nên FN bị đếm thiếu và Recall bị lạc quan. Cách xử lý là kiểm tra ngẫu nhiên một phần các ca đó.`,

    example: `Sàng lọc 100 người bệnh trong 10.000 người, mô hình phát hiện 80 người, bỏ sót 20 người: Recall là 80%. Hạ ngưỡng để đạt Recall 95% thì FP tăng từ 320 lên 1.500. Nếu xét nghiệm xác nhận rẻ và an toàn, đánh đổi này đáng làm.`,

    prosCons: {
      pros: ['Gắn trực tiếp với chi phí của việc bỏ sót.', 'Ít bị ảnh hưởng bởi tỷ lệ lớp.'],
      cons: ['Đạt 100% quá dễ nếu báo tất cả.', 'Cần nhãn của cả các ca không được báo.'],
    },

    whenToUse: {
      use: ['Bỏ sót rất đắt: sàng lọc bệnh, phát hiện lỗi an toàn.', 'Có bước xác nhận sau, nên FP có thể chịu được.'],
      avoid: ['Mỗi cảnh báo tốn nhiều chi phí và năng lực có hạn.', 'Nhãn chỉ có trên các ca đã duyệt.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Recall', 'Precision', 'Specificity'],
      rows: [
        ['Công thức', 'TP / (TP + FN)', 'TP / (TP + FP)', 'TN / (TN + FP)'],
        ['Đạt tối đa khi', 'Báo tất cả là dương', 'Chỉ báo ca chắc chắn', 'Báo tất cả là âm'],
      ],
    },

    misconceptions: [
      {
        myth: 'Recall cao nghĩa là mô hình tốt.',
        truth: 'Báo tất cả là dương cũng được Recall 100%. Phải xem cùng Precision hoặc FPR.',
      },
      {
        myth: 'Recall đo được chính xác từ các ca đã duyệt trong production.',
        truth: 'FN bị đếm thiếu làm Recall cao hơn thực tế.',
      },
    ],
  },
})
