import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-yarn',
  summary:
    'YARN là lớp quản lý tài nguyên của Hadoop, tách việc cấp tài nguyên khỏi việc điều phối job. ResourceManager cấp Container, NodeManager chạy chúng, ApplicationMaster điều phối từng ứng dụng. Nhờ vậy nhiều framework như Spark dùng chung một cụm.',
  tags: ['YARN', 'Kiến trúc', 'Tài nguyên', 'First Principles'],
  related: [
    'hadoop-resourcemanager',
    'hadoop-nodemanager',
    'hadoop-mapreduce',
    'hadoop-overview',
    'spark-cluster-manager',
    'spark-executor',
  ],
  sections: {
    definition: `**YARN (Yet Another Resource Negotiator, Bộ quản lý tài nguyên của Hadoop)** là lớp cấp phát CPU và bộ nhớ trên cụm cho các ứng dụng. Ý tưởng cốt lõi là **tách việc quản lý tài nguyên khỏi việc điều phối từng job**:

- **[[hadoop-resourcemanager|ResourceManager]]:** một nút toàn cụm, quyết định ai được bao nhiêu tài nguyên.
- **[[hadoop-nodemanager|NodeManager]]:** một tiến trình trên mỗi máy, chạy và giám sát Container.
- **ApplicationMaster (AM):** mỗi ứng dụng có một cái riêng, xin tài nguyên và điều phối các task.
- **Container:** một phần tài nguyên được cấp trên một máy, như bộ nhớ và số vcore.

**YARN không chỉ dành cho MapReduce.** Spark, Tez hay Flink đều có thể chạy trên YARN, mỗi framework tự viết AM của mình.`,

    origin: `Trong Hadoop 1, **JobTracker** phải làm hai việc cùng lúc: quản lý tài nguyên toàn cụm và theo dõi từng task của mọi job. Điều này gây ra ba vấn đề:

- **Nút nghẽn:** cụm càng lớn, JobTracker càng quá tải, và khi nó hỏng thì mọi job đều mất.
- **Lãng phí tài nguyên:** tài nguyên chia thành các ô cố định dành riêng cho Map hoặc Reduce. Ô Reduce rảnh cũng không chạy Map được.
- **Chỉ chạy được MapReduce:** muốn chạy framework khác phải dựng cụm riêng.

Hadoop 2 đưa ra YARN để tách hai việc này. Phần theo dõi task chuyển sang AM của từng ứng dụng, nên ResourceManager nhẹ đi rất nhiều.`,

    whyUse: `YARN mang lại ba lợi ích thực tế:

1. **Dùng chung một cụm.** MapReduce, Spark và Hive có thể chạy cùng nhau trên cùng dữ liệu, không phải chép dữ liệu qua nhiều cụm.
2. **Phân chia theo chính sách.** Hàng đợi của CapacityScheduler đảm bảo mỗi phòng ban có phần riêng, và có thể mượn phần đang rảnh của phòng khác.
3. **Tận dụng tài nguyên tốt hơn.** Container không phân biệt Map hay Reduce, nên không còn cảnh ô này rảnh trong khi ô kia chờ.`,

    mechanism: `**Một ứng dụng chạy qua các bước sau:**

1. Client gửi ứng dụng tới ResourceManager.
2. ApplicationsManager, một phần của ResourceManager, cấp Container đầu tiên, và NodeManager khởi động AM trong đó.
3. AM đăng ký với ResourceManager, rồi gửi yêu cầu Container, có thể kèm mong muốn về máy hoặc rack gần dữ liệu.
4. Scheduler cấp Container theo chính sách, khi NodeManager báo còn tài nguyên qua heartbeat.
5. AM liên hệ **trực tiếp** với NodeManager để khởi động Container.
6. Task báo tiến độ về AM. Khi xong, AM báo với ResourceManager và trả lại tài nguyên.

**Vì sao ResourceManager không theo dõi task:** Scheduler là bộ lập lịch thuần túy. Nó không biết task là gì và không chạy lại task lỗi. Việc đó thuộc về AM, nên ResourceManager không phải gánh trạng thái của hàng triệu task và mở rộng được xa hơn.

**Scheduler** có thể thay thế. Mặc định là **CapacityScheduler**, chia theo hàng đợi với dung lượng định sẵn. **FairScheduler** cố gắng chia đều theo thời gian. Lưu ý là CapacityScheduler mặc định dùng \`DefaultResourceCalculator\`, **chỉ tính bộ nhớ**. Muốn tính cả CPU phải dùng \`DominantResourceCalculator\`.

**Giới hạn của Container:** mặc định nhỏ nhất 1.024 MB, lớn nhất 8.192 MB. Yêu cầu vượt mức lớn nhất sẽ bị từ chối. Container dùng quá bộ nhớ được cấp sẽ bị NodeManager giết.

**Với Spark:** mỗi [[spark-executor|Executor]] là một Container. Ở cluster mode, Driver chạy trong AM. Ở client mode, Driver nằm ngoài cụm và AM chỉ lo xin tài nguyên. Chi tiết ở [[spark-cluster-manager]].`,

    diagram: {
      mermaid: `flowchart TD
  C["Client gửi ứng dụng"] --> R["ResourceManager"]
  R -->|"cấp Container đầu tiên"| N1["NodeManager 1"]
  N1 --> A["ApplicationMaster"]
  A -->|"xin thêm Container"| R
  A -->|"khởi động Container"| N2["NodeManager 2"]
  N2 --> T["Task trong Container"]
  T -->|"báo tiến độ"| A`,
      caption:
        'ResourceManager chỉ cấp tài nguyên. ApplicationMaster của từng ứng dụng mới là nơi điều phối và theo dõi task.',
    },

    example: `Cụm có 50 NodeManager, mỗi máy dành 64 GB cho Container, tổng 3.200 GB. Hàng đợi \`etl\` được 60%, tức 1.920 GB, hàng đợi \`adhoc\` được 40%, tức 1.280 GB.

Một job Spark xin 100 Executor 8 GB. Spark cộng thêm memory overhead khoảng 10%, nên mỗi Container cần khoảng 8,8 GB. Ứng dụng báo lỗi ngay, vì yêu cầu vượt \`yarn.scheduler.maximum-allocation-mb\` mặc định là 8.192 MB. Quản trị viên tăng giới hạn này lên 16 GB.

Giờ mỗi Container được làm tròn lên 9 GB, tức 900 GB cho cả job, gần một nửa hàng đợi \`etl\`. Ban đêm, \`adhoc\` rảnh nên job của \`etl\` mượn thêm được. Sáng hôm sau khi \`adhoc\` có việc, phần mượn dần được trả lại.`,

    prosCons: {
      pros: [
        '**Đa framework:** nhiều engine dùng chung cụm và dữ liệu.',
        '**Mở rộng tốt hơn JobTracker,** vì phần theo dõi task nằm ở từng AM.',
        '**Lỗi được cô lập:** AM của một ứng dụng hỏng không ảnh hưởng tới ứng dụng khác.',
      ],
      cons: [
        '**Cấu hình khá nhiều:** hàng đợi, giới hạn Container, kiểm tra bộ nhớ đều dễ sai.',
        '**Phụ thuộc hệ sinh thái Hadoop,** không tiện cho ứng dụng thông thường như dịch vụ web.',
        '**Cô lập phụ thuộc thư viện yếu hơn container image** nếu không dùng thêm Docker runtime.',
      ],
    },

    whenToUse: {
      use: [
        'Đã có cụm Hadoop và muốn nhiều engine dùng chung dữ liệu HDFS, với locality tốt.',
        'Cần chia tài nguyên theo hàng đợi cho nhiều phòng ban trên cụm cố định.',
      ],
      avoid: [
        'Công ty đã chuẩn hóa trên Kubernetes và không có HDFS, khi đó không nên dựng thêm YARN.',
        'Ứng dụng chạy lâu dài như dịch vụ web, vì YARN được thiết kế chủ yếu cho công việc dữ liệu.',
      ],
    },

    comparison: {
      intro: 'So sánh YARN với JobTracker cũ và với Kubernetes:',
      headers: ['Tiêu chí', 'JobTracker (Hadoop 1)', 'YARN', 'Kubernetes'],
      rows: [
        ['Theo dõi task', 'JobTracker gánh hết', 'AM của từng ứng dụng', 'Do ứng dụng tự lo, như Spark Driver'],
        ['Đơn vị tài nguyên', 'Ô Map, ô Reduce cố định', 'Container', 'Pod'],
        ['Framework', 'Chỉ MapReduce', 'Nhiều framework dữ liệu', 'Mọi loại ứng dụng'],
        ['Chia tài nguyên', 'Theo ô', 'Hàng đợi', 'Namespace và quota'],
        ['Locality với HDFS', 'Có', 'Có, được hỗ trợ tốt', 'Thường không còn ý nghĩa'],
      ],
    },

    misconceptions: [
      {
        myth: 'YARN chỉ dùng để chạy MapReduce.',
        truth: 'YARN là nền tảng tài nguyên chung. MapReduce chỉ là một ứng dụng với AM riêng, gọi là MRAppMaster. Spark, Tez và nhiều framework khác cũng chạy được.',
      },
      {
        myth: 'ResourceManager theo dõi và chạy lại task bị lỗi.',
        truth: 'Scheduler không theo dõi task. Việc này do ApplicationMaster đảm nhận. ResourceManager chỉ khởi động lại chính AM khi AM hỏng.',
      },
      {
        myth: 'Container của YARN là Docker container.',
        truth: 'Container ở đây là một phần tài nguyên được cấp, mặc định chạy thành tiến trình thường trên máy. Docker chỉ là một lựa chọn runtime thêm vào.',
      },
    ],
  },
})
