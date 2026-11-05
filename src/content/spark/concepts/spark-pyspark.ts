import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-pyspark',
  summary:
    'PySpark là API Python của Spark. Hàm tích hợp chạy trên JVM nên gần như không chậm hơn Scala, còn UDF Python phải chuyển dữ liệu sang tiến trình Python nên tốn kém.',
  tags: ['API', 'Python', 'UDF'],
  related: ['spark-dataframe', 'spark-catalyst', 'spark-executor', 'spark-driver', 'spark-performance'],
  sections: {
    definition: `**PySpark** là API Python của Apache Spark. Bạn viết Python, nhưng engine thực thi vẫn chạy trên JVM. Python chỉ đóng vai trò **giao diện để mô tả kế hoạch**, trừ khi bạn dùng UDF.`,

    origin: `Spark được viết bằng Scala, trong khi cộng đồng phân tích dữ liệu chủ yếu dùng Python. PySpark ra đời để đưa sức mạnh của Spark đến nhóm này, mà không cần viết lại engine bằng Python. Cách làm là để Python gọi sang JVM thay vì tự xử lý dữ liệu.`,

    whyUse: `Đa số người làm dữ liệu quen Python, và hệ sinh thái Python rất mạnh. Với DataFrame API và hàm tích hợp, PySpark cho hiệu năng gần với Scala, nên chọn Python không làm mất đi lợi ích của Spark, miễn là biết tránh các điểm tốn kém.`,

    mechanism: `Có hai đường đi rất khác nhau:

- **Hàm tích hợp.** \`df.filter(col("a") > 1)\` chỉ dựng kế hoạch qua **Py4J**, cầu nối giữa Python và JVM. Dữ liệu được xử lý hoàn toàn trên JVM, không đi qua Python.
- **UDF Python.** Mỗi Executor phải chạy thêm tiến trình Python. Dữ liệu được chuyển từ JVM sang Python, xử lý rồi chuyển về. Catalyst không nhìn được bên trong hàm này.

**Pandas UDF** dùng **Apache Arrow** để chuyển dữ liệu theo từng lô dạng cột, giảm đáng kể chi phí chuyển đổi so với UDF từng dòng.

Đoạn minh họa rất ngắn, hai dòng cho cùng kết quả nhưng chi phí khác nhau:

\`\`\`python
df.withColumn("name", upper(col("name")))        # chạy trên JVM
df.withColumn("name", udf(str.upper)(col("name"))) # qua tiến trình Python
\`\`\``,

    example: `Một job làm sạch 2 TB dùng UDF Python để chuẩn hóa số điện thoại bằng cách cắt chuỗi đơn giản, chạy mất 4 giờ. Spark UI cho thấy CPU chủ yếu ở tiến trình Python. Thay bằng các hàm tích hợp như \`regexp_replace\` và \`substring\`, job giảm xuống còn chưa tới 1 giờ, không phải đổi cấu hình cụm. Phần logic thật sự cần thư viện Python thì chuyển sang Pandas UDF.`,

    prosCons: {
      pros: [
        'Dễ tiếp cận với cộng đồng Python.',
        'Hàm tích hợp có hiệu năng gần với Scala.',
        'Tận dụng được thư viện Python qua UDF và Pandas UDF.',
      ],
      cons: [
        'UDF Python chậm và cần thêm bộ nhớ ngoài heap.',
        'Không có Dataset API, nên không kiểm tra kiểu khi biên dịch.',
        'Lỗi từ JVM trả về qua Py4J có thể khó đọc.',
      ],
    },

    whenToUse: {
      use: [
        'Nhóm chủ yếu dùng Python và công việc xử lý bằng hàm tích hợp.',
        'Cần gọi thư viện Python: khi đó ưu tiên Pandas UDF hơn UDF từng dòng.',
      ],
      avoid: [
        'Không viết UDF cho những việc đã có hàm tích hợp.',
        'Không dùng `collect` hoặc `toPandas` trên dữ liệu lớn.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Hàm tích hợp', 'Pandas UDF', 'UDF Python thường'],
      rows: [
        ['Nơi chạy', 'JVM', 'Tiến trình Python', 'Tiến trình Python'],
        ['Cách chuyển dữ liệu', 'Không cần chuyển', 'Theo lô dạng cột qua Arrow', 'Từng dòng, phải tuần tự hóa'],
        ['Hiệu năng', 'Cao nhất', 'Trung bình', 'Thấp nhất'],
        ['Catalyst tối ưu bên trong', 'Có', 'Không', 'Không'],
      ],
    },

    misconceptions: [
      {
        myth: 'PySpark luôn chậm hơn Scala Spark rất nhiều.',
        truth: 'Khi chỉ dùng DataFrame và hàm tích hợp, cả hai chạy cùng một kế hoạch trên JVM nên gần như bằng nhau. Khác biệt chỉ rõ khi có UDF.',
      },
      {
        myth: 'Code Python trong PySpark luôn chạy trên các Executor.',
        truth: 'Code thường chạy trên Driver. Chỉ UDF và hàm truyền vào phép biến đổi RDD mới chạy trên tiến trình Python tại Executor.',
      },
    ],
  },
})
