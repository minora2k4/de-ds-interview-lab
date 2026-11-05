import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-lazy-evaluation',
  summary:
    'Spark không chạy Transformation ngay khi gọi mà chỉ ghi lại kế hoạch. Chỉ khi gặp Action, Spark mới tối ưu toàn bộ kế hoạch rồi thực thi trên cụm.',
  tags: ['Mô hình thực thi', 'Tối ưu', 'First Principles'],
  related: [
    'spark-transformation',
    'spark-action',
    'spark-dag',
    'spark-catalyst',
    'spark-cache-persist',
    'spark-rdd',
  ],
  sections: {
    definition: `**Lazy Evaluation (Đánh giá trì hoãn)** là cách Spark trì hoãn việc tính toán: khi bạn gọi một [[spark-transformation]] như \`filter\` hay \`select\`, Spark **không đụng vào dữ liệu** mà chỉ ghi thêm một bước vào kế hoạch. Việc thực thi thật chỉ bắt đầu khi gặp một [[spark-action]] như \`count\`, \`collect\` hay \`write\`.

Có thể hình dung bạn đưa cho đầu bếp cả thực đơn thay vì gọi từng món rồi chờ món đó xong mới gọi tiếp. Thấy toàn bộ thực đơn, đầu bếp sắp xếp được thứ tự nấu hợp lý nhất.`,

    origin: `Lazy Evaluation ra đời để khắc phục hai điểm yếu của **Hadoop MapReduce**:

- **Không có cái nhìn toàn cục.** Mỗi job MapReduce chạy độc lập. Một pipeline nhiều bước phải nối nhiều job, và hệ thống không thể gộp hay tối ưu xuyên qua các job đó.
- **Ghi đĩa quá nhiều.** Kết quả trung gian giữa các job phải ghi ra HDFS, kể cả khi bước sau chỉ dùng lại một phần nhỏ.

Nhóm tạo ra Spark mượn ý tưởng tính toán trì hoãn từ lập trình hàm: mô tả **cần tính gì** trước, rồi hệ thống tự quyết định **tính như thế nào**. Cách này còn giải quyết luôn bài toán chịu lỗi: chuỗi biến đổi đã ghi lại chính là lineage của [[spark-rdd]], nên khi mất một phân vùng, Spark chỉ cần tính lại phần đó.`,

    whyUse: `Spark xử lý dữ liệu lớn hơn nhiều so với bộ nhớ của một máy, nên một phép tính thừa có thể tốn hàng giờ và rất nhiều tiền cụm. Trì hoãn tính toán mang lại ba lợi ích cụ thể:

1. **Tối ưu toàn cục.** Trước khi chạy, [[spark-catalyst]] thấy cả pipeline nên có thể đẩy bộ lọc xuống sát nguồn dữ liệu (Predicate Pushdown) và chỉ đọc các cột cần dùng (Column Pruning).
2. **Không làm việc thừa.** Với \`df.filter(...).limit(10).show()\`, Spark chỉ cần quét đủ dữ liệu để lấy 10 dòng thay vì xử lý toàn bộ tập dữ liệu rồi mới cắt.
3. **Gộp các bước liên tiếp.** Nhiều [[spark-narrow-transformation]] được gộp vào cùng một [[spark-stage]], mỗi bản ghi đi qua cả chuỗi phép tính mà không phải dừng lại giữa chừng để ghi kết quả.`,

    mechanism: `Quá trình diễn ra theo các bước sau:

1. **Ghi kế hoạch.** Mỗi Transformation tạo ra một đối tượng DataFrame mới bao lấy một **Logical Plan** (kế hoạch logic). Lúc này cụm chưa chạy task nào. DataFrame API có kiểm tra ngay tên cột và kiểu dữ liệu (Analysis), nên sai tên cột sẽ báo lỗi sớm, nhưng dữ liệu vẫn chưa được đọc.
2. **Action kích hoạt.** Khi gọi Action, kế hoạch được gửi đi xử lý. Spark tạo một job cho Action đó.
3. **Tối ưu.** [[spark-catalyst]] viết lại Logical Plan bằng các luật tối ưu rồi chọn **Physical Plan** (kế hoạch vật lý), ví dụ chọn [[spark-broadcast-join]] hay [[spark-sort-merge-join]].
4. **Chia việc.** DAGScheduler tạo [[spark-dag]] và cắt thành các Stage tại ranh giới [[spark-shuffle]].
5. **Thực thi.** Mỗi Stage sinh ra nhiều [[spark-task]] gửi tới [[spark-executor]].

Điểm dễ quên: **kết quả không tự được giữ lại**. Gọi hai Action trên cùng một DataFrame nghĩa là tính lại từ nguồn hai lần, trừ khi dùng [[spark-cache-persist]].`,

    diagram: {
      mermaid: `flowchart TD
  A["read, filter, select, groupBy"] -->|"Transformation: chỉ ghi kế hoạch"| B["Logical Plan"]
  B --> C{{"Action: count"}}
  C --> D["Catalyst tối ưu kế hoạch"]
  D --> E["DAGScheduler chia Stage"]
  E --> F["Task chạy trên Executor"]`,
      caption:
        'Các Transformation chỉ nối thêm vào kế hoạch. Chỉ Action mới đưa kế hoạch đi tối ưu và thực thi trên cụm.',
    },

    example: `Một công ty thương mại điện tử lưu log truy cập 10 TB dạng Parquet, phân vùng theo ngày. Bạn cần đếm số lượt xem sản phẩm của ngày hôm qua, code gồm các bước: đọc toàn bộ thư mục log, lọc theo ngày, lọc theo loại sự kiện, chọn cột \`user_id\`, rồi gọi \`count\`.

Nếu chạy ngay từng bước như pandas, Spark sẽ phải đọc đủ 10 TB ngay ở bước đầu. Nhờ trì hoãn, đến khi gặp \`count\`, Catalyst thấy cả chuỗi và làm ba việc:

- Dùng điều kiện ngày để **chỉ đọc đúng một thư mục phân vùng** (Partition Pruning), giảm từ 10 TB còn khoảng 30 GB.
- Đẩy điều kiện loại sự kiện xuống tầng đọc Parquet để bỏ qua các khối dữ liệu không khớp.
- Chỉ đọc các cột thực sự cần dùng thay vì toàn bộ cột.

Người viết code không phải tự sắp xếp các tối ưu này. Thời gian chạy có thể giảm từ hàng giờ xuống vài phút, dù logic nghiệp vụ không đổi.`,

    prosCons: {
      pros: [
        '**Tối ưu toàn pipeline** thay vì từng bước riêng lẻ, nhờ Catalyst thấy được toàn bộ kế hoạch.',
        '**Giảm dữ liệu phải đọc và truyền** qua Predicate Pushdown, Column Pruning, Partition Pruning.',
        '**Chịu lỗi rẻ hơn** vì lineage cho phép tính lại đúng phần dữ liệu bị mất, không cần sao chép mọi kết quả trung gian.',
      ],
      cons: [
        '**Lỗi xuất hiện muộn.** Lỗi do dữ liệu, ví dụ ép kiểu thất bại trong UDF, chỉ lộ ra khi Action chạy, có thể sau nhiều giờ.',
        '**Dễ tính lại ngoài ý muốn.** Gọi nhiều Action trên cùng DataFrame mà không cache sẽ lặp lại toàn bộ công việc.',
        '**Khó đo từng bước.** Không thể biết bước nào chậm nếu chỉ nhìn code, mà phải đọc `explain()` và Spark UI.',
      ],
    },

    whenToUse: {
      use: [
        'Đây là hành vi mặc định của Spark, không cần bật. Hãy tận dụng bằng cách viết pipeline liền mạch rồi để một Action ở cuối.',
        'Pipeline dài trên dữ liệu lớn, đọc từ định dạng hỗ trợ pushdown như Parquet hoặc ORC.',
        'Cần xem kế hoạch trước khi tốn tài nguyên: gọi `explain()` không chạy job nhưng cho thấy Spark định làm gì.',
      ],
      avoid: [
        'Dữ liệu nhỏ, phân tích tương tác trên một máy: pandas chạy ngay từng bước sẽ dễ gỡ lỗi hơn.',
        'Một kết quả trung gian được dùng lại nhiều lần: khi đó nên chủ động dùng [[spark-cache-persist]] thay vì để Spark tính lại.',
        'Kế hoạch quá dài do vòng lặp: nên cắt lineage bằng checkpoint, nếu không Catalyst sẽ tốn nhiều thời gian chỉ để tối ưu.',
      ],
    },

    comparison: {
      intro: 'So sánh ba cách thực thi thường được nhắc đến khi phỏng vấn:',
      headers: ['Tiêu chí', 'Spark (Lazy)', 'pandas (Eager)', 'Hadoop MapReduce'],
      rows: [
        ['Khi nào chạy', 'Khi gặp Action', 'Ngay ở từng dòng lệnh', 'Khi submit từng job'],
        ['Phạm vi tối ưu', 'Toàn bộ kế hoạch của job', 'Gần như không có tối ưu xuyên bước', 'Trong phạm vi một job'],
        ['Kết quả trung gian', 'Không giữ lại, trừ khi cache', 'Giữ trong RAM', 'Ghi ra HDFS giữa các job'],
        ['Phát hiện lỗi dữ liệu', 'Muộn, khi Action chạy', 'Ngay lập tức', 'Khi job chạy'],
        ['Phù hợp với', 'Dữ liệu lớn, nhiều bước', 'Dữ liệu vừa bộ nhớ một máy', 'Hệ thống Hadoop cũ'],
      ],
    },

    misconceptions: [
      {
        myth: 'Transformation không bao giờ chạy job nào.',
        truth:
          'Phần lớn là đúng, nhưng có ngoại lệ. Đọc CSV với `inferSchema=true`, gọi `sortByKey` trên RDD để lấy mẫu phân vùng, hay `pivot` không khai báo trước giá trị đều chạy job ngay.',
      },
      {
        myth: 'Lazy Evaluation nghĩa là Spark tự lưu kết quả để dùng lại.',
        truth:
          'Ngược lại, mặc định Spark không lưu gì. Mỗi Action tính lại từ nguồn. Muốn dùng lại phải gọi [[spark-cache-persist]], và bản thân `cache()` cũng trì hoãn đến khi có Action đầu tiên.',
      },
      {
        myth: 'Lazy Evaluation làm từng phép tính chạy nhanh hơn.',
        truth:
          'Nó không làm một phép tính nhanh lên. Lợi ích đến từ việc bỏ bớt dữ liệu và công việc thừa nhờ thấy toàn bộ kế hoạch.',
      },
      {
        myth: 'Có Catalyst rồi thì viết thứ tự thế nào cũng được.',
        truth:
          'Catalyst đẩy được đa số bộ lọc, nhưng không thể đẩy qua nhiều UDF hoặc hàm không tất định. Viết logic gọn vẫn quan trọng, và nên kiểm tra bằng `explain()`.',
      },
    ],
  },
})
