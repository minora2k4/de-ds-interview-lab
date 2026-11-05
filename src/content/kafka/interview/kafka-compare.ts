import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-kafka-vs-rabbitmq-01',
    topicId: 'kafka',
    category: 'kafka-compare',
    conceptIds: ['kafka-vs-rabbitmq', 'kafka-consumer-group'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Kafka và RabbitMQ khác nhau thế nào? Bạn chọn công cụ nào cho từng trường hợp?',
    referenceAnswer: `Khác biệt gốc là ai giữ trạng thái. RabbitMQ nhận thông điệp qua exchange, định tuyến vào queue, rồi theo dõi từng thông điệp và xóa khi đã xác nhận. Kafka lưu vào log, không theo dõi từng thông điệp, mỗi nhóm đọc tự giữ một Offset cho mỗi Partition.

Từ đó sinh ra các khác biệt khác. RabbitMQ mạnh ở định tuyến, độ ưu tiên, TTL, dead letter exchange và xử lý riêng từng thông điệp. Kafka mạnh ở thông lượng, nhiều bên đọc độc lập và đọc lại.

**Tôi chọn RabbitMQ** cho hàng đợi tác vụ: mỗi việc độc lập, thời gian xử lý khác nhau, cần thử lại riêng. **Tôi chọn Kafka** cho luồng sự kiện: CDC, log, clickstream, nhiều hệ thống cùng đọc, cần đọc lại.

Cần lưu ý ranh giới đang mờ dần. RabbitMQ có Streams từ 3.9, là log đọc không xóa, và từ 4.0 đã bỏ classic mirrored queues để dùng quorum queues. Kafka có Share Group từ 4.2, xác nhận từng bản ghi và đếm số lần giao. Tuy vậy, mô hình cốt lõi và tính năng định tuyến của hai bên vẫn khác nhau.`,
    keyPoints: [
      { text: 'RabbitMQ theo dõi từng thông điệp, Kafka giữ Offset', keywords: ['từng thông điệp', 'offset', 'xóa khi xác nhận', 'giữ trạng thái'], weight: 2 },
      { text: 'RabbitMQ mạnh ở định tuyến và xử lý riêng', keywords: ['exchange', 'định tuyến', 'độ ưu tiên', 'routing'], weight: 2 },
      { text: 'Kafka mạnh ở thông lượng, nhiều bên đọc, đọc lại', keywords: ['thông lượng', 'nhiều bên đọc', 'đọc lại', 'replay'], weight: 2 },
      { text: 'Nêu được RabbitMQ Streams hoặc Share Group', keywords: ['streams', 'share group'] },
    ],
    followUps: ['Dùng Kafka làm hàng đợi tác vụ dài có vấn đề gì?'],
    commonMistakes: ['Nói RabbitMQ hoàn toàn không đọc lại được.', 'So sánh chỉ dựa trên tốc độ mà không xét mô hình.'],
  },
  {
    id: 'iv-kafka-vs-spark-streaming-01',
    topicId: 'kafka',
    category: 'kafka-compare',
    conceptIds: ['kafka-vs-spark-streaming', 'spark-overview'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Kafka và Spark Streaming khác nhau thế nào? DStream và Structured Streaming khác gì nhau?',
    referenceAnswer: `Đây là hai tầng khác nhau, không phải hai lựa chọn thay thế. Kafka lưu và vận chuyển sự kiện một cách bền vững, cho nhiều bên đọc lại. Spark là engine tính toán: đọc sự kiện, join, tổng hợp theo cửa sổ thời gian rồi ghi ra đích. Pipeline thường gặp là Kafka, rồi Spark, rồi Data Lake. Công cụ so sánh trực tiếp với Spark là Kafka Streams hoặc Flink.

Về Spark, cần phân biệt hai API. **DStream** là API cũ, chia luồng thành các RDD nhỏ. Tài liệu Spark ghi rõ đây là thế hệ trước, là dự án cũ không còn được cập nhật. **Structured Streaming** là API hiện hành, xây trên DataFrame và Spark SQL, nên dùng chung tối ưu với Catalyst và xử lý được event time.

Structured Streaming mặc định chạy micro-batch, độ trễ khoảng 100 ms. Từ Spark 4.1 có Real-time Mode với độ trễ cỡ mili giây, nhưng chưa hỗ trợ đủ mọi thao tác. Continuous Processing cũ không còn được khuyến nghị cho việc mới.`,
    keyPoints: [
      { text: 'Kafka vận chuyển và lưu, Spark tính toán', keywords: ['vận chuyển', 'lưu', 'tính toán', 'engine'], weight: 2 },
      { text: 'Bổ sung cho nhau, không thay thế', keywords: ['bổ sung', 'không thay thế', 'hai tầng', 'cùng nhau'] },
      { text: 'DStream là API cũ', keywords: ['dstream', 'api cũ', 'legacy', 'dự án cũ'], weight: 2 },
      { text: 'Structured Streaming là API hiện hành trên DataFrame', keywords: ['structured streaming', 'dataframe'], weight: 2 },
      { text: 'Micro-batch và Real-time Mode', keywords: ['micro batch', 'real time mode'] },
    ],
    followUps: ['Khi nào chọn Flink thay vì Spark?', 'Structured Streaming xử lý dữ liệu đến muộn thế nào?'],
    commonMistakes: ['Vẫn giới thiệu DStream như API chính của Spark.', 'Xem Spark Streaming là công cụ thay thế Kafka.'],
  },
  {
    id: 'iv-kafka-vs-spark-streaming-02',
    topicId: 'kafka',
    category: 'kafka-compare',
    conceptIds: ['kafka-vs-spark-streaming', 'kafka-offset', 'kafka-exactly-once'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Spark Structured Streaming đọc từ Kafka quản lý Offset thế nào? Đảm bảo exactly-once của nó có đúng trong mọi trường hợp không?',
    referenceAnswer: `Spark **tự quản lý Offset** thay vì dựa vào Consumer Group của Kafka. Trước mỗi micro-batch, nó ghi dải Offset sẽ xử lý vào write-ahead log trong checkpoint. Nguồn Kafka không commit Offset về Kafka. Hệ quả là khi khởi động lại, Spark tiếp tục từ checkpoint, không theo \`startingOffsets\`, vì cấu hình này chỉ áp dụng cho truy vấn mới. Mất checkpoint nghĩa là mất tiến độ và cả trạng thái. Không được tự đặt \`auto.offset.reset\`, và mỗi truy vấn mặc định có group id riêng.

Nếu Offset trong checkpoint đã bị Retention xóa, \`failOnDataLoss\` mặc định \`true\` sẽ làm truy vấn thất bại, thay vì âm thầm mất dữ liệu.

Về exactly-once, Spark cần hai điều kiện: nguồn đọc lại được, và đích lũy đẳng. Ghi vào Delta Lake hay tệp thì đạt được. Nhưng **ghi vào Kafka chỉ là At-least-once**, tài liệu Spark nêu rõ có thể có bản trùng. Đích là cơ sở dữ liệu qua \`foreachBatch\` thì phải tự ghi lũy đẳng. Vì vậy cần luôn nói rõ đảm bảo từ đâu tới đâu.

Mức song song mặc định là một Spark Partition cho mỗi Kafka Partition, có thể chia nhỏ hơn bằng \`minPartitions\`.`,
    keyPoints: [
      { text: 'Spark tự lưu Offset trong checkpoint, không commit về Kafka', keywords: ['checkpoint', 'write ahead log', 'không commit', 'tự quản lý'], weight: 2 },
      { text: 'startingOffsets chỉ áp dụng cho truy vấn mới', keywords: ['startingoffsets', 'starting offsets', 'truy vấn mới'] },
      { text: 'failOnDataLoss khi Offset đã bị xóa', keywords: ['failondataloss', 'fail on data loss', 'mất dữ liệu'] },
      { text: 'Exactly-once cần nguồn đọc lại được và đích lũy đẳng', keywords: ['đọc lại được', 'lũy đẳng', 'idempotent', 'replayable'], weight: 2 },
      { text: 'Kafka sink chỉ là At-least-once', keywords: ['at least once', 'kafka sink', 'ít nhất một lần'], weight: 2 },
    ],
    followUps: ['Theo dõi lag của một truy vấn Spark đọc Kafka bằng cách nào?', 'Thay đổi logic truy vấn có dùng lại được checkpoint cũ không?'],
    commonMistakes: ['Nói Spark commit Offset về Kafka theo Consumer Group.', 'Nói Spark đảm bảo exactly-once với mọi đích.'],
  },
])
