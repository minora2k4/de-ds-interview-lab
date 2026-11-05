import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-spark-df-01',
    topicId: 'spark',
    category: 'spark-api',
    conceptIds: ['spark-dataframe', 'spark-rdd', 'spark-dataset'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'RDD, DataFrame và Dataset khác nhau thế nào? Bạn chọn API nào và vì sao?',
    referenceAnswer: `Điểm khác biệt cốt lõi là **Spark biết được bao nhiêu về dữ liệu và phép tính của bạn**.

Với **RDD**, mỗi phần tử là một đối tượng và hàm của bạn là hộp đen, nên Spark không tối ưu được, đổi lại bạn kiểm soát chi tiết. **DataFrame** có schema, phép tính là biểu thức cột, nên Catalyst có thể đẩy bộ lọc xuống, bỏ cột thừa, còn Tungsten lưu dữ liệu nhị phân gọn hơn. **Dataset** thêm kiểm tra kiểu khi biên dịch, nhưng chỉ có trên Scala và Java, và lambda buộc phải giải mã đối tượng nên giảm bớt lợi ích tối ưu.

Tôi mặc định dùng **DataFrame** cho dữ liệu có cấu trúc, đặc biệt với PySpark. Tôi dùng **Dataset** khi có codebase Scala lớn cần an toàn kiểu. Tôi chỉ dùng **RDD** khi dữ liệu thô chưa có cấu trúc hoặc cần kiểm soát Partitioner tùy chỉnh, và cố gắng chuyển sang DataFrame sớm nhất có thể.`,
    keyPoints: [
      { text: 'Schema là lý do giúp tối ưu được', keywords: ['schema', 'cấu trúc'], weight: 2 },
      { text: 'Nêu Catalyst và Tungsten', keywords: ['catalyst', 'tungsten'] },
      { text: 'Dataset có kiểm tra kiểu và chỉ có trên Scala, Java', keywords: ['kiểm tra kiểu', 'biên dịch', 'scala', 'java'] },
      { text: 'Lambda hoặc RDD là hộp đen với bộ tối ưu', keywords: ['hộp đen', 'lambda', 'không tối ưu'] },
      { text: 'Đưa ra tiêu chí chọn API rõ ràng', keywords: ['mặc định', 'ưu tiên', 'chọn', 'dùng dataframe'] },
    ],
    followUps: ['Vì sao lambda trên Dataset làm giảm hiệu năng?', 'PySpark có Dataset không?'],
    commonMistakes: ['Nói PySpark có Dataset.', 'Chỉ liệt kê định nghĩa mà không giải thích vì sao DataFrame tối ưu được.'],
  },
  {
    id: 'iv-spark-df-02',
    topicId: 'spark',
    category: 'spark-api',
    conceptIds: ['spark-dataframe', 'spark-catalyst'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao đọc Parquet bằng DataFrame có thể nhanh hơn rất nhiều so với đọc CSV bằng RDD, dù cùng dữ liệu?',
    referenceAnswer: `Có hai nguyên nhân cộng dồn: định dạng lưu trữ và API.

Parquet **lưu theo cột**, có sẵn schema, có min/max và số null cho từng nhóm dòng. Nhờ vậy có thể chỉ đọc đúng cột cần dùng và bỏ qua các nhóm dòng không khớp. CSV lưu theo dòng, không có metadata, nên phải đọc và tách toàn bộ từng dòng, kể cả cột không dùng.

DataFrame cho phép Catalyst tận dụng các khả năng đó: **Column Pruning** bỏ cột thừa, **Predicate Pushdown** đẩy bộ lọc xuống tầng đọc, và **Partition Pruning** bỏ qua cả thư mục. Với RDD, Spark không biết bạn cần gì, nên đọc nguyên dòng rồi mới chạy hàm của bạn.

Sau khi đọc, DataFrame lưu ở định dạng nhị phân gọn nên ít GC hơn, còn RDD tạo nhiều đối tượng JVM. Vì vậy một truy vấn lọc theo ngày trên bảng 300 cột có thể đọc ít đi hàng trăm lần mà không phải viết thêm code nào.`,
    keyPoints: [
      { text: 'Parquet lưu theo cột, có metadata', keywords: ['lưu theo cột', 'columnar', 'min max', 'metadata'], weight: 2 },
      { text: 'Column Pruning', keywords: ['column pruning', 'chỉ đọc cột', 'bỏ cột'] },
      { text: 'Predicate Pushdown hoặc Partition Pruning', keywords: ['predicate pushdown', 'partition pruning', 'pushdown'] },
      { text: 'RDD không biết cấu trúc nên phải đọc hết', keywords: ['không biết', 'hộp đen', 'đọc toàn bộ', 'đọc nguyên dòng'] },
    ],
    followUps: ['Bộ lọc nào không đẩy xuống được?', 'Khi nào định dạng dòng như Avro lại phù hợp hơn?'],
    commonMistakes: ['Chỉ nói Parquet được nén tốt mà không nhắc tới việc đọc theo cột.'],
  },
  {
    id: 'iv-spark-df-03',
    topicId: 'spark',
    category: 'spark-api',
    conceptIds: ['spark-dataframe'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'DataFrame của Spark và pandas khác nhau thế nào? Bạn có thể dùng tư duy pandas khi viết Spark không?',
    referenceAnswer: `Tên giống nhau nhưng bản chất khác nhau. **pandas** chạy trên một máy, trong RAM, chạy ngay từng bước và có thể sửa tại chỗ. **Spark DataFrame** phân tán trên nhiều máy, bất biến và trì hoãn, chỉ chạy khi gặp Action.

Điều này dẫn tới những thói quen phải bỏ khi viết Spark. Không nên duyệt từng dòng bằng vòng lặp, vì dữ liệu không nằm trên một máy, mà phải dùng biểu thức cột. Spark không có chỉ mục và không đảm bảo thứ tự dòng, trừ khi có \`orderBy\`. Mỗi \`groupBy\` hoặc \`join\` có thể gây shuffle tốn kém, nên cần nghĩ về Partition. Gọi \`toPandas\` trên dữ liệu lớn sẽ gom hết về Driver và có thể gây OOM.

Tư duy về bảng và cột vẫn dùng được, còn tư duy về vị trí dữ liệu và chi phí thực thi thì phải học mới.`,
    keyPoints: [
      { text: 'Phân tán so với một máy', keywords: ['phân tán', 'một máy', 'nhiều máy'], weight: 2 },
      { text: 'Trì hoãn so với chạy ngay', keywords: ['trì hoãn', 'lazy', 'chạy ngay'] },
      { text: 'Bất biến, không có chỉ mục và không đảm bảo thứ tự', keywords: ['bất biến', 'chỉ mục', 'thứ tự'] },
      { text: 'toPandas có thể gây OOM ở Driver', keywords: ['topandas', 'oom', 'driver'] },
    ],
    followUps: ['Khi nào bạn chuyển từ pandas sang Spark?', 'Vì sao toPandas nguy hiểm?'],
    commonMistakes: ['Dùng vòng lặp trên từng dòng trong Spark.'],
  },
  {
    id: 'iv-spark-rdd-01',
    topicId: 'spark',
    category: 'spark-api',
    conceptIds: ['spark-rdd', 'spark-lazy-evaluation'],
    interviewTypes: ['bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'RDD chịu lỗi bằng cách nào? Vì sao Spark không đơn giản là sao chép mọi kết quả trung gian như HDFS?',
    referenceAnswer: `RDD chịu lỗi bằng **lineage**: mỗi RDD ghi lại RDD cha và phép biến đổi đã tạo ra nó. Khi một Partition bị mất, Spark chỉ chạy lại các bước cần thiết để dựng lại đúng Partition đó.

Spark không sao chép vì chi phí. Sao chép mọi kết quả trung gian nghĩa là ghi và truyền qua mạng rất nhiều lần, ngay cả trong trường hợp bình thường, khi phần lớn thời gian không có lỗi nào. Đó chính là thứ làm MapReduce chậm. Lineage trả chi phí **chỉ khi có lỗi**.

Đánh đổi xuất hiện khi lineage quá dài hoặc có Wide Transformation, vì một Partition bị mất có thể kéo theo tính lại nhiều dữ liệu. Khi đó nên dùng **checkpoint** để lưu ra bộ nhớ bền vững và cắt lineage, hoặc persist với hậu tố \`_2\` nếu muốn có bản sao. File shuffle trên đĩa cũng giúp không phải tính lại từ đầu, vì Stage sau có thể đọc lại từ đó.`,
    keyPoints: [
      { text: 'Lineage ghi lại cách tạo ra dữ liệu', keywords: ['lineage', 'dòng dõi'], weight: 2 },
      { text: 'Chỉ tính lại Partition bị mất', keywords: ['tính lại', 'partition bị mất', 'dựng lại'] },
      { text: 'Sao chép tốn kém ngay cả khi không có lỗi', keywords: ['tốn', 'chi phí', 'khi không có lỗi', 'chỉ khi có lỗi'], weight: 2 },
      { text: 'Dùng checkpoint khi lineage quá dài', keywords: ['checkpoint', 'cắt lineage'] },
    ],
    followUps: ['checkpoint khác cache ở điểm nào?', 'Narrow và Wide dependency ảnh hưởng thế nào đến việc khôi phục?'],
    commonMistakes: ['Nói RDD tự sao chép dữ liệu sang nhiều máy.'],
  },
  {
    id: 'iv-spark-ds-01',
    topicId: 'spark',
    category: 'spark-api',
    conceptIds: ['spark-dataset'],
    interviewTypes: ['bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Dataset đảm bảo an toàn kiểu, vậy vì sao nhiều nhóm Scala vẫn chọn DataFrame cho phần cần hiệu năng?',
    referenceAnswer: `Vì an toàn kiểu có giá. Khi viết lambda trên Dataset, như \`ds.map(o => ...)\`, Spark phải dùng **Encoder để giải mã** từ định dạng nhị phân của Tungsten thành đối tượng JVM, chạy hàm rồi mã hóa lại. Việc này tốn CPU và tạo nhiều đối tượng, làm tăng GC.

Quan trọng hơn, lambda là **hộp đen với Catalyst**. Spark không biết bạn chỉ dùng một trường nên phải giải mã cả đối tượng, không đẩy được bộ lọc xuống tầng đọc và không bỏ được cột thừa.

Vì vậy nhiều nhóm dùng cách kết hợp: Dataset ở ranh giới của thư viện để có hợp đồng dữ liệu rõ ràng, và biểu thức cột ở các phần chạy nhiều dữ liệu. Trước khi quyết định, tôi so sánh \`explain()\` để xem bộ lọc có được đẩy xuống hay không, thay vì giả định.`,
    keyPoints: [
      { text: 'Lambda buộc giải mã đối tượng qua Encoder', keywords: ['encoder', 'giải mã', 'đối tượng'], weight: 2 },
      { text: 'Catalyst không nhìn được bên trong lambda', keywords: ['hộp đen', 'catalyst', 'không tối ưu', 'pushdown'], weight: 2 },
      { text: 'Tăng GC', keywords: ['gc'] },
      { text: 'Kết hợp Dataset và biểu thức cột', keywords: ['kết hợp', 'biểu thức cột', 'ranh giới'] },
    ],
    followUps: ['Làm sao chứng minh bộ lọc đã được đẩy xuống?'],
    commonMistakes: ['Cho rằng Dataset nhanh hơn vì có kiểu.'],
  },
  {
    id: 'iv-spark-sql-01',
    topicId: 'spark',
    category: 'spark-api',
    conceptIds: ['spark-sql', 'spark-catalyst'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Nên viết logic bằng Spark SQL hay DataFrame API? Có khác nhau về hiệu năng không?',
    referenceAnswer: `Về hiệu năng thì không, vì cả hai được biên dịch thành cùng một Logical Plan, cùng đi qua Catalyst và cho ra cùng một Physical Plan. Có thể kiểm tra bằng \`explain()\`.

Lựa chọn dựa trên việc đọc và bảo trì. **SQL** dễ đọc với logic bảng, Join và tổng hợp, phù hợp khi nhóm có nhiều nhà phân tích, nhưng sai tên cột chỉ phát hiện khi chạy và khó tái sử dụng. **DataFrame API** dễ tách hàm, ghép điều kiện động, viết test đơn vị và được IDE hỗ trợ.

Tôi thường kết hợp: dùng DataFrame API cho các bước tạo dựng có điều kiện, dùng SQL cho các truy vấn tổng hợp dài. Điểm cần tránh là coi cách viết nào đó tự động nhanh hơn, vì chất lượng logic và UDF mới là thứ quyết định.`,
    keyPoints: [
      { text: 'Cùng kế hoạch, cùng hiệu năng', keywords: ['cùng kế hoạch', 'cùng một', 'như nhau', 'catalyst'], weight: 2 },
      { text: 'Có thể kiểm tra bằng explain', keywords: ['explain'] },
      { text: 'Chọn theo khả năng đọc, tái sử dụng và kiểm thử', keywords: ['đọc', 'tái sử dụng', 'kiểm thử', 'test', 'bảo trì'], weight: 2 },
    ],
    followUps: ['ANSI mode trong Spark 4 thay đổi điều gì?'],
    commonMistakes: ['Khẳng định một cách viết luôn nhanh hơn.'],
  },
  {
    id: 'iv-spark-py-01',
    topicId: 'spark',
    category: 'spark-api',
    conceptIds: ['spark-pyspark', 'spark-executor'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'PySpark có chậm hơn Scala Spark không? Điều gì quyết định sự khác biệt đó?',
    referenceAnswer: `Câu trả lời phụ thuộc vào việc dữ liệu có phải đi qua Python hay không.

Khi chỉ dùng **DataFrame và hàm tích hợp**, Python chỉ dựng kế hoạch qua Py4J, còn dữ liệu được xử lý hoàn toàn trên JVM. Khi đó hiệu năng gần như bằng Scala.

Khi dùng **UDF Python**, mỗi Executor phải chạy thêm tiến trình Python. Dữ liệu được tuần tự hóa từ JVM sang Python rồi quay lại, tốn CPU. Bộ nhớ của tiến trình Python nằm ngoài heap, có thể khiến container bị giết. Catalyst cũng không tối ưu được bên trong hàm.

Cách giảm thiểu theo thứ tự: dùng hàm tích hợp nếu có, sau đó **Pandas UDF** qua Arrow để chuyển dữ liệu theo lô dạng cột, và chỉ dùng UDF từng dòng khi không còn cách nào khác. Khi phân tích, tôi xem Spark UI hoặc CPU trên Executor để biết thời gian có nằm ở Python không, rồi mới quyết định viết lại.`,
    keyPoints: [
      { text: 'Hàm tích hợp chạy trên JVM, gần bằng Scala', keywords: ['jvm', 'tích hợp', 'py4j', 'gần bằng'], weight: 2 },
      { text: 'UDF phải chuyển dữ liệu sang tiến trình Python', keywords: ['tiến trình python', 'tuần tự hóa', 'serialize', 'chuyển dữ liệu'], weight: 2 },
      { text: 'Pandas UDF và Arrow giảm chi phí', keywords: ['pandas udf', 'arrow'] },
      { text: 'Bộ nhớ Python nằm ngoài heap', keywords: ['ngoài heap', 'overhead'] },
    ],
    followUps: ['Vì sao Pandas UDF nhanh hơn?', 'Làm sao biết UDF là nút nghẽn?'],
    commonMistakes: ['Khẳng định PySpark luôn chậm hơn Scala nhiều lần.'],
  },
])
