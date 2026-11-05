import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-isolation-levels',
  summary:
    'Mức cô lập quy định một giao dịch thấy gì từ các giao dịch đồng thời. PostgreSQL mặc định Read Committed, InnoDB mặc định Repeatable Read, và cùng tên mức có thể hoạt động khác nhau.',
  tags: ['Giao dịch', 'MVCC', 'Khóa', 'First Principles'],
  related: ['db-acid', 'db-transactions', 'cloud-consistency', 'cloud-eventual-consistency'],
  sections: {
    definition: `**Isolation Levels (Các mức cô lập)** là các mức đánh đổi giữa tính đúng đắn và khả năng chạy đồng thời. Chuẩn SQL có bốn mức: **Read Uncommitted**, **Read Committed**, **Repeatable Read**, **Serializable**.

Chuẩn định nghĩa bằng các hiện tượng bị cấm ở mỗi mức, tức là mức tối thiểu. Vì vậy, một hệ được phép cài đặt mạnh hơn yêu cầu.`,

    origin: `Khóa mọi thứ đọc và ghi đến cuối giao dịch là cách an toàn nhất, nhưng một báo cáo dài có thể chặn cả hệ thống. Các mức thấp hơn ra đời để giảm chờ đợi, sau đó **MVCC** khắc phục tiếp xung đột đọc và ghi.

Năm 1995, bài *A Critique of ANSI SQL Isolation Levels* chỉ ra chuẩn còn thiếu, và làm rõ Lost Update, Write Skew, Snapshot Isolation. Vì vậy, hai hiện tượng đầu không có trong bảng của chuẩn SQL.`,

    whyUse: `Mức cô lập quyết định loại lỗi nào có thể xảy ra trong ứng dụng. Chọn quá thấp sẽ gặp lỗi tiền bạc rất khó tái hiện khi test. Chọn quá cao thì phải chờ khóa hoặc thử lại. Code đúng trên hệ này có thể sai trên hệ kia dù cùng tên mức.`,

    mechanism: `**Năm hiện tượng cần phân biệt:**

- **Dirty Read:** đọc dữ liệu chưa commit của giao dịch khác.
- **Non-repeatable Read:** đọc lại cùng dòng thấy giá trị đã bị đổi và commit.
- **Phantom Read:** chạy lại cùng điều kiện, tập dòng trả về thay đổi.
- **Lost Update:** hai giao dịch cùng đọc rồi cùng ghi đè, một cập nhật bị mất.
- **Write Skew:** hai giao dịch đọc dữ liệu chồng lấn nhưng ghi hai dòng khác nhau, cùng vi phạm một quy tắc mà riêng mỗi bên thì không.

**MVCC (Multiversion Concurrency Control):** giữ nhiều phiên bản để người đọc thấy một snapshot, nên đọc không phải chờ ghi. PostgreSQL lưu phiên bản ngay trong bảng, đánh dấu bằng \`xmin\`, \`xmax\`, và dùng \`VACUUM\` để dọn. InnoDB cập nhật tại chỗ, dựng lại phiên bản cũ từ undo log, và dùng luồng purge để dọn. Giao dịch dài làm cả hai phình ra.

**Khóa vẫn cần cho ghi và ghi.** Hai bên cùng ghi một dòng thì bên sau phải chờ. Sau đó:

- **PostgreSQL Read Committed:** bên sau áp dụng trên phiên bản mới nhất, và đánh giá lại \`WHERE\`.
- **PostgreSQL Repeatable Read:** bên sau bị hủy với lỗi \`could not serialize access due to concurrent update\`, phải thử lại.
- **InnoDB Repeatable Read:** \`SELECT\` thường đọc snapshot, còn \`UPDATE\`, \`DELETE\`, \`SELECT ... FOR UPDATE\` đọc bản mới nhất, không báo xung đột. Với điều kiện phạm vi, chúng dùng **next-key lock** (khóa bản ghi cộng khóa khoảng trống trước nó) để chặn dòng mới chen vào, vì không thể khóa một dòng chưa tồn tại.

**Serializable:** PostgreSQL dùng SSI, theo dõi phụ thuộc đọc và ghi mà không chặn thêm, rồi hủy một giao dịch (SQLSTATE \`40001\`) khi phát hiện nguy cơ. InnoDB dùng khóa: \`SELECT\` thường thành \`SELECT ... FOR SHARE\` khi tắt autocommit.`,

    diagram: {
      mermaid: `flowchart TD
  A["T1 đọc số dư: 100"] --> C["T1 ghi 100 - 30 = 70, commit"]
  B["T2 đọc số dư: 100"] --> D["T2 ghi 100 - 50 = 50, commit"]
  C --> E["Số dư cuối là 50, đáng ra là 20"]
  D --> E`,
      caption:
        'Lost Update: mỗi bên ghi theo giá trị đã đọc trước đó. Khoản trừ 30 của T1 biến mất mà không có lỗi nào.',
    },

    example: `Hai ví của một khách có 100.000 đồng mỗi ví, quy tắc là tổng hai ví không được âm. T1 trừ ví A 150.000, T2 trừ ví B 150.000. Mỗi giao dịch đọc tổng là 200.000 nên cho phép, rồi ghi một dòng khác nhau.

- **Repeatable Read:** cả hai đều commit, tổng còn -100.000. Hai bên ghi hai dòng khác nhau nên không có xung đột ghi. Đây là Write Skew.
- **Serializable của PostgreSQL:** một giao dịch bị hủy với lỗi \`40001\`, chạy lại sẽ thấy số dư mới và bị từ chối.
- **Ở mức thấp hơn:** dùng \`FOR UPDATE\` trên cả hai dòng ví để hai giao dịch xếp hàng.`,

    prosCons: {
      pros: [
        '**MVCC cho đọc không chặn ghi,** nên báo cáo không làm dừng đơn hàng.',
      ],
      cons: [
        '**Mức yếu đẩy lỗi sang ứng dụng,** và lỗi đó thường chỉ lộ khi tải cao.',
        '**Mức mạnh cần thử lại,** nên ứng dụng phải có logic retry an toàn.',
      ],
    },

    whenToUse: {
      use: [
        '**Read Committed:** giao dịch ngắn, kết hợp `UPDATE` nguyên tử như `SET x = x - 1` hoặc `FOR UPDATE`.',
        '**Repeatable Read:** báo cáo cần nhiều câu lệnh cùng thấy một trạng thái.',
        '**Serializable:** quy tắc nghiệp vụ đọc nhiều dòng rồi ghi, và đã có cơ chế thử lại.',
      ],
      avoid: [
        'Không đọc thường rồi tự tính rồi ghi đè trên InnoDB Repeatable Read, vì có thể mất cập nhật mà không báo lỗi.',
      ],
    },

    comparison: {
      intro: 'Đối chiếu với tài liệu PostgreSQL 18 và MySQL 8.4:',
      headers: ['Mức', 'Chuẩn SQL cho phép', 'PostgreSQL', 'MySQL InnoDB'],
      rows: [
        ['Read Uncommitted', 'Cả ba hiện tượng', 'Hoạt động như Read Committed, không đọc bẩn', 'Có thể đọc bẩn'],
        ['Read Committed', 'Non-repeatable, Phantom', '**Mặc định.** Snapshot theo từng câu lệnh', 'Snapshot theo từng câu lệnh, không khóa khoảng nên có Phantom'],
        ['Repeatable Read', 'Phantom', 'Snapshot Isolation: không Phantom, chặn Lost Update bằng lỗi, còn Write Skew', '**Mặc định.** Snapshot từ lần đọc đầu, next-key lock khi đọc có khóa, còn Lost Update và Write Skew'],
        ['Serializable', 'Không có', 'SSI: không chờ thêm, có thể hủy giao dịch', 'Dựa trên khóa, có thể chờ và deadlock'],
      ],
    },

    misconceptions: [
      {
        myth: 'Read Uncommitted trong PostgreSQL cho phép đọc bẩn.',
        truth: 'PostgreSQL chỉ có ba mức thật. Read Uncommitted hoạt động như Read Committed, vì đọc từ snapshot không có cách nào thấy dữ liệu chưa commit.',
      },
      {
        myth: 'Repeatable Read giống nhau ở mọi hệ.',
        truth: 'PostgreSQL là Snapshot Isolation và báo lỗi khi xung đột. InnoDB cho `SELECT` đọc snapshot nhưng `UPDATE` đọc bản mới nhất, nên `SELECT` trả 0 dòng mà `UPDATE` cùng điều kiện vẫn có thể đổi 10 dòng.',
      },
      {
        myth: 'Không có Phantom nghĩa là đã an toàn tuyệt đối.',
        truth: 'Snapshot Isolation vẫn cho phép Write Skew, vì hai bên ghi hai dòng khác nhau.',
      },
    ],
  },
})
