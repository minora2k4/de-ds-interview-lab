import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-scaling',
  summary:
    'Vertical Scaling tăng sức mạnh cho một máy, đơn giản nhưng có trần và vẫn là một điểm lỗi. Horizontal Scaling thêm máy, gần như không có trần nhưng đòi hỏi ứng dụng không giữ trạng thái hoặc dữ liệu phải được chia.',
  tags: ['Mở rộng', 'Kiến trúc', 'System Design', 'First Principles'],
  related: ['cloud-distributed-computing', 'cloud-load-balancing', 'cloud-high-availability', 'cloud-replication', 'db-sharding', 'db-partitioning', 'cloud-redshift', 'cloud-bigquery'],
  sections: {
    definition: `Có hai hướng để tăng năng lực của một hệ thống:

- **Vertical Scaling (Mở rộng dọc, scale up):** thay máy hiện tại bằng máy mạnh hơn.
- **Horizontal Scaling (Mở rộng ngang, scale out):** thêm máy, rồi chia việc cho các máy đó.

Trước hết phải biết **điểm nghẽn nằm ở đâu**: CPU, bộ nhớ, I/O đĩa, mạng hay khóa trong cơ sở dữ liệu. Thêm tài nguyên ở chỗ khác thì không có tác dụng.`,

    origin: `Trong nhiều thập kỷ, cách phổ biến là mua máy lớn hơn, vì ứng dụng không phải sửa gì. Cách này có ba giới hạn: máy lớn nhất vẫn có trần, giá tăng nhanh hơn năng lực, và một máy hỏng là cả hệ thống dừng.

Các công ty web lớn đi theo hướng ngược lại: dùng nhiều máy thường, xem hỏng hóc là chuyện bình thường. [[cloud-distributed-computing|Tính toán phân tán]] và cloud làm hướng này dễ tiếp cận, vì có thể thuê thêm máy trong vài phút rồi trả lại khi hết việc.`,

    whyUse: `Chọn đúng hướng giúp tránh hai sai lầm tốn kém: viết lại kiến trúc khi nâng máy là đủ, hoặc cứ nâng máy khi đã sát trần. Với hệ thống dữ liệu, tải biến động theo giờ, nên co giãn theo nhu cầu còn giúp không phải trả tiền cho năng lực nhàn rỗi.`,

    mechanism: `**Vertical Scaling** không đổi kiến trúc. Trên cloud thường phải dừng máy để đổi loại máy, nên có gián đoạn ngắn. Càng lên cao càng gặp giới hạn khác, như tranh chấp khóa hay dừng lâu do GC trên heap lớn. Hệ thống vẫn là **một điểm lỗi duy nhất**.

**Horizontal Scaling** phụ thuộc vào trạng thái:

- **Không giữ trạng thái (stateless):** mọi máy trả lời được mọi yêu cầu, nên chỉ cần thêm máy phía sau [[cloud-load-balancing|Load Balancer]]. Phiên đăng nhập và dữ liệu phải đưa ra kho lưu chung.
- **Giữ trạng thái (stateful):** dữ liệu phải được chia ([[db-sharding|Sharding]]) hoặc sao chép ([[cloud-replication|Replication]]). Sao chép chỉ tăng năng lực đọc, vì mọi bản sao đều phải ghi lại mỗi thay đổi. Muốn tăng năng lực ghi thì phải chia dữ liệu.

**Thêm máy kéo theo di chuyển dữ liệu.** Với \`hash(key) % n\`, đổi \`n\` khiến gần như mọi key đổi chỗ. Consistent Hashing (Băm nhất quán) chỉ chuyển khoảng \`1/n\` số key.

**Tốc độ không tăng tuyến tính.** Tranh chấp tài nguyên chung làm tốc độ đi ngang (định luật Amdahl). Chi phí giữ các máy thống nhất tăng theo số cặp máy, có thể khiến thêm máy làm thông lượng **giảm đi** (Universal Scalability Law).

**Auto Scaling (Tự động co giãn)** thêm bớt máy theo một chỉ số. Chỉ số phải phản ánh điểm nghẽn thật: với worker xử lý hàng đợi, độ dài hàng đợi thường tốt hơn CPU. Cần thời gian nghỉ để tránh dao động, và phải tính đến việc máy mới mất vài phút mới sẵn sàng.

**Tách lưu trữ và tính toán:** dữ liệu nằm trên object storage, còn cụm tính toán co giãn riêng, như [[cloud-redshift|Redshift RA3]] và [[cloud-bigquery|BigQuery]]. Đổi số máy tính toán không phải chia lại dữ liệu.`,

    diagram: {
      mermaid: `flowchart TD
  A["Hệ thống quá tải"] --> B["Đo để tìm điểm nghẽn"]
  B --> C["Ứng dụng không giữ trạng thái"]
  B --> D["Cơ sở dữ liệu quá tải khi đọc"]
  B --> E["Cơ sở dữ liệu quá tải khi ghi"]
  C --> F["Thêm máy sau Load Balancer"]
  D --> G["Cache hoặc thêm bản sao đọc"]
  E --> H["Nâng máy, rồi mới Sharding"]`,
      caption:
        'Cách xử lý phụ thuộc vào điểm nghẽn. Cùng là quá tải, nhưng đọc và ghi cần hai hướng khác nhau.',
    },

    example: `Một hệ thống báo cáo dùng PostgreSQL 8 vCPU, CPU luôn ở 90% với 80% truy vấn là đọc.

- **Bước 1:** nâng lên 32 vCPU, mất 5 phút gián đoạn, đủ dùng thêm một năm.
- **Bước 2:** thêm 2 bản sao đọc cho dashboard. CPU máy chính giảm xuống 40%.
- **Bước 3:** khi lượng ghi đạt 15.000 dòng mỗi giây và máy chính lại quá tải, bản sao đọc không còn giúp được. Lúc này mới xét Sharding theo \`customer_id\`, hoặc đưa phần phân tích sang kho dữ liệu.

Nhóm không Sharding ngay từ đầu, nên tránh được nhiều tháng viết lại ứng dụng.`,

    prosCons: {
      pros: [
        '**Vertical:** không phải sửa ứng dụng, giữ nguyên giao dịch và join trong một máy.',
        '**Horizontal:** gần như không có trần, mất một máy chỉ mất một phần năng lực.',
        '**Horizontal:** co giãn được theo tải, hợp với mô hình trả theo mức dùng của cloud.',
      ],
      cons: [
        '**Vertical:** có trần phần cứng, thường phải gián đoạn, vẫn là một điểm lỗi.',
        '**Horizontal:** phải xử lý mạng, lỗi một phần, di chuyển dữ liệu và tính nhất quán.',
        '**Horizontal với Sharding:** join và giao dịch qua nhiều shard trở nên khó và đắt.',
      ],
    },

    whenToUse: {
      use: [
        '**Vertical:** còn dư địa phần cứng, cần cách đơn giản và nhanh, nhất là với cơ sở dữ liệu quan hệ.',
        '**Horizontal:** tầng ứng dụng không giữ trạng thái, hoặc dữ liệu chia được theo một key rõ ràng.',
        '**Auto Scaling:** tải biến động theo giờ và máy mới khởi động đủ nhanh.',
      ],
      avoid: [
        'Không Sharding sớm khi cache, chỉ mục, bản sao đọc hoặc nâng máy vẫn còn tác dụng.',
        'Không thêm máy để chữa [[spark-data-skew|Data Skew]]: phần việc lệch vẫn nằm trên một core.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Vertical Scaling', 'Horizontal Scaling'],
      rows: [
        ['Giới hạn', 'Trần phần cứng', 'Chi phí phối hợp'],
        ['Sửa ứng dụng', 'Thường không', 'Thường có'],
        ['Khi một máy hỏng', 'Dừng toàn bộ', 'Mất một phần năng lực'],
        ['Tăng năng lực ghi', 'Có, đến trần', 'Chỉ khi chia dữ liệu'],
        ['Độ phức tạp vận hành', 'Thấp', 'Cao'],
      ],
    },

    misconceptions: [
      {
        myth: 'Horizontal Scaling lúc nào cũng tốt hơn.',
        truth: 'Nó đổi giới hạn phần cứng lấy độ phức tạp của hệ phân tán. Khi một máy vẫn đủ, nâng máy thường rẻ hơn nếu tính cả công sức vận hành.',
      },
      {
        myth: 'Thêm bản sao đọc sẽ tăng được năng lực ghi.',
        truth: 'Mọi bản sao đều phải áp dụng từng thay đổi, nên tải ghi không giảm.',
      },
      {
        myth: 'Auto Scaling xử lý được mọi đợt tăng tải.',
        truth: 'Máy mới cần thời gian khởi động, và điểm nghẽn ở cơ sở dữ liệu phía sau không tự hết khi thêm máy ứng dụng.',
      },
    ],
  },
})
