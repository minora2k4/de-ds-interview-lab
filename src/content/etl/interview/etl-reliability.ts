import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-etl-transformation-01',
    topicId: 'etl',
    category: 'etl-reliability',
    conceptIds: ['etl-transformation', 'etl-validation'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Sau khi thêm một phép nối, tổng doanh thu tăng 9% mà job vẫn thành công. Bạn tìm nguyên nhân thế nào và ngăn nó lặp lại ra sao?',
    referenceAnswer: `Tôi nghi ngay đến nhân dòng do sai grain. Trong bảng bên phải, khóa nối có thể không duy nhất. Ví dụ một đơn hàng có nhiều lần thanh toán, nối xong thì đơn đó lặp lại, và phép cộng doanh thu bị thổi phồng. Database không báo lỗi vì đây là truy vấn hợp lệ.

Để xác nhận, tôi so số dòng trước và sau nối, rồi đếm khóa nối ở bảng bên phải để xem khóa nào xuất hiện nhiều lần. Tôi lấy thử một khóa để xem cụ thể. Nếu số dòng tăng khoảng 9%, gần như đúng là nguyên nhân này.

Cách sửa là đưa bảng bên phải về đúng grain trước khi nối, ví dụ tổng hợp thanh toán theo đơn. Nếu cần từng lần thanh toán thì đó là một bảng fact khác có grain khác, không nên gộp chung.

Để ngăn lặp lại, tôi thêm test \`unique\` trên khóa của bảng đầu ra, và kiểm tra tổng doanh thu trước và sau biến đổi. Mỗi mô hình phải ghi rõ grain trong tài liệu. Khi review code, phép nối mới cần trả lời được câu hỏi khóa có duy nhất không.`,
    keyPoints: [
      { text: 'Nhân dòng do khóa nối không duy nhất', keywords: ['nhân dòng', 'không duy nhất', 'lặp lại', 'fan out'], weight: 2 },
      { text: 'Khái niệm grain', keywords: ['grain', 'độ chi tiết'], weight: 2 },
      { text: 'So số dòng trước và sau, kiểm tra khóa', keywords: ['số dòng', 'đếm khóa', 'trước và sau'] },
      { text: 'Tổng hợp về đúng grain trước khi nối', keywords: ['tổng hợp', 'trước khi nối'] },
      { text: 'Thêm test unique và đối chiếu tổng', keywords: ['test', 'unique', 'đối chiếu'] },
    ],
    followUps: ['Vì sao dùng DISTINCT để sửa lại nguy hiểm?'],
    commonMistakes: ['Thêm DISTINCT vào kết quả mà không tìm hiểu nguyên nhân.', 'Không nhắc đến grain.'],
  },
  {
    id: 'iv-etl-validation-01',
    topicId: 'etl',
    category: 'etl-reliability',
    conceptIds: ['etl-validation', 'etl-data-quality'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn đặt các kiểm tra dữ liệu ở đâu trong pipeline, và khi kiểm tra thất bại thì pipeline nên phản ứng thế nào?',
    referenceAnswer: `Tôi đặt ở ba điểm, mỗi điểm trả lời một câu hỏi khác nhau.

Tại điểm vào, tôi kiểm tra lỗi của nguồn: schema, số dòng so với lịch sử, độ mới. Phát hiện ở đây thì chưa có bảng nào bị ảnh hưởng. Sau biến đổi, tôi kiểm tra lỗi logic của mình: khóa duy nhất, không null, khóa ngoại tồn tại. Trước khi công bố, tôi kiểm tra quy tắc nghiệp vụ và đối chiếu tổng với nguồn. Tôi ghi vào vị trí tạm, đạt mới hoán đổi sang bảng chính, nên người dùng không thấy số sai.

Phản ứng phụ thuộc mức độ. Sai toàn cục, như thiếu 85% số dòng hay mất cột, thì dừng và báo người trực, vì dữ liệu cũ mà đúng tốt hơn dữ liệu mới mà sai. Lỗi cục bộ, như 0,02% dòng số tiền âm, thì cách ly dòng lỗi sang bảng riêng để xem lại, các dòng khác đi tiếp. Lỗi nhẹ hoặc quy tắc mới thì cảnh báo để theo dõi trước khi chặn thật.

Tôi cũng tránh viết quá nhiều test ồn ào, vì cảnh báo giả làm mọi người bỏ qua cả cảnh báo thật. Với dbt, test nào ít quan trọng có thể đặt mức cảnh báo.`,
    keyPoints: [
      { text: 'Kiểm tra tại điểm vào để bắt lỗi nguồn', keywords: ['điểm vào', 'lỗi của nguồn', 'schema', 'nguồn'], weight: 2 },
      { text: 'Kiểm tra trước khi công bố, hoán đổi sau khi đạt', keywords: ['trước khi công bố', 'hoán đổi', 'vị trí tạm'], weight: 2 },
      { text: 'Phân mức: dừng, cách ly, cảnh báo', keywords: ['dừng', 'cách ly', 'quarantine', 'cảnh báo'], weight: 2 },
      { text: 'Tránh cảnh báo ồn ào', keywords: ['ồn ào', 'cảnh báo giả', 'false positive'] },
    ],
    followUps: ['Bạn đặt ngưỡng kiểm tra số dòng cho dữ liệu có tính mùa vụ như thế nào?'],
    commonMistakes: ['Dừng cả pipeline với mọi lỗi nhỏ.', 'Chỉ kiểm tra sau khi đã ghi vào bảng chính.'],
  },
  {
    id: 'iv-etl-idempotency-01',
    topicId: 'etl',
    category: 'etl-reliability',
    conceptIds: ['etl-idempotency'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Idempotency trong pipeline dữ liệu là gì? Vì sao nó quan trọng đến vậy?',
    referenceAnswer: `Idempotency nghĩa là chạy một thao tác nhiều lần cho cùng kết quả với chạy một lần. Với pipeline, chạy lại cùng một phạm vi thì đích vẫn ở đúng một trạng thái, không trùng và không cộng dồn.

Nó quan trọng vì chạy lại là không thể tránh. Trong hệ phân tán, bên gọi không phân biệt được ghi thất bại với ghi thành công nhưng mất xác nhận. Để không mất dữ liệu, hệ thống phải thử lại, nên có thể ghi hai lần. Ngoài ra, khi phát hiện lỗi logic thì phải chạy lại lịch sử, tức là backfill.

Ví dụ task dùng INSERT để ghi doanh thu ngày. Airflow retry sau khi dữ liệu đã ghi xong, nên doanh thu thành gấp đôi. Cách sửa là nhận ngày làm tham số, rồi thay thế cả partition ngày đó, hoặc MERGE theo khóa nếu bảng có cập nhật. Sau đó chạy lại bao nhiêu lần cũng ra cùng một kết quả.

Khi đó, xử lý sự cố chỉ còn là chạy lại, không cần dọn dẹp thủ công lúc nửa đêm.`,
    keyPoints: [
      { text: 'Chạy nhiều lần cho cùng trạng thái đích', keywords: ['nhiều lần', 'cùng kết quả', 'một trạng thái', 'chạy lại'], weight: 2 },
      { text: 'Không phân biệt được lỗi và mất xác nhận', keywords: ['mất xác nhận', 'thử lại', 'retry', 'at least once'], weight: 2 },
      { text: 'Phục vụ backfill', keywords: ['backfill', 'chạy lại lịch sử'] },
      { text: 'Kỹ thuật: thay thế partition, MERGE', keywords: ['partition', 'merge', 'upsert'], weight: 2 },
    ],
    followUps: ['INSERT OVERWRITE khác gì so với MERGE?', 'Làm sao kiểm thử một job có idempotent hay không?'],
    commonMistakes: ['Chỉ đọc định nghĩa toán học mà không gắn với retry.', 'Không biết INSERT tạo bản trùng khi chạy lại.'],
  },
  {
    id: 'iv-etl-idempotency-02',
    topicId: 'etl',
    category: 'etl-reliability',
    conceptIds: ['etl-idempotency', 'etl-orchestration'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn nhận một job cũ đọc dữ liệu theo current_date và INSERT vào đích. Hãy biến nó thành idempotent, và kiểm chứng kết quả.',
    referenceAnswer: `Job này sai ở cả hai đầu. Đầu vào phụ thuộc \`current_date\` nên chạy lại sẽ đọc ngày khác. Đầu ra dùng INSERT nên chạy lại tạo bản trùng.

Với đầu vào, tôi đưa ngày thành tham số do orchestrator truyền vào, và loại mọi \`now()\` hoặc số ngẫu nhiên trong logic. Trong Airflow, cần chú ý khoảng dữ liệu: với lịch cron mặc định của Airflow 3, hai biến đầu và cuối khoảng bằng nhau, nên cần cấu hình timetable có khoảng hoặc tính khoảng rõ ràng.

Với đầu ra, nếu dữ liệu theo ngày và mỗi ngày tính lại đủ, tôi thay thế partition của ngày đó, vì đơn giản và rẻ. Nếu bảng có cập nhật theo khóa, tôi khử trùng lặp rồi MERGE theo khóa nghiệp vụ. Khóa thay thế phải được tính từ dữ liệu, không dùng tự tăng.

Tôi cũng phải dọn dữ liệu trùng đã có từ trước, bằng cách chạy lại các ngày đã nạp theo logic mới.

Để kiểm chứng, tôi chạy job hai lần với cùng một ngày và so số dòng và tổng: phải giống hệt nhau. Tôi thử cho task lỗi giữa chừng rồi chạy lại. Tôi chạy lại một ngày cũ để xác nhận không ảnh hưởng ngày khác. Có thể đưa kiểm tra này vào CI.`,
    keyPoints: [
      { text: 'Đưa ngày thành tham số, loại now()', keywords: ['tham số', 'now', 'current date', 'data interval'], weight: 2 },
      { text: 'Thay thế partition hoặc MERGE theo khóa', keywords: ['thay thế partition', 'overwrite', 'merge', 'upsert'], weight: 2 },
      { text: 'Khóa tính từ dữ liệu, không dùng tự tăng', keywords: ['khóa nghiệp vụ', 'tự tăng', 'tính từ dữ liệu'] },
      { text: 'Kiểm chứng bằng cách chạy hai lần và so kết quả', keywords: ['chạy hai lần', 'so số dòng', 'giống hệt'], weight: 2 },
    ],
    followUps: ['Dữ liệu trùng đã có trong đích thì dọn như thế nào?'],
    commonMistakes: ['Chỉ sửa đầu ra mà vẫn đọc theo ngày hiện tại.', 'Không kiểm chứng bằng cách chạy lại thật.'],
  },
  {
    id: 'iv-etl-idempotency-03',
    topicId: 'etl',
    category: 'etl-reliability',
    conceptIds: ['etl-idempotency', 'etl-stream', 'kafka-exactly-once'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Exactly-once và idempotency liên quan thế nào? Nếu pipeline còn gọi API thanh toán bên ngoài thì bạn đảm bảo không trừ tiền hai lần như thế nào?',
    referenceAnswer: `Exactly-once theo nghĩa phân phối vật lý là gần như không thể qua một đường truyền có lỗi, vì không phân biệt được mất dữ liệu với mất xác nhận. Cái đạt được là hiệu ứng exactly-once: thông điệp có thể được xử lý lại, nhưng hiệu ứng cuối cùng như đúng một lần.

Có hai cách đạt được. Giao dịch: ghi kết quả và vị trí đọc nguyên tử với nhau, như Kafka transactions, hoặc two-phase commit của Flink. Cách này đòi hỏi đích hỗ trợ giao dịch và có độ trễ. Idempotency: at-least-once cộng ghi idempotent, đơn giản hơn và dùng được với nhiều đích. Vì vậy idempotency thường là con đường thực tế.

Với API thanh toán, không có gì để ghi đè, và bảo đảm của engine dừng ở biên hệ thống của nó. Tôi tạo một idempotency key xác định từ dữ liệu, ví dụ từ mã đơn hàng và lần thanh toán, không phải số ngẫu nhiên, để retry gửi đúng cùng key. Nếu API hỗ trợ, phía họ sẽ loại bản trùng.

Nếu API không hỗ trợ, tôi dùng outbox: ghi ý định thanh toán vào bảng trước, gọi API, rồi cập nhật kết quả. Khi không rõ kết quả do timeout, phải truy vấn trạng thái trước khi thử lại, không gửi lại mù quáng. Đối soát định kỳ với nhà cung cấp là lớp bảo vệ cuối cùng.`,
    keyPoints: [
      { text: 'Exactly-once là hiệu ứng, không phải phân phối vật lý', keywords: ['hiệu ứng', 'effectively once', 'không phải phân phối', 'mất xác nhận'], weight: 2 },
      { text: 'Hai con đường: giao dịch và idempotency', keywords: ['giao dịch', 'transaction', 'two phase', 'hai pha', 'at least once'], weight: 2 },
      { text: 'Idempotency key xác định từ dữ liệu', keywords: ['idempotency key', 'khóa idempotency', 'mã đơn hàng'], weight: 3 },
      { text: 'Timeout: truy vấn trạng thái, outbox, đối soát', keywords: ['outbox', 'truy vấn trạng thái', 'đối soát', 'timeout'], weight: 2 },
    ],
    followUps: ['Vì sao idempotency key sinh ngẫu nhiên mỗi lần retry lại vô dụng?', 'Kafka transactions bảo đảm điều gì và không bảo đảm điều gì?'],
    commonMistakes: ['Nói engine exactly-once nên API gọi ngoài cũng an toàn.', 'Thử lại mù quáng sau timeout.'],
  },
  {
    id: 'iv-etl-orchestration-01',
    topicId: 'etl',
    category: 'etl-reliability',
    conceptIds: ['etl-orchestration'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Airflow giải quyết điều gì mà cron không làm được? Giải thích logical date, data interval, catchup và backfill.',
    referenceAnswer: `Cron chỉ biết giờ, nên phải đoán bước trước xong lúc nào. Airflow mô tả pipeline thành DAG phụ thuộc, nên task chỉ chạy khi task trước đã xong, kèm retry, lịch sử, cảnh báo và chạy lại lịch sử. Airflow chỉ điều phối, việc xử lý dữ liệu do Spark hoặc kho đảm nhận.

Data interval là khoảng thời gian dữ liệu mà một run xử lý. Với \`CronDataIntervalTimetable\`, run của ngày 01/11 chạy sau khi ngày đó kết thúc, tức là 02/11, vì lúc đó mới đủ dữ liệu. Logical date là đầu khoảng, nên nó không phải thời điểm chạy, và đây là chỗ người mới hay nhầm.

Từ Airflow 3, chuỗi cron mặc định dùng \`CronTriggerTimetable\`, nên \`data_interval_start\` bằng \`data_interval_end\`, và run chạy đúng giờ kích hoạt. Muốn có khoảng thì đặt \`create_cron_data_intervals\` hoặc chọn timetable tương ứng.

Catchup là scheduler tự tạo run cho các khoảng còn thiếu, Airflow 3 mặc định tắt. Backfill là chủ động chạy lại khoảng chọn trước, bằng \`airflow backfill create\`, với tùy chọn có chạy lại các run đã thành công hay không. Cả hai đều đòi hỏi task idempotent.`,
    keyPoints: [
      { text: 'DAG phụ thuộc, retry, lịch sử', keywords: ['phụ thuộc', 'dag', 'retry', 'thử lại'], weight: 2 },
      { text: 'Logical date không phải thời điểm chạy', keywords: ['logical date', 'đầu khoảng', 'không phải thời điểm chạy'], weight: 2 },
      { text: 'Data interval và thay đổi ở Airflow 3', keywords: ['data interval', 'crontriggertimetable', 'airflow 3', 'khoảng dữ liệu'], weight: 2 },
      { text: 'Phân biệt catchup và backfill', keywords: ['catchup', 'backfill'], weight: 2 },
    ],
    followUps: ['Chuyển DAG từ Airflow 2 lên 3 có thể đổi hành vi lịch như thế nào?'],
    commonMistakes: ['Cho rằng run của ngày 01/11 chạy lúc 00:00 ngày 01/11 với data interval timetable.', 'Dùng Airflow để xử lý trực tiếp dữ liệu lớn.'],
  },
  {
    id: 'iv-etl-orchestration-02',
    topicId: 'etl',
    category: 'etl-reliability',
    conceptIds: ['etl-orchestration', 'etl-incremental', 'etl-idempotency'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bạn phải backfill 2 năm dữ liệu cho một pipeline đang chạy hằng ngày với Airflow. Bạn lập kế hoạch thế nào để không ảnh hưởng đến dữ liệu đang phục vụ?',
    referenceAnswer: `Trước hết tôi kiểm tra điều kiện tiên quyết: task có nhận khoảng thời gian làm tham số và ghi idempotent không. Nếu chưa, phải sửa trước, vì nếu không backfill sẽ tạo trùng. Tôi cũng xem nguồn còn đủ dữ liệu không. Nếu nguồn chỉ giữ 90 ngày thì phải tính lại từ vùng thô.

Về an toàn, tôi ghi kết quả vào bảng hoặc vị trí tạm trước, không ghi đè bảng đang phục vụ. Tôi chạy thử một vài ngày và so sánh với bản cũ để hiểu chênh lệch. Khi cả khoảng đã đạt, tôi hoán đổi hoặc thay từng partition.

Về tải, tôi dùng \`airflow backfill create\` với \`--max-active-runs\` nhỏ, \`--reprocess-behavior completed\` vì phải chạy lại các ngày đã thành công, và có thể \`--run-backwards\` để ưu tiên ngày gần đây. Tôi đưa backfill vào pool hoặc cụm tính toán riêng, để không tranh tài nguyên với job hằng ngày, và tránh giờ cao điểm của kho. Với 2 năm, tôi ước lượng chi phí từ một tháng trước khi chạy.

Bảng phụ thuộc phía sau cũng phải tính lại, nên tôi dùng lineage để biết phạm vi. Pipeline hằng ngày tiếp tục chạy song song, và mốc của nó không bị đụng tới. Cuối cùng tôi đối soát theo tháng, rồi thông báo cho người dùng rằng số liệu lịch sử đã thay đổi.`,
    keyPoints: [
      { text: 'Điều kiện: tham số khoảng và ghi idempotent', keywords: ['tham số', 'idempotent', 'lũy đẳng'], weight: 2 },
      { text: 'Ghi vào chỗ tạm, so sánh rồi mới hoán đổi', keywords: ['tạm', 'hoán đổi', 'so sánh', 'chạy thử'], weight: 2 },
      { text: 'Giới hạn đồng thời và tài nguyên riêng', keywords: ['max active runs', 'giới hạn', 'pool', 'cụm riêng', 'đồng thời'], weight: 2 },
      { text: 'Tính lại bảng phụ thuộc bằng lineage', keywords: ['lineage', 'bảng phụ thuộc', 'phía sau'] },
      { text: 'Không đụng luồng hằng ngày, đối soát và thông báo', keywords: ['song song', 'đối soát', 'thông báo', 'mốc'] },
    ],
    followUps: ['Nếu nguồn đã xóa dữ liệu cũ thì sao?', 'Làm sao biết backfill đã đúng?'],
    commonMistakes: ['Backfill thẳng vào bảng đang phục vụ.', 'Không giới hạn số run đồng thời, làm quá tải kho.'],
  },
])
