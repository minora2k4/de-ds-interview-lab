import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-hadoop-fault-01',
    topicId: 'hadoop',
    category: 'hadoop-reliability',
    conceptIds: ['hadoop-fault-tolerance', 'hadoop-mapreduce', 'hadoop-block-replication'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Hadoop xử lý lỗi thế nào ở từng lớp? Vì sao Map task đã xong vẫn có thể phải chạy lại, còn Reduce đã xong thì không?',
    referenceAnswer: `Hadoop giả định máy luôn có thể hỏng, nên mỗi lớp có cơ chế riêng.

Ở **HDFS**, mỗi block có nhiều bản sao. Client kiểm tra checksum và chuyển sang bản khác khi sai. DataNode chết thì NameNode lên lịch sao chép lại. Ở **MapReduce**, task lỗi được thử lại, tối đa 4 lần, trên máy khác nếu có thể. Task không báo tiến độ trong 10 phút thì bị giết. Ở lớp **điều phối**, ApplicationMaster hỏng thì được khởi động lại, còn NameNode và ResourceManager có HA.

Việc có phải chạy lại hay không phụ thuộc vào **đầu ra đang nằm ở đâu**. Map ghi đầu ra lên đĩa cục bộ, vì đây là dữ liệu tạm và ghi lên HDFS với 3 bản sao rất tốn. Nếu máy chết trước khi mọi Reducer lấy xong, đầu ra đó mất, nên Map phải chạy lại dù đã hoàn thành. Reduce ghi kết quả lên HDFS với nhiều bản sao, nên máy chết không làm mất kết quả, và không cần chạy lại.

Do task có thể chạy nhiều lần, task phải không có tác dụng phụ ra bên ngoài.`,
    keyPoints: [
      { text: 'HDFS: bản sao và checksum', keywords: ['bản sao', 'checksum', 'sao chép lại'], weight: 2 },
      { text: 'MapReduce: thử lại task', keywords: ['thử lại', 'chạy lại', '4 lần'], weight: 2 },
      { text: 'Đầu ra Map trên đĩa cục bộ nên có thể mất', keywords: ['đĩa cục bộ', 'local disk', 'cục bộ'], weight: 3 },
      { text: 'Đầu ra Reduce trên HDFS nên an toàn', keywords: ['trên hdfs', 'lên hdfs', 'ghi hdfs'], weight: 2 },
      { text: 'HA cho nút điều phối', keywords: ['ha', 'high availability', 'standby'] },
    ],
    followUps: ['Khi nào cả job thất bại?', 'So sánh với cách Spark phục hồi bằng lineage.'],
    commonMistakes: ['Nói Map đã xong thì không bao giờ chạy lại.', 'Nhầm Speculative Execution với thử lại task.'],
  },
  {
    id: 'iv-hadoop-fault-02',
    topicId: 'hadoop',
    category: 'hadoop-reliability',
    conceptIds: ['hadoop-fault-tolerance'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Speculative Execution là gì? Khi nào nên tắt nó?',
    referenceAnswer: `Stage chỉ xong khi task cuối cùng xong, nên một task chậm có thể giữ chân cả job, thường do máy có đĩa kém hoặc đang quá tải. Speculative Execution giải quyết việc này: khi phát hiện task chậm hơn hẳn các task khác, hệ thống chạy thêm một bản trên máy khác, lấy kết quả của bản xong trước và giết bản còn lại. Trong MapReduce, nó mặc định bật cho cả Map và Reduce.

Nó phải được phân biệt với thử lại task: thử lại xử lý task đã lỗi, còn speculative xử lý task vẫn đang chạy nhưng chậm.

Có ba trường hợp nên tắt. Thứ nhất, task có tác dụng phụ ra hệ thống ngoài, như ghi vào cơ sở dữ liệu hay gọi API, vì hai bản cùng chạy sẽ ghi trùng. Thứ hai, chậm do **lệch dữ liệu**: bản chạy thêm cũng phải xử lý đúng lượng dữ liệu đó, nên chỉ tốn thêm tài nguyên. Thứ ba, cụm đang thiếu tài nguyên, vì các bản chạy thêm chiếm chỗ của task khác.`,
    keyPoints: [
      { text: 'Chạy thêm bản của task chậm, lấy bản xong trước', keywords: ['bản xong trước', 'chạy thêm', 'bản sao của task'], weight: 3 },
      { text: 'Xử lý task chậm, khác với thử lại', keywords: ['task chậm', 'chậm', 'khác thử lại'], weight: 2 },
      { text: 'Không dùng khi có tác dụng phụ', keywords: ['tác dụng phụ', 'ghi trùng', 'side effect'], weight: 2 },
      { text: 'Không giúp được khi lệch dữ liệu', keywords: ['lệch dữ liệu', 'skew'], weight: 2 },
    ],
    followUps: ['Hệ thống xác định task chậm thế nào?'],
    commonMistakes: ['Nói speculative dùng để xử lý task lỗi.', 'Khuyên luôn bật trong mọi trường hợp.'],
  },
  {
    id: 'iv-hadoop-locality-01',
    topicId: 'hadoop',
    category: 'hadoop-reliability',
    conceptIds: ['hadoop-data-locality', 'hadoop-hdfs', 'cloud-s3'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle', 'senior'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Data Locality là gì? Nó còn quan trọng không khi các hệ thống hiện đại lưu dữ liệu trên S3?',
    referenceAnswer: `Data Locality là việc đưa tính toán tới gần dữ liệu, vì chuyển chương trình vài MB rẻ hơn nhiều so với chuyển hàng TB dữ liệu qua mạng. Có ba mức: node-local, rack-local và off-switch. Scheduler được báo vị trí block, và có thể chờ một lúc để có máy phù hợp, gọi là delay scheduling. Đây là ưu tiên, không phải đảm bảo.

Khi Hadoop ra đời, mạng 1 Gb/s và đường truyền giữa các rack rất hẹp, nên locality là yếu tố sống còn. Hiện nay mạng nhanh hơn rất nhiều, nên lợi ích giảm đi. Trên S3 thì không còn locality.

Mô hình tách rời được chọn vì được nhiều hơn mất: lưu trữ và tính toán co giãn độc lập, tắt được cụm khi rảnh, nhiều engine đọc chung dữ liệu. Phần bị mất được bù bằng cách giảm lượng dữ liệu phải đọc: Parquet, cắt tỉa phân vùng, đẩy bộ lọc xuống, và bộ nhớ đệm cục bộ.

Với cụm HDFS tại chỗ thì locality vẫn có ý nghĩa, nhất là khi băng thông giữa các rack hẹp. Theo tôi, ý tưởng cốt lõi vẫn còn nguyên: hạn chế dữ liệu đi qua mạng, chỉ khác cách thực hiện.`,
    keyPoints: [
      { text: 'Đưa tính toán tới dữ liệu', keywords: ['tính toán', 'gần dữ liệu', 'chuyển dữ liệu'], weight: 2 },
      { text: 'Ba mức locality', keywords: ['node-local', 'rack-local', 'off-switch', 'node local', 'rack local'] },
      { text: 'Mạng nhanh làm giảm lợi ích', keywords: ['mạng nhanh', 'băng thông', 'giảm lợi ích'], weight: 2 },
      { text: 'Tách rời để co giãn độc lập', keywords: ['tách rời', 'co giãn', 'độc lập'], weight: 2 },
      { text: 'Bù bằng giảm dữ liệu đọc', keywords: ['parquet', 'cắt tỉa', 'pushdown', 'đẩy bộ lọc'] },
    ],
    followUps: ['Bạn đo mức độ locality của một job thế nào?', 'Delay scheduling có nhược điểm gì?'],
    commonMistakes: ['Nói task luôn chạy trên máy chứa dữ liệu.', 'Cho rằng locality vẫn quan trọng như trước, trong mọi kiến trúc.'],
  },
])
