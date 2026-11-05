import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-stats-distributions-01',
    topicId: 'statistics',
    category: 'stats-distributions-group',
    conceptIds: ['stats-distributions', 'stats-normal'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn chọn phân phối cho một biến như thế nào? Cho một ví dụ chọn sai phân phối dẫn đến kết luận sai.',
    referenceAnswer: `Tôi bắt đầu từ cơ chế sinh dữ liệu, không phải từ biểu đồ. Câu hỏi đầu tiên: đây là đếm hay đo, có giới hạn trên không, các quan sát có độc lập không. Số người mua trong n người là nhị thức. Số lỗi mỗi giờ là Poisson nếu sự kiện độc lập. Giá trị dương với đuôi phải dài như số tiền, độ trễ thường gần log-normal. Tổng của nhiều yếu tố nhỏ thì gần chuẩn.

Sau đó tôi ước lượng tham số và đối chiếu bằng biểu đồ, đặc biệt là phần đuôi, vì đó là nơi mô hình sai gây hậu quả lớn nhất mà ít dữ liệu nhất.

Ví dụ: giá trị giao dịch có mean 500 nghìn đồng, std 1,5 triệu đồng. Giả định chuẩn sẽ cho \`z = -0,33\`, tức khoảng 37% giao dịch có giá trị âm, điều không thể xảy ra. Phần đuôi phải cũng bị đánh giá thấp, nên rủi ro giao dịch lớn bị tính thiếu. Tôi không cố tìm phân phối "đúng", mà chỉ cần xấp xỉ đủ tốt cho quyết định đang xét.`,
    keyPoints: [
      { text: 'Bắt đầu từ cơ chế sinh dữ liệu', keywords: ['cơ chế', 'đếm hay đo', 'sinh dữ liệu'], weight: 2 },
      { text: 'Đối chiếu bằng biểu đồ, nhất là phần đuôi', keywords: ['biểu đồ', 'phần đuôi', 'qq plot', 'histogram'], weight: 2 },
      { text: 'Biết ánh xạ tình huống với phân phối', keywords: ['nhị thức', 'poisson', 'log normal', 'binomial'] },
      { text: 'Có ví dụ về hậu quả của việc chọn sai', keywords: ['giá trị âm', 'đánh giá thấp', 'rủi ro'] },
    ],
    followUps: ['Vì sao kiểm định độ phù hợp với mẫu rất lớn thường bác bỏ mọi phân phối?'],
    commonMistakes: ['Mặc định mọi biến đều chuẩn.', 'Chỉ dựa vào kiểm định độ phù hợp mà không xem biểu đồ.'],
  },
  {
    id: 'iv-stats-normal-01',
    topicId: 'statistics',
    category: 'stats-distributions-group',
    conceptIds: ['stats-normal', 'stats-confidence-interval'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Định lý giới hạn trung tâm nói gì, và vì sao nó quan trọng đến vậy với A/B test? Nó có khi nào không áp dụng được không?',
    referenceAnswer: `CLT nói rằng với các quan sát độc lập, cùng phân phối, có phương sai hữu hạn, mean của mẫu xấp xỉ phân phối chuẩn khi n đủ lớn, với \`SE = σ / sqrt(n)\`. Trực giác là các giá trị lệch về hai phía bù trừ nhau, và tổ hợp vừa phải nhiều hơn hẳn tổ hợp cực đoan.

Nó quan trọng vì metric thật hiếm khi chuẩn, nhưng ta chỉ cần phân phối của mean. Nhờ đó, chỉ với mean, std và n là tính được p-value và khoảng tin cậy, mà không cần biết hình dạng dữ liệu gốc.

Có ba tình huống cần cẩn thận. **Lệch mạnh:** với doanh thu mỗi người, CLT vẫn đúng về lý thuyết nhưng hội tụ rất chậm, nên mốc n = 30 có thể sai hoàn toàn, và có thể cần hàng nghìn quan sát. **Phương sai vô hạn:** với đuôi cực dày như phân phối Cauchy, mean không hội tụ. **Không độc lập:** các lượt xem của cùng một người làm SE bị thấp hơn thực tế. Lúc đó tôi dùng winsorize, bootstrap, hoặc phân tích theo người dùng. Cũng cần nhớ CLT không làm dữ liệu trở nên chuẩn.`,
    keyPoints: [
      { text: 'Mean mẫu xấp xỉ chuẩn, không phải dữ liệu', keywords: ['mean mẫu', 'trung bình mẫu', 'sampling distribution', 'phân phối của mean'], weight: 2 },
      { text: 'Điều kiện độc lập và phương sai hữu hạn', keywords: ['độc lập', 'phương sai hữu hạn', 'iid'], weight: 2 },
      { text: 'Cho phép tính p-value và CI mà không biết dạng dữ liệu', keywords: ['p value', 'khoảng tin cậy', 'confidence interval', 'sai số chuẩn'] },
      { text: 'Dữ liệu lệch mạnh hội tụ chậm', keywords: ['hội tụ chậm', 'lệch mạnh', 'đuôi dài', 'bootstrap', 'winsorize'] },
    ],
    followUps: ['Làm sao kiểm tra xem CLT đã đủ tốt với metric của bạn?', 'Bootstrap giúp gì trong trường hợp này?'],
    commonMistakes: ['Nói dữ liệu sẽ trở nên chuẩn khi có nhiều dữ liệu.', 'Coi n = 30 là ngưỡng đúng cho mọi dữ liệu.'],
  },
  {
    id: 'iv-stats-binomial-01',
    topicId: 'statistics',
    category: 'stats-distributions-group',
    conceptIds: ['stats-binomial', 'stats-hypothesis'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao SE của một tỷ lệ là sqrt(p(1-p)/n)? Điều gì xảy ra với công thức này khi tính theo lượt xem nhưng phân nhóm theo người dùng?',
    referenceAnswer: `Mỗi người là một biến Bernoulli với mean \`p\` và phương sai \`p(1 - p)\`. Tổng số người chuyển đổi là tổng của n biến độc lập, nên phương sai là \`np(1 - p)\`. Tỷ lệ là tổng chia cho n, nên phương sai chia cho \`n²\`, còn \`p(1 - p) / n\`. Lấy căn được SE. Với p = 10%, n = 10.000 thì SE = 0,3 điểm phần trăm.

Công thức này dựa vào độc lập. Nếu phân nhóm theo người dùng mà tính theo lượt xem, các lượt xem của cùng một người có tương quan, vì một người thích nhấp thì nhấp nhiều lần. Phương sai thật lớn hơn công thức, thường được mô tả bằng design effect. Trường hợp cực đoan là mỗi người có 10 lượt xem với hành vi giống hệt nhau: 10.000 lượt xem chỉ có giá trị như 1.000 người, nên SE thật khoảng 0,95 điểm phần trăm, gấp hơn 3 lần.

Hậu quả là p-value bị nhỏ đi giả tạo, và tỷ lệ dương tính giả cao hơn nhiều so với 5%. Cách xử lý là phân tích ở cấp người dùng, dùng delta method cho metric dạng tỷ số, hoặc bootstrap theo người dùng.`,
    keyPoints: [
      { text: 'Suy ra từ tổng các biến Bernoulli độc lập', keywords: ['bernoulli', 'tổng', 'độc lập'], weight: 2 },
      { text: 'Lượt xem của cùng một người có tương quan', keywords: ['tương quan', 'cùng một người', 'đơn vị phân tích', 'unit'], weight: 2 },
      { text: 'SE bị thấp nên dương tính giả tăng', keywords: ['dương tính giả', 'false positive', 'p value nhỏ', 'se thấp'] },
      { text: 'Cách xử lý: cấp người dùng, delta method, bootstrap', keywords: ['delta method', 'bootstrap', 'cấp người dùng', 'cluster'] },
    ],
    followUps: ['Delta method hoạt động thế nào với metric dạng tỷ số?', 'A/A test giúp phát hiện lỗi này ra sao?'],
    commonMistakes: ['Thuộc công thức nhưng không nêu được giả định độc lập.', 'Coi số lượt xem là cỡ mẫu khi phân nhóm theo người dùng.'],
  },
  {
    id: 'iv-stats-poisson-01',
    topicId: 'statistics',
    category: 'stats-distributions-group',
    conceptIds: ['stats-poisson'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bạn muốn đặt ngưỡng cảnh báo cho số lỗi mỗi giờ của một API, trung bình 4 lỗi. Poisson giúp gì và khi nào nó sai?',
    referenceAnswer: `Nếu lỗi độc lập với tốc độ đều, số lỗi mỗi giờ theo Poisson với \`λ = 4\`. Khi đó tôi tính được xác suất vượt ngưỡng: \`P(X ≥ 8)\` khoảng 5%, còn \`P(X ≥ 10)\` khoảng 0,8%. Một hệ thống chạy 24 giờ mỗi ngày với ngưỡng 8 sẽ có khoảng 1 báo động nhầm mỗi ngày, nên tôi chọn ngưỡng theo số báo động nhầm mà đội vận hành chấp nhận được, ví dụ ngưỡng 10 cho khoảng 1 lần mỗi 5 ngày.

Trước khi dùng tôi kiểm tra giả định bằng cách so sánh phương sai với mean. Có ba nguồn vi phạm chính. Lưu lượng đổi theo giờ, nên tốc độ không đều: tôi cho \`λ\` thay đổi theo khung giờ, hoặc đếm tỷ lệ lỗi trên số request. Lỗi kéo theo nhau, như client tự thử lại. Sự cố làm lỗi đến theo cụm. Nếu mean là 4 mà phương sai là 20 thì ngưỡng Poisson sẽ báo động liên tục, và tôi chuyển sang Negative Binomial hoặc ngưỡng theo percentile lịch sử.

Cuối cùng, cảnh báo có đánh đổi giữa báo nhầm và bỏ sót, nên ngưỡng cuối cùng phụ thuộc vào chi phí của từng loại lỗi.`,
    keyPoints: [
      { text: 'Tính xác suất vượt ngưỡng từ Poisson', keywords: ['vượt ngưỡng', 'λ', 'lambda', 'p(x'], weight: 2 },
      { text: 'Giả định độc lập và tốc độ đều', keywords: ['độc lập', 'tốc độ', 'không đổi'], weight: 2 },
      { text: 'Kiểm tra phương sai so với mean', keywords: ['phương sai', 'overdispersion'], weight: 2 },
      { text: 'Dùng Negative Binomial hoặc λ theo khung giờ', keywords: ['negative binomial', 'khung giờ', 'percentile'] },
    ],
    followUps: ['Nếu theo dõi 100 API cùng lúc thì ngưỡng cần đổi thế nào?', 'Thời gian giữa hai lỗi theo phân phối nào?'],
    commonMistakes: ['Dùng một λ cố định cho cả ngày.', 'Đặt ngưỡng mà không tính số báo động nhầm mỗi ngày.'],
  },
])
