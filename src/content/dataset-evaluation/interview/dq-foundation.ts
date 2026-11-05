import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-dq-overview-01',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-overview', 'dq-dimensions', 'dq-representativeness'],
    interviewTypes: ['ds', 'de'],
    levels: ['fresher', 'junior', 'middle', 'senior'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Làm sao biết một bộ dữ liệu là tốt?',
    referenceAnswer: `Tôi không trả lời được câu này nếu chưa biết dữ liệu dùng để làm gì, vì không có dữ liệu tốt tuyệt đối, chỉ có dữ liệu phù hợp với mục đích. Vậy nên tôi bắt đầu bằng câu hỏi: quyết định nào dựa vào dữ liệu này, và sai thì mất gì.

Sau đó tôi xét 4 lớp. **Chất lượng nội tại:** Completeness, Accuracy, Consistency, Validity, Uniqueness, Timeliness. **Tính đại diện:** dữ liệu có phản ánh đúng tổng thể và môi trường dùng thật không, có Selection Bias không. Đây là lỗi mà dữ liệu sạch vẫn có. **Giá trị cho bài toán:** có đủ tín hiệu, đủ số lượng không, nhãn có đáng tin không. Tôi thường thử một baseline đơn giản để kiểm tra. **Vận hành và tuân thủ:** độ tươi, lineage, tài liệu, giấy phép, quyền riêng tư.

Mỗi loại dữ liệu lại có kiểm tra riêng: bảng thì xem khóa và leakage, chuỗi thời gian thì xem khoảng trống và look-ahead bias.

Kết luận của tôi không phải là một điểm số, mà là có điều kiện. Ví dụ bảng cho vay 2 triệu hồ sơ sạch có thể dùng được cho báo cáo, nhưng chưa dùng được cho mô hình duyệt vay nếu chỉ có hồ sơ đã được duyệt.`,
    keyPoints: [
      { text: 'Tốt hay không phụ thuộc vào mục đích sử dụng', keywords: ['mục đích', 'fitness for purpose', 'phù hợp', 'bài toán'], weight: 3 },
      { text: 'Chất lượng nội tại qua các chiều', keywords: ['completeness', 'đầy đủ', 'accuracy', 'chính xác', 'uniqueness', 'validity'], weight: 2 },
      { text: 'Tính đại diện và Selection Bias', keywords: ['đại diện', 'selection bias', 'sai lệch chọn mẫu', 'tổng thể'], weight: 2 },
      { text: 'Đủ tín hiệu, đủ số lượng, nhãn tin cậy', keywords: ['tín hiệu', 'nhãn', 'baseline', 'đủ dữ liệu'], weight: 2 },
      { text: 'Vận hành và tuân thủ', keywords: ['lineage', 'giấy phép', 'quyền riêng tư', 'tài liệu', 'độ tươi', 'pii'] },
      { text: 'Kết luận có điều kiện', keywords: ['có điều kiện', 'dùng được cho'] },
    ],
    followUps: ['Dữ liệu sạch nhưng mô hình kém khi triển khai thì bạn xem gì?', 'Với dữ liệu 10 TB, bạn thực hiện việc này thế nào?'],
    commonMistakes: ['Chỉ liệt kê sáu chiều chất lượng mà không hỏi mục đích.', 'Cho rằng nhiều dữ liệu và ít lỗi là đủ.'],
  },
  {
    id: 'iv-dq-overview-02',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-overview', 'dq-representativeness', 'dq-drift'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Một bộ dữ liệu sạch, mọi luật đều đạt, mô hình đánh giá rất tốt nhưng triển khai thì kém. Bạn điều tra theo thứ tự nào?',
    referenceAnswer: `Luật đạt chỉ nói lớp nội tại ổn, nên tôi tìm ở các lớp mà luật không với tới, theo thứ tự rẻ đến đắt.

Đầu tiên tôi loại lỗi rẻ nhất: **Data Leakage**. Một đặc trưng dùng thông tin sau thời điểm dự đoán làm điểm đánh giá đẹp giả tạo. Dấu hiệu là một đặc trưng có độ quan trọng cao bất thường.

Tiếp theo là **độ lệch giữa huấn luyện và phục vụ**: cùng một đặc trưng nhưng hai đường tính khác nhau. Tôi so phân phối đặc trưng lúc train với lúc serving bằng PSI hoặc KS Test.

Sau đó là **tính đại diện**: dữ liệu train đến từ đâu, bước nào đã loại một nhóm, nhóm nào ở production chưa từng có trong train. Vì tập test chia ngẫu nhiên lệch cùng cách với tập train, nên nó không phát hiện được.

Rồi đến **drift**: dữ liệu cũ có còn đúng không, phân phối đầu vào hay quan hệ với nhãn đã đổi chưa. Cuối cùng là **nhãn**: nhãn lúc đánh giá có giống điều production đo không.

Mỗi giả thuyết tôi đều kiểm tra theo từng nhóm, không nhìn trung bình, vì trung bình che mất nhóm kém.`,
    keyPoints: [
      { text: 'Kiểm tra leakage', keywords: ['leakage', 'rò rỉ', 'thông tin tương lai'], weight: 2 },
      { text: 'Lệch giữa train và serving', keywords: ['training serving', 'train serving', 'skew', 'lúc phục vụ', 'serving'], weight: 2 },
      { text: 'Tính đại diện', keywords: ['đại diện', 'selection bias', 'nhóm bị thiếu'], weight: 2 },
      { text: 'Drift theo thời gian', keywords: ['drift', 'trôi', 'psi'] },
      { text: 'Xem theo từng nhóm', keywords: ['từng nhóm', 'phân khúc', 'segment'] },
    ],
    followUps: ['Bạn phân biệt Data Drift và Concept Drift bằng cách nào?', 'Nếu chưa có nhãn ở production thì sao?'],
    commonMistakes: ['Thêm luật kiểm tra hoặc huấn luyện lại ngay mà chưa tìm nguyên nhân.', 'Chỉ nhìn chỉ số trung bình toàn bộ.'],
  },
  {
    id: 'iv-dq-overview-03',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-overview', 'dq-metrics', 'dq-scale-strategy', 'dq-tools'],
    interviewTypes: ['ds', 'de', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Thiết kế khung đánh giá chất lượng dữ liệu cho một công ty có hàng nghìn bảng và nhiều đội dùng dữ liệu.',
    referenceAnswer: `Ràng buộc chính là không thể kiểm tra mọi thứ với cùng độ sâu, nên tôi bắt đầu bằng **phân hạng**. Bảng hạng 1 phục vụ báo cáo tài chính hoặc mô hình sản xuất, hạng 3 là bảng thử nghiệm. Hạng quyết định mức kiểm tra và SLA, và do người sở hữu bảng khai báo.

**Lớp kiểm tra chung** áp dụng cho mọi bảng và gần như miễn phí: độ tươi, số dòng, thay đổi schema, lấy từ metadata và lịch sử theo Partition. **Lớp kiểm tra riêng** do đội sở hữu viết: khóa, tham chiếu, luật nghiệp vụ, được quản lý cùng code. Luật đắt như quét toàn bộ chỉ dành cho hạng 1.

**Lưu kết quả** theo lần chạy và theo Partition để so với lịch sử, phát hiện bất thường, và tạo scorecard theo đội. **Xử lý khi lỗi** tùy mức độ: chặn pipeline với lỗi nghiêm trọng, cách ly Partition, cảnh báo với lỗi nhẹ. Cảnh báo phải gắn người phụ trách, nếu không sẽ bị lờ đi.

Với dữ liệu cho mô hình, tôi yêu cầu thêm datasheet nêu mục đích, nguồn và giới hạn, vì đại diện và nhãn không tự động được.

Tôi đo khung này bằng thời gian phát hiện sự cố, tỷ lệ cảnh báo giả và số sự cố do người dùng báo trước.`,
    keyPoints: [
      { text: 'Phân hạng bảng theo mức quan trọng', keywords: ['phân hạng', 'hạng', 'tier', 'mức quan trọng'], weight: 2 },
      { text: 'Kiểm tra chung rẻ từ metadata, kiểm tra riêng do đội sở hữu viết', keywords: ['metadata', 'độ tươi', 'số dòng', 'schema'], weight: 2 },
      { text: 'Lưu kết quả theo lịch sử để phát hiện bất thường', keywords: ['lịch sử', 'bất thường', 'anomaly', 'theo partition'], weight: 2 },
      { text: 'Chính sách xử lý khi lỗi: chặn, cách ly, cảnh báo', keywords: ['chặn', 'cách ly', 'quarantine', 'cảnh báo'] },
      { text: 'Có người sở hữu', keywords: ['sở hữu', 'owner', 'người phụ trách'] },
      { text: 'Đo hiệu quả bằng thời gian phát hiện, cảnh báo giả', keywords: ['thời gian phát hiện', 'cảnh báo giả', 'false positive'] },
    ],
    followUps: ['Bạn xử lý cảnh báo giả quá nhiều thế nào?', 'Ai chịu trách nhiệm khi một bảng hạng 1 bị lỗi?'],
    commonMistakes: ['Chọn công cụ trước khi nói về phân hạng và quyền sở hữu.', 'Bắt buộc mọi bảng chạy cùng một bộ kiểm tra đắt tiền.'],
  },
  {
    id: 'iv-dq-dimensions-01',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-dimensions'],
    interviewTypes: ['ds', 'de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Kể tên các chiều chất lượng dữ liệu chính và cách đo từng chiều.',
    referenceAnswer: `Bộ sáu chiều phổ biến là:

**Completeness:** dữ liệu cần có thì có mặt, đo bằng tỷ lệ non-null và số dòng so với kỳ vọng. **Validity:** giá trị đúng định dạng, kiểu và miền, đo bằng tỷ lệ đạt luật. **Accuracy:** giá trị khớp với thực tế, đo bằng cách đối chiếu nguồn tin cậy trên một mẫu. **Consistency:** không mâu thuẫn giữa các cột hoặc các hệ thống, ví dụ tổng doanh thu khớp với kế toán. **Uniqueness:** mỗi thực thể chỉ ghi một lần, đo bằng số dòng so với số khóa khác nhau. **Timeliness:** dữ liệu có mặt đủ sớm, đo bằng độ trễ so với cam kết.

Điều quan trọng là các chiều độc lập với nhau. Một giá trị có thể hợp lệ, đầy đủ, đúng giờ mà vẫn sai. Accuracy là chiều khó đo nhất vì cần một sự thật để so sánh. Ngoài ra mỗi ngưỡng phải gắn với mục đích sử dụng.`,
    keyPoints: [
      { text: 'Nêu đủ các chiều', keywords: ['completeness', 'accuracy', 'consistency', 'validity', 'uniqueness', 'timeliness', 'đầy đủ', 'chính xác', 'nhất quán', 'hợp lệ', 'duy nhất', 'kịp thời'], weight: 3 },
      { text: 'Có cách đo cụ thể', keywords: ['tỷ lệ', 'đối chiếu', 'số dòng', 'non null', 'độ trễ'], weight: 2 },
      { text: 'Accuracy khó đo nhất vì cần sự thật để so sánh', keywords: ['khó đo', 'nguồn tin cậy', 'sự thật', 'thực tế'] },
    ],
    followUps: ['Chiều nào khó tự động hóa nhất?', 'Cột không có null đã là đầy đủ chưa?'],
    commonMistakes: ['Nhầm Validity với Accuracy.', 'Chỉ nói đến tỷ lệ null khi nói về Completeness.'],
  },
  {
    id: 'iv-dq-dimensions-02',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-dimensions', 'dq-sampling'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Validity và Accuracy khác nhau thế nào? Vì sao Accuracy khó đo, và bạn đo nó ra sao?',
    referenceAnswer: `Validity so giá trị với **luật**, Accuracy so giá trị với **thực tế**. Số điện thoại đúng định dạng là hợp lệ, nhưng nếu đó là số của người khác thì không chính xác. Validity là điều kiện cần, chưa đủ.

Accuracy khó đo vì phải có một nguồn sự thật nằm ngoài bộ dữ liệu, mà nguồn đó thường tốn kém hoặc không tồn tại: hóa đơn gốc, giấy tờ, kiểm tra thực địa, gọi cho khách hàng. Không thể chạy trên từng dòng mỗi ngày.

Vì vậy tôi đo trên một mẫu định kỳ. Ví dụ lấy 500 đơn ngẫu nhiên và đối chiếu với hóa đơn. Nếu thấy 5 đơn sai, tỷ lệ lỗi ước lượng là 1%, kèm khoảng tin cậy chứ không phải con số chắc chắn. Mẫu nên phân tầng theo nguồn hoặc giá trị đơn, vì đơn lớn có thể sai rất đắt.

Giữa các lần đo, tôi dùng tín hiệu gián tiếp, ví dụ đối chiếu tổng doanh thu với kế toán. Đó là Consistency, không chứng minh là đúng, nhưng lệch thì chắc chắn có vấn đề.`,
    keyPoints: [
      { text: 'Validity so với luật, Accuracy so với thực tế', keywords: ['luật', 'định dạng', 'thực tế'], weight: 3 },
      { text: 'Accuracy cần nguồn sự thật bên ngoài, tốn kém', keywords: ['nguồn', 'sự thật', 'đối chiếu', 'tốn kém', 'hóa đơn'], weight: 2 },
      { text: 'Đo trên mẫu, có khoảng tin cậy', keywords: ['mẫu', 'lấy mẫu', 'sample', 'khoảng tin cậy'], weight: 2 },
      { text: 'Dùng Consistency làm tín hiệu gián tiếp', keywords: ['consistency', 'nhất quán', 'gián tiếp'] },
    ],
    followUps: ['Nếu không có nguồn sự thật nào thì sao?', 'Mẫu cần lớn cỡ nào?'],
    commonMistakes: ['Nói kiểm tra định dạng là đã kiểm tra độ chính xác.'],
  },
  {
    id: 'iv-dq-dimensions-03',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-dimensions', 'dq-metrics'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn có ít thời gian và một bảng 300 cột mới phải đưa vào sản xuất. Bạn ưu tiên kiểm tra chiều chất lượng nào, trên cột nào?',
    referenceAnswer: `Tôi không kiểm tra đều 300 cột, vì phần lớn không ảnh hưởng đến quyết định. Tôi bắt đầu từ người dùng: báo cáo hay mô hình nào dùng bảng này, cột nào đi vào đó. Thường chỉ còn vài chục cột.

Sau đó tôi áp dụng theo thứ tự rủi ro và chi phí. Mức bảng, gần như miễn phí và hỏng thì ảnh hưởng tất cả: **độ tươi và số dòng** so với kỳ vọng. Tiếp đến là **khóa**: Uniqueness và not null của khóa chính, vì trùng khóa làm sai mọi phép join và tổng. Với cột dùng để join thì kiểm tra tham chiếu, vì khóa không khớp sẽ âm thầm làm mất dòng. Rồi đến **Validity** của các cột đi vào số liệu tiền bạc.

Accuracy để sau, làm trên mẫu với vài cột quan trọng nhất, vì tốn công nhất.

Tôi chạy profile cho toàn bộ 300 cột một lần để phát hiện điều bất ngờ, nhưng không biến nó thành luật. Cột không có người dùng thì chỉ theo dõi thay đổi schema. Sau khi chạy ổn định, tôi mới mở rộng dần theo sự cố thực tế.`,
    keyPoints: [
      { text: 'Bắt đầu từ cột mà người dùng thật sự cần', keywords: ['người dùng', 'cột quan trọng', 'downstream', 'phục vụ'], weight: 3 },
      { text: 'Ưu tiên độ tươi, số dòng, khóa', keywords: ['độ tươi', 'freshness', 'số dòng', 'khóa', 'uniqueness'], weight: 2 },
      { text: 'Accuracy để sau và làm trên mẫu', keywords: ['accuracy', 'chính xác', 'trên mẫu', 'lấy mẫu'] },
      { text: 'Profile một lần cho toàn bộ', keywords: ['profile', 'profiling', 'hồ sơ'] },
    ],
    followUps: ['Bạn đặt ngưỡng cho những luật này thế nào?'],
    commonMistakes: ['Viết luật cho mọi cột, tạo ra nhiều cảnh báo không ai xử lý.'],
  },
  {
    id: 'iv-dq-representativeness-01',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-representativeness'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Selection Bias là gì? Vì sao thêm thật nhiều dữ liệu lại không sửa được nó?',
    referenceAnswer: `Selection Bias xảy ra khi khả năng một đối tượng đi vào dữ liệu phụ thuộc vào chính điều đang nghiên cứu, nên dữ liệu khác với tổng thể mục tiêu. Ví dụ khảo sát hài lòng trong app bỏ sót người đã gỡ app, mà đó lại chính là những người không hài lòng.

Sai số của một ước lượng gồm hai phần. **Phần ngẫu nhiên** do mẫu hữu hạn, giảm theo căn bậc hai của cỡ mẫu. **Phần hệ thống** do cách chọn mẫu, không phụ thuộc cỡ mẫu. Thêm dữ liệu cùng nguồn chỉ giảm phần đầu.

Nguy hiểm hơn, khoảng tin cậy hẹp lại quanh một giá trị sai nên kết quả trông rất chắc chắn. Năm 1936, Literary Digest có khoảng 2,3 triệu phiếu vẫn dự đoán sai người thắng cử, trong khi một mẫu khoảng 50.000 người của Gallup lại đúng.

Cách sửa đúng là đổi cách thu thập để chạm tới nhóm bị thiếu, hoặc thu thêm từ chính nhóm đó, chứ không phải thu thêm từ nguồn cũ. Reweighting giúp được một phần nếu nhóm đó vẫn có mẫu.`,
    keyPoints: [
      { text: 'Khả năng vào dữ liệu phụ thuộc điều đang nghiên cứu', keywords: ['phụ thuộc', 'khác tổng thể', 'nhóm bị thiếu', 'chọn mẫu'], weight: 2 },
      { text: 'Phân biệt sai số ngẫu nhiên và hệ thống', keywords: ['ngẫu nhiên', 'hệ thống', 'systematic'], weight: 3 },
      { text: 'Khoảng tin cậy hẹp quanh giá trị sai', keywords: ['khoảng tin cậy', 'chắc chắn', 'giá trị sai'] },
      { text: 'Sửa bằng cách đổi cách thu thập hoặc gán lại trọng số', keywords: ['đổi cách thu thập', 'thu thêm', 'reweighting', 'trọng số'] },
    ],
    followUps: ['Survivorship Bias liên hệ thế nào?', 'Selection Bias khác Imbalanced Data ra sao?'],
    commonMistakes: ['Nói chỉ cần lấy mẫu ngẫu nhiên từ dữ liệu đang có là hết lệch.'],
  },
  {
    id: 'iv-dq-representativeness-02',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-representativeness', 'dq-distribution-comparison'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Làm sao phát hiện dữ liệu không đại diện khi chính dữ liệu của nhóm bị thiếu lại không có trong tay?',
    referenceAnswer: `Dữ liệu không thể tự báo về thứ nó không có, nên tôi phải tìm bằng chứng ở bên ngoài.

**Quy trình tạo dữ liệu:** tôi vẽ các bước từ thực tế đến bảng cuối cùng, và hỏi mỗi bước loại ai. Bộ lọc đăng nhập, bước duyệt, tính năng chỉ có trên một phiên bản app đều là những chỗ mất dữ liệu. Tôi đếm số lượng trước và sau mỗi bước.

**Nguồn đối chiếu:** so phân phối với số liệu dân số, tổng khách hàng, số liệu tài chính, hoặc log thô ở đầu quy trình. Nếu 40% khách hàng ở nông thôn mà dữ liệu chỉ có 8% thì đã có dấu hiệu rõ.

**Dữ liệu triển khai:** nếu đã chạy thử, so phân phối đặc trưng production với train bằng PSI. Vùng có nhiều mẫu production nhưng gần như không có mẫu train là vùng mô hình đoán mù.

**Thử nghiệm nhỏ:** thu một mẫu ngẫu nhiên có chủ đích, ví dụ duyệt ngẫu nhiên một phần nhỏ hồ sơ để có nhãn cho nhóm chưa từng thấy. Tốn kém nhưng là bằng chứng mạnh nhất.

Nếu vẫn không chứng minh được, tôi ghi rõ giới hạn trong tài liệu: kết quả áp dụng cho nhóm nào.`,
    keyPoints: [
      { text: 'Xem xét quy trình tạo dữ liệu, bước nào loại nhóm nào', keywords: ['quy trình', 'bước', 'sàng lọc', 'lọc'], weight: 3 },
      { text: 'Đối chiếu nguồn bên ngoài', keywords: ['bên ngoài', 'dân số', 'đối chiếu', 'tổng khách hàng'], weight: 2 },
      { text: 'So với dữ liệu production', keywords: ['production', 'triển khai', 'psi'], weight: 2 },
      { text: 'Thu mẫu ngẫu nhiên có chủ đích', keywords: ['thử nghiệm', 'mẫu ngẫu nhiên', 'có chủ đích', 'exploration'] },
      { text: 'Ghi rõ giới hạn của kết luận', keywords: ['giới hạn', 'tài liệu', 'datasheet'] },
    ],
    followUps: ['Nếu không có nguồn đối chiếu nào thì sao?'],
    commonMistakes: ['So train với test rồi kết luận dữ liệu đại diện.'],
  },
  {
    id: 'iv-dq-representativeness-03',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-representativeness', 'dq-label-quality'],
    interviewTypes: ['ds', 'de'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Mô hình duyệt vay chỉ có nhãn trả nợ của người từng được duyệt. Dữ liệu này ảnh hưởng thế nào và bạn xử lý ra sao?',
    referenceAnswer: `Đây là Selection Bias do chính quyết định cũ tạo ra. Nhãn chỉ tồn tại với nhóm đã qua chính sách trước đó, nhưng mô hình mới phải chấm tất cả. Mô hình có thể đánh giá sai nhóm từng bị từ chối, nhất là khi một đặc điểm từng được dùng để từ chối gần như không bao giờ xuất hiện trong dữ liệu có nhãn.

Tôi đo mức độ trước: tỷ lệ duyệt, phân phối đặc trưng giữa nhóm duyệt và nhóm từ chối bằng PSI, và vùng mà hồ sơ duyệt rất ít.

Cách xử lý từ mạnh đến yếu. **Thu nhãn có chủ đích:** duyệt ngẫu nhiên một phần nhỏ, có hạn mức rủi ro. Đây là cách duy nhất có nhãn thật, nhưng tốn tiền và cần chấp thuận. **Reject Inference:** suy luận nhãn của nhóm bị từ chối từ mô hình hoặc nguồn ngoài như dữ liệu tín dụng từ tổ chức khác. Cách này dựa vào giả định khó kiểm chứng. **Reweighting** theo xác suất được duyệt, chỉ có tác dụng khi hai nhóm có vùng chồng lấn.

Khi triển khai, tôi không bật hoàn toàn mà thử nghiệm trên một phần nhỏ và theo dõi tỷ lệ vỡ nợ theo từng nhóm. Tôi cũng ghi rõ giới hạn trong tài liệu.`,
    keyPoints: [
      { text: 'Nhãn chỉ có ở nhóm đã được duyệt, là Selection Bias', keywords: ['selection bias', 'chỉ có nhãn', 'được duyệt', 'bị từ chối'], weight: 3 },
      { text: 'Thu nhãn bằng cách duyệt ngẫu nhiên một phần nhỏ', keywords: ['ngẫu nhiên', 'thử nghiệm', 'exploration', 'có chủ đích'], weight: 2 },
      { text: 'Reject Inference và giới hạn của nó', keywords: ['reject inference', 'suy luận nhãn'], weight: 2 },
      { text: 'Reweighting khi có vùng chồng lấn', keywords: ['reweighting', 'trọng số', 'chồng lấn'] },
      { text: 'Triển khai dần và theo dõi theo nhóm', keywords: ['triển khai dần', 'theo nhóm', 'theo dõi'] },
    ],
    followUps: ['Vì sao thử nghiệm ngẫu nhiên khó được chấp thuận trong tín dụng?'],
    commonMistakes: ['Xem tất cả hồ sơ bị từ chối là khách hàng xấu.'],
  },
  {
    id: 'iv-dq-label-quality-01',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-label-quality'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: "Bạn đánh giá chất lượng nhãn thế nào? Cohen's Kappa giải quyết vấn đề gì mà tỷ lệ đồng ý thô không giải quyết được?",
    referenceAnswer: `Nhãn đặt giới hạn trên cho mọi đánh giá, nên tôi đo nó trước khi tin vào điểm của mô hình.

Tỷ lệ đồng ý thô bị thổi cao bởi trùng hợp. Nếu 90% mẫu là âm tính, hai người gán theo đúng tỷ lệ đó vẫn đồng ý khoảng 82% dù không hề nhìn dữ liệu. Cohen's Kappa trừ đi phần này: \`kappa = (po - pe) / (1 - pe)\`. Đồng ý 92% với pe bằng 0,82 cho Kappa chỉ khoảng 0,56.

Kappa cũng có giới hạn: nó phụ thuộc vào tỷ lệ lớp, nên khó so sánh giữa hai bộ dữ liệu, và các mốc đánh giá chỉ là quy ước. Nó chỉ đo mức đồng thuận, không đo độ đúng.

Quy trình của tôi: viết hướng dẫn có ví dụ biên, cho hai người gán chung một mẫu, xem những ca bất đồng để sửa hướng dẫn, dùng gold set để kiểm tra độ đúng, rồi dùng Confident Learning để xếp hạng các nhãn nghi ngờ và cho người kiểm tra lại, thay vì xóa tự động. Tôi đặc biệt kiểm tra nhãn tập test, vì nếu nhãn test sai thì so sánh mô hình cũng sai.`,
    keyPoints: [
      { text: 'Tỷ lệ đồng ý thô bị thổi cao do trùng hợp khi lệch lớp', keywords: ['trùng hợp', 'ngẫu nhiên', 'lệch lớp', 'đồng ý ngẫu nhiên'], weight: 3 },
      { text: 'Công thức Kappa', keywords: ['po', 'pe', 'kappa'], weight: 2 },
      { text: 'Kappa chỉ đo đồng thuận, phụ thuộc tỷ lệ lớp', keywords: ['đồng thuận', 'tỷ lệ lớp', 'không đo độ đúng'], weight: 2 },
      { text: 'Gold set, hướng dẫn, Confident Learning', keywords: ['gold set', 'hướng dẫn', 'confident learning', 'cleanlab'] },
    ],
    followUps: ['Vì sao nhãn test sai lại nguy hiểm hơn nhãn train sai?', 'Nhãn suy từ hành vi người dùng có vấn đề gì?'],
    commonMistakes: ['Dùng một ngưỡng Kappa cố định cho mọi bài toán.', 'Tự động xóa mọi mẫu mô hình nghi ngờ.'],
  },
  {
    id: 'iv-dq-profiling-01',
    topicId: 'dataset-evaluation',
    category: 'dq-foundation',
    conceptIds: ['dq-profiling', 'dq-dimensions'],
    interviewTypes: ['ds', 'de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Bạn nhận một bảng mới không có tài liệu. Bạn làm gì đầu tiên để hiểu và đánh giá nó?',
    referenceAnswer: `Tôi lập hồ sơ dữ liệu, tức Data Profiling, trước khi viết bất kỳ luật nào, vì schema và lời mô tả thường không khớp với dữ liệu thực tế.

Với từng cột, tôi xem tỷ lệ null, số giá trị khác nhau, min, max, độ dài, phân vị, top giá trị và mẫu định dạng. Những điểm cần tìm là cột gần như hằng số, giá trị thiếu đội lốt như \`1900-01-01\` hoặc \`N/A\`, và một giá trị được viết theo nhiều cách.

Tiếp theo tôi tìm khóa: cột hoặc tổ hợp cột nào có số giá trị khác nhau bằng số dòng. Sau đó xem bảng này tham chiếu tới đâu, ví dụ \`customer_id\` có nằm trong bảng \`customers\` không. Nếu có cột thời gian, tôi vẽ số dòng theo ngày để thấy khoảng trống và đột biến.

Cuối cùng tôi đem những gì thấy đi hỏi người sở hữu dữ liệu, vì profile chỉ mô tả, không tự nói đúng sai. Sau đó tôi mới chuyển kết quả thành luật kiểm tra và giữ profile làm mốc so sánh.`,
    keyPoints: [
      { text: 'Lập hồ sơ dữ liệu trước khi viết luật', keywords: ['profiling', 'hồ sơ', 'profile', 'thống kê mô tả'], weight: 3 },
      { text: 'Thống kê cột: null, distinct, min, max', keywords: ['null', 'distinct', 'giá trị khác nhau', 'min', 'max', 'top'], weight: 2 },
      { text: 'Tìm khóa và quan hệ', keywords: ['khóa', 'tham chiếu', 'join'] },
      { text: 'Xem số dòng theo thời gian', keywords: ['theo ngày', 'theo thời gian', 'khoảng trống'] },
      { text: 'Hỏi người sở hữu dữ liệu', keywords: ['người sở hữu', 'nghiệp vụ', 'owner'] },
    ],
    followUps: ['Làm thế nào nếu bảng quá lớn để profile đầy đủ?'],
    commonMistakes: ['Chỉ đọc schema rồi tin vào đó.', 'Biến mọi đặc điểm của profile thành luật cứng.'],
  },
])
