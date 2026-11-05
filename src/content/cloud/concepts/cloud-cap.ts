import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-cap',
  summary:
    'CAP nói rằng khi có Network Partition, một hệ dữ liệu có bản sao phải chọn giữa Consistency và Availability. Đây không phải chọn 2 trong 3 lúc bình thường. Khi không có partition, đánh đổi là giữa độ trễ và tính nhất quán, theo PACELC.',
  tags: ['CAP', 'PACELC', 'Nhất quán', 'First Principles'],
  related: ['cloud-consistency', 'cloud-eventual-consistency', 'cloud-replication', 'cloud-high-availability', 'db-acid', 'db-relational-nosql', 'kafka-replication'],
  sections: {
    definition: `**CAP Theorem (Định lý CAP)** nói rằng: khi có **Network Partition (Phân mảnh mạng)**, một hệ thống dữ liệu có bản sao không thể vừa giữ Consistency vừa giữ Availability.

- **C (Consistency):** Linearizability, mọi đọc đều thấy giá trị mới nhất, như chỉ có một bản dữ liệu.
- **A (Availability):** mọi yêu cầu tới một nút còn sống đều nhận được phản hồi không phải lỗi.
- **P (Partition Tolerance):** hệ thống vẫn hoạt động khi mạng làm mất hoặc trễ thông điệp giữa các nút.

**Cách hiểu đúng:** không phải chọn 2 trong 3 ở mọi lúc. Mạng có thể hỏng bất cứ lúc nào, nên P không phải là lựa chọn. **Chỉ khi partition xảy ra** mới phải chọn giữa C và A. Lúc mạng bình thường, hệ thống có thể có cả hai.`,

    origin: `Eric Brewer nêu giả thuyết này năm 2000, và Seth Gilbert cùng Nancy Lynch chứng minh chặt chẽ năm 2002.

Khẩu hiệu "chọn 2 trong 3" sau đó bị dùng sai, đến mức Brewer phải viết lại năm 2012 để giải thích. Cùng năm, Daniel Abadi đề xuất **PACELC**, vì CAP không nói gì về lúc mạng bình thường.`,

    whyUse: `CAP giúp đặt đúng câu hỏi khi chọn hệ thống: khi mất liên lạc giữa các nút, tôi muốn trả lời có thể sai, hay từ chối trả lời? PACELC thêm câu hỏi hằng ngày: lúc bình thường, tôi có chấp nhận chờ lâu hơn để dữ liệu chắc chắn mới không?`,

    mechanism: `**Chứng minh rất ngắn gọn.** Có hai nút N1 và N2 giữ cùng một dữ liệu, và mạng giữa chúng đứt. Client ghi giá trị mới vào N1. Client khác đọc từ N2, nút chưa nhận được giá trị đó. N2 chỉ có hai cách:

- **Trả lời giá trị cũ:** giữ A, mất C.
- **Từ chối hoặc chờ đến khi mạng phục hồi:** giữ C, mất A.

Không có lựa chọn thứ ba, vì N2 không thể biết điều nó chưa nhận được.

**PACELC:** nếu có **P**artition thì chọn giữa **A** và **C**, **E**lse (ngược lại) chọn giữa **L**atency và **C**onsistency. Đánh đổi thứ hai luôn tồn tại khi có bản sao: muốn chắc chắn nhất quán thì phải chờ các bản sao khác, tức là độ trễ cao hơn. Theo Abadi, đây mới là lý do chính khiến nhiều hệ thống nới lỏng tính nhất quán.

**Phân loại trong bài báo của Abadi, theo cấu hình mặc định lúc đó:**

- **PA/EL:** Dynamo, Cassandra, Riak.
- **PC/EC:** VoltDB/H-Store, Megastore, BigTable và HBase.
- **PA/EC:** MongoDB.
- **PC/EL:** PNUTS.

**Các nhãn này chỉ là tương đối.** Theo Martin Kleppmann, nhiều hệ thống không đạt cả C lẫn A theo định nghĩa chặt. Single-leader đọc từ follower bất đồng bộ thì không Linearizable, mà leader bị cô lập thì không Available. Cassandra thay đổi theo cấu hình: \`R = W = 1\` thì vẫn trả lời ở cả hai phía, còn quorum thì phía thiểu số phải từ chối.

**Giới hạn của CAP:** chỉ xét một loại lỗi là partition, không nói về độ trễ, và A ở đây là 100% số yêu cầu chứ không phải số chín. Vì vậy Spanner về kỹ thuật là CP, nhưng đạt hơn năm số chín nhờ mạng riêng của Google, nên người dùng thấy gần như CA.`,

    diagram: {
      mermaid: `flowchart TD
  A["Có Network Partition không?"] -->|"Có"| B["Chọn giữa A và C"]
  A -->|"Không"| C["Chọn giữa L và C"]
  B --> D["Giữ C: phía thiểu số từ chối"]
  B --> E["Giữ A: trả lời, có thể sai"]
  C --> F["Giữ C: chờ bản sao, chậm hơn"]
  C --> G["Giữ L: đọc bản gần, có thể cũ"]`,
      caption: 'PACELC chia hai trường hợp. CAP chỉ nói về nhánh bên trái, tức lúc có partition.',
    },

    example: `Một sàn thương mại điện tử chạy ở hai vùng, và đường truyền giữa hai vùng đứt 4 phút.

- **Giỏ hàng chọn A:** vẫn nhận thao tác ở cả hai vùng. Sau đó gộp hai phiên bản, và người dùng có thể thấy lại một món đã xóa. Khó chịu nhưng không mất tiền.
- **Trừ tiền và tồn kho chọn C:** chỉ vùng có đa số mới xử lý. Vùng còn lại báo lỗi, người dùng phải thử lại sau 4 phút, nhưng không có đơn nào bị trừ tiền hai lần.

Lúc bình thường, giỏ hàng đọc từ vùng gần (chọn L) trong 5 ms, còn trừ tiền chờ đa số (chọn C) mất 80 ms. Cùng một hệ thống có thể chọn khác nhau cho từng loại dữ liệu.`,

    prosCons: {
      pros: [
        '**Chứng minh được rõ ràng** rằng không thể có cả hai khi có partition, nên khỏi tìm cách lách.',
        '**Buộc phải quyết định trước** hệ thống làm gì khi mạng hỏng.',
      ],
      cons: [
        '**Định nghĩa rất hẹp:** Linearizability và 100% yêu cầu, ít hệ thống thực tế khớp hẳn.',
        '**Nhãn CP hay AP dễ gây hiểu lầm,** vì hành vi đổi theo cấu hình và từng thao tác.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng khi so sánh hệ thống có bản sao, nhất là khi trải nhiều vùng.',
        'Nên chọn theo từng loại dữ liệu: C cho tiền và tồn kho, A cho giỏ hàng và lượt xem.',
      ],
      avoid: [
        'Không chọn cơ sở dữ liệu chỉ dựa vào nhãn CP hay AP. Hãy xem cấu hình và kiểm thử khi lỗi.',
      ],
    },

    comparison: {
      intro: 'Hai chữ C dễ bị nhầm nhất:',
      headers: ['Tiêu chí', 'C trong CAP', 'C trong ACID'],
      rows: [
        ['Ý nghĩa', 'Linearizability: như chỉ có một bản dữ liệu', 'Giao dịch giữ dữ liệu thỏa ràng buộc'],
        ['Phạm vi', 'Các bản sao trên nhiều nút', 'Trạng thái dữ liệu trước và sau giao dịch'],
        ['Ví dụ vi phạm', 'Vừa ghi xong, bản khác vẫn trả giá trị cũ', 'Số dư âm khi quy tắc cấm số dư âm'],
      ],
      note: 'Một hệ thống có thể giữ ràng buộc rất tốt trên từng nút mà vẫn trả dữ liệu cũ từ bản sao, và ngược lại. Xem [[db-acid]].',
    },

    misconceptions: [
      {
        myth: 'Mọi hệ thống phải chọn 2 trong 3 tính chất C, A, P.',
        truth: 'Chỉ khi có partition mới phải chọn giữa C và A. Lúc bình thường có thể có cả hai.',
      },
      {
        myth: 'Có thể chọn CA, bỏ P.',
        truth: 'Không thể chọn để mạng không hỏng. "CA" thực chất là một máy, hoặc là chấp nhận hệ thống dừng khi mạng lỗi.',
      },
    ],
  },
})
