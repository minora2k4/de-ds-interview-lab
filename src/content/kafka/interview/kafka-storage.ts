import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-kafka-topic-01',
    topicId: 'kafka',
    category: 'kafka-storage',
    conceptIds: ['kafka-topic', 'kafka-partition'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Topic và Partition khác nhau thế nào? Khi nào nên tách một luồng dữ liệu thành nhiều Topic?',
    referenceAnswer: `Topic là tên logic của một luồng sự kiện. Partition là log vật lý thực sự nằm trên đĩa. Một Topic gồm nhiều Partition đặt trên nhiều Broker. Producer ghi vào Topic rồi được đưa vào một Partition, còn Consumer đọc theo từng Partition. Thứ tự chỉ có trong từng Partition, không có trên toàn Topic.

Tôi tách Topic khi dữ liệu khác nhau về schema, về thời gian giữ, về số bản sao hoặc về quyền truy cập, vì các cấu hình này đặt theo Topic. Ví dụ log ứng dụng giữ 1 ngày, còn sự kiện thanh toán giữ 30 ngày.

Tôi gộp các sự kiện vào một Topic khi cần thứ tự giữa chúng. Ví dụ tạo đơn và hủy đơn cùng \`order_id\`: nếu nằm ở hai Topic thì không còn gì đảm bảo thứ tự. Tôi cũng tránh tạo một Topic cho mỗi khách hàng vì số Partition sẽ tăng rất nhanh.`,
    keyPoints: [
      { text: 'Topic là logic, Partition là log vật lý', keywords: ['logic', 'vật lý', 'log trên đĩa'], weight: 2 },
      { text: 'Thứ tự chỉ trong từng Partition', keywords: ['thứ tự', 'trong partition', 'từng partition'], weight: 2 },
      { text: 'Tách Topic theo schema, Retention, quyền', keywords: ['schema', 'retention', 'quyền', 'thời gian giữ'] },
      { text: 'Gộp khi cần thứ tự giữa các sự kiện', keywords: ['cùng topic', 'gộp', 'thứ tự giữa'] },
    ],
    followUps: ['Vì sao không nên tạo mỗi khách hàng một Topic?'],
    commonMistakes: ['Nói Topic là một tệp trên một máy.'],
  },
  {
    id: 'iv-kafka-partition-01',
    topicId: 'kafka',
    category: 'kafka-storage',
    conceptIds: ['kafka-partition'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Vì sao Kafka chia Topic thành nhiều Partition? Việc này đánh đổi điều gì?',
    referenceAnswer: `Một log đơn nằm trên một máy nên bị giới hạn bởi đĩa và mạng của máy đó, và chỉ một bên đọc có thể xử lý tuần tự. Chia thành nhiều Partition giải quyết ba việc. Thứ nhất, Topic có thể lớn hơn một máy. Thứ hai, Producer ghi song song tới nhiều Leader trên nhiều Broker. Thứ ba, Consumer trong một nhóm đọc song song, mỗi Consumer giữ một số Partition.

Cái giá là **mất thứ tự toàn cục**. Mỗi Partition có dãy Offset riêng, và không có gì đồng bộ giữa chúng. Nếu cần thứ tự thì dùng key để sự kiện liên quan vào cùng Partition.

Số Partition cũng là quyết định khó đổi. Tăng về sau làm đổi vị trí của key, còn giảm thì Kafka không hỗ trợ. Quá nhiều Partition lại tốn bộ nhớ, metadata và làm chậm việc phục hồi. Vì vậy nên chọn từ số liệu thông lượng.`,
    keyPoints: [
      { text: 'Mở rộng dung lượng vượt quá một máy', keywords: ['nhiều máy', 'một máy', 'dung lượng', 'mở rộng'], weight: 2 },
      { text: 'Song song khi ghi và khi đọc', keywords: ['song song', 'parallel'], weight: 2 },
      { text: 'Đánh đổi là mất thứ tự toàn cục', keywords: ['thứ tự toàn cục', 'mất thứ tự', 'không có thứ tự'], weight: 2 },
      { text: 'Số Partition khó đổi và có chi phí', keywords: ['khó đổi', 'không giảm', 'metadata', 'chi phí'] },
    ],
    followUps: ['Làm sao giữ thứ tự theo khách hàng?', 'Partition của Kafka khác Partition của Spark thế nào?'],
    commonMistakes: ['Nhầm Partition với bản sao dữ liệu.'],
  },
  {
    id: 'iv-kafka-partition-02',
    topicId: 'kafka',
    category: 'kafka-storage',
    conceptIds: ['kafka-partition', 'kafka-consumer-group'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn chọn số Partition cho một Topic mới như thế nào?',
    referenceAnswer: `Tôi tính từ hai giới hạn, rồi lấy giá trị lớn hơn.

**Chiều ghi:** lưu lượng ghi chia cho thông lượng an toàn của một Partition, đo trên chính phần cứng và cấu hình của mình. **Chiều đọc:** lưu lượng đọc chia cho thông lượng của một Consumer. Chiều đọc thường là giới hạn lớn hơn, vì Consumer có thể phải ghi vào cơ sở dữ liệu, chậm hơn nhiều so với Kafka.

Ví dụ: 120 MB/giây, một Partition 10 MB/giây, một Consumer 5 MB/giây. Chiều ghi cần 12, chiều đọc cần 24, nên tối thiểu 24.

Tiếp theo tôi cộng dự phòng tăng trưởng. Với Topic cần thứ tự theo key, phần dự phòng phải đủ cho vài năm, vì tăng về sau sẽ đổi vị trí của key. Với Topic không cần thứ tự thì tăng sau cũng dễ, nên có thể chọn sát hơn.

Giới hạn trên đến từ chi phí: bộ nhớ Producer vì mỗi Partition một batch, số tệp mở, metadata, thời gian bầu lại Leader và thời gian rebalance. Tôi cũng kiểm tra phân phối key, vì một key lệch nặng thì thêm Partition không giúp được gì.`,
    keyPoints: [
      { text: 'Tính theo cả chiều ghi và chiều đọc', keywords: ['chiều ghi', 'chiều đọc', 'lưu lượng', 'thông lượng'], weight: 2 },
      { text: 'Đo thông lượng thực tế', keywords: ['đo', 'thực tế', 'benchmark', 'kiểm thử'] },
      { text: 'Cộng dự phòng tăng trưởng vì khó đổi về sau', keywords: ['dự phòng', 'tăng trưởng', 'về sau'], weight: 2 },
      { text: 'Chi phí của quá nhiều Partition', keywords: ['metadata', 'bộ nhớ', 'tệp mở', 'bầu lại leader'], weight: 2 },
      { text: 'Kiểm tra phân phối key', keywords: ['phân phối key', 'key lệch', 'hot partition'] },
    ],
    followUps: ['Có giới hạn số Partition trên mỗi Broker không?', 'Nếu đã chọn thiếu Partition thì làm gì?'],
    commonMistakes: ['Đưa ra một con số cố định mà không tính từ lưu lượng.', 'Quên rằng số Consumer bị giới hạn bởi số Partition.'],
  },
  {
    id: 'iv-kafka-partition-03',
    topicId: 'kafka',
    category: 'kafka-storage',
    conceptIds: ['kafka-partition', 'kafka-ordering'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Một key chiếm phần lớn lưu lượng tạo ra Hot Partition. Bạn phát hiện và xử lý thế nào?',
    referenceAnswer: `**Phát hiện:** lưu lượng theo từng Partition rất lệch, lag chỉ tăng ở một vài Partition, và đĩa hoặc mạng của Broker chứa Leader đó cao hơn hẳn. Tôi thống kê top key trên một mẫu dữ liệu để xác nhận.

**Vì sao thêm Partition không giúp được:** mọi thông điệp cùng key đều vào một Partition, nên một key đơn lẻ không thể tách ra bằng cách thêm Partition. Thêm Consumer cũng vô ích, vì mỗi Partition chỉ giao cho một Consumer trong nhóm.

**Xử lý, theo thứ tự:**

1. Hỏi lại yêu cầu thứ tự. Thường nghiệp vụ chỉ cần thứ tự theo đơn hàng hoặc phiên, không phải theo khách hàng. Đổi sang key chi tiết hơn là cách sạch nhất.
2. Thêm hậu tố vào key lớn, ví dụ \`tenant_a#0\` đến \`tenant_a#9\`. Tải được chia ra, nhưng mất thứ tự trên toàn khách hàng đó.
3. Tách khách hàng lớn sang Topic riêng để không ảnh hưởng người khác.
4. Nếu không cần thứ tự, bỏ key và dùng sticky partitioning.

Việc đổi key cũng phải cẩn thận trong giai đoạn chuyển tiếp, vì sự kiện cũ và mới của cùng thực thể có thể nằm ở hai Partition.`,
    keyPoints: [
      { text: 'Phát hiện qua lưu lượng và lag lệch giữa các Partition', keywords: ['lệch', 'lag', 'top key', 'theo partition'], weight: 2 },
      { text: 'Thêm Partition hoặc Consumer không tách được một key', keywords: ['không tách', 'cùng key', 'một partition'], weight: 2 },
      { text: 'Xem lại phạm vi thứ tự và đổi key', keywords: ['đổi key', 'chi tiết hơn', 'phạm vi thứ tự'], weight: 2 },
      { text: 'Thêm hậu tố hoặc tách Topic riêng', keywords: ['hậu tố', 'salting', 'topic riêng', 'salt'] },
    ],
    followUps: ['Chọn key thế nào ngay từ đầu để tránh việc này?'],
    commonMistakes: ['Đề xuất thêm Partition như cách chữa Hot Partition.'],
  },
  {
    id: 'iv-kafka-partition-04',
    topicId: 'kafka',
    category: 'kafka-storage',
    conceptIds: ['kafka-partition', 'kafka-consumer'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Tăng số Partition cho một Topic đang chạy có rủi ro gì? Bạn chuẩn bị ra sao?',
    referenceAnswer: `Thao tác này chỉ cần một lệnh, nhưng có ba rủi ro.

**Thứ tự theo key:** dữ liệu cũ không di chuyển, còn công thức chia dư đã đổi, nên sự kiện mới của một key có thể sang Partition khác. Bên đọc có thể xử lý sự kiện mới trước sự kiện cũ. Nếu Topic cần thứ tự theo key, tôi tạo Topic mới và chuyển có kiểm soát, hoặc đợi Consumer hết lag rồi mới tăng để giảm rủi ro.

**Bỏ sót dữ liệu:** Partition mới không có Offset đã commit. Với \`auto.offset.reset=latest\`, Consumer có thể phát hiện Partition mới sau khi Producer đã ghi, nên bỏ qua các thông điệp đó. Tài liệu chính thức cảnh báo điều này có thể gây mất dữ liệu âm thầm, và khuyến nghị dùng \`by_duration\` hoặc \`earliest\`.

**Rebalance và tải:** Consumer Group sẽ rebalance để nhận Partition mới. Producer và Broker cũng tốn thêm tài nguyên.

Kafka không hỗ trợ giảm số Partition, nên đây là thao tác một chiều. Tôi kiểm tra các ứng dụng stateful, ví dụ Kafka Streams, vì chúng dựa vào số Partition của Topic đầu vào.`,
    keyPoints: [
      { text: 'Thứ tự theo key bị phá vì đổi ánh xạ', keywords: ['thứ tự', 'chia dư', 'ánh xạ', 'đổi partition'], weight: 2 },
      { text: 'auto.offset.reset=latest có thể bỏ sót', keywords: ['latest', 'bỏ sót', 'mất dữ liệu', 'by duration'], weight: 2 },
      { text: 'Gây rebalance', keywords: ['rebalance'] },
      { text: 'Thao tác một chiều, không giảm được', keywords: ['không giảm', 'một chiều'] },
    ],
    followUps: ['Có cách nào chuyển sang Topic mới mà không dừng hệ thống không?'],
    commonMistakes: ['Nghĩ dữ liệu cũ sẽ tự được băm lại vào các Partition mới.'],
  },
  {
    id: 'iv-kafka-offset-01',
    topicId: 'kafka',
    category: 'kafka-storage',
    conceptIds: ['kafka-offset', 'kafka-consumer'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Offset là gì? Nó được lưu ở đâu, và làm sao đọc lại dữ liệu cũ?',
    referenceAnswer: `Offset là số thứ tự tăng dần của thông điệp trong một Partition. Nó chỉ có nghĩa trong Partition đó, nên muốn định danh một thông điệp cần cả Topic, Partition và Offset.

Consumer Group lưu vị trí đã đọc bằng cách commit Offset vào Topic nội bộ \`__consumer_offsets\`, dùng compaction để giữ giá trị mới nhất. Khi Consumer khởi động lại hoặc có rebalance, Consumer mới tiếp tục từ vị trí này. Offset đã commit mặc định được giữ 7 ngày sau khi nhóm rỗng. Nếu không còn Offset, \`auto.offset.reset\` quyết định đọc từ đầu hay từ cuối.

Muốn đọc lại, tôi dừng nhóm rồi dùng công cụ quản lý nhóm để đưa Offset về một vị trí hoặc một mốc thời gian, hoặc gọi \`seek\` trong code. Điều kiện là dữ liệu vẫn còn trong Retention, và hệ thống đích chịu được dữ liệu trùng. Việc này không ảnh hưởng tới nhóm khác, vì mỗi nhóm giữ Offset riêng.`,
    keyPoints: [
      { text: 'Offset là số thứ tự trong một Partition', keywords: ['số thứ tự', 'trong partition', 'tăng dần', 'vị trí'], weight: 2 },
      { text: 'Lưu trong __consumer_offsets', keywords: ['consumer offsets', 'topic nội bộ'], weight: 2 },
      { text: 'Đọc lại bằng cách đưa Offset về trước', keywords: ['seek', 'reset', 'đưa về', 'tua lại', 'mốc thời gian'], weight: 2 },
      { text: 'Mỗi nhóm giữ Offset riêng', keywords: ['mỗi nhóm', 'không ảnh hưởng', 'riêng'] },
    ],
    followUps: ['Trước đây Offset có lưu ở đâu khác không?'],
    commonMistakes: ['Nói Broker xóa thông điệp sau khi Offset được commit.'],
  },
  {
    id: 'iv-kafka-retention-01',
    topicId: 'kafka',
    category: 'kafka-storage',
    conceptIds: ['kafka-retention'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Retention trong Kafka hoạt động thế nào? Vì sao có dữ liệu đã quá 7 ngày mà vẫn còn?',
    referenceAnswer: `Mặc định Kafka giữ dữ liệu 7 ngày (\`log.retention.hours=168\`), và không giới hạn dung lượng (\`retention.bytes=-1\`). Nếu đặt dung lượng thì giới hạn này tính **cho từng Partition**. Việc xóa không phụ thuộc vào việc đã có ai đọc hay chưa.

Dữ liệu cũ vẫn còn vì Kafka xóa theo **segment**, không xóa từng thông điệp. Một Partition được chia thành nhiều segment, chỉ segment đang hoạt động nhận dữ liệu mới. Segment này đóng khi đạt 1 GiB hoặc sau 7 ngày. Một segment chỉ đủ điều kiện xóa khi đã đóng và thông điệp mới nhất của nó đã quá hạn. Việc kiểm tra cũng chỉ chạy 5 phút một lần.

Với Topic ít dữ liệu, segment có thể mở rất lâu, nên dữ liệu tồn tại gần gấp đôi mức cấu hình. Vì vậy khi có yêu cầu xóa đúng hạn, tôi đặt thêm \`segment.ms\` nhỏ hơn, và không xem Retention là một cam kết chính xác về thời điểm xóa.`,
    keyPoints: [
      { text: 'Mặc định 7 ngày, không giới hạn dung lượng', keywords: ['7 ngày', '168', 'không giới hạn'], weight: 2 },
      { text: 'Xóa theo segment đã đóng', keywords: ['segment'], weight: 2 },
      { text: 'Không phụ thuộc việc đọc', keywords: ['đã đọc', 'chưa đọc', 'không phụ thuộc'] },
      { text: 'Giới hạn dung lượng tính theo Partition', keywords: ['từng partition', 'mỗi partition'] },
    ],
    followUps: ['Consumer tụt lại quá Retention thì điều gì xảy ra?', 'Tiered Storage thay đổi cách tính Retention thế nào?'],
    commonMistakes: ['Nói Kafka xóa từng thông điệp đúng khi hết hạn.', 'Nói Kafka xóa thông điệp sau khi Consumer đọc xong.'],
  },
  {
    id: 'iv-kafka-retention-02',
    topicId: 'kafka',
    category: 'kafka-storage',
    conceptIds: ['kafka-retention', 'etl-cdc'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Log Compaction giải quyết vấn đề gì mà Retention theo thời gian không làm được? Nó có những giới hạn nào?',
    referenceAnswer: `Retention theo thời gian hợp với dữ liệu mà mỗi bản ghi đứng độc lập, như log hay sự kiện. Với dữ liệu dạng thay đổi theo khóa, như bảng khách hàng qua [[etl-cdc|CDC]], nó có vấn đề: khách hàng không đổi trong 7 ngày sẽ biến mất, nên dịch vụ mới không thể dựng lại trạng thái bằng cách đọc Topic. Giữ toàn bộ lịch sử thì Topic lớn mãi dù dữ liệu thực không tăng.

Compaction giải quyết bằng cách giữ **ít nhất giá trị mới nhất của mỗi key**. Bộ dọn nền chép lại các segment và bỏ các bản cũ hơn. Thứ tự và Offset không đổi, chỉ có khoảng trống. Đọc từ đầu sẽ thấy trạng thái cuối của mọi key, và Topic chỉ lớn theo số key.

Giới hạn cần nhớ:

- Không phải tức thời: segment đang ghi không được dọn, nên vẫn có nhiều bản của một key.
- Cần có key, và tombstone để xóa key.
- Tombstone chỉ giữ thêm theo \`delete.retention.ms\`, mặc định 1 ngày. Consumer tụt lại lâu hơn sẽ bỏ lỡ việc xóa, và giữ dữ liệu đáng lẽ đã bị xóa.
- Mất lịch sử trung gian, nên không hợp khi cần mọi thay đổi.`,
    keyPoints: [
      { text: 'Retention làm mất trạng thái của key ít thay đổi', keywords: ['biến mất', 'ít thay đổi', 'không đổi', 'dựng lại trạng thái'], weight: 2 },
      { text: 'Compaction giữ ít nhất giá trị mới nhất của mỗi key', keywords: ['mới nhất', 'mỗi key', 'giá trị cuối'], weight: 2 },
      { text: 'Tombstone để xóa key', keywords: ['tombstone', 'giá trị null'], weight: 2 },
      { text: 'Không tức thời, và mất lịch sử trung gian', keywords: ['không tức thời', 'segment đang ghi', 'lịch sử trung gian'] },
    ],
    followUps: ['__consumer_offsets dùng chính sách dọn nào, vì sao?'],
    commonMistakes: ['Cho rằng compaction đảm bảo chỉ còn đúng một bản ghi cho mỗi key.'],
  },
])
