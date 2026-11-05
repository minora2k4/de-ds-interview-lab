import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-exactly-once',
  summary:
    'Exactly-once của Kafka đảm bảo mỗi bản ghi có hiệu lực đúng một lần trong luồng đọc, xử lý, ghi nằm trong Kafka, nhờ Idempotent Producer, Transactions và read_committed. Nó không tự mở rộng ra hệ thống bên ngoài.',
  tags: ['Exactly-once', 'Transactions', 'Idempotent Producer', 'First Principles'],
  related: [
    'kafka-delivery-semantics',
    'kafka-at-least-once',
    'kafka-producer',
    'kafka-consumer',
    'kafka-vs-spark-streaming',
    'etl-idempotency',
  ],
  sections: {
    definition: `**Exactly-once (Xử lý đúng một lần)** trong Kafka nghĩa là hiệu lực của mỗi bản ghi xảy ra đúng một lần, kể cả khi có lỗi và gửi lại.

**Phạm vi rất cụ thể:** đảm bảo này áp dụng cho luồng **đọc từ Kafka, xử lý, rồi ghi lại vào Kafka**. Tài liệu chính thức ghi rõ exactly-once với hệ thống đích khác cần có sự phối hợp của chính hệ thống đó. Kafka không thể tự làm việc này thay cho cơ sở dữ liệu, API hay dịch vụ email.`,

    origin: `Trước Kafka 0.11, Producer không nhận được phản hồi chỉ còn cách gửi lại, nên chỉ có At-least-once. Consumer đọc Topic này rồi ghi sang Topic khác cũng không thể ghi kết quả và lưu Offset cùng lúc.

Bản 0.11 thêm Idempotent Producer và Transactions để giải quyết. Từ 3.0, idempotence được bật mặc định. Từ 4.0, KIP-890 tăng epoch của Producer sau mỗi transaction, để bản ghi trễ không lọt vào transaction kế tiếp.`,

    whyUse: `Với luồng trong Kafka, ví dụ tính số dư hay tổng hợp phục vụ thanh toán, cơ chế này giúp bỏ được logic chống trùng ở ứng dụng. Kết quả đúng ngay cả khi máy chết hoặc rebalance giữa chừng.`,

    mechanism: `Ba thành phần ghép lại với nhau:

**1. Idempotent Producer.** Broker gán cho Producer một mã (Producer ID). Producer đánh số thứ tự cho từng bản ghi theo từng Partition, Broker loại bản có số đã thấy. Giới hạn cần nhớ:

- Chỉ đảm bảo **trong một phiên Producer**, vì khởi động lại có thể nhận mã mới.
- Chỉ chống trùng do gửi lại **nội bộ**. Ứng dụng tự gọi \`send()\` lại thì Broker xem là bản ghi mới.

**2. Transactions.** Đặt \`transactional.id\` để Producer ghi **nguyên tử** vào nhiều Partition, và ghi cả Offset của Consumer trong cùng transaction, vì Offset cũng chỉ là bản ghi trong Topic nội bộ. Transaction coordinator ghi trạng thái vào \`__transaction_state\`, rồi ghi bản ghi đánh dấu commit hoặc abort. \`transactional.id\` còn giúp **chặn Producer cũ** (zombie fencing): phiên cũ còn sót lại sẽ bị từ chối. \`transaction.timeout.ms\` mặc định là 1 phút.

**3. \`isolation.level=read_committed\`.** Consumer chỉ thấy bản ghi của transaction đã commit, và chỉ đọc tới last stable offset. **Mặc định là \`read_uncommitted\`**, nên phải tự đặt. Nếu không, Consumer vẫn thấy bản ghi của transaction đã hủy.

**Khi tự viết luồng:** tắt \`enable.auto.commit\`, mỗi Consumer dùng một Producer, gửi Offset vào transaction, và khi abort phải đưa vị trí đọc về Offset đã commit. **Kafka Streams** làm sẵn các việc này với \`processing.guarantee=exactly_once_v2\`.

**Khi ghi ra ngoài Kafka:** có hai hướng chính:

- **Ghi lũy đẳng:** upsert theo khóa, kết quả cuối không đổi khi đọc lại.
- **Lưu Offset cùng kết quả** trong một giao dịch của hệ thống đích. Khi khởi động, đọc Offset từ đó thay vì từ Kafka.

Hiệu ứng bên ngoài như gửi email hay gọi API thanh toán thì không thuộc phạm vi này, và cần khóa chống lặp ở phía bên kia.`,

    diagram: {
      mermaid: `flowchart TD
  A["Consumer đọc Topic vào"] --> B["Xử lý bản ghi"]
  B --> C["Producer ghi kết quả vào Topic ra"]
  B --> D["Producer gửi Offset vào transaction"]
  C --> E["Commit: cả hai cùng có hiệu lực"]
  D --> E
  E --> F["Consumer read_committed thấy kết quả"]
  E --> G["Hệ thống ngoài: tự lo lũy đẳng"]`,
      caption:
        'Kết quả và Offset nằm trong một transaction, nên cùng thành công hoặc cùng bị hủy. Đảm bảo này dừng lại ở ranh giới của Kafka.',
    },

    example: `Luồng tính số dư đọc 300 giao dịch mỗi giây từ \`transactions\`, ghi kết quả vào \`balances\`, commit transaction mỗi 100 ms. Khi một instance chết giữa chừng, transaction đang mở bị hủy, Consumer \`read_committed\` không thấy phần dở dang, và instance mới đọc lại từ Offset đã commit. Số dư không bị cộng hai lần.

Về sau nhóm thêm bước gửi email xác nhận ngay trong vòng xử lý. Khi transaction bị hủy và chạy lại, email bị gửi hai lần, dù bản ghi trong Kafka vẫn đúng. Cách sửa là đưa email ra một Consumer riêng, đọc \`balances\` với \`read_committed\`, và dùng mã giao dịch làm khóa chống lặp ở dịch vụ email.`,

    prosCons: {
      pros: [
        '**Không mất, không lặp** trong phạm vi Kafka, kể cả khi lỗi hoặc rebalance.',
        '**Ghi nguyên tử nhiều Partition,** gồm cả Offset.',
        '**Kafka Streams làm sẵn,** chỉ cần một cấu hình.',
      ],
      cons: [
        '**Phạm vi giới hạn:** không bao phủ hệ thống ngoài.',
        '**Tăng độ trễ phía đọc:** `read_committed` phải chờ transaction commit, nên commit thưa thì độ trễ cao.',
        '**Transaction treo làm Consumer đứng** tại last stable offset cho tới khi hết thời gian chờ.',
        '**Phức tạp khi tự viết,** nhất là xử lý lỗi và abort.',
      ],
    },

    whenToUse: {
      use: [
        'Luồng đọc, xử lý, ghi nằm trọn trong Kafka, và trùng là không chấp nhận được.',
        'Dùng Kafka Streams nếu có thể, thay vì tự viết.',
        'Mọi Consumer của Topic có transaction đều đặt `read_committed`.',
      ],
      avoid: [
        'Không dùng Transactions để cố đạt exactly-once tới cơ sở dữ liệu ngoài.',
        'Không dùng khi hệ thống đích đã lũy đẳng, vì At-least-once đơn giản hơn nhiều.',
      ],
    },

    comparison: {
      intro: 'Mỗi cơ chế chống được một loại lỗi khác nhau:',
      headers: ['Cơ chế', 'Chống được', 'Không chống được'],
      rows: [
        ['Idempotent Producer', 'Trùng do gửi lại trong một phiên', 'Ứng dụng gửi lại, Consumer xử lý lại'],
        ['Transactions', 'Ghi dở dang, Offset lệch với kết quả', 'Hiệu ứng ngoài Kafka'],
        ['`read_committed`', 'Đọc phải bản ghi đã hủy', 'Xử lý trùng ở ứng dụng đọc'],
        ['Upsert ở đích', 'Trùng khi đọc lại', 'Phép cộng dồn, gửi email'],
      ],
      note: 'Spark ghi vào Kafka chỉ là At-least-once, xem [[kafka-vs-spark-streaming]].',
    },

    misconceptions: [
      {
        myth: 'Bật exactly-once trong Kafka là cả pipeline tới cơ sở dữ liệu cũng exactly-once.',
        truth: 'Đảm bảo chỉ trong Kafka. Hệ thống ngoài phải tự lũy đẳng hoặc lưu Offset cùng kết quả.',
      },
      {
        myth: 'Idempotent Producer là đủ để có exactly-once.',
        truth: 'Nó chỉ chống trùng ở bước ghi. Bước xử lý và lưu Offset cần thêm Transactions.',
      },
      {
        myth: 'Producer có transaction thì mọi Consumer tự động an toàn.',
        truth: 'Consumer mặc định `read_uncommitted` vẫn thấy bản ghi đã hủy. Phải đặt `read_committed`.',
      },
    ],
  },
})
