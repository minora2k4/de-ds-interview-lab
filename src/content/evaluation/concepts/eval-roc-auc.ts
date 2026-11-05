import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-roc-auc',
  summary:
    'ROC-AUC là xác suất một ca dương ngẫu nhiên có điểm cao hơn một ca âm ngẫu nhiên. Mốc ngẫu nhiên là 0,5. Chỉ số này đo khả năng xếp hạng, không đo chất lượng xác suất, và có thể che số lượng FP khi lớp dương rất hiếm.',
  tags: ['Phân loại', 'Xếp hạng', 'Mất cân bằng', 'First Principles'],
  related: ['eval-pr-auc', 'eval-gini', 'eval-confusion-matrix', 'eval-recall', 'eval-calibration', 'eda-imbalanced'],
  sections: {
    definition: `**ROC-AUC (Diện tích dưới đường ROC)** tóm tắt đường **ROC (Receiver Operating Characteristic)**, là đường biểu diễn TPR theo FPR khi ngưỡng chạy từ cao xuống thấp.

Ý nghĩa cần nhớ: **AUC bằng xác suất một ca dương chọn ngẫu nhiên có điểm cao hơn một ca âm chọn ngẫu nhiên**, trường hợp hòa tính một nửa. Xếp hạng hoàn hảo cho 1, ngẫu nhiên cho 0,5.`,

    origin: `Đường ROC đến từ lý thuyết phát hiện tín hiệu thời radar, sau đó sang y khoa để đánh giá xét nghiệm. Hanley và McNeil (1982) chỉ ra ý nghĩa xác suất và mối liên hệ với kiểm định Wilcoxon. Trong học máy, nó khắc phục điểm yếu của Accuracy và F1 là phụ thuộc vào một ngưỡng và vào tỷ lệ lớp.`,

    whyUse: `- **So sánh mô hình khi chưa chốt ngưỡng,** vì tổng hợp trên mọi ngưỡng.
- **Ít phụ thuộc tỷ lệ lớp:** TPR và FPR đều chuẩn hóa trong lớp của chúng, nên nếu phân phối điểm của mỗi lớp giữ nguyên thì AUC không đổi.
- **Không phụ thuộc thang điểm:** đổi điểm bằng hàm đơn điệu tăng không làm thay đổi thứ tự, nên AUC giữ nguyên.`,

    mechanism: `1. Sắp xếp mẫu theo điểm giảm dần.
2. Hạ ngưỡng dần, mỗi mức cho một điểm (FPR, TPR).
3. Tính diện tích dưới đường nối các điểm.

**Tính tay bằng cách đếm cặp:** ca dương có điểm 0,9, 0,8, 0,6, 0,4; ca âm có điểm 0,7, 0,5, 0,3, 0,2. Có 4 x 4 = 16 cặp. Ca dương 0,9 và 0,8 thắng cả 4 ca âm, ca 0,6 thắng 3, ca 0,4 thắng 2. AUC = (4 + 4 + 3 + 2) / 16 = 13 / 16 = 0,8125.

**AUC dưới 0,5** nghĩa là xếp hạng ngược. Thường đó là dấu hiệu lỗi đảo nhãn, vì đảo điểm sẽ cho 1 - AUC.

**Vì sao chưa đủ với dữ liệu mất cân bằng:**

- **Mẫu số của FPR rất lớn,** nên số FP tăng mạnh chỉ làm FPR nhích rất ít. Trong khi người vận hành nhìn số FP tuyệt đối.
- **Tính trên mọi ngưỡng,** kể cả vùng FPR cao không bao giờ dùng. \`max_fpr\` trong scikit-learn cho phép tính partial AUC trên vùng cần quan tâm.
- **Không đo xác suất:** cần [[eval-calibration]] nếu dùng xác suất để ra quyết định.
- **Hai đường có thể cắt nhau,** nên cùng AUC vẫn có thể khác nhau ở vùng vận hành.

Tuy nhiên ROC-AUC không sai. Nó trả lời một câu hỏi khác, là thứ tự giữa hai lớp. Nghiên cứu của McDermott và cộng sự (2024) cho thấy lựa chọn nên dựa vào mục đích sử dụng, không chỉ vào độ mất cân bằng.`,

    example: `Có 1.000.000 dòng, 1.000 dòng dương (0,1%), và hai mô hình cùng TPR 80%:

- **Mô hình A:** FPR 1%, tức FP = 9.990. Precision = 800 / 10.790 = 7,4%.
- **Mô hình B:** FPR 0,1%, tức FP = 999. Precision = 800 / 1.799 = 44,5%.

Trên trục FPR, hai điểm chỉ cách nhau 0,9 điểm phần trăm, gần như trùng nhau trên biểu đồ. Nhưng đội vận hành phải xử lý gấp 6 lần số cảnh báo khi dùng A, và số cảnh báo sai gấp 10 lần. ROC-AUC của hai mô hình có thể chỉ chênh vài phần nghìn, còn chi phí vận hành chênh rất xa. Đây là lý do cần xem thêm [[eval-pr-auc]] hoặc Precision tại Recall mục tiêu.`,

    prosCons: {
      pros: [
        '**Không cần chọn ngưỡng,** phù hợp giai đoạn so sánh sớm.',
        '**Có ý nghĩa xác suất rõ ràng,** dễ tính lại bằng cách đếm cặp.',
        '**So sánh được giữa các tập có tỷ lệ lớp khác nhau,** nếu phân phối điểm trong từng lớp ổn định.',
      ],
      cons: [
        '**Có thể che số FP** khi lớp âm rất lớn.',
        '**Gộp cả những vùng không dùng tới** khi vận hành.',
        '**Không phản ánh chất lượng xác suất,** nên mô hình AUC cao vẫn có thể cho xác suất sai.',
      ],
    },

    whenToUse: {
      use: [
        'Cả hai lớp đều quan trọng, hoặc cần xếp hạng tổng thể.',
        'Ngưỡng có thể thay đổi, hoặc tỷ lệ lớp trong thực tế biến động.',
        'Theo dõi khả năng xếp hạng theo thời gian trên cùng một hệ thống.',
      ],
      avoid: [
        'Dùng làm chỉ số duy nhất khi chỉ hành động trên một nhóm rất nhỏ có điểm cao nhất.',
        'Khi quyết định dựa trên giá trị xác suất, như định giá theo rủi ro.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'ROC-AUC', 'PR-AUC', 'Log Loss'],
      rows: [
        ['Câu hỏi', 'Thứ tự giữa hai lớp', 'Chất lượng ở vùng báo dương', 'Chất lượng xác suất'],
        ['Mốc ngẫu nhiên', '0,5', 'Tỷ lệ lớp dương', 'Entropy của tỷ lệ lớp'],
        ['Dùng TN', 'Có, qua FPR', 'Không', 'Có'],
        ['Khi đổi thang điểm đơn điệu', 'Không đổi', 'Không đổi', 'Thay đổi'],
      ],
    },

    misconceptions: [
      {
        myth: 'AUC 0,5 là tệ nhất.',
        truth: 'AUC 0 là xếp hạng ngược hoàn toàn, đảo điểm thì thành hoàn hảo. Mức 0,5 mới là không có thông tin.',
      },
      {
        myth: 'ROC-AUC sai với dữ liệu mất cân bằng.',
        truth: 'Nó vẫn đúng với ý nghĩa của mình, nhưng không đo số cảnh báo sai. Vấn đề là chỉ dùng nó cho câu hỏi về Precision.',
      },
      {
        myth: 'AUC cao nghĩa là xác suất đáng tin.',
        truth: 'AUC chỉ phụ thuộc thứ tự. Chia mọi xác suất cho 10 thì AUC giữ nguyên, trong khi xác suất đã sai lệch nặng.',
      },
    ],
  },
})
