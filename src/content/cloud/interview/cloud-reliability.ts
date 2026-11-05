import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-cloud-ft-01',
    topicId: 'cloud',
    category: 'cloud-reliability',
    conceptIds: ['cloud-fault-tolerance', 'hadoop-fault-tolerance', 'kafka-replication'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Một hệ thống phân tán chịu lỗi dựa trên những nguyên lý nào? Lấy ví dụ từ Hadoop, Spark hoặc Kafka.',
    referenceAnswer: `Mọi cơ chế chịu lỗi đều gồm ba việc: dư thừa, phát hiện và phục hồi.

**Dư thừa** là có thứ để thay thế. HDFS giữ nhiều bản sao block, Kafka giữ bản sao Partition. Spark thì khác: nó không sao chép RDD mà giữ lineage để tính lại, nên dư thừa nằm ở công thức tính và dữ liệu nguồn.

**Phát hiện** dựa trên heartbeat và timeout. Đây chỉ là phỏng đoán, vì không phân biệt được máy chết với máy chậm. Timeout ngắn gây chuyển đổi nhầm, timeout dài làm phục hồi chậm.

**Phục hồi** là chạy lại task hoặc bầu leader mới. Vì có thể chạy lại, thao tác phải idempotent, nếu không sẽ ghi trùng.

Tôi cũng lưu ý lỗi có tương quan: bản sao phải ở các vùng lỗi khác nhau. Đồng thời thử lại phải có backoff và jitter, để chính cơ chế chịu lỗi không làm sự cố kéo dài.`,
    keyPoints: [
      { text: 'Ba việc: dư thừa, phát hiện, phục hồi', keywords: ['dư thừa', 'redundancy', 'phát hiện', 'phục hồi'], weight: 2 },
      { text: 'Heartbeat và timeout chỉ là phỏng đoán', keywords: ['heartbeat', 'timeout', 'phỏng đoán'] },
      { text: 'Ví dụ từ Hadoop, Spark, Kafka', keywords: ['hdfs', 'lineage', 'kafka', 'bản sao block', 'leader'], weight: 2 },
      { text: 'Thao tác phải idempotent', keywords: ['idempotent', 'ghi trùng'] },
      { text: 'Lỗi tương quan hoặc retry storm', keywords: ['tương quan', 'vùng lỗi', 'backoff', 'jitter'] },
    ],
    followUps: ['Vì sao Spark không sao chép RDD như HDFS?', 'Timeout nên đặt thế nào?'],
    commonMistakes: ['Chỉ liệt kê tính năng của một công cụ mà không nêu nguyên lý chung.', 'Quên việc chạy lại có thể gây ghi trùng.'],
  },
  {
    id: 'iv-cloud-ha-01',
    topicId: 'cloud',
    category: 'cloud-reliability',
    conceptIds: ['cloud-high-availability', 'cloud-fault-tolerance'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'High Availability, Fault Tolerance và Disaster Recovery khác nhau thế nào?',
    referenceAnswer: `Ba khái niệm trả lời ba câu hỏi khác nhau.

**High Availability** hỏi dịch vụ có đang trả lời không, đo bằng số chín như 99,9%, tức dừng khoảng 8,76 giờ mỗi năm. Khi chuyển đổi có thể có gián đoạn ngắn.

**Fault Tolerance** hỏi hệ thống có tiếp tục chạy đúng khi một phần hỏng không, thường đo bằng số lỗi chịu được. Một job Spark mất Executor vẫn cho kết quả đúng, chỉ chậm hơn: đó là chịu lỗi, không nhất thiết là sẵn sàng cao.

**Disaster Recovery** hỏi nếu mất cả một vùng thì sao, đo bằng RTO là thời gian phục hồi và RPO là lượng dữ liệu được phép mất. Nó thường dựa vào bản sao hoặc sao lưu ở vùng khác.

Trong thực tế, tôi chọn mức đầu tư theo hậu quả của việc dừng. Một job theo lô chạy lại được không cần 99,99%, nhưng hàng đợi nhận sự kiện thì khác, vì mất là mất luôn.`,
    keyPoints: [
      { text: 'HA đo tỷ lệ thời gian trả lời được', keywords: ['số chín', 'tỷ lệ', '99,9', 'trả lời được'], weight: 2 },
      { text: 'Fault Tolerance là chạy đúng khi một phần hỏng', keywords: ['một phần hỏng', 'chạy đúng', 'chịu lỗi'], weight: 2 },
      { text: 'Disaster Recovery với RTO và RPO', keywords: ['rto', 'rpo', 'mất cả vùng'], weight: 2 },
      { text: 'Chọn theo hậu quả nghiệp vụ', keywords: ['hậu quả', 'nghiệp vụ', 'chạy lại được'] },
    ],
    followUps: ['RPO bằng 0 đòi hỏi điều gì?', 'Ba dịch vụ 99,9% nối tiếp cho tỷ lệ bao nhiêu?'],
    commonMistakes: ['Dùng lẫn ba khái niệm như nhau.', 'Cho rằng HA đồng nghĩa với không mất dữ liệu.'],
  },
  {
    id: 'iv-cloud-ha-02',
    topicId: 'cloud',
    category: 'cloud-reliability',
    conceptIds: ['cloud-high-availability', 'cloud-replication', 'cloud-load-balancing'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn thiết kế một API phục vụ dữ liệu với mục tiêu 99,99%. Bạn tiếp cận thế nào, và đâu là phần khó nhất?',
    referenceAnswer: `99,99% chỉ cho phép dừng khoảng 52,6 phút mỗi năm, nên không thể dựa vào người can thiệp. Việc đầu tiên là vẽ đường đi của yêu cầu và tính ngược: các thành phần nối tiếp nhân với nhau, nên mọi phụ thuộc đồng bộ đều phải cao hơn mục tiêu, hoặc phải có đường dự phòng khi nó lỗi.

Tầng API không giữ trạng thái nên dễ: nhiều máy ở ít nhất ba AZ, sau Load Balancer có Health Check. Phần khó nhất là tầng dữ liệu. Tôi cần sao chép đa AZ với chuyển đổi tự động, và phải quyết định giữa sao chép đồng bộ để không mất dữ liệu hay bất đồng bộ để độ trễ thấp. Với dữ liệu phục vụ đọc, có thể dùng cache để vẫn trả được dữ liệu cũ khi nguồn lỗi, tức chọn A thay vì C.

Hai điều hay bị bỏ qua: lỗi cấu hình và triển khai mới là nguyên nhân dừng phổ biến, nên cần triển khai dần và rollback nhanh. Và các bản dự phòng chỉ có giá trị nếu thử nghiệm chuyển đổi thường xuyên.`,
    keyPoints: [
      { text: 'Tính ngược từ thời gian dừng cho phép và phụ thuộc nối tiếp', keywords: ['nối tiếp', '52', 'tính ngược', 'phụ thuộc'], weight: 2 },
      { text: 'Tầng không giữ trạng thái đa AZ sau Load Balancer', keywords: ['nhiều az', 'đa az', 'load balancer', 'health check'] },
      { text: 'Tầng dữ liệu là phần khó: sao chép và chuyển đổi', keywords: ['chuyển đổi', 'failover', 'đồng bộ', 'tầng dữ liệu'], weight: 2 },
      { text: 'Suy giảm có kiểm soát bằng dữ liệu cũ', keywords: ['cache', 'dữ liệu cũ', 'degrade'] },
      { text: 'Triển khai an toàn và diễn tập', keywords: ['triển khai', 'rollback', 'diễn tập', 'thử nghiệm'] },
    ],
    followUps: ['Bạn tránh split-brain thế nào?', 'Khi nào cần đa vùng thay vì đa AZ?'],
    commonMistakes: ['Chỉ nói thêm máy mà không tính phụ thuộc nối tiếp.', 'Quên lỗi do con người và do triển khai.'],
  },
  {
    id: 'iv-cloud-replication-01',
    topicId: 'cloud',
    category: 'cloud-reliability',
    conceptIds: ['cloud-replication', 'kafka-replication', 'cloud-consistency'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'So sánh sao chép đồng bộ và bất đồng bộ. Kafka dung hòa hai cách này ra sao?',
    referenceAnswer: `Câu hỏi cốt lõi là báo thành công cho client khi nào. **Đồng bộ** chờ bản sao xác nhận rồi mới báo, nên không mất dữ liệu đã xác nhận khi leader hỏng, nhưng độ trễ ghi tăng, và một bản sao chậm có thể kéo chậm hoặc chặn việc ghi. **Bất đồng bộ** báo ngay, nên nhanh và không phụ thuộc bản sao, nhưng có độ trễ sao chép: đọc từ bản sao có thể thấy dữ liệu cũ, và leader hỏng sẽ mất các ghi chưa kịp chuyển.

[[kafka-replication|Kafka]] dung hòa bằng tập ISR gồm các bản sao bắt kịp leader. Với \`acks=all\`, leader chờ toàn bộ ISR, chứ không chờ mọi bản sao. Bản sao chậm bị loại khỏi ISR nên không chặn được việc ghi. Kết hợp \`min.insync.replicas=2\` với hệ số sao chép 3, hệ thống chịu được mất một broker mà không mất dữ liệu đã xác nhận. Nếu ISR nhỏ hơn mức này thì Producer nhận lỗi, tức ưu tiên C hơn A.

Ở chế độ \`acks=1\`, Kafka chỉ chờ leader, nên nhanh hơn nhưng có thể mất dữ liệu.`,
    keyPoints: [
      { text: 'Khác nhau ở thời điểm báo thành công', keywords: ['báo thành công', 'xác nhận', 'chờ bản sao'], weight: 2 },
      { text: 'Bất đồng bộ có độ trễ và có thể mất dữ liệu', keywords: ['độ trễ sao chép', 'mất dữ liệu', 'replication lag'], weight: 2 },
      { text: 'Kafka dùng ISR', keywords: ['isr', 'in-sync'], weight: 2 },
      { text: 'acks=all với min.insync.replicas', keywords: ['acks', 'min.insync.replicas'] },
    ],
    followUps: ['Điều gì xảy ra khi ISR nhỏ hơn min.insync.replicas?', 'HDFS sao chép theo kiểu nào?'],
    commonMistakes: ['Nói acks=all là chờ mọi bản sao, kể cả bản ngoài ISR.'],
  },
  {
    id: 'iv-cloud-replication-02',
    topicId: 'cloud',
    category: 'cloud-reliability',
    conceptIds: ['cloud-replication', 'db-sharding', 'hadoop-block-replication'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Replication, Sharding và Backup khác nhau thế nào? Một hệ thống lớn có cần cả ba không?',
    referenceAnswer: `**Replication** chép cùng một dữ liệu sang nhiều máy, để tăng độ bền, tính sẵn sàng và năng lực đọc. Nó không tăng năng lực ghi.

**Sharding** chia dữ liệu thành nhiều phần khác nhau, mỗi máy giữ một phần. Nó tăng dung lượng và năng lực ghi, nhưng không bảo vệ dữ liệu: mất một shard là mất phần đó.

**Backup** là bản chụp theo thời gian, thường ở nơi khác. Nó không phục vụ truy vấn hằng ngày, nhưng là cách duy nhất quay lại trạng thái trước khi có lỗi logic hay xóa nhầm, vì các lỗi này cũng được sao chép sang mọi bản.

Hệ thống lớn thường cần cả ba, vì chúng giải quyết các vấn đề khác nhau. Kafka là ví dụ về hai cái đầu: Topic chia thành Partition, mỗi Partition lại có nhiều bản sao. HDFS cũng vậy, tệp chia thành block và mỗi block có ba bản sao. Riêng Backup vẫn phải có, nếu dữ liệu đó không tái tạo được từ nguồn.`,
    keyPoints: [
      { text: 'Replication là cùng dữ liệu trên nhiều máy', keywords: ['cùng dữ liệu', 'bản sao', 'độ bền'], weight: 2 },
      { text: 'Sharding chia dữ liệu, tăng ghi và dung lượng', keywords: ['chia dữ liệu', 'mỗi máy một phần', 'năng lực ghi'], weight: 2 },
      { text: 'Backup chống lỗi logic và xóa nhầm', keywords: ['xóa nhầm', 'lỗi logic', 'bản chụp', 'quay lại'], weight: 2 },
      { text: 'Kết hợp cả ba, ví dụ Kafka, HDFS', keywords: ['kafka', 'hdfs', 'kết hợp'] },
    ],
    followUps: ['Khi nào không cần Backup?', 'Ở Kafka, mất hết bản sao của một Partition thì sao?'],
    commonMistakes: ['Xem Replication là Backup.', 'Cho rằng Sharding giúp bảo vệ dữ liệu.'],
  },
])
