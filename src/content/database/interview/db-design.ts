import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-db-normalization-01',
    topicId: 'database',
    category: 'db-design',
    conceptIds: ['db-normalization'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Chuẩn hóa cơ sở dữ liệu là gì? Hãy phân biệt 1NF, 2NF và 3NF bằng một ví dụ.',
    referenceAnswer: `Chuẩn hóa là tổ chức lược đồ dựa trên phụ thuộc hàm để mỗi sự thật chỉ lưu ở một nơi, nhằm tránh dị thường khi thêm, sửa, xóa.

Lấy ví dụ bảng đơn hàng phẳng. **1NF** yêu cầu mỗi ô là một giá trị nguyên tử: không được nhét danh sách sản phẩm vào một cột, mà phải tách thành nhiều dòng, khóa là \`(order_id, product_id)\`.

**2NF** yêu cầu cột không khóa phụ thuộc vào toàn bộ khóa. \`product_name\` chỉ phụ thuộc \`product_id\`, nên chuyển sang bảng \`products\`. \`quantity\` thì phụ thuộc cả hai cột nên ở lại.

**3NF** yêu cầu không có phụ thuộc bắc cầu. Trong bảng \`orders\`, \`order_id -> customer_id -> customer_city\` làm thành phố lặp theo đơn hàng, nên chuyển \`customer_city\` sang bảng \`customers\`.

Kết quả là đổi thành phố của khách chỉ sửa một dòng. Cái giá là đọc báo cáo phải Join nhiều bảng hơn.`,
    keyPoints: [
      { text: 'Mục tiêu: mỗi sự thật một nơi, tránh dị thường', keywords: ['dị thường', 'anomaly', 'một nơi', 'dư thừa'], weight: 2 },
      { text: '1NF: giá trị nguyên tử', keywords: ['nguyên tử', 'atomic', 'nhóm lặp'] },
      { text: '2NF: phụ thuộc toàn bộ khóa', keywords: ['toàn bộ khóa', 'một phần khóa', 'partial'], weight: 2 },
      { text: '3NF: không phụ thuộc bắc cầu', keywords: ['bắc cầu', 'transitive'], weight: 2 },
    ],
    followUps: ['Bảng có khóa một cột có thể vi phạm 2NF không?', 'BCNF chặt hơn 3NF ở đâu?'],
    commonMistakes: ['Học thuộc định nghĩa mà không đưa ra được phụ thuộc hàm cụ thể.', 'Cho rằng giá trị trùng nhau nghĩa là vi phạm dạng chuẩn.'],
  },
  {
    id: 'iv-db-normalization-02',
    topicId: 'database',
    category: 'db-design',
    conceptIds: ['db-normalization', 'db-oltp-olap', 'dw-star-schema'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao chuẩn hóa lại làm chậm truy vấn phân tích, trong khi nó rất tốt cho hệ giao dịch?',
    referenceAnswer: `Hai loại tải có mô hình truy cập đối lập nhau.

Hệ giao dịch thường đọc hoặc sửa vài dòng. Chuẩn hóa làm mỗi lần ghi chạm ít dòng, ít khóa và không có bản sao để mâu thuẫn. Join vài dòng qua index vẫn rất nhanh, vì tổng công việc nhỏ.

Truy vấn phân tích đọc hàng triệu dòng rồi gom nhóm. Trên lược đồ 3NF, chỉ một báo cáo doanh thu theo tỉnh, theo nhóm sản phẩm đã phải Join 5 đến 8 bảng. Mỗi Join phải ghép từng dòng, nên tốn bộ nhớ cho hash, tốn I/O và CPU tỷ lệ với số dòng. Khi số bảng tăng, số thứ tự Join tăng rất nhanh, còn sai số ước lượng nhân lên qua từng bước, nên optimizer dễ chọn sai kế hoạch.

Vì vậy, người ta không phi chuẩn hóa hệ nghiệp vụ, mà đưa dữ liệu sang kho phân tích dùng lược đồ hình sao, nơi một bảng sự kiện chỉ cần Join một bước tới các bảng chiều. Kết hợp với lưu trữ cột, truy vấn chỉ đọc đúng cột cần. Lược đồ này dư thừa, nhưng chấp nhận được vì dữ liệu nạp theo lô, không có cập nhật đồng thời.`,
    keyPoints: [
      { text: 'OLTP chạm ít dòng, OLAP quét nhiều dòng', keywords: ['ít dòng', 'vài dòng', 'hàng triệu dòng', 'nhiều dòng', 'oltp'], weight: 2 },
      { text: 'Nhiều Join tốn CPU, bộ nhớ và I/O theo số dòng', keywords: ['join', 'ghép'], weight: 2 },
      { text: 'Khó ước lượng và chọn kế hoạch', keywords: ['ước lượng', 'optimizer', 'thứ tự join'] },
      { text: 'Giải pháp là lược đồ hình sao ở kho dữ liệu', keywords: ['star schema', 'hình sao', 'kho dữ liệu', 'warehouse'] },
      { text: 'Dư thừa chấp nhận được vì nạp theo lô', keywords: ['theo lô', 'batch', 'ít cập nhật'] },
    ],
    followUps: ['Vì sao lưu trữ cột không giải quyết hết vấn đề Join?', 'Khi nào nên dùng bảng rộng thay vì lược đồ hình sao?'],
    commonMistakes: ['Nói chuẩn hóa chậm mà không phân biệt được đọc một dòng với quét nhiều dòng.', 'Đề xuất phi chuẩn hóa luôn hệ OLTP để phục vụ báo cáo.'],
  },
  {
    id: 'iv-db-normalization-03',
    topicId: 'database',
    category: 'db-design',
    conceptIds: ['db-normalization'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Một bảng đạt 3NF có còn dị thường không? Khi nào cần BCNF, và vì sao nhiều hệ vẫn dừng ở 3NF?',
    referenceAnswer: `Có thể còn. 3NF chỉ nói về cột không khóa, nên bỏ lọt trường hợp một cột thuộc khóa lại phụ thuộc vào cột không phải siêu khóa.

Ví dụ bảng \`(student, course, teacher)\`, khóa \`(student, course)\`, và mỗi giáo viên chỉ dạy một môn, tức \`teacher -> course\`. \`course\` thuộc khóa nên bảng vẫn đạt 3NF. Nhưng môn của giáo viên lặp lại theo từng sinh viên: đổi môn của một giáo viên phải sửa nhiều dòng, và xóa sinh viên cuối cùng làm mất luôn thông tin giáo viên dạy môn gì.

BCNF sửa điều này bằng cách yêu cầu vế trái của mọi phụ thuộc hàm là siêu khóa. Tách thành \`(teacher, course)\` và \`(student, teacher)\`. Phép tách vẫn lossless, nhưng **phụ thuộc** \`(student, course) -> teacher\` không còn nằm trong bảng nào, nên muốn đảm bảo nó phải Join hoặc viết trigger.

Vì vậy tôi cân nhắc theo chi phí thực tế. Nếu dị thường đó hay xảy ra và ràng buộc kia ít quan trọng, tôi chọn BCNF. Ngược lại, 3NF cùng một ràng buộc \`UNIQUE\` thường đủ tốt, và 3NF luôn tách được mà vừa lossless vừa giữ mọi phụ thuộc.`,
    keyPoints: [
      { text: '3NF vẫn còn dị thường khi cột thuộc khóa phụ thuộc cột không phải siêu khóa', keywords: ['siêu khóa', 'cột thuộc khóa', 'superkey'], weight: 2 },
      { text: 'Ví dụ cụ thể về các khóa ứng viên chồng lấn', keywords: ['student', 'teacher', 'chồng lấn', 'sinh viên'] },
      { text: 'BCNF có thể làm mất phụ thuộc hàm', keywords: ['mất phụ thuộc', 'bảo toàn phụ thuộc', 'dependency preservation'], weight: 2 },
      { text: 'Quyết định theo chi phí thực tế của dị thường', keywords: ['đánh đổi', 'chi phí', 'ràng buộc'] },
    ],
    followUps: ['Tách lossless nghĩa là gì?', 'Dạng 4NF giải quyết vấn đề gì?'],
    commonMistakes: ['Cho rằng 3NF đã loại bỏ hết mọi dị thường.', 'Chọn BCNF như một quy tắc mà không biết mình mất gì.'],
  },
  {
    id: 'iv-db-normalization-04',
    topicId: 'database',
    category: 'db-design',
    conceptIds: ['db-normalization', 'db-denormalization'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Thiết kế lược đồ đơn hàng: giá sản phẩm nên lưu ở đâu? Hãy dùng phụ thuộc hàm để giải thích.',
    referenceAnswer: `Cần phân biệt hai sự thật khác nhau, dù cùng được gọi là "giá".

**Giá niêm yết hiện tại** phụ thuộc vào \`product_id\`, nên nằm ở \`products\`, hoặc ở bảng lịch sử giá nếu cần tra cứu theo thời điểm.

**Giá lúc mua** phụ thuộc vào \`(order_id, product_id)\`, nên nằm ở \`order_items\`. Khi giá niêm yết đổi, hóa đơn cũ không được đổi theo.

Nhiều người nhìn thấy hai cột giá rồi gọi đó là dư thừa, nhưng xét phụ thuộc hàm thì không: biết \`product_id\` không suy ra được giá của một đơn cũ. Nếu xóa \`unit_price\` và Join sang \`products\`, doanh thu lịch sử sẽ thay đổi mỗi lần đổi giá, là một lỗi rất khó phát hiện.

Các cột tương tự gồm địa chỉ giao hàng, thuế suất, tỷ giá tại thời điểm giao dịch. Ngược lại, tổng tiền của đơn hàng suy ra được từ các dòng, nên lưu nó mới thực sự là phi chuẩn hóa. Tôi có thể vẫn lưu để đọc nhanh, nhưng phải biết rõ và phải giữ đồng bộ trong cùng giao dịch.`,
    keyPoints: [
      { text: 'Giá niêm yết phụ thuộc product_id', keywords: ['niêm yết', 'giá hiện tại', 'list price', 'products'] },
      { text: 'Giá lúc mua phụ thuộc đơn hàng và sản phẩm', keywords: ['lúc mua', 'order_items', 'order items', 'thời điểm'], weight: 2 },
      { text: 'Không phải dư thừa, hai sự thật khác nhau', keywords: ['sự thật khác', 'không dư thừa', 'không phải dư thừa', 'phụ thuộc hàm'], weight: 2 },
      { text: 'Tổng tiền đơn hàng mới là phi chuẩn hóa', keywords: ['tổng tiền', 'suy ra', 'phi chuẩn hóa'] },
    ],
    followUps: ['Nếu cần tra giá theo ngày thì thiết kế thế nào?', 'Liên hệ với Slowly Changing Dimensions trong kho dữ liệu?'],
    commonMistakes: ['Xóa giá lúc mua vì cho là vi phạm 3NF.', 'Áp dụng chuẩn hóa theo mặt chữ tên cột thay vì phụ thuộc hàm.'],
  },
  {
    id: 'iv-db-denormalization-01',
    topicId: 'database',
    category: 'db-design',
    conceptIds: ['db-denormalization', 'etl-cdc'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Khi nào bạn phi chuẩn hóa, và làm sao giữ dữ liệu dư thừa không bị lệch?',
    referenceAnswer: `Phi chuẩn hóa chuyển chi phí từ lúc đọc sang lúc ghi, nên hợp lý khi đọc nhiều hơn ghi rất nhiều, đã đo được Join là nút thắt và mẫu truy vấn ổn định. Thường gặp là tính sẵn số đếm, sao chép vài cột ít đổi, hoặc bảng rộng cho dashboard.

Để giữ đồng bộ, tôi chọn theo yêu cầu nhất quán. Nếu phải đúng ngay, tôi cập nhật trong cùng giao dịch hoặc bằng trigger. Cách này đơn giản nhưng mỗi lần ghi nặng hơn, và dòng tổng hợp có thể bị tranh chấp khóa. Nếu chấp nhận trễ, tôi dùng CDC hoặc Materialized View làm mới theo lịch: đường ghi không bị ảnh hưởng, đổi lại dữ liệu trễ vài giây đến vài phút.

Dù chọn cách nào, tôi vẫn coi một nơi là nguồn đúng duy nhất, và chạy job đối soát định kỳ, vì lệch dữ liệu là điều chắc chắn sẽ xảy ra khi có lỗi triển khai. Với job đối soát, bản phi chuẩn hóa có thể được dựng lại từ nguồn đúng bất kỳ lúc nào.`,
    keyPoints: [
      { text: 'Đổi chi phí đọc lấy chi phí ghi', keywords: ['lúc ghi', 'chi phí ghi', 'đọc nhiều', 'đọc nhanh'], weight: 2 },
      { text: 'Phải đo được Join là nút thắt', keywords: ['đo được', 'nút thắt', 'kế hoạch thực thi', 'bottleneck'] },
      { text: 'Đồng bộ trong giao dịch hoặc bằng trigger', keywords: ['cùng giao dịch', 'trigger'], weight: 2 },
      { text: 'Đồng bộ bất đồng bộ qua CDC hoặc Materialized View', keywords: ['cdc', 'bất đồng bộ', 'materialized view'] },
      { text: 'Có nguồn đúng và job đối soát', keywords: ['đối soát', 'nguồn đúng', 'source of truth', 'reconcile'] },
    ],
    followUps: ['Vì sao cột đếm có thể gây tranh chấp khóa?', 'CDC có đảm bảo thứ tự không?'],
    commonMistakes: ['Không nhắc đến cơ chế đồng bộ.', 'Phi chuẩn hóa trước khi xem kế hoạch thực thi.'],
  },
  {
    id: 'iv-db-denormalization-02',
    topicId: 'database',
    category: 'db-design',
    conceptIds: ['db-denormalization', 'db-query-optimization', 'db-execution-plan'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Truy vấn Join 5 bảng trên hệ nghiệp vụ mất 8 giây. Một đồng nghiệp đề nghị phi chuẩn hóa ngay. Bạn trả lời thế nào?',
    referenceAnswer: `Tôi chưa đồng ý ngay, vì phi chuẩn hóa là thay đổi đắt và khó quay lại. Nó có chi phí vĩnh viễn ở mọi đường ghi, và trước tiên tôi phải biết 8 giây đó đi đâu.

Đầu tiên tôi xem \`EXPLAIN ANALYZE\`. Nếu ước lượng số dòng lệch xa thực tế thì có thể do thống kê cũ, chỉ cần \`ANALYZE\`. Nếu quét tuần tự một bảng lớn với điều kiện chọn lọc thì thiếu index, hoặc điều kiện bọc hàm làm index không dùng được. Nếu sort tràn đĩa thì có thể do thiếu bộ nhớ, hoặc có thể tránh bằng index đúng thứ tự.

Tiếp theo tôi hỏi về nghiệp vụ: truy vấn này có cần dữ liệu mới từng giây không? Nếu là báo cáo, nó nên chạy trên replica hoặc kho dữ liệu, không phải trên hệ nghiệp vụ. Nếu chỉ cần vài cột của truy vấn lặp lại, có thể dùng cache hoặc Materialized View.

Chỉ khi các bước trên chưa đủ, và tần suất đọc lớn hơn hẳn tần suất ghi, tôi mới phi chuẩn hóa, và phải có kế hoạch đồng bộ, nguồn đúng duy nhất và job đối soát.`,
    keyPoints: [
      { text: 'Đo trước bằng kế hoạch thực thi', keywords: ['explain', 'kế hoạch', 'execution plan'], weight: 2 },
      { text: 'Thử index, thống kê, viết lại truy vấn', keywords: ['index', 'thống kê', 'analyze', 'viết lại'], weight: 2 },
      { text: 'Tách tải báo cáo sang replica hoặc kho dữ liệu', keywords: ['replica', 'kho dữ liệu', 'warehouse', 'olap'] },
      { text: 'Thử cache hoặc Materialized View', keywords: ['cache', 'materialized view'] },
      { text: 'Phi chuẩn hóa có chi phí lâu dài, cần cơ chế đồng bộ', keywords: ['đồng bộ', 'chi phí', 'đối soát', 'lâu dài'] },
    ],
    followUps: ['Nếu tần suất ghi cao thì sao?', 'Bạn đo hiệu quả sau khi thay đổi như thế nào?'],
    commonMistakes: ['Đồng ý ngay mà không đo.', 'Coi phi chuẩn hóa là không có chi phí về sau.'],
  },
])
