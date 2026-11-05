import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-stats-correlation-causation-01',
    topicId: 'statistics',
    category: 'stats-relationship',
    conceptIds: ['stats-correlation-causation', 'stats-hypothesis'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Correlation và Causation khác nhau như thế nào? Làm sao biết một quan hệ thật sự là nhân quả?',
    referenceAnswer: `Tương quan nói rằng hai biến cùng biến động trong dữ liệu quan sát. Nhân quả nói rằng nếu can thiệp thay đổi X thì Y sẽ đổi theo. Quyết định kinh doanh hầu như đều là can thiệp, nên nhầm hai điều này rất tốn kém.

Có tương quan mà không có nhân quả vì nhiều lý do. **Biến gây nhiễu:** người dùng gắn bó vừa hay dùng tính năng, vừa ít rời bỏ, nên tương quan không chứng tỏ tính năng giữ chân họ. **Nhân quả ngược**, **thiên lệch chọn mẫu**, và **ngẫu nhiên** khi dò nhiều cặp biến.

**Simpson's Paradox** cho thấy dữ liệu quan sát có thể sai lệch thế nào: thử nghiệm tốt hơn ở cả máy tính và điện thoại, nhưng kém hơn trên tổng, vì cơ cấu thiết bị hai nhóm khác nhau.

Cách đáng tin nhất là **thí nghiệm ngẫu nhiên**. Phân nhóm ngẫu nhiên làm việc được can thiệp không phụ thuộc vào đặc điểm của người dùng, kể cả đặc điểm không đo được, nên hai nhóm chỉ khác ở can thiệp và dao động ngẫu nhiên, mà kiểm định xử lý được phần này. Khi không thể thí nghiệm, tôi dùng thí nghiệm tự nhiên như difference-in-differences, nhưng phải nói rõ giả định.`,
    keyPoints: [
      { text: 'Tương quan là cùng biến động, nhân quả là khi can thiệp', keywords: ['can thiệp', 'cùng biến động', 'intervention'], weight: 2 },
      { text: 'Biến gây nhiễu', keywords: ['gây nhiễu', 'confounder', 'confounding'], weight: 2 },
      { text: "Simpson's Paradox", keywords: ['simpson'], weight: 2 },
      { text: 'Thí nghiệm ngẫu nhiên', keywords: ['ngẫu nhiên', 'a/b test', 'randomized', 'rct'], weight: 2 },
      { text: 'Nhân quả ngược hoặc thiên lệch chọn mẫu', keywords: ['nhân quả ngược', 'chọn mẫu', 'selection bias', 'reverse'] },
    ],
    followUps: ['Vì sao đưa thêm biến kiểm soát vào mô hình chưa đủ để có nhân quả?', 'Khi nào số theo nhóm lại không đáng tin hơn số tổng?'],
    commonMistakes: ['Chỉ đọc khẩu hiệu "tương quan không phải nhân quả" mà không nêu cơ chế.', 'Cho rằng p nhỏ trên dữ liệu quan sát là bằng chứng nhân quả.'],
  },
  {
    id: 'iv-stats-correlation-causation-02',
    topicId: 'statistics',
    category: 'stats-relationship',
    conceptIds: ['stats-correlation-causation', 'stats-covariance', 'eda-correlation'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Hệ số Pearson đo chính xác điều gì? Nó gây hiểu sai trong những trường hợp nào, và bạn dùng gì thay thế?',
    referenceAnswer: `Pearson là covariance đã chuẩn hóa: \`r = Cov(X, Y) / (s_x × s_y)\`, từ -1 đến 1. Nó đo mức độ các điểm nằm gần một đường thẳng, nên chỉ đo quan hệ **tuyến tính**. Nó cũng không nói gì về độ dốc: đường rất thoải vẫn có thể có r gần 1.

Gây hiểu sai trong vài trường hợp. **Quan hệ phi tuyến:** x = -2, -1, 0, 1, 2 và y = x² có Cov = 0 nên r = 0, dù y phụ thuộc hoàn toàn vào x. **Ngoại lai:** bộ tứ Anscombe có bốn bộ dữ liệu cùng r ≈ 0,82 nhưng hình dạng rất khác nhau, có bộ chỉ nhờ một điểm mà có r cao. **Nhóm gộp:** tương quan trong từng nhóm có thể ngược với tương quan chung. **Khoảng giá trị bị cắt:** chỉ xét nhóm đã qua sàng lọc làm r giảm đi.

Tôi luôn vẽ biểu đồ phân tán trước. Với quan hệ đơn điệu hoặc có ngoại lai, tôi dùng Spearman, vốn tính trên thứ hạng. Với quan hệ phức tạp hơn, tôi dùng mutual information hoặc so sánh mô hình. Trên hết, r cao vẫn không cho biết nhân quả.`,
    keyPoints: [
      { text: 'Chỉ đo quan hệ tuyến tính', keywords: ['tuyến tính', 'linear', 'đường thẳng'], weight: 2 },
      { text: 'Ví dụ r = 0 nhưng có quan hệ', keywords: ['phi tuyến', 'x²', 'chữ u', 'y = x'], weight: 2 },
      { text: 'Nhạy với ngoại lai, cần vẽ biểu đồ', keywords: ['ngoại lai', 'anscombe', 'biểu đồ', 'outlier'], weight: 2 },
      { text: 'Dùng Spearman hoặc mutual information', keywords: ['spearman', 'thứ hạng', 'mutual information'] },
    ],
    followUps: ['Khi nào Spearman cũng thất bại?', 'Vì sao khoảng giá trị bị cắt lại làm r giảm?'],
    commonMistakes: ['Nói r = 0 nghĩa là không liên quan.', 'Đọc r như độ dốc của quan hệ.'],
  },
  {
    id: 'iv-stats-correlation-causation-03',
    topicId: 'statistics',
    category: 'stats-relationship',
    conceptIds: ['stats-correlation-causation', 'stats-conditional'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: "Kết quả theo từng phân khúc và kết quả tổng ngược chiều nhau. Giải thích Simpson's Paradox và nêu cách bạn quyết định nên tin số nào.",
    referenceAnswer: `Nghịch lý xảy ra vì tỷ lệ tổng là trung bình có trọng số, với trọng số là cơ cấu nhóm. Ví dụ đối chứng: máy tính 15% với 800 người, điện thoại 5% với 200 người, tổng 13%. Thử nghiệm: máy tính 16% với 200 người, điện thoại 6% với 800 người, tổng 8%. Thử nghiệm tốt hơn ở cả hai thiết bị, nhưng thua trên tổng vì tập trung vào nhóm có tỷ lệ thấp. Quy về cùng cơ cấu 50/50 thì là 10% và 11%. Berkeley năm 1973 là ví dụ nổi tiếng.

Quyết định phụ thuộc vào cơ chế, không phụ thuộc vào số. Nếu biến phân khúc là **biến gây nhiễu**, tác động đến cả việc nhận can thiệp lẫn kết quả, thì tin số theo nhóm. Nếu là **biến trung gian**, tức can thiệp tác động qua nó, chia theo nó sẽ che mất hiệu ứng, nên tin số tổng. Hướng mũi tên phải đến từ hiểu biết về nghiệp vụ, hoặc từ một sơ đồ nhân quả.

Trong A/B test, phân ngẫu nhiên phải cho cơ cấu gần như nhau, nên việc đầu tiên là kiểm tra lỗi chia nhóm, tức Sample Ratio Mismatch. Tôi cũng xem việc tăng dần tỷ lệ phân bổ có làm cơ cấu đổi theo thời gian không.`,
    keyPoints: [
      { text: 'Trung bình có trọng số, cơ cấu nhóm khác nhau', keywords: ['trọng số', 'cơ cấu', 'weighted'], weight: 2 },
      { text: 'Có ví dụ số hoặc Berkeley', keywords: ['berkeley', 'cơ cấu thiết bị', 'điện thoại', 'máy tính', 'sỏi thận'] },
      { text: 'Phụ thuộc vào cơ chế nhân quả', keywords: ['cơ chế', 'gây nhiễu', 'trung gian', 'mediator', 'confounder'], weight: 2 },
      { text: 'Trong A/B test: kiểm tra lỗi chia nhóm', keywords: ['sample ratio mismatch', 'srm', 'lỗi chia nhóm', 'tỷ lệ chia'], weight: 2 },
    ],
    followUps: ['Tăng dần tỷ lệ phân bổ có thể gây ra nghịch lý này thế nào?', 'Sơ đồ nhân quả giúp gì trong tình huống này?'],
    commonMistakes: ['Khẳng định luôn tin số theo nhóm.', 'Không nghĩ đến lỗi chia nhóm khi gặp hiện tượng này trong A/B test.'],
  },
  {
    id: 'iv-stats-correlation-causation-04',
    topicId: 'statistics',
    category: 'stats-relationship',
    conceptIds: ['stats-correlation-causation', 'stats-hypothesis'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Bạn cần đánh giá tác động của việc tăng giá đã áp dụng cho toàn bộ một thành phố, nên không thể chạy A/B test. Bạn tiếp cận thế nào và tin kết quả đến đâu?',
    referenceAnswer: `Tôi coi đây là thí nghiệm tự nhiên. So sánh trước và sau là không đủ, vì lẫn với mùa vụ và xu hướng chung. So với thành phố khác cũng không đủ, vì các thành phố vốn đã khác nhau.

Tôi dùng **difference-in-differences**: lấy thay đổi ở thành phố tăng giá trừ thay đổi ở nhóm đối chứng. Cách này loại khác biệt cố định giữa các thành phố và xu hướng chung. Giả định cốt lõi là **xu hướng song song**: nếu không tăng giá, hai nhóm sẽ biến động như nhau. Tôi kiểm tra bằng cách so xu hướng trong nhiều kỳ trước đó, nhưng không chứng minh được hoàn toàn. Nếu không có thành phố nào đủ giống, tôi dùng **synthetic control**, tức ghép có trọng số từ nhiều thành phố.

Để tăng độ tin cậy, tôi chạy kiểm tra giả: đổi thời điểm can thiệp sang một ngày giả, hoặc đổi sang thành phố không tăng giá, kết quả phải gần 0. Tôi cũng xem có sự kiện đồng thời hay người dùng chuyển sang thành phố lân cận không.

Khi báo cáo, tôi nêu rõ giả định, khoảng ước lượng và độ nhạy của kết quả. Đây là bằng chứng yếu hơn thí nghiệm ngẫu nhiên. Nếu quyết định có giá trị lớn, tôi đề xuất một thí nghiệm theo cụm cho lần sau.`,
    keyPoints: [
      { text: 'Vì sao trước-sau và so sánh chéo không đủ', keywords: ['mùa vụ', 'xu hướng chung', 'trước và sau'], weight: 2 },
      { text: 'Difference-in-differences và giả định xu hướng song song', keywords: ['difference in differences', 'did', 'xu hướng song song', 'parallel trends'], weight: 2 },
      { text: 'Kiểm tra giả để tăng độ tin cậy', keywords: ['kiểm tra giả', 'placebo', 'độ nhạy'], weight: 2 },
      { text: 'Nêu rõ giới hạn, đề xuất thí nghiệm theo cụm', keywords: ['bằng chứng yếu', 'giả định', 'theo cụm', 'synthetic control'] },
    ],
    followUps: ['Khi nào nên dùng regression discontinuity?', 'Bạn trình bày độ không chắc chắn với lãnh đạo thế nào?'],
    commonMistakes: ['Chỉ so sánh trước và sau.', 'Không nêu giả định xu hướng song song hoặc cách kiểm tra nó.'],
  },
  {
    id: 'iv-stats-covariance-01',
    topicId: 'statistics',
    category: 'stats-relationship',
    conceptIds: ['stats-covariance', 'stats-variance-std'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Phân biệt covariance và correlation. Nếu correlation dễ đọc hơn, vì sao covariance vẫn quan trọng?',
    referenceAnswer: `Covariance đo hai biến cùng lệch khỏi mean theo một chiều đến mức nào, nên dấu cho biết chiều quan hệ, còn độ lớn phụ thuộc vào đơn vị. Đổi doanh thu từ triệu đồng sang nghìn đồng làm Cov nhân 1.000. Correlation chia Cov cho tích hai std, nên không có đơn vị, nằm trong khoảng từ -1 đến 1, và so sánh được giữa các cặp biến.

Tôi dùng correlation để diễn giải, nhưng covariance xuất hiện trực tiếp trong tính toán. Thứ nhất là phương sai của tổng: \`Var(X + Y) = Var(X) + Var(Y) + 2 × Cov(X, Y)\`. Tương quan dương làm tổng dao động mạnh hơn, nên khi dự báo tổng nhu cầu của các sản phẩm liên quan, bỏ qua Cov sẽ đánh giá thấp rủi ro. Thứ hai là PCA, nơi các thành phần chính là vector riêng của ma trận hiệp phương sai. Thứ ba là CUPED: dùng metric trước thí nghiệm để giảm phương sai, với hệ số \`Cov(Y, X) / Var(X)\`.

Cả hai đều chỉ đo quan hệ tuyến tính, nên Cov = 0 không có nghĩa là độc lập.`,
    keyPoints: [
      { text: 'Covariance phụ thuộc đơn vị, correlation đã chuẩn hóa', keywords: ['đơn vị', 'chuẩn hóa', 'normalize'], weight: 2 },
      { text: 'Công thức phương sai của tổng', keywords: ['var(x + y)', 'phương sai của tổng', 'cộng phương sai'], weight: 2 },
      { text: 'Ứng dụng trong PCA hoặc CUPED', keywords: ['pca', 'cuped', 'ma trận hiệp phương sai'] },
      { text: 'Cov = 0 không suy ra độc lập', keywords: ['không suy ra', 'không có nghĩa', 'độc lập'] },
    ],
    followUps: ['Vì sao nên chuẩn hóa dữ liệu trước khi làm PCA?', 'Hệ số CUPED được tính ra từ đâu?'],
    commonMistakes: ['Dùng độ lớn của Cov để nói quan hệ mạnh hay yếu.', 'Cộng phương sai mà quên phần Cov.'],
  },
])
