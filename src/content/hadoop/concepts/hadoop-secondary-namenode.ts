import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-secondary-namenode',
  summary:
    'Secondary NameNode không phải bản dự phòng. Nó định kỳ gộp fsimage và edit log để edit log không quá dài, và không thể tiếp quản khi NameNode hỏng. Cụm HA dùng Standby NameNode cho việc này.',
  tags: ['HDFS', 'Checkpoint', 'Hiểu sai phổ biến'],
  related: ['hadoop-namenode', 'hadoop-hdfs', 'hadoop-fault-tolerance'],
  sections: {
    definition: `**Secondary NameNode (Nút gộp checkpoint cho NameNode)** là tiến trình phụ, làm đúng một việc: định kỳ gộp **fsimage** với **edit log** để tạo fsimage mới. **Tên của nó gây hiểu lầm: đây không phải NameNode dự phòng.** Nó không phục vụ client và không thể tự tiếp quản.`,

    origin: `[[hadoop-namenode|NameNode]] chỉ nối thêm vào edit log. Nếu không gộp, tệp này lớn dần, và lần khởi động sau phải chạy lại hàng triệu thay đổi, có thể mất hàng giờ. Việc gộp lại tốn nhiều RAM và CPU, nên người ta đưa nó sang một máy khác để NameNode không phải gánh thêm.`,

    whyUse: `Trên cụm không bật HA, Secondary NameNode giữ edit log ở mức hợp lý, rút ngắn thời gian khởi động, và để lại một bản fsimage ở máy khác có thể dùng khi cần cứu dữ liệu.`,

    mechanism: `Một checkpoint diễn ra khi đạt **3.600 giây** hoặc **1 triệu giao dịch**, tùy điều kiện nào đến trước:

1. NameNode chuyển sang một tệp edit log mới, các thay đổi sau đó ghi vào tệp mới.
2. Secondary tải fsimage và các edit log đã đóng về máy mình.
3. Secondary nạp vào RAM và chạy lại các thay đổi, vì vậy **cần RAM cùng cấp với NameNode**.
4. Secondary ghi ra fsimage mới và gửi trả cho NameNode.

**Vì sao không thể tiếp quản:** nó không nhận block report nên không biết vị trí block, và bản fsimage của nó có thể chậm tới một chu kỳ checkpoint. Nếu mất cả đĩa của NameNode, các thay đổi sau checkpoint cuối cùng sẽ mất.

**Trong cụm HA,** Standby NameNode tự làm checkpoint. Tài liệu Hadoop nói rõ chạy thêm Secondary NameNode trong cụm HA là lỗi cấu hình.`,

    diagram: {
      mermaid: `flowchart TD
  N["NameNode: fsimage cũ và edit log"] -->|"tải về"| S["Secondary NameNode"]
  S --> M["Nạp vào RAM và chạy lại edit log"]
  M --> F["fsimage mới"]
  F -->|"gửi trả"| N`,
      caption:
        'Secondary NameNode chỉ làm việc gộp nặng thay cho NameNode. Trong suốt quá trình này, client vẫn chỉ làm việc với NameNode.',
    },

    example: `Một cụm không có HA bị cấu hình sai khiến checkpoint dừng suốt 2 tuần. Edit log lên tới hàng trăm triệu giao dịch, nên lần khởi động lại sau đó mất hơn 3 giờ, thay vì vài phút. Đây là lỗi vận hành chứ không phải mất dữ liệu, nhưng cụm không dùng được trong thời gian đó.`,

    prosCons: {
      pros: [
        'Giảm tải cho NameNode trong lúc gộp.',
        'Rút ngắn thời gian khởi động lại.',
      ],
      cons: [
        'Không giúp cụm tiếp tục chạy khi NameNode hỏng.',
        'Tốn một máy có RAM lớn cho một việc chạy định kỳ.',
      ],
    },

    whenToUse: {
      use: [
        'Chỉ dùng ở cụm không có HA, chẳng hạn cụm thử nghiệm.',
        'Theo dõi thời điểm checkpoint cuối cùng để phát hiện checkpoint bị dừng.',
      ],
      avoid: [
        'Không xem đây là giải pháp sẵn sàng cao.',
        'Không chạy cùng cụm HA, vì Standby đã làm việc này.',
      ],
    },

    comparison: {
      intro: 'Các nút phụ trong tài liệu HDFS:',
      headers: ['Tiêu chí', 'Secondary', 'Checkpoint Node', 'Backup Node', 'Standby NameNode'],
      rows: [
        ['Làm checkpoint', 'Có', 'Có', 'Có', 'Có'],
        ['Giữ namespace liên tục trong RAM', 'Không', 'Không', 'Có', 'Có'],
        ['Biết vị trí block', 'Không', 'Không', 'Không', 'Có'],
        ['Tiếp quản nhanh', 'Không', 'Không', 'Không', 'Có'],
      ],
    },

    misconceptions: [
      {
        myth: 'Secondary NameNode là bản dự phòng, sẽ tự thay thế khi NameNode hỏng.',
        truth: 'Nó chỉ làm checkpoint. Muốn tiếp quản phải dùng Standby NameNode trong cấu hình HA.',
      },
      {
        myth: 'Có Secondary NameNode thì không bao giờ mất metadata.',
        truth: 'Bản fsimage của nó có thể chậm tới một chu kỳ checkpoint. Phải ghi edit log vào nhiều nơi hoặc dùng JournalNode để bảo vệ phần mới nhất.',
      },
    ],
  },
})
