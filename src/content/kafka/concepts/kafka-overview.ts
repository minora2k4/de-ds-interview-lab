import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-overview',
  summary:
    'Apache Kafka là nền tảng log phân tán cho dữ liệu sự kiện. Producer ghi vào Topic, dữ liệu được lưu bền và sao chép giữa các Broker, nhiều Consumer đọc độc lập theo Offset. Từ bản 4.0, Kafka chỉ chạy bằng KRaft, không còn ZooKeeper.',
  tags: ['Tổng quan', 'Event Streaming', 'KRaft'],
  related: [
    'kafka-messaging',
    'kafka-partition',
    'kafka-consumer-group',
    'kafka-replication',
    'kafka-delivery-semantics',
    'kafka-vs-rabbitmq',
    'arch-streaming',
    'etl-cdc',
  ],
  sections: {
    definition: `**Apache Kafka** là nền tảng **event streaming (truyền luồng sự kiện)** phân tán, xây dựng quanh **commit log (nhật ký chỉ ghi nối thêm)**. [[kafka-producer|Producer]] ghi sự kiện vào cuối log, [[kafka-consumer|Consumer]] đọc từ vị trí mình chọn, và dữ liệu vẫn nằm lại sau khi đọc.

Khác biệt cốt lõi so với hàng đợi truyền thống là **đọc không xóa dữ liệu**. Vì vậy Kafka vừa là kênh truyền, vừa là nơi lưu trữ có thể đọc lại.`,

    origin: `Kafka ra đời ở LinkedIn khoảng năm 2010, mở mã nguồn năm 2011 rồi chuyển sang Apache. Nó khắc phục hạn chế của hai nhóm công cụ:

- **Message broker truyền thống** như ActiveMQ, RabbitMQ: theo dõi từng thông điệp và xóa sau khi xác nhận, nên khó đọc lại và không hợp với backlog rất lớn.
- **Công cụ gom log** như Flume, Scribe: thông lượng cao nhưng chủ yếu đẩy một chiều vào kho offline.

Trước đó, N nguồn và M đích tạo ra gần N × M đường tích hợp. Kafka gom các luồng về một chỗ.

Về sau, **ZooKeeper** trở thành gánh nặng vì là một hệ thống riêng phải vận hành, và metadata khó mở rộng khi có rất nhiều Partition. **KRaft** đưa metadata vào chính Kafka.`,

    whyUse: `1. **Tách rời hệ thống.** Producer không cần biết ai đọc. Thêm hệ thống đọc mới không phải sửa bên ghi.
2. **Đọc lại được.** Consumer có lỗi logic có thể quay về Offset cũ để xử lý lại.
3. **Thông lượng cao.** Ghi tuần tự, gửi theo batch và zero-copy giúp chịu tải lớn trên phần cứng thông thường.
4. **Chịu lỗi.** Mỗi Partition có nhiều bản sao. Broker hỏng thì bản sao khác tiếp quản.`,

    mechanism: `1. **Ghi.** Producer chọn [[kafka-partition|Partition]] theo key, gom batch rồi gửi thẳng tới Leader.
2. **Lưu.** [[kafka-broker|Broker]] nối batch vào cuối log. Ghi tuần tự nên nhanh, dữ liệu mới nằm trong page cache.
3. **Sao chép.** Follower kéo dữ liệu từ Leader. Thông điệp là committed khi mọi bản sao trong ISR đã nhận, xem [[kafka-replication]].
4. **Đọc.** Consumer **kéo (pull)** theo [[kafka-offset|Offset]], nên tự điều tiết tốc độ. Các [[kafka-consumer-group|Consumer Group]] đọc độc lập.
5. **Dọn dữ liệu.** [[kafka-retention|Retention]] xóa theo thời gian hoặc dung lượng, mặc định 7 ngày, không phụ thuộc việc đã đọc hay chưa.
6. **Metadata.** Trong **KRaft**, nhóm Controller dùng Raft để quản lý metadata. Thường chọn 3 hoặc 5 Controller, và phải còn đa số thì cụm mới hoạt động bình thường.

**Mốc phiên bản cần nhớ:**

- **3.3:** KRaft sẵn sàng cho production.
- **4.0 (tháng 3/2025):** gỡ hẳn ZooKeeper. Cụm cũ phải chuyển sang KRaft trước khi nâng cấp, thường qua bản cầu nối 3.9. Giao thức rebalance mới (KIP-848) đạt GA.
- **4.2:** Share Group, kiểu đọc gần với hàng đợi, sẵn sàng cho production.`,

    diagram: {
      mermaid: `flowchart TD
  A["Producer ghi theo key"] --> B["Leader của Partition trên Broker"]
  B --> C["Follower kéo dữ liệu, tạo bản sao"]
  B --> D["Log trên đĩa, giữ theo Retention"]
  D --> E["Consumer Group A: chống gian lận"]
  D --> F["Consumer Group B: nạp kho dữ liệu"]
  G["Controller KRaft quản lý metadata"] --> B`,
      caption:
        'Dữ liệu nằm lại trong log, nên nhiều nhóm đọc cùng một luồng mà không ảnh hưởng nhau. Mỗi nhóm chỉ giữ vị trí đọc của mình.',
    },

    example: `Một sàn thương mại điện tử ghi sự kiện vào Kafka với trung bình 50 MB/giây, khoảng 4,3 TB mỗi ngày. Giữ 3 ngày với replication factor 3 cần khoảng 39 TB đĩa.

Ba nhóm cùng đọc: chống gian lận, gửi thông báo và nạp kho dữ liệu. Lúc 9 giờ, nhóm nạp kho triển khai bản lỗi, đến 11 giờ mới phát hiện. Họ sửa lỗi rồi đưa Offset của riêng nhóm mình về mốc 9 giờ để xử lý lại. Hai nhóm còn lại không bị ảnh hưởng, Producer không phải làm gì. Với hàng đợi xóa sau khi đọc, 2 giờ dữ liệu này đã mất.`,

    prosCons: {
      pros: [
        '**Nhiều hệ thống đọc chung một luồng** mà không phải nhân bản dữ liệu.',
        '**Đọc lại được** trong thời gian Retention.',
        '**Mở rộng ngang** bằng cách thêm Partition và Broker.',
      ],
      cons: [
        '**Vận hành không đơn giản:** chọn số Partition, di chuyển dữ liệu khi thêm Broker, theo dõi lag.',
        '**Không có thứ tự toàn cục** giữa các Partition.',
        '**Không truy vấn linh hoạt:** chỉ đọc theo Offset hoặc thời gian.',
      ],
    },

    whenToUse: {
      use: [
        'Nhiều hệ thống cùng cần một luồng sự kiện, ví dụ [[etl-cdc|CDC]], log hay clickstream.',
        'Cần giữ dữ liệu để đọc lại.',
        'Lưu lượng lớn và cần tách tốc độ bên ghi khỏi bên đọc, như trong [[arch-streaming]].',
      ],
      avoid: [
        'Lưu lượng nhỏ, một bên gửi và một bên nhận: dùng hàng đợi hoặc bảng trong cơ sở dữ liệu.',
        'Cần phản hồi đồng bộ theo kiểu request-response.',
        'Cần định tuyến phức tạp hoặc độ ưu tiên: cân nhắc [[kafka-vs-rabbitmq|RabbitMQ]].',
      ],
    },

    comparison: {
      intro: 'Kafka nằm giữa hàng đợi và cơ sở dữ liệu, nhưng không thay thế hoàn toàn bên nào:',
      headers: ['Tiêu chí', 'Kafka', 'Hàng đợi truyền thống', 'Cơ sở dữ liệu'],
      rows: [
        ['Mô hình', 'Log chỉ ghi nối thêm', 'Xóa sau khi xác nhận', 'Cập nhật tại chỗ'],
        ['Đọc lại', 'Có, trong Retention', 'Thường không', 'Có, bằng truy vấn'],
        ['Nhiều bên đọc', 'Mỗi nhóm một Offset', 'Thường mỗi bên một hàng đợi', 'Tải tăng theo truy vấn'],
        ['Cách tìm dữ liệu', 'Theo Offset hoặc thời gian', 'Lấy thông điệp kế tiếp', 'Theo chỉ mục'],
      ],
    },

    misconceptions: [
      {
        myth: 'Kafka là hàng đợi, đọc xong thì thông điệp biến mất.',
        truth: 'Thông điệp chỉ bị xóa theo Retention, nên nhiều nhóm có thể đọc nhiều lần.',
      },
      {
        myth: 'Muốn chạy Kafka thì phải cài ZooKeeper.',
        truth: 'Từ bản 4.0, ZooKeeper đã bị gỡ hẳn. Các tài liệu cũ nói về ZooKeeper đã lỗi thời.',
      },
      {
        myth: 'Kafka đảm bảo thứ tự trên toàn Topic.',
        truth: 'Thứ tự chỉ có trong một Partition, xem [[kafka-ordering]].',
      },
      {
        myth: 'Kafka tự xử lý và biến đổi dữ liệu.',
        truth: 'Broker chỉ lưu và phục vụ dữ liệu. Việc xử lý do Kafka Streams hoặc engine như [[kafka-vs-spark-streaming|Spark]], Flink đảm nhận.',
      },
    ],
  },
})
