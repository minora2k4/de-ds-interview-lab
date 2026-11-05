import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-transformation',
  summary:
    'Transformation tạo ra một DataFrame hoặc RDD mới từ dữ liệu cũ. Nó không chạy ngay mà chỉ ghi thêm một bước vào kế hoạch.',
  tags: ['Mô hình thực thi', 'Lazy Evaluation'],
  related: ['spark-action', 'spark-lazy-evaluation', 'spark-narrow-transformation', 'spark-wide-transformation', 'spark-dag'],
  sections: {
    definition: `**Transformation (Phép biến đổi)** là phép tính tạo ra một tập dữ liệu mới từ tập dữ liệu hiện có, ví dụ \`filter\`, \`select\`, \`withColumn\`, \`groupBy().agg()\`, \`join\`. Dữ liệu gốc không thay đổi vì tập dữ liệu trong Spark là bất biến.

Transformation được chia thành [[spark-narrow-transformation]] và [[spark-wide-transformation]], tùy theo có cần [[spark-shuffle]] hay không.`,

    origin: `Trong MapReduce, mỗi bước xử lý là một job chạy ngay, và kết quả phải ghi ra đĩa thì bước sau mới dùng được. Spark tách **mô tả công việc** khỏi **thực thi công việc**: Transformation chỉ mô tả, nên Spark có cơ hội nhìn cả chuỗi và tối ưu trước khi chạy.`,

    whyUse: `Tách Transformation khỏi [[spark-action]] cho phép [[spark-lazy-evaluation]] hoạt động. Vì Transformation không tốn tài nguyên cụm, bạn có thể chia pipeline thành nhiều bước rõ ràng, đặt tên cho từng bước, mà không lo mỗi bước tốn thêm một lần tính toán.`,

    mechanism: `Khi gọi Transformation, Spark chỉ tạo một đối tượng mới có Logical Plan chứa thêm bước vừa gọi. Với DataFrame, tên cột và kiểu dữ liệu được kiểm tra ngay, nên sai tên cột sẽ báo lỗi tức thì, nhưng dữ liệu chưa được đọc.

Tính bất biến khiến lineage trở nên đáng tin: mỗi kết quả được xác định duy nhất bởi tập cha và phép biến đổi, nên có thể tính lại an toàn khi có lỗi, miễn là hàm của bạn tất định.`,

    example: `Một pipeline làm sạch dữ liệu đơn hàng gồm các bước: lọc đơn hợp lệ, chuẩn hóa tiền tệ, nối với bảng khách hàng, tổng hợp theo ngày. Mỗi bước được viết thành một hàm riêng trả về DataFrame mới. Lúc gọi các hàm này, cụm chưa làm gì. Chỉ khi gọi \`write\` ở cuối, toàn bộ chuỗi mới được tối ưu và chạy như một kế hoạch.`,

    prosCons: {
      pros: [
        'Dễ tách pipeline thành nhiều bước mà không tốn thêm chi phí.',
        'Cho phép Spark tối ưu toàn bộ chuỗi trước khi chạy.',
        'Tính bất biến giúp khôi phục an toàn khi có lỗi.',
      ],
      cons: [
        'Khó đoán chi phí của từng bước nếu chỉ đọc code.',
        'Lỗi dữ liệu chỉ lộ ra khi có Action, cách xa nơi viết code.',
      ],
    },

    whenToUse: {
      use: [
        'Mọi bước làm sạch, biến đổi, nối và tổng hợp dữ liệu.',
        'Chia logic phức tạp thành nhiều hàm nhỏ có thể kiểm thử riêng.',
      ],
      avoid: [
        'Không dựa vào hàm có tác dụng phụ bên trong Transformation, như ghi log ra hệ thống ngoài: hàm có thể chạy nhiều lần khi Task được thử lại.',
        'Không lặp `withColumn` hàng trăm lần: dùng một `select` để kế hoạch gọn hơn.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Transformation', 'Action'],
      rows: [
        ['Kết quả trả về', 'DataFrame hoặc RDD mới', 'Giá trị về Driver, hoặc ghi ra ngoài'],
        ['Thời điểm chạy', 'Trì hoãn', 'Kích hoạt chạy ngay'],
        ['Tạo job', 'Thường không', 'Có'],
        ['Ví dụ', '`filter`, `join`, `groupBy`', '`count`, `collect`, `write`'],
      ],
    },

    misconceptions: [
      {
        myth: 'Thứ tự các Transformation trong code chính là thứ tự thực thi.',
        truth: 'Catalyst có thể sắp xếp lại, ví dụ đẩy `filter` xuống trước `join`, miễn là kết quả không đổi.',
      },
      {
        myth: 'Transformation làm thay đổi DataFrame ban đầu.',
        truth: 'DataFrame là bất biến. Transformation luôn trả về một đối tượng mới, nên bạn phải gán lại kết quả để dùng tiếp.',
      },
    ],
  },
})
