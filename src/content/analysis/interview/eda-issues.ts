import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-eda-missing-01',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-missing-values'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Phân biệt MCAR, MAR và MNAR. Cho ví dụ, và nói mỗi cơ chế ảnh hưởng thế nào đến cách xử lý.',
    referenceAnswer: `Ba cơ chế khác nhau ở chỗ xác suất thiếu phụ thuộc vào điều gì.

**MCAR** không phụ thuộc vào gì cả. Ví dụ gói tin cảm biến rớt do lỗi mạng. Xóa dòng không gây lệch, chỉ mất độ chính xác.

**MAR** chỉ phụ thuộc vào dữ liệu đã quan sát. Ví dụ người trẻ ít khai thu nhập, có cột tuổi, và trong cùng độ tuổi việc khai không liên quan đến thu nhập. Xóa dòng gây lệch vì người trẻ bị loại nhiều hơn. Dùng MICE có cột tuổi thì xử lý được.

**MNAR** vẫn phụ thuộc vào chính giá trị bị thiếu, kể cả sau khi đã xét các biến khác. Ví dụ người thu nhập cao giấu thu nhập, hay cảm biến ngừng ghi khi vượt 120 độ. Xóa dòng và MICE đều lệch. Cần hiểu nghiệp vụ, thu thập thêm, hoặc phân tích độ nhạy.

Tên MAR dễ gây hiểu nhầm: việc thiếu vẫn có quy luật, chỉ là quy luật đó nằm trong dữ liệu quan sát được.`,
    keyPoints: [
      { text: 'MCAR không phụ thuộc vào giá trị nào', keywords: ['mcar', 'hoàn toàn ngẫu nhiên'], weight: 2 },
      { text: 'MAR phụ thuộc dữ liệu quan sát được', keywords: ['mar', 'quan sát được', 'đã quan sát'], weight: 2 },
      { text: 'MNAR phụ thuộc chính giá trị bị thiếu', keywords: ['mnar', 'chính giá trị', 'giá trị bị thiếu'], weight: 2 },
      { text: 'Hệ quả cho xóa dòng và MICE', keywords: ['xóa dòng', 'listwise', 'mice', 'không lệch'] },
    ],
    followUps: ['Vì sao xóa dòng lại không lệch dưới MCAR?', 'Thiếu cấu trúc là gì?'],
    commonMistakes: ['Hiểu MAR là thiếu ngẫu nhiên theo nghĩa thông thường.', 'Chỉ nêu định nghĩa, không nói hệ quả cho cách xử lý.'],
  },
  {
    id: 'iv-eda-missing-02',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-missing-values', 'fe-imputation'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Điền trung bình rất phổ biến. Về bản chất, cách này làm sai điều gì?',
    referenceAnswer: `Điền trung bình giữ nguyên trung bình của cột, nên trông có vẻ vô hại, nhưng nó phá phần còn lại của phân phối. Mọi ô được điền đều nằm đúng tại tâm, nên có ba hệ quả.

Thứ nhất, **phương sai bị thu nhỏ**. Điền 20% dòng làm phương sai giảm khoảng 20%. Thứ hai, **quan hệ giữa các biến yếu đi**: các dòng được điền có độ lệch bằng 0 nên không đóng góp vào hiệp phương sai, và tương quan bị nhân với căn bậc hai của 0,8, tức giảm khoảng 10%. Thứ ba, **độ bất định biến mất**: phương pháp coi giá trị điền như đã quan sát thật, nên khoảng tin cậy hẹp hơn mức đáng có.

Nếu không phải MCAR thì còn tệ hơn: dưới MAR, một con số chung bỏ qua biến giải thích việc thiếu, nên trung bình cũng lệch.

Tuy nhiên, nó vẫn có thể chấp nhận được khi mục tiêu là dự đoán, tỷ lệ thiếu nhỏ và mô hình đủ mạnh. Khi cần suy luận, tôi dùng MICE hoặc Multiple Imputation.`,
    keyPoints: [
      { text: 'Phương sai bị thu nhỏ', keywords: ['phương sai', 'variance'], weight: 2 },
      { text: 'Tương quan bị yếu đi', keywords: ['tương quan', 'hiệp phương sai', 'correlation'], weight: 2 },
      { text: 'Bỏ qua độ bất định khi điền', keywords: ['độ bất định', 'khoảng tin cậy', 'uncertainty'] },
      { text: 'Lệch khi không phải MCAR', keywords: ['mar', 'không phải mcar', 'biến giải thích'] },
      { text: 'Phân biệt mục tiêu dự đoán và suy luận', keywords: ['dự đoán', 'suy luận', 'multiple imputation', 'mice'] },
    ],
    followUps: ['Điền trung vị có khắc phục được không?', 'Vì sao Multiple Imputation lại giữ được độ bất định?'],
    commonMistakes: ['Nói điền trung bình an toàn vì trung bình không đổi.'],
  },
  {
    id: 'iv-eda-missing-03',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-missing-values'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Làm sao biết một cột thuộc cơ chế thiếu nào? Có kiểm định được không?',
    referenceAnswer: `Chỉ kiểm định được một phần, và phần còn lại về nguyên tắc là không thể.

**MCAR có thể bị bác bỏ.** Tôi so sánh nhóm thiếu và nhóm không thiếu trên các biến khác. Khác biệt rõ thì không phải MCAR. Little's MCAR Test làm việc này một cách chính thức, nhưng kết quả không có ý nghĩa thống kê không chứng minh MCAR, vì nó có thể thiếu lực và kém nhạy với MNAR.

**MAR và MNAR không tách được từ dữ liệu đang có.** Khác biệt giữa chúng nằm ở chỗ việc thiếu có phụ thuộc vào giá trị chưa quan sát hay không, mà muốn biết thì phải có giá trị đó. Hai thế giới khác nhau có thể sinh ra đúng cùng một dữ liệu quan sát.

Nên tôi dùng ba nguồn khác. Một là **quy trình sinh dữ liệu**: ai nhập, khi nào thiếu. Hai là **dữ liệu bổ sung**: gọi lại một mẫu người không trả lời, hoặc đối chiếu nguồn khác. Ba là **phân tích độ nhạy**: giả định người thiếu có thu nhập cao hơn 10%, 30%, rồi xem kết luận có đổi không. Nếu không đổi, cơ chế chính xác không còn quá quan trọng.`,
    keyPoints: [
      { text: 'So sánh nhóm thiếu và không thiếu để bác bỏ MCAR', keywords: ['nhóm thiếu', 'little', 'bác bỏ mcar'], weight: 2 },
      { text: 'Không tách được MAR và MNAR từ dữ liệu đang có', keywords: ['không tách được', 'không phân biệt', 'không quan sát', 'không kiểm định'], weight: 2 },
      { text: 'Dựa vào quy trình sinh dữ liệu', keywords: ['quy trình', 'nghiệp vụ', 'sinh dữ liệu'] },
      { text: 'Thu thập bổ sung', keywords: ['gọi lại', 'dữ liệu bổ sung', 'thu thập thêm'] },
      { text: 'Phân tích độ nhạy', keywords: ['độ nhạy', 'sensitivity'], weight: 2 },
    ],
    followUps: ['Thiết kế phân tích độ nhạy cho một báo cáo thu nhập thế nào?', 'Thêm biến vào mô hình có thể đổi MNAR thành MAR không?'],
    commonMistakes: ['Khẳng định Little\'s Test xác nhận được MCAR.', 'Nói có kiểm định phân biệt MAR và MNAR.'],
  },
  {
    id: 'iv-eda-missing-04',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-missing-values', 'eda-leakage', 'fe-imputation'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Một cột rất quan trọng trong mô hình chấm điểm tín dụng bị thiếu 40%. Bạn ra quyết định thế nào?',
    referenceAnswer: `Tôi không quyết định theo con số 40%, mà đi từ nguyên nhân và mục tiêu.

Đầu tiên, tìm **vì sao thiếu**. Hỏi đội vận hành và xem theo thời gian, kênh, sản phẩm. Nếu trường chỉ được điền sau khi duyệt vay thì đây là rò rỉ, phải bỏ dù cột rất mạnh. Nếu một kênh chưa bao giờ thu thập thì mô hình cần xử lý khác biệt theo kênh. Nếu khách tự chọn không khai thì khả năng cao là MNAR, và việc không khai bản thân là thông tin.

Sau đó xét **mục tiêu**. Với dự đoán, tôi so sánh các phương án trên tập tách theo thời gian: bỏ cột, điền kèm cờ thiếu, hoặc mô hình riêng cho từng nhóm. Tôi kiểm tra cả độ ổn định của cơ chế thiếu lúc triển khai. Với tín dụng còn có **yêu cầu giải thích và công bằng**: nếu việc thiếu liên quan đến nhóm dân cư, cờ thiếu có thể trở thành yếu tố phân biệt.

Về lâu dài, nếu cột thực sự có giá trị, tôi đề xuất sửa quy trình thu thập. Đó thường là giải pháp có tác động lớn nhất, và có thể lấy lại phần dữ liệu đã mất thông qua nguồn khác.`,
    keyPoints: [
      { text: 'Tìm nguyên nhân thiếu, không theo ngưỡng', keywords: ['nguyên nhân', 'vì sao thiếu', 'không theo ngưỡng'], weight: 2 },
      { text: 'Kiểm tra có phải rò rỉ không', keywords: ['rò rỉ', 'leakage', 'sau khi duyệt'], weight: 2 },
      { text: 'So sánh phương án trên tách theo thời gian', keywords: ['so sánh', 'tách theo thời gian', 'cờ thiếu'] },
      { text: 'Xét công bằng và giải thích', keywords: ['công bằng', 'giải thích', 'phân biệt'] },
      { text: 'Sửa quy trình thu thập', keywords: ['quy trình thu thập', 'sửa quy trình', 'thu thập'] },
    ],
    followUps: ['Làm sao giám sát tỷ lệ thiếu sau khi triển khai?', 'Bạn trình bày đánh đổi này với đội rủi ro thế nào?'],
    commonMistakes: ['Áp dụng ngưỡng cố định như thiếu trên 30% thì bỏ.', 'Không nghĩ đến khả năng trường chỉ có sau sự kiện.'],
  },
  {
    id: 'iv-eda-outliers-01',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-outliers'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Bạn phát hiện ngoại lai bằng IQR và Z-score thế nào? Khi nào dùng cách nào?',
    referenceAnswer: `**IQR** là khoảng cách giữa Q3 và Q1. Điểm nằm ngoài \`Q1 - 1,5 × IQR\` và \`Q3 + 1,5 × IQR\` bị gắn cờ. Vì dùng phân vị nên cách này không cần phân phối chuẩn, và ít bị chính ngoại lai kéo đi. Điểm yếu là trên dữ liệu đuôi dài, nó gắn cờ rất nhiều giá trị thật.

**Z-score** là \`(x - mean) / sd\`, thường đánh dấu khi \`|z| > 3\`. Cách này hợp với dữ liệu gần chuẩn, nhưng trung bình và độ lệch chuẩn bị ngoại lai kéo theo, nên điểm cực đoan có thể tự che mình. Modified Z-score dùng trung vị và MAD để khắc phục.

Tôi thường bắt đầu với IQR hoặc Modified Z-score, và biến đổi log trước nếu dữ liệu lệch. Cả hai chỉ xét từng biến, nên muốn tìm tổ hợp bất thường thì cần cách khác như Isolation Forest.

Quan trọng là bị gắn cờ không có nghĩa là phải xóa. Tôi kiểm tra xem đó là lỗi hay tín hiệu thật trước khi quyết định.`,
    keyPoints: [
      { text: 'Công thức IQR, không cần phân phối chuẩn', keywords: ['q1', 'q3', 'iqr', 'phân vị'], weight: 2 },
      { text: 'Công thức Z-score, giả định gần chuẩn', keywords: ['z score', 'độ lệch chuẩn', 'gần chuẩn'], weight: 2 },
      { text: 'Z-score bị chính ngoại lai ảnh hưởng', keywords: ['masking', 'kéo theo', 'tự che', 'modified z'] },
      { text: 'Không tự động xóa', keywords: ['không xóa', 'lỗi hay tín hiệu', 'tín hiệu thật'] },
    ],
    followUps: ['Với 1 triệu dòng chuẩn, |z| > 3 đánh dấu bao nhiêu điểm?', 'Vì sao dữ liệu đuôi dài làm IQR gắn cờ nhiều?'],
    commonMistakes: ['Dùng Z-score trên dữ liệu rất lệch mà không kiểm tra.', 'Xem mọi điểm bị gắn cờ là lỗi.'],
  },
  {
    id: 'iv-eda-outliers-02',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-outliers', 'fe-robust'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Khi nào ngoại lai là tín hiệu thật thay vì lỗi? Bạn quyết định giữ hay xóa thế nào?',
    referenceAnswer: `Câu hỏi đúng không phải điểm này xa bao nhiêu, mà là nó được sinh ra bởi cơ chế nào. Tôi hỏi ba câu theo thứ tự.

**Giá trị có thể xảy ra không?** Tuổi 200 hay số lượng âm là lỗi. Tôi sửa từ nguồn, hoặc chuyển thành thiếu, không bỏ cả dòng nếu các cột khác vẫn tốt.

**Có thuộc tổng thể đang xét không?** Khách doanh nghiệp trong tập khách lẻ, hay tài khoản nội bộ, là điểm thật nhưng của cơ chế khác. Tôi tách nhóm hoặc loại nếu mô hình không phục vụ họ.

**Nếu thật và đúng tổng thể,** đó là tín hiệu. Với gian lận hay hỏng máy, các điểm này chính là mục tiêu. Với doanh thu, vài khách lớn có thể chiếm phần lớn tổng số, nên xóa đi sẽ làm dự báo sai. Khi đó tôi giữ lại và dùng biến đổi log, co giãn bền, hoặc hàm mất mát bền.

Tôi ghi lại mọi quyết định và chỉ đặt ngưỡng trên train. Tôi không xóa ngoại lai ở test, vì production vẫn gặp chúng.`,
    keyPoints: [
      { text: 'Kiểm tra giá trị có thể xảy ra không', keywords: ['có thể xảy ra', 'lỗi nhập', 'vô lý', 'không thể'], weight: 2 },
      { text: 'Kiểm tra có thuộc tổng thể không', keywords: ['tổng thể', 'tách nhóm', 'cơ chế khác'], weight: 2 },
      { text: 'Nêu ví dụ tín hiệu thật', keywords: ['gian lận', 'hỏng máy', 'khách lớn'] },
      { text: 'Giữ lại và dùng cách bền', keywords: ['log', 'co giãn bền', 'robust', 'mất mát bền'] },
      { text: 'Không xóa ở tập test', keywords: ['tập test', 'production', 'trên train'] },
    ],
    followUps: ['Nếu xóa ngoại lai làm RMSE giảm 30%, bạn có báo cáo con số đó không?', 'Bạn kiểm tra với nghiệp vụ thế nào khi có hàng nghìn điểm?'],
    commonMistakes: ['Trả lời theo công thức, không nói đến cơ chế sinh dữ liệu.', 'Xóa ngoại lai để chỉ số đẹp hơn.'],
  },
  {
    id: 'iv-eda-outliers-03',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-outliers'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Khi nào bạn dùng Isolation Forest thay cho IQR? Không có nhãn thì đánh giá kết quả thế nào?',
    referenceAnswer: `Tôi dùng Isolation Forest khi điểm bất thường nằm ở **tổ hợp**, không phải ở từng biến. Giao dịch 40 triệu lúc 3 giờ sáng có thể bình thường theo từng cột, nên IQR không thấy. Ý tưởng là cắt ngẫu nhiên theo cột và giá trị: điểm khác biệt bị cô lập sau ít lần cắt hơn, nên không cần mô hình hóa phần dữ liệu bình thường.

Điểm yếu là khó giải thích, kém hơn khi ngoại lai tạo thành cụm dày, và các đường cắt song song với trục. Nhiều cột không liên quan cũng làm tín hiệu loãng đi. Ngoài ra \`contamination\` chỉ là cách đặt ngưỡng: đặt 1% thì có khoảng 1% bị gắn cờ, dù dữ liệu sạch.

Không có nhãn, tôi đánh giá bằng **kiểm tra mẫu**: lấy mẫu trong nhóm điểm cao và cả nhóm điểm thấp để đo tỷ lệ sự cố thật, từ đó ước lượng precision và phần bị bỏ sót. Tôi cũng kiểm tra độ ổn định của xếp hạng khi đổi seed hay đổi tập cột. Cuối cùng, tôi chọn ngưỡng theo năng lực kiểm tra của đội vận hành, ví dụ 200 ca mỗi ngày, thay vì theo một tỷ lệ cố định.`,
    keyPoints: [
      { text: 'Tìm bất thường theo tổ hợp nhiều chiều', keywords: ['tổ hợp', 'nhiều chiều', 'nhiều biến'], weight: 2 },
      { text: 'Cơ chế cô lập sau ít lần cắt', keywords: ['cô lập', 'ít lần cắt', 'đường đi ngắn', 'isolate'] },
      { text: 'contamination chỉ để đặt ngưỡng', keywords: ['contamination', 'đặt ngưỡng'] },
      { text: 'Kiểm tra mẫu để đánh giá', keywords: ['kiểm tra mẫu', 'lấy mẫu', 'precision'], weight: 2 },
      { text: 'Chọn ngưỡng theo năng lực vận hành', keywords: ['năng lực', 'vận hành', 'đội kiểm tra'] },
    ],
    followUps: ['Làm sao giải thích cho nghiệp vụ vì sao một điểm bị gắn cờ?', 'Bạn xử lý biến phân loại thế nào?'],
    commonMistakes: ['Coi kết quả của Isolation Forest là sự thật.', 'Cho rằng contamination là tỷ lệ ngoại lai được phát hiện tự động.'],
  },
  {
    id: 'iv-eda-leakage-01',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-leakage'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Data Leakage là gì? Phân biệt Target Leakage và Train-Test Contamination, kèm ví dụ.',
    referenceAnswer: `Data Leakage là khi quá trình xây mô hình dùng thông tin không có được tại thời điểm dự đoán thật, nên chỉ số đánh giá cao hơn năng lực thật.

**Target Leakage** nằm ở đặc trưng: cột chứa thông tin về nhãn mà lúc dự đoán chưa có, thường vì nó sinh ra sau hoặc do chính kết quả. Ví dụ khi dự đoán vỡ nợ lúc giải ngân, cột số cuộc gọi nhắc nợ là rò rỉ, vì chỉ quá hạn mới có nhắc nợ. Tách tập cẩn thận không sửa được, phải bỏ hoặc tính lại cột.

**Train-Test Contamination** nằm ở quy trình: thông tin của tập đánh giá lọt vào huấn luyện. Ví dụ fit scaler hay chọn đặc trưng trên toàn bộ dữ liệu rồi mới tách, chạy SMOTE trước khi tách, hoặc để ảnh của cùng một bệnh nhân ở cả hai tập. Cách sửa là tách trước, rồi fit chỉ trên train, thường bằng pipeline.

Điểm chung là cả hai đều cho kết quả đẹp khi thử nghiệm, rồi tụt ở production.`,
    keyPoints: [
      { text: 'Định nghĩa: thông tin không có lúc dự đoán', keywords: ['thời điểm dự đoán', 'lúc dự đoán', 'không có được'], weight: 2 },
      { text: 'Target Leakage nằm ở đặc trưng', keywords: ['target leakage', 'rò rỉ nhãn', 'sinh ra sau'], weight: 2 },
      { text: 'Contamination nằm ở quy trình', keywords: ['contamination', 'nhiễm chéo', 'fit trên toàn bộ', 'toàn bộ dữ liệu'], weight: 2 },
      { text: 'Cách sửa khác nhau', keywords: ['pipeline', 'tách trước', 'bỏ cột', 'tính lại'] },
    ],
    followUps: ['Chỉ fit scaler trên toàn bộ dữ liệu thì có nghiêm trọng không?', 'Cho một ví dụ rò rỉ qua mẫu hình thiếu.'],
    commonMistakes: ['Chỉ nghĩ đến việc đưa nhãn trực tiếp vào đặc trưng.', 'Cho rằng tách tập cẩn thận sẽ loại mọi loại rò rỉ.'],
  },
  {
    id: 'iv-eda-leakage-02',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-leakage', 'eval-cross-validation', 'eval-overfitting'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao rò rỉ không bị Cross Validation phát hiện, trong khi Overfitting thì có? Từ đó bạn rút ra điều gì?',
    referenceAnswer: `Cross Validation chỉ trả lời một câu hỏi: mô hình tổng quát hóa thế nào trên dữ liệu **được tạo ra theo cùng cách** với dữ liệu huấn luyện.

**Overfitting** là mô hình học thuộc nhiễu riêng của tập train. Nhiễu đó không có ở fold kiểm tra, nên chỉ số giảm, và CV thấy được.

**Target Leakage** thì khác. Đặc trưng rò rỉ có mặt ở mọi fold, kể cả fold kiểm tra, và quan hệ của nó với nhãn là thật trong toàn bộ dữ liệu. Mô hình tận dụng quan hệ đó và vẫn đúng ở fold kiểm tra. CV không sai về phép tính, chỉ là giả định dữ liệu kiểm tra giống lúc dùng thật đã bị phá vỡ. Với Contamination, nếu tiền xử lý chạy trước CV thì chính các fold đã không còn độc lập.

Từ đó, tôi rút ra rằng chỉ số đánh giá không thể tự kiểm tra tính hợp lệ của nó. Phải kiểm tra từ bên ngoài: mốc thời gian của từng đặc trưng, thứ tự các bước, hiểu biết nghiệp vụ, và so sánh với cách tách theo thời gian hay chạy thử ở production.`,
    keyPoints: [
      { text: 'CV giả định dữ liệu kiểm tra được tạo giống dữ liệu thật', keywords: ['cùng cách', 'giả định', 'giống lúc dùng thật'], weight: 2 },
      { text: 'Đặc trưng rò rỉ có ở mọi fold', keywords: ['mọi fold', 'fold kiểm tra', 'cả train và test'], weight: 2 },
      { text: 'Overfitting là học nhiễu riêng của train', keywords: ['nhiễu', 'học thuộc', 'overfitting'] },
      { text: 'Phải kiểm tra từ bên ngoài chỉ số', keywords: ['mốc thời gian', 'nghiệp vụ', 'tách theo thời gian', 'production'] },
    ],
    followUps: ['Nested Cross Validation có giải quyết được rò rỉ không?', 'Khi nào test cao hơn train một cách đáng ngờ?'],
    commonMistakes: ['Nói dùng nhiều fold hơn sẽ phát hiện được rò rỉ.'],
  },
  {
    id: 'iv-eda-leakage-03',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-leakage', 'eval-feature-importance'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Mô hình đạt AUC 0,98 khi thử nghiệm nhưng chỉ 0,65 ở production. Bạn điều tra thế nào?',
    referenceAnswer: `Tôi coi đây là vấn đề về dữ liệu trước, chưa nghĩ đến thuật toán, và đi theo thứ tự chi phí từ thấp đến cao.

**Bước 1, xem đặc trưng.** Tôi xem importance và AUC của riêng từng cột. Một cột vượt trội là nghi phạm đầu tiên, và tôi hỏi: tại thời điểm dự đoán nó đã có chưa, hay được tính từ bảng hiện tại?

**Bước 2, rà quy trình.** Scaler, Target Encoding, chọn đặc trưng được fit ở đâu? SMOTE chạy trước hay sau khi tách? Tôi chuyển mọi bước vào pipeline rồi đo lại.

**Bước 3, đổi cách tách.** Tách theo thời gian và theo thực thể. Nếu AUC tụt mạnh, đó là bằng chứng rò rỉ hoặc cấu trúc phụ thuộc.

**Bước 4, so sánh trực tiếp.** Lấy các dòng production, so phân phối từng đặc trưng với lúc huấn luyện. Khác biệt có thể do logic tính khác nhau giữa huấn luyện và lúc phục vụ, chứ không phải rò rỉ. Tôi cũng loại trừ trôi dữ liệu và thay đổi định nghĩa nhãn.

Sau khi sửa, tôi báo cáo con số thấp hơn nhưng đáng tin, và thêm kiểm tra tự động để tránh lặp lại.`,
    keyPoints: [
      { text: 'Xem importance và từng cột riêng lẻ', keywords: ['importance', 'từng cột', 'riêng từng'], weight: 2 },
      { text: 'Kiểm tra mốc thời gian của đặc trưng', keywords: ['thời điểm dự đoán', 'mốc thời gian', 'bảng hiện tại', 'point in time'], weight: 2 },
      { text: 'Rà thứ tự tiền xử lý, dùng pipeline', keywords: ['pipeline', 'fit ở đâu', 'tiền xử lý', 'smote'] },
      { text: 'Đổi sang tách theo thời gian và thực thể', keywords: ['tách theo thời gian', 'theo thực thể', 'theo nhóm'] },
      { text: 'Loại trừ khác biệt khi phục vụ và trôi dữ liệu', keywords: ['training serving', 'lúc phục vụ', 'trôi dữ liệu', 'drift'] },
    ],
    followUps: ['Làm sao phân biệt rò rỉ với trôi dữ liệu?', 'Kiểm tra tự động nào bạn đặt vào pipeline?'],
    commonMistakes: ['Lao vào chỉnh siêu tham số hay đổi mô hình.', 'Kết luận là overfitting dù test thử nghiệm rất cao.'],
  },
  {
    id: 'iv-eda-leakage-04',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-leakage', 'dq-time-series', 'eval-train-val-test'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Thiết kế quy trình để chống rò rỉ từ gốc cho một đội có nhiều người làm mô hình, thay vì trông vào việc kiểm tra thủ công.',
    referenceAnswer: `Nguyên nhân gốc của rò rỉ là dữ liệu không ghi lại thời điểm một giá trị được biết, và quy trình để mỗi người tự xử lý. Nên tôi thiết kế để cách làm đúng cũng là cách dễ nhất.

**Dữ liệu:** lưu theo thời gian thay vì ghi đè, có cột thời gian sự kiện và thời gian ghi nhận. Đặc trưng được tính qua một lớp dùng chung, có phép ghép point-in-time, để khi train và khi phục vụ dùng cùng logic.

**Định nghĩa bài toán:** mỗi dự án bắt buộc ghi rõ mốc dự đoán, cửa sổ nhãn và đơn vị thực thể. Từ đó, cách tách theo thời gian và theo nhóm là mặc định, tách ngẫu nhiên phải có lý do.

**Thí nghiệm:** mọi biến đổi nằm trong pipeline, fit theo fold. Tập test cuối do một quy trình riêng giữ, và hạn chế số lần xem để tránh chọn mô hình theo test.

**Kiểm tra tự động:** cảnh báo cột có AUC riêng lẻ quá cao, mẫu hình thiếu liên quan đến nhãn, và trùng thực thể giữa các tập.

**Sau cùng là chạy thử:** Shadow Deployment để so sánh với chỉ số thử nghiệm trước khi dùng thật. Đánh đổi là tốn công hạ tầng ban đầu, nhưng chi phí một lần triển khai sai thường lớn hơn.`,
    keyPoints: [
      { text: 'Lưu dữ liệu theo thời gian, ghép point-in-time', keywords: ['point in time', 'theo thời gian', 'không ghi đè', 'thời gian ghi nhận'], weight: 2 },
      { text: 'Bắt buộc ghi mốc dự đoán và đơn vị thực thể', keywords: ['mốc dự đoán', 'cửa sổ nhãn', 'đơn vị thực thể'], weight: 2 },
      { text: 'Pipeline, fit theo fold, tập test riêng', keywords: ['pipeline', 'theo fold', 'tập test'] },
      { text: 'Kiểm tra tự động', keywords: ['tự động', 'cảnh báo'] },
      { text: 'Shadow Deployment trước khi dùng thật', keywords: ['shadow', 'chạy thử', 'chạy song song'] },
    ],
    followUps: ['Làm gì khi hệ thống nguồn chỉ lưu trạng thái hiện tại?', 'Bạn thuyết phục lãnh đạo đầu tư lớp đặc trưng dùng chung thế nào?'],
    commonMistakes: ['Chỉ đưa ra danh sách kiểm tra thủ công.', 'Quên rằng logic tính đặc trưng lúc phục vụ phải giống lúc huấn luyện.'],
  },
  {
    id: 'iv-eda-imbalanced-01',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-imbalanced', 'eval-accuracy'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Dữ liệu mất cân bằng gây ra vấn đề gì? Bạn chọn chỉ số đánh giá thế nào?',
    referenceAnswer: `Dữ liệu mất cân bằng là khi một lớp rất hiếm, như gian lận 0,5%. Vấn đề đầu tiên là accuracy đánh lừa: mô hình đoán toàn lớp đa số đã đạt 99,5% mà không phát hiện được gì. Thứ hai là có ít mẫu dương tuyệt đối để học. Thứ ba là ngưỡng 0,5 mặc định thường không phù hợp, vì xác suất dự đoán đa số đều thấp.

Tôi chọn chỉ số theo quyết định của nghiệp vụ. Nếu bỏ sót rất đắt, như gian lận hay bệnh, tôi xem Recall tại mức Precision chấp nhận được. Nếu năng lực xử lý có hạn, tôi xem Precision trong top K. Để so sánh tổng quát, tôi dùng PR-AUC vì nó tập trung vào lớp dương, và mốc của mô hình ngẫu nhiên bằng tỷ lệ dương chứ không phải 0,5.

Tôi cũng báo cáo trên dữ liệu giữ nguyên tỷ lệ thật, luôn so với baseline, và dùng Stratified Sampling để mỗi fold có đủ mẫu hiếm.`,
    keyPoints: [
      { text: 'Accuracy đánh lừa', keywords: ['accuracy', 'lớp đa số'], weight: 2 },
      { text: 'Chọn chỉ số theo quyết định nghiệp vụ', keywords: ['recall', 'precision', 'chi phí', 'nghiệp vụ'], weight: 2 },
      { text: 'PR-AUC và mốc bằng tỷ lệ dương', keywords: ['pr auc', 'tỷ lệ dương'] },
      { text: 'Đánh giá trên tỷ lệ thật, phân tầng', keywords: ['tỷ lệ thật', 'tỷ lệ tự nhiên', 'stratified', 'phân tầng'] },
    ],
    followUps: ['ROC-AUC có vấn đề gì ở đây?', 'Vì sao 1% trên 10 triệu dòng dễ hơn 1% trên 5.000 dòng?'],
    commonMistakes: ['Dùng accuracy làm chỉ số chính.', 'Nghĩ tỷ lệ lớp tự nó đã là lỗi cần sửa.'],
  },
  {
    id: 'iv-eda-imbalanced-02',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-imbalanced', 'eval-precision', 'eda-leakage'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao không được resampling trên tập test? Nếu resampling trước khi tách thì sai ở đâu?',
    referenceAnswer: `Tập test tồn tại để ước lượng hiệu năng trên dữ liệu thật, nên nó phải giống dữ liệu thật. Resampling phá vỡ điều đó theo ba cách.

Thứ nhất, **Precision phụ thuộc tỷ lệ dương**. Với Recall 80% và tỷ lệ báo động sai 1%, dữ liệu 0,5% dương cho Precision 28,7%, còn tập 50:50 cho 98,8%. Mô hình không đổi, chỉ con số bị thổi phồng, nên kế hoạch vận hành sẽ sai. Thứ hai, **mẫu tổng hợp không phải ca thật**, nên điểm số một phần đo khả năng nhận ra mẫu do chính SMOTE tạo.

Thứ ba, nếu resampling **trước khi tách** thì còn có rò rỉ. Random Oversampling có thể đưa bản sao của một dòng vào cả train và test. SMOTE thì tạo mẫu train từ các điểm sau đó nằm ở test, nên hai tập không còn độc lập.

Cách đúng là tách trước, chỉ resampling trên train, và trong Cross Validation thì chỉ trên phần train của mỗi fold. Pipeline của imbalanced-learn làm điều này tự động. Validation và test giữ nguyên tỷ lệ.`,
    keyPoints: [
      { text: 'Test phải giống dữ liệu thật', keywords: ['dữ liệu thật', 'tỷ lệ thật', 'phân phối thật'], weight: 2 },
      { text: 'Precision phụ thuộc tỷ lệ dương', keywords: ['precision', 'tỷ lệ dương'], weight: 2 },
      { text: 'Mẫu tổng hợp không phải ca thật', keywords: ['tổng hợp', 'không phải ca thật', 'synthetic'] },
      { text: 'Resampling trước khi tách gây rò rỉ', keywords: ['rò rỉ', 'leakage', 'trước khi tách', 'bản sao'], weight: 2 },
      { text: 'Chỉ làm trên train của mỗi fold', keywords: ['từng fold', 'mỗi fold', 'pipeline', 'chỉ trên train'] },
    ],
    followUps: ['Nếu muốn nhìn đều hai lớp thì dùng chỉ số nào mà không cần resampling?', 'Có khi nào cần đánh giá trên tập cân bằng không?'],
    commonMistakes: ['Cân bằng toàn bộ dữ liệu trước, rồi chia tập.', 'Chỉ nói vì rò rỉ mà không nói được ảnh hưởng đến Precision.'],
  },
  {
    id: 'iv-eda-imbalanced-03',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-imbalanced'],
    interviewTypes: ['ds'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'So sánh Class Weight, SMOTE, Undersampling và đổi ngưỡng. Bạn chọn thế nào?',
    referenceAnswer: `**Đổi ngưỡng** giữ nguyên mô hình, chỉ đổi điểm cắt theo chi phí. Đơn giản, rẻ, xác suất không bị đụng đến, nên tôi luôn thử đầu tiên.

**Class Weight** phạt nặng hơn lỗi ở lớp hiếm, không đổi dữ liệu và không tốn thêm bộ nhớ. Cái giá là xác suất bị lệch lên, nên cần hiệu chỉnh nếu dùng xác suất.

**Undersampling** bỏ bớt lớp đa số. Tốt khi dữ liệu quá lớn, vì huấn luyện nhanh hơn nhiều. Cái giá là mất thông tin thật và kết quả dao động. Xác suất có thể đổi ngược bằng công thức hiệu chỉnh.

**SMOTE** nội suy mẫu hiếm mới. Nó giảm trùng lặp so với nhân bản, nhưng không thêm thông tin, có thể tạo mẫu phi lý, kém với biến phân loại và dữ liệu nhiều chiều.

Thực tế, tôi làm từ đơn giản đến phức tạp, đo mọi cách bằng cùng một chỉ số trên validation giữ nguyên tỷ lệ. Elor và Averbuch-Elor (2022) cho thấy với mô hình mạnh, đổi ngưỡng cho kết quả tương tự cân bằng, và nếu cân bằng thì nhân bản ngẫu nhiên hiệu quả tương đương SMOTE. Chỉ giữ kỹ thuật phức tạp hơn khi nó cải thiện rõ.`,
    keyPoints: [
      { text: 'Đổi ngưỡng đơn giản, giữ xác suất', keywords: ['đổi ngưỡng', 'điểm cắt', 'threshold'], weight: 2 },
      { text: 'Class Weight làm lệch xác suất', keywords: ['class weight', 'trọng số', 'lệch xác suất'] },
      { text: 'Undersampling hợp với dữ liệu lớn, mất thông tin', keywords: ['undersampling', 'mất thông tin', 'dữ liệu lớn'] },
      { text: 'SMOTE không thêm thông tin, nhiều rủi ro', keywords: ['smote', 'nội suy', 'phi lý'] },
      { text: 'Đo trên validation giữ nguyên tỷ lệ', keywords: ['validation', 'giữ nguyên tỷ lệ', 'tỷ lệ tự nhiên'], weight: 2 },
    ],
    followUps: ['Đổi ngưỡng có làm thay đổi ROC-AUC không?', 'Với 50 mẫu dương, bạn làm gì?'],
    commonMistakes: ['Mặc định dùng SMOTE mà không so sánh.', 'Không nhắc đến ảnh hưởng đến xác suất.'],
  },
  {
    id: 'iv-eda-imbalanced-04',
    topicId: 'analysis',
    category: 'eda-issues',
    conceptIds: ['eda-imbalanced', 'eval-calibration', 'eval-pr-auc'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Mất cân bằng có thật sự là một vấn đề cần sửa không? Trình bày cách tiếp cận cho bài toán gian lận 0,1% trên 10 triệu giao dịch.',
    referenceAnswer: `Tỷ lệ lớp tự nó không phải lỗi. Với 0,1% trên 10 triệu dòng, tôi có 10.000 ca dương, đủ để học. Nếu mô hình hiệu chỉnh tốt, nó sẽ cho xác suất thấp một cách đúng đắn, và điều đó không sai. Vấn đề thật là chọn chỉ số và cách ra quyết định. Nghiên cứu cũng cho thấy việc cân bằng thường không tăng khả năng xếp hạng, mà còn làm hỏng xác suất.

**Cách tiếp cận:** đầu tiên tách theo thời gian và tách theo tài khoản, vì gian lận thay đổi theo thời gian và có tính cụm. Chỉ số gồm PR-AUC, và số tiền cứu được theo số ca kiểm tra. Baseline PR-AUC ở đây là 0,001.

Tôi huấn luyện không cân bằng trước, hoặc undersample lớp âm để giảm chi phí tính toán rồi hiệu chỉnh xác suất. Sau đó đặt ngưỡng theo chi phí, kết hợp năng lực của đội kiểm tra.

**Vấn đề khó hơn tỷ lệ lớp** là nhãn bị trễ, nhãn thiếu vì chỉ giao dịch bị chặn hay bị khiếu nại mới có nhãn, và đối thủ thay đổi hành vi. Việc mô hình chặn giao dịch cũng làm mất nhãn của chính các giao dịch đó, nên cần giữ một phần ngẫu nhiên không chặn để đánh giá.`,
    keyPoints: [
      { text: 'Tỷ lệ lớp tự nó không phải lỗi', keywords: ['không phải lỗi', 'số mẫu tuyệt đối', '10.000 ca'], weight: 2 },
      { text: 'Cân bằng không tăng xếp hạng, làm hỏng xác suất', keywords: ['xếp hạng', 'hỏng xác suất', 'hiệu chỉnh', 'calibration'], weight: 2 },
      { text: 'Tách theo thời gian và tài khoản', keywords: ['theo thời gian', 'theo tài khoản', 'theo nhóm'] },
      { text: 'Chỉ số theo giá trị kinh doanh, ngưỡng theo chi phí', keywords: ['pr auc', 'số tiền', 'chi phí', 'năng lực'] },
      { text: 'Nhãn trễ, nhãn bị ảnh hưởng bởi mô hình', keywords: ['nhãn trễ', 'trễ', 'nhãn thiếu', 'không chặn'] },
    ],
    followUps: ['Làm sao đánh giá giao dịch đã bị mô hình chặn?', 'Khi lượng kiểm tra chỉ 500 ca mỗi ngày, bạn đặt ngưỡng ra sao?'],
    commonMistakes: ['Đi thẳng vào SMOTE.', 'Bỏ qua vấn đề nhãn và thay đổi hành vi theo thời gian.'],
  },
])
