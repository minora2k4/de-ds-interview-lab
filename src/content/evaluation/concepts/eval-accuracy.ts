import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-accuracy',
  summary:
    'Accuracy là tỷ lệ dự đoán đúng trên tổng số mẫu. Với dữ liệu mất cân bằng, luôn đoán lớp đa số đã cho Accuracy rất cao.',
  tags: ['Phân loại', 'Mất cân bằng'],
  related: ['eval-confusion-matrix', 'eval-precision', 'eval-recall', 'eda-imbalanced'],
  sections: {
    definition: `**Accuracy (Độ chính xác tổng thể)** là tỷ lệ mẫu được dự đoán đúng: \`(TP + TN) / N\`, tính từ [[eval-confusion-matrix]].`,

    origin: `Đây là cách đo tự nhiên nhất. Nó phù hợp khi các lớp gần cân bằng và các lỗi có chi phí giống nhau. Khi không còn như vậy, người ta cần thêm Precision và Recall.`,

    whyUse: `Accuracy cho một con số dễ giải thích, và dùng tốt khi các lớp cân bằng, ví dụ phân loại ảnh có 10 lớp đều nhau.`,

    mechanism: `Mọi lỗi được tính như nhau, và số mẫu của mỗi lớp quyết định tầm ảnh hưởng của lớp đó. Lớp đa số vì vậy chi phối kết quả.

Luôn đoán lớp đa số cho Accuracy bằng tỷ lệ của lớp đó. Đây là **mốc so sánh tối thiểu**, nên hãy luôn tính nó trước khi đọc Accuracy.

**Balanced Accuracy** khắc phục điều này bằng cách lấy trung bình Recall của từng lớp, để mỗi lớp có trọng số bằng nhau. Mô hình đoán theo lớp đa số chỉ đạt 50% với hai lớp.`,

    example: `Với 10.000 giao dịch, 100 gian lận, mô hình có TP = 80, FN = 20, FP = 320, TN = 9.580. Accuracy là 96,6%, thấp hơn mức 99% của mô hình luôn đoán bình thường, dù mô hình đó không bắt được ca nào.

Balanced Accuracy kể câu chuyện khác: Recall lớp dương là 80%, Recall lớp âm là 96,8%, trung bình là 88,4%. Mô hình luôn đoán bình thường chỉ đạt 50%.`,

    prosCons: {
      pros: ['Dễ hiểu, dễ giải thích với nghiệp vụ.', 'Dùng được cho nhiều lớp mà không cần chọn lớp dương.'],
      cons: [
        'Che giấu việc bỏ sót lớp thiểu số khi dữ liệu lệch.',
        'Xem mọi lỗi như nhau, kể cả khi chi phí chênh hàng trăm lần.',
        'Phụ thuộc ngưỡng và tỷ lệ lớp.',
      ],
    },

    whenToUse: {
      use: ['Các lớp gần cân bằng và chi phí lỗi tương đương.', 'Báo cáo tổng quan, luôn kèm mốc của lớp đa số.'],
      avoid: ['[[eda-imbalanced|Dữ liệu mất cân bằng]]: nên xem [[eval-pr-auc]], Recall hoặc Balanced Accuracy.', 'Hai loại sai có chi phí rất khác nhau.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Accuracy', 'Balanced Accuracy', 'F1'],
      rows: [
        ['Trọng số giữa các lớp', 'Theo số mẫu', 'Bằng nhau', 'Chỉ lớp dương'],
        ['Đoán toàn lớp đa số, 1% dương', '99%', '50%', '0'],
        ['Dùng TN', 'Có', 'Có', 'Không'],
      ],
    },

    misconceptions: [
      {
        myth: 'Accuracy 96% nghĩa là mô hình tốt.',
        truth: 'Phải so với mốc. Với 99% mẫu thuộc lớp âm, 96% còn kém hơn việc không làm gì.',
      },
      {
        myth: 'Accuracy cao thì Precision và Recall cũng cao.',
        truth: 'Ví dụ trên có Accuracy 96,6% nhưng Precision chỉ 20%, vì TN chi phối Accuracy.',
      },
    ],
  },
})
