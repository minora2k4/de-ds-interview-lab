import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-partition',
  summary:
    'Partition là một phần của tập dữ liệu, cũng là đơn vị xử lý song song của Spark: mỗi Partition được một Task xử lý. Số và kích thước Partition ảnh hưởng trực tiếp tới hiệu năng.',
  tags: ['Partition', 'Hiệu năng', 'Song song'],
  related: ['spark-task', 'spark-shuffle', 'spark-repartition-coalesce', 'spark-data-skew', 'spark-small-files', 'db-partitioning'],
  sections: {
    definition: `**Partition (Phân vùng)** là một phần dữ liệu của DataFrame hoặc RDD. Spark xử lý song song ở mức Partition: **mỗi [[spark-task]] làm việc trên đúng một Partition**, và Partition không được chia nhỏ hơn trong cùng một Stage.

Cần phân biệt hai khái niệm dễ nhầm: **Partition trong bộ nhớ** khi đang xử lý, và **Partition trên đĩa** do \`partitionBy\` tạo ra thành các thư mục như \`date=2026-01-01\`.`,

    origin: `Để xử lý dữ liệu lớn hơn một máy, phải chia dữ liệu ra. MapReduce đã có InputSplit làm việc này với tệp đầu vào. Spark khái quát thành Partition, áp dụng cho mọi bước, không chỉ lúc đọc: dữ liệu luôn nằm trong các Partition, và shuffle có thể chia lại chúng.

Nhờ vậy chỉ cần một đơn vị duy nhất để nói về song song, chịu lỗi và vị trí dữ liệu.`,

    whyUse: `Số Partition quyết định trực tiếp hiệu năng, và sai ở cả hai phía đều có hại:

- **Quá ít, Partition quá lớn:** Task nặng, tràn đĩa, có thể OOM, không tận dụng hết số core.
- **Quá nhiều, Partition quá nhỏ:** Driver tốn công lập lịch, thời gian phối hợp lớn hơn thời gian xử lý, khi ghi ra sinh nhiều [[spark-small-files|tệp nhỏ]].

Mức khởi đầu phổ biến là **khoảng 100 đến 200 MB mỗi Partition**, và số Partition gấp 2 đến 4 lần tổng số core.`,

    mechanism: `Số Partition được xác định khác nhau ở từng giai đoạn:

**1. Khi đọc (Input Partition).** Với tệp, Spark chia và gộp theo \`spark.sql.files.maxPartitionBytes\` = 128 MB. Tệp nhỏ được gộp có tính đến \`openCostInBytes\` = 4 MB. Tệp nén không chia được, như gzip, sẽ nằm trọn trong một Partition, dù nặng cả 50 GB.

**2. Sau shuffle (Shuffle Partition).** Mặc định là \`spark.sql.shuffle.partitions\` = 200, với mọi kích thước dữ liệu. AQE có thể gộp lại dựa trên kích thước thật. Với RDD, số này lấy từ \`spark.default.parallelism\` hoặc RDD cha.

**3. Khi ghi (Output).** Số tệp thường bằng số Partition trong bộ nhớ. Khi dùng \`partitionBy\`, mỗi Task có thể ghi ra nhiều thư mục, nên số tệp có thể nhân lên.

Dữ liệu trong một Partition được phân bố theo key dựa vào **Partitioner**, mặc định là băm với \`groupBy\` và \`join\`, là khoảng giá trị với \`orderBy\`.`,

    diagram: {
      mermaid: `flowchart TD
  A["Tệp đầu vào 40 GB"] -->|"chia theo 128 MB"| B["320 Partition, 320 Task"]
  B -->|"groupBy gây shuffle"| C["200 Partition, AQE có thể gộp bớt"]
  C -->|"coalesce trước khi ghi"| D["40 Partition, 40 tệp đầu ra"]`,
      caption: 'Số Partition có thể thay đổi qua từng giai đoạn của cùng một job.',
    },

    example: `Một job đọc tệp CSV gzip 80 GB chạy rất chậm. Spark UI cho thấy Stage đầu chỉ có một Task, chạy suốt 2 giờ, trong khi 50 Executor gần như ngồi không. Nguyên nhân là gzip không chia được, nên toàn bộ tệp nằm trong một Partition.

Có thể \`repartition\` ngay sau khi đọc để các bước sau chạy song song, nhưng bước đọc vẫn chỉ có một Task. Cách làm tốt hơn là chuyển dữ liệu nguồn sang Parquet, hoặc yêu cầu bên cung cấp chia thành nhiều tệp nhỏ. Sau khi đổi sang Parquet, Stage đầu có 640 Task và cả job chỉ còn 15 phút.`,

    prosCons: {
      pros: [
        '**Cho phép xử lý song song:** nhiều Partition chạy đồng thời trên nhiều core.',
        '**Giới hạn phạm vi lỗi:** mất dữ liệu chỉ cần tính lại vài Partition.',
        '**Tận dụng Data Locality:** Task chạy gần nơi có dữ liệu.',
      ],
      cons: [
        '**Khó chọn đúng số lượng** vì dữ liệu thay đổi theo thời gian.',
        '**Giá trị mặc định 200 không hợp với mọi job,** từ rất nhỏ đến rất lớn.',
        '**Có thể lệch:** một Partition lớn hơn nhiều so với phần còn lại.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng AQE làm mặc định để Spark tự gộp Partition sau shuffle.',
        'Đặt `spark.sql.shuffle.partitions` cao hơn cho job rất lớn, vì AQE chỉ gộp bớt được chứ không tự chia ra thêm.',
        'Dùng `partitionBy` trên đĩa với cột có ít giá trị và hay được lọc, như ngày.',
      ],
      avoid: [
        'Không `partitionBy` theo cột có quá nhiều giá trị như `user_id`, vì sinh ra vô số thư mục và tệp nhỏ.',
        'Không tăng số Partition để chữa lệch dữ liệu: key lớn vẫn nằm trọn trong một Partition.',
      ],
    },

    comparison: {
      intro: 'Partition trong bộ nhớ và Partition trên đĩa là hai khái niệm khác nhau:',
      headers: ['Tiêu chí', 'Partition trong bộ nhớ', 'Partition trên đĩa (`partitionBy`)'],
      rows: [
        ['Tồn tại khi nào', 'Trong lúc xử lý', 'Cố định sau khi ghi'],
        ['Hình thức', 'Một phần dữ liệu của Task', 'Thư mục theo giá trị cột'],
        ['Mục đích', 'Xử lý song song', 'Bỏ qua dữ liệu khi đọc (Partition Pruning)'],
        ['Cách thay đổi', '`repartition`, `coalesce`', 'Ghi lại dữ liệu'],
      ],
    },

    misconceptions: [
      {
        myth: 'Càng nhiều Partition thì job càng nhanh.',
        truth: 'Quá nhiều Partition làm tăng chi phí lập lịch và tạo tệp nhỏ. Khi số Partition vượt xa số core, tốc độ xử lý không tăng thêm.',
      },
      {
        myth: 'Số Partition sau khi đọc luôn bằng số tệp.',
        truth: 'Spark có thể chia một tệp lớn thành nhiều Partition và gộp nhiều tệp nhỏ thành một, trừ các tệp nén không chia được.',
      },
      {
        myth: 'Giá trị mặc định 200 là con số đã được tối ưu.',
        truth: 'Đó chỉ là giá trị mặc định chung, không dựa vào dữ liệu của bạn. Job 2 GB và job 20 TB đều nhận giá trị này nếu không có AQE.',
      },
    ],
  },
})
