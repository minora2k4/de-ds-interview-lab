import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-spark-catalyst-01',
    topicId: 'spark',
    category: 'spark-engine',
    conceptIds: ['spark-catalyst', 'spark-lazy-evaluation'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Catalyst Optimizer hoạt động thế nào? Hãy kể các giai đoạn và ví dụ tối ưu cụ thể.',
    referenceAnswer: `Catalyst biến SQL hoặc DataFrame thành kế hoạch thực thi qua bốn giai đoạn.

**Analysis:** từ Logical Plan chưa phân giải, tra Catalog để xác định bảng, cột và kiểu. Sai tên cột sẽ báo lỗi tại đây.

**Logical Optimization:** áp dụng các luật cho đến khi không còn thay đổi, như Predicate Pushdown đẩy bộ lọc xuống gần nguồn, Column Pruning bỏ cột thừa, Constant Folding tính sẵn biểu thức hằng.

**Physical Planning:** sinh phương án thực thi và chọn phương án phù hợp, ví dụ Broadcast Hash Join hay Sort Merge Join dựa trên kích thước.

**Code Generation:** phối hợp với Tungsten để sinh mã Java cho cả Stage, tránh chi phí gọi hàm cho từng dòng.

Từ Spark 3.2, **AQE** bật mặc định, thêm việc tối ưu lại sau mỗi Stage dựa trên số liệu thật. Catalyst không nhìn được bên trong UDF, nên tôi dùng hàm tích hợp, và đọc \`explain("formatted")\` để kiểm tra \`PushedFilters\`.`,
    keyPoints: [
      { text: 'Nêu được các giai đoạn Analysis, Logical, Physical, Code Generation', keywords: ['analysis', 'logical', 'physical', 'code generation', 'sinh mã'], weight: 2 },
      { text: 'Ví dụ tối ưu cụ thể', keywords: ['predicate pushdown', 'column pruning', 'constant folding'], weight: 2 },
      { text: 'Có nhắc tới AQE', keywords: ['aqe', 'adaptive'] },
      { text: 'Biết hạn chế với UDF', keywords: ['udf', 'hộp đen'] },
    ],
    followUps: ['Làm sao biết bộ lọc đã được đẩy xuống?', 'AQE khác CBO thế nào?'],
    commonMistakes: ['Không phân biệt được tối ưu logic và tối ưu vật lý.'],
  },
  {
    id: 'iv-spark-catalyst-02',
    topicId: 'spark',
    category: 'spark-engine',
    conceptIds: ['spark-catalyst'],
    interviewTypes: ['bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'AQE giải quyết điều gì mà tối ưu trước khi chạy không làm được? Nó có những hạn chế nào?',
    referenceAnswer: `Tối ưu trước khi chạy phải **đoán** kích thước dữ liệu từ thống kê, mà thống kê có thể cũ hoặc không có, và ước lượng sau nhiều phép lọc và Join thường sai. Một quyết định sai, như chọn Sort Merge Join thay vì Broadcast, có thể tốn hàng giờ.

AQE dùng ranh giới shuffle làm điểm dừng: sau khi Stage chạy xong, Spark có **số liệu thật** nên có thể tối ưu lại phần còn lại. Ba tính năng chính: **gộp Partition nhỏ** sau shuffle; **đổi chiến lược Join** như từ Sort Merge sang Broadcast; **tách Partition lệch** trong Join.

Hạn chế: chỉ can thiệp được tại ranh giới shuffle, nên chi phí của phần đã chạy không lấy lại được. Khi đổi sang Broadcast, shuffle phía ghi đã xảy ra. AQE không xử lý skew trong tổng hợp, chỉ gộp chứ không chia Partition thông thường ra thêm, và kế hoạch cuối cùng có thể khác với \`explain\` ban đầu, nên phải xem trên Spark UI. Vì vậy thống kê tốt và thiết kế đúng ngay từ đầu vẫn quan trọng.`,
    keyPoints: [
      { text: 'Tối ưu tĩnh phải đoán kích thước, dễ sai', keywords: ['đoán', 'ước lượng', 'thống kê'], weight: 2 },
      { text: 'AQE dùng số liệu thật tại ranh giới shuffle', keywords: ['số liệu thật', 'ranh giới', 'sau mỗi stage', 'lúc chạy'], weight: 2 },
      { text: 'Nêu ba tính năng chính', keywords: ['gộp partition', 'đổi chiến lược', 'skew', 'coalesce'] },
      { text: 'Nêu được hạn chế', keywords: ['không lấy lại', 'hạn chế', 'không xử lý', 'chi phí đã'] },
    ],
    followUps: ['Vì sao AQE không xử lý được skew của phép tổng hợp?'],
    commonMistakes: ['Cho rằng có AQE thì không cần tinh chỉnh gì nữa.'],
  },
  {
    id: 'iv-spark-catalyst-03',
    topicId: 'spark',
    category: 'spark-engine',
    conceptIds: ['spark-catalyst', 'spark-dataframe'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Làm sao biết Predicate Pushdown có hoạt động không? Trường hợp nào nó không hoạt động?',
    referenceAnswer: `Tôi đọc kế hoạch bằng \`df.explain("formatted")\`. Trong nút đọc dữ liệu, dòng **PushedFilters** liệt kê các điều kiện đã đẩy xuống tầng đọc, và **PartitionFilters** liệt kê các điều kiện lọc theo cột phân vùng. Nếu các dòng này trống, trong khi code có lọc, thì Spark đang đọc rồi mới lọc. Cũng có thể đối chiếu lượng dữ liệu đọc trên Spark UI.

Pushdown không hoạt động khi: dùng **UDF**, vì Catalyst không hiểu được logic. **Ép kiểu hoặc gọi hàm trên cột**, ví dụ \`to_date(col) = ...\` hay \`substring(date, ...)\`, thay vì so sánh trực tiếp. **Định dạng không hỗ trợ**, như CSV không có thống kê theo cột. **Cột lồng nhau** tùy phiên bản và nguồn. Và sau khi **đã cache**, bộ lọc chạy trên dữ liệu đã cache.

Lưu ý thêm: đẩy xuống được không có nghĩa là bỏ qua được nhiều dữ liệu. Parquet bỏ qua nhóm dòng dựa trên min/max, nên nếu dữ liệu không được sắp xếp theo cột đó, hiệu quả sẽ thấp.`,
    keyPoints: [
      { text: 'Đọc PushedFilters trong explain', keywords: ['pushedfilters', 'explain'], weight: 2 },
      { text: 'UDF chặn pushdown', keywords: ['udf'], weight: 2 },
      { text: 'Ép kiểu hoặc gọi hàm trên cột chặn pushdown', keywords: ['ép kiểu', 'hàm trên cột', 'cast', 'to date'] },
      { text: 'Hiệu quả còn phụ thuộc vào min/max và sắp xếp', keywords: ['min max', 'sắp xếp', 'nhóm dòng'] },
    ],
    followUps: ['Khác biệt giữa PartitionFilters và PushedFilters?'],
    commonMistakes: ['Giả định pushdown luôn xảy ra khi dùng Parquet.'],
  },
  {
    id: 'iv-spark-tungsten-01',
    topicId: 'spark',
    category: 'spark-engine',
    conceptIds: ['spark-tungsten', 'spark-catalyst'],
    interviewTypes: ['bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Tungsten cải thiện hiệu năng bằng cách nào? Vì sao UDF Python lại làm mất đi phần lớn lợi ích đó?',
    referenceAnswer: `Tungsten nhắm vào CPU và bộ nhớ, vì đây đã trở thành nút nghẽn chính. Có hai cải tiến lớn.

**Định dạng nhị phân (UnsafeRow):** thay vì đối tượng JVM với header và con trỏ, dữ liệu được lưu gọn, vị trí trường suy ra từ schema. Tốn ít bộ nhớ hơn, không tạo nhiều đối tượng nên GC giảm mạnh, và dữ liệu liền nhau nên tận dụng tốt cache của CPU.

**Whole-Stage Code Generation:** thay vì mô hình Volcano gọi hàm ảo cho từng dòng qua từng phép tính, Spark sinh một hàm Java duy nhất cho cả chuỗi, giống vòng lặp viết tay.

**UDF Python** phá vỡ cả hai. Dữ liệu phải được chuyển khỏi định dạng nhị phân, tuần tự hóa và gửi sang tiến trình Python, rồi quay lại. Chuỗi sinh mã bị ngắt tại đó, vì mã Java không thể gọi trực tiếp Python. Thêm vào đó, Catalyst không nhìn được bên trong hàm. Vì vậy tôi ưu tiên hàm tích hợp, rồi đến Pandas UDF để giảm chi phí chuyển đổi nhờ Arrow.`,
    keyPoints: [
      { text: 'Định dạng nhị phân giảm bộ nhớ và GC', keywords: ['nhị phân', 'unsaferow', 'gc'], weight: 2 },
      { text: 'Whole-Stage Code Generation thay cho gọi hàm từng dòng', keywords: ['code generation', 'sinh mã', 'volcano'], weight: 2 },
      { text: 'UDF Python làm dữ liệu rời khỏi JVM', keywords: ['tuần tự hóa', 'tiến trình python', 'rời', 'chuyển đổi'] },
      { text: 'UDF ngắt chuỗi sinh mã', keywords: ['ngắt', 'mất sinh mã', 'không sinh mã', 'chuỗi sinh mã'] },
    ],
    followUps: ['Dấu * trong explain nghĩa là gì?'],
    commonMistakes: ['Nghĩ Tungsten chỉ là bộ nhớ off-heap.'],
  },
  {
    id: 'iv-spark-skew-01',
    topicId: 'spark',
    category: 'spark-performance-group',
    conceptIds: ['spark-data-skew', 'spark-sort-merge-join'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle', 'senior'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Tại sao JOIN có thể gây ra Data Skew? Hãy giải thích từ nguyên lý cơ bản.',
    referenceAnswer: `Bắt đầu từ cách Join phân tán hoạt động. Với Sort Merge Join, cả hai bảng được shuffle bằng \`hash(key) % số Partition\`, để dòng cùng key nằm cùng một chỗ. Đây là yêu cầu bắt buộc để dò khớp, và **mọi dòng cùng key phải về cùng một Partition**.

Trong khi đó, dữ liệu thực tế theo phân phối đuôi dài: một vài khách hàng, sản phẩm chiếm phần lớn số dòng, hoặc rất nhiều giá trị null, giá trị mặc định. Vậy key lớn sẽ tạo ra một Partition lớn hơn hẳn, và Partition đó chỉ do một Task xử lý.

Join còn làm vấn đề nặng hơn so với tổng hợp, vì **số dòng đầu ra có thể nhân lên**. Nếu một key có 1 triệu dòng bên trái và 1.000 dòng bên phải, Task đó tạo ra 1 tỷ dòng. Vì vậy có thể bị OOM ngay cả khi đầu vào vừa bộ nhớ.

Hậu quả là Stage kẹt ở Task cuối, và thêm máy không giúp ích, vì một Task chỉ chạy trên một core. Cách xử lý: lọc null, Broadcast nếu một bên nhỏ, dùng AQE Skew Join, tách key lớn, hoặc Salting.`,
    keyPoints: [
      { text: 'Hash đưa mọi dòng cùng key về một Partition', keywords: ['hash', 'cùng key', 'cùng một partition'], weight: 2 },
      { text: 'Dữ liệu thực tế phân bố đuôi dài, có hot key hoặc null', keywords: ['đuôi dài', 'hot key', 'null', 'key lớn'], weight: 2 },
      { text: 'Join có thể nhân số dòng đầu ra', keywords: ['nhân', 'tích', 'bùng nổ', 'đầu ra'] },
      { text: 'Một Task chỉ chạy trên một core nên thêm máy không giúp ích', keywords: ['một task', 'một core', 'thêm máy'] },
      { text: 'Nêu các cách xử lý', keywords: ['broadcast', 'salting', 'aqe', 'lọc null'] },
    ],
    followUps: ['AQE xử lý skew trong Join thế nào?', 'Salting có làm sai kết quả không?'],
    commonMistakes: ['Chỉ nói về triệu chứng mà không giải thích từ cơ chế băm.'],
  },
  {
    id: 'iv-spark-skew-02',
    topicId: 'spark',
    category: 'spark-performance-group',
    conceptIds: ['spark-data-skew', 'spark-performance'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Job kẹt ở 199/200 Task trong nhiều giờ. Bạn chẩn đoán và xử lý thế nào, từng bước?',
    referenceAnswer: `**Bước 1: xác nhận có đúng là skew không.** Mở Stage trên Spark UI, xem phân vị Duration và Shuffle Read Size. Nếu Task chậm cũng có dữ liệu nhiều hơn hẳn thì là skew. Nếu dữ liệu bằng nhau nhưng chỉ chậm trên một máy thì có thể là máy lỗi. Xem cả GC và spill.

**Bước 2: xác định key nào lệch.** Đếm theo key trên một mẫu dữ liệu, để biết đó là null, giá trị mặc định hay khách hàng lớn thật.

**Bước 3: xử lý theo thứ tự chi phí tăng dần.**

- Key rác: lọc bỏ. Với \`INNER JOIN\`, null không khớp nên bỏ được ngay.
- Kiểm tra AQE đang bật và có áp dụng không. Có thể hạ ngưỡng nếu Partition lệch ở mức nhỏ.
- Nếu một bên nhỏ: dùng Broadcast.
- Nếu biết rõ vài key lớn: tách riêng, xử lý bằng Broadcast rồi \`union\` với phần còn lại.
- Cuối cùng mới dùng Salting, và kiểm tra kết quả vẫn đúng.

**Bước 4: xác nhận và phòng ngừa.** So sánh tổng dòng và các chỉ số trước và sau khi sửa. Đặt cảnh báo cho thời gian chạy và phân phối key, vì độ lệch có thể thay đổi. Trong khi đó, tăng bộ nhớ chỉ là biện pháp tạm thời để tránh OOM.`,
    keyPoints: [
      { text: 'Xác nhận skew bằng phân vị Task', keywords: ['phân vị', 'trung vị', 'max', 'shuffle read'], weight: 2 },
      { text: 'Tìm key lệch', keywords: ['đếm', 'top key', 'key nào', 'key lệch'] },
      { text: 'Xử lý theo thứ tự từ đơn giản đến phức tạp', keywords: ['lọc', 'aqe', 'broadcast', 'salting'], weight: 2 },
      { text: 'Kiểm tra lại kết quả và phòng ngừa', keywords: ['kiểm tra', 'cảnh báo', 'kết quả', 'giám sát'] },
    ],
    followUps: ['AQE không phát hiện được skew, bạn kiểm tra gì tiếp?'],
    commonMistakes: ['Vội tăng tài nguyên.', 'Dùng Salting khi chưa xem dữ liệu.'],
  },
  {
    id: 'iv-spark-skew-03',
    topicId: 'spark',
    category: 'spark-performance-group',
    conceptIds: ['spark-data-skew'],
    interviewTypes: ['bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Salting hoạt động thế nào với Join và với phép tổng hợp? Làm sao đảm bảo kết quả vẫn đúng?',
    referenceAnswer: `Ý tưởng chung là chia một key lớn thành nhiều key nhỏ để phân tán chúng ra nhiều Partition.

**Với Join:** thêm muối ngẫu nhiên từ 0 đến N-1 vào key của bảng bị lệch, tức một dòng được chọn một muối. Bảng còn lại phải được **nhân bản N lần**, mỗi bản với một giá trị muối. Join trên cả key gốc và muối. Như vậy mỗi dòng bên lệch vẫn khớp đúng một bản của mỗi dòng bên kia, và kết quả không đổi. Quên nhân bản sẽ làm mất dòng. Đánh đổi là bảng bên kia lớn gấp N lần, nên thường chỉ áp dụng cho các key thực sự lệch.

**Với tổng hợp:** chạy **hai bước**. Trước tiên tổng hợp theo key có muối, sau đó bỏ muối và tổng hợp lại theo key gốc. Điều này chỉ đúng với hàm có tính kết hợp như \`sum\`, \`max\`, \`count\`, với \`count\` thì bước sau phải dùng \`sum\`. Không làm được với \`median\` hay \`count distinct\` nếu không có cấu trúc dữ liệu phù hợp.

**Đảm bảo đúng:** so sánh với phiên bản không có muối trên một mẫu dữ liệu, kiểm tra tổng và số dòng, và lấy N hợp lý dựa trên kích thước key.`,
    keyPoints: [
      { text: 'Thêm muối để chia key lớn thành nhiều key', keywords: ['muối', 'salt', 'ngẫu nhiên', 'chia key'], weight: 2 },
      { text: 'Với Join, nhân bản bên còn lại', keywords: ['nhân bản', 'replicate', 'n lần'], weight: 2 },
      { text: 'Với tổng hợp, làm hai bước', keywords: ['hai bước', 'tổng hợp lại', 'key gốc'], weight: 2 },
      { text: 'Chỉ áp dụng với hàm có tính kết hợp', keywords: ['kết hợp', 'median', 'count distinct'] },
      { text: 'Kiểm tra kết quả', keywords: ['kiểm tra', 'so sánh'] },
    ],
    followUps: ['Chọn N như thế nào?', 'Vì sao count phải dùng sum ở bước thứ hai?'],
    commonMistakes: ['Quên nhân bản bảng còn lại.', 'Áp dụng cho median mà không nhận ra kết quả sai.'],
  },
  {
    id: 'iv-spark-small-01',
    topicId: 'spark',
    category: 'spark-performance-group',
    conceptIds: ['spark-small-files'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao nhiều tệp nhỏ lại làm hệ thống chậm dù tổng dung lượng không đổi? Bạn xử lý thế nào?',
    referenceAnswer: `Chi phí đọc không chỉ tỷ lệ với dung lượng mà còn với **số tệp**. Mỗi tệp phải được liệt kê, mở, đọc metadata, với Parquet là đọc footer. Mỗi thao tác đó nhỏ, nhưng với hàng triệu tệp, chúng lớn hơn cả thời gian đọc dữ liệu. Trên HDFS, NameNode giữ metadata của mọi tệp trong RAM, nên có thể quá tải. Trên S3, không còn NameNode, nhưng mỗi tệp vẫn tốn lệnh gọi API và tiền. Tệp nhỏ cũng nén kém hơn, và khó bỏ qua dữ liệu.

Về nguyên nhân, thường do số Partition lớn khi ghi, \`partitionBy\` theo cột có quá nhiều giá trị, hoặc streaming với chu kỳ ngắn.

Tôi xử lý ở hai phía. **Khi ghi:** tính số tệp từ tổng dung lượng, nhắm tới khoảng 128 MB đến 1 GB mỗi tệp, dùng \`repartition\` hoặc \`coalesce\`, và \`repartition\` theo cột phân vùng trước \`partitionBy\`. **Định kỳ:** chạy Compaction, như \`OPTIMIZE\` của Delta hoặc \`rewrite_data_files\` của Iceberg, an toàn với truy vấn đang đọc. Tôi cũng giám sát số tệp và kích thước trung bình của các bảng quan trọng.`,
    keyPoints: [
      { text: 'Chi phí liệt kê, mở tệp và đọc metadata', keywords: ['liệt kê', 'mở tệp', 'metadata', 'footer'], weight: 2 },
      { text: 'Áp lực NameNode hoặc chi phí API', keywords: ['namenode', 'api', 's3'] },
      { text: 'Kiểm soát số tệp khi ghi', keywords: ['repartition', 'coalesce', 'số tệp'], weight: 2 },
      { text: 'Compaction định kỳ', keywords: ['compaction', 'optimize', 'rewrite', 'gộp'], weight: 2 },
    ],
    followUps: ['Kích thước tệp mục tiêu nên là bao nhiêu, vì sao?'],
    commonMistakes: ['Cho rằng dùng S3 thì không còn vấn đề.'],
  },
  {
    id: 'iv-spark-perf-01',
    topicId: 'spark',
    category: 'spark-performance-group',
    conceptIds: ['spark-performance'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle', 'senior'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn tối ưu một job Spark chậm như thế nào? Hãy trình bày cách tiếp cận của bạn.',
    referenceAnswer: `Tôi không bắt đầu từ cấu hình mà bắt đầu từ đo đạc.

**Đo:** mở Spark UI, tìm Stage chiếm nhiều thời gian nhất, đọc \`explain\` và kế hoạch cuối của AQE, xem Task có lệch không, có spill và GC không.

**Giảm dữ liệu:** thường có tác động lớn nhất. Dùng Parquet, lọc theo cột phân vùng, chỉ đọc cột cần dùng, kiểm tra \`PushedFilters\`.

**Giảm shuffle:** dùng Broadcast cho bảng nhỏ, bỏ \`distinct\`, \`orderBy\` thừa, dùng bucketing cho bảng hay join.

**Xử lý skew:** lọc null, dùng AQE, tách key lớn hoặc Salting nếu cần.

**Chỉnh Partition:** khoảng 100 đến 200 MB mỗi Partition, để AQE gộp lại.

**Viết logic hiệu quả:** dùng hàm tích hợp thay UDF, chỉ cache khi dùng lại, tránh \`collect\`.

**Tài nguyên:** cuối cùng mới chỉnh Executor, core và bộ nhớ.

Mỗi lần chỉ đổi một thứ, đo lại, và luôn kiểm tra đầu ra vẫn đúng. Tôi cũng cân nhắc có đáng làm không: với job rẻ và chạy hiếm, không nên dành nhiều thời gian.`,
    keyPoints: [
      { text: 'Bắt đầu bằng đo đạc trên Spark UI', keywords: ['spark ui', 'đo', 'explain', 'stage'], weight: 2 },
      { text: 'Giảm dữ liệu trước', keywords: ['giảm dữ liệu', 'lọc', 'parquet', 'chọn cột'], weight: 2 },
      { text: 'Giảm shuffle', keywords: ['shuffle', 'broadcast'], weight: 2 },
      { text: 'Xử lý skew', keywords: ['skew', 'lệch'] },
      { text: 'Tài nguyên là bước cuối', keywords: ['cuối cùng', 'tài nguyên', 'executor'] },
      { text: 'Kiểm tra đầu ra vẫn đúng', keywords: ['đầu ra', 'kết quả đúng', 'kiểm tra'] },
    ],
    followUps: ['Một ví dụ thực tế bạn đã tối ưu?', 'Khi nào bạn dừng tối ưu?'],
    commonMistakes: ['Liệt kê các tham số cấu hình mà không có quy trình.'],
  },
  {
    id: 'iv-spark-perf-02',
    topicId: 'spark',
    category: 'spark-performance-group',
    conceptIds: ['spark-performance', 'spark-task'],
    interviewTypes: ['bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Đọc các chỉ số trên Spark UI, làm sao phân biệt skew, thiếu bộ nhớ, máy chậm và nghẽn ở Driver?',
    referenceAnswer: `Mỗi vấn đề có dấu hiệu riêng, và tôi đọc theo phân phối Task, không chỉ nhìn giá trị trung bình.

**Skew:** Max của Duration và của Shuffle Read đều lớn gấp nhiều lần trung vị. Thời gian đi cùng dữ liệu.

**Máy chậm:** Duration chênh nhưng dữ liệu đều, và các Task chậm tập trung ở một Executor hoặc một máy. Xem tab Executors để xác nhận. Speculative Execution có thể giúp được.

**Thiếu bộ nhớ đồng đều:** mọi Task đều chậm, Spill (Disk) lớn, GC Time cao trên 10% đến 20%. Tăng số Partition hoặc giảm số core mỗi Executor.

**Nghẽn ở Driver:** mất nhiều thời gian trước khi Task đầu tiên chạy, Executor rảnh, CPU Driver cao, hoặc Scheduler Delay lớn. Thường do kế hoạch quá lớn, liệt kê quá nhiều tệp, hoặc quá nhiều Task nhỏ.

**Đọc thừa dữ liệu:** Input Size lớn hơn hẳn so với dữ liệu cần thiết. Kiểm tra pushdown.

**Thiếu tài nguyên cụm:** Task chờ lâu mới được chạy, và ứng dụng không nhận đủ Executor đã xin. Lúc đó mới nên xem xét thêm máy.`,
    keyPoints: [
      { text: 'Skew: thời gian và dữ liệu cùng lệch', keywords: ['skew', 'dữ liệu nhiều hơn', 'shuffle read', 'trung vị'], weight: 2 },
      { text: 'Máy chậm: dữ liệu đều nhưng thời gian lệch trên một máy', keywords: ['máy chậm', 'một máy', 'dữ liệu đều'] },
      { text: 'Thiếu bộ nhớ: spill và GC cao trên diện rộng', keywords: ['spill', 'gc'], weight: 2 },
      { text: 'Nghẽn Driver: Executor rảnh, Scheduler Delay cao', keywords: ['driver', 'scheduler delay', 'executor rảnh'], weight: 2 },
    ],
    followUps: ['GC time bao nhiêu thì đáng lo?'],
    commonMistakes: ['Chỉ nhìn vào thời gian trung bình.'],
  },
  {
    id: 'iv-spark-perf-03',
    topicId: 'spark',
    category: 'spark-performance-group',
    conceptIds: ['spark-performance', 'spark-shuffle'],
    interviewTypes: ['bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Dữ liệu tăng 10 lần, thời gian job tăng 40 lần. Vì sao có thể phi tuyến như vậy, và bạn chuẩn bị thế nào?',
    referenceAnswer: `Spark không tăng tuyến tính vì một số giới hạn chỉ xuất hiện khi vượt qua ngưỡng.

**Bộ nhớ:** khi dữ liệu vừa bộ nhớ, sắp xếp và Join chạy nhanh. Khi Partition vượt quá bộ nhớ Task, dữ liệu tràn đĩa, GC tăng, và tốc độ giảm hàng chục lần. Vì số Partition giữ nguyên, mỗi Partition lớn gấp 10 lần.

**Đổi chiến lược Join:** bảng từng được Broadcast có thể vượt ngưỡng, chuyển sang Sort Merge Join, thêm shuffle toàn bộ.

**Skew:** Task lệch tăng theo key lớn. Join trên key lệch có thể tăng theo tích hai bên.

**Sắp xếp và Join:** chi phí sắp xếp là n log n, không phải tuyến tính.

**Driver:** nhiều tệp và Task hơn gây áp lực cho Driver.

Để chuẩn bị, tôi kiểm thử với dữ liệu lớn dần và vẽ đường thời gian theo kích thước, để phát hiện điểm gãy. Tôi không dùng số Partition cố định mà tính theo dữ liệu, kết hợp AQE. Tôi giám sát kích thước bảng Broadcast, phân phối key, spill và GC, và cân nhắc xử lý tăng dần thay vì tính lại toàn bộ.`,
    keyPoints: [
      { text: 'Vượt bộ nhớ gây spill và GC, làm chậm đột ngột', keywords: ['spill', 'gc', 'vượt bộ nhớ'], weight: 2 },
      { text: 'Chiến lược Join có thể đổi', keywords: ['broadcast', 'đổi chiến lược', 'sort merge'] },
      { text: 'Skew tăng phi tuyến', keywords: ['skew', 'lệch', 'tích'] },
      { text: 'Kiểm thử theo kích thước để tìm điểm gãy', keywords: ['kiểm thử', 'điểm gãy', 'dữ liệu lớn dần'], weight: 2 },
      { text: 'Số Partition tính theo dữ liệu và giám sát', keywords: ['theo dữ liệu', 'giám sát', 'aqe', 'tăng dần'] },
    ],
    followUps: ['Bạn dự báo chi phí cụm cho năm tới thế nào?'],
    commonMistakes: ['Giả định tăng dữ liệu thì chỉ cần tăng máy theo tỷ lệ.'],
  },
])
