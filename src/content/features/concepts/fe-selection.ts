import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-selection',
  summary:
    'Feature Selection giữ lại một tập con đặc trưng có ích, theo ba nhóm Filter, Wrapper và Embedded. Trong EDA, đây là bước rà soát cột. Trong lập mô hình, mọi bước dùng nhãn phải nằm trong kiểm định chéo.',
  tags: ['Chọn đặc trưng', 'Rò rỉ dữ liệu', 'EDA', 'First Principles'],
  related: ['fe-iv', 'fe-extraction', 'eda-correlation', 'eda-leakage', 'eda-overview', 'eval-cross-validation', 'eval-feature-importance'],
  sections: {
    definition: `**Feature Selection (Chọn đặc trưng)** là việc giữ lại một tập con các cột có sẵn và bỏ phần còn lại. Khác với [[fe-extraction]], cách này không tạo cột mới, nên ý nghĩa của từng cột giữ nguyên.

Có hai góc nhìn:

- **Phân tích dữ liệu:** rà soát để hiểu cột nào dùng được, cột nào trùng lặp, cột nào đáng nghi.
- **Lập mô hình:** tìm tập con cho hiệu năng tốt và ổn định ngoài mẫu.`,

    origin: `Khi số cột tăng, cột nhiễu làm mô hình dễ quá khớp, và mỗi cột đều tốn chi phí thu thập, giám sát. Thử mọi tập con là bất khả thi: 50 cột đã có khoảng 10^15 tập con.

Vì vậy các nhóm phương pháp xấp xỉ ra đời. Kohavi và John (1997) hệ thống hóa cách tiếp cận Wrapper, và Guyon và Elisseeff (2003) tổng kết việc phân chia thành Filter, Wrapper, Embedded. Tài liệu scikit-learn không dùng ba tên gọi này, nên cách xếp nhóm các công cụ dưới đây là theo quy ước chung.`,

    whyUse: `- **Giảm quá khớp** khi số cột lớn so với số dòng.
- **Giảm chi phí vận hành:** ít cột hơn đồng nghĩa ít pipeline, ít giám sát trôi dữ liệu hơn.
- **Dễ giải thích hơn,** nhất là trong lĩnh vực có quy định như tín dụng.

Với các mô hình mạnh đã có điều chuẩn, độ chính xác có thể không tăng. Lợi ích khi đó chủ yếu là chi phí và độ ổn định.`,

    mechanism: `**Góc nhìn phân tích dữ liệu.** Trong [[eda-overview|EDA]], hãy xem từng cột trước khi nghĩ đến mô hình: cột hằng hoặc gần hằng, tỷ lệ thiếu quá cao, cột dạng mã định danh, cặp cột [[eda-correlation|tương quan]] rất cao, và cột có quan hệ với nhãn mạnh bất thường, vốn là dấu hiệu của [[eda-leakage|rò rỉ]]. Mọi nhận xét có dùng nhãn nên làm trên tập train.

**Góc nhìn lập mô hình, ba nhóm phương pháp:**

- **Filter (Lọc):** chấm điểm từng cột bằng một thống kê, không cần mô hình. Ví dụ phương sai, F-test (chỉ đo phụ thuộc tuyến tính), Mutual Information (đo mọi dạng phụ thuộc, cần nhiều mẫu hơn), \`chi2\` (chỉ cho giá trị không âm), và [[fe-iv|IV]]. Nhanh, nhưng xét từng cột riêng nên bỏ sót tương tác và không thấy trùng lặp.
- **Wrapper (Bao quanh):** thử các tập con bằng cách huấn luyện mô hình. \`SequentialFeatureSelector\` thêm hoặc bớt dần từng cột, nên mỗi bước đi từ m cột xuống m-1 cột với k fold cần \`m × k\` lần huấn luyện. Bắt được tương tác, nhưng tốn kém và dễ quá khớp với tập đánh giá. RFE thường được xếp vào đây, dù nó dựa vào trọng số nội tại của mô hình.
- **Embedded (Nhúng):** chọn ngay trong lúc huấn luyện. L1 đưa hệ số của cột yếu về 0, còn cây cho độ quan trọng để dùng với \`SelectFromModel\`. Chỉ cần một lần huấn luyện, nhưng kết quả gắn với loại mô hình. L1 kém ổn định khi các cột tương quan cao, còn độ quan trọng của cây thiên về cột nhiều giá trị, xem [[eval-feature-importance]].

**Phải chọn bên trong kiểm định chéo.** Chọn cột bằng nhãn trên toàn bộ dữ liệu rồi mới đánh giá sẽ làm nhãn của tập kiểm tra ảnh hưởng đến lựa chọn. Ví dụ của scikit-learn: 200 dòng, 10.000 cột ngẫu nhiên, nhãn ngẫu nhiên. Chọn 25 cột trước khi chia cho độ chính xác 0.76. Làm đúng thì còn 0.5, đúng với việc dữ liệu không có tín hiệu.`,

    diagram: {
      mermaid: `flowchart TD
  A["Toàn bộ cột ứng viên"] --> B["EDA: loại cột hằng, mã định danh, rò rỉ"]
  B --> C["Chia train và test"]
  C --> D["Trong mỗi fold: Filter rồi Wrapper hoặc Embedded"]
  D --> E["Kiểm tra độ ổn định giữa các fold"]
  E --> F["Chốt tập cột, đánh giá một lần trên test"]`,
      caption: 'Bước đầu không dùng nhãn nên có thể làm trên toàn bộ dữ liệu. Mọi bước dùng nhãn phải nằm trong từng fold.',
    },

    example: `Mô hình rủi ro có 420 cột và 60.000 dòng. Quy trình gồm bốn tầng:

1. Rà soát: bỏ 60 cột hằng hoặc thiếu trên 95%, và 8 cột sinh sau ngày ra quyết định.
2. Filter trong từng fold: giữ cột có IV từ 0.02 trở lên, còn khoảng 180 cột.
3. Loại trùng lặp: trong mỗi cặp tương quan trên 0.9, giữ một cột, còn khoảng 90 cột.
4. Embedded với L1: còn khoảng 30 cột.

AUC kiểm định chéo là 0.782, so với 0.786 khi dùng cả 352 cột. Đội chấp nhận mất 0.004 AUC để giảm 90% số cột cần giám sát.`,

    prosCons: {
      pros: [
        '**Giữ nguyên ý nghĩa của cột,** nên dễ giải thích hơn giảm chiều.',
      ],
      cons: [
        '**Có thể mất tín hiệu** khi cột yếu lại có ích qua tương tác.',
        '**Kết quả có thể không ổn định** giữa các lần lấy mẫu, nhất là khi các cột tương quan.',
      ],
    },

    whenToUse: {
      use: [
        'Số cột lớn so với số dòng, hoặc chi phí thu thập cột cao.',
        'Cần mô hình dễ giải thích và dễ giám sát.',
      ],
      avoid: [
        'Tốn nhiều công sức khi ít cột và mô hình đã có điều chuẩn tốt.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Filter', 'Wrapper', 'Embedded'],
      rows: [
        ['Dùng mô hình', 'Không', 'Có, nhiều lần', 'Có, trong khi huấn luyện'],
        ['Chi phí', 'Thấp', 'Cao', 'Trung bình'],
        ['Thấy tương tác', 'Không, nếu đơn biến', 'Có', 'Tùy mô hình'],
        ['Rủi ro chính', 'Giữ cột trùng lặp', 'Quá khớp, tốn kém', 'Gắn với loại mô hình'],
        ['Ví dụ', 'F-test, IV', 'SFS, RFE', 'L1, độ quan trọng của cây'],
      ],
    },

    misconceptions: [
      {
        myth: 'Chọn đặc trưng là bước làm một lần trước khi kiểm định chéo.',
        truth: 'Nếu bước đó dùng nhãn, nó là một phần của việc huấn luyện và phải lặp lại trong từng fold.',
      },
      {
        myth: 'Cột có tương quan thấp với nhãn thì nên bỏ.',
        truth: 'Tương quan chỉ đo quan hệ tuyến tính đơn biến. Một cột vẫn có thể có ích qua quan hệ phi tuyến hoặc tương tác.',
      },
      {
        myth: 'L1 bỏ một cột nghĩa là cột đó vô dụng.',
        truth: 'Khi hai cột tương quan cao, L1 có thể chọn một cột gần như tùy ý. Cột bị bỏ vẫn có thể mang tín hiệu, chỉ là trùng với cột được giữ.',
      },
    ],
  },
})
