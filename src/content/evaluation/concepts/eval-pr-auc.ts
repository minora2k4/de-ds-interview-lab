import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-pr-auc',
  summary:
    'PR-AUC tóm tắt đường Precision theo Recall, tập trung vào lớp dương và không dùng TN. Mốc ngẫu nhiên bằng tỷ lệ lớp dương, không phải 0,5, nên phải đọc số này cùng với tỷ lệ đó.',
  tags: ['Phân loại', 'Xếp hạng', 'Mất cân bằng'],
  related: ['eval-roc-auc', 'eval-precision', 'eval-recall', 'eval-f1', 'eda-imbalanced'],
  sections: {
    definition: `**PR-AUC (Diện tích dưới đường Precision-Recall)** tóm tắt đường biểu diễn Precision theo Recall khi ngưỡng thay đổi. Trong thực hành thường tính bằng **Average Precision (AP)**.

Điểm khác biệt quan trọng: **mốc của mô hình ngẫu nhiên bằng tỷ lệ lớp dương (prevalence)**, trong khi mốc của [[eval-roc-auc|ROC-AUC]] luôn là 0,5.`,

    origin: `Đường này đến từ truy xuất thông tin, nơi số tài liệu không liên quan gần như vô hạn nên không dùng được TN. Davis và Goadrich (2006) chứng minh một đường trội trên ROC khi và chỉ khi trội trên PR, đồng thời chỉ ra nội suy tuyến tính trên PR là sai. Saito và Rehmsmeier (2015) đề xuất dùng nó thay ROC cho dữ liệu mất cân bằng, vì ROC có thể che số cảnh báo sai.`,

    whyUse: `- **Phản ánh trải nghiệm của người xử lý cảnh báo:** trong các ca được báo, có bao nhiêu ca đúng.
- **Nhạy với FP khi lớp dương hiếm,** vì Precision so FP với TP thay vì so với toàn bộ lớp âm.
- **Tập trung vào vùng điểm cao,** là vùng thường dùng để hành động.`,

    mechanism: `1. Sắp xếp mẫu theo điểm giảm dần.
2. Tại mỗi ngưỡng, tính Precision và Recall.
3. Tóm tắt bằng \`AP = tổng của (R_n - R_{n-1}) x P_n\`, tức trung bình Precision có trọng số theo phần Recall tăng thêm.

**Tính tay:** xếp hạng theo điểm là dương, dương, âm, dương, âm, dương, âm, âm. Precision tại các ca dương lần lượt là 1/1, 2/2, 3/4, 4/6. AP = (1 + 1 + 0,75 + 0,667) / 4 = 0,854. Tỷ lệ lớp dương là 4/8, nên mốc là 0,5.

**Tác động của mất cân bằng:** nhân mỗi ca âm lên 25 lần, cùng điểm số. ROC-AUC giữ nguyên 0,8125 vì thứ tự giữa hai lớp không đổi. Precision tại hai ca dương cuối giảm còn 3/28 và 4/54, nên AP = 0,545, và mốc giảm còn 4/104 = 0,038.

**Vì sao AP khác hình thang:** scikit-learn tính AP không nội suy. Tài liệu ghi rõ hình thang dùng nội suy tuyến tính có thể quá lạc quan, vì Precision không thay đổi tuyến tính giữa hai điểm và đường PR không đơn điệu. Vì vậy nên ghi rõ đã dùng cách tính nào.

**Mốc của tỷ lệ lớp:** mô hình ngẫu nhiên báo dương theo tỷ lệ nào thì Precision vẫn xấp xỉ tỷ lệ lớp, nên PR-AUC kỳ vọng xấp xỉ bằng mức đó. Có thể tính **lift** bằng PR-AUC chia cho tỷ lệ lớp để đọc cho dễ.`,

    example: `Mô hình chống gian lận trên dữ liệu có 0,5% ca dương:

- **Mô hình A:** ROC-AUC 0,95, PR-AUC 0,18.
- **Mô hình B:** ROC-AUC 0,94, PR-AUC 0,42.

ROC-AUC gần như bằng nhau, nhưng B gấp đôi A ở vùng hành động. Vì đội chống gian lận chỉ duyệt nhóm điểm cao nhất, nên chọn B.

Cách đọc số cũng cần chú ý. PR-AUC 0,20 với tỷ lệ dương 1% có lift 20 lần, rất có giá trị. Cùng 0,20 với tỷ lệ dương 15% chỉ có lift 1,3 lần, gần như vô dụng.`,

    prosCons: {
      pros: [
        '**Thấy rõ chi phí cảnh báo sai** khi lớp dương hiếm.',
        '**Không bị TN áp đảo,** vì không dùng TN.',
        '**Phù hợp khi chỉ hành động trên nhóm điểm cao.**',
      ],
      cons: [
        '**Phụ thuộc tỷ lệ lớp,** nên khó so sánh giữa hai tập, hai thị trường hay hai giai đoạn.',
        '**Phải chọn lớp nào là dương,** đổi lớp thì kết quả đổi.',
        '**Ít ổn định khi có quá ít ca dương,** vì vài ca đứng đầu có ảnh hưởng lớn.',
        '**Cách tính khác nhau cho số khác nhau,** dễ gây nhầm khi so sánh.',
      ],
    },

    whenToUse: {
      use: [
        'Lớp dương hiếm và là thứ cần phát hiện, như gian lận, bệnh hiếm, lỗi sản xuất.',
        'Người dùng chỉ xử lý nhóm mẫu có điểm cao nhất.',
        'So sánh các mô hình trên cùng một tập dữ liệu.',
      ],
      avoid: [
        'Không so sánh trực tiếp giữa các tập có tỷ lệ lớp khác nhau, trừ khi quy đổi về lift.',
        'Cả hai lớp đều quan trọng, hoặc cần kết quả công bằng giữa các nhóm có tỷ lệ dương khác nhau.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'PR-AUC', 'ROC-AUC'],
      rows: [
        ['Trục', 'Precision theo Recall', 'TPR theo FPR'],
        ['Mốc ngẫu nhiên', 'Tỷ lệ lớp dương', '0,5'],
        ['Dùng TN', 'Không', 'Có, qua FPR'],
        ['Khi thêm nhiều ca âm', 'Giảm', 'Giữ nguyên nếu phân phối điểm không đổi'],
        ['So sánh giữa tập khác tỷ lệ', 'Khó', 'Dễ hơn'],
        ['Trọng tâm', 'Vùng điểm cao', 'Đều trên toàn bộ ca dương'],
      ],
    },

    misconceptions: [
      {
        myth: 'PR-AUC 0,3 là thấp.',
        truth: 'Phải so với tỷ lệ lớp dương. Với 0,5% ca dương, con số đó cao gấp 60 lần mốc ngẫu nhiên.',
      },
      {
        myth: 'Mất cân bằng thì PR-AUC luôn tốt hơn ROC-AUC.',
        truth: 'McDermott và cộng sự (2024) cho thấy PR-AUC ưu tiên cải thiện ở vùng điểm cao, nên có thể thiên về nhóm có tỷ lệ dương cao hơn. Lựa chọn nên dựa vào cách dùng mô hình.',
      },
      {
        myth: 'AP và diện tích hình thang là cùng một số.',
        truth: 'Hai cách tính khác nhau và có thể cho kết quả chênh đáng kể. Hình thang có thể lạc quan hơn.',
      },
    ],
  },
})
