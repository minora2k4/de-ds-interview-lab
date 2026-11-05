import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-db-partitioning-01',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-partitioning', 'db-sharding'],
    interviewTypes: ['de', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Partitioning là gì? Khi nào nên dùng, và nó khác Sharding thế nào?',
    referenceAnswer: `Partitioning chia một bảng logic thành nhiều mảnh vật lý theo khóa phân vùng, thường trên cùng một máy. Ứng dụng vẫn thấy một bảng. Có ba kiểu: Range theo khoảng, List theo danh sách, Hash theo giá trị băm.

Lợi ích đến từ hai việc. Một là **Partition Pruning**: truy vấn lọc theo khóa chỉ đọc vài partition. Hai là **xóa nhanh**: \`DROP TABLE\` hay \`DETACH PARTITION\` một tháng dữ liệu gần như tức thời, không tạo dòng chết như \`DELETE\`.

Tôi dùng khi bảng rất lớn, phần lớn truy vấn lọc theo một cột, thường là thời gian, và dữ liệu cũ bị xóa theo lô. Nếu truy vấn không có khóa phân vùng thì không cắt tỉa được, và còn tốn hơn vì phải đọc index của mọi partition.

Khác biệt với **Sharding** là ranh giới máy. Partitioning vẫn trên một máy nên giao dịch và Join bình thường, nhưng không vượt được giới hạn ghi hay dung lượng của máy đó. Sharding vượt được, nhưng phải trả giá ở giao dịch và Join xuyên shard.`,
    keyPoints: [
      { text: 'Chia bảng thành mảnh vật lý, ứng dụng vẫn thấy một bảng', keywords: ['mảnh vật lý', 'một bảng', 'khóa phân vùng', 'partition key'], weight: 2 },
      { text: 'Partition Pruning', keywords: ['pruning', 'cắt tỉa', 'chỉ đọc vài partition'], weight: 2 },
      { text: 'Xóa dữ liệu cũ nhanh', keywords: ['drop', 'detach', 'xóa nhanh', 'dữ liệu cũ'] },
      { text: 'Khác Sharding ở ranh giới máy', keywords: ['một máy', 'nhiều máy', 'xuyên shard'], weight: 2 },
    ],
    followUps: ['Chọn khóa phân vùng thế nào?', 'Partition theo ngày hay theo tháng?'],
    commonMistakes: ['Dùng lẫn lộn hai từ Partitioning và Sharding.', 'Cho rằng Partitioning luôn làm truy vấn nhanh hơn.'],
  },
  {
    id: 'iv-db-partitioning-02',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-partitioning', 'db-sharding'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao khóa chính của bảng phân vùng phải chứa khóa phân vùng? Nếu cần email duy nhất trên bảng chia theo ngày thì bạn làm gì?',
    referenceAnswer: `Tính duy nhất được thực thi bằng index. Trên bảng phân vùng, mỗi partition có index riêng, và chỉ biết các dòng của mình. Nếu không chứa khóa phân vùng, cùng một giá trị có thể nằm ở hai partition mà không index nào phát hiện ra. Muốn kiểm tra thì mỗi lần ghi phải đọc index của mọi partition, và phải khóa để tránh hai bên cùng chèn, tức là mất hết lợi ích của việc chia nhỏ.

Khi khóa có chứa cột phân vùng, hai dòng trùng khóa chắc chắn nằm cùng một partition, nên kiểm tra tại chỗ là đủ. Cả PostgreSQL và MySQL đều có quy tắc này.

Với email duy nhất trên bảng chia theo ngày, ràng buộc \`UNIQUE (email, created_at)\` không giải quyết được, vì nó cho phép cùng email ở hai ngày khác nhau. Tôi tạo một **bảng riêng không phân vùng**, chỉ gồm \`email\` và \`user_id\`, có \`UNIQUE (email)\`, rồi ghi vào cả hai bảng trong một giao dịch. Bảng này không lớn, vì mỗi email chỉ có một dòng. Cách làm này cũng giống cách xử lý tính duy nhất toàn cục trên Sharding.`,
    keyPoints: [
      { text: 'Mỗi index chỉ biết partition của nó', keywords: ['index riêng', 'partition của nó', 'trong partition', 'từng partition'], weight: 2 },
      { text: 'Khóa chứa cột phân vùng thì dòng trùng nằm cùng partition', keywords: ['cùng partition', 'cùng một partition', 'kiểm tra tại chỗ'], weight: 2 },
      { text: 'Thêm cột thời gian vào UNIQUE làm đổi ý nghĩa ràng buộc', keywords: ['đổi ý nghĩa', 'hai ngày khác', 'email created at'] },
      { text: 'Dùng bảng phụ không phân vùng', keywords: ['bảng riêng', 'bảng phụ', 'không phân vùng', 'bảng ánh xạ'], weight: 2 },
    ],
    followUps: ['Cách này khác gì so với khi đã Sharding?', 'Khóa ngoại trên bảng phân vùng của MySQL thì sao?'],
    commonMistakes: ['Thêm `created_at` vào ràng buộc rồi cho là đã xong.', 'Không giải thích được vì sao có quy tắc này.'],
  },
  {
    id: 'iv-db-sharding-01',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-sharding', 'db-partitioning', 'cloud-replication'],
    interviewTypes: ['de', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Phân biệt Replication, Partitioning và Sharding. Mỗi kỹ thuật giải quyết vấn đề gì?',
    referenceAnswer: `Ba kỹ thuật giải quyết ba vấn đề khác nhau.

**Replication** giữ nhiều bản sao của cùng dữ liệu trên nhiều máy. Nó giúp mở rộng đọc và tăng tính sẵn sàng. Nhưng mọi bản sao đều nhận đủ lượng ghi và chứa đủ dữ liệu, nên không mở rộng được ghi.

**Partitioning** chia một bảng lớn thành nhiều mảnh trên một máy. Nó giúp truy vấn đọc ít dữ liệu hơn và xóa dữ liệu cũ nhanh, trong khi giao dịch và Join vẫn hoạt động bình thường. Nhưng nó vẫn bị giới hạn bởi một máy.

**Sharding** chia dữ liệu theo dòng ra nhiều máy, mỗi máy giữ một phần. Đây là cách duy nhất trong ba cách vượt được giới hạn ghi và dung lượng. Cái giá là giao dịch, Join và ràng buộc xuyên shard đều khó.

Chúng thường đi cùng nhau: mỗi shard có replica riêng để không mất dữ liệu, và trong mỗi shard có thể có partition theo thời gian. Khi cần mở rộng, tôi đi theo thứ tự từ ít phức tạp nhất: tối ưu truy vấn, replica, partition, rồi mới đến Sharding.`,
    keyPoints: [
      { text: 'Replication: nhiều bản sao, mở rộng đọc, sẵn sàng', keywords: ['bản sao', 'mở rộng đọc', 'sẵn sàng', 'replica'], weight: 2 },
      { text: 'Partitioning: chia bảng trên một máy', keywords: ['một máy', 'chia bảng', 'pruning'], weight: 2 },
      { text: 'Sharding: chia dữ liệu ra nhiều máy, vượt giới hạn ghi', keywords: ['nhiều máy', 'giới hạn ghi', 'mở rộng ghi', 'dung lượng'], weight: 2 },
      { text: 'Dùng cùng nhau và theo thứ tự tăng dần độ phức tạp', keywords: ['cùng nhau', 'thứ tự', 'kết hợp'] },
    ],
    followUps: ['Vì sao replica không mở rộng được ghi?', 'Partition và shard có thể kết hợp thế nào?'],
    commonMistakes: ['Coi Sharding và Partitioning là một.', 'Cho rằng thêm replica giúp tăng khả năng ghi.'],
  },
  {
    id: 'iv-db-sharding-02',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-sharding', 'db-transactions', 'db-acid'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao Sharding làm khó giao dịch và Join? Hãy giải thích từ nguyên lý và nêu cách xử lý.',
    referenceAnswer: `Một máy có những thứ dùng chung mà ta thường không để ý: một log, một bảng khóa, một đồng hồ snapshot, và dữ liệu có thể đọc từ đĩa cục bộ. Sharding bỏ hết những thứ đó.

**Giao dịch:** trên một máy, commit là một lần ghi vào một log, nên tự nhiên nguyên tử. Trên nhiều máy không có thời điểm chung, và mỗi máy có thể lỗi độc lập. Vì vậy phải dùng **2PC**: thêm các vòng mạng, và nếu bộ điều phối lỗi sau prepare thì các shard phải giữ khóa để chờ. 2PC còn không đảm bảo cô lập: Vitess nêu rõ TwoPC có thể cho đọc thấy commit dở dang giữa các shard. Saga bù trừ thay vì khóa, nên trạng thái trung gian là nhìn thấy được.

**Join:** các dòng cần ghép nằm ở nhiều máy, nên phải kéo qua mạng, tốn kém như shuffle. Thời gian còn bị quyết định bởi shard chậm nhất.

**Cách xử lý:** tốt nhất là tránh. Chọn shard key để các dữ liệu đi cùng nhau nằm một chỗ, co-location các bảng hay Join, sao chép bảng nhỏ đến mọi shard, phi chuẩn hóa khi cần. Báo cáo xuyên shard thì đưa sang kho dữ liệu. Chỉ dùng 2PC cho số ít thao tác thật sự cần.`,
    keyPoints: [
      { text: 'Một máy có log, khóa và snapshot chung', keywords: ['log chung', 'một log', 'bảng khóa', 'snapshot chung'], weight: 2 },
      { text: 'Nhiều máy lỗi độc lập, cần 2PC và có thể bị chặn', keywords: ['2pc', 'two phase', 'lỗi độc lập', 'giữ khóa'], weight: 2 },
      { text: '2PC không đảm bảo cô lập; Saga là lựa chọn thay thế', keywords: ['cô lập', 'saga', 'bù trừ', 'dở dang'] },
      { text: 'Join phải kéo dữ liệu qua mạng', keywords: ['qua mạng', 'shuffle', 'máy khác'], weight: 2 },
      { text: 'Tránh bằng co-location, reference table, phi chuẩn hóa', keywords: ['co location', 'reference table', 'phi chuẩn hóa', 'shard key'], weight: 2 },
    ],
    followUps: ['Saga và 2PC khác nhau thế nào về tính cô lập?', 'Bộ điều phối 2PC lỗi thì khôi phục ra sao?'],
    commonMistakes: ['Chỉ nói "qua mạng nên chậm" mà không nêu được thứ đã mất.', 'Cho rằng 2PC giải quyết mọi vấn đề.'],
  },
  {
    id: 'iv-db-sharding-03',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-sharding'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn chọn shard key như thế nào? Điều gì xảy ra nếu chọn sai?',
    referenceAnswer: `Shard key quyết định dữ liệu nằm ở đâu, nên phải xuất phát từ cách dữ liệu được dùng. Tôi xét ba tiêu chí.

**Cardinality cao:** số giá trị khác nhau giới hạn số shard có thể dùng. \`status\` với 3 giá trị là lựa chọn tệ.

**Phân bố đều cả dữ liệu và tải:** key tăng dần với range làm mọi lần ghi dồn vào shard cuối. Một key có quá nhiều dữ liệu tạo hot shard mà hash không tách được.

**Có mặt trong đa số truy vấn:** thiếu key thì truy vấn thành scatter-gather. Tôi liệt kê các truy vấn chính, rồi chọn key để chúng đi đến một shard, và để các bảng hay Join có cùng key.

Với SaaS, \`tenant_id\` thường rất hợp. Khách hàng lớn thì chuyển sang shard riêng. Với mạng xã hội, \`user_id\` hợp với trang cá nhân nhưng khó hơn với bảng tin, nên thường cần phi chuẩn hóa.

Chọn sai sẽ gây hot shard, scatter-gather và nhiều giao dịch xuyên shard. Nặng nhất là phải đổi key: phải di chuyển toàn bộ dữ liệu trong khi hệ thống vẫn chạy. MongoDB từ bản 5.0 có hỗ trợ reshard, nhưng đó vẫn là thao tác rất tốn kém.`,
    keyPoints: [
      { text: 'Cardinality cao', keywords: ['cardinality', 'nhiều giá trị', 'giá trị khác nhau'], weight: 2 },
      { text: 'Phân bố đều, tránh hot shard', keywords: ['phân bố đều', 'hot shard', 'tăng dần', 'điểm nóng'], weight: 2 },
      { text: 'Có mặt trong đa số truy vấn', keywords: ['đa số truy vấn', 'scatter gather', 'mẫu truy vấn', 'truy vấn chính'], weight: 2 },
      { text: 'Co-location các bảng hay Join', keywords: ['co location', 'cùng key', 'cùng shard key'] },
      { text: 'Chọn sai thì phải di chuyển toàn bộ dữ liệu', keywords: ['di chuyển', 'reshard', 'khó đổi', 'chia lại'] },
    ],
    followUps: ['Khóa kết hợp giúp gì cho hot shard?', 'Nếu có hai mẫu truy vấn cần hai key khác nhau thì sao?'],
    commonMistakes: ['Chỉ quan tâm đến độ đều, bỏ qua mẫu truy vấn.', 'Chọn thời gian làm shard key cho tải chủ yếu là ghi.'],
  },
  {
    id: 'iv-db-sharding-04',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-sharding', 'db-query-optimization', 'db-oltp-olap'],
    interviewTypes: ['system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Cơ sở dữ liệu của bạn có 8 TB, 20.000 lượt ghi mỗi giây và đang gần hết tài nguyên. Dự kiến tải tăng gấp 10 lần trong 2 năm. Bạn lập kế hoạch mở rộng thế nào?',
    referenceAnswer: `Tôi không bắt đầu bằng Sharding. Trước hết tôi tìm hiểu tải: đọc và ghi chiếm bao nhiêu, truy vấn nào tốn nhất, bảng nào lớn nhất, dữ liệu nóng chiếm bao nhiêu phần trăm.

**Bước rẻ trước:** sửa các truy vấn tốn nhất qua \`EXPLAIN ANALYZE\`, xóa index thừa, đưa đọc sang replica và cache, đưa báo cáo sang kho dữ liệu qua CDC. Bảng sự kiện lớn thì partition theo thời gian và xóa hoặc lưu trữ phần dữ liệu cũ. Nếu 8 TB chủ yếu là log cũ, vấn đề có thể biến mất. Nếu chỉ một hai bảng chiếm phần lớn lượng ghi, tôi tách chúng sang hệ riêng trước.

**Khi vẫn cần Sharding:** gấp 10 lần lượng ghi thì khó ở trên một máy. Tôi chọn key từ các truy vấn chính, ví dụ \`tenant_id\`, co-location các bảng, và dùng nhiều shard logic hơn số máy để việc thêm máy sau này chỉ là di chuyển shard. Tôi cân nhắc Vitess hoặc Citus thay vì tự viết.

**Triển khai:** ghi kép vào hệ mới, sao chép dần dữ liệu cũ, so sánh kết quả, rồi chuyển đọc, rồi chuyển ghi, luôn có đường quay lại. Sửa ứng dụng để mọi truy vấn có shard key. Việc này mất nhiều tháng, nên phải bắt đầu trước khi hết tài nguyên.`,
    keyPoints: [
      { text: 'Hiểu tải trước khi quyết định', keywords: ['tìm hiểu tải', 'đọc và ghi', 'truy vấn tốn nhất', 'đo tải'], weight: 2 },
      { text: 'Các bước rẻ: tối ưu, replica, cache, partition, tách báo cáo', keywords: ['replica', 'cache', 'partition', 'kho dữ liệu', 'tối ưu'], weight: 2 },
      { text: 'Chọn shard key theo truy vấn chính', keywords: ['shard key', 'tenant id', 'co location'], weight: 2 },
      { text: 'Dùng shard logic để dễ thêm máy', keywords: ['shard logic', 'consistent hashing', 'nhiều shard hơn số máy'] },
      { text: 'Chuyển đổi không dừng hệ thống, có đường quay lại', keywords: ['ghi kép', 'dual write', 'quay lại', 'so sánh kết quả', 'di chuyển dần'], weight: 2 },
    ],
    followUps: ['Ghi kép xử lý lỗi một bên thế nào?', 'Làm sao sao lưu nhất quán trên nhiều shard?'],
    commonMistakes: ['Đề xuất Sharding ngay mà không phân tích tải.', 'Chỉ nói kiến trúc đích, không nói cách di chuyển.'],
  },
  {
    id: 'iv-db-sharding-05',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-sharding'],
    interviewTypes: ['de', 'system-design'],
    levels: ['senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Vì sao `hash(key) % N` là cách chia khó vận hành? Làm thế nào để thêm shard mà không phải di chuyển gần hết dữ liệu?',
    referenceAnswer: `Với \`hash(key) % N\`, vị trí của mỗi key phụ thuộc trực tiếp vào N. Tăng từ 4 lên 5 shard thì key chỉ giữ nguyên chỗ khi \`h % 4 = h % 5\`, tức khoảng 20%. Nghĩa là 80% dữ liệu phải di chuyển, tải mạng và đĩa tăng mạnh đúng lúc hệ thống đã quá tải.

Có hai cách phổ biến. **Consistent Hashing** đặt máy và key lên một vòng băm, nên thêm một máy chỉ nhận phần dữ liệu từ các máy kề bên, khoảng \`1/N\`. Dùng nhiều nút ảo để chia đều hơn và tránh lệch tải.

Cách còn lại là **chia trước thành nhiều shard logic**, ví dụ 1.024 shard logic trên 16 máy, với một bảng ánh xạ từ shard logic sang máy. Thêm máy chỉ là chuyển một số shard logic sang đó, và công thức băm không bao giờ đổi. Đơn giản và dễ kiểm soát, nên rất hay được dùng.

Việc di chuyển phải diễn ra khi hệ thống vẫn chạy: sao chép dữ liệu, theo log để bắt kịp, chặn ghi trong thời gian rất ngắn, đổi ánh xạ, rồi xóa bản cũ. Cũng phải giới hạn tốc độ để không ảnh hưởng đến tải thật.`,
    keyPoints: [
      { text: 'Đổi N làm phần lớn key đổi chỗ', keywords: ['phần lớn key', 'đổi chỗ', 'di chuyển gần hết', 'phần lớn dữ liệu'], weight: 2 },
      { text: 'Consistent Hashing và nút ảo', keywords: ['consistent hashing', 'vòng băm', 'nút ảo', 'virtual node'], weight: 2 },
      { text: 'Chia trước thành nhiều shard logic', keywords: ['shard logic', 'logical shard', 'bảng ánh xạ'], weight: 2 },
      { text: 'Di chuyển khi hệ thống vẫn chạy', keywords: ['theo log', 'bắt kịp', 'đổi ánh xạ', 'giới hạn tốc độ'] },
    ],
    followUps: ['Bao nhiêu shard logic là đủ?', 'Trong lúc di chuyển, truy vấn đi đến đâu?'],
    commonMistakes: ['Không tính được tỷ lệ key phải di chuyển.', 'Bỏ qua việc di chuyển phải diễn ra khi hệ thống vẫn chạy.'],
  },
  {
    id: 'iv-db-query-optimization-01',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-query-optimization'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Index là gì, và vì sao nó làm tăng tốc đọc nhưng làm chậm ghi?',
    referenceAnswer: `Index là một cấu trúc dữ liệu phụ giúp tìm dòng mà không cần quét cả bảng. Loại phổ biến nhất là B-tree: các giá trị được sắp xếp trong một cây rất nông, nên trên hàng tỷ dòng cũng chỉ cần đọc 3 đến 4 trang để tìm một giá trị. Nó giống mục lục cuối sách: tra mục lục rồi mở đúng trang, thay vì đọc từ đầu.

Vì đã sắp xếp, index còn giúp cho các điều kiện khoảng và \`ORDER BY\` mà không phải sort.

Ghi chậm đi vì index là một bản sao có thứ tự của dữ liệu, và phải luôn đúng. Mỗi lần \`INSERT\`, hay \`UPDATE\` trên cột được index, hệ thống phải tìm vị trí trong từng index, có thể phải tách trang, và ghi thêm vào log. Bảng có 10 index thì mỗi dòng mới phải cập nhật 10 cây. Index còn tốn dung lượng và chiếm bộ nhớ đệm.

Vì vậy, chỉ tạo index cho những truy vấn thật sự cần.`,
    keyPoints: [
      { text: 'Cấu trúc phụ giúp tìm dòng, không phải quét cả bảng', keywords: ['cấu trúc', 'mục lục', 'không quét', 'tìm dòng'], weight: 2 },
      { text: 'B-tree có thứ tự và rất nông', keywords: ['b tree', 'btree', 'sắp xếp', 'cây nông', 'rất nông'], weight: 2 },
      { text: 'Mỗi lần ghi phải cập nhật mọi index', keywords: ['cập nhật', 'mỗi lần ghi', 'tách trang', 'mọi index'], weight: 2 },
      { text: 'Tốn dung lượng và bộ nhớ', keywords: ['dung lượng', 'bộ nhớ'] },
    ],
    followUps: ['Index phức hợp là gì?', 'Khi nào index không được dùng?'],
    commonMistakes: ['Chỉ nói index làm nhanh hơn, không nói chi phí.', 'Cho rằng nên tạo index cho mọi cột.'],
  },
  {
    id: 'iv-db-query-optimization-02',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-query-optimization', 'db-execution-plan'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao một truy vấn có điều kiện trên cột có index mà cơ sở dữ liệu vẫn không dùng index đó?',
    referenceAnswer: `Optimizer chọn theo chi phí ước lượng, nên có index không có nghĩa là phải dùng. Tôi chia lý do thành ba nhóm.

**Dùng index đắt hơn.** Index trỏ tới các dòng rải rác, nên mỗi dòng là một lần đọc ngẫu nhiên. PostgreSQL mặc định tính đọc ngẫu nhiên gấp 4 lần đọc tuần tự. Lấy 60% bảng qua index tốn hơn nhiều so với đọc thẳng cả bảng. Bảng chỉ vài trang cũng vậy. Trường hợp này Seq Scan là đúng, không phải lỗi.

**Index không dùng được về mặt cấu trúc.** Bọc cột trong hàm như \`lower(email)\` hay \`date(created_at)\`, vì index lưu giá trị gốc. \`LIKE '%abc'\` vì không biết bắt đầu từ đâu. Index \`(a, b)\` khi chỉ lọc theo \`b\`, vì \`b\` nằm rải rác, trừ khi \`a\` có ít giá trị và có skip scan. Kiểu dữ liệu không khớp cũng có thể làm phép so sánh không dùng được index.

**Optimizer đoán sai.** Thống kê cũ sau đợt nạp lớn, hoặc các cột tương quan làm ước lượng lệch.

Khi gặp, tôi chạy \`EXPLAIN ANALYZE\`, so sánh ước lượng với thực tế, thử \`ANALYZE\`. Nếu ước lượng đúng thì tôi sửa điều kiện hoặc tạo index phù hợp, chứ không ép dùng index.`,
    keyPoints: [
      { text: 'Optimizer chọn theo chi phí', keywords: ['chi phí', 'cost', 'ước lượng'], weight: 2 },
      { text: 'Lấy quá nhiều dòng thì quét tuần tự rẻ hơn', keywords: ['đọc ngẫu nhiên', 'quá nhiều dòng', 'selectivity', 'chọn lọc', 'random'], weight: 2 },
      { text: 'Điều kiện bọc hàm hoặc không neo đầu', keywords: ['bọc', 'hàm', 'like', 'biểu thức'], weight: 2 },
      { text: 'Không khớp cột đầu của index phức hợp', keywords: ['cột đầu', 'tiền tố trái', 'leftmost', 'skip scan'] },
      { text: 'Thống kê sai', keywords: ['thống kê', 'analyze', 'statistics'] },
    ],
    followUps: ['Làm sao biết quyết định của optimizer có đúng không?', 'Partial index giúp gì trong trường hợp này?'],
    commonMistakes: ['Coi mọi Seq Scan là lỗi.', 'Ép dùng index mà không kiểm tra chi phí thật.'],
  },
  {
    id: 'iv-db-query-optimization-03',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-query-optimization'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Thiết kế index phức hợp cho `WHERE tenant_id = ? AND status = ? AND created_at > ? ORDER BY created_at`. Thứ tự cột quyết định thế nào?',
    referenceAnswer: `Index phức hợp được sắp xếp như danh bạ: theo cột đầu, rồi đến cột sau trong cùng giá trị của cột đầu. Vì vậy, thứ tự cột quyết định phần index có thể bỏ qua.

Tài liệu PostgreSQL nêu rõ quy tắc: điều kiện bằng trên các cột đầu, cộng với điều kiện khoảng trên cột đầu tiên không có điều kiện bằng, sẽ giới hạn phần index phải đọc. Các cột sau đó chỉ được lọc trong phần đã đọc.

Nên tôi chọn \`(tenant_id, status, created_at)\`: hai cột điều kiện bằng trước, cột khoảng sau. Trong cùng một cặp \`tenant_id\` và \`status\`, các dòng đã sắp theo \`created_at\`, nên vừa thu hẹp được khoảng, vừa **không cần sort**, và với \`LIMIT\` thì dừng sớm được.

Nếu đặt \`created_at\` trước, index phải đi qua mọi tenant trong khoảng thời gian đó rồi mới lọc, và rất lãng phí.

Trong số các cột điều kiện bằng, tôi đặt cột hay dùng một mình lên trước, vì index này còn phục vụ được truy vấn chỉ lọc theo \`tenant_id\`. Nếu chỉ cần vài cột trả về, có thể thêm chúng làm cột phụ để không phải đọc bảng.`,
    keyPoints: [
      { text: 'Index sắp theo cột đầu rồi đến cột sau', keywords: ['danh bạ', 'sắp theo cột đầu', 'tiền tố trái', 'leftmost'], weight: 2 },
      { text: 'Điều kiện bằng trước, điều kiện khoảng sau', keywords: ['bằng trước', 'khoảng sau', 'tenant id status created at'], weight: 2 },
      { text: 'Tránh được bước sort và dừng sớm với LIMIT', keywords: ['không cần sort', 'dừng sớm', 'limit', 'order by'], weight: 2 },
      { text: 'Cột hay dùng một mình đặt trước', keywords: ['một mình', 'truy vấn khác', 'tái sử dụng'] },
      { text: 'Thêm cột phụ để không đọc bảng', keywords: ['index only', 'include', 'bao phủ', 'covering'] },
    ],
    followUps: ['Vì sao cột điều kiện khoảng lại chặn việc dùng các cột sau nó?', 'Index bao phủ có cái giá gì?'],
    commonMistakes: ['Đặt cột điều kiện khoảng lên đầu.', 'Tạo ba index một cột và hy vọng optimizer gộp lại.'],
  },
  {
    id: 'iv-db-query-optimization-04',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-query-optimization', 'db-execution-plan'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Một truy vấn vẫn chạy tốt suốt nhiều tháng, hôm nay đột nhiên chậm hơn 100 lần mà code không đổi. Bạn điều tra thế nào?',
    referenceAnswer: `Code không đổi nhưng dữ liệu và môi trường thì có, nên tôi xem kế hoạch trước, không đoán.

**Bước 1: có phải chỉ truy vấn này không?** Nếu cả hệ thống chậm thì tôi xem CPU, I/O, khóa, số kết nối. \`pg_stat_activity\` cho biết truy vấn đang chờ gì. Nếu chờ khóa thì vấn đề nằm ở giao dịch khác.

**Bước 2: so sánh kế hoạch.** Chạy \`EXPLAIN ANALYZE\`, so với kế hoạch cũ nếu có lưu. Nguyên nhân phổ biến nhất là **kế hoạch bị đổi**: dữ liệu vượt ngưỡng nào đó làm optimizer đổi từ Hash Join sang Nested Loop, hoặc ngược lại. Ước lượng lệch xa thực tế thì do thống kê cũ, thường sau đợt nạp lớn, nên tôi chạy \`ANALYZE\`.

**Bước 3: dữ liệu thay đổi.** Tham số cụ thể có thể rơi vào giá trị rất phổ biến. Bảng phình do \`VACUUM\` bị cản bởi giao dịch dài, làm mọi lần quét đọc nhiều trang hơn. Dữ liệu vượt quá bộ nhớ làm hit ratio giảm đột ngột, nên thời gian không tăng từ từ mà tăng theo bậc.

**Sau khi sửa,** tôi đặt giám sát: \`pg_stat_statements\` để thấy biến động theo thời gian, cảnh báo cho giao dịch dài, và thêm \`ANALYZE\` vào cuối các pipeline nạp lớn.`,
    keyPoints: [
      { text: 'Xác định phạm vi và xem truy vấn chờ gì', keywords: ['pg stat activity', 'chờ khóa', 'phạm vi', 'cả hệ thống'] },
      { text: 'So sánh kế hoạch, kế hoạch bị đổi', keywords: ['kế hoạch', 'explain', 'plan', 'đổi kế hoạch'], weight: 2 },
      { text: 'Thống kê cũ, chạy ANALYZE', keywords: ['thống kê', 'analyze', 'ước lượng'], weight: 2 },
      { text: 'Bảng phình, giao dịch dài, vượt bộ nhớ', keywords: ['phình', 'bloat', 'vacuum', 'giao dịch dài', 'hit ratio', 'bộ nhớ'] },
      { text: 'Đặt giám sát', keywords: ['giám sát', 'pg stat statements', 'cảnh báo'] },
    ],
    followUps: ['Làm sao giữ ổn định kế hoạch cho một truy vấn quan trọng?', 'Prepared statement có thể gây ra lỗi này không?'],
    commonMistakes: ['Thêm index ngay khi chưa xem kế hoạch.', 'Cho rằng code không đổi nghĩa là không có gì đổi.'],
  },
  {
    id: 'iv-db-query-optimization-05',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-query-optimization'],
    interviewTypes: ['de'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Optimizer ước lượng số dòng như thế nào? Vì sao ước lượng có thể sai lớn, nhất là khi có nhiều Join?',
    referenceAnswer: `\`ANALYZE\` lấy mẫu từng cột để lập thống kê: tỷ lệ null, số giá trị khác nhau, các giá trị phổ biến cùng tần suất, và histogram. Với điều kiện \`status = 'failed'\`, optimizer tra tần suất để biết tỷ lệ khớp, rồi nhân với số dòng.

Ước lượng dựa trên các giả định, và lỗi đến từ đó.

**Giả định độc lập:** mặc định, hai điều kiện được coi là độc lập nên tỷ lệ được nhân với nhau. Nhưng \`city = 'Hà Nội' AND country = 'Việt Nam'\` tương quan hoàn toàn, nên kết quả nhỏ hơn thực tế rất nhiều. \`CREATE STATISTICS\` của PostgreSQL giúp xử lý phần này.

**Mẫu có giới hạn:** các giá trị hiếm có thể không được ghi nhận, và thống kê không đổi kịp sau đợt nạp lớn.

**Lỗi nhân lên qua Join:** kết quả của Join này là đầu vào của Join sau. Sai 10 lần ở mỗi bước, qua 4 bước là sai 10.000 lần. Ước lượng thấp thường nguy hiểm nhất: optimizer tưởng chỉ có 10 dòng nên chọn Nested Loop, thực tế là hàng triệu vòng lặp. Vì vậy, tôi kiểm tra các node có sai số lớn trước.`,
    keyPoints: [
      { text: 'Thống kê từ ANALYZE: tần suất, histogram', keywords: ['analyze', 'histogram', 'tần suất', 'giá trị phổ biến', 'lấy mẫu'], weight: 2 },
      { text: 'Giả định độc lập giữa các cột', keywords: ['độc lập', 'tương quan', 'nhân tỷ lệ', 'correlated'], weight: 2 },
      { text: 'Giới hạn của mẫu và thống kê cũ', keywords: ['lấy mẫu', 'thống kê cũ', 'giá trị hiếm'] },
      { text: 'Sai số nhân lên qua Join', keywords: ['nhân lên', 'qua join', 'lũy tiến', 'nhiều join'], weight: 2 },
      { text: 'Ước lượng thấp dẫn đến Nested Loop sai', keywords: ['nested loop', 'ước lượng thấp'] },
    ],
    followUps: ['CREATE STATISTICS giúp được và không giúp được gì?', 'Adaptive execution giải quyết vấn đề này thế nào?'],
    commonMistakes: ['Cho rằng optimizer biết chính xác số dòng.', 'Chỉ nói "thống kê cũ" mà không nói đến giả định độc lập.'],
  },
  {
    id: 'iv-db-execution-plan-01',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-execution-plan'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn đọc Execution Plan như thế nào? EXPLAIN và EXPLAIN ANALYZE khác nhau ra sao?',
    referenceAnswer: `Kế hoạch là một cây. Node lá quét bảng, các node trên Join, sort và gom nhóm, nên tôi đọc từ node sâu nhất đi lên.

\`EXPLAIN\` chỉ cho xem kế hoạch với số liệu ước lượng, không chạy truy vấn. \`EXPLAIN ANALYZE\` chạy thật và cho thêm thời gian, số dòng thực tế. Với lệnh ghi, tôi bọc trong \`BEGIN\` rồi \`ROLLBACK\`, vì lệnh thực sự được thực thi.

Tôi chú ý bốn điều. **Một:** so sánh \`rows\` ước lượng với thực tế, lệch hàng trăm lần là dấu hiệu rõ nhất của kế hoạch sai. **Hai:** \`actual time\` và \`rows\` là trung bình mỗi vòng lặp, phải nhân với \`loops\`, nếu không sẽ bỏ sót node chạy rất nhiều lần. **Ba:** \`Rows Removed by Filter\` lớn nghĩa là đọc thừa nhiều dòng rồi mới bỏ, có thể cần index tốt hơn. **Bốn:** node nào tốn nhiều thời gian nhất, tính sau khi trừ đi các node con.

\`cost\` chỉ để so sánh các kế hoạch, không phải mili giây. Với \`Buffers\`, tôi biết thêm truy vấn đọc từ cache hay từ đĩa.`,
    keyPoints: [
      { text: 'Kế hoạch là cây, đọc từ node sâu nhất', keywords: ['cây', 'node', 'từ dưới lên', 'sâu nhất'], weight: 2 },
      { text: 'EXPLAIN ước lượng, ANALYZE chạy thật', keywords: ['chạy thật', 'ước lượng', 'thực thi', 'rollback'], weight: 2 },
      { text: 'So sánh rows ước lượng và thực tế', keywords: ['ước lượng với thực tế', 'rows', 'lệch'], weight: 2 },
      { text: 'Nhân với loops', keywords: ['loops', 'vòng lặp'] },
      { text: 'Rows Removed by Filter', keywords: ['rows removed', 'filter', 'index cond', 'đọc thừa'] },
    ],
    followUps: ['Index Scan và Bitmap Heap Scan khác nhau thế nào?', 'cost=a..b, hai số đó có ý nghĩa gì?'],
    commonMistakes: ['Đọc `cost` như thời gian thật.', 'Quên nhân với `loops`.'],
  },
  {
    id: 'iv-db-execution-plan-02',
    topicId: 'database',
    category: 'db-scaling',
    conceptIds: ['db-execution-plan', 'db-query-optimization'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Trong kế hoạch, node được ước lượng trả về 10 dòng nhưng thực tế là 48.000 dòng. Điều đó ảnh hưởng thế nào, và bạn xử lý ra sao?',
    referenceAnswer: `Mọi quyết định của optimizer đều dựa trên số dòng, nên sai ở một node sẽ làm sai các bước phía trên.

Với 10 dòng, **Nested Loop** có vẻ rất rẻ: chỉ 10 lần tra index ở bảng bên trong. Thực tế là 48.000 vòng lặp, mỗi vòng tốn đọc ngẫu nhiên, nên chậm hơn hàng nghìn lần so với dự tính. Trong khi đó, Hash Join sẽ tốt hơn nhiều, nhưng không được chọn vì trông đắt khi chỉ có 10 dòng. Bộ nhớ cấp cho sort hay hash cũng có thể quá ít nên phải tràn đĩa.

Tôi tìm nguyên nhân của sai số trước. Nếu vừa có đợt nạp lớn thì chạy \`ANALYZE\`, và thêm nó vào pipeline. Nếu thống kê mới mà vẫn sai, tôi xem điều kiện: các cột tương quan thì dùng \`CREATE STATISTICS\`, phân phối rất lệch thì tăng statistics target cho cột đó, biểu thức phức tạp thì viết lại hoặc tạo index theo biểu thức, vì index theo biểu thức cũng được thu thập thống kê riêng.

Chỉ khi các cách trên không đủ, tôi mới tác động trực tiếp vào kế hoạch, như tách truy vấn thành nhiều bước qua bảng tạm để có thống kê đúng ở bước giữa. Tắt \`enable_nestloop\` chỉ dùng để thử nghiệm trong một phiên.`,
    keyPoints: [
      { text: 'Sai số lan lên các node phía trên', keywords: ['lan lên', 'lan truyền', 'phía trên', 'dựa trên số dòng'], weight: 2 },
      { text: 'Nested Loop bị chọn sai', keywords: ['nested loop', 'hash join', 'vòng lặp'], weight: 2 },
      { text: 'Chạy ANALYZE khi thống kê cũ', keywords: ['analyze', 'thống kê cũ', 'nạp lớn'], weight: 2 },
      { text: 'Cột tương quan, tăng statistics target', keywords: ['create statistics', 'tương quan', 'statistics target'] },
      { text: 'Tách bước hoặc chỉ tắt kế hoạch khi thử nghiệm', keywords: ['bảng tạm', 'tách', 'enable nestloop', 'thử nghiệm'] },
    ],
    followUps: ['Vì sao ước lượng quá cao ít nguy hiểm hơn ước lượng quá thấp?', 'Autovacuum có chạy ANALYZE không?'],
    commonMistakes: ['Thêm index ngay khi chưa tìm ra vì sao ước lượng sai.', 'Tắt Nested Loop trên toàn máy chủ.'],
  },
])
