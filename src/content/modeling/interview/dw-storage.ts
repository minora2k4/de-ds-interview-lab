import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-dw-data-warehouse-01',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-data-warehouse', 'db-oltp-olap'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Vì sao phải có Data Warehouse riêng, thay vì chạy báo cáo trên cơ sở dữ liệu giao dịch hoặc read replica của nó?',
    referenceAnswer: `Hệ giao dịch được tối ưu để đọc ghi vài dòng rất nhanh, còn báo cáo lại quét hàng trăm triệu dòng. Hai kiểu tải này có yêu cầu trái ngược nhau, nên chạy chung sẽ gặp bốn vấn đề.

Thứ nhất là **tranh tài nguyên**: báo cáo nặng có thể làm chậm thanh toán. Read replica giải quyết được điểm này, nhưng chỉ điểm này.

Thứ hai là **cách lưu**: replica vẫn lưu theo hàng, nên câu hỏi cần 3 cột vẫn phải đọc cả dòng. Kho cột chỉ đọc đúng các cột cần, nén tốt và xử lý song song.

Thứ ba là **tích hợp**: replica chỉ có dữ liệu của một hệ thống. Doanh thu thường cần cả bán hàng, hoàn tiền và marketing, với mã và định nghĩa được thống nhất.

Thứ tư là **lịch sử**: hệ giao dịch ghi đè giá trị cũ, nên không biết khách ở vùng nào năm ngoái. Kho giữ được lịch sử này.

Với công ty rất nhỏ, chỉ có một nguồn và ít dữ liệu, replica vẫn có thể đủ trong giai đoạn đầu. Tôi sẽ chuyển sang kho khi có nhiều nguồn, hoặc khi cần lịch sử.`,
    keyPoints: [
      { text: 'Hai kiểu tải trái ngược, tranh tài nguyên', keywords: ['tranh tài nguyên', 'làm chậm', 'oltp', 'olap'], weight: 2 },
      { text: 'Lưu theo cột quét nhanh hơn lưu theo hàng', keywords: ['lưu theo cột', 'kho cột', 'columnar', 'lưu theo hàng'], weight: 2 },
      { text: 'Tích hợp nhiều nguồn', keywords: ['tích hợp', 'nhiều nguồn', 'thống nhất'], weight: 2 },
      { text: 'Giữ lịch sử', keywords: ['lịch sử', 'ghi đè', 'history'], weight: 2 },
    ],
    followUps: ['Khi nào một công ty nhỏ chưa cần kho?', 'CDC giúp đưa dữ liệu sang kho như thế nào?'],
    commonMistakes: ['Chỉ nói về tốc độ, bỏ qua tích hợp và lịch sử.', 'Cho rằng read replica giải quyết được mọi vấn đề.'],
  },
  {
    id: 'iv-dw-data-warehouse-02',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-data-warehouse', 'dw-data-mart', 'dw-star-schema'],
    interviewTypes: ['de', 'system-design'],
    levels: ['junior', 'middle', 'senior'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Kimball và Inmon khác nhau thế nào? Bạn chọn cách nào, và điều gì làm bạn đổi quyết định?',
    referenceAnswer: `Cả hai đều muốn tích hợp toàn doanh nghiệp, khác nhau ở chỗ đặt sự tích hợp.

**Inmon** đi từ trên xuống: xây kho chuẩn hóa toàn doanh nghiệp làm nguồn duy nhất, rồi dựng các Data Mart phụ thuộc dạng chiều cho từng phòng ban. Dữ liệu nhất quán tại trung tâm, dễ chịu thay đổi nghiệp vụ. Đổi lại đầu tư ban đầu lớn và lâu có kết quả.

**Kimball** đi theo từng quy trình: mỗi quy trình có một Star Schema, nối với nhau bằng Conformed Dimension qua kiến trúc bus. Có giá trị sớm, người dùng dễ hiểu. Rủi ro là chiều dùng chung bị lệch nếu thiếu kỷ luật, và khi đó các mart thành silo.

Tôi thường bắt đầu theo Kimball, vì giá trị sớm giúp dự án sống được. Tôi sẽ cân nhắc lớp tích hợp kiểu Inmon khi có nhiều nguồn chồng chéo về cùng một thực thể, khi có yêu cầu kiểm toán chặt, hoặc khi nhiều đội cần cùng một tầng dữ liệu sạch.

Trong thực tế hai cách thường kết hợp. Kiến trúc Medallion có Silver gần với lớp tích hợp và Gold gần với lớp chiều. Kho cột rẻ cũng làm cuộc tranh luận về hiệu năng bớt quan trọng, nên điều cần quyết định chủ yếu là tổ chức và quản trị.`,
    keyPoints: [
      { text: 'Inmon: kho chuẩn hóa trung tâm, từ trên xuống', keywords: ['từ trên xuống', 'top down', 'chuẩn hóa', '3nf', 'trung tâm'], weight: 2 },
      { text: 'Kimball: Star Schema theo quy trình, kiến trúc bus', keywords: ['bus', 'từ dưới lên', 'bottom up', 'star schema', 'theo quy trình'], weight: 2 },
      { text: 'Conformed Dimension là cách tích hợp của Kimball', keywords: ['conformed', 'chiều dùng chung'], weight: 2 },
      { text: 'Nêu tiêu chí chọn và khả năng kết hợp', keywords: ['kết hợp', 'tiêu chí', 'medallion', 'kiểm toán'] },
    ],
    followUps: ['Kiến trúc bus của Kimball được lập kế hoạch thế nào?', 'Medallion gần với trường phái nào hơn?'],
    commonMistakes: ['Nói Kimball không tích hợp toàn doanh nghiệp.', 'Chỉ học thuộc từ trên xuống và từ dưới lên, không nêu đánh đổi.'],
  },
  {
    id: 'iv-dw-data-warehouse-03',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-data-warehouse', 'cloud-bigquery', 'cloud-redshift'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao kho dạng cột hiện đại quét hàng TB rất nhanh? Việc tách lưu trữ khỏi tính toán thay đổi điều gì?',
    referenceAnswer: `Tốc độ đến từ việc giảm lượng dữ liệu phải đọc, trước khi tăng sức xử lý.

**Lưu theo cột:** câu hỏi cần 3 trong 100 cột thì chỉ đọc 3 cột. **Nén:** giá trị cùng kiểu đứng cạnh nhau, nên dictionary và run-length rất hiệu quả, dữ liệu nhỏ hơn thì đọc nhanh hơn. **Bỏ qua dữ liệu:** thống kê min và max theo khối giúp không phải đọc những khối chắc chắn không khớp, nên cách sắp xếp dữ liệu rất quan trọng. **Song song:** mỗi máy quét phần của mình, rồi gộp kết quả. Đổi lại, kho cột kém ở việc ghi hoặc đọc từng dòng.

**Tách lưu trữ khỏi tính toán** thay đổi cách vận hành. Khi gắn liền, muốn thêm dữ liệu phải thêm cả máy. Khi tách, dữ liệu nằm trên object storage rẻ, còn cụm tính toán chỉ bật khi cần và co giãn riêng. Nhiều cụm có thể đọc chung một dữ liệu, nên ETL không tranh tài nguyên với BI.

Đánh đổi là dữ liệu phải đi qua mạng, nên cần cache cục bộ. Chi phí cũng khó dự đoán hơn, nên phải giới hạn và theo dõi truy vấn. Một truy vấn sai có thể quét hàng PB và tốn tiền thật.`,
    keyPoints: [
      { text: 'Chỉ đọc cột cần', keywords: ['chỉ đọc', 'lưu theo cột', 'columnar', 'cột cần'], weight: 2 },
      { text: 'Nén hiệu quả', keywords: ['nén', 'dictionary', 'run length'] },
      { text: 'Bỏ qua dữ liệu bằng thống kê', keywords: ['min', 'max', 'bỏ qua', 'zone map', 'pruning', 'data skipping'], weight: 2 },
      { text: 'Tách lưu trữ và tính toán, co giãn độc lập', keywords: ['co giãn', 'độc lập', 'tách lưu trữ', 'object storage'], weight: 2 },
      { text: 'Đánh đổi: qua mạng, cần cache, chi phí khó đoán', keywords: ['qua mạng', 'cache', 'chi phí'] },
    ],
    followUps: ['Cách sắp xếp dữ liệu ảnh hưởng thế nào đến việc bỏ qua khối?', 'Vì sao cập nhật từng dòng trên kho cột lại tốn kém?'],
    commonMistakes: ['Chỉ nói "chạy song song" mà bỏ qua việc giảm dữ liệu phải đọc.'],
  },
  {
    id: 'iv-dw-data-mart-01',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-data-mart', 'dw-data-warehouse'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Data Mart là gì, khác Data Warehouse thế nào? Vì sao Data Mart độc lập lại gây rắc rối?',
    referenceAnswer: `Data Warehouse tích hợp dữ liệu cho toàn doanh nghiệp. Data Mart là phần thu hẹp theo một lĩnh vực như tài chính hay marketing, được tổ chức sẵn cho nhóm đó, nên dễ tìm và dễ dùng hơn. Mart không nhất thiết là hệ thống riêng, nó có thể chỉ là tập view hoặc schema trên cùng kho.

Có hai loại chính. **Mart phụ thuộc** được dựng từ kho chung, nên kế thừa dữ liệu đã làm sạch và định nghĩa thống nhất. **Mart độc lập** lấy thẳng từ nguồn, nên làm rất nhanh.

Rắc rối là mỗi mart độc lập có logic riêng. Ví dụ marketing tính doanh thu gồm cả đơn hủy và ra 52 tỷ đồng, còn tài chính trừ đơn hủy và hoàn tiền nên ra 47 tỷ đồng. Không ai sai về kỹ thuật, nhưng lãnh đạo không biết tin số nào. Mỗi mart cũng là thêm một pipeline phải bảo trì, và rất khó so sánh chéo giữa các phòng ban.

Tôi ưu tiên dựng mart từ kho chung bằng view. Chỉ khi có nhu cầu đặc biệt về hiệu năng hoặc quyền truy cập, tôi mới tạo bảng vật lý riêng.`,
    keyPoints: [
      { text: 'Mart là phần thu hẹp theo lĩnh vực', keywords: ['lĩnh vực', 'phòng ban', 'chuyên đề', 'thu hẹp'], weight: 2 },
      { text: 'Phân biệt phụ thuộc và độc lập', keywords: ['phụ thuộc', 'độc lập', 'dependent', 'independent'], weight: 2 },
      { text: 'Độc lập gây lệch định nghĩa, silo', keywords: ['lệch', 'silo', 'định nghĩa', 'hai con số'], weight: 2 },
      { text: 'Có thể chỉ là view', keywords: ['view', 'schema riêng', 'logic'] },
    ],
    followUps: ['Khi nào bạn mới sao chép dữ liệu thành bảng vật lý riêng cho mart?'],
    commonMistakes: ['Cho rằng mart luôn là một cơ sở dữ liệu riêng.'],
  },
  {
    id: 'iv-dw-data-lake-01',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-data-lake', 'etl-governance'],
    interviewTypes: ['de', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao Data Lake hay biến thành Data Swamp? Bạn phòng tránh hoặc cứu một lake đã thành swamp thế nào?',
    referenceAnswer: `Gốc rễ nằm ở sự bất cân xứng: **ghi vào rất dễ, còn đọc thì tốn kém**. Schema-on-read không xóa bỏ chi phí hiểu dữ liệu, chỉ dời nó sang người đọc. Không ai bị ràng buộc khi ghi, nên chất lượng giảm dần mà không ai thấy ngay.

Biểu hiện cụ thể là thiếu catalog nên không biết có gì, thiếu chủ sở hữu nên không ai chịu trách nhiệm, schema đổi âm thầm, nhiều bản sao không rõ bản nào đúng. Object storage không có giao dịch nhiều tệp, nên job lỗi còn để lại dữ liệu dở dang, và hàng triệu tệp nhỏ làm truy vấn chậm.

**Phòng tránh:** bắt buộc có chủ sở hữu và quy tắc lưu giữ khi nạp, dùng catalog, chia vùng theo mức tin cậy kiểu Bronze, Silver, Gold, kiểm tra chất lượng ở ranh giới, dùng định dạng bảng để có giao dịch.

**Cứu lake đã hỏng:** không xóa hay viết lại ngay. Đầu tiên dùng log truy cập để biết cái gì đang được dùng. Phần ít ai đọc thì chuyển sang lưu trữ lạnh trước khi xóa, vì có thể có yêu cầu pháp lý. Với phần quan trọng, tôi chọn một nguồn chuẩn rồi đưa vào quy trình mới, làm theo mức độ ưu tiên thay vì làm một lần cho tất cả.`,
    keyPoints: [
      { text: 'Ghi dễ, đọc tốn: chi phí dời sang người đọc', keywords: ['ghi dễ', 'người đọc', 'schema on read', 'không ai kiểm tra'], weight: 2 },
      { text: 'Thiếu catalog và chủ sở hữu', keywords: ['catalog', 'chủ sở hữu', 'owner', 'metadata'], weight: 2 },
      { text: 'Thiếu giao dịch và tệp nhỏ', keywords: ['giao dịch', 'dở dang', 'tệp nhỏ', 'small files'] },
      { text: 'Chia vùng và kiểm tra chất lượng', keywords: ['bronze', 'chia vùng', 'chất lượng', 'medallion'] },
      { text: 'Cứu dựa trên số liệu sử dụng', keywords: ['log truy cập', 'số liệu sử dụng', 'lưu trữ lạnh', 'kiểm kê'], weight: 2 },
    ],
    followUps: ['Đo mức độ sức khỏe của lake bằng chỉ số nào?', 'Ai nên sở hữu dữ liệu trong lake?'],
    commonMistakes: ['Cho rằng chuyển sang Lakehouse là tự hết swamp.', 'Chỉ nói về công cụ mà không nói về quyền sở hữu.'],
  },
  {
    id: 'iv-dw-data-lake-02',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-data-lake', 'dw-data-warehouse'],
    interviewTypes: ['de', 'system-design'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'So sánh Data Lake và Data Warehouse. Schema-on-read và schema-on-write ảnh hưởng thế nào đến công việc?',
    referenceAnswer: `Khác biệt cốt lõi là thời điểm áp đặt cấu trúc.

**Schema-on-write** của kho: dữ liệu phải khớp schema mới được nạp. Tốn công thiết kế trước, nhưng người đọc nhận được dữ liệu đã kiểm tra và truy vấn rất nhanh.

**Schema-on-read** của lake: nạp gần như mọi thứ, cấu trúc chỉ được diễn giải khi đọc. Nạp rất nhanh và linh hoạt, kể cả log, ảnh, sự kiện thô, nhưng người đọc phải tự hiểu dữ liệu và tự xử lý lỗi.

Về chi phí, lake lưu rẻ trên object storage, và nhiều engine dùng chung được. Kho thường đắt hơn cho mỗi TB, nhưng được tối ưu sẵn cho BI, có giao dịch và kiểm soát truy cập rõ ràng.

Về công việc, lake phù hợp với lưu dữ liệu gốc để xử lý lại, khám phá dữ liệu mới và làm nguyên liệu cho học máy. Kho phù hợp với báo cáo nhiều người dùng, cần số liệu nhất quán.

Nhiều nơi dùng cả hai: lake là nơi nhận và giữ dữ liệu gốc, kho là nơi phục vụ. Cách đó tốn thêm công chép dữ liệu, và đó là lý do Lakehouse ra đời.`,
    keyPoints: [
      { text: 'Schema-on-write và schema-on-read', keywords: ['schema on write', 'schema on read', 'khi ghi', 'khi đọc'], weight: 3 },
      { text: 'Lake lưu rẻ, mọi định dạng', keywords: ['lưu rẻ', 'object storage', 'mọi định dạng', 'phi cấu trúc'], weight: 2 },
      { text: 'Kho tối ưu cho BI, có giao dịch', keywords: ['bi', 'giao dịch', 'truy vấn nhanh', 'nhất quán'], weight: 2 },
      { text: 'Dùng kết hợp, dẫn tới Lakehouse', keywords: ['kết hợp', 'cả hai', 'lakehouse'] },
    ],
    followUps: ['Chi phí của hai tầng lake và kho nằm ở đâu?'],
    commonMistakes: ['Nói lake không có schema.', 'Kết luận một bên thay thế hoàn toàn bên kia.'],
  },
  {
    id: 'iv-dw-data-lakehouse-01',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-data-lakehouse', 'db-acid', 'cloud-s3'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Object storage không có giao dịch nhiều tệp. Vậy Delta Lake và Iceberg đạt được ACID thế nào? Giới hạn của cách này là gì?',
    referenceAnswer: `Object storage chỉ bảo đảm ghi nguyên tử trên một đối tượng. Ý tưởng là **quy commit nhiều tệp về đúng một thao tác nguyên tử**.

Đầu tiên ghi các tệp dữ liệu mới. Chưa ai thấy chúng, vì chưa có metadata nào trỏ tới. Sau đó công bố phiên bản mới. **Delta Lake** tạo tệp JSON tiếp theo trong \`_delta_log\`, tệp này là đơn vị nguyên tử. **Iceberg** viết tệp metadata mới rồi đổi con trỏ trong catalog bằng check-and-put.

Từ đó có ACID: **nguyên tử** vì chỉ có một điểm công bố, **nhất quán** vì schema được kiểm tra khi ghi, **cô lập** vì người đọc giữ một snapshot, **bền** nhờ object storage. Hai bên cùng commit thì chỉ một bên thắng, bên thua kiểm tra xung đột rồi thử lại. Đây là optimistic concurrency, tốt khi ít xung đột.

**Giới hạn:** cần một điểm loại trừ lẫn nhau. Tài liệu Delta nêu rằng cấu hình mặc định trên S3 chỉ cho một driver ghi, ghi từ nhiều cụm cần LogStore dùng DynamoDB. Iceberg dựa vào catalog. Giao dịch nằm trong một bảng, không có giao dịch nhiều bảng trên Delta Lake. Tải ghi đồng thời cao vào cùng tệp sẽ phải thử lại nhiều. Cuối cùng, tệp mồ côi và tệp cũ phải được dọn, ví dụ \`VACUUM\`, và không tự chạy.`,
    keyPoints: [
      { text: 'Quy về một thao tác công bố nguyên tử', keywords: ['một thao tác', 'nguyên tử', 'atomic', 'công bố'], weight: 3 },
      { text: 'Delta: tệp log JSON; Iceberg: đổi con trỏ catalog', keywords: ['delta log', 'json', 'catalog', 'con trỏ', 'check and put'], weight: 2 },
      { text: 'Snapshot cho người đọc, optimistic concurrency', keywords: ['snapshot', 'optimistic', 'thử lại', 'xung đột'], weight: 2 },
      { text: 'Giới hạn: S3 cần LogStore, không có giao dịch nhiều bảng', keywords: ['dynamodb', 'logstore', 'nhiều bảng', 'loại trừ lẫn nhau'], weight: 2 },
    ],
    followUps: ['Vì sao rename không phải là lựa chọn tốt trên S3?', 'Tại sao xung đột lại phụ thuộc vào việc hai bên có đụng cùng tệp hay không?'],
    commonMistakes: ['Nói S3 hoặc Parquet tự có ACID.', 'Không nêu được điểm nguyên tử nằm ở đâu.'],
  },
  {
    id: 'iv-dw-data-lakehouse-02',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-data-lakehouse', 'dw-schema-evolution'],
    interviewTypes: ['de', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'So sánh Delta Lake, Apache Iceberg và Apache Hudi. Bạn chọn thế nào cho một nền tảng mới?',
    referenceAnswer: `Cả ba đều thêm lớp metadata lên tệp mở, với commit nguyên tử và optimistic concurrency. Khác biệt nằm ở thiết kế và thế mạnh.

**Delta Lake** dùng log JSON với checkpoint trong \`_delta_log\`. Đơn giản, tích hợp sâu với Spark. Đổi tên và xóa cột cần bật column mapping, và không đảo ngược được.

**Iceberg** dùng cây metadata, manifest list, manifest, commit bằng đổi con trỏ trong catalog. Không cần liệt kê thư mục hay rename. Cột nhận diện bằng ID, nên thay đổi schema rất an toàn. Hidden partitioning giúp người dùng không phải biết cột phân vùng, và đổi cách phân vùng không phải ghi lại dữ liệu cũ. Từ v2 có row-level delete, v3 có deletion vector.

**Hudi** dùng timeline, mạnh về upsert theo khóa và đọc gia tăng. Có Copy-on-Write và Merge-on-Read, cùng các dịch vụ bảng như compaction và clustering. Đổi lại có nhiều cấu hình hơn.

Tôi chọn theo ràng buộc thực tế. Toàn Spark hoặc Databricks thì Delta Lake tự nhiên. Nhiều engine, muốn tránh phụ thuộc, thì Iceberg. Upsert liên tục, đọc gia tăng là tải chính thì đánh giá Hudi. Trước khi quyết định, tôi chạy thử với chính tải của mình, vì các tính năng hội tụ dần. Tính năng thay đổi theo phiên bản, nên phải kiểm tra tài liệu hiện hành.`,
    keyPoints: [
      { text: 'Delta: log JSON và checkpoint, hợp Spark', keywords: ['delta log', 'json', 'checkpoint', 'spark'], weight: 2 },
      { text: 'Iceberg: manifest, catalog, hidden partitioning', keywords: ['manifest', 'catalog', 'hidden partitioning', 'partition evolution'], weight: 2 },
      { text: 'Hudi: timeline, upsert, COW và MOR', keywords: ['timeline', 'upsert', 'merge on read', 'compaction'], weight: 2 },
      { text: 'Chọn theo engine và tải, chạy thử', keywords: ['engine', 'chạy thử', 'proof of concept', 'poc', 'tải thực tế'], weight: 2 },
    ],
    followUps: ['Khi nào cần catalog riêng cho Iceberg?', 'Có thể đọc bảng Delta như bảng Iceberg không?'],
    commonMistakes: ['Tuyên bố một định dạng luôn thắng mà không nêu ràng buộc.', 'Đưa ra so sánh tính năng đã lỗi thời.'],
  },
  {
    id: 'iv-dw-data-lakehouse-03',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-data-lakehouse', 'dw-data-warehouse'],
    interviewTypes: ['system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Một công ty 40 TB dữ liệu, chủ yếu làm BI, đội dữ liệu 3 người. Họ nên dùng kho quản lý sẵn hay Lakehouse? Quyết định sẽ đổi khi nào?',
    referenceAnswer: `Với mô tả này, tôi nghiêng về kho quản lý sẵn. Dữ liệu 40 TB không quá lớn với kho, tải chính là BI, và 3 người không nên dành thời gian cho việc gộp tệp, dọn snapshot hay vận hành catalog. Kho cho nhiều người dùng đồng thời, nhiều tính năng có sẵn, và ít việc vận hành hơn. Tiền quản lý thường rẻ hơn tiền người.

Tôi sẽ hỏi thêm vài điều trước khi chốt: có dữ liệu phi cấu trúc không, có cần học máy trên dữ liệu thô không, tăng trưởng dự kiến thế nào, ngân sách và yêu cầu về vị trí lưu dữ liệu ra sao.

Quyết định đổi sang Lakehouse khi: dữ liệu thô tăng tới hàng trăm TB và chi phí kho không còn hợp lý; nhiều engine như Spark, Flink, Trino cần dùng chung một bản dữ liệu; có upsert CDC lớn; hoặc tổ chức muốn tránh phụ thuộc vào một nhà cung cấp.

Con đường trung gian cũng phổ biến: giữ dữ liệu thô ở định dạng mở trên object storage và phục vụ BI từ kho. Nhiều kho nay đọc được cả bảng Iceberg. Giữ mô hình chiều độc lập với nền tảng thì việc đổi sau này cũng bớt tốn kém.`,
    keyPoints: [
      { text: 'Chọn theo tải, quy mô và năng lực đội', keywords: ['năng lực', 'đội nhỏ', '3 người', 'vận hành', 'bi'], weight: 3 },
      { text: 'Chi phí vận hành của Lakehouse', keywords: ['gộp tệp', 'compaction', 'vận hành', 'bảo trì', 'catalog'], weight: 2 },
      { text: 'Tiêu chí đổi: nhiều engine, dữ liệu thô lớn, CDC', keywords: ['nhiều engine', 'dữ liệu thô', 'upsert', 'phụ thuộc'], weight: 2 },
      { text: 'Phương án kết hợp', keywords: ['kết hợp', 'định dạng mở', 'trung gian'] },
    ],
    followUps: ['Bạn ước lượng chi phí của hai phương án như thế nào?', 'Làm sao giảm chi phí chuyển đổi trong tương lai?'],
    commonMistakes: ['Mặc định chọn công nghệ mới nhất mà không hỏi về đội và tải.', 'Không nêu điều kiện làm quyết định thay đổi.'],
  },
  {
    id: 'iv-dw-medallion-01',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-medallion'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Trình bày kiến trúc Medallion. Mỗi tầng Bronze, Silver, Gold chứa gì và ai dùng?',
    referenceAnswer: `Medallion tổ chức dữ liệu thành các tầng có chất lượng tăng dần, còn gọi là multi-hop.

**Bronze** nhận dữ liệu gần như nguyên gốc, chủ yếu chỉ thêm, kèm thời điểm nạp và nguồn. Không làm sạch ở đây, để giữ đường lui khi logic sau này sai. Người dùng chính là kỹ sư dữ liệu và đội kiểm toán.

**Silver** khử trùng lặp, ép kiểu, chuẩn hóa mã, loại hoặc cách ly bản ghi lỗi. Dữ liệu vẫn chi tiết và theo thực thể, chưa gắn với báo cáo nào. Kỹ sư, phân tích viên và nhà khoa học dữ liệu dùng tầng này khi cần chi tiết.

**Gold** chứa mô hình chiều và bảng tổng hợp theo nghiệp vụ, ví dụ Star Schema bán hàng và doanh thu theo ngày. Đây là nơi có định nghĩa chính thức, phục vụ BI và lãnh đạo.

Ví dụ với đơn hàng: Bronze giữ nguyên từng sự kiện CDC. Silver chỉ còn trạng thái đúng của mỗi đơn. Gold có fact đơn hàng và doanh thu thuần theo tháng.

Đây là khuyến nghị, không phải yêu cầu. Số tầng có thể thay đổi, nhưng nên giữ ý nghĩa của từng tầng.`,
    keyPoints: [
      { text: 'Bronze: dữ liệu gốc, chủ yếu chỉ thêm', keywords: ['bronze', 'nguyên gốc', 'dữ liệu thô', 'raw'], weight: 2 },
      { text: 'Silver: làm sạch, khử trùng, chuẩn hóa', keywords: ['silver', 'làm sạch', 'khử trùng', 'chuẩn hóa'], weight: 2 },
      { text: 'Gold: mô hình chiều và tổng hợp', keywords: ['gold', 'mô hình chiều', 'tổng hợp', 'star schema'], weight: 2 },
      { text: 'Người dùng khác nhau ở từng tầng', keywords: ['kỹ sư', 'phân tích viên', 'bi', 'lãnh đạo'] },
    ],
    followUps: ['Dashboard có nên đọc trực tiếp Silver không?', 'Bảng nào nên là view thay vì bảng thật?'],
    commonMistakes: ['Đưa logic nghiệp vụ vào Bronze.', 'Coi Silver chỉ là bản chép của Bronze.'],
  },
  {
    id: 'iv-dw-medallion-02',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-medallion', 'etl-idempotency'],
    interviewTypes: ['de', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao phải giữ tầng Bronze thô, trong khi đã có Silver sạch hơn và tốn thêm chi phí lưu trữ?',
    referenceAnswer: `Vì mọi phép biến đổi đều có thể sai, và nguồn không phải lúc nào cũng cho lấy lại dữ liệu.

Khử trùng và làm sạch là các phép **mất thông tin**: dữ liệu đã bị loại thì Silver không còn biết tới nó. Kafka có thể chỉ giữ 7 ngày, hệ nguồn có thể đã ghi đè hoặc đã xóa. Nếu sau 3 tháng phát hiện logic khử trùng loại nhầm đơn hàng, làm doanh thu thấp hơn 1,5%, thì không có Bronze là không sửa được. Có Bronze, tôi sửa logic rồi chạy lại Silver và Gold cho khoảng thời gian đó.

Bronze còn có các lợi ích khác: **truy vết** khi kiểm toán hoặc khi tranh luận số nào đúng, **tiếp nhận thay đổi schema** của nguồn mà không làm mất dữ liệu, và **yêu cầu mới** có thể lấy các trường trước đây chưa dùng.

Muốn chạy lại an toàn, pipeline phải lũy đẳng. Chi phí có thể kiểm soát: đặt thời hạn giữ dài hơn khoảng thời gian thường cần để phát hiện lỗi, và chuyển phần cũ sang lớp lưu trữ rẻ hơn. Nếu nguồn đã là log bất biến giữ đủ lâu, Bronze có thể ngắn hơn.

Bronze cũng có giới hạn: dữ liệu cá nhân ở đó vẫn phải tuân theo yêu cầu xóa.`,
    keyPoints: [
      { text: 'Biến đổi có thể sai và làm mất thông tin', keywords: ['mất thông tin', 'có thể sai', 'không lấy lại', 'đã bị loại'], weight: 3 },
      { text: 'Nguồn không giữ dữ liệu lâu', keywords: ['nguồn', 'retention', 'kafka', 'ghi đè', 'thời hạn'], weight: 2 },
      { text: 'Chạy lại cần pipeline lũy đẳng', keywords: ['chạy lại', 'lũy đẳng', 'idempotent', 'xử lý lại'], weight: 2 },
      { text: 'Kiểm soát chi phí bằng thời hạn giữ và lưu trữ rẻ', keywords: ['thời hạn giữ', 'lưu trữ lạnh', 'lớp rẻ', 'chi phí'] },
    ],
    followUps: ['Chọn thời hạn giữ Bronze dựa trên điều gì?', 'Bronze nên lưu định dạng gốc hay chuyển sang Parquet?'],
    commonMistakes: ['Nói Bronze để dự phòng khi mất Silver, thay vì để sửa lỗi logic.', 'Bỏ qua chi phí và yêu cầu xóa dữ liệu.'],
  },
  {
    id: 'iv-dw-medallion-03',
    topicId: 'modeling',
    category: 'dw-storage',
    conceptIds: ['dw-medallion', 'dw-data-lakehouse', 'etl-cdc'],
    interviewTypes: ['de', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Thiết kế nền tảng theo Medallion cho một sàn thương mại điện tử có CDC từ cơ sở dữ liệu đơn hàng và 2 TB sự kiện click mỗi ngày.',
    referenceAnswer: `Trước hết tôi hỏi rõ độ trễ cần thiết, ví dụ dashboard 15 phút, báo cáo tài chính theo ngày, và các yêu cầu pháp lý.

**Bronze:** CDC và sự kiện đi qua Kafka vào bảng định dạng mở, chỉ thêm, phân vùng theo ngày nạp, kèm offset và nguồn. Luồng click có schema đăng ký ở Schema Registry, chế độ backward. Thời hạn giữ là 90 ngày, sau đó chuyển sang lưu trữ rẻ.

**Silver:** với đơn hàng, MERGE theo khóa và thứ tự trong log, nên chạy lại vẫn đúng. Có thể dùng Merge-on-Read nếu tải cập nhật lớn, kèm compaction định kỳ. Với click, khử trùng theo \`event_id\`, xử lý dữ liệu trễ trong một khung thời gian, ghép phiên. Bản ghi lỗi đưa vào vùng cách ly và có cảnh báo.

**Gold:** Star Schema bán hàng với grain dòng hàng, Conformed Dimension cho khách hàng và sản phẩm, SCD Type 2 cho phân khúc. Thêm bảng tổng hợp theo ngày cho dashboard.

**Xuyên suốt:** kiểm tra chất lượng ở ranh giới các tầng, lineage, phân quyền theo tầng với dữ liệu cá nhân. Quy trình xóa theo yêu cầu phải đi qua cả ba tầng, gồm cả việc dọn tệp cũ. Bảo trì gồm gộp tệp nhỏ và dọn snapshot. Tôi cũng đo chi phí theo tầng, vì click 2 TB mỗi ngày rất tốn nếu giữ lâu ở mức chi tiết.`,
    keyPoints: [
      { text: 'Làm rõ độ trễ và yêu cầu', keywords: ['độ trễ', 'latency', 'yêu cầu', 'pháp lý'] },
      { text: 'Bronze chỉ thêm, kèm offset, có thời hạn giữ', keywords: ['bronze', 'chỉ thêm', 'offset', 'thời hạn giữ'], weight: 2 },
      { text: 'Silver MERGE theo khóa, khử trùng, lũy đẳng', keywords: ['merge', 'khử trùng', 'lũy đẳng', 'event id', 'dữ liệu trễ'], weight: 3 },
      { text: 'Gold Star Schema và grain rõ ràng', keywords: ['gold', 'star schema', 'grain', 'conformed'], weight: 2 },
      { text: 'Chất lượng, xóa dữ liệu, bảo trì', keywords: ['chất lượng', 'gdpr', 'xóa', 'compaction', 'gộp tệp'], weight: 2 },
    ],
    followUps: ['Khi cần dashboard dưới 1 phút thì kiến trúc đổi thế nào?', 'Backfill một năm dữ liệu mà không ảnh hưởng tải đang chạy bằng cách nào?'],
    commonMistakes: ['Chỉ liệt kê ba tầng mà không nói cách xử lý trùng lặp và dữ liệu trễ.', 'Không nhắc đến xóa dữ liệu và chi phí bảo trì.'],
  },
])
