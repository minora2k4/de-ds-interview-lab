import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eda-overview',
  summary:
    'EDA là bước đọc dữ liệu có hệ thống trước khi xây mô hình, rồi biến mỗi phát hiện thành một quyết định. EDA tạo ra giả thuyết, không chứng minh giả thuyết.',
  tags: ['EDA', 'Quy trình', 'First Principles'],
  related: ['eda-distribution', 'eda-correlation', 'eda-missing-values', 'eda-outliers', 'eda-leakage', 'eda-imbalanced', 'dq-profiling', 'dq-overview', 'stats-hypothesis'],
  sections: {
    definition: `**Exploratory Data Analysis, viết tắt EDA (Phân tích khám phá dữ liệu)** là cách tiếp cận dùng biểu đồ và thống kê đơn giản để hiểu dữ liệu **trước khi** áp đặt mô hình hay giả định. Đầu ra là các quyết định: cần làm sạch gì, tách tập thế nào, giả thuyết nào đáng kiểm tra.

EDA hỏi "dữ liệu đang nói gì và có gì sai". **Confirmatory Data Analysis (Phân tích xác nhận)** thì kiểm tra một giả thuyết đã đặt ra từ trước.`,

    origin: `Thống kê truyền thống thường bắt đầu từ một mô hình giả định. Nếu giả định sai, kết quả vẫn ra số, và người phân tích không thấy được điều mình không hỏi.

John Tukey đặt nền móng cho EDA với cuốn *Exploratory Data Analysis* (1977): hoãn giả định lại để dữ liệu tự bộc lộ cấu trúc. Bộ tứ Anscombe (1973) là minh họa kinh điển: bốn bộ dữ liệu có gần như cùng trung bình, phương sai, tương quan và đường hồi quy, nhưng hình dạng khác hẳn nhau.`,

    whyUse: `Sửa lỗi dữ liệu ở đầu dự án rẻ hơn nhiều so với sau khi triển khai. EDA giúp tránh xây mô hình trên dữ liệu sai, chọn đúng cách tách tập nhờ biết đơn vị quan sát và yếu tố thời gian, và có căn cứ khi chọn biến đổi hay chỉ số đánh giá.`,

    mechanism: `Quy trình có tính lặp, mỗi bước đều có lý do:

1. **Làm rõ câu hỏi, đơn vị quan sát, thời điểm dự đoán.** Mỗi dòng là khách hàng hay khách hàng theo tháng? Không biết điều này thì mọi phép đếm và phép tách tập đều có thể sai.
2. **Kiểm tra cấu trúc.** Kiểu dữ liệu, khóa, dòng trùng, khoảng thời gian, tỷ lệ thiếu. Phần này gần với [[dq-profiling]].
3. **Xem từng biến.** [[eda-distribution|Phân phối]], [[eda-skew-kurtosis|độ lệch]], giá trị lạ. Giá trị mặc định và lỗi đơn vị thường lộ ra ở đây.
4. **Xem quan hệ.** [[eda-correlation|Tương quan]] với nhãn, rồi tách theo nhóm và thời gian, vì xu hướng tổng thể có thể đảo chiều trong từng nhóm, gọi là **Simpson's Paradox (Nghịch lý Simpson)**.
5. **Tìm vấn đề.** [[eda-missing-values|Giá trị thiếu]], [[eda-outliers|ngoại lai]], [[eda-leakage|rò rỉ]], [[eda-imbalanced|mất cân bằng]], [[dq-representativeness|tính đại diện]].
6. **Ghi lại quyết định.** Phát hiện không làm đổi quyết định nào thì chưa có giá trị.

**EDA trên tập nào?** Kiểm tra cấu trúc trên toàn bộ dữ liệu là an toàn. Những gì ảnh hưởng đến đặc trưng, như ngưỡng cắt hay chọn cột theo nhãn, chỉ nên làm trên tập train, nếu không thông tin của tập test đã đi vào quyết định.

**EDA không chứng minh.** Xét 100 phân khúc không có khác biệt thật ở mức ý nghĩa 5%, trung bình vẫn có 5 phân khúc trông như có khác biệt. Giả thuyết tìm được phải [[stats-hypothesis|kiểm định]] trên dữ liệu mới.`,

    diagram: {
      mermaid: `flowchart TD
  A["Câu hỏi, đơn vị quan sát, thời điểm dự đoán"] --> B["Cấu trúc: kiểu, khóa, trùng, thiếu"]
  B --> C["Từng biến: phân phối, giá trị lạ"]
  C --> D["Quan hệ: với nhãn, theo nhóm, theo thời gian"]
  D --> E["Vấn đề: thiếu, ngoại lai, rò rỉ, mất cân bằng"]
  E --> F["Ghi quyết định và giả thuyết"]
  F -->|"Phát hiện mới đổi câu hỏi"| A`,
      caption: 'EDA là vòng lặp. Mỗi vòng kết thúc bằng một quyết định, và quyết định đó có thể làm thay đổi chính câu hỏi ban đầu.',
    },

    example: `Một nhà mạng có bảng 1,2 triệu dòng để dự đoán khách rời mạng. EDA cho ra ba quyết định:

- **Đơn vị quan sát:** mỗi dòng là khách theo tháng, nên chỉ có 100.000 khách. Quyết định: tách tập theo khách và theo thời gian, không tách ngẫu nhiên theo dòng.
- **Rò rỉ:** cột \`cancel_reason\` chỉ có giá trị ở khách đã rời mạng. Quyết định: bỏ cột.
- **Giá trị lạ:** 4% dòng có \`monthly_fee\` bằng 0. Đây là tài khoản nội bộ. Quyết định: loại, vì không thuộc nhóm cần dự đoán.

Chưa có mô hình nào, nhưng cả ba lỗi đều sẽ làm chỉ số sai lệch.`,

    prosCons: {
      pros: [
        '**Phát hiện lỗi sớm,** khi chưa có quyết định nào dựa trên kết quả sai.',
        '**Không cần giả định trước,** nên thấy được cả những điều không định tìm.',
      ],
      cons: [
        '**Dễ tự lừa mình:** xem nhiều lát cắt rồi kể chuyện cho một quy luật ngẫu nhiên.',
        '**Không có điểm dừng tự nhiên,** dễ tốn thời gian mà không đổi được quyết định nào.',
        '**Khó làm trọn trên dữ liệu rất lớn:** phải [[eda-sampling|lấy mẫu]], và mẫu có thể bỏ sót nhóm hiếm.',
      ],
    },

    whenToUse: {
      use: [
        'Khi nhận bộ dữ liệu mới, hoặc dữ liệu cũ đổi nguồn hay đổi định nghĩa.',
        'Khi chỉ số mô hình tốt hoặc tụt bất thường, để tìm nguyên nhân trong dữ liệu.',
      ],
      avoid: [
        'Không dùng kết quả EDA thay cho kiểm định hay thí nghiệm khi cần kết luận chính thức.',
        'Không tiếp tục khi phát hiện mới không còn đổi quyết định.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'EDA', 'Data Profiling', 'Phân tích xác nhận'],
      rows: [
        ['Câu hỏi chính', 'Dữ liệu nói gì, có gì sai', 'Từng cột trông thế nào', 'Giả thuyết này có đúng không'],
        ['Cách làm', 'Biểu đồ, tách nhóm, lặp lại', 'Thống kê tự động theo cột', 'Kiểm định, thí nghiệm có thiết kế'],
        ['Đầu ra', 'Quyết định và giả thuyết', 'Báo cáo mô tả', 'Kết luận kèm mức tin cậy'],
        ['Dữ liệu dùng', 'Dữ liệu đang có', 'Dữ liệu đang có', 'Nên là dữ liệu mới'],
      ],
      note: 'Trang [[dq-overview]] bàn về việc đánh giá một bộ dữ liệu có phù hợp mục đích hay không. EDA là một công cụ để trả lời câu hỏi đó.',
    },

    misconceptions: [
      {
        myth: 'EDA là chạy một báo cáo tự động rồi xem biểu đồ.',
        truth: 'Báo cáo tự động chỉ là profiling. Nó không biết thời điểm dự đoán, nên không thể cho biết một cột có rò rỉ hay không.',
      },
      {
        myth: 'Thấy khác biệt rõ trong EDA là đã có kết luận.',
        truth: 'P-value tính trên chính dữ liệu đã dùng để tìm ra giả thuyết sẽ quá lạc quan, nên cần kiểm tra lại trên dữ liệu mới.',
      },
      {
        myth: 'Thống kê mô tả là đủ, không cần vẽ biểu đồ.',
        truth: 'Bộ tứ Anscombe có các thống kê gần như giống nhau nhưng hình dạng rất khác: một bộ tuyến tính, một bộ cong, hai bộ bị một điểm chi phối.',
      },
    ],
  },
})
