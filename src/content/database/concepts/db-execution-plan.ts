import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-execution-plan',
  summary:
    'Execution Plan là cây các bước chạy một câu SQL. So sánh số dòng ước lượng với thực tế qua EXPLAIN ANALYZE là cách nhanh nhất để tìm nguyên nhân truy vấn chậm.',
  tags: ['Hiệu năng', 'EXPLAIN', 'Chẩn đoán'],
  related: ['db-query-optimization', 'db-partitioning', 'db-denormalization', 'spark-catalyst'],
  sections: {
    definition: `**Execution Plan (Kế hoạch thực thi)** là cây các node mà [[db-query-optimization|optimizer]] chọn để chạy câu SQL. \`EXPLAIN\` cho xem kế hoạch, còn \`EXPLAIN ANALYZE\` chạy thật và cho biết số liệu thực tế.`,

    origin: `SQL chỉ mô tả kết quả, nên đọc câu lệnh không biết được vì sao nó chậm. Công cụ này khắc phục việc phải đoán, bằng cách cho thấy quyết định của optimizer.`,

    whyUse: `Biết chính xác thời gian nằm ở bước nào, trước khi thêm index hay viết lại truy vấn.`,

    mechanism: `Đọc từ node sâu nhất đi lên, mỗi node có:

- **cost:** chi phí khởi động và tổng chi phí, theo đơn vị tùy ý, không phải mili giây. Cost của node đã gồm các node con.
- **rows:** số dòng ước lượng node này trả ra, không phải số dòng nó quét.
- **actual time, rows, loops:** có khi dùng \`ANALYZE\`. Hai giá trị đầu là **trung bình mỗi vòng lặp**, nên phải nhân với \`loops\`.
- **Index Cond và Filter:** Index Cond giới hạn phần index phải đọc, còn Filter loại dòng sau khi đã đọc. \`Rows Removed by Filter\` lớn là dấu hiệu đọc thừa.

**Lưu ý:** \`EXPLAIN ANALYZE\` chạy thật câu lệnh. Với lệnh ghi, hãy bọc trong \`BEGIN\` rồi \`ROLLBACK\`. MySQL cũng có lệnh này, in theo dạng cây.`,

    example: `Kế hoạch rút gọn của một truy vấn chạy 40 giây:

\`\`\`text
Nested Loop (rows=10) (actual rows=48210)
  -> Seq Scan on orders (rows=10) (actual rows=48210)
  -> Index Scan on customers (actual rows=1 loops=48210)
\`\`\`

Ước lượng 10 dòng, thực tế 48.210 dòng, nên Nested Loop được chọn sai. Chạy \`ANALYZE orders\` để cập nhật thống kê, kế hoạch đổi sang Hash Join và còn 0,9 giây.`,

    prosCons: {
      pros: ['Chỉ ra bước tốn thời gian và sai số ước lượng.'],
      cons: ['Thử trên bảng nhỏ không suy ra được cho bảng lớn.'],
    },

    whenToUse: {
      use: ['Trước và sau mỗi lần đổi index hay truy vấn.'],
      avoid: ['Không chạy `EXPLAIN ANALYZE` trên lệnh ghi mà không có `ROLLBACK`.'],
    },

    comparison: {
      headers: ['Node quét', 'Cách đọc', 'Khi nào hợp'],
      rows: [
        ['Seq Scan', 'Đọc tuần tự cả bảng', 'Lấy nhiều dòng, bảng nhỏ'],
        ['Index Scan', 'Theo index, đọc bảng từng dòng', 'Rất ít dòng, cần thứ tự'],
        ['Bitmap Heap Scan', 'Gom vị trí, đọc bảng theo thứ tự vật lý', 'Số dòng vừa phải'],
        ['Index Only Scan', 'Chỉ đọc index', 'Index chứa đủ các cột cần'],
      ],
    },

    misconceptions: [
      {
        myth: 'Cost là thời gian chạy dự kiến tính bằng mili giây.',
        truth: 'Đó là đơn vị tùy ý, chỉ dùng để so sánh các kế hoạch của cùng một truy vấn.',
      },
      {
        myth: 'Seq Scan trong kế hoạch luôn là dấu hiệu xấu.',
        truth: 'Khi lấy tỷ lệ lớn của bảng, đó thường là lựa chọn rẻ nhất.',
      },
    ],
  },
})
