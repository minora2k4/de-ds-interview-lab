import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-etl-ingestion-01',
    topicId: 'etl',
    category: 'etl-loading',
    conceptIds: ['etl-ingestion', 'etl-cdc'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Có những cách thu nhận dữ liệu nào? Bạn cân nhắc gì khi đưa dữ liệu từ một API bên thứ ba vào nền tảng dữ liệu?',
    referenceAnswer: `Có bốn cách chính. Kéo theo lịch là gọi API hoặc truy vấn định kỳ. Nhận đẩy là nguồn gửi sự kiện hoặc webhook, cần bộ đệm bền như Kafka. Nhận tệp là đối tác đặt tệp vào S3. CDC là đọc log thay đổi của database. Chọn cách nào phụ thuộc vào khả năng của nguồn và độ trễ cần có.

Với API bên thứ ba, tôi quan tâm giới hạn tốc độ, nên phải kiểm soát tần suất và thử lại có giãn cách. Tôi xem cơ chế phân trang, vì dữ liệu có thể thay đổi trong lúc đọc, dẫn đến thiếu hoặc trùng. Tôi xem có lọc được theo thời gian sửa đổi không, để đọc tăng dần. Khóa xác thực cần được quản lý an toàn, không ghi trong code.

Tôi lưu phản hồi gần như nguyên bản vào vùng thô kèm thời điểm nạp, để sửa logic mà không cần gọi lại API. Tôi cũng theo dõi số dòng và độ mới, và có cảnh báo khi schema của API đổi, vì đây là phần nằm ngoài tầm kiểm soát.`,
    keyPoints: [
      { text: 'Nêu được kéo, đẩy, tệp và CDC', keywords: ['kéo', 'đẩy', 'webhook', 'tệp', 'cdc', 'polling'], weight: 2 },
      { text: 'Giới hạn tốc độ và thử lại', keywords: ['giới hạn tốc độ', 'rate limit', 'thử lại', 'retry'], weight: 2 },
      { text: 'Phân trang và đọc tăng dần', keywords: ['phân trang', 'pagination', 'tăng dần', 'thời gian sửa đổi'] },
      { text: 'Lưu thô và giám sát schema', keywords: ['vùng thô', 'nguyên bản', 'schema', 'raw'] },
    ],
    followUps: ['Làm sao tránh thiếu dữ liệu khi phân trang trên dữ liệu đang đổi?'],
    commonMistakes: ['Biến đổi ngay khi thu nhận và không giữ bản gốc.', 'Không tính đến giới hạn tốc độ của API.'],
  },
  {
    id: 'iv-etl-full-load-01',
    topicId: 'etl',
    category: 'etl-loading',
    conceptIds: ['etl-full-load', 'etl-incremental'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'So sánh Full Load và Incremental Load. Vì sao không phải lúc nào cũng nên chọn Incremental?',
    referenceAnswer: `Full load đọc lại toàn bộ nguồn và thay thế đích. Incremental chỉ đọc phần mới hoặc đã thay đổi. Khác biệt gốc nằm ở chi phí và trạng thái: full load tỷ lệ với kích thước bảng nhưng không có trạng thái phải giữ, còn incremental tỷ lệ với lượng thay đổi nhưng phải giữ mốc.

Nhiều người nghĩ incremental luôn tốt hơn vì rẻ hơn, nhưng nó mang theo nhiều kiểu lỗi. Dòng bị xóa không có gì để đọc, nên còn mãi trong đích. Transaction commit muộn có thể bị bỏ sót. Script sửa dữ liệu không cập nhật \`updated_at\` thì không ai thấy. Các sai lệch này tích lũy dần. Full load không gặp những lỗi đó, vì mỗi lần chạy đều tự sửa.

Vì vậy với bảng nhỏ, như bảng cửa hàng 800 dòng chạy 5 giây, tôi chọn full load. Với bảng 2 tỷ dòng chỉ đổi 5 triệu dòng mỗi ngày, full load mất 6 giờ nên phải dùng incremental. Khi đó tôi vẫn thêm đối soát định kỳ, có khi full refresh theo lịch thưa, để sửa sai lệch.`,
    keyPoints: [
      { text: 'Chi phí tỷ lệ với kích thước bảng hoặc lượng thay đổi', keywords: ['kích thước bảng', 'lượng thay đổi', 'chi phí', 'tỷ lệ'], weight: 2 },
      { text: 'Incremental có trạng thái và sai lệch tích lũy', keywords: ['trạng thái', 'mốc', 'watermark', 'tích lũy'], weight: 2 },
      { text: 'Incremental khó bắt thao tác xóa', keywords: ['xóa', 'delete'] },
      { text: 'Đối soát hoặc full refresh định kỳ', keywords: ['đối soát', 'full refresh', 'định kỳ'] },
    ],
    followUps: ['Bạn đối soát hai bảng lớn như thế nào mà không so sánh từng dòng?'],
    commonMistakes: ['Khẳng định incremental luôn tốt hơn.', 'Không biết full load tự xử lý được thao tác xóa.'],
  },
  {
    id: 'iv-etl-incremental-01',
    topicId: 'etl',
    category: 'etl-loading',
    conceptIds: ['etl-incremental', 'etl-idempotency', 'etl-cdc'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Thiết kế một Incremental ETL Pipeline đưa bảng orders 2 tỷ dòng từ PostgreSQL vào kho dữ liệu, cập nhật mỗi 15 phút. Bạn xử lý high watermark, dữ liệu đến trễ, xóa, chạy lại và backfill như thế nào?',
    referenceAnswer: `Tôi bắt đầu từ mục tiêu: chi phí tỷ lệ với lượng thay đổi, và sau nhiều tháng đích vẫn phải khớp nguồn. Điểm khó là pipeline có trạng thái nên sai sót tích lũy.

**Bắt thay đổi.** Nếu được đọc log, tôi ưu tiên CDC bằng Debezium vì nó bắt được xóa và thay đổi trung gian. Nếu không, tôi dùng high watermark trên \`updated_at\`, sau khi kiểm tra ứng dụng cập nhật cột này thế nào và cột có index không. Đọc từ bản sao để không ảnh hưởng hệ thống chính.

**High watermark.** Mỗi lần chạy chốt mốc trên từ đầu, không dùng \`now()\` lúc ghi. Khoảng đọc cố định nên chạy lại vẫn đọc đúng khoảng đó. Mốc chỉ được đẩy sau khi ghi thành công, tốt nhất cùng giao dịch với dữ liệu. Đẩy sớm thì lỗi sẽ làm mất dữ liệu vĩnh viễn.

**Dữ liệu đến trễ.** \`updated_at\` được gán trước khi commit, nên transaction dài có thể hiện ra sau khi mốc đã vượt qua. Tôi đọc chồng lấn một khoảng nhìn lại, chọn lớn hơn transaction dài nhất đo được, ví dụ 15 phút.

**Idempotency và MERGE.** Đọc chồng lấn tạo dòng đã có, nên không thể INSERT. Tôi khử trùng lặp trong lô, giữ bản mới nhất của mỗi khóa, rồi MERGE theo khóa nghiệp vụ với điều kiện bản đến phải mới hơn bản hiện có. Như vậy bản cũ từ lần chạy lại không đè lên bản mới.

**Xóa.** Có ba cách: dùng CDC, nhánh \`op = d\` thì xóa. Nếu nguồn xóa mềm thì đọc cờ như một cập nhật. Nếu không có cả hai, tôi định kỳ so tập khóa giữa nguồn và đích để phát hiện dòng mồ côi. Với cách cuối, chỉ so những partition gần đây là đủ cho đa số trường hợp.

**Backfill.** Pipeline nhận khoảng thời gian làm tham số, nên backfill là chạy cùng logic theo từng khoảng nhỏ, có giới hạn đồng thời và không đụng vào mốc của luồng chính. Với Airflow, dùng \`airflow backfill create\`.

**Kiểm soát.** Đối soát số dòng và tổng tiền theo ngày giữa nguồn và đích, cảnh báo khi lệch vượt ngưỡng, và tải lại những ngày lệch. Schema đổi được phát hiện ở bước nạp. Tôi cũng giám sát độ trễ dữ liệu so với SLA 15 phút. Sau mỗi lỗi, chỉ cần chạy lại là đủ, không cần dọn tay.`,
    keyPoints: [
      { text: 'High watermark: chốt mốc trên, đẩy mốc sau khi ghi thành công', keywords: ['high watermark', 'mốc', 'watermark', 'updated at', 'sau khi ghi'], weight: 3 },
      { text: 'Dữ liệu trễ: đọc chồng lấn vì transaction commit muộn', keywords: ['chồng lấn', 'nhìn lại', 'lookback', 'commit', 'dữ liệu trễ', 'đến trễ'], weight: 3 },
      { text: 'Idempotency và MERGE theo khóa, có so sánh phiên bản', keywords: ['merge', 'idempotent', 'lũy đẳng', 'upsert'], weight: 3 },
      { text: 'Xử lý xóa: CDC, xóa mềm hoặc so tập khóa', keywords: ['xóa', 'delete', 'cdc', 'debezium', 'xóa mềm', 'so tập khóa'], weight: 3 },
      { text: 'Backfill bằng tham số khoảng thời gian, tách khỏi mốc chính', keywords: ['backfill', 'tham số', 'chạy lại', 'khoảng thời gian'], weight: 2 },
      { text: 'Đối soát và giám sát độ trễ', keywords: ['đối soát', 'giám sát', 'sla', 'so số dòng'] },
    ],
    followUps: [
      'Vì sao không dùng thẳng thời điểm chạy làm mốc?',
      'MERGE trên bảng 2 tỷ dòng chậm thì bạn làm gì?',
      'Nếu bản cũ đến sau bản mới thì MERGE có bị đè không?',
      'Schema nguồn thêm một cột thì pipeline phản ứng ra sao?',
    ],
    commonMistakes: [
      'Đẩy mốc trước khi ghi xong.',
      'Dùng INSERT nên chạy lại tạo bản trùng.',
      'Không có câu trả lời cho thao tác xóa.',
      'Backfill bằng cách sửa mốc của luồng đang chạy.',
    ],
  },
  {
    id: 'iv-etl-incremental-02',
    topicId: 'etl',
    category: 'etl-loading',
    conceptIds: ['etl-incremental'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Pipeline incremental chạy đã 3 tháng và tổng doanh thu đang lệch 0,4% so với nguồn. Bạn điều tra thế nào?',
    referenceAnswer: `Trước hết tôi thu hẹp phạm vi. Tôi so số dòng và tổng tiền giữa nguồn và đích theo từng ngày, để biết lệch ở đâu và có hướng nào. Đích thấp hơn thì có khả năng thiếu dòng, còn đích cao hơn có thể là trùng hoặc dòng đã xóa vẫn còn.

Sau đó tôi kiểm tra từng giả thuyết. Thiếu dòng rải rác và lệch tăng dần thường do transaction commit sau khi mốc đã vượt qua, nên tôi lấy một vài dòng thiếu và so \`updated_at\` với lịch sử chạy. Có thể do script sửa dữ liệu không cập nhật \`updated_at\`, nên tôi hỏi đội ứng dụng và tìm dòng có giá trị khác nhau nhưng cùng \`updated_at\`. Cao hơn nguồn thì nghi xóa cứng, nên tôi so tập khóa. Tôi cũng kiểm tra lần chạy lỗi đã đẩy mốc trước khi ghi xong chưa.

Khi đã biết nguyên nhân, tôi sửa cả hai phần: sửa gốc bằng khoảng nhìn lại hoặc CDC, và sửa dữ liệu bằng cách tải lại những ngày bị lệch. Cuối cùng tôi thêm đối soát tự động theo ngày để lần sau phát hiện sớm. Tôi không cộng bù vào báo cáo, vì đó chỉ là che lỗi.`,
    keyPoints: [
      { text: 'So nguồn và đích theo ngày để khoanh vùng', keywords: ['theo ngày', 'khoanh vùng', 'so số dòng', 'thu hẹp'], weight: 2 },
      { text: 'Giả thuyết transaction commit muộn', keywords: ['commit', 'transaction', 'bỏ sót'], weight: 2 },
      { text: 'Giả thuyết cập nhật không đổi cột theo dõi', keywords: ['script', 'không cập nhật', 'updated at'] },
      { text: 'Giả thuyết xóa cứng', keywords: ['xóa cứng', 'hard delete', 'tập khóa'] },
      { text: 'Sửa gốc, tải lại và thêm đối soát tự động', keywords: ['tải lại', 'đối soát', 'backfill'], weight: 2 },
    ],
    followUps: ['Bạn chọn độ dài khoảng nhìn lại như thế nào?'],
    commonMistakes: ['Chạy full refresh ngay mà không tìm nguyên nhân.', 'Cộng bù số liệu ở lớp báo cáo.'],
  },
  {
    id: 'iv-etl-incremental-03',
    topicId: 'etl',
    category: 'etl-loading',
    conceptIds: ['etl-incremental', 'etl-orchestration'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Khi nào bạn chọn MERGE, khi nào chọn thay thế partition cho một bảng nạp tăng dần? Khác biệt này ảnh hưởng thế nào khi backfill?',
    referenceAnswer: `Tiêu chí là thay đổi có gói gọn trong một vài partition hay không.

Thay thế partition hợp với dữ liệu theo thời gian, như sự kiện hoặc tổng hợp theo ngày. Tôi tính lại toàn bộ partition bị ảnh hưởng rồi thay thế. Cách này rẻ vì không phải dò từng dòng ở đích, idempotent một cách tự nhiên, và không cần khóa. Đổi lại, phải có đủ dữ liệu của cả partition, và nếu dữ liệu trễ rơi vào rất nhiều partition cũ thì phải tính lại nhiều.

MERGE hợp với bảng có cập nhật trên dòng cũ theo khóa, như đơn hàng có thể đổi trạng thái sau nhiều tháng. Dòng đổi nằm rải rác nên không có partition nào để thay thế. Đổi lại, MERGE phải dò khớp trên đích, nên chi phí tăng theo kích thước bảng, trừ khi lọc đích theo partition. Lô đầu vào cũng phải khử trùng lặp, nếu không nhiều dòng sẽ khớp cùng một dòng đích.

Khi backfill, thay thế partition rất đơn giản: chạy lại từng ngày, ngày nào lỗi thì chạy lại ngày đó. Với MERGE, tôi phải có so sánh phiên bản để bản lịch sử không đè lên trạng thái mới. Trong dbt, đây là \`insert_overwrite\` và \`merge\`, và \`microbatch\` là cách chia theo khoảng thời gian.`,
    keyPoints: [
      { text: 'Thay thế partition khi thay đổi gói gọn theo thời gian', keywords: ['thay thế partition', 'insert overwrite', 'insert_overwrite', 'theo ngày'], weight: 2 },
      { text: 'MERGE cho bảng có cập nhật rải rác theo khóa', keywords: ['merge', 'theo khóa', 'cập nhật', 'upsert'], weight: 2 },
      { text: 'Chi phí MERGE tăng theo đích, cần lọc partition', keywords: ['dò khớp', 'lọc đích', 'kích thước bảng', 'tốn kém'] },
      { text: 'Backfill với MERGE cần so sánh phiên bản', keywords: ['phiên bản', 'đè', 'version'] },
    ],
    followUps: ['Lô đầu vào có hai dòng cùng khóa thì MERGE xử lý ra sao?', 'dbt microbatch khác gì incremental thông thường?'],
    commonMistakes: ['Dùng MERGE cho mọi bảng sự kiện lớn.', 'Quên khử trùng lặp lô đầu vào trước khi MERGE.'],
  },
  {
    id: 'iv-etl-cdc-01',
    topicId: 'etl',
    category: 'etl-loading',
    conceptIds: ['etl-cdc'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'CDC là gì? So sánh CDC dựa trên truy vấn, trigger và log. Vì sao đọc log lại được ưa chuộng?',
    referenceAnswer: `CDC là cách xác định và truyền đi các thay đổi của database, thay vì đọc lại trạng thái của bảng.

Dựa trên truy vấn là poll theo cột như \`updated_at\`. Dễ làm và không cần quyền đặc biệt, nhưng nó chỉ thấy trạng thái lúc poll, nên mất thay đổi trung gian và không thấy xóa cứng, lại còn tốn tải đọc.

Dựa trên trigger là để trigger ghi vào bảng thay đổi. Nó bắt được cả xóa và trung gian, nhưng chạy trong transaction của ứng dụng, nên mọi thao tác ghi đều chậm hơn, và phải bảo trì theo schema.

Dựa trên log là đọc WAL của PostgreSQL hoặc binlog của MySQL. Bản chất là database đã ghi mọi thay đổi đã commit theo đúng thứ tự để khôi phục và nhân bản, nên ta chỉ việc đọc như một bản sao. Nhờ vậy nó bắt đủ, ít ảnh hưởng luồng ghi, không cần sửa schema, độ trễ thấp. Debezium là công cụ phổ biến, chạy trên Kafka Connect.

Đánh đổi là vận hành phức tạp hơn và cần quyền đọc log. Với nguồn SaaS chỉ có API hoặc bảng nhỏ báo cáo hàng ngày, tôi vẫn chọn cách đơn giản hơn.`,
    keyPoints: [
      { text: 'Truy vấn mất xóa và thay đổi trung gian', keywords: ['trung gian', 'không thấy xóa', 'poll', 'polling', 'updated at'], weight: 2 },
      { text: 'Trigger làm chậm thao tác ghi', keywords: ['trigger', 'chậm', 'transaction của ứng dụng'], weight: 2 },
      { text: 'Log đã có sẵn thứ tự commit, ít tác động', keywords: ['wal', 'binlog', 'nhật ký', 'transaction log'], weight: 2 },
      { text: 'Debezium trên Kafka Connect', keywords: ['debezium', 'kafka connect'] },
      { text: 'Có trường hợp không nên dùng log-based', keywords: ['saas', 'bảng nhỏ', 'phức tạp', 'không có quyền'] },
    ],
    followUps: ['Debezium lấy dữ liệu đã có sẵn trước khi bật CDC như thế nào?'],
    commonMistakes: ['Nói log-based không ảnh hưởng gì đến nguồn.', 'Chỉ biết mỗi cách dựa trên truy vấn.'],
  },
  {
    id: 'iv-etl-cdc-02',
    topicId: 'etl',
    category: 'etl-loading',
    conceptIds: ['etl-cdc', 'etl-idempotency'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn đưa sự kiện CDC từ Debezium qua Kafka vào kho dữ liệu. Bạn áp dụng sự kiện thế nào cho đúng khi có trùng, thứ tự và xóa?',
    referenceAnswer: `Debezium bảo đảm at-least-once khi có sự cố: connector sập rồi đọc lại từ vị trí đã lưu, nên có thể phát trùng. Vì vậy đầu nhận phải idempotent.

Về thứ tự, sự kiện được key theo khóa chính, nên cùng một dòng nằm cùng một partition và giữ đúng thứ tự trong đó. Giữa các dòng không có thứ tự toàn cục, nên nếu cần tính nhất quán giữa nhiều bảng, phải xử lý riêng.

Tôi thường áp dụng theo lô. Trong mỗi lô, tôi khử trùng lặp theo khóa chính, chỉ giữ sự kiện mới nhất theo vị trí log trong trường \`source\`, như LSN của PostgreSQL. Không dùng \`ts_ms\` vì có thể trùng. Rồi tôi MERGE vào đích: nếu \`op = d\` thì xóa, còn lại thì upsert theo \`after\`, với điều kiện vị trí log phải lớn hơn vị trí đã lưu ở dòng đích. Điều kiện này giúp đọc lại không đè dữ liệu mới bằng cũ. Sự kiện snapshot \`op = r\` được xử lý như upsert.

Với tombstone, đầu nhận cần bỏ qua vì value là null. Tôi cũng lưu toàn bộ sự kiện thô vào một bảng chỉ ghi thêm trước khi MERGE, để phát lại được và xây SCD Type 2. Nếu đích là kho có MERGE đắt, tôi gom lô vài phút một lần, và chấp nhận độ trễ đổi lấy chi phí.`,
    keyPoints: [
      { text: 'At-least-once nên đầu nhận phải idempotent', keywords: ['at least once', 'at-least-once', 'idempotent', 'trùng', 'lũy đẳng'], weight: 2 },
      { text: 'Thứ tự theo khóa nhờ key và partition', keywords: ['key', 'partition', 'thứ tự', 'khóa chính'], weight: 2 },
      { text: 'Khử trùng theo vị trí log, không dùng thời gian', keywords: ['lsn', 'vị trí log', 'source', 'binlog position'], weight: 2 },
      { text: 'MERGE có nhánh xóa khi op = d', keywords: ['op', 'nhánh xóa', 'merge', 'delete'], weight: 2 },
      { text: 'Giữ log thô để phát lại', keywords: ['thô', 'phát lại', 'chỉ ghi thêm', 'scd'] },
    ],
    followUps: ['Cập nhật làm đổi khóa chính thì Debezium phát những sự kiện nào?', 'Bạn snapshot lại một bảng mà không dừng streaming như thế nào?'],
    commonMistakes: ['Upsert phần `after` mà quên xóa.', 'Sắp xếp theo thời gian thay vì vị trí log.', 'Cho rằng Kafka giữ thứ tự toàn cục.'],
  },
  {
    id: 'iv-etl-cdc-03',
    topicId: 'etl',
    category: 'etl-loading',
    conceptIds: ['etl-cdc', 'etl-ingestion'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Bạn vận hành Debezium cho một PostgreSQL 3 TB. Những rủi ro vận hành nào cần chuẩn bị, và bạn giám sát gì?',
    referenceAnswer: `Rủi ro lớn nhất là replication slot. Slot giữ WAL ngay cả khi Debezium ngừng, để không mất thay đổi. Connector dừng qua cuối tuần có thể làm đầy đĩa của database chính, tức là sự cố của pipeline phân tích lại làm hại hệ thống nghiệp vụ. Vì vậy tôi giám sát độ trễ của slot theo số byte, đặt cảnh báo sớm, và cân nhắc \`max_slot_wal_keep_size\`, chấp nhận phải snapshot lại nếu vượt ngưỡng.

Một trường hợp nữa: database nhiều ghi nhưng bảng theo dõi ít thay đổi, nên vị trí đã xác nhận không tiến và WAL vẫn tăng. Heartbeat giải quyết việc này.

Với snapshot, lần đầu đọc 3 TB mất nhiều giờ và tạo tải đọc, và nếu lỗi giữa chừng thì phải chụp lại từ đầu. Khi cần chụp lại một bảng, tôi dùng incremental snapshot: chia theo chunk, chạy song song với streaming và tiếp tục được khi gián đoạn.

Khi schema đổi, phải biết connector và sink phản ứng thế nào. Đặt \`REPLICA IDENTITY FULL\` làm WAL lớn hơn, nên chỉ dùng cho bảng thật sự cần. Failover của database cũng cần lưu ý, vì slot phải được duy trì trên primary mới.

Tôi giám sát độ trễ end-to-end, độ trễ slot, trạng thái connector, số sự kiện và tỷ lệ lỗi, độ lag của sink. Tôi cũng đối soát định kỳ với nguồn, vì trạng thái khỏe của connector chưa đủ để nói dữ liệu đúng.`,
    keyPoints: [
      { text: 'Slot giữ WAL, có thể làm đầy đĩa', keywords: ['replication slot', 'wal', 'đầy đĩa', 'slot'], weight: 3 },
      { text: 'Giám sát độ trễ slot, heartbeat', keywords: ['độ trễ slot', 'heartbeat', 'max slot wal keep size', 'cảnh báo'], weight: 2 },
      { text: 'Snapshot và incremental snapshot', keywords: ['snapshot', 'chunk', 'incremental snapshot'], weight: 2 },
      { text: 'Schema đổi và REPLICA IDENTITY FULL', keywords: ['schema', 'replica identity', 'failover'] },
      { text: 'Đối soát với nguồn', keywords: ['đối soát', 'độ trễ end to end'] },
    ],
    followUps: ['Giới hạn `max_slot_wal_keep_size` đánh đổi điều gì?', 'Failover sang replica ảnh hưởng thế nào đến slot?'],
    commonMistakes: ['Chỉ giám sát trạng thái connector.', 'Không biết sự cố CDC có thể làm hại database chính.'],
  },
])
