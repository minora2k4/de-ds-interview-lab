import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-dq-metrics-01',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-metrics', 'dq-dimensions'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn biến các chiều chất lượng dữ liệu thành chỉ số đo được như thế nào? Cho ví dụ cụ thể.',
    referenceAnswer: `Mỗi chiều cần một định nghĩa có tử số và mẫu số rõ ràng, vì chỉ số mơ hồ dễ làm người xem hiểu sai.

**Completeness:** số dòng \`customer_id\` không null chia cho tổng số dòng, cùng với số dòng nhận được so với kỳ vọng. **Validity:** số dòng đúng định dạng chia cho số dòng không null. Cũng vì mẫu số này mà cột thiếu 90% vẫn có thể đạt 100% Validity, nên hai chỉ số phải đi kèm nhau. **Uniqueness:** số khóa khác nhau chia cho số dòng. **Timeliness:** số phút trễ so với cam kết. **Consistency:** độ lệch giữa tổng trong bảng và tổng trên hệ thống kế toán. **Accuracy:** tỷ lệ khớp trên một mẫu kiểm tra định kỳ.

Tiếp đó, tôi đo theo mức ảnh hưởng nếu được. 0,1% đơn hàng lỗi nhưng chiếm 20% doanh thu thì nghiêm trọng hơn nhiều so với con số 0,1%.

Mỗi chỉ số cần có mức độ nghiêm trọng và ngưỡng: luật có đáp án rõ như khóa chính dùng ngưỡng cố định, còn chỉ số dao động như số dòng thì so với cùng thứ của những tuần trước.`,
    keyPoints: [
      { text: 'Định nghĩa rõ tử số và mẫu số', keywords: ['tử số', 'mẫu số', 'chia cho', 'tỷ lệ'], weight: 3 },
      { text: 'Ví dụ cụ thể cho từng chiều', keywords: ['completeness', 'validity', 'uniqueness', 'timeliness'], weight: 2 },
      { text: 'Đo theo mức ảnh hưởng', keywords: ['ảnh hưởng', 'doanh thu', 'theo giá trị'] },
      { text: 'Có ngưỡng và mức độ nghiêm trọng', keywords: ['ngưỡng', 'nghiêm trọng', 'severity'], weight: 2 },
    ],
    followUps: ['Bạn tổng hợp các chỉ số này thành scorecard thế nào?'],
    commonMistakes: ['Không nói rõ mẫu số của chỉ số.', 'Chỉ đo theo số dòng, bỏ qua mức ảnh hưởng.'],
  },
  {
    id: 'iv-dq-metrics-02',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-metrics', 'dq-incremental', 'arch-observability'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn đặt ngưỡng cảnh báo cho các chỉ số chất lượng thế nào để vừa không bỏ sót lỗi, vừa không tạo quá nhiều cảnh báo giả?',
    referenceAnswer: `Đây là bài toán đánh đổi: ngưỡng chặt thì nhiều cảnh báo giả, người ta quen bỏ qua, còn ngưỡng lỏng thì bỏ sót. Vậy nên ngưỡng phải dựa vào bản chất từng chỉ số và chi phí của từng loại sai.

**Luật có đáp án rõ** dùng ngưỡng cố định: khóa chính không được trùng, trạng thái phải nằm trong miền. Không cần lịch sử.

**Chỉ số dao động** dùng ngưỡng theo lịch sử: số dòng, tỷ lệ null, PSI. Tôi so với cùng thứ của 4 đến 8 tuần trước, dùng trung vị và độ lệch tuyệt đối vì ít bị ảnh hưởng bởi ngày lỗi trong quá khứ. Ngày lễ phải được xử lý riêng.

**Điểm yếu của ngưỡng lịch sử** là xấu đi từ từ thì lịch sử cũng xấu theo. Nên tôi thêm một ngưỡng tuyệt đối tối thiểu.

Với mỗi cảnh báo, tôi gắn mức độ: chặn với bảng hạng 1, thông báo cho người phụ trách với lỗi nhẹ. Cảnh báo nhẹ có thể cần vượt ngưỡng hai lần liên tiếp mới gửi.

Sau đó tôi coi ngưỡng như thứ cần tinh chỉnh: đo tỷ lệ cảnh báo giả, số sự cố bị bỏ sót, rồi điều chỉnh theo từng tháng.`,
    keyPoints: [
      { text: 'Đánh đổi giữa bỏ sót và cảnh báo giả', keywords: ['đánh đổi', 'cảnh báo giả', 'bỏ sót', 'false positive'], weight: 2 },
      { text: 'Ngưỡng cố định cho luật có đáp án rõ', keywords: ['ngưỡng cố định', 'cố định', 'đáp án rõ'], weight: 2 },
      { text: 'Ngưỡng theo lịch sử, xét cùng chu kỳ', keywords: ['lịch sử', 'cùng thứ', 'cùng chu kỳ', 'mùa vụ'], weight: 3 },
      { text: 'Xấu đi từ từ làm ngưỡng lịch sử trượt theo', keywords: ['từ từ', 'trượt theo', 'xấu theo', 'tuyệt đối'] },
      { text: 'Đo và tinh chỉnh ngưỡng', keywords: ['tinh chỉnh', 'đo tỷ lệ', 'điều chỉnh'] },
    ],
    followUps: ['Bạn xử lý ngày lễ và các đợt khuyến mãi thế nào?'],
    commonMistakes: ['Dùng một ngưỡng cố định cho số dòng của mọi bảng.'],
  },
  {
    id: 'iv-dq-metrics-03',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-metrics', 'dq-overview'],
    interviewTypes: ['ds', 'de', 'system-design'],
    levels: ['senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Giám đốc muốn một con số duy nhất để biết chất lượng dữ liệu của công ty. Bạn phản hồi và thiết kế thế nào?',
    referenceAnswer: `Tôi hiểu nhu cầu thật của giám đốc: biết có đáng lo không, và cần đầu tư vào đâu. Một con số trung bình không trả lời được, vì nó che lỗi nghiêm trọng, và khi trở thành mục tiêu thì sẽ bị làm đẹp, đúng như Goodhart's Law.

Tôi đề xuất một bảng nhỏ cho từng cấp. Ở cấp cao nhất, tôi không tính điểm cho tất cả bảng mà chỉ cho **các sản phẩm dữ liệu quan trọng**, như báo cáo tài chính, mô hình tín dụng. Mỗi sản phẩm có trạng thái đỏ, vàng, xanh, trong đó luật nghiêm trọng hoạt động như cổng.

Thêm vào đó là **chỉ số về kết quả** khó bị làm đẹp: số sự cố dữ liệu ảnh hưởng đến kinh doanh, thời gian phát hiện, thời gian khắc phục, số sự cố do người dùng phát hiện trước, và số quyết định bị trì hoãn.

Nếu vẫn bắt buộc có một con số, tôi chọn **tỷ lệ sản phẩm dữ liệu quan trọng đạt cam kết**, vì nó có ý nghĩa rõ ràng, và có thể xem chi tiết đến từng luật.

Tôi cũng nói rõ giới hạn: con số này chỉ đo những gì đã kiểm tra, không đo tính đại diện hay độ đúng của nhãn.`,
    keyPoints: [
      { text: 'Hiểu nhu cầu thật đằng sau yêu cầu', keywords: ['nhu cầu', 'đầu tư', 'ưu tiên', 'đáng lo'], weight: 2 },
      { text: 'Trung bình che lỗi và dễ bị làm đẹp', keywords: ['che', 'goodhart', 'làm đẹp', 'trung bình'], weight: 2 },
      { text: 'Tập trung vào sản phẩm dữ liệu quan trọng', keywords: ['sản phẩm dữ liệu', 'quan trọng', 'đỏ', 'hạng'], weight: 2 },
      { text: 'Chỉ số kết quả như số sự cố, thời gian khắc phục', keywords: ['sự cố', 'thời gian phát hiện', 'thời gian khắc phục'], weight: 2 },
      { text: 'Nêu giới hạn của con số', keywords: ['giới hạn', 'đại diện', 'không đo'] },
    ],
    followUps: ['Làm sao thuyết phục các đội tự đo và báo cáo trung thực?'],
    commonMistakes: ['Từ chối thẳng mà không đưa ra phương án khác.', 'Lấy trung bình mọi luật của mọi bảng.'],
  },
  {
    id: 'iv-dq-distribution-comparison-01',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-distribution-comparison'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'KS Test, Chi-square và PSI khác nhau thế nào? Khi nào bạn dùng cái nào?',
    referenceAnswer: `Điểm khác chính là kiểu dữ liệu, và câu hỏi mà chúng trả lời.

**KS Test** dùng cho dữ liệu liên tục. Nó so hai hàm phân phối tích lũy và lấy khoảng cách lớn nhất D, cho biết hai mẫu có đến từ cùng phân phối không. Nó không giả định phân phối chuẩn, nhưng kém nhạy ở đuôi.

**Chi-square** dùng cho dữ liệu phân loại, so tần suất quan sát với kỳ vọng. Mỗi nhóm nên có đủ số lượng kỳ vọng, thường từ 5 trở lên, nên phải gộp nhóm hiếm.

Cả hai đều là kiểm định, trả lời câu hỏi có khác nhau không và cho p-value.

**PSI** trả lời khác nhau bao nhiêu. Nó chia dữ liệu thành các nhóm cố định theo tập gốc, rồi cộng \`(A - E) x ln(A / E)\`. Vì không dựa vào p-value, nó ít bị ảnh hưởng hơn khi mẫu lớn.

Tôi dùng PSI để theo dõi hàng trăm đặc trưng định kỳ, vì đơn giản và dễ so sánh. Tôi dùng kiểm định khi mẫu vừa phải, hay cần một kết luận thống kê. Ở quy mô hàng triệu dòng, tôi nhìn D hoặc PSI, chứ không nhìn p-value.`,
    keyPoints: [
      { text: 'KS Test cho dữ liệu liên tục, so CDF', keywords: ['liên tục', 'cdf', 'tích lũy', 'khoảng cách'], weight: 2 },
      { text: 'Chi-square cho dữ liệu phân loại', keywords: ['phân loại', 'tần suất', 'categorical'], weight: 2 },
      { text: 'PSI đo mức thay đổi qua các nhóm', keywords: ['psi', 'mức thay đổi', 'chia nhóm', 'bao nhiêu'], weight: 2 },
      { text: 'Với mẫu lớn, xem mức khác biệt thay vì p-value', keywords: ['mẫu lớn', 'p value', 'mức khác biệt'], weight: 2 },
    ],
    followUps: ['Vì sao KS Test kém nhạy ở đuôi?', 'Bạn chia nhóm cho PSI thế nào?'],
    commonMistakes: ['Dùng KS Test cho dữ liệu phân loại.', 'Coi PSI và p-value trả lời cùng một câu hỏi.'],
  },
  {
    id: 'iv-dq-distribution-comparison-02',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-distribution-comparison', 'stats-p-value', 'stats-hypothesis'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao với hàng triệu dòng, KS Test gần như luôn báo hai phân phối khác nhau? Bạn xử lý thế nào trong thực tế?',
    referenceAnswer: `Kiểm định đo xem khác biệt có vượt quá mức ngẫu nhiên không. Mức ngẫu nhiên co lại khi cỡ mẫu tăng: ngưỡng tới hạn của D giảm theo căn bậc hai của cỡ mẫu. Với hàng triệu dòng, khoảng cách rất nhỏ như D bằng 0,004 cũng cho p-value gần bằng 0.

Hơn nữa, H0 nói hai phân phối **giống hệt nhau**, trong khi hai tập dữ liệu thực tế gần như không bao giờ giống hệt. Vì vậy kiểm định trả lời đúng một câu hỏi không có ích: chúng có giống hệt không, và câu trả lời luôn là không.

Câu hỏi có ích là khác biệt có lớn đến mức ảnh hưởng không. Tôi xử lý như sau. Thứ nhất, dùng mức khác biệt như D, PSI thay vì p-value. Thứ hai, đặt ngưỡng dựa trên lịch sử: PSI ngày thường của đặc trưng này dao động bao nhiêu, và hôm nay có vượt ra ngoài không. Thứ ba, gắn với ảnh hưởng thực tế: đặc trưng này quan trọng thế nào với mô hình, điểm dự đoán có đổi không.

Nếu vẫn muốn dùng kiểm định, có thể chạy trên mẫu nhỏ cố định, nhưng khi đó phải nói rõ mẫu đủ để phát hiện mức thay đổi nào.`,
    keyPoints: [
      { text: 'Sai số ngẫu nhiên giảm khi mẫu tăng, nên khác biệt nhỏ cũng có ý nghĩa', keywords: ['cỡ mẫu', 'mẫu lớn', 'căn bậc hai', 'ngẫu nhiên'], weight: 3 },
      { text: 'H0 yêu cầu giống hệt, điều hiếm khi đúng', keywords: ['giống hệt', 'h0'], weight: 2 },
      { text: 'Phân biệt ý nghĩa thống kê và ý nghĩa thực tế', keywords: ['ý nghĩa thực tế', 'ý nghĩa thống kê', 'effect size', 'mức khác biệt'], weight: 3 },
      { text: 'Đặt ngưỡng theo lịch sử và ảnh hưởng', keywords: ['lịch sử', 'ảnh hưởng', 'psi'] },
    ],
    followUps: ['Làm sao chọn cỡ mẫu nếu vẫn muốn dùng kiểm định?'],
    commonMistakes: ['Nói kiểm định bị sai trên dữ liệu lớn. Kiểm định đúng, chỉ là trả lời câu hỏi khác.'],
  },
  {
    id: 'iv-dq-distribution-comparison-03',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-distribution-comparison', 'dq-drift'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Ngưỡng PSI 0,1 và 0,25 đến từ đâu? Bạn có dùng trực tiếp chúng để cảnh báo trên 500 đặc trưng không?',
    referenceAnswer: `Đó là quy ước trong ngành, xuất phát từ thực hành thẻ điểm tín dụng, không phải kết quả được chứng minh. Quy tắc phổ biến là dưới 0,1 không đáng kể, 0,1 đến 0,25 thay đổi vừa, trên 0,25 thay đổi lớn. Một số nơi dùng ngưỡng khác, như 0,3.

Các nghiên cứu về tính chất thống kê của PSI cho thấy giá trị tới hạn phụ thuộc vào cỡ mẫu và số nhóm. Cùng 0,1 có thể là nhiễu với mẫu nhỏ, nhưng là tín hiệu rõ với mẫu lớn. Cách chia nhóm cũng làm giá trị khác đi.

Với 500 đặc trưng, tôi không dùng trực tiếp, vì hai lý do. Một là nhiều đặc trưng sẽ vượt ngưỡng do ngẫu nhiên hoặc mùa vụ, gây báo động giả. Hai là PSI cao không có nghĩa là có hại, nếu đặc trưng đó không quan trọng.

Thay vào đó, tôi dùng 0,1 và 0,25 làm điểm khởi đầu, rồi hiệu chỉnh theo lịch sử dao động của từng đặc trưng. Tôi cố định nhóm từ tập gốc, ưu tiên các đặc trưng quan trọng và điểm dự đoán. Tôi báo theo nhóm nguồn thay vì từng cột, vì một lỗi nguồn thường kéo theo nhiều cột.`,
    keyPoints: [
      { text: 'Là quy ước trong ngành, không phải định lý', keywords: ['quy ước', 'kinh nghiệm', 'rule of thumb', 'không phải định lý'], weight: 3 },
      { text: 'Giá trị tới hạn phụ thuộc vào cỡ mẫu và số nhóm', keywords: ['cỡ mẫu', 'số nhóm', 'giá trị tới hạn'], weight: 2 },
      { text: 'Nhiều đặc trưng sẽ gây báo động giả', keywords: ['báo động giả', 'nhiều đặc trưng', 'cảnh báo giả'], weight: 2 },
      { text: 'Hiệu chỉnh theo lịch sử, ưu tiên đặc trưng quan trọng', keywords: ['lịch sử', 'hiệu chỉnh', 'đặc trưng quan trọng'], weight: 2 },
    ],
    followUps: ['Nhóm có tỷ lệ bằng 0 thì xử lý thế nào?'],
    commonMistakes: ['Xem các ngưỡng này như một tiêu chuẩn đã được chứng minh.'],
  },
  {
    id: 'iv-dq-drift-01',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-drift'],
    interviewTypes: ['ds', 'de'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Data Drift và Concept Drift khác nhau thế nào? Cho ví dụ và cách phát hiện từng loại.',
    referenceAnswer: `**Data Drift** là phân phối đầu vào \`P(X)\` đổi. Ví dụ, sau một chiến dịch quảng cáo, tỷ lệ khách trẻ tăng từ 30% lên 45%. Quy tắc giữa đầu vào và kết quả có thể vẫn đúng, nhưng mô hình phải làm việc nhiều ở vùng nó ít được học. Phát hiện bằng PSI hoặc KS Test so với dữ liệu huấn luyện. Vì không cần nhãn, ta biết ngay.

**Concept Drift** là quan hệ \`P(Y|X)\` đổi. Cùng một hồ sơ vay, nhưng sau khi lãi suất tăng, tỷ lệ vỡ nợ cao hơn. Đầu vào có thể không đổi gì nên PSI không thấy. Phát hiện bằng cách theo dõi chỉ số mô hình với nhãn mới. Nếu nhãn về trễ thì dùng tín hiệu sớm, như trả chậm lần đầu.

Điểm quan trọng là hậu quả. Data Drift không chắc đã có hại, ví dụ đặc trưng ít quan trọng bị trôi. Concept Drift thường có hại trực tiếp, vì kiến thức của mô hình đã sai.

Ngoài ra, cũng nên loại trừ lỗi pipeline trước khi kết luận đây là drift, và phân biệt với mùa vụ bằng cách so cùng kỳ.`,
    keyPoints: [
      { text: 'Data Drift là P(X) đổi', keywords: ['p x', 'đầu vào', 'covariate', 'phân phối đầu vào'], weight: 3 },
      { text: 'Concept Drift là P(Y|X) đổi', keywords: ['p y x', 'quan hệ', 'cùng đầu vào', 'cùng hồ sơ'], weight: 3 },
      { text: 'Data Drift đo không cần nhãn, Concept Drift cần nhãn', keywords: ['không cần nhãn', 'cần nhãn', 'nhãn mới', 'tín hiệu sớm'], weight: 2 },
      { text: 'Loại trừ lỗi pipeline, mùa vụ', keywords: ['lỗi pipeline', 'mùa vụ', 'cùng kỳ'] },
    ],
    followUps: ['Khi nào có Data Drift mà mô hình không giảm?', 'Label Drift là gì?'],
    commonMistakes: ['Nói PSI phát hiện được cả Concept Drift.'],
  },
  {
    id: 'iv-dq-drift-02',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-drift', 'dq-distribution-comparison', 'etl-lineage'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'PSI của một đặc trưng tăng đột ngột từ 0,02 lên 0,4. Làm sao biết đó là lỗi pipeline hay thay đổi thực tế?',
    referenceAnswer: `Tôi dựa vào hình dạng và phạm vi của thay đổi, rồi tìm nguyên nhân cụ thể.

**Trước hết xem thời điểm và phạm vi.** Thay đổi đột ngột trong một ngày, ngay lúc có triển khai, nghiêng về lỗi. Tôi chia theo nguồn, đối tác, nền tảng, phiên bản app: nếu chỉ một nguồn thay đổi thì gần như chắc chắn là lỗi nguồn.

**Tiếp theo xem bản thân giá trị.** So hai phân phối xem kiểu thay đổi là gì. Nhân lên đúng 1.000 lần gợi ý đổi đơn vị. Tăng đột biến một giá trị như 0 gợi ý giá trị mặc định. Null tăng gợi ý lỗi join. Thay đổi tên nhóm gợi ý đổi mã.

**Rồi lần ngược lineage:** cột được tính từ bảng nào, bảng đó có đổi không, có deployment nào không.

**Cuối cùng xem các cột liên quan và bên ngoài.** Thay đổi thực tế thường làm nhiều đặc trưng cùng dịch chuyển có logic, và khớp với sự kiện như khuyến mãi hay chính sách mới. Tôi cũng so với nguồn độc lập, ví dụ doanh thu kế toán.

Trong lúc điều tra, tôi tạm dừng tự động huấn luyện lại, vì huấn luyện trên dữ liệu lỗi sẽ dạy mô hình học lỗi.`,
    keyPoints: [
      { text: 'Xem thời điểm, đối chiếu với triển khai', keywords: ['đột ngột', 'triển khai', 'deployment', 'thời điểm'], weight: 2 },
      { text: 'Chia theo nguồn, phiên bản', keywords: ['theo nguồn', 'đối tác', 'phiên bản', 'nền tảng'], weight: 3 },
      { text: 'Xem kiểu thay đổi của giá trị', keywords: ['đơn vị', 'giá trị mặc định', 'hình dạng', 'phân phối'], weight: 2 },
      { text: 'Lần ngược lineage', keywords: ['lineage', 'lần ngược', 'bảng nguồn'] },
      { text: 'Tạm dừng huấn luyện lại', keywords: ['dừng huấn luyện', 'không huấn luyện lại', 'tạm dừng'] },
    ],
    followUps: ['Nếu đó là thay đổi thật thì bạn làm gì tiếp theo?'],
    commonMistakes: ['Huấn luyện lại ngay khi PSI vượt ngưỡng.'],
  },
  {
    id: 'iv-dq-drift-03',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-drift', 'dq-label-quality'],
    interviewTypes: ['ds', 'de'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Mô hình dự đoán vỡ nợ chỉ có nhãn sau 90 ngày. Làm sao biết kết luận về dữ liệu và mô hình vẫn còn đúng trong khoảng thời gian đó?',
    referenceAnswer: `Vì chưa có nhãn, tôi không đo trực tiếp được kết quả, nên phải dùng các tín hiệu đi trước, và biết rõ giới hạn của từng tín hiệu.

**Đầu vào:** PSI của các đặc trưng quan trọng và của phân phối điểm dự đoán. Tín hiệu đến ngay, nhưng chỉ thấy Data Drift, và không thấy Concept Drift khi đầu vào không đổi.

**Nhãn tạm:** các sự kiện xảy ra sớm và có tương quan mạnh với nhãn thật, như trễ hạn lần đầu sau 30 ngày. Tôi theo dõi tỷ lệ này theo từng dải điểm. Cùng dải điểm mà tỷ lệ trễ hạn tăng là dấu hiệu của Concept Drift. Tôi kiểm chứng định kỳ xem nhãn tạm có còn tương quan với nhãn thật không.

**Bối cảnh bên ngoài:** chính sách, lãi suất, mùa vụ. Đây là lý do có thể đổi quan hệ mà dữ liệu chưa kịp phản ánh.

**Khi nhãn về:** đánh giá theo từng tháng phát sinh hồ sơ, để so sánh các nhóm đã trưởng thành như nhau, không tính nhóm chưa đủ 90 ngày, vì sẽ làm tỷ lệ vỡ nợ thấp giả tạo.

Cuối cùng, tôi chuẩn bị sẵn phản ứng khi có tín hiệu: siết ngưỡng duyệt hoặc đưa nhóm rủi ro vào xét duyệt thủ công, trong lúc chờ nhãn.`,
    keyPoints: [
      { text: 'Giám sát đầu vào và điểm dự đoán', keywords: ['psi', 'điểm dự đoán', 'đầu vào'], weight: 2 },
      { text: 'Dùng nhãn tạm hoặc tín hiệu sớm', keywords: ['nhãn tạm', 'tín hiệu sớm', 'trễ hạn', 'proxy'], weight: 3 },
      { text: 'Theo dõi theo dải điểm để thấy Concept Drift', keywords: ['dải điểm', 'concept drift'], weight: 2 },
      { text: 'Đánh giá theo nhóm đã trưởng thành', keywords: ['trưởng thành', 'theo tháng', 'vintage', 'đủ 90 ngày'], weight: 2 },
      { text: 'Có kế hoạch phản ứng', keywords: ['siết ngưỡng', 'xét duyệt thủ công', 'phản ứng'] },
    ],
    followUps: ['Nếu nhãn tạm mất tương quan với nhãn thật thì sao?'],
    commonMistakes: ['Tính tỷ lệ vỡ nợ gồm cả hồ sơ chưa đủ thời gian quan sát.'],
  },
  {
    id: 'iv-dq-sufficiency-01',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-sufficiency', 'dq-label-quality'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Làm sao bạn biết đã đủ dữ liệu, và có nên thu thêm hay không?',
    referenceAnswer: `Không có công thức chung, vì lượng dữ liệu cần thiết tùy vào độ khó của bài toán, độ nhiễu và độ phức tạp của mô hình. Nên tôi đo bằng thực nghiệm.

**Bước đầu là Baseline:** so với dự đoán lớp phổ biến, rồi một mô hình đơn giản. Nếu mô hình đơn giản không hơn gì, có thể dữ liệu thiếu tín hiệu. Tôi cũng xáo trộn nhãn để kiểm tra quy trình đánh giá.

**Tiếp theo là Learning Curve:** huấn luyện trên 10%, 25%, 50%, 100% dữ liệu và đo trên một tập đánh giá cố định. Đường còn đi lên thì thu thêm có ích. Đường đã phẳng và gần với kết quả train thì thêm dữ liệu cùng loại không có ích, mà cần đặc trưng hoặc nhãn tốt hơn. Đường phẳng nhưng cách xa train thì cần giảm overfitting.

**Đếm đúng đơn vị:** 1 triệu dòng có 300 ca dương tính thì chỉ có 300 ca để học lớp đó. Một khách hàng với 1.000 dòng cũng không phải 1.000 mẫu độc lập. Tôi đếm theo lớp hiếm và theo nhóm con quan trọng.

Sau cùng, tôi cân nhắc chi phí thu thập so với giá trị của phần cải thiện.`,
    keyPoints: [
      { text: 'Không có công thức chung, đo bằng thực nghiệm', keywords: ['không có công thức', 'thực nghiệm', 'tùy vào'], weight: 2 },
      { text: 'Learning Curve và cách đọc', keywords: ['learning curve', 'đường học', 'đã phẳng', 'đi lên'], weight: 3 },
      { text: 'Baseline để kiểm tra tín hiệu', keywords: ['baseline', 'mô hình đơn giản', 'lớp phổ biến', 'tín hiệu'], weight: 2 },
      { text: 'Đếm mẫu độc lập và lớp hiếm', keywords: ['lớp hiếm', 'độc lập', 'ca dương tính', 'nhóm con'], weight: 2 },
    ],
    followUps: ['Đường đánh giá phẳng nhưng thấp nghĩa là gì?'],
    commonMistakes: ['Dựa vào quy tắc số dòng trên mỗi đặc trưng.', 'Chỉ đếm tổng số dòng.'],
  },
  {
    id: 'iv-dq-datasheets-01',
    topicId: 'dataset-evaluation',
    category: 'dq-measures',
    conceptIds: ['dq-datasheets', 'etl-lineage'],
    interviewTypes: ['ds', 'de'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Datasheets for Datasets là gì? Công ty đã có Data Catalog và Lineage thì có còn cần nó không?',
    referenceAnswer: `Datasheets for Datasets là đề xuất của Gebru và cộng sự: mỗi bộ dữ liệu đi kèm một bộ câu hỏi chuẩn, lấy ý tưởng từ datasheet của linh kiện điện tử. Các nhóm câu hỏi gồm mục đích tạo ra, thành phần, quy trình thu thập, tiền xử lý và gán nhãn, cách dùng, phân phối và bảo trì.

Vẫn cần nó, vì các công cụ kia trả lời những câu hỏi khác. Data Catalog cho biết có bảng nào, ở đâu, ai sở hữu. Lineage cho biết dữ liệu đi từ đâu đến đâu. Cả hai đều tự động được. Datasheet trả lời những điều không thể suy ra từ dữ liệu: vì sao bộ dữ liệu được tạo ra, ai bị loại khi thu thập, người được thu thập có đồng ý cho mục đích này không, và không nên dùng vào việc gì.

Chính những điều đó quyết định tính đại diện và khả năng tuân thủ.

Trong thực tế, tôi không viết cho mọi bảng trung gian, mà chỉ cho bộ dữ liệu dùng chung, dùng cho mô hình hoặc liên quan đến con người. Mỗi datasheet cần có người duy trì, nếu không sẽ lỗi thời, và nó chỉ mô tả chứ không đảm bảo chất lượng.`,
    keyPoints: [
      { text: 'Bộ câu hỏi đi kèm bộ dữ liệu, ý tưởng từ phần cứng', keywords: ['bộ câu hỏi', 'tài liệu', 'gebru', 'linh kiện'], weight: 2 },
      { text: 'Các nhóm nội dung', keywords: ['mục đích', 'thu thập', 'thành phần', 'bảo trì', 'motivation', 'composition'], weight: 2 },
      { text: 'Khác Catalog và Lineage: ghi điều không suy ra được từ dữ liệu', keywords: ['không suy ra', 'không tự động', 'catalog', 'lineage'], weight: 3 },
      { text: 'Chỉ mô tả, không đảm bảo', keywords: ['chỉ mô tả', 'không đảm bảo', 'lỗi thời'] },
    ],
    followUps: ['Ai nên viết datasheet và khi nào?'],
    commonMistakes: ['Xem datasheet giống như từ điển dữ liệu.'],
  },
])
