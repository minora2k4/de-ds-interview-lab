import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-stats-probability-01',
    topicId: 'statistics',
    category: 'stats-probability-group',
    conceptIds: ['stats-probability'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Phân biệt hai sự kiện xung khắc và hai sự kiện độc lập. Lấy một ví dụ trong dữ liệu thực tế mà giả định độc lập bị sai.',
    referenceAnswer: `Xung khắc nghĩa là hai sự kiện không thể cùng xảy ra, nên \`P(A và B) = 0\`. Độc lập nghĩa là biết sự kiện này không làm đổi xác suất của sự kiện kia, nên \`P(A và B) = P(A) × P(B)\`.

Hai khái niệm này gần như đối lập: nếu A và B đều có xác suất dương và xung khắc, biết A xảy ra thì chắc chắn B không xảy ra, tức chúng phụ thuộc nhau.

Ví dụ giả định độc lập bị sai: pipeline có 5 bước, mỗi bước thành công 99%, nên nhiều người tính cả pipeline thành công \`0,99^5 ≈ 95,1%\`. Con số này chỉ đúng nếu các bước độc lập. Nếu tất cả chạy trên cùng một cụm máy, chúng hay lỗi cùng lúc. Một ví dụ khác là tính cỡ mẫu A/B test theo số lượt xem, trong khi các lượt xem của cùng một người có tương quan. Khi đó phương sai bị ước lượng thấp, và p-value nhỏ hơn thực tế.`,
    keyPoints: [
      { text: 'Xung khắc: không thể cùng xảy ra', keywords: ['không thể cùng', 'xung khắc', 'mutually exclusive'], weight: 2 },
      { text: 'Độc lập: biết sự kiện này không đổi xác suất sự kiện kia', keywords: ['không đổi', 'thông tin', 'bằng tích', 'nhân xác suất'], weight: 2 },
      { text: 'Xung khắc với xác suất dương thì phụ thuộc', keywords: ['phụ thuộc', 'không độc lập'] },
      { text: 'Ví dụ về nguyên nhân chung hoặc tương quan trong dữ liệu', keywords: ['nguyên nhân chung', 'cùng cụm', 'tương quan', 'cùng một người'] },
    ],
    followUps: ['Khi giả định độc lập sai, xác suất cả chuỗi thành công thay đổi theo hướng nào?'],
    commonMistakes: ['Cho rằng xung khắc và độc lập là một.', 'Nhân xác suất mà không kiểm tra giả định độc lập.'],
  },
  {
    id: 'iv-stats-conditional-01',
    topicId: 'statistics',
    category: 'stats-probability-group',
    conceptIds: ['stats-conditional', 'stats-correlation-causation'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Tỷ lệ mua chung giảm từ 30% xuống 25%, nhưng tỷ lệ mua trên từng thiết bị không đổi. Bạn giải thích thế nào với đội kinh doanh?',
    referenceAnswer: `Tôi dùng xác suất toàn phần: tỷ lệ chung là trung bình có trọng số của tỷ lệ từng nhóm, \`P(mua) = P(mua|điện thoại) × P(điện thoại) + P(mua|máy tính) × P(máy tính)\`.

Giả sử máy tính mua 45%, điện thoại mua 20%. Khi điện thoại chiếm 60%, tỷ lệ chung là \`20% × 0,6 + 45% × 0,4 = 30%\`. Khi điện thoại tăng lên 80%, tỷ lệ chung là \`20% × 0,8 + 45% × 0,2 = 25%\`. Không nhóm nào giảm, sản phẩm cũng không xấu đi. Chỉ là cơ cấu chuyển sang nhóm có tỷ lệ thấp hơn.

Với đội kinh doanh, tôi tách báo cáo thành hai phần: thay đổi trong từng nhóm và thay đổi cơ cấu. Sau đó tôi hỏi vì sao cơ cấu đổi, chẳng hạn do chiến dịch quảng cáo mới trên di động. Nếu chiến dịch mang về thêm người dùng thì tỷ lệ chung giảm chưa chắc đã xấu, vì tổng số đơn có thể tăng. Tôi cũng không kết luận rằng đẩy người dùng sang máy tính sẽ tăng doanh số, vì đây chỉ là quan hệ quan sát, chưa phải nhân quả.`,
    keyPoints: [
      { text: 'Dùng xác suất toàn phần hoặc trung bình có trọng số', keywords: ['toàn phần', 'trọng số', 'weighted'], weight: 2 },
      { text: 'Nhận ra hiệu ứng cơ cấu', keywords: ['cơ cấu', 'mix', 'tỷ trọng'], weight: 2 },
      { text: 'Tách báo cáo theo từng nhóm', keywords: ['từng nhóm', 'phân khúc', 'segment'] },
      { text: 'Không suy ra nhân quả từ khác biệt giữa các nhóm', keywords: ['nhân quả', 'quan sát', 'causal'] },
    ],
    followUps: ['Hiện tượng này liên hệ thế nào với Simpson\'s Paradox?', 'Metric nào phù hợp hơn tỷ lệ chung trong trường hợp này?'],
    commonMistakes: ['Kết luận ngay là sản phẩm có lỗi.', 'Nhầm `P(mua|điện thoại)` với `P(điện thoại|mua)`.'],
  },
  {
    id: 'iv-stats-bayes-01',
    topicId: 'statistics',
    category: 'stats-probability-group',
    conceptIds: ['stats-bayes'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Phát biểu định lý Bayes và giải thích từng thành phần bằng một ví dụ. Vì sao phải dùng nó thay vì đọc thẳng độ nhạy của bộ lọc?',
    referenceAnswer: `Định lý Bayes là \`P(H|E) = P(E|H) × P(H) / P(E)\`. Nó suy ra trực tiếp từ việc viết \`P(H và E)\` theo hai cách, nên không phải một giả định.

Với bộ lọc gian lận: \`P(H)\` là prior, tức tỷ lệ gian lận 1%. \`P(E|H)\` là likelihood, tức độ nhạy 90%. \`P(E)\` là tỷ lệ báo động chung. \`P(H|E)\` là posterior, tức điều ta muốn biết: có báo động thì khả năng gian lận là bao nhiêu.

Không thể đọc thẳng độ nhạy, vì 90% là \`P(báo động|gian lận)\`, chiều ngược với câu hỏi cần trả lời. Trên 100.000 giao dịch, 1.000 gian lận tạo ra 900 báo động đúng, còn 99.000 giao dịch bình thường với tỷ lệ báo nhầm 5% tạo ra 4.950 báo động nhầm. Vậy chỉ 900 / 5.850 ≈ 15,4% báo động là thật. Đây chính là Base Rate Fallacy: bỏ qua tỷ lệ nền khiến người ta tưởng 90%.`,
    keyPoints: [
      { text: 'Viết đúng công thức', keywords: ['p(h|e)', 'p(e|h)', 'p(a|b)', 'p(b|a)'], weight: 2 },
      { text: 'Giải thích prior, likelihood, posterior', keywords: ['prior', 'likelihood', 'posterior', 'tiên nghiệm', 'hậu nghiệm'], weight: 2 },
      { text: 'Tính được ví dụ số', keywords: ['15,4', '900 / 5.850', '4.950', '4950'] },
      { text: 'Nêu Base Rate Fallacy', keywords: ['base rate', 'tỷ lệ nền'], weight: 2 },
    ],
    followUps: ['Tỷ lệ nền giảm xuống 0,1% thì kết quả thế nào?', 'Precision liên hệ với posterior ra sao?'],
    commonMistakes: ['Thuộc công thức nhưng không tính được ví dụ.', 'Đồng nhất độ nhạy với xác suất báo động đúng.'],
  },
  {
    id: 'iv-stats-bayes-02',
    topicId: 'statistics',
    category: 'stats-probability-group',
    conceptIds: ['stats-bayes', 'eval-precision', 'eda-imbalanced'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Mô hình gian lận đạt precision 80% trên tập kiểm thử cân bằng 50/50, nhưng chỉ khoảng 2% khi lên production, nơi tỷ lệ gian lận là 0,5%. Mô hình có bị hỏng không? Giải thích bằng Bayes.',
    referenceAnswer: `Chưa chắc hỏng, vì precision phụ thuộc vào tỷ lệ nền. Theo Bayes, precision chính là \`P(gian lận|báo động)\`, trong đó prior là tỷ lệ gian lận.

Tính thử: precision 80% với prior 50% nghĩa là \`TPR / FPR = 4\`, ví dụ TPR 80% và FPR 20%. Dùng dạng odds trên production: prior 0,5% có odds \`0,005 / 0,995 ≈ 0,005\`, nhân với tỷ số khả năng 4 được 0,02, tương ứng xác suất khoảng 2%. Vậy con số 2% đúng bằng điều Bayes dự đoán, mô hình vẫn phân biệt tốt như trước. Thứ sai là kỳ vọng được đặt trên một tập có tỷ lệ nền không thật.

Vì vậy tôi không so precision giữa hai tập có tỷ lệ nền khác nhau. Tôi so TPR và FPR, vốn không phụ thuộc tỷ lệ nền nếu phân phối theo từng lớp không đổi. Nếu precision đo được thấp hơn hẳn con số quy đổi, đó mới là dấu hiệu drift. Sau đó tôi đánh giá trên tập có tỷ lệ thật, dùng PR-AUC, hiệu chỉnh xác suất, và chọn ngưỡng theo chi phí của báo nhầm và bỏ sót. Nếu 2% vẫn quá thấp cho đội vận hành, phải giảm FPR hoặc thêm lớp kiểm tra thứ hai.`,
    keyPoints: [
      { text: 'Precision phụ thuộc tỷ lệ nền', keywords: ['tỷ lệ nền', 'base rate', 'prior'], weight: 2 },
      { text: 'Tính lại bằng Bayes hoặc odds', keywords: ['odds', 'bayes', 'tỷ số khả năng', 'likelihood ratio'], weight: 2 },
      { text: 'So TPR, FPR thay vì precision giữa hai tập', keywords: ['tpr', 'fpr', 'recall', 'báo nhầm'] },
      { text: 'Kiểm tra drift và đánh giá trên tỷ lệ thật', keywords: ['drift', 'tỷ lệ thật', 'pr auc', 'hiệu chỉnh', 'calibration'] },
    ],
    followUps: ['Làm sao hiệu chỉnh xác suất của mô hình đã huấn luyện trên dữ liệu cân bằng?', 'Chọn ngưỡng báo động thế nào khi biết chi phí từng loại lỗi?'],
    commonMistakes: ['Kết luận ngay là mô hình bị overfit.', 'Đánh giá precision trên tập đã cân bằng rồi hứa con số đó với nghiệp vụ.'],
  },
  {
    id: 'iv-stats-bayes-03',
    topicId: 'statistics',
    category: 'stats-probability-group',
    conceptIds: ['stats-bayes', 'stats-p-value', 'stats-confidence-interval'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'So sánh cách tiếp cận Bayes và tần suất trong A/B test. Khi nào bạn chọn Bayes? Bayes có giải quyết được vấn đề xem kết quả giữa chừng không?',
    referenceAnswer: `Tần suất coi hiệu ứng là một số cố định, và trả lời: nếu không có hiệu ứng thì dữ liệu này hiếm đến đâu. Bayes coi hiệu ứng là đại lượng có phân phối xác suất, và trả lời trực tiếp: xác suất B tốt hơn A là bao nhiêu, mức thiệt hại kỳ vọng nếu chọn sai là bao nhiêu. Cách nói đó dễ dùng hơn cho người làm sản phẩm.

Tôi nghiêng về Bayes khi có dữ liệu lịch sử đáng tin để xây prior, ví dụ phân phối hiệu ứng của hàng trăm thí nghiệm trước. Prior đó kéo các kết quả cực đoan về gần thực tế hơn. Ngược lại, khi cần quy tắc kiểm soát sai lầm rõ ràng trước kiểm toán, hoặc không thống nhất được prior, tôi dùng tần suất.

Về xem giữa chừng: posterior vẫn diễn giải được ở mọi thời điểm với prior đã chọn, nhưng điều đó không tự động kiểm soát tỷ lệ dương tính giả. Nếu dừng sớm ngay khi "xác suất B thắng > 95%" với prior phẳng, tỷ lệ công bố nhầm vẫn tăng. Vì vậy vẫn cần quy tắc dừng định trước, một prior hợp lý hoặc kiểm định tuần tự. Dù dùng cách nào, tôi vẫn báo cáo cỡ hiệu ứng và độ không chắc chắn.`,
    keyPoints: [
      { text: 'Hai cách trả lời hai câu hỏi khác nhau', keywords: ['xác suất b tốt hơn', 'p(dữ liệu', 'posterior', 'tham số cố định'], weight: 2 },
      { text: 'Prior từ dữ liệu lịch sử', keywords: ['prior', 'lịch sử', 'thí nghiệm trước'], weight: 2 },
      { text: 'Bayes không tự giải quyết peeking', keywords: ['peeking', 'giữa chừng', 'dừng sớm', 'quy tắc dừng'], weight: 2 },
      { text: 'Vẫn cần báo cáo cỡ hiệu ứng', keywords: ['cỡ hiệu ứng', 'effect size', 'thiệt hại kỳ vọng'] },
    ],
    followUps: ['Khoảng khả tín khác khoảng tin cậy thế nào?', 'Làm sao xây prior từ các thí nghiệm trước?'],
    commonMistakes: ['Nói Bayes cho phép xem kết quả thoải mái mà không có hệ quả gì.', 'Coi Bayes là cách để cần ít dữ liệu hơn mà không có đánh đổi.'],
  },
])
