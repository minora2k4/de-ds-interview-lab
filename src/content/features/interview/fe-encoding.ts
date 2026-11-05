import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-fe-one-hot-01',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-one-hot', 'fe-label-encoding'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Vì sao không nên gán số nguyên trực tiếp cho biến phân loại không có thứ tự? One-Hot Encoding giải quyết việc đó như thế nào và đánh đổi gì?',
    referenceAnswer: `Mô hình tuyến tính nhân giá trị với một hệ số, còn KNN và SVM tính khoảng cách trên giá trị đó. Nếu gán Cần Thơ bằng 0, Đà Nẵng bằng 1, Hà Nội bằng 2, mô hình sẽ tin rằng Hà Nội lớn gấp đôi Đà Nẵng và tác động tăng đều theo mã. Thứ tự này chỉ đến từ cách sắp xếp tên, không có trong dữ liệu.

One-Hot cho mỗi giá trị một cột nhị phân riêng. Mọi cặp giá trị khác nhau đều cách nhau như nhau, nên không còn thứ tự giả, và mô hình tuyến tính học được hệ số riêng cho từng giá trị.

Đánh đổi là số cột tăng theo số giá trị. Với biến có hàng chục nghìn giá trị, chi phí tăng và các giá trị hiếm gây quá khớp vì chỉ có vài dòng để ước lượng hệ số. Khi đó tôi gom theo nghiệp vụ, gộp giá trị hiếm, hoặc đổi cách mã hóa. Với mô hình cây, gán số nguyên ít hại hơn vì cây chỉ dùng ngưỡng, nhưng vẫn cần nhiều lần chia hơn.`,
    keyPoints: [
      { text: 'Số nguyên tạo thứ tự và khoảng cách giả', keywords: ['thứ tự giả', 'thứ tự', 'khoảng cách'], weight: 2 },
      { text: 'One-Hot cho mỗi giá trị một cột, các giá trị cách đều nhau', keywords: ['một cột', 'cột nhị phân', 'cách đều', 'chiều riêng'], weight: 2 },
      { text: 'Đánh đổi: tăng số cột với biến nhiều giá trị', keywords: ['số cột', 'nhiều giá trị', 'high cardinality', 'bùng nổ'] },
      { text: 'Cây ít nhạy hơn với thứ tự mã', keywords: ['cây', 'ngưỡng', 'tree'] },
    ],
    followUps: ['Khi nào gán số nguyên lại là lựa chọn đúng?', 'Làm gì với giá trị mới xuất hiện ở production?'],
    commonMistakes: ['Nói One-Hot luôn tốt hơn mà không nhắc đến số cột.', 'Không phân biệt được biến định danh và biến thứ bậc.'],
  },
  {
    id: 'iv-fe-one-hot-02',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-one-hot'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Dummy Variable Trap là gì? Có phải lúc nào cũng cần bỏ một cột One-Hot không?',
    referenceAnswer: `Biến có k giá trị tạo ra k cột, và tổng k cột luôn bằng 1 ở mọi dòng, trùng với cột intercept. Đây là đa cộng tuyến hoàn hảo: ma trận \`X'X\` không khả nghịch. Có thể cộng một hằng số vào intercept rồi trừ hằng số đó ở cả k hệ số mà dự đoán không đổi, nên hệ số không duy nhất và không diễn giải được.

Với hồi quy tuyến tính không điều chuẩn có intercept, tôi bỏ một cột. Giá trị bị bỏ thành nhóm tham chiếu, và các hệ số còn lại là chênh lệch so với nhóm đó.

Không phải lúc nào cũng cần. Điều chuẩn L2 cho nghiệm duy nhất dù giữ đủ cột, và tài liệu scikit-learn cảnh báo bỏ cột phá vỡ tính đối xứng, có thể gây thiên lệch cho mô hình có điều chuẩn. Cây thì không giải hệ tuyến tính nên không bị ảnh hưởng. Bỏ intercept chỉ giải quyết được khi có một biến phân loại: với hai biến trở lên, các nhóm cột vẫn phụ thuộc lẫn nhau. Ngoài ra, nếu dùng \`drop\` cùng \`handle_unknown='ignore'\`, giá trị lạ sẽ trùng biểu diễn với nhóm tham chiếu.`,
    keyPoints: [
      { text: 'Tổng k cột bằng intercept, đa cộng tuyến hoàn hảo', keywords: ['đa cộng tuyến', 'multicollinearity', 'tổng', 'intercept'], weight: 2 },
      { text: 'Hệ số không duy nhất', keywords: ['không duy nhất', 'khả nghịch', 'diễn giải'], weight: 2 },
      { text: 'Bỏ một cột tạo nhóm tham chiếu', keywords: ['nhóm tham chiếu', 'k-1', 'bỏ một cột', 'reference'] },
      { text: 'Điều chuẩn hoặc cây không cần bỏ cột', keywords: ['điều chuẩn', 'regularization', 'l2', 'cây'], weight: 2 },
    ],
    followUps: ['Chọn giá trị nào làm nhóm tham chiếu?', 'Vì sao bỏ intercept không giải quyết được với hai biến phân loại?'],
    commonMistakes: ['Nói phải bỏ cột với mọi mô hình.', 'Nói bẫy này làm dự đoán sai, trong khi vấn đề chính nằm ở hệ số.'],
  },
  {
    id: 'iv-fe-one-hot-03',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-one-hot', 'fe-woe'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bạn có cột `merchant_id` với 200.000 giá trị trên 5 triệu dòng. Bạn sẽ mã hóa thế nào và đánh giá cách làm ra sao?',
    referenceAnswer: `One-Hot đầy đủ cho 200.000 cột. Ma trận thưa giải quyết được bộ nhớ, nhưng không giải quyết được vấn đề thống kê: phần lớn merchant chỉ có vài dòng, nên hệ số học từ nhiễu. Với cây, mỗi lần chia chỉ tách một merchant, nên gần như không giảm tạp chất.

Tôi bắt đầu bằng cách xem phân phối số dòng. Nếu nghiệp vụ có ngành hàng hoặc khu vực của merchant, tôi gom theo đó vì đây là thông tin dùng chung được. Sau đó tôi gộp giá trị hiếm dưới một ngưỡng, ví dụ 500 dòng, vào nhóm \`hiếm\`.

Nếu vẫn quá nhiều, tôi đổi sang cách mã hóa một cột dựa trên nhãn như target encoding hoặc WoE. Cách này có nguy cơ rò rỉ, nên phải học trên train và dùng cross-fitting khi kiểm định.

Đánh giá gồm ba phần: AUC ngoài mẫu theo thời gian, khoảng cách giữa train và test, và hiệu năng trên nhóm merchant mới, vì merchant mới luôn xuất hiện. Tôi cũng theo dõi tỷ lệ giá trị lạ ở production để biết khi nào cần cập nhật danh sách.`,
    keyPoints: [
      { text: 'Ma trận thưa không giải quyết vấn đề thống kê', keywords: ['ma trận thưa', 'sparse', 'nhiễu', 'quá khớp'], weight: 2 },
      { text: 'Gom theo nghiệp vụ, gộp giá trị hiếm', keywords: ['gom', 'gộp', 'giá trị hiếm', 'ngành hàng'], weight: 2 },
      { text: 'Mã hóa dựa trên nhãn cần cross-fitting', keywords: ['target encoding', 'woe', 'cross-fitting', 'rò rỉ'], weight: 2 },
      { text: 'Đánh giá trên merchant mới, theo thời gian', keywords: ['merchant mới', 'theo thời gian', 'giá trị lạ', 'ngoài mẫu'] },
    ],
    followUps: ['Bạn chọn ngưỡng gộp thế nào?', 'Mô hình xử lý merchant hoàn toàn mới ra sao?'],
    commonMistakes: ['Dùng target encoding trên toàn bộ dữ liệu.', 'Xem ma trận thưa là giải pháp đủ.'],
  },
  {
    id: 'iv-fe-label-encoding-01',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-label-encoding', 'fe-ordinal-encoding'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Label Encoding khác Ordinal Encoding như thế nào? Khi nào dùng cái nào?',
    referenceAnswer: `Về cách làm, cả hai đều biến một cột phân loại thành một cột số nguyên. Khác biệt nằm ở ý nghĩa của thứ tự và đối tượng áp dụng.

Label Encoding đánh số theo cách sắp xếp, thường là chữ cái, nên thứ tự không mang ý nghĩa. Trong scikit-learn, \`LabelEncoder\` được thiết kế cho nhãn y. Với y, cách này an toàn vì mô hình phân loại xem mỗi số là một lớp riêng, không so sánh lớn nhỏ.

Ordinal Encoding dùng cho đặc trưng có thứ bậc thật như thấp, vừa, cao. Điều quan trọng là phải khai báo thứ tự, vì \`OrdinalEncoder\` mặc định cũng chỉ sắp theo giá trị, nên \`High, Low, Medium\` sẽ thành 0, 1, 2. Với mô hình tuyến tính còn phải nhớ giả định các bậc cách đều nhau.

Dùng Label Encoding cho đặc trưng định danh trong mô hình tuyến tính hoặc KNN là sai, vì mô hình sẽ học theo một thứ tự giả. Trường hợp đó nên dùng One-Hot.`,
    keyPoints: [
      { text: 'Label Encoding cho nhãn y, thứ tự không có ý nghĩa', keywords: ['nhãn y', 'biến mục tiêu', 'target', 'chữ cái'], weight: 2 },
      { text: 'Ordinal Encoding cho đặc trưng có thứ bậc thật', keywords: ['thứ bậc', 'ordinal'], weight: 2 },
      { text: 'Phải khai báo thứ tự', keywords: ['khai báo', 'categories', 'tự chỉ định'] },
      { text: 'Giả định khoảng cách đều với mô hình tuyến tính', keywords: ['cách đều', 'khoảng cách đều'] },
    ],
    followUps: ['Nếu các bậc rõ ràng cách không đều thì làm gì?'],
    commonMistakes: ['Xem hai cách là một vì cùng ra số nguyên.', 'Quên rằng `OrdinalEncoder` không tự biết thứ bậc.'],
  },
  {
    id: 'iv-fe-ordinal-encoding-01',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-ordinal-encoding', 'fe-one-hot'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Với biến `trình độ học vấn` có 5 bậc trong mô hình tuyến tính, bạn chọn Ordinal Encoding hay One-Hot? Bạn quyết định dựa trên đâu?',
    referenceAnswer: `Tôi không chọn sẵn, mà xem dữ liệu trước. Ordinal Encoding dùng một hệ số, nên giả định mỗi bậc tăng lên có cùng tác động. One-Hot dùng 4 hệ số, không ràng buộc khoảng cách nhưng bỏ qua thứ tự và tốn tham số hơn.

Tôi vẽ tỷ lệ mục tiêu theo từng bậc, tốt nhất là theo log-odds với bài toán phân loại. Nếu các điểm gần như thẳng hàng, Ordinal đủ tốt và gọn hơn. Nếu bước nhảy rất khác nhau, như từ Đại học lên Sau đại học tác động rất mạnh, một hệ số sẽ không đủ, nên tôi dùng One-Hot hoặc gán giá trị có ý nghĩa như số năm học.

Tôi cũng xem cỡ mẫu. Nếu một bậc có rất ít dòng, hệ số One-Hot của bậc đó sẽ không ổn định, và Ordinal giúp chia sẻ thông tin giữa các bậc.

Cuối cùng tôi so sánh hai cách bằng kiểm định chéo. Với mô hình cây, tôi chọn Ordinal, vì cây chỉ dùng thứ tự và không phụ thuộc khoảng cách giữa các mã.`,
    keyPoints: [
      { text: 'Ordinal giả định khoảng cách đều, một hệ số', keywords: ['cách đều', 'một hệ số', 'khoảng cách đều'], weight: 2 },
      { text: 'Kiểm tra tỷ lệ mục tiêu theo từng bậc', keywords: ['tỷ lệ mục tiêu', 'log-odds', 'theo từng bậc', 'thẳng hàng'], weight: 2 },
      { text: 'Xét cỡ mẫu của từng bậc', keywords: ['cỡ mẫu', 'ít dòng', 'không ổn định'] },
      { text: 'So sánh bằng kiểm định chéo', keywords: ['kiểm định chéo', 'cross validation'] },
    ],
    followUps: ['Với mô hình cây thì quyết định có đổi không?'],
    commonMistakes: ['Khẳng định luôn dùng Ordinal vì biến có thứ tự, mà không kiểm tra giả định khoảng cách.'],
  },
  {
    id: 'iv-fe-woe-01',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-woe'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'WoE là gì? Tính thế nào, và vì sao hai tài liệu có thể cho WoE trái dấu nhau?',
    referenceAnswer: `WoE, hay Weight of Evidence, mã hóa một nhóm giá trị bằng mức chênh giữa phân phối good và bad tại nhóm đó. Với biến số, tôi chia khoảng trước. Sau đó tôi tính \`%Good_i\` là số good của nhóm chia cho tổng good, \`%Bad_i\` tương tự, và \`WoE_i = ln(%Good_i / %Bad_i)\`. Điểm dễ nhầm là đây là phần trăm theo cột, không phải tỷ lệ good trong nhóm.

Ví dụ danh mục 9.000 good và 1.000 bad, nhóm có 1.500 good và 300 bad. %Good là 16.67%, %Bad là 30%, nên WoE là -0.588, tức rủi ro cao hơn mức chung.

Về dấu, không có quy ước duy nhất. \`OptBinning\` và nhiều tài liệu scorecard đặt good ở tử số, nên WoE cao là rủi ro thấp. Thư viện \`scorecard\` của R mặc định đặt bad ở tử số, \`category_encoders\` đặt lớp \`y=1\` ở tử số. Giá trị tuyệt đối giống nhau, chỉ khác dấu. Hệ số của mô hình sẽ tự đổi dấu theo, nên hiệu năng không đổi, nhưng đọc nhầm dấu sẽ diễn giải ngược. Vì vậy tôi luôn ghi rõ công thức trong tài liệu mô hình.`,
    keyPoints: [
      { text: 'Công thức ln(%Good / %Bad)', keywords: ['ln', 'logarit', '%good'], weight: 2 },
      { text: 'Phần trăm theo cột, không phải tỷ lệ trong nhóm', keywords: ['theo cột', 'tổng good', 'tổng số good'], weight: 2 },
      { text: 'Quy ước dấu khác nhau giữa các tài liệu', keywords: ['quy ước', 'tử số', 'trái dấu', 'đổi dấu'], weight: 2 },
      { text: 'Biến số cần chia khoảng trước', keywords: ['chia khoảng', 'binning', 'chia nhóm'] },
    ],
    followUps: ['WoE bằng 0 có ý nghĩa gì?', 'Làm gì khi nhóm có 0 bad?'],
    commonMistakes: ['Tính theo tỷ lệ trong nhóm thay vì theo cột.', 'Khẳng định WoE dương luôn là rủi ro thấp.'],
  },
  {
    id: 'iv-fe-woe-02',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-woe', 'fe-one-hot'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Từ nguyên lý, vì sao WoE lại hợp với hồi quy logistic? Nó có làm mô hình tốt hơn One-Hot trên cùng các nhóm không?',
    referenceAnswer: `Hồi quy logistic mô hình hóa log-odds dưới dạng tuyến tính. Từ công thức, \`ln(Good_i / Bad_i) = ln(G / B) + WoE_i\`, tức log-odds của nhóm bằng log-odds tổng thể cộng WoE. Vậy WoE đặt biến lên đúng thang đo mà mô hình cần, kể cả khi quan hệ gốc là phi tuyến hay hình chữ U. Với một biến duy nhất, mô hình cho hệ số 1 và intercept \`ln(G/B)\` nếu mô hình hóa xác suất good.

Về hiệu năng, WoE không tạo thông tin mới. Với một biến duy nhất, mô hình WoE và mô hình One-Hot trên cùng các nhóm cho dự đoán như nhau. Khi có nhiều biến, One-Hot có k-1 hệ số tự do cho mỗi biến, còn WoE chỉ có một, nên tỷ lệ giữa các nhóm bị cố định.

Đây là đánh đổi: WoE ít tham số hơn nên ổn định và dễ làm thẻ điểm, đổi lại kém linh hoạt khi các biến tương tác. Bù lại, WoE dùng nhãn nên phải tránh rò rỉ, còn One-Hot thì không. Với cây, tôi không thấy lý do dùng WoE vì cây đã tự chia nhóm.`,
    keyPoints: [
      { text: 'Log-odds của nhóm bằng log-odds tổng thể cộng WoE', keywords: ['log-odds', 'log odds', 'tổng thể'], weight: 3 },
      { text: 'WoE không tạo thông tin mới', keywords: ['không tạo thông tin', 'như nhau', 'mã hóa lại'], weight: 2 },
      { text: 'Một hệ số so với k-1 hệ số', keywords: ['một hệ số', 'k-1', 'số tham số', 'ít tham số'], weight: 2 },
      { text: 'WoE dùng nhãn nên có rủi ro rò rỉ', keywords: ['rò rỉ', 'leakage', 'dùng nhãn'] },
    ],
    followUps: ['Vì sao hệ số có thể khác 1 trong mô hình nhiều biến?', 'Hệ số âm trên biến WoE nói lên điều gì?'],
    commonMistakes: ['Nói WoE luôn làm tăng độ chính xác.', 'Không nối được WoE với log-odds.'],
  },
  {
    id: 'iv-fe-woe-03',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-woe', 'eda-leakage', 'eval-cross-validation'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bạn thiết kế quy trình WoE cho mô hình tín dụng thế nào để không rò rỉ dữ liệu và ổn định khi chạy thật?',
    referenceAnswer: `Tôi chia dữ liệu theo thời gian trước tiên: tập train ở giai đoạn đầu, tập kiểm tra ở giai đoạn sau, vì mô hình tín dụng dùng cho tương lai. Mọi bước chia nhóm và tính WoE chỉ làm trên train. Khi kiểm định chéo, bảng WoE phải học lại trong từng fold, nếu không nhãn của fold kiểm tra sẽ lọt vào đặc trưng.

Về chia nhóm, tôi đặt mỗi nhóm ít nhất khoảng 5% số quan sát, tách riêng giá trị thiếu, và gộp các nhóm có 0 good hoặc 0 bad thay vì chỉ làm trơn. Tôi kiểm tra WoE có đơn điệu không nếu nghiệp vụ kỳ vọng vậy, và giữ quan hệ chữ U nếu giải thích được.

Khi triển khai, tôi lưu bảng nhóm và WoE như một phần của mô hình, dùng nguyên bảng cho production, không tính lại theo lô. Giá trị lạ được gán vào một nhóm đã định trước. Tôi theo dõi PSI theo từng biến và so sánh WoE theo giai đoạn. Nếu dấu của một nhóm đảo chiều, đó là tín hiệu cần chia lại nhóm.`,
    keyPoints: [
      { text: 'Chỉ tính WoE trên train, học lại trong từng fold', keywords: ['trên train', 'từng fold', 'mỗi fold', 'rò rỉ'], weight: 3 },
      { text: 'Chia theo thời gian', keywords: ['theo thời gian', 'giai đoạn sau', 'out of time'] },
      { text: 'Nhóm tối thiểu và xử lý số đếm 0', keywords: ['gộp', 'số đếm 0', 'nhóm tối thiểu', 'làm trơn'], weight: 2 },
      { text: 'Lưu bảng WoE và theo dõi độ ổn định', keywords: ['lưu bảng', 'psi', 'theo dõi', 'ổn định'], weight: 2 },
    ],
    followUps: ['Làm gì khi WoE của một nhóm đảo chiều sau 6 tháng?', 'Vì sao không tính lại bảng WoE mỗi ngày?'],
    commonMistakes: ['Tính WoE trên toàn bộ dữ liệu rồi mới kiểm định chéo.', 'Chia ngẫu nhiên cho bài toán có yếu tố thời gian.'],
  },
  {
    id: 'iv-fe-iv-01',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-iv', 'fe-woe'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'IV được tính thế nào, và các ngưỡng của nó có ý nghĩa gì?',
    referenceAnswer: `\`IV = Σ (%Good_i - %Bad_i) × WoE_i\`, với \`WoE_i = ln(%Good_i / %Bad_i)\`. Hai thừa số luôn cùng dấu, nên mỗi nhóm đóng góp một giá trị không âm, và IV không phụ thuộc quy ước dấu của WoE. Nhóm có WoE lớn nhưng chiếm rất ít dòng sẽ đóng góp ít, vì được nhân với chênh lệch phân phối nhỏ.

Các ngưỡng thường gặp, gốc từ sách của Siddiqi: dưới 0.02 gần như không có sức dự đoán, 0.02 đến 0.1 yếu, 0.1 đến 0.3 trung bình, từ 0.3 trở lên mạnh. Nhiều tài liệu thực hành thêm mức trên 0.5 là đáng nghi.

Tôi dùng các ngưỡng này để sàng lọc, không xem là luật. Chúng là kinh nghiệm chứ không phải kiểm định thống kê, và các tác giả gán nhãn khác nhau. IV cũng phụ thuộc cách chia nhóm, nên biến chia 60 nhóm dễ có IV cao hơn biến chia 5 nhóm. Biến IV thấp vẫn có thể hữu ích khi kết hợp với biến khác.`,
    keyPoints: [
      { text: 'Công thức IV', keywords: ['%good', 'woe', 'tổng', 'chênh lệch'], weight: 2 },
      { text: 'Các mốc 0.02, 0.1, 0.3', keywords: ['yếu', 'mạnh', 'trung bình', 'ngưỡng'], weight: 2 },
      { text: 'Ngưỡng chỉ là kinh nghiệm', keywords: ['kinh nghiệm', 'tham khảo', 'không phải kiểm định', 'quy ước'], weight: 2 },
      { text: 'Phụ thuộc cách chia nhóm', keywords: ['chia nhóm', 'số nhóm', 'binning'] },
    ],
    followUps: ['IV có thể âm không?', 'Vì sao đổi quy ước dấu của WoE không làm đổi IV?'],
    commonMistakes: ['Xem 0.3 là ranh giới bắt buộc để giữ biến.', 'Không biết IV phụ thuộc số nhóm.'],
  },
  {
    id: 'iv-fe-iv-02',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-iv', 'eda-leakage'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Một biến có IV bằng 3. Bạn có vui không? Bạn sẽ điều tra thế nào?',
    referenceAnswer: `Tôi chưa vui, mà nghi ngờ trước. Trong rủi ro tín dụng, một biến đơn lẻ hiếm khi tách gần như hoàn hảo good và bad, vì vỡ nợ phụ thuộc nhiều yếu tố và có phần ngẫu nhiên. IV bằng 3 thường có nghĩa là biến mang thông tin về nhãn theo cách không chính đáng.

Câu hỏi đầu tiên là thời điểm. Biến được ghi nhận trước hay sau thời điểm dự đoán? Trạng thái thu hồi nợ, số lần nhắc nợ là hệ quả của quá hạn. Tôi đối chiếu ngày cập nhật của bản ghi với ngày ra quyết định. Điều này được rút ra từ nguyên lý rò rỉ: biến không tồn tại lúc dự đoán thì không dùng được.

Nếu thời điểm ổn, tôi kiểm tra các nguyên nhân khác: cách chia nhóm quá nhỏ, biến có giá trị mặc định chỉ xuất hiện ở một lớp, hoặc lỗi ghép bảng. Tôi xem phần đóng góp của từng nhóm để biết sức mạnh đến từ đâu, rồi tính lại IV trên giai đoạn sau.

Nếu vượt qua hết, biến có thể mạnh thật, như điểm tín dụng từ bên ngoài. Khi đó tôi vẫn cân nhắc có nên để mô hình phụ thuộc quá nhiều vào một biến không.`,
    keyPoints: [
      { text: 'IV quá cao đáng nghi, thường là rò rỉ', keywords: ['nghi ngờ', 'đáng nghi', 'rò rỉ', 'leakage'], weight: 3 },
      { text: 'Kiểm tra thời điểm ghi nhận so với thời điểm dự đoán', keywords: ['thời điểm', 'sau thời điểm', 'trước hay sau', 'hệ quả'], weight: 3 },
      { text: 'Kiểm tra chia nhóm và lỗi dữ liệu', keywords: ['chia nhóm', 'giá trị mặc định', 'ghép bảng', 'lỗi'] },
      { text: 'IV cao không tự chứng minh rò rỉ', keywords: ['mạnh thật', 'không tự chứng minh', 'điểm tín dụng'] },
    ],
    followUps: ['Nếu biến thật sự mạnh thì có nên dùng không?', 'Bạn ngăn loại lỗi này từ sớm bằng cách nào?'],
    commonMistakes: ['Giữ biến vì IV cao.', 'Tự động loại mọi biến trên 0.5 mà không điều tra.'],
  },
  {
    id: 'iv-fe-iv-03',
    topicId: 'features',
    category: 'fe-encoding',
    conceptIds: ['fe-iv', 'fe-selection', 'fe-binning'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Một đồng nghiệp đề xuất chọn biến cho mô hình chỉ bằng cách giữ các biến có IV trên 0.1. Bạn phản biện thế nào?',
    referenceAnswer: `IV là bước sàng lọc tốt, nhưng dùng làm tiêu chí duy nhất có bốn vấn đề bắt nguồn từ cách nó được tính.

Thứ nhất, IV là đơn biến. Hai biến tương quan 0.97 đều có IV cao sẽ cùng được giữ dù gần như trùng thông tin, còn biến chỉ có ích khi tương tác với biến khác sẽ bị loại.

Thứ hai, IV phụ thuộc cách chia nhóm. Gộp hai nhóm làm IV giảm, trừ khi chúng có cùng odds, nên chia càng nhỏ IV càng tăng. Ngưỡng 0.1 sẽ ưu ái biến nhiều nhóm và phần tăng có thể chỉ là nhiễu.

Thứ ba, lọc theo ngưỡng cũng dùng nhãn. Nếu làm trên toàn bộ dữ liệu, kết quả kiểm tra sẽ quá lạc quan, nên phải làm trên train.

Thứ tư, ngưỡng cao không loại được rò rỉ. Biến rò rỉ lại có IV cao nhất và sẽ được giữ đầu tiên.

Tôi đề xuất quy trình nhiều tầng: dùng IV loại các biến rõ ràng không có tín hiệu và rà soát rò rỉ ở đầu trên. Sau đó xử lý tương quan, rồi chọn theo mô hình trong kiểm định chéo, kết hợp xem độ ổn định theo thời gian và ý nghĩa nghiệp vụ.`,
    keyPoints: [
      { text: 'Đơn biến, không thấy trùng lặp và tương tác', keywords: ['đơn biến', 'tương quan', 'trùng', 'tương tác'], weight: 3 },
      { text: 'Phụ thuộc cách chia nhóm', keywords: ['chia nhóm', 'số nhóm', 'nhiễu'], weight: 2 },
      { text: 'Phải làm trên train để tránh lạc quan', keywords: ['trên train', 'lạc quan', 'dùng nhãn'], weight: 2 },
      { text: 'Biến rò rỉ có IV cao nhất', keywords: ['rò rỉ', 'leakage'], weight: 2 },
      { text: 'Đề xuất quy trình nhiều tầng', keywords: ['nhiều tầng', 'kiểm định chéo', 'độ ổn định'] },
    ],
    followUps: ['Biến IV thấp nào đáng giữ lại?', 'Làm sao so sánh công bằng hai biến có số nhóm khác nhau?'],
    commonMistakes: ['Chỉ nói ngưỡng là tùy ý mà không giải thích cơ chế.', 'Quên rằng rò rỉ chính là biến có IV cao nhất.'],
  },
])
