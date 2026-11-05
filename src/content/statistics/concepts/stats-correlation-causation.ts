import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-correlation-causation',
  summary:
    'Tương quan cho biết hai biến cùng biến động, nhân quả cho biết can thiệp vào biến này có làm biến kia đổi không. Biến gây nhiễu và Simpson\'s Paradox có thể làm tương quan sai lệch, và thí nghiệm ngẫu nhiên là cách đáng tin nhất để biết nhân quả.',
  tags: ['Tương quan', 'Nhân quả', 'Biến gây nhiễu', "Simpson's Paradox", 'First Principles'],
  related: ['stats-covariance', 'stats-hypothesis', 'stats-conditional', 'eda-correlation', 'eda-leakage', 'fe-selection', 'eda-sampling'],
  sections: {
    definition: `**Correlation (Tương quan)** mô tả hai biến cùng biến động. **Hệ số Pearson** \`r = Cov(X, Y) / (s_x × s_y)\` có giá trị từ -1 đến 1, đo mức độ quan hệ **tuyến tính**.

**Causation (Nhân quả)** nghĩa là khi **can thiệp** thay đổi X, Y cũng thay đổi theo, nếu mọi yếu tố khác giữ nguyên.

Tương quan là đặc điểm của dữ liệu quan sát được. Nhân quả là câu trả lời cho câu hỏi: nếu ta làm điều này thì chuyện gì sẽ xảy ra?`,

    origin: `Bài toán thực tế là hầu hết quyết định đều là can thiệp: đổi giao diện, tăng ngân sách quảng cáo, gửi thêm thông báo. Dữ liệu quan sát lại chỉ cho thấy những gì đã xảy ra cùng nhau.

Cách làm kém hơn là so sánh nhóm tự chọn, như người dùng tính năng với người không dùng, hoặc so trước và sau khi thay đổi. Các cách này lẫn hiệu ứng thật với khác biệt vốn có giữa các nhóm, và với xu hướng theo thời gian.

Galton và Pearson phát triển hệ số tương quan vào cuối thế kỷ 19. Fisher đưa phân nhóm ngẫu nhiên vào thiết kế thí nghiệm những năm 1920, để tách hiệu ứng của can thiệp khỏi mọi khác biệt khác.`,

    whyUse: `- **Tránh đầu tư vào đòn bẩy sai:** sửa thứ chỉ tương quan với kết quả sẽ không làm kết quả thay đổi.
- **Tương quan vẫn có giá trị riêng:** để dự đoán không cần nhân quả, nên nó vẫn hữu ích trong [[fe-selection|chọn đặc trưng]] và trong việc dò tìm giả thuyết.
- **Biết giới hạn của mô hình:** đặc trưng dự đoán tốt chưa chắc là thứ nên can thiệp vào.`,

    mechanism: `**Pearson chỉ đo quan hệ tuyến tính.** Với x = -2, -1, 0, 1, 2 và y = x², ta có y = 4, 1, 0, 1, 4. Hiệp phương sai bằng 0, nên r = 0, dù y hoàn toàn được xác định bởi x. Một điểm ngoại lai cũng có thể làm r đổi rất mạnh. Vì vậy phải vẽ biểu đồ, và dùng Spearman khi quan hệ đơn điệu nhưng không tuyến tính.

**Vì sao có tương quan mà không có nhân quả:**

1. **Biến gây nhiễu (Confounder):** một biến Z ảnh hưởng đến cả X và Y. Trời nóng làm cả số kem bán ra lẫn số vụ đuối nước cùng tăng.
2. **Nhân quả ngược:** Y gây ra X. Người sắp rời bỏ thường gọi tổng đài nhiều hơn.
3. **Thiên lệch chọn mẫu:** chỉ quan sát nhóm đã qua sàng lọc, nên tạo ra quan hệ không có trong tổng thể.
4. **Ngẫu nhiên:** dò đủ nhiều cặp biến thì sẽ có cặp tương quan cao chỉ do may rủi.

**Simpson's Paradox (Nghịch lý Simpson):** xu hướng trong từng nhóm đảo chiều khi gộp lại, do các nhóm có cơ cấu khác nhau. Ví dụ nổi tiếng là Berkeley năm 1973: 44% ứng viên nam được nhận so với 35% ứng viên nữ. Xét theo từng khoa thì khoảng cách biến mất, thậm chí hơi nghiêng về nữ, do nữ nộp nhiều hơn vào những khoa khó vào (Bickel và cộng sự, 1975).

Nên tin số tổng hay số theo nhóm không phải là chuyện số học, mà phụ thuộc vào cơ chế nhân quả. Nếu Z là biến gây nhiễu thì nên chia theo Z. Nếu Z là biến trung gian, tức X tác động qua Z, thì chia theo Z sẽ che mất hiệu ứng.

**Vì sao thí nghiệm ngẫu nhiên giải quyết được.** Phân nhóm ngẫu nhiên làm việc được can thiệp không phụ thuộc vào bất kỳ đặc điểm nào của người dùng, kể cả những đặc điểm không đo được. Biến gây nhiễu không còn đường tác động tới X, nên hai nhóm chỉ khác nhau ở can thiệp và ở dao động ngẫu nhiên, phần này được [[stats-hypothesis|kiểm định]] xử lý.

Thí nghiệm vẫn có giới hạn: người dùng ảnh hưởng lẫn nhau, hiệu ứng mới lạ, và kết quả có thể không áp dụng được cho nhóm khác.`,

    diagram: {
      mermaid: `flowchart TD
  Z["Biến gây nhiễu: mức độ gắn bó"] --> X["Dùng tính năng"]
  Z --> Y["Giữ chân sau 30 ngày"]
  X -. "Hiệu ứng thật, chưa biết" .-> Y
  R["Phân nhóm ngẫu nhiên"] -->|"Thay thế đường từ biến gây nhiễu"| X`,
      caption:
        'Trong dữ liệu quan sát, mức độ gắn bó tác động đến cả hai biến. Phân nhóm ngẫu nhiên quyết định ai được dùng tính năng, nên đường từ biến gây nhiễu bị cắt.',
    },

    example: `**Biến gây nhiễu.** Người dùng tính năng "Danh sách yêu thích" có tỷ lệ giữ chân 60%, người không dùng chỉ 30%. Nhưng người gắn bó thì vừa hay dùng tính năng, vừa ít rời bỏ. A/B test bật tính năng ngẫu nhiên chỉ cho mức tăng 2 điểm phần trăm, không phải 30.

**Simpson's Paradox trong A/B test:**

- Đối chứng: máy tính 120 / 800 = 15%, điện thoại 10 / 200 = 5%, tổng 130 / 1.000 = **13%**.
- Thử nghiệm: máy tính 32 / 200 = 16%, điện thoại 48 / 800 = 6%, tổng 80 / 1.000 = **8%**.

Thử nghiệm tốt hơn ở cả hai thiết bị, nhưng kém hơn trên tổng, vì nhóm này có quá nhiều người dùng điện thoại, vốn có tỷ lệ thấp. Quy về cùng cơ cấu 50/50: đối chứng là (15 + 5) / 2 = 10%, thử nghiệm là (16 + 6) / 2 = 11%.

Trong A/B test đúng, cơ cấu hai nhóm phải gần như nhau. Nên thấy lệch như thế này thì việc đầu tiên là kiểm tra lỗi chia nhóm.`,

    prosCons: {
      pros: [
        '**Tương quan** rẻ, tính được từ dữ liệu có sẵn, hữu ích để dự đoán và dò giả thuyết.',
        '**Thí nghiệm ngẫu nhiên** xử lý được cả biến gây nhiễu không đo được.',
        '**Hiểu nhân quả** cho biết nên can thiệp vào đâu.',
      ],
      cons: [
        '**Tương quan** không trả lời được câu hỏi về can thiệp, và nhạy với ngoại lai.',
        '**Thí nghiệm** tốn thời gian, đôi khi không khả thi hoặc không hợp đạo đức.',
        '**Suy luận từ dữ liệu quan sát** dựa trên các giả định không kiểm tra được trọn vẹn.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng tương quan để dự đoán, sàng lọc đặc trưng và tìm giả thuyết cần kiểm chứng.',
        'Dùng thí nghiệm ngẫu nhiên khi quyết định là một can thiệp và có thể phân nhóm.',
        'Khi không thể thí nghiệm, dùng thí nghiệm tự nhiên như difference-in-differences, kèm giả định được nói rõ.',
      ],
      avoid: [
        'Không kết luận nhân quả từ so sánh các nhóm tự chọn.',
        'Không chỉ dùng Pearson mà không vẽ biểu đồ.',
        'Không tự động chia theo mọi biến, vì chia theo biến trung gian có thể làm sai kết quả.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Tương quan', 'Nhân quả'],
      rows: [
        ['Câu hỏi', 'X và Y có cùng biến động không?', 'Thay đổi X thì Y có đổi không?'],
        ['Dữ liệu cần', 'Dữ liệu quan sát', 'Thí nghiệm, hoặc quan sát kèm giả định mạnh'],
        ['Tính đối xứng', 'Đối xứng: r(X, Y) = r(Y, X)', 'Có chiều: X gây ra Y không có nghĩa Y gây ra X'],
        ['Dùng tốt cho', 'Dự đoán, sàng lọc', 'Quyết định can thiệp'],
        ['Rủi ro chính', 'Đọc thành nhân quả', 'Vi phạm giả định, kết quả khó khái quát'],
      ],
    },

    misconceptions: [
      {
        myth: 'r = 0 nghĩa là hai biến không liên quan.',
        truth: 'Pearson chỉ đo quan hệ tuyến tính. Với y = x² trên đoạn đối xứng, r = 0 dù y phụ thuộc hoàn toàn vào x.',
      },
      {
        myth: 'Có tương quan mạnh và xảy ra trước thì chắc chắn là nguyên nhân.',
        truth: 'Thứ tự thời gian là cần, nhưng chưa đủ. Một biến gây nhiễu vẫn có thể tác động đến cả hai, với X xảy ra trước Y.',
      },
      {
        myth: 'Đưa thêm nhiều biến kiểm soát vào mô hình thì sẽ có nhân quả.',
        truth: 'Chỉ kiểm soát được những gì đã đo. Kiểm soát nhầm biến trung gian hoặc biến chịu tác động của cả X và Y còn có thể làm kết quả sai hơn.',
      },
      {
        myth: 'Số theo nhóm luôn đáng tin hơn số tổng.',
        truth: "Với Simpson's Paradox, điều đó phụ thuộc vào cơ chế. Khi biến chia nhóm là trung gian, số tổng mới phản ánh đúng hiệu ứng toàn phần.",
      },
    ],
  },
})
