import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-schema-evolution',
  summary:
    'Schema Evolution là đổi lược đồ mà dữ liệu cũ và chương trình đang chạy vẫn hoạt động. Quy tắc backward và forward quyết định thứ tự triển khai.',
  tags: ['Lược đồ', 'Avro', 'Parquet', 'Iceberg', 'Delta Lake'],
  related: ['dw-data-lakehouse', 'dw-medallion', 'etl-validation', 'kafka-consumer', 'kafka-producer'],
  sections: {
    definition: `**Schema Evolution (Tiến hóa lược đồ)** là thay đổi schema theo thời gian mà dữ liệu cũ vẫn đọc được. **Backward** nghĩa là schema mới đọc được dữ liệu cũ. **Forward** nghĩa là schema cũ đọc được dữ liệu mới. **Full** là có cả hai.`,

    origin: `Trên data lake, dữ liệu nằm trong hàng triệu tệp bất biến ghi ở nhiều thời điểm. Ghi lại toàn bộ mỗi lần đổi cấu trúc thì quá tốn, nên cần quy tắc đọc tệp cũ bằng schema mới.`,

    whyUse: `Có quy tắc tương thích thì producer và consumer triển khai độc lập được.`,

    mechanism: `**Thứ tự triển khai** suy ra từ định nghĩa: backward thì nâng cấp consumer trước, forward thì nâng cấp producer trước. Schema Registry của Confluent mặc định dùng BACKWARD.

**Avro:** bên đọc có cả writer schema và reader schema, cột khớp theo tên. Cột bên đọc không có sẽ bị bỏ qua. Cột bên ghi không có sẽ lấy giá trị mặc định, không có mặc định thì báo lỗi. Đổi tên cần alias.

**Parquet:** schema nằm ở footer từng tệp, còn định dạng không quy định cách đọc giữa các phiên bản, việc đó do engine quyết định. Spark tắt \`mergeSchema\` mặc định từ 1.5.0 vì tốn kém.

**Delta Lake:** mặc định từ chối cột lạ. \`mergeSchema\` thêm cột, column mapping cho đổi tên và xóa cột không cần ghi lại tệp.

**Iceberg:** cột nhận diện bằng ID, nên đổi tên hay xóa rồi thêm cột trùng tên vẫn an toàn.`,

    example: `Xóa cột \`status\` rồi thêm cột \`status\` mới mang nghĩa khác. Khớp theo tên thì 2 năm dữ liệu cũ bị đọc nhầm thành giá trị mới. Iceberg cấp ID mới cho cột mới, nên tệp cũ đọc ra null.`,

    prosCons: {
      pros: ['Thêm cột không cần ghi lại hàng PB dữ liệu.'],
      cons: ['Tự động gộp schema có thể đưa cột rác vào bảng.'],
    },

    whenToUse: {
      use: ['Thêm cột có mặc định hoặc cho phép null.'],
      avoid: ['Không tái sử dụng tên cột đã xóa khi khớp theo tên.'],
    },

    comparison: {
      intro: 'Đối chiếu theo tài liệu chính thức:',
      headers: ['Công nghệ', 'Khớp cột', 'Mở rộng kiểu'],
      rows: [
        ['Avro', 'Theo tên, có alias', 'Số mở rộng dần: `int`, `long`, `float`, `double`; `string` và `bytes` đổi lẫn nhau'],
        ['Parquet', 'Do engine quyết định', 'Do engine quyết định'],
        ['Iceberg', 'Theo ID', '`int` sang `long`, `float` sang `double`, tăng precision của `decimal`'],
        ['Delta Lake', 'Theo tên, hoặc column mapping', 'Bật type widening thì không ghi lại tệp'],
      ],
    },

    misconceptions: [
      {
        myth: 'Backward nghĩa là chương trình cũ đọc được dữ liệu mới.',
        truth: 'Ngược lại. Đó là forward. Backward là chương trình mới đọc được dữ liệu cũ.',
      },
    ],
  },
})
