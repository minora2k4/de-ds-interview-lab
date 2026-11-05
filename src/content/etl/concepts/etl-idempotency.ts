import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-idempotency',
  summary:
    'Một pipeline idempotent cho cùng một trạng thái đích dù chạy một lần hay nhiều lần với cùng đầu vào. Đây là điều kiện để retry và backfill an toàn, vì trong hệ phân tán, chạy lại là chuyện không thể tránh.',
  tags: ['Idempotency', 'MERGE', 'Độ tin cậy', 'First Principles'],
  related: ['etl-incremental', 'etl-cdc', 'etl-orchestration', 'etl-stream', 'kafka-exactly-once', 'kafka-at-least-once', 'arch-reliability', 'arch-pipeline-design'],
  sections: {
    definition: `**Idempotency (Tính lũy đẳng)** nghĩa là áp dụng một thao tác nhiều lần cho cùng kết quả với áp dụng một lần: \`f(f(x)) = f(x)\`.

Với pipeline, chạy lại cùng một phạm vi dữ liệu, dù một hay nhiều lần, đích vẫn ở **đúng một trạng thái**: không trùng, không thiếu, không cộng dồn.`,

    origin: `Khái niệm đến từ toán học, rồi vào hệ phân tán qua một vấn đề căn bản: bên gọi không phân biệt được **ghi thất bại** với **ghi thành công nhưng mất xác nhận**. Task có thể chết ngay sau khi ghi xong. Để không mất dữ liệu, hệ thống buộc phải thử lại, nên có thể ghi hai lần.

Kafka, Spark và Airflow đều chấp nhận điều này và thiết kế theo hướng at-least-once. Thay vì cố giữ cho mỗi việc chỉ xảy ra một lần, ta làm cho **xảy ra nhiều lần cũng vô hại**.`,

    whyUse: `- **Retry an toàn:** orchestrator tự chạy lại mà không cần ai dọn dẹp.
- **Backfill dễ dàng:** sửa logic rồi chạy lại một khoảng thời gian.
- **Vận hành đơn giản:** gặp sự cố lúc nửa đêm, cách xử lý chỉ là chạy lại.
- **Exactly-once hiệu quả:** at-least-once cộng với ghi idempotent cho hiệu ứng tương đương exactly-once, không cần giao dịch phân tán.`,

    mechanism: `Idempotency cần đúng ở **cả đầu vào và đầu ra**.

**Đầu vào phải xác định:**

- Phạm vi đọc là tham số cố định, ví dụ một partition ngày, không phải "dữ liệu mới nhất".
- Không dùng \`now()\` hay số ngẫu nhiên trong logic. Tài liệu best practices của Airflow cũng nêu rõ: đọc và ghi theo partition cụ thể, không dùng \`now()\` cho tính toán quan trọng.

**Đầu ra có các kỹ thuật sau:**

1. **Thay thế theo phạm vi:** tính lại và thay thế nguyên tử cả partition. Đơn giản và rẻ khi dữ liệu theo thời gian.
2. **MERGE theo khóa nghiệp vụ:** dòng đã có thì cập nhật, chưa có thì thêm. Airflow cũng khuyên không dùng INSERT khi chạy lại, vì sẽ sinh dòng trùng.
3. **So sánh phiên bản:** chỉ cập nhật khi bản đến **mới hơn** bản đang có, theo vị trí log hoặc phiên bản. Nếu thiếu bước này, chạy lại một khoảng cũ sẽ đè dữ liệu mới bằng dữ liệu cũ.
4. **Khóa do pipeline tạo:** dùng \`run_id\` hoặc ID xác định từ dữ liệu để loại bản trùng. Tránh dùng ID tự tăng, vì mỗi lần chạy sẽ sinh giá trị khác.

**Lưu ý về MERGE:** lô đầu vào phải được khử trùng lặp trước. Hai dòng cùng khóa trong một lô thì kết quả không xác định, hoặc câu lệnh sẽ báo lỗi, tùy hệ thống.

**Tác dụng phụ bên ngoài** là phần dễ quên: gửi email hoặc gọi API thanh toán không thể "ghi đè" lại được. Hãy kèm **idempotency key** nếu API hỗ trợ, hoặc ghi lại những gì đã gửi rồi kiểm tra trước khi gửi.`,

    diagram: {
      mermaid: `flowchart TD
  A["Task chạy với khoảng ngày 01/11"] --> B["Ghi đích thành công"]
  B --> C["Mất xác nhận, task bị đánh dấu lỗi"]
  C --> D["Orchestrator chạy lại cùng khoảng"]
  D --> E{"Cách ghi?"}
  E -->|"INSERT"| F["Dòng trùng, doanh thu gấp đôi"]
  E -->|"MERGE hoặc thay partition"| G["Đích vẫn đúng một trạng thái"]`,
      caption: 'Chạy lại là chuyện chắc chắn xảy ra. Cách ghi quyết định nó có gây hại hay không.',
    },

    example: `Job nạp doanh thu theo ngày dùng \`INSERT\`, đọc \`WHERE date = current_date - 1\`. Mạng chập chờn làm Airflow retry sau khi dữ liệu đã ghi xong, nên doanh thu ngày đó thành 240 tỷ thay vì 120 tỷ.

Ba tuần sau, đội chạy lại ngày đó để sửa lỗi. Job lại đọc theo \`current_date\`, nên ghi dữ liệu của hôm khác vào.

Đội sửa hai chỗ: nhận ngày làm tham số, và ghi bằng cách thay thế partition của ngày đó. Sau khi sửa, chạy lại 5 lần vẫn cho kết quả 120 tỷ, và backfill 90 ngày chỉ cần chạy lần lượt từng ngày.`,

    prosCons: {
      pros: [
        '**Tự động khôi phục:** có thể bật retry mà không sợ hỏng dữ liệu.',
        '**Giảm chi phí vận hành:** không có bước dọn dẹp thủ công.',
        '**Không cần giao dịch phân tán,** vốn phức tạp và tốn hiệu năng.',
      ],
      cons: [
        '**Đích phải có khóa hoặc partition phù hợp,** không phải dữ liệu nào cũng có khóa tốt.',
        '**MERGE tốn kém hơn append** trên bảng lớn.',
        '**Khó đạt với tác dụng phụ bên ngoài,** như API không hỗ trợ khóa idempotency.',
      ],
    },

    whenToUse: {
      use: [
        'Mặc định cho mọi task của pipeline, nhất là những task có retry.',
        'Thay thế partition với dữ liệu theo thời gian, MERGE với bảng có khóa và có cập nhật.',
        'Dùng so sánh phiên bản khi sự kiện có thể đến lệch thứ tự.',
      ],
      avoid: [
        'Không dùng append mà không có khử trùng lặp, trừ khi chấp nhận được bản trùng.',
      ],
    },

    comparison: {
      intro: 'Các khái niệm dễ nhầm với idempotency:',
      headers: ['Khái niệm', 'Trả lời câu hỏi', 'Quan hệ'],
      rows: [
        ['Idempotency', 'Chạy lại có làm đổi trạng thái đích không?', 'Thuộc về thao tác ghi'],
        ['Tính xác định', 'Cùng đầu vào có ra cùng đầu ra không?', 'Điều kiện để chạy lại ra kết quả giống nhau'],
        ['At-least-once', 'Có thể bị trùng, không mất', 'Cần idempotency để không có hại'],
        ['Exactly-once', 'Hiệu ứng có như đúng một lần không?', 'Có thể đạt nhờ at-least-once cộng idempotency'],
      ],
    },

    misconceptions: [
      {
        myth: 'Idempotent nghĩa là chạy lại luôn cho kết quả y hệt lần trước.',
        truth: 'Nếu nguồn đã đổi, chạy lại có thể cho kết quả mới, và vẫn là idempotent nếu không trùng và không cộng dồn. Muốn tái lập y hệt thì đầu vào phải bất biến, như vùng thô.',
      },
      {
        myth: 'Có MERGE là tự động idempotent.',
        truth: 'MERGE chỉ giải quyết được nếu khóa ổn định và có so sánh phiên bản. Thiếu phiên bản, chạy lại khoảng cũ sẽ đè bằng dữ liệu cũ hơn.',
      },
      {
        myth: 'Engine có exactly-once nên không cần quan tâm idempotency.',
        truth: 'Bảo đảm của engine thường chỉ đến state nội bộ. Khi ghi ra hệ thống bên ngoài, đích vẫn phải idempotent hoặc có giao dịch.',
      },
    ],
  },
})
