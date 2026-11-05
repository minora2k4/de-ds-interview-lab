import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-cloud-consistency-01',
    topicId: 'cloud',
    category: 'cloud-consistency-group',
    conceptIds: ['cloud-consistency', 'cloud-eventual-consistency'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Strong Consistency và Eventual Consistency khác nhau thế nào? Cho ví dụ khi nào dùng mỗi loại.',
    referenceAnswer: `Khác biệt xuất phát từ việc có nhiều bản sao. **Strong Consistency** bảo đảm ghi xong thì mọi người đọc đều thấy giá trị mới, như thể chỉ có một bản dữ liệu. Để làm được, hệ thống phải chờ một đa số bản sao, hoặc mọi thao tác phải đi qua leader, nên độ trễ cao hơn và có thể từ chối khi mất đa số.

**Eventual Consistency** chỉ hứa rằng nếu ngừng ghi thì các bản sẽ hội tụ. Trong lúc đó, người đọc có thể thấy giá trị cũ. Đổi lại, đọc và ghi ở bản gần nên nhanh và vẫn phục vụ được khi có sự cố mạng.

Tôi chọn theo hậu quả của việc đọc giá trị cũ. Số dư tài khoản, tồn kho, khóa chính thì dùng Strong, vì sai là mất tiền. Lượt xem, gợi ý, số liệu phân tích thì dùng Eventual, vì sai vài giây không sao. Nhiều hệ thống cho phép chọn theo từng thao tác, như DynamoDB với \`ConsistentRead\`, nên không cần chọn một mức cho toàn hệ thống.`,
    keyPoints: [
      { text: 'Strong: đọc luôn thấy giá trị mới, như một bản', keywords: ['giá trị mới', 'một bản', 'mới nhất'], weight: 2 },
      { text: 'Eventual: chỉ hứa hội tụ, có thể đọc giá trị cũ', keywords: ['hội tụ', 'giá trị cũ', 'dữ liệu cũ'], weight: 2 },
      { text: 'Đánh đổi độ trễ và tính sẵn sàng', keywords: ['độ trễ', 'sẵn sàng', 'chờ'] },
      { text: 'Chọn theo hậu quả nghiệp vụ, có ví dụ', keywords: ['tồn kho', 'số dư', 'lượt xem', 'hậu quả'] },
    ],
    followUps: ['Có mức nào ở giữa hai mức này không?', 'S3 hiện nay thuộc mức nào?'],
    commonMistakes: ['Nói Eventual nghĩa là dữ liệu sai.', 'Không nêu được chi phí của Strong.'],
  },
  {
    id: 'iv-cloud-consistency-02',
    topicId: 'cloud',
    category: 'cloud-consistency-group',
    conceptIds: ['cloud-consistency', 'cloud-replication'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Người dùng vừa cập nhật hồ sơ xong, tải lại trang lại thấy dữ liệu cũ. Vì sao, và bạn sửa thế nào mà không chuyển toàn bộ hệ thống sang Strong?',
    referenceAnswer: `Lần đọc đi tới một bản sao bất đồng bộ chưa nhận được thay đổi. Điều người dùng cần không phải là mọi người đều thấy dữ liệu mới, mà chỉ là **chính họ** thấy ghi của mình, tức Read-your-writes. Chuyển sang Strong sẽ làm mọi đọc đắt hơn để giải quyết một vấn đề hẹp.

Có vài cách. Đơn giản nhất là đọc từ leader trong một khoảng ngắn sau khi người đó vừa ghi, hoặc luôn đọc từ leader với dữ liệu mà người dùng tự sửa. Tốt hơn là theo phiên bản: lần ghi trả về một vị trí trong log, client gửi kèm khi đọc, và bản sao chỉ trả lời khi đã bắt kịp vị trí đó. Cosmos DB làm đúng điều này với mức Session.

Tôi cũng xét **Monotonic Reads**: nếu mỗi lần đọc tới một bản khác nhau, người dùng có thể thấy dữ liệu đi lùi. Cố định người dùng vào một bản sao giải quyết được việc này, nhưng phải xử lý khi bản đó hỏng. Đánh đổi của các cách trên là phải truyền thêm thông tin phiên, và đa thiết bị khó hơn, vì thiết bị khác không có token đó.`,
    keyPoints: [
      { text: 'Nguyên nhân: đọc từ bản sao bất đồng bộ', keywords: ['bất đồng bộ', 'độ trễ sao chép', 'replication lag', 'bản sao'], weight: 2 },
      { text: 'Nhu cầu thật là Read-your-writes', keywords: ['read-your-writes', 'thấy ghi của mình', 'read your writes'], weight: 2 },
      { text: 'Đọc từ leader sau khi ghi', keywords: ['đọc từ leader', 'leader sau khi ghi'] },
      { text: 'Token phiên bản, mức Session', keywords: ['token', 'phiên bản', 'session', 'vị trí trong log'] },
      { text: 'Monotonic Reads', keywords: ['monotonic', 'đọc lùi'] },
    ],
    followUps: ['Đa thiết bị thì xử lý thế nào?', 'Nếu leader quá tải vì các đọc này thì sao?'],
    commonMistakes: ['Đề xuất ngay chuyển sang đồng bộ toàn bộ.', 'Chỉ dùng cache hoặc đợi vài giây mà không có đảm bảo.'],
  },
  {
    id: 'iv-cloud-consistency-03',
    topicId: 'cloud',
    category: 'cloud-consistency-group',
    conceptIds: ['cloud-consistency', 'cloud-cap', 'db-acid'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Thiết kế tính nhất quán cho hệ thống tồn kho phục vụ nhiều vùng. Bạn chọn mức nào cho từng thao tác và vì sao?',
    referenceAnswer: `Tôi bắt đầu bằng cách chia thao tác theo hậu quả khi sai, vì một mức cho tất cả sẽ quá đắt hoặc quá rủi ro.

**Hiển thị tồn kho** có lượng đọc rất lớn và sai vài giây không sao, nên đọc Eventual từ vùng gần. **Trang đơn của chính người mua** dùng Session. **Giữ hàng khi đặt** là thao tác không được sai: phải là ghi có điều kiện, chỉ thành công khi còn hàng. Đọc mạnh rồi mới ghi vẫn sai, vì có khoảng trống giữa hai thao tác.

Khó nhất là giữ hàng trên nhiều vùng. Đồng thuận toàn cầu đúng nhưng mỗi lần ghi tốn một vòng mạng liên vùng. Cách phổ biến hơn là **chia hạn mức tồn kho về từng vùng**: mỗi vùng trừ cục bộ với độ trễ thấp, hết thì xin thêm từ nơi khác. Khi partition xảy ra, vùng đó vẫn bán được trong hạn mức, chỉ phần chuyển hạn mức bị dừng. Đổi lại có thể báo hết hàng trong khi vùng khác còn.

Cuối cùng, tôi có đối soát định kỳ để phát hiện lệch, và phương án xử lý nghiệp vụ khi bán quá, như xin lỗi và hoàn tiền, vì đôi khi cách này rẻ hơn ngăn tuyệt đối.`,
    keyPoints: [
      { text: 'Chọn mức theo từng thao tác', keywords: ['từng thao tác', 'theo thao tác', 'hậu quả'], weight: 2 },
      { text: 'Giữ hàng bằng ghi có điều kiện', keywords: ['ghi có điều kiện', 'conditional', 'nguyên tử'], weight: 2 },
      { text: 'Chi phí đồng thuận liên vùng', keywords: ['liên vùng', 'đồng thuận', 'vòng mạng', 'consensus'] },
      { text: 'Chia hạn mức theo vùng', keywords: ['hạn mức', 'phân bổ', 'quota', 'chia tồn kho'], weight: 2 },
      { text: 'Đối soát và xử lý bù khi sai', keywords: ['đối soát', 'hoàn tiền', 'xử lý bù', 'bù trừ'] },
    ],
    followUps: ['Khi partition, vùng hết hạn mức làm gì?', 'Bạn đo lệch tồn kho bằng cách nào?'],
    commonMistakes: ['Dùng một mức cho toàn hệ thống.', 'Cho rằng đọc mạnh là đủ để tránh bán quá.'],
  },
  {
    id: 'iv-cloud-cap-01',
    topicId: 'cloud',
    category: 'cloud-consistency-group',
    conceptIds: ['cloud-cap'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Giải thích định lý CAP. Có phải hệ thống luôn phải chọn 2 trong 3 tính chất không?',
    referenceAnswer: `CAP nói về hệ thống dữ liệu có bản sao, gồm ba tính chất. **Consistency** là mọi đọc đều thấy giá trị mới nhất, như chỉ có một bản dữ liệu. **Availability** là mọi yêu cầu tới nút còn sống đều nhận được phản hồi không phải lỗi. **Partition Tolerance** là hệ thống vẫn chạy khi mạng làm mất hoặc trễ thông điệp giữa các nút.

Câu "chọn 2 trong 3" là cách hiểu sai. Mạng có thể hỏng bất cứ lúc nào, nên P không phải là lựa chọn. Định lý thực sự nói rằng: **khi có Network Partition**, hệ thống phải chọn giữa C và A. Lúc mạng bình thường thì có thể có cả hai.

Lý do rất trực quan: hai nút mất liên lạc, client ghi vào nút thứ nhất rồi đọc từ nút thứ hai. Nút thứ hai chỉ có thể trả giá trị cũ, tức mất C, hoặc từ chối, tức mất A. Nó không thể biết điều nó chưa nhận được.

Nói thêm, lúc bình thường vẫn có đánh đổi giữa độ trễ và tính nhất quán, đó là phần mà PACELC bổ sung.`,
    keyPoints: [
      { text: 'Định nghĩa đúng C, A, P', keywords: ['linearizability', 'giá trị mới nhất', 'nút còn sống', 'mất thông điệp'], weight: 2 },
      { text: 'Chỉ phải chọn khi có Network Partition', keywords: ['khi có partition', 'network partition', 'phân mảnh mạng'], weight: 3 },
      { text: 'P không phải là lựa chọn', keywords: ['không phải lựa chọn', 'mạng có thể hỏng', 'không tránh'], weight: 2 },
      { text: 'Giải thích bằng ví dụ hai nút', keywords: ['hai nút', 'giá trị cũ', 'từ chối'] },
      { text: 'Nhắc PACELC', keywords: ['pacelc', 'độ trễ'] },
    ],
    followUps: ['Hệ thống CA có tồn tại không?', 'Lúc không có partition thì đánh đổi gì?'],
    commonMistakes: ['Nói phải chọn 2 trong 3 ở mọi lúc.', 'Định nghĩa A là hệ thống không bao giờ dừng, thay vì nút còn sống phải trả lời.'],
  },
  {
    id: 'iv-cloud-cap-02',
    topicId: 'cloud',
    category: 'cloud-consistency-group',
    conceptIds: ['cloud-cap', 'db-acid', 'cloud-consistency'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Consistency trong CAP và Consistency trong ACID khác nhau thế nào? Cho ví dụ một hệ thống đạt cái này nhưng không đạt cái kia.',
    referenceAnswer: `Hai chữ C trả lời hai câu hỏi khác nhau.

**C trong CAP** là Linearizability: các bản sao có trả lời như một bản dữ liệu duy nhất không. Câu hỏi là về thời điểm một thay đổi được nhìn thấy, trong một hệ có nhiều nút. Nó do giao thức sao chép bảo đảm.

**C trong ACID** là giao dịch đưa dữ liệu từ một trạng thái hợp lệ sang trạng thái hợp lệ khác, theo các ràng buộc như khóa ngoại hay số dư không âm. Câu hỏi là về tính đúng đắn của dữ liệu. Nó do cơ sở dữ liệu và logic ứng dụng cùng bảo đảm, kể cả trên một máy.

**Ví dụ đạt ACID, không đạt CAP-C:** PostgreSQL có bản sao đọc bất đồng bộ. Trên máy chính, mọi ràng buộc đều được giữ. Nhưng đọc từ bản sao có thể thấy giá trị cũ, nên không Linearizable.

**Ví dụ ngược lại:** một kho key-value Linearizable như etcd cho thấy giá trị mới nhất, nhưng không tự kiểm tra ràng buộc giữa các key. Ứng dụng có thể ghi hai key mâu thuẫn nhau, và hệ thống không ngăn lại.`,
    keyPoints: [
      { text: 'C trong CAP là Linearizability của các bản sao', keywords: ['linearizability', 'như một bản', 'bản sao'], weight: 2 },
      { text: 'C trong ACID là giữ ràng buộc dữ liệu', keywords: ['ràng buộc', 'trạng thái hợp lệ', 'khóa ngoại', 'invariant'], weight: 2 },
      { text: 'Ví dụ đạt ACID nhưng không đạt CAP-C', keywords: ['bản sao đọc', 'bất đồng bộ', 'postgresql'] },
      { text: 'Ví dụ ngược lại', keywords: ['key-value', 'etcd', 'không kiểm tra ràng buộc'] },
    ],
    followUps: ['Isolation khác Linearizability ở đâu?', 'Trong ACID, ai chịu trách nhiệm chính cho chữ C?'],
    commonMistakes: ['Xem hai chữ C là một.', 'Nói NoSQL không có Consistency nói chung, mà không rõ đang nói về nghĩa nào.'],
  },
  {
    id: 'iv-cloud-cap-03',
    topicId: 'cloud',
    category: 'cloud-consistency-group',
    conceptIds: ['cloud-cap', 'cloud-replication'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'PACELC là gì? Vì sao nói nó hữu ích hơn CAP khi chọn cơ sở dữ liệu? Xếp loại vài hệ thống quen thuộc.',
    referenceAnswer: `PACELC do Daniel Abadi đề xuất năm 2012: nếu có Partition thì chọn giữa Availability và Consistency, ngược lại (Else) thì chọn giữa Latency và Consistency.

Nó hữu ích vì partition khá hiếm, còn đánh đổi độ trễ thì xảy ra ở mọi yêu cầu. Khi có bản sao, muốn chắc chắn nhất quán thì phải chờ các bản khác, nên độ trễ tăng. Abadi cho rằng đây mới là lý do chính khiến Dynamo, Cassandra nới lỏng tính nhất quán, chứ không phải CAP. CAP không ép hệ thống phải yếu đi khi mạng bình thường.

Theo bài báo gốc, với cấu hình mặc định: Dynamo, Cassandra, Riak là PA/EL, tức lúc nào cũng ưu tiên phục vụ nhanh. VoltDB, Megastore, HBase là PC/EC, tức luôn giữ nhất quán và chấp nhận độ trễ. MongoDB được xếp PA/EC và PNUTS là PC/EL.

Tôi xem các nhãn này chỉ là điểm bắt đầu, vì nhiều hệ thống đổi được theo cấu hình. Cassandra với quorum sẽ tiến về phía C. Khi chọn, tôi hỏi cụ thể: ở mức cấu hình tôi dùng, nó làm gì khi mạng lỗi, và độ trễ p99 là bao nhiêu.`,
    keyPoints: [
      { text: 'Nêu đúng phát biểu PACELC', keywords: ['else', 'latency', 'độ trễ', 'pacelc'], weight: 2 },
      { text: 'Partition hiếm, đánh đổi độ trễ luôn có', keywords: ['hiếm', 'mọi yêu cầu', 'hằng ngày', 'luôn có'], weight: 2 },
      { text: 'Phân loại đúng vài hệ thống', keywords: ['pa/el', 'pc/ec', 'cassandra', 'dynamo'] },
      { text: 'Nhãn thay đổi theo cấu hình', keywords: ['cấu hình', 'quorum', 'tùy chỉnh'] },
    ],
    followUps: ['DynamoDB global tables chọn gì?', 'Vì sao PC/EL nghe có vẻ mâu thuẫn?'],
    commonMistakes: ['Chỉ đọc tên viết tắt mà không giải thích được vì sao có đánh đổi độ trễ.', 'Xem nhãn là cố định.'],
  },
  {
    id: 'iv-cloud-cap-04',
    topicId: 'cloud',
    category: 'cloud-consistency-group',
    conceptIds: ['cloud-cap', 'cloud-high-availability', 'kafka-replication'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Pipeline thu nhận sự kiện chạy ở hai vùng, và đường truyền giữa hai vùng đứt 10 phút. Bạn muốn hệ thống hoạt động thế nào, và điều đó phản ánh lựa chọn gì trong CAP?',
    referenceAnswer: `Trước tiên tôi hỏi điều gì đắt hơn: mất sự kiện, hay sự kiện đến muộn và bị trùng. Với hầu hết pipeline phân tích, không được mất, nhưng muộn thì chấp nhận được. Vì vậy phần thu nhận chọn **A**: mỗi vùng tiếp tục ghi vào cụm Kafka riêng của mình, không chờ vùng kia.

Khi mạng phục hồi, sự kiện được chép sang vùng còn lại. Hai vấn đề cần xử lý. Sự kiện đến không đúng thứ tự, nên xử lý phải dựa trên thời gian sự kiện chứ không phải thời gian đến, và có cơ chế cho dữ liệu muộn. Sự kiện có thể bị trùng do chép lại, nên phải có ID duy nhất và phần ghi cuối phải idempotent. Các bảng tổng hợp của khoảng 10 phút đó cần được tính lại.

Ngược lại, trong từng vùng, ghi vào Kafka lại chọn **C**: \`acks=all\` với \`min.insync.replicas=2\`. Nếu mất đa số trong vùng thì Producer nhận lỗi thay vì mất dữ liệu đã xác nhận. Producer có thể đệm và thử lại.

Vậy cùng một pipeline có hai lựa chọn ở hai tầng. Lựa chọn A ở tầng liên vùng được trả giá bằng hội tụ sau và phải tính lại, đúng tinh thần của Eventual Consistency.`,
    keyPoints: [
      { text: 'Hỏi nghiệp vụ: mất dữ liệu hay đến muộn đắt hơn', keywords: ['mất sự kiện', 'đến muộn', 'nghiệp vụ', 'đắt hơn'], weight: 2 },
      { text: 'Liên vùng chọn A, mỗi vùng ghi riêng', keywords: ['chọn a', 'availability', 'mỗi vùng', 'cụm riêng'], weight: 2 },
      { text: 'Xử lý trùng và sai thứ tự sau khi phục hồi', keywords: ['trùng', 'idempotent', 'thời gian sự kiện', 'dữ liệu muộn'], weight: 2 },
      { text: 'Trong một vùng ưu tiên độ bền với acks và ISR', keywords: ['acks', 'isr', 'min.insync'] },
      { text: 'Tính lại các bảng tổng hợp', keywords: ['tính lại', 'backfill', 'tổng hợp'] },
    ],
    followUps: ['Bạn phát hiện hết partition và sao chép xong bằng cách nào?', 'Nếu đây là dữ liệu thanh toán thì thiết kế có đổi không?'],
    commonMistakes: ['Trả lời "chọn CP" mà không nêu hành vi cụ thể.', 'Quên xử lý trùng và sai thứ tự sau khi mạng phục hồi.'],
  },
  {
    id: 'iv-cloud-eventual-01',
    topicId: 'cloud',
    category: 'cloud-consistency-group',
    conceptIds: ['cloud-eventual-consistency', 'cloud-s3', 'etl-idempotency'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Eventual Consistency ảnh hưởng thế nào tới một pipeline dữ liệu? Bạn thiết kế gì để an toàn với nó?',
    referenceAnswer: `Pipeline thường giả định rằng dữ liệu đã ghi thì đọc được ngay, và giả định này sai với nguồn eventual. Hậu quả là **bỏ sót dữ liệu**: job lọc theo khoảng thời gian không thấy các dòng còn đang sao chép. Hoặc **đọc phải dữ liệu cũ**, như đọc GSI của DynamoDB ngay sau khi ghi, hay đọc bucket đích của S3 Cross-Region Replication. S3 trong một vùng đã strong từ tháng 12/2020, nên riêng việc liệt kê tệp trong cùng vùng đã hết là vấn đề.

Tôi thiết kế theo các hướng sau. Dùng tín hiệu hoàn tất rõ ràng, như sự kiện tệp đến hoặc manifest, thay vì suy ra từ thời gian. Thêm một khoảng an toàn hoặc watermark trước khi xem một khoảng thời gian là đã đủ. Theo dõi trạng thái đã xử lý theo từng tệp hoặc offset. Làm cho bước ghi idempotent, để có thể chạy lại khi dữ liệu đến muộn. Cuối cùng đối soát số lượng với nguồn, vì đây là cách duy nhất phát hiện được bỏ sót âm thầm.`,
    keyPoints: [
      { text: 'Nguy cơ bỏ sót khi lọc theo thời gian', keywords: ['bỏ sót', 'lọc theo thời gian', 'thiếu dữ liệu'], weight: 2 },
      { text: 'Ví dụ đúng về nguồn eventual', keywords: ['gsi', 'replication', 'bản sao', 'cross-region'] },
      { text: 'Tín hiệu hoàn tất hoặc watermark', keywords: ['manifest', 'watermark', 'tín hiệu', 'sự kiện tệp'], weight: 2 },
      { text: 'Idempotent để chạy lại được', keywords: ['idempotent', 'chạy lại'] },
      { text: 'Đối soát số lượng', keywords: ['đối soát', 'số lượng', 'reconcile'] },
    ],
    followUps: ['Khoảng an toàn nên đặt bao nhiêu?', 'Nếu dữ liệu đến sau khi đã chốt sổ thì sao?'],
    commonMistakes: ['Nói S3 vẫn eventual với object, là thông tin cũ từ trước tháng 12/2020.'],
  },
])
