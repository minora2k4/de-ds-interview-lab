import { defineInterview } from '../../define'

export default defineInterview([
  /* ---------- arch-batch ---------- */
  {
    id: 'iv-arch-sd-batch-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-batch', 'etl-incremental'],
    interviewTypes: ['system-design', 'de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Thiết kế hệ thống báo cáo doanh số hằng ngày cho một chuỗi 50 cửa hàng đang dùng MySQL.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** quản lý cần báo cáo trước 8 giờ sáng và xem lại được 2 năm. Có khoảng 200.000 dòng bán hàng mỗi ngày, mỗi dòng 500 byte, tức 100 MB mỗi ngày và khoảng 73 GB sau 2 năm. Quy mô này vừa với một máy.

**Kiến trúc đề xuất:** lúc 1 giờ sáng, một job đọc dữ liệu của ngày hôm trước từ bản sao đọc của MySQL và nạp vào vùng tạm trong kho dữ liệu. Sau khi kiểm tra, job biến đổi thành bảng doanh số theo ngày, cửa hàng và sản phẩm. Công cụ BI chỉ đọc bảng này.

**Lựa chọn công nghệ:** dùng PostgreSQL hoặc BigQuery vì dữ liệu nhỏ và đội đã quen SQL. Dùng Airflow hoặc công cụ lập lịch của cloud để có retry và lịch sử chạy. Tôi không dùng Spark hay Kafka, vì dữ liệu không cần xử lý phân tán và không ai cần số theo phút. Đọc từ bản sao để không ảnh hưởng đến hệ thống bán hàng.

**Đánh đổi:** cách này đơn giản và rẻ, nhưng số trễ đến một ngày. Nếu sau này cần số trong ngày, chỉ cần chạy theo giờ mà chưa phải đổi kiến trúc. Nếu cột \`updated_at\` không đáng tin, dòng bị sửa sẽ bị bỏ sót, nên tôi đọc lại 3 ngày gần nhất mỗi đêm.

**Xử lý lỗi và giám sát:** job nhận ngày chạy làm tham số, rồi xóa và ghi lại dữ liệu của ngày đó trong một giao dịch, nên chạy lại không bị trùng. Tôi đặt cảnh báo khi job lỗi, khi số dòng thấp hơn nhiều so với cùng thứ tuần trước, và khi 7 giờ vẫn chưa có bảng.`,
    keyPoints: [
      { text: 'Ước lượng quy mô và kết luận một máy là đủ', keywords: ['100 mb', 'một máy', 'quy mô', '73 gb'], weight: 2 },
      { text: 'Đọc từ bản sao để không ảnh hưởng nguồn', keywords: ['bản sao', 'read replica', 'replica'] },
      { text: 'Không dùng Spark, Kafka khi không cần', keywords: ['không dùng spark', 'không cần spark', 'không dùng kafka', 'không cần kafka'], weight: 2 },
      { text: 'Chạy lại không trùng theo ngày', keywords: ['chạy lại', 'không trùng', 'idempotent', 'xóa và ghi'] },
      { text: 'Cảnh báo lỗi, số dòng, trễ hạn', keywords: ['cảnh báo', 'số dòng', 'trễ'] },
    ],
    followUps: ['Nếu cần cập nhật mỗi giờ thì đổi gì?', 'Dòng bị xóa trong MySQL thì sao?'],
    commonMistakes: ['Đề xuất ngay một nền tảng Big Data cho 100 MB mỗi ngày.', 'Truy vấn trực tiếp vào cơ sở dữ liệu bán hàng.'],
  },
  {
    id: 'iv-arch-sd-batch-02',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-batch', 'etl-validation'],
    interviewTypes: ['system-design', 'de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Một đối tác gửi tệp CSV khoảng 2 GB mỗi đêm qua SFTP. Thiết kế pipeline đưa dữ liệu này vào kho.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** tôi hỏi tệp đến lúc mấy giờ, có gửi lại không, chứa đầy đủ hay chỉ phần thay đổi, và số liệu cần trước mấy giờ. Giả sử 2 GB, khoảng 10 triệu dòng, nhận trước 3 giờ sáng, báo cáo cần trước 8 giờ, và mỗi tệp chỉ chứa dữ liệu mới.

**Kiến trúc đề xuất:** một job kiểm tra SFTP và chép tệp nguyên bản vào thư mục thô theo ngày trên object storage. Sau đó kiểm tra số cột, kiểu dữ liệu và số dòng. Dòng hợp lệ được chuyển sang Parquet rồi nạp vào kho. Dòng không hợp lệ được đưa vào vùng cách ly.

**Lựa chọn công nghệ:** dùng S3 cho vùng thô vì rẻ và bền. Dùng Airflow vì có sensor để chờ tệp, có retry. 2 GB có thể xử lý trên một máy, nên chưa cần cụm Spark. Parquet giúp truy vấn nhanh hơn và tốn ít dung lượng hơn CSV.

**Đánh đổi:** lưu cả tệp gốc sẽ tốn thêm dung lượng, nhưng cho phép tính lại và làm bằng chứng khi có tranh chấp với đối tác. Nếu dừng toàn bộ khi có lỗi thì an toàn nhưng dễ trễ, nên tôi đặt ngưỡng: dưới 1% dòng lỗi thì cách ly và chạy tiếp, trên mức đó thì dừng.

**Xử lý lỗi và giám sát:** lưu mã băm của tệp để nhận ra tệp gửi trùng. Nạp theo partition ngày bằng cách ghi đè, nên chạy lại không trùng. Tôi đặt cảnh báo khi 4 giờ vẫn chưa có tệp, khi số dòng lệch nhiều so với bình thường, và khi tỷ lệ dòng lỗi tăng. Cần có sẵn đầu mối liên hệ phía đối tác.`,
    keyPoints: [
      { text: 'Giữ tệp gốc trong vùng thô', keywords: ['tệp gốc', 'vùng thô', 'nguyên bản', 'raw'], weight: 2 },
      { text: 'Kiểm tra và cách ly dòng lỗi', keywords: ['kiểm tra', 'cách ly', 'quarantine', 'dòng lỗi'], weight: 2 },
      { text: 'Phát hiện tệp trùng và chạy lại an toàn', keywords: ['mã băm', 'hash', 'tệp trùng', 'ghi đè'] },
      { text: 'Phát hiện tệp không đến', keywords: ['chưa có tệp', 'không đến', 'sensor', 'tệp trễ'] },
    ],
    followUps: ['Đối tác đổi thứ tự cột mà không báo thì sao?'],
    commonMistakes: ['Chỉ nghĩ đến trường hợp tệp đến đúng giờ và đúng định dạng.'],
  },
  {
    id: 'iv-arch-sd-batch-03',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-batch', 'etl-orchestration'],
    interviewTypes: ['system-design', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Công ty có 300 job chạy bằng cron, phụ thuộc nhau theo giờ giấc. Job trước trễ thì job sau đọc phải dữ liệu cũ. Thiết kế lại cách điều phối.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** tôi cần biết job nào phụ thuộc job nào, job nào quan trọng, sự cố gần đây là gì, và ai chịu trách nhiệm. Thường phụ thuộc không được ghi lại ở đâu, nên việc đầu tiên là dựng lại từ log truy vấn và từ code.

**Kiến trúc đề xuất:** đưa job vào một orchestrator với phụ thuộc tường minh, tổ chức thành các DAG theo nghiệp vụ. Job sau chỉ chạy khi dữ liệu của job trước đã sẵn sàng, thay vì đến giờ là chạy. Giữa các DAG thì dùng tín hiệu dữ liệu sẵn sàng. Mọi job nhận ngày chạy làm tham số.

**Lựa chọn công nghệ:** Airflow là lựa chọn phổ biến, nhiều người biết. Dagster phù hợp nếu muốn lấy tài sản dữ liệu làm trung tâm. Dịch vụ quản lý giúp giảm công vận hành. Tôi chọn theo năng lực của đội, vì ở quy mô 300 job thì công cụ nào cũng đáp ứng được.

**Đánh đổi:** orchestrator là một hệ thống mới phải vận hành, và là điểm lỗi tập trung. Chuyển từng phần thì lâu hơn và phải chạy hai cách song song một thời gian, nhưng rủi ro thấp hơn nhiều so với chuyển một lần. Tôi chuyển các chuỗi quan trọng nhất trước, vì đó là nơi có lợi ích lớn nhất.

**Xử lý lỗi và giám sát:** mỗi task có retry với thời gian chờ tăng dần, và có giới hạn số lần. Lỗi ở một task sẽ dừng các task phụ thuộc thay vì để chúng chạy trên dữ liệu thiếu. Job phải idempotent trước khi bật retry. Tôi đặt cảnh báo khi bảng quan trọng trễ hạn, và theo dõi thời gian chạy của DAG để thấy xu hướng chậm đi.`,
    keyPoints: [
      { text: 'Dựng lại đồ thị phụ thuộc', keywords: ['phụ thuộc', 'dag', 'log truy vấn'], weight: 2 },
      { text: 'Chạy theo dữ liệu sẵn sàng thay vì theo giờ', keywords: ['sẵn sàng', 'theo giờ', 'sensor', 'tín hiệu'], weight: 2 },
      { text: 'Chuyển dần, ưu tiên chuỗi quan trọng', keywords: ['chuyển dần', 'từng phần', 'quan trọng', 'song song'] },
      { text: 'Job phải idempotent trước khi bật retry', keywords: ['idempotent', 'retry', 'chạy lại'] },
    ],
    followUps: ['Hai đội cùng phụ thuộc một bảng thì chia DAG thế nào?'],
    commonMistakes: ['Chuyển nguyên trạng từng cron thành task mà vẫn để lịch theo giờ.'],
  },

  /* ---------- arch-streaming ---------- */
  {
    id: 'iv-arch-sd-streaming-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-streaming', 'kafka-overview'],
    interviewTypes: ['system-design', 'de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Thiết kế dashboard gần thời gian thực cho đội vận hành trong đợt Flash Sale của một sàn thương mại điện tử.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** đội vận hành cần doanh thu, số đơn và tỷ lệ lỗi thanh toán, trễ không quá 30 giây, vì họ phản ứng theo phút. Đỉnh tải khoảng 50.000 sự kiện mỗi giây, mỗi sự kiện 1 KB, tức 50 MB mỗi giây. Có khoảng 200 người xem. Sai số nhỏ là chấp nhận được, vì số tài chính sẽ lấy từ batch.

**Kiến trúc đề xuất:** dịch vụ gửi sự kiện vào Kafka. Flink tổng hợp theo cửa sổ 10 giây và theo vài chiều như danh mục và vùng, rồi ghi vào kho OLAP. Dashboard chỉ đọc kho này. Cùng lúc, dữ liệu thô được ghi vào Lakehouse để đối soát.

**Lựa chọn công nghệ:** Kafka để chịu đỉnh tải và cho nhiều nơi cùng đọc, với 24 partition để còn dư khả năng. Flink vì hỗ trợ tốt event time và state. ClickHouse hoặc Apache Pinot vì truy vấn nhanh với nhiều người đọc đồng thời, điều mà OLTP không làm tốt.

**Đánh đổi:** chỉ tổng hợp theo vài chiều thì nhanh và rẻ, nhưng không thể xem sâu theo từng sản phẩm. Watermark 5 giây cho số nhanh hơn, nhưng sự kiện trễ hơn sẽ không kịp vào cửa sổ. Việc chấp nhận số tạm được đổi lại bằng đối soát với batch sau đó.

**Xử lý lỗi và giám sát:** Kafka giữ dữ liệu khi Flink dừng, và Flink đọc tiếp từ checkpoint. Ghi vào đích theo khóa cửa sổ và chiều, để ghi lại không tạo trùng. Tôi theo dõi consumer lag và độ trễ từ lúc xảy ra đến lúc hiển thị, đồng thời hiện "cập nhật lúc" trên dashboard để người xem biết khi số bị cũ. Trước đợt sale cần kiểm thử tải và tăng tài nguyên sẵn.`,
    keyPoints: [
      { text: 'Làm rõ độ trễ và cách dùng', keywords: ['30 giây', 'độ trễ', 'theo phút', 'vận hành'], weight: 2 },
      { text: 'Kafka, engine stream và kho OLAP', keywords: ['kafka', 'flink', 'clickhouse', 'pinot', 'olap'], weight: 2 },
      { text: 'Số tạm và đối soát với batch', keywords: ['số tạm', 'đối soát', 'batch'] },
      { text: 'Ghi idempotent theo khóa cửa sổ', keywords: ['idempotent', 'khóa cửa sổ', 'upsert', 'không trùng'] },
      { text: 'Theo dõi lag và kiểm thử tải trước đợt sale', keywords: ['lag', 'kiểm thử tải', 'tăng tài nguyên', 'load test'] },
    ],
    followUps: ['Làm sao hiển thị số khách hàng khác nhau theo thời gian thực?', 'Kho OLAP chậm lại thì chuyện gì xảy ra với Flink?'],
    commonMistakes: ['Cho dashboard đọc trực tiếp vào hệ thống đơn hàng.', 'Không đề cập đến đỉnh tải.'],
  },
  {
    id: 'iv-arch-sd-streaming-02',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-streaming', 'etl-ingestion'],
    interviewTypes: ['system-design', 'de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Thiết kế hệ thống thu thập sự kiện từ ứng dụng di động có 10 triệu người dùng hoạt động mỗi ngày.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** mỗi người tạo khoảng 100 sự kiện mỗi ngày, tức 1 tỷ sự kiện, trung bình 11.600 mỗi giây, đỉnh khoảng 60.000. Với 500 byte mỗi sự kiện là 500 GB mỗi ngày. Điểm khác với web là thiết bị có thể mất mạng, nên sự kiện có thể đến trễ hàng ngày, và nhiều phiên bản ứng dụng cũ vẫn còn chạy.

**Kiến trúc đề xuất:** SDK lưu sự kiện trên máy và gửi theo lô. Mỗi sự kiện có mã duy nhất, thời gian trên máy và phiên bản ứng dụng. Collector không giữ trạng thái, chạy sau load balancer, kiểm tra schema rồi ghi vào Kafka. Một job ghi dữ liệu thô vào Bronze theo ngày nhận, job khác khử trùng theo mã sự kiện để tạo Silver theo event time.

**Lựa chọn công nghệ:** Kafka tách collector khỏi người đọc, và giữ dữ liệu khi phía sau chậm. Schema Registry quản lý tương thích phiên bản. Spark Structured Streaming đủ cho việc ghi vào Lakehouse vì không cần độ trễ dưới giây.

**Đánh đổi:** gửi theo lô giúp tiết kiệm pin và mạng, đổi lại dữ liệu kém tươi hơn. Khử trùng trong cửa sổ dài thì chính xác hơn nhưng tốn state, nên tôi đặt khoảng 7 ngày. Đồng hồ trên máy có thể sai, nên tôi lưu thêm giờ gửi và giờ nhận để hiệu chỉnh.

**Xử lý lỗi và giám sát:** SDK thử lại khi lỗi, nên trùng là điều chắc chắn, và phải khử trùng ở phía sau. Sự kiện sai schema vào DLQ, không làm dừng luồng. Tôi theo dõi số sự kiện theo phiên bản ứng dụng để phát hiện bản phát hành lỗi, tỷ lệ vào DLQ và phân phối độ trễ. Cần tuân thủ sự đồng ý của người dùng trước khi thu thập.`,
    keyPoints: [
      { text: 'Ước lượng sự kiện mỗi giây và đỉnh tải', keywords: ['1 tỷ', '11.600', '60.000', 'sự kiện mỗi giây', 'đỉnh'], weight: 2 },
      { text: 'Mất mạng nên SDK đệm và gửi theo lô', keywords: ['đệm', 'theo lô', 'mất mạng', 'offline', 'lưu trên máy'], weight: 2 },
      { text: 'Mã sự kiện để khử trùng', keywords: ['khử trùng', 'mã duy nhất', 'event id', 'dedup'], weight: 2 },
      { text: 'Quản lý phiên bản schema', keywords: ['schema registry', 'phiên bản', 'schema'] },
      { text: 'Đồng hồ thiết bị có thể sai', keywords: ['đồng hồ', 'giờ nhận', 'clock', 'hiệu chỉnh'] },
    ],
    followUps: ['Một bản ứng dụng gửi sai tên sự kiện, sửa dữ liệu lịch sử thế nào?'],
    commonMistakes: ['Cho ứng dụng ghi thẳng vào Kafka hoặc kho dữ liệu.', 'Tin tưởng tuyệt đối vào thời gian trên thiết bị.'],
  },
  {
    id: 'iv-arch-sd-streaming-03',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-streaming', 'arch-lambda', 'etl-stream'],
    interviewTypes: ['system-design', 'de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Thiết kế cách xử lý dữ liệu đến trễ cho bảng doanh thu theo giờ, khi một số điểm bán offline có thể gửi dữ liệu trễ đến 7 ngày.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** với stream, không thể biết chắc khi nào đã đủ dữ liệu, nên phải chọn một cách có chủ đích. Tôi đo phân phối độ trễ thật. Giả sử 98% đến trong 5 phút, 1,9% trong 1 giờ, 0,1% trễ đến 7 ngày. Dashboard cần số nhanh, còn tài chính cần số đúng và đã chốt thì không được đổi.

**Kiến trúc đề xuất:** có ba mức. Mức một, Flink dùng watermark 5 phút để cho số nhanh, và cập nhật lại kết quả trong 1 giờ nhờ allowed lateness. Mức hai, sự kiện trễ hơn đi qua side output vào Lakehouse, và batch hằng đêm tính lại 7 ngày gần nhất từ dữ liệu thô. Mức ba, sau khi chốt tháng, sự kiện trễ được ghi thành bút toán điều chỉnh vào kỳ sau thay vì sửa kỳ đã chốt.

**Lựa chọn công nghệ:** Flink vì có event time, allowed lateness và side output, mặc định allowed lateness là 0 nên phải cấu hình. Iceberg hoặc Delta để ghi đè partition một cách nguyên tử. Kho phục vụ phải hỗ trợ cập nhật theo khóa.

**Đánh đổi:** chờ lâu hơn thì đủ hơn, nhưng trễ hơn và tốn state hơn. Ngắn watermark rồi sửa sau thì nhanh, nhưng người dùng sẽ thấy số thay đổi, nên tôi gắn nhãn tạm tính và đã chốt.

**Xử lý lỗi và giám sát:** ghi đè theo partition nên chạy lại an toàn. Tôi theo dõi phân phối độ trễ, số sự kiện trễ, và mức điều chỉnh của batch so với stream. Khi mức này vượt 0,5%, nhiều khả năng có điểm bán bị lỗi kết nối hoặc watermark đã không còn phù hợp.`,
    keyPoints: [
      { text: 'Không thể biết chắc khi nào đủ dữ liệu', keywords: ['không thể biết', 'khi nào đủ', 'không có điểm kết thúc'] },
      { text: 'Đo phân phối độ trễ thật', keywords: ['phân phối', 'đo', 'percentile'], weight: 2 },
      { text: 'Watermark và allowed lateness', keywords: ['watermark', 'allowed lateness'], weight: 2 },
      { text: 'Batch tính lại khoảng trễ dài', keywords: ['tính lại', 'batch', 'hằng đêm', 'side output'], weight: 2 },
      { text: 'Kỳ đã chốt dùng bút toán điều chỉnh', keywords: ['điều chỉnh', 'đã chốt', 'chốt sổ'] },
    ],
    followUps: ['Các bảng phía sau được cập nhật thế nào khi một partition cũ thay đổi?'],
    commonMistakes: ['Đặt watermark 7 ngày, làm số liệu trễ 7 ngày và state rất lớn.', 'Sửa trực tiếp số tài chính đã chốt.'],
  },
  {
    id: 'iv-arch-sd-streaming-04',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-streaming', 'kafka-exactly-once'],
    interviewTypes: ['system-design', 'bigdata'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Thiết kế phần dữ liệu cho hệ thống phát hiện gian lận thanh toán, phải có quyết định trong 200 mili giây.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** khoảng 5.000 giao dịch mỗi giây, đỉnh 20.000. Toàn bộ quyết định có P99 dưới 200 mili giây, trong đó đọc đặc trưng chỉ được khoảng 10 mili giây. Cần hỏi: khi hệ thống lỗi thì cho qua hay từ chối, vì đây là quyết định kinh doanh.

**Kiến trúc đề xuất:** tách hai đường. **Đường quyết định** là đồng bộ: dịch vụ thanh toán gọi dịch vụ chấm điểm, dịch vụ này đọc đặc trưng từ kho khóa-giá trị, áp dụng luật hoặc mô hình có sẵn. **Đường tính đặc trưng** là bất đồng bộ: giao dịch vào Kafka, Flink đếm theo thẻ, thiết bị, IP trong 1 phút và 1 giờ, rồi ghi vào kho. Dữ liệu thô vào Lakehouse để kiểm thử luật trên lịch sử.

**Lựa chọn công nghệ:** Flink vì giữ được state theo khóa với event time. Redis hoặc Aerospike vì đọc trong vài mili giây. Không để dịch vụ chấm điểm truy vấn kho phân tích, vì không thể đạt độ trễ này.

**Đánh đổi:** đặc trưng trễ khoảng 1 giây, nên một loạt giao dịch dồn dập có thể lọt qua. Có thể cập nhật vài bộ đếm quan trọng ngay trong đường đồng bộ, đổi lại phức tạp và thêm độ trễ. Từ chối nhầm gây mất doanh thu, nên phải cân bằng với tổn thất do gian lận.

**Xử lý lỗi và giám sát:** khi kho lỗi hoặc quá thời gian, dùng luật dự phòng đơn giản: số tiền nhỏ cho qua, số tiền lớn yêu cầu xác thực thêm. Tôi theo dõi P99, độ tươi của đặc trưng, consumer lag, tỷ lệ từ chối. Nhãn gian lận thật về sau nhiều tuần qua chargeback, nên cần có đường đưa nhãn này về để đánh giá.`,
    keyPoints: [
      { text: 'Tách đường quyết định đồng bộ và đường đặc trưng bất đồng bộ', keywords: ['đồng bộ', 'bất đồng bộ', 'tách hai đường'], weight: 2 },
      { text: 'Kho khóa-giá trị độ trễ thấp', keywords: ['redis', 'aerospike', 'khóa giá trị', 'key value'], weight: 2 },
      { text: 'Flink tính đặc trưng theo cửa sổ', keywords: ['flink', 'cửa sổ', 'đặc trưng'] },
      { text: 'Quyết định khi hệ thống lỗi', keywords: ['dự phòng', 'cho qua', 'fail open', 'fail closed', 'từ chối'], weight: 2 },
      { text: 'Nhãn gian lận đến trễ', keywords: ['chargeback', 'nhãn', 'trễ nhiều tuần'] },
    ],
    followUps: ['Làm sao bảo đảm đặc trưng khi kiểm thử giống đặc trưng lúc chạy thật?'],
    commonMistakes: ['Để đường quyết định phụ thuộc đồng bộ vào Kafka hoặc kho phân tích.', 'Không nói gì về trường hợp hệ thống lỗi.'],
  },
  {
    id: 'iv-arch-sd-streaming-05',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-streaming', 'cloud-s3'],
    interviewTypes: ['system-design', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Thiết kế nền tảng dữ liệu cho 1 triệu cảm biến IoT, mỗi cảm biến gửi một bản tin mỗi 10 giây.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** có 100.000 bản tin mỗi giây, mỗi bản tin 200 byte, tức 20 MB mỗi giây, khoảng 1,7 TB mỗi ngày. Cần cảnh báo trong 10 giây, xem biểu đồ 30 ngày, và giữ lịch sử 1 năm để phân tích, khoảng 620 TB trước khi nén.

**Kiến trúc đề xuất:** thiết bị gửi qua MQTT tới broker, rồi cầu nối đẩy vào Kafka theo khóa \`device_id\`. Flink tạo cảnh báo và gộp theo 1 phút, ghi vào kho chuỗi thời gian cho biểu đồ. Dữ liệu thô được ghi thành Parquet trên object storage.

**Lựa chọn công nghệ:** MQTT vì nhẹ và hợp với mạng không ổn định. Kafka để tách thiết bị khỏi xử lý và giữ dữ liệu khi có sự cố. TimescaleDB hoặc InfluxDB vì tối ưu truy vấn theo khoảng thời gian. Parquet trên S3 vì rẻ, nén tốt với dữ liệu lặp lại.

**Đánh đổi:** gộp theo phút giúp biểu đồ nhanh và rẻ, nhưng mất chi tiết, nên vẫn phải giữ bản thô. Chia theo thiết bị giữ được thứ tự của từng thiết bị, nhưng có thể gây lệch khi một số thiết bị gửi nhiều. Có thể chuyển dữ liệu cũ sang lớp lưu trữ lạnh để giảm chi phí, đổi lại đọc chậm hơn.

**Xử lý lỗi và giám sát:** khi mạng trở lại, nhiều thiết bị cùng kết nối gây quá tải, nên thiết bị phải thử lại với độ trễ ngẫu nhiên. Sự kiện đến trễ và sai thứ tự được xử lý bằng event time. Firmware khác nhau có schema khác nhau, nên dùng registry và DLQ. Quan trọng là phát hiện thiết bị im lặng, vì không có dữ liệu thì sẽ không có cảnh báo nào được kích hoạt.`,
    keyPoints: [
      { text: 'Ước lượng băng thông và lưu trữ', keywords: ['100.000', '20 mb', '1,7 tb', '620 tb', 'bản tin mỗi giây'], weight: 2 },
      { text: 'MQTT, Kafka và engine stream', keywords: ['mqtt', 'kafka', 'flink'], weight: 2 },
      { text: 'Tách dữ liệu nóng và lịch sử', keywords: ['chuỗi thời gian', 'time series', 'parquet', 'lưu trữ lạnh', 'gộp'] },
      { text: 'Kết nối lại đồng loạt gây quá tải', keywords: ['kết nối lại', 'ngẫu nhiên', 'jitter', 'quá tải'] },
      { text: 'Phát hiện thiết bị im lặng', keywords: ['im lặng', 'không gửi', 'mất tín hiệu'], weight: 2 },
    ],
    followUps: ['Một thiết bị gửi sai đơn vị đo thì phát hiện thế nào?'],
    commonMistakes: ['Chỉ cảnh báo khi giá trị vượt ngưỡng, bỏ qua trường hợp không có dữ liệu.'],
  },

  /* ---------- arch-lambda ---------- */
  {
    id: 'iv-arch-sd-lambda-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-lambda', 'arch-kappa'],
    interviewTypes: ['system-design', 'bigdata'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Thiết kế hệ thống đếm lượt xem video: người sáng tạo xem số gần tức thời, còn tiền bản quyền phải chính xác và kiểm toán được.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** khoảng 5 tỷ lượt xem mỗi ngày, gần 58.000 mỗi giây. Có hai nhu cầu khác hẳn nhau. Số hiển thị cần mới trong vài giây, lệch 1% vẫn được. Số tính tiền phải tái lập được, đã lọc bot và trùng, và chấp nhận trễ vài giờ.

**Kiến trúc đề xuất:** sự kiện đi vào Kafka, rồi tách làm hai. Nhánh nhanh dùng Flink đếm gần đúng, ghi vào kho khóa-giá trị. Nhánh chính xác lưu sự kiện bất biến vào Lakehouse, Spark chạy mỗi đêm để lọc bot, khử trùng, tạo bảng chính thức có mốc cắt rõ ràng. Hiển thị lấy số batch cộng phần stream sau mốc cắt. Thanh toán chỉ đọc bảng batch.

**Lựa chọn công nghệ:** tôi chọn cách gần với Lambda chứ không phải Kappa, vì lọc bot cần phân tích hành vi trên lịch sử dài và logic nặng, khó đưa vào stream. Hai nhánh ở đây có logic khác nhau có chủ đích. Dữ liệu bất biến cho phép kiểm toán và tính lại.

**Đánh đổi:** phải vận hành hai hệ thống, và số sẽ nhảy khi batch thay thế số tạm, nên phải gắn nhãn "tạm tính". Tôi giảm chi phí bằng cách chỉ đưa vài chỉ số vào nhánh nhanh, thay vì mọi chỉ số, và dùng chung định nghĩa sự kiện.

**Xử lý lỗi và giám sát:** nhánh nhanh hỏng thì phát lại Kafka từ mốc cắt. Batch trễ thì hiển thị vẫn hoạt động nhờ nhánh nhanh, nhưng thanh toán phải chờ. Tôi đo độ lệch giữa hai nhánh mỗi đêm và cảnh báo khi vượt 2%. Kết quả batch được lưu kèm phiên bản code và phiên bản dữ liệu để kiểm toán.`,
    keyPoints: [
      { text: 'Tách hai nhu cầu về độ tươi và độ chính xác', keywords: ['hai nhu cầu', 'tạm tính', 'chính xác', 'tính tiền'], weight: 2 },
      { text: 'Lý do chọn Lambda thay vì Kappa', keywords: ['lọc bot', 'lịch sử dài', 'logic nặng', 'lambda'], weight: 2 },
      { text: 'Dữ liệu bất biến để kiểm toán và tính lại', keywords: ['bất biến', 'kiểm toán', 'tái lập', 'tính lại'] },
      { text: 'Mốc cắt khi gộp', keywords: ['mốc cắt', 'gộp'] },
      { text: 'Đo độ lệch giữa hai nhánh', keywords: ['độ lệch', 'đối soát', 'so sánh'] },
    ],
    followUps: ['Khi nào bạn có thể bỏ nhánh batch?', 'Đếm người xem khác nhau theo thời gian thực thế nào?'],
    commonMistakes: ['Dùng số gần đúng để tính tiền.', 'Chọn kiến trúc mà không nói rõ vì sao.'],
  },

  /* ---------- arch-kappa ---------- */
  {
    id: 'iv-arch-sd-kappa-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-kappa', 'arch-lambda'],
    interviewTypes: ['system-design', 'bigdata'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Hệ thống Lambda của công ty có 40 chỉ số viết hai lần, thường lệch nhau. Lập kế hoạch chuyển sang Kappa một cách an toàn.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** trước hết tôi hỏi vì sao chuyển: chi phí duy trì, số lệch, hay tốc độ thay đổi. Tiếp đó phân loại 40 chỉ số. Giả sử 30 chỉ số là cộng dồn và cửa sổ, dễ làm bằng stream. 10 chỉ số cần toàn bộ lịch sử hoặc đối soát với tệp ngày. Không nhất thiết phải chuyển hết.

**Kiến trúc đề xuất:** tăng retention của Kafka và lưu log sang kho lâu dài. Viết job Flink cho từng chỉ số, chạy song song ở chế độ bóng, ghi ra bảng riêng. So sánh mỗi ngày với kết quả batch hiện có. Khi đạt tiêu chuẩn, chuyển người dùng sang bảng mới bằng công tắc, làm theo từng chỉ số. Giữ batch thêm hai kỳ chốt sổ rồi mới tắt.

**Lựa chọn công nghệ:** Flink vì event time và state mạnh, và savepoint giúp nâng cấp job đang chạy. Kafka Tiered Storage, sẵn sàng cho production từ phiên bản 3.9, giúp giữ log lâu với chi phí thấp hơn.

**Đánh đổi:** bỏ được hai bộ code, đổi lại phải trả cho lưu log, state và phát lại. Trong lúc chuyển đổi, chi phí tăng vì có đến ba hệ thống cùng chạy. 10 chỉ số khó vẫn ở batch, nên kết quả là kiến trúc lai, và điều đó có thể chấp nhận được.

**Xử lý lỗi và giám sát:** mỗi chỉ số có đường quay lại bằng công tắc. Khi so sánh sẽ có khác biệt, và nhiều khác biệt là lỗi của hệ thống cũ, nên phải giải thích từng cái. Tôi diễn tập phát lại định kỳ để biết thời gian tính lại thực tế, vì đó là khả năng thay thế cho batch. Theo dõi lag, kích thước state và thời gian checkpoint.`,
    keyPoints: [
      { text: 'Phân loại chỉ số, không nhất thiết chuyển hết', keywords: ['phân loại', 'không chuyển hết', 'kiến trúc lai', 'hybrid'], weight: 2 },
      { text: 'Chạy bóng và so sánh với batch', keywords: ['chạy bóng', 'shadow', 'so sánh', 'song song'], weight: 2 },
      { text: 'Chuyển từng chỉ số và có đường quay lại', keywords: ['từng chỉ số', 'quay lại', 'công tắc', 'rollback'], weight: 2 },
      { text: 'Tăng retention và lưu log', keywords: ['retention', 'tiered storage', 'lưu log'] },
      { text: 'Diễn tập phát lại', keywords: ['diễn tập', 'phát lại', 'replay'] },
    ],
    followUps: ['Nếu số stream khác batch 0,3% thì bạn quyết định thế nào?'],
    commonMistakes: ['Tắt batch ngay khi job stream chạy được.', 'Cố chuyển mọi chỉ số chỉ để kiến trúc thuần túy.'],
  },
  {
    id: 'iv-arch-sd-kappa-02',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-kappa', 'kafka-retention'],
    interviewTypes: ['system-design', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Trong hệ thống Kappa nhận 20.000 sự kiện mỗi giây, bạn phát hiện lỗi logic đã kéo dài 90 ngày và phải sửa số trong 48 giờ. Thiết kế việc tính lại.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** 90 ngày là khoảng 155 tỷ sự kiện. Nếu job đạt 200.000 sự kiện mỗi giây, tốc độ đuổi thực tế là 180.000 do dữ liệu mới vẫn đến, nên mất khoảng 10 ngày. Như vậy không đạt yêu cầu. Giả sử Kafka chỉ giữ 14 ngày, phần cũ nằm trong kho lưu trữ. Cần hỏi: cần đúng ngay phần nào? Thường là dữ liệu gần đây.

**Kiến trúc đề xuất:** chia làm hai phần. Phần 14 ngày gần nhất phát lại từ Kafka, ghi vào bảng v2, khoảng 37 giờ. Phần cũ đọc từ kho lưu trữ, chạy cùng code ở chế độ batch và song song theo ngày, vì kết quả từng ngày độc lập với nhau. Khi xong, so sánh rồi chuyển người dùng sang v2.

**Lựa chọn công nghệ:** Flink có chế độ thực thi batch cho dữ liệu có giới hạn, và có Hybrid Source để nối từ kho lưu trữ sang Kafka, nên vẫn dùng một bộ code. Iceberg hoặc Delta giúp ghi đè từng ngày một cách nguyên tử.

**Đánh đổi:** đây không còn là Kappa thuần túy, vì lịch sử đọc từ kho khác log. Nhưng giữ được giá trị cốt lõi là một bộ logic. Nếu logic phụ thuộc state xuyên ngày thì không chạy độc lập theo ngày được, và phải xử lý tuần tự hoặc tính state trước.

**Xử lý lỗi và giám sát:** ghi nhận tiến độ theo ngày nên có thể chạy tiếp khi lỗi. Tắt hiệu ứng phụ như gửi thông báo. Giới hạn tốc độ đọc Kafka để không ảnh hưởng các consumer khác. Trong lúc đó, bảng v1 vẫn phục vụ. Tôi so sánh v1 và v2 theo ngày để chắc rằng khác biệt đúng như dự kiến, và báo tiến độ cho người dùng.`,
    keyPoints: [
      { text: 'Tính được thời gian phát lại, có trừ dữ liệu mới', keywords: ['155 tỷ', '180.000', '10 ngày', 'tốc độ đuổi'], weight: 2 },
      { text: 'Ưu tiên phần gần đây', keywords: ['gần đây', 'ưu tiên', '14 ngày'] },
      { text: 'Chạy cùng code ở chế độ batch cho lịch sử', keywords: ['chế độ batch', 'hybrid source', 'cùng code', 'một bộ code'], weight: 2 },
      { text: 'Song song theo ngày, ghi bảng v2', keywords: ['song song', 'theo ngày', 'bảng v2', 'v2'] },
      { text: 'Tắt hiệu ứng phụ và kiểm soát tải', keywords: ['hiệu ứng phụ', 'giới hạn tốc độ', 'side effect'] },
    ],
    followUps: ['Logic có state xuyên nhiều ngày thì chia nhỏ thế nào?'],
    commonMistakes: ['Không tính thử thời gian, cứ giả định là phát lại kịp.', 'Quên rằng dữ liệu mới vẫn tiếp tục đến.'],
  },

  /* ---------- arch-lakehouse ---------- */
  {
    id: 'iv-arch-sd-lakehouse-01',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-lakehouse', 'etl-cdc', 'dw-data-lakehouse'],
    interviewTypes: ['system-design', 'de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Thiết kế pipeline CDC từ cơ sở dữ liệu OLTP PostgreSQL sang Lakehouse.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** giả sử 300 bảng, 2 TB, trung bình 5.000 thay đổi mỗi giây, đỉnh 20.000. Dữ liệu phân tích cần mới trong 15 phút, phải bắt được thao tác xóa, và không được làm chậm hệ thống nguồn.

**Kiến trúc đề xuất:** Debezium đọc WAL qua logical decoding, chụp snapshot ban đầu rồi chuyển sang đọc thay đổi, và ghi vào Kafka theo khóa chính. Một job ghi nguyên các thay đổi vào Bronze dạng append. Một job khác, mỗi 10 phút, lấy phiên bản mới nhất của mỗi khóa trong lô rồi \`MERGE\` vào Silver.

**Lựa chọn công nghệ:** CDC dựa trên log vì bắt được cả xóa và mọi thay đổi trung gian, với tải lên nguồn thấp hơn truy vấn định kỳ. Kafka làm bộ đệm và cho phép đọc lại. Iceberg hoặc Delta vì hỗ trợ \`MERGE\` với giao dịch.

**Đánh đổi:** \`MERGE\` dày hơn thì dữ liệu tươi hơn nhưng sinh nhiều tệp nhỏ và tốn tài nguyên, nên 10 phút là điểm cân bằng cho yêu cầu 15 phút. Copy-on-write đọc nhanh nhưng ghi đắt, merge-on-read thì ngược lại. Giữ Bronze tốn lưu trữ, đổi lại có thể dựng lại Silver mà không cần đọc lại nguồn.

**Xử lý lỗi và giám sát:** rủi ro lớn nhất là connector dừng làm replication slot giữ WAL, khiến đĩa của máy chủ nguồn đầy, nên phải cảnh báo độ trễ của slot. Delivery là at-least-once, nên \`MERGE\` theo khóa và số thứ tự log để chạy lại không sai. Với xóa, Debezium phát sự kiện delete rồi tombstone, và Silver phải áp dụng xóa. Đổi schema phải có quy trình tương thích. Tôi đối soát số dòng và tổng kiểm tra giữa nguồn và đích mỗi ngày.`,
    keyPoints: [
      { text: 'CDC dựa trên log với snapshot ban đầu', keywords: ['debezium', 'wal', 'logical decoding', 'snapshot'], weight: 2 },
      { text: 'Bronze append và MERGE vào Silver', keywords: ['bronze', 'merge', 'silver', 'upsert'], weight: 2 },
      { text: 'Rủi ro replication slot làm đầy đĩa nguồn', keywords: ['replication slot', 'đầy đĩa', 'wal'], weight: 2 },
      { text: 'Xử lý thứ tự và thao tác xóa', keywords: ['tombstone', 'thao tác xóa', 'thứ tự', 'số thứ tự log', 'lsn'] },
      { text: 'Đối soát nguồn và đích', keywords: ['đối soát', 'số dòng', 'reconcile'] },
    ],
    followUps: ['Nguồn thêm cột hoặc đổi kiểu cột thì pipeline phản ứng thế nào?', 'Một bảng rất lớn cần snapshot lại thì làm sao không ảnh hưởng nguồn?'],
    commonMistakes: ['Dùng truy vấn theo updated_at rồi vẫn nói là bắt được xóa.', 'MERGE theo từng sự kiện, sinh quá nhiều commit và tệp nhỏ.'],
  },
  {
    id: 'iv-arch-sd-lakehouse-02',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-lakehouse', 'etl-governance'],
    interviewTypes: ['system-design', 'de'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Thiết kế nền tảng dữ liệu đa khách hàng cho một sản phẩm SaaS có 500 khách hàng.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** rủi ro lớn nhất là lộ dữ liệu giữa các khách hàng, nên cách ly là yêu cầu hàng đầu. Quy mô rất lệch: giả sử 10 khách hàng lớn chiếm 60% dữ liệu. Một số khách hàng có yêu cầu pháp lý về nơi lưu trữ. Cần hỏi mức cam kết và ai phải trả chi phí.

**Kiến trúc đề xuất:** dùng hai mô hình. **Dùng chung** cho khách hàng nhỏ: một bộ bảng có \`tenant_id\`, truy cập qua view hoặc chính sách theo dòng. **Tách riêng** cho khách hàng lớn hoặc có yêu cầu pháp lý: bảng, khóa mã hóa và tài nguyên tính toán riêng. Một lớp quản lý lưu cấu hình, hạn mức và mô hình của từng khách hàng.

**Lựa chọn công nghệ:** Iceberg hoặc Delta với catalog tập trung để phân quyền. Không phân vùng trực tiếp theo \`tenant_id\`, vì 500 giá trị rất lệch sẽ sinh nhiều tệp nhỏ. Tôi dùng bucket theo \`tenant_id\` kết hợp với ngày. Tính toán chia hàng đợi theo hạng, để một khách hàng không chiếm hết tài nguyên.

**Đánh đổi:** dùng chung rẻ và dễ vận hành, nhưng có rủi ro lộ dữ liệu và ảnh hưởng lẫn nhau. Tách riêng an toàn nhưng đắt, và phải vận hành nhiều bản. Xóa khách hàng trong mô hình tách riêng rất dễ, còn mô hình dùng chung phải viết lại tệp.

**Xử lý lỗi và giám sát:** cấm truy vấn trực tiếp bảng gốc. Thêm kiểm thử tự động: một khách hàng giả thử đọc dữ liệu của khách hàng khác, và phải thất bại. Lưu nhật ký truy cập. Theo dõi độ tươi, chi phí và tải theo từng khách hàng. Backfill và lỗi được xử lý theo từng khách hàng, để sự cố của một bên không dừng toàn bộ.`,
    keyPoints: [
      { text: 'Cách ly là yêu cầu hàng đầu', keywords: ['cách ly', 'lộ dữ liệu', 'isolation'], weight: 2 },
      { text: 'Phân biệt dùng chung và tách riêng', keywords: ['dùng chung', 'tách riêng', 'pool', 'silo'], weight: 2 },
      { text: 'Kiểm soát truy cập ở view hoặc chính sách theo dòng', keywords: ['theo dòng', 'row level', 'view', 'catalog'] },
      { text: 'Không phân vùng trực tiếp theo tenant_id', keywords: ['bucket', 'tệp nhỏ', 'tenant id'] },
      { text: 'Chống ảnh hưởng lẫn nhau và đo chi phí theo khách hàng', keywords: ['noisy neighbor', 'hạn mức', 'hàng đợi', 'chi phí theo'] },
    ],
    followUps: ['Một khách hàng yêu cầu xóa toàn bộ dữ liệu khi rời đi thì sao?', 'Làm sao kiểm thử được việc không lộ dữ liệu?'],
    commonMistakes: ['Chỉ dựa vào việc lập trình viên nhớ thêm điều kiện lọc tenant_id.', 'Phân vùng trực tiếp theo tenant_id mà không tính đến độ lệch.'],
  },
  {
    id: 'iv-arch-sd-lakehouse-03',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-lakehouse', 'dw-data-warehouse'],
    interviewTypes: ['system-design', 'de'],
    levels: ['senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Lập kế hoạch chuyển một kho dữ liệu cũ tại chỗ, 50 TB, 800 job ETL và 2.000 báo cáo, lên cloud.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** vì sao chuyển, hạn hợp đồng ở đâu, và yêu cầu về dừng hệ thống. Tính thử: 50 TB qua đường 1 Gbps mất khoảng 4,6 ngày nếu dùng hết băng thông, thực tế khoảng 9 ngày ở mức 50%. Vì vậy có thể cần đường riêng hoặc thiết bị chuyển dữ liệu vật lý. Chốt sổ tài chính là thời điểm không được chuyển đổi.

**Kiến trúc đề xuất:** làm theo từng đợt. Đầu tiên kiểm kê bằng query log, vì thường nhiều báo cáo không còn ai dùng và có thể bỏ. Chuyển theo miền nghiệp vụ, bắt đầu từ miền ít rủi ro. Mỗi miền gồm nạp ban đầu, đồng bộ phần thay đổi, chạy song song hai bên, đối soát, chuyển đổi, và cuối cùng mới tắt phía cũ.

**Lựa chọn công nghệ:** kho quản lý như Snowflake hay BigQuery phù hợp nếu chủ yếu là BI và đội quen SQL. Lakehouse phù hợp nếu có nhiều nhu cầu ngoài SQL. Có thể dùng công cụ chuyển đổi SQL, nhưng vẫn phải kiểm tra thủ công vì các hệ khác nhau về kiểu dữ liệu và xử lý null.

**Đánh đổi:** chuyển nguyên trạng thì nhanh, nhưng mang theo nợ kỹ thuật và có thể tốn kém, vì cách tính tiền trên cloud khác. Thiết kế lại thì tốt hơn nhưng lâu và rủi ro hơn. Tôi chuyển nguyên trạng phần lớn, và chỉ thiết kế lại những gì không chạy tốt. Chạy song song tốn gấp đôi trong nhiều tháng.

**Xử lý lỗi và giám sát:** đối soát số dòng, tổng các cột số, và kết quả các báo cáo chính, với ngưỡng rõ ràng. Mỗi miền có kế hoạch quay lại. Đóng băng thay đổi trên đối tượng đang chuyển. Đặt ngân sách và cảnh báo chi phí ngay từ đầu.`,
    keyPoints: [
      { text: 'Kiểm kê và bỏ phần không dùng', keywords: ['kiểm kê', 'query log', 'không dùng', 'bỏ'], weight: 2 },
      { text: 'Tính thời gian chuyển dữ liệu', keywords: ['1 gbps', '4,6 ngày', '9 ngày', 'băng thông', 'thiết bị'] },
      { text: 'Chuyển theo đợt và chạy song song', keywords: ['theo đợt', 'theo miền', 'song song'], weight: 2 },
      { text: 'Đối soát và có đường quay lại', keywords: ['đối soát', 'quay lại', 'rollback'], weight: 2 },
      { text: 'Khác biệt SQL và chi phí cloud', keywords: ['khác biệt', 'chuyển đổi sql', 'ngân sách', 'chi phí'] },
    ],
    followUps: ['Hai bên lệch nhau 0,01% ở một báo cáo, bạn quyết định thế nào?'],
    commonMistakes: ['Chuyển một lần vào cuối tuần.', 'Chuyển cả những báo cáo không còn ai dùng.'],
  },
  {
    id: 'iv-arch-sd-lakehouse-04',
    topicId: 'architecture',
    category: 'arch-patterns',
    conceptIds: ['arch-lakehouse', 'dw-medallion'],
    interviewTypes: ['system-design', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Thiết kế cách tổ chức dữ liệu trên Lakehouse cho một công ty có 20 nguồn dữ liệu, phục vụ cả BI lẫn Data Science.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** có khoảng 200 GB mới mỗi ngày từ OLTP, API và tệp. BI cần bảng ổn định trước 8 giờ sáng. Data Science cần dữ liệu chi tiết, kể cả các cột chưa được chuẩn hóa. Có một số cột chứa dữ liệu cá nhân.

**Kiến trúc đề xuất:** dùng ba lớp Medallion. **Bronze** giữ nguyên dữ liệu từ nguồn, chỉ thêm thời điểm nạp và tên nguồn, chỉ ghi thêm. **Silver** khử trùng, chuẩn hóa kiểu và múi giờ, thống nhất khóa, và che dữ liệu cá nhân. **Gold** là các bảng theo nghiệp vụ, thường theo star schema. BI đọc Gold, còn Data Science đọc Silver và tự tạo bảng riêng trong một vùng làm việc.

**Lựa chọn công nghệ:** Iceberg hoặc Delta để có giao dịch và time travel. Spark cho khối lượng lớn ở Bronze sang Silver. dbt cho Silver sang Gold, vì logic chủ yếu là SQL và cần kiểm thử, tài liệu. Airflow để điều phối. Một catalog chung để phân quyền theo lớp.

**Đánh đổi:** ba lớp thì tốn lưu trữ và thêm độ trễ, đổi lại mỗi lớp có trách nhiệm rõ ràng, và sửa lỗi không phải đọc lại nguồn. Nguồn đơn giản có thể không cần đủ cả ba lớp. Nếu chuẩn hóa quá nhiều ở Silver thì Data Science mất chi tiết, nên phần chuẩn hóa nghiệp vụ nên để ở Gold.

**Xử lý lỗi và giám sát:** đặt cổng chất lượng khi chuyển lớp. Dữ liệu lỗi được cách ly và không làm hỏng lớp sau. Ghi đè theo partition để chạy lại được. Theo dõi độ tươi và số dòng ở từng lớp, để nhanh chóng biết lỗi bắt đầu từ đâu.`,
    keyPoints: [
      { text: 'Trách nhiệm từng lớp Bronze, Silver, Gold', keywords: ['bronze', 'silver', 'gold', 'medallion'], weight: 2 },
      { text: 'Giữ nguyên dữ liệu thô để tính lại', keywords: ['giữ nguyên', 'tính lại', 'chỉ ghi thêm'] },
      { text: 'BI đọc Gold, Data Science đọc Silver', keywords: ['đọc gold', 'đọc silver', 'data science'], weight: 2 },
      { text: 'Cổng chất lượng giữa các lớp', keywords: ['cổng chất lượng', 'kiểm tra', 'cách ly'] },
    ],
    followUps: ['Che dữ liệu cá nhân ở lớp nào, và vì sao?'],
    commonMistakes: ['Cho người dùng BI đọc trực tiếp Bronze.', 'Làm sạch ngay ở Bronze, làm mất dữ liệu gốc.'],
  },
  {
    id: 'iv-arch-sd-lakehouse-05',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-lakehouse', 'etl-governance', 'etl-lineage'],
    interviewTypes: ['system-design', 'de'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Thiết kế quy trình xóa dữ liệu cá nhân theo yêu cầu riêng tư, trên một nền tảng dùng Kafka, Lakehouse dữ liệu bất biến và các bản sao lưu.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** với GDPR, phải phản hồi trong một tháng, có thể gia hạn thêm hai tháng với yêu cầu phức tạp. Giả sử 1.000 yêu cầu mỗi tháng. Cái khó là dữ liệu bất biến và có nhiều bản sao: Kafka, Lakehouse, time travel, sao lưu, log. Cần pháp lý xác định dữ liệu nào phải giữ lại theo luật và thế nào là đã ẩn danh.

**Kiến trúc đề xuất:** một dịch vụ nhận và xác minh yêu cầu, gán mã yêu cầu. Dùng catalog và lineage để biết cột cá nhân nằm ở đâu, rồi điều phối việc xóa ở từng hệ thống. Duy trì một **danh sách chặn**, áp dụng trong mọi pipeline, để phát lại hoặc backfill không đưa dữ liệu đã xóa quay lại. Giảm phạm vi ngay từ thiết kế: tách dữ liệu cá nhân vào kho riêng, dùng mã giả danh ở các bảng còn lại.

**Lựa chọn công nghệ:** Delta và Iceberg có xóa theo dòng. Nhưng với deletion vector, phải viết lại tệp rồi \`VACUUM\`, ngưỡng mặc định 7 ngày, hoặc expire snapshot với Iceberg, thì mới xóa vật lý. Kafka dùng retention ngắn hoặc tombstone trên topic compact. Có thể mã hóa theo từng người rồi xóa khóa, nhưng cần pháp lý xác nhận.

**Đánh đổi:** gom xóa theo tuần rẻ hơn nhiều so với viết lại tệp cho từng yêu cầu, miễn còn trong hạn. Rút ngắn time travel làm giảm khả năng khôi phục. Sao lưu thường hết hạn theo lịch thay vì xóa từng dòng.

**Xử lý lỗi và giám sát:** mỗi bước idempotent và thử lại được. Lưu nhật ký kiểm toán chỉ với mã yêu cầu, không ghi dữ liệu cá nhân. Sau khi xóa, chạy job kiểm chứng. Cảnh báo khi yêu cầu còn tồn đọng ở ngày thứ 20, trước hạn.`,
    keyPoints: [
      { text: 'Biết hạn pháp lý và cần tư vấn pháp lý', keywords: ['một tháng', 'gdpr', 'pháp lý'], weight: 2 },
      { text: 'Dùng catalog và lineage để tìm dữ liệu', keywords: ['catalog', 'lineage', 'cột cá nhân'] },
      { text: 'Danh sách chặn để phát lại không đưa dữ liệu quay lại', keywords: ['danh sách chặn', 'phát lại', 'backfill', 'quay lại'], weight: 2 },
      { text: 'Xóa logic khác xóa vật lý', keywords: ['xóa vật lý', 'vacuum', 'deletion vector', 'expire snapshot', 'viết lại tệp'], weight: 2 },
      { text: 'Giả danh hoặc tách dữ liệu cá nhân', keywords: ['giả danh', 'pseudonym', 'mã hóa', 'xóa khóa', 'crypto'] },
      { text: 'Kiểm chứng và nhật ký kiểm toán', keywords: ['kiểm chứng', 'kiểm toán', 'audit'] },
    ],
    followUps: ['Kết quả tổng hợp có phải xóa không?', 'Làm sao xử lý dữ liệu trong bản sao lưu?'],
    commonMistakes: ['Chỉ chạy DELETE trên bảng chính và coi như xong.', 'Quên việc phát lại log sẽ đưa dữ liệu đã xóa quay lại.'],
  },

  /* ---------- arch-pipeline-design ---------- */
  {
    id: 'iv-arch-sd-pipeline-design-01',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-pipeline-design', 'dw-star-schema'],
    interviewTypes: ['system-design', 'de'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Thiết kế pipeline phân tích cho một sàn thương mại điện tử, từ đơn hàng và lượt nhấp đến dashboard kinh doanh.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** có khoảng 2 triệu đơn và 50 triệu sự kiện nhấp mỗi ngày, mỗi sự kiện 1 KB, tức 50 GB thô. Đội kinh doanh cần báo cáo trước 8 giờ sáng, không ai ra quyết định theo phút. Cần giữ 3 năm. Doanh thu phải khớp với số của tài chính.

**Kiến trúc đề xuất:** đơn hàng đi qua CDC hoặc incremental từ OLTP. Sự kiện nhấp đi qua Kafka vào Bronze. Spark làm sạch và khử trùng thành Silver. Gold là star schema gồm \`fact_orders\`, \`fact_clicks\` và các dimension, với \`dim_product\` theo SCD Type 2 để giữ giá tại thời điểm bán. BI đọc từ kho hoặc qua engine truy vấn.

**Lựa chọn công nghệ:** Kafka vì sự kiện nhấp có đỉnh tải cao và có thể có nhiều nơi cùng đọc. Spark vì khối lượng hàng chục GB mỗi ngày và cần join lớn. Parquet với partition theo ngày giảm dữ liệu phải đọc. Airflow điều phối theo phụ thuộc. Tôi chọn batch cho các bảng chính vì đúng với nhu cầu.

**Đánh đổi:** batch đơn giản, rẻ, nhưng số không có trong ngày. Nếu cần có thể chạy theo giờ cho một vài chỉ số. Star schema dễ dùng cho BI, nhưng phải duy trì dimension. Sự kiện nhấp đi qua Kafka thì tốn thêm một hệ thống, nhưng tách được website khỏi pipeline.

**Xử lý lỗi và giám sát:** ghi đè theo partition nên chạy lại an toàn. Mỗi đêm tính lại 3 ngày gần nhất để nhận sự kiện trễ. Cổng chất lượng chặn công bố khi số dòng hoặc tỷ lệ null bất thường. Đối soát doanh thu với tài chính mỗi ngày. Theo dõi độ tươi, và báo sớm khi có nguy cơ trễ 8 giờ.`,
    keyPoints: [
      { text: 'Ước lượng quy mô và độ tươi cần thiết', keywords: ['50 gb', '2 triệu', 'trước 8 giờ', 'quy mô'], weight: 2 },
      { text: 'Tách luồng đơn hàng và sự kiện nhấp', keywords: ['cdc', 'kafka', 'incremental'], weight: 2 },
      { text: 'Star schema, SCD cho dimension', keywords: ['star schema', 'scd', 'fact orders', 'dimension'] },
      { text: 'Chạy lại an toàn và xử lý dữ liệu trễ', keywords: ['ghi đè', 'chạy lại', 'trễ', 'idempotent'] },
      { text: 'Đối soát doanh thu với tài chính', keywords: ['đối soát', 'tài chính', 'khớp'] },
    ],
    followUps: ['Một đơn hàng bị hoàn tiền sau 2 tuần thì được thể hiện thế nào?'],
    commonMistakes: ['Đề xuất stream cho mọi thứ khi nhu cầu là báo cáo sáng.', 'Bỏ qua việc đối soát với tài chính.'],
  },
  {
    id: 'iv-arch-sd-pipeline-design-02',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-pipeline-design', 'etl-ingestion'],
    interviewTypes: ['system-design', 'de'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Công ty nhận dữ liệu từ 50 đối tác với định dạng khác nhau, và mỗi tháng có thêm vài đối tác mới. Thiết kế hệ thống thu thập.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** đối tác gửi CSV, JSON, Excel hoặc qua API, từ vài MB đến 500 GB mỗi ngày. Mục tiêu là thêm đối tác mới trong vài ngày thay vì vài tuần. Đối tác lớn có cam kết chặt hơn đối tác nhỏ. Dữ liệu cuối cùng phải về một mô hình chung.

**Kiến trúc đề xuất:** dùng framework điều khiển bằng cấu hình. Mỗi đối tác có một tệp cấu hình mô tả định dạng, lịch, schema, ánh xạ cột sang mô hình chung và luật kiểm tra. Một engine dùng chung đọc cấu hình rồi thực hiện: chép bản gốc vào vùng thô, phân tích, kiểm tra, ánh xạ, ghi vào bảng chung. Thêm đối tác phần lớn chỉ cần thêm cấu hình.

**Lựa chọn công nghệ:** Spark đọc được nhiều định dạng và chịu được tệp lớn. Sự kiện của object storage kích hoạt xử lý ngay khi tệp đến. Airflow tạo DAG theo cấu hình. Lưu cấu hình trong Git để có review và lịch sử.

**Đánh đổi:** framework tốn công ban đầu, và chỉ đáng giá khi số đối tác đủ nhiều. Luôn có đối tác không khớp với khuôn, nên phải cho phép viết plugin riêng, thay vì thêm vô số tùy chọn vào cấu hình. Cấu hình quá linh hoạt thì lại trở thành một ngôn ngữ lập trình khó kiểm thử.

**Xử lý lỗi và giám sát:** lỗi của một đối tác không được ảnh hưởng đến đối tác khác, nên chạy cách ly theo đối tác. Mã băm của tệp giúp nhận ra tệp gửi lại. Tệp lỗi vào vùng cách ly, có thông báo tự động tới đầu mối đối tác kèm lý do. Tôi theo dõi tệp không đến đúng hạn, tỷ lệ dòng lỗi, và thay đổi schema theo từng đối tác trên một dashboard.`,
    keyPoints: [
      { text: 'Framework điều khiển bằng cấu hình', keywords: ['cấu hình', 'metadata', 'config', 'framework'], weight: 2 },
      { text: 'Có đường ra cho trường hợp đặc biệt', keywords: ['plugin', 'trường hợp đặc biệt', 'không khớp'] },
      { text: 'Cách ly lỗi theo đối tác', keywords: ['cách ly', 'không ảnh hưởng', 'theo đối tác'], weight: 2 },
      { text: 'Giữ bản gốc và phát hiện tệp trùng', keywords: ['bản gốc', 'mã băm', 'vùng thô', 'hash'] },
      { text: 'Giám sát tệp đến trễ và schema theo đối tác', keywords: ['không đến', 'đúng hạn', 'thay đổi schema'] },
    ],
    followUps: ['Một đối tác đổi định dạng mà không báo trước thì sao?'],
    commonMistakes: ['Viết một pipeline riêng cho từng đối tác.', 'Để một đối tác lỗi làm dừng toàn bộ DAG.'],
  },
  {
    id: 'iv-arch-sd-pipeline-design-03',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-pipeline-design', 'etl-incremental'],
    interviewTypes: ['system-design', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Thiết kế pipeline lấy dữ liệu từ API của một phần mềm CRM, giới hạn 100 yêu cầu mỗi phút, có 2 triệu bản ghi.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** mỗi trang có 100 bản ghi, nên lấy toàn bộ cần 20.000 yêu cầu, tức 200 phút nếu dùng hết hạn mức. Mỗi ngày có khoảng 50.000 bản ghi thay đổi, cần 500 yêu cầu, khoảng 5 phút. Vì vậy phải lấy theo incremental. Dữ liệu cần mới trong 1 giờ.

**Kiến trúc đề xuất:** mỗi giờ, job gọi API lọc theo \`updated_at\`, bắt đầu từ con trỏ đã lưu trừ đi 10 phút để không bỏ sót. Lưu con trỏ sau mỗi trang. JSON nguyên bản được ghi vào vùng thô, rồi \`MERGE\` theo \`id\` vào bảng sạch. Mỗi tuần chạy một lần lấy toàn bộ vào ban đêm để đối soát.

**Lựa chọn công nghệ:** một job Python trên Airflow là đủ, vì khối lượng nhỏ và không cần xử lý phân tán. Trước khi tự viết, tôi xem Airbyte hoặc Fivetran đã có connector chưa, vì mua có thể rẻ hơn tự duy trì.

**Đánh đổi:** khoảng chồng lấn 10 phút sẽ lấy trùng một ít, và \`MERGE\` xử lý được việc đó. Lấy toàn bộ hằng tuần tốn hạn mức, nhưng là cách duy nhất để phát hiện bản ghi đã bị xóa nếu API không trả về. Lưu JSON gốc thì tốn thêm lưu trữ, đổi lại không mất dữ liệu khi có trường mới.

**Xử lý lỗi và giám sát:** khi nhận mã 429 thì chờ theo \`Retry-After\`, thử lại với thời gian tăng dần và ngẫu nhiên. Lỗi giữa chừng thì chạy tiếp từ con trỏ. Nếu nhiều job dùng chung hạn mức thì cần điều phối. Tôi theo dõi hạn mức đã dùng, độ trễ của con trỏ, và chênh lệch giữa tổng số bản ghi của API và bảng đích.`,
    keyPoints: [
      { text: 'Tính yêu cầu và thời gian theo hạn mức', keywords: ['20.000', '200 phút', 'hạn mức', 'rate limit'], weight: 2 },
      { text: 'Incremental với con trỏ và chồng lấn', keywords: ['incremental', 'con trỏ', 'cursor', 'chồng lấn', 'updated at'], weight: 2 },
      { text: 'MERGE theo id', keywords: ['merge', 'upsert', 'theo id'] },
      { text: 'Lấy toàn bộ định kỳ để phát hiện bản ghi bị xóa', keywords: ['bị xóa', 'lấy toàn bộ', 'full load', 'đối soát'] },
      { text: 'Backoff khi bị giới hạn', keywords: ['429', 'retry after', 'backoff', 'tăng dần'] },
    ],
    followUps: ['Nếu API không có bộ lọc theo updated_at thì sao?'],
    commonMistakes: ['Lấy toàn bộ mỗi lần.', 'Không tính xem hạn mức có đủ không.'],
  },
  {
    id: 'iv-arch-sd-pipeline-design-04',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-pipeline-design', 'cloud-s3'],
    interviewTypes: ['system-design', 'de'],
    levels: ['senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Hóa đơn cloud của nền tảng dữ liệu là 100.000 USD mỗi tháng, tăng 40% trong 6 tháng, trong khi dữ liệu chỉ tăng 10%. Bạn tối ưu thế nào?',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** chi phí tăng nhanh hơn dữ liệu nghĩa là có thứ khác đang thay đổi, nên tôi không giảm chi phí một cách đồng loạt. Trước tiên phải biết tiền đi đâu: tính toán, lưu trữ, truyền dữ liệu, chia theo đội và pipeline. Cần gắn thẻ tài nguyên nếu chưa có. Cũng cần biết SLO nào không được phá vỡ.

**Kiến trúc đề xuất:** không phải kiến trúc mới, mà là một quy trình theo thứ tự lợi ích. Một, **dừng** những gì không ai dùng: dùng query log và lineage tìm bảng, dashboard không có người đọc. Hai, **giảm độ tươi** nơi không cần: job mỗi giờ thành mỗi ngày. Ba, **giảm dữ liệu phải quét**: partition, clustering, gộp tệp nhỏ, chuyển full load sang incremental. Bốn, **tối ưu tài nguyên**: tự động co giãn, tự tắt kho khi rảnh, Spot cho batch. Năm, **lưu trữ**: chuyển lớp lạnh theo vòng đời và giảm thời gian giữ.

**Lựa chọn công nghệ:** dùng công cụ chi phí của cloud cùng bảng tự tổng hợp. Spot hợp với batch vì chạy lại được, còn Reserved hợp với tải nền ổn định.

**Đánh đổi:** Spot có thể bị thu hồi nên job phải chịu được lỗi. Lớp lưu trữ lạnh tốn phí khi đọc, nên phải biết cách truy cập trước khi chuyển. Giảm thời gian giữ làm giảm khả năng tính lại. Công sức kỹ thuật cũng là chi phí, nên chỉ làm những việc có lợi rõ.

**Xử lý lỗi và giám sát:** theo dõi chi phí trên đơn vị, như theo TB xử lý hoặc theo truy vấn, thay vì chỉ tổng số. Đặt ngân sách theo đội và cảnh báo bất thường, giới hạn truy vấn chạy quá lớn. Sau mỗi thay đổi, kiểm tra SLO, để không đổi chi phí lấy độ tin cậy.`,
    keyPoints: [
      { text: 'Đo và phân bổ chi phí trước', keywords: ['gắn thẻ', 'phân bổ', 'tiền đi đâu', 'theo đội'], weight: 2 },
      { text: 'Dừng những gì không ai dùng', keywords: ['không ai dùng', 'không có người đọc', 'query log'], weight: 2 },
      { text: 'Giảm độ tươi không cần thiết', keywords: ['độ tươi', 'mỗi giờ', 'mỗi ngày'] },
      { text: 'Giảm dữ liệu phải quét', keywords: ['partition', 'clustering', 'gộp tệp', 'incremental'] },
      { text: 'Spot, co giãn và vòng đời lưu trữ', keywords: ['spot', 'co giãn', 'lớp lạnh', 'vòng đời'] },
      { text: 'Theo dõi chi phí trên đơn vị và SLO', keywords: ['chi phí trên', 'ngân sách', 'slo'] },
    ],
    followUps: ['Một truy vấn của Data Science làm tốn 5.000 USD trong một ngày, bạn ngăn thế nào?'],
    commonMistakes: ['Giảm kích thước cụm cho mọi thứ khi chưa biết tiền đi đâu.', 'Chỉ nhắc đến nén và định dạng tệp.'],
  },
  {
    id: 'iv-arch-sd-pipeline-design-05',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-pipeline-design', 'dw-schema-evolution'],
    interviewTypes: ['system-design', 'de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Các đội sản phẩm thường đổi schema mà không báo, làm pipeline dữ liệu hỏng. Thiết kế cách để thay đổi schema không còn gây sự cố.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** giả sử có 100 dịch vụ gửi dữ liệu. Về nguyên lý, bên ghi và bên đọc được triển khai độc lập, nên tại một thời điểm luôn có phiên bản cũ và mới cùng tồn tại. Vì vậy mỗi thay đổi phải tương thích với cả hai. Vấn đề không chỉ là kỹ thuật, mà là ai chịu trách nhiệm cho hợp đồng dữ liệu.

**Kiến trúc đề xuất:** có ba lớp bảo vệ. Một, **hợp đồng dữ liệu** thuộc về đội tạo ra dữ liệu, và CI chặn thay đổi không tương thích ngay khi mở pull request. Hai, **quy trình mở rộng rồi thu hẹp**: thêm trường mới, ghi cả hai, chuyển người đọc, rồi mới bỏ trường cũ. Thay đổi phá vỡ thì tạo topic phiên bản mới. Ba, **Bronze giữ dữ liệu thô** và Silver ánh xạ tường minh, nên sửa ánh xạ xong có thể chạy lại.

**Lựa chọn công nghệ:** Schema Registry với chế độ tương thích như BACKWARD cho Kafka. Định dạng bảng như Iceberg theo dõi cột bằng ID, nên đổi tên cột an toàn hơn. Lineage cho biết ai bị ảnh hưởng, và hiển thị ngay trong pull request.

**Đánh đổi:** chặn chặt làm chậm đội sản phẩm, nên chỉ áp dụng cho dữ liệu quan trọng. Tự động thêm cột mới giúp ít hỏng, nhưng có thể che đi thay đổi ý nghĩa. Công cụ kiểm tra được kiểu dữ liệu, chứ không kiểm tra được đơn vị đổi từ đồng sang nghìn đồng.

**Xử lý lỗi và giám sát:** phát hiện thay đổi schema và thông báo cho đúng chủ sở hữu. Bản ghi không hợp lệ được đưa vào cách ly, có đường chạy lại. Đồng thời theo dõi phân phối giá trị để bắt thay đổi về ý nghĩa.`,
    keyPoints: [
      { text: 'Bên ghi và bên đọc triển khai độc lập', keywords: ['độc lập', 'cũ và mới', 'tương thích'], weight: 2 },
      { text: 'Hợp đồng dữ liệu và kiểm tra trong CI', keywords: ['hợp đồng dữ liệu', 'data contract', 'ci', 'pull request'], weight: 2 },
      { text: 'Mở rộng rồi thu hẹp', keywords: ['mở rộng rồi thu hẹp', 'expand', 'ghi cả hai', 'dual write', 'phiên bản mới'] },
      { text: 'Schema Registry', keywords: ['schema registry', 'backward'] },
      { text: 'Giữ dữ liệu thô để chạy lại', keywords: ['dữ liệu thô', 'bronze', 'chạy lại'] },
    ],
    followUps: ['Thay đổi về ý nghĩa, như đổi đơn vị, được phát hiện thế nào?'],
    commonMistakes: ['Chỉ đề xuất công cụ mà không nói ai chịu trách nhiệm.', 'Cho rằng bật tự động cập nhật schema là đủ.'],
  },

  /* ---------- arch-monitoring-logging ---------- */
  {
    id: 'iv-arch-sd-monitoring-logging-01',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-monitoring-logging', 'arch-pipeline-design'],
    interviewTypes: ['system-design', 'de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Bạn phụ trách một pipeline hằng ngày gồm 4 bước, xử lý 1 triệu đơn hàng. Thiết kế phần giám sát cho nó.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** ai dùng dữ liệu, cần trước mấy giờ, và lỗi thì ảnh hưởng gì. Giả sử đội kinh doanh cần trước 8 giờ, và chỉ có một mình tôi phụ trách. Vì quy mô nhỏ nên giải pháp cũng phải nhỏ và dễ duy trì.

**Kiến trúc đề xuất:** sau mỗi bước, job ghi một dòng vào bảng \`pipeline_runs\` gồm mã lần chạy, ngày dữ liệu, số dòng vào, số dòng ra, thời lượng. Một bước kiểm tra chạy sau cùng, so số liệu với lịch sử và kiểm tra vài luật như đơn giá không âm, mã đơn không null. Nếu có vấn đề thì gửi thông báo vào kênh chat, kèm đường dẫn tới log.

**Lựa chọn công nghệ:** dùng retry và callback có sẵn của Airflow, kiểm tra bằng SQL hoặc dbt test. Dashboard đơn giản đọc từ bảng \`pipeline_runs\`. Tôi chưa cần công cụ observability trả phí với một pipeline, vì chi phí không tương xứng.

**Đánh đổi:** ngưỡng cố định thì dễ làm, nhưng có thể báo nhầm vào ngày lễ hay ngày khuyến mãi. So với cùng thứ tuần trước sẽ giảm được phần lớn báo nhầm. Kiểm tra nhiều quá thì làm chậm pipeline và tạo nhiều cảnh báo, nên chỉ kiểm tra những cột quan trọng.

**Xử lý lỗi và giám sát:** mỗi bước được retry 2 lần với thời gian chờ tăng dần. Có ba cảnh báo chính: job lỗi sau khi đã retry, số dòng thấp hơn 70% so với cùng thứ tuần trước, và 7 giờ 30 chưa xong. Tôi viết một trang hướng dẫn ngắn: gặp cảnh báo nào thì kiểm tra gì trước, và báo cho ai.`,
    keyPoints: [
      { text: 'Giám sát phù hợp với quy mô nhỏ', keywords: ['đơn giản', 'quy mô nhỏ', 'chưa cần', 'dễ duy trì'] },
      { text: 'Ghi số dòng vào, ra và thời lượng', keywords: ['số dòng', 'thời lượng', 'pipeline runs'], weight: 2 },
      { text: 'Kiểm tra chất lượng sau khi chạy', keywords: ['kiểm tra', 'dbt test', 'null', 'luật'] },
      { text: 'Cảnh báo lỗi, số dòng thấp và trễ hạn', keywords: ['cảnh báo', 'trễ', 'chưa xong', 'thấp hơn'], weight: 2 },
      { text: 'Có hướng dẫn xử lý', keywords: ['hướng dẫn', 'runbook'] },
    ],
    followUps: ['Vì sao so sánh với cùng thứ tuần trước tốt hơn so với hôm qua?'],
    commonMistakes: ['Chỉ cảnh báo khi job lỗi.', 'Đề xuất nền tảng phức tạp cho một pipeline nhỏ.'],
  },
  {
    id: 'iv-arch-sd-monitoring-logging-02',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-monitoring-logging', 'kafka-overview'],
    interviewTypes: ['system-design', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Thiết kế hệ thống thu thập log tập trung cho 100 dịch vụ, mỗi dịch vụ tạo khoảng 20 GB log mỗi ngày.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** tổng cộng 2 TB mỗi ngày. Kỹ sư cần tìm kiếm trong vài giây với log 7 ngày gần nhất, còn kiểm toán cần giữ 1 năm và chấp nhận truy vấn chậm. Lượng log tăng đột biến khi có sự cố, đúng lúc cần nó nhất. Log có thể chứa dữ liệu cá nhân.

**Kiến trúc đề xuất:** một agent trên mỗi máy đọc log rồi gửi vào Kafka. Từ Kafka có hai đường: một đường ghi vào kho tìm kiếm cho 7 ngày, một đường ghi Parquet lên object storage cho 1 năm. Log được chuẩn hóa thành JSON gồm tên dịch vụ, mức độ, thời gian và \`trace_id\`.

**Lựa chọn công nghệ:** Fluent Bit làm agent vì nhẹ. Kafka để chịu đột biến và cho nhiều nơi cùng đọc, và kho tìm kiếm chậm không làm ảnh hưởng tới dịch vụ. OpenSearch tìm kiếm toàn văn tốt, nhưng 7 ngày là 14 TB chưa tính bản sao, nên khá tốn kém. Loki rẻ hơn vì chỉ lập chỉ mục theo nhãn, đổi lại tìm kiếm chậm hơn. Dữ liệu lạnh dùng Trino hoặc Athena.

**Đánh đổi:** giữ mọi log ở mức DEBUG thì đầy đủ nhưng rất tốn, nên tôi lấy mẫu log DEBUG và giữ đầy đủ log lỗi. Thêm Kafka thì phức tạp hơn, nhưng tách được dịch vụ khỏi kho tìm kiếm.

**Xử lý lỗi và giám sát:** agent đệm xuống đĩa khi mất kết nối. Khi quá tải, bỏ DEBUG trước, giữ ERROR. Che dữ liệu cá nhân ngay tại agent, trước khi rời khỏi máy. Tôi theo dõi độ trễ từ lúc ghi đến lúc tìm được, số log bị bỏ, và lỗi khi lập chỉ mục.`,
    keyPoints: [
      { text: 'Ước lượng dung lượng và phân tầng lưu trữ', keywords: ['2 tb', '14 tb', 'phân tầng', '7 ngày', 'lạnh'], weight: 2 },
      { text: 'Agent, Kafka làm bộ đệm', keywords: ['agent', 'fluent bit', 'kafka', 'bộ đệm'], weight: 2 },
      { text: 'Log có cấu trúc với trace_id', keywords: ['trace id', 'json', 'cấu trúc'] },
      { text: 'So sánh chi phí kho tìm kiếm', keywords: ['opensearch', 'elasticsearch', 'loki'] },
      { text: 'Lấy mẫu và che dữ liệu cá nhân', keywords: ['lấy mẫu', 'sampling', 'che dữ liệu', 'cá nhân', 'mask'] },
    ],
    followUps: ['Khi có sự cố, lượng log tăng gấp 10 lần, hệ thống phản ứng thế nào?'],
    commonMistakes: ['Giữ mọi log trong kho tìm kiếm suốt một năm.', 'Quên rằng log có thể chứa dữ liệu nhạy cảm.'],
  },
  {
    id: 'iv-arch-sd-monitoring-logging-03',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-monitoring-logging', 'arch-reliability'],
    interviewTypes: ['system-design', 'de'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Thiết kế hệ thống cảnh báo cho 200 pipeline của nhiều đội, sao cho không bỏ sót sự cố lớn và không làm người trực kiệt sức.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** có 200 pipeline, khoảng 10 đội, hiện có khoảng 300 cảnh báo mỗi ngày. Tôi cần biết bảng nào quan trọng, ai là chủ sở hữu, và người dùng thực sự cần gì. Mục tiêu là mỗi cảnh báo gọi người trực đều cần hành động ngay.

**Kiến trúc đề xuất:** các nguồn tín hiệu là orchestrator, kiểm tra chất lượng và độ tươi của bảng, đều gửi về một dịch vụ cảnh báo chung. Dịch vụ này đọc cấu hình theo từng bộ dữ liệu: tầng quan trọng, SLO, chủ sở hữu. Nó dùng lineage để gom các cảnh báo cùng nguyên nhân, rồi định tuyến: tầng 1 gọi người trực, tầng 2 tạo ticket, tầng 3 chỉ ghi nhận.

**Lựa chọn công nghệ:** Prometheus và Alertmanager cho metric, PagerDuty hoặc Opsgenie cho lịch trực và leo thang. Cấu hình lưu trong Git để có review. Tôi tái sử dụng công cụ có sẵn thay vì tự xây, vì giá trị chính nằm ở các quy tắc.

**Đánh đổi:** phân tầng chặt thì ít cảnh báo hơn, nhưng lỗi ở bảng tầng 3 có thể không ai xem trong nhiều ngày, và điều đó là chấp nhận được với mức ảnh hưởng thấp. Gom theo lineage giảm nhiễu, nhưng lineage sai có thể gom nhầm hai sự cố khác nhau.

**Xử lý lỗi và giám sát:** cần giám sát cả hệ thống giám sát, dùng tín hiệu heartbeat: nếu không nhận được thì báo động, vì hệ thống cảnh báo hỏng thì sẽ không có cảnh báo nào. Mỗi cảnh báo có hướng dẫn xử lý. Hằng tuần, tôi xem lại tỷ lệ cảnh báo cần hành động, số sự cố do người dùng phát hiện trước, và bỏ các cảnh báo vô ích.`,
    keyPoints: [
      { text: 'Phân tầng theo mức quan trọng', keywords: ['phân tầng', 'tầng 1', 'quan trọng'], weight: 2 },
      { text: 'Định tuyến đến đúng chủ sở hữu', keywords: ['chủ sở hữu', 'định tuyến', 'owner', 'lịch trực'], weight: 2 },
      { text: 'Gom cảnh báo theo nguyên nhân', keywords: ['gom', 'lineage', 'cùng nguyên nhân'] },
      { text: 'Giám sát hệ thống giám sát', keywords: ['heartbeat', 'giám sát cả', 'dead man'] },
      { text: 'Xem lại chất lượng cảnh báo định kỳ', keywords: ['xem lại', 'tỷ lệ cảnh báo', 'hằng tuần'] },
    ],
    followUps: ['Làm sao thuyết phục các đội chịu trách nhiệm cảnh báo của mình?'],
    commonMistakes: ['Gửi mọi cảnh báo vào một kênh chung.', 'Quên giám sát chính hệ thống cảnh báo.'],
  },

  /* ---------- arch-reliability ---------- */
  {
    id: 'iv-arch-sd-reliability-01',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-reliability', 'etl-idempotency', 'dw-scd'],
    interviewTypes: ['system-design', 'de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn cần backfill bảng doanh thu của 2 năm sau khi sửa công thức, trong khi bảng vẫn đang phục vụ người dùng. Thiết kế việc backfill an toàn.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** có 730 partition, mỗi partition chạy 30 phút, tổng cộng 365 giờ, chạy 10 song song thì khoảng 36,5 giờ. Tôi hỏi: dữ liệu nguồn còn đủ không, có bảng nào phụ thuộc, có thể thay đổi số của kỳ đã chốt không. Coi backfill là một lần triển khai dữ liệu, nên phải kiểm chứng được và quay lại được.

**Kiến trúc đề xuất:** ghi vào bảng bóng \`fact_revenue_v2\`, không đụng bảng chính. Chia theo partition ngày, có một bảng trạng thái ghi lại từng partition để chạy tiếp được khi lỗi. Chạy trên tài nguyên riêng và giới hạn số song song. Khi xong, so sánh với bảng cũ rồi hoán đổi một cách nguyên tử, sau đó chạy lại các bảng phía sau theo lineage.

**Lựa chọn công nghệ:** Airflow với giới hạn song song. Iceberg hoặc Delta để ghi đè từng partition, hoán đổi và có time travel để quay lại. Với dimension, phải join theo giá trị tại thời điểm đó qua SCD Type 2, nếu không số lịch sử sẽ sai theo cách khác.

**Đánh đổi:** bảng bóng tốn gấp đôi lưu trữ trong một thời gian. Nhiều song song thì nhanh, nhưng tốn hơn và dễ ảnh hưởng đến nguồn chung. Chạy phần gần đây trước sẽ mang lại giá trị sớm nhất. Đổi số của kỳ đã chốt có thể cần thống nhất với tài chính.

**Xử lý lỗi và giám sát:** mỗi partition idempotent nên chạy lại an toàn. Đặt tiêu chuẩn so sánh trước: tổng doanh thu chỉ thay đổi đúng như công thức mới, các chiều khác không đổi. Theo dõi tiến độ, thời gian còn lại và độ trễ của job thường ngày. Quay lại bằng cách trỏ về phiên bản cũ. Báo cho người dùng trước khi số thay đổi.`,
    keyPoints: [
      { text: 'Ước lượng thời gian chạy', keywords: ['730', '365 giờ', '36,5', 'song song'] },
      { text: 'Ghi bảng bóng rồi hoán đổi nguyên tử', keywords: ['bảng bóng', 'shadow', 'hoán đổi', 'nguyên tử'], weight: 2 },
      { text: 'Chia nhỏ, chạy tiếp được, cách ly tài nguyên', keywords: ['partition', 'chạy tiếp', 'tài nguyên riêng', 'giới hạn'], weight: 2 },
      { text: 'Join dimension theo thời điểm lịch sử', keywords: ['scd', 'tại thời điểm', 'lịch sử'] },
      { text: 'So sánh trước khi công bố và chạy lại bảng phía sau', keywords: ['so sánh', 'kiểm chứng', 'phía sau', 'lineage'] },
    ],
    followUps: ['Trong lúc backfill có dữ liệu mới về thì xử lý ra sao?'],
    commonMistakes: ['Ghi đè trực tiếp lên bảng đang phục vụ.', 'Join với dimension hiện tại khi tính lại dữ liệu cũ.'],
  },
  {
    id: 'iv-arch-sd-reliability-02',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-reliability', 'etl-orchestration'],
    interviewTypes: ['system-design', 'de'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Báo cáo cho ban điều hành phải có trước 7 giờ sáng, nhưng tháng này đã trễ 6 lần. Thiết kế để báo cáo đúng hạn một cách ổn định.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** báo cáo dùng 12 nguồn. Đầu tiên tôi chuyển yêu cầu thành SLO, ví dụ đúng hạn trong 95% số ngày, và làm rõ khi thiếu nguồn thì nên công bố kèm ghi chú hay chờ. Sau đó xem 6 lần trễ vì đâu: nguồn đến muộn, job chậm dần, hay lỗi phải chờ người xử lý.

**Kiến trúc đề xuất:** tính ngược từ 7 giờ dọc theo **đường găng**, là chuỗi bước dài nhất quyết định thời gian hoàn thành. Giả sử: nguồn phải về trước 2 giờ, biến đổi xong trước 4 giờ, kiểm tra xong trước 5 giờ, còn lại 2 giờ dự phòng. Mỗi mốc có điểm kiểm tra, nên lúc 5 giờ đã biết có nguy cơ trễ, thay vì đến 7 giờ mới biết. Chạy theo phụ thuộc thay vì theo giờ cố định.

**Lựa chọn công nghệ:** Airflow với SLA callback hoặc Dagster với chính sách độ tươi. Dành tài nguyên riêng cho pipeline này để không tranh với job khác. Thỏa thuận thời hạn với đội của từng nguồn.

**Đánh đổi:** tài nguyên riêng tốn thêm tiền lúc rảnh, nhưng rẻ hơn so với báo cáo trễ. Bắt đầu sớm hơn thì có dư thời gian, nhưng nguồn có thể chưa đủ. Công bố kèm ghi chú thì đúng hạn nhưng thiếu dữ liệu, nên cần người dùng đồng ý từ trước.

**Xử lý lỗi và giám sát:** retry có giới hạn, và phải tính vào ngân sách thời gian. Khi hết giờ, công bố số gần nhất kèm ghi chú rõ ràng. Theo dõi thời gian của từng bước theo xu hướng, để thấy job chậm dần trước khi trễ. Mỗi lần trễ đều phân tích nguyên nhân gốc, và tính vào error budget.`,
    keyPoints: [
      { text: 'Chuyển thành SLO và phân tích nguyên nhân các lần trễ', keywords: ['slo', 'nguyên nhân', '95%'], weight: 2 },
      { text: 'Tính ngược từ hạn theo đường găng', keywords: ['tính ngược', 'đường găng', 'critical path'], weight: 2 },
      { text: 'Điểm kiểm tra và cảnh báo sớm', keywords: ['cảnh báo sớm', 'điểm kiểm tra', 'lúc 5 giờ', 'mốc'], weight: 2 },
      { text: 'Tài nguyên riêng và thỏa thuận với nguồn', keywords: ['tài nguyên riêng', 'thỏa thuận', 'thời hạn'] },
      { text: 'Có phương án khi hết giờ', keywords: ['ghi chú', 'số gần nhất', 'dự phòng'] },
    ],
    followUps: ['Một nguồn của đội khác liên tục trễ, bạn xử lý thế nào?'],
    commonMistakes: ['Chỉ đề xuất chạy sớm hơn hoặc tăng tài nguyên mà chưa tìm nguyên nhân.'],
  },
  {
    id: 'iv-arch-sd-reliability-03',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-reliability', 'etl-idempotency'],
    interviewTypes: ['system-design', 'de'],
    levels: ['senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Thiết kế hệ thống đối soát giao dịch thanh toán hằng ngày giữa hệ thống nội bộ và 3 cổng thanh toán.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** khoảng 5 triệu giao dịch mỗi ngày, cổng thanh toán gửi tệp sao kê sáng hôm sau, và phải giữ dữ liệu 7 năm cho kiểm toán. Về nguyên lý, đối soát có giá trị vì hai hệ thống độc lập cùng ghi một sự kiện, nên khác biệt sẽ làm lộ lỗi mà mỗi bên không tự thấy được. Vì vậy không được coi bên nào là luôn đúng.

**Kiến trúc đề xuất:** lưu nguyên bản tệp của cổng và dữ liệu sổ cái nội bộ vào vùng bất biến. Chuẩn hóa về một mô hình: số tiền, tiền tệ, múi giờ, trạng thái. So khớp theo mã giao dịch, phân loại thành khớp, thiếu ở cổng, thiếu ở nội bộ, lệch số tiền. Các trường hợp không khớp vào hàng đợi xử lý, có người phụ trách và theo dõi số ngày tồn.

**Lựa chọn công nghệ:** batch là đúng, vì tệp đến theo ngày. Spark với Iceberg hoặc Delta, time travel giúp tái lập kết quả khi kiểm toán. Dùng kiểu decimal, không dùng float cho tiền.

**Đánh đổi:** đối soát gần thời gian thực phát hiện sớm hơn, nhưng phức tạp mà tệp vẫn đến theo ngày. So khớp chặt tuyệt đối sẽ tạo nhiều trường hợp giả do phí và làm tròn, nên có quy tắc dung sai rõ ràng. Giao dịch qua nửa đêm có thể nằm ở hai ngày, nên phải so khớp trên khoảng nhiều ngày.

**Xử lý lỗi và giám sát:** kiểm tra tổng và số dòng của tệp so với phần đầu tệp. Mã băm chặn tệp nạp hai lần. Chạy lại idempotent theo cổng và ngày. Tệp đến trễ thì chạy lại ngày đó. Cảnh báo khi tỷ lệ không khớp vượt 0,1%, hoặc có trường hợp tồn quá 3 ngày.`,
    keyPoints: [
      { text: 'Đối soát so sánh hai nguồn độc lập', keywords: ['độc lập', 'hai hệ thống', 'không bên nào'], weight: 2 },
      { text: 'Phân loại kết quả và hàng đợi xử lý', keywords: ['phân loại', 'hàng đợi', 'không khớp', 'số ngày tồn'], weight: 2 },
      { text: 'Lưu bất biến để kiểm toán, tái lập', keywords: ['bất biến', 'kiểm toán', 'tái lập', 'time travel'] },
      { text: 'Decimal, múi giờ, phí, làm tròn', keywords: ['decimal', 'múi giờ', 'làm tròn', 'dung sai', 'qua nửa đêm'] },
      { text: 'Chạy lại idempotent, tệp trùng', keywords: ['idempotent', 'mã băm', 'chạy lại'] },
    ],
    followUps: ['Một cổng gửi lại tệp đã sửa sau 3 ngày thì sao?'],
    commonMistakes: ['Dùng kiểu float cho tiền.', 'Xem hệ thống nội bộ là luôn đúng.'],
  },
  {
    id: 'iv-arch-sd-reliability-04',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-reliability', 'cloud-high-availability', 'cloud-s3'],
    interviewTypes: ['system-design', 'bigdata'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Thiết kế phương án khôi phục sau thảm họa cho nền tảng dữ liệu khi cả một vùng cloud bị sập.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** tôi chốt RPO và RTO theo từng tầng. Tầng 1 gồm bảng phục vụ sản phẩm và báo cáo bắt buộc, có RPO 15 phút và RTO 1 giờ. Tầng còn lại có thể khôi phục trong vài ngày, vì sao chép mọi thứ rất tốn kém. Cần hỏi quy định về nơi lưu dữ liệu, vì có dữ liệu có thể không được rời khỏi quốc gia.

**Kiến trúc đề xuất:** dùng active-passive. Object storage sao chép sang vùng khác cho dữ liệu tầng 1. Kafka sao chép bằng MirrorMaker 2, gồm cả đồng bộ offset. Catalog được sao chép hoặc dựng lại từ metadata. Hạ tầng được định nghĩa bằng code, nên vùng dự phòng chỉ bật khi cần. Failover theo trình tự: chuyển DNS, bật tính toán, chạy lại các job còn dở.

**Lựa chọn công nghệ:** active-passive vì đơn giản và rẻ hơn. Active-active phải giải quyết xung đột giữa hai vùng, và chỉ đáng làm khi RTO gần bằng 0. Terraform giúp dựng lại môi trường một cách nhất quán.

**Đánh đổi:** sao chép bất đồng bộ có thể mất vài phút dữ liệu, nên cần có khả năng đọc lại từ nguồn. Phí truyền giữa các vùng và lưu trữ gấp đôi là khá lớn, nên chỉ áp dụng cho tầng 1. Metadata của bảng có thể chứa đường dẫn tuyệt đối theo bucket, nên phải kiểm tra việc này khi khôi phục.

**Xử lý lỗi và giám sát:** chưa diễn tập thì chưa thể tin vào kế hoạch, nên tôi diễn tập định kỳ và đo RTO thực tế. Theo dõi độ trễ sao chép so với RPO. Sau failover, phát lại có thể tạo dữ liệu trùng, nên ghi phải idempotent. Cũng cần có kế hoạch quay về vùng chính, và viết runbook để ai trực cũng làm được.`,
    keyPoints: [
      { text: 'RPO và RTO theo từng tầng dữ liệu', keywords: ['rpo', 'rto', 'theo tầng'], weight: 2 },
      { text: 'Active-passive và lý do không active-active', keywords: ['active passive', 'active active', 'xung đột'], weight: 2 },
      { text: 'Sao chép storage, Kafka, catalog', keywords: ['mirrormaker', 'sao chép', 'catalog', 'offset'] },
      { text: 'Diễn tập định kỳ', keywords: ['diễn tập', 'failover', 'drill'], weight: 2 },
      { text: 'Quy định về nơi lưu dữ liệu', keywords: ['nơi lưu', 'quốc gia', 'residency'] },
    ],
    followUps: ['Offset của consumer được chuyển thế nào khi failover?'],
    commonMistakes: ['Áp dụng cùng một mức khôi phục cho toàn bộ dữ liệu.', 'Có kế hoạch nhưng chưa từng diễn tập.'],
  },

  /* ---------- arch-observability ---------- */
  {
    id: 'iv-arch-sd-observability-01',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-observability', 'etl-data-quality'],
    interviewTypes: ['system-design', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Thiết kế hệ thống giám sát chất lượng cho 500 bảng, trong khi đội dữ liệu chỉ có 6 người.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** với 500 bảng và 6 người thì không thể viết tay kiểm tra cho tất cả. Tôi hỏi bảng nào ảnh hưởng đến tiền và quyết định lớn, và hiện lỗi thường được phát hiện bởi ai. Giả sử có 50 bảng tầng 1. Mục tiêu đo được là giảm số sự cố do người dùng phát hiện trước.

**Kiến trúc đề xuất:** có hai lớp. **Lớp rộng** cho mọi bảng: bộ thu thập đọc metadata và query log, lưu thành chuỗi thời gian về freshness, volume, schema, rồi so với đường cơ sở. **Lớp sâu** cho bảng tầng 1: thống kê distribution của các cột quan trọng, luật nghiệp vụ viết tường minh, và cổng chặn công bố. Lineage dùng để gom cảnh báo và báo đúng người.

**Lựa chọn công nghệ:** dbt test hoặc Great Expectations cho luật nghiệp vụ, vì chạy được ngay trong pipeline. Với lớp rộng, có thể mua công cụ như Monte Carlo hoặc tự xây trên metadata. Tôi tính chi phí người: 6 người khó duy trì thêm một hệ thống tự xây, nên có thể mua nếu ngân sách cho phép.

**Đánh đổi:** metadata rẻ và phủ rộng, nhưng không thấy lỗi trong giá trị. Quét sâu thì thấy nhưng tốn tiền. Cổng chặn bảo vệ người dùng, nhưng cảnh báo giả sẽ làm trễ báo cáo, nên chỉ chặn với lỗi chắc chắn, còn lỗi nghi ngờ thì chỉ cảnh báo.

**Xử lý lỗi và giám sát:** chu kỳ tuần và ngày lễ phải nằm trong đường cơ sở, nếu không sẽ có nhiều cảnh báo giả. Người xử lý đánh dấu đúng hay sai để cải thiện. Mỗi bảng tầng 1 có chủ sở hữu. Tôi theo dõi thời gian phát hiện, thời gian sửa, và tỷ lệ cảnh báo đúng.`,
    keyPoints: [
      { text: 'Phân tầng bảng', keywords: ['phân tầng', 'tầng 1', 'bảng quan trọng'], weight: 2 },
      { text: 'Metadata phủ rộng cho mọi bảng', keywords: ['metadata', 'query log', 'phủ rộng', 'freshness'], weight: 2 },
      { text: 'Luật nghiệp vụ và cổng chặn cho bảng quan trọng', keywords: ['luật nghiệp vụ', 'cổng chặn', 'dbt test', 'great expectations'] },
      { text: 'Mua hay tự xây dựa trên năng lực đội', keywords: ['mua', 'tự xây', 'build', 'buy'] },
      { text: 'Đo kết quả: thời gian phát hiện, cảnh báo đúng', keywords: ['thời gian phát hiện', 'mttd', 'cảnh báo đúng', 'người dùng phát hiện'] },
    ],
    followUps: ['Khi nào nên chặn công bố, khi nào chỉ cảnh báo?'],
    commonMistakes: ['Cố viết luật cho toàn bộ 500 bảng.', 'Không đo xem hệ thống có thực sự giúp ích không.'],
  },
  {
    id: 'iv-arch-sd-observability-02',
    topicId: 'architecture',
    category: 'arch-operations',
    conceptIds: ['arch-observability', 'etl-lineage'],
    interviewTypes: ['system-design', 'de'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Thiết kế hệ thống lineage ở mức cột, để biết một thay đổi ở nguồn sẽ ảnh hưởng tới những dashboard nào.',
    referenceAnswer: `**Làm rõ yêu cầu và quy mô:** giả sử có 5.000 bảng, dùng Airflow, Spark, dbt và một công cụ BI. Có hai nhu cầu chính: phân tích ảnh hưởng trước khi thay đổi, và tìm nguyên nhân khi có sự cố. Mức bảng thường đủ cho sự cố, còn mức cột cần cho phân tích ảnh hưởng, vì đổi một cột thường chỉ ảnh hưởng một phần.

**Kiến trúc đề xuất:** thu thập từ nhiều nguồn vào một đồ thị. Job phát sự kiện đầu vào và đầu ra lúc chạy. Bộ phân tích đọc SQL trong query log để suy ra quan hệ giữa các cột. dbt có sẵn đồ thị phụ thuộc. API của công cụ BI cho biết dashboard nào dùng cột nào. Dữ liệu vào kho đồ thị, có giao diện và API để truy vấn, và CI có thể gọi API này.

**Lựa chọn công nghệ:** OpenLineage là chuẩn mở, có tích hợp với Airflow, Spark và dbt, nên đỡ phải viết nhiều. DataHub, OpenMetadata hoặc Marquez có thể làm nơi lưu và giao diện. Đồ thị phù hợp vì câu hỏi chính là đi xuôi và đi ngược qua nhiều bước.

**Đánh đổi:** thu thập lúc chạy chính xác với những gì thực sự xảy ra, nhưng chỉ thấy các job đã chạy. Phân tích tĩnh thấy sớm hơn, nhưng khó với SQL động và UDF. Mức cột hữu ích hơn nhưng tốn công hơn nhiều, nên có thể bắt đầu từ bảng tầng 1.

**Xử lý lỗi và giám sát:** lineage thiếu nguy hiểm hơn là không có, vì tạo cảm giác an toàn sai. Tôi đo độ phủ, là tỷ lệ bảng có lineage, và ghi rõ các vùng chưa phủ như notebook. Quan hệ lâu không còn được quan sát sẽ được đánh dấu là cũ. Cảnh báo khi một pipeline ngừng phát sự kiện.`,
    keyPoints: [
      { text: 'Hai nhu cầu: phân tích ảnh hưởng và tìm nguyên nhân', keywords: ['phân tích ảnh hưởng', 'tìm nguyên nhân', 'impact'], weight: 2 },
      { text: 'Thu thập lúc chạy và phân tích SQL', keywords: ['lúc chạy', 'phân tích sql', 'sql parser', 'query log', 'openlineage'], weight: 2 },
      { text: 'Lưu dạng đồ thị', keywords: ['đồ thị', 'graph', 'datahub', 'openmetadata', 'marquez'] },
      { text: 'Khoảng trống như notebook, UDF', keywords: ['notebook', 'udf', 'sql động', 'khoảng trống'] },
      { text: 'Đo độ phủ của lineage', keywords: ['độ phủ', 'coverage'] },
    ],
    followUps: ['Làm sao đưa kết quả phân tích ảnh hưởng vào quy trình review code?'],
    commonMistakes: ['Giả định lineage là đầy đủ.', 'Chỉ dựa vào tài liệu viết tay.'],
  },
])
