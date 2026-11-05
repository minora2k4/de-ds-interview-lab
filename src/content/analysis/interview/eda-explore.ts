import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-eda-overview-01',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-overview'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'EDA là gì? Khi nhận một bộ dữ liệu mới, bạn làm những bước nào?',
    referenceAnswer: `EDA là việc đọc dữ liệu có hệ thống trước khi xây mô hình, để hiểu dữ liệu và ra quyết định về cách xử lý tiếp theo.

Đầu tiên tôi làm rõ câu hỏi nghiệp vụ, mỗi dòng là gì, và dự đoán tại thời điểm nào. Điều này quyết định cách đếm và cách tách tập. Sau đó tôi kiểm tra cấu trúc: kiểu dữ liệu, khóa, dòng trùng, khoảng thời gian, tỷ lệ thiếu.

Tiếp theo tôi xem từng biến qua histogram và phân vị để tìm đuôi dài, nhiều đỉnh và giá trị lạ như 999. Rồi tôi xem quan hệ với nhãn và tách theo nhóm, theo thời gian. Tôi cũng tìm các vấn đề như giá trị thiếu, ngoại lai, rò rỉ và mất cân bằng.

Cuối cùng tôi ghi lại các quyết định. Ví dụ cột \`cancel_reason\` chỉ có ở khách đã rời mạng thì phải bỏ, vì lúc dự đoán chưa có giá trị này.`,
    keyPoints: [
      { text: 'Mục đích là hiểu dữ liệu và ra quyết định', keywords: ['quyết định', 'hiểu dữ liệu'], weight: 2 },
      { text: 'Xác định đơn vị quan sát và thời điểm dự đoán', keywords: ['mỗi dòng', 'đơn vị quan sát', 'thời điểm dự đoán'], weight: 2 },
      { text: 'Kiểm tra cấu trúc', keywords: ['kiểu dữ liệu', 'dòng trùng', 'trùng lặp', 'khóa'] },
      { text: 'Xem phân phối từng biến', keywords: ['phân phối', 'histogram', 'phân vị'] },
      { text: 'Xem quan hệ với nhãn, tách theo nhóm và thời gian', keywords: ['tương quan', 'với nhãn', 'theo nhóm', 'theo thời gian'] },
    ],
    followUps: ['Bạn phân biệt EDA với Data Profiling thế nào?', 'Phát hiện nào từng làm bạn đổi hướng dự án?'],
    commonMistakes: ['Liệt kê biểu đồ mà không nói mỗi biểu đồ dẫn đến quyết định gì.', 'Bỏ qua câu hỏi mỗi dòng là gì.'],
  },
  {
    id: 'iv-eda-overview-02',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-overview', 'eda-correlation'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao phải vẽ biểu đồ khi đã có bảng thống kê mô tả? Cho ví dụ con số che giấu vấn đề.',
    referenceAnswer: `Thống kê mô tả nén cả cột thành vài con số, nên về bản chất là mất thông tin. Nhiều hình dạng khác nhau có thể cho cùng một bộ số. Bộ tứ Anscombe có gần như cùng trung bình, phương sai, tương quan và đường hồi quy, nhưng một bộ tuyến tính, một bộ cong, hai bộ còn lại bị một điểm chi phối.

Ví dụ thực tế là thời gian giao hàng trung bình 2,85 ngày. Biểu đồ cho thấy hai đỉnh, nội tỉnh quanh 1,5 ngày và liên tỉnh quanh 6 ngày, nên con số trung bình không mô tả nhóm nào. Một ví dụ khác là cột có đỉnh tại 999, tức giá trị mặc định, làm trung bình lệch mà bảng số không nói rõ nguyên nhân.

Tuy nhiên biểu đồ cũng có giới hạn: boxplot che hai đỉnh, histogram phụ thuộc độ rộng khoảng. Với hàng nghìn cột, tôi dùng thống kê để lọc ra cột cần xem, rồi vẽ các cột đó. Hai công cụ bổ sung cho nhau.`,
    keyPoints: [
      { text: 'Thống kê mô tả nén và làm mất thông tin', keywords: ['nén', 'mất thông tin', 'cùng một bộ số'], weight: 2 },
      { text: 'Nêu Anscombe hoặc ví dụ tương đương', keywords: ['anscombe', 'datasaurus', 'cùng trung bình'], weight: 2 },
      { text: 'Ví dụ hai đỉnh hoặc giá trị mặc định', keywords: ['hai đỉnh', 'nhiều đỉnh', 'giá trị mặc định'] },
      { text: 'Biểu đồ cũng có giới hạn', keywords: ['boxplot', 'độ rộng khoảng', 'hàng nghìn cột'] },
    ],
    followUps: ['Với 5.000 cột, bạn chọn cột nào để vẽ?', 'Biểu đồ nào thích hợp để so sánh phân phối của train và test?'],
    commonMistakes: ['Chỉ trả lời biểu đồ dễ nhìn hơn, không nói được vì sao con số thiếu thông tin.'],
  },
  {
    id: 'iv-eda-overview-03',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-overview', 'stats-hypothesis', 'eda-leakage'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'EDA có thể làm kết quả phân tích sai đi không? Bạn làm gì để không tự lừa mình?',
    referenceAnswer: `Có, theo hai cách. Cách thứ nhất là **so sánh nhiều lần**: xem đủ nhiều lát cắt thì sẽ gặp mẫu hình do ngẫu nhiên. 100 phân khúc không có khác biệt thật ở mức 5% vẫn cho trung bình 5 kết quả trông có ý nghĩa. P-value tính trên chính dữ liệu đã dùng để tìm ra giả thuyết là quá lạc quan, vì nó bỏ qua toàn bộ các lựa chọn đã thử.

Cách thứ hai là **rò rỉ qua người phân tích**: nếu tôi xem nhãn của tập test rồi chọn đặc trưng hay ngưỡng, thông tin test đã vào mô hình mà không một đoạn code nào cho thấy điều đó.

Để phòng tránh, tôi tách tập trước khi làm những gì liên quan đến nhãn, chỉ kiểm tra cấu trúc trên toàn bộ dữ liệu. Tôi coi kết quả EDA là giả thuyết, ghi lại cả số lát cắt đã xem, rồi kiểm tra trên dữ liệu mới hoặc bằng thí nghiệm. Khi không có dữ liệu mới, tôi hiệu chỉnh cho số lần so sánh và ưu tiên giả thuyết có cơ chế nghiệp vụ hợp lý.`,
    keyPoints: [
      { text: 'So sánh nhiều lần tạo mẫu hình ngẫu nhiên', keywords: ['so sánh nhiều lần', 'multiple comparison', 'nhiều lát cắt', 'ngẫu nhiên', 'p hacking'], weight: 2 },
      { text: 'Xem test làm thông tin lọt vào quyết định', keywords: ['tập test', 'rò rỉ', 'leakage'], weight: 2 },
      { text: 'Tách tập trước khi làm việc liên quan đến nhãn', keywords: ['tách tập trước', 'chỉ trên train', 'trên train'] },
      { text: 'Kiểm tra giả thuyết trên dữ liệu mới', keywords: ['dữ liệu mới', 'thí nghiệm', 'a/b', 'kiểm định'] },
    ],
    followUps: ['Khi nào có thể xem toàn bộ dữ liệu mà vẫn an toàn?', 'Bạn hiệu chỉnh cho nhiều phép so sánh như thế nào?'],
    commonMistakes: ['Cho rằng EDA vô hại vì chưa huấn luyện mô hình.', 'Báo cáo p-value của giả thuyết tìm ra từ chính dữ liệu đó.'],
  },
  {
    id: 'iv-eda-overview-04',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-overview', 'dq-overview'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Quản lý cần mô hình trong hai tuần và hỏi có cần làm EDA không. Bạn phân bổ thời gian và báo cáo kết quả EDA thế nào?',
    referenceAnswer: `Tôi không xem đây là lựa chọn giữa có và không, mà là mức độ theo rủi ro. Với hai tuần, tôi dành khoảng hai đến ba ngày đầu cho các câu hỏi có thể làm hỏng cả dự án: đơn vị quan sát, thời điểm dự đoán, định nghĩa nhãn, rò rỉ, tính đại diện. Những lỗi này không thể khắc phục bằng mô hình tốt hơn. Các câu hỏi về biến đổi hay phân nhóm chi tiết để sau baseline, vì lúc đó sẽ biết chỗ nào đáng đầu tư.

Tôi làm baseline sớm vì nó cũng là một công cụ EDA: kết quả tốt bất thường hay lỗi tập trung ở một nhóm đều đưa tôi quay lại dữ liệu.

Khi báo cáo, tôi không đưa biểu đồ thô mà trình bày bảng gồm phát hiện, tác động, quyết định và người xác nhận. Ví dụ 12% dòng có nhãn sai định nghĩa trước tháng 3, nên bỏ giai đoạn đó và mất 2 tháng dữ liệu. Phần chưa rõ được nêu cùng cách kiểm tra. Cách này giúp quản lý ra quyết định, không chỉ biết thêm thông tin.`,
    keyPoints: [
      { text: 'Ưu tiên theo rủi ro làm hỏng dự án', keywords: ['rủi ro', 'ưu tiên', 'làm hỏng'], weight: 2 },
      { text: 'Kiểm tra sớm đơn vị quan sát, nhãn, rò rỉ', keywords: ['định nghĩa nhãn', 'đơn vị quan sát', 'rò rỉ', 'tính đại diện'], weight: 2 },
      { text: 'Dùng baseline để quay lại dữ liệu', keywords: ['baseline', 'mô hình đơn giản'] },
      { text: 'Báo cáo theo phát hiện, tác động và quyết định', keywords: ['tác động', 'quyết định', 'phát hiện'] },
    ],
    followUps: ['Nếu phát hiện vấn đề làm chậm dự án thì bạn trao đổi thế nào?', 'Phần nào của EDA có thể tự động hóa?'],
    commonMistakes: ['Làm EDA dàn trải, không gắn với quyết định.', 'Bỏ EDA vì áp lực thời gian rồi phát hiện rò rỉ sau khi triển khai.'],
  },
  {
    id: 'iv-eda-distribution-01',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-distribution', 'stats-central-tendency'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Bạn xem phân phối của một cột bằng cách nào và những gì trên biểu đồ làm bạn chú ý? Khi nào dùng trung vị thay trung bình?',
    referenceAnswer: `Tôi thường bắt đầu với histogram và bảng phân vị, thêm boxplot khi so sánh nhiều nhóm. Mỗi loại có điểm yếu: histogram phụ thuộc độ rộng khoảng, còn boxplot có thể che hai đỉnh.

Tôi chú ý ba thứ. Thứ nhất là hình dạng: đối xứng hay có đuôi dài. Thứ hai là số đỉnh: hai đỉnh thường là hai nhóm bị trộn, nên phải tách ra trước khi tóm tắt. Thứ ba là điểm lạ: cột đứng tại 0 hay 999 có thể là giá trị mặc định chứ không phải giá trị thật.

Tôi dùng trung vị khi dữ liệu lệch mạnh hoặc có giá trị cực đoan, như thu nhập, vì một vài người rất giàu có thể kéo trung bình lên xa so với số đông. Nhưng khi cần tính tổng, như tổng doanh thu, thì trung bình vẫn là số đúng, vì trung bình nhân số dòng ra tổng. Với hai đỉnh thì cả hai số đều không đại diện, nên phải tách nhóm.`,
    keyPoints: [
      { text: 'Dùng histogram, phân vị, boxplot', keywords: ['histogram', 'phân vị', 'boxplot'] },
      { text: 'Chú ý đuôi dài, số đỉnh, giá trị lạ', keywords: ['đuôi dài', 'hai đỉnh', 'nhiều đỉnh', 'giá trị mặc định'], weight: 2 },
      { text: 'Trung vị bền với giá trị cực đoan', keywords: ['trung vị', 'median', 'cực đoan'], weight: 2 },
      { text: 'Trung bình cần khi tính tổng, hoặc tách nhóm khi có nhiều đỉnh', keywords: ['tính tổng', 'tổng doanh thu', 'tách nhóm'] },
    ],
    followUps: ['Vì sao boxplot có thể đánh lừa?', 'Làm sao chọn độ rộng khoảng của histogram?'],
    commonMistakes: ['Nói trung vị luôn tốt hơn trung bình.'],
  },
  {
    id: 'iv-eda-distribution-02',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-distribution', 'stats-normal'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Dữ liệu có cần theo phân phối chuẩn không? Khi nào điều đó thực sự quan trọng?',
    referenceAnswer: `Trong đa số trường hợp là không, và câu hỏi cần được làm rõ: cái gì cần chuẩn và để làm gì.

Với hồi quy tuyến tính, đặc trưng không cần chuẩn. Ước lượng OLS vẫn không lệch khi phần dư không chuẩn. Giả định chuẩn của phần dư chủ yếu phục vụ khoảng tin cậy và kiểm định khi mẫu nhỏ. Với mẫu lớn, định lý giới hạn trung tâm khiến trung bình mẫu xấp xỉ chuẩn, dù dữ liệu gốc lệch, trừ khi đuôi quá nặng. Mô hình cây không quan tâm đến phân phối, vì nó chỉ dựa vào thứ tự giá trị.

Điều đó quan trọng khi mẫu nhỏ, khi cần khoảng dự đoán cho từng giá trị, hoặc khi dùng phương pháp giả định chuẩn như Z-score để tìm ngoại lai.

Kiểm tra thì tôi ưu tiên Q-Q plot. Với hàng triệu dòng, kiểm định chuẩn gần như luôn bác bỏ vì dữ liệu thật không bao giờ chuẩn tuyệt đối. Câu hỏi đúng là sai lệch có đủ lớn để đổi kết luận hay không.`,
    keyPoints: [
      { text: 'Đặc trưng không cần chuẩn, giả định áp dụng cho phần dư', keywords: ['phần dư', 'residual'], weight: 2 },
      { text: 'Định lý giới hạn trung tâm với mẫu lớn', keywords: ['giới hạn trung tâm', 'central limit', 'clt'], weight: 2 },
      { text: 'Mô hình cây không phụ thuộc phân phối', keywords: ['mô hình cây', 'thứ tự giá trị'] },
      { text: 'Kiểm định chuẩn quá nhạy với mẫu lớn, nên dùng Q-Q plot', keywords: ['q q plot', 'qq plot', 'quá nhạy', 'luôn bác bỏ'] },
    ],
    followUps: ['Đuôi nặng đến mức nào thì CLT không còn giúp nhiều?', 'Khi nào bạn biến đổi dữ liệu dù mô hình không yêu cầu?'],
    commonMistakes: ['Nói mọi đặc trưng đều phải chuẩn hóa về phân phối chuẩn.', 'Nhầm Standardization với việc làm dữ liệu có phân phối chuẩn.'],
  },
  {
    id: 'iv-eda-skew-kurtosis-01',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-skew-kurtosis'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Skewness và Kurtosis đo gì? Bạn dùng chúng thế nào khi phân tích dữ liệu?',
    referenceAnswer: `Skewness đo mức bất đối xứng. Công thức là trung bình của z³: lũy thừa lẻ giữ dấu nên hai phía bù trừ nhau. Giá trị dương là đuôi kéo về phải, như thu nhập, khi đó trung bình thường lớn hơn trung vị.

Kurtosis là trung bình của z⁴, đo độ nặng của đuôi. Tên gọi "độ nhọn" dễ gây hiểu sai, vì lũy thừa 4 khiến điểm xa tâm chiếm gần hết giá trị, còn đỉnh gần như không đóng góp. Phân phối chuẩn có kurtosis 3. Nhiều phần mềm báo excess kurtosis, tức trừ đi 3, nên tôi luôn kiểm tra định nghĩa đang dùng.

Tôi dùng hai số này để quét nhanh nhiều cột, tìm cột có đuôi dài, rồi vẽ biểu đồ để xác nhận. Vì chúng rất nhạy với vài điểm cực đoan, tôi không kết luận chỉ từ con số. Quyết định sau đó có thể là biến đổi log cho mô hình tuyến tính, dùng trung vị trong báo cáo, hoặc kiểm tra ngoại lai.`,
    keyPoints: [
      { text: 'Skewness đo bất đối xứng', keywords: ['bất đối xứng', 'đuôi phải', 'lệch phải', 'asymmetry'], weight: 2 },
      { text: 'Kurtosis đo đuôi, không phải đỉnh', keywords: ['độ nặng của đuôi', 'đuôi nặng', 'heavy tail', 'không phải đỉnh'], weight: 2 },
      { text: 'Phân biệt kurtosis và excess kurtosis', keywords: ['excess kurtosis', 'trừ 3', 'trừ đi 3'] },
      { text: 'Nhạy với giá trị cực đoan, cần xem biểu đồ', keywords: ['cực đoan', 'vẽ biểu đồ', 'nhạy'] },
    ],
    followUps: ['Skewness bằng 0 có phải là phân phối chuẩn không?', 'Vì sao kurtosis không đổi khi đổi đơn vị?'],
    commonMistakes: ['Nói kurtosis cao nghĩa là đỉnh nhọn.'],
  },
  {
    id: 'iv-eda-skew-kurtosis-02',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-skew-kurtosis', 'eda-distribution'],
    interviewTypes: ['ds'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Một cột có skewness rất cao. Có phải lúc nào cũng nên biến đổi log không?',
    referenceAnswer: `Không. Trước hết tôi hỏi độ lệch đến từ đâu và biến đổi nhằm mục đích gì.

Về nguồn gốc, độ lệch có thể đến từ đuôi dài thật, từ nhiều số 0, hoặc từ lỗi như một giá trị bị nhập sai đơn vị. Với lỗi thì phải sửa, không phải biến đổi. Với nhiều số 0, \`log\` không xác định và một phép biến đổi không làm mất cấu trúc hai nhóm, nên nên tách "có mua không" và "mua bao nhiêu".

Về mục đích, log có ích khi mô hình tuyến tính cần quan hệ theo tỷ lệ, hoặc khi phương sai tăng theo mức giá trị. Mô hình cây thì gần như không cần, vì nó chỉ dựa vào thứ tự giá trị.

Log cũng có cái giá. Diễn giải chuyển từ tuyến tính sang tỷ lệ. Nếu nhãn là cột được log, dự đoán trung bình trên thang log rồi đổi ngược sẽ thấp hơn trung bình gốc, và điều này ảnh hưởng khi cần tổng doanh thu. Vì vậy tôi so sánh trên dữ liệu kiểm định, thay vì biến đổi theo thói quen.`,
    keyPoints: [
      { text: 'Tìm nguồn gốc độ lệch trước', keywords: ['nguồn gốc', 'nhập sai', 'sai đơn vị', 'nhiều số 0'], weight: 2 },
      { text: 'Mô hình cây không cần biến đổi', keywords: ['mô hình cây', 'thứ tự giá trị'], weight: 2 },
      { text: 'Xử lý riêng dữ liệu nhiều số 0', keywords: ['số 0', 'log 1', 'có mua'] },
      { text: 'Biến đổi nhãn gây lệch khi đổi ngược', keywords: ['đổi ngược', 'thấp hơn trung bình', 'retransformation', 'lệch khi đổi'] },
    ],
    followUps: ['Khi nhãn đã được log, làm sao ước lượng tổng doanh thu?', 'Box-Cox và Yeo-Johnson khác gì log?'],
    commonMistakes: ['Biến đổi log mọi cột lệch mà không xét mô hình và nguồn gốc độ lệch.'],
  },
  {
    id: 'iv-eda-correlation-01',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-correlation'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Pearson và Spearman khác nhau thế nào? Khi nào bạn dùng cái nào?',
    referenceAnswer: `Pearson đo mức quan hệ tuyến tính, bằng hiệp phương sai chia cho tích hai độ lệch chuẩn, nên nằm trong khoảng -1 đến 1 và không có đơn vị. Vì tính trên độ lệch so với trung bình, nó rất nhạy với giá trị cực đoan.

Spearman chính là Pearson tính trên hạng. Nó đo quan hệ đơn điệu: một biến tăng thì biến kia luôn tăng hoặc luôn giảm, không cần theo đường thẳng. Giá trị cực đoan chỉ còn là một thứ hạng nên ảnh hưởng ít hơn.

Tôi dùng Pearson khi quan hệ xấp xỉ tuyến tính và điều cần đo đúng là tuyến tính. Tôi dùng Spearman khi dữ liệu lệch, có điểm cực đoan, hoặc là dữ liệu thứ bậc như điểm đánh giá.

Tốt nhất là xem cả hai. Ví dụ Pearson 0,31 mà Spearman 0,82 cho thấy quan hệ mạnh nhưng không tuyến tính, như đường bão hòa của quảng cáo và doanh thu. Sau đó tôi vẽ biểu đồ để hiểu dạng quan hệ.`,
    keyPoints: [
      { text: 'Pearson đo quan hệ tuyến tính', keywords: ['tuyến tính', 'linear'], weight: 2 },
      { text: 'Spearman đo đơn điệu, tính trên hạng', keywords: ['đơn điệu', 'hạng', 'monotonic', 'rank'], weight: 2 },
      { text: 'Pearson nhạy với giá trị cực đoan', keywords: ['cực đoan', 'ngoại lai', 'outlier'] },
      { text: 'Vẽ biểu đồ khi hai hệ số khác xa nhau', keywords: ['biểu đồ', 'scatter', 'khác xa'] },
    ],
    followUps: ['Tương quan giữa hai biến phân loại đo bằng gì?', 'Vì sao một điểm có thể tạo ra r rất cao?'],
    commonMistakes: ['Nói Spearman đo được mọi quan hệ phi tuyến, kể cả không đơn điệu.'],
  },
  {
    id: 'iv-eda-correlation-02',
    topicId: 'analysis',
    category: 'eda-explore',
    conceptIds: ['eda-correlation', 'fe-selection', 'stats-correlation-causation'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Tương quan bằng 0 có nghĩa là hai biến không liên quan không? Dùng tương quan với nhãn để lọc đặc trưng có rủi ro gì?',
    referenceAnswer: `Không. Tương quan chỉ đo một dạng quan hệ. Với \`y = x²\` trên khoảng đối xứng, Pearson bằng 0 dù y phụ thuộc hoàn toàn vào x. Độc lập suy ra tương quan 0, nhưng chiều ngược lại không đúng.

Lọc đặc trưng theo tương quan với nhãn có ba rủi ro chính. Thứ nhất là bỏ sót tương tác: trong mẫu hình XOR, mỗi biến riêng lẻ có tương quan 0 với nhãn nhưng hai biến cùng nhau xác định được nhãn. Thứ hai là bỏ sót quan hệ phi tuyến và tác động chỉ xuất hiện ở một phân khúc. Thứ ba là giữ lại biến dư thừa, vì hai cột gần trùng nhau đều có điểm cao.

Có hai rủi ro nữa về quy trình. Nếu tính trên cả tập test, đó là rò rỉ, và phải tính trong từng fold. Cột tương quan cao bất thường có thể chính là đặc trưng rò rỉ, chứ không phải đặc trưng tốt.

Vì vậy tôi chỉ dùng tương quan như bộ lọc thô khi có quá nhiều cột, sau đó đánh giá bằng hiệu năng trên validation. Muốn kết luận về tác động thì cần thiết kế nhân quả.`,
    keyPoints: [
      { text: 'Tương quan 0 không có nghĩa là độc lập', keywords: ['không có nghĩa là độc lập', 'phi tuyến', 'chiều ngược lại', 'parabol'], weight: 2 },
      { text: 'Bỏ sót tương tác giữa các biến', keywords: ['tương tác', 'xor', 'interaction'], weight: 2 },
      { text: 'Giữ lại biến dư thừa', keywords: ['dư thừa', 'gần trùng', 'redundant'] },
      { text: 'Phải tính trong từng fold để tránh rò rỉ', keywords: ['từng fold', 'rò rỉ', 'chỉ trên train'] },
      { text: 'Tương quan không phải nhân quả', keywords: ['nhân quả', 'causation'] },
    ],
    followUps: ['Mutual Information giải quyết được gì, và có hạn chế gì?', 'Bạn lọc 10.000 cột như thế nào?'],
    commonMistakes: ['Khẳng định tương quan thấp nghĩa là đặc trưng vô dụng.', 'Tính tương quan trên toàn bộ dữ liệu rồi mới cross validation.'],
  },
])
