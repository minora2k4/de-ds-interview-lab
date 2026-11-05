import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-cdc',
  summary:
    'CDC bắt các thay đổi insert, update và delete của database rồi truyền đi dưới dạng sự kiện. CDC dựa trên log, như Debezium, đọc nhật ký giao dịch nên bắt được xóa và thay đổi trung gian mà không cần sửa schema.',
  tags: ['CDC', 'Debezium', 'Log-based', 'First Principles'],
  related: ['etl-incremental', 'etl-idempotency', 'etl-stream', 'etl-ingestion', 'kafka-overview', 'kafka-ordering', 'kafka-at-least-once', 'dw-scd'],
  sections: {
    definition: `**Change Data Capture (CDC, Bắt thay đổi dữ liệu)** là kỹ thuật xác định các thay đổi trên database và truyền chúng đi, thay vì đọc lại trạng thái của bảng.

Có ba cách: **dựa trên truy vấn** (poll theo cột như \`updated_at\`), **dựa trên trigger** (trigger ghi vào bảng thay đổi) và **dựa trên log** (đọc nhật ký giao dịch).`,

    origin: `Polling theo \`updated_at\` không thấy dòng đã xóa và trạng thái trung gian. Trigger bắt được đủ nhưng chạy trong transaction của ứng dụng, làm chậm mọi thao tác ghi.

Database vốn đã có nhật ký mọi thay đổi đã commit để khôi phục và nhân bản. Đọc log như một bản sao giúp có đủ thay đổi mà gần như không chạm luồng ghi. Debezium phổ biến cách này: nó là các source connector cho Kafka Connect, ngoài ra có Debezium Server.`,

    whyUse: `Theo tài liệu Debezium, CDC dựa trên log bắt được mọi thay đổi, có độ trễ thấp mà không tốn CPU cho polling, không cần sửa data model và bắt được cả xóa. Nhờ vậy nó phù hợp để:

- Giữ kho dữ liệu gần như thời gian thực.
- Giữ lịch sử đầy đủ, như xây dựng [[dw-scd|SCD Type 2]].
- Đồng bộ sang hệ thống khác như search index, cache.`,

    mechanism: `**Debezium với PostgreSQL và MySQL:**

- **PostgreSQL** đọc qua logical decoding với plugin \`pgoutput\`, dùng **replication slot** để đánh dấu vị trí đã đọc.
- **MySQL** đọc binlog, yêu cầu \`binlog_format=ROW\` và \`binlog_row_image=FULL\`.

**Luồng hoạt động:**

1. **Snapshot ban đầu:** log thường không còn đủ lịch sử, nên connector chụp trạng thái hiện tại. Với \`snapshot.mode\` mặc định \`initial\`, các dòng được phát với \`op = r\`.
2. **Streaming:** đọc tiếp từ vị trí log đã ghi nhận lúc snapshot, nên không mất thay đổi.
3. **Phát sự kiện:** mỗi thay đổi gồm \`before\`, \`after\`, \`source\` (vị trí log, transaction), \`op\` và \`ts_ms\`. Các giá trị \`op\`: \`c\` tạo, \`u\` sửa, \`d\` xóa, \`r\` đọc khi snapshot, \`t\` truncate.
4. **Lưu vị trí:** sau lỗi, connector đọc lại từ vị trí đã lưu.

**Hệ quả mà đầu nhận phải xử lý:**

- **Sự kiện có thể trùng:** Debezium bảo đảm at-least-once khi có sự cố, nên đầu nhận phải [[etl-idempotency|idempotent]].
- **Thứ tự:** Kafka giữ thứ tự trong một partition. Sự kiện được key theo khóa chính nên giữ được thứ tự của từng dòng, không có thứ tự toàn cục giữa các dòng.
- **Áp dụng đúng thao tác xóa:** MERGE phải có nhánh \`op = d\`. Debezium còn phát thêm **tombstone**, sự kiện có value null, để log compaction của Kafka xóa khóa đó (\`tombstones.on.delete\` mặc định \`true\`).
- **\`before\` có thể không đủ:** với \`REPLICA IDENTITY DEFAULT\` của PostgreSQL, \`before\` không có giá trị cũ của cột thường. Sự kiện update chỉ kèm các cột khóa chính có đổi giá trị. Muốn đủ cột cần đặt \`FULL\`, đánh đổi bằng WAL lớn hơn. Bảng không có khóa chính sẽ không phát sự kiện update và delete.

**Rủi ro vận hành:** replication slot giữ WAL ngay cả khi Debezium ngừng, nên connector dừng lâu có thể làm **đầy đĩa của database chính**. Phải giám sát độ trễ của slot.

**Incremental snapshot:** để chụp lại một bảng mà không dừng streaming, Debezium chia bảng thành các chunk (mặc định 1024 dòng), kích hoạt bằng signal và dùng watermark để theo dõi tiến độ.`,

    diagram: {
      mermaid: `flowchart TD
  A["Ứng dụng commit vào database"] --> B["Nhật ký giao dịch: WAL, binlog"]
  B --> C["Debezium đọc log, lưu vị trí"]
  C --> D["Kafka: key theo khóa chính"]
  D --> E["Khử trùng, lấy bản mới nhất theo vị trí log"]
  E --> F["MERGE vào kho, op = d thì xóa"]`,
      caption: 'CDC dựa trên log không chạm vào luồng ghi, nhưng đầu nhận phải chịu được bản trùng và áp dụng đúng thứ tự.',
    },

    example: `Một ví điện tử dùng PostgreSQL 3 TB, polling \`updated_at\` mỗi 15 phút. Một giao dịch đổi từ chờ sang lỗi rồi sang thành công trong 2 phút, kho chỉ thấy trạng thái cuối. Dòng đã xóa cũng còn nguyên trong kho.

Đội chuyển sang Debezium, độ trễ còn dưới 5 giây và tải truy vấn trên nguồn giảm hẳn. Một lần Kafka Connect dừng qua cuối tuần, WAL tăng thêm 400 GB. Đội thêm cảnh báo độ trễ của slot, và đặt \`max_slot_wal_keep_size\` của PostgreSQL, chấp nhận phải snapshot lại nếu vượt ngưỡng.`,

    prosCons: {
      pros: [
        '**Bắt đủ thay đổi,** kể cả xóa và trạng thái trung gian.',
        '**Ít tác động lên nguồn,** không cần sửa schema hay ứng dụng.',
      ],
      cons: [
        '**Vận hành phức tạp:** Kafka Connect, slot, snapshot lại, schema đổi.',
        '**Cần quyền ở mức thấp** trên database, không phải nguồn nào cũng cho phép, nhất là phần mềm SaaS.',
        '**Đầu nhận phức tạp hơn:** phải xử lý trùng, thứ tự và xóa.',
      ],
    },

    whenToUse: {
      use: [
        'Khi cần bắt xóa cứng và lịch sử thay đổi đầy đủ.',
        'Khi cần độ trễ thấp hoặc polling đang gây tải lớn lên nguồn.',
        'Dùng query-based khi không có quyền đọc log, bảng có cột theo dõi tin cậy và không có xóa cứng.',
      ],
      avoid: [
        'Không dùng log-based cho bảng nhỏ và báo cáo hàng ngày, vì full load đơn giản hơn nhiều.',
      ],
    },

    comparison: {
      intro: 'Ba cách làm CDC:',
      headers: ['Tiêu chí', 'Dựa trên truy vấn', 'Dựa trên trigger', 'Dựa trên log'],
      rows: [
        ['Bắt thao tác xóa', 'Không, trừ khi xóa mềm', 'Có', 'Có'],
        ['Thay đổi trung gian', 'Mất', 'Có', 'Có'],
        ['Tác động lên nguồn', 'Tải đọc do polling', 'Chậm mọi thao tác ghi', 'Thấp, nhưng log phải được giữ'],
        ['Yêu cầu với nguồn', 'Cột theo dõi tin cậy', 'Quyền tạo trigger', 'Quyền đọc log, cấu hình log'],
        ['Độ trễ', 'Theo chu kỳ poll', 'Thấp', 'Rất thấp'],
      ],
    },

    misconceptions: [
      {
        myth: 'Debezium bảo đảm exactly-once nên đầu nhận không phải lo trùng.',
        truth: 'Debezium bảo đảm at-least-once, nên bản trùng có thể xuất hiện khi connector sập. Exactly-once chỉ có với một số connector qua Kafka Connect.',
      },
      {
        myth: 'Sắp xếp sự kiện theo `ts_ms` là đủ để áp dụng đúng thứ tự.',
        truth: 'Thời gian có thể trùng và không phản ánh thứ tự commit chính xác. Nên dùng vị trí log trong `source`, như LSN, để so sánh.',
      },
    ],
  },
})
