import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-acid',
  summary:
    'ACID là bốn bảo đảm của giao dịch: Atomicity, Consistency, Isolation, Durability. Cơ sở dữ liệu thực hiện chúng bằng log ghi trước, MVCC và khóa, và có thể nới lỏng một phần để đổi lấy hiệu năng.',
  tags: ['Giao dịch', 'WAL', 'Độ bền', 'First Principles'],
  related: ['db-transactions', 'db-isolation-levels', 'db-relational-nosql', 'cloud-cap', 'cloud-consistency', 'cloud-replication'],
  sections: {
    definition: `**ACID (Bốn tính chất của giao dịch)** gồm:

- **Atomicity (Tính nguyên tử):** giao dịch có hiệu lực toàn bộ, hoặc không có hiệu lực gì.
- **Consistency (Tính nhất quán):** giao dịch đưa dữ liệu từ trạng thái hợp lệ này sang trạng thái hợp lệ khác, theo các ràng buộc.
- **Isolation (Tính cô lập):** các giao dịch đồng thời không nhìn thấy trạng thái dở dang của nhau, ở mức do [[db-isolation-levels]] quy định.
- **Durability (Tính bền vững):** đã báo commit thành công thì dữ liệu không mất, kể cả khi sập máy.`,

    origin: `Khi ứng dụng ghi trực tiếp vào tệp, mỗi chương trình phải tự xử lý việc mất điện giữa chừng và việc nhiều người ghi cùng lúc, nên vừa lặp lại, vừa dễ sai. Jim Gray mô tả khái niệm giao dịch năm 1981, sau đó Härder và Reuter đặt tên ACID năm 1983.

Ý tưởng cốt lõi: đẩy hai vấn đề khó nhất là lỗi và đồng thời xuống cơ sở dữ liệu, để lập trình viên viết logic như thể chương trình chạy một mình và không bao giờ gặp sự cố.`,

    whyUse: `ACID giúp ứng dụng không phải tự viết code khôi phục và đối soát cho từng thao tác. Với tiền bạc và tồn kho, trạng thái dở dang là không thể chấp nhận. Với Data Engineering, nạp một lô dữ liệu trong giao dịch giúp pipeline lỗi giữa chừng không để lại dữ liệu nửa vời.`,

    mechanism: `**A và D nhờ Write-Ahead Log (WAL, log ghi trước).** Trước khi trang dữ liệu đổi trên đĩa, mô tả thay đổi phải được ghi xuống log. Khi commit, cơ sở dữ liệu chỉ cần flush log, là thao tác ghi tuần tự nên rẻ hơn nhiều so với ghi rải rác nhiều trang. Các trang dữ liệu được ghi sau. Khi sập máy, hệ thống phát lại log để khôi phục mọi giao dịch đã commit.

**Phần chưa commit bị loại thế nào?** InnoDB cập nhật tại chỗ nên dùng undo log để quay lại giá trị cũ. PostgreSQL ghi phiên bản dòng mới, nên giao dịch bị hủy chỉ để lại các phiên bản không ai nhìn thấy, sau này \`VACUUM\` dọn đi.

**I nhờ MVCC và khóa.** Giao dịch đọc từ snapshot, còn các lần ghi cùng dòng thì khóa nhau.

**C là phần được chia sẻ.** Cơ sở dữ liệu chỉ kiểm tra những gì đã khai báo: khóa chính, khóa ngoại, \`UNIQUE\`, \`CHECK\`. Quy tắc như "tổng tiền hai tài khoản không đổi sau khi chuyển" là trách nhiệm của ứng dụng khi viết giao dịch.

**Đánh đổi độ bền lấy tốc độ.** Mặc định, \`synchronous_commit = on\` của PostgreSQL và \`innodb_flush_log_at_trx_commit = 1\` của InnoDB đều flush log khi commit. Nới lỏng thì ghi nhanh hơn, nhưng có thể mất các giao dịch gần nhất khi sập. Điểm quan trọng là \`synchronous_commit = off\` không làm hỏng dữ liệu, trong khi tắt \`fsync\` thì có thể.`,

    diagram: {
      mermaid: `flowchart TD
  A["Giao dịch thay đổi dữ liệu"] --> B["Ghi bản ghi vào WAL"]
  B --> C["COMMIT: flush WAL xuống đĩa"]
  C --> D["Báo thành công cho ứng dụng"]
  C --> E["Trang dữ liệu được ghi sau"]
  F["Sập máy"] --> G["Phát lại WAL khi khởi động"]
  G --> E`,
      caption:
        'Commit chỉ cần log đã xuống đĩa. Trang dữ liệu ghi sau cũng không sao, vì có thể dựng lại từ log.',
    },

    example: `Chuyển 5 triệu đồng từ tài khoản A sang B gồm hai lệnh \`UPDATE\`.

- **Atomicity:** máy sập sau lệnh trừ A, chưa commit. Khởi động lại, số dư A vẫn như cũ.
- **Consistency:** A chỉ còn 3 triệu thì ràng buộc \`CHECK (balance >= 0)\` từ chối giao dịch.
- **Isolation:** báo cáo đang chạy không bao giờ thấy trạng thái đã trừ A mà chưa cộng B.
- **Durability:** đã báo thành công rồi mới mất điện, thì phát lại WAL vẫn còn đủ.

Về chi phí, giả sử mỗi lần flush mất 2 ms thì tối đa 500 lần flush mỗi giây. Group commit gom trung bình 40 giao dịch cho một lần flush, nên đạt 20.000 commit mỗi giây mà vẫn giữ độ bền.`,

    prosCons: {
      pros: [
        '**Ứng dụng đơn giản hơn nhiều,** vì không phải tự xử lý trạng thái dở dang.',
        '**Dễ lý luận:** chỉ cần giao dịch đúng khi chạy một mình, và hệ thống lo phần còn lại theo mức cô lập đã chọn.',
      ],
      cons: [
        '**Tốn chi phí ghi:** log, flush đĩa và khóa đều làm tăng độ trễ.',
        '**Khó mở rộng ngang:** giữ ACID trên nhiều máy cần giao thức như 2PC, xem [[db-sharding]].',
      ],
    },

    whenToUse: {
      use: [
        'Dữ liệu tiền bạc, tồn kho, đặt chỗ, nơi trạng thái dở dang gây thiệt hại thật.',
        'Nạp dữ liệu theo lô mà cần tất cả hoặc không có gì.',
      ],
      avoid: [
        'Không cần giao dịch nhiều dòng cho log sự kiện mà mất vài dòng khi sập cũng chấp nhận được.',
        'Không tắt `fsync` trên dữ liệu không thể tạo lại, vì sập máy có thể làm hỏng cả cơ sở dữ liệu.',
      ],
    },

    comparison: {
      intro: 'So sánh với BASE, triết lý của nhiều hệ phân tán:',
      headers: ['Tiêu chí', 'ACID', 'BASE'],
      rows: [
        ['Ưu tiên', 'Tính đúng đắn của mỗi giao dịch', 'Sẵn sàng và khả năng mở rộng'],
        ['Sau khi ghi', 'Đọc thấy ngay', 'Có thể cần thời gian, xem [[cloud-eventual-consistency]]'],
        ['Xung đột', 'Khóa hoặc hủy giao dịch', 'Giải quyết sau, ví dụ last-write-wins'],
      ],
    },

    misconceptions: [
      {
        myth: 'C trong ACID và C trong định lý CAP là một.',
        truth: 'C của ACID nói về việc giữ các ràng buộc dữ liệu. C của [[cloud-cap]] nói về việc mọi bản sao có cùng dữ liệu mới nhất.',
      },
      {
        myth: 'Có ACID nghĩa là các giao dịch hoàn toàn tách biệt.',
        truth: 'Mức mặc định không phải Serializable, nên vẫn có các hiện tượng như Write Skew.',
      },
      {
        myth: 'Commit xong nghĩa là dữ liệu đã nằm trong tệp bảng trên đĩa.',
        truth: 'Lúc đó chỉ log chắc chắn đã xuống đĩa. Trang dữ liệu có thể chỉ nằm trong bộ nhớ.',
      },
      {
        myth: 'Durability bảo vệ khỏi mọi rủi ro mất dữ liệu.',
        truth: 'Nó chỉ chống mất điện và sập phần mềm trên một máy. Hỏng đĩa vĩnh viễn thì cần [[cloud-replication]] và sao lưu.',
      },
    ],
  },
})
