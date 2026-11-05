import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-eval-fi-01',
    topicId: 'evaluation',
    category: 'eval-explain',
    conceptIds: ['eval-feature-importance'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'So sánh Impurity Importance và Permutation Importance. Bạn dùng cái nào, khi nào?',
    referenceAnswer: `**Impurity Importance (MDI)** cộng mức giảm độ lẫn tại mọi lần tách dùng đặc trưng đó, tính trong lúc huấn luyện. Nó có sẵn và rẻ, nhưng tính trên Train và chỉ dùng được cho cây. Tài liệu scikit-learn nêu hai vấn đề: nó thiên về biến có nhiều giá trị, và có thể cho điểm cao đặc trưng vô nghĩa khi mô hình overfit.

**Permutation Importance** đo điểm số trên tập giữ lại, xáo trộn một cột, rồi lấy độ giảm. Nó không phụ thuộc loại mô hình, dùng được với chỉ số tôi quan tâm, và phản ánh khả năng tổng quát. Đánh đổi là tốn thời gian: số cột nhân số lần lặp nhân thời gian dự đoán. Nó cho điểm thấp với các biến tương quan, vì mô hình vẫn lấy được thông tin từ biến còn lại.

Tôi mặc định dùng Permutation trên Validation. Nếu có biến tương quan, tôi gom cụm rồi xáo theo nhóm. MDI tôi chỉ dùng để xem nhanh. Khoảng chênh giữa hai cách lại rất hữu ích: điểm MDI cao mà Permutation gần 0 cho thấy đặc trưng chỉ giúp khớp nhiễu. Một mẹo khác là thêm một cột ngẫu nhiên làm mốc.`,
    keyPoints: [
      { text: 'MDI tính từ độ giảm độ lẫn trên Train', keywords: ['độ lẫn', 'impurity', 'trên train'], weight: 2 },
      { text: 'MDI thiên về biến nhiều giá trị', keywords: ['nhiều giá trị', 'high cardinality', 'cardinality'], weight: 2 },
      { text: 'Permutation xáo cột trên tập giữ lại và đo độ giảm', keywords: ['xáo', 'shuffle', 'tập giữ lại', 'validation'], weight: 2 },
      { text: 'Permutation cho điểm thấp với biến tương quan', keywords: ['tương quan', 'correlated'] },
      { text: 'Khác biệt giữa hai cách phát hiện đặc trưng khớp nhiễu', keywords: ['khớp nhiễu', 'overfit', 'cột ngẫu nhiên'] },
    ],
    followUps: ['Vì sao Permutation không cần huấn luyện lại?', 'Xáo theo nhóm thực hiện thế nào?'],
    commonMistakes: ['Dùng MDI mặc định mà không biết nó tính trên Train.', 'Tính Permutation trên Train rồi kết luận về khả năng tổng quát.'],
  },
  {
    id: 'iv-eval-fi-02',
    topicId: 'evaluation',
    category: 'eval-explain',
    conceptIds: ['eval-feature-importance', 'eval-overfitting'],
    interviewTypes: ['ds'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao Impurity Importance lại thiên về các biến có nhiều giá trị? Hãy giải thích từ cách cây chọn điểm tách.',
    referenceAnswer: `Tại mỗi nút, cây thử mọi điểm tách của mọi đặc trưng được xét, rồi chọn điểm giảm độ lẫn nhiều nhất trên dữ liệu Train. Biến nhị phân chỉ có một điểm tách. Biến số có giá trị liên tục có thể có hàng nghìn điểm.

Đây là vấn đề **chọn giá trị lớn nhất trong nhiều phép thử**. Ngay cả khi biến không có quan hệ với nhãn, mức giảm độ lẫn tại mỗi điểm tách cũng dao động do nhiễu. Thử càng nhiều điểm, giá trị lớn nhất càng cao, nên biến nhiều giá trị dễ thắng nhờ may rủi.

Vấn đề thứ hai là cách tính: mức giảm được cộng dồn trên Train, nên mọi lần tách đều cộng điểm, kể cả những lần ở sâu trong cây chỉ khớp nhiễu trên vài mẫu. Không có bước nào kiểm tra trên dữ liệu mới. Ở nút sâu ít mẫu, biến nhiều giá trị càng dễ tách hoàn hảo.

Ví dụ Titanic của scikit-learn thêm một cột số ngẫu nhiên: MDI xếp nó vào nhóm quan trọng nhất, còn Permutation trên Test cho gần 0. Cách xử lý: dùng Permutation trên tập giữ lại, giới hạn độ sâu, hoặc dùng các thuật toán tách không lệch như Conditional Inference Trees của Strobl và cộng sự.`,
    keyPoints: [
      { text: 'Biến nhiều giá trị có nhiều điểm tách để thử', keywords: ['nhiều điểm tách', 'điểm tách', 'split'], weight: 2 },
      { text: 'Chọn giá trị lớn nhất trong nhiều phép thử nên thắng do may rủi', keywords: ['may rủi', 'giá trị lớn nhất', 'nhiều phép thử', 'nhiễu'], weight: 2 },
      { text: 'Tính cộng dồn trên Train, không kiểm tra trên dữ liệu mới', keywords: ['trên train', 'cộng dồn', 'dữ liệu mới'], weight: 2 },
      { text: 'Dùng Permutation trên tập giữ lại', keywords: ['permutation', 'tập giữ lại'] },
    ],
    followUps: ['Random Forest có giảm được độ lệch này không?', 'Target Encoding ảnh hưởng thế nào tới hiện tượng này?'],
    commonMistakes: ['Chỉ nói MDI thiên lệch mà không giải thích được cơ chế.', 'Đề xuất bỏ biến nhiều giá trị mà không kiểm tra.'],
  },
  {
    id: 'iv-eval-fi-03',
    topicId: 'evaluation',
    category: 'eval-explain',
    conceptIds: ['eval-feature-importance'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'SHAP hoạt động thế nào? Điểm mạnh và giới hạn của nó khi so với Permutation Importance là gì?',
    referenceAnswer: `SHAP dựa trên giá trị Shapley của lý thuyết trò chơi: xem mỗi đặc trưng là một người chơi, dự đoán là phần thưởng. Đóng góp của một đặc trưng là phần tăng thêm trung bình khi đưa nó vào, tính trên mọi tập con đặc trưng. Kết quả cộng được: giá trị cơ sở cộng tổng đóng góp bằng đầu ra của mô hình. Lundberg và Lee (2017) chứng minh đây là nghiệm duy nhất thỏa các tính chất như local accuracy và consistency.

Tính chính xác có chi phí mũ, nên thực tế dùng TreeSHAP cho cây, KernelSHAP để xấp xỉ.

**Điểm mạnh** là giải thích được từng dự đoán, cho biết hướng tác động và gộp được thành toàn cục. Permutation chỉ cho một con số toàn cục, nhưng nó gắn trực tiếp với điểm số trên dữ liệu giữ lại, nên trả lời câu hỏi về khả năng tổng quát rõ hơn. SHAP đo đóng góp vào dự đoán, nên một đặc trưng overfit vẫn có thể có SHAP lớn.

**Giới hạn:** biến tương quan bị chia công theo cách phụ thuộc phương pháp, chi phí cao với mô hình không phải cây, và thang log-odds khó đọc. Quan trọng nhất là dễ bị hiểu thành nhân quả.`,
    keyPoints: [
      { text: 'Dựa trên giá trị Shapley, trung bình trên mọi tập con', keywords: ['shapley', 'tập con', 'lý thuyết trò chơi'], weight: 2 },
      { text: 'Tính cộng được, tổng đóng góp bằng đầu ra', keywords: ['cộng được', 'giá trị cơ sở', 'local accuracy', 'additive'], weight: 2 },
      { text: 'Giải thích từng dự đoán, so với Permutation chỉ toàn cục', keywords: ['từng dự đoán', 'cục bộ', 'local', 'toàn cục'] },
      { text: 'Chi phí mũ, có TreeSHAP và KernelSHAP', keywords: ['treeshap', 'kernelshap', 'chi phí'] },
      { text: 'Giới hạn với biến tương quan và nhân quả', keywords: ['tương quan', 'nhân quả', 'chia công'] },
    ],
    followUps: ['Interventional và Observational SHAP khác nhau thế nào?', 'Vì sao cần chọn tập nền khi tính SHAP?'],
    commonMistakes: ['Xem SHAP là thước đo khả năng tổng quát.', 'Đọc giá trị trên log-odds như xác suất.'],
  },
  {
    id: 'iv-eval-fi-04',
    topicId: 'evaluation',
    category: 'eval-explain',
    conceptIds: ['eval-feature-importance', 'stats-correlation-causation'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Nghiệp vụ thấy SHAP chỉ ra số lần gọi tổng đài làm tăng rủi ro rời bỏ, nên muốn hạn chế khách gọi. Bạn phản hồi thế nào?',
    referenceAnswer: `Tôi giải thích rằng mô hình được huấn luyện để dự đoán, không phải để trả lời câu hỏi về can thiệp. SHAP cho biết **mô hình dựa vào số lần gọi để dự đoán**, nghĩa là có quan hệ thống kê. Nó không cho biết chuyện gì xảy ra nếu ta thay đổi số lần gọi.

Giải thích hợp lý hơn là có **nguyên nhân chung**: sản phẩm lỗi làm khách vừa gọi nhiều, vừa muốn rời đi. Số lần gọi chỉ là dấu hiệu. Hạn chế gọi không sửa lỗi, có thể còn làm khách rời đi nhanh hơn. Đặc trưng còn có thể bị rò rỉ, nếu có cuộc gọi đến để yêu cầu hủy.

Tôi đề xuất hướng làm cụ thể. Trước hết, phân tích lý do cuộc gọi để tìm giả thuyết. Sau đó, thiết kế **A/B test** với can thiệp thật như chủ động sửa lỗi, đo tỷ lệ rời bỏ làm chỉ số chính. Nếu không thể thí nghiệm, dùng phương pháp nhân quả trên dữ liệu quan sát và nêu rõ giả định.

Mô hình vẫn có giá trị: nó xác định nhóm rủi ro cao để can thiệp. Tôi cũng ghi rõ giới hạn này trong báo cáo, để người đọc không hiểu sai.`,
    keyPoints: [
      { text: 'SHAP mô tả mô hình, không mô tả tác động can thiệp', keywords: ['can thiệp', 'không phải nhân quả', 'mô tả mô hình', 'nhân quả'], weight: 2 },
      { text: 'Có thể có biến gây nhiễu là nguyên nhân chung', keywords: ['nguyên nhân chung', 'gây nhiễu', 'confounder'], weight: 2 },
      { text: 'Đề xuất A/B test', keywords: ['a b test', 'thí nghiệm', 'experiment'], weight: 2 },
      { text: 'Kiểm tra rò rỉ', keywords: ['rò rỉ', 'leak'] },
      { text: 'Mô hình vẫn dùng để nhắm nhóm rủi ro', keywords: ['nhóm rủi ro', 'nhắm', 'ưu tiên'] },
    ],
    followUps: ['Thiết kế A/B test này thế nào?', 'Uplift Modeling khác mô hình rời bỏ thế nào?'],
    commonMistakes: ['Đồng ý với đề xuất vì SHAP đã cho thấy tác động.', 'Chỉ phản đối mà không đề xuất cách kiểm chứng.'],
  },
  {
    id: 'iv-eval-cal-01',
    topicId: 'evaluation',
    category: 'eval-explain',
    conceptIds: ['eval-calibration', 'eval-roc-auc'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Calibration là gì? Vì sao mô hình có ROC-AUC cao vẫn có thể cho xác suất sai?',
    referenceAnswer: `Calibration là mức xác suất dự đoán khớp với tần suất thực tế: trong các mẫu có p khoảng 0,8, khoảng 80% phải thật sự dương.

ROC-AUC chỉ phụ thuộc thứ tự giữa các mẫu. Mọi phép biến đổi đơn điệu đều giữ nguyên thứ tự. Chia mọi xác suất cho 10 thì AUC không đổi, nhưng giá trị đã sai hẳn. Vậy hai tính chất này độc lập: có thể xếp hạng tốt mà xác suất sai, và ngược lại. Mô hình luôn đoán bằng tỷ lệ lớp dương có hiệu chỉnh tốt nhưng AUC chỉ 0,5.

Xác suất bị lệch có nhiều nguyên nhân. Random Forest lấy trung bình nên khó cho giá trị gần 0 hoặc 1. Mô hình biên lớn cho đường cong chữ S. Giảm lớp âm về 1:1 làm xác suất cao hơn thực tế.

Điều này quan trọng khi xác suất đi vào phép tính. Với 1.000 khoản vay điểm 0,20, mỗi khoản mất 100 triệu đồng nếu vỡ nợ, mô hình dự tính 20 tỷ đồng. Nếu thực tế chỉ 8% vỡ nợ thì tổn thất là 8 tỷ đồng. Tôi kiểm tra bằng Reliability Diagram và Brier Score. Nếu chỉ lấy top k mẫu thì không cần quá quan tâm.`,
    keyPoints: [
      { text: 'Xác suất dự đoán khớp với tần suất thực tế', keywords: ['tần suất', 'khớp', '80%'], weight: 2 },
      { text: 'AUC chỉ phụ thuộc thứ tự, nên biến đổi đơn điệu không đổi AUC', keywords: ['thứ tự', 'đơn điệu', 'xếp hạng'], weight: 2 },
      { text: 'Nguyên nhân lệch: mô hình trung bình, biên lớn, lấy mẫu lại', keywords: ['random forest', 'lấy mẫu', 'biên lớn', 'cân bằng lại'] },
      { text: 'Quan trọng khi xác suất đi vào phép tính', keywords: ['tổn thất', 'phép tính', 'định giá', 'chi phí'] },
      { text: 'Kiểm tra bằng Reliability Diagram và Brier', keywords: ['reliability', 'brier'] },
    ],
    followUps: ['Khi nào không cần Calibration?', 'Làm sao đọc một Reliability Diagram?'],
    commonMistakes: ['Nghĩ AUC cao thì xác suất đúng.', 'Nói hiệu chỉnh làm tăng AUC.'],
  },
  {
    id: 'iv-eval-cal-02',
    topicId: 'evaluation',
    category: 'eval-explain',
    conceptIds: ['eval-calibration'],
    interviewTypes: ['ds'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Platt Scaling và Isotonic Regression khác nhau thế nào? Bạn chọn dựa trên điều gì?',
    referenceAnswer: `Cả hai đều học một hàm biến điểm số thành xác suất, trên dữ liệu không dùng để huấn luyện.

**Platt Scaling** khớp hàm \`1 / (1 + exp(A x f + B))\`, chỉ có hai tham số. Nó giả định độ lệch có dạng chữ S, thường đúng với SVM. Ít tham số nên ít overfit và dùng được với dữ liệu ít. Vì đơn điệu nghiêm ngặt nên thứ tự giữ nguyên, ROC-AUC không đổi.

**Isotonic Regression** khớp hàm bậc thang không giảm, không giả định dạng nào ngoài tính đơn điệu. Nó sửa được nhiều kiểu lệch hơn. Đánh đổi là cần nhiều dữ liệu: tài liệu scikit-learn nói nó tốt bằng hoặc hơn khi có trên khoảng 1.000 mẫu, và dễ overfit khi ít hơn nhiều. Nó tạo ra giá trị hòa nên AUC có thể đổi nhẹ.

Tôi chọn dựa vào lượng dữ liệu hiệu chỉnh và hình dạng trên Reliability Diagram. Dữ liệu ít hoặc dạng chữ S thì dùng Platt. Dữ liệu nhiều và lệch phức tạp thì thử Isotonic. Sau đó so sánh trên tập riêng bằng Brier, Log Loss và biểu đồ. Với đa lớp, có thể cân nhắc Temperature Scaling, có trong scikit-learn từ phiên bản 1.8.`,
    keyPoints: [
      { text: 'Platt là hàm chữ S với hai tham số', keywords: ['chữ s', 'sigmoid', 'hai tham số', 'logistic'], weight: 2 },
      { text: 'Isotonic là hàm bậc thang không giảm', keywords: ['bậc thang', 'không giảm', 'phi tham số', 'non parametric'], weight: 2 },
      { text: 'Isotonic cần nhiều dữ liệu, dễ overfit khi ít', keywords: ['1.000', '1000', 'nhiều dữ liệu', 'overfit'], weight: 2 },
      { text: 'Platt giữ thứ tự, Isotonic tạo hòa', keywords: ['giữ thứ tự', 'giá trị hòa', 'ties'] },
      { text: 'Học trên dữ liệu riêng', keywords: ['dữ liệu riêng', 'ngoài fold', 'không dùng để huấn luyện'] },
    ],
    followUps: ['Thuật toán nào được dùng để khớp Isotonic Regression?', 'Hiệu chỉnh bằng dự đoán ngoài fold thế nào?'],
    commonMistakes: ['Luôn chọn Isotonic vì linh hoạt hơn.', 'Học bộ hiệu chỉnh trên Train.'],
  },
  {
    id: 'iv-eval-cal-03',
    topicId: 'evaluation',
    category: 'eval-explain',
    conceptIds: ['eval-calibration', 'eda-imbalanced', 'dq-drift'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Thiết kế quy trình để đảm bảo xác suất của một mô hình rủi ro tín dụng đáng tin khi vận hành, biết rằng mô hình được huấn luyện trên dữ liệu đã cân bằng lớp.',
    referenceAnswer: `Tôi bắt đầu từ việc chia dữ liệu theo thời gian: một phần để huấn luyện, một phần sau đó để hiệu chỉnh, phần mới nhất để Test. Phần hiệu chỉnh và Test phải giữ **tỷ lệ vỡ nợ thật**, vì huấn luyện trên dữ liệu 1:1 làm xác suất cao hơn thực tế. Có thể dùng hiệu chỉnh tiên nghiệm, nhưng tôi vẫn kiểm tra trên dữ liệu thật.

Tiếp theo tôi học bộ hiệu chỉnh: Platt nếu dữ liệu ít hoặc dạng chữ S, Isotonic nếu có đủ mẫu. Không dùng Train, không dùng Test.

Về đánh giá, tôi đo trên Test: Reliability Diagram chia theo phân vị, Brier và Log Loss so với mốc, AUC để chắc thứ tự không đổi. Tôi so sánh **tổng xác suất dự đoán với tổng ca vỡ nợ**, theo cả từng phân khúc, vì tổng thể đúng vẫn có thể che lệch ở từng nhóm.

Khi vận hành, nhãn vỡ nợ có độ trễ, nên tôi theo dõi trước phân phối điểm qua PSI, rồi đối chiếu tỷ lệ thực tế khi đủ thời gian. Nếu tỷ lệ nền đổi do kinh tế, tôi chỉ cần hiệu chỉnh lại mà không huấn luyện lại. Tôi đặt ngưỡng cảnh báo, ghi lại phiên bản bộ hiệu chỉnh cùng mô hình, và đưa vào quy trình kiểm định mô hình.`,
    keyPoints: [
      { text: 'Chia theo thời gian, hiệu chỉnh và Test giữ tỷ lệ thật', keywords: ['tỷ lệ thật', 'theo thời gian', 'tỷ lệ vỡ nợ'], weight: 2 },
      { text: 'Bộ hiệu chỉnh học trên dữ liệu riêng', keywords: ['dữ liệu riêng', 'tập hiệu chỉnh', 'không dùng train'], weight: 2 },
      { text: 'Đánh giá bằng Reliability Diagram, Brier, theo phân khúc', keywords: ['reliability', 'brier', 'phân khúc'] },
      { text: 'Theo dõi drift khi nhãn có độ trễ', keywords: ['psi', 'drift', 'độ trễ', 'phân phối điểm'], weight: 2 },
      { text: 'Hiệu chỉnh lại khi tỷ lệ nền thay đổi', keywords: ['hiệu chỉnh lại', 'tỷ lệ nền', 'recalibration'] },
    ],
    followUps: ['Làm sao hiệu chỉnh tiên nghiệm khi biết tỷ lệ lấy mẫu?', 'Khi nào phải huấn luyện lại thay vì chỉ hiệu chỉnh lại?'],
    commonMistakes: ['Đánh giá xác suất trên dữ liệu đã cân bằng.', 'Chỉ kiểm tra trên tổng thể mà không xem từng phân khúc.'],
  },
])
