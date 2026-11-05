import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-spark-overview-01',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-overview', 'hadoop-mapreduce'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Spark giải quyết vấn đề gì mà Hadoop MapReduce không làm tốt? Spark có thay thế hoàn toàn Hadoop không?',
    referenceAnswer: `MapReduce có ba điểm yếu. Thứ nhất, kết quả trung gian giữa các job phải ghi ra HDFS, nên thuật toán lặp và truy vấn tương tác rất chậm. Thứ hai, mọi logic phải ép vào hai pha Map và Reduce, code dài và không thể tối ưu xuyên job. Thứ ba, mỗi nhu cầu lại cần một công cụ riêng như Hive hay Storm.

Spark xử lý bằng cách biểu diễn công việc thành **DAG** nhiều Stage, giữ dữ liệu trong bộ nhớ khi có thể, và dùng **Catalyst** để tối ưu toàn bộ kế hoạch. Các thư viện SQL, streaming và ML dùng chung một engine, giúp giảm số công cụ phải vận hành.

Spark **không thay thế toàn bộ Hadoop**. Hadoop gồm HDFS để lưu trữ, YARN để cấp tài nguyên và MapReduce để xử lý. Spark chỉ thay phần xử lý, vẫn có thể chạy trên YARN và đọc từ HDFS. Cũng nên nói rõ Spark không phải lúc nào cũng nhanh hơn 100 lần: con số đó đúng với bài toán lặp, còn job một lượt thì khoảng cách nhỏ hơn nhiều.`,
    keyPoints: [
      { text: 'MapReduce ghi đĩa giữa các job nên chậm với công việc lặp', keywords: ['ghi đĩa', 'lặp', 'trung gian', 'hdfs'], weight: 2 },
      { text: 'Spark dùng DAG nhiều Stage thay vì hai pha', keywords: ['dag', 'stage'] },
      { text: 'Có bộ tối ưu Catalyst', keywords: ['catalyst', 'tối ưu'] },
      { text: 'Spark chỉ thay phần xử lý, vẫn dùng HDFS hoặc YARN', keywords: ['không thay thế', 'hdfs', 'yarn', 'lưu trữ'], weight: 2 },
    ],
    followUps: ['Khi nào bạn không chọn Spark?', 'Spark có ghi đĩa không, trong những trường hợp nào?'],
    commonMistakes: ['Nói Spark hoàn toàn không dùng đĩa.', 'Xem Spark như một hệ thống lưu trữ.'],
  },
  {
    id: 'iv-spark-overview-02',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-overview'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Khi nào bạn sẽ không dùng Spark, dù dữ liệu khá lớn? Bạn dựa vào tiêu chí gì để quyết định?',
    referenceAnswer: `Tôi xuất phát từ yêu cầu thay vì từ công cụ, với bốn tiêu chí chính.

**Kích thước thực sự cần xử lý.** Dữ liệu 1 TB nhưng truy vấn chỉ đọc 20 GB sau khi lọc partition thì một máy mạnh với DuckDB có thể đủ.

**Độ trễ.** Cần trả kết quả dưới một giây cho nhiều người dùng đồng thời thì nên dùng OLAP như ClickHouse hoặc BigQuery, vì khởi động job Spark đã tốn thời gian. Cần xử lý từng sự kiện ở mức mili giây thì Flink phù hợp hơn micro-batch.

**Kiểu xử lý.** Nếu công việc thuần SQL trên dữ liệu đã nằm trong Data Warehouse, chạy ngay trong kho theo kiểu ELT thường rẻ và đơn giản hơn so với kéo dữ liệu ra Spark.

**Năng lực vận hành.** Spark cần người hiểu shuffle, skew và bộ nhớ. Nếu nhóm nhỏ và tải không lớn, dịch vụ quản lý hoặc công cụ đơn giản hơn sẽ ít rủi ro hơn.

Spark hợp nhất với pipeline nhiều bước, Join lớn, dữ liệu vượt xa một máy, hoặc khi cần gộp batch và streaming.`,
    keyPoints: [
      { text: 'Xét kích thước thật sau khi lọc, không chỉ tổng dung lượng', keywords: ['lọc', 'kích thước', 'một máy', 'duckdb', 'polars'] },
      { text: 'Yêu cầu độ trễ thấp cần công cụ khác', keywords: ['độ trễ', 'mili giây', 'flink', 'olap', 'clickhouse'], weight: 2 },
      { text: 'Công việc thuần SQL có thể chạy trong Data Warehouse', keywords: ['warehouse', 'elt', 'bigquery', 'snowflake'] },
      { text: 'Cân nhắc chi phí vận hành và năng lực của nhóm', keywords: ['vận hành', 'chi phí', 'nhóm'] },
    ],
    followUps: ['So sánh Spark với Flink khi xử lý luồng?', 'Làm sao ước lượng chi phí chạy một job Spark?'],
    commonMistakes: ['Chỉ dựa vào dung lượng dữ liệu để quyết định.', 'Không nêu được công cụ thay thế cụ thể.'],
  },
  {
    id: 'iv-spark-overview-03',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-overview', 'spark-architecture'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Hãy mô tả điều gì xảy ra từ lúc bạn gọi spark-submit đến khi job kết thúc.',
    referenceAnswer: `Đầu tiên, \`spark-submit\` khởi chạy **Driver**, vị trí tùy deploy mode. Driver tạo SparkSession rồi xin **Cluster Manager** cấp Executor. Cluster Manager khởi động các **Executor** trên máy worker và chúng đăng ký với Driver.

Code chạy trên Driver. Các Transformation chỉ dựng Logical Plan. Khi gặp **Action**, Spark tạo một job: Catalyst tối ưu kế hoạch, chọn Physical Plan, DAGScheduler tạo DAG và cắt thành **Stage** tại ranh giới shuffle. TaskScheduler gửi **Task** tới Executor, ưu tiên nơi có sẵn dữ liệu.

Executor đọc dữ liệu, xử lý theo từng Partition, ghi file shuffle xuống đĩa nếu cần. Stage sau đọc shuffle từ các Executor khác. Task lỗi sẽ được chạy lại, tối đa theo \`spark.task.maxFailures\`. Với AQE, sau mỗi Stage Spark có thể điều chỉnh kế hoạch theo số liệu thực tế.

Cuối cùng, kết quả được ghi ra đích hoặc trả về Driver. Khi ứng dụng kết thúc, Executor được giải phóng.`,
    keyPoints: [
      { text: 'Driver xin Executor từ Cluster Manager', keywords: ['cluster manager', 'xin', 'cấp'] },
      { text: 'Transformation dựng kế hoạch, Action tạo job', keywords: ['action', 'job', 'logical plan', 'kế hoạch'], weight: 2 },
      { text: 'Catalyst tối ưu và DAGScheduler chia Stage tại shuffle', keywords: ['catalyst', 'dagscheduler', 'stage', 'dag'], weight: 2 },
      { text: 'Task chạy trên Executor, có chạy lại khi lỗi', keywords: ['task', 'chạy lại', 'retry', 'executor'] },
    ],
    followUps: ['AQE thay đổi quy trình này ở điểm nào?', 'Một Action có thể tạo nhiều job không?'],
    commonMistakes: ['Nhầm vai trò của Cluster Manager với Driver.', 'Bỏ qua bước tối ưu của Catalyst.'],
  },
  {
    id: 'iv-spark-arch-01',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-architecture', 'spark-driver', 'spark-executor'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Driver, Executor và Cluster Manager khác nhau thế nào? Chuyện gì xảy ra khi mỗi thành phần gặp lỗi?',
    referenceAnswer: `**Driver** chạy chương trình, giữ SparkSession, lập kế hoạch và phân Task. **Executor** là tiến trình trên máy worker, chạy Task và giữ cache cùng file shuffle. **Cluster Manager** như YARN hoặc Kubernetes chỉ cấp tài nguyên để chạy Driver và Executor.

Khi lỗi, hậu quả khác nhau rất rõ:

- **Mất Executor:** Driver chạy lại các Task của nó ở nơi khác. Cache trên đó bị mất và được tính lại theo lineage. File shuffle bị mất có thể khiến Task của Stage trước phải chạy lại. Ứng dụng vẫn tiếp tục.
- **Mất Driver:** ứng dụng dừng vì mất kế hoạch và trạng thái. Có thể cấu hình tự khởi động lại Driver, nhưng job chạy lại từ đầu, hoặc từ checkpoint nếu là streaming.
- **Cluster Manager gặp sự cố:** các Executor đang chạy thường vẫn làm việc, nhưng không xin thêm được tài nguyên. Mức độ ảnh hưởng tùy loại cụm và cấu hình HA.`,
    keyPoints: [
      { text: 'Phân biệt đúng vai trò cả ba thành phần', keywords: ['lập kế hoạch', 'cấp tài nguyên', 'chạy task'], weight: 2 },
      { text: 'Mất Executor thì Task được chạy lại', keywords: ['chạy lại', 'retry', 'lineage'] },
      { text: 'Mất Driver thì ứng dụng dừng', keywords: ['ứng dụng dừng', 'mất driver', 'driver chết', 'điểm lỗi duy nhất'], weight: 2 },
    ],
    followUps: ['Dữ liệu cache có được sao chép không?', 'Làm thế nào để job streaming sống sót khi Driver chết?'],
    commonMistakes: ['Cho rằng Cluster Manager lập lịch Task.', 'Cho rằng mất Executor sẽ làm hỏng cả job.'],
  },
  {
    id: 'iv-spark-arch-02',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-architecture', 'spark-executor'],
    interviewTypes: ['bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn có 400 core và 1,6 TB RAM. Bạn chia Executor thế nào cho một job ETL lớn, và lý do là gì?',
    referenceAnswer: `Không có đáp án duy nhất, nên tôi lập luận từ các đánh đổi. Heap quá lớn làm GC dừng lâu, và nhiều core trong một Executor khiến các Task phải chia sẻ bộ nhớ Execution. Ngược lại, Executor quá nhỏ lại tốn nhiều overhead và tăng số bản sao Broadcast.

Tôi thường bắt đầu với khoảng **4 đến 5 core** mỗi Executor. Ví dụ 5 core thì có 80 Executor, chia đều RAM được khoảng 20 GB mỗi Executor. Sau khi trừ memory overhead và phần cho hệ thống, heap còn khoảng 16 đến 17 GB, cấu hình cân bằng cho job ETL thông thường.

Sau đó tôi kiểm chứng bằng số liệu trên Spark UI: nhiều spill hoặc GC time cao thì giảm core mỗi Executor hoặc tăng số Partition. Task lệch thì phải xử lý skew, không phải tăng bộ nhớ. CPU thấp mà Driver bận thì giảm số Task. Nếu job dùng UDF Python, tôi tăng thêm memory overhead vì tiến trình Python nằm ngoài heap.

Cuối cùng tôi nối cấu hình với số Partition: mỗi Partition khoảng 100 đến 200 MB, và Partition cần đủ nhỏ để một Task xử lý vừa phần bộ nhớ của nó.`,
    keyPoints: [
      { text: 'Lập luận về đánh đổi GC và chia sẻ bộ nhớ giữa Task', keywords: ['gc', 'chia sẻ', 'heap'], weight: 2 },
      { text: 'Đưa ra con số ban đầu hợp lý với số core mỗi Executor', keywords: ['4 core', '5 core', '4 đến 5', 'core mỗi executor'] },
      { text: 'Tính đến memory overhead', keywords: ['overhead'] },
      { text: 'Kiểm chứng bằng Spark UI và tinh chỉnh', keywords: ['spark ui', 'spill', 'tinh chỉnh'], weight: 2 },
    ],
    followUps: ['Dynamic Allocation có giúp ích ở đây không?', 'Cấu hình này đổi thế nào nếu job chủ yếu là UDF Python?'],
    commonMistakes: ['Đưa một công thức cứng mà không giải thích được.', 'Bỏ qua memory overhead.'],
  },
  {
    id: 'iv-spark-arch-03',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-architecture', 'spark-driver'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Client mode và cluster mode khác nhau thế nào? Bạn chọn mode nào cho job production, tại sao?',
    referenceAnswer: `Khác biệt nằm ở vị trí của Driver. Ở **client mode**, Driver chạy trên máy gọi \`spark-submit\`. Ở **cluster mode**, Driver được khởi động trên một node trong cụm.

Client mode thuận tiện khi phân tích tương tác vì thấy kết quả và log ngay, nhưng vòng đời ứng dụng phụ thuộc vào máy gọi: máy đó tắt thì job chết. Nếu máy gọi ở xa cụm, lưu lượng giữa Driver và Executor còn tăng độ trễ, nhất là khi có \`collect\` hoặc tạo Broadcast.

Với production tôi chọn **cluster mode**: Driver nằm gần Executor, không phụ thuộc vào máy lập lịch như Airflow, và tài nguyên cho Driver được cụm quản lý. Đổi lại, xem log phải qua công cụ của cụm, nên cần thiết lập sẵn việc thu thập log và Spark History Server.`,
    keyPoints: [
      { text: 'Khác biệt chính là vị trí của Driver', keywords: ['vị trí', 'driver chạy', 'driver nằm', 'trong cụm'], weight: 2 },
      { text: 'Client mode phụ thuộc vào máy gọi', keywords: ['máy gọi', 'phụ thuộc', 'máy đó tắt'] },
      { text: 'Chọn cluster mode cho production', keywords: ['cluster mode', 'production'], weight: 2 },
    ],
    followUps: ['Làm sao xem log khi chạy cluster mode?'],
    commonMistakes: ['Nghĩ rằng mode quyết định Executor chạy ở đâu.'],
  },
  {
    id: 'iv-spark-driver-01',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-driver'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Job của bạn báo OutOfMemoryError ở Driver. Bạn điều tra và xử lý thế nào?',
    referenceAnswer: `Tôi xác định trước Driver đang phải giữ gì, vì Driver thường không xử lý nhiều dữ liệu. Có ba nguyên nhân phổ biến.

**Thu dữ liệu về.** \`collect\`, \`toPandas\` hoặc \`take\` số lớn gom kết quả vào một máy. Cách sửa đúng là ghi ra kho lưu trữ bằng \`df.write\`, hoặc chỉ lấy mẫu nhỏ. \`spark.driver.maxResultSize\` có thể giúp job báo lỗi sớm và rõ ràng hơn.

**Broadcast lớn.** Bảng nhỏ được gom về Driver trước khi phát đi. Nếu thống kê sai, bảng tưởng nhỏ lại thành rất lớn. Tôi kiểm tra kế hoạch, hạ ngưỡng hoặc bỏ gợi ý broadcast.

**Metadata lớn.** Đọc hàng triệu tệp nhỏ, kế hoạch rất sâu do lặp \`withColumn\`, hay hàng trăm nghìn Task đều chiếm bộ nhớ Driver. Hướng xử lý là gộp tệp nhỏ và rút gọn kế hoạch.

Chỉ tăng \`spark.driver.memory\` sau khi đã hiểu nguyên nhân, nếu không vấn đề sẽ quay lại khi dữ liệu tăng.`,
    keyPoints: [
      { text: 'collect hoặc toPandas gom dữ liệu về Driver', keywords: ['collect', 'topandas', 'gom'], weight: 2 },
      { text: 'Broadcast lớn đi qua Driver', keywords: ['broadcast'], weight: 2 },
      { text: 'Metadata lớn do tệp nhỏ, kế hoạch sâu hoặc quá nhiều Task', keywords: ['metadata', 'tệp nhỏ', 'kế hoạch', 'quá nhiều task'] },
      { text: 'Sửa nguyên nhân trước khi tăng bộ nhớ', keywords: ['nguyên nhân', 'df write', 'ghi ra'] },
    ],
    followUps: ['toPandas khác collect ở điểm nào?', 'Vì sao Broadcast lại đi qua Driver?'],
    commonMistakes: ['Chỉ đề xuất tăng bộ nhớ Driver.'],
  },
  {
    id: 'iv-spark-executor-01',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-executor', 'spark-data-skew'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Executor bị OutOfMemory hoặc bị container giết. Bạn phân biệt các nguyên nhân và xử lý thế nào?',
    referenceAnswer: `Trước hết tôi xem thông báo lỗi để biết bộ nhớ nào bị thiếu.

Nếu là **JVM OutOfMemoryError**, heap đã đầy. Tôi xem Spark UI: nếu chỉ vài Task của một Stage gặp lỗi, đó là **skew**, cần xử lý dữ liệu lệch thay vì tăng bộ nhớ. Nếu nhiều Task đều gặp, có thể Partition quá lớn so với bộ nhớ mỗi Task, nên tăng số Partition hoặc giảm số core mỗi Executor. Cache quá nhiều cũng có thể gây áp lực, nên kiểm tra tab Storage.

Nếu **container bị YARN hoặc Kubernetes giết** do vượt giới hạn, trong khi heap chưa đầy, vấn đề nằm ở bộ nhớ ngoài heap: tiến trình Python của UDF, off-heap, hoặc buffer mạng. Khi đó tăng memory overhead và cân nhắc giảm dùng UDF Python.

Cuối cùng, tôi kiểm tra GC time và spill. GC cao thường do quá nhiều đối tượng, có thể giải quyết bằng DataFrame API thay vì RDD, hoặc Executor nhỏ hơn.`,
    keyPoints: [
      { text: 'Phân biệt heap OOM với container bị giết', keywords: ['heap', 'container', 'overhead'], weight: 2 },
      { text: 'Chỉ vài Task lỗi là dấu hiệu skew', keywords: ['skew', 'lệch', 'vài task'], weight: 2 },
      { text: 'Tăng số Partition hoặc giảm core mỗi Executor', keywords: ['tăng số partition', 'giảm core', 'partition'] },
      { text: 'UDF Python tốn bộ nhớ ngoài heap', keywords: ['python', 'udf', 'ngoài heap'] },
    ],
    followUps: ['spark.memory.fraction nên chỉnh khi nào?', 'Spill có phải lúc nào cũng xấu không?'],
    commonMistakes: ['Không phân biệt hai loại lỗi, và luôn tăng bộ nhớ.'],
  },
  {
    id: 'iv-spark-cm-01',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-cluster-manager', 'spark-shuffle'],
    interviewTypes: ['bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Dynamic Allocation hoạt động thế nào, và vì sao nó phụ thuộc vào file shuffle?',
    referenceAnswer: `Dynamic Allocation cho phép số Executor thay đổi theo tải. Khi có Task chờ quá một khoảng thời gian ngắn, Spark xin thêm Executor theo cấp số nhân: 1, 2, 4, 8. Khi Executor rảnh quá thời gian quy định, mặc định 60 giây, nó được trả lại cụm. Tính năng này mặc định tắt.

Vấn đề là Executor giữ **file shuffle** do Task của nó tạo ra. Nếu thu hồi Executor, các file đó mất đi và Stage sau không đọc được, buộc Spark phải chạy lại Stage trước. Vì vậy cần một trong các cơ chế: **External Shuffle Service** chạy riêng trên mỗi node và phục vụ file thay Executor, **Shuffle Tracking** giữ lại Executor còn dữ liệu shuffle cần dùng, hoặc **Decommission** chuyển dữ liệu đi trước khi thu hồi.

Trên Kubernetes chưa có External Shuffle Service nên thường dùng hai cách sau. Executor giữ cache mặc định cũng không bị thu hồi. Đánh đổi của Dynamic Allocation là độ trễ khi tăng và khả năng tranh chấp tài nguyên, nên với job cần thời gian ổn định, cấp cố định có thể an toàn hơn.`,
    keyPoints: [
      { text: 'Số Executor tăng khi có Task chờ và giảm khi rảnh', keywords: ['task chờ', 'rảnh', 'tăng', 'giảm', 'idle'] },
      { text: 'Thu hồi Executor làm mất file shuffle', keywords: ['mất', 'file shuffle', 'thu hồi'], weight: 2 },
      { text: 'Nêu External Shuffle Service hoặc Shuffle Tracking', keywords: ['external shuffle', 'shuffle tracking', 'decommission'], weight: 2 },
      { text: 'Biết Kubernetes chưa có External Shuffle Service', keywords: ['kubernetes', 'k8s'] },
    ],
    followUps: ['Dữ liệu cache ảnh hưởng tới Dynamic Allocation thế nào?'],
    commonMistakes: ['Không biết vì sao phải giữ file shuffle.'],
  },
])
