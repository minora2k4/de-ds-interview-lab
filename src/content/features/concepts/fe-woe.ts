import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-woe',
  summary:
    'WoE thay mỗi nhóm giá trị bằng logarit tỷ số giữa phần good và phần bad rơi vào nhóm đó, nên có quan hệ tuyến tính với log-odds. Dấu của WoE phụ thuộc quy ước, và vì dùng nhãn nên chỉ được tính trên tập train.',
  tags: ['Mã hóa', 'Credit Scoring', 'Log-odds', 'Rò rỉ dữ liệu', 'First Principles'],
  related: ['fe-iv', 'fe-binning', 'fe-one-hot', 'eda-leakage', 'eval-cross-validation'],
  sections: {
    definition: `**Weight of Evidence (WoE, Trọng số bằng chứng)** mã hóa một nhóm giá trị bằng mức chênh lệch giữa phân phối good và phân phối bad tại nhóm đó. Nhãn phải là nhị phân, và biến số thường được [[fe-binning|chia khoảng]] trước.

\`WoE_i = ln(%Good_i / %Bad_i)\`

Trong đó \`%Good_i\` là số good của nhóm i chia cho **tổng số good toàn bộ**, \`%Bad_i\` tính tương tự. Đây là phần trăm theo cột, không phải tỷ lệ nợ xấu trong nhóm.

**Quy ước dấu khác nhau giữa các tài liệu.** \`OptBinning\` và nhiều tài liệu scorecard đặt good ở tử số, nên WoE cao nghĩa là rủi ro thấp. Thư viện \`scorecard\` của R mặc định đặt bad ở tử số, còn \`category_encoders\` đặt lớp \`y=1\` ở tử số, nên WoE cao thường nghĩa là rủi ro cao. Luôn kiểm tra công thức trước khi đọc dấu.`,

    origin: `Khái niệm weight of evidence gắn với công trình về xác suất của I. J. Good (1950), rồi được ngành tín dụng áp dụng cho thẻ điểm (scorecard).

Đưa biến thô vào hồi quy logistic thì phải chấp nhận quan hệ tuyến tính với log-odds và chịu ảnh hưởng của ngoại lai. Đưa các nhóm vào bằng [[fe-one-hot|One-Hot]] thì mỗi biến tốn nhiều tham số. WoE giữ mỗi biến ở một hệ số mà vẫn mô tả được quan hệ phi tuyến.`,

    whyUse: `- **Tuyến tính hóa quan hệ với log-odds,** đúng với dạng mà hồi quy logistic cần.
- **Mỗi biến một hệ số,** nên thẻ điểm gọn và dễ giải thích.
- **Xử lý tự nhiên giá trị thiếu và ngoại lai:** giá trị thiếu thành nhóm riêng, ngoại lai rơi vào nhóm ở biên.`,

    mechanism: `**Các bước:** chia nhóm trên tập train, đếm good và bad từng nhóm rồi chia cho tổng, lấy logarit tỷ số, thay giá trị gốc bằng WoE. Test và production dùng lại bảng này, không tính lại.

**Vì sao tuyến tính với log-odds?** Theo công thức Bayes, với G, B là tổng good và bad:

\`ln(Good_i / Bad_i) = ln(G / B) + WoE_i\`

Vậy WoE là độ lệch log-odds của nhóm so với toàn tổng thể, và WoE = 0 nghĩa là nhóm có rủi ro đúng bằng mức chung. Khi mô hình hóa xác suất good chỉ với một biến WoE, hồi quy logistic cho hệ số 1 và intercept \`ln(G/B)\`. Nếu mô hình hóa bad thì hệ số thành -1.

**Nhóm có số đếm bằng 0.** Tỷ số khi đó bằng 0 hoặc vô hạn. Có hai cách chính: gộp với nhóm lân cận, hoặc làm trơn bằng cách cộng một hằng số nhỏ, thường là 0.5. Gộp thường an toàn hơn, vì WoE cực lớn từ vài dòng phần lớn là nhiễu.

**Nguyên tắc chia nhóm:** mỗi nhóm có ít nhất khoảng 5% số quan sát, và WoE đơn điệu nếu nghiệp vụ cho rằng quan hệ là đơn điệu. Đơn điệu không phải điều kiện bắt buộc: quan hệ hình chữ U có thật thì nên giữ.

**Rò rỉ dữ liệu.** WoE dùng nhãn, nên tính trên toàn bộ dữ liệu sẽ làm nhãn của test lọt vào đặc trưng. Trong kiểm định chéo, bảng WoE phải được học lại ở mỗi fold. Biến nhiều giá trị nguy hiểm nhất, vì nhóm vài dòng có WoE gần như mã hóa lại chính nhãn của nó.`,

    diagram: {
      mermaid: `flowchart TD
  A["Biến gốc trên tập train"] --> B["Chia nhóm, tách riêng giá trị thiếu"]
  B --> C["Đếm good, bad, tính phần trăm theo cột"]
  C --> D["Nhóm có số đếm 0 hoặc quá nhỏ?"]
  D -->|"Có"| B
  D -->|"Không"| E["WoE = ln(%Good / %Bad)"]
  E --> F["Lưu bảng WoE"]
  F --> G["Áp dụng nguyên bảng cho test và production"]`,
      caption: 'Bảng WoE chỉ được học từ tập train. Nhóm quá nhỏ phải quay lại bước chia nhóm trước khi tính.',
    },

    example: `Danh mục có 9.000 good và 1.000 bad, biến là thâm niên công tác:

| Nhóm | Good | Bad | %Good | %Bad | WoE |
|---|---|---|---|---|---|
| Dưới 3 năm | 1.500 | 300 | 16.67% | 30% | -0.588 |
| 3 đến 10 năm | 4.500 | 500 | 50% | 50% | 0 |
| Trên 10 năm | 3.000 | 200 | 33.33% | 20% | 0.511 |

Nhóm giữa có WoE = 0, đúng bằng rủi ro chung. Kiểm tra với nhóm đầu: \`ln(9000/1000) - 0.588 = 1.609\`, bằng đúng \`ln(1500/300)\`.`,

    prosCons: {
      pros: [
        '**Một hệ số cho mỗi biến,** kể cả khi quan hệ với log-odds là phi tuyến.',
        '**Diễn giải trực tiếp:** dấu và độ lớn cho biết nhóm tốt hay xấu hơn mức chung.',
      ],
      cons: [
        '**Mất biến thiên trong nhóm:** mọi khách hàng cùng nhóm có cùng một giá trị.',
        '**Dùng nhãn nên dễ rò rỉ,** cần quy trình nghiêm ngặt khi kiểm định chéo.',
        '**Cấu trúc nhóm có thể lỗi thời,** cần chia lại khi dữ liệu trôi.',
      ],
    },

    whenToUse: {
      use: [
        'Thẻ điểm tín dụng và mô hình logistic cần giải thích từng biến.',
        'Kết hợp với [[fe-iv]] để sàng lọc biến.',
      ],
      avoid: [
        'Mô hình cây, vốn đã tự chia nhóm nên ít được lợi.',
        'Biến có rất nhiều giá trị mà mỗi giá trị chỉ có vài dòng.',
        'Nhãn liên tục hoặc nhiều lớp, khi chưa điều chỉnh công thức.',
      ],
    },

    comparison: {
      intro: 'So sánh ba cách đưa một biến vào mô hình logistic:',
      headers: ['Tiêu chí', 'Biến số thô', 'One-Hot theo nhóm', 'WoE theo nhóm'],
      rows: [
        ['Số hệ số mỗi biến', '1', 'k-1', '1'],
        ['Quan hệ phi tuyến', 'Không biểu diễn được', 'Được', 'Được'],
        ['Ngoại lai', 'Ảnh hưởng mạnh', 'Bị giới hạn', 'Bị giới hạn'],
        ['Dùng nhãn khi mã hóa', 'Không', 'Không', 'Có'],
      ],
    },

    misconceptions: [
      {
        myth: 'WoE dương luôn có nghĩa là rủi ro thấp.',
        truth: 'Chỉ đúng khi good ở tử số. Với quy ước ngược lại, WoE dương là rủi ro cao. Giá trị tuyệt đối giữ nguyên, chỉ đổi dấu.',
      },
      {
        myth: '`%Good_i` là tỷ lệ good trong nhóm i.',
        truth: 'Đó là phần của nhóm i trong tổng số good. Nhầm sang tỷ lệ theo dòng sẽ cho kết quả sai hoàn toàn.',
      },
      {
        myth: 'WoE tạo ra thông tin mới nên luôn làm mô hình tốt hơn.',
        truth: 'WoE chỉ mã hóa lại các nhóm. Với một biến duy nhất, mô hình WoE và mô hình One-Hot trên cùng các nhóm cho dự đoán như nhau.',
      },
    ],
  },
})
