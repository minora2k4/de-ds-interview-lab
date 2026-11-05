import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-hadoop-hdfs-01',
    topicId: 'hadoop',
    category: 'hadoop-hdfs-group',
    conceptIds: ['hadoop-hdfs', 'hadoop-namenode', 'hadoop-datanode'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Mô tả kiến trúc HDFS và luồng đọc, ghi một tệp.',
    referenceAnswer: `HDFS có một nút quản lý là NameNode và nhiều nút lưu trữ là DataNode. Tệp được chia thành block, mặc định 128 MB, mỗi block có 3 bản sao. NameNode giữ metadata, còn DataNode giữ nội dung block.

Khi **đọc**, client hỏi NameNode vị trí các block và nhận về danh sách DataNode xếp theo độ gần. Client đọc trực tiếp từ DataNode gần nhất và kiểm tra checksum. Nếu có lỗi, nó chuyển sang bản sao khác.

Khi **ghi**, client xin NameNode cấp danh sách DataNode cho từng block. Client gửi dữ liệu tới DataNode đầu tiên, DataNode này vừa ghi vừa chuyển cho DataNode thứ hai, rồi tới DataNode thứ ba, gọi là pipeline. Xác nhận đi ngược lại về client.

Điểm mấu chốt là dữ liệu không bao giờ đi qua NameNode, nên một nút quản lý vẫn phục vụ được cụm lớn. Tệp đã ghi xong chỉ có thể nối thêm hoặc cắt bớt, không sửa được ở giữa.`,
    keyPoints: [
      { text: 'NameNode giữ metadata, DataNode giữ block', keywords: ['metadata', 'namenode', 'datanode'], weight: 2 },
      { text: 'Block 128 MB, 3 bản sao', keywords: ['128', 'bản sao', 'replication'] },
      { text: 'Đọc trực tiếp từ DataNode gần nhất', keywords: ['trực tiếp', 'gần nhất', 'checksum'], weight: 2 },
      { text: 'Ghi qua pipeline giữa các DataNode', keywords: ['pipeline', 'đường ống', 'chuyển tiếp'], weight: 2 },
      { text: 'Dữ liệu không đi qua NameNode', keywords: ['không đi qua', 'không qua namenode'] },
    ],
    followUps: ['Nếu một DataNode trong pipeline hỏng khi đang ghi thì sao?', 'Vì sao HDFS không cho sửa giữa tệp?'],
    commonMistakes: ['Nói client ghi song song ba bản sao.', 'Nói NameNode chuyển dữ liệu cho client.'],
  },
  {
    id: 'iv-hadoop-hdfs-02',
    topicId: 'hadoop',
    category: 'hadoop-hdfs-group',
    conceptIds: ['hadoop-hdfs', 'hadoop-namenode', 'spark-small-files'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Tại sao tệp nhỏ lại là vấn đề lớn với HDFS? Bạn phát hiện và xử lý thế nào?',
    referenceAnswer: `NameNode giữ metadata trong RAM, và mỗi tệp, mỗi block là một đối tượng, theo kinh nghiệm khoảng 150 byte. Áp lực vì vậy phụ thuộc vào số tệp, không phụ thuộc vào dung lượng. Một tệp 1 GB tốn khoảng 9 đối tượng, còn 1.024 tệp 1 MB tốn khoảng 2.048 đối tượng, dù dung lượng như nhau. Đĩa không bị lãng phí, vì tệp 1 MB chỉ dùng 1 MB.

Tác động gồm heap lớn nên GC dừng lâu, khởi động lại chậm, block report nặng. Phía tính toán, mỗi tệp tạo ít nhất một Map task hoặc một lần mở tệp, nên job chậm đi rõ rệt.

Tôi phát hiện qua số tệp và kích thước trung bình theo từng thư mục. Về xử lý, tôi sửa nguồn trước: kiểm soát số tệp khi ghi, gộp lại bằng job định kỳ, như ở [[spark-small-files]]. Dữ liệu cũ có thể gộp bằng Hadoop Archive hoặc ghi lại thành Parquet lớn hơn. Khi đọc có thể dùng CombineFileInputFormat. Nếu namespace thật sự quá lớn thì mới xem đến Federation. Tăng heap chỉ là cách tạm thời.`,
    keyPoints: [
      { text: 'Metadata trong RAM, áp lực theo số tệp', keywords: ['ram', 'số tệp', 'đối tượng', 'heap'], weight: 3 },
      { text: 'Tệp nhỏ không lãng phí đĩa', keywords: ['không lãng phí', 'chỉ dùng', 'đúng dung lượng'] },
      { text: 'Làm chậm cả tính toán vì nhiều task và nhiều lần mở tệp', keywords: ['map task', 'mở tệp', 'nhiều task'] },
      { text: 'Sửa nguồn và gộp định kỳ', keywords: ['gộp', 'compaction', 'sửa nguồn', 'parquet'], weight: 2 },
      { text: 'Các công cụ: HAR, CombineFileInputFormat, Federation', keywords: ['archive', 'har', 'combinefileinputformat', 'federation'] },
    ],
    followUps: ['Spark trên S3 có còn gặp vấn đề tệp nhỏ không?', 'Bạn chọn kích thước tệp mục tiêu thế nào?'],
    commonMistakes: ['Nói tệp nhỏ lãng phí vì chiếm trọn block 128 MB.', 'Đề xuất thêm DataNode hoặc tăng block size.'],
  },
  {
    id: 'iv-hadoop-hdfs-03',
    topicId: 'hadoop',
    category: 'hadoop-hdfs-group',
    conceptIds: ['hadoop-hdfs', 'hadoop-block-replication'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Cụm sắp hết đĩa và không có ngân sách mua thêm máy. Bạn có nên chuyển sang Erasure Coding không? Hãy phân tích.',
    referenceAnswer: `Trước hết tôi xem dữ liệu phân bố thế nào theo độ nóng, vì Erasure Coding không hợp với mọi loại dữ liệu. Về lợi ích, RS-6-3 có chi phí thêm 50% so với 200% của 3 bản sao. Với 600 TB dữ liệu, dung lượng thực tế giảm từ 1,8 PB còn 900 TB, mà còn chịu được mất 3 khối thay vì 2.

Chi phí đi kèm khá rõ. Mã hóa và giải mã tốn CPU ở client và DataNode. Khối trải qua nhiều rack nên phần lớn thao tác đi qua rack khác, mất locality, và cần băng thông giữa các rack tốt. Khi phục hồi phải đọc nhiều khối và giải mã, thay vì chỉ sao chép. Tệp EC không hỗ trợ \`hflush\`, \`hsync\`, nên không dùng được cho tệp ghi dần. Cụm cũng phải đủ rack: RS-6-3 cần tối thiểu 3 rack và nên có từ 9 rack.

Vì vậy tôi không chuyển toàn bộ. Tôi giữ 3 bản sao cho dữ liệu nóng và chuyển dữ liệu lạnh sang EC theo thư mục, đo tải CPU, mạng rồi mở rộng dần. Tệp nhỏ cũng cần cân nhắc, nên tôi gộp trước khi chuyển. Song song đó, tôi vẫn xóa dữ liệu không dùng, vì đây là cách rẻ nhất.`,
    keyPoints: [
      { text: 'Phân tích theo độ nóng của dữ liệu', keywords: ['dữ liệu lạnh', 'dữ liệu nóng', 'độ nóng', 'ít đọc'], weight: 2 },
      { text: 'Chi phí 50% so với 200%', keywords: ['50%', '200%', 'tiết kiệm đĩa', 'rs-6-3'], weight: 2 },
      { text: 'Tốn CPU và mạng, mất locality', keywords: ['cpu', 'rack khác', 'locality', 'băng thông'], weight: 2 },
      { text: 'Giới hạn hflush, hsync', keywords: ['hflush', 'hsync', 'ghi dần'] },
      { text: 'Cần đủ rack cho chính sách', keywords: ['đủ rack', '9 rack', 'số rack'] },
    ],
    followUps: ['Phục hồi một block EC khác gì so với block có bản sao?', 'Chuyển dữ liệu có sẵn sang EC bằng cách nào?'],
    commonMistakes: ['Chỉ nói tiết kiệm đĩa mà bỏ qua CPU, mạng và giới hạn API.', 'Chuyển cả dữ liệu đang được đọc nhiều.'],
  },
  {
    id: 'iv-hadoop-namenode-01',
    topicId: 'hadoop',
    category: 'hadoop-hdfs-group',
    conceptIds: ['hadoop-namenode', 'hadoop-datanode'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'NameNode lưu những gì, lưu ở đâu, và quá trình khởi động của nó diễn ra thế nào?',
    referenceAnswer: `NameNode giữ namespace, gồm cây thư mục và quyền, ánh xạ từ tệp sang các block, và vị trí từng block. Tất cả nằm trong RAM để trả lời nhanh.

Để không mất khi tắt máy, nó dùng hai tệp trên đĩa. **fsimage** là ảnh chụp namespace tại một thời điểm, **edit log** ghi mọi thay đổi sau đó. Mỗi thay đổi được ghi vào edit log trước khi trả lời client, vì nối thêm vào nhật ký rẻ hơn nhiều so với viết lại cả ảnh chụp.

Vị trí block thì không được lưu, vì DataNode mới là nơi biết chắc mình đang giữ gì.

Khi khởi động, NameNode nạp fsimage rồi chạy lại edit log để dựng namespace. Sau đó nó vào Safemode, chờ block report từ DataNode để biết vị trí block. Trong thời gian này nó không sao chép block và không cho ghi. Khi 99,9% block đạt số bản sao tối thiểu, cộng thêm 30 giây, nó thoát Safemode và lên lịch sao chép những block còn thiếu. Vì vậy, edit log dài do không checkpoint có thể làm khởi động mất hàng giờ.`,
    keyPoints: [
      { text: 'Giữ namespace và ánh xạ block trong RAM', keywords: ['namespace', 'ram', 'ánh xạ'], weight: 2 },
      { text: 'fsimage và edit log trên đĩa', keywords: ['fsimage', 'edit log', 'editlog'], weight: 2 },
      { text: 'Vị trí block dựng lại từ block report', keywords: ['block report', 'blockreport', 'dựng lại'], weight: 2 },
      { text: 'Safemode khi khởi động', keywords: ['safemode', 'safe mode', '99,9'] },
    ],
    followUps: ['Vì sao vị trí block không được lưu?', 'Điều gì xảy ra nếu edit log bị hỏng?'],
    commonMistakes: ['Nói fsimage chứa vị trí block.', 'Nói NameNode lưu cả dữ liệu người dùng.'],
  },
  {
    id: 'iv-hadoop-namenode-02',
    topicId: 'hadoop',
    category: 'hadoop-hdfs-group',
    conceptIds: ['hadoop-namenode', 'hadoop-distributed-systems', 'hadoop-secondary-namenode'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'NameNode High Availability hoạt động thế nào? Làm sao tránh tình trạng hai NameNode cùng cho mình là Active?',
    referenceAnswer: `Mục tiêu là tiếp quản nhanh, nên Standby phải luôn có sẵn hai thứ: namespace mới nhất và vị trí block.

Với namespace, Active ghi mỗi thay đổi vào **đa số JournalNode**, tối thiểu 3 máy và chịu được (N - 1) / 2 lỗi. Standby liên tục đọc và áp dụng các thay đổi đó. Trước khi lên Active, nó đọc hết phần còn lại để đảm bảo đồng bộ. Với vị trí block, DataNode gửi heartbeat và block report tới mọi NameNode. Standby cũng đảm nhận checkpoint, nên không cần và không được chạy Secondary NameNode.

Split-brain được chặn ở vài lớp. JournalNode chỉ cho một NameNode ghi tại một thời điểm, nên NameNode mới chiếm quyền ghi thì NameNode cũ không ghi được nữa, và metadata không thể bị chia nhánh. Nhưng nút cũ vẫn có thể trả lời đọc với dữ liệu cũ cho tới khi nó phát hiện ra, nên cần thêm **fencing** như sshfence. Failover tự động dùng ZKFC và ZooKeeper để phát hiện lỗi và bầu Active, mặc định chưa bật.

Quan trọng là phân biệt: quorum bảo vệ tính đúng đắn của metadata, còn ZooKeeper chỉ lo việc chọn ai lên Active.`,
    keyPoints: [
      { text: 'Edit log dùng chung qua đa số JournalNode', keywords: ['journalnode', 'đa số', 'quorum'], weight: 3 },
      { text: 'DataNode báo cáo cho mọi NameNode', keywords: ['mọi namenode', 'cả hai', 'block report', 'heartbeat'], weight: 2 },
      { text: 'Chỉ một NameNode được ghi vào JournalNode', keywords: ['một namenode', 'một người ghi', 'split-brain', 'split brain'], weight: 2 },
      { text: 'Vẫn cần fencing', keywords: ['fencing', 'sshfence', 'cách ly'] },
      { text: 'ZKFC và ZooKeeper cho failover tự động', keywords: ['zkfc', 'zookeeper'] },
      { text: 'Standby làm checkpoint', keywords: ['standby làm checkpoint', 'checkpoint'] },
    ],
    followUps: ['Vì sao nên dùng số lẻ JournalNode?', 'Observer NameNode giúp gì cho tải đọc?'],
    commonMistakes: ['Cho rằng ZooKeeper lưu metadata hoặc edit log.', 'Nhầm Standby NameNode với Secondary NameNode.'],
  },
  {
    id: 'iv-hadoop-datanode-01',
    topicId: 'hadoop',
    category: 'hadoop-hdfs-group',
    conceptIds: ['hadoop-datanode', 'hadoop-fault-tolerance'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Một DataNode đột ngột bị tắt. Hệ thống phản ứng thế nào, và vì sao không sao chép lại ngay lập tức?',
    referenceAnswer: `DataNode gửi heartbeat mỗi 3 giây. Khi heartbeat dừng lại, NameNode chưa kết luận ngay. Sau 30 giây, máy bị xem là stale, và nếu đã cấu hình, NameNode sẽ tránh nó khi đọc hoặc ghi. Phải sau khoảng 10 phút 30 giây thì máy mới bị xem là chết, theo công thức 2 lần \`recheck-interval\` cộng 10 lần heartbeat.

Trong thời gian này, client vẫn đọc được, vì nếu DataNode không phản hồi thì nó tự chuyển sang bản sao khác. Khi hết thời hạn, NameNode tìm các block bị thiếu bản sao và yêu cầu các DataNode khác sao chép lại.

Thời hạn dài là có chủ đích. Một máy khởi động lại trong vài phút là chuyện thường. Nếu sao chép ngay, cụm sẽ truyền hàng chục TB qua mạng cho một sự cố tự hết, và khi máy quay lại thì còn phải xóa bản thừa. Hiện tượng này gọi là bão sao chép, có thể ảnh hưởng tới các job đang chạy.`,
    keyPoints: [
      { text: 'Phát hiện qua heartbeat 3 giây', keywords: ['heartbeat', '3 giây'], weight: 2 },
      { text: 'Đánh dấu chết sau khoảng 10 phút 30 giây', keywords: ['10 phút', '630 giây', 'hơn 10'], weight: 2 },
      { text: 'Client tự chuyển sang bản sao khác', keywords: ['bản sao khác', 'chuyển sang'] },
      { text: 'NameNode lên lịch sao chép lại', keywords: ['sao chép lại', 're-replication', 'thiếu bản sao'] },
      { text: 'Tránh bão sao chép', keywords: ['bão sao chép', 'replication storm', 'tránh sao chép'], weight: 2 },
    ],
    followUps: ['Stale và dead khác nhau ở điểm nào?', 'Decommission một DataNode khác gì tắt đột ngột?'],
    commonMistakes: ['Nói dữ liệu của máy đó bị mất ngay.', 'Nói NameNode sao chép lại ngay khi thiếu heartbeat.'],
  },
  {
    id: 'iv-hadoop-secondary-01',
    topicId: 'hadoop',
    category: 'hadoop-hdfs-group',
    conceptIds: ['hadoop-secondary-namenode', 'hadoop-namenode'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Secondary NameNode có phải là bản dự phòng của NameNode không? Nó thực sự làm gì và vì sao cần nó?',
    referenceAnswer: `Không. Đây là hiểu sai rất phổ biến do cái tên gây ra. Secondary NameNode không phục vụ client, không nhận block report nên không biết vị trí block, và không thể tiếp quản.

Lý do nó tồn tại đến từ cách NameNode lưu metadata. NameNode chỉ nối thêm thay đổi vào edit log vì việc này rẻ, nên edit log lớn dần, và lần khởi động sau phải chạy lại tất cả, có thể mất hàng giờ. Vì vậy cần định kỳ gộp edit log vào fsimage, gọi là checkpoint, mặc định mỗi giờ hoặc mỗi 1 triệu giao dịch.

Việc gộp cần nạp toàn bộ namespace vào RAM, nên người ta chuyển nó sang một máy khác có RAM tương đương. Secondary tải fsimage và edit log về, gộp lại, rồi gửi fsimage mới trả cho NameNode.

Bản fsimage của nó có thể chậm tới một chu kỳ, nên không bảo vệ được phần thay đổi mới nhất. Muốn có khả năng tiếp quản thì phải dùng HA với Standby NameNode. Trong cụm HA, Standby đã làm luôn checkpoint, và chạy thêm Secondary là lỗi cấu hình.`,
    keyPoints: [
      { text: 'Khẳng định không phải bản dự phòng', keywords: ['không phải', 'không thể tiếp quản', 'không tiếp quản'], weight: 3 },
      { text: 'Làm checkpoint: gộp fsimage và edit log', keywords: ['checkpoint', 'gộp', 'fsimage'], weight: 3 },
      { text: 'Lý do: edit log lớn làm khởi động chậm', keywords: ['khởi động', 'edit log lớn', 'chạy lại'], weight: 2 },
      { text: 'Standby NameNode trong HA mới tiếp quản', keywords: ['standby', 'ha'], weight: 2 },
    ],
    followUps: ['Checkpoint Node và Backup Node khác gì Secondary?', 'Làm sao biết checkpoint đang bị dừng?'],
    commonMistakes: ['Nói Secondary tự thay thế khi NameNode lỗi.', 'Không phân biệt Secondary với Standby.'],
  },
  {
    id: 'iv-hadoop-replication-01',
    topicId: 'hadoop',
    category: 'hadoop-hdfs-group',
    conceptIds: ['hadoop-block-replication', 'hadoop-hdfs'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Rack Awareness là gì? Tại sao HDFS đặt hai bản sao cùng một rack thay vì rải đều ra ba rack?',
    referenceAnswer: `Rack Awareness là việc NameNode biết máy nào nằm ở rack nào, để đặt bản sao có tính đến sơ đồ mạng. Thông tin này phải cấu hình bằng script hoặc lớp ánh xạ. Không có cấu hình thì mọi máy nằm trong \`/default-rack\`.

Với hệ số 3, bản đầu ở máy ghi, hoặc ở máy cùng rack nếu client không phải DataNode. Bản thứ hai ở rack khác, bản thứ ba ở máy khác cùng rack với bản thứ hai.

Đây là đánh đổi giữa hai rủi ro. Nếu cả ba bản cùng một rack, mất rack là mất dữ liệu. Nếu rải ra ba rack, ghi phải vượt rack hai lần, trong khi băng thông giữa các rack hẹp hơn và đắt hơn nhiều so với trong rack. Máy hỏng lại phổ biến hơn rack hỏng rất nhiều, nên hai rack đã đủ an toàn.

Nhược điểm của chính sách này là bản sao không phân bố đều giữa các rack, và băng thông đọc tổng thể không tăng so với khi dùng ba rack. Tài liệu chấp nhận đánh đổi này vì độ tin cậy vẫn được giữ.`,
    keyPoints: [
      { text: 'NameNode biết sơ đồ rack, phải cấu hình', keywords: ['cấu hình', 'script', 'sơ đồ', 'default-rack'], weight: 2 },
      { text: 'Vị trí ba bản sao trên hai rack', keywords: ['hai rack', 'rack khác', 'cùng rack'], weight: 2 },
      { text: 'Băng thông giữa các rack đắt hơn', keywords: ['băng thông', 'giữa các rack', 'vượt rack'], weight: 2 },
      { text: 'Rack hỏng hiếm hơn máy hỏng', keywords: ['rack hỏng', 'hiếm', 'ít xảy ra'] },
    ],
    followUps: ['Điều gì xảy ra nếu không cấu hình rack?', 'Hệ số sao chép bằng 5 thì bản thứ tư, thứ năm đặt thế nào?'],
    commonMistakes: ['Nói ba bản sao nằm trên ba rack.', 'Nói Hadoop tự phát hiện rack.'],
  },
])
