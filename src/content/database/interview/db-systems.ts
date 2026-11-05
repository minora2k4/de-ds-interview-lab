import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-db-oltp-olap-01',
    topicId: 'database',
    category: 'db-systems',
    conceptIds: ['db-oltp-olap'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'OLTP và OLAP khác nhau thế nào? Cho ví dụ về mỗi loại.',
    referenceAnswer: `OLTP phục vụ các thao tác nghiệp vụ ngắn: đặt hàng, trừ tồn kho, đổi mật khẩu. Mỗi thao tác chạm vài dòng, qua index, cần phản hồi trong mili giây, và có hàng nghìn người ghi đồng thời. Ví dụ PostgreSQL, MySQL, với lược đồ chuẩn hóa để ghi an toàn.

OLAP phục vụ câu hỏi phân tích: doanh thu theo vùng, theo tháng trong 3 năm. Mỗi truy vấn quét hàng triệu đến hàng tỷ dòng nhưng chỉ cần vài cột, có thể chạy vài giây đến vài phút. Ví dụ BigQuery, Redshift, lưu theo cột, với lược đồ hình sao để Join ít.

Khác biệt cốt lõi là mô hình truy cập. Từ đó kéo theo khác biệt về lưu trữ, lược đồ và cách ghi: OLTP ghi liên tục từng dòng, OLAP thường nạp theo lô. Vì vậy, dữ liệu thường được đưa từ OLTP sang OLAP qua ETL hoặc CDC, và báo cáo chấp nhận một độ trễ nhất định.`,
    keyPoints: [
      { text: 'OLTP: thao tác ngắn, vài dòng, mili giây', keywords: ['vài dòng', 'mili giây', 'giao dịch ngắn', 'nghiệp vụ'], weight: 2 },
      { text: 'OLAP: quét nhiều dòng, ít cột, phân tích', keywords: ['quét', 'nhiều dòng', 'phân tích', 'gom nhóm', 'vài cột'], weight: 2 },
      { text: 'Lưu theo dòng và lưu theo cột', keywords: ['theo dòng', 'theo cột', 'columnar', 'row store'] },
      { text: 'Chuẩn hóa và lược đồ hình sao', keywords: ['chuẩn hóa', '3nf', 'hình sao', 'star schema'] },
      { text: 'Dữ liệu chuyển qua ETL hoặc CDC', keywords: ['etl', 'cdc', 'độ trễ'] },
    ],
    followUps: ['Vì sao lưu theo cột nhanh hơn cho phân tích?', 'HTAP là gì?'],
    commonMistakes: ['Chỉ nêu tên công cụ mà không nói được mô hình truy cập.'],
  },
  {
    id: 'iv-db-oltp-olap-02',
    topicId: 'database',
    category: 'db-systems',
    conceptIds: ['db-oltp-olap'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao lưu theo cột nhanh hơn nhiều cho phân tích? Điểm yếu của nó là gì?',
    referenceAnswer: `Chi phí của truy vấn lớn chủ yếu nằm ở lượng dữ liệu phải đọc. Lưu theo dòng đặt các cột của một dòng cạnh nhau, nên đọc một cột cũng phải đi qua mọi cột còn lại. Với bảng 100 cột mà truy vấn cần 3 cột, 97% dữ liệu đọc lên là lãng phí.

Lưu theo cột đặt giá trị của cùng một cột liền nhau, mang lại bốn lợi ích. Một là chỉ đọc đúng cột cần. Hai là nén rất tốt, vì cùng kiểu dữ liệu và hay lặp, nên 24 GB có thể còn 5 GB. Ba là thực thi theo lô trên từng khối giá trị, tận dụng cache CPU và lệnh SIMD. Bốn là metadata min, max giúp bỏ qua cả khối khi lọc.

Điểm yếu là ghi và đọc từng dòng. Một dòng nằm rải rác ở nhiều vùng cột, nên sửa hay lấy đủ một dòng phải chạm nhiều khối nén. Vì vậy, các hệ này thường nạp theo lô, không hợp với tải đồng thời cao hay tra cứu từng dòng. Ý tưởng tương tự cũng có ở Parquet trên Data Lake.`,
    keyPoints: [
      { text: 'Chỉ đọc đúng các cột cần', keywords: ['đúng cột', 'chỉ đọc', 'bỏ qua cột', 'ít cột'], weight: 2 },
      { text: 'Nén tốt do cùng kiểu, hay lặp', keywords: ['nén tốt', 'tỷ lệ nén', 'compression', 'run length', 'dictionary'], weight: 2 },
      { text: 'Thực thi theo lô', keywords: ['theo lô', 'vectorized', 'simd', 'cache cpu'] },
      { text: 'Bỏ khối nhờ metadata', keywords: ['min max', 'metadata', 'bỏ qua khối', 'zone map'] },
      { text: 'Yếu ở ghi và đọc từng dòng', keywords: ['từng dòng', 'cập nhật', 'ghi chậm', 'rải rác'], weight: 2 },
    ],
    followUps: ['Dữ liệu sắp xếp theo cột nào thì có lợi nhất?', 'Parquet giống và khác kho lưu cột ở đâu?'],
    commonMistakes: ['Chỉ nói "đọc ít cột" mà quên nén và thực thi theo lô.', 'Không nói được điểm yếu.'],
  },
  {
    id: 'iv-db-oltp-olap-03',
    topicId: 'database',
    category: 'db-systems',
    conceptIds: ['db-oltp-olap', 'db-transactions', 'etl-cdc'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Báo cáo đang chạy trên primary của hệ nghiệp vụ, và gây ảnh hưởng đến hiệu năng. MVCC đã cho đọc không chặn ghi, vậy vì sao vẫn có vấn đề? Bạn xử lý thế nào?',
    referenceAnswer: `MVCC chỉ gỡ xung đột khóa giữa đọc và ghi. Các tài nguyên chung vẫn bị chiếm. Quét lớn đẩy các trang nóng ra khỏi buffer cache, nên giao dịch phải đọc đĩa nhiều hơn. Truy vấn lớn tranh CPU và I/O. Quan trọng hơn, snapshot chạy hàng giờ cản \`VACUUM\` dọn các phiên bản cũ, làm bảng phình ra và mọi truy vấn chậm dần, ngay cả sau khi báo cáo đã xong.

Tôi xử lý theo mức độ. Đầu tiên, báo cáo có thể đang viết kém, nên tôi xem kế hoạch thực thi, và đặt \`statement_timeout\` để chặn truy vấn quá dài.

Tiếp theo, nếu báo cáo nhỏ và cần dữ liệu mới, tôi chuyển sang **read replica**. Primary hết bị ảnh hưởng, nhưng truy vấn dài có thể xung đột với việc phát lại log, và replica vẫn lưu theo dòng.

Khi dữ liệu lớn dần hoặc truy vấn đa dạng, tôi đưa dữ liệu sang **kho lưu theo cột** qua CDC hoặc nạp theo lô, dùng lược đồ hình sao. Đổi lại, phải vận hành pipeline, chấp nhận độ trễ, và đối soát số liệu giữa hai bên.`,
    keyPoints: [
      { text: 'MVCC chỉ gỡ khóa, tài nguyên vẫn bị chiếm', keywords: ['cache', 'cpu', 'i/o', 'tài nguyên'], weight: 2 },
      { text: 'Snapshot dài cản VACUUM', keywords: ['vacuum', 'snapshot', 'phình', 'bloat'], weight: 2 },
      { text: 'Chuyển sang read replica và giới hạn của nó', keywords: ['replica', 'phát lại log', 'bản sao'] },
      { text: 'Đưa sang kho lưu cột qua CDC', keywords: ['cdc', 'kho dữ liệu', 'warehouse', 'theo cột'], weight: 2 },
      { text: 'Đánh đổi về độ trễ và vận hành', keywords: ['độ trễ', 'pipeline', 'đối soát'] },
    ],
    followUps: ['CDC bắt thay đổi từ đâu?', 'Làm sao đối soát số liệu giữa hai hệ?'],
    commonMistakes: ['Cho rằng MVCC làm báo cáo không còn ảnh hưởng gì.', 'Đề xuất ngay kho dữ liệu cho một báo cáo nhỏ.'],
  },
  {
    id: 'iv-db-oltp-olap-04',
    topicId: 'database',
    category: 'db-systems',
    conceptIds: ['db-oltp-olap', 'etl-cdc', 'dw-data-warehouse'],
    interviewTypes: ['de', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Thiết kế hệ phục vụ dashboard doanh thu gần thời gian thực, với yêu cầu trễ dưới 1 phút, cho sàn thương mại có 5.000 đơn mỗi giây, mà không làm ảnh hưởng hệ đặt hàng.',
    referenceAnswer: `Yêu cầu chính là tách hai tải. Tôi không chạy truy vấn trên OLTP, cũng không ghi đồng bộ sang kho dữ liệu trong giao dịch đặt hàng.

Tôi dùng **CDC đọc log của cơ sở dữ liệu** (WAL hoặc binlog) và đẩy vào Kafka. Cách này không chạm vào đường ghi, không bỏ sót thay đổi và giữ thứ tự theo khóa. Cần đặt key theo \`order_id\` và xử lý trùng, vì đảm bảo thường là at-least-once.

Tiếp theo, một job streaming tính trước các chỉ số theo cửa sổ, rồi ghi vào kho phân tích thời gian thực như ClickHouse. Dashboard đọc từ các bảng đã tổng hợp này, nên độ trễ ổn định và không phụ thuộc vào kích thước dữ liệu gốc.

Song song, dữ liệu chi tiết được nạp vào kho dữ liệu chính để phân tích sâu và **đối soát hằng ngày**, vì số liệu streaming có thể lệch do dữ liệu đến muộn hoặc lỗi. Số báo cáo chính thức dựa trên nguồn này.

Rủi ro cần nói rõ: replication slot bị dừng có thể làm đầy đĩa của primary, schema nguồn đổi có thể làm hỏng pipeline, và đơn bị hủy phải được xử lý như cập nhật, không phải chỉ cộng dồn.`,
    keyPoints: [
      { text: 'Tách tải, không truy vấn trên OLTP', keywords: ['tách', 'không chạy trên oltp', 'không ảnh hưởng'] },
      { text: 'CDC đọc log, đẩy vào Kafka', keywords: ['cdc', 'wal', 'binlog', 'kafka'], weight: 2 },
      { text: 'Tính sẵn chỉ số, lưu trong kho lưu cột', keywords: ['tính sẵn', 'tổng hợp', 'clickhouse', 'streaming', 'cửa sổ'], weight: 2 },
      { text: 'Xử lý trùng và đến muộn', keywords: ['xử lý trùng', 'trùng lặp', 'at least once', 'đến muộn', 'late'] },
      { text: 'Đối soát với kho dữ liệu chính', keywords: ['đối soát', 'kho dữ liệu', 'reconcile'] },
    ],
    followUps: ['Replication slot bị dừng thì sao?', 'Xử lý đơn hàng bị hủy trong số liệu đã tổng hợp thế nào?'],
    commonMistakes: ['Ghi đồng bộ sang kho phân tích trong giao dịch đặt hàng.', 'Không có đường đối soát số liệu.'],
  },
  {
    id: 'iv-db-relational-nosql-01',
    topicId: 'database',
    category: 'db-systems',
    conceptIds: ['db-relational-nosql'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn chọn giữa CSDL quan hệ và NoSQL dựa trên những tiêu chí nào?',
    referenceAnswer: `Tôi chọn theo mẫu truy cập và yêu cầu dữ liệu, không theo trào lưu. Mặc định tôi bắt đầu với CSDL quan hệ, vì nó linh hoạt khi chưa rõ truy vấn, có ràng buộc và giao dịch, và một máy hiện nay đã xử lý được rất nhiều.

Tôi xét bốn câu hỏi. Một là mẫu truy vấn có ổn định không: nếu luôn đọc theo một khóa thì NoSQL phù hợp, nếu báo cáo thay đổi liên tục thì nên dùng SQL. Hai là có cần giao dịch nhiều thực thể không: tiền bạc, tồn kho nghiêng về quan hệ. Ba là quy mô: ghi hoặc dung lượng có vượt quá một máy không. Bốn là hình dạng dữ liệu: JSON lồng nhau hợp với document, dữ liệu theo thời gian hợp với wide-column, truy vấn quan hệ nhiều bước hợp với graph.

Trong thực tế, một hệ thống thường dùng nhiều loại: PostgreSQL cho đơn hàng, Redis cho phiên đăng nhập, Cassandra cho sự kiện. Đổi lại phải đồng bộ dữ liệu giữa các hệ.`,
    keyPoints: [
      { text: 'Chọn theo mẫu truy cập', keywords: ['mẫu truy cập', 'mẫu truy vấn', 'access pattern'], weight: 2 },
      { text: 'Giao dịch và ràng buộc nghiêng về quan hệ', keywords: ['giao dịch', 'ràng buộc', 'acid'], weight: 2 },
      { text: 'Quy mô vượt quá một máy', keywords: ['quy mô', 'một máy', 'mở rộng ngang', 'sharding'] },
      { text: 'Hình dạng dữ liệu theo từng nhóm NoSQL', keywords: ['document', 'wide column', 'graph', 'key value'] },
    ],
    followUps: ['MongoDB có giao dịch không?', 'Đổi schema trên NoSQL có thực sự dễ hơn không?'],
    commonMistakes: ['Nói NoSQL luôn nhanh hơn và không có ACID.', 'Chọn NoSQL chỉ vì không muốn thiết kế schema.'],
  },
  {
    id: 'iv-db-relational-nosql-02',
    topicId: 'database',
    category: 'db-systems',
    conceptIds: ['db-relational-nosql', 'db-sharding', 'cloud-cap'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao nhiều hệ NoSQL hạn chế Join và giao dịch nhiều dòng? Đây có phải vì công nghệ kém hơn không?',
    referenceAnswer: `Không phải kém hơn, mà là đánh đổi có chủ đích để mở rộng ngang.

Khi dữ liệu trải trên nhiều máy, Join và giao dịch nhiều dòng đều cần phối hợp qua mạng. Join phải kéo dữ liệu giữa các máy. Giao dịch cần 2PC, tốn thêm các vòng mạng, và các máy phải giữ khóa khi chờ nhau. Khi mạng có sự cố, phải chọn giữa từ chối yêu cầu hoặc chấp nhận dữ liệu lệch. Độ trễ không còn dễ đoán, và một máy chậm làm chậm cả truy vấn.

Bằng cách giới hạn thao tác trong một khóa phân vùng, mỗi yêu cầu chỉ chạm một nhóm bản sao. Do đó, thêm máy gần như tăng thông lượng tuyến tính, và độ trễ ổn định. Cái giá chuyển sang người thiết kế: phải biết trước mẫu truy vấn, gom dữ liệu liên quan vào cùng một khóa hoặc phi chuẩn hóa, và tự đồng bộ các bản sao.

Những hệ như Spanner hay CockroachDB cho thấy vẫn có thể có giao dịch phân tán, nhưng phải trả bằng độ trễ của đồng thuận. Không có bữa ăn miễn phí, chỉ có nơi đặt chi phí khác nhau.`,
    keyPoints: [
      { text: 'Đánh đổi có chủ đích để mở rộng ngang', keywords: ['đánh đổi', 'mở rộng ngang', 'chủ đích'], weight: 2 },
      { text: 'Join và giao dịch cần phối hợp qua mạng', keywords: ['qua mạng', '2pc', 'phối hợp', 'giữ khóa'], weight: 2 },
      { text: 'Giới hạn trong một khóa phân vùng giúp tăng tuyến tính', keywords: ['khóa phân vùng', 'một shard', 'tuyến tính', 'partition key'], weight: 2 },
      { text: 'Chi phí chuyển sang người thiết kế', keywords: ['phi chuẩn hóa', 'mẫu truy vấn', 'tự đồng bộ'] },
      { text: 'Giao dịch phân tán có thể làm nhưng tốn độ trễ', keywords: ['spanner', 'cockroachdb', 'đồng thuận', 'độ trễ'] },
    ],
    followUps: ['Spanner giữ được giao dịch toàn cầu bằng cách nào?', 'Định lý CAP liên quan thế nào đến lựa chọn này?'],
    commonMistakes: ['Cho rằng NoSQL hạn chế do chưa đủ trưởng thành.', 'Không nói được cái giá chuyển sang đâu.'],
  },
])
