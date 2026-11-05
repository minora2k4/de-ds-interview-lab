import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-scd',
  summary:
    'SCD là cách xử lý khi thuộc tính của chiều thay đổi theo thời gian. Type 1 ghi đè, Type 2 thêm dòng để giữ lịch sử nhưng làm bảng lớn, các loại còn lại cân bằng giữa hai đầu đó.',
  tags: ['Mô hình chiều', 'Lịch sử', 'Đánh đổi', 'First Principles'],
  related: ['dw-dimension-table', 'dw-fact-table', 'dw-star-schema', 'etl-cdc', 'etl-idempotency', 'etl-incremental'],
  sections: {
    definition: `**Slowly Changing Dimensions (SCD, Chiều thay đổi chậm)** là các kỹ thuật xử lý khi thuộc tính của [[dw-dimension-table|Dimension Table]] đổi giá trị, ví dụ khách hàng chuyển sang vùng khác. Câu hỏi cốt lõi là: **số liệu cũ nên được xem theo giá trị lúc sự kiện xảy ra, hay theo giá trị hiện tại?**`,

    origin: `Hệ giao dịch chỉ cần giá trị hiện tại, nên thường ghi đè. Kho phân tích lại phải trả lời câu hỏi về quá khứ. Nếu cũng ghi đè, doanh thu của khách đã chuyển vùng sẽ bị tính hết sang vùng mới, và báo cáo năm ngoái âm thầm thay đổi.

Ralph Kimball đặt tên Type 1, 2, 3, về sau bổ sung Type 0 và các loại lai 4, 5, 6, 7.`,

    whyUse: `SCD quyết định báo cáo lịch sử có đúng và lặp lại được hay không. Không có loại tốt nhất cho cả bảng: **chọn theo từng thuộc tính**, dựa trên việc nghiệp vụ có cần lịch sử của nó không.`,

    mechanism: `**Các loại và đánh đổi:**

- **Type 0, giữ nguyên:** giá trị không bao giờ đổi, như ngày sinh. Không tốn gì, nhưng không phản ánh thay đổi.
- **Type 1, ghi đè:** rẻ và đơn giản, nhưng mất lịch sử. Báo cáo cũ đổi theo và bảng tổng hợp có thể phải tính lại.
- **Type 2, thêm dòng:** mỗi phiên bản là một dòng với Surrogate Key mới, kèm \`valid_from\`, \`valid_to\`, \`is_current\`. Lịch sử đầy đủ, nhưng bảng lớn và pipeline phức tạp.
- **Type 3, thêm cột:** thêm \`previous_region\`. Số dòng không tăng, nhưng chỉ giữ vài giá trị. Hợp với so sánh trước và sau một lần tổ chức lại.
- **Type 4:** Kimball định nghĩa là **mini-dimension**: tách nhóm thuộc tính đổi nhanh sang bảng riêng, fact giữ khóa của cả hai bảng. Nhiều tài liệu khác dùng tên này cho **bảng lịch sử riêng**, nên nên làm rõ khi trao đổi.
- **Type 6 (1 + 2 + 3):** có dòng Type 2, thêm cột giá trị hiện tại được ghi đè trên mọi dòng cùng durable key. Xem được cả hai góc, nhưng mỗi lần đổi phải ghi nhiều dòng.

**Vì sao Type 2 làm bảng lớn:** số dòng bằng tổng số phiên bản, không phải số đối tượng. Một thuộc tính đổi thường xuyên làm cả dòng bị nhân bản, gồm cả các cột không đổi.

**Vì sao Type 2 làm Join phức tạp:**

1. **Khi nạp fact:** phải tìm đúng phiên bản theo thời gian sự kiện. Đây là Join theo khoảng, không phải so sánh bằng, nên chậm hơn.
2. **Khi truy vấn:** fact đã giữ Surrogate Key thì Join rất đơn giản và tự đúng theo thời điểm. Nhưng Join theo mã gốc sẽ nhân bản dòng và làm số liệu bị thổi phồng.
3. **Muốn xem giá trị hiện tại:** phải đi qua durable key, thêm một bước Join hoặc một view.
4. **Dữ liệu đến trễ:** fact đến trễ phải tìm phiên bản cũ. Thay đổi của chiều đến trễ còn có thể buộc gán lại khóa cho fact đã nạp.

Nên dùng khoảng nửa mở, \`valid_from <= t < valid_to\`, để mỗi thời điểm chỉ khớp đúng một phiên bản. Pipeline cũng phải [[etl-idempotency|lũy đẳng]], để chạy lại không tạo phiên bản trùng.`,

    diagram: {
      mermaid: `flowchart TD
  A["Bản ghi mới từ CDC"] --> B["So sánh với dòng is_current"]
  B --> C["Không đổi: bỏ qua"]
  B --> D["Có đổi: đóng dòng cũ, đặt valid_to"]
  D --> E["Thêm dòng mới, Surrogate Key mới"]
  E --> F["Fact nạp sau dùng khóa mới"]`,
      caption: 'Quy trình Type 2: fact cũ vẫn trỏ tới phiên bản cũ, nên báo cáo lịch sử không đổi.',
    },

    example: `\`dim_customer\` có 10 triệu khách, theo dõi Type 2 cho \`region\` và \`segment\`. Mỗi khách đổi trung bình một lần mỗi năm, nên sau 5 năm bảng có khoảng 60 triệu dòng, chấp nhận được.

Sau đó có người thêm \`loyalty_points\` vào Type 2. Cột này đổi gần như mỗi ngày, nên bảng tăng khoảng 3,65 tỷ dòng mỗi năm. Cách sửa là chuyển nó sang mini-dimension theo khoảng điểm, hoặc lưu thành số đo trong fact snapshot theo ngày.`,

    prosCons: {
      pros: [
        '**Type 2 tái hiện đúng quá khứ:** báo cáo năm ngoái chạy lại vẫn ra đúng số cũ.',
        '**Type 1 rất đơn giản,** hợp với sửa lỗi chính tả, nơi lịch sử không có giá trị.',
      ],
      cons: [
        '**Type 2 tăng số dòng** và tăng chi phí pipeline, nhất là khi thuộc tính đổi nhanh.',
        '**Type 6 tốn công ghi:** mỗi lần đổi phải cập nhật mọi dòng của đối tượng.',
      ],
    },

    whenToUse: {
      use: [
        'Type 2 cho thuộc tính ảnh hưởng tới phân tích lịch sử: vùng, phân khúc, người phụ trách.',
        'Type 1 cho sửa lỗi và thuộc tính không ai hỏi lịch sử.',
        'Mini-dimension (Type 4) cho nhóm thuộc tính đổi nhanh hoặc dạng khoảng.',
      ],
      avoid: [
        'Không bật Type 2 cho mọi cột theo mặc định.',
        'Không Join fact với chiều Type 2 theo mã gốc khi chưa lọc phiên bản.',
      ],
    },

    comparison: {
      intro: 'Tóm tắt đánh đổi giữa các loại:',
      headers: ['Loại', 'Cách làm', 'Lịch sử', 'Chi phí chính'],
      rows: [
        ['Type 0', 'Giữ giá trị gốc', 'Chỉ giá trị gốc', 'Không phản ánh thay đổi'],
        ['Type 1', 'Ghi đè', 'Không có', 'Báo cáo cũ đổi theo'],
        ['Type 2', 'Thêm dòng', 'Đầy đủ', 'Bảng lớn, Join và nạp phức tạp'],
        ['Type 3', 'Thêm cột', 'Giới hạn', 'Đổi schema cho mỗi thuộc tính'],
        ['Type 4', 'Tách mini-dimension', 'Theo nhóm thuộc tính', 'Fact thêm một khóa'],
        ['Type 6', 'Type 2 thêm cột hiện tại', 'Đầy đủ và hiện tại', 'Ghi nhiều dòng mỗi lần đổi'],
      ],
    },

    misconceptions: [
      {
        myth: 'Type 2 lúc nào cũng tốt nhất vì giữ được mọi thứ.',
        truth: 'Lịch sử không ai dùng vẫn tốn dung lượng và làm pipeline phức tạp. Hãy chọn theo từng thuộc tính.',
      },
      {
        myth: 'Mọi truy vấn trên chiều Type 2 đều cần điều kiện theo khoảng thời gian.',
        truth: 'Fact đã giữ Surrogate Key thì Join bằng khóa này là đủ. Phép Join theo khoảng chủ yếu nằm ở bước nạp fact và khi so sánh theo mã gốc.',
      },
    ],
  },
})
