import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-gini',
  summary:
    'Gini Coefficient của mô hình phân loại được tính bằng 2 x AUC - 1. Ngẫu nhiên cho 0, hoàn hảo cho 1. Chỉ số này chứa cùng thông tin với ROC-AUC, chỉ đổi thang đo.',
  tags: ['Phân loại', 'Xếp hạng', 'Tín dụng'],
  related: ['eval-roc-auc', 'eval-pr-auc', 'eval-confusion-matrix', 'fe-woe', 'fe-iv'],
  sections: {
    definition: `**Gini Coefficient (Hệ số Gini)** tóm tắt khả năng xếp hạng của mô hình phân loại nhị phân: \`Gini = 2 x AUC - 1\`, trong đó AUC là [[eval-roc-auc|ROC-AUC]].`,

    origin: `Corrado Gini đề xuất hệ số này đầu thế kỷ 20 để đo bất bình đẳng thu nhập. Ngành tín dụng dùng lại ý tưởng để đo mức tách khách hàng tốt và xấu. Việc đổi thang giúp mô hình ngẫu nhiên có giá trị 0.`,

    whyUse: `Gini phổ biến trong báo cáo kiểm định mô hình tín dụng. Thang đo cũng tự nhiên: 0 là không tách được, 1 là tách hoàn hảo.`,

    mechanism: `Gini là phép biến đổi tuyến tính của AUC, tương ứng với diện tích giữa đường ROC và đường chéo, nhân 2:

- AUC 0,5 cho Gini 0.
- AUC 0,8125 cho Gini 0,625.
- AUC 1 cho Gini 1.
- AUC 0,4 cho Gini -0,2, tức xếp hạng ngược.

Với nhãn nhị phân, giá trị này trùng với **Somers' D** và **Accuracy Ratio** trên đường CAP. Lưu ý công thức dùng AUC của đường ROC, không dùng diện tích dưới đường CAP.`,

    example: `Mô hình tín dụng cũ có AUC 0,78, tức Gini 0,56. Mô hình mới có AUC 0,80, tức Gini 0,60. Gini tăng 0,04 nghe lớn gấp đôi AUC tăng 0,02, nhưng đây chỉ là khác thang đo.`,

    prosCons: {
      pros: ['Mốc ngẫu nhiên là 0, dễ đọc hơn.', 'Là ngôn ngữ chung của ngành tín dụng.'],
      cons: [
        'Không thêm thông tin so với AUC, nên có cùng giới hạn.',
        'Dễ nhầm với Gini Impurity và với Gini trong kinh tế học.',
      ],
    },

    whenToUse: {
      use: ['Báo cáo trong tín dụng, bảo hiểm, nơi đã quen thang đo này.'],
      avoid: ['Không báo cáo Gini và AUC như hai bằng chứng độc lập.', 'Không áp ngưỡng Gini của danh mục này cho danh mục khác.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Gini Coefficient', 'ROC-AUC', 'Gini Impurity'],
      rows: [
        ['Dùng để', 'Đánh giá xếp hạng', 'Đánh giá xếp hạng', 'Chọn điểm tách trong cây'],
        ['Khoảng giá trị', '-1 đến 1', '0 đến 1', '0 đến 1 - 1/K với K lớp'],
        ['Mức ngẫu nhiên', '0', '0,5', 'Không áp dụng'],
      ],
    },

    misconceptions: [
      {
        myth: 'Gini Coefficient và Gini Impurity là một.',
        truth: 'Gini Impurity đo độ lẫn trong một nút của cây, còn Gini Coefficient đo khả năng xếp hạng của cả mô hình.',
      },
      {
        myth: 'Gini tăng 0,04 thì cải thiện nhiều hơn AUC tăng 0,02.',
        truth: 'Đó là cùng một sự cải thiện, vì mọi khoảng chênh đều nhân đôi.',
      },
    ],
  },
})
