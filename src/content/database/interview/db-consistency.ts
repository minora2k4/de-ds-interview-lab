import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-db-acid-01',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-acid'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'ACID là gì? Hãy giải thích bằng ví dụ chuyển tiền.',
    referenceAnswer: `ACID là bốn bảo đảm của giao dịch. Lấy ví dụ chuyển 5 triệu từ A sang B, gồm lệnh trừ A và lệnh cộng B.

**Atomicity:** máy sập sau khi trừ A, chưa commit, thì khởi động lại số dư A vẫn như cũ. Không có trạng thái tiền biến mất.

**Consistency:** giao dịch đưa dữ liệu từ trạng thái hợp lệ sang trạng thái hợp lệ. Nếu có \`CHECK (balance >= 0)\` mà A không đủ tiền thì giao dịch bị từ chối. Tuy nhiên, việc tổng tiền không đổi là do giao dịch được viết đúng, không phải do cơ sở dữ liệu tự biết.

**Isolation:** một báo cáo chạy đồng thời không thấy trạng thái đã trừ A mà chưa cộng B, ở mức cô lập đang dùng.

**Durability:** đã báo thành công mà mất điện ngay sau đó thì dữ liệu vẫn còn, nhờ log đã được flush xuống đĩa.`,
    keyPoints: [
      { text: 'Atomicity: tất cả hoặc không gì cả', keywords: ['atomicity', 'nguyên tử', 'tất cả hoặc không'], weight: 2 },
      { text: 'Consistency: giữ trạng thái hợp lệ, ràng buộc', keywords: ['consistency', 'nhất quán', 'ràng buộc'] },
      { text: 'Isolation: không thấy trạng thái dở dang', keywords: ['isolation', 'cô lập', 'dở dang'] },
      { text: 'Durability: đã commit thì không mất', keywords: ['durability', 'bền vững', 'không mất', 'log', 'wal'], weight: 2 },
    ],
    followUps: ['Durability được thực hiện thế nào?', 'Cơ sở dữ liệu kiểm tra được phần nào của Consistency?'],
    commonMistakes: ['Giải thích C giống C của CAP.', 'Chỉ đọc định nghĩa mà không gắn với ví dụ.'],
  },
  {
    id: 'iv-db-acid-02',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-acid', 'db-transactions'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Làm sao cơ sở dữ liệu đảm bảo Durability mà không phải ghi mọi trang dữ liệu xuống đĩa ở mỗi lần commit?',
    referenceAnswer: `Nếu commit phải ghi tất cả trang đã đổi, mỗi giao dịch sẽ tốn nhiều lần ghi rải rác trên đĩa, vừa chậm vừa không nguyên tử: sập giữa chừng thì một số trang đã đổi, một số chưa.

Giải pháp là **Write-Ahead Logging**. Quy tắc duy nhất là mô tả thay đổi phải xuống đĩa trước trang dữ liệu. Khi commit, hệ thống chỉ flush log. Log được ghi tuần tự vào cuối tệp nên rẻ, và nhiều giao dịch có thể dùng chung một lần flush nhờ group commit. Các trang đã đổi nằm trong bộ nhớ và được ghi dần ở các checkpoint.

Khi sập máy, hệ thống đọc log từ checkpoint gần nhất và phát lại các thay đổi, nên giao dịch đã commit không mất. Log cũng là nền cho replication và CDC.

Đánh đổi có thể điều chỉnh được: \`synchronous_commit = off\` của PostgreSQL hoặc \`innodb_flush_log_at_trx_commit = 2\` của InnoDB tăng tốc ghi, đổi lại có thể mất giao dịch gần nhất. Tắt \`fsync\` thì khác hẳn, vì có thể làm hỏng cơ sở dữ liệu.`,
    keyPoints: [
      { text: 'Ghi log trước trang dữ liệu', keywords: ['wal', 'write ahead', 'log trước', 'ghi trước'], weight: 2 },
      { text: 'Commit chỉ flush log, ghi tuần tự nên rẻ', keywords: ['flush log', 'tuần tự', 'sequential'], weight: 2 },
      { text: 'Khôi phục bằng phát lại log', keywords: ['phát lại', 'redo', 'khôi phục', 'recovery'], weight: 2 },
      { text: 'Group commit gom nhiều giao dịch', keywords: ['group commit', 'gom nhiều', 'một lần flush'] },
      { text: 'Có thể đánh đổi độ bền lấy tốc độ', keywords: ['synchronous commit', 'innodb flush log', 'fsync', 'đánh đổi'] },
    ],
    followUps: ['Checkpoint giải quyết vấn đề gì?', 'Vì sao tắt fsync nguy hiểm hơn tắt synchronous_commit?'],
    commonMistakes: ['Nói commit ghi trực tiếp dữ liệu vào tệp bảng.', 'Không phân biệt mất giao dịch với hỏng cơ sở dữ liệu.'],
  },
  {
    id: 'iv-db-acid-03',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-acid', 'cloud-cap', 'cloud-consistency'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'C trong ACID khác gì C trong CAP? Một hệ đạt ACID thì có nhất quán theo CAP không?',
    referenceAnswer: `Hai khái niệm trả lời hai câu hỏi khác nhau.

**C của ACID** là giữ các ràng buộc: sau giao dịch, dữ liệu vẫn thỏa khóa chính, khóa ngoại, \`CHECK\` và quy tắc nghiệp vụ. Khái niệm này có ý nghĩa ngay cả trên một máy.

**C của CAP** là Linearizability: sau khi một lần ghi hoàn tất, mọi lần đọc ở bất kỳ bản sao nào cũng thấy giá trị đó, như thể chỉ có một bản dữ liệu. Khái niệm này chỉ có ý nghĩa khi có nhiều bản sao.

Vì vậy, hai thuộc tính độc lập nhau. Một PostgreSQL có replica bất đồng bộ vẫn đạt ACID trên primary, nhưng đọc từ replica có thể thấy dữ liệu cũ, nên toàn hệ không đạt C của CAP. Ngược lại, một kho key-value đồng thuận qua Raft có thể tuyến tính hóa từng khóa mà không có giao dịch nhiều khóa, nên không có ACID đầy đủ.

Trong thiết kế, tôi hỏi riêng hai câu: giao dịch có giữ được ràng buộc không, và client có thể đọc được dữ liệu cũ từ đâu.`,
    keyPoints: [
      { text: 'C của ACID là giữ ràng buộc', keywords: ['ràng buộc', 'constraint', 'trạng thái hợp lệ'], weight: 2 },
      { text: 'C của CAP là Linearizability trên các bản sao', keywords: ['linearizability', 'tuyến tính', 'mọi bản sao', 'bản sao'], weight: 2 },
      { text: 'Hai thuộc tính độc lập', keywords: ['độc lập', 'khác nhau', 'không liên quan'] },
      { text: 'Ví dụ: replica bất đồng bộ', keywords: ['replica', 'bất đồng bộ', 'async'] },
    ],
    followUps: ['Replica đồng bộ có giải quyết được không, và trả giá gì?', 'Read-your-writes là gì?'],
    commonMistakes: ['Coi hai chữ C là một.', 'Cho rằng hệ có ACID thì mọi bản sao luôn đồng nhất.'],
  },
  {
    id: 'iv-db-acid-04',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-acid', 'db-oltp-olap'],
    interviewTypes: ['de'],
    levels: ['senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Khi nào bạn chấp nhận nới lỏng độ bền của cơ sở dữ liệu, và làm thế nào để quyết định đó an toàn?',
    referenceAnswer: `Tôi chỉ nới lỏng khi đã đo được flush log là nút thắt, và khi phần dữ liệu có thể mất đã được nghiệp vụ chấp nhận rõ ràng, ví dụ log sự kiện hoặc số liệu đo có thể phát lại từ Kafka.

Tôi giới hạn phạm vi hẹp nhất có thể. Trên PostgreSQL, \`synchronous_commit\` đặt được theo từng phiên hoặc giao dịch, nên dữ liệu thanh toán vẫn ở \`on\`, còn clickstream dùng \`off\`. Nếu sập máy, chỉ mất các giao dịch gần nhất của phần đó, và cơ sở dữ liệu vẫn nhất quán. InnoDB thì \`innodb_flush_log_at_trx_commit\` là biến toàn cục, nên ảnh hưởng rộng hơn.

Tôi không bao giờ tắt \`fsync\` trên dữ liệu không tạo lại được, vì sập máy có thể làm hỏng cả cơ sở dữ liệu, không chỉ mất vài dòng.

Trước khi nới lỏng, tôi thử các cách không mất độ bền: gom lô để một giao dịch chứa nhiều dòng, giảm số index, dùng đĩa log riêng nhanh hơn, hoặc đẩy sự kiện qua hàng đợi rồi nạp theo lô. Sau đó phải có cách phát hiện và bù phần dữ liệu đã mất từ nguồn.`,
    keyPoints: [
      { text: 'Đo trước, nghiệp vụ chấp nhận mất dữ liệu', keywords: ['đo được', 'nút thắt', 'chấp nhận mất', 'phát lại'], weight: 2 },
      { text: 'Giới hạn phạm vi, ví dụ theo giao dịch', keywords: ['theo giao dịch', 'theo phiên', 'phạm vi', 'synchronous commit'], weight: 2 },
      { text: 'Không tắt fsync vì có thể hỏng dữ liệu', keywords: ['fsync', 'hỏng'] },
      { text: 'Thử các cách khác trước như gom lô', keywords: ['gom lô', 'batch', 'giảm index', 'hàng đợi'] },
    ],
    followUps: ['Gom lô giúp giảm chi phí flush như thế nào?', 'Làm sao phát hiện phần dữ liệu đã mất?'],
    commonMistakes: ['Đề xuất nới lỏng toàn cục cho mọi dữ liệu.', 'Không phân biệt rủi ro của fsync và synchronous_commit.'],
  },
  {
    id: 'iv-db-transactions-01',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-transactions', 'db-isolation-levels'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao giao dịch nên ngắn? Một giao dịch dài gây hại cho hệ thống như thế nào?',
    referenceAnswer: `Một giao dịch dài chiếm giữ các tài nguyên chung trong suốt thời gian của nó, nên hại lan sang người khác.

**Khóa:** khóa dòng do \`UPDATE\` tạo ra chỉ được nhả khi kết thúc. Một giao dịch giữ khóa 3 giây trên dòng hot sẽ làm các giao dịch khác xếp hàng, connection pool cạn dần, và lỗi lan ra cả dịch vụ. Giao dịch càng dài, nguy cơ deadlock càng cao.

**Phiên bản cũ:** dù chỉ đọc, snapshot vẫn giữ các phiên bản mà nó có thể thấy. PostgreSQL không \`VACUUM\` được các dòng chết tương ứng, InnoDB không xóa được undo log. Bảng và index phình ra, làm mọi truy vấn chậm đi, kể cả truy vấn không liên quan.

**Thử lại:** ở Repeatable Read hay Serializable, giao dịch dài dễ xung đột hơn và mất nhiều công hơn khi phải chạy lại.

Vì vậy tôi không gọi API ngoài hay chờ người dùng trong giao dịch. Job lớn được chia lô và ghi lại tiến độ. Tôi cũng đặt \`idle_in_transaction_session_timeout\` và giám sát giao dịch lâu nhất.`,
    keyPoints: [
      { text: 'Giữ khóa đến cuối giao dịch', keywords: ['khóa', 'lock', 'xếp hàng'], weight: 2 },
      { text: 'Cản dọn phiên bản cũ, bảng phình', keywords: ['vacuum', 'undo', 'phình', 'bloat', 'phiên bản cũ'], weight: 2 },
      { text: 'Tăng deadlock và xung đột thử lại', keywords: ['deadlock', 'xung đột', 'thử lại', 'retry'] },
      { text: 'Không gọi API ngoài trong giao dịch, chia lô', keywords: ['api', 'chia lô', 'batch', 'bên ngoài'] },
    ],
    followUps: ['Giao dịch chỉ đọc có gây hại không?', 'Bạn chia một job cập nhật 500 triệu dòng thế nào?'],
    commonMistakes: ['Chỉ nhắc đến khóa, quên tác động của snapshot cũ.', 'Cho rằng giao dịch chỉ đọc là vô hại.'],
  },
  {
    id: 'iv-db-transactions-02',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-transactions', 'etl-idempotency'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Giao dịch có thể bị hủy do deadlock hoặc lỗi serialization. Bạn thiết kế việc thử lại thế nào để không gây hại?',
    referenceAnswer: `Đầu tiên tôi phân loại lỗi. Chỉ thử lại lỗi tạm thời: deadlock, SQLSTATE \`40001\` của PostgreSQL. Lỗi vi phạm ràng buộc do dữ liệu sai thì thử lại vô ích.

Tôi **thử lại toàn bộ giao dịch**, từ lần đọc đầu tiên. Không tái dùng giá trị đã đọc, vì lý do bị hủy chính là các giá trị đó có thể đã cũ. Với Serializable của PostgreSQL, ngay cả dữ liệu đã đọc cũng không nên tin cho đến khi commit thành công.

Tôi giới hạn số lần thử và dùng **backoff có jitter**, nếu không các giao dịch sẽ cùng thử lại một lúc và xung đột tiếp.

Điểm khó là **tác dụng phụ ngoài cơ sở dữ liệu**. Email hay API thanh toán không rollback được, nên tôi đưa chúng ra ngoài giao dịch, gửi sau khi commit, thường qua bảng outbox được ghi trong cùng giao dịch. Một trường hợp đặc biệt là lỗi mạng khi commit: client không biết commit đã thành công hay chưa, nên thao tác cần lũy đẳng, ví dụ có khóa idempotency với ràng buộc \`UNIQUE\`.`,
    keyPoints: [
      { text: 'Chỉ thử lại lỗi tạm thời', keywords: ['tạm thời', '40001', 'phân loại', 'deadlock'], weight: 2 },
      { text: 'Thử lại toàn bộ giao dịch từ đầu', keywords: ['toàn bộ giao dịch', 'từ đầu', 'đọc lại'], weight: 2 },
      { text: 'Giới hạn số lần, backoff có jitter', keywords: ['backoff', 'jitter', 'giới hạn'] },
      { text: 'Tác dụng phụ đặt ngoài giao dịch, outbox', keywords: ['outbox', 'tác dụng phụ', 'bên ngoài'] },
      { text: 'Lũy đẳng cho trường hợp lỗi khi commit', keywords: ['lũy đẳng', 'idempotency', 'idempotent'], weight: 2 },
    ],
    followUps: ['Outbox pattern hoạt động thế nào?', 'Tại sao không thử lại chỉ câu lệnh bị lỗi?'],
    commonMistakes: ['Chỉ chạy lại câu lệnh lỗi.', 'Quên rằng lỗi mạng khi commit không cho biết kết quả.'],
  },
  {
    id: 'iv-db-isolation-levels-01',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-isolation-levels'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Hãy kể các mức cô lập theo chuẩn SQL, và các hiện tượng dirty read, non-repeatable read, phantom read.',
    referenceAnswer: `Chuẩn SQL có bốn mức, định nghĩa bằng hiện tượng bị cấm ở mỗi mức.

**Dirty Read** là đọc dữ liệu chưa commit của giao dịch khác. Nếu giao dịch đó hủy, tôi đã đọc một giá trị chưa từng tồn tại. Mức **Read Uncommitted** cho phép điều này.

**Non-repeatable Read** là đọc lại cùng một dòng, thấy giá trị đã bị giao dịch khác đổi và commit. **Read Committed** cấm đọc bẩn nhưng vẫn cho phép điều này.

**Phantom Read** là chạy lại cùng điều kiện, thấy tập dòng đã thay đổi, ví dụ có thêm dòng mới. **Repeatable Read** theo chuẩn cấm hai hiện tượng đầu nhưng còn cho phép phantom.

**Serializable** cấm tất cả, kết quả như thể các giao dịch chạy lần lượt.

Điểm cần nhớ là chuẩn chỉ quy định mức tối thiểu. Ví dụ, Repeatable Read của PostgreSQL không có phantom, và Read Uncommitted của PostgreSQL không đọc bẩn.`,
    keyPoints: [
      { text: 'Dirty Read: đọc dữ liệu chưa commit', keywords: ['chưa commit', 'dirty', 'đọc bẩn'], weight: 2 },
      { text: 'Non-repeatable Read: đọc lại cùng dòng thấy khác', keywords: ['đọc lại', 'non repeatable', 'cùng dòng'], weight: 2 },
      { text: 'Phantom Read: tập dòng thay đổi', keywords: ['phantom', 'tập dòng', 'dòng mới'], weight: 2 },
      { text: 'Bốn mức từ thấp đến cao', keywords: ['read committed', 'repeatable read', 'serializable', 'read uncommitted'] },
    ],
    followUps: ['Mức mặc định của PostgreSQL và MySQL là gì?', 'Lost Update thuộc mức nào?'],
    commonMistakes: ['Nhầm Non-repeatable Read với Phantom Read.', 'Cho rằng mọi hệ đều cài đặt đúng theo bảng của chuẩn.'],
  },
  {
    id: 'iv-db-isolation-levels-02',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-isolation-levels'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'So sánh mức cô lập mặc định của PostgreSQL và MySQL. Read Uncommitted trong PostgreSQL hoạt động thế nào?',
    referenceAnswer: `PostgreSQL mặc định **Read Committed**, mỗi câu lệnh có snapshot riêng, nên hai \`SELECT\` trong cùng giao dịch có thể thấy dữ liệu khác nhau. InnoDB của MySQL mặc định **Repeatable Read**, các \`SELECT\` thường trong giao dịch đọc cùng snapshot tạo ở lần đọc đầu.

**Read Uncommitted trong PostgreSQL** hoạt động giống hệt Read Committed, nghĩa là vẫn không đọc bẩn. PostgreSQL chỉ có ba mức thật, vì với MVCC, đọc từ snapshot là cách tự nhiên và không có lý do gì để đọc dữ liệu chưa commit. Chuẩn SQL chỉ quy định mức tối thiểu nên việc này hợp lệ. Trong khi đó, Read Uncommitted của InnoDB thực sự có thể đọc bẩn.

Tên giống nhau chưa chắc giống hành vi. Repeatable Read của PostgreSQL là Snapshot Isolation: gặp dòng đã bị đổi từ khi có snapshot thì báo lỗi, ứng dụng phải thử lại. Với InnoDB, \`UPDATE\` làm việc trên bản mới nhất mà không báo lỗi, và đọc có khóa dùng next-key lock. Vì vậy, chuyển hệ phải kiểm thử lại, không thể chỉ giữ tên mức.`,
    keyPoints: [
      { text: 'PostgreSQL mặc định Read Committed', keywords: ['postgresql', 'read committed'], weight: 2 },
      { text: 'InnoDB mặc định Repeatable Read', keywords: ['innodb', 'mysql', 'repeatable read'], weight: 2 },
      { text: 'Read Uncommitted của PostgreSQL như Read Committed', keywords: ['như read committed', 'giống read committed', 'ba mức', 'không đọc bẩn'], weight: 2 },
      { text: 'Hành vi cùng tên mức khác nhau', keywords: ['snapshot isolation', 'next key', 'khác nhau', 'báo lỗi'] },
    ],
    followUps: ['Vì sao chuẩn SQL cho phép hệ mạnh hơn yêu cầu?', 'InnoDB có Phantom ở Repeatable Read không?'],
    commonMistakes: ['Nói PostgreSQL cho phép đọc bẩn ở Read Uncommitted.', 'Cho rằng hai hệ cùng mặc định một mức.'],
  },
  {
    id: 'iv-db-isolation-levels-03',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-isolation-levels'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'MVCC hoạt động thế nào? Vì sao nó giúp đọc không chặn ghi, và PostgreSQL với InnoDB làm khác nhau ra sao?',
    referenceAnswer: `Với khóa thuần túy, đọc và ghi cùng dòng phải chờ nhau, vì người đọc không được thấy giá trị đang đổi dở. MVCC giải quyết bằng cách không ghi đè: giá trị cũ vẫn lấy lại được. Mỗi giao dịch có một snapshot quy định nó được thấy phiên bản nào, nên người đọc lấy bản đã commit phù hợp mà không cần chờ.

**PostgreSQL** lưu mọi phiên bản ngay trong bảng. Mỗi phiên bản có \`xmin\` là giao dịch tạo ra, \`xmax\` là giao dịch xóa hay thay thế nó. \`UPDATE\` tạo một phiên bản mới, và \`VACUUM\` dọn các phiên bản không ai còn thấy. Vì vậy cập nhật nhiều tạo bloat.

**InnoDB** cập nhật tại chỗ trên clustered index, lưu phần cũ vào undo log. Đọc phiên bản cũ thì phải đi ngược chuỗi undo, và luồng purge dọn sau. Bảng ít phình hơn, nhưng đọc cũ tốn hơn khi có giao dịch rất dài.

Cả hai đều có cùng điểm yếu là **giao dịch dài**. MVCC cũng chỉ gỡ xung đột đọc và ghi: hai bên ghi cùng dòng vẫn khóa, và điều này không ngăn được Write Skew.`,
    keyPoints: [
      { text: 'Nhiều phiên bản, đọc theo snapshot', keywords: ['phiên bản', 'snapshot', 'version'], weight: 2 },
      { text: 'PostgreSQL lưu trong bảng, xmin, xmax, VACUUM', keywords: ['xmin', 'xmax', 'vacuum', 'trong bảng', 'heap'], weight: 2 },
      { text: 'InnoDB cập nhật tại chỗ, undo log, purge', keywords: ['undo', 'tại chỗ', 'purge', 'in place'], weight: 2 },
      { text: 'Giao dịch dài là điểm yếu chung', keywords: ['giao dịch dài', 'bloat', 'phình'] },
      { text: 'Ghi và ghi vẫn cần khóa', keywords: ['ghi và ghi', 'vẫn khóa', 'khóa dòng', 'write skew'] },
    ],
    followUps: ['HOT update trong PostgreSQL là gì?', 'Vì sao giao dịch rất dài làm truy vấn đọc trên InnoDB chậm?'],
    commonMistakes: ['Nói MVCC loại bỏ hoàn toàn khóa.', 'Mô tả cơ chế của hai hệ như nhau.'],
  },
  {
    id: 'iv-db-isolation-levels-04',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-isolation-levels'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Lost Update và Write Skew khác nhau thế nào? Vì sao Repeatable Read của PostgreSQL chặn được cái đầu mà không chặn được cái sau?',
    referenceAnswer: `**Lost Update**: hai giao dịch đọc cùng một dòng rồi **ghi cùng dòng đó** dựa trên giá trị đã đọc, nên cập nhật của bên này đè lên bên kia. **Write Skew**: hai giao dịch đọc dữ liệu chồng lấn nhưng **ghi hai dòng khác nhau**. Mỗi bên đúng khi xét riêng, nhưng cộng lại vi phạm quy tắc. Ví dụ, hai bác sĩ cùng thấy có 2 người trực, rồi cùng xin nghỉ.

Snapshot Isolation của PostgreSQL phát hiện xung đột **ghi và ghi**: khi sửa một dòng đã bị đổi từ khi có snapshot, giao dịch bị hủy với lỗi \`could not serialize access due to concurrent update\`. Lost Update rơi đúng vào trường hợp này.

Write Skew ghi hai dòng khác nhau nên không có xung đột ghi nào để phát hiện. Xung đột nằm ở chỗ một bên đọc dữ liệu mà bên kia ghi, và Snapshot Isolation không theo dõi điều đó.

Serializable của PostgreSQL theo dõi chính các phụ thuộc đọc và ghi này, và hủy một giao dịch nếu có nguy cơ. Nếu không muốn dùng mức đó, tôi khóa tường minh các dòng được đọc bằng \`FOR UPDATE\`. Với InnoDB Repeatable Read, cả hai hiện tượng đều có thể xảy ra khi đọc thường rồi ghi.`,
    keyPoints: [
      { text: 'Lost Update: ghi cùng một dòng', keywords: ['cùng dòng', 'ghi đè', 'cùng một dòng'], weight: 2 },
      { text: 'Write Skew: ghi hai dòng khác nhau', keywords: ['hai dòng khác', 'dòng khác nhau', 'chồng lấn'], weight: 2 },
      { text: 'Snapshot Isolation chỉ phát hiện xung đột ghi và ghi', keywords: ['ghi và ghi', 'write write', 'concurrent update', 'first updater'], weight: 2 },
      { text: 'Serializable theo dõi phụ thuộc đọc và ghi', keywords: ['ssi', 'serializable', 'phụ thuộc đọc'] },
      { text: 'Cách khác là khóa tường minh', keywords: ['for update', 'khóa tường minh'] },
    ],
    followUps: ['Materializing conflict là gì?', 'InnoDB Serializable chặn Write Skew bằng cách nào?'],
    commonMistakes: ['Coi Write Skew là một dạng Phantom Read trong mọi trường hợp.', 'Cho rằng Repeatable Read đã đủ cho các quy tắc nhiều dòng.'],
  },
  {
    id: 'iv-db-isolation-levels-05',
    topicId: 'database',
    category: 'db-consistency',
    conceptIds: ['db-isolation-levels', 'db-transactions'],
    interviewTypes: ['de', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Hệ bán vé chạy Read Committed bị bán vượt số ghế khi tải cao. Bạn cân nhắc các cách sửa thế nào?',
    referenceAnswer: `Trước hết tôi xác định dạng lỗi. Nếu code đếm số vé đã bán rồi chèn vé mới, thì đây là kiểu **Write Skew trên dữ liệu chưa tồn tại**: hai bên cùng thấy còn ghế, và chèn hai dòng mới, không có dòng chung nào để khóa.

Tôi cân nhắc bốn cách.

**Ghi nguyên tử có điều kiện:** có dòng \`seats_left\` trên sự kiện, chạy \`UPDATE ... SET seats_left = seats_left - 1 WHERE seats_left > 0\`, rồi kiểm tra số dòng bị đổi. Ở Read Committed, bên sau chờ khóa, rồi đánh giá lại \`WHERE\` trên bản mới. Cách này đơn giản và nhanh nhất cho bài toán đếm, nhưng tranh chấp cao trên một dòng.

**Biến xung đột thành ràng buộc:** nếu là ghế cụ thể, dùng \`UNIQUE (event_id, seat_no)\`, để cơ sở dữ liệu từ chối bên sau.

**Khóa dòng cha:** \`SELECT ... FOR UPDATE\` trên dòng sự kiện để các giao dịch xếp hàng. Cách này tổng quát cho logic phức tạp, nhưng giảm thông lượng.

**Serializable:** an toàn với mọi logic, nhưng phải có thử lại, và tỷ lệ hủy tăng mạnh đúng lúc tải cao.

Tôi ưu tiên hai cách đầu. Với sự kiện rất hot, tôi chia ghế thành nhiều dòng để giảm tranh chấp, hoặc xếp hàng phía trước cơ sở dữ liệu.`,
    keyPoints: [
      { text: 'Xác định đúng dạng lỗi: đọc rồi ghi dữ liệu mới', keywords: ['write skew', 'đếm số', 'phantom', 'chưa tồn tại'], weight: 2 },
      { text: 'Ghi nguyên tử có điều kiện', keywords: ['nguyên tử', 'seats left', 'where', 'có điều kiện'], weight: 2 },
      { text: 'Dùng ràng buộc UNIQUE', keywords: ['unique', 'ràng buộc'], weight: 2 },
      { text: 'Khóa dòng cha bằng FOR UPDATE', keywords: ['for update', 'khóa dòng', 'dòng cha'] },
      { text: 'Serializable cần thử lại và tỷ lệ hủy cao', keywords: ['serializable', 'thử lại', 'retry'] },
    ],
    followUps: ['Làm sao giảm tranh chấp trên một dòng đếm rất nóng?', 'Nếu dữ liệu đã shard thì chọn cách nào?'],
    commonMistakes: ['Nâng mức cô lập ngay mà không có logic thử lại.', 'Thêm kiểm tra ở ứng dụng mà không có khóa hay ràng buộc.'],
  },
])
