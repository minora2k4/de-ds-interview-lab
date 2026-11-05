import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-eval-over-01',
    topicId: 'evaluation',
    category: 'eval-fit',
    conceptIds: ['eval-overfitting', 'eval-bias-variance'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Làm sao nhận biết mô hình bị overfitting và bạn xử lý thế nào?',
    referenceAnswer: `Overfitting là khi mô hình học cả nhiễu của dữ liệu huấn luyện. Nhiễu không lặp lại ở dữ liệu mới, nên điểm số tụt xuống khi ra khỏi Train.

Tôi nhận biết bằng cách so sánh Train với Validation: Train cao, Validation thấp hơn nhiều, và Validation xấu đi khi độ phức tạp tăng tiếp. Ví dụ cây quyết định đạt AUC 0,99 trên Train nhưng chỉ 0,71 trên Validation. Learning curve còn cho biết thêm dữ liệu có giúp không: hai đường cách xa nhưng đang tiến lại gần nghĩa là có.

Cách xử lý: thêm dữ liệu nếu được, giảm độ linh hoạt bằng regularization hoặc giới hạn độ sâu, bỏ đặc trưng nhiễu, dùng Early Stopping, hoặc Bagging.

Tôi cũng tránh kết luận vội. Điểm Train gần tuyệt đối của Random Forest là bình thường. Khoảng cách lớn cũng có thể do Train và Validation khác phân phối. Và nếu cả hai đều cao mà triển khai lại kém, tôi nghĩ tới rò rỉ dữ liệu trước.`,
    keyPoints: [
      { text: 'Học cả nhiễu, không tổng quát được', keywords: ['nhiễu', 'noise', 'tổng quát'], weight: 2 },
      { text: 'Nhận biết qua khoảng cách Train và Validation', keywords: ['train cao', 'khoảng cách', 'validation thấp', 'learning curve'], weight: 2 },
      { text: 'Giảm độ linh hoạt: regularization, độ sâu, Early Stopping', keywords: ['regularization', 'giới hạn độ sâu', 'early stopping'] },
      { text: 'Thêm dữ liệu hoặc Bagging', keywords: ['thêm dữ liệu', 'bagging', 'random forest'] },
    ],
    followUps: ['Vì sao Random Forest có điểm Train rất cao mà không có vấn đề?', 'Validation có thể bị overfit không?'],
    commonMistakes: ['Kết luận overfit chỉ từ điểm Train cao.', 'Không phân biệt overfit với rò rỉ dữ liệu.'],
  },
  {
    id: 'iv-eval-under-01',
    topicId: 'evaluation',
    category: 'eval-fit',
    conceptIds: ['eval-underfitting', 'eval-overfitting'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Underfitting khác Overfitting thế nào? Khi nào thu thập thêm dữ liệu là lãng phí?',
    referenceAnswer: `Hai tình trạng đối lập về khả năng biểu diễn. Underfit là mô hình quá đơn giản, điểm Train và Validation đều thấp và gần nhau. Overfit là mô hình quá linh hoạt so với dữ liệu, Train cao còn Validation thấp.

Thêm dữ liệu là lãng phí khi mô hình đang underfit. Nó bị giới hạn bởi dạng hàm: đường thẳng không khớp được quan hệ phi tuyến dù có bao nhiêu dòng. Trên learning curve, hai đường đã gặp nhau và đi ngang. Ví dụ hồi quy tuyến tính có RMSE 42 triệu trên Train, 43 triệu trên Validation, đi ngang từ 20.000 dòng, thì mua thêm 200.000 dòng gần như không có tác dụng. Lúc đó tôi thêm đặc trưng, dùng mô hình linh hoạt hơn hoặc giảm regularization.

Trường hợp thứ hai là khi đã chạm giới hạn của nhiễu: mọi mô hình đều chững lại ở cùng một mức. Khi đó thêm dòng cũng không giúp, thứ cần là đặc trưng mới hoặc nhãn tốt hơn. Muốn nói điểm là thấp thì cần so với một mốc, như mô hình cơ sở.`,
    keyPoints: [
      { text: 'Underfit: cả Train và Validation đều thấp', keywords: ['cả hai đều thấp', 'train thấp', 'quá đơn giản'], weight: 2 },
      { text: 'Overfit: Train cao, Validation thấp', keywords: ['train cao', 'validation thấp', 'quá linh hoạt'] },
      { text: 'Thêm dữ liệu không sửa được underfit', keywords: ['thêm dữ liệu', 'thêm dòng', 'dạng hàm'], weight: 2 },
      { text: 'Dùng learning curve để quyết định', keywords: ['learning curve', 'đi ngang'] },
      { text: 'Giới hạn do nhiễu của dữ liệu', keywords: ['nhiễu', 'noise', 'giới hạn'] },
    ],
    followUps: ['Làm sao biết đã chạm giới hạn của nhiễu?', 'Regularization ảnh hưởng thế nào tới hai tình trạng này?'],
    commonMistakes: ['Nói thêm dữ liệu luôn có ích.', 'Xem Train và Validation gần nhau là dấu hiệu mô hình tốt.'],
  },
  {
    id: 'iv-eval-bv-01',
    topicId: 'evaluation',
    category: 'eval-fit',
    conceptIds: ['eval-bias-variance'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Giải thích Bias-Variance Tradeoff từ nguyên lý. Ba thành phần của sai số có ý nghĩa gì khi ra quyết định?',
    referenceAnswer: `Bộ dữ liệu huấn luyện là một mẫu ngẫu nhiên, nên hãy hình dung huấn luyện lại trên nhiều mẫu khác nhau. Với sai số bình phương, sai số kỳ vọng tại một điểm bằng Bias bình phương cộng Variance cộng Noise.

**Bias** là dự đoán trung bình lệch khỏi giá trị đúng bao xa, đến từ giả định quá đơn giản. **Variance** là dự đoán dao động bao nhiêu khi đổi mẫu, đến từ độ linh hoạt cao. **Noise** là phần đặc trưng không giải thích được.

Ví dụ giá trị đúng là 100. Mô hình A dự đoán 80, 82, 78, 81, 79: Bias bình phương 400, Variance 2. Mô hình B dự đoán 90, 110, 95, 105, 100: Bias bình phương 0, Variance 50. B có tổng sai số nhỏ hơn hẳn dù dao động nhiều hơn.

Ý nghĩa là mỗi thành phần có cách chữa riêng. Bias cao thì thêm đặc trưng, tăng độ linh hoạt. Variance cao thì thêm dữ liệu, regularization, Bagging. Noise cao thì cần đặc trưng mới hoặc nhãn tốt hơn. Đánh đổi chỉ xảy ra khi chỉnh độ linh hoạt, còn thêm dữ liệu giảm variance mà không tăng bias.`,
    keyPoints: [
      { text: 'Hình dung huấn luyện lại trên nhiều bộ dữ liệu', keywords: ['nhiều mẫu', 'nhiều bộ dữ liệu', 'huấn luyện lại'] },
      { text: 'Sai số = Bias bình phương + Variance + Noise', keywords: ['bias bình phương', 'phân tách', 'bias', 'noise'], weight: 2 },
      { text: 'Bias là sai số có hệ thống do giả định đơn giản', keywords: ['hệ thống', 'dự đoán trung bình', 'quá đơn giản'] },
      { text: 'Variance là độ nhạy với mẫu huấn luyện', keywords: ['dao động', 'nhạy', 'đổi mẫu'] },
      { text: 'Mỗi thành phần có cách xử lý riêng', keywords: ['thêm dữ liệu', 'regularization', 'bagging', 'cách chữa'], weight: 2 },
    ],
    followUps: ['Làm sao chẩn đoán bias hay variance trên thực tế?', 'Có đo trực tiếp được bias của một mô hình không?'],
    commonMistakes: ['Chỉ nói đơn giản là bias cao, phức tạp là variance cao, không giải thích được định nghĩa.', 'Quên thành phần Noise.'],
  },
  {
    id: 'iv-eval-bv-02',
    topicId: 'evaluation',
    category: 'eval-fit',
    conceptIds: ['eval-bias-variance', 'eval-overfitting'],
    interviewTypes: ['ds'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bagging và Boosting tác động vào Bias và Variance khác nhau thế nào? Điều đó ảnh hưởng ra sao tới cách chọn cây cơ sở?',
    referenceAnswer: `**Bagging** huấn luyện nhiều mô hình song song trên các mẫu Bootstrap, rồi lấy trung bình. Trung bình làm giảm dao động, còn dự đoán trung bình gần như giữ nguyên, nên tác dụng chính là giảm variance. Vì thế Bagging dùng cây sâu, có bias thấp và variance cao, để phần giảm variance có đất phát huy.

Giới hạn là phương sai của trung bình bằng \`r x s + (1 - r) x s / n\`. Phần \`r x s\` không giảm khi thêm cây, nên Random Forest chọn ngẫu nhiên đặc trưng để giảm tương quan r. Thêm cây hầu như không gây overfit thêm, nhưng lợi ích giảm dần.

**Boosting** huấn luyện tuần tự, mỗi mô hình học từ sai số còn lại, nên tác dụng chính là giảm bias. Nó dùng cây nông có bias cao, variance thấp. Khác với Bagging, chạy quá nhiều vòng có thể làm variance tăng và gây overfit, nên cần Learning Rate nhỏ và Early Stopping trên Validation.

Trong thực tế, tôi chọn Random Forest khi muốn ít phải tinh chỉnh. Tôi chọn Gradient Boosting khi cần điểm cao nhất và có đủ công sức tinh chỉnh, chấp nhận nhạy với nhiễu nhãn hơn.`,
    keyPoints: [
      { text: 'Bagging chủ yếu giảm variance', keywords: ['bagging giảm variance', 'lấy trung bình', 'giảm variance'], weight: 2 },
      { text: 'Boosting chủ yếu giảm bias', keywords: ['boosting giảm bias', 'sai số còn lại', 'giảm bias'], weight: 2 },
      { text: 'Bagging dùng cây sâu, Boosting dùng cây nông', keywords: ['cây sâu', 'cây nông'] },
      { text: 'Tương quan giới hạn tác dụng của Bagging', keywords: ['tương quan', 'chọn ngẫu nhiên đặc trưng'] },
      { text: 'Boosting có thể overfit nên cần Early Stopping', keywords: ['early stopping', 'learning rate', 'quá nhiều vòng'] },
    ],
    followUps: ['Thêm cây vào Random Forest có gây overfit không?', 'Vì sao Boosting nhạy với nhiễu nhãn hơn?'],
    commonMistakes: ['Đảo ngược tác dụng của hai phương pháp.', 'Nói Boosting không thể overfit.'],
  },
  {
    id: 'iv-eval-bv-03',
    topicId: 'evaluation',
    category: 'eval-fit',
    conceptIds: ['eval-bias-variance'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Mạng rất lớn có thể khớp hoàn toàn dữ liệu huấn luyện mà vẫn tổng quát tốt. Điều này có phủ nhận Bias-Variance Tradeoff không?',
    referenceAnswer: `Không phủ nhận phép phân tách, nhưng phủ nhận cách suy luận đơn giản rằng thêm tham số thì sai số thật phải tăng.

Phép phân tách Bias, Variance, Noise với sai số bình phương là một đẳng thức toán học, nên vẫn đúng. Điều bị thách thức là hình chữ U. Hiện tượng **Double Descent**, được Belkin và cộng sự mô tả năm 2019, cho thấy sai số thật có thể tăng đến gần điểm khớp hoàn toàn, rồi giảm lại khi mô hình lớn hơn nữa. Khi đó variance có thể giảm dù số tham số tăng.

Một cách giải thích là khi có nhiều nghiệm khớp được dữ liệu, thuật toán tối ưu có xu hướng chọn nghiệm đơn giản theo một nghĩa nào đó. Tức là số tham số không phản ánh đúng độ phức tạp hiệu dụng.

Về thực hành, tôi rút ra ba điều. Không chọn mô hình bằng cách đếm tham số, mà đo trên Validation. Vùng gần điểm khớp hoàn toàn có thể rất xấu, nên regularization và Early Stopping vẫn hữu ích. Với dữ liệu bảng, các mô hình dạng cây vẫn tuân theo trực giác cũ khá tốt, nên công cụ chẩn đoán như learning curve vẫn có giá trị.`,
    keyPoints: [
      { text: 'Phép phân tách vẫn đúng về toán học', keywords: ['đẳng thức', 'vẫn đúng', 'không phủ nhận'], weight: 2 },
      { text: 'Hình chữ U không phải quy luật tuyệt đối, có Double Descent', keywords: ['double descent', 'hình chữ u', 'giảm lại'], weight: 2 },
      { text: 'Số tham số không phản ánh độ phức tạp hiệu dụng', keywords: ['độ phức tạp hiệu dụng', 'số tham số'] },
      { text: 'Thuật toán tối ưu chọn nghiệm đơn giản', keywords: ['implicit regularization', 'nghiệm đơn giản', 'thuật toán tối ưu'] },
      { text: 'Vẫn chọn mô hình dựa trên Validation', keywords: ['validation', 'đo trên validation', 'early stopping'] },
    ],
    followUps: ['Điểm khớp hoàn toàn là gì và vì sao sai số lại cao ở đó?', 'Early Stopping tương tác thế nào với Double Descent?'],
    commonMistakes: ['Nói Bias-Variance Tradeoff đã sai hoàn toàn.', 'Dùng hiện tượng này để biện minh cho việc không cần Validation.'],
  },
])
