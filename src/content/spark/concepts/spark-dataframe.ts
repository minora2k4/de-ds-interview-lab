import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-dataframe',
  summary:
    'DataFrame là bảng dữ liệu phân tán có schema. Nhờ biết cấu trúc dữ liệu, Spark tối ưu được truy vấn bằng Catalyst và lưu gọn bằng Tungsten.',
  tags: ['API', 'Schema', 'Catalyst'],
  related: ['spark-rdd', 'spark-dataset', 'spark-sql', 'spark-catalyst', 'spark-tungsten', 'spark-pyspark'],
  sections: {
    definition: `**DataFrame** là tập dữ liệu phân tán được tổ chức thành các **cột có tên và kiểu dữ liệu**, giống một bảng trong cơ sở dữ liệu nhưng trải trên nhiều máy.

Bạn mô tả **muốn gì** (lọc, nhóm, tổng hợp), Spark tự quyết định **làm thế nào**. DataFrame bất biến và trì hoãn tính toán. Trong Scala, \`DataFrame\` chỉ là tên khác của \`Dataset[Row]\`.`,

    origin: `DataFrame ra đời năm 2015 để khắc phục các hạn chế của [[spark-rdd|RDD]]:

- **RDD không có schema** nên hàm người dùng là hộp đen với Spark. Spark không thể biết bạn chỉ cần hai cột, nên không tối ưu được.
- **Đối tượng JVM tốn bộ nhớ.** Dữ liệu RDD lưu thành nhiều đối tượng, gây áp lực GC.
- **Người dùng SQL và phân tích** cần giao diện quen thuộc như bảng trong R hay pandas.

Khi biết schema, Spark có thể tối ưu kế hoạch bằng [[spark-catalyst]] và lưu dữ liệu nhị phân gọn hơn bằng [[spark-tungsten]].`,

    whyUse: `Lý do chính để chọn DataFrame là hiệu năng đến từ việc **Spark hiểu được ý định của bạn**:

1. **Tối ưu tự động.** Biết cột nào được dùng và điều kiện lọc là gì, Spark có thể chỉ đọc các cột đó, đẩy bộ lọc xuống tầng đọc, và chọn chiến lược Join phù hợp.
2. **Hiệu năng gần như như nhau giữa các ngôn ngữ.** Biểu thức cột trong PySpark được chuyển thành kế hoạch chạy trên JVM, nên gần bằng Scala miễn là không dùng UDF Python.
3. **Ít code hơn.** Một \`groupBy().agg()\` thay cho nhiều dòng RDD, đồng thời khó viết sai cách kém hiệu quả hơn.`,

    mechanism: `Vòng đời của một DataFrame gồm các bước:

1. **Tạo DataFrame.** Khi đọc từ nguồn, Spark cần schema: lấy từ metadata (Parquet có sẵn), hoặc tự suy luận (CSV, JSON), hoặc do bạn khai báo.
2. **Biến đổi.** Mỗi phép biến đổi tạo DataFrame mới mang một Logical Plan lớn hơn. Spark kiểm tra ngay tên cột và kiểu dữ liệu ở bước Analysis.
3. **Tối ưu.** Khi gặp [[spark-action]], Catalyst chuyển thành Physical Plan.
4. **Thực thi.** Kế hoạch cuối cùng chạy dưới dạng RDD các dòng nhị phân, với mã được sinh tự động nhờ Tungsten.

**Schema tường minh** tốt hơn suy luận trong production: \`inferSchema\` với CSV buộc Spark đọc dữ liệu thêm một lượt, và kiểu suy luận có thể thay đổi khi dữ liệu thay đổi.`,

    example: `Nhóm dữ liệu của một ngân hàng tính số dư trung bình theo chi nhánh từ bảng 5 TB có 200 cột, lưu dạng Parquet.

Với RDD, mỗi dòng được giải mã đầy đủ cả 200 cột thành đối tượng, rồi mới lấy 2 cột cần dùng. Với DataFrame, Catalyst biết chỉ cần \`branch\` và \`balance\`, nên chỉ đọc đúng 2 cột từ Parquet (Column Pruning). Lượng đọc có thể giảm từ 5 TB xuống khoảng vài chục GB, mà bạn không phải làm gì thêm.`,

    prosCons: {
      pros: [
        '**Được tối ưu tự động** bởi Catalyst và Tungsten.',
        '**API ngắn gọn,** có sẵn hàng trăm hàm tích hợp.',
        '**Dùng được trên nhiều ngôn ngữ:** Python, Scala, Java, R.',
        '**Tiết kiệm bộ nhớ** nhờ định dạng nhị phân thay vì đối tượng JVM.',
      ],
      cons: [
        '**Lỗi kiểu dữ liệu phát hiện lúc chạy,** không phải lúc biên dịch như Dataset.',
        '**UDF là hộp đen.** Hàm tự viết chặn nhiều tối ưu của Catalyst.',
        '**Khó diễn đạt** một số logic đặc thù so với viết thẳng trên RDD.',
      ],
    },

    whenToUse: {
      use: [
        'Mặc định cho mọi dữ liệu có cấu trúc hoặc bán cấu trúc.',
        'Pipeline ETL, tổng hợp và Join.',
        'Làm việc bằng PySpark, vì Python không có Dataset.',
      ],
      avoid: [
        'Dữ liệu thô chưa có cấu trúc, cần xử lý đặc thù: bắt đầu bằng RDD rồi chuyển sang DataFrame.',
        'Dữ liệu nhỏ vừa một máy: pandas hoặc Polars sẽ đơn giản hơn.',
      ],
    },

    comparison: {
      intro: 'DataFrame của Spark và của pandas có tên giống nhau nhưng khác nhau về bản chất:',
      headers: ['Tiêu chí', 'Spark DataFrame', 'pandas DataFrame'],
      rows: [
        ['Vị trí dữ liệu', 'Phân tán trên nhiều máy', 'Trong RAM một máy'],
        ['Thực thi', 'Trì hoãn, tối ưu trước khi chạy', 'Chạy ngay từng bước'],
        ['Tính bất biến', 'Bất biến', 'Có thể sửa tại chỗ'],
        ['Thứ tự dòng', 'Không đảm bảo', 'Có chỉ mục và thứ tự'],
        ['Quy mô', 'TB trở lên', 'Thường dưới vài chục GB'],
      ],
    },

    misconceptions: [
      {
        myth: 'DataFrame luôn nhanh hơn RDD trong mọi trường hợp.',
        truth: 'DataFrame nhanh nhờ tối ưu, nhưng nếu toàn bộ logic nằm trong UDF Python thì lợi thế này giảm đi nhiều. Dùng hàm tích hợp mới tận dụng được.',
      },
      {
        myth: '`inferSchema` tiện nên cứ dùng trong production.',
        truth: 'Nó tốn thêm một lượt đọc, và kiểu dữ liệu có thể thay đổi giữa các lần chạy. Production nên khai báo schema tường minh.',
      },
      {
        myth: 'withColumn sửa trực tiếp DataFrame hiện tại.',
        truth: 'DataFrame bất biến. `withColumn` tạo ra DataFrame mới, nên phải gán kết quả vào biến để dùng tiếp.',
      },
    ],
  },
})
