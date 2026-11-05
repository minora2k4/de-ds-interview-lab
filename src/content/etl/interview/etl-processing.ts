import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-etl-elt-01',
    topicId: 'etl',
    category: 'etl-processing',
    conceptIds: ['etl-etl-elt'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'ETL và ELT khác nhau thế nào? Vì sao ELT trở nên phổ biến?',
    referenceAnswer: `Cả hai đều có ba bước trích xuất, biến đổi và nạp. Khác biệt là biến đổi chạy ở đâu. ETL biến đổi trên một engine riêng rồi mới nạp kết quả vào đích. ELT nạp dữ liệu thô vào đích trước, rồi dùng chính tính toán của đích để biến đổi.

ETL có lý do lịch sử: kho dữ liệu ngày trước đắt, lưu trữ gắn liền tính toán, nên phải lọc bớt trước khi vào. Kho cloud như BigQuery hay Snowflake tách lưu trữ khỏi tính toán. Lưu thô rẻ hơn và tính toán co giãn được, nên không còn lý do phải biến đổi ở máy riêng.

Lợi ích lớn nhất của ELT là giữ dữ liệu thô. Khi logic đổi, tôi chỉ cần chạy lại biến đổi mà không phải lấy lại từ nguồn. Ví dụ đổi công thức doanh thu thì tính lại được cả 2 năm dù nguồn chỉ giữ 90 ngày. Nhưng ETL vẫn cần khi dữ liệu nhạy cảm không được phép vào kho dạng rõ.`,
    keyPoints: [
      { text: 'Khác nhau ở vị trí chạy biến đổi', keywords: ['trước khi nạp', 'trong đích', 'trong kho', 'engine riêng'], weight: 2 },
      { text: 'Kho cloud tách lưu trữ và tính toán', keywords: ['tách lưu trữ', 'co giãn', 'cloud', 'lưu trữ rẻ'], weight: 2 },
      { text: 'Giữ dữ liệu thô để tính lại', keywords: ['dữ liệu thô', 'tính lại', 'chạy lại', 'raw'] },
      { text: 'ETL vẫn cần cho dữ liệu nhạy cảm', keywords: ['nhạy cảm', 'che', 'tuân thủ', 'pii'] },
    ],
    followUps: ['dbt nằm ở bước nào trong ELT?', 'Bạn xử lý dữ liệu cá nhân trong vùng thô như thế nào?'],
    commonMistakes: ['Nói ELT luôn tốt hơn ETL.', 'Phân biệt theo công cụ, ví dụ dùng Spark nghĩa là ETL.'],
  },
  {
    id: 'iv-etl-elt-02',
    topicId: 'etl',
    category: 'etl-processing',
    conceptIds: ['etl-etl-elt', 'etl-governance'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Công ty đang có ETL truyền thống chạy ổn định. Bạn sẽ phân tích thế nào trước khi quyết định chuyển sang ELT?',
    referenceAnswer: `Tôi không bắt đầu bằng xu hướng mà bằng vấn đề đang gặp. Nếu ETL đang đáp ứng được và logic ít đổi, chi phí chuyển đổi có thể không đáng.

Trước hết tôi đo các điểm đau: thời gian từ yêu cầu đến số liệu, tần suất phải trích xuất lại vì đổi logic, và chi phí của máy chủ ETL. ELT có giá trị rõ khi logic đổi nhiều và nguồn không giữ lâu.

Sau đó tôi kiểm tra các ràng buộc. Về tuân thủ, dữ liệu nhạy cảm có được vào kho dạng rõ không. Nếu không, cần thêm bước che trước khi nạp. Về đích, có đủ tính toán co giãn không, vì biến đổi nặng trên kho nhỏ sẽ ảnh hưởng người dùng báo cáo. Về chi phí, tính toán của kho có thể tăng, nên cần giới hạn ngân sách và quyền tạo mô hình. Về kỹ năng, đội có viết được SQL có kiểm thử và quản lý phiên bản không.

Tôi chuyển từng miền dữ liệu và chạy song song để đối chiếu số liệu, không chuyển một lần. Phần biến đổi không viết được bằng SQL có thể giữ nguyên. Kết quả thường là mô hình trộn, không phải bỏ hẳn ETL.`,
    keyPoints: [
      { text: 'Xuất phát từ vấn đề đo được, không theo xu hướng', keywords: ['điểm đau', 'đo', 'vấn đề', 'xu hướng'], weight: 2 },
      { text: 'Kiểm tra ràng buộc tuân thủ về dữ liệu nhạy cảm', keywords: ['tuân thủ', 'nhạy cảm', 'che', 'pii'], weight: 2 },
      { text: 'Tính chi phí tính toán của kho', keywords: ['chi phí', 'ngân sách', 'tính toán của kho'] },
      { text: 'Chuyển dần và chạy song song đối chiếu', keywords: ['song song', 'đối chiếu', 'từng miền', 'chuyển dần'] },
    ],
    followUps: ['Làm sao kiểm soát chi phí khi ai cũng tạo được mô hình?', 'Đối chiếu số liệu giữa hai hệ thống như thế nào?'],
    commonMistakes: ['Chuyển toàn bộ một lần.', 'Không tính đến dữ liệu nhạy cảm trong vùng thô.'],
  },
  {
    id: 'iv-etl-elt-03',
    topicId: 'etl',
    category: 'etl-processing',
    conceptIds: ['etl-etl-elt', 'etl-batch'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao nhiều đội giữ một vùng dữ liệu thô bất biến, dù lưu trữ tốn tiền? Vùng này cần có những tính chất gì?',
    referenceAnswer: `Bản chất là tách việc bắt dữ liệu khỏi việc diễn giải dữ liệu. Logic luôn có lỗi và luôn thay đổi, còn nguồn thường chỉ giữ lịch sử có hạn hoặc ghi đè trạng thái cũ. Nếu không giữ bản thô, một lỗi biến đổi có thể làm mất thông tin vĩnh viễn. Chi phí lưu trữ thường rất nhỏ so với chi phí không thể tính lại.

Vùng này cần vài tính chất. Bất biến: chỉ ghi thêm, không sửa, để kết quả chạy lại là tái lập được. Gần nguyên bản: không áp dụng logic nghiệp vụ, vì logic đó có thể sai. Có siêu dữ liệu: thời điểm nạp, nguồn, tên tệp, để truy vết và chạy lại đúng phạm vi. Được phân vùng theo thời điểm nạp để đọc tăng dần. Có kiểm soát truy cập chặt, vì đây là nơi chứa dữ liệu nhạy cảm chưa che.

Cần lưu ý xung đột với quy định xóa dữ liệu cá nhân. Bản thô bất biến vẫn phải có cách xóa theo yêu cầu, ví dụ tách dữ liệu định danh ra chỗ riêng. Ngoài ra nên có chính sách lưu trữ theo tầng để giảm chi phí cho dữ liệu cũ.`,
    keyPoints: [
      { text: 'Tách việc bắt dữ liệu khỏi diễn giải, để tính lại được', keywords: ['tính lại', 'chạy lại', 'phát lại', 'diễn giải'], weight: 2 },
      { text: 'Bất biến, chỉ ghi thêm', keywords: ['bất biến', 'chỉ ghi thêm', 'immutable', 'append'], weight: 2 },
      { text: 'Có siêu dữ liệu nạp và phân vùng', keywords: ['siêu dữ liệu', 'metadata', 'thời điểm nạp', 'phân vùng'] },
      { text: 'Xung đột với yêu cầu xóa dữ liệu cá nhân', keywords: ['xóa', 'gdpr', 'dữ liệu cá nhân', 'kiểm soát truy cập'] },
    ],
    followUps: ['Bạn xóa một khách hàng khỏi vùng thô bất biến như thế nào?'],
    commonMistakes: ['Áp dụng logic nghiệp vụ ngay trong vùng thô.', 'Cho rằng bất biến nghĩa là không bao giờ được xóa.'],
  },
  {
    id: 'iv-etl-batch-01',
    topicId: 'etl',
    category: 'etl-processing',
    conceptIds: ['etl-batch', 'etl-stream'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Batch và stream khác nhau thế nào? Làm sao bạn chọn giữa hai cách cho một bài toán mới?',
    referenceAnswer: `Khác biệt gốc là đầu vào. Batch xử lý tập có giới hạn, biết rõ đầu cuối, nên tính được kết quả đầy đủ rồi kết thúc. Stream xử lý luồng không có điểm kết thúc, nên phải cập nhật dần và ước lượng lúc nào đã đủ dữ liệu.

Từ đó sinh ra các đánh đổi. Batch có thông lượng cao, chi phí mỗi dòng thấp, dễ kiểm thử và dễ chạy lại, nhưng độ trễ ít nhất bằng chu kỳ chạy. Stream có độ trễ thấp nhưng phải quản lý state, watermark và vận hành liên tục.

Tôi chọn bắt đầu từ câu hỏi: người dùng hành động trên dữ liệu này nhanh đến mức nào, và trễ thì mất gì. Ví dụ phát hiện gian lận lúc thanh toán cần vài giây, nên phải stream. Báo cáo xem lúc 8 giờ sáng thì batch là đủ. Nếu không có yêu cầu thật về độ trễ, tôi chọn batch vì rẻ và đơn giản hơn. Yêu cầu tính mới mỗi 15 phút thường vẫn giải quyết được bằng batch nhỏ.`,
    keyPoints: [
      { text: 'Đầu vào có giới hạn và không có giới hạn', keywords: ['có giới hạn', 'không giới hạn', 'bounded', 'unbounded'], weight: 2 },
      { text: 'Đánh đổi độ trễ, chi phí, độ phức tạp', keywords: ['độ trễ', 'chi phí', 'phức tạp', 'latency'], weight: 2 },
      { text: 'Chọn theo yêu cầu thật của người dùng', keywords: ['người dùng', 'yêu cầu', 'hành động', 'sla'] },
    ],
    followUps: ['Micro-batch là batch hay stream?', 'Vì sao stream khó chạy lại hơn batch?'],
    commonMistakes: ['Định nghĩa theo tần suất chạy.', 'Mặc định chọn stream vì nghe hiện đại hơn.'],
  },
  {
    id: 'iv-etl-stream-01',
    topicId: 'etl',
    category: 'etl-processing',
    conceptIds: ['etl-stream'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Event time và processing time khác nhau thế nào? Watermark giải quyết vấn đề gì và có giới hạn gì?',
    referenceAnswer: `Event time là lúc sự kiện xảy ra, gắn trong bản ghi. Processing time là đồng hồ của máy đang xử lý. Hai giá trị lệch nhau vì mạng trễ, thiết bị mất sóng, consumer dừng rồi đọc lại. Dùng processing time thì đơn giản và nhanh, nhưng kết quả phụ thuộc lúc dữ liệu đến, nên phát lại cùng dữ liệu sẽ ra số khác.

Dùng event time thì lại có vấn đề mới: luồng không kết thúc, vậy khi nào đóng window? Đồng hồ không thể trả lời vì event time do dữ liệu quyết định. Watermark chính là tín hiệu tiến độ đó. Trong Flink, Watermark(t) nói rằng event time đã đến t, không nên còn sự kiện nào có timestamp nhỏ hơn hoặc bằng t. Cách tính thường là event time lớn nhất đã thấy trừ một khoảng cho phép lệch.

Giới hạn là nó chỉ là ước lượng, nên vẫn có dữ liệu trễ hơn. Ngưỡng lớn thì đầy đủ nhưng chờ lâu và tốn state, ngưỡng nhỏ thì nhanh nhưng bỏ sót. Ngoài ra toán tử nhiều đầu vào lấy giá trị nhỏ nhất, nên một partition im lặng có thể giữ chân cả job. Tôi chọn ngưỡng theo phân vị độ trễ đo được, và có đường riêng cho dữ liệu quá trễ.`,
    keyPoints: [
      { text: 'Phân biệt thời điểm xảy ra và thời điểm xử lý', keywords: ['xảy ra', 'đồng hồ', 'máy xử lý', 'lúc xử lý'], weight: 2 },
      { text: 'Processing time không tái lập được', keywords: ['tái lập', 'phát lại', 'không ổn định', 'ra số khác'] },
      { text: 'Watermark báo tiến độ để đóng window', keywords: ['tiến độ', 'đóng window', 'đóng cửa sổ', 'không nên còn'], weight: 2 },
      { text: 'Ước lượng, đánh đổi độ trễ và độ đầy đủ', keywords: ['ước lượng', 'đánh đổi', 'đầy đủ', 'dữ liệu trễ', 'bỏ sót'], weight: 2 },
      { text: 'Nhiều đầu vào lấy giá trị nhỏ nhất', keywords: ['nhỏ nhất', 'partition im lặng', 'idle', 'nhàn rỗi'] },
    ],
    followUps: ['Bạn chọn ngưỡng watermark như thế nào?', 'Điều gì xảy ra với dữ liệu trễ hơn ngưỡng trong Spark?'],
    commonMistakes: ['Cho rằng watermark bảo đảm không còn dữ liệu trễ.', 'Nói watermark là một loại window.'],
  },
  {
    id: 'iv-etl-stream-02',
    topicId: 'etl',
    category: 'etl-processing',
    conceptIds: ['etl-stream'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Kể tên các loại window trong stream processing. Với mỗi loại, cho một bài toán phù hợp và chi phí đi kèm.',
    referenceAnswer: `Tumbling có kích thước cố định, không chồng lấn, mỗi sự kiện thuộc đúng một window. Nó hợp với số liệu định kỳ như doanh thu từng phút. Đây là loại rẻ nhất về state.

Sliding có kích thước cố định nhưng trượt theo bước nhỏ hơn, nên các window chồng lấn. Một sự kiện thuộc nhiều window: window 10 phút, bước 1 phút thì mỗi sự kiện thuộc 10 window. Nó hợp với chỉ số như số giao dịch trong 10 phút gần nhất, cập nhật mỗi phút. Chi phí tăng theo tỷ lệ kích thước chia bước.

Session không có kích thước cố định, đóng khi không có hoạt động trong một khoảng thời gian. Nó hợp với gom hành vi người dùng theo phiên. Chi phí khó dự đoán vì một sự kiện trễ có thể làm hai phiên gộp lại, và phiên có thể rất dài.

Flink có thêm global window, gom mọi phần tử cùng key và cần custom trigger. Nếu không có trigger thì không tính gì. Nó hợp với logic đóng theo số lượng hoặc điều kiện riêng. Spark có ba loại đầu, dùng \`window\` và \`session_window\`.`,
    keyPoints: [
      { text: 'Tumbling cố định, không chồng lấn', keywords: ['tumbling', 'không chồng lấn'], weight: 2 },
      { text: 'Sliding chồng lấn, sự kiện thuộc nhiều window', keywords: ['sliding', 'chồng lấn', 'trượt'], weight: 2 },
      { text: 'Session đóng theo khoảng không hoạt động', keywords: ['session', 'phiên', 'không hoạt động', 'gap'], weight: 2 },
      { text: 'Global trong Flink cần custom trigger', keywords: ['global', 'custom trigger'] },
    ],
    followUps: ['Session window xử lý sự kiện trễ làm hai phiên gộp lại như thế nào?'],
    commonMistakes: ['Không nói được chi phí state của sliding window.', 'Nhầm session với tumbling có kích thước theo người dùng.'],
  },
  {
    id: 'iv-etl-stream-03',
    topicId: 'etl',
    category: 'etl-processing',
    conceptIds: ['etl-stream', 'etl-idempotency', 'kafka-overview'],
    interviewTypes: ['bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Thiết kế pipeline stream tính doanh thu theo phút cho 200.000 sự kiện mỗi giây, trong đó một phần sự kiện trễ đến vài giờ. Làm sao vừa nhanh vừa đúng?',
    referenceAnswer: `Tôi tách hai yêu cầu vì chúng mâu thuẫn: kết quả nhanh và kết quả cuối cùng đúng.

Luồng chính đọc từ Kafka, key theo cửa hàng, partition đủ để phân tán tải. Engine dùng event time với tumbling window 1 phút. Ngưỡng watermark chọn từ số đo: nếu p99 độ trễ đến là 90 giây thì đặt khoảng 2 phút. Không thể chờ vài giờ, vì state sẽ tăng không kiểm soát. Với Flink, tôi đặt thêm allowed lateness vừa phải để window tính lại.

Dữ liệu trễ hơn không bị bỏ. Tôi đưa ra side output và ghi vào bảng riêng, rồi job batch mỗi giờ hoặc mỗi đêm tính lại các partition bị ảnh hưởng từ dữ liệu thô. Đích phải chịu được cập nhật: ghi bằng upsert theo khóa cửa hàng và đầu window, nên cả tính lại lẫn khôi phục sau lỗi đều không tạo trùng. Giao diện nên cho biết số của vài giờ gần nhất có thể còn đổi.

Về chịu lỗi, Kafka phát lại được, checkpoint lưu state và offset, đích idempotent, gộp lại cho hiệu ứng exactly-once. Về quy mô, sự kiện cần key tốt để tránh lệch, và state lưu trên RocksDB. Tôi giám sát độ trễ watermark, tỷ lệ sự kiện quá trễ, thời gian checkpoint và backpressure.`,
    keyPoints: [
      { text: 'Event time với watermark chọn từ số đo độ trễ', keywords: ['event time', 'watermark', 'p99', 'phân vị'], weight: 2 },
      { text: 'Dữ liệu quá trễ đi đường riêng rồi tính lại bằng batch', keywords: ['side output', 'batch', 'tính lại', 'bảng riêng'], weight: 2 },
      { text: 'Đích idempotent, upsert theo khóa window', keywords: ['upsert', 'idempotent', 'lũy đẳng', 'merge'], weight: 2 },
      { text: 'Checkpoint và nguồn phát lại được', keywords: ['checkpoint', 'phát lại', 'offset', 'kafka'] },
      { text: 'Giám sát độ trễ watermark và tỷ lệ sự kiện trễ', keywords: ['giám sát', 'tỷ lệ', 'backpressure', 'độ trễ watermark'] },
    ],
    followUps: ['Nếu đích chỉ cho phép ghi thêm thì sao?', 'Làm sao nâng cấp logic job có state mà không mất dữ liệu?'],
    commonMistakes: ['Đặt watermark vài giờ để bắt mọi sự kiện trễ.', 'Chọn processing time cho số liệu doanh thu.', 'Bỏ qua việc ghi trùng khi khôi phục sau lỗi.'],
  },
])
