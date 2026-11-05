import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-query-optimization',
  summary:
    'Tối ưu truy vấn là giúp optimizer chọn được kế hoạch rẻ nhất, qua index phù hợp, thống kê đúng và điều kiện viết đúng cách. Index không phải lúc nào cũng được dùng, vì optimizer chọn theo chi phí ước lượng.',
  tags: ['Hiệu năng', 'Index', 'Optimizer', 'First Principles'],
  related: ['db-execution-plan', 'db-partitioning', 'db-normalization', 'db-oltp-olap', 'spark-catalyst'],
  sections: {
    definition: `**Query Optimization (Tối ưu truy vấn)** gồm hai phần: công việc của **optimizer (bộ tối ưu)**, tự chọn kế hoạch rẻ nhất cho câu SQL, và công việc của người thiết kế, tạo điều kiện để nó chọn đúng: index, thống kê và cách viết điều kiện.`,

    origin: `Với các hệ cũ, lập trình viên tự chỉ định đường đi đến dữ liệu, nên dữ liệu đổi thì chương trình phải đổi. SQL chỉ mô tả kết quả cần có, nhưng khi đó cần một thành phần tự tìm cách chạy. System R đưa ra optimizer dựa trên chi phí cuối thập niên 1970: đoán số dòng từ thống kê, rồi so sánh chi phí của các kế hoạch.`,

    whyUse: `Cùng một câu SQL có thể chạy 10 mili giây hoặc 10 phút tùy kế hoạch. Tối ưu đúng thường rẻ hơn rất nhiều so với mua thêm phần cứng hay [[db-sharding|sharding]].`,

    mechanism: `**B-tree:** index giữ các giá trị đã sắp xếp trong một cây rất nông, nên tìm một giá trị trong hàng tỷ dòng chỉ tốn vài lần đọc trang. Đổi lại, mỗi index làm chậm mọi lần ghi và tốn dung lượng.

**Cách optimizer quyết định:** \`ANALYZE\` lấy mẫu để lập thống kê. Từ đó, optimizer ước lượng số dòng khớp mỗi điều kiện, rồi tính chi phí cho từng cách quét và thứ tự Join. Ở PostgreSQL, \`seq_page_cost\` mặc định là 1.0, \`random_page_cost\` là 4.0.

**Vì sao index không phải lúc nào cũng được dùng:**

1. **Lấy quá nhiều dòng:** mỗi dòng qua index là một lần đọc ngẫu nhiên. Khi lấy một tỷ lệ lớn của bảng, quét tuần tự rẻ hơn.
2. **Điều kiện bọc cột:** index lưu giá trị gốc, không lưu kết quả của hàm.
3. **Không khớp cột đầu:** index \`(a, b)\` sắp xếp theo \`a\` trước, nên \`b\` nằm rải rác. Với ít giá trị \`a\`, skip scan của MySQL và PostgreSQL 18 vẫn có thể giúp.
4. **Mẫu không neo đầu:** \`LIKE '%abc'\` không tận dụng được thứ tự.
5. **Thống kê sai:** optimizer đánh giá sai số dòng khớp.
6. **Bảng quá nhỏ:** vài trang thì đọc thẳng rẻ hơn.

\`\`\`sql
-- Không dùng được index trên created_at
WHERE date(created_at) = '2026-01-15'
-- Dùng được
WHERE created_at >= '2026-01-15' AND created_at < '2026-01-16'
\`\`\`

**Thứ tự Join:** PostgreSQL duyệt gần như toàn bộ không gian, nhưng từ 12 mục trong \`FROM\` trở lên chuyển sang thuật toán di truyền, vì số thứ tự có thể tăng theo giai thừa.`,

    diagram: {
      mermaid: `flowchart TD
  A["Câu SQL"] --> B["Phân tích cú pháp và viết lại"]
  B --> C["Liệt kê các kế hoạch có thể"]
  E["Thống kê từ ANALYZE"] --> D["Ước lượng số dòng và chi phí"]
  C --> D
  D --> F["Chọn kế hoạch rẻ nhất"]
  F --> G["Thực thi"]`,
      caption:
        'Optimizer chỉ tốt bằng thống kê của nó. Ước lượng sai từ đầu sẽ dẫn đến kế hoạch sai ở các bước sau.',
    },

    example: `Bảng \`orders\` có 50 triệu dòng trên 1 triệu trang, có index trên \`status\`.

\`WHERE status = 'done'\` khớp 60% số dòng. Ước tính đơn giản, không tính cache: quét tuần tự tốn 1 triệu đơn vị. Qua index tốn tới 30 triệu lần đọc ngẫu nhiên x 4 = 120 triệu đơn vị. Optimizer chọn quét tuần tự là đúng.

\`WHERE status = 'failed'\` chỉ khớp 0,1%, tức 50.000 dòng, tốn khoảng 200.000 đơn vị, rẻ hơn nên index được chọn. Cùng cột và cùng index, nhưng hai giá trị cho hai kế hoạch khác nhau, nhờ thống kê biết phân phối của cột.`,

    prosCons: {
      pros: [
        '**Optimizer tự thích nghi** khi dữ liệu thay đổi, không phải sửa truy vấn.',
        '**Index làm giảm I/O hàng nghìn lần** với truy vấn chọn lọc tốt.',
        '**Index cũng cho sẵn thứ tự,** nên tránh được bước sort với `ORDER BY ... LIMIT`.',
      ],
      cons: [
        '**Mỗi index làm chậm mọi lần ghi** và chiếm bộ nhớ đệm.',
        '**Ước lượng có thể sai,** nhất là với các cột tương quan, vì optimizer mặc định coi chúng độc lập.',
        '**Kế hoạch có thể đổi đột ngột** khi dữ liệu tăng, làm truy vấn đang nhanh bỗng chậm.',
      ],
    },

    whenToUse: {
      use: [
        'Tạo index theo các truy vấn thật và thứ tự cột: điều kiện bằng trước, điều kiện khoảng sau.',
        'Dùng index bao phủ để trả kết quả không cần đọc bảng, cho truy vấn chạy rất thường xuyên.',
        'Xem [[db-execution-plan]] trước khi đổi bất cứ thứ gì.',
      ],
      avoid: [
        'Không tạo index trên cột mà giá trị phổ biến nhất chiếm phần lớn bảng, trừ khi chỉ tìm giá trị hiếm.',
        'Không thêm index cho mọi cột: cột nào không ai truy vấn thì chỉ làm chậm ghi.',
        'Không ép kế hoạch bằng hint khi chưa kiểm tra thống kê.',
      ],
    },

    comparison: {
      intro: 'Ba thuật toán Join chính mà optimizer lựa chọn:',
      headers: ['Thuật toán', 'Cách chạy', 'Hợp khi', 'Yếu khi'],
      rows: [
        ['Nested Loop', 'Mỗi dòng bên ngoài tìm bên trong', 'Bên ngoài ít dòng, bên trong có index', 'Hai bên đều lớn'],
        ['Hash Join', 'Dựng bảng băm từ một bên, dò bằng bên kia', 'Điều kiện bằng, tập lớn, không có index', 'Thiếu bộ nhớ'],
        ['Merge Join', 'Duyệt song song hai đầu vào đã sắp xếp', 'Đã có thứ tự sẵn', 'Phải sort tập rất lớn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Có index thì truy vấn chắc chắn dùng index.',
        truth: 'Optimizer chọn theo chi phí. Quét tuần tự khi lấy 60% bảng thường là quyết định đúng, không phải lỗi.',
      },
      {
        myth: 'Càng nhiều index càng tốt.',
        truth: 'Mỗi index phải cập nhật ở mỗi lần ghi và làm tăng bloat. Index không dùng đến chỉ có chi phí.',
      },
      {
        myth: 'Index `(a, b)` tuyệt đối không dùng được cho `WHERE b = 1`.',
        truth: 'Quy tắc tiền tố trái là mặc định. Skip scan có thể dùng khi `a` có ít giá trị khác nhau, nhưng thường vẫn kém hơn index bắt đầu bằng `b`.',
      },
    ],
  },
})
