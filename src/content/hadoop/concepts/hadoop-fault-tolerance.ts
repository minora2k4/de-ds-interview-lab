import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-fault-tolerance',
  summary:
    'Hadoop chịu lỗi ở cả ba lớp: HDFS có bản sao và checksum, MapReduce chạy lại task, còn NameNode và ResourceManager có HA. Lỗi được xem là chuyện thường, không phải ngoại lệ.',
  tags: ['Chịu lỗi', 'HA', 'First Principles'],
  related: ['hadoop-block-replication', 'hadoop-namenode', 'hadoop-resourcemanager', 'hadoop-mapreduce', 'hadoop-distributed-systems', 'spark-rdd', 'cloud-fault-tolerance'],
  sections: {
    definition: `**Fault Tolerance (Khả năng chịu lỗi)** là khả năng tiếp tục chạy đúng khi một phần hệ thống hỏng. Trong Hadoop, người viết job gần như không phải lo việc này, vì mỗi lớp có cơ chế riêng để tự phục hồi.`,

    origin: `Hadoop được thiết kế cho phần cứng thường, với số lượng máy lớn đến mức hỏng hóc xảy ra hằng ngày. Cách làm cũ là mua phần cứng cao cấp để ít hỏng. Hadoop chọn hướng ngược lại: giả định máy sẽ hỏng, và xử lý bằng phần mềm. Xem thêm [[hadoop-distributed-systems]].`,

    whyUse: `Một job chạy nhiều giờ trên hàng trăm máy gần như chắc chắn sẽ gặp lỗi. Nếu mỗi lỗi đều làm hỏng cả job, các job lớn sẽ không bao giờ xong.`,

    mechanism: `**Lớp lưu trữ (HDFS):**

- **Bản sao** cho phép mất máy mà không mất dữ liệu. Thiếu bản sao thì tự sao chép lại.
- **Checksum:** client kiểm tra khi đọc, sai thì chuyển sang bản sao khác.

**Lớp xử lý (MapReduce):**

- **Task lỗi:** được thử lại trên máy khác, tối đa **4 lần** mỗi task. Quá số này thì job thất bại.
- **Task treo:** không báo tiến độ trong **10 phút** thì bị giết và thử lại.
- **Mất máy:** Map task đã xong trên máy đó cũng phải **chạy lại**, vì đầu ra nằm trên đĩa cục bộ. Reduce đã xong thì không cần, vì kết quả đã nằm trên HDFS.
- **Speculative Execution (Thực thi suy đoán):** mặc định bật, chạy thêm bản sao của task chậm và lấy kết quả của bản xong trước. Đây là cách xử lý task chậm, không phải task lỗi.

**Lớp điều phối:**

- **ApplicationMaster hỏng:** ResourceManager khởi động lại, mặc định tối đa 2 lần thử.
- **NodeManager mất:** sau 10 phút không có heartbeat, các Container của nó được xem là đã mất.
- **NameNode và ResourceManager:** dùng HA với Active và Standby.

Vì task có thể chạy nhiều lần, task phải **không có tác dụng phụ** ra ngoài, như gọi API hay ghi vào cơ sở dữ liệu theo cách không lặp lại được.`,

    example: `Một job có 5.000 Map và 200 Reduce, chạy 3 giờ. Giờ thứ hai một máy chết, đang giữ 120 Map đã xong và 8 Reduce đang chạy. Sau khi máy được xác định đã mất, AM chạy lại 8 Reduce đó, và chạy lại những Map đã xong mà Reducer chưa lấy hết đầu ra. Job chậm thêm vài phút, nhưng hoàn thành mà không ai phải can thiệp.`,

    prosCons: {
      pros: [
        'Người viết job không phải tự xử lý lỗi.',
        'Job dài vẫn hoàn thành dù có máy hỏng giữa chừng.',
      ],
      cons: [
        'Bản sao và chạy lại đều tốn tài nguyên.',
      ],
    },

    whenToUse: {
      use: [
        'Viết task không có tác dụng phụ, để có thể chạy lại an toàn.',
      ],
      avoid: [
        'Tắt Speculative Execution khi task ghi ra hệ thống ngoài không chịu được ghi trùng.',
        'Không tăng số lần thử để che giấu lỗi trong dữ liệu hoặc code, vì lần nào cũng sẽ lỗi.',
      ],
    },

    comparison: {
      intro: 'Cách phục hồi của MapReduce so với Spark:',
      headers: ['Tiêu chí', 'MapReduce', 'Spark'],
      rows: [
        ['Nguồn phục hồi', 'Dữ liệu đã ghi trên đĩa và HDFS', '[[spark-rdd|Lineage]] và file shuffle'],
        ['Công việc nhiều bước', 'Mỗi job có điểm lưu trên HDFS', 'Có thể tính lại xa, nên dùng checkpoint'],
        ['Task chậm', 'Speculative mặc định bật', 'Speculative mặc định tắt'],
      ],
    },

    misconceptions: [
      {
        myth: 'Speculative Execution dùng để xử lý task bị lỗi.',
        truth: 'Nó xử lý task chạy chậm. Task lỗi được xử lý bằng cơ chế thử lại, tối đa 4 lần mặc định.',
      },
      {
        myth: 'Map task đã hoàn thành thì không bao giờ phải chạy lại.',
        truth: 'Đầu ra Map nằm trên đĩa cục bộ. Mất máy trước khi Reducer lấy xong thì Map đó phải chạy lại.',
      },
    ],
  },
})
