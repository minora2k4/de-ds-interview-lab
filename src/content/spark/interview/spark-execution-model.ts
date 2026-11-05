import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-spark-dag-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-dag', 'spark-stage', 'spark-task'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Job, Stage và Task khác nhau thế nào? Spark quyết định chia Stage dựa trên điều gì?',
    referenceAnswer: `**Job** là toàn bộ công việc được kích hoạt bởi một Action. **Stage** là đoạn công việc có thể chạy liền nhau mà không cần trao đổi dữ liệu qua mạng. **Task** là đơn vị nhỏ nhất, áp dụng phép tính của một Stage lên một Partition.

Spark chia Stage dựa trên **Shuffle Dependency**. DAGScheduler duyệt ngược từ kết quả cuối cùng, và cắt mỗi khi gặp Wide Transformation, vì tại đó Partition con cần dữ liệu từ nhiều Partition cha. Các Narrow Transformation nằm trong cùng một Stage được gộp lại chạy liền nhau.

Ví dụ: đọc 800 Partition, \`filter\`, \`groupBy\` với 200 Partition rồi \`write\`. Có một lần shuffle nên có 2 Stage, gồm 800 và 200 Task, tổng 1.000 Task. Số Task đồng thời bị giới hạn bởi tổng số core. Stage sau chỉ chạy khi Stage trước xong hết, nên một Task chậm có thể giữ chân cả job.`,
    keyPoints: [
      { text: 'Phân biệt đúng Job, Stage và Task', keywords: ['action', 'partition'], weight: 2 },
      { text: 'Stage được cắt tại shuffle', keywords: ['shuffle', 'wide'], weight: 2 },
      { text: 'Biết tính số Task theo số Partition', keywords: ['số task', 'mỗi partition', 'một partition'] },
      { text: 'Stage sau phải chờ Stage trước', keywords: ['chờ', 'stage trước', 'task chậm'] },
    ],
    followUps: ['Một Action có thể tạo ra nhiều job không?', 'Các Stage có chạy song song được không?'],
    commonMistakes: ['Cho rằng mỗi Transformation là một Stage.'],
  },
  {
    id: 'iv-spark-dag-02',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-dag', 'spark-rdd'],
    interviewTypes: ['bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao Spark biểu diễn công việc thành DAG mà không phải một chuỗi Map và Reduce như Hadoop? Vì sao đồ thị lại không có chu trình?',
    referenceAnswer: `Hai pha Map và Reduce quá cứng: mỗi pipeline nhiều bước phải nối nhiều job, mỗi job ghi kết quả ra HDFS, và hệ thống không biết job sau cần gì. DAG cho phép chuỗi bước tùy ý trong một ứng dụng. Nhờ đó Spark có thể gộp các bước không cần shuffle vào một Stage, chạy song song các nhánh độc lập, và chỉ ghi dữ liệu trung gian khi cần.

DAG không có chu trình vì **dữ liệu bất biến**. Mỗi phép biến đổi tạo ra tập dữ liệu mới, không sửa tập cũ, nên phụ thuộc chỉ có thể đi một chiều. Điều này rất quan trọng cho chịu lỗi: có thể tính lại bất kỳ phần nào bằng cách đi ngược theo phụ thuộc, và chắc chắn sẽ kết thúc.

Vòng lặp của thuật toán lặp được **trải ra** thành nhiều bước. Lineage vì thế có thể rất dài, làm tăng chi phí lập kế hoạch và khôi phục, nên cần checkpoint định kỳ.`,
    keyPoints: [
      { text: 'Hai pha cố định làm mất cơ hội tối ưu xuyên job', keywords: ['hai pha', 'cứng', 'ghi ra hdfs', 'nhiều job'] },
      { text: 'DAG cho phép gộp bước và chạy song song', keywords: ['gộp', 'song song', 'stage'], weight: 2 },
      { text: 'Không có chu trình vì dữ liệu bất biến', keywords: ['bất biến', 'immutable'], weight: 2 },
      { text: 'Vòng lặp trải ra nhiều bước, cần checkpoint', keywords: ['checkpoint', 'trải ra', 'lineage'] },
    ],
    followUps: ['Thuật toán lặp được xử lý như thế nào trên DAG?'],
    commonMistakes: ['Chỉ đọc định nghĩa DAG mà không giải thích được vì sao cần đến nó.'],
  },
  {
    id: 'iv-spark-dag-03',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-dag', 'spark-performance'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Một job chậm đột ngột. Bạn đọc DAG và Spark UI theo trình tự nào để tìm nguyên nhân?',
    referenceAnswer: `Tôi đi từ tổng thể đến chi tiết, và không đổi cấu hình cho tới khi có bằng chứng.

**Bước 1: tìm Stage tốn thời gian nhất** ở tab Jobs và Stages. So với lần chạy tốt gần nhất để xem dữ liệu đầu vào hay shuffle có tăng không.

**Bước 2: đọc tab SQL.** Xem DAG có quét nguồn nhiều lần không, Join dùng chiến lược gì, kế hoạch cuối sau AQE khác gì với kế hoạch ban đầu, bộ lọc có được đẩy xuống không.

**Bước 3: đọc phân phối Task** của Stage đó, xem min, trung vị và max của thời gian và dữ liệu. Max vượt xa trung vị và dữ liệu cũng nhiều hơn là skew. Thời gian lệch nhưng dữ liệu đều, chỉ trên một máy, là máy chậm. Mọi Task đều chậm là quá tải đồng đều.

**Bước 4: xem các chỉ số phụ.** Spill cao hoặc GC time cao là áp lực bộ nhớ. Scheduler delay cao có thể do quá nhiều Task nhỏ.

Sau đó tôi sửa đúng một nguyên nhân, đo lại, đồng thời kiểm tra kết quả đầu ra vẫn đúng.`,
    keyPoints: [
      { text: 'Tìm Stage tốn thời gian nhất, so với lần chạy trước', keywords: ['stage tốn', 'stage lâu', 'so với lần', 'chiếm nhiều thời gian'], weight: 2 },
      { text: 'Đọc kế hoạch trên tab SQL', keywords: ['tab sql', 'kế hoạch', 'explain', 'chiến lược join'] },
      { text: 'Đọc phân phối Task để phân biệt skew và quá tải', keywords: ['phân phối', 'trung vị', 'max', 'skew'], weight: 2 },
      { text: 'Xem spill và GC', keywords: ['spill', 'gc'] },
    ],
    followUps: ['Bạn phân biệt skew với máy chậm thế nào?'],
    commonMistakes: ['Vội tăng tài nguyên trước khi đọc số liệu.'],
  },
  {
    id: 'iv-spark-trans-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-transformation', 'spark-action'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Transformation và Action khác nhau thế nào? Cho ví dụ và nói rõ chuyện gì xảy ra trên cụm với mỗi loại.',
    referenceAnswer: `**Transformation** tạo ra tập dữ liệu mới từ tập cũ, ví dụ \`filter\`, \`select\`, \`join\`, \`groupBy\`. Khi gọi, cụm gần như không làm gì: Spark chỉ thêm một bước vào kế hoạch, kiểm tra tên cột và kiểu dữ liệu.

**Action** yêu cầu một kết quả thật, ví dụ \`count\`, \`collect\`, \`show\`, \`write\`. Khi gọi, Spark tạo job, tối ưu kế hoạch, chia Stage và gửi Task tới Executor.

Hệ quả thực tế: chi phí phát sinh ở Action, không phải ở nơi viết Transformation. Gọi hai Action trên cùng DataFrame sẽ tính lại hai lần nếu không cache. Lỗi dữ liệu trong Transformation cũng chỉ lộ ra khi Action chạy. Có vài ngoại lệ chạy job sớm, như \`inferSchema\` với CSV.`,
    keyPoints: [
      { text: 'Transformation trì hoãn, chỉ thêm vào kế hoạch', keywords: ['trì hoãn', 'lazy', 'kế hoạch'], weight: 2 },
      { text: 'Action kích hoạt job', keywords: ['kích hoạt', 'tạo job', 'job'], weight: 2 },
      { text: 'Nêu đúng ví dụ của mỗi loại', keywords: ['filter', 'count', 'collect', 'select'] },
      { text: 'Nhiều Action tính lại nhiều lần', keywords: ['tính lại', 'cache', 'hai lần'] },
    ],
    followUps: ['Có Transformation nào chạy job ngay không?'],
    commonMistakes: ['Liệt kê ví dụ mà không nói về hậu quả thực tế.'],
  },
  {
    id: 'iv-spark-action-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-action', 'spark-driver'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'collect, take, show và write khác nhau thế nào về chi phí? Vì sao collect nguy hiểm?',
    referenceAnswer: `Bốn lệnh này khác nhau ở chỗ dữ liệu đi đâu và phải tính bao nhiêu.

\`write\` xử lý toàn bộ dữ liệu, nhưng mỗi Executor tự ghi phần của mình nên Driver không phải giữ dữ liệu. \`take\` và \`show\` chỉ cần vài dòng, nên Spark quét từ vài Partition đầu và mở rộng dần nếu chưa đủ. Vì vậy chúng thường rất nhanh, trừ khi trước đó có shuffle hoặc sắp xếp, khi đó vẫn phải tính gần như toàn bộ. \`collect\` xử lý toàn bộ rồi gửi tất cả về Driver.

\`collect\` nguy hiểm vì **kéo dữ liệu phân tán về bộ nhớ của một máy**. Nó có thể gây OOM ở Driver, hoặc job bị hủy khi vượt \`spark.driver.maxResultSize\`. Nó làm mất luôn lợi ích của xử lý phân tán. Tôi chỉ dùng khi chắc chắn kết quả nhỏ, ví dụ sau tổng hợp, còn lại dùng \`write\`, hoặc \`take\` để xem thử.`,
    keyPoints: [
      { text: 'collect gom toàn bộ về Driver, có thể gây OOM', keywords: ['gom', 'driver', 'oom', 'hết bộ nhớ'], weight: 2 },
      { text: 'write ghi từ Executor, không qua Driver', keywords: ['executor', 'tự ghi', 'không qua driver'] },
      { text: 'take và show chỉ quét một phần', keywords: ['vài partition', 'một phần', 'vài dòng', 'quét'] },
      { text: 'Có giới hạn maxResultSize', keywords: ['maxresultsize'] },
    ],
    followUps: ['Vì sao show vẫn chậm khi có orderBy ở trước?'],
    commonMistakes: ['Nói take luôn nhanh mà không tính đến shuffle hoặc sort phía trước.'],
  },
  {
    id: 'iv-spark-narrow-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-narrow-transformation', 'spark-wide-transformation', 'spark-shuffle'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Narrow và Wide Transformation khác nhau thế nào? Vì sao sự khác biệt đó lại quan trọng với hiệu năng?',
    referenceAnswer: `Khác biệt nằm ở quan hệ giữa các Partition. Với **Narrow**, mỗi Partition cha đi vào tối đa một Partition con, như \`filter\`, \`select\`, \`map\`. Với **Wide**, một Partition cha đóng góp cho nhiều Partition con, như \`groupBy\`, \`join\` thông thường, \`orderBy\`, vì các dòng cùng key phải được gom về một nơi.

Ý nghĩa hiệu năng rất lớn. Narrow không cần trao đổi dữ liệu, nên được gộp vào cùng một Stage và chạy liền nhau trên từng Partition. Wide buộc phải **shuffle**: tuần tự hóa, ghi đĩa, truyền qua mạng và đọc lại. Nó tạo ra ranh giới Stage, và Stage sau phải chờ Stage trước.

Khi có lỗi, Narrow chỉ cần tính lại vài Partition cha, còn Wide có thể phải tính lại nhiều Partition.

Vì vậy khi tối ưu, tôi đếm số phép Wide và giảm dữ liệu đi vào chúng: lọc và chọn cột trước, dùng Broadcast nếu một bảng nhỏ, và bỏ những \`distinct\` hay \`orderBy\` không thật sự cần.`,
    keyPoints: [
      { text: 'Định nghĩa dựa trên quan hệ giữa Partition cha và con', keywords: ['partition cha', 'partition con'], weight: 2 },
      { text: 'Wide gây shuffle tốn mạng, đĩa, tuần tự hóa', keywords: ['shuffle', 'mạng', 'đĩa'], weight: 2 },
      { text: 'Wide tạo ranh giới Stage, Narrow được gộp', keywords: ['ranh giới', 'stage', 'gộp'] },
      { text: 'Cách tính lại khác nhau khi có lỗi', keywords: ['tính lại', 'khôi phục', 'lỗi'] },
      { text: 'Nêu cách giảm chi phí cụ thể', keywords: ['lọc', 'broadcast', 'giảm dữ liệu'] },
    ],
    followUps: ['coalesce là Narrow hay Wide? Vì sao?', 'join có thể là Narrow không?'],
    commonMistakes: ['Định nghĩa dựa vào số dòng hoặc số cột.'],
  },
  {
    id: 'iv-spark-wide-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-wide-transformation', 'spark-sort-merge-join'],
    interviewTypes: ['bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Khi nào một phép join trong Spark không cần shuffle? Làm sao tận dụng được điều đó?',
    referenceAnswer: `Join cần shuffle chỉ vì các dòng cùng key đang nằm ở nơi khác nhau. Nếu điều kiện đó không còn, shuffle có thể bỏ qua. Có ba trường hợp chính.

**Broadcast Join:** bảng nhỏ được gửi tới mọi Executor, nên bảng lớn không phải di chuyển. Cần bảng đủ nhỏ, mặc định dưới 10 MB để tự động chọn, hoặc gợi ý bằng \`broadcast()\`.

**Bucketing:** hai bảng được ghi với cùng số bucket và cùng key. Khi đọc, Spark biết dữ liệu đã được chia sẵn nên có thể join mà không shuffle. Cách này tốn công thiết lập, và cần giữ đúng cấu hình khi ghi.

**Đã được chia sẵn từ trước:** nếu cả hai phía vừa được shuffle hoặc \`repartition\` theo cùng key và cùng số Partition trong cùng ứng dụng, Spark nhận ra và không shuffle lại.

Cách kiểm tra là đọc \`explain()\`: không có nút \`Exchange\` trước Join nghĩa là không shuffle. Việc đáng làm với những bảng được join rất thường xuyên, còn những join hiếm thì chi phí thiết lập không đáng.`,
    keyPoints: [
      { text: 'Shuffle chỉ cần vì dòng cùng key nằm rải rác', keywords: ['cùng key', 'rải rác', 'nơi khác nhau'] },
      { text: 'Broadcast Join', keywords: ['broadcast'], weight: 2 },
      { text: 'Bucketing hoặc đã được chia sẵn', keywords: ['bucket', 'chia sẵn', 'co partition', 'cùng số partition'], weight: 2 },
      { text: 'Kiểm tra bằng explain, không có nút Exchange', keywords: ['explain', 'exchange'] },
    ],
    followUps: ['Bucketing có nhược điểm gì?', 'AQE có thể đổi chiến lược Join khi nào?'],
    commonMistakes: ['Nói mọi join đều shuffle.'],
  },
  {
    id: 'iv-spark-stage-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-stage', 'spark-partition'],
    interviewTypes: ['bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Job chỉ có một vài dòng code nhưng Spark UI hiển thị rất nhiều Stage và hàng chục nghìn Task. Bạn giải thích thế nào?',
    referenceAnswer: `Số dòng code không phản ánh chi phí, vì Stage và Task đến từ dữ liệu và kế hoạch.

**Số Stage** phụ thuộc vào số lần shuffle. Một dòng SQL có nhiều Join và \`GROUP BY\` có thể tạo nhiều lần shuffle. Một Action cũng có thể tạo nhiều job, ví dụ để gom bảng Broadcast hoặc lấy mẫu trước khi sắp xếp.

**Số Task** bằng số Partition của mỗi Stage, nên phụ thuộc vào số lượng và kích thước tệp đầu vào, và \`spark.sql.shuffle.partitions\`. Đọc hàng nghìn tệp nhỏ sẽ tạo ra rất nhiều Task, dù Spark có gom một số tệp nhỏ vào cùng Partition.

Tôi kiểm tra thêm: số Task quá nhiều so với dữ liệu có thể làm tăng scheduler delay và gây nghẽn ở Driver. Khi đó nên gộp tệp nhỏ và để AQE gộp Partition sau shuffle. Nếu có Stage skipped thì không cần lo, vì chúng đã dùng lại kết quả shuffle.`,
    keyPoints: [
      { text: 'Số Stage phụ thuộc số lần shuffle', keywords: ['shuffle'], weight: 2 },
      { text: 'Số Task phụ thuộc số Partition', keywords: ['số partition', 'tệp', 'partition'], weight: 2 },
      { text: 'Một Action có thể tạo nhiều job', keywords: ['nhiều job', 'broadcast', 'lấy mẫu'] },
      { text: 'Quá nhiều Task gây nghẽn Driver, dùng AQE hoặc gộp tệp', keywords: ['aqe', 'gộp', 'scheduler', 'driver'] },
    ],
    followUps: ['Làm sao giảm số Task mà không làm chậm job?'],
    commonMistakes: ['Cho rằng code ngắn thì job phải rẻ.'],
  },
  {
    id: 'iv-spark-task-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-task', 'etl-idempotency'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Spark có thể chạy lại Task bất cứ lúc nào. Điều này ảnh hưởng thế nào đến cách bạn ghi dữ liệu ra hệ thống ngoài?',
    referenceAnswer: `Task có thể chạy nhiều lần vì lỗi, mất Executor, Stage bị gửi lại, hay Speculative Execution. Do đó trên thực tế Spark chỉ đảm bảo **ít nhất một lần**, và mọi tác dụng phụ đều có thể lặp lại.

Với **ghi tệp**, Spark dùng output commit: Task ghi vào vị trí tạm, chỉ phần đã commit mới được công bố. Nhưng trên kho đối tượng như S3, cần chọn committer phù hợp hoặc định dạng bảng như Delta, Iceberg để commit nguyên tử.

Với **hệ thống ngoài** như API hay cơ sở dữ liệu, tôi thiết kế theo hướng **idempotent**: dùng khóa duy nhất và thao tác \`UPSERT\`, để ghi lại không tạo bản ghi trùng. Nếu cần gửi thông báo, tôi lưu kết quả ra bảng trung gian trước, rồi có một tiến trình riêng gửi và đánh dấu đã gửi.

Tôi cũng tránh tác dụng phụ trong UDF, vì nó không chỉ chạy lại mà còn có thể bị gọi nhiều lần theo kế hoạch. Việc đặt lại số lần thử về 0 không phải là giải pháp, vì lỗi vẫn có thể xảy ra ở Stage.`,
    keyPoints: [
      { text: 'Task có thể chạy nhiều lần, nên chỉ đảm bảo ít nhất một lần', keywords: ['nhiều lần', 'ít nhất một lần', 'chạy lại'], weight: 2 },
      { text: 'Thao tác ghi cần idempotent', keywords: ['idempotent', 'lũy đẳng', 'upsert', 'khóa duy nhất'], weight: 2 },
      { text: 'Output commit hoặc định dạng bảng như Delta, Iceberg', keywords: ['commit', 'delta', 'iceberg'] },
      { text: 'Tránh tác dụng phụ trong UDF', keywords: ['tác dụng phụ', 'udf'] },
    ],
    followUps: ['Speculative Execution làm vấn đề này nặng hơn thế nào?'],
    commonMistakes: ['Cho rằng Spark đảm bảo mỗi bản ghi chỉ ghi đúng một lần.'],
  },
])
