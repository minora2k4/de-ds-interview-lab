import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-etl-data-quality-01',
    topicId: 'etl',
    category: 'etl-governance-group',
    conceptIds: ['etl-data-quality'],
    interviewTypes: ['de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Data Quality gồm những chiều nào? Cho ví dụ về cách đo một vài chiều trong pipeline thực tế.',
    referenceAnswer: `Chất lượng dữ liệu là mức độ dữ liệu phù hợp với mục đích sử dụng. Sáu chiều phổ biến gồm: đầy đủ, chính xác, nhất quán, kịp thời, hợp lệ và duy nhất.

Với đầy đủ, tôi đo tỷ lệ null của cột quan trọng và so số dòng với lịch sử, ví dụ so với trung bình 28 ngày. Với duy nhất, tôi kiểm tra \`order_id\` không trùng, trong dbt là test \`unique\`. Với hợp lệ, tôi kiểm tra giá trị nằm trong tập cho phép, bằng \`accepted_values\`, hoặc số tiền không âm. Với kịp thời, tôi đo khoảng cách giữa hiện tại và lần nạp mới nhất so với cam kết, ví dụ phải có trước 7 giờ, và dbt có kiểm tra freshness cho việc này.

Với nhất quán, tôi đối chiếu tổng doanh thu giữa kho và hệ thống kế toán. Với chính xác, đây là chiều khó nhất, vì phải có nguồn đối chiếu độc lập, ví dụ so mẫu với sổ gốc.

Mức cần đạt phụ thuộc người dùng. Đối soát tài chính cần chặt, còn báo cáo xu hướng có thể chấp nhận sai số nhỏ.`,
    keyPoints: [
      { text: 'Phù hợp với mục đích sử dụng', keywords: ['mục đích', 'phù hợp', 'người dùng'], weight: 2 },
      { text: 'Nêu các chiều chất lượng', keywords: ['đầy đủ', 'chính xác', 'nhất quán', 'kịp thời', 'hợp lệ', 'duy nhất', 'completeness', 'accuracy'], weight: 2 },
      { text: 'Có cách đo cụ thể', keywords: ['tỷ lệ null', 'so số dòng', 'test', 'đối chiếu'], weight: 2 },
      { text: 'Chính xác cần nguồn đối chiếu', keywords: ['nguồn đối chiếu', 'khó nhất', 'sổ gốc'] },
    ],
    followUps: ['Khác biệt giữa Validity và Accuracy là gì?'],
    commonMistakes: ['Chỉ kể tên chiều mà không nói cách đo.', 'Xem chất lượng là một con số tuyệt đối.'],
  },
  {
    id: 'iv-etl-data-quality-02',
    topicId: 'etl',
    category: 'etl-governance-group',
    conceptIds: ['etl-data-quality', 'etl-validation', 'arch-observability'],
    interviewTypes: ['de', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Thiết kế cách kiểm soát chất lượng dữ liệu cho một nền tảng có 4.000 bảng và đội dữ liệu nhỏ. Bạn bắt đầu từ đâu và đo hiệu quả bằng gì?',
    referenceAnswer: `Nguồn lực có hạn, và không phải lỗi nào cũng đáng giá như nhau, nên tôi bắt đầu từ ảnh hưởng. Tôi dùng lineage và số lượt truy vấn để tìm vài chục bảng phục vụ quyết định quan trọng, rồi hỏi người dùng sai thì hậu quả là gì.

Tôi chia tầng. Tầng cao có SLO rõ ràng, ví dụ có trước 7 giờ và lệch với kế toán dưới 0,1%, có kiểm tra chặn trước khi công bố, đối chiếu với nguồn và chủ sở hữu nhận cảnh báo. Tầng thấp chỉ có giám sát tự động về độ mới, thể tích và schema, không chặn pipeline.

Về cơ chế, kiểm tra theo quy tắc cho điều đã biết như khóa duy nhất, và phát hiện bất thường cho điều chưa lường trước. Cảnh báo phải có người nhận và đi kèm lineage để biết phạm vi. Quá nhiều cảnh báo là thất bại, nên tôi thường xuyên loại bỏ test ồn ào.

Với lỗi lặp lại, tôi sửa từ nguồn bằng cam kết với đội ứng dụng về schema và ý nghĩa, thay vì lọc mãi ở pipeline.

Tôi đo hiệu quả bằng thời gian phát hiện và thời gian xử lý sự cố, tỷ lệ lỗi do người dùng phát hiện trước so với do hệ thống phát hiện, tỷ lệ đạt SLO, và tỷ lệ cảnh báo có hành động. Giá trị thật là người dùng tin dữ liệu, không phải số lượng test.`,
    keyPoints: [
      { text: 'Ưu tiên theo ảnh hưởng, phân tầng bảng', keywords: ['ảnh hưởng', 'phân tầng', 'tầng cao', 'ưu tiên'], weight: 2 },
      { text: 'SLO theo người dùng và có chủ sở hữu', keywords: ['slo', 'chủ sở hữu', 'owner', 'cam kết'], weight: 2 },
      { text: 'Kết hợp quy tắc và phát hiện bất thường', keywords: ['quy tắc', 'bất thường', 'anomaly'], weight: 2 },
      { text: 'Sửa từ nguồn', keywords: ['sửa từ nguồn', 'đội ứng dụng', 'data contract', 'cam kết'] },
      { text: 'Đo bằng thời gian phát hiện và tỷ lệ người dùng phát hiện trước', keywords: ['thời gian phát hiện', 'mttd', 'tỷ lệ', 'người dùng phát hiện'], weight: 2 },
    ],
    followUps: ['Làm sao giảm cảnh báo giả?', 'Khi nào một kiểm tra nên chặn pipeline?'],
    commonMistakes: ['Viết test cho mọi bảng theo cùng một mức.', 'Đo thành công bằng số lượng test.'],
  },
  {
    id: 'iv-etl-data-quality-03',
    topicId: 'etl',
    category: 'etl-governance-group',
    conceptIds: ['etl-data-quality', 'etl-lineage'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Giám đốc báo số doanh thu hôm nay trên dashboard sai. Bạn xử lý sự cố này từng bước như thế nào?',
    referenceAnswer: `Đầu tiên tôi xác nhận và đánh giá phạm vi: sai ở đâu, sai bao nhiêu, so với nguồn nào, và từ khi nào. Có khi số không sai mà do định nghĩa khác, ví dụ doanh thu trước hoặc sau hoàn tiền. Nếu đúng là lỗi, tôi thông báo ngay cho người dùng và ghi chú trên dashboard, để không ai ra quyết định theo số sai, kể cả khi chưa rõ nguyên nhân.

Sau đó tôi truy ngược bằng lineage, đi từ dashboard lên từng bảng. Ở mỗi bảng, tôi so số dòng và tổng theo ngày để tìm điểm đầu tiên lệch. Tôi kiểm tra các lần chạy gần đây: job có lỗi không, có code nào mới được triển khai không, schema nguồn có đổi không, nguồn có đến trễ không.

Nếu cần khắc phục nhanh, tôi quay về phiên bản trước hoặc chặn việc công bố, vì dữ liệu cũ đúng tốt hơn dữ liệu mới sai. Rồi tôi sửa nguyên nhân, và backfill khoảng bị ảnh hưởng cùng các bảng phía sau. Vì pipeline idempotent, bước này chỉ là chạy lại.

Cuối cùng, tôi viết đánh giá sau sự cố không đổ lỗi: vì sao không có kiểm tra nào phát hiện trước người dùng. Tôi thêm đúng kiểm tra còn thiếu. Giám đốc được báo về nguyên nhân, phạm vi và các báo cáo đã gửi có bị ảnh hưởng không.`,
    keyPoints: [
      { text: 'Xác nhận và đánh giá phạm vi, có thể là khác định nghĩa', keywords: ['xác nhận', 'phạm vi', 'định nghĩa', 'so với nguồn'], weight: 2 },
      { text: 'Thông báo sớm cho người dùng', keywords: ['thông báo', 'ghi chú', 'cảnh báo người dùng'], weight: 2 },
      { text: 'Truy ngược bằng lineage, tìm điểm lệch đầu tiên', keywords: ['lineage', 'truy ngược', 'điểm đầu tiên', 'từng bảng'], weight: 2 },
      { text: 'Sửa gốc và backfill bảng phía sau', keywords: ['backfill', 'sửa nguyên nhân', 'bảng phía sau', 'chạy lại'] },
      { text: 'Đánh giá sau sự cố, thêm kiểm tra', keywords: ['sau sự cố', 'postmortem', 'thêm kiểm tra'] },
    ],
    followUps: ['Khi nào nên quay về phiên bản trước thay vì sửa tiếp?'],
    commonMistakes: ['Lao vào đọc code ngay mà không xác nhận lỗi.', 'Không báo cho người dùng đến khi sửa xong.'],
  },
  {
    id: 'iv-etl-lineage-01',
    topicId: 'etl',
    category: 'etl-governance-group',
    conceptIds: ['etl-lineage', 'etl-orchestration'],
    interviewTypes: ['de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Data Lineage là gì và dùng để làm gì? OpenLineage giải quyết vấn đề nào, và mô hình của nó như thế nào?',
    referenceAnswer: `Lineage là bản đồ cho biết dữ liệu đến từ đâu, qua những phép biến đổi nào và đi đến đâu. Có hai công dụng chính. Phân tích ảnh hưởng: đổi một cột thì biết báo cáo nào phía sau bị tác động. Tìm nguyên nhân: số sai ở dashboard thì truy ngược lên phía trên. Ngoài ra nó phục vụ tuân thủ, như chứng minh dữ liệu cá nhân đi những đâu.

Lineage có thể theo bảng hoặc theo cột. Theo bảng dễ hơn, nhưng báo cả những bảng chỉ dùng cột khác. Có thể thu thập tĩnh bằng phân tích code, như \`ref\` của dbt, hoặc khi chạy bằng sự kiện thực thi.

Vấn đề là một pipeline đi qua nhiều công cụ như Airflow, Spark, dbt, và mỗi công cụ một định dạng, nên phải viết tích hợp riêng cho từng cặp. OpenLineage là tiêu chuẩn mở giải quyết việc đó. Mô hình có Job là quy trình, Run là một lần chạy, Dataset là dữ liệu đọc và ghi, và Facet là siêu dữ liệu gắn thêm, như \`columnLineage\`. Run phát sự kiện với trạng thái như \`START\`, \`COMPLETE\`, \`FAIL\`. Sự kiện gửi đến backend, trong đó Marquez là bản tham chiếu. Bản thân OpenLineage không phải công cụ hiển thị.`,
    keyPoints: [
      { text: 'Phân tích ảnh hưởng và tìm nguyên nhân', keywords: ['phân tích ảnh hưởng', 'ảnh hưởng', 'truy ngược', 'nguyên nhân'], weight: 2 },
      { text: 'Theo bảng và theo cột', keywords: ['theo cột', 'theo bảng', 'column'] },
      { text: 'Tiêu chuẩn mở chung cho nhiều công cụ', keywords: ['tiêu chuẩn mở', 'open standard', 'định dạng chung'], weight: 2 },
      { text: 'Job, Run, Dataset, Facet', keywords: ['job', 'run', 'dataset', 'facet'], weight: 2 },
      { text: 'Marquez là backend tham chiếu', keywords: ['marquez', 'backend'] },
    ],
    followUps: ['Lineage tĩnh và lineage khi chạy khác nhau thế nào?'],
    commonMistakes: ['Nhầm OpenLineage với công cụ giao diện.', 'Chỉ nói được định nghĩa mà không biết công dụng.'],
  },
  {
    id: 'iv-etl-governance-01',
    topicId: 'etl',
    category: 'etl-governance-group',
    conceptIds: ['etl-governance', 'etl-etl-elt'],
    interviewTypes: ['de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Công ty bạn cần xử lý dữ liệu cá nhân trên một lakehouse theo GDPR. Vùng thô bất biến xung đột với quyền được xóa thì sao? Bạn thiết kế quản trị như thế nào?',
    referenceAnswer: `Trước hết tôi tách các câu hỏi về trách nhiệm khỏi công cụ: ai là chủ sở hữu của dữ liệu cá nhân, ai quyết định quyền truy cập, và dữ liệu được phép giữ bao lâu. Công cụ chỉ thực thi những quyết định này.

Về nhận diện, tôi quét và gắn nhãn cột nhạy cảm, đưa vào catalog, và mức kiểm soát suy ra từ nhãn. Che cột và lọc dòng thực thi tự động theo vai trò, theo nguyên tắc quyền tối thiểu. Lineage cho biết dữ liệu đi qua những đâu, nên yêu cầu xóa không bỏ sót.

Bất biến và quyền được xóa có thể dung hòa. Cách thứ nhất là che hoặc loại bỏ định danh ngay trước khi nạp, nên vùng thô không có dữ liệu rõ. Cách thứ hai là tách định danh ra một bảng riêng, dữ liệu sự kiện chỉ giữ khóa đại diện, khi xóa chỉ xóa ở bảng đó. Cách thứ ba là mã hóa theo từng người rồi xóa khóa. Bảng định dạng mở có thể xóa dòng rồi viết lại tệp, nhưng cần chú ý snapshot cũ cho đến khi hết hạn giữ.

Bất biến thực ra có nghĩa là không tùy tiện sửa, không phải không bao giờ được xóa. Tôi cần pháp lý xác nhận những gì được coi là đã xóa, và ghi nhật ký để kiểm toán.`,
    keyPoints: [
      { text: 'Vai trò và trách nhiệm trước công cụ', keywords: ['chủ sở hữu', 'owner', 'trách nhiệm', 'vai trò'], weight: 2 },
      { text: 'Phân loại, gắn nhãn, che cột tự động', keywords: ['gắn nhãn', 'phân loại', 'che cột', 'quyền tối thiểu'], weight: 2 },
      { text: 'Dung hòa: tách định danh, che trước khi nạp, xóa khóa', keywords: ['tách định danh', 'crypto', 'xóa khóa', 'che trước', 'khóa đại diện'], weight: 3 },
      { text: 'Lineage và kiểm toán', keywords: ['lineage', 'kiểm toán', 'nhật ký'] },
      { text: 'Snapshot cũ vẫn còn dữ liệu', keywords: ['snapshot', 'hết hạn', 'time travel'] },
    ],
    followUps: ['Time travel của bảng định dạng mở ảnh hưởng thế nào đến yêu cầu xóa?'],
    commonMistakes: ['Nói vùng thô bất biến nên được miễn yêu cầu xóa.', 'Chỉ nói đến công cụ, không nói đến vai trò.'],
  },
])
