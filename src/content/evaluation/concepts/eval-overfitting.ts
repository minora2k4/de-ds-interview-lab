import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-overfitting',
  summary:
    'Overfitting là khi mô hình học cả nhiễu của dữ liệu huấn luyện, nên điểm Train cao nhưng điểm Validation thấp.',
  tags: ['Độ khớp', 'Tổng quát hóa'],
  related: ['eval-underfitting', 'eval-bias-variance', 'eval-train-val-test', 'eval-cross-validation', 'eda-leakage'],
  sections: {
    definition: `**Overfitting (Quá khớp)** là khi mô hình bám quá sát dữ liệu huấn luyện, học cả nhiễu và các chi tiết ngẫu nhiên, nên dự đoán kém trên dữ liệu mới.`,

    origin: `Sai số trên Train gần như luôn giảm khi mô hình phức tạp hơn, nên nó không cho biết lúc nào nên dừng. Khái niệm này nhắc rằng mục tiêu là tổng quát hóa, không phải ghi nhớ, và là lý do cần đo trên dữ liệu ngoài Train.`,

    whyUse: `Nhận ra overfit giúp bạn chọn đúng hướng sửa. Mô hình overfit cần bớt linh hoạt hoặc thêm dữ liệu, còn tăng độ phức tạp chỉ làm nặng thêm.`,

    mechanism: `Dữ liệu gồm quy luật và nhiễu. Mô hình đủ linh hoạt sẽ giảm sai số Train bằng cách khớp luôn nhiễu, trong khi nhiễu không lặp lại ở dữ liệu mới.

**Dấu hiệu:** điểm Train cao, điểm Validation thấp, và Validation xấu đi khi độ phức tạp tiếp tục tăng. Trên [[eval-bias-variance|learning curve]], hai đường cách xa nhau và dần gần lại khi có thêm dữ liệu.

**Cách xử lý:** thêm dữ liệu, thêm regularization, bớt đặc trưng nhiễu, giới hạn độ sâu cây, Early Stopping, hoặc Bagging.`,

    example: `Một cây quyết định không giới hạn độ sâu đạt AUC 0,99 trên Train, 0,71 trên Validation. Giới hạn độ sâu còn 6 thì Train còn 0,82, nhưng Validation tăng lên 0,79. Điểm Train giảm không phải là xấu đi, vì mô hình đã bớt ghi nhớ nhiễu.`,

    prosCons: {
      pros: ['Khoảng cách Train và Validation là tín hiệu dễ theo dõi.'],
      cons: ['Khoảng cách lớn cũng có thể đến từ việc hai tập khác phân phối, không chỉ do overfit.'],
    },

    whenToUse: {
      use: ['Nghi ngờ overfit khi Validation ngừng cải thiện trong lúc Train vẫn tăng.'],
      avoid: ['Không kết luận chỉ từ điểm Train cao. Hãy xem Validation có cải thiện hay không.'],
    },

    comparison: {
      headers: ['Tình trạng', 'Điểm Train', 'Điểm Validation', 'Điểm khi triển khai'],
      rows: [
        ['Overfitting', 'Cao', 'Thấp', 'Thấp, giống Validation'],
        ['[[eval-underfitting|Underfitting]]', 'Thấp', 'Thấp', 'Thấp'],
        ['[[eda-leakage|Rò rỉ dữ liệu]]', 'Cao', 'Cao', 'Thấp hơn nhiều'],
      ],
    },

    misconceptions: [
      {
        myth: 'Điểm Train gần tuyệt đối nghĩa là mô hình bị overfit.',
        truth: 'Random Forest thường có điểm Train rất cao mà Validation vẫn tốt. Điều cần xem là Validation có xấu đi không.',
      },
      {
        myth: 'Chỉ có tham số mô hình mới overfit được.',
        truth: 'Thử quá nhiều cấu hình cũng làm overfit Validation, nên điểm Validation của cấu hình tốt nhất bị lạc quan.',
      },
    ],
  },
})
