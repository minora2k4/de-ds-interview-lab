import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-dq-scale-strategy-01',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-scale-strategy', 'dq-approximate', 'dq-incremental', 'dq-sampling'],
    interviewTypes: ['ds', 'de', 'bigdata'],
    levels: ['junior', 'middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Bảng 10 TB thì kiểm tra chất lượng thế nào mà không quét toàn bộ?',
    referenceAnswer: `Nguyên tắc của tôi là mỗi luật dùng tầng rẻ nhất đủ để trả lời nó, vì phần lớn câu hỏi không cần đọc mọi dòng. Tôi đi qua 5 tầng từ rẻ đến đắt.

**Tầng 1, metadata:** không đọc dữ liệu. Footer Parquet có số dòng, thường có min, max và số null theo row group, cùng dung lượng và thời gian ghi. Trả lời được độ tươi và số dòng. Cần lưu ý thống kê cột là tùy chọn, và thiếu \`null_count\` không có nghĩa là 0.

**Tầng 2, theo Partition:** chỉ tính chỉ số cho Partition mới, lưu lại, so với cùng thứ các tuần trước. Bảng 10 TB chia theo ngày thường chỉ phải đọc khoảng 10 GB mỗi ngày. Đây là chỗ bắt được phần lớn lỗi.

**Tầng 3, xấp xỉ:** HyperLogLog cho số giá trị khác nhau, Count-Min Sketch cho key phổ biến, t-digest cho phân vị. Bộ nhớ nhỏ, và gộp được giữa các Partition.

**Tầng 4, lấy mẫu phân tầng:** cho kiểm tra đắt như đối chiếu nguồn gốc. Rẻ nhưng dễ bỏ sót lỗi hiếm.

**Tầng 5, quét toàn bộ:** chỉ cho luật quan trọng, như khóa chính ở bảng cốt lõi, theo lịch thưa, và chỉ đọc cột cần thiết. HyperLogLog sai số 1% không chứng minh được khóa không trùng.`,
    keyPoints: [
      { text: 'Metadata, footer Parquet', keywords: ['metadata', 'footer', 'parquet', 'số dòng'], weight: 3 },
      { text: 'Chỉ số theo Partition, tính tăng dần, so với lịch sử', keywords: ['theo partition', 'tăng dần', 'partition mới', 'lịch sử', 'incremental'], weight: 3 },
      { text: 'Thuật toán xấp xỉ', keywords: ['hyperloglog', 'count min', 't digest', 'xấp xỉ', 'sketch', 'hll'], weight: 2 },
      { text: 'Lấy mẫu phân tầng và điểm yếu', keywords: ['lấy mẫu', 'phân tầng', 'sampling', 'lỗi hiếm'], weight: 2 },
      { text: 'Quét toàn bộ chỉ cho luật quan trọng', keywords: ['quét toàn bộ', 'full scan', 'khóa chính', 'luật quan trọng'], weight: 2 },
    ],
    followUps: ['Bạn kiểm tra tính duy nhất của khóa chính thế nào?', 'Dữ liệu đến trễ làm thay đổi Partition cũ thì sao?', 'Footer Parquet có giới hạn gì?'],
    commonMistakes: ['Chỉ trả lời là lấy mẫu.', 'Dùng HyperLogLog để chứng minh khóa không trùng.', 'Không nói đến metadata và chia Partition.'],
  },
  {
    id: 'iv-dq-scale-strategy-02',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-scale-strategy', 'dq-tools', 'dq-metrics'],
    interviewTypes: ['ds', 'de', 'bigdata', 'system-design'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Thiết kế hệ thống kiểm tra chất lượng cho kho 2 PB có 5.000 bảng, với ngân sách kiểm tra không vượt quá 5% chi phí tính toán.',
    referenceAnswer: `Ngân sách cố định trong khi dữ liệu tăng, nên chi phí kiểm tra phải tỷ lệ với dữ liệu mới, không tỷ lệ với tổng dữ liệu.

**Phân hạng:** hạng 1 khoảng vài chục bảng phục vụ tài chính và mô hình sản xuất, hạng 2 là bảng dùng chung, còn lại là hạng 3. Hạng quyết định số tầng được dùng.

**Kiểm tra nền cho mọi bảng:** độ tươi, số dòng, thay đổi schema, lấy từ metadata và table format, chi phí gần như bằng 0, không cần ai viết luật. Vậy là 5.000 bảng đã có bao phủ tối thiểu.

**Kiểm tra theo Partition cho hạng 1 và 2:** một dịch vụ chạy sau mỗi lần nạp, tính chỉ số trên Partition mới, lưu vào kho chỉ số, so với lịch sử. Tôi dùng lại các lần quét bằng cách gom nhiều luật vào cùng một truy vấn, như cách Deequ làm, và lưu sketch để gộp.

**Kiểm tra đắt cho hạng 1:** quét khóa toàn bảng theo tuần, lấy mẫu đối chiếu nguồn gốc theo tháng.

**Khi có lỗi:** mô hình Write-Audit-Publish với hạng 1, cảnh báo với hạng 2. Mỗi bảng có người sở hữu.

**Kiểm soát chi phí:** gắn nhãn chi phí cho mọi job kiểm tra, có ngân sách theo đội, và loại luật không bao giờ phát hiện lỗi. Tôi đo thời gian phát hiện và tỷ lệ cảnh báo giả.`,
    keyPoints: [
      { text: 'Chi phí phải tỷ lệ với dữ liệu mới', keywords: ['dữ liệu mới', 'tỷ lệ', 'tăng dần', 'partition mới'], weight: 2 },
      { text: 'Phân hạng bảng', keywords: ['phân hạng', 'hạng', 'tier', 'bảng quan trọng'], weight: 3 },
      { text: 'Kiểm tra nền từ metadata cho mọi bảng', keywords: ['metadata', 'độ tươi', 'kiểm tra nền', 'schema'], weight: 2 },
      { text: 'Kho chỉ số và so với lịch sử', keywords: ['kho chỉ số', 'lịch sử', 'bất thường', 'sketch'], weight: 2 },
      { text: 'Cơ chế xử lý lỗi và người sở hữu', keywords: ['write audit publish', 'cách ly', 'sở hữu', 'owner', 'cảnh báo'] },
      { text: 'Kiểm soát chi phí, loại bỏ luật vô dụng', keywords: ['ngân sách', 'chi phí', 'loại luật', 'gắn nhãn'] },
    ],
    followUps: ['Bạn xử lý thế nào khi một đội không chịu viết luật?', 'Khi nào cho phép chặn pipeline?'],
    commonMistakes: ['Áp dụng cùng một bộ kiểm tra cho mọi bảng.', 'Không tính đến việc chi phí tăng theo thời gian.'],
  },
  {
    id: 'iv-dq-scale-strategy-03',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-scale-strategy', 'dq-tabular', 'spark-shuffle'],
    interviewTypes: ['ds', 'de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Bạn kiểm tra tính duy nhất của khóa chính trên bảng 100 tỷ dòng như thế nào? Chi phí nằm ở đâu và giảm bằng cách nào?',
    referenceAnswer: `Đếm chính xác cần gom các giá trị trùng về cùng một nơi, nên chi phí chính là một lần shuffle trên cột khóa, cùng lượng bộ nhớ để theo dõi các giá trị. Đọc từ định dạng cột giúp chỉ đọc cột khóa, nhưng không tránh được shuffle.

Không dùng được cách rẻ. HyperLogLog sai số 1% trên 100 tỷ tương đương sai lệch 1 tỷ, nên không thấy vi phạm nhỏ hơn. Lấy mẫu từng dòng thì mẫu 1% chỉ giữ 0,01% số cặp trùng. Tuy nhiên, hai cách này vẫn hữu ích như tín hiệu sớm. Lấy mẫu theo hash của khóa giữ được các cặp, nên ước lượng được tỷ lệ trùng rất rẻ.

Để giảm chi phí kiểm tra chính xác, tôi tận dụng tính chất chỉ thêm. Mỗi ngày chỉ kiểm tra: khóa mới có trùng trong chính nó không, và khóa mới có trùng với khóa cũ không, bằng anti-join với bảng khóa đã lưu sẵn. Bloom Filter giúp lọc nhanh các khóa chắc chắn chưa xuất hiện. Nếu khóa có thành phần ngày, chỉ cần xét trong Partition liên quan.

Còn một lần quét toàn bộ theo lịch thưa để bắt các trường hợp bị bỏ sót. Với bảng ít quan trọng, tôi chấp nhận tín hiệu xấp xỉ.`,
    keyPoints: [
      { text: 'Chi phí là shuffle trên cột khóa', keywords: ['shuffle', 'gom', 'cột khóa'], weight: 2 },
      { text: 'HLL và lấy mẫu từng dòng không chứng minh được', keywords: ['sai số', 'hyperloglog', 'không chứng minh', 'số cặp'], weight: 3 },
      { text: 'Lấy mẫu theo hash của khóa', keywords: ['hash của khóa', 'theo hash'] },
      { text: 'Chỉ so khóa mới với khóa cũ', keywords: ['khóa mới', 'khóa cũ', 'anti join', 'bloom filter', 'chỉ thêm'], weight: 3 },
      { text: 'Quét toàn bộ theo lịch thưa', keywords: ['lịch thưa', 'định kỳ', 'theo tuần', 'theo tháng'] },
    ],
    followUps: ['Bảng được cập nhật thay vì chỉ thêm thì sao?'],
    commonMistakes: ['Nói dùng approx_count_distinct là đủ.'],
  },
  {
    id: 'iv-dq-approximate-01',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-approximate'],
    interviewTypes: ['ds', 'de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'HyperLogLog hoạt động thế nào? Vì sao có thể ước lượng hàng tỷ giá trị khác nhau chỉ với vài KB?',
    referenceAnswer: `Ý tưởng dựa trên xác suất của hash. Nếu băm giá trị thành chuỗi bit đều, chuỗi bắt đầu bằng k số 0 có xác suất 2 mũ âm k. Nếu đã thấy một chuỗi có 20 số 0 đầu, có lẽ đã có khoảng một triệu giá trị khác nhau. Điều quan trọng là chỉ cần **nhớ một con số nhỏ**, là số 0 dài nhất, chứ không nhớ giá trị.

Một lần đo thì rất nhiễu vì may rủi. HyperLogLog chia thành m register dựa theo vài bit đầu của hash, mỗi register giữ số 0 dài nhất của riêng nó, rồi lấy **trung bình điều hòa** để giảm ảnh hưởng của giá trị quá lớn. Sai số chuẩn tương đối xấp xỉ \`1,04 / căn(m)\`. Với m bằng 16.384 thì sai số khoảng 0,81%, và với 6 bit mỗi register, tổng chỉ khoảng 12 KB.

Vì mỗi register chỉ cần vài bit để lưu số rất lớn, bộ nhớ gần như không tăng theo số giá trị. Giá trị trùng có cùng hash nên không làm đổi gì. Hai sketch gộp được bằng max theo từng register, nên sketch theo ngày gộp thành tháng mà không quét lại.

Đánh đổi là không liệt kê được giá trị, phép giao có sai số cao, và không chứng minh được khóa duy nhất. Spark dùng HyperLogLog++ trong \`approx_count_distinct\`, với \`rsd\` mặc định 0,05.`,
    keyPoints: [
      { text: 'Hash đều, số 0 đầu cho biết số giá trị', keywords: ['hash', 'số 0', 'băm', 'leading zero'], weight: 3 },
      { text: 'Chia m register, trung bình điều hòa', keywords: ['register', 'trung bình điều hòa', 'harmonic'], weight: 2 },
      { text: 'Sai số 1,04/căn(m)', keywords: ['1,04', '1.04', 'căn', 'sai số'], weight: 2 },
      { text: 'Gộp bằng max theo register', keywords: ['gộp', 'max', 'merge'], weight: 2 },
      { text: 'Giới hạn: không liệt kê được, không chứng minh khóa duy nhất', keywords: ['không liệt kê', 'không chứng minh', 'phép giao'] },
    ],
    followUps: ['Muốn giảm sai số một nửa thì tốn thêm bao nhiêu bộ nhớ?', 'Vì sao lấy trung bình điều hòa?'],
    commonMistakes: ['Nói HyperLogLog lưu một mẫu các giá trị.', 'Nhầm với Bloom Filter.'],
  },
  {
    id: 'iv-dq-approximate-02',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-approximate', 'spark-data-skew'],
    interviewTypes: ['ds', 'de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'HyperLogLog, Count-Min Sketch và t-digest giải quyết bài toán gì? Trong đánh giá dữ liệu, bạn dùng mỗi loại vào việc nào?',
    referenceAnswer: `Cả ba đều đổi một sai số nhỏ lấy bộ nhớ rất nhỏ, nhưng trả lời ba câu hỏi khác nhau.

**HyperLogLog: có bao nhiêu giá trị khác nhau?** Tôi dùng để theo dõi cardinality và số người dùng theo ngày. Nếu số này tăng 40% đột ngột, có thể nguồn đã đổi cách mã hóa ID. Sai số xấp xỉ 1,04 / căn(m).

**Count-Min Sketch: giá trị này xuất hiện bao nhiêu lần?** Tôi dùng để tìm key rất phổ biến, như bot, hoặc key sẽ gây Data Skew khi join. Điểm cần nhớ là nó chỉ ước lượng thừa, và sai số tỷ lệ với tổng số lần đếm, nên kém với giá trị hiếm.

**t-digest: phân vị q là bao nhiêu?** Tôi dùng để theo dõi p50 và p99 của số tiền hay độ trễ, vì trung bình che đi lỗi ở đuôi. Nó chính xác nhất ở đuôi phân phối, nhưng chưa có cận sai số chặt chẽ.

Điểm chung là cả ba đều gộp được giữa các Partition, nên hợp với kiểm tra tăng dần.

Điểm chung thứ hai là không dùng được khi cần số đúng tuyệt đối, như đối soát tài chính, hay chứng minh khóa không trùng.`,
    keyPoints: [
      { text: 'HLL đếm giá trị khác nhau', keywords: ['hyperloglog', 'giá trị khác nhau', 'cardinality', 'distinct'], weight: 2 },
      { text: 'CMS ước lượng tần suất, chỉ ước lượng thừa', keywords: ['count min', 'tần suất', 'ước lượng thừa', 'key phổ biến'], weight: 2 },
      { text: 't-digest ước lượng phân vị, tốt ở đuôi', keywords: ['t digest', 'phân vị', 'đuôi', 'p99'], weight: 2 },
      { text: 'Gộp được giữa các Partition', keywords: ['gộp', 'merge', 'partition'] },
      { text: 'Không dùng khi cần đúng tuyệt đối', keywords: ['tuyệt đối', 'đối soát', 'không chứng minh'] },
    ],
    followUps: ['Vì sao Count-Min Sketch không đếm thiếu?'],
    commonMistakes: ['Dùng Count-Min Sketch để đếm số giá trị khác nhau.'],
  },
  {
    id: 'iv-dq-approximate-03',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-approximate', 'dq-incremental'],
    interviewTypes: ['ds', 'de', 'bigdata'],
    levels: ['middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Bạn cần báo cáo số người dùng khác nhau theo tháng từ dữ liệu ngày. Vì sao không cộng số theo ngày được, và bạn làm thế nào với bảng hàng trăm tỷ dòng?',
    referenceAnswer: `Số giá trị khác nhau không cộng được, vì một người hoạt động trong nhiều ngày sẽ bị đếm nhiều lần. Do đó tổng 30 ngày có thể lớn hơn nhiều so với số thật.

Cách chính xác là đọc lại toàn bộ dữ liệu của tháng, shuffle theo \`user_id\` rồi đếm. Với hàng trăm tỷ dòng, việc này đắt và phải chạy lại mỗi khi muốn đổi khoảng thời gian.

Tôi dùng HyperLogLog. Mỗi ngày, tôi tính một sketch từ Partition mới và lưu lại, mỗi sketch chỉ vài KB. Số của tháng được tính bằng cách gộp 30 sketch, lấy max theo từng register. Đây đúng là phép hợp, nên kết quả tương đương với tính trực tiếp trên toàn bộ tháng, mà không cần đọc lại dữ liệu. Tôi cũng có thể xem theo tuần hay bất kỳ khoảng nào.

Về độ chính xác, tôi chọn số register theo yêu cầu. Sai số xấp xỉ 1,04 / căn(m), nên 16.384 register cho khoảng 0,81%. Trong Spark, \`rsd\` mặc định 0,05 là khá thô, nên tôi có thể đặt nhỏ hơn. Đủ cho báo cáo xu hướng, nhưng nếu số đó dùng để thanh toán với đối tác, tôi sẽ tính chính xác.`,
    keyPoints: [
      { text: 'Số khác nhau không cộng được vì đếm lặp', keywords: ['không cộng', 'đếm nhiều lần', 'bị đếm', 'nhiều ngày'], weight: 3 },
      { text: 'Lưu sketch theo ngày', keywords: ['sketch', 'hyperloglog', 'theo ngày', 'hll'], weight: 2 },
      { text: 'Gộp sketch bằng max theo register', keywords: ['gộp', 'max', 'phép hợp', 'merge'], weight: 2 },
      { text: 'Chọn độ chính xác theo mục đích', keywords: ['register', 'rsd', 'sai số', 'độ chính xác'] },
    ],
    followUps: ['Có tính được số người dùng chỉ có ở tháng này mà không có ở tháng trước không?'],
    commonMistakes: ['Cộng trực tiếp số theo ngày.'],
  },
  {
    id: 'iv-dq-sampling-01',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-sampling', 'eda-sampling'],
    interviewTypes: ['ds', 'de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Khi nào nên đánh giá chất lượng bằng lấy mẫu, và khi nào lấy mẫu là không đủ? Làm sao chọn cỡ mẫu?',
    referenceAnswer: `Lấy mẫu hợp nhất khi mỗi dòng kiểm tra rất đắt, ví dụ phải đối chiếu với hóa đơn gốc hoặc cần con người xem, hoặc khi cần ước lượng nhanh tỷ lệ lỗi.

Về cỡ mẫu, sai số gần như không phụ thuộc vào kích thước bảng, chỉ phụ thuộc vào cỡ mẫu và tỷ lệ lỗi: \`1,96 x căn(p(1-p)/n)\`. Ước lượng tỷ lệ 1% với sai số 0,2% cần khoảng 10.000 dòng, dù bảng có bao nhiêu dòng đi nữa.

Lấy mẫu không đủ trong ba trường hợp. **Lỗi hiếm:** không thấy lỗi trong n dòng chỉ cho cận trên khoảng 3/n. Với 1 triệu dòng, trên bảng 10 tỷ dòng vẫn có thể có 30.000 dòng lỗi. **Trùng lặp và tham chiếu:** phải chọn trúng cả hai dòng, nên mẫu 1% chỉ giữ 0,01% số cặp. Cách sửa là lấy mẫu theo hash của khóa. **Luật đúng tuyệt đối:** như đối soát tiền.

Tôi phân tầng theo nguồn và theo mức rủi ro, vì lỗi thường tập trung ở một nguồn, và lấy mẫu ngẫu nhiên có thể không chạm đến nó. Lấy mẫu theo tệp thì rẻ, nhưng vì các dòng tương quan nên sai số thật cao hơn công thức.`,
    keyPoints: [
      { text: 'Hợp khi kiểm tra từng dòng đắt, như đối chiếu thủ công', keywords: ['đối chiếu', 'con người', 'accuracy', 'đắt'], weight: 2 },
      { text: 'Sai số phụ thuộc cỡ mẫu, không phụ thuộc kích thước bảng', keywords: ['cỡ mẫu', 'không phụ thuộc', 'căn'], weight: 3 },
      { text: 'Yếu với lỗi hiếm, quy tắc 3/n', keywords: ['lỗi hiếm', '3 n', 'cận trên'], weight: 2 },
      { text: 'Yếu với trùng lặp, dùng hash của khóa', keywords: ['trùng lặp', 'hash của khóa', 'cả hai dòng'], weight: 2 },
      { text: 'Phân tầng theo nguồn', keywords: ['phân tầng', 'theo nguồn', 'stratified'] },
    ],
    followUps: ['Lấy mẫu theo tệp có vấn đề gì?'],
    commonMistakes: ['Cho rằng bảng lớn gấp 100 lần thì mẫu phải lớn gấp 100 lần.'],
  },
  {
    id: 'iv-dq-incremental-01',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-incremental', 'dq-metrics'],
    interviewTypes: ['ds', 'de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Kiểm tra tăng dần theo Partition hoạt động thế nào? Nó không phát hiện được những gì?',
    referenceAnswer: `Sau mỗi lần nạp, tôi chỉ tính chỉ số trên Partition mới: số dòng, tỷ lệ null, phân vị, sketch. Kết quả được lưu vào kho chỉ số, rồi so với cùng thứ của các tuần trước để phát hiện bất thường. Nếu ổn thì dữ liệu được công bố, nếu không thì cách ly và cảnh báo.

Lợi ích có hai phần. Chi phí tỷ lệ với dữ liệu mới, không phải kích thước bảng. Và lỗi không bị pha loãng: một ngày mất nửa dữ liệu thay đổi rất ít trên tổng 3 năm, nhưng rất rõ khi xem riêng ngày đó.

Muốn có chỉ số cho cả bảng, tôi gộp từ các Partition: số dòng và số null thì cộng, tỷ lệ thì phải cộng tử và mẫu, số giá trị khác nhau thì gộp HyperLogLog.

Nó không phát hiện được: **khóa trùng giữa các ngày**, vì xem từng ngày thì không thấy. **Dòng cũ bị sửa,** vì cách tính giả định dữ liệu chỉ thêm. **Dữ liệu đến trễ** làm chỉ số cũ lỗi thời, nên phải tính lại Partition bị ảnh hưởng. **Xấu đi rất chậm,** vì lịch sử trượt theo. Vì vậy vẫn cần quét toàn bộ định kỳ cho bảng quan trọng.`,
    keyPoints: [
      { text: 'Tính chỉ số trên Partition mới, lưu, so với lịch sử', keywords: ['partition mới', 'lưu', 'lịch sử', 'cùng thứ'], weight: 3 },
      { text: 'Chi phí theo dữ liệu mới, không pha loãng lỗi', keywords: ['dữ liệu mới', 'pha loãng', 'chi phí'], weight: 2 },
      { text: 'Gộp chỉ số: tỷ lệ phải cộng tử mẫu, distinct gộp sketch', keywords: ['tử', 'mẫu', 'gộp', 'hyperloglog'] },
      { text: 'Không thấy lỗi xuyên Partition, dòng cũ bị sửa', keywords: ['giữa các ngày', 'xuyên partition', 'bị sửa', 'cập nhật', 'đến trễ'], weight: 3 },
    ],
    followUps: ['Kho chỉ số nên lưu những gì?'],
    commonMistakes: ['Lấy trung bình tỷ lệ của từng Partition để ra tỷ lệ cả bảng.'],
  },
  {
    id: 'iv-dq-streaming-01',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-streaming', 'dq-event-log'],
    interviewTypes: ['ds', 'de', 'bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Đánh giá chất lượng của luồng dữ liệu khác gì so với batch? Bạn thiết kế các lớp kiểm tra thế nào?',
    referenceAnswer: `Khác biệt cốt lõi là luồng không có điểm kết thúc, nên không có "toàn bộ dữ liệu" để kiểm tra, và kết quả chỉ tạm thời do dữ liệu đến trễ. Kiểm tra cũng phải chịu giới hạn về độ trễ và trạng thái.

Tôi chia thành các lớp theo chi phí. **Lớp 1, từng bản ghi trên đường chính:** schema, trường bắt buộc, miền giá trị. Không cần trạng thái. Bản ghi lỗi đi vào Dead Letter Queue, để luồng vẫn chạy và không mất dữ liệu.

**Lớp 2, theo cửa sổ, tách khỏi đường chính:** số sự kiện mỗi phút, tỷ lệ null, độ trễ giữa Event Time và Processing Time, so với cùng khung giờ tuần trước. Tôi dùng sketch để giữ bộ nhớ ổn định.

**Lớp 3, sau Watermark:** mới kết luận về độ đầy đủ của cửa sổ. Tôi đo số sự kiện bị loại vì quá trễ, để biết Watermark có hợp lý không.

**Lớp 4, đối soát với batch:** so với bản ghi đầy đủ hơn, là cách duy nhất phát hiện sự kiện đã mất.

Tính duy nhất toàn lịch sử là không khả thi, nên chỉ khử trùng trong một khoảng thời gian có giới hạn.`,
    keyPoints: [
      { text: 'Không có điểm kết thúc, kết quả tạm thời', keywords: ['không có điểm kết thúc', 'tạm thời', 'đến trễ', 'không kết thúc'], weight: 2 },
      { text: 'Kiểm tra từng bản ghi, Dead Letter Queue', keywords: ['từng bản ghi', 'dead letter', 'dlq', 'schema'], weight: 3 },
      { text: 'Chỉ số theo cửa sổ', keywords: ['cửa sổ', 'window', 'mỗi phút'], weight: 2 },
      { text: 'Watermark', keywords: ['watermark'], weight: 2 },
      { text: 'Đối soát với batch', keywords: ['đối soát', 'batch', 'reconcile'] },
    ],
    followUps: ['Bạn chọn thời gian Watermark thế nào?'],
    commonMistakes: ['Đặt kiểm tra cần trạng thái lớn ngay trên đường xử lý chính.'],
  },
  {
    id: 'iv-dq-tools-01',
    topicId: 'dataset-evaluation',
    category: 'dq-scale',
    conceptIds: ['dq-tools', 'etl-validation'],
    interviewTypes: ['ds', 'de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'So sánh Deequ, Great Expectations, Soda và dbt tests. Bạn chọn công cụ nào, dựa trên tiêu chí gì?',
    referenceAnswer: `Tôi chọn theo nơi dữ liệu đang được xử lý, và ai sẽ viết luật, chứ không theo số tính năng.

**Deequ** là thư viện trên Spark, dịch ràng buộc thành truy vấn tổng hợp. Mạnh với dữ liệu rất lớn, có tính tăng dần bằng trạng thái, phát hiện bất thường và gợi ý ràng buộc. Hợp khi đã có cụm Spark.

**Great Expectations** là khung Python với thư viện Expectation lớn, chạy qua Checkpoint và sinh Data Docs dễ đọc. Hợp khi đội mạnh về Python và cần tài liệu chia sẻ.

**Soda** viết hợp đồng dữ liệu bằng YAML từ bản 4, chạy trên nhiều nguồn dữ liệu. Hợp khi có nhiều nền tảng, và người viết luật ít viết code.

**dbt tests** là truy vấn SQL tìm dòng vi phạm, không có dòng nào thì đạt. Có sẵn \`unique\`, \`not_null\`, \`accepted_values\`, \`relationships\`. Hợp nhất khi đã dùng dbt. Cần lưu ý test mặc định quét cả bảng, và \`relationships\` bỏ qua NULL.

Có thể dùng nhiều công cụ cho các lớp khác nhau. Dù chọn công cụ nào, chúng chỉ chạy các luật đã viết, nên luật nào đáng viết và xử lý ra sao vẫn là việc của đội.`,
    keyPoints: [
      { text: 'Chọn theo nền tảng đang dùng và người viết luật', keywords: ['nền tảng', 'nơi dữ liệu', 'kỹ năng', 'người viết'], weight: 3 },
      { text: 'Deequ trên Spark, dữ liệu rất lớn', keywords: ['deequ', 'spark'], weight: 2 },
      { text: 'Great Expectations với Expectation, Data Docs', keywords: ['great expectations', 'expectation', 'data docs', 'gx'], weight: 2 },
      { text: 'Soda với YAML, nhiều nguồn', keywords: ['soda', 'yaml', 'data contract', 'hợp đồng'] },
      { text: 'dbt tests là SQL, gắn với pipeline', keywords: ['dbt', 'sql', 'dòng vi phạm', 'unique'], weight: 2 },
    ],
    followUps: ['Công cụ này có phát hiện được Selection Bias không?'],
    commonMistakes: ['Chỉ nêu tính năng mà không có tiêu chí chọn.', 'Cho rằng có công cụ là có chất lượng dữ liệu.'],
  },
])
