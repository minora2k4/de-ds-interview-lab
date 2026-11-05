import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-eval-tvt-01',
    topicId: 'evaluation',
    category: 'eval-split',
    conceptIds: ['eval-train-val-test', 'eda-leakage'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Vì sao cần cả Validation và Test? Test set có được dùng để tinh chỉnh mô hình không?',
    referenceAnswer: `Điều chúng ta muốn biết là hiệu năng trên dữ liệu chưa từng thấy. Muốn đo được, dữ liệu dùng để đo không được ảnh hưởng tới mô hình theo bất kỳ cách nào.

Train dùng để học tham số. Nhưng còn nhiều quyết định khác: siêu tham số, đặc trưng, ngưỡng, thuật toán. Những quyết định này cần dữ liệu ngoài Train, đó là Validation. Sau nhiều lần thử, Validation cũng dần mất khách quan, vì mình đang chọn cấu hình có điểm cao nhất trong nhiều phép đo có nhiễu, nên điểm đó lạc quan.

Vì vậy cần Test là tập chưa ảnh hưởng tới quyết định nào. **Test set không dùng để tinh chỉnh.** Mô hình không học từ Test, nhưng nếu tôi sửa mô hình sau khi nhìn điểm Test thì thông tin của nó đã rò vào quyết định. Tài liệu scikit-learn gọi đây là rủi ro overfit trên Test set.

Trong thực tế, nếu đã lỡ dùng Test cho quyết định, tôi không báo cáo con số đó như một ước lượng độc lập nữa, và tôi lấy một tập mới, thường là dữ liệu của giai đoạn sau, để đo lại.`,
    keyPoints: [
      { text: 'Train học tham số, Validation ra quyết định, Test đo kết quả', keywords: ['học tham số', 'siêu tham số', 'hyperparameter'], weight: 2 },
      { text: 'Test không dùng để tinh chỉnh vì sẽ rò rỉ qua quyết định', keywords: ['rò rỉ', 'leak', 'không dùng để tinh chỉnh', 'không tinh chỉnh'], weight: 2 },
      { text: 'Validation lạc quan do chọn giá trị cao nhất qua nhiều lần thử', keywords: ['lạc quan', 'nhiều lần thử', 'optimistic'] },
      { text: 'Đã dùng Test cho quyết định thì cần tập mới', keywords: ['tập mới', 'dữ liệu mới', 'test mới'] },
    ],
    followUps: ['Chọn ngưỡng phân loại nên làm trên tập nào?', 'Dữ liệu ít thì chia thế nào?'],
    commonMistakes: ['Cho rằng chỉ cần không huấn luyện trên Test là Test vẫn sạch.', 'Xem Validation và Test là hai tên của một thứ.'],
  },
  {
    id: 'iv-eval-tvt-02',
    topicId: 'evaluation',
    category: 'eval-split',
    conceptIds: ['eval-train-val-test', 'eval-overfitting'],
    interviewTypes: ['ds'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Điểm trên Test thấp hơn Validation khá nhiều. Bạn phân tích thế nào và làm gì tiếp theo?',
    referenceAnswer: `Tôi không sửa mô hình ngay dựa trên Test. Trước hết tôi tìm nguyên nhân, vì mỗi nguyên nhân có cách xử lý khác nhau.

Thứ nhất là **lạc quan do chọn lọc:** thử càng nhiều cấu hình thì điểm Validation của cấu hình tốt nhất càng cao hơn giá trị thật, nên một khoảng chênh nhỏ là bình thường. Thứ hai là **dao động do mẫu nhỏ:** tôi tính khoảng tin cậy bằng Bootstrap, nhất là khi có ít ca dương. Thứ ba là **hai tập khác phân phối:** nếu Test thuộc giai đoạn sau, tôi so sánh phân phối đặc trưng và tỷ lệ nhãn để xem có drift không. Thứ tư là **rò rỉ ở Validation:** ví dụ cùng một khách hàng nằm trong cả Train và Validation.

Việc chẩn đoán này nên dựa trên so sánh phân phối chứ không dò tìm lỗi theo từng dòng của Test. Nếu phát hiện cách chia Validation sai, tôi sửa cách chia, chạy lại quy trình chọn mô hình trên Validation mới. Lúc đó tôi coi Test cũ đã được dùng, và đo lại trên dữ liệu mới nếu có.`,
    keyPoints: [
      { text: 'Không tinh chỉnh dựa trên Test', keywords: ['không sửa', 'không tinh chỉnh', 'không chỉnh'], weight: 2 },
      { text: 'Lạc quan do chọn trong nhiều cấu hình', keywords: ['lạc quan', 'nhiều cấu hình', 'selection'] },
      { text: 'Kiểm tra độ dao động, khoảng tin cậy', keywords: ['khoảng tin cậy', 'bootstrap', 'dao động'] },
      { text: 'Kiểm tra khác phân phối hoặc drift', keywords: ['drift', 'khác phân phối', 'phân phối'] },
      { text: 'Kiểm tra rò rỉ ở Validation', keywords: ['rò rỉ', 'leak', 'cách chia'] },
    ],
    followUps: ['Khoảng chênh bao nhiêu thì đáng lo?', 'Làm sao để phát hiện Train và Test khác phân phối?'],
    commonMistakes: ['Thử lại cấu hình rồi chọn theo điểm Test.', 'Kết luận ngay là overfit mà không xem cách chia dữ liệu.'],
  },
  {
    id: 'iv-eval-cv-01',
    topicId: 'evaluation',
    category: 'eval-split',
    conceptIds: ['eval-cross-validation'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'K-Fold Cross Validation hoạt động thế nào và tốt hơn một lần chia ở điểm nào?',
    referenceAnswer: `K-Fold chia dữ liệu thành K phần. Lặp K lần, mỗi lần giữ một phần để đánh giá và học trên K-1 phần còn lại. Kết quả là K điểm số, tôi báo cáo trung bình và độ phân tán.

So với một lần chia, nó có hai lợi ích. **Giảm phụ thuộc vào may rủi của một lần chia:** với dữ liệu ít, điểm số có thể đổi đáng kể tùy dòng nào rơi vào đâu. **Tận dụng dữ liệu:** mọi dòng đều được dùng để học và được đánh giá đúng một lần, nên còn lấy được dự đoán ngoài fold.

Đánh đổi là chi phí: mỗi cấu hình huấn luyện K lần. Grid Search 20 cấu hình với 5 fold đã là 100 lần huấn luyện. Vì vậy với dữ liệu rất lớn hoặc mô hình huấn luyện lâu, một lần chia thường là đủ.

Cần nhớ rằng K-Fold đánh giá một quy trình chứ không tạo ra mô hình cuối. Sau khi chốt cấu hình, tôi huấn luyện lại trên toàn bộ dữ liệu học. Ngoài ra, K-Fold ngẫu nhiên chỉ đúng khi các dòng gần như độc lập.`,
    keyPoints: [
      { text: 'Lặp K lần, mỗi fold đánh giá một lần', keywords: ['k phần', 'k lần', 'mỗi fold', 'fold'], weight: 2 },
      { text: 'Giảm phụ thuộc vào một lần chia', keywords: ['một lần chia', 'may rủi', 'ổn định'] },
      { text: 'Tận dụng dữ liệu', keywords: ['tận dụng', 'dữ liệu ít', 'mọi dòng'] },
      { text: 'Chi phí tăng theo K', keywords: ['chi phí', 'tốn', '100 lần'] },
      { text: 'Huấn luyện lại sau khi chốt cấu hình', keywords: ['huấn luyện lại', 'refit', 'mô hình cuối'] },
    ],
    followUps: ['Chọn K thế nào?', 'Sau Cross Validation thì dùng mô hình nào để triển khai?'],
    commonMistakes: ['Nói K mô hình được dùng làm mô hình cuối.', 'Không biết K-Fold cần giả định các dòng gần như độc lập.'],
  },
  {
    id: 'iv-eval-cv-02',
    topicId: 'evaluation',
    category: 'eval-split',
    conceptIds: ['eval-cross-validation', 'dq-time-series', 'eda-leakage'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Khi nào cần Time Series Split và Group K-Fold thay cho K-Fold ngẫu nhiên? Nếu vẫn dùng K-Fold thì chuyện gì xảy ra?',
    referenceAnswer: `K-Fold ngẫu nhiên giả định các dòng độc lập và cùng phân phối. Nguyên tắc của tôi là cách chia phải mô phỏng môi trường triển khai, nên tôi hỏi: mô hình sẽ gặp gì khi chạy thật?

**Time Series Split** cần khi mô hình dự đoán tương lai. Dữ liệu gần nhau trong thời gian tương quan với nhau, nên chia ngẫu nhiên cho mô hình nhìn thấy cả trước và sau điểm cần đoán. Time Series Split luôn học trên phần trước và đánh giá trên phần ngay sau, tập học lớn dần qua các split. Nếu nhãn cần thời gian mới có, ví dụ churn trong 30 ngày, tôi dùng \`gap\` để bỏ khoảng giữa.

**Group K-Fold** cần khi nhiều dòng thuộc một thực thể và mô hình sẽ gặp thực thể mới, như bệnh nhân, khách hàng, thiết bị. Mỗi nhóm chỉ nằm ở một phía. Nếu không, mô hình có thể nhận ra thực thể thay vì học quy luật.

Dùng sai thì không có lỗi nào hiện ra, chỉ có điểm số quá đẹp. Ví dụ 50.000 ảnh từ 2.000 bệnh nhân: K-Fold có thể cho AUC 0,97, còn chia theo bệnh nhân chỉ 0,83. Khi cần cả hai, tôi chia theo thời gian và loại bỏ phần chồng lấn nhóm.`,
    keyPoints: [
      { text: 'K-Fold giả định dòng độc lập, cùng phân phối', keywords: ['i.i.d', 'iid', 'độc lập'], weight: 2 },
      { text: 'Cách chia mô phỏng môi trường triển khai', keywords: ['mô phỏng', 'triển khai', 'môi trường thật', 'production'] },
      { text: 'Time Series Split để không học từ tương lai', keywords: ['tương lai', 'time series split', 'theo thời gian'], weight: 2 },
      { text: 'Group K-Fold để một thực thể không nằm ở cả hai phía', keywords: ['group k fold', 'cùng thực thể', 'theo nhóm', 'bệnh nhân', 'khách hàng'], weight: 2 },
      { text: 'Dùng sai cho điểm số quá lạc quan, không báo lỗi', keywords: ['lạc quan', 'quá đẹp', 'rò rỉ', 'leak'] },
    ],
    followUps: ['Tham số gap dùng để làm gì?', 'Khi nào Group K-Fold lại quá bi quan?', 'Nhiều chuỗi thời gian song song thì chia thế nào?'],
    commonMistakes: ['Xáo trộn dữ liệu chuỗi thời gian trước khi chia.', 'Nhầm Stratified với Group: giữ tỷ lệ lớp không ngăn được rò rỉ theo thực thể.'],
  },
  {
    id: 'iv-eval-cv-03',
    topicId: 'evaluation',
    category: 'eval-split',
    conceptIds: ['eval-cross-validation', 'eda-leakage', 'dq-drift'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Mô hình đạt AUC 0,92 khi Cross Validation nhưng chỉ còn 0,74 khi triển khai. Bạn điều tra thế nào?',
    referenceAnswer: `Khoảng chênh lớn như vậy thường do cách đánh giá chưa giống thực tế, nên tôi kiểm tra theo thứ tự từ dễ sai nhất.

Đầu tiên là **rò rỉ dữ liệu:** có đặc trưng nào chứa thông tin sau thời điểm dự đoán không, tiền xử lý có fit trong từng fold không. Permutation Importance rất hữu ích ở đây, vì đặc trưng rò rỉ thường nổi bật bất thường.

Tiếp theo là **cách chia:** nếu có thời gian hoặc nhóm mà dùng K-Fold ngẫu nhiên thì tôi chạy lại với Time Series Split hoặc Group K-Fold. Nếu điểm tụt xuống gần 0,74, nguyên nhân đã rõ.

Sau đó là **khác biệt giữa huấn luyện và triển khai:** logic tính đặc trưng online khác offline, dữ liệu trễ, giá trị thiếu nhiều hơn. Tôi so sánh phân phối đặc trưng và điểm số dự đoán giữa hai môi trường.

Rồi đến **drift:** phân phối đổi theo thời gian, hoặc quan hệ giữa đặc trưng và nhãn đã đổi. Cuối cùng là **độ trễ và định nghĩa nhãn:** nhãn production có thể chưa đủ thời gian để hoàn chỉnh, làm điểm đo bị sai. Tôi cũng xét mức lạc quan do chọn cấu hình, nhưng nó hiếm khi giải thích được khoảng chênh 0,18.`,
    keyPoints: [
      { text: 'Kiểm tra rò rỉ dữ liệu', keywords: ['rò rỉ', 'leak', 'leakage'], weight: 2 },
      { text: 'Kiểm tra cách chia có giống thực tế', keywords: ['cách chia', 'time series split', 'group k fold', 'theo thời gian'], weight: 2 },
      { text: 'Khác biệt giữa offline và online', keywords: ['online', 'offline', 'skew', 'môi trường'] },
      { text: 'Drift về dữ liệu hoặc quan hệ', keywords: ['drift', 'trôi'] },
      { text: 'Độ trễ và định nghĩa nhãn', keywords: ['độ trễ nhãn', 'định nghĩa nhãn', 'nhãn'] },
    ],
    followUps: ['Làm sao chứng minh được một đặc trưng bị rò rỉ?', 'Nếu nguyên nhân là drift thì xử lý thế nào?'],
    commonMistakes: ['Kết luận ngay là overfit và tăng regularization.', 'Chỉ huấn luyện lại mà không tìm nguyên nhân.'],
  },
  {
    id: 'iv-eval-cv-04',
    topicId: 'evaluation',
    category: 'eval-split',
    conceptIds: ['eval-cross-validation', 'eval-train-val-test'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Vì sao điểm Cross Validation của cấu hình tốt nhất sau khi tinh chỉnh lại lạc quan? Nested CV giải quyết điều đó thế nào và khi nào đáng dùng?',
    referenceAnswer: `Mỗi điểm CV là một ước lượng có nhiễu. Khi thử nhiều cấu hình rồi lấy điểm cao nhất, tôi đang chọn cả phần nhiễu thuận lợi. Kỳ vọng của giá trị lớn nhất cao hơn giá trị thật của cấu hình đó, và thử càng nhiều thì lạc quan càng lớn. Tài liệu scikit-learn cũng nêu rõ dùng cùng dữ liệu để tinh chỉnh và đánh giá sẽ cho điểm quá lạc quan.

**Nested CV** có hai vòng. Vòng trong tinh chỉnh trên phần học của vòng ngoài. Vòng ngoài đánh giá cấu hình vừa chọn trên fold chưa tham gia việc chọn. Nó ước lượng hiệu năng của **cả quy trình tinh chỉnh**, không phải của một cấu hình cụ thể, và các fold ngoài có thể chọn các cấu hình khác nhau.

Đánh đổi là chi phí: 5 fold ngoài, 5 fold trong, 20 cấu hình là 500 lần huấn luyện. Tôi dùng nó khi dữ liệu quá ít để giữ riêng Test, ví dụ nghiên cứu y khoa, hoặc khi cần so sánh công bằng hai thuật toán có tinh chỉnh. Với dữ liệu lớn, tôi giữ một Test độc lập, vì rẻ hơn và cùng đạt mục đích. Sau đó vẫn tinh chỉnh lần cuối trên toàn bộ dữ liệu học để có mô hình triển khai.`,
    keyPoints: [
      { text: 'Chọn giá trị lớn nhất trong các ước lượng có nhiễu gây lạc quan', keywords: ['giá trị lớn nhất', 'có nhiễu', 'lạc quan', 'selection bias'], weight: 2 },
      { text: 'Vòng trong tinh chỉnh, vòng ngoài đánh giá', keywords: ['vòng trong', 'vòng ngoài', 'inner', 'outer'], weight: 2 },
      { text: 'Đánh giá quy trình, không phải một cấu hình', keywords: ['quy trình', 'cả quy trình'] },
      { text: 'Chi phí rất cao', keywords: ['500 lần', 'chi phí', 'tốn'] },
      { text: 'Dùng khi dữ liệu ít, dữ liệu lớn thì giữ Test', keywords: ['dữ liệu ít', 'test độc lập', 'giữ riêng test'] },
    ],
    followUps: ['Các fold ngoài chọn cấu hình khác nhau thì triển khai cấu hình nào?', 'Mức lạc quan tăng thế nào theo số cấu hình thử?'],
    commonMistakes: ['Nói Nested CV cho ra siêu tham số tốt nhất.', 'Báo cáo điểm vòng trong làm kết quả cuối.'],
  },
])
