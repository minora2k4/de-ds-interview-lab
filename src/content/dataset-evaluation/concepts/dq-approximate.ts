import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-approximate',
  summary:
    'HyperLogLog ước lượng số giá trị khác nhau với sai số xấp xỉ 1,04/căn(m). Count-Min Sketch ước lượng tần suất và chỉ ước lượng thừa. t-digest ước lượng phân vị, chính xác nhất ở đuôi. Chúng dùng bộ nhớ nhỏ và gộp được giữa các Partition.',
  tags: ['HyperLogLog', 'Count-Min Sketch', 't-digest', 'First Principles'],
  related: ['dq-scale-strategy', 'dq-incremental', 'dq-sampling', 'dq-profiling', 'spark-performance', 'spark-data-skew'],
  sections: {
    definition: `**Approximate Algorithms (Thuật toán xấp xỉ)**, hay **Sketch**, tóm tắt dữ liệu lớn bằng một cấu trúc rất nhỏ, đổi một sai số nhỏ lấy tiết kiệm lớn về bộ nhớ.

- **HyperLogLog (HLL):** ước lượng số giá trị khác nhau.
- **Count-Min Sketch (CMS):** ước lượng tần suất của từng giá trị.
- **t-digest:** ước lượng phân vị như p50, p99.`,

    origin: `Đếm chính xác số giá trị khác nhau cần nhớ các giá trị đã thấy, nên bộ nhớ tăng theo số giá trị khác nhau. Với hàng tỷ giá trị, cách này cần nhiều GB và phải shuffle. Tệ hơn, số liệu khác nhau **không cộng được**: số người dùng của tháng không bằng tổng số người dùng theo ngày, nên phải quét lại.

Sketch khắc phục cả hai điều này. Flajolet và cộng sự công bố HyperLogLog năm 2007, Cormode và Muthukrishnan công bố Count-Min Sketch năm 2005, còn Dunning và Ertl phát triển t-digest cho phân vị.`,

    whyUse: `Trong đánh giá dữ liệu, ta thường cần **xu hướng** chứ không cần con số tuyệt đối: cardinality có tăng đột biến không, có key nào chiếm phần lớn không, p99 có đổi không. Sai số nhỏ là chấp nhận được, trong khi tiết kiệm có thể hàng nghìn lần.`,

    mechanism: `**HyperLogLog.** Băm mỗi giá trị thành một chuỗi bit ngẫu nhiên đều. Chuỗi bắt đầu bằng 10 số 0 có xác suất 1/1024, nên nếu đã thấy một chuỗi như vậy, có lẽ đã có khoảng 1024 giá trị khác nhau. Một lần quan sát thì nhiễu rất lớn, nên HLL chia thành **m register**, mỗi register giữ số 0 đầu dài nhất, rồi lấy trung bình điều hòa để giảm nhiễu.

- **Sai số chuẩn tương đối xấp xỉ \`1,04 / căn(m)\`.** Với m = 16.384, sai số khoảng 0,81%, và chỉ tốn khoảng 12 KB khi mỗi register dùng 6 bit.
- **Trùng lặp không ảnh hưởng:** giá trị giống nhau có cùng hash, nên không làm thay đổi register.
- **Gộp được:** lấy giá trị lớn nhất theo từng register. Sketch theo ngày gộp thành tháng mà không cần quét lại.

Trong Spark, \`approx_count_distinct\` dùng HyperLogLog++, có \`rsd\` mặc định là 0,05. Tài liệu cũng cho biết nếu \`rsd\` dưới 0,01 thì \`count_distinct\` hiệu quả hơn.

**Count-Min Sketch.** Gồm d hàng, mỗi hàng w ô, với d hàm băm. Mỗi giá trị tăng một ô trên mỗi hàng. Khi truy vấn, lấy **giá trị nhỏ nhất** trong d ô đó. Vì va chạm chỉ cộng thêm, **CMS không bao giờ ước lượng thiếu, chỉ ước lượng thừa** (với luồng chỉ tăng). Với xác suất ít nhất 1 - delta, sai số không vượt quá \`eps x N\`, N là tổng số lần đếm.

Sai số tỷ lệ với N, nên CMS **tốt cho giá trị phổ biến, kém cho giá trị hiếm**. Với N bằng 10 tỷ và eps bằng 0,001, sai số có thể tới 10 triệu: giá trị xuất hiện 500 triệu lần vẫn đo tốt, nhưng giá trị 1.000 lần thì vô nghĩa.

**t-digest.** Gom giá trị thành các cụm trung bình, cụm ở giữa lớn, cụm ở đuôi rất nhỏ, nên **chính xác nhất ở đuôi**, đúng nơi lỗi hay xuất hiện. Gộp được giữa các Partition, nhưng tác giả nói chưa có cận sai số chặt chẽ như HLL, nên sai số của nó chủ yếu được đo bằng thực nghiệm. Hàm \`approxQuantile\` của Spark dùng biến thể Greenwald-Khanna, không phải t-digest.`,

    diagram: {
      mermaid: `flowchart TD
  A["Giá trị đầu vào"] --> B["Băm thành chuỗi bit đều"]
  B --> C["Vài bit đầu chọn 1 trong m register"]
  C --> D["Register giữ số 0 đầu dài nhất"]
  D --> E["Trung bình điều hòa của m register"]
  E --> F["Ước lượng, sai số xấp xỉ 1,04 / căn(m)"]`,
      caption:
        'HyperLogLog giữ số lớn nhất chứ không lưu giá trị, nên bộ nhớ gần như không đổi và giá trị trùng không làm đổi kết quả.',
    },

    example: `Bảng \`events\` có 100 tỷ dòng, mỗi ngày đánh giá 3 việc:

- **Số người dùng theo ngày:** HLL 12 KB cho mỗi ngày. Gộp 30 sketch thành số của tháng mà không quét lại. Hôm thứ Ba, số này tăng 40%, do một đối tác gửi \`user_id\` được mã hóa theo cách mới.
- **Key lệch:** CMS phát hiện một \`device_id\` chiếm 7% sự kiện, là bot, có nguy cơ gây [[spark-data-skew|Data Skew]].
- **Phân vị:** p99,9 của \`latency\` tăng gấp 10 lần ở một Partition, trong khi trung bình gần như không đổi.

Tất cả chỉ cần một lượt đọc dữ liệu mới và vài trăm KB trạng thái.`,

    prosCons: {
      pros: [
        '**Bộ nhớ rất nhỏ và gần như cố định,** không tăng theo số giá trị khác nhau.',
        '**Gộp được giữa các Partition,** nên có thể tính tăng dần.',
        '**Sai số đoán trước được** với HLL và CMS, nên biết rõ mức tin cậy.',
      ],
      cons: [
        '**Không thay thế được đếm chính xác** khi cần phát hiện vi phạm nhỏ hơn sai số.',
        '**Không liệt kê được giá trị,** nên chỉ biết có vấn đề mà không biết dòng nào.',
        '**Giao và hiệu của các tập có sai số cao hơn nhiều,** vì HLL chỉ hỗ trợ tốt phép hợp.',
      ],
    },

    whenToUse: {
      use: [
        'HLL để theo dõi cardinality và số người dùng theo thời gian.',
        'CMS để tìm key rất phổ biến, như phát hiện key lệch, bot.',
        't-digest để theo dõi đuôi phân phối của độ trễ, số tiền.',
      ],
      avoid: [
        'Không dùng HLL để chứng minh khóa chính không trùng.',
        'Không dùng CMS để đo giá trị hiếm.',
        'Không dùng khi cần số đúng tuyệt đối, như đối soát tài chính.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'HyperLogLog', 'Count-Min Sketch', 't-digest'],
      rows: [
        ['Trả lời', 'Có bao nhiêu giá trị khác nhau?', 'Giá trị này xuất hiện bao nhiêu lần?', 'Phân vị q là bao nhiêu?'],
        ['Hướng sai số', 'Hai phía', 'Chỉ ước lượng thừa', 'Hai phía'],
        ['Cận sai số', '1,04 / căn(m)', '`eps x N` với xác suất 1 - delta', 'Chủ yếu đo thực nghiệm, tốt ở đuôi'],
        ['Cách gộp', 'Max theo register', 'Cộng theo ô, cùng kích thước và hàm băm', 'Gộp các cụm'],
        ['Yếu ở đâu', 'Giao và hiệu của các tập', 'Giá trị hiếm', 'Chưa có cận chặt chẽ'],
      ],
    },

    misconceptions: [
      {
        myth: 'HLL cho kết quả bằng đúng số dòng nghĩa là khóa không trùng.',
        truth: 'Vi phạm nhỏ hơn sai số sẽ không thấy được. Kết quả chỉ là gợi ý. Deequ cũng chỉ dùng cách này để gợi ý ràng buộc, không phải để chứng minh.',
      },
      {
        myth: 'CMS có thể đếm thiếu do va chạm.',
        truth: 'Va chạm chỉ cộng thêm vào ô, nên giá trị đọc được luôn từ số thật trở lên, nếu luồng chỉ tăng.',
      },
      {
        myth: 'Mọi hàm phân vị xấp xỉ đều là t-digest.',
        truth: 'Có nhiều thuật toán. `approxQuantile` của Spark dùng biến thể Greenwald-Khanna, với cận sai số theo thứ hạng.',
      },
    ],
  },
})
