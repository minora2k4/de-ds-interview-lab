import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-one-hot',
  summary:
    'One-Hot Encoding biến một cột phân loại có k giá trị thành k cột nhị phân, nên không tạo thứ tự giả. Đổi lại, số cột tăng theo số giá trị và mô hình tuyến tính không điều chuẩn có thể mắc Dummy Variable Trap.',
  tags: ['Mã hóa', 'Biến phân loại', 'Đa cộng tuyến', 'First Principles'],
  related: ['fe-label-encoding', 'fe-ordinal-encoding', 'fe-woe', 'fe-binning', 'fe-selection', 'eda-leakage'],
  sections: {
    definition: `**One-Hot Encoding (Mã hóa một cột cho mỗi giá trị)** biến một biến phân loại có k giá trị thành k cột nhị phân. Mỗi dòng có đúng một cột bằng 1, các cột còn lại bằng 0.

Ví dụ, \`kênh\` gồm \`web\`, \`app\`, \`cửa hàng\` thành ba cột, và dòng \`app\` được biểu diễn là \`[0, 1, 0]\`.`,

    origin: `Gán số nguyên như [[fe-label-encoding|Label Encoding]] tạo ra thứ tự và khoảng cách không có thật. One-Hot khắc phục bằng cách cho mỗi giá trị một chiều riêng, nên mọi cặp giá trị khác nhau đều cách nhau như nhau. Trong thống kê, kỹ thuật này đã có từ lâu dưới tên biến giả (dummy variable) của hồi quy tuyến tính.`,

    whyUse: `- **Mô hình tuyến tính có hệ số riêng** cho từng giá trị, nên đọc được tác động của từng kênh.
- **KNN, SVM** không hiểu nhầm hai giá trị là gần nhau chỉ vì mã số gần nhau.
- **Không dùng nhãn,** nên không có rủi ro rò rỉ nhãn như [[fe-woe]].`,

    mechanism: `**Quy trình:** học danh sách giá trị trên tập train, tạo một cột cho mỗi giá trị, thường lưu dạng ma trận thưa vì phần lớn ô bằng 0. Production phải dùng lại đúng danh sách đó. Với giá trị lạ, \`handle_unknown\` của scikit-learn mặc định là \`'error'\`, còn \`'ignore'\` cho ra toàn số 0.

**Dummy Variable Trap (Bẫy biến giả).** Tổng k cột luôn bằng 1 ở mọi dòng, trùng với cột hệ số chặn (intercept). Đây là đa cộng tuyến hoàn hảo: ma trận \`X'X\` không khả nghịch, nên hồi quy không điều chuẩn không có bộ hệ số duy nhất. Có thể cộng 5 vào intercept và trừ 5 ở cả k hệ số mà dự đoán vẫn y nguyên.

Cách xử lý là bỏ một cột, còn k-1 cột. Giá trị bị bỏ thành **nhóm tham chiếu**, và hệ số của các cột còn lại là chênh lệch so với nhóm đó.

**Không phải lúc nào cũng nên bỏ cột:**

- **Điều chuẩn L2** cho nghiệm duy nhất dù giữ đủ k cột. Tài liệu scikit-learn cảnh báo bỏ cột phá vỡ tính đối xứng và có thể gây thiên lệch cho mô hình có điều chuẩn.
- **Cây quyết định** không giải hệ phương trình tuyến tính nên không gặp bẫy này.
- **Kết hợp \`drop\` với \`handle_unknown='ignore'\`** làm giá trị lạ trùng biểu diễn với nhóm bị bỏ.

**Với biến nhiều giá trị (high cardinality),** có ba vấn đề:

- Số cột bùng nổ, tốn bộ nhớ và thời gian.
- Giá trị hiếm chỉ có vài dòng, nên hệ số của nó chủ yếu học từ nhiễu.
- Cây mỗi lần chỉ tách được một giá trị khỏi phần còn lại, nên mỗi lần chia giảm tạp chất rất ít.

Ma trận thưa chỉ giải quyết vấn đề đầu tiên. Hai vấn đề sau cần giảm số giá trị: gom theo nghiệp vụ, gộp giá trị hiếm bằng \`min_frequency\` hoặc \`max_categories\`, hoặc đổi sang cách mã hóa một cột như [[fe-woe]].`,

    diagram: {
      mermaid: `flowchart TD
  A["Cột phân loại có k giá trị"] --> B["k đủ nhỏ so với số dòng?"]
  B -->|"Có"| C["One-Hot"]
  B -->|"Không"| D["Gom theo nghiệp vụ, gộp giá trị hiếm"]
  D --> E["k vẫn quá lớn?"]
  E -->|"Không"| C
  E -->|"Có"| F["Mã hóa một cột, có chống rò rỉ"]
  C --> G["Hồi quy không điều chuẩn: bỏ một cột"]`,
      caption: 'Chọn cách mã hóa theo số giá trị so với số dòng. Bỏ một cột là quyết định riêng, chỉ cần với hồi quy không điều chuẩn.',
    },

    example: `Mô hình logistic dùng \`merchant_id\` có 40.000 giá trị trên 1 triệu giao dịch, trong đó 70% giá trị có dưới 20 dòng. One-Hot đầy đủ cho AUC train 0.91 nhưng test chỉ 0.74, vì mô hình học thuộc các merchant hiếm.

Sau khi gộp mọi merchant dưới 200 dòng vào nhóm \`hiếm\`, còn 1.800 cột. AUC train giảm còn 0.82, nhưng AUC test tăng lên 0.79.`,

    prosCons: {
      pros: [
        '**Không tạo thứ tự giả,** hợp với biến định danh như kênh bán hoặc tỉnh thành.',
        '**Dễ diễn giải:** mỗi hệ số gắn với đúng một giá trị.',
      ],
      cons: [
        '**Số cột tăng theo số giá trị,** kéo theo chi phí và nguy cơ quá khớp.',
        '**Không chia sẻ thông tin:** hai giá trị gần nghĩa vẫn là hai chiều độc lập.',
        '**Phải xử lý giá trị mới** khi dữ liệu production thay đổi.',
      ],
    },

    whenToUse: {
      use: [
        'Biến định danh có ít giá trị, nhất là với mô hình tuyến tính, SVM hoặc KNN.',
        'Sau khi [[fe-binning|chia khoảng]], nếu muốn mỗi khoảng có hệ số riêng.',
      ],
      avoid: [
        'Biến có hàng chục nghìn giá trị, khi chưa gộp hoặc gom nhóm.',
        'Biến có thứ bậc rõ ràng cần được tận dụng, lúc này xem [[fe-ordinal-encoding]].',
      ],
    },

    comparison: {
      headers: ['Cách làm', 'Số cột', 'Giả định', 'Dùng nhãn', 'Rủi ro chính'],
      rows: [
        ['One-Hot', 'k hoặc k-1', 'Các giá trị độc lập', 'Không', 'Bùng nổ số cột'],
        ['Label Encoding', '1', 'Chỉ hợp với y', 'Không', 'Thứ tự giả nếu dùng cho X'],
        ['Ordinal Encoding', '1', 'Có thứ bậc thật', 'Không', 'Giả định khoảng cách đều'],
        ['WoE', '1', 'Tuyến tính với log-odds', 'Có', 'Rò rỉ nếu tính sai tập'],
      ],
    },

    misconceptions: [
      {
        myth: 'Luôn phải bỏ một cột để tránh Dummy Variable Trap.',
        truth: 'Bẫy này chỉ thực sự là vấn đề với mô hình tuyến tính không điều chuẩn có intercept. Với mô hình có điều chuẩn, bỏ cột có thể gây thiên lệch, còn cây thì không bị ảnh hưởng.',
      },
      {
        myth: 'Bỏ intercept là hết bẫy, không cần bỏ cột nữa.',
        truth: 'Chỉ đúng khi có một biến phân loại. Với hai biến trở lên, tổng các cột của mỗi biến đều bằng 1, nên các nhóm cột vẫn phụ thuộc tuyến tính vào nhau.',
      },
      {
        myth: 'Ma trận thưa giải quyết được vấn đề biến nhiều giá trị.',
        truth: 'Ma trận thưa chỉ giảm bộ nhớ. Số tham số vẫn lớn và giá trị hiếm vẫn gây quá khớp.',
      },
    ],
  },
})
