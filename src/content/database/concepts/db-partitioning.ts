import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-partitioning',
  summary:
    'Partitioning chia một bảng logic thành nhiều mảnh vật lý trên cùng máy chủ, giúp cắt bớt dữ liệu phải đọc và xóa dữ liệu cũ rất nhanh, nếu truy vấn lọc theo khóa phân vùng.',
  tags: ['Mở rộng', 'Partition', 'Vận hành'],
  related: ['db-sharding', 'db-query-optimization', 'db-execution-plan', 'spark-partition', 'kafka-partition'],
  sections: {
    definition: `**Partitioning (Phân vùng dữ liệu)** chia một bảng logic lớn thành nhiều mảnh vật lý theo **khóa phân vùng**, thường trên cùng một máy chủ. PostgreSQL có ba kiểu: **Range** (theo khoảng), **List** (theo danh sách giá trị), **Hash** (theo giá trị băm).`,

    origin: `Khi bảng lên hàng tỷ dòng, index sâu hơn và không còn vừa bộ nhớ, còn xóa dữ liệu cũ bằng \`DELETE\` chạy hàng giờ và để lại rất nhiều dòng chết. Partitioning khắc phục điều này mà ứng dụng vẫn thấy một bảng duy nhất.`,

    whyUse: `Truy vấn lọc theo khóa chỉ đọc vài partition. Tài liệu PostgreSQL gợi ý cân nhắc khi bảng lớn hơn bộ nhớ máy chủ.`,

    mechanism: `- **Partition Pruning (cắt tỉa phân vùng):** planner chứng minh một partition không thể chứa dòng khớp \`WHERE\` rồi bỏ qua nó.
- **Xóa nhanh:** \`DROP TABLE\` hoặc \`DETACH PARTITION\` chỉ đổi metadata, không phải xóa từng dòng, nên cũng tránh được chi phí \`VACUUM\`.
- **Giới hạn của khóa duy nhất:** mỗi index chỉ biết partition của nó, nên \`UNIQUE\` phải chứa đủ các cột của khóa phân vùng, cả trên PostgreSQL và MySQL.
- **Chi phí khi có quá nhiều partition:** planner phải xét nhiều hơn và tốn bộ nhớ hơn. PostgreSQL xử lý tốt vài nghìn partition nếu truy vấn cắt được phần lớn.`,

    example: `Bảng log có 3 tỷ dòng, chia theo tháng, mỗi tháng 80 triệu dòng. Truy vấn một tuần chỉ đọc 1 đến 2 partition thay vì toàn bộ. Xóa tháng cũ bằng \`DROP TABLE\` mất vài mili giây, trong khi \`DELETE\` 80 triệu dòng mất hàng giờ và làm bảng phình ra.`,

    prosCons: {
      pros: ['Đọc ít hơn khi lọc đúng khóa, xóa dữ liệu cũ gần như tức thời.'],
      cons: ['Truy vấn không có khóa phân vùng phải quét mọi partition. Khó giữ khóa duy nhất trên cột khác.'],
    },

    whenToUse: {
      use: ['Bảng rất lớn, phần lớn truy vấn lọc theo một cột, và dữ liệu cũ xóa theo lô.'],
      avoid: ['Bảng còn nhỏ, hoặc truy vấn không lọc theo cột nào cố định.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Partitioning', 'Sharding'],
      rows: [
        ['Phạm vi', 'Một máy chủ', 'Nhiều máy chủ'],
        ['Giải quyết', 'Bảng quá lớn', 'Giới hạn ghi và dung lượng'],
      ],
    },

    misconceptions: [
      {
        myth: 'Partition luôn làm truy vấn nhanh hơn.',
        truth: 'Thiếu khóa phân vùng trong `WHERE` thì không cắt tỉa được, và còn tốn hơn vì phải đọc index của mọi partition.',
      },
      {
        myth: 'Partition trong cơ sở dữ liệu giống [[spark-partition]].',
        truth: 'Partition của Spark là đơn vị xử lý song song. Ở đây là cách tổ chức lưu trữ trên đĩa.',
      },
    ],
  },
})
