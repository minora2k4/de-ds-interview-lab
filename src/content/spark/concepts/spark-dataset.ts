import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-dataset',
  summary:
    'Dataset là API có kiểu tĩnh trên Scala và Java, kết hợp kiểm tra kiểu của RDD với tối ưu của DataFrame. Python không có Dataset.',
  tags: ['API', 'Scala', 'Kiểu dữ liệu'],
  related: ['spark-dataframe', 'spark-rdd', 'spark-catalyst', 'spark-tungsten'],
  sections: {
    definition: `**Dataset** là tập dữ liệu phân tán có kiểu xác định, ví dụ \`Dataset[Order]\` trong Scala. Mỗi dòng là một đối tượng thuộc lớp bạn định nghĩa, nên **sai tên trường hoặc sai kiểu sẽ báo lỗi ngay khi biên dịch**.

Tài liệu Spark nêu rõ Dataset chỉ có trên **Scala và Java**. Python và R không hỗ trợ, nhưng nhiều lợi ích đã có sẵn nhờ tính động của ngôn ngữ.`,

    origin: `Dataset ra đời năm 2016 để lấp khoảng trống giữa hai API: [[spark-rdd|RDD]] có kiểm tra kiểu nhưng không được tối ưu, còn [[spark-dataframe|DataFrame]] được tối ưu nhưng lỗi tên cột hoặc kiểu dữ liệu chỉ lộ ra lúc chạy. Từ Spark 2.0, hai API DataFrame và Dataset được hợp nhất, DataFrame trở thành \`Dataset[Row]\`.`,

    whyUse: `Trong các codebase Scala lớn, một job có thể chạy hàng giờ rồi mới lỗi vì gõ sai tên cột. Dataset cho phép phát hiện lỗi đó ngay khi biên dịch, và IDE gợi ý được tên trường. Đây là lợi ích về an toàn và bảo trì code, không phải về tốc độ.`,

    mechanism: `Dataset dùng **Encoder** để chuyển đổi giữa đối tượng JVM và định dạng nhị phân của [[spark-tungsten]].

Điểm cần chú ý: khi viết lambda như \`ds.map(o => o.amount * 2)\`, Spark phải **giải mã đối tượng** để chạy hàm của bạn. Catalyst không nhìn được bên trong lambda nên không thể đẩy điều kiện lọc hay bỏ cột thừa. Ngược lại, biểu thức cột như \`ds.select($"amount" * 2)\` vẫn được tối ưu đầy đủ.`,

    example: `Một nhóm xây dựng thư viện biến đổi dữ liệu thanh toán bằng Scala, dùng chung cho nhiều dự án. Họ định nghĩa \`case class Payment\` và viết hàm nhận \`Dataset[Payment]\`. Khi đổi tên một trường, trình biên dịch chỉ ra ngay mọi nơi cần sửa, thay vì để lỗi xuất hiện trong job chạy đêm. Những bước cần hiệu năng cao thì họ vẫn dùng biểu thức cột.`,

    prosCons: {
      pros: [
        'Phát hiện lỗi tên trường và kiểu dữ liệu ngay khi biên dịch.',
        'Làm việc được với lớp nghiệp vụ, code dễ đọc và dễ dùng lại.',
        'Vẫn được tối ưu khi dùng biểu thức cột.',
      ],
      cons: [
        'Lambda làm chậm vì phải giải mã đối tượng và chặn tối ưu của Catalyst.',
        'Không dùng được trên Python.',
        'Thay đổi schema khiến phải cập nhật lớp dữ liệu.',
      ],
    },

    whenToUse: {
      use: [
        'Codebase Scala hoặc Java lớn, cần an toàn kiểu khi nhiều người cùng phát triển.',
        'Thư viện dùng chung, nơi hợp đồng dữ liệu cần rõ ràng.',
      ],
      avoid: [
        'Dùng PySpark: không có Dataset.',
        'Phần có yêu cầu hiệu năng cao: nên dùng biểu thức cột thay vì lambda.',
      ],
    },

    comparison: {
      headers: ['Tình huống lỗi', 'SQL', 'DataFrame', 'Dataset'],
      rows: [
        ['Sai cú pháp', 'Lúc chạy', 'Lúc biên dịch', 'Lúc biên dịch'],
        ['Sai tên cột', 'Lúc chạy', 'Lúc chạy', 'Lúc biên dịch'],
        ['Sai kiểu trong lambda', 'Không áp dụng', 'Lúc chạy', 'Lúc biên dịch'],
      ],
    },

    misconceptions: [
      {
        myth: 'PySpark có Dataset vì cũng có DataFrame.',
        truth: 'Tài liệu chính thức ghi rõ Python không hỗ trợ Dataset API. Một số bài viết trên mạng nêu sai điểm này.',
      },
      {
        myth: 'Dataset luôn nhanh hơn DataFrame vì có kiểu.',
        truth: 'Thường là ngược lại nếu dùng lambda, vì phải giải mã đối tượng. Kiểu giúp an toàn, không giúp tăng tốc.',
      },
    ],
  },
})
