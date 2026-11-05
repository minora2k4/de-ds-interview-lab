import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-hadoop-yarn-01',
    topicId: 'hadoop',
    category: 'hadoop-yarn-group',
    conceptIds: ['hadoop-yarn', 'hadoop-resourcemanager', 'hadoop-nodemanager'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Giải thích kiến trúc YARN và các bước khi một ứng dụng được gửi lên cụm.',
    referenceAnswer: `YARN có bốn khái niệm chính. **ResourceManager** là nút toàn cụm, gồm Scheduler và ApplicationsManager. **NodeManager** chạy trên từng máy, quản lý Container. **ApplicationMaster** là của từng ứng dụng, lo điều phối task. **Container** là phần tài nguyên được cấp trên một máy, như bộ nhớ và vcore.

Khi gửi ứng dụng, client gọi ResourceManager. ApplicationsManager cấp Container đầu tiên, và NodeManager khởi động ApplicationMaster trong đó. AM đăng ký với ResourceManager rồi xin thêm Container, kèm mong muốn về vị trí để gần dữ liệu. Scheduler cấp Container theo chính sách hàng đợi. AM làm việc trực tiếp với các NodeManager để khởi động Container. Các task báo tiến độ về AM. Khi xong, AM báo với ResourceManager và trả tài nguyên.

Điều cần nhớ là ResourceManager chỉ cấp tài nguyên. Theo dõi và chạy lại task là việc của ApplicationMaster.`,
    keyPoints: [
      { text: 'ResourceManager quản lý toàn cụm', keywords: ['resourcemanager', 'scheduler', 'toàn cụm'], weight: 2 },
      { text: 'NodeManager trên từng máy', keywords: ['nodemanager', 'từng máy'] },
      { text: 'ApplicationMaster của từng ứng dụng', keywords: ['applicationmaster', 'application master', 'từng ứng dụng'], weight: 2 },
      { text: 'Container là đơn vị tài nguyên', keywords: ['container', 'vcore'] },
      { text: 'Thứ tự: gửi, khởi động AM, xin Container, chạy task', keywords: ['container đầu tiên', 'đăng ký', 'xin thêm'] },
    ],
    followUps: ['Container có phải là Docker không?', 'AM hỏng thì điều gì xảy ra?'],
    commonMistakes: ['Nói ResourceManager theo dõi từng task.', 'Bỏ qua vai trò của ApplicationMaster.'],
  },
  {
    id: 'iv-hadoop-yarn-02',
    topicId: 'hadoop',
    category: 'hadoop-yarn-group',
    conceptIds: ['hadoop-yarn', 'hadoop-mapreduce', 'spark-cluster-manager'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao Hadoop cần tách YARN ra khỏi MapReduce? Việc này mở ra điều gì cho các engine như Spark?',
    referenceAnswer: `Trong Hadoop 1, JobTracker vừa quản lý tài nguyên toàn cụm vừa theo dõi từng task của mọi job. Gộp hai việc này gây ra ba vấn đề: tải tăng theo tổng số task nên dễ thành nút nghẽn, ô Map và Reduce cố định nên lãng phí tài nguyên, và chỉ chạy được MapReduce.

YARN tách thành hai phần. Việc chung là cấp tài nguyên, chỉ cần một ResourceManager. Việc riêng của từng framework là điều phối task, đưa vào ApplicationMaster. Vì thế YARN không chỉ dành cho MapReduce: MapReduce chỉ là một ứng dụng với MRAppMaster, còn framework nào viết được AM thì đều chạy được.

Với Spark, AM xin Container để chạy Executor. Ở cluster mode, Driver nằm trong AM, ở client mode, Driver nằm ngoài. Công ty không cần cụm riêng cho Spark: nó dùng chung hàng đợi và dữ liệu HDFS với các job khác, nên giữ được locality.

Đây cũng là tiền đề để ngày nay có thể thay YARN bằng Kubernetes, vì Spark đã tách việc xin tài nguyên thành một lớp riêng.`,
    keyPoints: [
      { text: 'JobTracker gộp hai trách nhiệm nên thành nút nghẽn', keywords: ['jobtracker', 'nút nghẽn', 'quá tải', 'hai việc'], weight: 2 },
      { text: 'Ô cố định làm lãng phí tài nguyên', keywords: ['ô map', 'ô cố định', 'lãng phí', 'slot'] },
      { text: 'Tách cấp tài nguyên khỏi điều phối task', keywords: ['tách', 'applicationmaster', 'điều phối'], weight: 2 },
      { text: 'Nhiều framework dùng chung cụm', keywords: ['nhiều framework', 'dùng chung', 'không chỉ mapreduce', 'spark'], weight: 2 },
    ],
    followUps: ['So sánh YARN và Kubernetes cho Spark.', 'Client mode và cluster mode khác nhau thế nào trên YARN?'],
    commonMistakes: ['Nói YARN chỉ là phiên bản mới của MapReduce.', 'Không nêu được vấn đề của JobTracker.'],
  },
  {
    id: 'iv-hadoop-yarn-03',
    topicId: 'hadoop',
    category: 'hadoop-yarn-group',
    conceptIds: ['hadoop-yarn', 'hadoop-resourcemanager'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Nhóm báo job Spark của họ chờ tài nguyên hàng giờ, trong khi cụm trông vẫn còn rảnh. Bạn điều tra thế nào?',
    referenceAnswer: `Tôi kiểm tra theo từng tầng, vì tổng tài nguyên rảnh không có nghĩa là job được dùng.

Đầu tiên là **hàng đợi**: hàng đợi của họ đã dùng hết dung lượng chưa, và có giới hạn tối đa hay giới hạn theo người dùng nào không. Hàng đợi khác rảnh nhưng hàng đợi của họ bị giới hạn là tình huống rất phổ biến. Cũng cần xem giới hạn tỷ lệ tài nguyên cho ApplicationMaster, vì quá nhiều ứng dụng nhỏ có thể khiến AM mới không được khởi động.

Sau đó là **kích thước yêu cầu**: tài nguyên có thể bị phân mảnh. Tổng còn 500 GB nhưng rải trên nhiều máy, mỗi máy dư 4 GB, thì không cấp được Container 16 GB. Tiếp theo là **locality**: yêu cầu có đang chờ đúng máy chứa dữ liệu không, vì Scheduler có thể bỏ qua một số cơ hội cấp phát.

Tôi cũng kiểm tra **calculator**: nếu dùng DominantResourceCalculator thì có thể đã hết vcore dù còn bộ nhớ. Và kiểm tra có node label hay máy nào đang bị loại không.

Hướng xử lý tùy nguyên nhân: chỉnh dung lượng hoặc preemption, giảm kích thước Executor, chia nhỏ job, hoặc dùng Dynamic Allocation để không giữ tài nguyên khi rảnh.`,
    keyPoints: [
      { text: 'Kiểm tra giới hạn hàng đợi và người dùng', keywords: ['hàng đợi', 'queue', 'giới hạn người dùng'], weight: 3 },
      { text: 'Phân mảnh tài nguyên trên các máy', keywords: ['phân mảnh', 'mỗi máy', 'fragmentation', 'rải rác'], weight: 2 },
      { text: 'Giới hạn tài nguyên cho ApplicationMaster', keywords: ['applicationmaster', 'am resource', 'tỷ lệ am'] },
      { text: 'Locality làm chậm cấp phát', keywords: ['locality', 'gần dữ liệu'] },
      { text: 'Hết vcore dù còn bộ nhớ', keywords: ['vcore', 'dominantresourcecalculator', 'dominant'] },
      { text: 'Điều chỉnh qua preemption hoặc Dynamic Allocation', keywords: ['preemption', 'dynamic allocation', 'giảm kích thước'] },
    ],
    followUps: ['Preemption hoạt động thế nào và có rủi ro gì?', 'Nên đặt dung lượng hàng đợi thế nào cho nhiều phòng ban?'],
    commonMistakes: ['Kết luận ngay là cụm thiếu máy.', 'Chỉ nhìn tổng tài nguyên của toàn cụm.'],
  },
  {
    id: 'iv-hadoop-rm-01',
    topicId: 'hadoop',
    category: 'hadoop-yarn-group',
    conceptIds: ['hadoop-resourcemanager', 'hadoop-yarn', 'hadoop-fault-tolerance'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'ResourceManager hỏng thì ứng dụng đang chạy sẽ ra sao? Cần cấu hình gì để giảm tác động?',
    referenceAnswer: `Tùy cấu hình mà kết quả rất khác nhau. Trước Hadoop 2.4, ResourceManager là điểm lỗi đơn. Cần tách hai việc: có một nút lên thay, và nút đó biết gì về các ứng dụng cũ.

**HA** giải quyết việc đầu: chạy Active và Standby, bộ bầu chọn dựa trên ZooKeeper nằm ngay trong ResourceManager nên không cần ZKFC riêng. Client, ApplicationMaster và NodeManager thử lần lượt từng nút tới khi gặp Active.

**Recovery** giải quyết việc thứ hai và mặc định tắt. Khi bật, trạng thái ứng dụng được ghi vào state store như ZKRMStateStore. Có hai mức. Với mức không giữ công việc, NodeManager giết Container khi nhận lệnh đồng bộ lại, ứng dụng chạy lại mà người dùng không phải gửi lại. Với mức work-preserving, là mặc định khi đã bật recovery, NodeManager không giết Container mà báo lại trạng thái, còn AM gửi lại yêu cầu, nên Scheduler dựng lại trạng thái và ứng dụng chạy tiếp.

Vậy muốn job không mất công việc, phải bật cả HA và recovery. Mức work-preserving đã là mặc định khi recovery được bật, nên chỉ cần không tắt nó đi.`,
    keyPoints: [
      { text: 'Tách HA và recovery là hai tính năng', keywords: ['ha', 'recovery', 'active', 'standby'], weight: 3 },
      { text: 'Bầu chọn bằng ZooKeeper', keywords: ['zookeeper', 'bầu chọn', 'zk'] },
      { text: 'Recovery mặc định tắt và cần state store', keywords: ['mặc định tắt', 'state store', 'zkrmstatestore'], weight: 2 },
      { text: 'Work-preserving giữ Container', keywords: ['work-preserving', 'work preserving', 'giữ công việc', 'không giết'], weight: 2 },
    ],
    followUps: ['NodeManager khởi động lại thì Container còn sống không?', 'State store nên đặt ở đâu?'],
    commonMistakes: ['Cho rằng bật HA là đủ để job tiếp tục chạy.', 'Nhầm với cách bầu chọn của NameNode, vốn dùng ZKFC riêng.'],
  },
  {
    id: 'iv-hadoop-nm-01',
    topicId: 'hadoop',
    category: 'hadoop-yarn-group',
    conceptIds: ['hadoop-nodemanager', 'spark-executor', 'hadoop-yarn'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Executor Spark bị YARN giết vì vượt giới hạn bộ nhớ, trong khi không có lỗi Java heap. Vì sao lại như vậy, và bạn xử lý thế nào?',
    referenceAnswer: `NodeManager đo tổng bộ nhớ của cả tiến trình Container, không chỉ heap. Nó phải làm vậy vì nếu một Container dùng quá phần được cấp, cả máy có thể hết RAM, ảnh hưởng tới các Container khác và cả DataNode.

Bộ nhớ của Executor gồm heap và phần ngoài heap: tiến trình Python khi dùng UDF, buffer mạng, off-heap của Spark, thread stack. Spark xin Container bằng heap cộng memory overhead, mặc định khoảng 10%. Nếu phần ngoài heap dùng nhiều hơn overhead thì tổng vượt giới hạn, và NodeManager giết Container, dù heap vẫn còn trống. Vì thế không có lỗi OutOfMemory của Java.

Tôi xử lý theo thứ tự: đọc nhật ký để xác nhận đó là lỗi vượt bộ nhớ vật lý hay bộ nhớ ảo. Sau đó xác định phần ngoài heap đến từ đâu. Nếu do Python thì tăng memory overhead, hoặc giảm số core mỗi Executor để bớt tiến trình Python đồng thời. Tăng heap sẽ không giúp, thậm chí làm tệ hơn nếu giữ nguyên tổng bộ nhớ. Tắt kiểm tra bộ nhớ vật lý chỉ giấu vấn đề, và máy có thể bị hệ điều hành giết tiến trình.`,
    keyPoints: [
      { text: 'NodeManager đo tổng bộ nhớ tiến trình, không chỉ heap', keywords: ['tổng bộ nhớ', 'cả tiến trình', 'không chỉ heap', 'ngoài heap'], weight: 3 },
      { text: 'Vì sao phải giết: bảo vệ máy và Container khác', keywords: ['bảo vệ', 'hết ram', 'cả máy', 'container khác'] },
      { text: 'Memory overhead gồm Python, off-heap, buffer', keywords: ['memory overhead', 'overhead', 'python', 'off-heap'], weight: 2 },
      { text: 'Xử lý bằng tăng overhead hoặc giảm core', keywords: ['tăng overhead', 'tăng memory overhead', 'giảm core', 'giảm số core'], weight: 2 },
      { text: 'Tăng heap không giải quyết được', keywords: ['tăng heap', 'không giúp'] },
    ],
    followUps: ['Kiểm tra bộ nhớ ảo có gây vấn đề gì trên thực tế?', 'Trên Kubernetes thì lỗi tương đương là gì?'],
    commonMistakes: ['Khuyên tăng heap ngay lập tức.', 'Đề xuất tắt kiểm tra bộ nhớ làm giải pháp lâu dài.'],
  },
])
