import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-drift',
  summary:
    'Data Drift là phân phối đầu vào thay đổi, Concept Drift là quan hệ giữa đầu vào và nhãn thay đổi. Data Drift đo được không cần nhãn nhưng không chắc có hại, còn Concept Drift có hại trực tiếp nhưng cần nhãn mới thấy rõ.',
  tags: ['Drift', 'Giám sát', 'Mô hình'],
  related: ['dq-distribution-comparison', 'dq-representativeness', 'dq-time-series', 'arch-observability', 'eval-train-val-test'],
  sections: {
    definition: `**Data Drift (Trôi dữ liệu)**, còn gọi là Covariate Shift, là khi phân phối đầu vào \`P(X)\` thay đổi so với lúc huấn luyện.

**Concept Drift (Trôi khái niệm)** là khi quan hệ giữa đầu vào và nhãn \`P(Y|X)\` thay đổi: cùng một đầu vào, nhưng kết quả đúng đã khác.

**Label Drift (Trôi nhãn)** là khi phân phối nhãn \`P(Y)\` thay đổi, ví dụ tỷ lệ gian lận tăng gấp đôi.`,

    origin: `Học máy cổ điển giả định dữ liệu huấn luyện và dữ liệu thực tế có cùng phân phối. Giả định đó không đúng khi người dùng, thị trường và hệ thống nguồn thay đổi. Mô hình không tự hỏng ở chỗ nào, nên không có lỗi nào báo. Khái niệm drift được đưa ra để gọi tên và đo sự thay đổi này.`,

    whyUse: `Một bộ dữ liệu được đánh giá tốt hôm nay có thể không còn đại diện sau 6 tháng. Theo dõi drift giúp biết **khi nào kết luận đánh giá cũ hết hiệu lực**, thay vì đợi đến khi kết quả kinh doanh giảm.`,

    mechanism: `**Dạng thay đổi theo thời gian:**
- **Đột ngột:** chính sách mới, sự kiện lớn, hoặc lỗi pipeline.
- **Dần dần:** sở thích người dùng thay đổi trong nhiều tháng.
- **Lặp lại:** theo mùa, như Tết hoặc Black Friday. Đây thường là mùa vụ chứ không phải drift, nên phải so cùng kỳ.

**Cách phát hiện:**

1. **Data Drift:** dùng [[dq-distribution-comparison|PSI, KS Test]] cho từng đặc trưng, so với dữ liệu huấn luyện. Không cần nhãn, nên có kết quả ngay.
2. **Prediction Drift:** theo dõi phân phối điểm dự đoán. Đây là tín hiệu tổng hợp của mọi đặc trưng.
3. **Concept Drift:** cần nhãn. Theo dõi chỉ số mô hình trên dữ liệu mới. Nếu nhãn về trễ, như vỡ nợ sau 90 ngày, thì dùng nhãn tạm hoặc tín hiệu sớm như trả chậm lần đầu.

**Không phải drift nào cũng có hại.** Một đặc trưng ít quan trọng trôi nhiều có thể không ảnh hưởng gì. Ngược lại, Concept Drift có thể không làm thay đổi \`P(X)\` chút nào, ví dụ khi đối thủ giảm giá, cùng một nhóm khách hàng nhưng hành vi đã khác. Vì thế **PSI thấp không chứng minh mô hình còn tốt**.

**Phân biệt lỗi dữ liệu và thay đổi thật:** khi phát hiện drift, hỏi trước là có lỗi không.
- **Lỗi pipeline:** đột ngột, đúng lúc có triển khai mới, chỉ ở một nguồn hoặc một phiên bản, giá trị vô lý.
- **Thay đổi thật:** nhiều đặc trưng cùng dịch chuyển theo cách có ý nghĩa, có thể khớp với sự kiện bên ngoài.

**Cách xử lý:** lỗi pipeline thì sửa dữ liệu, không huấn luyện lại, vì sẽ làm mô hình học theo lỗi. Thay đổi thật thì đánh giá lại và huấn luyện lại, có thể chỉ dùng dữ liệu gần đây nếu quan hệ đã đổi.`,

    diagram: {
      mermaid: `flowchart TD
  A["Phát hiện thay đổi: PSI hoặc điểm dự đoán"] --> B["Có lỗi pipeline không?"]
  B -->|"Có"| C["Sửa dữ liệu, không huấn luyện lại"]
  B -->|"Không"| D["Chỉ số mô hình có giảm không?"]
  D -->|"Có"| E["Đánh giá lại và huấn luyện lại"]
  D -->|"Không"| F["Ghi nhận và tiếp tục theo dõi"]`,
      caption:
        'Drift là tín hiệu để điều tra. Quyết định phụ thuộc vào nguyên nhân và ảnh hưởng.',
    },

    example: `Mô hình dự đoán vỡ nợ có nhãn sau 90 ngày.

**Tháng 3:** PSI của \`income\` tăng lên 0,4 trong một ngày. Kiểm tra cho thấy một đối tác đổi đơn vị từ triệu sang nghìn đồng. Đây là lỗi dữ liệu, nên chỉ cần sửa pipeline, không huấn luyện lại.

**Tháng 6:** ngân hàng trung ương tăng lãi suất. PSI mọi đặc trưng đều dưới 0,1, nhưng tỷ lệ trả chậm lần đầu, là tín hiệu sớm, tăng từ 3% lên 5% ở cùng dải điểm. Cùng hồ sơ nhưng hành vi đã khác: đây là Concept Drift, mà chỉ giám sát đầu vào sẽ không thấy.`,

    prosCons: {
      pros: [
        '**Data Drift không cần nhãn,** nên phát hiện sớm dù nhãn về trễ.',
        '**Giúp quyết định khi nào huấn luyện lại** dựa trên bằng chứng, thay vì theo lịch cố định.',
        '**Hay phát hiện cả lỗi pipeline,** không riêng gì thay đổi thực tế.',
      ],
      cons: [
        '**Báo động giả nhiều** nếu đặt ngưỡng trên mọi đặc trưng, vì nhiều thay đổi không có hại.',
        '**Concept Drift chỉ thấy khi có nhãn,** nên có thể phát hiện muộn.',
        '**So từng cột có thể bỏ sót** thay đổi trong quan hệ giữa các cột.',
      ],
    },

    whenToUse: {
      use: [
        'Ưu tiên theo dõi đặc trưng quan trọng và phân phối điểm dự đoán.',
        'Dùng cùng kỳ năm trước làm mốc khi dữ liệu có mùa vụ.',
        'Thiết kế tín hiệu sớm khi nhãn về trễ.',
      ],
      avoid: [
        'Không tự động huấn luyện lại khi có drift mà chưa loại trừ lỗi pipeline.',
        'Không xem PSI thấp là bằng chứng mô hình còn tốt.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Data Drift', 'Concept Drift', 'Label Drift'],
      rows: [
        ['Thứ thay đổi', '`P(X)`', '`P(Y|X)`', '`P(Y)`'],
        ['Cần nhãn để phát hiện', 'Không', 'Có', 'Có'],
        ['Có chắc gây hại không', 'Không chắc', 'Thường có', 'Tùy, có thể làm lệch ngưỡng'],
        ['Ví dụ', 'Nhiều khách trẻ hơn', 'Cùng hồ sơ, tỷ lệ vỡ nợ tăng', 'Tỷ lệ gian lận tăng gấp đôi'],
      ],
    },

    misconceptions: [
      {
        myth: 'Có drift thì phải huấn luyện lại ngay.',
        truth: 'Drift có thể do lỗi pipeline, khi đó huấn luyện lại sẽ dạy mô hình học lỗi. Hoặc nó có thể không ảnh hưởng đến kết quả.',
      },
      {
        myth: 'Không có Data Drift thì mô hình vẫn tốt.',
        truth: 'Concept Drift có thể xảy ra khi `P(X)` không đổi. Cần theo dõi kết quả thật, hoặc tín hiệu sớm.',
      },
      {
        myth: 'Biến động theo mùa là drift.',
        truth: 'Mẫu lặp lại theo chu kỳ đã biết là tính mùa vụ. Hãy so cùng kỳ, nếu không sẽ báo động mỗi mùa cao điểm.',
      },
    ],
  },
})
