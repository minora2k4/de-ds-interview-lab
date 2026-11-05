import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-kafka-ordering-01',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-ordering', 'kafka-partition'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Kafka đảm bảo thứ tự thông điệp ở phạm vi nào, vì sao lại như vậy? Làm sao giữ thứ tự theo từng khách hàng?',
    referenceAnswer: `Kafka chỉ đảm bảo thứ tự **trong một Partition**. Giữa các Partition của một Topic, và giữa các Topic, không có đảm bảo nào.

Lý do nằm ở cách mở rộng. Thứ tự toàn cục đòi hỏi mọi thông điệp đi qua một điểm duy nhất, nên thông lượng bị giới hạn bởi một máy. Kafka chia log thành nhiều Partition để ghi và đọc song song, mỗi Partition có một Leader quyết định thứ tự của riêng nó, và không có gì đồng bộ giữa các Leader.

Muốn giữ thứ tự theo khách hàng, tôi đặt key là \`customer_id\`. Cùng key vào cùng Partition, và Consumer Group giao mỗi Partition cho một Consumer. Vẫn song song giữa các khách hàng, nên không mất khả năng mở rộng.

Có ba điểm cần giữ: không thêm Partition vì sẽ đổi vị trí của key, xử lý trong Consumer không được làm đảo thứ tự của cùng key, và cần chú ý khi đưa bản ghi lỗi sang Topic thử lại. Nếu một khách hàng quá lớn thì key này sẽ tạo Hot Partition, lúc đó cần xem lại phạm vi thứ tự thực sự cần.`,
    keyPoints: [
      { text: 'Chỉ đảm bảo trong một Partition', keywords: ['trong một partition', 'một partition', 'từng partition'], weight: 2 },
      { text: 'Thứ tự toàn cục giới hạn khả năng mở rộng', keywords: ['toàn cục', 'mở rộng', 'một điểm', 'một máy'], weight: 2 },
      { text: 'Đặt key theo thực thể cần giữ thứ tự', keywords: ['key', 'customer id', 'cùng partition'], weight: 2 },
      { text: 'Thêm Partition làm đổi vị trí của key', keywords: ['thêm partition', 'đổi vị trí', 'chia dư'] },
    ],
    followUps: ['Nếu thật sự cần thứ tự toàn cục thì sao?', 'Hai Producer ghi cùng key thì thứ tự thế nào?'],
    commonMistakes: ['Nói Kafka đảm bảo thứ tự trên toàn Topic.'],
  },
  {
    id: 'iv-kafka-ordering-02',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-ordering', 'kafka-consumer'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Cần xử lý song song để bắt kịp lưu lượng nhưng vẫn phải đúng thứ tự theo từng tài khoản, và thỉnh thoảng có bản ghi lỗi. Bạn thiết kế Consumer thế nào?',
    referenceAnswer: `Đơn vị song song an toàn là **key**, không phải bản ghi. Tôi đặt key là \`account_id\`, rồi xử lý theo hai tầng.

**Tầng Partition:** tăng số Consumer tới bằng số Partition. Đây là cách đơn giản nhất và luôn giữ thứ tự.

**Tầng trong Consumer:** nếu cần nhanh hơn, tôi băm \`account_id\` vào một nhóm hàng đợi nội bộ, mỗi hàng đợi một luồng. Cùng tài khoản luôn vào cùng luồng nên giữ được thứ tự. Khó khăn là việc commit: chỉ được commit tới Offset mà mọi bản ghi trước đó đều đã xong, nên phải theo dõi phần đã hoàn tất.

**Xử lý bản ghi lỗi:** đây là chỗ dễ phá thứ tự nhất. Lỗi tạm thời thì thử lại tại chỗ có giới hạn. Lỗi vĩnh viễn thì không thể đơn giản đẩy sang Topic thử lại rồi đi tiếp, vì các giao dịch sau của tài khoản đó sẽ đi trước. Tôi đánh dấu tài khoản đó đang bị chặn, đưa cả các bản ghi sau của nó vào Topic chờ để xử lý đúng thứ tự, còn tài khoản khác vẫn chạy bình thường.

Nếu nghiệp vụ không cần thứ tự, Share Group đơn giản hơn nhiều. Ở đây thì không phù hợp, vì nó không giữ thứ tự.`,
    keyPoints: [
      { text: 'Đơn vị song song là key', keywords: ['theo key', 'account id', 'băm', 'cùng tài khoản'], weight: 2 },
      { text: 'Commit chỉ tới Offset đã hoàn tất liên tục', keywords: ['commit', 'đã hoàn tất', 'mọi bản ghi trước'], weight: 2 },
      { text: 'Bản ghi lỗi không được để bản sau vượt lên', keywords: ['bản ghi lỗi', 'chặn', 'topic thử lại', 'dead letter', 'dlq'], weight: 2 },
      { text: 'Share Group không phù hợp vì không giữ thứ tự', keywords: ['share group'] },
    ],
    followUps: ['Thời gian xử lý mỗi bản ghi rất khác nhau thì commit thế nào?'],
    commonMistakes: ['Xử lý đa luồng theo bản ghi rồi commit Offset lớn nhất.', 'Đẩy bản ghi lỗi sang Topic khác mà không xét các bản ghi sau của cùng key.'],
  },
  {
    id: 'iv-kafka-delivery-semantics-01',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-delivery-semantics', 'kafka-at-least-once', 'kafka-at-most-once'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Giải thích At-most-once, At-least-once và Exactly-once trong Kafka. Mặc định là mức nào?',
    referenceAnswer: `Ba mức mô tả thông điệp được xử lý bao nhiêu lần khi có lỗi.

**At-most-once:** có thể mất, không lặp. Producer không gửi lại, Consumer commit Offset trước khi xử lý. Chết sau khi commit thì phần chưa xử lý bị bỏ qua. Hợp với số liệu giám sát.

**At-least-once:** không mất, có thể lặp. Producer gửi lại, Consumer commit sau khi xử lý. Chết trước khi commit thì bản ghi được xử lý lại. Đây là **mặc định của Kafka**, và là lựa chọn của đa số pipeline, kèm upsert ở phía đích.

**Exactly-once:** không mất, không lặp. Kafka làm được bằng Idempotent Producer, Transactions và Consumer \`read_committed\`, nhưng chỉ trong phạm vi đọc, xử lý, ghi nằm trong Kafka. Hệ thống ngoài phải tự lũy đẳng hoặc lưu Offset cùng kết quả.

Điểm mấu chốt là thứ tự giữa xử lý và commit. Đây là thuộc tính của cả luồng, không phải của một cấu hình đơn lẻ.`,
    keyPoints: [
      { text: 'At-most-once có thể mất, commit trước khi xử lý', keywords: ['commit trước', 'có thể mất', 'at most once'], weight: 2 },
      { text: 'At-least-once có thể lặp, commit sau khi xử lý', keywords: ['commit sau', 'có thể lặp', 'có thể trùng', 'at least once'], weight: 2 },
      { text: 'Exactly-once chỉ trong phạm vi Kafka', keywords: ['trong kafka', 'transaction', 'phạm vi', 'read committed'], weight: 2 },
      { text: 'Mặc định là At-least-once', keywords: ['mặc định'] },
    ],
    followUps: ['Bạn chọn mức nào cho dữ liệu thanh toán?'],
    commonMistakes: ['Nói Exactly-once là mặc định vì idempotence đã bật sẵn.'],
  },
  {
    id: 'iv-kafka-delivery-semantics-02',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-delivery-semantics', 'kafka-replication', 'kafka-producer', 'kafka-consumer'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Dữ liệu có thể mất ở những chỗ nào trên đường đi qua Kafka? Làm sao để không mất?',
    referenceAnswer: `Tôi đi theo đường đi của dữ liệu, vì mỗi chặng có một cách mất riêng.

**Producer:** dữ liệu còn trong bộ đệm khi tiến trình chết, lỗi trong callback không được kiểm tra, hoặc hết \`delivery.timeout.ms\`. Cần kiểm tra kết quả gửi, và đóng Producer đúng cách để đẩy hết bộ đệm.

**Broker:**

- \`acks=1\`: Leader chết trước khi Follower sao chép.
- ISR co lại với \`min.insync.replicas=1\`: một bản đã đủ để xác nhận, đây là mặc định dễ bị bỏ qua.
- Unclean election: bản sao thiếu dữ liệu làm Leader.
- Topic tự tạo có replication factor 1.

Cần replication factor 3, \`min.insync.replicas=2\`, \`acks=all\`, unclean tắt, và đặt bản sao trên nhiều vùng.

**Retention:** Consumer tụt lại quá cửa sổ giữ, nên dữ liệu chưa đọc bị xóa. Cần cảnh báo theo lag.

**Consumer:** auto commit khi xử lý ở luồng khác, làm Offset vượt trước. Cần commit sau khi xử lý xong. Nhóm mới dùng \`auto.offset.reset=latest\` cũng sẽ bỏ qua dữ liệu cũ, và có thể bỏ sót khi thêm Partition.

Cuối cùng, tôi đối soát số lượng giữa nguồn và đích, vì không có cấu hình nào phát hiện được lỗi logic của ứng dụng.`,
    keyPoints: [
      { text: 'Producer: bộ đệm, callback, timeout', keywords: ['bộ đệm', 'callback', 'buffer', 'delivery timeout'], weight: 2 },
      { text: 'Broker: acks yếu, min ISR thấp, unclean election', keywords: ['acks', 'min insync', 'unclean', 'min isr'], weight: 2 },
      { text: 'Retention xóa dữ liệu chưa đọc', keywords: ['retention', 'chưa đọc', 'lag'], weight: 1 },
      { text: 'Consumer: commit trước khi xử lý xong', keywords: ['auto commit', 'commit trước', 'offset vượt'], weight: 2 },
      { text: 'Đối soát giữa nguồn và đích', keywords: ['đối soát', 'reconcile', 'so sánh số lượng'] },
    ],
    followUps: ['Bạn phát hiện mất dữ liệu bằng cách nào?', 'Vì sao hết delivery.timeout.ms vẫn có thể ghi thành công?'],
    commonMistakes: ['Chỉ nói về acks=all mà bỏ qua phía Consumer và Retention.'],
  },
  {
    id: 'iv-kafka-delivery-semantics-03',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-delivery-semantics', 'etl-idempotency'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Về nguyên lý, vì sao giao đúng một lần trên mạng không tin cậy lại khó? Vì sao nhiều hệ thống chọn At-least-once kèm lũy đẳng thay vì Exactly-once?',
    referenceAnswer: `Khi gửi mà không nhận được phản hồi, bên gửi không thể phân biệt bên nhận chưa nhận hay đã xử lý xong nhưng phản hồi bị mất. Chỉ còn hai lựa chọn: gửi lại và có thể lặp, hoặc không gửi và có thể mất. Không có giao thức nào gỡ được điều này chỉ bằng cách gửi thêm thông điệp.

Vì vậy "exactly-once" thực tế là **At-least-once ở tầng truyền, cộng với loại trùng ở tầng hiệu lực**. Kafka làm điều đó trong phạm vi của nó: mã Producer và số thứ tự để loại trùng, transaction để ghi kết quả và Offset cùng lúc. Hệ thống đích ngoài Kafka phải tự làm phần loại trùng.

Nhiều hệ thống chọn At-least-once kèm lũy đẳng vì:

- **Phạm vi:** pipeline hầu như luôn có hệ thống ngoài, nên vẫn cần lũy đẳng. Thêm transaction không bỏ được việc đó.
- **Chi phí:** transaction thêm độ trễ phía đọc và độ phức tạp khi xử lý lỗi.
- **Lợi ích phụ:** lũy đẳng cho phép đọc lại bất cứ lúc nào, rất có ích khi sửa lỗi và backfill.

Tôi dùng Transactions khi luồng nằm trọn trong Kafka, và phép tính khó lũy đẳng như cộng dồn. Còn lại, tôi ưu tiên lũy đẳng ở phía đích.`,
    keyPoints: [
      { text: 'Không phân biệt được chưa nhận hay mất phản hồi', keywords: ['không phân biệt', 'mất phản hồi', 'không biết'], weight: 2 },
      { text: 'Exactly-once là gửi lại cộng với loại trùng', keywords: ['loại trùng', 'gửi lại', 'hiệu lực', 'khử trùng'], weight: 2 },
      { text: 'Hệ thống ngoài vẫn cần lũy đẳng', keywords: ['hệ thống ngoài', 'lũy đẳng', 'idempotent'], weight: 2 },
      { text: 'Chi phí của transaction', keywords: ['độ trễ', 'phức tạp', 'chi phí'] },
    ],
    followUps: ['Thiết kế khóa lũy đẳng thế nào với phép cộng dồn?'],
    commonMistakes: ['Khẳng định Exactly-once là không thể, hoặc là luôn có sẵn, mà không nói rõ phạm vi.'],
  },
  {
    id: 'iv-kafka-at-most-once-01',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-at-most-once'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Khi nào At-most-once là lựa chọn đúng? Cấu hình thế nào để đạt được?',
    referenceAnswer: `At-most-once đúng khi mất một ít dữ liệu chấp nhận được, và độ trễ thấp hoặc việc không lặp quan trọng hơn. Ví dụ số liệu giám sát gửi mỗi vài giây: điểm sau thay thế điểm trước, nên mất vài điểm chỉ tạo khoảng trống nhỏ trên biểu đồ. Gửi lại trong lúc cụm đang quá tải còn làm tình hình tệ hơn.

Cách cấu hình gồm hai đầu. Producer tắt gửi lại, đặt \`retries=0\`, hoặc \`acks=0\` nếu không cần biết kết quả. Hai cấu hình này xung đột với idempotence, nên nó sẽ tự tắt. Consumer commit Offset trước khi xử lý.

Cần chú ý hai điều. Thứ nhất, mất dữ liệu kiểu này thường âm thầm, nhất là \`acks=0\`, nên không đối soát được. Thứ hai, chỉ cấu hình một đầu thì chưa phải At-most-once cho cả luồng. Với đơn hàng hay giao dịch, tôi không dùng mức này.`,
    keyPoints: [
      { text: 'Dùng khi mất dữ liệu chấp nhận được', keywords: ['chấp nhận mất', 'giám sát', 'mất một ít', 'metric'], weight: 2 },
      { text: 'Producer tắt gửi lại', keywords: ['retries', 'acks 0', 'không gửi lại', 'tắt gửi lại'], weight: 2 },
      { text: 'Consumer commit trước khi xử lý', keywords: ['commit trước', 'trước khi xử lý'], weight: 2 },
    ],
    followUps: ['Có đo được lượng dữ liệu đã mất không?'],
    commonMistakes: ['Chỉ nói về acks=0 mà bỏ qua phía Consumer.'],
  },
  {
    id: 'iv-kafka-at-least-once-01',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-at-least-once', 'etl-idempotency'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Trong At-least-once, trùng lặp xuất hiện ở đâu? Bạn xử lý trùng lặp ở phía đích thế nào?',
    referenceAnswer: `Trùng lặp có hai nguồn. **Producer gửi lại** khi mất phản hồi. Idempotent Producer, bật mặc định từ 3.0, đã loại được loại này trong một phiên. **Consumer xử lý lại** khi chết hoặc bị rebalance trước khi commit. Đây là nguồn chính, và idempotence ở Producer không giúp được.

Vì vậy phía đích phải lũy đẳng, tức xử lý nhiều lần cho cùng một kết quả:

- **Upsert theo khóa nghiệp vụ:** cách đơn giản nhất nếu đích có khóa chính.
- **Bảng mã sự kiện đã xử lý:** trong cùng giao dịch với kết quả, dùng cho phép cộng dồn. Bảng này cần dọn định kỳ.
- **Lưu Offset cùng kết quả:** trong một giao dịch của đích, và đọc Offset từ đó khi khởi động.
- **Đổi sang ghi giá trị tuyệt đối:** thay vì "cộng 10", ghi "số dư là 110" kèm phiên bản.

Mã sự kiện phải được tạo ở nguồn, và ổn định qua các lần gửi lại. Nếu mỗi lần gửi lại sinh mã mới thì không khử được trùng. Hiệu ứng bên ngoài như gửi email cần một khóa chống lặp ở dịch vụ nhận.`,
    keyPoints: [
      { text: 'Hai nguồn trùng: Producer gửi lại, Consumer xử lý lại', keywords: ['gửi lại', 'xử lý lại', 'rebalance'], weight: 2 },
      { text: 'Idempotent Producer không chống trùng phía Consumer', keywords: ['idempotent producer', 'không giúp', 'phía consumer'] },
      { text: 'Upsert hoặc bảng đã xử lý', keywords: ['upsert', 'bảng đã xử lý', 'mã sự kiện', 'event id'], weight: 2 },
      { text: 'Mã sự kiện phải ổn định từ nguồn', keywords: ['ổn định', 'tạo ở nguồn', 'khóa chống lặp'] },
    ],
    followUps: ['Bảng mã sự kiện lớn dần thì xử lý thế nào?'],
    commonMistakes: ['Dùng timestamp lúc xử lý làm khóa chống trùng.'],
  },
  {
    id: 'iv-kafka-exactly-once-01',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-exactly-once', 'kafka-producer'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Idempotent Producer hoạt động thế nào? Nó không giải quyết được những gì?',
    referenceAnswer: `Vấn đề gốc: Producer gửi xong, Broker đã ghi nhưng phản hồi bị mất. Producer không biết nên gửi lại, và tạo bản trùng trong log.

Idempotent Producer làm cho việc gửi lại trở nên an toàn. Broker gán cho Producer một mã. Producer đánh số thứ tự tăng dần cho từng bản ghi theo từng Partition. Broker nhớ số cuối cùng của các batch gần nhất. Thấy số đã có thì bỏ qua và vẫn báo thành công, thấy số bị nhảy thì từ chối để gửi lại đúng thứ tự. Nhờ đó không có trùng, và thứ tự được giữ với tối đa 5 request đang gửi.

Từ Kafka 3.0, \`enable.idempotence\` mặc định bật, kéo theo \`acks=all\`. Nếu đặt \`acks=1\` mà không bật tường minh, nó sẽ âm thầm tắt.

Nó không giải quyết được:

- **Qua nhiều phiên:** khởi động lại có thể nhận mã mới, nên chỉ đảm bảo trong một phiên.
- **Ứng dụng gửi lại:** tự gọi \`send()\` lần nữa thì là bản ghi mới với số mới.
- **Ghi nhiều Partition nguyên tử:** cần Transactions.
- **Trùng ở phía Consumer:** Consumer xử lý lại không liên quan đến cơ chế này.`,
    keyPoints: [
      { text: 'Mã Producer và số thứ tự theo Partition', keywords: ['số thứ tự', 'sequence', 'producer id', 'pid'], weight: 2 },
      { text: 'Broker loại bản đã có', keywords: ['loại', 'bỏ qua', 'đã có', 'dedup'], weight: 1 },
      { text: 'Chỉ trong một phiên', keywords: ['một phiên', 'session', 'khởi động lại'], weight: 2 },
      { text: 'Không chống ứng dụng gửi lại', keywords: ['ứng dụng gửi lại', 'gọi send', 'application'], weight: 1 },
      { text: 'Không chống Consumer xử lý lại', keywords: ['consumer', 'xử lý lại', 'phía đọc'], weight: 2 },
    ],
    followUps: ['Vì sao giới hạn tối đa là 5 request đang gửi?'],
    commonMistakes: ['Nói idempotence giúp đạt Exactly-once cho cả luồng.'],
  },
  {
    id: 'iv-kafka-exactly-once-02',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-exactly-once', 'kafka-consumer'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Kafka Transactions hoạt động thế nào trong luồng đọc, xử lý, ghi? Chi phí của nó là gì?',
    referenceAnswer: `Vấn đề: đọc Topic A, ghi Topic B, rồi commit Offset là hai thao tác tách rời. Chết giữa chừng thì hoặc lặp, hoặc mất.

Kafka giải quyết nhờ một nhận xét: Offset cũng chỉ là bản ghi trong Topic nội bộ. Nên Producer có thể ghi kết quả và Offset **trong cùng một transaction**.

Trình tự: Producer có \`transactional.id\`, khởi tạo để coordinator tăng epoch và chặn phiên cũ. Sau đó bắt đầu transaction, ghi kết quả, gửi Offset, rồi commit. Coordinator lưu trạng thái vào \`__transaction_state\`, và ghi bản ghi đánh dấu commit hoặc abort vào các Partition liên quan. Consumer đặt \`read_committed\` chỉ đọc tới last stable offset, nên không thấy phần chưa commit hay đã hủy. Consumer cũng phải tắt auto commit, và khi abort phải đưa vị trí đọc về Offset đã commit.

Chi phí:

- **Độ trễ phía đọc:** bằng khoảng cách commit. Commit thưa thì trễ, commit dày thì tốn thông lượng.
- **Transaction treo:** chặn Consumer tại last stable offset tới khi hết \`transaction.timeout.ms\`, mặc định 1 phút.
- **Phức tạp khi xử lý lỗi.**

Vì vậy tôi ưu tiên Kafka Streams với \`exactly_once_v2\`. Lưu ý phạm vi chỉ trong Kafka.`,
    keyPoints: [
      { text: 'Ghi kết quả và Offset trong cùng transaction', keywords: ['cùng transaction', 'offset', 'nguyên tử', 'atomic'], weight: 2 },
      { text: 'transactional.id và chặn phiên cũ', keywords: ['transactional id', 'epoch', 'zombie', 'fencing'], weight: 2 },
      { text: 'Consumer read_committed và last stable offset', keywords: ['read committed', 'last stable offset', 'lso'], weight: 2 },
      { text: 'Chi phí về độ trễ và transaction treo', keywords: ['độ trễ', 'treo', 'timeout', 'thông lượng'] },
    ],
    followUps: ['Vì sao nên dùng một Producer cho mỗi Consumer?', 'Commit transaction bao lâu một lần là hợp lý?'],
    commonMistakes: ['Quên rằng Consumer mặc định là read_uncommitted.'],
  },
  {
    id: 'iv-kafka-exactly-once-03',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-exactly-once', 'etl-idempotency'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Kafka nói hỗ trợ Exactly-once. Điều đó có đúng khi Consumer ghi vào PostgreSQL hoặc gọi một API bên ngoài không?',
    referenceAnswer: `Không tự đúng. Exactly-once của Kafka có phạm vi rõ ràng: đọc, xử lý, ghi **nằm trong Kafka**. Nó hoạt động được vì kết quả và Offset đều là bản ghi trong Kafka, nên có thể nằm chung một transaction.

Khi ghi ra PostgreSQL, có hai hệ thống với hai giao dịch riêng. Nếu ghi xong mà chết trước khi commit Offset, bản ghi sẽ được xử lý lại. Bật transaction của Kafka không giúp được, vì PostgreSQL không tham gia vào đó. Tài liệu Kafka cũng ghi rõ exactly-once với hệ thống đích khác cần sự phối hợp của chính hệ thống đó.

Có hai cách làm đúng với cơ sở dữ liệu:

- **Ghi lũy đẳng:** upsert theo khóa, kết quả cuối không đổi khi đọc lại.
- **Lưu Offset cùng kết quả:** trong một giao dịch PostgreSQL, và đọc Offset từ đó khi khởi động. Đây là cách tài liệu Kafka gợi ý thay cho two-phase commit, vì nhiều hệ thống không hỗ trợ.

Với API bên ngoài như thanh toán hay email, hiệu ứng không thu hồi được. Cần **khóa chống lặp**: gửi mã duy nhất, phía bên kia từ chối nếu đã thấy. Nếu API không hỗ trợ thì chỉ đạt At-least-once, và phải đối soát.

Kafka Connect có thể giúp, nhưng đảm bảo vẫn phụ thuộc vào từng connector.`,
    keyPoints: [
      { text: 'Exactly-once chỉ trong phạm vi Kafka', keywords: ['trong kafka', 'phạm vi', 'không tự đúng'], weight: 2 },
      { text: 'Hai hệ thống có hai giao dịch riêng', keywords: ['hai giao dịch', 'hai hệ thống', 'tách rời'], weight: 2 },
      { text: 'Ghi lũy đẳng hoặc upsert', keywords: ['upsert', 'lũy đẳng', 'idempotent'], weight: 2 },
      { text: 'Lưu Offset cùng kết quả', keywords: ['lưu offset', 'cùng giao dịch', 'offset cùng'], weight: 2 },
      { text: 'API ngoài cần khóa chống lặp', keywords: ['khóa chống lặp', 'idempotency key', 'mã duy nhất'] },
    ],
    followUps: ['Kafka Connect đạt exactly-once tới đích bằng cách nào?', 'Two-phase commit có vấn đề gì?'],
    commonMistakes: ['Nói bật transaction là cả pipeline tới cơ sở dữ liệu đều exactly-once.'],
  },
  {
    id: 'iv-kafka-exactly-once-04',
    topicId: 'kafka',
    category: 'kafka-semantics',
    conceptIds: ['kafka-exactly-once', 'kafka-delivery-semantics', 'kafka-ordering'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Thiết kế pipeline sự kiện thanh toán từ dịch vụ thanh toán qua Kafka vào hệ thống sổ cái: không mất, không ghi hai lần, đúng thứ tự theo từng tài khoản.',
    referenceAnswer: `Tôi chia theo từng chặng, vì không có một cấu hình nào bao phủ toàn bộ.

**Nguồn sang Kafka:** không ghi đồng thời cơ sở dữ liệu và Kafka. Dùng outbox: ghi giao dịch và sự kiện trong một giao dịch, rồi CDC đọc outbox đẩy vào Kafka. Mỗi sự kiện có \`payment_id\` tạo ở nguồn, ổn định qua các lần gửi lại.

**Kafka:** key là \`account_id\` để giữ thứ tự theo tài khoản. Replication factor 3, \`min.insync.replicas=2\`, \`acks=all\`, unclean tắt, tắt tự tạo Topic. Tính dư số Partition vì không nên tăng về sau.

**Xử lý trung gian trong Kafka:** nếu có làm giàu hoặc gộp, dùng Kafka Streams với \`exactly_once_v2\`. Bên đọc phải đặt \`read_committed\`.

**Kafka sang sổ cái:** đây là chặng Kafka không bao phủ. Trong một giao dịch của sổ cái, tôi ghi bút toán, ghi \`payment_id\` vào bảng đã xử lý với ràng buộc duy nhất, và lưu Offset. Đọc lại chỉ làm phát sinh lỗi trùng khóa và được bỏ qua.

**Lỗi:** lỗi tạm thời thì thử lại tại chỗ. Lỗi vĩnh viễn thì chặn tài khoản đó, không để giao dịch sau vượt lên, và đưa vào hàng chờ xử lý.

**Giám sát:** cảnh báo theo lag, và đối soát cuối ngày giữa dịch vụ thanh toán và sổ cái. Đối soát là lớp bảo vệ cuối, vì lỗi logic thì không giao thức nào phát hiện được.`,
    keyPoints: [
      { text: 'Outbox hoặc CDC thay vì dual write', keywords: ['outbox', 'cdc', 'dual write'], weight: 2 },
      { text: 'Key theo tài khoản để giữ thứ tự', keywords: ['account id', 'theo tài khoản', 'key'], weight: 2 },
      { text: 'Cấu hình độ bền', keywords: ['acks', 'min insync', 'unclean', 'replication factor'], weight: 2 },
      { text: 'Lũy đẳng ở sổ cái bằng ràng buộc duy nhất và giao dịch của đích', keywords: ['ràng buộc duy nhất', 'bảng đã xử lý', 'payment id', 'cùng giao dịch', 'lưu offset'], weight: 2 },
      { text: 'Bản ghi lỗi không được phá thứ tự', keywords: ['bản ghi lỗi', 'chặn tài khoản', 'hàng chờ'] },
      { text: 'Đối soát cuối ngày', keywords: ['đối soát', 'reconcile'] },
    ],
    followUps: ['Outbox có làm trễ sự kiện không?', 'Nếu sổ cái ngừng hoạt động 2 giờ thì pipeline thế nào?'],
    commonMistakes: ['Dựa hoàn toàn vào Kafka Transactions cho cả chặng vào sổ cái.', 'Bỏ qua đối soát.'],
  },
])
