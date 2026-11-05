import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-fe-extraction-01',
    topicId: 'features',
    category: 'fe-selection-group',
    conceptIds: ['fe-extraction', 'fe-selection', 'eda-leakage'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Feature Extraction khác Feature Selection thế nào? Khi nào bạn dùng PCA, và rủi ro là gì?',
    referenceAnswer: `Extraction tạo ra biểu diễn mới từ dữ liệu thô hoặc từ cột sẵn có, như TF-IDF từ văn bản, số phiên 30 ngày từ nhật ký, hay các thành phần PCA. Selection chỉ giữ một tập con các cột có sẵn, nên ý nghĩa của cột giữ nguyên.

Tôi dùng PCA khi có nhiều cột tương quan và cần giảm chiều cho mô hình nhạy với số chiều như KNN, hoặc để trực quan hóa. Tôi co giãn trước, vì PCA tìm hướng có phương sai lớn, và cột có đơn vị lớn sẽ chi phối.

Rủi ro đầu tiên là PCA không dùng nhãn. Hướng có phương sai lớn chưa chắc là hướng có ích để dự đoán, nên phải đánh giá trên chính bài toán. Rủi ro thứ hai là mất khả năng giải thích, vì mỗi thành phần trộn nhiều cột. Trong lĩnh vực cần giải thích như tín dụng, tôi ưu tiên Selection.

Về rò rỉ, PCA phải \`fit\` trên train. Với đặc trưng tổng hợp theo thời gian, cửa sổ chỉ được lấy dữ liệu trước thời điểm dự đoán. Đây là lỗi tôi kiểm tra đầu tiên khi AUC cao bất thường.`,
    keyPoints: [
      { text: 'Extraction tạo biểu diễn mới, Selection giữ tập con', keywords: ['biểu diễn mới', 'đặc trưng mới', 'tập con'], weight: 2 },
      { text: 'PCA không dùng nhãn, cần co giãn', keywords: ['không dùng nhãn', 'phương sai', 'co giãn'], weight: 2 },
      { text: 'Mất khả năng giải thích', keywords: ['giải thích', 'trộn nhiều cột', 'tổ hợp'] },
      { text: 'Rò rỉ theo thời điểm, fit trên train', keywords: ['thời điểm', 'rò rỉ', 'trên train'] },
    ],
    followUps: ['TF-IDF cần `fit` trên tập nào?', 'Chọn số thành phần PCA thế nào?'],
    commonMistakes: ['Nói PCA luôn giữ lại phần tốt nhất cho dự đoán.'],
  },
  {
    id: 'iv-fe-selection-01',
    topicId: 'features',
    category: 'fe-selection-group',
    conceptIds: ['fe-selection'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Hãy trình bày ba nhóm phương pháp chọn đặc trưng Filter, Wrapper, Embedded, kèm ưu nhược điểm.',
    referenceAnswer: `**Filter** chấm điểm từng cột bằng một thống kê, không cần mô hình. Ví dụ phương sai, F-test, Mutual Information, hoặc IV trong tín dụng. Ưu điểm là nhanh, dùng được với số cột rất lớn. Nhược điểm là thường xét từng cột riêng, nên bỏ sót tương tác và không biết hai cột trùng thông tin.

**Wrapper** thử các tập con bằng cách huấn luyện mô hình, như chọn tuần tự thêm dần hoặc bớt dần từng cột. RFE cũng thường được xếp vào đây. Ưu điểm là đánh giá trực tiếp hiệu năng và thấy được tương tác. Nhược điểm là tốn kém: bớt một cột từ m cột với k fold cần m nhân k lần huấn luyện, và dễ quá khớp với tập đánh giá.

**Embedded** chọn ngay trong lúc huấn luyện, như L1 đưa hệ số về 0, hoặc dùng độ quan trọng của cây. Ưu điểm là cân bằng giữa chi phí và chất lượng. Nhược điểm là kết quả gắn với loại mô hình, và không ổn định khi các cột tương quan cao.

Thực tế tôi thường kết hợp, đi từ rẻ đến đắt, và luôn đặt các bước dùng nhãn trong kiểm định chéo.`,
    keyPoints: [
      { text: 'Filter: thống kê, nhanh, bỏ sót tương tác', keywords: ['filter', 'thống kê', 'tương tác'], weight: 2 },
      { text: 'Wrapper: huấn luyện nhiều lần, tốn kém', keywords: ['wrapper', 'tập con', 'tốn kém', 'rfe'], weight: 2 },
      { text: 'Embedded: chọn trong lúc huấn luyện', keywords: ['embedded', 'l1', 'lasso', 'trong lúc huấn luyện'], weight: 2 },
      { text: 'Kết hợp, đặt trong kiểm định chéo', keywords: ['kết hợp', 'kiểm định chéo', 'cross validation'] },
    ],
    followUps: ['Bạn chọn nhóm nào với 5.000 cột?', 'Vì sao RFE khó xếp hẳn vào một nhóm?'],
    commonMistakes: ['Xếp L1 vào nhóm Filter.', 'Không nêu được đánh đổi về chi phí.'],
  },
  {
    id: 'iv-fe-selection-02',
    topicId: 'features',
    category: 'fe-selection-group',
    conceptIds: ['fe-selection', 'eda-leakage', 'eval-cross-validation'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao chọn đặc trưng trước khi kiểm định chéo lại cho kết quả sai? Hãy giải thích từ nguyên lý.',
    referenceAnswer: `Kiểm định chéo chỉ trung thực khi fold kiểm tra không ảnh hưởng đến bất kỳ quyết định nào của mô hình. Nếu chọn cột bằng nhãn trên toàn bộ dữ liệu, nhãn của fold kiểm tra đã góp phần quyết định cột nào được giữ.

Cơ chế là tính đa so sánh. Khi có rất nhiều cột, một số cột sẽ tương quan với nhãn chỉ do tình cờ. Ta chọn đúng những cột đó, và chúng cũng tương quan với nhãn của fold kiểm tra, vì fold đó nằm trong dữ liệu đã dùng để chọn.

Ví dụ trong tài liệu scikit-learn: 200 dòng, 10.000 cột ngẫu nhiên, nhãn ngẫu nhiên. Chọn 25 cột rồi mới chia cho độ chính xác 0.76, trong khi đúng phải là 0.5. Sách The Elements of Statistical Learning cũng có mục riêng về lỗi này.

Cách đúng là xem việc chọn cột là một phần của huấn luyện: đặt trong \`Pipeline\`, để mỗi fold tự chọn trên phần train của nó. Hệ quả là mỗi fold có thể chọn tập cột khác nhau. Kiểm định chéo khi đó đánh giá cả quy trình, không phải một danh sách cột cố định. Nếu có tinh chỉnh số cột, tôi dùng nested CV. Các bước không dùng nhãn, như loại cột hằng, thì rủi ro thấp hơn nhiều.`,
    keyPoints: [
      { text: 'Nhãn của fold kiểm tra ảnh hưởng đến việc chọn', keywords: ['nhãn của fold', 'nhãn của test', 'rò rỉ', 'leakage'], weight: 3 },
      { text: 'Cột tương quan do tình cờ khi có nhiều cột', keywords: ['tình cờ', 'đa so sánh', 'ngẫu nhiên'], weight: 2 },
      { text: 'Đặt việc chọn cột trong Pipeline, làm trong từng fold', keywords: ['pipeline', 'từng fold', 'mỗi fold'], weight: 2 },
      { text: 'Kiểm định chéo đánh giá cả quy trình', keywords: ['cả quy trình', 'nested', 'tập cột khác nhau'] },
    ],
    followUps: ['Mỗi fold chọn một tập cột khác nhau thì mô hình cuối dùng tập nào?', 'Loại cột hằng trên toàn bộ dữ liệu có sao không?'],
    commonMistakes: ['Cho rằng chỉ cần tách test cuối cùng là đủ, dù đã chọn cột trên toàn bộ dữ liệu.'],
  },
  {
    id: 'iv-fe-selection-03',
    topicId: 'features',
    category: 'fe-selection-group',
    conceptIds: ['fe-selection', 'eda-overview', 'eda-correlation', 'fe-iv'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bạn nhận một bảng 1.000 cột cho bài toán dự đoán. Hãy mô tả quy trình đi từ phân tích dữ liệu đến chốt tập đặc trưng.',
    referenceAnswer: `Tôi chia thành hai pha với mục tiêu khác nhau.

**Pha phân tích dữ liệu** để hiểu cột. Tôi tìm cột hằng, cột dạng mã định danh, cột thiếu quá nhiều, và cặp cột gần như trùng nhau. Tôi trao đổi với nghiệp vụ về ý nghĩa và thời điểm ghi nhận của từng nhóm cột, vì đây là cách tốt nhất để phát hiện rò rỉ. Bước này chưa cần nhãn.

Sau đó tôi chia dữ liệu, theo thời gian nếu bài toán có yếu tố thời gian. Tôi xem quan hệ với nhãn trên tập train, rồi soi các cột mạnh bất thường. Trong tín dụng, tôi dùng IV ở đây.

**Pha lập mô hình** để chọn cột, đặt trong kiểm định chéo. Tôi đi từ rẻ đến đắt: Filter để giảm số cột, xử lý các cột tương quan cao, rồi dùng Embedded như L1 hoặc độ quan trọng của cây. Tôi chỉ dùng Wrapper khi số cột còn ít.

Tôi không chỉ nhìn điểm số, mà còn xem tần suất mỗi cột được chọn giữa các fold và độ ổn định theo thời gian. Khi hai tập có hiệu năng gần nhau, tôi chọn tập nhỏ hơn vì giảm chi phí giám sát. Cuối cùng, tôi đánh giá một lần trên test.`,
    keyPoints: [
      { text: 'Pha EDA: cột hằng, mã định danh, thiếu, trùng lặp', keywords: ['cột hằng', 'mã định danh', 'trùng', 'eda'], weight: 2 },
      { text: 'Trao đổi nghiệp vụ, kiểm tra thời điểm để phát hiện rò rỉ', keywords: ['nghiệp vụ', 'thời điểm', 'rò rỉ'], weight: 2 },
      { text: 'Pha mô hình đi từ rẻ đến đắt, trong kiểm định chéo', keywords: ['từ rẻ đến đắt', 'filter', 'embedded', 'kiểm định chéo'], weight: 2 },
      { text: 'Xem độ ổn định và chi phí', keywords: ['ổn định', 'tần suất', 'chi phí', 'giám sát'] },
    ],
    followUps: ['Bạn dừng ở bao nhiêu cột?', 'Nếu một cột quan trọng nhưng khó lấy ở production thì sao?'],
    commonMistakes: ['Nhảy thẳng vào huấn luyện mô hình mà không rà soát cột.', 'Chọn cột chỉ dựa vào một lần chạy độ quan trọng.'],
  },
  {
    id: 'iv-fe-selection-04',
    topicId: 'features',
    category: 'fe-selection-group',
    conceptIds: ['fe-selection', 'eval-feature-importance', 'eda-correlation'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Khi các cột tương quan cao, vì sao kết quả chọn đặc trưng trở nên không ổn định? Bạn xử lý ra sao để kết quả đáng tin?',
    referenceAnswer: `Với hai cột gần như trùng nhau, mô hình có thể dùng cột này hay cột kia mà dự đoán gần như không đổi. Bài toán không còn một đáp án rõ ràng, nên một thay đổi nhỏ trong mẫu đủ làm lựa chọn đổi theo.

Mỗi phương pháp bộc lộ điều này khác nhau. L1 có xu hướng giữ một cột và đưa cột kia về 0. Với cây, độ quan trọng bị chia giữa hai cột, nên mỗi cột trông yếu hơn thực tế, và cột bị đánh giá thấp có thể bị loại nhầm. Với permutation importance, xáo trộn một cột không làm giảm nhiều hiệu năng vì cột kia vẫn bù được. Vì vậy, kết luận "cột này không quan trọng" là sai: nhóm cột đó quan trọng, chỉ là riêng từng cột thì có thể thay thế.

Cách xử lý của tôi: gom các cột tương quan thành cụm, rồi chọn đại diện theo nghiệp vụ và chi phí. Tôi đo độ ổn định bằng cách chọn lại nhiều lần trên các mẫu khác nhau và xem tần suất được chọn. Với L1, tôi cân nhắc Elastic Net để giữ cả nhóm. Tôi tách rõ hai câu hỏi: tập nào dự đoán tốt, và cột nào có ý nghĩa nguyên nhân. Selection chỉ trả lời câu đầu.`,
    keyPoints: [
      { text: 'Cột thay thế được cho nhau nên đáp án không duy nhất', keywords: ['thay thế', 'không duy nhất', 'trùng nhau'], weight: 2 },
      { text: 'L1 giữ một cột, độ quan trọng bị chia', keywords: ['l1', 'bị chia', 'chia đều', 'permutation'], weight: 2 },
      { text: 'Gom cụm và chọn đại diện', keywords: ['gom', 'cụm', 'đại diện'], weight: 2 },
      { text: 'Đo độ ổn định qua nhiều lần lấy mẫu', keywords: ['tần suất', 'độ ổn định', 'nhiều lần', 'bootstrap'] },
      { text: 'Chọn đặc trưng không chứng minh nguyên nhân', keywords: ['nguyên nhân', 'nhân quả', 'causal'] },
    ],
    followUps: ['Elastic Net khác Lasso thế nào trong trường hợp này?', 'Khi nào nên giữ cả hai cột tương quan?'],
    commonMistakes: ['Kết luận cột bị loại là vô dụng.', 'Xem độ quan trọng là bằng chứng nguyên nhân.'],
  },
])
