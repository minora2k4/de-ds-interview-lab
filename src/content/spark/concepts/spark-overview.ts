import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-overview',
  summary:
    'Apache Spark là engine xử lý dữ liệu phân tán đa dụng. Một Driver lập kế hoạch và nhiều Executor thực thi song song, dùng chung một engine cho SQL, batch, streaming và ML.',
  tags: ['Tổng quan', 'Xử lý phân tán'],
  related: [
    'spark-architecture',
    'spark-lazy-evaluation',
    'spark-dag',
    'spark-dataframe',
    'hadoop-mapreduce',
    'spark-performance',
  ],
  sections: {
    definition: `**Apache Spark** là engine xử lý dữ liệu phân tán, chia một công việc lớn thành nhiều phần nhỏ để chạy song song trên một cụm máy. Spark không phải hệ thống lưu trữ: dữ liệu vẫn nằm ở HDFS, S3 hay Kafka, còn Spark đọc về để tính toán.

Điểm làm nên tên tuổi của Spark là **một engine dùng chung cho nhiều loại công việc**: truy vấn SQL, xử lý theo lô, xử lý luồng với Structured Streaming và học máy với MLlib.`,

    origin: `Spark ra đời năm 2009 tại AMPLab, Đại học California, Berkeley, để khắc phục những hạn chế của **[[hadoop-mapreduce|Hadoop MapReduce]]**:

- **Chậm với công việc nhiều bước.** MapReduce ghi kết quả trung gian ra đĩa giữa các job, nên thuật toán lặp và truy vấn tương tác chạy rất chậm.
- **Mô hình quá cứng.** Mọi thứ phải diễn đạt bằng Map và Reduce, code dài và khó tối ưu xuyên suốt nhiều job.
- **Mỗi nhu cầu một công cụ.** Doanh nghiệp phải ghép Hive cho SQL, Storm cho streaming, Mahout cho ML, mỗi công cụ một cách vận hành.

Spark giải quyết bằng cách giữ dữ liệu trong bộ nhớ khi có thể, biểu diễn công việc thành [[spark-dag]] thay vì chỉ hai pha, và đặt nhiều thư viện lên cùng một engine.`,

    whyUse: `Spark được chọn vì ba lý do thực tế:

1. **Quy mô.** Dữ liệu hàng TB không vừa một máy. Spark chia thành các [[spark-partition|Partition]] và xử lý song song, thêm máy là thêm năng lực.
2. **Tối ưu tự động.** Bạn mô tả cần gì bằng SQL hoặc [[spark-dataframe]], [[spark-catalyst]] tự chọn cách chạy hiệu quả, kể cả chiến lược Join.
3. **Chịu lỗi.** Máy hỏng là chuyện thường ở quy mô lớn. Nhờ lineage, Spark chỉ tính lại phần bị mất, không phải chạy lại cả job.`,

    mechanism: `Một ứng dụng Spark chạy theo trình tự sau, chi tiết ở trang [[spark-architecture]]:

1. **Driver** chạy chương trình của bạn và ghi lại các phép biến đổi thành kế hoạch, nhờ [[spark-lazy-evaluation]].
2. Khi gặp [[spark-action]], Driver tối ưu kế hoạch bằng Catalyst và tạo [[spark-dag]].
3. DAG được cắt thành các [[spark-stage]] tại ranh giới [[spark-shuffle]]. Mỗi Stage gồm nhiều [[spark-task]], mỗi Task xử lý một Partition.
4. [[spark-cluster-manager]] cấp tài nguyên để chạy các **Executor**. Driver gửi Task tới Executor.
5. Executor chạy Task, lưu kết quả shuffle và dữ liệu cache, rồi báo trạng thái về Driver.`,

    diagram: {
      mermaid: `flowchart TD
  L["Thư viện: Spark SQL, Structured Streaming, MLlib, GraphX"] --> C["Spark Core: lập lịch, bộ nhớ, chịu lỗi"]
  C --> M["Cluster Manager: Standalone, YARN, Kubernetes"]
  C --> S["Nguồn dữ liệu: HDFS, S3, Kafka, JDBC"]`,
      caption:
        'Các thư viện dùng chung một engine lõi. Spark không tự lưu dữ liệu và không tự sở hữu cụm máy mà dựa vào hệ thống bên ngoài.',
    },

    example: `Một sàn thương mại điện tử cần tính doanh thu theo danh mục mỗi đêm từ dữ liệu đơn hàng dạng Parquet trên S3. Đoạn PySpark rất ngắn dưới đây minh họa cách làm việc:

\`\`\`python
orders = spark.read.parquet("s3://shop/orders/")
result = (orders
    .filter(orders.status == "PAID")
    .groupBy("category")
    .sum("amount"))
result.write.parquet("s3://shop/report/")
\`\`\`

Ba dòng biến đổi đầu chưa chạy gì. Khi gặp \`write\`, Spark chỉ đọc các cột cần dùng, đẩy điều kiện \`status\` xuống tầng đọc Parquet, shuffle theo \`category\` rồi ghi kết quả. Cùng logic này có thể viết bằng SQL mà vẫn cho ra cùng kế hoạch.`,

    prosCons: {
      pros: [
        '**Nhanh với công việc nhiều bước** vì tránh ghi đĩa giữa các bước khi có thể, và có bộ tối ưu mạnh.',
        '**Một engine cho nhiều nhu cầu:** SQL, batch, streaming và ML dùng chung cách vận hành.',
        '**API cấp cao dễ viết** bằng SQL, Python, Scala, Java.',
        '**Hệ sinh thái rộng:** đọc được hầu hết nguồn dữ liệu phổ biến, chạy trên nhiều loại cụm.',
      ],
      cons: [
        '**Tốn bộ nhớ và cần tinh chỉnh.** Shuffle, skew và cấu hình Executor đòi hỏi kinh nghiệm.',
        '**Không dành cho độ trễ cực thấp.** Structured Streaming mặc định xử lý theo micro-batch.',
        '**Quá mức cần thiết với dữ liệu nhỏ.** Một máy với pandas hoặc DuckDB có thể nhanh và rẻ hơn.',
        '**Chi phí vận hành cụm** nếu không dùng dịch vụ quản lý sẵn.',
      ],
    },

    whenToUse: {
      use: [
        'Dữ liệu vượt quá khả năng của một máy, thường từ vài chục GB trở lên.',
        'Pipeline ETL theo lô nhiều bước, có Join và tổng hợp lớn.',
        'Cần gộp batch và streaming trên cùng một API.',
      ],
      avoid: [
        'Dữ liệu vừa bộ nhớ một máy: dùng pandas, Polars hoặc DuckDB sẽ đơn giản hơn.',
        'Truy vấn phục vụ người dùng cần phản hồi dưới một giây: nên dùng cơ sở dữ liệu OLAP chuyên dụng.',
        'Xử lý từng sự kiện với độ trễ mili giây: nên cân nhắc Apache Flink.',
      ],
    },

    comparison: {
      intro: 'Câu hỏi phỏng vấn kinh điển là Spark và Hadoop MapReduce khác nhau thế nào:',
      headers: ['Tiêu chí', 'Apache Spark', 'Hadoop MapReduce'],
      rows: [
        ['Mô hình thực thi', 'DAG nhiều Stage', 'Hai pha Map và Reduce'],
        ['Kết quả trung gian', 'Trong bộ nhớ khi có thể, shuffle ghi đĩa cục bộ', 'Luôn ghi đĩa, giữa các job ghi ra HDFS'],
        ['Tối ưu', 'Catalyst tối ưu toàn bộ kế hoạch', 'Gần như không tối ưu xuyên job'],
        ['Chịu lỗi', 'Tính lại theo lineage', 'Chạy lại task từ dữ liệu đã ghi đĩa'],
        ['API', 'SQL, DataFrame, Python, Scala', 'Chủ yếu Java, code dài'],
        ['Công việc lặp, tương tác', 'Phù hợp', 'Rất chậm'],
      ],
      note: 'Spark không thay thế toàn bộ Hadoop. Spark thường chạy trên YARN và đọc dữ liệu từ HDFS, nó chỉ thay thế phần xử lý MapReduce.',
    },

    misconceptions: [
      {
        myth: 'Spark xử lý mọi thứ trong RAM nên không dùng đĩa.',
        truth:
          'Spark ưu tiên bộ nhớ nhưng vẫn dùng đĩa nhiều: file shuffle luôn ghi xuống đĩa cục bộ, và dữ liệu sẽ tràn (spill) ra đĩa khi thiếu bộ nhớ.',
      },
      {
        myth: 'Spark luôn nhanh hơn MapReduce 100 lần.',
        truth:
          'Con số đó đến từ các bài toán lặp giữ được dữ liệu trong bộ nhớ. Với job một lượt, khoảng cách nhỏ hơn nhiều, và còn phụ thuộc vào cấu hình và dữ liệu.',
      },
      {
        myth: 'Có Spark thì không cần HDFS hay S3.',
        truth: 'Spark chỉ tính toán. Nó luôn cần một hệ thống bên ngoài để lưu dữ liệu đầu vào và đầu ra.',
      },
    ],
  },
})
