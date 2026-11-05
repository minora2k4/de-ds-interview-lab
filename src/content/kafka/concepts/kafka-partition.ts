import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-partition',
  summary:
    'Partition là một log có thứ tự, phần chia nhỏ của Topic. Đây vừa là đơn vị mở rộng, vừa là phạm vi đảm bảo thứ tự. Số Partition giới hạn mức song song của Consumer Group, và key quyết định thông điệp vào Partition nào.',
  tags: ['Partition', 'Mở rộng', 'Thứ tự', 'First Principles'],
  related: [
    'kafka-topic',
    'kafka-offset',
    'kafka-consumer-group',
    'kafka-ordering',
    'kafka-replication',
    'spark-partition',
    'db-sharding',
  ],
  sections: {
    definition: `**Partition (Phân vùng)** là một log chỉ ghi nối thêm và có thứ tự, thuộc về một [[kafka-topic|Topic]]. Một Topic được chia thành nhiều Partition đặt trên nhiều [[kafka-broker|Broker]].

Partition gánh hai vai trò cùng lúc: **đơn vị mở rộng** và **phạm vi đảm bảo thứ tự**. Phần lớn đánh đổi khi thiết kế Kafka xuất phát từ việc hai vai trò này nằm chung một chỗ.`,

    origin: `Một log đơn chỉ nằm trên một máy nên bị giới hạn bởi đĩa và mạng của máy đó. Muốn đọc song song, message broker truyền thống phải theo dõi từng thông điệp đã giao cho ai, rất tốn kém.

Kafka chia log thành nhiều phần và giao trọn mỗi phần cho một Consumer trong nhóm. Vị trí đọc chỉ còn là một số nguyên cho mỗi Partition. Cái giá là **mất thứ tự toàn cục**.`,

    whyUse: `- **Mở rộng dung lượng:** Topic có thể lớn hơn một máy.
- **Song song khi ghi:** Producer ghi đồng thời vào nhiều Leader.
- **Song song khi đọc:** thêm Partition cho phép thêm Consumer trong nhóm.`,

    mechanism: `**Chọn Partition.** Producer quyết định, không phải Broker:

- Có chỉ định Partition thì dùng đúng Partition đó.
- Có key thì băm key rồi chia dư cho số Partition. Java client dùng murmur2. Cùng key vào cùng Partition, **miễn là số Partition không đổi**.
- Không có key thì dùng sticky partitioning, xem [[kafka-producer]].

**Lưu trữ.** Mỗi Partition là một thư mục gồm nhiều segment. Chỉ segment đang hoạt động nhận dữ liệu mới.

**Chọn số Partition.** Tính theo hai chiều rồi lấy giá trị lớn hơn: lưu lượng ghi chia cho thông lượng an toàn của một Partition, và lưu lượng đọc chia cho thông lượng của một Consumer. Sau đó cộng dự phòng tăng trưởng.

**Chi phí khi quá nhiều Partition:** nhiều tệp mở hơn, Producer tốn bộ nhớ vì mỗi Partition một batch, metadata lớn hơn, bầu lại Leader lâu hơn khi Broker hỏng.

**Hot Partition.** Băm không tách được một key lớn. Nếu một khách hàng chiếm 60% lưu lượng, Partition của họ chịu 60% tải, dù có bao nhiêu Partition. Cách xử lý là đổi key chi tiết hơn và chấp nhận thu hẹp phạm vi thứ tự.

**Thêm Partition.** Dữ liệu cũ không di chuyển, nhưng key mới có thể sang Partition khác vì công thức chia dư đã đổi, nên thứ tự theo key bị phá. Kafka **không hỗ trợ giảm** số Partition.`,

    diagram: {
      mermaid: `flowchart TD
  A["Thông điệp có key = user_42"] --> B["hash(key) chia dư số Partition"]
  B --> C["Partition 1: Offset 0, 1, 2, 3"]
  D["Partition 0: Offset 0, 1, 2"]
  E["Partition 2: Offset 0, 1"]
  C --> F["Consumer A trong nhóm"]
  D --> G["Consumer B trong nhóm"]
  E --> G`,
      caption:
        'Cùng key luôn vào cùng Partition nên giữ được thứ tự theo key. Trong một nhóm, mỗi Partition chỉ giao cho một Consumer.',
    },

    example: `Topic đơn hàng có lưu lượng ghi 120 MB/giây. Đo thử cho thấy một Partition ổn định ở 10 MB/giây, một Consumer xử lý được 5 MB/giây.

- Chiều ghi: 120 / 10 = 12 Partition.
- Chiều đọc: 120 / 5 = 24 Partition.

Cần tối thiểu 24. Dự kiến tăng gấp đôi trong hai năm, nhóm chọn 48.

Sau khi triển khai, một Partition có lag rất cao, vì một đối tác gửi 55% số đơn. Nhóm đổi key từ \`partner_id\` sang \`order_id\`, do nghiệp vụ chỉ cần thứ tự trong từng đơn. Tải đều hơn hẳn mà không phải thêm máy.`,

    prosCons: {
      pros: [
        '**Mở rộng ngang** cả dung lượng và thông lượng.',
        '**Trạng thái đọc rất nhỏ:** một Offset cho mỗi Partition.',
        '**Giữ thứ tự theo key** mà vẫn song song giữa các key.',
      ],
      cons: [
        '**Không có thứ tự toàn cục,** phải thiết kế key từ đầu.',
        '**Số Partition khó đổi:** tăng thì phá thứ tự theo key, giảm thì không làm được.',
        '**Key lệch tạo Hot Partition.**',
      ],
    },

    whenToUse: {
      use: [
        'Tính số Partition từ lưu lượng đo được, cộng dự phòng tăng trưởng.',
        'Chọn key theo thực thể cần giữ thứ tự, có nhiều giá trị và phân bố đều.',
      ],
      avoid: [
        'Không đặt key theo thứ ít giá trị hoặc lệch nặng, như quốc gia hay trạng thái.',
        'Không tăng Partition cho Topic dựa vào thứ tự theo key khi chưa có kế hoạch chuyển tiếp.',
      ],
    },

    comparison: {
      intro: 'Partition của Kafka có tên giống các khái niệm khác nhưng khác mục đích:',
      headers: ['Tiêu chí', 'Kafka Partition', 'Spark Partition', 'Database Shard'],
      rows: [
        ['Mục đích', 'Mở rộng log, giữ thứ tự', 'Đơn vị tính toán song song', 'Mở rộng lưu trữ và truy vấn'],
        ['Tồn tại', 'Lâu dài trên đĩa', 'Trong lúc chạy job', 'Lâu dài'],
        ['Đổi số lượng', 'Chỉ tăng', 'Dễ, bằng repartition', 'Tốn kém'],
      ],
    },

    misconceptions: [
      {
        myth: 'Càng nhiều Partition thì càng tốt.',
        truth: 'Thêm Partition giúp song song hơn, nhưng tăng bộ nhớ, metadata và thời gian phục hồi.',
      },
      {
        myth: 'Cùng key thì luôn vào cùng Partition, bất kể chuyện gì.',
        truth: 'Chỉ đúng khi số Partition không đổi. Client khác ngôn ngữ cũng có thể băm khác.',
      },
      {
        myth: 'Thêm Partition sẽ chia nhỏ Hot Partition hiện có.',
        truth: 'Dữ liệu cũ không di chuyển, và một key lớn vẫn nằm trọn trong một Partition.',
      },
      {
        myth: 'Partition là bản sao của dữ liệu.',
        truth: 'Partition chia dữ liệu thành các phần khác nhau. Bản sao là [[kafka-replication|Replication]].',
      },
    ],
  },
})
