import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-kafka-overview-01',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-overview', 'kafka-messaging'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Kafka là gì? Vì sao cần Kafka thay vì để các hệ thống gọi trực tiếp nhau?',
    referenceAnswer: `Kafka là nền tảng log phân tán: Producer ghi sự kiện vào cuối log của Topic, Consumer đọc theo Offset, và dữ liệu vẫn nằm lại sau khi đọc.

Khi các hệ thống gọi trực tiếp nhau có ba vấn đề. Thứ nhất là số đường tích hợp tăng theo N × M. Thứ hai là phụ thuộc về thời gian: bên nhận chậm hoặc đang bảo trì thì bên gửi bị ảnh hưởng. Thứ ba là không đọc lại được khi có lỗi.

Kafka giải quyết bằng cách đứng ở giữa. Mỗi hệ thống chỉ cần nối với Kafka. Bên gửi ghi xong là xong, bên đọc đọc theo tốc độ của mình, nên đỉnh tải chỉ làm backlog dài ra. Vì dữ liệu còn nằm trong log, nhóm đọc có lỗi có thể quay về Offset cũ để xử lý lại.

Đổi lại, luồng xử lý trở thành bất đồng bộ, và phải vận hành thêm một cụm. Nếu bên gọi cần kết quả ngay thì API đồng bộ vẫn đúng hơn.`,
    keyPoints: [
      { text: 'Kafka là log phân tán, đọc không xóa dữ liệu', keywords: ['log', 'nhật ký', 'không xóa', 'nằm lại'], weight: 2 },
      { text: 'Tách rời bên gửi và bên nhận', keywords: ['tách rời', 'phụ thuộc', 'decouple', 'bất đồng bộ'], weight: 2 },
      { text: 'Hấp thụ đỉnh tải bằng backlog', keywords: ['đỉnh tải', 'backlog', 'tăng đột biến'] },
      { text: 'Đọc lại được khi có lỗi', keywords: ['đọc lại', 'replay', 'offset cũ', 'tua lại'] },
    ],
    followUps: ['Topic và Partition khác nhau thế nào?', 'Khi nào vẫn nên dùng API đồng bộ?'],
    commonMistakes: ['Mô tả Kafka như một hàng đợi xóa dữ liệu sau khi đọc.', 'Không nêu được đánh đổi của mô hình bất đồng bộ.'],
  },
  {
    id: 'iv-kafka-overview-02',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-overview', 'kafka-vs-rabbitmq'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Khi nào Kafka không cần thiết? Nếu nhóm muốn thêm Kafka cho một hệ thống nhỏ, bạn phản biện thế nào?',
    referenceAnswer: `Kafka giải quyết ba bài toán: nhiều bên đọc độc lập cùng một luồng, cần đọc lại dữ liệu, và lưu lượng lớn tới mức một máy không chịu nổi. Tôi hỏi xem hệ thống có bài toán nào trong số đó không. Nếu không, Kafka chỉ thêm chi phí.

Các trường hợp không cần Kafka:

- **Một bên gửi, một bên nhận, lưu lượng thấp:** bảng outbox trong cơ sở dữ liệu hoặc một hàng đợi có sẵn là đủ.
- **Bên gọi cần kết quả ngay:** dùng API đồng bộ.
- **Hàng đợi tác vụ:** mỗi việc độc lập, cần thử lại riêng, cần độ ưu tiên hoặc lập lịch. RabbitMQ hay SQS hợp hơn. Kafka 4.2 có Share Group, nhưng vẫn phải vận hành cả cụm.
- **Dữ liệu theo lô định kỳ:** tệp cộng với một công cụ điều phối là đơn giản hơn.
- **Cần truy vấn tùy ý:** đó là việc của cơ sở dữ liệu.

Chi phí thường bị đánh giá thấp: tối thiểu vài Broker và Controller, chọn số Partition, theo dõi lag, xử lý rebalance, quản lý schema, xử lý trùng lặp.

Khi phản biện, tôi đưa số liệu: lưu lượng hiện tại và dự kiến, số bên đọc, nhu cầu đọc lại. Tôi cũng đề xuất đường lui: bắt đầu bằng outbox, về sau có thể đẩy dữ liệu từ outbox vào Kafka mà không phải viết lại nghiệp vụ. Tôi chỉ đưa Kafka vào khi xuất hiện nhiều bên đọc độc lập hoặc cần đọc lại thật sự.`,
    keyPoints: [
      { text: 'Xác định bài toán Kafka giải quyết: nhiều bên đọc, đọc lại, lưu lượng lớn', keywords: ['nhiều bên đọc', 'đọc lại', 'replay', 'lưu lượng lớn', 'thông lượng'], weight: 2 },
      { text: 'Lưu lượng thấp, một bên đọc thì dùng hàng đợi hoặc bảng', keywords: ['outbox', 'hàng đợi', 'queue', 'lưu lượng thấp', 'sqs', 'rabbitmq'], weight: 2 },
      { text: 'Cần phản hồi đồng bộ thì dùng API', keywords: ['đồng bộ', 'request response', 'api'] },
      { text: 'Chi phí vận hành của Kafka', keywords: ['chi phí', 'vận hành', 'lag', 'rebalance'], weight: 2 },
      { text: 'Đưa số liệu và có lộ trình mở rộng về sau', keywords: ['số liệu', 'ước lượng', 'đường lui', 'lộ trình', 'về sau'] },
    ],
    followUps: ['Outbox pattern hoạt động thế nào?', 'Share Group có làm Kafka thay thế được RabbitMQ không?'],
    commonMistakes: ['Chọn Kafka chỉ vì dự phòng tăng trưởng, không có số liệu.', 'Trả lời rằng Kafka lúc nào cũng tốt hơn hàng đợi.'],
  },
  {
    id: 'iv-kafka-overview-03',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-overview', 'kafka-broker'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'KRaft là gì? Vì sao Kafka bỏ ZooKeeper, và điều gì thay đổi từ bản 4.0?',
    referenceAnswer: `KRaft là chế độ Kafka tự quản lý metadata: danh sách Topic, Partition, Leader, ISR. Một nhóm Controller dùng giao thức Raft để sao chép metadata dưới dạng log, chạy ngay trong Kafka.

Kafka bỏ ZooKeeper vì hai lý do. Về vận hành, đây là một hệ thống phân tán thứ hai phải triển khai, theo dõi và bảo mật riêng. Về kỹ thuật, metadata khó mở rộng khi số Partition rất lớn, và việc khôi phục Controller chậm vì phải nạp lại từ ZooKeeper. Trong KRaft, Controller dự phòng đã có sẵn metadata nên chuyển đổi nhanh hơn.

Về mốc: KRaft sẵn sàng cho production từ 3.3. Kafka 4.0, tháng 3/2025, gỡ hẳn ZooKeeper, nên cụm cũ phải chuyển sang KRaft trên dòng 3.x, thường là bản cầu nối 3.9, rồi mới lên 4.x.

Khi triển khai, thường chọn 3 hoặc 5 Controller. Cần còn đa số mới hoạt động, nên 3 chịu được 1 máy hỏng và 5 chịu được 2 máy. Với cụm quan trọng, nên tách Controller khỏi Broker, vì chế độ kết hợp không được khuyến nghị.`,
    keyPoints: [
      { text: 'KRaft quản lý metadata bằng Raft trong chính Kafka', keywords: ['raft', 'metadata', 'controller'], weight: 2 },
      { text: 'Bỏ ZooKeeper để giảm vận hành và dễ mở rộng', keywords: ['vận hành', 'hệ thống riêng', 'mở rộng', 'zookeeper'], weight: 2 },
      { text: 'Kafka 4.0 gỡ hẳn ZooKeeper, phải chuyển trước khi nâng cấp', keywords: ['4.0', 'gỡ', 'cầu nối', 'bridge', '3.9'], weight: 2 },
      { text: 'Số Controller 3 hoặc 5, cần đa số', keywords: ['đa số', 'quorum', '3 hoặc 5'] },
    ],
    followUps: ['Vì sao số Controller thường là số lẻ?', 'Khi nào dùng chế độ kết hợp broker và controller?'],
    commonMistakes: ['Vẫn trình bày ZooKeeper như thành phần bắt buộc của Kafka hiện nay.'],
  },
  {
    id: 'iv-kafka-overview-04',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-overview', 'kafka-broker'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao Kafka đạt thông lượng rất cao dù lưu mọi thứ xuống đĩa?',
    referenceAnswer: `Đĩa chậm khi truy cập ngẫu nhiên, nhưng đọc ghi tuần tự thì rất nhanh, và Kafka thiết kế để gần như mọi thao tác đều tuần tự.

**Khi ghi:** log chỉ nối thêm nên không phải tìm vị trí trên đĩa. Kafka còn tận dụng page cache của hệ điều hành thay vì tự giữ bộ đệm lớn trong JVM, nhờ đó giảm áp lực GC, và cache vẫn còn sau khi tiến trình khởi động lại.

**Khi đọc:** Consumer thường đọc phần mới nên dữ liệu đã nằm trong page cache. \`sendfile\` chuyển trực tiếp từ page cache ra socket, bỏ qua việc sao chép qua không gian người dùng. Nhiều nhóm đọc cùng dữ liệu chỉ cần một lần nạp vào cache.

**Batch và nén:** Producer gom batch, nén cả batch. Broker lưu nguyên định dạng này, không giải nén rồi nén lại. Ít request hơn và ít byte hơn.

**Không có chỉ mục phức tạp:** trạng thái đọc chỉ là Offset, nên Broker không phải cập nhật trạng thái từng thông điệp.

Giới hạn cũng từ đó mà ra: bật TLS thì không dùng được \`sendfile\`, và Consumer đọc dữ liệu rất cũ sẽ đẩy cache ra và tạo tải đĩa.`,
    keyPoints: [
      { text: 'Đọc ghi tuần tự trên log chỉ nối thêm', keywords: ['tuần tự', 'nối thêm', 'append', 'sequential'], weight: 2 },
      { text: 'Tận dụng page cache của hệ điều hành', keywords: ['page cache', 'pagecache'], weight: 2 },
      { text: 'Zero-copy khi gửi dữ liệu cho Consumer', keywords: ['zero copy', 'sendfile'], weight: 2 },
      { text: 'Batch và nén', keywords: ['batch', 'nén', 'compression'] },
      { text: 'Nêu giới hạn như TLS hoặc đọc dữ liệu cũ', keywords: ['tls', 'ssl', 'dữ liệu cũ'] },
    ],
    followUps: ['Vì sao Kafka không fsync mỗi lần ghi mà vẫn bền?', 'Consumer đọc dữ liệu cũ ảnh hưởng thế nào tới cụm?'],
    commonMistakes: ['Nói Kafka nhanh vì giữ dữ liệu trong RAM của JVM.'],
  },
  {
    id: 'iv-kafka-overview-05',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-overview', 'kafka-partition', 'kafka-replication', 'kafka-delivery-semantics'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Thiết kế hệ thống sự kiện cho một sàn thương mại điện tử: 50.000 sự kiện mỗi giây, nhiều hệ thống cùng đọc, thứ tự đúng theo từng đơn hàng và không được mất sự kiện.',
    referenceAnswer: `Tôi đi từ yêu cầu. 50.000 sự kiện mỗi giây, mỗi sự kiện 1 KB là khoảng 50 MB/giây. Nhiều bên đọc và cần đọc lại nên Kafka phù hợp.

**Nguồn dữ liệu:** không ghi đồng thời vào cơ sở dữ liệu và Kafka, vì một bên có thể lỗi (dual write). Tôi dùng outbox hoặc [[etl-cdc|CDC]] để sự kiện chỉ phát sinh từ giao dịch đã commit.

**Topic và key:** tách Topic theo miền nghiệp vụ, key là \`order_id\`. Thứ tự chỉ cần trong từng đơn, nên không cần thứ tự toàn cục.

**Số Partition:** nếu một Partition an toàn ở 10 MB/giây và một Consumer xử lý 5 MB/giây thì cần ít nhất 10 Partition. Tính tăng trưởng gấp 3 lần, tôi chọn khoảng 36. Không nên tăng về sau vì sẽ đổi ánh xạ key.

**Độ bền:** replication factor 3 trên 3 vùng sẵn sàng, \`min.insync.replicas=2\`, \`acks=all\`, tắt unclean election. Chịu được mất một vùng mà vẫn ghi được.

**Bên đọc:** mỗi hệ thống một Consumer Group. Kho dữ liệu dùng upsert theo \`event_id\`, vì exactly-once của Kafka không kéo dài ra hệ thống ngoài. Bản ghi lỗi đẩy sang dead letter topic để không chặn Partition, chấp nhận thứ tự bị phá với bản ghi đó.

**Vận hành:** Retention 7 ngày, lưu dài hạn ra Data Lake, quản lý schema có kiểm tra tương thích, cảnh báo theo lag và số Partition thiếu bản sao.`,
    keyPoints: [
      { text: 'Tính dung lượng và số Partition từ lưu lượng', keywords: ['mb giây', 'số partition', 'thông lượng', 'tăng trưởng'], weight: 2 },
      { text: 'Chọn key theo đơn hàng để giữ thứ tự', keywords: ['order id', 'key', 'theo đơn', 'mã đơn'], weight: 2 },
      { text: 'Tránh dual write bằng outbox hoặc CDC', keywords: ['outbox', 'cdc', 'dual write'], weight: 2 },
      { text: 'Cấu hình độ bền acks all và min ISR', keywords: ['acks', 'min insync', 'replication factor', 'min isr'], weight: 2 },
      { text: 'Bên đọc xử lý trùng bằng idempotent hoặc upsert', keywords: ['upsert', 'idempotent', 'lũy đẳng', 'khử trùng'], weight: 2 },
      { text: 'Xử lý bản ghi lỗi và theo dõi lag', keywords: ['dead letter', 'dlq', 'lag', 'giám sát'] },
    ],
    followUps: ['Làm sao thay đổi schema mà không làm hỏng bên đọc?', 'Mất một vùng sẵn sàng thì điều gì xảy ra với ghi và đọc?', 'Vì sao dual write nguy hiểm?'],
    commonMistakes: ['Yêu cầu thứ tự toàn cục rồi dùng một Partition.', 'Tin rằng bật transaction là đủ cho toàn bộ pipeline tới kho dữ liệu.'],
  },
  {
    id: 'iv-kafka-messaging-01',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-messaging', 'kafka-consumer-group'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Phân biệt point-to-point và publish-subscribe. Kafka hỗ trợ hai mô hình này thế nào?',
    referenceAnswer: `Point-to-point giao mỗi thông điệp cho đúng một bên nhận, dùng để chia việc: nhiều worker cùng lấy từ một hàng đợi để xử lý nhanh hơn. Publish-subscribe giao mỗi thông điệp cho mọi bên đăng ký, dùng để phát tán: một sự kiện đơn hàng tới cả dịch vụ kho và dịch vụ email.

Kafka gộp hai mô hình bằng Consumer Group. Các Consumer cùng \`group.id\` chia nhau các Partition, nên hoạt động như chia việc. Các nhóm khác nhau thì mỗi nhóm nhận đủ dữ liệu, nên hoạt động như phát tán. Dữ liệu chỉ lưu một lần, mỗi nhóm giữ Offset riêng.

Điểm khác với hàng đợi thật sự là Kafka chia theo Partition, không chia theo từng thông điệp. Từ bản 4.2, Share Group bổ sung kiểu chia theo từng bản ghi cho những trường hợp cần hành vi gần hàng đợi hơn.`,
    keyPoints: [
      { text: 'Point-to-point: một thông điệp cho một bên nhận', keywords: ['một bên', 'chia việc', 'hàng đợi', 'queue'], weight: 2 },
      { text: 'Publish-subscribe: mọi bên đăng ký đều nhận', keywords: ['mọi bên', 'phát tán', 'đăng ký', 'subscribe'], weight: 2 },
      { text: 'Consumer Group gộp cả hai mô hình', keywords: ['consumer group', 'group id', 'nhóm'], weight: 2 },
      { text: 'Share Group chia theo từng bản ghi', keywords: ['share group', 'từng bản ghi'] },
    ],
    followUps: ['Có bao nhiêu Consumer trong một nhóm thì hợp lý?'],
    commonMistakes: ['Nói Kafka chỉ hỗ trợ publish-subscribe.'],
  },
  {
    id: 'iv-kafka-producer-01',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-producer', 'kafka-replication'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'acks=0, 1 và all khác nhau thế nào? Mặc định hiện nay là gì và có đủ để không mất dữ liệu không?',
    referenceAnswer: `\`acks\` quy định Producer chờ xác nhận tới mức nào.

- \`acks=0\`: không chờ. Độ trễ thấp nhất, nhưng Producer không biết có lỗi, và thử lại cũng không có tác dụng.
- \`acks=1\`: chờ Leader ghi xong. Nếu Leader chết trước khi Follower sao chép, dữ liệu đã xác nhận sẽ mất.
- \`acks=all\`: chờ toàn bộ ISR hiện tại. Đây là **mặc định từ Kafka 3.0**, cùng với \`enable.idempotence=true\`.

Tuy nhiên \`acks=all\` một mình chưa đủ. Nó chỉ chờ các bản sao **đang trong ISR**. Nếu ISR thu hẹp còn mỗi Leader thì một bản đã là đủ, và Leader chết sẽ mất dữ liệu. \`min.insync.replicas\` mặc định là 1 nên không bảo vệ được trường hợp này. Vì vậy cấu hình phổ biến là replication factor 3, \`min.insync.replicas=2\`, \`acks=all\`.

Producer còn có thể mất dữ liệu do phía client: dữ liệu trong bộ đệm khi tiến trình chết, hoặc lỗi trong callback không được kiểm tra.`,
    keyPoints: [
      { text: 'Phân biệt đúng ba mức acks', keywords: ['không chờ', 'chờ leader', 'toàn bộ isr'], weight: 2 },
      { text: 'Mặc định hiện nay là acks=all từ 3.0', keywords: ['mặc định', '3.0', 'acks all'], weight: 2 },
      { text: 'acks=all chỉ tính ISR hiện tại, cần min.insync.replicas', keywords: ['min insync', 'min isr', 'isr thu hẹp'], weight: 2 },
      { text: 'Rủi ro từ phía client như bộ đệm, callback', keywords: ['bộ đệm', 'buffer', 'callback'] },
    ],
    followUps: ['Khi ISR nhỏ hơn min.insync.replicas thì Producer nhận lỗi gì?', 'Vì sao idempotence cần acks=all?'],
    commonMistakes: ['Nói mặc định là acks=1, đây là thông tin đã cũ.', 'Nghĩ acks=all là mọi bản sao được gán đều đã nhận.'],
  },
  {
    id: 'iv-kafka-producer-02',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-producer'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Producer gom batch hoạt động thế nào? Bạn chỉnh linger.ms, batch.size và nén ra sao để tăng thông lượng?',
    referenceAnswer: `Producer không gửi từng thông điệp. Nó gom vào một batch riêng cho mỗi Partition, rồi gửi khi batch đầy theo \`batch.size\` (mặc định 16 KB) hoặc khi đã chờ đủ \`linger.ms\` (mặc định 5 ms từ bản 4.0, trước đó là 0).

Batch lớn hơn mang lại ba lợi ích: ít request hơn nên Broker đỡ tải, tỷ lệ nén tốt hơn vì nén cả batch, và ít byte đi qua mạng và đĩa hơn. Cái giá là độ trễ tăng một chút, và tốn thêm bộ nhớ ở client, nhất là khi có nhiều Partition vì mỗi Partition cần một batch.

Khi tinh chỉnh, tôi đo kích thước batch thực tế trước. Nếu batch nhỏ hơn nhiều so với \`batch.size\`, thì tăng \`linger.ms\` mới có tác dụng, còn tăng \`batch.size\` thì không. Sau đó bật nén, thường là \`lz4\` hoặc \`zstd\`, vì mặc định là \`none\`. Mặc định sticky partitioning cũng giúp thông điệp không có key tạo batch lớn hơn.

Với luồng cần độ trễ thấp, tôi giữ \`linger.ms\` nhỏ. Với clickstream hoặc log, tôi có thể chấp nhận vài chục mili giây.`,
    keyPoints: [
      { text: 'Batch theo từng Partition, gửi khi đầy hoặc hết linger', keywords: ['batch size', 'linger', 'mỗi partition', 'theo partition'], weight: 2 },
      { text: 'Đánh đổi độ trễ lấy thông lượng', keywords: ['độ trễ', 'thông lượng', 'latency', 'throughput'], weight: 2 },
      { text: 'Bật nén vì mặc định là none', keywords: ['nén', 'lz4', 'zstd', 'compression'] },
      { text: 'Đo kích thước batch thực tế trước khi chỉnh', keywords: ['đo', 'batch thực tế', 'metric'] },
    ],
    followUps: ['Vì sao có nhiều Partition lại làm Producer tốn thêm bộ nhớ?'],
    commonMistakes: ['Tăng batch.size mà không tăng linger.ms, rồi không thấy batch lớn hơn.'],
  },
  {
    id: 'iv-kafka-consumer-01',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-consumer'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao Kafka chọn mô hình Consumer kéo dữ liệu (pull) thay vì Broker đẩy (push)? Mô hình này có nhược điểm gì?',
    referenceAnswer: `Câu hỏi gốc là ai nên kiểm soát tốc độ. Trong push, Broker quyết định tốc độ và rất khó biết từng bên nhận chịu được bao nhiêu, nên bên chậm dễ bị quá tải. Kafka có nhiều nhóm đọc với tốc độ rất khác nhau, từ dịch vụ thời gian thực tới job nạp theo lô, nên để bên đọc tự quyết là hợp lý.

Pull còn có ba lợi ích. Một là gom batch tốt: Consumer lấy mọi thứ có sẵn sau vị trí của mình, không phải đoán khi nào nên gửi. Hai là trạng thái đơn giản: Consumer giữ Offset, nên Broker không phải theo dõi từng thông điệp. Ba là tua lại được: chỉ cần đổi Offset.

Nhược điểm của pull thuần túy là hỏi liên tục khi không có dữ liệu. Kafka khắc phục bằng long poll: yêu cầu fetch chờ tại Broker tới khi có dữ liệu hoặc đủ số byte. Nhược điểm khác là Consumer phải tự lo vòng lặp \`poll\`: nếu xử lý chậm quá \`max.poll.interval.ms\` thì bị đẩy khỏi nhóm, dù tiến trình vẫn sống.`,
    keyPoints: [
      { text: 'Bên đọc tự kiểm soát tốc độ, tránh quá tải', keywords: ['tốc độ', 'quá tải', 'điều tiết', 'backpressure'], weight: 2 },
      { text: 'Gom batch hiệu quả', keywords: ['batch', 'lấy mọi thứ'] },
      { text: 'Trạng thái đơn giản và tua lại được', keywords: ['offset', 'tua lại', 'replay', 'đọc lại'] },
      { text: 'Long poll khắc phục việc hỏi liên tục', keywords: ['long poll', 'hỏi liên tục', 'busy wait'], weight: 2 },
    ],
    followUps: ['max.poll.interval.ms và session timeout khác nhau thế nào?'],
    commonMistakes: ['Nói pull luôn có độ trễ cao mà không biết long poll.'],
  },
  {
    id: 'iv-kafka-consumer-02',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-consumer', 'kafka-consumer-group'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Consumer lag của một nhóm tăng liên tục. Bạn điều tra và xử lý thế nào?',
    referenceAnswer: `Lag là khoảng cách giữa Offset cuối log và Offset nhóm đã commit. Tôi không chỉ thêm Consumer ngay, mà xem lag đang tăng ở đâu.

**Bước 1: lag đều hay lệch?** Lag chỉ ở vài Partition thường là key lệch hoặc một Consumer gặp vấn đề. Lag đều ở mọi Partition là thiếu năng lực xử lý.

**Bước 2: lưu lượng có tăng không?** So sánh tốc độ ghi và tốc độ đọc. Nếu đột biến tạm thời thì có thể chỉ cần chờ tiêu hóa backlog.

**Bước 3: Consumer có đang rebalance không?** Rebalance liên tục làm tốc độ đọc giảm mạnh. Nguyên nhân thường là vượt \`max.poll.interval.ms\`.

**Bước 4: nút thắt ở đâu?** Thường không phải Kafka, mà là hệ thống phía sau như cơ sở dữ liệu chậm hoặc API bị giới hạn. Thêm Consumer lúc đó còn làm hệ thống phía sau quá tải hơn.

**Xử lý:** nếu thiếu năng lực và số Consumer còn dưới số Partition thì thêm Consumer. Nếu đã bằng số Partition thì phải tăng Partition, nhưng cần cân nhắc ảnh hưởng tới thứ tự. Tối ưu xử lý bằng cách ghi theo lô. Nếu cần tác vụ song song hơn số Partition và không cần thứ tự, có thể cân nhắc Share Group.

Cần cảnh báo sớm vì nếu lag vượt Retention, dữ liệu chưa đọc sẽ bị xóa và mất thật sự.`,
    keyPoints: [
      { text: 'Phân biệt lag đều và lag lệch', keywords: ['lệch', 'đều', 'vài partition', 'skew'], weight: 2 },
      { text: 'Kiểm tra rebalance liên tục', keywords: ['rebalance', 'max poll interval'] },
      { text: 'Nút thắt thường ở hệ thống phía sau', keywords: ['phía sau', 'downstream', 'cơ sở dữ liệu chậm', 'nút thắt'], weight: 2 },
      { text: 'Số Consumer bị giới hạn bởi số Partition', keywords: ['số partition', 'giới hạn', 'consumer ngồi không'], weight: 2 },
      { text: 'Lag vượt Retention có thể mất dữ liệu', keywords: ['retention', 'mất dữ liệu', 'bị xóa'] },
    ],
    followUps: ['Theo dõi lag bằng chỉ số nào?', 'Nếu phải bỏ qua backlog để bắt kịp thì làm thế nào?'],
    commonMistakes: ['Chỉ đề xuất thêm Consumer mà không kiểm tra số Partition và hệ thống phía sau.'],
  },
  {
    id: 'iv-kafka-broker-01',
    topicId: 'kafka',
    category: 'kafka-basics',
    conceptIds: ['kafka-broker', 'kafka-partition'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Broker làm gì trong cụm Kafka? Khi thêm một Broker mới thì điều gì xảy ra?',
    referenceAnswer: `Broker là máy chủ Kafka: nhận dữ liệu từ Producer, lưu log của các Partition xuống đĩa, sao chép giữa các máy và trả dữ liệu cho Consumer. Mỗi Partition có một Leader nằm trên một Broker, các bản sao còn lại nằm trên Broker khác. Một Broker thường vừa làm Leader cho Partition này, vừa làm Follower cho Partition khác, để tải được chia đều.

Client chỉ cần vài địa chỉ bootstrap để lấy metadata, sau đó nối thẳng tới Leader cần thiết, nên không có tầng định tuyến ở giữa.

Khi thêm Broker mới, điều dễ nhầm là dữ liệu **không tự cân bằng**. Broker mới chỉ nhận Partition của Topic tạo sau đó. Muốn chia lại dữ liệu cũ, phải chủ động chạy công cụ phân bổ lại Partition, thường có giới hạn băng thông, vì dữ liệu phải sao chép qua mạng. Vì vậy nên mở rộng trước khi đĩa gần đầy.`,
    keyPoints: [
      { text: 'Broker lưu log và phục vụ ghi đọc', keywords: ['lưu', 'ghi đọc', 'log', 'máy chủ'], weight: 2 },
      { text: 'Leader và Follower theo từng Partition', keywords: ['leader', 'follower', 'theo partition'], weight: 2 },
      { text: 'Broker mới không tự nhận dữ liệu cũ', keywords: ['không tự', 'phân bổ lại', 'reassign', 'cân bằng'], weight: 2 },
    ],
    followUps: ['Controller khác Broker thế nào?'],
    commonMistakes: ['Nghĩ rằng có một Broker chính phục vụ mọi ghi đọc.'],
  },
])
