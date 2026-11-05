import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-catalyst',
  summary:
    'Catalyst là bộ tối ưu truy vấn của Spark SQL. Nó biến SQL và DataFrame thành kế hoạch thực thi hiệu quả qua các bước Analysis, tối ưu logic, chọn kế hoạch vật lý và sinh mã.',
  tags: ['Tối ưu', 'Kế hoạch thực thi', 'AQE'],
  related: ['spark-lazy-evaluation', 'spark-tungsten', 'spark-dataframe', 'spark-sql', 'spark-broadcast-join', 'db-query-optimization'],
  sections: {
    definition: `**Catalyst Optimizer (Bộ tối ưu truy vấn của Spark)** là thành phần nhận câu SQL hoặc phép biến đổi DataFrame, rồi tạo ra **kế hoạch thực thi hiệu quả**. Bạn mô tả cần kết quả gì, Catalyst quyết định cách lấy kết quả đó: đọc cột nào, lọc ở đâu, Join theo chiến lược nào.

Nhờ Catalyst, cùng một logic viết bằng SQL hay DataFrame đều cho cùng một kế hoạch.`,

    origin: `Trước Spark SQL, dự án **Shark** dựa vào bộ tối ưu của Hive, vốn được thiết kế cho MapReduce nên khó mở rộng. Còn với RDD, các hàm là hộp đen nên Spark không thể tối ưu.

Catalyst được xây dựng từ đầu năm 2014 để giải quyết hai vấn đề này: có **bộ tối ưu riêng cho Spark**, viết bằng các tính năng khớp mẫu của Scala, nên dễ thêm luật tối ưu và dễ mở rộng, đồng thời tận dụng được schema của DataFrame.`,

    whyUse: `Catalyst cho phép bạn viết logic một cách tự nhiên mà vẫn đạt hiệu năng tốt. Các tối ưu tự động có thể giảm thời gian chạy hàng chục lần:

- **Predicate Pushdown:** đẩy điều kiện lọc xuống càng gần nguồn càng tốt, kể cả xuống tầng đọc Parquet.
- **Column Pruning:** chỉ đọc các cột thật sự được dùng.
- **Constant Folding:** tính sẵn các biểu thức hằng như \`1 + 2\`.
- **Chọn chiến lược Join:** ví dụ dùng [[spark-broadcast-join]] khi một bảng đủ nhỏ.

Hiểu Catalyst cũng giúp bạn biết khi nào nó không làm được, ví dụ không nhìn được bên trong UDF.`,

    mechanism: `Catalyst hoạt động trên cấu trúc cây, qua bốn giai đoạn:

1. **Analysis (Phân tích).** Từ Logical Plan chưa phân giải, tra Catalog để xác định bảng, cột và kiểu dữ liệu. Sai tên cột sẽ báo lỗi ở bước này, trước khi chạy job.
2. **Logical Optimization (Tối ưu logic).** Áp dụng các luật lặp đi lặp lại cho đến khi không còn thay đổi: đẩy bộ lọc, bỏ cột thừa, tính biểu thức hằng.
3. **Physical Planning (Chọn kế hoạch vật lý).** Sinh các phương án thực thi, chọn phương án phù hợp, ví dụ Broadcast hay Sort Merge Join.
4. **Code Generation (Sinh mã).** Sinh bytecode Java cho kế hoạch, phối hợp với [[spark-tungsten]].

**Adaptive Query Execution (AQE)**, bật mặc định từ Spark 3.2, bổ sung việc **tối ưu lại trong lúc chạy**. Sau mỗi Stage shuffle, Spark có số liệu thật nên có thể gộp Partition nhỏ, đổi chiến lược Join, và chia nhỏ Partition bị lệch.

Ngoài ra còn có **Cost-Based Optimization (CBO)** dựa vào thống kê bảng, ví dụ để đổi thứ tự Join, nhưng mặc định tắt và cần chạy \`ANALYZE TABLE\` để có thống kê.`,

    diagram: {
      mermaid: `flowchart TD
  A["SQL hoặc DataFrame"] --> B["Logical Plan chưa phân giải"]
  B -->|"Analysis: tra Catalog"| C["Logical Plan đã phân giải"]
  C -->|"Tối ưu logic: áp dụng các luật"| D["Optimized Logical Plan"]
  D -->|"Chọn kế hoạch vật lý"| E["Physical Plan"]
  E -->|"Sinh mã"| F["Thực thi trên Executor"]
  F -->|"AQE: số liệu thật sau mỗi Stage"| E`,
      caption:
        'Bốn giai đoạn của Catalyst. Mũi tên quay lại là AQE, điều chỉnh kế hoạch trong lúc chạy dựa trên số liệu thật.',
    },

    example: `Một câu truy vấn: nối \`orders\` 5 TB với \`users\`, rồi lọc \`orders.date = '2026-01-01'\`, chọn 3 cột. Viết theo đúng thứ tự này, bộ lọc nằm sau Join.

Catalyst viết lại: đẩy bộ lọc ngày xuống trước Join, nên chỉ đọc một thư mục phân vùng khoảng 15 GB. Chỉ đọc 3 cột từ Parquet. Khi đó phần \`orders\` chỉ còn vài GB. Nhờ AQE thấy kích thước thật nhỏ, có thể đổi sang Broadcast. Gọi \`explain("formatted")\` sẽ thấy dòng \`PushedFilters\` và \`PartitionFilters\`. Nếu bọc điều kiện ngày trong một UDF Python, không có tối ưu nào trong số này xảy ra, và Spark sẽ phải quét toàn bộ 5 TB.`,

    prosCons: {
      pros: [
        '**Tối ưu tự động,** không cần thay đổi code.',
        '**Áp dụng được cho cả SQL và DataFrame.**',
        '**Dễ mở rộng:** có thể thêm luật mới hoặc nguồn dữ liệu mới.',
        '**AQE khắc phục ước lượng sai** bằng số liệu thực tế.',
      ],
      cons: [
        '**Không nhìn được bên trong UDF,** nên không tối ưu được phần đó.',
        '**Phụ thuộc vào thống kê:** ước lượng sai có thể chọn kế hoạch kém ngay từ đầu.',
        '**Kế hoạch quá dài** làm Driver tốn nhiều thời gian để tối ưu.',
        '**Khó lường:** kế hoạch có thể thay đổi giữa các lần chạy hoặc các phiên bản.',
      ],
    },

    whenToUse: {
      use: [
        'Hoạt động tự động với SQL và DataFrame. Hãy dùng biểu thức cột và hàm tích hợp để Catalyst phát huy tác dụng.',
        'Đọc `explain("formatted")` để kiểm tra bộ lọc có được đẩy xuống hay không.',
        'Chạy `ANALYZE TABLE` khi bật CBO với các truy vấn nhiều Join phức tạp.',
      ],
      avoid: [
        'Không bọc cột phân vùng bằng UDF hoặc hàm trong điều kiện lọc, vì làm mất Partition Pruning.',
        'Không tin kế hoạch ban đầu của `explain` với AQE: phải xem kế hoạch cuối cùng trên Spark UI.',
      ],
    },

    comparison: {
      intro: 'Ba cơ chế tối ưu thường bị nhầm lẫn:',
      headers: ['Tiêu chí', 'Tối ưu dựa trên luật', 'CBO', 'AQE'],
      rows: [
        ['Thời điểm', 'Trước khi chạy', 'Trước khi chạy', 'Trong lúc chạy'],
        ['Dựa vào', 'Các luật cố định', 'Thống kê của bảng', 'Số liệu thật sau mỗi Stage'],
        ['Mặc định', 'Bật', 'Tắt', 'Bật từ Spark 3.2'],
        ['Ví dụ', 'Đẩy bộ lọc, bỏ cột', 'Đổi thứ tự Join', 'Gộp Partition, xử lý skew'],
        ['Điểm yếu', 'Không biết kích thước', 'Thống kê cũ hoặc thiếu', 'Không lấy lại được chi phí đã chạy'],
      ],
    },

    misconceptions: [
      {
        myth: 'Catalyst tối ưu được mọi thứ, nên viết thế nào cũng được.',
        truth: 'Nó không nhìn được bên trong UDF, và không thể bỏ các phép tính nghiệp vụ mà bạn yêu cầu. Viết gọn và đúng logic vẫn rất quan trọng.',
      },
      {
        myth: 'Catalyst hoạt động cả với RDD.',
        truth: 'Catalyst chỉ tối ưu DataFrame, Dataset và SQL. Các hàm trên RDD là hộp đen đối với Spark.',
      },
      {
        myth: 'Cứ có Parquet là Predicate Pushdown luôn hoạt động.',
        truth: 'Một số điều kiện không đẩy xuống được, như UDF hoặc ép kiểu trên cột. Cần kiểm tra dòng `PushedFilters` trong `explain`.',
      },
    ],
  },
})
