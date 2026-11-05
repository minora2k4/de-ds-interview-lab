import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-hadoop-overview-01',
    topicId: 'hadoop',
    category: 'hadoop-foundation',
    conceptIds: ['hadoop-overview', 'hadoop-hdfs', 'hadoop-yarn', 'hadoop-mapreduce'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Hadoop gồm những thành phần chính nào, và chúng phối hợp với nhau thế nào khi chạy một job?',
    referenceAnswer: `Hadoop có ba lớp chính, mỗi lớp trả lời một câu hỏi. **HDFS** trả lời dữ liệu nằm ở đâu: tệp được chia thành các block 128 MB, mỗi block có 3 bản sao trên các DataNode, còn NameNode giữ metadata. **YARN** trả lời lấy tài nguyên từ đâu: ResourceManager quản lý toàn cụm, NodeManager quản lý từng máy, và tài nguyên được cấp dưới dạng Container. **MapReduce** trả lời tính như thế nào.

Khi chạy một job, client gửi ứng dụng tới ResourceManager. Nơi này cấp Container đầu tiên để chạy ApplicationMaster. ApplicationMaster hỏi vị trí block, rồi xin thêm Container, ưu tiên máy đang giữ dữ liệu. Các task đọc block, tính toán và ghi kết quả về HDFS. Task lỗi sẽ được chạy lại ở máy khác.

Điểm đáng nói là các lớp này tách rời, nên có thể thay MapReduce bằng Spark trong khi vẫn giữ HDFS và YARN.`,
    keyPoints: [
      { text: 'HDFS lưu trữ theo block và bản sao', keywords: ['hdfs', 'block', 'datanode', 'namenode'], weight: 2 },
      { text: 'YARN quản lý tài nguyên và cấp Container', keywords: ['yarn', 'resourcemanager', 'container', 'nodemanager'], weight: 2 },
      { text: 'MapReduce là lớp xử lý', keywords: ['mapreduce', 'map', 'reduce'] },
      { text: 'ApplicationMaster điều phối job', keywords: ['applicationmaster', 'application master'] },
      { text: 'Các lớp tách rời nên có thể thay bằng Spark', keywords: ['tách rời', 'thay thế', 'spark'] },
    ],
    followUps: ['Hadoop Common làm gì?', 'Điều gì xảy ra nếu máy chạy ApplicationMaster bị hỏng?'],
    commonMistakes: ['Xem Hadoop và MapReduce là một.', 'Nói NameNode lưu cả dữ liệu người dùng.'],
  },
  {
    id: 'iv-hadoop-overview-02',
    topicId: 'hadoop',
    category: 'hadoop-foundation',
    conceptIds: ['hadoop-overview', 'spark-overview', 'hadoop-mapreduce'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Có người nói Spark đã giết chết Hadoop. Bạn thấy câu này đúng đến đâu?',
    referenceAnswer: `Câu đó đúng một phần, vì nó gộp hai chuyện khác nhau. Hadoop gồm lưu trữ, tài nguyên và xử lý, còn Spark chỉ là một engine xử lý.

Ở lớp xử lý, câu này gần như đúng: với job mới, Spark thay MapReduce vì nhanh hơn với công việc nhiều bước, API dễ dùng hơn và có tối ưu tự động. MapReduce chủ yếu còn ở các job cũ và một số công cụ như DistCp.

Ở lớp lưu trữ và tài nguyên, Spark không thay được gì, vì nó không có hệ thống lưu trữ riêng và cần cluster manager. Rất nhiều cụm chạy Spark trên YARN và đọc HDFS.

Đối thủ thật của HDFS và YARN là đám mây: S3 thay HDFS vì co giãn độc lập và rẻ khi lưu lâu, Kubernetes thay YARN vì dùng chung một nền tảng với các ứng dụng khác. Xu hướng này đến từ việc tách lưu trữ khỏi tính toán. Tuy vậy, doanh nghiệp có quy định lưu dữ liệu tại chỗ và tải đều vẫn có lý do giữ Hadoop.`,
    keyPoints: [
      { text: 'Tách Hadoop thành các lớp, Spark chỉ thay lớp xử lý', keywords: ['lớp xử lý', 'thay mapreduce', 'chỉ là engine', 'engine xử lý'], weight: 2 },
      { text: 'Spark vẫn dùng HDFS và YARN được', keywords: ['spark trên yarn', 'đọc hdfs', 'không có lưu trữ', 'không lưu trữ'], weight: 2 },
      { text: 'Đám mây mới là thứ thay HDFS và YARN', keywords: ['s3', 'kubernetes', 'đám mây', 'cloud'], weight: 2 },
      { text: 'Vẫn có lý do giữ Hadoop tại chỗ', keywords: ['tại chỗ', 'on-premise', 'quy định', 'tải đều'] },
    ],
    followUps: ['Bạn sẽ di chuyển một cụm Hadoop 1 PB lên đám mây thế nào?', 'Mất gì khi chuyển từ HDFS sang S3?'],
    commonMistakes: ['Trả lời có hoặc không mà không tách từng lớp.', 'Cho rằng Spark có hệ thống lưu trữ riêng.'],
  },
  {
    id: 'iv-hadoop-overview-03',
    topicId: 'hadoop',
    category: 'hadoop-foundation',
    conceptIds: ['hadoop-overview', 'hadoop-hdfs', 'cloud-s3'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Công ty có cụm Hadoop 2 PB tại chỗ và muốn lên đám mây. Bạn cân nhắc những gì, và tiến hành thế nào?',
    referenceAnswer: `Tôi bắt đầu bằng câu hỏi có nên chuyển không. Nếu tải đều quanh năm, cụm tại chỗ có thể rẻ hơn. Nếu tải theo đợt, hoặc đang sắp phải thay phần cứng, đám mây có lợi vì tách lưu trữ khỏi tính toán.

Sau đó tôi kiểm kê: dữ liệu nào thật sự còn dùng, job nào còn chạy, tệp nhỏ ở đâu. Thường có một phần lớn dữ liệu lạnh, nên có thể lưu ở lớp rẻ hoặc xóa, không nhất thiết phải chuyển nguyên 2 PB.

Có vài điểm khác cần lưu ý khi chuyển từ HDFS sang S3. Rename trên HDFS là thao tác nguyên tử trên metadata, còn trên S3 là sao chép rồi xóa, nên cần committer phù hợp hoặc định dạng bảng như Iceberg. Liệt kê tệp chậm hơn và tính tiền theo lệnh gọi. Không còn locality, nên phải tính băng thông mạng.

Về cách làm, tôi chuyển theo đợt: dùng DistCp cho đợt đầu, chạy song song hai bên và so sánh kết quả, chuyển các job ít rủi ro trước. Job MapReduce cũ được viết lại bằng Spark khi có dịp, tránh làm cùng lúc mọi thứ. Chỉ tắt cụm cũ khi các bên đã xác nhận kết quả.`,
    keyPoints: [
      { text: 'Đánh giá có nên chuyển dựa trên mô hình tải và chi phí', keywords: ['tải đều', 'theo đợt', 'chi phí', 'phần cứng'], weight: 2 },
      { text: 'Kiểm kê và dọn dữ liệu trước', keywords: ['kiểm kê', 'dữ liệu lạnh', 'dọn', 'tệp nhỏ'] },
      { text: 'Khác biệt về rename, liệt kê và locality', keywords: ['rename', 'đổi tên', 'liệt kê', 'committer', 'locality'], weight: 2 },
      { text: 'Chuyển theo đợt, chạy song song và đối chiếu', keywords: ['theo đợt', 'song song', 'distcp', 'đối chiếu', 'so sánh'], weight: 2 },
    ],
    followUps: ['Bảo mật và phân quyền trên HDFS chuyển sang đám mây thế nào?', 'Bạn đo gì để biết việc chuyển đã thành công?'],
    commonMistakes: ['Chỉ nói về sao chép dữ liệu mà bỏ qua job và ngữ nghĩa của hệ thống tệp.', 'Chuyển toàn bộ một lần, không có giai đoạn chạy song song.'],
  },
  {
    id: 'iv-hadoop-distributed-01',
    topicId: 'hadoop',
    category: 'hadoop-foundation',
    conceptIds: ['hadoop-distributed-systems', 'hadoop-fault-tolerance'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Tại sao lại dùng nhiều máy thường thay vì một máy thật mạnh? Cách này tạo ra những khó khăn nào?',
    referenceAnswer: `Một máy mạnh có giới hạn vật lý, chi phí tăng nhanh hơn nhiều so với sức mạnh, và khi hỏng thì dừng toàn bộ. Nhiều máy thường cho phép mở rộng gần như không giới hạn, chi phí tăng tương đối đều, và đọc song song trên nhiều đĩa cho thông lượng rất cao.

Đổi lại có các khó khăn của hệ thống phân tán. Thứ nhất là lỗi một phần: máy hỏng là chuyện thường ngày, nên phải có bản sao và chạy lại task. Thứ hai là phát hiện lỗi: qua mạng không phân biệt được máy chết hay máy chậm, nên phải dùng heartbeat và thời hạn chờ. Thứ ba là thống nhất trạng thái: phải tránh việc hai nút cùng cho mình là chủ, nên Hadoop dùng quorum qua JournalNode. Thứ tư là phối hợp tốn chi phí: shuffle qua mạng làm tốc độ không tăng tuyến tính theo số máy.

Hadoop giấu phần lớn các khó khăn này khỏi người viết job, và đây chính là giá trị lớn nhất của nó.`,
    keyPoints: [
      { text: 'Một máy có giới hạn và chi phí tăng nhanh', keywords: ['giới hạn', 'chi phí tăng', 'đắt', 'mở rộng ngang'], weight: 2 },
      { text: 'Lỗi một phần là chuyện thường', keywords: ['lỗi một phần', 'máy hỏng', 'bản sao'], weight: 2 },
      { text: 'Khó phân biệt máy chết và máy chậm', keywords: ['heartbeat', 'máy chậm', 'thời hạn chờ', 'timeout'] },
      { text: 'Phải thống nhất trạng thái', keywords: ['quorum', 'đa số', 'split-brain', 'đồng thuận'] },
      { text: 'Tốc độ không tăng tuyến tính theo số máy', keywords: ['tuyến tính', 'shuffle', 'phối hợp'] },
    ],
    followUps: ['Theo định lý CAP thì HDFS nghiêng về phía nào?'],
    commonMistakes: ['Chỉ nói rẻ hơn mà không nêu khó khăn đi kèm.', 'Cho rằng thêm máy luôn làm job nhanh tương ứng.'],
  },
])
