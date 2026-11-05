import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-consumer-group',
  summary:
    'Consumer Group là nhóm Consumer chia nhau các Partition của Topic, mỗi Partition chỉ giao cho một thành viên. Nhóm giữ Offset riêng và rebalance khi thành viên thay đổi. Từ Kafka 4.0, giao thức rebalance mới KIP-848 đã sẵn sàng cho production nhưng chưa phải mặc định.',
  tags: ['Consumer Group', 'Rebalance', 'Mở rộng', 'First Principles'],
  related: [
    'kafka-consumer',
    'kafka-partition',
    'kafka-offset',
    'kafka-ordering',
    'kafka-messaging',
    'kafka-vs-rabbitmq',
  ],
  sections: {
    definition: `**Consumer Group (Nhóm Consumer)** là tập các [[kafka-consumer|Consumer]] có cùng \`group.id\`, cùng đọc một hoặc nhiều Topic và chia nhau công việc. Kafka đảm bảo **mỗi [[kafka-partition|Partition]] chỉ giao cho một Consumer trong nhóm** tại một thời điểm.

**Rebalance (Phân bổ lại)** là quá trình chia lại Partition khi thành viên hoặc số Partition thay đổi.`,

    origin: `Hàng đợi truyền thống cho nhiều bên nhận tranh nhau từng thông điệp, nên Broker phải theo dõi từng thông điệp và thứ tự dễ bị phá vỡ. Muốn phát tán thì lại phải tạo một hàng đợi cho mỗi bên.

Consumer Group gộp hai nhu cầu bằng một quy tắc đơn giản: chia theo Partition thay vì theo thông điệp. Trạng thái chỉ còn một Offset cho mỗi Partition, và thứ tự trong Partition được giữ nguyên.

Rebalance kiểu cũ lại có điểm yếu: mọi thành viên phải dừng để chia lại. **Cooperative rebalancing** giảm phần dừng, và **KIP-848** chuyển logic chia việc về phía Broker.`,

    whyUse: `- **Mở rộng đọc:** thêm Consumer để chia tải, tới mức bằng số Partition.
- **Chịu lỗi:** Consumer chết thì Partition của nó chuyển cho thành viên khác, tiếp tục từ Offset đã commit.
- **Đọc độc lập:** mỗi nhóm có Offset riêng, nên chậm hay tua lại đều không ảnh hưởng nhóm khác.`,

    mechanism: `**Quy tắc chia việc:**

- Consumer nhiều hơn Partition thì phần dư ngồi không.
- Consumer ít hơn Partition thì một Consumer giữ nhiều Partition.
- Vì vậy **số Partition là giới hạn trên của mức song song trong nhóm**.

**Rebalance xảy ra khi:** có thành viên tham gia hoặc rời đi, Consumer chết (hết session timeout), Consumer không \`poll\` kịp \`max.poll.interval.ms\`, hoặc số Partition thay đổi.

**Các kiểu rebalance:**

1. **Eager:** mọi thành viên trả hết Partition rồi nhận lại, cả nhóm dừng trong lúc này. Mặc định của \`classic\` ưu tiên \`RangeAssignor\`, thuộc kiểu này.
2. **Cooperative (CooperativeSticky):** chỉ các Partition cần chuyển mới bị thu hồi, phần còn lại vẫn chạy.
3. **Giao thức \`consumer\` (KIP-848):** Broker tính phân công, không còn rào đồng bộ toàn nhóm, nên từng thành viên nhận thay đổi riêng. GA từ 4.0, phía Broker tự bật. Phía client **vẫn mặc định \`group.protocol=classic\`**, phải đặt \`group.protocol=consumer\`. Lộ trình dự kiến là thành mặc định ở Kafka 5.0.

Với giao thức mới, \`session.timeout.ms\`, \`heartbeat.interval.ms\` và \`partition.assignment.strategy\` ở client không còn dùng được. Broker quản lý bằng cấu hình \`group.consumer.*\`, với hai bộ phân công \`uniform\` (mặc định) và \`range\`. Bộ phân công tự viết ở client chưa được hỗ trợ.

**Giảm rebalance do triển khai:** đặt \`group.instance.id\` để dùng **static membership**. Consumer khởi động lại trong thời hạn session sẽ nhận lại đúng Partition cũ.

**Share Group** là loại nhóm khác, sẵn sàng cho production từ 4.2: nhiều Consumer cùng đọc một Partition, xác nhận từng bản ghi, đếm số lần giao, và số Consumer có thể vượt số Partition. Đổi lại, nó không dành cho luồng cần thứ tự.`,

    diagram: {
      mermaid: `flowchart TD
  A["Topic có 4 Partition: P0, P1, P2, P3"] --> B["Nhóm A: Consumer 1 giữ P0, P1"]
  A --> C["Nhóm A: Consumer 2 giữ P2, P3"]
  A --> D["Nhóm B: một Consumer giữ cả 4"]
  B --> E["Offset riêng của nhóm A"]
  C --> E
  D --> F["Offset riêng của nhóm B"]`,
      caption:
        'Trong một nhóm, các Consumer chia nhau Partition. Giữa các nhóm, mỗi nhóm đọc đủ dữ liệu với Offset riêng.',
    },

    example: `Nhóm \`order-processor\` có 12 Consumer đọc Topic 24 Partition, mỗi lần triển khai khởi động lần lượt từng máy. Với eager rebalance, mỗi lần khởi động làm cả nhóm dừng khoảng 20 giây, tổng cộng gần 8 phút gián đoạn, và lag tăng vọt.

Nhóm đặt \`group.instance.id\` cố định cho từng máy, nên khởi động lại nhanh không còn gây rebalance. Sau đó họ chuyển sang \`group.protocol=consumer\` để các thay đổi còn lại chỉ ảnh hưởng tới Partition liên quan. Gián đoạn khi triển khai giảm xuống còn vài giây.`,

    prosCons: {
      pros: [
        '**Mở rộng và chịu lỗi tự động** mà không cần điều phối thủ công.',
        '**Giữ thứ tự trong Partition,** vì mỗi Partition chỉ có một người đọc.',
        '**Trạng thái rất nhỏ,** chỉ cần Offset của mỗi Partition.',
      ],
      cons: [
        '**Mức song song bị giới hạn bởi số Partition.**',
        '**Rebalance gây gián đoạn,** nhất là với eager và khi có nhiều thành viên.',
        '**Một bản ghi lỗi có thể chặn cả Partition,** vì đọc theo thứ tự.',
      ],
    },

    whenToUse: {
      use: [
        'Mỗi ứng dụng đọc một `group.id` riêng, để nhận đủ dữ liệu.',
        'Đặt `group.instance.id` cho các Consumer chạy ổn định, hay được khởi động lại.',
        'Cân nhắc giao thức `consumer` cho nhóm lớn, thường xuyên co giãn.',
      ],
      avoid: [
        'Không dùng chung `group.id` cho hai ứng dụng khác nhau.',
        'Không chuyển sang giao thức mới nếu đang dựa vào bộ phân công tự viết ở client.',
        'Không dùng Consumer Group cho hàng đợi tác vụ cần xác nhận riêng từng việc: cân nhắc Share Group.',
      ],
    },

    comparison: {
      intro: 'So sánh các cách chia việc trong Kafka:',
      headers: ['Tiêu chí', 'Eager', 'Cooperative', 'Giao thức consumer', 'Share Group'],
      rows: [
        ['Nơi tính phân công', 'Client', 'Client', 'Broker', 'Broker'],
        ['Khi rebalance', 'Cả nhóm dừng', 'Chỉ dừng phần chuyển', 'Theo từng thành viên', 'Không giao độc quyền Partition'],
        ['Consumer vượt số Partition', 'Ngồi không', 'Ngồi không', 'Ngồi không', 'Vẫn nhận việc'],
        ['Giữ thứ tự Partition', 'Có', 'Có', 'Có', 'Không'],
      ],
    },

    misconceptions: [
      {
        myth: 'Thêm Consumer luôn đọc nhanh hơn.',
        truth: 'Khi số Consumer đã bằng số Partition, thêm nữa chỉ tạo Consumer ngồi không.',
      },
      {
        myth: 'Hai Consumer trong nhóm có thể cùng đọc một Partition để tăng tốc.',
        truth: 'Consumer Group không cho phép điều này. Muốn vậy phải dùng Share Group, và chấp nhận mất thứ tự.',
      },
      {
        myth: 'Từ Kafka 4.0, Consumer tự động dùng giao thức rebalance mới.',
        truth: 'Broker đã bật sẵn, nhưng client vẫn mặc định `classic` và phải tự đặt `group.protocol=consumer`.',
      },
      {
        myth: 'Rebalance chỉ xảy ra khi Consumer chết.',
        truth: 'Khởi động, triển khai, thêm Partition hoặc xử lý quá lâu cũng gây rebalance.',
      },
    ],
  },
})
