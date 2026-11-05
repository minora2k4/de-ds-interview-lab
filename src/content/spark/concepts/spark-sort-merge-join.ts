import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-sort-merge-join',
  summary:
    'Sort Merge Join shuffle cả hai bảng theo key, sắp xếp từng Partition rồi trộn. Đây là chiến lược mặc định cho Join hai bảng lớn vì có thể tràn ra đĩa, nên ổn định.',
  tags: ['Join', 'Shuffle'],
  related: ['spark-broadcast-join', 'spark-shuffle', 'spark-data-skew', 'spark-wide-transformation', 'spark-catalyst'],
  sections: {
    definition: `**Sort Merge Join (Join bằng sắp xếp và trộn)** là chiến lược Join gồm ba bước: [[spark-shuffle]] cả hai bảng theo key, sắp xếp trong từng Partition, rồi trộn hai danh sách đã sắp xếp để tìm các dòng khớp.

Đây là chiến lược mặc định khi Join bằng phép so sánh bằng (equi-join) giữa hai bảng lớn, trên kế hoạch thực thi là \`SortMergeJoin\`.`,

    origin: `Đây là thuật toán Join kinh điển từ cơ sở dữ liệu truyền thống, trước đó cũng được MapReduce dùng trong Reduce-side Join. Trong môi trường phân tán, nó rất phù hợp vì sắp xếp ngoài bộ nhớ được nghiên cứu kỹ. Với dữ liệu lớn không vừa bộ nhớ, đây là lựa chọn an toàn hơn so với Hash Join.`,

    whyUse: `Khi cả hai bảng đều lớn thì không thể Broadcast. Sort Merge Join có thể **tràn ra đĩa khi thiếu bộ nhớ** thay vì báo lỗi, nên ổn định với dữ liệu rất lớn và hỗ trợ mọi loại Join bằng, kể cả \`FULL OUTER JOIN\`.`,

    mechanism: `Hai bảng được xử lý như sau:

1. **Shuffle.** Cả hai bảng được băm theo key Join, nên các dòng cùng key về cùng một Partition.
2. **Sort.** Mỗi Partition được sắp xếp theo key, có thể tràn ra đĩa nếu thiếu bộ nhớ.
3. **Merge.** Duyệt song song hai danh sách đã sắp, tương tự thuật toán trộn của Merge Sort.

Khi dữ liệu đã được chia sẵn hoặc sắp sẵn phù hợp, như bucketing, Spark có thể bỏ qua bước tương ứng. Với AQE, Spark có thể chia nhỏ các Partition quá lớn để xử lý skew, hoặc đổi sang Broadcast nếu thấy một bên đủ nhỏ.`,

    example: `Bảng \`orders\` 5 TB được join với \`order_items\` 12 TB theo \`order_id\`. Không bên nào đủ nhỏ để Broadcast, nên Spark dùng Sort Merge Join với 4.000 Partition. Spark UI cho thấy Stage Join có spill vừa phải và ổn định. Vì hai bảng này được join mỗi ngày, nhóm chuyển sang bucketing theo \`order_id\` để bỏ hẳn shuffle, giảm được một nửa thời gian chạy.`,

    prosCons: {
      pros: [
        'Xử lý được hai bảng rất lớn vì có thể tràn ra đĩa.',
        'Hỗ trợ mọi loại equi-join, kể cả `FULL OUTER JOIN`.',
        'Ổn định và dễ dự đoán.',
      ],
      cons: [
        'Tốn kém do shuffle cả hai bảng và sắp xếp.',
        'Dễ gặp skew khi key phân bố không đều.',
        'Chỉ dùng được với điều kiện bằng và key sắp xếp được.',
      ],
    },

    whenToUse: {
      use: [
        'Cả hai bảng đều lớn và không bên nào Broadcast được.',
        'Cần `FULL OUTER JOIN` trên dữ liệu lớn.',
      ],
      avoid: [
        'Một bên đủ nhỏ: dùng [[spark-broadcast-join]] sẽ rẻ hơn rất nhiều.',
        'Điều kiện không phải phép so sánh bằng: Spark phải dùng Nested Loop Join, cần xem lại logic.',
      ],
    },

    comparison: {
      intro: 'Chiến lược Join nào được chọn phụ thuộc vào điều kiện và kích thước:',
      headers: ['Điều kiện', 'Chiến lược thường dùng', 'Ghi chú'],
      rows: [
        ['Có điều kiện bằng, một bên nhỏ', 'Broadcast Hash Join', 'Rẻ nhất'],
        ['Có điều kiện bằng, hai bên lớn', 'Sort Merge Join', 'Mặc định, ổn định'],
        ['Điều kiện không bằng, một bên nhỏ', 'Broadcast Nested Loop Join', 'Tốn CPU'],
        ['Điều kiện không bằng, hai bên lớn', 'Cartesian Product', 'Rất tốn, nên tránh'],
      ],
    },

    misconceptions: [
      {
        myth: 'Sort Merge Join luôn chậm hơn Hash Join.',
        truth: 'Khi dữ liệu không vừa bộ nhớ, Hash Join có thể lỗi hoặc chậm, trong khi Sort Merge Join vẫn ổn định. Mỗi cách có điểm mạnh riêng.',
      },
      {
        myth: 'Tăng bộ nhớ sẽ giải quyết skew của Sort Merge Join.',
        truth: 'Key lệch vẫn nằm trong một Partition. Cần dùng AQE skew join, Salting, hoặc xử lý riêng key lớn.',
      },
    ],
  },
})
