import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-overview',
  summary:
    'Apache Hadoop là nền tảng mã nguồn mở để lưu trữ và xử lý dữ liệu lớn trên cụm máy phổ thông, gồm HDFS để lưu trữ, YARN để cấp tài nguyên và MapReduce để xử lý theo lô.',
  tags: ['Tổng quan', 'Hệ sinh thái', 'Big Data'],
  related: [
    'hadoop-hdfs',
    'hadoop-yarn',
    'hadoop-mapreduce',
    'hadoop-distributed-systems',
    'spark-overview',
    'cloud-s3',
  ],
  sections: {
    definition: `**Apache Hadoop** là nền tảng mã nguồn mở để lưu trữ và xử lý dữ liệu rất lớn trên một cụm máy phổ thông. Thay vì mua một máy cực mạnh, Hadoop ghép nhiều máy thường lại và tự xử lý việc máy hỏng.

Dự án gồm bốn mô-đun:

- **Hadoop Common:** thư viện dùng chung.
- **[[hadoop-hdfs|HDFS]]:** hệ thống tệp phân tán, lo phần lưu trữ.
- **[[hadoop-yarn|YARN]]:** quản lý tài nguyên của cụm và lập lịch.
- **[[hadoop-mapreduce|MapReduce]]:** mô hình xử lý theo lô chạy trên YARN.

**Hệ sinh thái Hadoop** là các dự án khác xây trên nền này, như Hive, HBase và [[spark-overview|Spark]]. Chúng không thuộc bốn mô-đun trên.`,

    origin: `Giữa những năm 2000, dữ liệu web đã vượt xa khả năng của một máy. Cách làm cũ là mua máy lớn hơn và kho lưu trữ tập trung, rất đắt và có giới hạn. Việc tự viết chương trình phân tán cũng khó, vì phải tự chia việc và tự xử lý lỗi.

Google công bố hai bài báo về **GFS** (2003) và **MapReduce** (2004). Doug Cutting và Mike Cafarella hiện thực lại ý tưởng này cho công cụ tìm kiếm Nutch, rồi tách thành Hadoop năm 2006 với sự đầu tư của Yahoo.

Hadoop phát triển qua ba đời chính:

- **Hadoop 1:** JobTracker làm mọi việc, chỉ chạy được MapReduce.
- **Hadoop 2:** có YARN và High Availability (Tính sẵn sàng cao) cho NameNode.
- **Hadoop 3:** có Erasure Coding (Mã hóa xóa) và cho phép nhiều hơn hai NameNode.`,

    whyUse: `Hadoop giải quyết hai việc cụ thể:

1. **Vượt giới hạn của một máy.** Đọc 30 TB với tốc độ 200 MB/giây trên một máy mất hơn 43 giờ. Chia cho hàng trăm máy đọc song song thì chỉ còn tính bằng phút.
2. **Chịu lỗi sẵn có.** Ở quy mô hàng nghìn ổ đĩa, hỏng hóc xảy ra hằng tuần. Hadoop xem đây là chuyện bình thường, nên người viết job không phải tự xử lý.

Ngay cả khi công ty không còn dùng Hadoop, các khái niệm vẫn còn nguyên giá trị: chia khối, sao chép, shuffle, đưa tính toán đến dữ liệu. [[spark-shuffle|Shuffle của Spark]] và [[spark-small-files|vấn đề tệp nhỏ]] đều dễ hiểu hơn khi đã nắm Hadoop.`,

    mechanism: `Hadoop tách thành ba lớp, mỗi lớp giải quyết một câu hỏi:

- **Lưu ở đâu?** HDFS chia tệp thành các block 128 MB, mỗi block có 3 bản sao trên các DataNode. NameNode chỉ giữ metadata.
- **Lấy tài nguyên từ đâu?** YARN có ResourceManager quản lý toàn cụm và NodeManager trên từng máy, cấp phát tài nguyên dưới dạng Container.
- **Tính như thế nào?** Một framework như MapReduce hoặc Spark chạy trong các Container đó.

**Một job đi qua các lớp như sau:**

1. Dữ liệu đã nằm trên HDFS dưới dạng các block rải trên nhiều máy.
2. Client gửi ứng dụng tới ResourceManager, nơi này cấp Container đầu tiên để chạy ApplicationMaster.
3. ApplicationMaster hỏi vị trí dữ liệu, rồi xin thêm Container, ưu tiên máy đang giữ block đó. Đây là [[hadoop-data-locality]].
4. Các task đọc block, tính toán và ghi kết quả lại HDFS.
5. Task lỗi được chạy lại ở máy khác, nhờ dữ liệu có nhiều bản sao.

**Vì sao tách lớp quan trọng:** khi đã độc lập, từng lớp có thể bị thay thế. Spark có thể thay MapReduce, S3 có thể thay HDFS, Kubernetes có thể thay YARN. Đây cũng là cách nhiều công ty chuyển dần khỏi Hadoop mà không phải làm lại từ đầu.`,

    diagram: {
      mermaid: `flowchart TD
  A["Hive, Pig, các công cụ phía trên"] --> B["Framework xử lý: MapReduce, Spark, Tez"]
  B --> C["YARN: cấp phát Container"]
  B --> D["HDFS: lưu block và bản sao"]
  C --> E["Các máy trong cụm: NodeManager và DataNode"]
  D --> E`,
      caption:
        'Framework xử lý xin tài nguyên từ YARN và đọc dữ liệu từ HDFS. YARN và HDFS thường chạy trên cùng các máy, nên tính toán có thể đến gần dữ liệu.',
    },

    example: `Một công ty viễn thông lưu 300 TB nhật ký cuộc gọi. Với 3 bản sao, dung lượng thực tế là 900 TB. Họ dựng cụm 60 máy, mỗi máy 20 TB đĩa, tổng 1,2 PB, còn dư để chứa dữ liệu mới.

Báo cáo tháng quét 30 TB, tương đương khoảng 245.000 block, nên tạo khoảng 245.000 Map task. Cụm cho 1.200 Container chạy song song, mỗi task mất khoảng 20 giây, nên pha Map xong trong khoảng 70 phút. Một máy đọc tuần tự sẽ mất hơn 43 giờ.`,

    prosCons: {
      pros: [
        '**Mở rộng ngang:** thêm máy là thêm cả dung lượng lẫn sức tính toán.',
        '**Chịu lỗi ở mọi lớp:** bản sao ở HDFS, chạy lại task ở MapReduce, HA cho các nút quản lý.',
        '**Tận dụng vị trí dữ liệu:** không phải chuyển hàng trăm TB qua mạng mới tính được.',
      ],
      cons: [
        '**Vận hành nặng:** cần đội ngũ theo dõi NameNode, nâng cấp, cân bằng đĩa và bảo mật.',
        '**Máy tính và lưu trữ gắn với nhau:** muốn thêm đĩa cũng phải thêm máy, nên khó co giãn theo nhu cầu như đám mây.',
        '**Không hợp với dữ liệu nhỏ hoặc độ trễ thấp:** HDFS tối ưu cho đọc tuần tự tệp lớn, không phải truy vấn từng dòng.',
      ],
    },

    whenToUse: {
      use: [
        'Dữ liệu ở mức hàng trăm TB trở lên và phải lưu trong trung tâm dữ liệu riêng, do quy định hoặc do chi phí.',
        'Đã có cụm Hadoop đang chạy tốt, với khối lượng công việc ổn định quanh năm.',
      ],
      avoid: [
        'Dữ liệu chỉ vài trăm GB, một máy mạnh hoặc một kho dữ liệu đám mây sẽ đơn giản hơn nhiều.',
        'Hệ thống cần trả lời trong mili giây, hoặc cần cập nhật từng dòng liên tục.',
        'Dự án mới trên đám mây, thường hợp hơn với [[cloud-s3|S3]] kết hợp Spark hoặc [[cloud-bigquery|BigQuery]], vì không phải giữ cụm lúc rảnh.',
      ],
    },

    comparison: {
      intro: 'Ba cách phổ biến để xử lý dữ liệu lớn hiện nay:',
      headers: ['Tiêu chí', 'Hadoop tự vận hành', 'Spark trên S3', 'Kho dữ liệu đám mây'],
      rows: [
        ['Lưu trữ', 'HDFS trên đĩa của cụm', 'Object storage tách rời', 'Do dịch vụ quản lý'],
        ['Tài nguyên', 'YARN, cụm cố định', 'Kubernetes hoặc cụm tạm thời', 'Dịch vụ tự co giãn'],
        ['Chi phí', 'Đầu tư lớn, ổn định khi tải đều', 'Theo mức dùng', 'Theo lượng quét hoặc thời gian'],
        ['Công sức vận hành', 'Cao', 'Trung bình', 'Thấp'],
      ],
    },

    misconceptions: [
      {
        myth: 'Hadoop chính là MapReduce.',
        truth: 'MapReduce chỉ là một trong bốn mô-đun. Một cụm Hadoop hiện nay có thể không chạy job MapReduce nào mà chỉ chạy Spark trên YARN.',
      },
      {
        myth: 'Spark đã thay thế hoàn toàn Hadoop.',
        truth: 'Spark chủ yếu thay MapReduce ở phần xử lý. Spark không có hệ thống lưu trữ riêng, và vẫn có thể đọc HDFS và chạy trên YARN.',
      },
      {
        myth: 'Hadoop đã lỗi thời nên không cần học.',
        truth: 'Nhiều doanh nghiệp vẫn vận hành cụm Hadoop tại chỗ, và các nguyên lý của nó vẫn nằm trong Spark, Hive và các hệ thống đám mây.',
      },
    ],
  },
})
