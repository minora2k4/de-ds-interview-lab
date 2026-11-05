import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-distribution-comparison',
  summary:
    'KS Test và Chi-square trả lời hai phân phối có khác nhau không, còn PSI đo khác nhau bao nhiêu. Với dữ liệu lớn, kiểm định gần như luôn báo khác biệt, nên cần xem mức khác biệt. Ngưỡng PSI 0,1 và 0,25 chỉ là quy ước trong ngành.',
  tags: ['KS Test', 'Chi-square', 'PSI', 'First Principles'],
  related: ['dq-drift', 'dq-representativeness', 'stats-hypothesis', 'stats-p-value', 'eda-distribution', 'fe-iv'],
  sections: {
    definition: `Ba cách phổ biến để so sánh phân phối của hai tập dữ liệu:

- **KS Test (Kolmogorov-Smirnov):** kiểm định cho dữ liệu liên tục, dùng khoảng cách lớn nhất giữa hai hàm phân phối tích lũy.
- **Chi-square Test (Kiểm định chi bình phương):** kiểm định cho dữ liệu phân loại, so tần suất quan sát với tần suất kỳ vọng.
- **PSI (Population Stability Index, Chỉ số ổn định quần thể):** đo mức thay đổi của phân phối qua các nhóm: \`PSI = tổng (A - E) x ln(A / E)\`, với \`E\` và \`A\` là tỷ lệ của mỗi nhóm trong tập gốc và tập mới.`,

    origin: `KS Test và Chi-square là các kiểm định giả thuyết kinh điển, được thiết kế khi mẫu nhỏ và câu hỏi là khác biệt có do ngẫu nhiên không. PSI ra đời trong lĩnh vực tín dụng, để theo dõi xem tập khách hàng có còn giống tập đã dùng để xây thẻ điểm hay không. Ở đó, người ta cần một con số về mức thay đổi để quyết định hành động, thay vì chỉ một p-value.`,

    whyUse: `So sánh phân phối là cách trả lời nhiều câu hỏi đánh giá: dữ liệu có [[dq-representativeness|đại diện]] cho tổng thể không, lô mới có giống lô cũ không, dữ liệu có [[dq-drift|trôi]] không. Ưu điểm là không cần nhãn và không cần mô hình.`,

    mechanism: `**KS Test:** sắp xếp hai mẫu, so hai hàm phân phối tích lũy, và lấy khoảng cách dọc lớn nhất D. Không giả định dữ liệu theo phân phối chuẩn. Vì hai đường tích lũy đều đi về 0 và 1 ở hai đầu, kiểm định này **kém nhạy ở đuôi**.

**Chi-square:** cộng tổng \`(quan sát - kỳ vọng)^2 / kỳ vọng\` trên mọi nhóm. Quy tắc thường dùng là tần suất kỳ vọng mỗi nhóm nên từ 5 trở lên, nên phải gộp các nhóm quá nhỏ.

**PSI:** chia giá trị thành các nhóm theo tập gốc, thường là 10 nhóm, rồi cộng theo công thức. Về bản chất, PSI bằng tổng KL Divergence theo hai chiều, nên đối xứng khi đổi vai hai tập.

**Vì sao mẫu lớn làm kiểm định "hỏng":** p-value trả lời "khác biệt này có do ngẫu nhiên không", và lượng sai số ngẫu nhiên giảm khi cỡ mẫu tăng. Với 10 triệu dòng, khác biệt nhỏ đến mức không ảnh hưởng gì vẫn cho [[stats-p-value|p-value]] rất nhỏ. Có ý nghĩa thống kê không có nghĩa là có ý nghĩa thực tế. Do đó ở quy mô lớn, hãy xem **mức khác biệt** như D hoặc PSI, thay vì p-value.

**Về ngưỡng PSI:** quy ước phổ biến là dưới 0,1 không đáng kể, từ 0,1 đến 0,25 thay đổi vừa, trên 0,25 thay đổi lớn. **Đây là quy ước trong ngành, không phải định lý,** và một số nơi dùng ngưỡng khác. Nghiên cứu về tính chất thống kê của PSI cho thấy giá trị tới hạn phụ thuộc vào cỡ mẫu và số nhóm, nên cùng một ngưỡng không có ý nghĩa giống nhau ở mọi nơi. Ngưỡng nên được hiệu chỉnh theo lịch sử dao động của chính đặc trưng đó.

**Điểm cần chú ý với PSI:** nhóm có tỷ lệ bằng 0 làm công thức thành vô hạn, nên phải cộng một lượng rất nhỏ hoặc gộp nhóm. Kết quả thay đổi theo cách chia nhóm. Nhóm nên cố định từ tập gốc, không chia lại mỗi lần.

[[fe-iv|Information Value]] có công thức tương tự, nhưng so phân phối giữa hai nhãn để đo sức mạnh đặc trưng, không phải so hai thời điểm.`,

    example: `So sánh dữ liệu tháng 10 với dữ liệu huấn luyện, mỗi bên 12 triệu dòng:

- **\`age\`:** p-value của KS Test dưới 0,0001, nhưng D chỉ 0,004 và PSI 0,003. Khác biệt có thật nhưng không đáng kể, nên không làm gì.
- **\`device_type\`:** tỷ lệ gốc là 30%, 40%, 30%, tháng này là 10%, 40%, 50%. PSI bằng \`(0,1 - 0,3) x ln(0,1 / 0,3) + 0 + (0,5 - 0,3) x ln(0,5 / 0,3)\`, tức khoảng 0,32. Điều tra thì thấy app mới đổi cách ghi tên thiết bị. Đây là lỗi dữ liệu cần xử lý.

Nếu chỉ nhìn p-value, cả hai cột đều bị xem là khác biệt, và cột quan trọng bị lẫn trong báo động.`,

    prosCons: {
      pros: [
        '**Không cần nhãn hay mô hình,** nên chạy được ngay khi dữ liệu về.',
        '**PSI cho một con số dễ giải thích,** so sánh được giữa các cột và theo thời gian.',
        '**Kiểm định cho biết khác biệt có thể do ngẫu nhiên** khi mẫu nhỏ.',
      ],
      cons: [
        '**Mẫu lớn làm kiểm định quá nhạy,** còn PSI phụ thuộc vào cách chia nhóm.',
        '**Chỉ xét từng cột riêng lẻ,** nên có thể bỏ sót thay đổi trong quan hệ giữa các cột.',
        '**Chúng không nói được thay đổi có hại không,** vì không biết đến kết quả mô hình.',
      ],
    },

    whenToUse: {
      use: [
        'PSI để theo dõi định kỳ nhiều đặc trưng ở quy mô lớn.',
        'KS Test và Chi-square khi mẫu vừa phải, hoặc cần một kết luận thống kê.',
        'Hiệu chỉnh ngưỡng theo mức dao động lịch sử của từng cột.',
      ],
      avoid: [
        'Không báo động theo p-value trên hàng triệu dòng.',
        'Không dùng ngưỡng PSI như một chân lý.',
        'Không chia lại nhóm mỗi lần tính PSI, vì kết quả sẽ không so sánh được.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'KS Test', 'Chi-square', 'PSI'],
      rows: [
        ['Kiểu dữ liệu', 'Liên tục', 'Phân loại, hoặc số đã chia nhóm', 'Cả hai, sau khi chia nhóm'],
        ['Câu hỏi', 'Có khác nhau không?', 'Có khác nhau không?', 'Khác nhau bao nhiêu?'],
        ['Kết quả', 'D và p-value', 'Chi-square và p-value', 'Một chỉ số không âm'],
        ['Với mẫu rất lớn', 'p-value gần như luôn nhỏ', 'p-value gần như luôn nhỏ', 'Ổn định hơn, ít nhiễu hơn'],
        ['Điểm yếu', 'Kém nhạy ở đuôi', 'Cần đủ tần suất mỗi nhóm', 'Phụ thuộc cách chia nhóm, ngưỡng là quy ước'],
      ],
    },

    misconceptions: [
      {
        myth: 'Ngưỡng PSI 0,1 và 0,25 đã được chứng minh về mặt toán học.',
        truth: 'Đây là quy tắc kinh nghiệm trong ngành. Giá trị tới hạn thực tế phụ thuộc vào cỡ mẫu và số nhóm.',
      },
      {
        myth: 'p-value nhỏ nghĩa là phải hành động.',
        truth: 'Với dữ liệu lớn, khác biệt rất nhỏ cũng có p-value nhỏ. Hãy xem mức khác biệt và ảnh hưởng đến việc sử dụng.',
      },
      {
        myth: 'PSI thấp có nghĩa là mô hình vẫn tốt.',
        truth: 'PSI chỉ nhìn đầu vào. Quan hệ giữa đầu vào và nhãn có thể đã đổi mà phân phối đầu vào không đổi, xem [[dq-drift]].',
      },
    ],
  },
})
