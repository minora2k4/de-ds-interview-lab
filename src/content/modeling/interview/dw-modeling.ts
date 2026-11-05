import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-dw-data-modeling-01',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-data-modeling', 'dw-fact-table'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Mô hình hóa dữ liệu gồm những mức nào? Khi thiết kế cho kho phân tích, bạn bắt đầu từ đâu?',
    referenceAnswer: `Có ba mức, tách nhau để mỗi quyết định được đưa ra đúng lúc. **Conceptual** nói về nghiệp vụ có gì, như khách hàng và đơn hàng, dùng để thống nhất ngôn ngữ với người dùng. **Logical** xác định thuộc tính, khóa và quan hệ, chưa phụ thuộc công nghệ. **Physical** chọn kiểu dữ liệu, partition và sort key cho từng nền tảng, vì chi phí phụ thuộc vào engine.

Với kho phân tích, tôi đi theo bốn bước của Kimball. Đầu tiên chọn quy trình nghiệp vụ, ví dụ bán hàng. Sau đó khai báo grain, ví dụ một dòng cho mỗi dòng hàng của đơn. Tiếp theo xác định chiều như ngày, sản phẩm, cửa hàng. Cuối cùng xác định số đo như số lượng và doanh thu.

Tôi bắt đầu từ câu hỏi nghiệp vụ, không bắt đầu từ bảng của hệ nguồn. Chép nguyên schema giao dịch sang kho chỉ đổi nơi lưu, các báo cáo vẫn phải Join rất nhiều và mỗi nhóm vẫn có thể tính một kiểu.`,
    keyPoints: [
      { text: 'Ba mức: Conceptual, Logical, Physical', keywords: ['conceptual', 'logical', 'physical', 'khái niệm', 'vật lý'], weight: 2 },
      { text: 'Bốn bước của Kimball', keywords: ['bốn bước', 'quy trình nghiệp vụ', 'business process'], weight: 2 },
      { text: 'Khai báo grain trước chiều và số đo', keywords: ['grain', 'độ chi tiết'], weight: 2 },
      { text: 'Bắt đầu từ câu hỏi nghiệp vụ', keywords: ['câu hỏi nghiệp vụ', 'nghiệp vụ', 'người dùng'] },
    ],
    followUps: ['Điều gì trong mô hình phải đổi khi chuyển từ Redshift sang BigQuery?', 'Ai nên tham gia khi chốt định nghĩa doanh thu?'],
    commonMistakes: ['Vẽ bảng ngay mà chưa hỏi nghiệp vụ cần trả lời câu hỏi gì.', 'Chỉ nói Star Schema mà không nêu được quy trình thiết kế.'],
  },
  {
    id: 'iv-dw-fact-table-01',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-fact-table', 'dw-data-modeling'],
    interviewTypes: ['de', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao phải chọn grain của Fact Table trước khi chọn chiều và số đo? Chọn sai thì chuyện gì xảy ra?',
    referenceAnswer: `Grain định nghĩa một dòng đại diện cho điều gì, nên nó là tiêu chuẩn để kiểm tra mọi thứ khác. Một chiều chỉ hợp lệ nếu có đúng một giá trị trên một dòng. Một số đo chỉ cộng đúng nếu thuộc đúng mức đó. Chưa có grain thì chưa kiểm tra được hai điều này, nên Kimball gọi grain là hợp đồng ràng buộc của thiết kế.

Ví dụ grain là dòng hàng thì sản phẩm hợp lệ, nhưng phí ship ở mức đơn hàng thì không. Đơn có 3 dòng hàng và phí ship 30.000 đồng, chép vào cả 3 dòng thì \`SUM\` ra 90.000 đồng. Phải phân bổ cho từng dòng, hoặc tách Fact Table khác có grain đơn hàng.

Chọn sai sẽ gặp hai kiểu lỗi. **Quá thô** thì không trả lời được câu hỏi chi tiết, vì mức tổng không tách ngược lại được. **Trộn grain** thì mọi người phải nhớ điều kiện lọc, và số liệu dễ bị tính trùng mà không ai biết. Đổi grain sau khi đã chạy thật gần như là xây lại bảng và sửa mọi báo cáo.

Vì vậy tôi viết grain thành một câu, bắt đầu từ atomic grain, rồi thêm bảng tổng hợp nếu cần tốc độ.`,
    keyPoints: [
      { text: 'Grain định nghĩa một dòng đại diện cho điều gì', keywords: ['một dòng', 'mỗi dòng', 'đại diện'], weight: 2 },
      { text: 'Chiều và số đo phải khớp với grain', keywords: ['khớp', 'nhất quán', 'hợp đồng', 'hợp lệ'], weight: 2 },
      { text: 'Trộn grain gây tính trùng', keywords: ['tính trùng', 'trộn grain', 'double count', 'cộng sai'], weight: 2 },
      { text: 'Atomic grain không tách ngược được khi quá thô', keywords: ['atomic', 'tách ngược', 'chi tiết nhất', 'mức thấp nhất'] },
    ],
    followUps: ['Khi nào nên có thêm bảng tổng hợp?', 'Hai số đo ở hai mức khác nhau thì so sánh chúng thế nào?'],
    commonMistakes: ['Nói grain là tần suất nạp dữ liệu.', 'Bắt đầu bằng cách liệt kê cột rồi mới nghĩ một dòng nghĩa là gì.'],
  },
  {
    id: 'iv-dw-fact-table-02',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-fact-table'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Số đo additive, semi-additive và non-additive khác nhau thế nào? Vì sao cần phân biệt?',
    referenceAnswer: `Sự khác nhau nằm ở việc phép cộng có còn ý nghĩa hay không khi nhóm theo một chiều.

**Additive** cộng được theo mọi chiều, như doanh thu hay số lượng bán. Đây là loại dễ dùng nhất.

**Semi-additive** cộng được theo một số chiều, nhưng không theo chiều khác, thường là thời gian. Số dư tài khoản cuối ngày cộng theo chi nhánh thì đúng, nhưng cộng 30 ngày thì vô nghĩa. Theo thời gian nên lấy giá trị cuối kỳ hoặc trung bình.

**Non-additive** không cộng được theo chiều nào, như tỷ lệ phần trăm hay đơn giá. Cộng tỷ lệ chuyển đổi của hai cửa hàng cho ra con số sai. Cách đúng là lưu tử số và mẫu số, vốn additive, rồi tính lại tỷ lệ sau khi tổng hợp.

Phân biệt để tránh lỗi rất khó phát hiện: báo cáo vẫn chạy và trả về một con số trông hợp lý, nhưng con số đó sai. Công cụ BI cũng cần biết phép tổng hợp mặc định cho từng số đo để không tự cộng sai.`,
    keyPoints: [
      { text: 'Additive cộng được theo mọi chiều', keywords: ['additive', 'mọi chiều', 'doanh thu'], weight: 1 },
      { text: 'Semi-additive không cộng theo thời gian', keywords: ['semi additive', 'số dư', 'tồn kho', 'cuối kỳ'], weight: 2 },
      { text: 'Non-additive như tỷ lệ phải tính lại', keywords: ['non additive', 'tỷ lệ', 'phần trăm', 'đơn giá'], weight: 2 },
      { text: 'Lưu tử số và mẫu số', keywords: ['tử số', 'mẫu số', 'tính lại'] },
    ],
    followUps: ['Tính trung bình số dư trong tháng có những cách nào?', 'Công cụ BI xử lý số đo semi-additive ra sao?'],
    commonMistakes: ['Lấy trung bình của các tỷ lệ thay vì tính lại từ tử số và mẫu số.'],
  },
  {
    id: 'iv-dw-fact-table-03',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-fact-table'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Phân biệt Transaction, Periodic Snapshot và Accumulating Snapshot. Bạn dùng loại nào để đo thời gian xử lý đơn hàng?',
    referenceAnswer: `Ba loại trả lời ba câu hỏi khác nhau về cùng một quy trình.

**Transaction** ghi mỗi sự kiện một dòng và không sửa lại. Đây là loại chi tiết nhất, hợp với câu hỏi "đã xảy ra gì". **Periodic Snapshot** chụp trạng thái theo kỳ, như số dư cuối ngày. Nó đều đặn, nên dễ xem xu hướng, kể cả ngày không có sự kiện nào. **Accumulating Snapshot** dành một dòng cho cả vòng đời của đối tượng, có các cột mốc thời gian và được cập nhật khi đi qua từng mốc.

Để đo thời gian xử lý đơn hàng, tôi chọn Accumulating Snapshot. Với các mốc đặt hàng, thanh toán, xuất kho, giao thành công trên cùng một dòng, tính khoảng cách chỉ là phép trừ hai cột. Nếu chỉ có Transaction, phải tự ghép các sự kiện của từng đơn.

Đánh đổi là bảng này có cập nhật dòng cũ, không thuần chỉ thêm. Trên data lake, cập nhật đó cần MERGE và ghi lại tệp. Tôi vẫn giữ bảng Transaction làm nguồn gốc, vì có thể dựng lại Accumulating Snapshot từ đó nếu định nghĩa mốc thay đổi.`,
    keyPoints: [
      { text: 'Transaction: mỗi sự kiện một dòng, không sửa', keywords: ['transaction', 'mỗi sự kiện', 'không sửa'], weight: 2 },
      { text: 'Periodic Snapshot: trạng thái theo kỳ', keywords: ['periodic', 'theo kỳ', 'cuối ngày', 'ảnh chụp'], weight: 2 },
      { text: 'Accumulating Snapshot: một dòng cho vòng đời, có cập nhật', keywords: ['accumulating', 'vòng đời', 'cột mốc', 'các mốc'], weight: 2 },
      { text: 'Cập nhật dòng cũ tốn kém trên lake', keywords: ['merge', 'cập nhật', 'ghi lại tệp'] },
    ],
    followUps: ['Đơn bị hủy giữa chừng thì lưu thế nào trong Accumulating Snapshot?', 'Một đơn quay lại trạng thái trước thì bảng này còn phù hợp không?'],
    commonMistakes: ['Cho rằng Fact Table không bao giờ có cập nhật.'],
  },
  {
    id: 'iv-dw-dimension-table-01',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-dimension-table', 'dw-scd'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Vì sao bảng chiều dùng Surrogate Key thay vì lấy luôn mã từ hệ nguồn?',
    referenceAnswer: `Vì khóa của kho phải ổn định và đúng với nhu cầu của kho, trong khi mã nguồn phục vụ hệ nguồn và có thể thay đổi ngoài tầm kiểm soát.

Lý do đầu tiên là **lịch sử**. Với SCD Type 2, một khách hàng có nhiều dòng, mỗi dòng một phiên bản, nên mã khách hàng không còn là duy nhất. Surrogate Key cho mỗi phiên bản một khóa riêng, và fact giữ khóa đó nên tự trỏ đúng phiên bản tại thời điểm sự kiện.

Lý do thứ hai là **tích hợp nhiều nguồn**. Ba hệ thống có thể cùng dùng mã 1001 cho ba người khác nhau, hoặc một hệ thống tái sử dụng mã cũ. Khóa do kho sinh ra tách được các trường hợp này.

Lý do thứ ba là **hiệu năng**. Khóa số nhỏ Join và nén tốt hơn chuỗi dài, nhất là trên fact hàng tỷ dòng.

Tôi vẫn giữ mã gốc làm Natural Key để đối chiếu với nguồn. Đánh đổi là pipeline phải tra khóa khi nạp fact, và phải xử lý trường hợp chưa tìm thấy dòng chiều.`,
    keyPoints: [
      { text: 'SCD Type 2 cần nhiều dòng cho một đối tượng', keywords: ['scd', 'type 2', 'phiên bản', 'lịch sử'], weight: 2 },
      { text: 'Tích hợp nhiều nguồn, tránh trùng mã', keywords: ['nhiều nguồn', 'trùng mã', 'tái sử dụng', 'độc lập với nguồn'], weight: 2 },
      { text: 'Khóa số nhỏ Join và nén tốt', keywords: ['số nguyên', 'khóa số', 'join nhanh', 'nén'] },
      { text: 'Vẫn giữ Natural Key', keywords: ['natural key', 'khóa tự nhiên', 'mã gốc'] },
    ],
    followUps: ['Sinh Surrogate Key trên hệ phân tán bằng cách nào?', 'Fact đến trước dòng chiều thì xử lý ra sao?'],
    commonMistakes: ['Bỏ luôn Natural Key khỏi bảng chiều.', 'Chỉ nói Surrogate Key nhanh hơn mà không nêu được lý do về lịch sử.'],
  },
  {
    id: 'iv-dw-dimension-table-02',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-dimension-table', 'dw-data-warehouse'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Conformed Dimension là gì? Không có nó thì tổ chức gặp vấn đề gì và bạn triển khai thế nào khi nhiều nhóm cùng làm?',
    referenceAnswer: `Conformed Dimension là chiều có cùng khóa, cùng thuộc tính và cùng ý nghĩa khi dùng ở nhiều Fact Table. Nhờ vậy có thể tổng hợp từng fact theo cùng một thuộc tính rồi ghép kết quả, thay vì Join trực tiếp hai fact.

Không có nó, doanh số có 12 danh mục còn kho vận có 30 danh mục, nên câu hỏi tỷ lệ trả hàng theo danh mục không có câu trả lời. Mỗi nhóm viết bảng ánh xạ riêng, và các con số dần lệch nhau. Đây chính là lý do các Data Mart độc lập trở thành silo.

Về triển khai, tôi giao mỗi chiều cho một nhóm sở hữu, thường là nhóm gần nguồn dữ liệu nhất. Chiều được công bố như một sản phẩm có schema và định nghĩa rõ ràng, các nhóm khác chỉ đọc. Kimball dùng ma trận bus, hàng là quy trình nghiệp vụ, cột là chiều, để thấy trước chiều nào cần dùng chung trước khi mỗi nhóm tự xây.

Đánh đổi là phải phối hợp, thống nhất định nghĩa mất thời gian. Tôi chỉ ép thống nhất ở các chiều dùng xuyên nhóm như ngày, khách hàng, sản phẩm. Một nhóm cần thêm thuộc tính riêng có thể tạo tập con hoặc mở rộng, miễn là giữ đúng khóa và giá trị chung.`,
    keyPoints: [
      { text: 'Cùng khóa, cùng ý nghĩa ở nhiều fact', keywords: ['cùng khóa', 'cùng ý nghĩa', 'dùng chung', 'conformed'], weight: 2 },
      { text: 'Tổng hợp từng fact rồi ghép kết quả', keywords: ['drill across', 'ghép kết quả', 'so sánh chéo'], weight: 2 },
      { text: 'Không có thì thành silo, số liệu lệch', keywords: ['silo', 'lệch', 'khác nhau'] },
      { text: 'Có nhóm sở hữu, ma trận bus', keywords: ['bus', 'ma trận', 'sở hữu', 'owner'], weight: 2 },
    ],
    followUps: ['Vì sao không nên Join trực tiếp hai Fact Table?', 'Một nhóm cần phân loại riêng thì xử lý thế nào mà vẫn giữ chiều chung?'],
    commonMistakes: ['Nghĩ chỉ cần cùng tên cột là đã dùng chung được.'],
  },
  {
    id: 'iv-dw-star-schema-01',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-star-schema', 'db-denormalization', 'db-normalization'],
    interviewTypes: ['de', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Chuẩn hóa là nguyên tắc cơ bản của thiết kế cơ sở dữ liệu. Vì sao denormalize lại hợp lý trong kho phân tích?',
    referenceAnswer: `Chuẩn hóa không phải mục tiêu, mà là cách tránh dị thường khi cập nhật: mỗi sự thật một nơi, nên hàng nghìn giao dịch đồng thời không làm dữ liệu mâu thuẫn. Muốn biết có nên chuẩn hóa không, phải xem điều kiện đó còn đúng không.

Ở kho phân tích, điều kiện đã khác ở bốn điểm. Thứ nhất, dữ liệu do **một pipeline** nạp, rủi ro dị thường được kiểm soát tại một chỗ. Thứ hai, **đọc nhiều hơn ghi rất nhiều**, nên tiết kiệm Join cho mỗi truy vấn đáng giá hơn tiết kiệm một lần cập nhật. Thứ ba, **dư thừa rất rẻ trong kho cột**: giá trị lặp được nén bằng dictionary và run-length, và cột không dùng thì không bị đọc. Thứ tư, **Join phân tán tốn kém**, có thể phải shuffle qua mạng.

Đánh đổi là đổi một thuộc tính phải sửa nhiều dòng, và kho thường không ép khóa ngoại, nên pipeline phải tự kiểm tra nhất quán. Vì vậy tôi không gộp hết thành một bảng. Star Schema chỉ phi chuẩn hóa trong từng chiều, còn fact và chiều vẫn tách riêng, nên đổi tên danh mục chỉ sửa bảng chiều nhỏ thay vì ghi lại hàng tỷ dòng fact.`,
    keyPoints: [
      { text: 'Chuẩn hóa để tránh dị thường khi cập nhật', keywords: ['dị thường', 'anomaly', 'mỗi sự thật'], weight: 2 },
      { text: 'Ghi tập trung, đọc nhiều hơn ghi', keywords: ['pipeline', 'đọc nhiều', 'ít ghi', 'read heavy'], weight: 2 },
      { text: 'Kho cột làm dư thừa rẻ', keywords: ['kho cột', 'columnar', 'nén', 'dictionary'], weight: 2 },
      { text: 'Join phân tán tốn kém', keywords: ['shuffle', 'join', 'qua mạng'] },
      { text: 'Nêu đánh đổi về cập nhật và nhất quán', keywords: ['đánh đổi', 'sửa nhiều dòng', 'nhất quán'] },
    ],
    followUps: ['Khi nào bạn vẫn giữ một phần chuẩn hóa trong kho?', 'Làm sao kiểm tra toàn vẹn khi kho không ép khóa ngoại?'],
    commonMistakes: ['Chỉ trả lời "để chạy nhanh hơn" mà không nói vì sao rủi ro của dư thừa đã giảm.', 'Hiểu phi chuẩn hóa là gộp cả fact và chiều thành một bảng.'],
  },
  {
    id: 'iv-dw-star-schema-02',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-star-schema', 'dw-snowflake-schema'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Kho cột đã rất nhanh. Vì sao vẫn cần Star Schema thay vì một bảng phẳng khổng lồ?',
    referenceAnswer: `Bảng phẳng có lợi thật: không Join, và kho cột chỉ đọc đúng cột cần. Với một nhu cầu hẹp và thuộc tính ổn định, tôi vẫn dùng nó. Nhưng tốc độ đọc không phải là tiêu chí duy nhất, nên cần xét các chi phí khác.

**Chi phí thay đổi:** đổi tên danh mục trên bảng phẳng là ghi lại mọi dòng có danh mục đó, có thể hàng tỷ dòng trên hàng nghìn tệp. Với Star Schema, chỉ sửa bảng chiều nhỏ.

**Lịch sử:** muốn xem số liệu theo giá trị hiện tại lẫn giá trị tại thời điểm sự kiện, mô hình chiều làm được nhờ SCD. Bảng phẳng đóng băng giá trị lúc ghi, muốn đổi góc nhìn phải dựng lại.

**Tính nhất quán giữa các quy trình:** chiều dùng chung cho phép so sánh doanh thu với trả hàng theo cùng định nghĩa. Mỗi bảng phẳng lại tự chép và tự định nghĩa thuộc tính.

**Rủi ro grain:** bảng phẳng gộp từ nhiều quy trình dễ trộn grain.

Cách tôi hay làm là giữ Star Schema làm nguồn chuẩn, rồi tạo bảng phẳng từ đó cho dashboard cần độ trễ thấp. Bảng này dựng lại được, nên chịu thay đổi tốt hơn.`,
    keyPoints: [
      { text: 'Đổi thuộc tính trên bảng phẳng phải ghi lại rất nhiều', keywords: ['ghi lại', 'cập nhật', 'hàng tỷ dòng', 'chi phí thay đổi'], weight: 2 },
      { text: 'Lịch sử và SCD', keywords: ['scd', 'lịch sử', 'giá trị hiện tại'], weight: 2 },
      { text: 'Chiều dùng chung giữa các quy trình', keywords: ['dùng chung', 'conformed', 'nhất quán'], weight: 2 },
      { text: 'Bảng phẳng hợp nhu cầu hẹp, dựng từ Star Schema', keywords: ['dựng từ', 'nhu cầu hẹp', 'dashboard', 'dẫn xuất'] },
    ],
    followUps: ['Bạn đo gì để biết nên thêm một bảng phẳng?', 'Nested field trong BigQuery thay đổi quyết định này thế nào?'],
    commonMistakes: ['Tranh luận chỉ dựa trên tốc độ truy vấn.', 'Khẳng định bảng phẳng luôn sai hoặc luôn đúng.'],
  },
  {
    id: 'iv-dw-star-schema-03',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-star-schema', 'dw-fact-table', 'dw-dimension-table'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Thiết kế Star Schema cho ứng dụng gọi xe để phân tích doanh thu, tỷ lệ hủy chuyến và thu nhập tài xế.',
    referenceAnswer: `Tôi bắt đầu bằng cách làm rõ câu hỏi và quy trình, rồi mới vẽ bảng. Có hai quy trình chính, nên có thể cần hai fact.

**fact_trip**, grain là một chuyến được yêu cầu, kể cả chuyến bị hủy, vì tỷ lệ hủy cần cả hai trường hợp. Số đo gồm giá cước, quãng đường, thời gian chờ, cờ hoàn thành. Tôi cũng lưu các mốc thời gian yêu cầu, nhận, đón, trả.

**fact_driver_payout**, grain là một khoản thanh toán cho tài xế, vì thưởng có thể không gắn với chuyến nào. Trộn vào fact_trip sẽ sai grain.

**Các chiều:** \`dim_date\`, \`dim_driver\`, \`dim_rider\`, \`dim_vehicle\`, \`dim_location\` dùng hai vai trò là điểm đón và điểm trả. Hạng tài xế cần lịch sử nên dùng SCD Type 2, còn số điện thoại dùng Type 1. \`dim_driver\` phải dùng chung cho cả hai fact để so sánh được.

**Vật lý:** phân vùng fact theo ngày yêu cầu, sắp xếp hoặc cluster theo vùng.

**Các điểm cần nói rõ:** tỷ lệ hủy là số đo non-additive, nên lưu tử số và mẫu số. Giá cước đổi do hoàn tiền thì ghi thêm dòng điều chỉnh hoặc xử lý riêng, tùy yêu cầu đối soát. Chuyến đến trễ phải tra đúng phiên bản chiều theo thời gian sự kiện.`,
    keyPoints: [
      { text: 'Khai báo grain trước, gồm cả chuyến hủy', keywords: ['grain', 'một chuyến', 'chuyến hủy'], weight: 3 },
      { text: 'Tách fact theo quy trình khác grain', keywords: ['hai fact', 'fact riêng', 'tách', 'thanh toán'], weight: 2 },
      { text: 'Chiều dùng chung và vai trò điểm đón, điểm trả', keywords: ['dùng chung', 'conformed', 'vai trò', 'role playing', 'điểm đón'] },
      { text: 'Chọn SCD theo thuộc tính', keywords: ['scd', 'type 2', 'type 1'], weight: 2 },
      { text: 'Tỷ lệ là non-additive', keywords: ['non additive', 'tử số', 'mẫu số'] },
    ],
    followUps: ['Hoàn tiền sau 30 ngày được phản ánh thế nào?', 'Phân tích theo khu vực địa lý thay đổi ranh giới thì sao?'],
    commonMistakes: ['Không hỏi rõ yêu cầu, liệt kê bảng ngay.', 'Chỉ lưu chuyến hoàn thành nên không tính được tỷ lệ hủy.'],
  },
  {
    id: 'iv-dw-snowflake-schema-01',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-snowflake-schema', 'dw-star-schema'],
    interviewTypes: ['de', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Star Schema hay Snowflake Schema trên kho dạng cột hiện đại? Khi nào bạn chọn Snowflake Schema?',
    referenceAnswer: `Mặc định tôi chọn Star Schema, và lý do nằm ở phép tính chi phí.

Snowflake Schema chuẩn hóa chiều thành nhiều bảng theo phân cấp để giảm lặp. Lợi ích này từng lớn khi đĩa đắt và kho lưu theo hàng. Trên kho cột, dung lượng chủ yếu nằm ở fact, mà fact giống hệt nhau ở cả hai mô hình. Giá trị lặp trong chiều lại được nén rất tốt. Ví dụ \`dim_product\` 200.000 dòng, tách cột thương hiệu 40 byte thành khóa 4 byte chỉ tiết kiệm khoảng 7 MB, so với fact 5 TB, chưa kể nén.

Cái phải trả là mỗi cấp thêm một Join. Về tốc độ, chiều nhỏ nên Join không quá đắt, nhưng người dùng khó hiểu hơn và dễ viết sai hơn. Kimball khuyên tránh cũng vì lý do đó.

Tôi chọn tách bảng khi có lý do về quản lý: phân cấp lớn như địa lý được nhiều chiều dùng lại, hoặc do một nhóm khác sở hữu và cập nhật riêng. Khi đó có lớp ngữ nghĩa che Join khỏi người dùng thì càng ổn. Kể cả vậy, tôi thường tách có chọn lọc, không chuẩn hóa toàn bộ, và có thể tạo view phẳng cho người dùng.`,
    keyPoints: [
      { text: 'Mặc định Star trên kho cột', keywords: ['star', 'mặc định', 'ưu tiên'], weight: 1 },
      { text: 'Dung lượng chủ yếu ở fact, tiết kiệm rất ít', keywords: ['ở fact', 'tiết kiệm', 'nén', 'dung lượng'], weight: 3 },
      { text: 'Snowflake thêm Join và khó hiểu', keywords: ['thêm join', 'nhiều join', 'khó hiểu', 'khó dùng'], weight: 2 },
      { text: 'Tách khi có lý do quản lý, phân cấp dùng chung', keywords: ['phân cấp', 'dùng chung', 'nhóm khác', 'quản lý'], weight: 2 },
    ],
    followUps: ['Lớp ngữ nghĩa giúp gì trong trường hợp này?', 'Trên kho lưu theo hàng, câu trả lời có khác không?'],
    commonMistakes: ['Nói Snowflake Schema tiết kiệm nhiều dung lượng mà không ước lượng.', 'Nhầm mô hình với sản phẩm Snowflake.'],
  },
  {
    id: 'iv-dw-scd-01',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-scd'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Trình bày các loại SCD Type 0, 1, 2, 3, 4, 6 và đánh đổi của từng loại.',
    referenceAnswer: `Tất cả đều trả lời một câu hỏi: số liệu cũ nên xem theo giá trị lúc đó hay giá trị hiện tại.

**Type 0** giữ nguyên giá trị gốc, như ngày sinh. Không tốn gì, nhưng không phản ánh thay đổi.

**Type 1** ghi đè. Rẻ và đơn giản, hợp với sửa lỗi. Đổi lại mất lịch sử, báo cáo cũ đổi theo, và bảng tổng hợp có thể phải tính lại.

**Type 2** thêm dòng với Surrogate Key mới và \`valid_from\`, \`valid_to\`. Lịch sử đầy đủ, fact tự trỏ đúng phiên bản. Đổi lại bảng lớn và pipeline phức tạp.

**Type 3** thêm cột như \`previous_region\`. Không tăng số dòng, hợp với so sánh trước và sau một lần tổ chức lại. Đổi lại chỉ giữ vài giá trị và phải đổi schema.

**Type 4** theo Kimball là mini-dimension, tách nhóm thuộc tính đổi nhanh ra bảng riêng, fact giữ cả hai khóa. Bảng chính không phình, nhưng fact thêm một khóa. Nhiều tài liệu dùng tên này cho bảng lịch sử riêng, nên tôi sẽ hỏi lại cho rõ.

**Type 6** kết hợp 1, 2, 3: dòng Type 2 có thêm cột giá trị hiện tại, ghi đè trên mọi dòng cùng durable key. Xem được cả hai góc, đổi lại mỗi thay đổi phải ghi nhiều dòng.

Tôi chọn theo từng thuộc tính, không chọn cho cả bảng.`,
    keyPoints: [
      { text: 'Type 1 ghi đè, mất lịch sử', keywords: ['type 1', 'ghi đè', 'overwrite'], weight: 2 },
      { text: 'Type 2 thêm dòng, giữ lịch sử, bảng lớn', keywords: ['type 2', 'thêm dòng', 'phiên bản'], weight: 2 },
      { text: 'Type 3 thêm cột, lịch sử giới hạn', keywords: ['type 3', 'thêm cột', 'previous'] },
      { text: 'Type 4 là mini-dimension hoặc bảng lịch sử', keywords: ['type 4', 'mini dimension', 'bảng lịch sử'] },
      { text: 'Type 6 kết hợp cột hiện tại và phiên bản', keywords: ['type 6', 'giá trị hiện tại', 'durable key'] },
      { text: 'Chọn theo từng thuộc tính', keywords: ['từng thuộc tính', 'theo thuộc tính', 'mỗi cột'], weight: 2 },
    ],
    followUps: ['Type 5 và Type 7 khác gì Type 6?', 'Với thuộc tính giá sản phẩm, bạn lưu ở chiều hay ở fact?'],
    commonMistakes: ['Chỉ nhớ Type 1, 2, 3.', 'Khẳng định Type 4 chỉ có một nghĩa duy nhất.'],
  },
  {
    id: 'iv-dw-scd-02',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-scd', 'dw-dimension-table'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao SCD Type 2 làm bảng lớn và phức tạp khi Join? Bạn kiểm soát điều đó thế nào?',
    referenceAnswer: `**Bảng lớn** vì số dòng bằng tổng số phiên bản, không phải số đối tượng. Một cột đổi thì cả dòng bị chép lại, gồm mọi cột không đổi. 10 triệu khách với một thuộc tính đổi hằng ngày tạo thêm 3,65 tỷ dòng mỗi năm.

**Join phức tạp** ở một số chỗ cụ thể. Nếu fact đã giữ Surrogate Key, Join rất đơn giản và tự đúng theo thời điểm. Phần khó nằm ở chỗ khác. Khi nạp fact, phải tìm phiên bản theo thời gian sự kiện, đó là Join theo khoảng, thường chậm hơn Join bằng và khó tối ưu trên hệ phân tán. Join theo mã gốc sẽ nhân dòng và thổi phồng số liệu. Xem giá trị hiện tại lại phải đi qua durable key. Dữ liệu đến trễ có thể buộc gán lại khóa cho fact đã nạp. Chiều cũng có thể lớn tới mức không Broadcast được.

**Cách kiểm soát:** chỉ bật Type 2 cho thuộc tính thực sự cần lịch sử. Tách nhóm đổi nhanh sang mini-dimension, hoặc chuyển sang fact snapshot nếu đó thực ra là số đo. Dùng hash để chỉ tạo phiên bản khi cột được theo dõi thực sự đổi. Dùng khoảng nửa mở để không chồng lấn, và view \`is_current\` cho người dùng cần giá trị hiện tại. Giữ pipeline lũy đẳng để chạy lại không sinh phiên bản trùng.`,
    keyPoints: [
      { text: 'Số dòng bằng số phiên bản, cả dòng bị chép', keywords: ['số phiên bản', 'mỗi phiên bản', 'chép lại', 'nhân bản'], weight: 2 },
      { text: 'Nạp fact cần Join theo khoảng thời gian', keywords: ['theo khoảng', 'range join', 'thời gian sự kiện', 'valid from'], weight: 2 },
      { text: 'Join theo mã gốc nhân dòng', keywords: ['mã gốc', 'natural key', 'nhân dòng', 'thổi phồng', 'fan out'], weight: 2 },
      { text: 'Dữ liệu đến trễ', keywords: ['đến trễ', 'late arriving', 'gán lại khóa'] },
      { text: 'Giới hạn Type 2 theo thuộc tính, mini-dimension', keywords: ['mini dimension', 'chỉ bật', 'thuộc tính cần', 'hash'], weight: 2 },
    ],
    followUps: ['Join theo khoảng trên Spark được thực hiện thế nào?', 'Trên Delta Lake, MERGE cho Type 2 tốn kém ở đâu?'],
    commonMistakes: ['Nói mọi truy vấn đều phải Join theo khoảng thời gian.', 'Chỉ nói bảng lớn mà không ước lượng được theo tần suất thay đổi.'],
  },
  {
    id: 'iv-dw-scd-03',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-scd', 'etl-cdc', 'etl-idempotency'],
    interviewTypes: ['de', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Thiết kế pipeline duy trì dim_customer theo SCD Type 2 từ luồng CDC, có dữ liệu đến trễ và có thể chạy lại.',
    referenceAnswer: `Tôi tách thành bốn phần rõ ràng.

**Nạp thô:** ghi nguyên sự kiện CDC vào lớp Bronze, kèm thứ tự từ log của nguồn như LSN. Thứ tự này mới đáng tin, không dùng thời gian xử lý.

**Tính phiên bản:** trong mỗi lô, giữ các thay đổi theo thứ tự của từng khách. Nếu chỉ lấy bản mới nhất thì mất các phiên bản trung gian. Dùng hash của các cột được theo dõi để bỏ qua thay đổi không liên quan. Nhiều thay đổi trong cùng lô phải được nối thành nhiều phiên bản.

**Áp vào bảng:** dùng MERGE trong một giao dịch: đóng dòng hiện tại, thêm dòng mới, trên Delta Lake hoặc Iceberg. Surrogate Key nên suy ra từ khóa gốc và \`valid_from\`, để chạy lại tạo ra đúng khóa cũ. Đây là điểm mấu chốt của tính lũy đẳng.

**Đến trễ:** sự kiện cũ hơn dòng hiện tại phải được chèn vào giữa: chia lại khoảng của phiên bản đang bao trùm. Sau đó, fact trong khoảng bị ảnh hưởng phải được gán lại khóa. Vì tốn kém, tôi đặt ngưỡng: trễ ít thì sửa tự động, trễ lâu thì đưa vào quy trình sửa riêng.

**Kiểm tra:** mỗi khách có đúng một dòng hiện tại, các khoảng không chồng lấn và không hở. Xóa ở nguồn thì đóng dòng và đánh dấu, trừ khi có yêu cầu xóa thật theo pháp lý.`,
    keyPoints: [
      { text: 'Giữ thứ tự theo log của nguồn', keywords: ['lsn', 'thứ tự', 'log nguồn', 'bronze'], weight: 2 },
      { text: 'Nhiều thay đổi trong lô tạo nhiều phiên bản', keywords: ['nhiều thay đổi', 'trung gian', 'trong cùng lô'], weight: 2 },
      { text: 'MERGE có giao dịch, khóa tất định để lũy đẳng', keywords: ['merge', 'lũy đẳng', 'idempotent', 'tất định'], weight: 3 },
      { text: 'Xử lý đến trễ: chia lại khoảng, gán lại khóa', keywords: ['đến trễ', 'chia lại', 'gán lại', 'late arriving'], weight: 2 },
      { text: 'Kiểm tra một dòng hiện tại, khoảng không chồng lấn', keywords: ['một dòng hiện tại', 'chồng lấn', 'không hở', 'kiểm tra'] },
    ],
    followUps: ['Yêu cầu xóa theo GDPR thì làm gì với các phiên bản cũ?', 'Sinh Surrogate Key tăng dần hay hash, đánh đổi là gì?'],
    commonMistakes: ['Chỉ lấy bản ghi mới nhất của mỗi khách trong lô.', 'Sinh khóa ngẫu nhiên khiến chạy lại tạo ra dòng trùng.'],
  },
  {
    id: 'iv-dw-schema-evolution-01',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-schema-evolution', 'kafka-consumer', 'kafka-producer'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Backward và forward compatibility khác nhau thế nào? Điều đó quyết định thứ tự triển khai ra sao?',
    referenceAnswer: `Trong hệ thống dài hạn, dữ liệu sống lâu hơn chương trình, và producer với consumer không thể đổi cùng một lúc. Nên luôn có giai đoạn phiên bản mới gặp phiên bản cũ. Tương thích mô tả chiều nào an toàn trong giai đoạn đó.

**Backward:** schema mới đọc được dữ liệu cũ. Vì consumer mới hiểu cả hai, nên **nâng cấp consumer trước**. Đây là chế độ mặc định của Confluent Schema Registry, vì nó cho phép đọc lại từ đầu topic.

**Forward:** schema cũ đọc được dữ liệu mới. Vì consumer cũ vẫn đọc được, nên **nâng cấp producer trước**.

**Full:** có cả hai, nên triển khai độc lập.

Với Avro, thêm trường có giá trị mặc định là an toàn cả hai chiều: dữ liệu cũ thiếu trường thì lấy mặc định, consumer cũ gặp trường lạ thì bỏ qua. Thêm trường không có mặc định thì mất backward. Đổi \`int\` thành \`long\` thì giữ backward, nhưng mất forward.

Cần phân biệt thêm chế độ transitive. Chế độ thường chỉ so với phiên bản liền trước. Nếu cần đọc lại toàn bộ lịch sử, phải dùng transitive để so với mọi phiên bản.`,
    keyPoints: [
      { text: 'Backward: schema mới đọc dữ liệu cũ', keywords: ['backward', 'schema mới đọc', 'đọc dữ liệu cũ'], weight: 2 },
      { text: 'Forward: schema cũ đọc dữ liệu mới', keywords: ['forward', 'schema cũ đọc', 'đọc dữ liệu mới'], weight: 2 },
      { text: 'Thứ tự: backward nâng consumer trước, forward nâng producer trước', keywords: ['consumer trước', 'producer trước', 'thứ tự'], weight: 2 },
      { text: 'Thêm trường có giá trị mặc định', keywords: ['giá trị mặc định', 'default'] },
      { text: 'Transitive so với mọi phiên bản', keywords: ['transitive', 'mọi phiên bản'] },
    ],
    followUps: ['Vì sao đổi tên trường lại khó trong Avro?', 'Vì sao đổi kiểu từ long xuống int không an toàn?'],
    commonMistakes: ['Hiểu ngược backward và forward.', 'Nói có Schema Registry thì thứ tự triển khai không còn quan trọng.'],
  },
  {
    id: 'iv-dw-schema-evolution-02',
    topicId: 'modeling',
    category: 'dw-modeling',
    conceptIds: ['dw-schema-evolution', 'dw-data-lakehouse'],
    interviewTypes: ['de', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'So sánh cách Avro, Parquet, Delta Lake và Iceberg xử lý thay đổi schema. Thiết kế lakehouse của bạn sẽ dùng chúng thế nào?',
    referenceAnswer: `Bốn công nghệ này giải quyết ở các tầng khác nhau.

**Avro** là định dạng có quy tắc phân giải rõ ràng: bên đọc dùng cả writer schema và reader schema, khớp trường theo tên, có giá trị mặc định và alias. Rất hợp với luồng sự kiện qua Kafka.

**Parquet** lưu schema ở footer từng tệp, còn đọc nhiều phiên bản ra sao là do engine. Spark mặc định không gộp schema vì tốn kém. Parquet cho phép lưu \`field_id\`, nhưng tầng bảng mới là nơi dùng nó.

**Delta Lake** thêm kiểm tra ở tầng bảng: mặc định từ chối cột lạ, \`mergeSchema\` để thêm cột, \`overwriteSchema\` để thay schema. Đổi tên và xóa cột cần bật column mapping, vì mặc định Parquet được đọc theo tên. Type widening là tính năng tùy chọn, không phải ghi lại tệp.

**Iceberg** gắn ID cho mọi cột và đọc tệp theo ID, nên thêm, xóa, đổi tên, đổi thứ tự đều chỉ sửa metadata. Mở rộng kiểu gồm \`int\` lên \`long\`, \`float\` lên \`double\`, tăng precision của decimal.

Thiết kế của tôi: Avro kèm Schema Registry ở luồng vào, chế độ BACKWARD hoặc FULL. Bronze giữ nguyên dữ liệu, cho phép cột mới. Từ Silver trở lên dùng định dạng bảng và kiểm soát schema chặt, thay đổi đi qua review. Gold chỉ nhận thay đổi đã thống nhất với người dùng.`,
    keyPoints: [
      { text: 'Avro: writer và reader schema, khớp theo tên, mặc định', keywords: ['writer schema', 'reader schema', 'giá trị mặc định', 'alias'], weight: 2 },
      { text: 'Parquet: schema ở footer, engine quyết định', keywords: ['footer', 'engine', 'mergeschema', 'gộp schema'], weight: 2 },
      { text: 'Delta: kiểm tra schema, mergeSchema, column mapping', keywords: ['column mapping', 'mergeschema', 'schema enforcement', 'từ chối'], weight: 2 },
      { text: 'Iceberg: theo ID cột, chỉ sửa metadata', keywords: ['field id', 'id cột', 'column id', 'metadata'], weight: 2 },
      { text: 'Kiểm soát chặt dần theo tầng', keywords: ['bronze', 'silver', 'gold', 'từng tầng', 'schema registry'] },
    ],
    followUps: ['Mở rộng từ int sang decimal có làm được trên Iceberg không?', 'Tắt column mapping sau khi đã bật có được không?'],
    commonMistakes: ['Nói Parquet tự có quy tắc tương thích như Avro.', 'Coi tự động gộp schema là cách làm an toàn ở mọi tầng.'],
  },
])
