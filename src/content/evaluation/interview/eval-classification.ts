import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-eval-cm-01',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-confusion-matrix', 'eval-accuracy', 'eval-precision', 'eval-recall'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Confusion Matrix là gì? Với TP = 80, FN = 20, FP = 320, TN = 9.580, hãy tính các chỉ số chính và cho biết mô hình có tốt không.',
    referenceAnswer: `Confusion Matrix là bảng đếm theo nhãn thật và nhãn dự đoán tại một ngưỡng. Bốn ô là TP, FP, FN, TN, và mọi chỉ số đều tính từ đó.

Dữ liệu này có 100 ca dương trên 10.000 mẫu, tức 1%. Tôi tính:

- Accuracy = (80 + 9.580) / 10.000 = 96,6%.
- Precision = 80 / 400 = 20%.
- Recall = 80 / 100 = 80%.
- F1 = 2 x 80 / (160 + 320 + 20) = 0,32.
- FPR = 320 / 9.900 = 3,2%.

Accuracy 96,6% nghe cao, nhưng mô hình luôn đoán âm đã đạt 99%. Nên nó không cho biết điều gì. Điều đáng chú ý là mô hình bắt được 4/5 ca dương, nhưng cứ 5 cảnh báo thì có 4 cảnh báo sai.

Tốt hay không phụ thuộc vào chi phí. Với gian lận, nếu kiểm tra rẻ mà bỏ sót đắt thì kết quả này có thể chấp nhận. Nếu mỗi cảnh báo là khóa thẻ khách hàng, FP này quá nhiều, và tôi sẽ nâng ngưỡng hoặc cải thiện mô hình.`,
    keyPoints: [
      { text: 'Bảng đếm theo nhãn thật và dự đoán tại một ngưỡng', keywords: ['nhãn thật', 'nhãn dự đoán', 'ngưỡng', 'bảng đếm'] },
      { text: 'Tính đúng Precision 20%, Recall 80%', keywords: ['precision 20', 'recall 80', '20%', '80%'], weight: 2 },
      { text: 'Accuracy 96,6% thấp hơn mốc 99%', keywords: ['96,6', '99%', 'lớp đa số', 'luôn đoán âm'], weight: 2 },
      { text: 'Kết luận phụ thuộc chi phí của từng loại lỗi', keywords: ['chi phí', 'cost', 'nghiệp vụ'] },
    ],
    followUps: ['Ngưỡng tăng lên thì các ô thay đổi thế nào?', 'scikit-learn sắp xếp bốn ô này theo thứ tự nào?'],
    commonMistakes: ['Nhầm mẫu số của Precision và Recall.', 'Kết luận mô hình tốt chỉ vì Accuracy cao.'],
  },
  {
    id: 'iv-eval-cm-02',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-confusion-matrix', 'eval-f1', 'eval-train-val-test'],
    interviewTypes: ['ds'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bạn chọn ngưỡng phân loại thế nào khi biết chi phí của FP và FN?',
    referenceAnswer: `Nguyên tắc là chọn ngưỡng có tổng chi phí thấp nhất, đo trên Validation chứ không phải Test, vì ngưỡng cũng là một quyết định về mô hình.

Tôi lấy xác suất trên Validation, hoặc dự đoán ngoài fold, rồi quét các ngưỡng. Mỗi ngưỡng có một Confusion Matrix, và chi phí bằng \`FN x chi phí FN + FP x chi phí FP\`. Ví dụ FN mất 5 triệu, FP mất 50 nghìn. Ngưỡng A có FN = 20, FP = 320 nên tốn 116 triệu. Ngưỡng B có FN = 40, FP = 80 nên tốn 204 triệu. F1 của B là 0,5, cao hơn 0,32 của A, nhưng A rẻ hơn hẳn. F1 ngầm giả định hai loại lỗi có trọng số bằng nhau.

Nếu xác suất đã được hiệu chỉnh tốt, có công thức lý thuyết: báo dương khi \`p > chi phí FP / (chi phí FP + chi phí FN)\`, ở đây khoảng 0,0099. Công thức này cho thấy ngưỡng 0,5 không có gì đặc biệt.

Tôi cũng thêm các ràng buộc thực tế, như năng lực kiểm tra mỗi ngày. Tỷ lệ lớp và chi phí có thể đổi theo thời gian, nên cần theo dõi và chọn lại ngưỡng.`,
    keyPoints: [
      { text: 'Chọn ngưỡng có tổng chi phí thấp nhất', keywords: ['chi phí thấp nhất', 'tổng chi phí', 'cost'], weight: 2 },
      { text: 'Làm trên Validation, không làm trên Test', keywords: ['validation', 'ngoài fold', 'không dùng test'], weight: 2 },
      { text: 'F1 không phản ánh chi phí khác nhau', keywords: ['f1', 'trọng số bằng nhau'] },
      { text: 'Công thức ngưỡng từ xác suất đã hiệu chỉnh', keywords: ['hiệu chỉnh', 'calibration', 'công thức ngưỡng'] },
      { text: 'Tính đến ràng buộc năng lực vận hành', keywords: ['năng lực', 'ràng buộc', 'capacity'] },
    ],
    followUps: ['Nếu không biết chính xác chi phí thì làm thế nào?', 'Vì sao công thức lý thuyết cần xác suất đã được hiệu chỉnh?'],
    commonMistakes: ['Mặc định dùng ngưỡng 0,5.', 'Chọn ngưỡng trên Test.', 'Chọn theo F1 khi đã biết chi phí.'],
  },
  {
    id: 'iv-eval-cm-03',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-confusion-matrix', 'eval-f1'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Mô hình đa lớp có Accuracy cao nhưng khách hàng vẫn phàn nàn. Bạn dùng Confusion Matrix để tìm vấn đề thế nào?',
    referenceAnswer: `Accuracy gộp tất cả các lớp, nên lớp lớn có thể che lớp nhỏ. Tôi xem ma trận K x K, với hàng là nhãn thật, cột là nhãn dự đoán.

Tôi **chuẩn hóa theo hàng** trước, để mỗi hàng cho biết các ca thật của lớp đó đi về đâu. Giá trị đường chéo sau khi chuẩn hóa là Recall của lớp. Nhờ vậy lớp có 100 mẫu vẫn dễ đọc như lớp có 9.000 mẫu. Sau đó tôi chuẩn hóa theo cột để xem Precision của từng lớp.

Tiếp theo tôi tìm **ô lớn ngoài đường chéo**. Ví dụ 60% sự cố bảo mật bị đoán thành hỗ trợ thông thường. Thông tin này cho biết cách xử lý cụ thể: thêm đặc trưng để tách hai lớp đó, xem lại nhãn xem có bị định nghĩa chồng lấn không, hoặc gộp hai lớp nếu nghiệp vụ không cần phân biệt.

Tôi cũng so với chi phí nghiệp vụ, vì không phải nhầm lẫn nào cũng nặng như nhau. Sau đó báo cáo Macro F1 và F1 từng lớp, vì Micro F1 trong bài toán một nhãn chỉ bằng Accuracy.`,
    keyPoints: [
      { text: 'Accuracy bị lớp lớn chi phối', keywords: ['lớp lớn', 'che', 'chi phối'] },
      { text: 'Chuẩn hóa theo hàng để đọc Recall từng lớp', keywords: ['chuẩn hóa', 'theo hàng', 'recall từng lớp'], weight: 2 },
      { text: 'Tìm ô lớn ngoài đường chéo', keywords: ['ngoài đường chéo', 'cặp lớp', 'nhầm lẫn'], weight: 2 },
      { text: 'Hành động: đặc trưng, nhãn, gộp lớp', keywords: ['thêm đặc trưng', 'xem lại nhãn', 'gộp lớp'] },
      { text: 'Báo cáo Macro F1 và F1 từng lớp', keywords: ['macro f1', 'f1 từng lớp'] },
    ],
    followUps: ['Macro F1 và Weighted F1 khác nhau thế nào?', 'Nếu hai lớp bị nhầm vì nhãn không nhất quán thì xử lý thế nào?'],
    commonMistakes: ['Chỉ nhìn số đếm tuyệt đối mà không chuẩn hóa.', 'Dùng Micro F1 để đánh giá lớp hiếm.'],
  },
  {
    id: 'iv-eval-acc-01',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-accuracy', 'eda-imbalanced'],
    interviewTypes: ['ds'],
    levels: ['fresher'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Mô hình của bạn đạt Accuracy 99%. Sếp rất vui. Bạn sẽ nói gì?',
    referenceAnswer: `Tôi sẽ kiểm tra tỷ lệ lớp trước khi vui cùng. Accuracy xem mọi lỗi như nhau, và lớp đông mẫu quyết định kết quả. Nếu dữ liệu có 1% ca dương, mô hình luôn đoán âm đã đạt 99% mà không bắt được ca nào.

Vì vậy tôi làm ba việc. Thứ nhất, so với mốc của lớp đa số, tức tỷ lệ của lớp đó. Thứ hai, xem Confusion Matrix và các chỉ số theo lớp: Recall cho biết bắt được bao nhiêu ca, Precision cho biết cảnh báo có đáng tin không. Balanced Accuracy cũng hữu ích, vì lấy trung bình Recall của từng lớp nên mô hình đoán toàn lớp đa số chỉ được 50%. Thứ ba, hỏi nghiệp vụ về chi phí của bỏ sót và báo nhầm.

Accuracy vẫn dùng được khi các lớp gần cân bằng và các lỗi có chi phí tương đương, ví dụ phân loại ảnh 10 lớp đều nhau. Nếu đúng là các lớp cân bằng, 99% có thể lại là quá tốt, và tôi sẽ kiểm tra rò rỉ dữ liệu.`,
    keyPoints: [
      { text: 'Kiểm tra tỷ lệ lớp, so với mốc lớp đa số', keywords: ['tỷ lệ lớp', 'lớp đa số', 'mất cân bằng', 'luôn đoán âm'], weight: 2 },
      { text: 'Xem Precision, Recall, Confusion Matrix', keywords: ['precision', 'recall', 'confusion matrix'], weight: 2 },
      { text: 'Hỏi chi phí của từng loại lỗi', keywords: ['chi phí', 'nghiệp vụ'] },
      { text: 'Accuracy phù hợp khi cân bằng', keywords: ['cân bằng', 'chi phí tương đương'] },
      { text: 'Quá cao có thể là rò rỉ dữ liệu', keywords: ['rò rỉ', 'leak'] },
    ],
    followUps: ['Balanced Accuracy được tính thế nào?', 'Bạn sẽ báo cáo con số nào cho sếp?'],
    commonMistakes: ['Không hỏi về tỷ lệ lớp.', 'Nói Accuracy luôn vô dụng.'],
  },
  {
    id: 'iv-eval-prec-01',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-precision', 'eval-recall'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Precision và Recall khác nhau thế nào? Cho ví dụ khi nào ưu tiên từng chỉ số.',
    referenceAnswer: `Cả hai có cùng tử số TP, nhưng khác mẫu số, tức khác câu hỏi.

**Precision** = TP / (TP + FP): trong các ca mô hình báo dương, bao nhiêu ca đúng. Nó đo chi phí của báo nhầm. **Recall** = TP / (TP + FN): trong các ca dương thật, bắt được bao nhiêu. Nó đo chi phí của bỏ sót.

Với cùng một mô hình, hai chỉ số thường đánh đổi: tăng ngưỡng làm Precision thường tăng, Recall giảm.

Tôi ưu tiên **Recall** khi bỏ sót rất đắt và có bước xác nhận sau, như sàng lọc ung thư. Tôi ưu tiên **Precision** khi mỗi cảnh báo tốn nhiều chi phí, như khóa tài khoản, hay khi đội kiểm tra chỉ xử lý được 200 ca mỗi ngày. Trong thực tế tôi thường đặt một ràng buộc và tối ưu chỉ số còn lại, ví dụ Recall tối đa với Precision ít nhất 50%.

Lưu ý là Precision phụ thuộc tỷ lệ lớp: cùng Recall 80%, FPR 3,23%, Precision là 20% khi 1% ca dương, nhưng khoảng 73% khi 10% ca dương. Recall thì thường không bị ảnh hưởng.`,
    keyPoints: [
      { text: 'Precision có mẫu số là số ca báo dương', keywords: ['tp + fp', 'báo dương', 'báo nhầm'], weight: 2 },
      { text: 'Recall có mẫu số là số ca dương thật', keywords: ['tp + fn', 'dương thật', 'bỏ sót'], weight: 2 },
      { text: 'Hai chỉ số đánh đổi khi đổi ngưỡng', keywords: ['đánh đổi', 'ngưỡng', 'tradeoff'] },
      { text: 'Ví dụ ưu tiên từng chỉ số theo chi phí', keywords: ['sàng lọc', 'ung thư', 'khóa tài khoản', 'chi phí'] },
      { text: 'Precision phụ thuộc tỷ lệ lớp', keywords: ['tỷ lệ lớp', 'prevalence'] },
    ],
    followUps: ['Vì sao Precision phụ thuộc tỷ lệ lớp còn Recall thì không?', 'Precision@k là gì?'],
    commonMistakes: ['Nhầm mẫu số của hai chỉ số.', 'Chỉ học thuộc công thức mà không nêu được ví dụ theo chi phí.'],
  },
  {
    id: 'iv-eval-rec-01',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-recall', 'dq-label-quality'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Làm sao đo Recall của mô hình gian lận trong production, khi chỉ các giao dịch bị báo mới được kiểm tra?',
    referenceAnswer: `Recall cần FN, tức các ca gian lận mà mô hình không báo. Nhưng nếu chỉ các ca được báo mới có nhãn, FN gần như không quan sát được. Coi các ca không kiểm tra là âm sẽ làm FN bị đếm thiếu, và Recall cao hơn thực tế. Điều này cũng ảnh hưởng tới dữ liệu huấn luyện lần sau, vì nhãn mới phụ thuộc vào chính mô hình cũ.

Tôi có một số cách. **Kiểm tra ngẫu nhiên:** lấy mẫu một phần các giao dịch không được báo để con người kiểm tra. Ví dụ duyệt 5.000 ca trong 1 triệu ca không báo và thấy 10 ca gian lận, tức ước lượng 2.000 FN. Có thể lấy mẫu phân tầng theo điểm để tăng số ca dương, rồi hiệu chỉnh trọng số khi ước lượng. **Cho một phần nhỏ giao dịch đi qua:** giữ một tỷ lệ nhỏ không can thiệp để quan sát kết quả thật. **Dùng nhãn trễ:** khiếu nại và hoàn tiền cuối cùng cũng lộ ra một phần FN, nên cần chờ đủ độ trễ của nhãn.

Tôi báo cáo Recall kèm khoảng tin cậy và ghi rõ giả định, vì chi phí kiểm tra ngẫu nhiên có giới hạn.`,
    keyPoints: [
      { text: 'FN không quan sát được làm Recall bị thổi cao', keywords: ['fn', 'không quan sát', 'đếm thiếu', 'thổi cao'], weight: 2 },
      { text: 'Kiểm tra ngẫu nhiên các ca không được báo', keywords: ['kiểm tra ngẫu nhiên', 'lấy mẫu', 'random audit'], weight: 2 },
      { text: 'Lấy mẫu phân tầng và hiệu chỉnh trọng số', keywords: ['phân tầng', 'trọng số'] },
      { text: 'Nhóm đối chứng không can thiệp', keywords: ['đối chứng', 'không can thiệp', 'holdout'] },
      { text: 'Chờ nhãn trễ như khiếu nại', keywords: ['nhãn trễ', 'khiếu nại', 'độ trễ'] },
    ],
    followUps: ['Vòng phản hồi này ảnh hưởng thế nào tới việc huấn luyện lại?', 'Cần lấy mẫu bao nhiêu để có khoảng tin cậy đủ hẹp?'],
    commonMistakes: ['Tính Recall chỉ từ các ca đã được kiểm tra.', 'Xem các ca chưa kiểm tra là âm mà không nêu giả định.'],
  },
  {
    id: 'iv-eval-f1-01',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-f1', 'eval-precision', 'eval-recall'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao F1 dùng trung bình điều hòa? Khi nào F1 lại dẫn tới quyết định sai?',
    referenceAnswer: `Precision và Recall có cùng tử số TP nhưng khác mẫu số. Khi các đại lượng là tỷ lệ với cùng tử số, trung bình điều hòa là cách lấy trung bình tự nhiên: F1 bằng \`2TP / (2TP + FP + FN)\`, tức TP so với trung bình của hai mẫu số.

Về ý nghĩa, nó bị kéo về giá trị nhỏ hơn. Với P = 1, R = 0,01, trung bình cộng là 0,505, nghe như một mô hình trung bình, trong khi nó bỏ sót 99% ca dương. F1 chỉ 0,0198, phản ánh đúng hơn.

F1 dẫn tới quyết định sai trong vài trường hợp. **Chi phí lỗi khác nhau:** F1 cho hai loại lỗi trọng số bằng nhau. Nếu FN đắt gấp 100 lần FP, một ngưỡng có F1 thấp hơn lại có thể rẻ hơn nhiều. **Lớp âm quan trọng:** F1 không dùng TN. **So sánh giữa các tập:** F1 phụ thuộc tỷ lệ lớp. **So sánh mô hình:** F1 phụ thuộc ngưỡng, nên có thể mô hình tốt hơn lại thua vì chưa chọn ngưỡng phù hợp.

Nếu cần lệch về một phía, F-beta có thể giúp. Nhưng khi đã có chi phí, tôi tính thẳng chi phí.`,
    keyPoints: [
      { text: 'Trung bình điều hòa phạt sự chênh lệch', keywords: ['điều hòa', 'chênh lệch', 'giá trị nhỏ hơn'], weight: 2 },
      { text: 'Công thức 2TP / (2TP + FP + FN)', keywords: ['2tp', 'cùng tử số'] },
      { text: 'F1 giả định hai loại lỗi cùng trọng số', keywords: ['cùng trọng số', 'trọng số bằng nhau', 'chi phí'], weight: 2 },
      { text: 'F1 bỏ qua TN', keywords: ['tn', 'true negative', 'lớp âm'] },
      { text: 'F1 phụ thuộc ngưỡng và tỷ lệ lớp', keywords: ['phụ thuộc ngưỡng', 'tỷ lệ lớp'] },
    ],
    followUps: ['F2 khác F1 thế nào?', 'Macro và Micro F1 khác nhau thế nào?'],
    commonMistakes: ['Chỉ nói là để cân bằng Precision và Recall.', 'Xem F1 là chỉ số tốt nhất cho mọi dữ liệu mất cân bằng.'],
  },
  {
    id: 'iv-eval-roc-01',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-roc-auc'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'ROC-AUC thực sự đo điều gì? Vì sao giá trị 0,5 lại là mức ngẫu nhiên?',
    referenceAnswer: `Đường ROC vẽ TPR theo FPR khi hạ ngưỡng dần. Nhưng ý nghĩa dễ dùng nhất của AUC là: **xác suất một ca dương ngẫu nhiên có điểm cao hơn một ca âm ngẫu nhiên**, hòa tính một nửa. Vì vậy nó đo khả năng xếp hạng.

Có thể tính bằng cách đếm cặp. Ca dương có điểm 0,9, 0,8, 0,6, 0,4 và ca âm có điểm 0,7, 0,5, 0,3, 0,2. Trong 16 cặp có 13 cặp đúng thứ tự, nên AUC = 0,8125.

Mức 0,5 là ngẫu nhiên vì nếu điểm số không chứa thông tin, ca dương và ca âm có cùng phân phối điểm, nên mỗi cặp có 50% khả năng đúng thứ tự. Trên hình, tại mọi ngưỡng TPR xấp xỉ FPR, nên đường ROC là đường chéo, diện tích là 0,5. Mức này không phụ thuộc tỷ lệ lớp, vì TPR và FPR đều chuẩn hóa trong lớp của chúng.

Từ đó suy ra vài tính chất: biến đổi đơn điệu không làm đổi AUC, nên AUC không nói gì về độ đúng của xác suất. AUC dưới 0,5 nghĩa là xếp ngược, thường do đảo nhãn.`,
    keyPoints: [
      { text: 'Xác suất ca dương có điểm cao hơn ca âm', keywords: ['ca dương', 'cao hơn ca âm', 'xác suất', 'cặp'], weight: 2 },
      { text: 'Đo khả năng xếp hạng', keywords: ['xếp hạng', 'thứ tự', 'ranking'], weight: 2 },
      { text: '0,5 vì hai lớp có cùng phân phối điểm', keywords: ['cùng phân phối', 'đường chéo', 'không có thông tin'] },
      { text: 'Không đổi khi biến đổi đơn điệu', keywords: ['đơn điệu', 'monotonic'] },
      { text: 'Dưới 0,5 là xếp ngược', keywords: ['xếp ngược', 'đảo nhãn'] },
    ],
    followUps: ['AUC liên hệ với kiểm định Mann-Whitney thế nào?', 'Multi-class ROC-AUC được tính thế nào?'],
    commonMistakes: ['Nói AUC là Accuracy trên mọi ngưỡng.', 'Nói AUC 0,8 nghĩa là đúng 80%.'],
  },
  {
    id: 'iv-eval-roc-02',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-roc-auc', 'eval-pr-auc', 'eda-imbalanced', 'eval-calibration'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Tại sao ROC-AUC chưa đủ để đánh giá mọi mô hình phân loại dữ liệu mất cân bằng?',
    referenceAnswer: `Tôi bắt đầu từ việc ROC-AUC đo gì: xác suất ca dương có điểm cao hơn ca âm. TPR và FPR đều chuẩn hóa trong lớp của chúng, nên mốc ngẫu nhiên luôn là 0,5. Đó là điểm mạnh, nhưng cũng tạo ra các giới hạn.

**Một là che số FP.** Mẫu số của FPR là toàn bộ lớp âm. Với 1.000.000 dòng và 1.000 ca dương, cùng TPR 80%: mô hình A có FPR 1% tức 9.990 FP, Precision 7,4%; mô hình B có FPR 0,1% tức 999 FP, Precision 44,5%. Trên đường ROC hai điểm gần như trùng nhau, nhưng đội vận hành xử lý gấp 6 lần số cảnh báo.

**Hai là tính trên mọi ngưỡng,** kể cả vùng không bao giờ dùng. Hai đường có thể cắt nhau mà AUC bằng nhau.

**Ba là không đo xác suất,** nên không đủ nếu xác suất dùng để định giá.

Vì vậy tôi thêm PR-AUC so với mốc bằng tỷ lệ lớp dương, Precision tại Recall mục tiêu hoặc Recall tại FPR cho phép, partial AUC, chi phí, và Calibration.

Nhưng ROC-AUC không sai. PR-AUC cũng không phải luôn hơn: McDermott và cộng sự (2024) chỉ ra nó ưu tiên vùng điểm cao, có thể thiên về nhóm có tỷ lệ dương cao. Lựa chọn nên dựa vào cách dùng mô hình.`,
    keyPoints: [
      { text: 'ROC-AUC đo xếp hạng, TPR và FPR chuẩn hóa trong từng lớp', keywords: ['xếp hạng', 'chuẩn hóa', 'thứ tự'], weight: 1 },
      { text: 'Mẫu số FPR lớn nên che số FP tuyệt đối', keywords: ['mẫu số', 'số fp', 'che', 'fpr nhỏ', 'lớp âm rất lớn'], weight: 2 },
      { text: 'Tính cả vùng ngưỡng không dùng, đường có thể cắt nhau', keywords: ['mọi ngưỡng', 'cắt nhau', 'partial auc', 'vùng vận hành'] },
      { text: 'Không đo chất lượng xác suất', keywords: ['xác suất', 'calibration', 'hiệu chỉnh'] },
      { text: 'Bổ sung PR-AUC với mốc bằng tỷ lệ lớp dương', keywords: ['pr auc', 'tỷ lệ lớp dương', 'prevalence', 'precision tại recall'], weight: 2 },
      { text: 'ROC-AUC không sai, chọn theo mục đích sử dụng', keywords: ['không sai', 'mục đích', 'cách dùng', 'tùy mục đích'] },
    ],
    followUps: ['Khi nào ROC-AUC vẫn là lựa chọn tốt hơn PR-AUC?', 'Nếu tỷ lệ gian lận tháng sau giảm một nửa thì hai chỉ số thay đổi thế nào?', 'Bạn trình bày kết quả cho đội vận hành bằng con số nào?'],
    commonMistakes: ['Chỉ nói ROC-AUC sai với dữ liệu mất cân bằng.', 'Không đưa được ví dụ số.', 'Quên rằng PR-AUC có mốc bằng tỷ lệ lớp dương.'],
  },
  {
    id: 'iv-eval-roc-03',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-roc-auc', 'stats-confidence-interval'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Mô hình mới có ROC-AUC cao hơn mô hình cũ 0,005. Bạn có triển khai không?',
    referenceAnswer: `Tôi không quyết định chỉ từ con số này. Tôi trả lời hai câu hỏi: khoảng chênh có thật không, và có đáng giá không.

**Có thật không?** Tôi so sánh trên cùng Test, hoặc so sánh theo cặp, vì hai mô hình cùng dữ liệu nên điểm số tương quan. Tôi dùng Bootstrap theo cặp hoặc kiểm định DeLong để có khoảng tin cậy cho hiệu số. Độ chính xác của AUC phụ thuộc mạnh vào số ca dương: 200 ca dương cho khoảng rộng, dù tổng dữ liệu là hàng triệu dòng. Tôi cũng kiểm tra theo Time Series Split và theo từng nhóm khách hàng để xem kết quả có ổn định không.

**Có đáng giá không?** Hai đường ROC có thể cắt nhau, nên tôi xem tại điểm vận hành: Recall tại FPR cho phép, hoặc Precision tại Recall mục tiêu, rồi quy đổi ra tiền. Một khoảng chênh nhỏ của AUC có thể rất lớn nếu nằm đúng vùng vận hành.

Tôi cũng tính chi phí đổi: thêm đặc trưng phức tạp, độ trễ, rủi ro khi triển khai, độ khó giải thích. Nếu mọi thứ vẫn tích cực, tôi chạy thử A/B hoặc shadow trước khi triển khai toàn bộ.`,
    keyPoints: [
      { text: 'Kiểm tra khoảng chênh có ý nghĩa thống kê', keywords: ['khoảng tin cậy', 'bootstrap', 'delong', 'theo cặp'], weight: 2 },
      { text: 'Độ chính xác phụ thuộc số ca dương', keywords: ['số ca dương', 'ít ca dương'] },
      { text: 'So sánh tại điểm vận hành và quy đổi ra tiền', keywords: ['điểm vận hành', 'quy đổi', 'recall tại', 'precision tại'], weight: 2 },
      { text: 'Tính chi phí đổi mô hình', keywords: ['chi phí đổi', 'độ trễ', 'độ phức tạp'] },
      { text: 'Thử A/B hoặc shadow', keywords: ['a b', 'shadow', 'thử nghiệm'] },
    ],
    followUps: ['Kiểm định DeLong dựa trên ý tưởng gì?', 'Nếu A/B không cho kết quả rõ ràng thì sao?'],
    commonMistakes: ['Triển khai ngay vì điểm cao hơn.', 'Bỏ qua việc khoảng chênh có thể do nhiễu.'],
  },
  {
    id: 'iv-eval-pr-01',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-pr-auc', 'eval-roc-auc'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao mốc ngẫu nhiên của PR-AUC bằng tỷ lệ lớp dương, còn của ROC-AUC là 0,5? Điều này thay đổi cách đọc số ra sao?',
    referenceAnswer: `Giả sử điểm số không chứa thông tin. Khi đó mọi cách chọn mẫu theo điểm đều giống chọn ngẫu nhiên.

**Với PR:** tại bất kỳ mức Recall nào, tập được báo dương chỉ là một mẫu ngẫu nhiên của dữ liệu, nên tỷ lệ ca dương trong đó xấp xỉ tỷ lệ chung. Precision xấp xỉ tỷ lệ lớp dương trên mọi mức Recall, nên đường PR gần như nằm ngang tại đó, và diện tích bằng tỷ lệ lớp dương.

**Với ROC:** chọn ngẫu nhiên x% mẫu thì bắt được x% ca dương và x% ca âm, nên TPR bằng FPR. Đường ROC là đường chéo, diện tích 0,5, không phụ thuộc tỷ lệ lớp.

Cách đọc số vì vậy khác hẳn. PR-AUC 0,20 với 1% ca dương cao gấp 20 lần mốc, rất có giá trị. Cùng 0,20 với 15% ca dương chỉ gấp 1,3 lần, gần như vô dụng. Vì thế tôi luôn báo cáo kèm tỷ lệ lớp dương, hoặc dùng lift. PR-AUC cũng không so sánh trực tiếp được giữa hai thị trường hay hai giai đoạn có tỷ lệ khác nhau, còn ROC-AUC thì dễ hơn nếu phân phối điểm ổn định.`,
    keyPoints: [
      { text: 'PR: Precision của mô hình ngẫu nhiên xấp xỉ tỷ lệ lớp dương', keywords: ['tỷ lệ lớp dương', 'prevalence', 'nằm ngang'], weight: 2 },
      { text: 'ROC: TPR bằng FPR nên diện tích 0,5', keywords: ['đường chéo', 'tpr bằng fpr', '0,5'], weight: 2 },
      { text: 'Phải đọc PR-AUC so với mốc, có thể dùng lift', keywords: ['lift', 'so với mốc', 'gấp 20 lần'], weight: 2 },
      { text: 'Khó so sánh PR-AUC giữa các tỷ lệ lớp khác nhau', keywords: ['không so sánh', 'hai thị trường', 'khác tỷ lệ'] },
    ],
    followUps: ['Với số ca dương rất ít, PR-AUC của mô hình ngẫu nhiên có đúng bằng tỷ lệ lớp không?', 'Nếu lớp dương thành lớp âm thì PR-AUC đổi thế nào?'],
    commonMistakes: ['Dùng 0,5 làm mốc cho PR-AUC.', 'So sánh PR-AUC giữa hai tập mà không nêu tỷ lệ lớp.'],
  },
  {
    id: 'iv-eval-pr-02',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-pr-auc'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Average Precision được tính thế nào và khác gì so với diện tích hình thang dưới đường PR?',
    referenceAnswer: `Average Precision (AP) tính \`tổng của (R_n - R_{n-1}) x P_n\`, tức trung bình Precision có trọng số theo phần Recall tăng thêm tại mỗi ngưỡng. Không có nội suy.

Ví dụ xếp hạng: dương, dương, âm, dương, âm, dương, âm, âm. Precision tại các ca dương là 1, 1, 0,75 và 0,667. Mỗi ca dương đóng góp 1/4 Recall, nên AP = 0,854.

Hình thang nối hai điểm liên tiếp bằng đường thẳng. Điều này không đúng với PR, vì Precision không thay đổi tuyến tính theo Recall: giữa hai điểm, FP có thể tăng trước khi có thêm TP. Đường PR cũng không đơn điệu, có dạng răng cưa. Do đó tài liệu scikit-learn nêu rõ hình thang có thể quá lạc quan. Davis và Goadrich (2006) cũng chỉ ra nội suy tuyến tính trên PR là sai.

Sự khác biệt rõ nhất khi có ít ca dương, hoặc khi điểm số có nhiều giá trị trùng nhau. Thực tế, tôi dùng AP từ scikit-learn, ghi rõ tên chỉ số, và không so sánh con số của công cụ khác nếu không biết họ tính thế nào.`,
    keyPoints: [
      { text: 'AP là trung bình Precision có trọng số theo Recall tăng thêm', keywords: ['trọng số', 'recall tăng thêm', 'r n'], weight: 2 },
      { text: 'Hình thang nội suy tuyến tính', keywords: ['hình thang', 'nội suy', 'tuyến tính'], weight: 2 },
      { text: 'Hình thang có thể quá lạc quan', keywords: ['lạc quan', 'optimistic'] },
      { text: 'Đường PR không đơn điệu', keywords: ['không đơn điệu', 'răng cưa'] },
      { text: 'Khi so sánh cần biết cách tính', keywords: ['cách tính', 'công cụ khác', 'ghi rõ'] },
    ],
    followUps: ['Hòa điểm ảnh hưởng thế nào tới AP?', 'Interpolated AP trong bài toán truy xuất khác gì?'],
    commonMistakes: ['Xem AP và diện tích hình thang là một.', 'Không biết đường PR không đơn điệu.'],
  },
  {
    id: 'iv-eval-pr-03',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-pr-auc', 'eval-roc-auc'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Có ý kiến cho rằng dữ liệu mất cân bằng thì phải dùng PR-AUC. Bạn có đồng ý không?',
    referenceAnswer: `Tôi không đồng ý với cách nói tuyệt đối đó. Điều quyết định không chỉ là độ mất cân bằng, mà là cách mô hình được dùng.

PR-AUC phù hợp khi tôi chỉ hành động trên nhóm điểm cao nhất, như đội kiểm tra có giới hạn năng lực, vì nó phản ánh tỷ lệ cảnh báo đúng. McDermott và cộng sự (2024) phân tích rằng ROC-AUC thưởng đều cho việc sửa một lỗi xếp hạng ở mọi vùng điểm, còn PR-AUC thưởng nhiều hơn ở vùng điểm cao.

Nhưng chính điều này có thể gây vấn đề. Khi có nhiều nhóm với tỷ lệ dương khác nhau, các ca điểm cao tập trung ở nhóm có tỷ lệ cao, nên PR-AUC có thể ưu tiên cải thiện cho nhóm đó, có hại về công bằng. Trong y khoa, nếu cần đánh giá tổng thể trên toàn bộ dân số, hoặc tỷ lệ lớp thay đổi giữa các bệnh viện, ROC-AUC có thể phù hợp hơn. Richardson và cộng sự (2024) cũng cho thấy ROC-AUC đánh giá chính xác trên dữ liệu mất cân bằng.

Thực tế, tôi báo cáo cả hai cùng với tỷ lệ lớp, đánh giá theo nhóm, và quyết định cuối cùng dựa trên chỉ số tại điểm vận hành hoặc theo chi phí.`,
    keyPoints: [
      { text: 'Lựa chọn dựa vào cách dùng, không chỉ độ mất cân bằng', keywords: ['cách dùng', 'mục đích', 'không tuyệt đối'], weight: 2 },
      { text: 'PR-AUC ưu tiên vùng điểm cao', keywords: ['vùng điểm cao', 'nhóm điểm cao', 'top'], weight: 2 },
      { text: 'PR-AUC có thể thiên về nhóm có tỷ lệ dương cao', keywords: ['công bằng', 'tỷ lệ dương cao', 'fairness'] },
      { text: 'ROC-AUC phù hợp với đánh giá tổng thể hoặc tỷ lệ biến động', keywords: ['tổng thể', 'toàn bộ dân số', 'tỷ lệ thay đổi'] },
      { text: 'Báo cáo theo nhóm và tại điểm vận hành', keywords: ['theo nhóm', 'điểm vận hành', 'chi phí'] },
    ],
    followUps: ['Làm sao đánh giá công bằng giữa các nhóm có tỷ lệ dương khác nhau?', 'Nghiên cứu cũ của Saito và Rehmsmeier nói gì?'],
    commonMistakes: ['Lặp lại quy tắc: mất cân bằng thì dùng PR-AUC.', 'Không nêu được trường hợp ROC-AUC phù hợp hơn.'],
  },
  {
    id: 'iv-eval-gini-01',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-gini', 'eval-roc-auc'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Gini Coefficient của mô hình liên hệ với ROC-AUC thế nào? Vì sao ngành tín dụng thích dùng nó?',
    referenceAnswer: `Gini được tính bằng \`2 x AUC - 1\`. Vì thế AUC 0,5 cho Gini 0, AUC 1 cho Gini 1, AUC 0,8 cho Gini 0,6. Về hình học, đây là hai lần diện tích giữa đường ROC và đường chéo. Tài liệu scikit-learn cũng ghi công thức này, và nói rõ phép biến đổi giúp mô hình ngẫu nhiên có kỳ vọng bằng 0.

Vì là biến đổi tuyến tính, Gini không có thông tin mới so với AUC. Xếp hạng các mô hình giống hệt nhau. Mọi khoảng chênh đều nhân đôi: AUC tăng 0,02 tức Gini tăng 0,04, không có nghĩa là cải thiện nhiều hơn. Gini cũng có cùng giới hạn: không đo xác suất và không phản ánh số FP.

Ngành tín dụng dùng nó chủ yếu vì thói quen và thang đo tự nhiên: 0 là không tách được, 1 là tách hoàn hảo. Nó cũng gắn với đường CAP, và với nhãn nhị phân thì bằng Accuracy Ratio và Somers' D.

Cần phân biệt với Gini Impurity dùng để tách nút trong cây quyết định. Và không nên áp mức tốt của danh mục này cho danh mục khác, vì Gini đạt được phụ thuộc vào sản phẩm và dữ liệu.`,
    keyPoints: [
      { text: 'Gini = 2 x AUC - 1', keywords: ['2 x auc', '2 auc', 'hai lần auc'], weight: 2 },
      { text: 'Không có thông tin mới so với AUC', keywords: ['không có thông tin mới', 'tuyến tính', 'cùng thông tin'], weight: 2 },
      { text: 'Mốc ngẫu nhiên là 0', keywords: ['ngẫu nhiên', 'bằng 0', 'thang đo'] },
      { text: 'Liên hệ CAP, Accuracy Ratio, Somers D', keywords: ['cap', 'accuracy ratio', 'somers'] },
      { text: 'Khác với Gini Impurity', keywords: ['gini impurity', 'tách nút'] },
    ],
    followUps: ['KS Statistic khác Gini thế nào?', 'Gini trong kinh tế học liên quan gì tới Gini của mô hình?'],
    commonMistakes: ['Nhầm với Gini Impurity.', 'Xem Gini là bằng chứng độc lập với AUC.'],
  },
  {
    id: 'iv-eval-ll-01',
    topicId: 'evaluation',
    category: 'eval-classification',
    conceptIds: ['eval-log-loss', 'eval-calibration'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Log Loss đo điều gì mà Accuracy và ROC-AUC không đo được? Làm sao biết Log Loss là tốt?',
    referenceAnswer: `Accuracy chỉ quan tâm dự đoán nằm ở phía nào của ngưỡng, ROC-AUC chỉ quan tâm thứ tự. Log Loss quan tâm **giá trị xác suất**. Công thức là âm log-likelihood trung bình, nên mỗi mẫu bị phạt bằng \`-ln\` của xác suất dành cho nhãn đúng: p = 0,9 phạt 0,105, p = 0,5 phạt 0,693, p = 0,01 phạt 4,605. Dự đoán tự tin mà sai bị phạt rất nặng.

Nó là Proper Scoring Rule: điểm kỳ vọng tốt nhất đạt được khi báo đúng xác suất thật, nên mô hình không có lợi khi báo sai. Đó là lý do nó phù hợp khi xác suất đi vào quyết định, như tính tổn thất kỳ vọng.

Muốn biết tốt hay không, phải so với mốc. Mô hình luôn đoán bằng tỷ lệ lớp có Log Loss là \`-[p x ln(p) + (1 - p) x ln(1 - p)]\`: 0,693 khi cân bằng, chỉ 0,056 khi có 1% ca dương. Nên 0,05 trên dữ liệu 1% chỉ tốt hơn mốc rất ít.

Log Loss gộp cả khả năng tách và Calibration, nên muốn biết vấn đề ở đâu thì cần xem thêm AUC và Reliability Diagram.`,
    keyPoints: [
      { text: 'Đo giá trị xác suất, không chỉ thứ tự hay nhãn', keywords: ['giá trị xác suất', 'chất lượng xác suất', 'xác suất'], weight: 2 },
      { text: 'Phạt rất nặng dự đoán tự tin mà sai', keywords: ['tự tin', 'phạt nặng', 'vô cùng'], weight: 2 },
      { text: 'Proper Scoring Rule', keywords: ['proper scoring', 'báo đúng xác suất'] },
      { text: 'So với mốc của tỷ lệ lớp', keywords: ['mốc', 'tỷ lệ lớp', 'entropy', '0,056'], weight: 2 },
      { text: 'Gộp khả năng tách và Calibration', keywords: ['calibration', 'khả năng tách', 'hiệu chỉnh'] },
    ],
    followUps: ['Log Loss khác Brier Score thế nào?', 'Vì sao lỗi nhãn ảnh hưởng mạnh tới Log Loss?'],
    commonMistakes: ['Đọc Log Loss như một con số tuyệt đối mà không xét tỷ lệ lớp.', 'Xem Log Loss là thước đo chỉ của Calibration.'],
  },
])
