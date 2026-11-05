import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-sql',
  summary:
    'Spark SQL là mô-đun xử lý dữ liệu có cấu trúc. SQL và DataFrame API được biên dịch thành cùng một kế hoạch, nên có hiệu năng như nhau.',
  tags: ['API', 'SQL', 'Catalyst'],
  related: ['spark-dataframe', 'spark-catalyst', 'spark-tungsten', 'dw-data-warehouse', 'db-execution-plan'],
  sections: {
    definition: `**Spark SQL** là mô-đun của Spark để xử lý dữ liệu có cấu trúc. Nó không chỉ là khả năng chạy câu lệnh SQL, mà là **cả engine đứng sau** DataFrame và Dataset, gồm [[spark-catalyst]], [[spark-tungsten]] và kết nối tới các nguồn dữ liệu.

Bạn có thể viết SQL hoặc dùng DataFrame API, kết quả đều đi qua cùng một bộ tối ưu.`,

    origin: `Trước Spark SQL, **Hive** là cách phổ biến để chạy SQL trên Hadoop, nhưng chạy trên MapReduce nên rất chậm. Dự án Shark từng đưa Hive lên Spark, song phụ thuộc vào bộ tối ưu của Hive nên khó mở rộng. Spark SQL ra đời để thay thế, với bộ tối ưu Catalyst riêng, vẫn đọc được Hive Metastore và bảng Hive có sẵn.`,

    whyUse: `SQL là ngôn ngữ chung giữa Data Engineer, nhà phân tích và các công cụ BI. Spark SQL cho phép dùng SQL trên dữ liệu lớn mà không cần di chuyển dữ liệu vào một Data Warehouse. Vì DataFrame và SQL dùng chung engine, nhóm có thể trộn cả hai trong cùng một pipeline.`,

    mechanism: `Câu SQL được phân tích cú pháp thành Logical Plan chưa phân giải, rồi tra cứu tên bảng và cột trong **Catalog**, thường là Hive Metastore hoặc catalog của Iceberg hay Delta. Từ đây, quy trình giống hệt DataFrame: tối ưu logic, chọn Physical Plan, sinh mã rồi thực thi.

Từ Spark 4.0, **ANSI mode bật mặc định**: các phép tính không hợp lệ, như ép kiểu thất bại hoặc chia cho 0, sẽ báo lỗi thay vì âm thầm trả về null.

Đoạn minh họa: \`spark.sql("SELECT country, SUM(amount) FROM orders GROUP BY country")\` và \`orders.groupBy("country").sum("amount")\` cho ra cùng một Physical Plan, có thể kiểm tra bằng \`explain()\`.`,

    example: `Một nhóm phân tích quen viết SQL cần tính báo cáo từ dữ liệu Parquet trên S3. Kỹ sư đăng ký dữ liệu thành bảng trong catalog, nhóm phân tích viết SQL như thường lệ, còn phần tiền xử lý phức tạp do kỹ sư viết bằng DataFrame trong cùng pipeline. Sau khi nâng lên Spark 4, một job báo lỗi ép kiểu do ANSI mode: vấn đề dữ liệu vốn đã có từ trước, chỉ là trước đây bị ẩn thành null.`,

    prosCons: {
      pros: [
        'Dùng SQL quen thuộc trên dữ liệu lớn.',
        'Cùng engine với DataFrame nên có hiệu năng như nhau.',
        'Đọc được nhiều nguồn dữ liệu và catalog sẵn có.',
      ],
      cons: [
        'Câu SQL dài thiếu kiểm tra tĩnh, chỉ báo lỗi khi chạy.',
        'Không phù hợp cho truy vấn phản hồi rất nhanh cho nhiều người dùng đồng thời.',
        'Khó tái sử dụng và viết test so với hàm dựa trên DataFrame.',
      ],
    },

    whenToUse: {
      use: [
        'Biến đổi dạng bảng, Join và tổng hợp, nhất là khi người đọc code quen SQL.',
        'Kết hợp với DataFrame: SQL cho logic bảng, code cho phần cần tái sử dụng.',
      ],
      avoid: [
        'Logic cần nhiều nhánh điều kiện động: DataFrame API sẽ dễ ghép và kiểm thử hơn.',
        'Dashboard cần độ trễ dưới một giây: nên dùng công cụ OLAP chuyên dụng.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Spark SQL', 'Hive trên MapReduce', 'Data Warehouse (BigQuery, Redshift)'],
      rows: [
        ['Engine', 'Spark', 'MapReduce', 'Engine riêng của kho'],
        ['Tốc độ', 'Nhanh, tối ưu bằng Catalyst', 'Chậm do ghi đĩa nhiều', 'Rất nhanh với dữ liệu trong kho'],
        ['Lưu trữ', 'Tách rời, đọc từ S3 hoặc HDFS', 'Tách rời', 'Do kho quản lý, trừ bảng ngoài'],
        ['Phù hợp', 'ETL lớn, nhiều nguồn', 'Hệ thống cũ', 'Truy vấn phân tích, BI'],
      ],
    },

    misconceptions: [
      {
        myth: 'Viết bằng DataFrame API chạy nhanh hơn viết bằng SQL.',
        truth: 'Cả hai được biên dịch thành cùng một kế hoạch. Khác biệt nằm ở khả năng đọc và bảo trì, không phải tốc độ.',
      },
      {
        myth: 'Spark SQL là một cơ sở dữ liệu.',
        truth: 'Spark SQL không tự lưu dữ liệu và không xử lý giao dịch như một cơ sở dữ liệu quan hệ. Nó là engine truy vấn trên dữ liệu nằm ở nơi khác.',
      },
    ],
  },
})
