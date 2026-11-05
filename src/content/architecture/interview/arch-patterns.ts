import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-arch-lambda-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-lambda', 'arch-kappa'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Lambda Architecture là gì? Ai đề xuất và nó giải quyết vấn đề gì?',
    referenceAnswer: `Lambda Architecture do Nathan Marz, tác giả Apache Storm, mô tả trong bài "How to beat the CAP theorem" năm 2011, và trình bày đầy đủ trong sách *Big Data* năm 2015.

Vấn đề là lúc đó batch như MapReduce tính đúng nhưng trễ hàng giờ, còn stream cho kết quả nhanh nhưng khó tin cậy và khó sửa khi code sai. Lambda dùng cả hai: **Batch Layer** tính lại toàn bộ từ dữ liệu gốc bất biến, **Speed Layer** tính gia tăng phần dữ liệu mới, **Serving Layer** phục vụ kết quả batch, và truy vấn gộp hai view.

Khi batch view mới xong, phần tương ứng ở Speed Layer bị bỏ, nên sai sót của Speed Layer chỉ là tạm thời. Đổi lại, cùng một logic phải được viết và vận hành ở hai hệ thống.`,
    keyPoints: [
      { text: 'Do Nathan Marz đề xuất', keywords: ['nathan marz', 'marz'], weight: 2 },
      { text: 'Ba lớp: Batch, Speed, Serving', keywords: ['batch layer', 'speed layer', 'serving layer', 'ba lớp'], weight: 2 },
      { text: 'Vừa có kết quả nhanh vừa có kết quả đúng', keywords: ['nhanh', 'chính xác', 'độ trễ thấp', 'đúng'] },
      { text: 'Nhược điểm là duy trì hai bộ code', keywords: ['hai bộ code', 'hai nơi', 'hai hệ thống', 'trùng lặp'] },
    ],
    followUps: ['Vì sao gộp hai view lại cần biết mốc cắt?', 'Kappa thay đổi điều gì so với Lambda?'],
    commonMistakes: ['Nhầm Lambda Architecture với AWS Lambda.', 'Nói Speed Layer thay thế Batch Layer.'],
  },
  {
    id: 'iv-arch-lambda-02',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-lambda', 'cloud-cap'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bài viết gốc của Lambda có tên là "How to beat the CAP theorem". Lambda có thật sự đánh bại CAP không? Điều gì mới là ý tưởng cốt lõi?',
    referenceAnswer: `Không. Marz nói rõ không ai tránh được CAP, và khi có phân vùng mạng hệ thống vẫn phải chọn giữa nhất quán và sẵn sàng. Kreps cũng nhận xét rằng CAP vẫn còn nguyên.

Ý tưởng cốt lõi nằm ở **nguyên nhân của độ phức tạp**. Theo Marz, thứ khó không phải bản thân CAP, mà là **trạng thái thay đổi được kết hợp với thuật toán gia tăng**. Khi dữ liệu bất biến, các bản sao không thể mâu thuẫn theo cách khó hòa giải, và không cần sửa dòng cũ.

Lambda đẩy phần khó vào Speed Layer, và Speed Layer chỉ giữ vài giờ dữ liệu. Batch Layer đơn giản hơn nhiều vì nó chỉ là một hàm trên toàn bộ dữ liệu. Nếu Speed Layer sai, batch tiếp theo sẽ thay thế kết quả đó. Do đó, cái được không phải là vượt qua một định lý, mà là **giới hạn hậu quả của độ phức tạp** và chịu được lỗi của con người.`,
    keyPoints: [
      { text: 'Không phá vỡ CAP', keywords: ['không phá', 'không đánh bại', 'vẫn phải chọn', 'vẫn còn', 'không tránh'], weight: 2 },
      { text: 'Độ phức tạp đến từ trạng thái thay đổi và tính gia tăng', keywords: ['trạng thái thay đổi', 'mutable', 'gia tăng', 'incremental'], weight: 2 },
      { text: 'Cô lập phần phức tạp vào lớp tạm thời', keywords: ['cô lập', 'tạm thời', 'speed layer'] },
      { text: 'Dữ liệu bất biến giúp chịu lỗi của con người', keywords: ['bất biến', 'immutable', 'lỗi của con người', 'tính lại'] },
    ],
    followUps: ['Tại sao dữ liệu bất biến làm việc nhân bản đơn giản hơn?'],
    commonMistakes: ['Trả lời rằng Lambda đạt được đồng thời cả C, A và P.'],
  },
  {
    id: 'iv-arch-lambda-03',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-lambda', 'arch-kappa'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Trong thực tế, những khó khăn nào khiến một hệ thống Lambda đắt đỏ? Bạn giảm chúng thế nào nếu buộc phải giữ kiến trúc này?',
    referenceAnswer: `Khó khăn lớn nhất là **logic bị lệch**. Hai bộ code viết cho hai framework khác nhau sẽ dần cho số khác nhau, và người dùng thấy số nhảy khi batch ghi đè. Tiếp theo là **chi phí vận hành**: hai hệ thống để trực, hai loại lỗi để gỡ, mỗi lần đổi định nghĩa phải triển khai hai nơi. Cuối cùng là **lỗi ở chỗ gộp**, như lệch mốc cắt làm đếm trùng.

Nếu phải giữ, tôi làm như sau. Đưa logic nghiệp vụ dùng chung vào một thư viện hoặc dùng engine như Spark cho cả hai nhánh. Điều này giảm phần code, nhưng như Kreps nói, không xóa được gánh nặng vận hành. Thêm **đo độ lệch** liên tục giữa hai view và cảnh báo khi vượt ngưỡng. Ghi rõ mốc cắt trong metadata của batch view. Quy định rõ **số nào là chính thức**, ví dụ thanh toán chỉ dùng batch. Và thu hẹp phạm vi: chỉ những chỉ số thật sự cần tức thời mới đi qua Speed Layer.`,
    keyPoints: [
      { text: 'Logic hai nhánh bị lệch', keywords: ['lệch', 'khác nhau', 'hai bộ code'], weight: 2 },
      { text: 'Chi phí vận hành hai hệ thống', keywords: ['vận hành', 'hai hệ thống', 'gỡ lỗi'] },
      { text: 'Dùng chung logic nhưng không hết gánh nặng', keywords: ['thư viện', 'dùng chung', 'engine', 'summingbird'] },
      { text: 'Đo độ lệch giữa hai view', keywords: ['đo độ lệch', 'đối soát', 'so sánh', 'reconcile'], weight: 2 },
      { text: 'Quy định số chính thức và thu hẹp phạm vi', keywords: ['chính thức', 'thu hẹp', 'chỉ những'] },
    ],
    followUps: ['Khi nào bạn quyết định bỏ hẳn Speed Layer?'],
    commonMistakes: ['Cho rằng chỉ cần dùng chung ngôn ngữ lập trình là hết vấn đề.'],
  },
  {
    id: 'iv-arch-kappa-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-kappa', 'arch-lambda'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Kappa Architecture là gì và khác Lambda ở đâu? Ai đề xuất và vì sao?',
    referenceAnswer: `Kappa được Jay Kreps, đồng sáng tạo Kafka, nêu trong bài "Questioning the Lambda Architecture" năm 2014. Kappa bỏ nhánh batch: mọi xử lý là stream trên một log bất biến. Muốn tính lại thì chạy một job mới, đọc lại log từ đầu.

Kreps đồng ý với hai nguyên tắc của Marz là dữ liệu bất biến và có thể tính lại. Điều ông phản đối là phải duy trì một logic để nó cho cùng kết quả trên hai hệ thống phân tán phức tạp. Ông cũng cho rằng stream không vốn dĩ kém chính xác hơn batch, đó chỉ là giới hạn của framework lúc bấy giờ.

Khác biệt về thực tế: Kappa chỉ có một bộ code nên không lệch logic, nhưng phải giữ log lâu, và phát lại có thể rất chậm với lịch sử dài. Lambda tính lại lịch sử dài dễ hơn, đổi lại phải vận hành hai hệ thống.`,
    keyPoints: [
      { text: 'Do Jay Kreps đề xuất năm 2014', keywords: ['jay kreps', 'kreps'], weight: 2 },
      { text: 'Bỏ nhánh batch, chỉ có stream', keywords: ['bỏ batch', 'bỏ nhánh batch', 'chỉ có stream', 'một đường', 'chỉ dùng stream'], weight: 2 },
      { text: 'Tính lại bằng cách phát lại log', keywords: ['phát lại', 'replay', 'đọc lại'], weight: 2 },
      { text: 'Đánh đổi: giữ log lâu, phát lại chậm', keywords: ['retention', 'giữ log', 'phát lại chậm', 'chậm'] },
    ],
    followUps: ['Nếu log chỉ giữ 7 ngày thì tính lại 30 ngày thế nào?'],
    commonMistakes: ['Nói Kappa không cần tính lại.', 'Nói Kappa do Nathan Marz đề xuất.'],
  },
  {
    id: 'iv-arch-kappa-02',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-kappa', 'kafka-retention'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Trình bày từng bước cách tính lại kết quả trong Kappa khi logic thay đổi. Mỗi bước để làm gì?',
    referenceAnswer: `Giả sử log được giữ đủ lâu, ví dụ retention 30 ngày nếu muốn tính lại 30 ngày.

Đầu tiên, tôi chạy **job thứ hai** với code mới, đọc từ đầu log, và ghi vào **bảng mới**. Log cho phép nhiều người đọc độc lập nên việc này không ảnh hưởng tới job đang chạy. Ghi bảng mới vì người dùng vẫn cần đọc bảng cũ khi bảng mới còn dở dang.

Tôi tăng parallelism cho job này để đuổi kịp nhanh, vì tốc độ đuổi bằng tốc độ xử lý trừ đi tốc độ dữ liệu đến. Khi đã bắt kịp, tôi **so sánh hai bảng** để xác nhận khác biệt đúng như dự kiến.

Sau đó chuyển ứng dụng sang bảng mới, rồi dừng job cũ và xóa bảng cũ. Tôi thường giữ thêm một thời gian ngắn để có thể quay lại ngay nếu có lỗi. Trong lúc phát lại, tôi phải tắt các hiệu ứng phụ như gửi thông báo, và giám sát tải lên Kafka vì đọc dữ liệu cũ có thể ảnh hưởng tới các consumer khác.`,
    keyPoints: [
      { text: 'Chạy job thứ hai đọc từ đầu log', keywords: ['job thứ hai', 'job mới', 'đọc từ đầu', 'phát lại'], weight: 2 },
      { text: 'Ghi ra bảng mới, không ghi đè', keywords: ['bảng mới', 'không ghi đè', 'output mới'], weight: 2 },
      { text: 'Bắt kịp rồi chuyển ứng dụng', keywords: ['bắt kịp', 'chuyển', 'đuổi kịp'] },
      { text: 'Dừng job cũ và xóa bảng cũ', keywords: ['dừng job cũ', 'xóa bảng cũ'] },
      { text: 'Tắt hiệu ứng phụ hoặc kiểm soát tải', keywords: ['hiệu ứng phụ', 'side effect', 'tải'] },
    ],
    followUps: ['Vì sao phải tắt hiệu ứng phụ khi phát lại?', 'Có thể gộp hai bảng đầu ra thay vì giữ hai bảng không?'],
    commonMistakes: ['Dừng job cũ trước khi job mới bắt kịp.', 'Ghi đè trực tiếp vào bảng đang phục vụ.'],
  },
  {
    id: 'iv-arch-kappa-03',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-kappa', 'arch-lambda', 'arch-batch'],
    interviewTypes: ['de', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Bạn dựa vào đâu để chọn giữa Lambda, Kappa và chỉ dùng batch? Vì sao câu trả lời "Kappa hiện đại hơn" là chưa đủ?',
    referenceAnswer: `Không có kiến trúc tốt nhất nói chung, mà có câu hỏi cần trả lời. Một, **độ tươi có đổi được quyết định không?** Nếu không, chỉ cần batch, vì đó là cách đơn giản và rẻ nhất. Hai, **logic có làm được bằng stream không?** Cộng dồn và cửa sổ thì dễ, còn logic nhìn toàn bộ lịch sử hoặc đối soát với tệp đến theo ngày thì khó. Ba, **phải tính lại xa đến đâu?** Tính thử thời gian phát lại: số sự kiện chia cho tốc độ đuổi. Nếu mất hàng tuần thì Kappa thuần túy không đáp ứng được. Bốn, **đội có vận hành nổi không?** Stream cần trực 24/7 và hiểu về state.

"Kappa hiện đại hơn" chưa đủ vì nó bỏ qua các chi phí này. Kappa đổi việc duy trì hai bộ code lấy chi phí giữ log, state và phát lại. Trên thực tế tôi hay dùng cách lai: stream cho số tạm, batch cho số chính thức, cùng đọc từ một log, và chỉ có một bên được coi là sự thật. Quan trọng là chỉ thêm độ phức tạp khi có nhu cầu đo được.`,
    keyPoints: [
      { text: 'Bắt đầu từ độ tươi cần thiết', keywords: ['độ tươi', 'độ trễ', 'quyết định'], weight: 2 },
      { text: 'Xét logic có phù hợp với stream', keywords: ['logic', 'toàn bộ lịch sử', 'cửa sổ'] },
      { text: 'Tính thời gian phát lại', keywords: ['thời gian phát lại', 'phát lại', 'tính lại'], weight: 2 },
      { text: 'Năng lực vận hành của đội', keywords: ['vận hành', 'trực', 'năng lực'] },
      { text: 'Cách lai với một nguồn sự thật', keywords: ['lai', 'hybrid', 'nguồn sự thật', 'chính thức'] },
    ],
    followUps: ['Ước lượng thời gian phát lại khi có 20.000 sự kiện mỗi giây và cần tính lại 90 ngày.'],
    commonMistakes: ['Chọn kiến trúc theo xu hướng, không dựa trên yêu cầu.', 'Không nhắc đến chi phí vận hành.'],
  },
  {
    id: 'iv-arch-batch-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-batch', 'arch-streaming'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Stream rất phổ biến, vậy vì sao nhiều hệ thống vẫn chọn batch? Khi nào batch là lựa chọn đúng?',
    referenceAnswer: `Vì batch đơn giản hơn và độ tươi cao hơn thường không đổi được quyết định.

Với batch, dữ liệu đầu vào có giới hạn và không đổi trong lúc chạy, nên kết quả dễ tái lập và dễ kiểm tra. Sai thì chỉ cần ghi đè lại partition đó. Stream phải lo sự kiện đến trễ, sai thứ tự, giữ state và phải chạy cả ngày lẫn đêm, nên tốn công hơn nhiều. Máy chạy batch có thể tắt khi xong việc nên chi phí cũng thấp hơn.

Batch đúng khi người dùng ra quyết định theo ngày hoặc theo giờ, như báo cáo doanh thu, hoặc khi logic cần đủ dữ liệu của cả kỳ, như chốt sổ hay đối soát. Tôi hay hỏi: nếu số mới hơn 5 phút thì bạn sẽ làm gì khác đi? Nếu câu trả lời là không có gì, tôi chọn batch, và có thể rút chu kỳ về theo giờ nếu sau này cần.`,
    keyPoints: [
      { text: 'Batch đơn giản, dễ tái lập, dễ chạy lại', keywords: ['đơn giản', 'tái lập', 'chạy lại', 'ghi đè'], weight: 2 },
      { text: 'Stream phức tạp hơn vì dữ liệu trễ và state', keywords: ['trễ', 'state', 'sai thứ tự', 'phức tạp'] },
      { text: 'Chi phí thấp hơn', keywords: ['chi phí', 'rẻ', 'tắt máy'] },
      { text: 'Hợp khi quyết định không cần số tức thời', keywords: ['theo ngày', 'theo giờ', 'báo cáo', 'chốt sổ', 'độ tươi'], weight: 2 },
    ],
    followUps: ['Nếu cần số mỗi 15 phút thì bạn dùng gì?'],
    commonMistakes: ['Cho rằng batch là công nghệ cũ cần phải thay.'],
  },
  {
    id: 'iv-arch-streaming-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-streaming', 'etl-stream'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Event time, processing time và watermark là gì? Vì sao hệ thống stream cần chúng?',
    referenceAnswer: `**Event time** là lúc sự việc xảy ra. **Processing time** là lúc hệ thống xử lý nó. Hai mốc này lệch nhau vì mạng trễ, thiết bị mất kết nối, hoặc job dừng rồi đọc tiếp.

Nếu tính theo processing time, đơn hàng lúc 23:59 đến lúc 00:01 sẽ bị tính nhầm vào ngày hôm sau. Phát lại log cũng cho kết quả sai, vì mọi sự kiện đều bị xem như vừa xảy ra. Vì vậy các phép tính nghiệp vụ nên theo event time.

Nhưng stream không có điểm kết thúc, nên engine không biết bao giờ đã nhận đủ sự kiện của một khung thời gian. **Watermark** giải quyết điều này: nó ước lượng rằng event time đã đi đến mốc nào, để có thể đóng cửa sổ và giải phóng state. Đây chỉ là ước lượng, vì sự kiện vẫn có thể đến sau nó. Đặt chặt thì nhanh mà dễ thiếu, đặt lỏng thì đủ hơn mà trễ hơn.`,
    keyPoints: [
      { text: 'Phân biệt event time với processing time', keywords: ['event time', 'processing time', 'lúc xảy ra'], weight: 2 },
      { text: 'Sự kiện có thể đến trễ, sai thứ tự', keywords: ['đến trễ', 'sai thứ tự', 'lệch'] },
      { text: 'Watermark quyết định khi nào đóng cửa sổ', keywords: ['watermark', 'đóng cửa sổ'], weight: 2 },
      { text: 'Đánh đổi giữa độ tươi và độ đầy đủ', keywords: ['đánh đổi', 'chặt', 'lỏng', 'đầy đủ'] },
    ],
    followUps: ['Sự kiện đến sau watermark thì xử lý thế nào?', 'Một partition không có dữ liệu ảnh hưởng gì tới watermark?'],
    commonMistakes: ['Nghĩ rằng watermark bảo đảm không còn dữ liệu trễ.'],
  },
  {
    id: 'iv-arch-lakehouse-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-lakehouse', 'dw-data-lakehouse', 'dw-medallion'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Vẽ kiến trúc tổng thể của một nền tảng dữ liệu theo Lakehouse. Thành phần nào hay bị bỏ quên?',
    referenceAnswer: `Tôi trình bày theo dòng chảy. Dữ liệu đi vào từ batch, CDC và stream, rồi được ghi vào **bảng định dạng mở** như Iceberg hoặc Delta trên object storage. Dữ liệu được tổ chức theo Medallion: Bronze giữ thô để tính lại, Silver làm sạch và chuẩn hóa, Gold phục vụ nghiệp vụ. Spark hoặc Flink lo phần biến đổi. BI và SQL dùng Gold qua Trino hoặc kho, còn Data Science thường đọc Silver.

Hai thành phần hay bị bỏ quên. Một là **catalog và phân quyền**: nếu không có một nơi thống nhất, mỗi engine tự hiểu quyền theo cách riêng và dễ lộ dữ liệu. Hai là **bảo trì**: gộp tệp nhỏ, hết hạn snapshot, dọn tệp mồ côi. Object storage không tự làm những việc này, và thiếu chúng thì truy vấn chậm dần và chi phí tăng.

Ngoài ra, dashboard cần phản hồi dưới một giây vẫn có thể cần thêm tầng phục vụ như kho OLAP, và điều đó không làm kiến trúc bị sai.`,
    keyPoints: [
      { text: 'Bảng định dạng mở trên object storage', keywords: ['iceberg', 'delta', 'hudi', 'object storage', 'định dạng mở'], weight: 2 },
      { text: 'Các lớp Bronze, Silver, Gold', keywords: ['bronze', 'silver', 'gold', 'medallion'] },
      { text: 'Catalog và phân quyền', keywords: ['catalog', 'phân quyền', 'quản trị'], weight: 2 },
      { text: 'Bảo trì: gộp tệp, snapshot', keywords: ['gộp tệp', 'compaction', 'snapshot', 'bảo trì'], weight: 2 },
    ],
    followUps: ['Vì sao Data Science thường đọc Silver thay vì Gold?', 'Khi nào cần tầng phục vụ riêng?'],
    commonMistakes: ['Chỉ nói về định dạng bảng, không nói được về toàn bộ nền tảng.'],
  },
])
