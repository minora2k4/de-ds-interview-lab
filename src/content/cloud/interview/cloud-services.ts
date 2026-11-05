import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-cloud-s3-01',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-s3', 'hadoop-hdfs'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'S3 khác HDFS ở điểm nào? Vì sao nhiều hệ thống chuyển từ HDFS sang S3?',
    referenceAnswer: `Khác biệt cốt lõi là **tách lưu trữ khỏi tính toán**. HDFS lưu trên đĩa của chính các máy tính toán, nên muốn thêm dung lượng phải thêm cả CPU, và tắt cụm đồng nghĩa với mất khả năng truy cập dữ liệu. S3 là dịch vụ riêng, nên cụm có thể tắt khi hết việc và nhiều engine dùng chung một dữ liệu. Đây là lý do chính của việc chuyển đổi, vì tải tính toán thường không đều.

Về mô hình, HDFS là hệ thống tệp có thư mục thật, đổi tên nguyên tử trên NameNode. S3 là object storage, không gian tên phẳng, "thư mục" chỉ là prefix, và đổi tên là sao chép rồi xóa. Về hiệu năng, HDFS có data locality nên đọc nhanh hơn, còn S3 đọc qua mạng nên độ trễ cao hơn và tính phí theo yêu cầu.

Vận hành S3 nhẹ hơn nhiều: độ bền thiết kế 11 số 9 và không có NameNode để lo. Tôi vẫn dùng HDFS hoặc đĩa cục bộ cho dữ liệu trung gian như shuffle. Với commit nhiều tệp trên S3, tôi dùng định dạng bảng vì thiếu đổi tên nguyên tử.`,
    keyPoints: [
      { text: 'S3 tách lưu trữ khỏi tính toán', keywords: ['tách lưu trữ', 'tắt cụm', 'độc lập', 'co giãn riêng'], weight: 3 },
      { text: 'Object storage, không gian tên phẳng, prefix', keywords: ['object', 'phẳng', 'prefix'], weight: 2 },
      { text: 'Đổi tên không nguyên tử trên S3', keywords: ['đổi tên', 'rename', 'nguyên tử', 'sao chép'] },
      { text: 'HDFS có data locality, S3 đọc qua mạng', keywords: ['locality', 'qua mạng', 'độ trễ'] },
    ],
    followUps: ['Vì sao đổi tên trên S3 lại là vấn đề khi commit job Spark?', 'Khi nào HDFS vẫn tốt hơn?'],
    commonMistakes: ['Nói S3 là hệ thống tệp phân tán giống HDFS.', 'Vẫn nói S3 là eventual consistency.'],
  },
  {
    id: 'iv-cloud-s3-02',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-s3', 'cloud-consistency'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Mô hình nhất quán của S3 hiện nay là gì? Những gì vẫn chưa được bảo đảm?',
    referenceAnswer: `Từ tháng 12/2020, S3 có **strong read-after-write** với PUT, ghi đè và DELETE, ở mọi Region, tự động. GET, HEAD và LIST bắt đầu sau khi ghi thành công đều thấy thay đổi. Trước đó, ghi đè và xóa chỉ là eventual, nên các công cụ như S3Guard phải tồn tại để bù. Bây giờ không còn cần chúng nữa.

Vẫn có các giới hạn cần biết. Đầu tiên, cấu hình bucket là eventual, AWS khuyên chờ 15 phút sau khi bật versioning lần đầu. Thứ hai, ghi đồng thời vào một key theo last-writer-wins, và không có khóa object cho người ghi đồng thời. Muốn tránh thì dùng ghi có điều kiện, \`If-None-Match\` hoặc \`If-Match\`. Thứ ba, không có cập nhật nguyên tử qua nhiều key, nên một job ghi nhiều tệp vẫn có thể bị nhìn thấy khi mới xong một nửa, vì vậy cần Iceberg hoặc Delta Lake. Cuối cùng, Replication là bất đồng bộ, nên bản ở Region khác có thể đi sau.`,
    keyPoints: [
      { text: 'Strong read-after-write từ tháng 12/2020', keywords: ['strong', 'read-after-write', '2020'], weight: 3 },
      { text: 'Cấu hình bucket là eventual', keywords: ['cấu hình bucket', 'versioning', '15 phút'] },
      { text: 'Ghi đồng thời theo last-writer-wins, có ghi có điều kiện', keywords: ['last-writer-wins', 'if-none-match', 'if-match', 'có điều kiện'] },
      { text: 'Không nguyên tử qua nhiều key', keywords: ['nhiều key', 'nhiều tệp', 'nguyên tử'], weight: 2 },
      { text: 'Replication bất đồng bộ', keywords: ['replication', 'bất đồng bộ'] },
    ],
    followUps: ['S3Guard từng giải quyết vấn đề gì?', 'Dùng ghi có điều kiện để làm khóa thế nào?'],
    commonMistakes: ['Trả lời theo tài liệu cũ rằng S3 là eventual với ghi đè.', 'Cho rằng strong nghĩa là có giao dịch nhiều object.'],
  },
  {
    id: 'iv-cloud-s3-03',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-s3', 'dw-data-lake', 'spark-small-files'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Thiết kế tổ chức lưu trữ cho một Data Lake 2 PB trên S3. Bạn chú ý những gì về layout, hiệu năng và chi phí?',
    referenceAnswer: `**Layout:** tôi chia lớp raw, clean, curated, mỗi lớp có quy ước prefix và quyền riêng. Dữ liệu dùng để truy vấn lưu Parquet theo partition mà truy vấn hay lọc, thường là ngày. Không chia quá nhỏ, vì partition có cardinality cao sinh rất nhiều tệp nhỏ.

**Hiệu năng:** tệp nhỏ là vấn đề lớn nhất, vì mỗi tệp tốn yêu cầu GET và metadata. Tôi gộp định kỳ về 128 đến 512 MB. S3 cho ít nhất 3.500 PUT và 5.500 GET mỗi giây trên mỗi prefix phân vùng, tự tăng dần, nên job ghi đồng loạt cần retry có backoff. Tôi dùng định dạng bảng như Iceberg để commit nguyên tử và không phải LIST nhiều.

**Chi phí:** Lifecycle tự chuyển theo tuổi: Standard cho dữ liệu nóng, Intelligent-Tiering khi không rõ tần suất đọc, Glacier cho lưu trữ dài hạn. Phải tính thời gian lưu tối thiểu và phí lấy lại, và gộp tệp nhỏ trước khi chuyển. Dữ liệu tái tạo được có thể dùng One Zone-IA.

**An toàn:** bật versioning cho lớp quan trọng, vì xóa nhầm không được Replication cứu, có Lifecycle dọn phiên bản cũ và multipart dở dang.`,
    keyPoints: [
      { text: 'Chia lớp và partition theo cách truy vấn', keywords: ['lớp', 'raw', 'partition', 'parquet'], weight: 2 },
      { text: 'Gộp tệp nhỏ', keywords: ['tệp nhỏ', 'small files', 'gộp', 'compaction'], weight: 2 },
      { text: 'Giới hạn yêu cầu theo prefix và retry', keywords: ['3.500', '5.500', 'prefix', 'backoff', 'slow down'] },
      { text: 'Lifecycle và storage class', keywords: ['lifecycle', 'storage class', 'glacier', 'intelligent-tiering'], weight: 2 },
      { text: 'Định dạng bảng để commit nguyên tử', keywords: ['iceberg', 'delta', 'định dạng bảng'] },
      { text: 'Versioning để chống xóa nhầm', keywords: ['versioning', 'xóa nhầm'] },
    ],
    followUps: ['Bạn chọn số partition thế nào?', 'Cách tính thời điểm nên chuyển sang lớp rẻ hơn?'],
    commonMistakes: ['Chỉ nói về một storage class.', 'Không nhắc đến vấn đề tệp nhỏ.'],
  },
  {
    id: 'iv-cloud-s3-04',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-s3', 'dw-data-lakehouse', 'etl-idempotency'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Một job Spark ghi 5.000 tệp vào S3 rồi lỗi ở giữa chừng. Người đọc thấy gì? Làm sao để việc ghi trở nên nguyên tử?',
    referenceAnswer: `Nếu ghi trực tiếp vào đường dẫn đích, người đọc có thể thấy một phần tệp, vì strong read-after-write chỉ áp dụng cho từng key, và S3 không có giao dịch qua nhiều key. Job lỗi để lại tệp dở, và chạy lại với append sẽ tạo dữ liệu trùng.

Trên HDFS, cách cổ điển là ghi vào thư mục tạm rồi đổi tên, vì đổi tên là nguyên tử. Trên S3, đổi tên là sao chép rồi xóa, nên vừa chậm vừa không nguyên tử. Các committer dành cho S3 giảm được một phần, bằng multipart upload rồi hoàn tất ở bước commit, nhưng vẫn không tạo ra một điểm commit nguyên tử thật sự cho toàn job, và người đọc chỉ dựa vào việc liệt kê tệp.

Cách đúng là chuyển ranh giới giao dịch sang **metadata**: Iceberg hoặc Delta Lake. Tệp dữ liệu được ghi trước, người đọc không thấy vì chúng chưa nằm trong snapshot. Sau đó một thao tác nguyên tử duy nhất công bố snapshot mới, ví dụ ghi có điều kiện lên log. Job lỗi chỉ để lại tệp mồ côi, được dọn sau. Đổi lại phải chạy compaction và dọn snapshot định kỳ, đồng thời xử lý xung đột khi nhiều người ghi đồng thời.`,
    keyPoints: [
      { text: 'Người đọc thấy một phần, vì strong chỉ cho từng key', keywords: ['một phần', 'từng key', 'không có giao dịch'], weight: 2 },
      { text: 'Đổi tên trên S3 không nguyên tử', keywords: ['đổi tên', 'rename', 'sao chép rồi xóa'], weight: 2 },
      { text: 'Committer và multipart upload', keywords: ['committer', 'multipart'] },
      { text: 'Commit qua metadata, snapshot', keywords: ['metadata', 'snapshot', 'iceberg', 'delta'], weight: 3 },
      { text: 'Đánh đổi: tệp mồ côi, compaction, xung đột', keywords: ['mồ côi', 'compaction', 'xung đột'] },
    ],
    followUps: ['Hai job cùng ghi một bảng Iceberg thì xử lý thế nào?', 'Ghi có điều kiện của S3 giúp gì ở đây?'],
    commonMistakes: ['Cho rằng strong consistency của S3 đã giải quyết việc này.', 'Vẫn coi đổi tên là nguyên tử như trên HDFS.'],
  },
  {
    id: 'iv-cloud-ec2-01',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-ec2', 'cloud-fault-tolerance', 'spark-executor'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bạn chạy Spark trên Spot Instance thế nào để giảm chi phí mà vẫn tin cậy?',
    referenceAnswer: `Spot rẻ vì AWS có thể lấy lại máy, thường với cảnh báo khoảng 2 phút, và cảnh báo này cũng không được bảo đảm. Vì vậy tôi thiết kế theo giả định máy có thể mất bất cứ lúc nào.

**Phân bổ:** Driver và một phần Executor chạy On-Demand, vì mất Driver là mất cả ứng dụng. Phần lớn Executor chạy Spot. Mất Executor thì Spark chạy lại Task, kể cả tính lại phần shuffle đã mất.

**Giảm rủi ro thu hồi đồng loạt:** AWS khuyên linh hoạt trên ít nhất 10 loại máy và nhiều AZ, với chiến lược \`price-capacity-optimized\`. Không đặt giá tối đa, vì việc đó làm gián đoạn nhiều hơn.

**Giảm chi phí khi mất máy:** dữ liệu ra ngoài ghi lên S3, không dựa vào đĩa cục bộ. Bật decommissioning của Spark để chuyển shuffle và cache đi khi có cảnh báo. Với job dài, có thể chia thành nhiều bước có điểm dừng.

**Đảm bảo đúng:** bước ghi cuối cùng phải idempotent, vì Task và cả job có thể chạy lại. Tôi cũng đặt ngưỡng: nếu job chạy gần hạn chót mà thiếu máy thì chuyển sang On-Demand. Với job có SLA gắt, tôi chỉ dùng Spot cho phần năng lực dư.`,
    keyPoints: [
      { text: 'Driver On-Demand, Executor phần lớn Spot', keywords: ['driver', 'on-demand', 'executor'], weight: 3 },
      { text: 'Đa dạng loại máy và AZ, price-capacity-optimized', keywords: ['nhiều loại máy', 'price-capacity', 'đa dạng', 'nhiều az'], weight: 2 },
      { text: 'Cảnh báo 2 phút không bảo đảm', keywords: ['2 phút', 'hai phút', 'không bảo đảm', 'cảnh báo'] },
      { text: 'Decommissioning và lưu ra S3', keywords: ['decommission', 's3', 'shuffle'] },
      { text: 'Ghi idempotent, có phương án dự phòng SLA', keywords: ['idempotent', 'sla', 'chuyển sang on-demand'] },
    ],
    followUps: ['Điều gì xảy ra với dữ liệu shuffle khi mất máy?', 'Bạn kiểm thử việc thu hồi thế nào?'],
    commonMistakes: ['Đặt Driver trên Spot.', 'Dùng một loại máy duy nhất.'],
  },
  {
    id: 'iv-cloud-glue-01',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-glue', 'etl-incremental', 'etl-idempotency'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Khi nào bạn chọn AWS Glue thay vì EMR hoặc Lambda? Job Bookmark giúp gì và giới hạn của nó là gì?',
    referenceAnswer: `Tôi chọn theo kích thước việc và mức kiểm soát cần có. **Lambda** cho việc nhỏ theo sự kiện, trong giới hạn thời gian và bộ nhớ của nó. **Glue** cho ETL Spark theo lô chạy không liên tục, khi nhóm không muốn vận hành cụm và muốn dùng sẵn Data Catalog. Năng lực tính theo DPU, mỗi DPU gồm 4 vCPU và 16 GB. **EMR** cho quy mô lớn, cần tinh chỉnh sâu, cần phiên bản cụ thể, hoặc chạy gần như liên tục. Khi đó tiền vận hành có thể đáng bỏ ra.

**Job Bookmark** giúp xử lý tăng dần: nó lưu trạng thái giữa các lần chạy để không đọc lại dữ liệu cũ. Với S3, nó dựa vào thời gian sửa tệp. Với JDBC, nó dựa vào khóa đơn điệu.

**Giới hạn:** nó chỉ theo dõi nguồn, không kiểm soát đích, nên job chạy lại vẫn có thể ghi trùng. Tua bookmark không dọn dữ liệu đã ghi, nên phần ghi vẫn phải idempotent, ví dụ ghi đè theo partition. Phải có đủ \`job.init\`, \`job.commit\` và \`transformation_ctx\`, thiếu là bookmark không hoạt động mà không có cảnh báo rõ ràng. Đổi đường dẫn nguồn cũng có thể làm sai trạng thái.`,
    keyPoints: [
      { text: 'Chọn theo kích thước và mức kiểm soát', keywords: ['lambda', 'emr', 'kiểm soát', 'quy mô'], weight: 2 },
      { text: 'Glue hợp với ETL theo lô không muốn quản lý cụm', keywords: ['serverless', 'theo lô', 'không vận hành', 'không quản lý'] },
      { text: 'Bookmark để xử lý tăng dần', keywords: ['tăng dần', 'trạng thái', 'không đọc lại', 'incremental'], weight: 2 },
      { text: 'Bookmark chỉ theo dõi nguồn, không exactly-once', keywords: ['chỉ theo dõi nguồn', 'exactly-once', 'ghi trùng', 'idempotent'], weight: 2 },
    ],
    followUps: ['Nếu tệp nguồn bị ghi đè thì sao?', 'Khi nào dùng Flex?'],
    commonMistakes: ['Cho rằng serverless thì không cần hiểu Spark.', 'Xem Bookmark là exactly-once.'],
  },
  {
    id: 'iv-cloud-redshift-01',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-redshift', 'dw-star-schema'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Giải thích kiến trúc Redshift. Bạn chọn DISTKEY và SORTKEY thế nào? RA3 và Serverless thay đổi điều gì?',
    referenceAnswer: `Redshift là kho dữ liệu cột, xử lý song song. Leader Node nhận truy vấn, lập kế hoạch và gộp kết quả. Compute Node chia thành các slice, mỗi slice xử lý một phần dữ liệu.

**DISTKEY** quyết định dòng nằm ở slice nào. Tôi đặt theo cột join lớn nhất, thường là cột nối bảng fact với dimension lớn nhất, để dòng khớp nằm cùng slice và không phải truyền qua mạng. Cột phải có nhiều giá trị và phân bố đều, nếu không sẽ lệch dữ liệu. Dimension nhỏ ít đổi có thể dùng ALL. Nếu không chắc thì để AUTO.

**SORTKEY** sắp xếp dữ liệu, mỗi block 1 MB lưu min và max, nên truy vấn theo khoảng bỏ qua được nhiều block. Tôi thường đặt cột thời gian đứng đầu.

**RA3** tách lưu trữ khỏi tính toán: dữ liệu lâu dài trên S3, SSD làm cache. Dữ liệu tăng thì không buộc phải thêm nút. Dòng RG mới hơn cũng theo cách này. **Serverless** bỏ luôn việc chọn nút, năng lực tính bằng RPU và có giới hạn Max RPU-hours, hợp với tải ngắt quãng. Với tải đều gần như cả ngày, cụm provisioned thường dễ dự đoán chi phí hơn.`,
    keyPoints: [
      { text: 'Leader Node, Compute Node, slice', keywords: ['leader', 'compute', 'slice'], weight: 2 },
      { text: 'DISTKEY theo cột join, phân bố đều', keywords: ['distkey', 'cột join', 'cùng slice', 'phân bố đều'], weight: 2 },
      { text: 'SORTKEY và zone map', keywords: ['sortkey', 'zone map', 'min và max', 'bỏ qua block'], weight: 2 },
      { text: 'RA3 tách lưu trữ với SSD cache', keywords: ['ra3', 'managed storage', 'ssd', 'cache'] },
      { text: 'Serverless tính theo RPU', keywords: ['serverless', 'rpu'] },
    ],
    followUps: ['Nếu DISTKEY bị lệch thì phát hiện thế nào?', 'Concurrency Scaling giải quyết vấn đề gì?'],
    commonMistakes: ['Nói Redshift dùng chỉ mục như cơ sở dữ liệu giao dịch.', 'Chọn DISTKEY có ít giá trị.'],
  },
  {
    id: 'iv-cloud-adf-01',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-adf', 'etl-incremental'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn dùng Azure Data Factory để nạp tăng dần từ SQL Server on-premises lên data lake mỗi giờ thế nào? Mô tả các thành phần cần có.',
    referenceAnswer: `Trước hết là chỗ chạy: nguồn nằm sau tường lửa nên tôi cài **Self-hosted Integration Runtime** trong mạng nội bộ. Nó chỉ tạo kết nối đi ra, nên không phải mở cổng vào.

Tiếp theo là khai báo: **Linked Service** cho SQL Server và ADLS, chứa thông tin kết nối, nên để bí mật trong Key Vault. **Dataset** mô tả bảng nguồn và tệp đích.

**Pipeline** gồm một **Copy Activity** đọc theo khoảng thời gian, lọc theo \`updated_at\`, và ghi Parquet theo partition giờ. Với nhiều bảng, tôi dùng Lookup rồi ForEach để không phải làm từng pipeline.

**Trigger** tôi chọn Tumbling Window chứ không phải Schedule. Mỗi lần chạy nhận \`WindowStart\` và \`WindowEnd\`, nên nạp đúng khoảng của mình. Khi lỗi, nó thử lại và chạy bù được, điều mà Schedule không làm được.

Ghi đè theo partition giờ để chạy lại không tạo trùng. Lưu ý rằng lọc theo \`updated_at\` không bắt được dòng bị xóa, nên nếu cần thì phải dùng CDC. Cuối cùng, tôi theo dõi và cảnh báo khi có lần chạy lỗi, và đối soát số dòng với nguồn.`,
    keyPoints: [
      { text: 'Self-hosted IR cho nguồn sau tường lửa', keywords: ['self-hosted', 'tường lửa', 'kết nối đi ra'], weight: 3 },
      { text: 'Linked Service và Dataset', keywords: ['linked service', 'dataset'] },
      { text: 'Copy Activity trong Pipeline', keywords: ['copy activity', 'pipeline'] },
      { text: 'Tumbling Window để chạy bù', keywords: ['tumbling window', 'chạy bù', 'windowstart'], weight: 2 },
      { text: 'Idempotent và hạn chế với dòng bị xóa', keywords: ['ghi đè', 'idempotent', 'cdc', 'dòng bị xóa'] },
    ],
    followUps: ['Khi nào dùng Mapping Data Flow?', 'ADF khác gì với Airflow?'],
    commonMistakes: ['Dùng Azure IR cho nguồn trong mạng riêng.', 'Dùng Schedule và không xử lý được khi lỗi.'],
  },
  {
    id: 'iv-cloud-bigquery-01',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-bigquery', 'db-partitioning'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'BigQuery tính tiền truy vấn thế nào? Bạn giảm chi phí ra sao?',
    referenceAnswer: `BigQuery có hai mô hình. **On-demand** tính theo lượng byte logic mà truy vấn đọc, không phải kết quả trả về. **Capacity** tính theo slot-giờ qua Reservation với các edition. Slot là đơn vị tính toán ảo, và mọi truy vấn đều dùng slot, hai mô hình chỉ khác cách tính tiền.

Vì dữ liệu lưu theo cột, cách giảm tiền trực tiếp nhất là đọc ít đi. Tôi chọn đúng các cột cần, tránh \`SELECT *\`. Tôi partition theo ngày và luôn lọc theo partition, thêm clustering cho các cột hay lọc. Cần nhớ \`LIMIT\` không giảm tiền trên bảng thường, vì dữ liệu vẫn được đọc, chỉ bảng có clustering mới có thể dừng sớm.

Để kiểm soát, tôi dùng dry run để ước tính trước, đây là giới hạn trên. Tôi đặt \`maximum_bytes_billed\`, truy vấn vượt mức sẽ thất bại và không tính tiền. Kết quả lấy từ cache cũng không tính tiền, nên báo cáo lặp lại nên tận dụng, hoặc dùng materialized view.`,
    keyPoints: [
      { text: 'On-demand theo byte đọc, capacity theo slot', keywords: ['byte', 'slot', 'dữ liệu quét', 'on-demand', 'capacity'], weight: 3 },
      { text: 'Chọn ít cột, tránh SELECT *', keywords: ['chọn cột', 'select *', 'ít cột'], weight: 2 },
      { text: 'Partition và clustering', keywords: ['partition', 'clustering'], weight: 2 },
      { text: 'LIMIT không giảm tiền', keywords: ['limit'] },
      { text: 'Dry run và maximum_bytes_billed', keywords: ['dry run', 'maximum_bytes_billed', 'giới hạn'] },
    ],
    followUps: ['Mô hình capacity có làm việc tối ưu truy vấn mất ý nghĩa không?', 'Slot được chia thế nào giữa các truy vấn?'],
    commonMistakes: ['Nghĩ LIMIT làm giảm chi phí.', 'Nghĩ on-demand không dùng slot.'],
  },
  {
    id: 'iv-cloud-bigquery-02',
    topicId: 'cloud',
    category: 'cloud-services',
    conceptIds: ['cloud-bigquery', 'cloud-redshift', 'cloud-scaling'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'So sánh BigQuery và Redshift về mặt kiến trúc. Bạn dựa vào đâu để chọn một trong hai?',
    referenceAnswer: `Cả hai đều lưu theo cột và xử lý song song, nên khác biệt chính nằm ở **ai quản lý năng lực**.

BigQuery là serverless: không có khái niệm nút, truy vấn nhận slot động từ một vùng năng lực rất lớn, và lưu trữ hoàn toàn tách khỏi tính toán. Người dùng không phải chọn cách phân phối dữ liệu, chỉ có partition và clustering. Redshift xuất phát từ cụm MPP: DISTKEY, SORTKEY và số nút ảnh hưởng trực tiếp tới hiệu năng. RA3 đã tách lưu trữ, còn Serverless bỏ việc chọn nút, nhưng mô hình tinh chỉnh vẫn giữ lại.

Từ đó ra đánh đổi. BigQuery ít việc vận hành, hợp với tải thất thường, nhưng ít cách can thiệp khi cần tinh chỉnh, và phải kiểm soát chi phí theo byte nếu dùng on-demand. Redshift cho nhiều quyền kiểm soát, hiệu năng dự đoán được với tải đều và mô hình dữ liệu ổn định, nhưng cần người hiểu cách tinh chỉnh.

Trong thực tế, tôi xét đầu tiên **hệ sinh thái**: dữ liệu và đội ngũ đang ở đâu, vì chi phí và độ trễ truyền dữ liệu ra ngoài rất lớn. Sau đó xét hình dạng tải và năng lực vận hành của nhóm, rồi chạy thử bằng chính các truy vấn của mình, vì số liệu quảng cáo hiếm khi đúng với tải thực.`,
    keyPoints: [
      { text: 'Khác biệt ở cách quản lý năng lực', keywords: ['serverless', 'quản lý năng lực', 'slot', 'số nút'], weight: 3 },
      { text: 'Redshift có DISTKEY, SORTKEY để tinh chỉnh', keywords: ['distkey', 'sortkey', 'tinh chỉnh'], weight: 2 },
      { text: 'Đánh đổi vận hành và kiểm soát', keywords: ['vận hành', 'kiểm soát', 'đánh đổi'] },
      { text: 'Xét hệ sinh thái và hình dạng tải', keywords: ['hệ sinh thái', 'hình dạng tải', 'tải thất thường'], weight: 2 },
      { text: 'Chạy thử bằng tải thực', keywords: ['chạy thử', 'proof of concept', 'poc', 'tải thực'] },
    ],
    followUps: ['Nếu dữ liệu đang ở AWS mà muốn dùng BigQuery thì sao?', 'Snowflake nằm ở đâu trong so sánh này?'],
    commonMistakes: ['Chỉ so sánh giá theo một con số.', 'Nói Redshift vẫn gắn liền lưu trữ và tính toán, bỏ qua RA3.'],
  },
])
