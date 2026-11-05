import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-delivery-semantics',
  summary:
    'Ngữ nghĩa giao nhận mô tả thông điệp có thể bị mất hay bị lặp khi có lỗi, gồm At-most-once, At-least-once và Exactly-once. Nó do cả Producer, Broker và Consumer cùng quyết định. Mặc định, Kafka đảm bảo At-least-once.',
  tags: ['Ngữ nghĩa giao nhận', 'Độ tin cậy', 'First Principles'],
  related: [
    'kafka-at-most-once',
    'kafka-at-least-once',
    'kafka-exactly-once',
    'kafka-producer',
    'kafka-consumer',
    'etl-idempotency',
  ],
  sections: {
    definition: `**Delivery Semantics (Ngữ nghĩa giao nhận)** là cam kết về việc thông điệp được xử lý bao nhiêu lần khi có lỗi:

- **[[kafka-at-most-once|At-most-once]]:** có thể mất, không bao giờ lặp.
- **[[kafka-at-least-once|At-least-once]]:** không mất, có thể lặp.
- **[[kafka-exactly-once|Exactly-once]]:** mỗi thông điệp có hiệu lực đúng một lần.

Đây là thuộc tính của **toàn bộ luồng**, không phải của một cấu hình đơn lẻ.`,

    origin: `Vấn đề bắt nguồn từ việc mạng không tin cậy. Khi Producer gửi mà không nhận được phản hồi, nó không biết thông điệp đã được ghi hay chưa. Chỉ có hai lựa chọn: gửi lại và có thể tạo bản trùng, hoặc không gửi và có thể mất.

Consumer cũng gặp tình huống tương tự: xử lý và lưu vị trí là hai bước riêng, máy có thể chết giữa chừng. Tài liệu Kafka cũng cảnh báo nhiều hệ thống quảng cáo exactly-once một cách gây hiểu lầm, nên cần đọc kỹ điều kiện đi kèm.`,

    whyUse: `Chọn sai ngữ nghĩa gây ra hậu quả thật. Yêu cầu quá thấp có thể mất giao dịch hoặc trừ tiền hai lần. Yêu cầu quá cao thì tốn thêm độ trễ và độ phức tạp cho những dữ liệu không cần, như số liệu giám sát.

Câu hỏi đúng không phải là "cấu hình nào mạnh nhất", mà là "mất hoặc trùng một thông điệp thì nghiệp vụ tổn thất bao nhiêu".`,

    mechanism: `Bài toán chia thành hai nửa, cộng với một nửa thường bị quên.

**Nửa ghi (Producer sang Broker):**

- \`acks\` quyết định khi nào xem là đã ghi xong.
- \`retries\` quyết định có gửi lại không.
- \`enable.idempotence\` giúp Broker loại bản trùng do gửi lại.
- Mặc định hiện nay (\`acks=all\`, idempotence bật) đã không tạo trùng do retry trong một phiên Producer.

**Nửa đọc (Broker sang Consumer):** quyết định bởi thứ tự giữa xử lý và commit.

- Commit trước, xử lý sau: chết giữa chừng thì **mất**.
- Xử lý trước, commit sau: chết giữa chừng thì **lặp**.

**Nửa ra ngoài (Consumer sang hệ thống đích):** thường bị bỏ qua. Ghi vào cơ sở dữ liệu rồi commit Offset là hai bước riêng, nên vẫn có thể lặp. Hệ thống đích phải có [[etl-idempotency|tính lũy đẳng]], hoặc lưu Offset cùng giao dịch với kết quả.

**Mặc định của Kafka là At-least-once.** Với auto commit, điều này chỉ đúng khi Consumer xử lý xong mọi bản ghi của một lần \`poll\` trước khi gọi \`poll\` kế tiếp. Nếu chuyển việc sang luồng khác, Offset có thể vượt trước phần đã xử lý, và dữ liệu sẽ mất.

**Kết quả cuối cùng bằng mắt xích yếu nhất.** Producer cấu hình tốt mà Consumer commit sai thì vẫn mất dữ liệu.`,

    diagram: {
      mermaid: `flowchart TD
  A["Consumer nhận bản ghi"] --> B["Commit trước, xử lý sau"]
  A --> C["Xử lý trước, commit sau"]
  A --> D["Lưu kết quả và Offset trong một giao dịch"]
  B --> E["Chết giữa chừng: mất, At-most-once"]
  C --> F["Chết giữa chừng: lặp, At-least-once"]
  D --> G["Không mất, không lặp: Exactly-once"]`,
      caption:
        'Cùng một sự cố, thứ tự giữa xử lý và lưu vị trí quyết định kết quả là mất hay lặp. Muốn tránh cả hai thì hai việc đó phải cùng thành công hoặc cùng thất bại.',
    },

    example: `Một công ty có ba luồng trên cùng cụm Kafka:

- **Số liệu CPU, 500.000 điểm mỗi giây:** mất vài điểm không sao. Dùng \`acks=1\`, chấp nhận mất để có độ trễ thấp, gần với At-most-once.
- **Sự kiện đơn hàng, 2.000 sự kiện mỗi giây:** không được mất, nhưng kho dữ liệu upsert theo \`event_id\`. Dùng At-least-once kèm upsert, kết quả cuối vẫn đúng mà không cần transaction.
- **Tính số dư từ Topic này sang Topic khác, 300 sự kiện mỗi giây:** không được mất và không được lặp, toàn bộ nằm trong Kafka. Dùng Transactions.

Một cấu hình chung cho cả ba sẽ hoặc lãng phí, hoặc không đủ an toàn.`,

    prosCons: {
      pros: [
        '**Chọn được theo từng luồng,** thay vì một mức cho toàn hệ thống.',
        '**At-least-once kèm lũy đẳng** đơn giản mà đủ cho phần lớn pipeline.',
      ],
      cons: [
        '**Đảm bảo càng mạnh thì càng tốn** độ trễ, thông lượng và độ phức tạp.',
        '**Dễ tin nhầm:** cấu hình đúng một đầu không làm cả luồng đúng.',
      ],
    },

    whenToUse: {
      use: [
        'At-most-once khi mất dữ liệu chấp nhận được và cần độ trễ thấp.',
        'At-least-once kèm lũy đẳng cho hầu hết pipeline dữ liệu.',
        'Exactly-once khi đọc, xử lý và ghi đều nằm trong Kafka, và trùng là không chấp nhận được.',
      ],
      avoid: [
        'Không dùng Transactions khi hệ thống đích đã xử lý được trùng lặp.',
        'Không nói "hệ thống exactly-once" mà không chỉ rõ phạm vi từ đâu tới đâu.',
      ],
    },

    comparison: {
      intro: 'So sánh ba mức ngữ nghĩa trong Kafka:',
      headers: ['Ngữ nghĩa', 'Mất', 'Lặp', 'Cách làm', 'Phù hợp'],
      rows: [
        ['At-most-once', 'Có thể', 'Không', 'Không gửi lại, commit trước khi xử lý', 'Số liệu giám sát'],
        ['At-least-once', 'Không', 'Có thể', 'Gửi lại, commit sau khi xử lý', 'Đa số pipeline'],
        ['Exactly-once', 'Không', 'Không', 'Idempotence, transaction, `read_committed`', 'Xử lý trong Kafka'],
      ],
    },

    misconceptions: [
      {
        myth: 'Ngữ nghĩa giao nhận là một cấu hình của Kafka.',
        truth: 'Nó là kết quả của cả Producer, Broker, Consumer và hệ thống đích. Mắt xích yếu nhất quyết định kết quả.',
      },
      {
        myth: 'At-least-once là mức kém, nên luôn cố đạt Exactly-once.',
        truth: 'At-least-once kèm xử lý lũy đẳng cho kết quả cuối đúng, thường đơn giản và rẻ hơn nhiều.',
      },
      {
        myth: 'Exactly-once nghĩa là thông điệp chỉ được truyền đúng một lần trên mạng.',
        truth: 'Vẫn có thể có gửi lại. Điều được đảm bảo là hiệu lực cuối cùng chỉ xảy ra một lần trong phạm vi cam kết.',
      },
    ],
  },
})
