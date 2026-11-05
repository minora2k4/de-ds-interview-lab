import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-eda-sampling-01',
    topicId: 'analysis',
    category: 'eda-sampling-group',
    conceptIds: ['eda-sampling', 'eval-train-val-test'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Stratified Sampling là gì? Vì sao nó có ích khi tách train và test?',
    referenceAnswer: `Stratified Sampling chia tổng thể thành các tầng theo một biến đã biết, như lớp của nhãn hay khu vực, rồi lấy mẫu riêng trong từng tầng. Điểm khác với lấy ngẫu nhiên đơn giản là tỷ lệ của mỗi tầng được kiểm soát, không phụ thuộc vào may rủi.

Nó có ích vì hai lý do. Thứ nhất, các nhóm hiếm chắc chắn có mặt. Với 1% mẫu dương và 500 dòng trong test, tách ngẫu nhiên kỳ vọng có 5 mẫu dương, nhưng có thể chỉ có 1 hoặc 2, khi đó chỉ số rất dao động. Thứ hai, nó giảm sai số, vì khác biệt giữa các tầng không còn tính vào sai số.

Khi tách tập hay Cross Validation, tôi phân tầng theo nhãn để mỗi fold có tỷ lệ giống nhau, nhất là với dữ liệu mất cân bằng.

Nhưng nó có giới hạn. Với dữ liệu theo thời gian thì phải tách theo thời gian, và khi một người có nhiều dòng thì phải tách theo người.`,
    keyPoints: [
      { text: 'Chia tầng rồi lấy mẫu trong từng tầng', keywords: ['tầng', 'strata', 'từng nhóm', 'từng tầng'], weight: 2 },
      { text: 'Bảo đảm nhóm hiếm có mặt', keywords: ['nhóm hiếm', 'lớp hiếm', 'có mặt', 'giữ tỷ lệ'], weight: 2 },
      { text: 'Giảm sai số', keywords: ['giảm sai số', 'giảm phương sai', 'dao động'] },
      { text: 'Giới hạn với thời gian và nhóm', keywords: ['theo thời gian', 'theo nhóm', 'theo người'] },
    ],
    followUps: ['Tầng nào thì nên lấy nhiều mẫu hơn?', 'Phân tầng trên nhiều biến cùng lúc gặp khó khăn gì?'],
    commonMistakes: ['Cho rằng phân tầng sửa được mọi sai lệch.', 'Dùng phân tầng ngẫu nhiên cho dữ liệu chuỗi thời gian.'],
  },
  {
    id: 'iv-eda-sampling-02',
    topicId: 'analysis',
    category: 'eda-sampling-group',
    conceptIds: ['eda-sampling', 'dq-representativeness', 'stats-confidence-interval'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao mẫu rất lớn vẫn có thể cho kết luận sai? Nêu các sai lệch khi lấy mẫu và cách phát hiện.',
    referenceAnswer: `Sai số gồm hai phần. **Sai số ngẫu nhiên** giảm theo căn bậc hai của cỡ mẫu. **Sai lệch** là hệ thống, không giảm khi thêm dữ liệu. Mẫu lớn chỉ cho khoảng tin cậy hẹp quanh một con số sai, nên còn nguy hiểm hơn vì tạo cảm giác chắc chắn. Năm 1936, Literary Digest nhận khoảng 2,4 triệu phiếu nhưng vẫn đoán sai người thắng cử.

Các sai lệch thường gặp: **Undercoverage**, như khảo sát qua app thì bỏ sót người không dùng app. **Non-response**, khi người không trả lời khác người trả lời. **Self-selection**, như đánh giá sản phẩm chủ yếu từ người rất hài lòng hoặc rất tức giận. **Survivorship**, như chỉ phân tích khách còn hoạt động.

Để phát hiện, tôi so sánh mẫu với số liệu tổng thể đã biết, như tuổi, khu vực, doanh thu. Tôi hỏi rõ dữ liệu đi qua những bộ lọc nào, và ai không có cơ hội xuất hiện. Sau đó có thể gán lại trọng số nếu biết biến gây lệch. Nhưng trọng số không cứu được nhóm hoàn toàn vắng mặt, nên đôi khi phải thu thập thêm.`,
    keyPoints: [
      { text: 'Phân biệt sai số ngẫu nhiên và sai lệch hệ thống', keywords: ['sai số ngẫu nhiên', 'hệ thống', 'random error', 'bias'], weight: 2 },
      { text: 'Tăng cỡ mẫu không giảm sai lệch', keywords: ['không giảm', 'cỡ mẫu', 'literary digest'], weight: 2 },
      { text: 'Nêu các loại sai lệch', keywords: ['undercoverage', 'non response', 'survivorship', 'tự chọn', 'không phản hồi', 'self selection'] },
      { text: 'So sánh với số liệu tổng thể', keywords: ['tổng thể', 'so sánh', 'số liệu đã biết'] },
      { text: 'Gán trọng số có giới hạn', keywords: ['trọng số', 'vắng mặt', 'thu thập thêm'] },
    ],
    followUps: ['Khi nào gán lại trọng số làm phương sai tăng quá nhiều?', 'Survivorship Bias xuất hiện thế nào trong mô hình rời mạng?'],
    commonMistakes: ['Cho rằng dữ liệu lớn thì không cần quan tâm cách lấy mẫu.'],
  },
  {
    id: 'iv-eda-sampling-03',
    topicId: 'analysis',
    category: 'eda-sampling-group',
    conceptIds: ['eda-sampling', 'dq-sampling', 'eda-overview'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bảng có 5 tỷ sự kiện của 20 triệu người dùng, quá lớn để làm EDA trực tiếp. Bạn thiết kế việc lấy mẫu thế nào?',
    referenceAnswer: `Đầu tiên tôi xác định đơn vị phân tích. Nếu quan tâm hành vi người dùng thì lấy theo người dùng: chọn theo hash của \`user_id\` và giữ trọn sự kiện của họ. Lấy ngẫu nhiên từng sự kiện sẽ làm vỡ hành trình, và làm người dùng tích cực xuất hiện nhiều hơn. Dùng hash thì kết quả tái lập được, và có thể mở rộng mẫu.

Sau đó tôi phân tầng theo các biến ảnh hưởng đến câu hỏi: khu vực, thiết bị, mức hoạt động. Các nhóm hiếm nhưng quan trọng, như người mua hàng lớn hay sự kiện lỗi, được lấy với tỷ lệ cao hơn, thậm chí lấy toàn bộ. Khi đó mọi con số tổng hợp phải dùng trọng số ngược với tỷ lệ lấy mẫu.

Để kiểm tra, tôi tính chính xác vài số tổng trên toàn bảng, như số sự kiện theo ngày và tỷ lệ theo khu vực, rồi so với mẫu. Tôi không dùng mẫu cho những gì phụ thuộc đuôi hoặc số lượng duy nhất, vì mẫu ước lượng kém. Những việc đó nên chạy trên toàn bảng hoặc dùng thuật toán xấp xỉ. Cuối cùng, tôi nêu rõ cách lấy mẫu trong báo cáo, để người đọc biết giới hạn của kết quả.`,
    keyPoints: [
      { text: 'Lấy theo đơn vị phân tích, giữ trọn người dùng', keywords: ['theo người dùng', 'giữ trọn', 'đơn vị phân tích'], weight: 2 },
      { text: 'Dùng hash để tái lập', keywords: ['hash', 'tái lập'] },
      { text: 'Phân tầng, lấy nhiều hơn ở nhóm hiếm và dùng trọng số', keywords: ['phân tầng', 'nhóm hiếm', 'trọng số'], weight: 2 },
      { text: 'Đối chiếu mẫu với số tổng trên toàn bảng', keywords: ['toàn bảng', 'đối chiếu', 'so với mẫu'] },
      { text: 'Không dùng mẫu cho đuôi và số lượng duy nhất', keywords: ['đuôi', 'số lượng duy nhất', 'xấp xỉ', 'approximate'] },
    ],
    followUps: ['Bạn chọn cỡ mẫu bao nhiêu là đủ?', 'Thuật toán xấp xỉ nào dùng cho số lượng duy nhất?'],
    commonMistakes: ['Dùng `LIMIT` hoặc lấy một ngày dữ liệu rồi gọi đó là mẫu.', 'Quên dùng trọng số sau khi lấy mẫu khác tỷ lệ.'],
  },
])
