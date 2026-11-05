import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-spark-shuffle-01',
    topicId: 'spark',
    category: 'spark-data',
    conceptIds: ['spark-shuffle', 'spark-wide-transformation'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Shuffle là gì và vì sao nó tốn kém? Bạn làm gì để giảm chi phí shuffle?',
    referenceAnswer: `Shuffle là việc phân phối lại dữ liệu để các dòng cùng key nằm cùng một chỗ. Nó bắt buộc phải có với \`groupBy\` hay \`join\`, vì dữ liệu ban đầu nằm rải rác trên nhiều máy.

Tốn kém vì dùng nhiều tài nguyên cùng lúc. Phía ghi tốn CPU để tuần tự hóa, nén và tốn đĩa để ghi file cục bộ. Phía đọc tốn mạng để lấy dữ liệu từ nhiều Executor, và tốn bộ nhớ để gộp hoặc sắp xếp, có thể tràn đĩa khi thiếu bộ nhớ. Shuffle còn tạo ranh giới Stage, và là nơi lệch dữ liệu xuất hiện.

Để giảm chi phí, tôi xử lý theo thứ tự. Đầu tiên giảm dữ liệu vào: lọc và chọn cột sớm. Sau đó bỏ shuffle nếu được: Broadcast Join khi một bảng nhỏ, bucketing cho bảng hay join theo cùng key. Tiếp theo xem lại logic: bỏ các \`distinct\`, \`orderBy\` không cần thiết. Cuối cùng là cấu hình: dùng AQE, đặt số Partition hợp lý để tránh spill. Tăng số Partition không giảm dữ liệu truyền đi, nó chỉ giúp mỗi Task xử lý ít hơn.`,
    keyPoints: [
      { text: 'Định nghĩa: gom các dòng cùng key về một nơi', keywords: ['cùng key', 'phân phối lại', 'gom'], weight: 2 },
      { text: 'Tốn CPU, đĩa, mạng và bộ nhớ', keywords: ['mạng', 'đĩa', 'tuần tự hóa', 'serialize'], weight: 2 },
      { text: 'Giảm dữ liệu vào bằng cách lọc, chọn cột', keywords: ['lọc', 'chọn cột', 'filter'] },
      { text: 'Bỏ shuffle bằng Broadcast hoặc bucketing', keywords: ['broadcast', 'bucketing', 'bucket'] },
      { text: 'Dùng AQE hoặc chỉnh số Partition', keywords: ['aqe', 'số partition', 'shuffle partitions'] },
    ],
    followUps: ['File shuffle nằm ở đâu?', 'Vì sao mất Executor có thể làm Stage trước phải chạy lại?'],
    commonMistakes: ['Nói tăng số Partition sẽ giảm lượng dữ liệu shuffle.'],
  },
  {
    id: 'iv-spark-shuffle-02',
    topicId: 'spark',
    category: 'spark-data',
    conceptIds: ['spark-shuffle', 'spark-rdd'],
    interviewTypes: ['bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Vì sao reduceByKey thường tốt hơn groupByKey? Với DataFrame thì sao?',
    referenceAnswer: `Cả hai đều cần gom theo key nên đều shuffle, nhưng lượng dữ liệu đi qua mạng khác nhau.

\`reduceByKey\` thực hiện **tổng hợp sơ bộ** trong từng Partition trước khi gửi đi, ví dụ cộng các giá trị của mỗi key tại chỗ, rồi chỉ gửi kết quả trung gian. \`groupByKey\` gửi **toàn bộ giá trị** qua mạng rồi mới gom lại, nên tốn mạng hơn nhiều, và có thể gây OOM khi một key có quá nhiều giá trị, vì tất cả phải nằm trong bộ nhớ một Task.

Tôi chỉ dùng \`groupByKey\` khi thật sự cần toàn bộ giá trị, và logic không thể viết thành phép gộp có tính kết hợp.

Với **DataFrame**, \`groupBy().agg()\` đã được Catalyst tối ưu tự động theo kiểu partial aggregation: có bước \`HashAggregate\` trước và sau \`Exchange\` trong kế hoạch. Tuy nhiên \`collect_list\` vẫn đưa toàn bộ giá trị về một Partition, nên về chi phí giống như \`groupByKey\`.`,
    keyPoints: [
      { text: 'reduceByKey tổng hợp sơ bộ trước khi shuffle', keywords: ['sơ bộ', 'tại chỗ', 'trước khi', 'combiner', 'partial'], weight: 2 },
      { text: 'groupByKey gửi toàn bộ giá trị qua mạng, dễ OOM', keywords: ['toàn bộ giá trị', 'oom', 'tốn mạng'], weight: 2 },
      { text: 'DataFrame được tối ưu tự động', keywords: ['catalyst', 'hashaggregate', 'dataframe'] },
      { text: 'collect_list có chi phí tương tự', keywords: ['collect list'] },
    ],
    followUps: ['Làm sao thấy partial aggregation trong kế hoạch?'],
    commonMistakes: ['Nói reduceByKey không cần shuffle.'],
  },
  {
    id: 'iv-spark-shuffle-03',
    topicId: 'spark',
    category: 'spark-data',
    conceptIds: ['spark-shuffle', 'spark-partition'],
    interviewTypes: ['bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Job xử lý 10 TB với mặc định 200 Shuffle Partition chạy rất chậm và spill nhiều. Bạn chọn số Partition thế nào? AQE giúp được gì và không giúp được gì?',
    referenceAnswer: `Với 200 Partition, nếu Shuffle Read khoảng 2 TB thì mỗi Partition khoảng 10 GB, lớn hơn nhiều so với bộ nhớ của một Task, nên spill nặng và GC cao. Tôi tính ngược từ kích thước mục tiêu: khoảng 200 MB mỗi Partition, tức khoảng 10.000 Partition.

Sau đó tôi kiểm tra với tài nguyên: nếu có 500 core thì 10.000 Task chạy lần lượt, mỗi lúc 500 Task, vẫn hợp lý. Tôi không chọn số quá lớn, vì Driver phải theo dõi tất cả Task và Task quá nhỏ làm tăng chi phí phối hợp.

**AQE giúp được** việc gộp các Partition nhỏ sau khi biết kích thước thật, nên nhiều job không cần tinh chỉnh tay. Mốc tham khảo là 64 MB, nhưng mặc định \`parallelismFirst\` bật nên Spark ưu tiên mức song song, và trên cụm đông nên tắt tùy chọn này. **AQE không giúp được** khi giá trị ban đầu quá nhỏ, vì nó chỉ gộp chứ không tự chia Partition thông thường ra thêm, ngoại trừ xử lý skew. Vì vậy với job lớn, tôi đặt số Partition ban đầu cao hơn một chút và để AQE gộp lại. AQE cũng không giảm được lượng shuffle đã phát sinh ở phía ghi.`,
    keyPoints: [
      { text: 'Tính ngược từ kích thước Partition mục tiêu', keywords: ['mục tiêu', '200 mb', '100 đến 200', 'mỗi partition'], weight: 2 },
      { text: 'Partition quá lớn gây spill và GC', keywords: ['spill', 'gc'] },
      { text: 'AQE gộp Partition nhỏ sau shuffle', keywords: ['aqe', 'gộp', 'coalesce'], weight: 2 },
      { text: 'AQE không tự chia ra nên giá trị ban đầu phải đủ lớn', keywords: ['không tự chia', 'ban đầu', 'chỉ gộp'], weight: 2 },
    ],
    followUps: ['parallelismFirst của AQE ảnh hưởng thế nào?'],
    commonMistakes: ['Giữ mặc định 200 cho mọi job.', 'Cho rằng AQE giải quyết được mọi vấn đề về Partition.'],
  },
  {
    id: 'iv-spark-partition-01',
    topicId: 'spark',
    category: 'spark-data',
    conceptIds: ['spark-partition'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Partition trong Spark là gì? Chuyện gì xảy ra nếu có quá ít hoặc quá nhiều Partition?',
    referenceAnswer: `Partition là một phần dữ liệu của DataFrame, cũng là đơn vị xử lý song song: mỗi Partition được một Task xử lý, trên một core. Số Partition vì vậy giới hạn mức song song, dù cụm có nhiều core đến đâu.

**Quá ít Partition:** mỗi Partition quá lớn, Task nặng, dễ tràn đĩa hoặc OOM. Một phần core ngồi không vì không có đủ Task.

**Quá nhiều Partition:** Task quá nhỏ, thời gian lập lịch và phối hợp có thể lớn hơn thời gian xử lý. Driver phải theo dõi quá nhiều Task, và khi ghi ra sinh nhiều tệp nhỏ.

Mức khởi đầu phổ biến là khoảng 100 đến 200 MB mỗi Partition, và số Partition gấp 2 đến 4 lần số core. Tôi không coi đó là công thức cứng mà kiểm tra lại trên Spark UI.

Cũng cần phân biệt Partition trong bộ nhớ với Partition trên đĩa do \`partitionBy\` tạo ra, vốn dùng để bỏ qua dữ liệu khi đọc.`,
    keyPoints: [
      { text: 'Mỗi Partition được một Task xử lý', keywords: ['một task', 'đơn vị', 'song song'], weight: 2 },
      { text: 'Quá ít: Task nặng, OOM, core ngồi không', keywords: ['quá ít', 'oom', 'tràn', 'ngồi không'] },
      { text: 'Quá nhiều: chi phí lập lịch, tệp nhỏ', keywords: ['quá nhiều', 'lập lịch', 'tệp nhỏ'] },
      { text: 'Có mức tham khảo về kích thước', keywords: ['100', '200 mb', 'kích thước'] },
    ],
    followUps: ['Partition trong bộ nhớ khác gì Partition trên đĩa?'],
    commonMistakes: ['Nghĩ rằng càng nhiều Partition càng nhanh.'],
  },
  {
    id: 'iv-spark-partition-02',
    topicId: 'spark',
    category: 'spark-data',
    conceptIds: ['spark-partition', 'db-partitioning'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Bạn chọn cột nào để partitionBy khi ghi bảng? Vì sao chọn sai lại làm hệ thống tệ đi rất nhiều?',
    referenceAnswer: `Tôi xét hai câu hỏi: truy vấn **hay lọc theo cột nào**, và cột đó **có ít giá trị khác nhau không**. Thường đó là ngày, có thể thêm vùng. Khi lọc theo cột phân vùng, Spark chỉ đọc đúng thư mục cần thiết nhờ Partition Pruning.

Chọn sai gây hại theo hai hướng. Nếu cột có **quá nhiều giá trị**, như \`user_id\`, sẽ sinh ra vô số thư mục và tệp nhỏ. Việc liệt kê tệp mất nhiều thời gian, NameNode hoặc chi phí gọi API S3 tăng, và truy vấn không lọc theo cột đó bị chậm đi. Nếu cột **ít được lọc**, cách phân vùng chẳng mang lại lợi ích nào. Nếu phân vùng **quá thô**, mỗi thư mục quá lớn và không bỏ qua được nhiều dữ liệu.

Với cột có nhiều giá trị, tôi dùng **bucketing** hoặc sắp xếp dữ liệu trong tệp như Z-order của Delta, kết hợp với min/max của Parquet để bỏ qua các nhóm dòng. Trước khi ghi, tôi thường \`repartition\` theo cột phân vùng để mỗi thư mục không có quá nhiều tệp nhỏ.`,
    keyPoints: [
      { text: 'Chọn cột hay được lọc và có ít giá trị', keywords: ['hay lọc', 'hay được lọc', 'ít giá trị', 'cardinality'], weight: 2 },
      { text: 'Giúp bỏ qua dữ liệu qua Partition Pruning', keywords: ['partition pruning', 'bỏ qua', 'chỉ đọc'] },
      { text: 'Cột nhiều giá trị sinh ra nhiều tệp nhỏ', keywords: ['tệp nhỏ', 'quá nhiều giá trị', 'user id'], weight: 2 },
      { text: 'Dùng bucketing hoặc Z-order cho cột nhiều giá trị', keywords: ['bucketing', 'z order', 'zorder'] },
    ],
    followUps: ['Vì sao thường repartition theo cột phân vùng trước khi ghi?'],
    commonMistakes: ['Phân vùng theo khóa chính.'],
  },
  {
    id: 'iv-spark-partition-03',
    topicId: 'spark',
    category: 'spark-data',
    conceptIds: ['spark-partition', 'spark-task'],
    interviewTypes: ['bigdata'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Spark quyết định số Partition khi đọc tệp thế nào? Vì sao đọc một tệp gzip lớn lại chậm dù cụm rất mạnh?',
    referenceAnswer: `Với tệp, Spark chia theo \`spark.sql.files.maxPartitionBytes\`, mặc định 128 MB: tệp lớn được chia thành nhiều Partition nếu định dạng cho phép, và nhiều tệp nhỏ được gộp vào một Partition, có tính thêm chi phí mở tệp \`openCostInBytes\` 4 MB. Với Parquet, việc chia dựa trên các nhóm dòng trong tệp.

Vấn đề với **gzip** là tệp không chia được: muốn đọc tới giữa tệp thì phải giải nén từ đầu. Vì vậy một tệp gzip luôn nằm trọn trong một Partition, tức một Task, dù nặng 80 GB. Cụm mạnh tới đâu thì Stage đó vẫn chỉ dùng một core, thấy rõ trên Spark UI là một Task chạy mãi.

Cách xử lý: chuyển nguồn sang định dạng chia được như Parquet hoặc ORC; nếu buộc phải dùng gzip thì nên chia thành nhiều tệp nhỏ; hoặc dùng codec có thể chia. Gọi \`repartition\` sau khi đọc chỉ giúp các bước sau chạy song song, còn bước đọc vẫn dùng một Task.`,
    keyPoints: [
      { text: 'Chia theo maxPartitionBytes 128 MB', keywords: ['maxpartitionbytes', '128'], weight: 2 },
      { text: 'Gzip không chia được nên một tệp một Task', keywords: ['không chia được', 'gzip', 'một task'], weight: 2 },
      { text: 'Chuyển sang Parquet, hoặc tách thành nhiều tệp', keywords: ['parquet', 'nhiều tệp', 'orc'] },
      { text: 'repartition không làm bước đọc nhanh hơn', keywords: ['repartition', 'bước đọc'] },
    ],
    followUps: ['Parquet chia Partition dựa trên gì?'],
    commonMistakes: ['Đề xuất thêm Executor cho vấn đề gzip.'],
  },
  {
    id: 'iv-spark-repart-01',
    topicId: 'spark',
    category: 'spark-data',
    conceptIds: ['spark-repartition-coalesce'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Repartition và Coalesce khác nhau thế nào? Vì sao coalesce(1) có thể làm job chậm đi rất nhiều?',
    referenceAnswer: `\`repartition\` luôn shuffle, có thể tăng hoặc giảm số Partition, và phân bố dữ liệu gần đều. \`coalesce\` chỉ gộp các Partition có sẵn, mặc định không shuffle, nên rẻ hơn nhưng chỉ dùng để giảm, và có thể tạo ra Partition lệch.

\`coalesce(1)\` chậm vì \`coalesce\` là Narrow Transformation, **nằm cùng Stage với các bước trước**, không có ranh giới Stage ở giữa. Vì vậy số Task của cả Stage bị kéo về 1: bước đọc và lọc phía trước cũng bị dồn vào một Task, dù cụm có hàng trăm core.

Còn \`repartition(1)\` tạo ra ranh giới Stage, nên các bước trước vẫn chạy song song, chỉ bước cuối mới gom về một Task. Dĩ nhiên vẫn nên hỏi: có cần đúng một tệp không? Tôi thường chọn số tệp dựa trên kích thước mong muốn, ví dụ tổng dung lượng chia cho 256 MB. Nếu dữ liệu đã giảm nhiều sau bước lọc, nên ưu tiên \`repartition\` để tệp có kích thước đều.`,
    keyPoints: [
      { text: 'repartition luôn shuffle, coalesce mặc định không', keywords: ['shuffle'], weight: 2 },
      { text: 'coalesce là Narrow, nằm cùng Stage với bước trước', keywords: ['narrow', 'cùng stage', 'không có ranh giới'], weight: 2 },
      { text: 'Vì vậy kéo cả chuỗi về ít Task', keywords: ['một task', 'ít task', 'kéo', 'dồn'] },
      { text: 'Chọn số tệp theo kích thước mong muốn', keywords: ['kích thước', 'số tệp', '256'] },
    ],
    followUps: ['Vì sao coalesce có thể tạo ra Partition lệch?'],
    commonMistakes: ['Khẳng định coalesce luôn tốt hơn vì rẻ hơn.'],
  },
  {
    id: 'iv-spark-cache-01',
    topicId: 'spark',
    category: 'spark-data',
    conceptIds: ['spark-cache-persist'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Khi nào nên cache, khi nào không? Cache khác checkpoint thế nào?',
    referenceAnswer: `Tôi chỉ cache khi có **hai điều kiện**: kết quả tốn kém và được dùng từ hai lần trở lên, ví dụ pipeline tách nhánh hoặc thuật toán lặp. Nếu dùng một lần, cache chỉ tốn bộ nhớ.

Tôi không cache trong các trường hợp: dữ liệu dùng một lần; dữ liệu quá lớn so với bộ nhớ; ngay sau khi đọc Parquet khi phía sau còn bộ lọc mạnh, vì sau khi cache thì bộ lọc không còn được đẩy xuống nguồn. Cache chiếm vùng Execution nên có thể gây thêm spill và GC. Tôi thường \`persist(MEMORY_AND_DISK)\` và luôn \`unpersist\` khi xong. Cần nhớ mặc định \`RDD.cache()\` là \`MEMORY_ONLY\` còn \`DataFrame.cache()\` là \`MEMORY_AND_DISK\`.

**Khác với checkpoint:** cache giữ lineage và lưu trên Executor, nên mất thì tính lại, và biến mất khi ứng dụng kết thúc. Checkpoint ghi vào nơi bền vững như HDFS, S3, và cắt lineage. Tôi dùng checkpoint khi lineage quá dài do lặp, hoặc với streaming để khôi phục sau khi khởi động lại.`,
    keyPoints: [
      { text: 'Cache khi kết quả tốn kém và dùng lại nhiều lần', keywords: ['dùng lại', 'hai lần', 'nhiều lần', 'tốn kém'], weight: 2 },
      { text: 'Có thể gây hại: chiếm bộ nhớ, mất pushdown', keywords: ['chiếm bộ nhớ', 'pushdown', 'spill', 'gc'] },
      { text: 'Cần unpersist sau khi dùng', keywords: ['unpersist'] },
      { text: 'Checkpoint cắt lineage và lưu bền vững', keywords: ['checkpoint', 'cắt lineage', 'bền vững'], weight: 2 },
    ],
    followUps: ['Storage Level có hậu tố _2 dùng khi nào?', 'Làm sao biết cache có đang được dùng không?'],
    commonMistakes: ['Cache mọi DataFrame.', 'Không biết cache cũng trì hoãn.'],
  },
  {
    id: 'iv-spark-bhj-01',
    topicId: 'spark',
    category: 'spark-join',
    conceptIds: ['spark-broadcast-join', 'spark-sort-merge-join'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Broadcast Join và Sort Merge Join khác nhau thế nào? Spark chọn chiến lược ra sao?',
    referenceAnswer: `Khác biệt nằm ở chỗ **di chuyển bảng nào**. Sort Merge Join shuffle cả hai bảng theo key, sắp xếp rồi trộn, nên tốn kém nhưng xử lý được hai bảng rất lớn vì có thể tràn ra đĩa. Broadcast Join chỉ gửi bảng nhỏ tới mọi Executor, nên bảng lớn không phải di chuyển, rất nhanh, nhưng bảng nhỏ phải vừa bộ nhớ của cả Driver và Executor.

Spark chọn dựa trên kích thước ước lượng và loại Join. Nếu có điều kiện bằng, và một bảng dưới \`autoBroadcastJoinThreshold\` (mặc định 10 MB), hoặc có gợi ý \`broadcast()\`, Spark dùng Broadcast. Nếu không, mặc định là Sort Merge Join. Loại Join cũng ảnh hưởng: \`LEFT JOIN\` chỉ phát được bên phải, \`FULL OUTER JOIN\` thì không phát được. Nếu không có điều kiện bằng, Spark phải dùng Nested Loop Join rất tốn.

Với **AQE**, Spark có thể đổi kế hoạch lúc chạy khi thấy kích thước thật nhỏ hơn dự kiến. Muốn biết chiến lược thực tế, tôi đọc kế hoạch cuối cùng trên tab SQL, thay vì giả định.`,
    keyPoints: [
      { text: 'Sort Merge shuffle và sắp xếp cả hai bảng', keywords: ['shuffle cả hai', 'sắp xếp', 'trộn', 'cả hai bảng'], weight: 2 },
      { text: 'Broadcast gửi bảng nhỏ, bảng lớn không di chuyển', keywords: ['bảng nhỏ', 'không shuffle', 'mọi executor'], weight: 2 },
      { text: 'Spark chọn theo ngưỡng 10 MB hoặc gợi ý', keywords: ['10 mb', 'autobroadcastjointhreshold', 'ngưỡng', 'gợi ý'] },
      { text: 'Loại Join ảnh hưởng đến khả năng Broadcast', keywords: ['left join', 'full outer', 'loại join'] },
      { text: 'AQE có thể đổi kế hoạch lúc chạy', keywords: ['aqe', 'lúc chạy'] },
    ],
    followUps: ['Vì sao Broadcast lớn có thể làm Driver OOM?', 'Vì sao LEFT JOIN không phát được bảng bên trái?'],
    commonMistakes: ['Không biết bảng Broadcast phải đi qua Driver.'],
  },
  {
    id: 'iv-spark-bhj-02',
    topicId: 'spark',
    category: 'spark-join',
    conceptIds: ['spark-broadcast-join', 'spark-driver'],
    interviewTypes: ['bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bạn tăng autoBroadcastJoinThreshold lên 1 GB để job nhanh hơn. Có những rủi ro nào, và bạn quản lý chúng ra sao?',
    referenceAnswer: `Tôi không muốn tăng ngưỡng toàn cục mà ưu tiên gợi ý \`broadcast()\` cho từng Join đã biết rõ, vì rủi ro của ngưỡng toàn cục khá lớn.

**Ước lượng có thể sai:** Spark dựa vào thống kê, nên một bảng được ước lượng 800 MB có thể lớn hơn nhiều sau khi giải nén. **Driver:** bảng phải gom về Driver, nên dễ OOM. **Executor:** mỗi Executor giữ một bản sao trong bộ nhớ, ép vùng Execution, gây thêm spill. **Thời gian:** Broadcast lớn có thể vượt \`broadcastTimeout\` 300 giây. **Nhiều Join:** nhiều bảng cùng được phát trong một truy vấn sẽ cộng dồn bộ nhớ. **Tăng trưởng:** bảng tăng dần, đến một ngày job đột ngột hỏng.

Để quản lý, tôi đảm bảo thống kê chính xác, giảm kích thước trước khi phát bằng cách lọc và chọn cột, và giám sát kích thước. Tôi cũng dựa vào AQE, vốn có ngưỡng riêng theo kích thước thật, an toàn hơn so với ước lượng tĩnh. Sau khi đổi, tôi đối chiếu số liệu Driver và Executor để đảm bảo không đổi OOM lấy tốc độ.`,
    keyPoints: [
      { text: 'Ước lượng kích thước có thể sai', keywords: ['ước lượng', 'thống kê', 'sai'] },
      { text: 'Rủi ro OOM ở Driver do gom dữ liệu', keywords: ['driver', 'oom'], weight: 2 },
      { text: 'Tốn bộ nhớ Executor và có thể vượt thời gian', keywords: ['bản sao', 'executor', 'timeout', 'quá thời gian'] },
      { text: 'Ưu tiên gợi ý cho từng Join hoặc AQE thay vì ngưỡng toàn cục', keywords: ['gợi ý', 'hint', 'aqe', 'từng join'], weight: 2 },
    ],
    followUps: ['Vì sao AQE an toàn hơn trong trường hợp này?'],
    commonMistakes: ['Chỉ nhìn vào lợi ích tốc độ.'],
  },
  {
    id: 'iv-spark-bhj-03',
    topicId: 'spark',
    category: 'spark-join',
    conceptIds: ['spark-broadcast-join'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Bảng chỉ có 5 MB nhưng Spark không dùng Broadcast, mà dùng Sort Merge Join. Vì sao có thể như vậy?',
    referenceAnswer: `Có vài khả năng, tôi kiểm tra lần lượt bằng \`explain()\`.

**Loại Join không cho phép.** Với \`LEFT JOIN\`, Spark chỉ phát được bảng bên phải. Nếu bảng 5 MB ở bên trái, cần giữ lại các dòng không khớp của nó, nên không phát được. \`FULL OUTER JOIN\` cũng vậy.

**Spark không biết bảng nhỏ.** Ước lượng dựa trên thống kê. Bảng được tạo từ truy vấn có UDF hoặc Join phức tạp có thể được ước lượng rất lớn. Đọc qua bảng Hive chưa có thống kê cũng tương tự.

**Ngưỡng đã bị tắt.** \`spark.sql.autoBroadcastJoinThreshold\` có thể được đặt là \`-1\`, hoặc Join có gợi ý khác như \`MERGE\`.

Cách xử lý là thêm gợi ý \`broadcast()\` nếu loại Join cho phép, hoặc đổi vị trí bảng trong logic nếu nghiệp vụ cho phép. Tôi cũng xem kế hoạch cuối cùng của AQE, vì có thể Spark đã đổi sang Broadcast lúc chạy.`,
    keyPoints: [
      { text: 'Loại Join không cho phép phát bên đó', keywords: ['left join', 'loại join', 'full outer', 'bên trái'], weight: 2 },
      { text: 'Ước lượng kích thước sai do thiếu thống kê', keywords: ['ước lượng', 'thống kê'], weight: 2 },
      { text: 'Ngưỡng bị tắt hoặc có gợi ý khác', keywords: ['tắt', 'gợi ý', 'hint', 'merge'] },
      { text: 'Kiểm tra bằng explain', keywords: ['explain', 'kế hoạch'] },
    ],
    followUps: ['Vì sao LEFT JOIN không thể phát bảng bên trái?'],
    commonMistakes: ['Nghĩ rằng chỉ cần bảng nhỏ là Spark chắc chắn sẽ Broadcast.'],
  },
  {
    id: 'iv-spark-smj-01',
    topicId: 'spark',
    category: 'spark-join',
    conceptIds: ['spark-sort-merge-join', 'spark-shuffle'],
    interviewTypes: ['bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao Spark mặc định chọn Sort Merge Join thay vì Shuffle Hash Join cho hai bảng lớn, dù hash thường nhanh hơn sắp xếp?',
    referenceAnswer: `Đó là lựa chọn ưu tiên **ổn định** hơn tốc độ cao nhất, với hệ thống phải chạy được trên dữ liệu có kích thước khó đoán.

**Shuffle Hash Join** xây bảng băm cho một bên trong từng Partition, nên không cần sắp xếp và thường nhanh hơn. Nhưng bên xây bảng băm phải vừa bộ nhớ Task. Với ước lượng sai hoặc key lệch, nó dễ gây OOM.

**Sort Merge Join** có thể dùng sắp xếp ngoài bộ nhớ, tràn dữ liệu ra đĩa khi thiếu. Nó có thể chậm đi nhưng thường vẫn chạy xong. Bước trộn chỉ cần giữ ít dữ liệu mỗi lần. Khi dữ liệu đã được sắp xếp, ví dụ qua bucketing, có thể bỏ qua bước sắp xếp. Nó hỗ trợ mọi loại equi-join.

Với job chạy tự động hằng đêm, chạy chậm vẫn tốt hơn nhiều so với chết giữa chừng. Vì vậy \`spark.sql.join.preferSortMergeJoin\` mặc định là true. Khi biết chắc một bên vừa bộ nhớ, tôi có thể dùng gợi ý \`SHUFFLE_HASH\`, và AQE cũng có thể chọn Shuffle Hash Join theo số liệu thực tế.`,
    keyPoints: [
      { text: 'Hash Join cần bảng băm vừa bộ nhớ, dễ OOM', keywords: ['vừa bộ nhớ', 'oom', 'bảng băm'], weight: 2 },
      { text: 'Sort Merge có thể tràn ra đĩa, nên ổn định', keywords: ['tràn', 'spill', 'ổn định', 'đĩa'], weight: 2 },
      { text: 'Ưu tiên ổn định khi kích thước khó đoán', keywords: ['khó đoán', 'ước lượng', 'ưu tiên ổn định'] },
      { text: 'Có thể dùng gợi ý hoặc AQE khi biết rõ dữ liệu', keywords: ['shuffle hash', 'gợi ý', 'aqe', 'hint'] },
    ],
    followUps: ['Khi nào bạn dùng gợi ý SHUFFLE_HASH?'],
    commonMistakes: ['Chỉ nói Sort Merge chậm hơn mà không nêu lý do được chọn.'],
  },
])
