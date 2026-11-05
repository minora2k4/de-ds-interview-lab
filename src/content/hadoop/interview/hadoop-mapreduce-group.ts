import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-hadoop-mapreduce-01',
    topicId: 'hadoop',
    category: 'hadoop-mapreduce-group',
    conceptIds: ['hadoop-mapreduce', 'hadoop-shuffle-sort', 'hadoop-inputsplit'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Một job MapReduce chạy qua những bước nào? Hãy lấy ví dụ đếm từ.',
    referenceAnswer: `Giả sử đếm số lần xuất hiện của từng từ trong nhiều tệp lớn.

Đầu tiên, InputFormat chia đầu vào thành các InputSplit, và mỗi split tương ứng một Map task. RecordReader biến byte thành từng dòng. Hàm **Map** nhận một dòng, phát ra các cặp như \`(từ, 1)\`.

Đầu ra được đưa vào bộ đệm, chia theo Partition bằng cách băm key, sắp xếp theo key rồi ghi xuống đĩa cục bộ. Nếu có **Combiner**, các cặp cùng từ được cộng trước ngay trên máy, nên bớt dữ liệu phải truyền.

Tiếp theo là **Shuffle**: mỗi Reducer lấy phần của mình từ mọi Map task qua HTTP, rồi gộp lại theo thứ tự key. Vì thế mọi giá trị của một từ nằm liền nhau. Hàm **Reduce** nhận một từ và danh sách giá trị, cộng lại rồi ghi kết quả ra HDFS, mỗi Reducer một tệp.

Trong cả quá trình, framework lo việc chia máy và chạy lại task lỗi. Người viết job chỉ cần viết Map và Reduce.`,
    keyPoints: [
      { text: 'Chia đầu vào thành InputSplit', keywords: ['inputsplit', 'input split', 'split'] },
      { text: 'Map phát ra cặp key-value', keywords: ['map', 'key-value', 'key value', 'cặp'], weight: 2 },
      { text: 'Shuffle gom theo key', keywords: ['shuffle', 'gom', 'cùng key'], weight: 2 },
      { text: 'Reduce tổng hợp, kết quả ra HDFS', keywords: ['reduce', 'tổng hợp', 'hdfs'], weight: 2 },
      { text: 'Combiner giảm dữ liệu truyền', keywords: ['combiner'] },
    ],
    followUps: ['Đầu ra của Map được lưu ở đâu?', 'Có bao nhiêu tệp kết quả?'],
    commonMistakes: ['Nói đầu ra Map ghi lên HDFS.', 'Bỏ qua bước sắp xếp và Partition.'],
  },
  {
    id: 'iv-hadoop-mapreduce-02',
    topicId: 'hadoop',
    category: 'hadoop-mapreduce-group',
    conceptIds: ['hadoop-mapreduce', 'spark-overview', 'spark-shuffle'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao Spark thường nhanh hơn MapReduce? Có phải chỉ vì Spark chạy trong bộ nhớ không?',
    referenceAnswer: `Không chỉ vì bộ nhớ. Spark vẫn ghi file shuffle xuống đĩa, và có thể spill. Có bốn lý do chính.

Thứ nhất là **mô hình thực thi**. MapReduce chỉ có đúng một Map và một Reduce mỗi job, nên pipeline nhiều bước phải nối nhiều job, và mỗi job ghi ra HDFS với 3 bản sao. Spark biểu diễn cả chuỗi thành một DAG nhiều Stage, không phải ghi ra HDFS ở giữa.

Thứ hai là **tối ưu toàn cục**. Nhờ lazy evaluation, Spark thấy toàn bộ kế hoạch, nên Catalyst đẩy bộ lọc xuống, chọn chiến lược Join, còn AQE điều chỉnh theo số liệu thật. MapReduce không có cái nhìn này.

Thứ ba là **task chạy nhanh hơn**. MapReduce thường khởi động JVM riêng cho mỗi task. Spark chạy nhiều task trong Executor sống lâu.

Thứ tư là **shuffle và cache**. Spark không bắt buộc sắp xếp, và có thể giữ dữ liệu trong bộ nhớ để dùng lại, rất có lợi cho thuật toán lặp.

Với job một lần duyệt và dữ liệu vượt xa bộ nhớ, khoảng cách nhỏ hơn nhiều. Con số gấp 100 lần chỉ đúng cho một số bài toán lặp.`,
    keyPoints: [
      { text: 'Không chỉ do bộ nhớ, Spark vẫn ghi đĩa', keywords: ['không chỉ', 'vẫn ghi đĩa', 'file shuffle'], weight: 2 },
      { text: 'DAG thay vì nối nhiều job', keywords: ['dag', 'nối nhiều job', 'nhiều stage'], weight: 2 },
      { text: 'Tối ưu toàn cục nhờ lazy evaluation và Catalyst', keywords: ['catalyst', 'lazy', 'tối ưu toàn cục', 'aqe'], weight: 2 },
      { text: 'Executor sống lâu, không khởi động JVM mỗi task', keywords: ['jvm', 'executor', 'sống lâu'] },
      { text: 'Không bắt buộc sắp xếp, có cache', keywords: ['sắp xếp', 'cache'] },
    ],
    followUps: ['Khi nào MapReduce vẫn là lựa chọn hợp lý?', 'Spark mất gì khi không ghi ra HDFS giữa các bước?'],
    commonMistakes: ['Trả lời đơn giản là Spark chạy trong RAM.', 'Khẳng định Spark luôn nhanh hơn 100 lần.'],
  },
  {
    id: 'iv-hadoop-mapreduce-03',
    topicId: 'hadoop',
    category: 'hadoop-mapreduce-group',
    conceptIds: ['hadoop-mapreduce', 'hadoop-shuffle-sort', 'spark-data-skew'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Job MapReduce chạy tới 99% rồi một Reducer chạy mãi không xong. Bạn điều tra và xử lý thế nào?',
    referenceAnswer: `Đầu tiên tôi phân biệt hai khả năng: máy có vấn đề, hay dữ liệu bị lệch.

Tôi xem bộ đếm của Reducer đó so với các Reducer khác, nhất là \`Reduce input records\` và \`Reduce shuffle bytes\`. Nếu số liệu tương đương mà nó vẫn chậm, nhiều khả năng do máy: đĩa sắp hỏng, hoặc mạng kém. Speculative Execution có thể giúp, hoặc đưa máy đó ra khỏi cụm.

Nếu nó nhận nhiều dữ liệu hơn hẳn thì đó là lệch dữ liệu. Vì HashPartitioner đưa mọi giá trị của một key về cùng một Reducer, một key lớn không thể tách được, và **Speculative không giúp được gì**, vì bản chạy thêm cũng phải xử lý đúng lượng dữ liệu đó. Tăng số Reducer cũng không giúp, nếu nguyên nhân là một key đơn lẻ.

Tôi đếm top key để tìm nguyên nhân, thường là null hoặc giá trị mặc định. Cách xử lý theo thứ tự: lọc key rác, dùng Combiner nếu phép tính cho phép, viết Partitioner riêng, hoặc thêm muối vào key rồi tổng hợp hai bước. Với Join có thể dùng map-side join khi một bên nhỏ. Về lâu dài, tôi cân nhắc chuyển sang Spark vì đã có AQE xử lý một phần vấn đề này.`,
    keyPoints: [
      { text: 'Phân biệt lỗi máy và lệch dữ liệu qua bộ đếm', keywords: ['bộ đếm', 'counter', 'so sánh', 'reduce input'], weight: 3 },
      { text: 'Một key luôn về cùng Reducer', keywords: ['cùng reducer', 'hashpartitioner', 'một key'], weight: 2 },
      { text: 'Speculative không giúp được với lệch dữ liệu', keywords: ['speculative', 'không giúp'], weight: 2 },
      { text: 'Lọc key rác', keywords: ['null', 'key rác', 'lọc'] },
      { text: 'Thêm muối hoặc Partitioner riêng', keywords: ['muối', 'salting', 'partitioner riêng', 'custom partitioner'] },
    ],
    followUps: ['Viết Partitioner riêng có giới hạn gì?', 'Thêm muối ảnh hưởng thế nào đến tính đúng đắn của kết quả?'],
    commonMistakes: ['Đề xuất tăng số Reducer trong mọi trường hợp.', 'Nghĩ rằng Speculative Execution sẽ giải quyết được.'],
  },
  {
    id: 'iv-hadoop-split-01',
    topicId: 'hadoop',
    category: 'hadoop-mapreduce-group',
    conceptIds: ['hadoop-inputsplit', 'hadoop-hdfs'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'InputSplit và Block khác nhau thế nào? Điều gì xảy ra với một bản ghi nằm vắt qua hai block?',
    referenceAnswer: `Block là cách HDFS chia dữ liệu **vật lý** để lưu trữ. Nó cắt đúng theo số byte, mặc định 128 MB, và không quan tâm nội dung. InputSplit là cách MapReduce chia công việc theo **logic**: nó chỉ mô tả đường dẫn, vị trí, độ dài và các máy gợi ý, không chứa dữ liệu. Mỗi split tương ứng một Map task.

Vì HDFS cắt theo byte nên một dòng có thể nằm vắt qua hai block. Nếu mỗi Map task đọc đúng block của mình thì bản ghi sẽ bị vỡ. RecordReader giải quyết việc này với quy ước: mỗi split đọc tiếp cho hết bản ghi cuối, kể cả khi phải đọc sang block sau qua mạng, và split không ở đầu tệp thì bỏ qua dòng dở đầu tiên. Nhờ vậy mỗi dòng được xử lý đúng một lần.

Thường thì số split bằng số block, nhưng không phải luôn vậy. Tệp 140 MB có 2 block nhưng 1 split do hệ số dư 1,1. Tệp gzip nhiều block vẫn chỉ có 1 split. Còn \`split.minsize\` lớn sẽ làm split gồm nhiều block.`,
    keyPoints: [
      { text: 'Block là vật lý', keywords: ['vật lý', 'physical', 'theo byte'], weight: 3 },
      { text: 'InputSplit là logic', keywords: ['logic', 'logical', 'mô tả'], weight: 3 },
      { text: 'RecordReader xử lý bản ghi vắt qua block', keywords: ['recordreader', 'record reader', 'đọc tiếp', 'bỏ qua'], weight: 2 },
      { text: 'Số split có thể khác số block', keywords: ['gzip', 'khác số block', '140', 'minsize'] },
    ],
    followUps: ['Vì sao gzip không chia được?', 'Khái niệm tương đương trong Spark là gì?'],
    commonMistakes: ['Nói split và block là một.', 'Nói bản ghi bị cắt đôi và mất dữ liệu.'],
  },
  {
    id: 'iv-hadoop-split-02',
    topicId: 'hadoop',
    category: 'hadoop-mapreduce-group',
    conceptIds: ['hadoop-inputsplit', 'spark-partition', 'spark-small-files'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Một job có 200.000 Map task nhưng dữ liệu chỉ 400 GB. Nguyên nhân có thể là gì, và cách khắc phục?',
    referenceAnswer: `Tính nhanh thì 400 GB chia cho 200.000 là khoảng 2 MB mỗi task, trong khi một split bình thường khoảng 128 MB, tức chỉ cần khoảng 3.200 task. Vì FileInputFormat tạo ít nhất một split cho mỗi tệp, nguyên nhân gần như chắc chắn là **nhiều tệp nhỏ**.

Hậu quả khá nặng. Khởi động task mất thời gian, nên phần lớn thời gian trôi vào chi phí này thay vì xử lý. ApplicationMaster phải theo dõi 200.000 task. NameNode nhận rất nhiều yêu cầu, và mỗi tệp còn chiếm bộ nhớ của nó.

Về khắc phục, có giải pháp trước mắt và lâu dài. Trước mắt, tôi dùng \`CombineFileInputFormat\` để gộp nhiều tệp vào một split, mà không phải sửa dữ liệu. Về lâu dài, phải sửa nơi sinh ra tệp nhỏ, gộp dữ liệu đã có bằng một job gộp định kỳ, và chuyển sang định dạng như Parquet với kích thước tệp hợp lý.

Hiện tượng này cũng xuất hiện trong Spark, chi tiết ở [[spark-small-files]], dù Spark có \`openCostInBytes\` để gộp tệp vào Partition.`,
    keyPoints: [
      { text: 'Tính ra khoảng 2 MB mỗi task và kết luận do tệp nhỏ', keywords: ['tệp nhỏ', '2 mb', 'nhiều tệp'], weight: 3 },
      { text: 'Mỗi tệp tạo ít nhất một split', keywords: ['ít nhất một split', 'mỗi tệp', 'một split'], weight: 2 },
      { text: 'Tốn chi phí khởi động và theo dõi task', keywords: ['khởi động', 'theo dõi', 'namenode'] },
      { text: 'CombineFileInputFormat', keywords: ['combinefileinputformat', 'combine'], weight: 2 },
      { text: 'Sửa nguồn và gộp định kỳ', keywords: ['gộp', 'compaction', 'sửa nguồn'] },
    ],
    followUps: ['Nếu các tệp bị nén bằng gzip thì sao?'],
    commonMistakes: ['Đề xuất tăng block size.', 'Chỉ xử lý ở phía đọc mà không chặn nguồn sinh ra tệp nhỏ.'],
  },
  {
    id: 'iv-hadoop-shuffle-01',
    topicId: 'hadoop',
    category: 'hadoop-mapreduce-group',
    conceptIds: ['hadoop-shuffle-sort', 'spark-shuffle'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Mô tả chi tiết Shuffle and Sort trong MapReduce, và so sánh với shuffle của Spark.',
    referenceAnswer: `Mục đích là đưa mọi giá trị của một key về cùng một Reducer khi dữ liệu lớn hơn bộ nhớ, và sắp xếp là cách đơn giản để làm việc đó.

**Phía Map:** đầu ra vào bộ đệm 100 MB. Khi đầy 80%, một luồng nền chia theo Partition, sắp xếp theo key, chạy Combiner nếu có, rồi spill xuống đĩa cục bộ. Khi Map xong, các tệp spill được gộp thành một tệp đã sắp xếp theo Partition.

**Phía Reduce:** dịch vụ shuffle trên NodeManager phục vụ các tệp đó, Reducer dùng 5 luồng lấy song song qua HTTP. Dữ liệu vào bộ nhớ rồi gộp xuống đĩa khi đầy. Cuối cùng, gộp các luồng đã sắp xếp và gọi Reduce cho từng key. Hai bước shuffle và sort diễn ra đồng thời.

**So với Spark:** cả hai đều ghi file trung gian trên đĩa cục bộ và truyền qua mạng. Khác biệt lớn nhất là MapReduce **luôn sắp xếp**, còn Spark chỉ sắp xếp khi cần, và có thể dùng băm để tổng hợp. Spark tự tổng hợp sơ bộ với DataFrame, còn MapReduce cần khai báo Combiner. Spark có AQE để điều chỉnh số Partition, còn số Reducer của MapReduce phải đặt trước, mặc định chỉ là 1.`,
    keyPoints: [
      { text: 'Bộ đệm, spill và sắp xếp phía Map', keywords: ['bộ đệm', 'spill', 'tràn', '100 mb'], weight: 2 },
      { text: 'Reducer lấy qua HTTP từ dịch vụ trên NodeManager', keywords: ['http', 'nodemanager', 'lấy song song'], weight: 2 },
      { text: 'Gộp các luồng đã sắp xếp', keywords: ['gộp', 'merge'] },
      { text: 'MapReduce luôn sắp xếp, Spark chỉ khi cần', keywords: ['luôn sắp xếp', 'chỉ khi cần', 'không bắt buộc'], weight: 2 },
      { text: 'AQE và số Partition của Spark', keywords: ['aqe', 'số partition', 'số reducer'] },
    ],
    followUps: ['Chỉ số nào cho biết nên tăng bộ đệm sắp xếp?', 'Vì sao Reducer không đợi Map xong hết rồi mới chạy?'],
    commonMistakes: ['Nói sắp xếp chỉ xảy ra phía Reducer.', 'Nói Map task phục vụ dữ liệu cho Reducer.'],
  },
])
