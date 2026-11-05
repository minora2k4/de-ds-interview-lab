import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-arch-pipeline-design-01',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-pipeline-design'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Một data pipeline tốt cần có những đặc điểm gì? Hãy nêu lý do của từng đặc điểm.',
    referenceAnswer: `Tôi nghĩ đến năm đặc điểm. **Idempotent**: chạy lại nhiều lần vẫn cho cùng kết quả, vì lỗi và retry là điều không tránh được. **Có dữ liệu thô để tính lại**: sửa được bug trong logic mà không phải đọc lại nguồn, vì nguồn có thể đã thay đổi. **Kiểm tra được dữ liệu**: job chạy thành công chưa chắc dữ liệu đúng, nên phải đo số dòng, tỷ lệ null, độ tươi. **Quan sát được**: có log và cảnh báo để phát hiện lỗi trước người dùng. **Không để lộ dữ liệu dở dang**: chỉ công bố khi đã kiểm tra xong.

Ngoài ra, pipeline cần phù hợp với nhu cầu, không xây quá mức. Báo cáo mỗi ngày không cần một hệ thống stream. Chạy theo phụ thuộc thay vì theo giờ cố định cũng giúp tránh đọc phải dữ liệu chưa sẵn sàng.`,
    keyPoints: [
      { text: 'Idempotent để chạy lại an toàn', keywords: ['idempotent', 'idempotency', 'chạy lại'], weight: 2 },
      { text: 'Giữ dữ liệu thô để tính lại', keywords: ['dữ liệu thô', 'raw', 'tính lại'] },
      { text: 'Kiểm tra chất lượng dữ liệu', keywords: ['chất lượng', 'kiểm tra', 'validate', 'null'], weight: 2 },
      { text: 'Giám sát và cảnh báo', keywords: ['giám sát', 'cảnh báo', 'monitoring', 'log'] },
    ],
    followUps: ['Nêu ví dụ một bước không idempotent và cách sửa.'],
    commonMistakes: ['Chỉ liệt kê tên công cụ.', 'Cho rằng nhanh là tiêu chí duy nhất.'],
  },
  {
    id: 'iv-arch-pipeline-design-02',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-pipeline-design', 'etl-idempotency'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao lỗi "chạy lại thì dữ liệu bị trùng" lại phổ biến? Về nguyên lý, phải thiết kế thế nào để loại bỏ nó?',
    referenceAnswer: `Nguyên nhân gốc là **lỗi có thể xảy ra sau khi đã ghi một phần**, và hệ thống không biết chính xác đã ghi đến đâu. Nếu cách ghi là nối thêm dòng, thì chạy lại sẽ thêm cả phần đã có. Với hệ thống phân tán, Task còn có thể được chạy lại tự động, nên đây là chuyện chắc chắn sẽ xảy ra chứ không phải trường hợp hiếm.

Về nguyên lý, cần làm cho **trạng thái cuối chỉ phụ thuộc vào đầu vào, không phụ thuộc số lần chạy**. Có vài cách. Ghi đè nguyên tử theo partition: mỗi lần chạy thay toàn bộ partition của ngày đó. \`MERGE\` theo khóa nghiệp vụ: dòng đã có thì cập nhật. Khử trùng theo mã sự kiện, ở bước Silver chẳng hạn.

Đồng thời, đầu vào phải được cố định: truyền ngày chạy làm tham số thay vì đọc giờ hệ thống. Tôi cũng không chọn cách tắt retry, vì nó chỉ che giấu vấn đề, và người vận hành vẫn sẽ chạy lại bằng tay khi có lỗi.`,
    keyPoints: [
      { text: 'Lỗi xảy ra sau khi đã ghi một phần', keywords: ['ghi một phần', 'giữa chừng', 'đã ghi'], weight: 2 },
      { text: 'Kết quả không phụ thuộc số lần chạy', keywords: ['số lần chạy', 'idempotent', 'cùng kết quả'], weight: 2 },
      { text: 'Ghi đè partition hoặc MERGE', keywords: ['ghi đè', 'overwrite', 'merge', 'upsert'], weight: 2 },
      { text: 'Cố định đầu vào qua tham số', keywords: ['tham số', 'ngày chạy', 'cố định đầu vào'] },
    ],
    followUps: ['MERGE và ghi đè partition, khi nào dùng cách nào?'],
    commonMistakes: ['Đề xuất tắt retry.', 'Thêm DISTINCT ở dashboard thay vì sửa lúc ghi.'],
  },
  {
    id: 'iv-arch-pipeline-design-03',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-pipeline-design', 'arch-batch', 'arch-streaming'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn nhận yêu cầu mơ hồ: "Làm cho tôi một dashboard real-time". Bạn hỏi gì, và câu trả lời sẽ thay đổi thiết kế ra sao?',
    referenceAnswer: `Tôi không bắt đầu từ công cụ, mà làm rõ "real-time" nghĩa là gì với người này.

**Ai xem và xem để làm gì?** Trực vận hành phản ứng theo phút khác với lãnh đạo xem vào họp sáng. Câu hỏi quyết định là: nếu số mới hơn 5 phút thì bạn làm gì khác đi? **Độ trễ chấp nhận được là bao nhiêu?** Vài giây cần stream có state, 5 đến 15 phút có thể dùng micro-batch, 1 giờ thì batch là đủ, và chi phí giữa các mức này khác nhau rất nhiều. **Yêu cầu chính xác đến đâu?** Số vận hành có thể tạm lệch, còn số tiền thì phải đối soát, có thể phải tách số tạm và số chính thức. **Quy mô:** số sự kiện mỗi giây, đỉnh tải, số người dùng đồng thời, vì những điều này quyết định có cần kho OLAP không. **Nếu hệ thống trễ thì sao?** Cần biết có ai bị ảnh hưởng thật không, để đặt SLO và mức trực.

Tôi thường đề xuất làm dần: bản mỗi 15 phút trước, đo xem có ai cần nhanh hơn không, rồi mới đầu tư thêm.`,
    keyPoints: [
      { text: 'Làm rõ real-time với người dùng', keywords: ['làm rõ', 'ai xem', 'nghĩa là gì', 'người dùng'], weight: 2 },
      { text: 'Độ trễ thật sự cần quyết định kiến trúc', keywords: ['độ trễ', 'micro batch', 'micro-batch', 'stream', 'batch'], weight: 2 },
      { text: 'Yêu cầu về độ chính xác', keywords: ['chính xác', 'đối soát', 'số tạm'] },
      { text: 'Ước lượng quy mô', keywords: ['quy mô', 'sự kiện mỗi giây', 'đỉnh tải', 'đồng thời'] },
      { text: 'Làm dần, đo rồi đầu tư', keywords: ['làm dần', 'từng bước', 'đơn giản trước', 'đo'] },
    ],
    followUps: ['Nếu người dùng vẫn khẳng định cần dưới 1 giây thì bạn làm gì?'],
    commonMistakes: ['Vẽ ngay Kafka và Flink mà không hỏi gì.'],
  },
  {
    id: 'iv-arch-monitoring-logging-01',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-monitoring-logging'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Bạn sẽ giám sát một data pipeline như thế nào? Nên đo những gì?',
    referenceAnswer: `Tôi đo theo ba tầng. **Tầng hạ tầng:** CPU, bộ nhớ, đĩa, và với stream là consumer lag. **Tầng job:** thành công hay lỗi, thời gian chạy so với thường lệ, số lần retry. **Tầng dữ liệu:** bảng cập nhật lúc nào, số dòng đọc và ghi, tỷ lệ null, số bản ghi lỗi.

Tầng dữ liệu hay bị bỏ qua nhất, trong khi đó lại là thứ người dùng quan tâm. Job có thể báo thành công nhưng ghi 0 dòng, và chỉ theo dõi trạng thái thì sẽ không biết.

Tôi dùng metric để cảnh báo, và log có cấu trúc với \`run_id\`, partition, số dòng để điều tra. Cảnh báo phải có người nhận và có việc cần làm, nên tôi phân biệt giữa lỗi cần gọi người trực ngay và lỗi chỉ cần tạo ticket. Ví dụ, báo cáo tài chính trễ hạn thì gọi ngay, còn job đã tự phục hồi sau retry thì chỉ ghi nhận.`,
    keyPoints: [
      { text: 'Đo ở tầng hạ tầng và job', keywords: ['hạ tầng', 'cpu', 'thời gian chạy', 'retry'] },
      { text: 'Đo chính dữ liệu: độ tươi, số dòng', keywords: ['độ tươi', 'freshness', 'số dòng', 'null'], weight: 2 },
      { text: 'Job xanh chưa chắc dữ liệu đúng', keywords: ['0 dòng', 'thành công', 'job xanh'], weight: 2 },
      { text: 'Cảnh báo có người nhận và hành động được', keywords: ['người nhận', 'hành động', 'gọi người trực', 'ticket'] },
    ],
    followUps: ['Bạn ghi những trường nào vào log?'],
    commonMistakes: ['Chỉ nói đến CPU và bộ nhớ.'],
  },
  {
    id: 'iv-arch-monitoring-logging-02',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-monitoring-logging', 'arch-reliability'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Đội của bạn đang bị quá tải vì cảnh báo. Bạn làm gì để giảm cảnh báo mà không bỏ sót sự cố?',
    referenceAnswer: `Tôi bắt đầu bằng cách **đo**: thống kê cảnh báo trong một tháng, mỗi cái có cần hành động không, và ai xử lý. Thường thấy phần lớn đến từ vài nguồn.

Sau đó tôi áp dụng vài nguyên tắc. **Cảnh báo theo triệu chứng:** bảng trễ quá hạn thay vì mọi lần retry, vì retry thành công thì không ai bị ảnh hưởng. **Phân tầng:** bảng quan trọng được gọi người trực, bảng ít dùng chỉ tạo ticket. **Gom theo nguyên nhân gốc:** dùng lineage để một nguồn lỗi không sinh ra hàng chục cảnh báo ở các bảng phía sau. **Ngưỡng theo ngữ cảnh:** so với cùng thứ tuần trước, để ngày lễ không kêu vô ích. **Có chủ sở hữu và hướng dẫn xử lý**, nếu không có người nhận thì xóa cảnh báo đó.

Để không bỏ sót, tôi theo dõi hai số: tỷ lệ cảnh báo cần hành động, và số sự cố được người dùng phát hiện trước. Số thứ hai tăng nghĩa là tôi đã giảm quá tay.`,
    keyPoints: [
      { text: 'Thống kê cảnh báo hiện có', keywords: ['thống kê', 'đo', 'nguồn'] },
      { text: 'Cảnh báo theo triệu chứng', keywords: ['triệu chứng', 'người dùng thấy', 'trễ hạn', 'trễ quá hạn'], weight: 2 },
      { text: 'Phân tầng mức nghiêm trọng', keywords: ['phân tầng', 'ticket', 'gọi người trực', 'mức độ'], weight: 2 },
      { text: 'Gom cảnh báo theo nguyên nhân gốc', keywords: ['gom', 'nguyên nhân gốc', 'lineage'] },
      { text: 'Đo sự cố do người dùng phát hiện', keywords: ['người dùng phát hiện', 'bỏ sót', 'tỷ lệ cảnh báo'] },
    ],
    followUps: ['Làm sao đặt ngưỡng cho dữ liệu có chu kỳ theo tuần?'],
    commonMistakes: ['Chỉ đề xuất tăng ngưỡng cho tất cả cảnh báo.'],
  },
  {
    id: 'iv-arch-reliability-01',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-reliability'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn định nghĩa độ tin cậy của một bộ dữ liệu thế nào? SLI, SLO, SLA áp dụng cho dữ liệu ra sao?',
    referenceAnswer: `Độ tin cậy nên được đo ở điều người dùng nhận được, tức dữ liệu **đúng, đủ và đúng hạn**, chứ không phải ở trạng thái job. Job xanh mà số sai thì vẫn là sự cố.

**SLI** là chỉ số đo được, ví dụ thời điểm bảng sẵn sàng, tỷ lệ dòng so với nguồn, tỷ lệ dòng qua kiểm tra chất lượng. **SLO** là mục tiêu, ví dụ sẵn sàng trước 7 giờ trong 95% số ngày, và chênh lệch với nguồn dưới 0,1%. **SLA** là cam kết kèm hệ quả, thường lỏng hơn SLO để còn khoảng đệm.

Tôi không đặt cùng mức cho mọi bảng, vì chi phí tăng rất nhanh khi gần 100%. Tôi phân tầng theo mức ảnh hưởng. 95% trong 30 ngày nghĩa là được trễ khoảng 1,5 ngày, đó là **error budget**. Khi dùng hết phần đó, đội ưu tiên độ tin cậy hơn tính năng mới.

Cũng cần thống nhất trước khi sai và trễ xung đột: báo cáo chốt sổ thì chờ cho đủ, còn báo cáo vận hành thì công bố kèm ghi chú.`,
    keyPoints: [
      { text: 'Đo ở dữ liệu: đúng, đủ, đúng hạn', keywords: ['đúng hạn', 'đầy đủ', 'đúng, đủ', 'người dùng nhận'], weight: 2 },
      { text: 'Phân biệt SLI, SLO, SLA', keywords: ['sli', 'slo', 'sla'], weight: 2 },
      { text: 'Phân tầng, không đặt 100% cho mọi bảng', keywords: ['phân tầng', '100%', 'mức ảnh hưởng'] },
      { text: 'Error budget để ưu tiên công việc', keywords: ['error budget', 'ưu tiên'] },
      { text: 'Thống nhất cách xử lý khi sai và trễ xung đột', keywords: ['xung đột', 'chờ cho đủ', 'ghi chú', 'đánh đổi'] },
    ],
    followUps: ['Bạn đo độ đúng bằng cách nào khi không có giá trị chuẩn?'],
    commonMistakes: ['Đồng nhất độ tin cậy với thời gian hoạt động của cụm.'],
  },
  {
    id: 'iv-arch-reliability-02',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-reliability', 'kafka-exactly-once', 'etl-idempotency'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Exactly-once từ đầu đến cuối có thực sự tồn tại không? Bạn thiết kế thế nào để dữ liệu không trùng và không mất?',
    referenceAnswer: `Ở tầng truyền tin qua mạng, không bên nào biết chắc phía kia đã nhận khi mất phản hồi, nên phải chọn giữa gửi lại, có thể trùng, hoặc không gửi, có thể mất. Điều làm được là **effectively once**: sự kiện có thể được xử lý nhiều lần, nhưng **kết quả cuối cùng** như thể chỉ một lần.

Công thức thường dùng là **at-least-once cộng với idempotent**. Nguồn phải đọc lại được, như Kafka, để không mất. Engine lưu vị trí đọc cùng state qua checkpoint. Đích phải chịu được việc ghi lặp: có giao dịch gắn với checkpoint, hoặc \`MERGE\` theo mã sự kiện.

Tôi phải nêu rõ **phạm vi** của đảm bảo. Exactly-once của Kafka hay Flink chỉ áp dụng trong hệ thống của chúng và các đích có hỗ trợ. Producer gửi lại qua HTTP, hay job gửi email cho khách, thì nằm ngoài phạm vi này.

Cuối cùng là **đối soát**: so sánh số dòng và tổng tiền giữa nguồn và đích theo từng ngày, vì đây là cách duy nhất để biết đảm bảo có thực sự đúng trong thực tế.`,
    keyPoints: [
      { text: 'Chỉ đạt effectively once về kết quả', keywords: ['effectively once', 'kết quả cuối', 'như thể một lần'], weight: 2 },
      { text: 'At-least-once cộng với idempotent', keywords: ['at least once', 'idempotent', 'idempotency'], weight: 2 },
      { text: 'Nguồn đọc lại được, checkpoint, đích có giao dịch', keywords: ['checkpoint', 'đọc lại', 'giao dịch', 'transaction'] },
      { text: 'Nêu rõ phạm vi đảm bảo', keywords: ['phạm vi', 'ngoài phạm vi', 'dịch vụ ngoài'] },
      { text: 'Đối soát nguồn và đích', keywords: ['đối soát', 'so sánh', 'reconcile'] },
    ],
    followUps: ['Cần khử trùng trong cửa sổ bao lâu, và điều đó tốn gì?'],
    commonMistakes: ['Nói bật cấu hình exactly-once của Kafka là xong.'],
  },
  {
    id: 'iv-arch-observability-01',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-observability', 'arch-monitoring-logging'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Phân biệt Monitoring với Observability trong dữ liệu. Nếu đã có monitoring đầy đủ, vì sao còn cần observability?',
    referenceAnswer: `**Monitoring** kiểm tra các điều kiện đã định trước: job có lỗi không, bảng có trễ quá hạn không, số dòng có dưới ngưỡng không. Nó trả lời những câu hỏi đã biết. **Observability** là khả năng hiểu được trạng thái hệ thống từ các tín hiệu nó phát ra, để có thể hỏi những câu chưa nghĩ tới và lần ra nguyên nhân.

Monitoring "đầy đủ" vẫn có giới hạn, vì không thể viết trước mọi kiểu lỗi. Ví dụ, một dịch vụ đổi tên cột làm tỷ lệ null của một cột tăng từ 0,1% lên 18%, trong khi job xanh, số dòng và giờ cập nhật vẫn bình thường. Không có cảnh báo nào được viết cho trường hợp đó.

Observability theo dõi freshness, volume, schema, distribution, so với đường cơ sở đã học, nên bắt được cả những kiểu chưa lường trước. Lineage còn cho biết lỗi bắt đầu từ đâu và ai bị ảnh hưởng. Nó không thay thế Monitoring: cảnh báo về hạn báo cáo vẫn cần, và thực tế hai cách này bổ sung cho nhau.`,
    keyPoints: [
      { text: 'Monitoring cho điều đã biết trước', keywords: ['định trước', 'đã biết', 'ngưỡng', 'known'], weight: 2 },
      { text: 'Observability cho điều chưa lường trước', keywords: ['chưa lường', 'chưa nghĩ', 'unknown', 'câu hỏi mới'], weight: 2 },
      { text: 'Có ví dụ lỗi mà monitoring bỏ sót', keywords: ['job xanh', 'null', 'đổi tên cột', 'vẫn bình thường'] },
      { text: 'Lineage giúp tìm nguyên nhân và ảnh hưởng', keywords: ['lineage', 'nguyên nhân', 'ảnh hưởng'] },
      { text: 'Hai cách bổ sung cho nhau', keywords: ['bổ sung', 'không thay thế'] },
    ],
    followUps: ['Vẫn cần kiểm tra theo luật nghiệp vụ chứ? Vì sao?'],
    commonMistakes: ['Nói Observability chỉ là dashboard đẹp hơn.'],
  },
  {
    id: 'iv-arch-observability-02',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-observability'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Năm trụ cột của Data Observability là gì? Cho một ví dụ lỗi ứng với mỗi trụ cột.',
    referenceAnswer: `Năm trụ cột thường được nhắc đến, do Barr Moses của Monte Carlo phổ biến, là:

**Freshness:** dữ liệu mới đến đâu. Ví dụ, bảng dừng cập nhật từ 2 giờ sáng. **Volume:** số dòng có như thường lệ không. Ví dụ, số dòng giảm 70% vì mất dữ liệu một vùng. **Schema:** cấu trúc có đổi không. Ví dụ, cột bị đổi tên làm câu truy vấn phía sau lỗi. **Distribution:** giá trị có bình thường không. Ví dụ, tỷ lệ null từ 0,1% lên 18%. **Lineage:** dữ liệu từ đâu đến và đi tới đâu. Ví dụ, biết 14 dashboard phụ thuộc vào bảng bị lỗi.

Bốn trụ cột đầu cho biết có gì bất thường, còn lineage cho biết bắt đầu từ đâu và phải báo cho ai. Một số tài liệu gọi distribution là quality, nhưng ý chính là giống nhau.`,
    keyPoints: [
      { text: 'Freshness', keywords: ['freshness', 'độ tươi'] },
      { text: 'Volume', keywords: ['volume', 'số dòng', 'khối lượng'] },
      { text: 'Schema', keywords: ['schema', 'cấu trúc'] },
      { text: 'Distribution', keywords: ['distribution', 'phân phối', 'tỷ lệ null'] },
      { text: 'Lineage', keywords: ['lineage', 'dòng dữ liệu'] },
    ],
    followUps: ['Trụ cột nào rẻ nhất để bắt đầu?'],
    commonMistakes: ['Nhầm với ba trụ cột của observability phần mềm: log, metric, trace.'],
  },
  {
    id: 'iv-arch-observability-03',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-observability', 'etl-lineage'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Giám đốc báo số doanh thu trên dashboard có vẻ sai, trong khi mọi job đều xanh. Bạn điều tra theo các bước nào?',
    referenceAnswer: `Trước tiên tôi **xác nhận và khoanh phạm vi**: sai bao nhiêu, từ ngày nào, ở nhóm nào, ví dụ một vùng hay một kênh. Tôi so sánh với một nguồn độc lập như hệ thống tài chính để biết có thật sự sai không, và báo cho người dùng là đang điều tra.

Sau đó tôi **đi ngược theo lineage** từ dashboard về nguồn, và kiểm tra từng bước: số dòng, tổng doanh thu, độ tươi, tỷ lệ null. Bước đầu tiên có số bất thường chính là nơi lỗi bắt đầu. Cách này nhanh hơn đọc code từ đầu.

Tại chỗ đó, tôi xem **điều gì vừa thay đổi**: lần triển khai mới, schema nguồn đổi, logic join làm nhân dòng hay mất dòng, dữ liệu đến trễ, múi giờ. Các lỗi hay gặp là join làm trùng dòng, đổi đơn vị hoặc tiền tệ, và thiếu một nguồn.

Sau khi tìm ra, tôi sửa, chạy lại các partition bị ảnh hưởng, rồi báo lại cho người dùng. Cuối cùng tôi thêm một kiểm tra để lần sau tự phát hiện được lỗi này trước khi có người hỏi.`,
    keyPoints: [
      { text: 'Khoanh phạm vi và đối chiếu nguồn độc lập', keywords: ['phạm vi', 'khoanh', 'đối chiếu', 'nguồn độc lập'], weight: 2 },
      { text: 'Đi ngược theo lineage', keywords: ['lineage', 'đi ngược', 'từng bước'], weight: 2 },
      { text: 'Xem điều gì vừa thay đổi', keywords: ['thay đổi', 'triển khai', 'schema', 'deploy'] },
      { text: 'Chạy lại phần bị ảnh hưởng và báo người dùng', keywords: ['chạy lại', 'backfill', 'báo'] },
      { text: 'Thêm kiểm tra để phòng lần sau', keywords: ['thêm kiểm tra', 'lần sau', 'phòng'] },
    ],
    followUps: ['Join làm nhân dòng thì phát hiện bằng cách nào?'],
    commonMistakes: ['Chạy lại ngay toàn bộ pipeline khi chưa biết nguyên nhân.'],
  },
])
