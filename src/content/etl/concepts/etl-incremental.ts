import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-incremental',
  summary:
    'Incremental Loading chỉ xử lý phần dữ liệu mới hoặc thay đổi kể từ lần chạy trước, thường bằng high watermark. Nó tiết kiệm chi phí, nhưng phải tự xử lý dữ liệu đến trễ, thao tác xóa, chạy lại và backfill.',
  tags: ['Incremental', 'High Watermark', 'MERGE', 'First Principles'],
  related: ['etl-full-load', 'etl-cdc', 'etl-idempotency', 'etl-orchestration', 'etl-validation', 'dw-scd', 'dq-incremental', 'arch-pipeline-design'],
  sections: {
    definition: `**Incremental Loading (Nạp tăng dần)** chỉ đọc và xử lý phần dữ liệu **mới hoặc đã thay đổi** kể từ lần chạy thành công trước.

Cách phổ biến nhất là **High Watermark (mốc cao nhất)**: lưu giá trị lớn nhất của một cột theo dõi, như \`updated_at\`, và lần sau chỉ lấy các dòng lớn hơn mốc đó.`,

    origin: `[[etl-full-load|Full load]] có chi phí tỷ lệ với kích thước bảng. Bảng tăng đến vài tỷ dòng thì một lần chạy vượt quá khung giờ cho phép, tốn tiền và đè nặng lên nguồn, dù chỉ một phần rất nhỏ thay đổi.

Incremental đổi chi phí sang tỷ lệ với lượng thay đổi. Cái giá phải trả là pipeline trở nên **có trạng thái**: đích không còn tự được làm mới, nên mọi sai sót đều có thể tích lũy theo thời gian.`,

    whyUse: `- **Chi phí:** không đọc lại dữ liệu không đổi.
- **Độ trễ:** chạy vòng ngắn hơn, ví dụ 15 phút thay vì mỗi đêm.
- **Tải lên nguồn:** truy vấn nhỏ, ít ảnh hưởng hệ thống nghiệp vụ.`,

    mechanism: `**Một lần chạy đúng:**

1. Đọc mốc đã lưu, gọi là \`wm\`.
2. Chốt mốc trên \`upper\` ngay từ đầu, không dùng \`now()\` lúc ghi. Nhờ đó khoảng đọc cố định, chạy lại vẫn đọc đúng khoảng đó.
3. Đọc các dòng có \`updated_at\` trong khoảng từ \`wm\` trừ đi **khoảng nhìn lại** đến \`upper\`.
4. Khử trùng lặp, chỉ giữ phiên bản mới nhất của mỗi khóa.
5. **MERGE** vào đích theo khóa nghiệp vụ.
6. Chỉ sau khi ghi thành công mới đẩy mốc lên \`upper\`. Đẩy mốc sớm hơn, lỗi xảy ra sẽ làm mất dữ liệu vĩnh viễn.

**Vì sao cần khoảng nhìn lại.** Mốc tăng theo thời gian, nhưng dữ liệu không xuất hiện đúng thứ tự thời gian đó. Một transaction dài lấy \`updated_at\` lúc 10:00 nhưng commit lúc 10:07. Nếu job chạy lúc 10:05 và đẩy mốc lên 10:05, dòng này sẽ **không bao giờ được đọc**. Đọc chồng lấn giải quyết được việc này, và chọn độ dài theo số đo độ trễ thực tế cộng thêm khoảng an toàn.

**Vì sao phải dùng MERGE, không dùng INSERT.** Đọc chồng lấn và chạy lại tạo ra dòng đã có. MERGE theo khóa làm việc này an toàn, đồng thời cập nhật được dòng đã đổi. Xem [[etl-idempotency]].

**Điểm mù của high watermark:**

- **Xóa cứng (hard delete):** dòng biến mất nên không có \`updated_at\` nào để đọc. Có ba cách xử lý: nguồn dùng xóa mềm, dùng [[etl-cdc|CDC]], hoặc định kỳ so sánh tập khóa giữa nguồn và đích.
- **Cập nhật không đổi cột theo dõi:** script sửa dữ liệu hàng loạt thường quên cập nhật \`updated_at\`. Không có gì phát hiện được, trừ đối soát.
- **Thay đổi trung gian:** dòng đổi 3 lần giữa hai lần chạy chỉ thấy trạng thái cuối.

**Backfill:** khi sửa logic hoặc lấp khoảng trống, cần chạy lại một khoảng thời gian quá khứ. Vì pipeline idempotent và khoảng đọc được truyền vào như tham số, backfill chỉ là chạy lại với khoảng khác, không đụng vào mốc hiện tại. 

**dbt:** mô hình incremental dùng \`is_incremental()\` để lọc dữ liệu mới và \`unique_key\` để cập nhật. Nếu thiếu \`unique_key\`, đa số adapter chỉ ghi thêm và tạo bản trùng. \`--full-refresh\` dựng lại toàn bộ bảng.`,

    diagram: {
      mermaid: `flowchart TD
  A["Đọc mốc đã lưu, chốt mốc trên"] --> B["Đọc khoảng có chồng lấn nhìn lại"]
  B --> C["Khử trùng lặp theo khóa"]
  C --> D["MERGE vào đích"]
  D --> E{"Ghi thành công?"}
  E -->|"Có"| F["Đẩy mốc lên mốc trên"]
  E -->|"Không"| G["Giữ nguyên mốc, chạy lại"]
  F --> H["Đối soát định kỳ, xử lý xóa"]`,
      caption: 'Mốc chỉ được đẩy sau khi ghi thành công. Đọc chồng lấn và MERGE làm cho chạy lại trở nên an toàn.',
    },

    example: `Bảng \`orders\` có 2 tỷ dòng, mỗi ngày đổi khoảng 5 triệu dòng. Full load mất 6 giờ, incremental mỗi 15 phút chỉ mất 2 phút.

Sau 3 tháng, tổng doanh thu lệch 0,4% so với nguồn. Điều tra cho thấy hai nguyên nhân. Thứ nhất, transaction dài đến 6 phút bị bỏ sót, nên đội thêm khoảng nhìn lại 15 phút. Thứ hai, một script hoàn tiền không cập nhật \`updated_at\`.

Đội thêm đối soát hàng tuần theo tháng, chỉ tải lại các tháng bị lệch. Độ lệch về dưới 0,01%.`,

    prosCons: {
      pros: [
        '**Chi phí tỷ lệ với lượng thay đổi,** nên quy mô bảng không còn là giới hạn.',
        '**Giảm tải cho nguồn** và cho phép chạy thường xuyên hơn.',
      ],
      cons: [
        '**Có trạng thái,** nên sai sót tích lũy dần và khó phát hiện nếu không đối soát.',
        '**Phải tự xử lý** dữ liệu đến trễ, xóa, schema đổi và backfill.',
        '**Phụ thuộc cột theo dõi** của nguồn, và cột này có thể không đáng tin.',
      ],
    },

    whenToUse: {
      use: [
        'Bảng lớn với tỷ lệ thay đổi nhỏ và có cột theo dõi đáng tin cậy.',
        'Dữ liệu sự kiện chỉ ghi thêm, nơi partition theo thời gian là mốc tự nhiên.',
        'Luôn kèm đối soát định kỳ hoặc full refresh theo lịch thưa.',
      ],
      avoid: [
        'Bảng nhỏ: độ phức tạp không đáng so với lợi ích.',
        'Nguồn có nhiều xóa cứng và không có CDC, trừ khi có đối soát khóa.',
      ],
    },

    comparison: {
            headers: ['Cách ghi', 'Phù hợp khi', 'Đánh đổi'],
      rows: [
        ['Append', 'Sự kiện bất biến, đã khử trùng lặp', 'Rẻ nhất, nhưng chạy lại tạo bản trùng'],
        ['MERGE', 'Bảng có cập nhật, có khóa rõ ràng', 'Chi phí quét đích tăng theo kích thước bảng'],
        ['Insert overwrite', 'Dữ liệu theo partition thời gian, sửa cả partition', 'Phải tính lại cả partition'],
      ],
    },

    misconceptions: [
      {
        myth: 'High watermark trong batch và watermark trong stream là một.',
        truth: 'High watermark là mốc đã đọc đến đâu, lưu giữa các lần chạy. [[etl-stream|Watermark của stream]] là ước lượng tiến độ event time để đóng window. Hai khái niệm chỉ giống tên.',
      },
      {
        myth: 'Có `updated_at` là bắt được mọi thay đổi.',
        truth: 'Nó không thấy xóa cứng, không thấy thay đổi trung gian, và bỏ sót khi transaction commit muộn hoặc khi script không cập nhật cột này.',
      },
    ],
  },
})
