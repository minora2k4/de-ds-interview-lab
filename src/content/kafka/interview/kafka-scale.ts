import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-kafka-consumer-group-01',
    topicId: 'kafka',
    category: 'kafka-scale',
    conceptIds: ['kafka-consumer-group', 'kafka-partition'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Consumer Group hoạt động thế nào? Nếu số Consumer nhiều hơn hoặc ít hơn số Partition thì sao?',
    referenceAnswer: `Consumer Group là các Consumer có cùng \`group.id\`, cùng đọc một Topic và chia nhau công việc. Quy tắc là mỗi Partition chỉ giao cho một Consumer trong nhóm tại một thời điểm, nên thứ tự trong Partition được giữ nguyên và trạng thái chỉ là một Offset.

Nếu Consumer ít hơn Partition, một Consumer giữ nhiều Partition. Nếu bằng nhau, mỗi Consumer giữ một Partition, đây là mức song song cao nhất. Nếu Consumer nhiều hơn, phần dư ngồi không, nhưng có thể tiếp quản khi có máy chết.

Vì vậy số Partition là giới hạn trên của mức song song. Hai nhóm khác nhau đọc độc lập, mỗi nhóm nhận đủ dữ liệu. Khi một Consumer chết hoặc có Consumer mới, nhóm sẽ rebalance để chia lại, và Consumer nhận Partition sẽ đọc tiếp từ Offset đã commit.`,
    keyPoints: [
      { text: 'Mỗi Partition chỉ giao cho một Consumer trong nhóm', keywords: ['một consumer', 'mỗi partition'], weight: 2 },
      { text: 'Consumer dư sẽ ngồi không', keywords: ['ngồi không', 'dư', 'idle', 'không có việc'], weight: 2 },
      { text: 'Số Partition giới hạn mức song song', keywords: ['giới hạn', 'mức song song'], weight: 2 },
      { text: 'Rebalance khi thành viên thay đổi', keywords: ['rebalance', 'chia lại'] },
    ],
    followUps: ['Rebalance có ảnh hưởng gì tới việc xử lý?'],
    commonMistakes: ['Nói thêm Consumer luôn tăng tốc độ đọc.'],
  },
  {
    id: 'iv-kafka-consumer-group-02',
    topicId: 'kafka',
    category: 'kafka-scale',
    conceptIds: ['kafka-consumer-group', 'kafka-consumer'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Rebalance là gì và vì sao nó gây vấn đề? Bạn giảm tác động của nó thế nào?',
    referenceAnswer: `Rebalance là việc chia lại Partition khi thành viên nhóm thay đổi. Nó cần thiết vì mỗi Partition phải có đúng một người đọc: hai người cùng đọc sẽ xử lý trùng, không ai đọc thì dừng.

Vấn đề là **trong kiểu eager, cả nhóm dừng**: mọi Consumer trả hết Partition, chờ nhau, rồi nhận lại. Với nhóm lớn hoặc khi triển khai lần lượt, các lần dừng cộng dồn thành nhiều phút. Partition chuyển chủ còn gây xử lý trùng từ Offset đã commit, và mất cache trạng thái cục bộ.

Giảm tác động, theo thứ tự:

1. **Tránh rebalance không cần thiết:** tìm nguyên nhân thật. Hay gặp nhất là xử lý vượt \`max.poll.interval.ms\`, nên cần giảm \`max.poll.records\` hoặc tách việc chậm ra.
2. **Static membership:** đặt \`group.instance.id\`, khởi động lại nhanh không gây rebalance.
3. **Cooperative rebalancing:** chỉ thu hồi Partition cần chuyển.
4. **Giao thức \`consumer\` (KIP-848):** Broker tính phân công, không còn rào đồng bộ toàn nhóm. Đã GA từ 4.0, nhưng client phải tự đặt \`group.protocol=consumer\`.

Khi đổi chủ, tôi commit Offset trong callback thu hồi Partition, và giữ cho xử lý idempotent để chịu được phần trùng.`,
    keyPoints: [
      { text: 'Eager làm cả nhóm dừng', keywords: ['dừng', 'stop the world', 'eager', 'cả nhóm'], weight: 2 },
      { text: 'Nguyên nhân hay gặp là xử lý chậm', keywords: ['max poll interval', 'xử lý chậm', 'max poll records'], weight: 2 },
      { text: 'Static membership', keywords: ['static membership', 'group instance id'], weight: 2 },
      { text: 'Cooperative hoặc KIP-848', keywords: ['cooperative', 'kip 848', 'group protocol', 'tăng dần'], weight: 2 },
      { text: 'Xử lý trùng khi Partition đổi chủ', keywords: ['trùng', 'idempotent', 'lũy đẳng'] },
    ],
    followUps: ['Session timeout và max.poll.interval.ms khác nhau thế nào?', 'Static membership có nhược điểm gì khi một máy chết thật?'],
    commonMistakes: ['Chỉ tăng timeout mà không tìm nguyên nhân gây rebalance.'],
  },
  {
    id: 'iv-kafka-consumer-group-03',
    topicId: 'kafka',
    category: 'kafka-scale',
    conceptIds: ['kafka-consumer-group'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Giao thức rebalance mới KIP-848 thay đổi những gì? Khi nào bạn chuyển sang và cần lưu ý gì?',
    referenceAnswer: `Trong giao thức \`classic\`, client giữ logic phân công: một Consumer làm trưởng nhóm, tính phân công rồi gửi cho các thành viên qua một rào đồng bộ. Mỗi thay đổi đều cần cả nhóm tham gia.

KIP-848, đạt GA ở Kafka 4.0, chuyển việc này về Broker. Group coordinator tính phân công và trả dần thay đổi cho từng thành viên qua heartbeat, không còn rào đồng bộ toàn nhóm. Client đơn giản hơn, rebalance nhanh hơn.

Lưu ý khi chuyển:

- **Client vẫn mặc định \`classic\`.** Phải đặt \`group.protocol=consumer\`. Lộ trình dự kiến là mặc định ở Kafka 5.0, và client chỉ còn giao thức này ở 6.0.
- **Một số cấu hình không còn dùng được:** \`session.timeout.ms\`, \`heartbeat.interval.ms\`, \`partition.assignment.strategy\`. Chúng chuyển thành cấu hình \`group.consumer.*\` của Broker.
- **Bộ phân công:** có \`uniform\` (mặc định) và \`range\`. Bộ phân công tự viết ở client chưa được hỗ trợ, và phân công theo rack chưa đầy đủ.
- **Chuyển đổi:** có thể rolling không dừng, với điều kiện nhóm dùng bộ phân công không nhúng metadata riêng.

Tôi chuyển trước với các nhóm lớn hoặc co giãn nhiều, và đo thời gian rebalance trước và sau.`,
    keyPoints: [
      { text: 'Broker tính phân công thay vì client', keywords: ['broker', 'coordinator', 'phía server', 'phía máy chủ'], weight: 2 },
      { text: 'Không còn rào đồng bộ toàn nhóm, tăng dần', keywords: ['rào đồng bộ', 'tăng dần', 'incremental', 'barrier'], weight: 2 },
      { text: 'Client vẫn mặc định classic, phải đặt group.protocol', keywords: ['group protocol', 'mặc định classic', 'classic'], weight: 2 },
      { text: 'Các cấu hình client không còn dùng được', keywords: ['session timeout', 'heartbeat', 'partition assignment strategy'] },
      { text: 'Giới hạn về bộ phân công tự viết', keywords: ['tự viết', 'custom', 'uniform', 'range'] },
    ],
    followUps: ['Chuyển đổi không dừng hoạt động thế nào?'],
    commonMistakes: ['Nói Kafka 4.0 tự động dùng giao thức mới cho mọi Consumer.'],
  },
  {
    id: 'iv-kafka-consumer-group-04',
    topicId: 'kafka',
    category: 'kafka-scale',
    conceptIds: ['kafka-consumer-group', 'kafka-vs-rabbitmq', 'kafka-ordering'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Share Group khác Consumer Group thế nào? Khi nào bạn dùng nó thay vì Consumer Group hay RabbitMQ?',
    referenceAnswer: `Khác biệt nằm ở đơn vị chia việc. Consumer Group giao trọn Partition cho một Consumer, nên giữ được thứ tự và trạng thái chỉ là một Offset. Đổi lại, mức song song bị giới hạn bởi số Partition, và một bản ghi lỗi có thể chặn cả Partition.

Share Group, sẵn sàng cho production từ Kafka 4.2, chia theo từng bản ghi. Nhiều Consumer cùng đọc một Partition, số Consumer có thể vượt số Partition. Broker khóa bản ghi có thời hạn, mặc định 30 giây. Consumer xác nhận, trả lại hoặc từ chối từng bản ghi, và số lần giao được đếm để xử lý bản ghi lỗi tự động. Cái giá là **không giữ thứ tự của luồng**.

Tôi dùng Share Group khi: tác vụ độc lập, thời gian xử lý khác nhau nhiều, cần co giãn số worker linh hoạt, và dữ liệu đã nằm trong Kafka. Nó tránh phải dựng thêm một hệ thống hàng đợi.

Tôi vẫn dùng Consumer Group khi cần thứ tự, hoặc cho xử lý luồng có trạng thái. Tôi vẫn chọn RabbitMQ khi cần định tuyến phức tạp, độ ưu tiên hoặc TTL theo thông điệp, hoặc khi hệ thống không cần gì khác của Kafka. Share Group không biến Kafka thành RabbitMQ: nó thêm kiểu đọc, chứ không thêm exchange hay định tuyến.`,
    keyPoints: [
      { text: 'Consumer Group chia theo Partition, Share Group chia theo bản ghi', keywords: ['theo bản ghi', 'từng bản ghi', 'theo partition'], weight: 2 },
      { text: 'Khóa, xác nhận và đếm số lần giao', keywords: ['khóa', 'lock', 'xác nhận', 'đếm số lần'], weight: 2 },
      { text: 'Không giữ thứ tự', keywords: ['không giữ thứ tự', 'mất thứ tự'], weight: 2 },
      { text: 'Số Consumer có thể vượt số Partition', keywords: ['vượt số partition', 'nhiều hơn partition'] },
      { text: 'Tiêu chí chọn so với RabbitMQ', keywords: ['định tuyến', 'độ ưu tiên', 'rabbitmq', 'exchange'] },
    ],
    followUps: ['Bản ghi bị từ chối nhiều lần thì đi đâu?'],
    commonMistakes: ['Cho rằng Share Group vẫn giữ thứ tự như Consumer Group.', 'Không biết tính năng này, hoặc nói nó chỉ ở mức thử nghiệm.'],
  },
  {
    id: 'iv-kafka-replication-01',
    topicId: 'kafka',
    category: 'kafka-scale',
    conceptIds: ['kafka-replication', 'kafka-leader-follower'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Replication và ISR trong Kafka hoạt động thế nào? Thế nào là một thông điệp committed?',
    referenceAnswer: `Mỗi Partition có replication factor bản sao trên các Broker khác nhau: một Leader nhận ghi, các Follower kéo dữ liệu từ Leader và giữ log giống hệt.

ISR là tập các bản sao đang theo kịp Leader. Follower bị loại nếu mất phiên với Controller, hoặc không theo kịp trong \`replica.lag.time.max.ms\`, mặc định 30 giây. Nó phải đồng bộ lại đầy đủ rồi mới được vào lại ISR.

Thông điệp là **committed** khi mọi bản trong ISR đã nhận. High watermark đánh dấu vị trí này, và Consumer chỉ đọc được tới đó, nên không bao giờ thấy dữ liệu có thể mất. Kafka đảm bảo thông điệp committed không mất miễn là còn ít nhất một bản trong ISR sống.

Khi Leader hỏng, Controller chọn Leader mới từ ISR. Vì mọi bản trong ISR đều có đủ dữ liệu committed, bản nào cũng làm được. Đây là khác biệt với bỏ phiếu đa số, và là lý do chỉ cần f + 1 bản để chịu f lỗi.`,
    keyPoints: [
      { text: 'Follower kéo dữ liệu từ Leader', keywords: ['kéo', 'follower', 'leader', 'pull'], weight: 1 },
      { text: 'ISR là tập bản sao theo kịp, tiêu chí theo thời gian', keywords: ['theo kịp', 'replica lag', 'đồng bộ', 'in sync'], weight: 2 },
      { text: 'Committed là mọi bản trong ISR đã nhận', keywords: ['committed', 'mọi bản', 'high watermark'], weight: 2 },
      { text: 'Leader mới được chọn từ ISR', keywords: ['leader mới', 'bầu', 'từ isr'], weight: 2 },
    ],
    followUps: ['High watermark khác log end offset thế nào?'],
    commonMistakes: ['Nói ISR là toàn bộ các bản sao của Partition.'],
  },
  {
    id: 'iv-kafka-replication-02',
    topicId: 'kafka',
    category: 'kafka-scale',
    conceptIds: ['kafka-replication', 'kafka-producer'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Với replication factor 3, min.insync.replicas 2 và acks=all, hệ thống chịu được bao nhiêu Broker hỏng? Vì sao không đặt min.insync.replicas bằng 3 hoặc giữ mặc định 1?',
    referenceAnswer: `Đây là đánh đổi giữa độ bền và tính sẵn sàng khi ghi, tương tự những gì [[cloud-cap|CAP]] mô tả.

**Mất 1 Broker:** ISR còn 2, vẫn ghi và đọc được, dữ liệu đã xác nhận có ít nhất 2 bản. **Mất 2 Broker:** ISR còn 1, Producer nhận \`NotEnoughReplicas\`, ghi dừng lại, nhưng dữ liệu committed vẫn đọc được nếu còn Leader. Bản còn lại trong ISR vẫn có đủ dữ liệu đã xác nhận, nên không mất gì, chỉ tạm dừng ghi.

**Vì sao không để mặc định 1:** \`acks=all\` chỉ chờ ISR hiện tại. ISR co còn mỗi Leader thì một bản là đủ để xác nhận. Leader chết lúc đó sẽ mất dữ liệu đã xác nhận, mà Producer không hề biết.

**Vì sao không đặt 3:** chỉ một máy hỏng hoặc khởi động lại cũng dừng ghi, nên không bảo trì lần lượt được. Tính sẵn sàng rất thấp mà không đem lại nhiều lợi ích.

Cấu hình 3 và 2 cho phép khởi động lại từng máy mà vẫn ghi. Tôi đặt các bản trên 3 vùng sẵn sàng khác nhau, và điều chỉnh theo từng Topic. Log phân tích có thể dùng cấu hình thoáng hơn.`,
    keyPoints: [
      { text: 'Mất 1 Broker vẫn ghi đọc được', keywords: ['mất 1', 'một broker', 'vẫn ghi'], weight: 2 },
      { text: 'Mất 2 Broker thì dừng ghi với NotEnoughReplicas', keywords: ['notenoughreplicas', 'not enough replicas', 'dừng ghi', 'từ chối ghi'], weight: 2 },
      { text: 'Mặc định 1 có thể mất dữ liệu khi ISR co lại', keywords: ['isr co', 'mặc định 1', 'một bản', 'mất dữ liệu'], weight: 2 },
      { text: 'Đặt 3 làm giảm tính sẵn sàng', keywords: ['sẵn sàng', 'bảo trì', 'availability'] },
    ],
    followUps: ['Replication factor 2 có hợp lý không?', 'Cấu hình này thay đổi thế nào khi cụm trải trên 2 vùng?'],
    commonMistakes: ['Nghĩ acks=all một mình là đủ an toàn.', 'Nói mất 2 Broker thì mất dữ liệu.'],
  },
  {
    id: 'iv-kafka-replication-03',
    topicId: 'kafka',
    category: 'kafka-scale',
    conceptIds: ['kafka-replication'],
    interviewTypes: ['bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Vì sao Kafka dùng ISR cho dữ liệu nhưng lại dùng Raft cho metadata? Vì sao Kafka không cần fsync mỗi lần ghi?',
    referenceAnswer: `Câu trả lời nằm ở chi phí theo lượng dữ liệu.

Bỏ phiếu đa số cần 2f + 1 bản để chịu f lỗi. Chịu 2 lỗi cần 5 bản. Với dữ liệu người dùng lượng lớn, tốn gấp 5 lần đĩa là không thực tế. ISR chỉ cần f + 1 bản, vì mọi bản trong ISR đều có đủ dữ liệu committed. Cái giá là độ trễ phụ thuộc bản chậm trong ISR, và cần một nơi đáng tin cậy để giữ danh sách ISR.

Nơi đó chính là metadata. Lượng metadata nhỏ nhưng cần nhất quán rất mạnh, vì nó quyết định ai là Leader. Tại đây chi phí bỏ phiếu đa số không đáng kể, và không phụ thuộc vào máy chậm nhất, nên Raft phù hợp. HDFS cũng làm tương tự: journal của NameNode dùng đa số, dữ liệu thì không.

Về fsync: nhiều giao thức giả định đĩa ổn định, nên phải fsync mỗi lần ghi, làm hiệu năng giảm rất mạnh. Kafka không giả định như vậy. Máy lỗi có thể mất dữ liệu chưa flush, nhưng nó phải đồng bộ lại đầy đủ trước khi vào lại ISR. Độ bền đến từ nhiều bản trên nhiều máy. Rủi ro còn lại là mọi bản trong ISR cùng mất điện, nên cần đặt bản sao ở nhiều vùng khác nhau.`,
    keyPoints: [
      { text: 'ISR tiết kiệm bản sao so với đa số', keywords: ['f + 1', 'f+1', '2f', 'tiết kiệm', 'năm bản'], weight: 2 },
      { text: 'Metadata nhỏ và cần nhất quán mạnh nên dùng Raft', keywords: ['metadata', 'raft', 'nhất quán', 'đa số'], weight: 2 },
      { text: 'Độ bền đến từ sao chép, không từ fsync', keywords: ['không fsync', 'fsync', 'sao chép', 'nhiều bản'], weight: 2 },
      { text: 'Bản sao lỗi phải đồng bộ lại trước khi vào ISR', keywords: ['đồng bộ lại', 'vào lại isr', 'rejoin'] },
    ],
    followUps: ['Rủi ro gì xảy ra khi mọi bản trong ISR cùng mất điện?'],
    commonMistakes: ['Nói Kafka fsync từng thông điệp để đảm bảo độ bền.'],
  },
  {
    id: 'iv-kafka-leader-follower-01',
    topicId: 'kafka',
    category: 'kafka-scale',
    conceptIds: ['kafka-leader-follower', 'kafka-replication'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Khi Leader của một Partition chết thì điều gì xảy ra? Unclean Leader Election là gì và bạn dùng nó khi nào?',
    referenceAnswer: `Controller phát hiện Broker mất qua heartbeat, rồi chọn Leader mới từ ISR. Vì mọi bản trong ISR đều có đủ dữ liệu committed, không có gì bị mất. Controller xử lý theo lô cho mọi Partition của Broker đó, nên việc này thường rất nhanh. Producer và Consumer nhận lỗi tạm thời, lấy lại metadata rồi nối tới Leader mới. Producer gửi lại, và idempotence giúp không tạo bản trùng.

Vấn đề xảy ra khi mọi bản trong ISR đều chết. Có hai lựa chọn: chờ một bản trong ISR quay lại, hoặc cho bản ngoài ISR làm Leader. Lựa chọn thứ hai là **Unclean Leader Election**: phục hồi nhanh, nhưng mất các thông điệp mà bản đó chưa có, và các bản khác phải cắt bớt log. \`unclean.leader.election.enable\` mặc định \`false\`.

Tôi chỉ bật cho dữ liệu chấp nhận mất và cần sẵn sàng cao, như log phân tích. Với dữ liệu tài chính, tôi giữ tắt và chấp nhận dừng.

Từ Kafka 4.0 có Eligible Leader Replicas, bật mặc định trên cụm mới từ 4.1. Controller theo dõi các bản ngoài ISR nhưng vẫn an toàn để làm Leader, giảm số trường hợp phải chọn giữa dừng và mất dữ liệu.`,
    keyPoints: [
      { text: 'Controller chọn Leader mới từ ISR', keywords: ['controller', 'từ isr', 'bầu leader'], weight: 2 },
      { text: 'Client lấy lại metadata và gửi lại', keywords: ['metadata', 'gửi lại', 'retry'] },
      { text: 'Unclean election đánh đổi mất dữ liệu lấy sẵn sàng', keywords: ['unclean', 'mất dữ liệu', 'ngoài isr'], weight: 2 },
      { text: 'Mặc định tắt', keywords: ['mặc định tắt', 'false', 'mặc định'] },
      { text: 'Eligible Leader Replicas', keywords: ['eligible leader', 'elr'] },
    ],
    followUps: ['Bản sao bị cắt log khi nào?', 'Preferred leader là gì?'],
    commonMistakes: ['Nói Leader mới có thể là bất kỳ Follower nào theo mặc định.'],
  },
])
