import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-dq-tabular-01',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-tabular', 'dq-dimensions'],
    interviewTypes: ['ds', 'de'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Trước khi dùng một bảng dữ liệu cho phân tích, bạn kiểm tra những gì?',
    referenceAnswer: `Tôi bắt đầu với cấu trúc, vì mọi phép tính sau đó đều dựa vào cấu trúc.

Đầu tiên là **độ chi tiết và khóa**: một dòng là gì, khóa có duy nhất và không null không. Sau đó là **ràng buộc tham chiếu**: \`customer_id\` trong bảng đơn hàng có nằm trong bảng khách hàng không, vì dòng mồ côi sẽ biến mất khi inner join.

Tiếp theo tôi xem từng cột. **Kiểu dữ liệu:** số lưu thành chuỗi, ngày nhiều định dạng. **Cardinality:** cột hằng số không có thông tin, cột gần như duy nhất là định danh. **Giá trị thiếu:** thiếu bao nhiêu và vì sao, có giá trị thiếu đội lốt như 0 hay 1900-01-01 không. **Khoảng giá trị** có hợp lý không.

Nếu dữ liệu dùng cho mô hình, tôi hỏi thêm mỗi cột có sẵn tại thời điểm dự đoán không, để tránh Data Leakage.

Cuối cùng tôi so tổng với một con số tin cậy, như doanh thu trên báo cáo tài chính, để có thêm bằng chứng từ bên ngoài bảng.`,
    keyPoints: [
      { text: 'Khóa và độ chi tiết', keywords: ['khóa', 'grain', 'độ chi tiết', 'duy nhất'], weight: 3 },
      { text: 'Tham chiếu giữa các bảng', keywords: ['tham chiếu', 'mồ côi', 'foreign key', 'khóa ngoại'], weight: 2 },
      { text: 'Kiểu dữ liệu và cardinality', keywords: ['kiểu dữ liệu', 'cardinality', 'giá trị khác nhau'], weight: 2 },
      { text: 'Giá trị thiếu', keywords: ['thiếu', 'null', 'missing'] },
      { text: 'Leakage', keywords: ['leakage', 'rò rỉ', 'thời điểm dự đoán'] },
    ],
    followUps: ['Join xong số dòng tăng thì bạn làm gì?', 'Cột có cardinality rất cao thì xử lý thế nào?'],
    commonMistakes: ['Chỉ xem tỷ lệ null và kiểu dữ liệu.', 'Không xác định một dòng đại diện cho cái gì.'],
  },
  {
    id: 'iv-dq-tabular-02',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-tabular', 'eda-missing-values'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'MCAR, MAR, MNAR khác nhau thế nào? Vì sao biết cơ chế thiếu lại quan trọng khi đánh giá một bộ dữ liệu?',
    referenceAnswer: `Ba cơ chế này khác nhau ở chỗ việc thiếu phụ thuộc vào điều gì.

**MCAR:** thiếu hoàn toàn ngẫu nhiên, không phụ thuộc gì, như máy đo lỗi ngẫu nhiên. **MAR:** thiếu phụ thuộc vào cột khác đã quan sát được, ví dụ người trẻ ít khai thu nhập hơn. **MNAR:** thiếu phụ thuộc vào chính giá trị bị thiếu, ví dụ người thu nhập rất cao không khai thu nhập.

Điều này quan trọng vì cùng một tỷ lệ thiếu lại có mức độ nguy hiểm khác nhau. Với MCAR, bỏ dòng thiếu chỉ làm giảm cỡ mẫu chứ thường không gây lệch. Với MAR, có thể dùng các cột liên quan để hiệu chỉnh. Với MNAR, cả hai cách trên đều lệch, vì phần dữ liệu đang có khác hệ thống với phần thiếu. Vì vậy thiếu 3% theo MNAR có thể nguy hiểm hơn thiếu 30% theo MCAR.

Điểm khó là MNAR không kiểm chứng được từ dữ liệu quan sát, vì bằng chứng lại nằm ở phần bị thiếu. Tôi phải hỏi nghiệp vụ hoặc so với nguồn khác, như một khảo sát riêng. Khi không chắc, tôi thử vài giả định để xem kết luận có thay đổi nhiều không.`,
    keyPoints: [
      { text: 'MCAR hoàn toàn ngẫu nhiên', keywords: ['mcar', 'hoàn toàn ngẫu nhiên'], weight: 2 },
      { text: 'MAR phụ thuộc vào cột quan sát được', keywords: ['mar', 'cột khác', 'quan sát được'], weight: 2 },
      { text: 'MNAR phụ thuộc vào chính giá trị thiếu', keywords: ['mnar', 'chính giá trị'], weight: 2 },
      { text: 'Cùng tỷ lệ thiếu nhưng mức nguy hiểm khác nhau', keywords: ['gây lệch', 'bias', 'nguy hiểm', 'mức độ'] },
      { text: 'MNAR không kiểm chứng được từ dữ liệu quan sát', keywords: ['không kiểm chứng', 'không chứng minh', 'nghiệp vụ', 'nguồn khác'], weight: 2 },
    ],
    followUps: ['Bạn phân biệt MCAR với MAR bằng cách nào?'],
    commonMistakes: ['Chỉ nói về cách điền giá trị mà không nói về cơ chế.', 'Cho rằng có thể chứng minh MNAR bằng dữ liệu hiện có.'],
  },
  {
    id: 'iv-dq-tabular-03',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-tabular', 'eda-leakage', 'etl-lineage'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bạn nhận một bảng đặc trưng đã được người khác chuẩn bị sẵn để huấn luyện. Làm sao biết bảng này không bị Data Leakage?',
    referenceAnswer: `Leakage không phải lỗi giá trị nên luật dữ liệu không bắt được. Tôi cần biết về thời gian và nguồn gốc của từng cột.

**Xác định thời điểm dự đoán:** mô hình dự đoán vào lúc nào, nhãn được xác định lúc nào. Khoảng giữa hai mốc là phần không được phép dùng.

**Truy nguồn từng cột** bằng lineage: cột được tính từ bảng nào, cột thời gian nào lọc nó. Một cột tổng hợp "90 ngày gần nhất" tính tại ngày chạy batch, thay vì tại ngày dự đoán, là nguồn rò rỉ phổ biến. Bảng hiện trạng chỉ giữ giá trị mới nhất cũng vậy, vì nó chứa cập nhật sau thời điểm dự đoán.

**Kiểm tra thống kê:** huấn luyện từng cột một và xem cột nào mạnh bất thường, ví dụ AUC 0,98. Xem tỷ lệ null của cột theo nhãn: cột chỉ có giá trị ở nhóm đã rời bỏ thường là dấu hiệu được ghi sau sự kiện.

**Kiểm tra kết quả:** điểm cao bất ngờ so với baseline, hoặc rơi mạnh khi chạy thử.

Cuối cùng là cách chia dữ liệu: theo thời gian và theo thực thể, để cùng một khách hàng không nằm ở cả hai tập. Việc sửa thường là xây lại đặc trưng theo point-in-time.`,
    keyPoints: [
      { text: 'Xác định thời điểm dự đoán và nhãn', keywords: ['thời điểm dự đoán', 'có sẵn', 'lúc dự đoán'], weight: 3 },
      { text: 'Truy nguồn cột bằng lineage', keywords: ['lineage', 'nguồn gốc', 'truy nguồn', 'bảng nguồn'], weight: 2 },
      { text: 'Một cột mạnh bất thường', keywords: ['mạnh bất thường', 'từng cột', 'auc'], weight: 2 },
      { text: 'Tỷ lệ null theo nhãn', keywords: ['null theo nhãn', 'theo nhãn'] },
      { text: 'Point-in-time, chia theo thời gian', keywords: ['point in time', 'theo thời gian', 'theo thực thể'] },
    ],
    followUps: ['Đặc trưng lấy từ bảng hiện trạng có vấn đề gì?'],
    commonMistakes: ['Chỉ kiểm tra tương quan với nhãn mà không xem thời gian.', 'Tin rằng tập test chia ngẫu nhiên sẽ phát hiện được leakage.'],
  },
  {
    id: 'iv-dq-time-series-01',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-time-series'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle', 'senior'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Chuỗi thời gian cần kiểm tra gì trước khi đưa vào mô hình dự báo?',
    referenceAnswer: `Tôi kiểm tra theo thứ tự, vì mỗi bước giả định bước trước đã đúng.

**Trục thời gian trước:** tần suất lấy mẫu có đều không, có đổi giữa chừng không. Khoảng trống: tôi tạo danh sách mốc kỳ vọng rồi so với thực tế, vì khoảng trống thường là dòng không tồn tại nên kiểm tra null không thấy, và tôi xem chúng ngẫu nhiên hay trùng lúc quan trọng. Timestamp trùng cho cùng thực thể. Múi giờ: lưu giờ địa phương sẽ có ngày 23 và 25 giờ khi đổi giờ mùa hè, nên tôi chuyển về UTC.

**Giá trị:** đoạn giá trị đóng băng, đột biến, đoạn đã forward-fill.

**Cấu trúc:** Seasonality, dữ liệu có đủ các chu kỳ cần dự báo không. Stationarity qua ADF và KPSS, là hai kiểm định có giả thuyết ngược nhau. Kết quả không dừng không có nghĩa là dữ liệu xấu, nó chỉ quyết định cách biến đổi.

**Cuối cùng và quan trọng nhất là Look-ahead Bias:** mỗi đặc trưng có sẵn tại thời điểm dự đoán không, tính cả độ trễ công bố và số liệu hiệu chỉnh về sau. Ví dụ nhiệt độ thực đo không có khi dự báo thật. Chia train và test theo thời gian, không ngẫu nhiên.`,
    keyPoints: [
      { text: 'Tần suất đều, khoảng trống', keywords: ['tần suất', 'khoảng trống', 'mốc kỳ vọng', 'gap'], weight: 3 },
      { text: 'Timestamp trùng và múi giờ', keywords: ['trùng', 'múi giờ', 'utc', 'đổi giờ', 'timezone'], weight: 2 },
      { text: 'Stationarity và Seasonality', keywords: ['stationarity', 'tính dừng', 'seasonality', 'mùa vụ', 'adf', 'kpss'], weight: 2 },
      { text: 'Look-ahead Bias', keywords: ['look ahead', 'nhìn trước', 'tương lai', 'thời điểm dự đoán'], weight: 3 },
      { text: 'Chia theo thời gian', keywords: ['theo thời gian', 'không ngẫu nhiên', 'backtest'] },
    ],
    followUps: ['Bạn xử lý khoảng trống dài thế nào?', 'Điều gì xảy ra nếu chia train, test ngẫu nhiên?'],
    commonMistakes: ['Chỉ kiểm tra null.', 'Nhảy ngay vào kiểm định tính dừng khi trục thời gian còn sai.', 'Quên độ trễ công bố của dữ liệu.'],
  },
  {
    id: 'iv-dq-time-series-02',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-time-series', 'eda-leakage'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Look-ahead Bias là gì? Backtest cho kết quả rất tốt, làm sao bạn biết kết quả đó có thật không?',
    referenceAnswer: `Look-ahead Bias là khi dữ liệu dùng để dự đoán chứa thông tin mà tại thời điểm đó chưa thể biết. Kết quả backtest vì vậy cao hơn thực tế.

Nguồn rò rỉ thường tinh vi. **Độ trễ công bố:** số liệu tháng 3 đến giữa tháng 4 mới có, nhưng bảng lại gắn với ngày 31/3. **Số liệu được hiệu chỉnh:** kho dữ liệu chỉ giữ bản mới nhất. **Biến ngoại sinh:** dùng nhiệt độ thực đo thay vì nhiệt độ dự báo. **Xử lý dữ liệu:** chuẩn hóa trên toàn chuỗi, nội suy khoảng trống dùng cả giá trị sau đó. **Survivorship Bias:** chỉ giữ công ty còn tồn tại.

Để kiểm tra, tôi lập bảng cho từng đặc trưng: có sẵn từ khi nào, độ trễ bao nhiêu. Tôi dùng dữ liệu point-in-time nếu có. Tôi thử dịch đặc trưng về sau thêm một khoảng: nếu kết quả rơi rất mạnh khi chỉ dịch một ít, đặc trưng có thể đang lấy thông tin ở sát hoặc sau mốc dự đoán.

Sau đó tôi dùng walk-forward validation và chạy song song không dùng thật trong một thời gian. So sánh sai số thực với sai số backtest là bằng chứng cuối cùng.`,
    keyPoints: [
      { text: 'Dữ liệu chứa thông tin chưa thể biết lúc đó', keywords: ['chưa thể biết', 'tương lai', 'nhìn trước'], weight: 3 },
      { text: 'Độ trễ công bố và số liệu hiệu chỉnh', keywords: ['độ trễ công bố', 'hiệu chỉnh', 'point in time'], weight: 2 },
      { text: 'Biến ngoại sinh hoặc xử lý trên toàn chuỗi', keywords: ['nhiệt độ', 'ngoại sinh', 'toàn chuỗi', 'chuẩn hóa', 'nội suy'] },
      { text: 'Walk-forward, chạy song song để kiểm chứng', keywords: ['walk forward', 'chạy song song', 'shadow'], weight: 2 },
    ],
    followUps: ['Dữ liệu point-in-time được lưu thế nào?'],
    commonMistakes: ['Cho rằng chia theo thời gian là đã đủ.'],
  },
  {
    id: 'iv-dq-time-series-03',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-time-series', 'stats-hypothesis', 'dq-drift'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Chuỗi thời gian không dừng có phải là dữ liệu xấu không? ADF và KPSS cho kết quả mâu thuẫn thì bạn làm gì?',
    referenceAnswer: `Không. Tính dừng là một giả định của một số mô hình, không phải tiêu chuẩn chất lượng. Doanh thu có xu hướng tăng là chuyện bình thường. Chuỗi không dừng chỉ cần được biến đổi, ví dụ lấy sai phân hoặc khử xu hướng, hoặc dùng mô hình không cần giả định này.

Hai kiểm định có giả thuyết ngược nhau. ADF có H0 là không dừng, KPSS có H0 là dừng. Kết hợp lại có bốn trường hợp. Cả hai đều nói dừng thì kết luận dừng. Cả hai đều nói không dừng thì kết luận không dừng. KPSS nói dừng, ADF nói không dừng thường gợi ý dừng quanh xu hướng, nên khử xu hướng. KPSS nói không dừng, ADF nói dừng thường gợi ý dừng sau sai phân, nên lấy sai phân.

Tôi cũng không tin mù quáng vào kiểm định. Khoảng trống hoặc đột biến có thể làm kết quả nhiễu, nên phải làm sạch trục thời gian trước. Với chuỗi rất dài, khác biệt nhỏ cũng có ý nghĩa thống kê. Vì vậy tôi luôn vẽ biểu đồ, và xem trung bình trượt để phán đoán.`,
    keyPoints: [
      { text: 'Không dừng không có nghĩa là dữ liệu xấu', keywords: ['không phải', 'giả định', 'không phải xấu', 'biến đổi'], weight: 3 },
      { text: 'ADF và KPSS có giả thuyết ngược nhau', keywords: ['giả thuyết ngược', 'h0', 'adf', 'kpss'], weight: 2 },
      { text: 'Cách xử lý: sai phân, khử xu hướng', keywords: ['sai phân', 'khử xu hướng', 'differencing', 'detrend'], weight: 2 },
      { text: 'Làm sạch và vẽ biểu đồ trước', keywords: ['vẽ', 'biểu đồ', 'trung bình trượt', 'khoảng trống'] },
    ],
    followUps: ['Vì sao chuỗi rất dài dễ bị kết luận là không dừng?'],
    commonMistakes: ['Nhầm giả thuyết H0 của ADF và KPSS.', 'Lấy sai phân cho mọi chuỗi mà không xem lý do.'],
  },
  {
    id: 'iv-dq-text-01',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-text', 'dq-label-quality'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn đánh giá một bộ dữ liệu văn bản để huấn luyện mô hình phân loại như thế nào?',
    referenceAnswer: `Văn bản không có schema bên trong, nên tôi đánh giá bằng phân phối của cả bộ dữ liệu.

**Encoding:** tôi đo tỷ lệ ký tự lạ, vì lỗi bảng mã làm hỏng từ mà không báo. **Ngôn ngữ:** nhận diện để biết tỷ lệ từng ngôn ngữ so với mục tiêu. **Độ dài:** xem văn bản rỗng, quá ngắn hoặc dính mã HTML, và so độ dài giữa các lớp. Nếu thư rác trung bình 40 từ, thư thường 900 từ, mô hình có thể học độ dài chứ không học nội dung.

**Trùng lặp là phần quan trọng nhất:** tìm trùng chính xác bằng hash, gần trùng bằng MinHash, rồi xem có cặp nào nằm ở cả train và test không. Nếu có thì điểm đánh giá bị thổi cao, nên phải chia theo cụm.

**Nhãn:** cho hai người gán chung một mẫu và tính Cohen's Kappa, xem những ca bất đồng để sửa hướng dẫn. **PII:** tìm số điện thoại, email, tên trong câu chữ và che đi trước khi chia sẻ.

Cuối cùng tôi so phân phối chủ đề với dữ liệu thực tế, xem dữ liệu có đại diện không.`,
    keyPoints: [
      { text: 'Encoding, ngôn ngữ, độ dài', keywords: ['encoding', 'bảng mã', 'ngôn ngữ', 'độ dài'], weight: 2 },
      { text: 'Trùng và gần trùng giữa train và test', keywords: ['trùng', 'gần trùng', 'minhash', 'chia theo cụm'], weight: 3 },
      { text: 'Chất lượng nhãn', keywords: ['nhãn', 'kappa', 'đồng thuận'], weight: 2 },
      { text: 'PII', keywords: ['pii', 'thông tin cá nhân', 'che', 'định danh'], weight: 2 },
    ],
    followUps: ['Tìm gần trùng trên 100 triệu văn bản thế nào?', 'Làm sao biết đã che hết PII?'],
    commonMistakes: ['Chỉ tìm trùng chính xác.', 'Bỏ qua PII nằm trong câu chữ.'],
  },
  {
    id: 'iv-dq-image-audio-01',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-image-audio', 'dq-representativeness'],
    interviewTypes: ['ds', 'de'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Mô hình ảnh đạt 99% trên tập test nhưng rất kém khi triển khai. Bạn nghi dữ liệu, vậy kiểm tra những gì?',
    referenceAnswer: `Điểm cao như vậy thường do tập test không thật sự độc lập, hoặc mô hình học sai đối tượng.

**Gần trùng lặp:** nếu ảnh trích từ video hay chụp liên tiếp, chia ngẫu nhiên theo ảnh sẽ đưa các ảnh gần giống nhau vào cả hai tập. Tôi dùng Perceptual Hash hoặc embedding để tìm các cặp này, rồi chia lại theo video, theo bệnh nhân, theo thiết bị. Số mẫu độc lập thật thường nhỏ hơn số ảnh rất nhiều.

**Tín hiệu giả:** mô hình có đang học phông nền, máy chụp hoặc dấu đánh dấu không. Tôi kiểm tra nhãn có tương quan với nguồn không, thử dự đoán nguồn từ ảnh, và dùng bản đồ nhiệt để xem mô hình nhìn vào đâu. Đánh giá bằng cách giữ riêng một nguồn chưa từng thấy.

**Khác biệt so với môi trường thật:** độ phân giải, ánh sáng, góc chụp, nén ảnh. So phân phối embedding của dữ liệu train và production.

**Nhãn:** độ đồng thuận và lỗi nhãn của chính tập test, vì nhãn test sai làm mọi so sánh đều sai.

Tôi bắt đầu từ gần trùng và tín hiệu giả, vì chúng rẻ để kiểm tra nhất và thường giải thích được phần lớn khoảng cách.`,
    keyPoints: [
      { text: 'Gần trùng giữa train và test, chia theo nguồn', keywords: ['gần trùng', 'perceptual hash', 'theo video', 'theo nguồn', 'theo bệnh nhân'], weight: 3 },
      { text: 'Tín hiệu giả như phông nền, máy chụp', keywords: ['tín hiệu giả', 'phông nền', 'máy chụp', 'thiết bị', 'spurious'], weight: 3 },
      { text: 'So phân phối với môi trường triển khai', keywords: ['production', 'triển khai', 'embedding', 'độ phân giải'] },
      { text: 'Lỗi nhãn của tập test', keywords: ['nhãn', 'gán nhãn', 'lỗi nhãn'] },
    ],
    followUps: ['Bạn tìm gần trùng trong 100 triệu ảnh thế nào?'],
    commonMistakes: ['Đề xuất thêm dữ liệu hoặc đổi mô hình trước khi kiểm tra cách chia.'],
  },
  {
    id: 'iv-dq-event-log-01',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-event-log', 'dq-streaming'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Làm sao biết log sự kiện của ứng dụng là đầy đủ và đáng tin, trong khi không thể biết chính xác đáng lẽ phải có bao nhiêu sự kiện?',
    referenceAnswer: `Vì không có con số đúng tuyệt đối, tôi dựa vào nhiều bằng chứng gián tiếp.

**Đối chiếu nguồn khác:** số đơn trong log so với bảng giao dịch. Bảng giao dịch đáng tin hơn nên độ lệch cho biết tỷ lệ mất sự kiện. **Tính nhất quán trong phiên:** mọi \`payment\` phải có \`checkout\` trước đó. Tỷ lệ phiên đứt tăng là dấu hiệu mất dữ liệu. **Theo phiên bản app:** tôi chia các chỉ số theo phiên bản và nền tảng, vì lỗi thường chỉ ở một bản phát hành. **So với lịch sử:** số sự kiện theo giờ so với cùng giờ tuần trước.

Tôi cũng kiểm tra các yếu tố làm lệch số đếm. **Độ trễ:** độ lệch giữa Event Time và Processing Time cho biết khi nào số liệu ổn định, nên chỉ chốt sau cửa sổ đó. **Sự kiện trùng:** tỷ lệ trùng theo \`event_id\`, vì At-least-once có thể gửi lại. **Schema Drift:** trường mới, trường biến mất sau khi phát hành.

Có thể gửi thêm sự kiện định kỳ từ client với số thứ tự, khi thấy số thứ tự bị hụt là biết chắc đã mất sự kiện.`,
    keyPoints: [
      { text: 'Đối chiếu với nguồn đáng tin hơn', keywords: ['đối chiếu', 'bảng giao dịch', 'nguồn khác'], weight: 3 },
      { text: 'Kiểm tra chuỗi trong phiên', keywords: ['phiên', 'chuỗi', 'session', 'trình tự'], weight: 2 },
      { text: 'Event Time, Processing Time, cửa sổ ổn định', keywords: ['event time', 'processing time', 'độ trễ', 'cửa sổ'], weight: 2 },
      { text: 'Sự kiện trùng và Schema Drift', keywords: ['trùng', 'event id', 'schema drift', 'phiên bản'] },
      { text: 'Số thứ tự để phát hiện mất', keywords: ['số thứ tự', 'sequence', 'bị hụt'] },
    ],
    followUps: ['Bạn đặt độ dài cửa sổ ổn định dựa trên gì?'],
    commonMistakes: ['Cho rằng mọi sự kiện đều hợp lệ nghĩa là đầy đủ.'],
  },
  {
    id: 'iv-dq-semi-structured-01',
    topicId: 'dataset-evaluation',
    category: 'dq-types',
    conceptIds: ['dq-semi-structured', 'dw-schema-evolution'],
    interviewTypes: ['ds', 'de'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Dữ liệu JSON từ API đối tác đổ vào Data Lake. Bạn đánh giá chất lượng và phát hiện thay đổi từ đối tác thế nào?',
    referenceAnswer: `Với JSON, cấu trúc nằm trong từng bản ghi, nên tôi đánh giá theo đường dẫn trường.

Mỗi lần nhận dữ liệu, tôi tính cho từng đường dẫn như \`order.items.price\`: tỷ lệ có mặt, tỷ lệ null, và phân bố kiểu dữ liệu. Tôi lưu các số này theo ngày để so với lịch sử. Trường mới xuất hiện, trường tụt từ 99% xuống 60%, hay một trường số xuất hiện dạng chuỗi đều là tín hiệu của Schema Drift.

Tôi phân biệt null, thiếu khóa và mảng rỗng vì chúng mang nghĩa khác nhau, và công cụ đọc thường gộp lại. Với mảng, tôi xem độ dài, vì bung mảng làm số dòng nhân lên.

Về quy trình, tôi giữ lại dữ liệu thô, sau đó dùng schema khai báo trước ở lớp đã làm sạch, thay vì tin suy luận tự động. Bản ghi không qua được sẽ được chuyển vào khu cách ly và đếm, chứ không bị bỏ qua âm thầm. Nếu có thể, tôi thỏa thuận với đối tác bằng hợp đồng dữ liệu về các trường bắt buộc, để lỗi được phát hiện ở phía gửi.`,
    keyPoints: [
      { text: 'Theo dõi tỷ lệ có mặt và kiểu theo đường dẫn', keywords: ['đường dẫn', 'tỷ lệ có mặt', 'theo trường', 'path'], weight: 3 },
      { text: 'So với lịch sử để phát hiện Schema Drift', keywords: ['lịch sử', 'schema drift', 'trường mới', 'thay đổi'], weight: 2 },
      { text: 'Phân biệt null, thiếu khóa, mảng rỗng', keywords: ['thiếu khóa', 'mảng rỗng', 'null'], weight: 2 },
      { text: 'Khai báo schema, cách ly bản ghi lỗi', keywords: ['khai báo', 'cách ly', 'quarantine', 'dead letter'] },
      { text: 'Hợp đồng dữ liệu', keywords: ['hợp đồng', 'data contract', 'thỏa thuận'] },
    ],
    followUps: ['Khi nào nên chặn dữ liệu, khi nào chỉ cảnh báo?'],
    commonMistakes: ['Dựa vào suy luận schema tự động cho luồng quan trọng.'],
  },
])
