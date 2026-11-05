import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-fe-imputation-01',
    topicId: 'features',
    category: 'fe-transform',
    conceptIds: ['fe-imputation', 'eda-missing-values'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn xử lý giá trị thiếu thế nào? So sánh các cách Imputation và tiêu chí chọn.',
    referenceAnswer: `Tôi bắt đầu từ câu hỏi vì sao dữ liệu thiếu, vì điều đó quyết định cách xử lý. Sau đó tôi xem mô hình có cần điền hay không, vì một số mô hình như \`HistGradientBoosting\` nhận trực tiếp giá trị thiếu.

Nếu cần điền, tôi bắt đầu bằng cách đơn giản. Trung vị cho cột số lệch, vì trung bình bị đuôi dài kéo. Giá trị phổ biến nhất hoặc một nhóm \`thiếu\` riêng cho cột phân loại. Cách này nhanh, dễ vận hành, nhưng làm giảm phương sai và làm yếu tương quan.

Cách đa biến dùng cột khác để ước lượng. KNN lấy trung bình từ các dòng gần nhất, phải co giãn trước và tốn chi phí khi dữ liệu lớn. \`IterativeImputer\` dự đoán lần lượt từng cột, mạnh hơn nhưng khó vận hành, và trong scikit-learn 1.9 vẫn là thử nghiệm.

Tôi chọn theo ba tiêu chí: mô hình đích, tỷ lệ thiếu, và chi phí vận hành. Tôi so sánh các cách bằng kiểm định chéo, trong đó bước điền được học lại ở mỗi fold. Với mô hình mạnh, cách đơn giản kèm cột chỉ báo thường đủ tốt.`,
    keyPoints: [
      { text: 'Xét nguyên nhân thiếu trước', keywords: ['vì sao', 'nguyên nhân', 'mcar', 'mar', 'mnar'], weight: 2 },
      { text: 'So sánh cách đơn giản và đa biến', keywords: ['trung vị', 'knn', 'iterative', 'đa biến'], weight: 2 },
      { text: 'Tác dụng phụ: giảm phương sai, yếu tương quan', keywords: ['phương sai', 'tương quan', 'méo'] },
      { text: 'Chọn bằng kiểm định chéo, học lại ở mỗi fold', keywords: ['kiểm định chéo', 'mỗi fold', 'pipeline'] },
    ],
    followUps: ['Khi nào nên xóa dòng hoặc xóa cột?', 'Cột thiếu 80% thì xử lý thế nào?'],
    commonMistakes: ['Điền trung bình cho mọi trường hợp.', 'Không hỏi vì sao dữ liệu thiếu.'],
  },
  {
    id: 'iv-fe-imputation-02',
    topicId: 'features',
    category: 'fe-transform',
    conceptIds: ['fe-imputation', 'eda-leakage'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao việc thiếu dữ liệu có thể là một tín hiệu dự đoán? Bạn tận dụng nó thế nào mà không rò rỉ?',
    referenceAnswer: `Giá trị thiếu không phải lúc nào cũng ngẫu nhiên. Khách hàng không khai thu nhập có thể vì thu nhập không ổn định, và trường đó trống vì hành vi của họ. Khi đó thông tin "có thiếu hay không" liên quan đến nhãn, độc lập với giá trị thật. Điền trung vị sẽ xóa mất điều này, vì dòng được điền trông như người bình thường.

Cách tận dụng là thêm cột chỉ báo, như \`add_indicator=True\`, để mô hình có cả giá trị đã điền và dấu hiệu từng thiếu. Tôi kiểm tra bằng cách so sánh tỷ lệ nhãn giữa nhóm thiếu và nhóm có dữ liệu, trên tập train.

Điểm cần cẩn trọng là tín hiệu này có còn tồn tại ở production không. Nếu giá trị thiếu do quy trình nội bộ, như trường chỉ được điền sau khi khoản vay vỡ nợ, thì đây là rò rỉ dù trông như một đặc trưng rất tốt. Tôi đối chiếu thời điểm trường được ghi nhận với thời điểm dự đoán. Ngoài ra, tín hiệu có thể mất đi khi quy trình nhập liệu thay đổi, nên tôi theo dõi tỷ lệ thiếu theo thời gian.`,
    keyPoints: [
      { text: 'Thiếu không ngẫu nhiên, liên quan đến nhãn', keywords: ['không ngẫu nhiên', 'liên quan đến nhãn', 'mnar', 'hành vi'], weight: 2 },
      { text: 'Thêm cột chỉ báo', keywords: ['cột chỉ báo', 'add_indicator', 'indicator', 'đánh dấu'], weight: 2 },
      { text: 'Kiểm tra thời điểm để tránh rò rỉ', keywords: ['thời điểm', 'rò rỉ', 'leakage', 'sau khi'], weight: 2 },
      { text: 'Theo dõi tỷ lệ thiếu ở production', keywords: ['theo dõi', 'tỷ lệ thiếu', 'quy trình nhập liệu', 'giám sát'] },
    ],
    followUps: ['Làm gì khi tỷ lệ thiếu ở production tăng gấp đôi?'],
    commonMistakes: ['Xem mọi giá trị thiếu là lỗi cần sửa.', 'Không kiểm tra cơ chế sinh ra giá trị thiếu.'],
  },
  {
    id: 'iv-fe-binning-01',
    topicId: 'features',
    category: 'fe-transform',
    conceptIds: ['fe-binning', 'fe-woe'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Khi nào nên dùng Binning và khi nào không? Bạn chọn cách chia ra sao?',
    referenceAnswer: `Binning có ích khi mô hình không tự bắt được quan hệ phi tuyến, chủ yếu là mô hình tuyến tính. Quan hệ hình chữ U giữa tuổi và rủi ro không thể biểu diễn bằng một hệ số, nhưng mỗi nhóm tuổi có thể có một mức riêng. Trong tín dụng, Binning đi cùng WoE để làm thẻ điểm dễ giải thích, đồng thời giới hạn ngoại lai và cho giá trị thiếu thành nhóm riêng.

Tôi không dùng khi mô hình là cây, vì cây tự tìm ngưỡng từ dữ liệu. Tôi cũng tránh chia đôi biến liên tục chỉ để báo cáo cho gọn, vì mất nhiều thông tin, điều mà Royston, Altman và Sauerbrei đã cảnh báo.

Về cách chia: equal-width dễ hiểu nhưng ngoại lai làm dồn dòng vào một nhóm. Equal-frequency bền hơn và là mặc định của \`KBinsDiscretizer\`, nhưng gặp khó khi có nhiều giá trị trùng. Chia theo nhãn thường mạnh nhất, nhưng phải học trên train vì dễ rò rỉ.

Đánh đổi chung là mất thông tin trong nhóm và có bước nhảy ở ranh giới, nên tôi luôn so sánh với cách giữ nguyên biến liên tục.`,
    keyPoints: [
      { text: 'Có ích với mô hình tuyến tính, không cần với cây', keywords: ['tuyến tính', 'phi tuyến', 'cây'], weight: 2 },
      { text: 'So sánh equal-width và equal-frequency', keywords: ['equal-width', 'equal-frequency', 'cùng độ rộng', 'cùng số dòng'], weight: 2 },
      { text: 'Chia theo nhãn dễ rò rỉ', keywords: ['theo nhãn', 'rò rỉ', 'trên train'] },
      { text: 'Mất thông tin và bước nhảy ở ranh giới', keywords: ['mất thông tin', 'ranh giới', 'bước nhảy'] },
    ],
    followUps: ['Chọn số nhóm thế nào?', 'Binning có giúp được với cây không?'],
    commonMistakes: ['Khẳng định Binning luôn giúp mô hình ổn định hơn.'],
  },
])
