import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-tabular',
  summary:
    'Với dữ liệu dạng bảng, đánh giá khóa chính, ràng buộc tham chiếu, kiểu dữ liệu, cardinality, cơ chế thiếu (MCAR, MAR, MNAR) và Data Leakage. Hai lỗi đắt nhất là join làm nhân dòng và cột chứa thông tin từ tương lai.',
  tags: ['Dạng bảng', 'Khóa', 'MCAR', 'Leakage'],
  related: ['dq-overview', 'dq-dimensions', 'dq-profiling', 'eda-missing-values', 'eda-leakage', 'dw-fact-table', 'db-normalization'],
  sections: {
    definition: `**Tabular Data (Dữ liệu dạng bảng)** là dữ liệu tổ chức theo dòng và cột, mỗi cột có một ý nghĩa và một kiểu. Việc đánh giá xoay quanh hai câu hỏi: **cấu trúc có đúng như giả định không**, và **mỗi cột có dùng được cho bài toán không**.`,

    origin: `Cơ sở dữ liệu quan hệ tự bảo vệ cấu trúc bằng khóa chính, khóa ngoại và kiểu dữ liệu. Khi dữ liệu chuyển sang Data Lake và Data Warehouse trên cloud, phần lớn ràng buộc này không còn được bắt buộc: nhiều hệ thống chỉ khai báo khóa để tối ưu, không kiểm tra thật. Lỗi cấu trúc vì vậy vào được bảng mà không báo gì, nên phải kiểm tra lại bằng dữ liệu.`,

    whyUse: `Bảng là đầu vào của phần lớn báo cáo và mô hình, và lỗi cấu trúc lan rộng rất nhanh. Khóa trùng ở một bảng nhỏ có thể làm doanh thu cao hơn thực tế sau một phép join, mà không có câu lệnh nào báo lỗi.`,

    mechanism: `**1. Khóa chính:** số dòng phải bằng số giá trị khác nhau của khóa, và khóa không null. Đây là luật đầu tiên, vì mọi phép tính sau đó đều giả định điều này. Phải xác định đúng **độ chi tiết (grain)**: một dòng là một đơn hàng, hay một dòng hàng trong đơn.

**2. Ràng buộc tham chiếu:** \`orders.customer_id\` có nằm trong \`customers\` không. Dòng mồ côi sẽ âm thầm biến mất khi dùng inner join. Ngược lại, khóa bị trùng ở bảng bên phải làm **nhân dòng (fan-out)**.

**3. Kiểu dữ liệu:** số lưu dưới dạng chuỗi, ngày ở nhiều định dạng, đơn vị khác nhau. Ép kiểu thường biến giá trị lỗi thành null mà không báo, nên phải so tỷ lệ null trước và sau khi ép.

**4. Cardinality (Số giá trị khác nhau):**
- Cardinality bằng 1: cột hằng số, không có thông tin.
- Cardinality gần bằng số dòng: cột định danh, mô hình sẽ học thuộc lòng thay vì tổng quát hóa.
- Cardinality đột ngột tăng: có thể là cách viết mới của cùng một giá trị.

**5. Cơ chế thiếu:** xác định vì sao thiếu, không chỉ thiếu bao nhiêu.
- **MCAR (Missing Completely At Random):** thiếu hoàn toàn ngẫu nhiên, như lỗi thiết bị ngẫu nhiên.
- **MAR (Missing At Random):** thiếu phụ thuộc vào cột khác đã quan sát được, như nhóm tuổi trẻ ít khai thu nhập.
- **MNAR (Missing Not At Random):** thiếu phụ thuộc vào chính giá trị bị thiếu, như người thu nhập rất cao không khai thu nhập.

MNAR nguy hiểm nhất vì **không thể kiểm chứng chỉ từ dữ liệu quan sát được**, phải dựa vào hiểu biết nghiệp vụ. Cách xử lý xem ở [[eda-missing-values]].

**6. Data Leakage:** với mỗi cột, hỏi "giá trị này có sẵn tại thời điểm dự đoán không". Một đặc trưng đơn lẻ cho kết quả gần như hoàn hảo là dấu hiệu đáng ngờ. Xem [[eda-leakage]].`,

    example: `Đội phân tích đánh giá bộ dữ liệu 3 triệu khách hàng để dự đoán rời bỏ:

- **Khóa:** 3 triệu dòng nhưng 2,94 triệu \`customer_id\`. Khách có nhiều gói cước tạo nhiều dòng, nên grain là gói cước, không phải khách hàng.
- **Join:** nối với \`payments\` làm tổng số dòng tăng 40%, vì mỗi khách có nhiều lần thanh toán.
- **Cardinality:** \`support_agent_id\` có 80.000 giá trị, gần như định danh, nên bị loại.
- **Thiếu:** \`income\` thiếu 22%, tập trung ở nhóm thu nhập cao theo khảo sát riêng, tức nghi ngờ MNAR. Điền trung bình sẽ làm sai lệch.
- **Leakage:** \`cancel_reason\` chỉ có giá trị sau khi khách đã rời đi. Cột này một mình đạt AUC 0,98, nên bị loại.

Sau đánh giá, AUC giảm từ 0,97 xuống 0,81, nhưng đây mới là con số thật khi triển khai.`,

    prosCons: {
      pros: [
        '**Phần lớn kiểm tra tự động được** và chi phí thấp, vì cấu trúc đã rõ ràng.',
        '**Kết quả dễ giải thích,** nên dễ quy trách nhiệm về đúng hệ thống nguồn.',
      ],
      cons: [
        '**Cơ chế MNAR không kiểm chứng được** bằng dữ liệu đang có.',
        '**Leakage khó tự động hóa,** vì cần biết thời điểm mỗi cột được ghi.',
        '**Kiểm tra tham chiếu và tính duy nhất tốn kém** khi bảng rất lớn, xem [[dq-scale-strategy]].',
      ],
    },

    whenToUse: {
      use: [
        'Xác định grain và khóa trước khi tính bất kỳ tổng nào.',
        'So số dòng trước và sau mỗi phép join quan trọng.',
        'Lập danh sách mỗi cột có sẵn từ khi nào khi dữ liệu dùng cho mô hình.',
      ],
      avoid: [
        'Không tin ràng buộc khai báo trên Data Warehouse là đã được kiểm tra.',
        'Không chỉ nhìn tỷ lệ thiếu mà bỏ qua vì sao thiếu.',
      ],
    },

    comparison: {
      intro: 'Ba cơ chế thiếu có hệ quả khác nhau khi đánh giá:',
      headers: ['Cơ chế', 'Thiếu phụ thuộc vào', 'Kiểm chứng được không', 'Bỏ dòng thiếu có an toàn không'],
      rows: [
        ['MCAR', 'Không phụ thuộc gì', 'Kiểm tra được phần nào', 'Thường không gây lệch, chỉ giảm cỡ mẫu'],
        ['MAR', 'Cột khác đã quan sát', 'Một phần, xem quan hệ với các cột khác', 'Có thể lệch, cần tính đến cột liên quan'],
        ['MNAR', 'Chính giá trị bị thiếu', 'Không, phải dựa vào nghiệp vụ', 'Lệch, cần nguồn thông tin bên ngoài'],
      ],
    },

    misconceptions: [
      {
        myth: 'Bảng đã khai báo PRIMARY KEY thì không thể trùng.',
        truth: 'Nhiều Data Warehouse trên cloud chỉ dùng khai báo này làm thông tin cho bộ tối ưu, không bắt buộc. Phải tự kiểm tra bằng dữ liệu.',
      },
      {
        myth: 'Cột nhiều giá trị khác nhau thì chứa nhiều thông tin.',
        truth: 'Cột định danh có cardinality cao nhất nhưng không giúp tổng quát hóa. Mô hình học thuộc lòng và kém trên dữ liệu mới.',
      },
      {
        myth: 'Tỷ lệ thiếu thấp thì không cần quan tâm.',
        truth: 'Thiếu 3% theo cơ chế MNAR, đúng ở nhóm quan trọng nhất, có thể gây hại hơn thiếu 30% hoàn toàn ngẫu nhiên.',
      },
    ],
  },
})
