import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-tools',
  summary:
    'Deequ chạy trên Spark và mạnh ở dữ liệu rất lớn. Great Expectations có thư viện Expectation và Data Docs. Soda dùng hợp đồng dữ liệu bằng YAML trên nhiều nguồn. dbt tests tích hợp sẵn trong pipeline dbt. Chọn theo nơi dữ liệu đang chạy.',
  tags: ['Deequ', 'Great Expectations', 'Soda', 'dbt'],
  related: ['etl-validation', 'etl-data-quality', 'dq-incremental', 'dq-approximate', 'dq-profiling', 'spark-overview'],
  sections: {
    definition: `Bốn công cụ phổ biến để viết và chạy luật kiểm tra dữ liệu:

- **Deequ:** thư viện trên Apache Spark của AWS, định nghĩa "unit tests for data".
- **Great Expectations (GX):** khung Python, luật gọi là **Expectation**, gom thành **Expectation Suite**, chạy qua **Checkpoint**, và sinh báo cáo **Data Docs**.
- **Soda:** từ bản 4 chuyển sang **Data Contracts** viết bằng YAML làm cách mặc định, thay cho SodaCL của bản 3.
- **dbt tests:** kiểm tra nằm cùng model trong dbt, biên dịch thành SQL.`,

    origin: `Trước đây mỗi đội tự viết truy vấn kiểm tra, không chia sẻ được, không lưu kết quả. Các công cụ này khắc phục điều đó bằng cách biến luật thành khai báo, tách phần luật khỏi cách thực thi, và lưu kết quả để so sánh.`,

    whyUse: `Không cần viết lại thứ đã có: báo cáo, cảnh báo và lưu lịch sử. Đồng thời luật được quản lý trong code, được review và chạy lại được. Công cụ không tự biết luật nào quan trọng, phần đó vẫn là việc của bạn.`,

    mechanism: `**Deequ** dịch ràng buộc thành truy vấn tổng hợp trên Spark, gộp nhiều chỉ số vào ít lượt quét. Nó có gợi ý ràng buộc, lưu chỉ số, phát hiện bất thường, và tính [[dq-incremental|tăng dần]] bằng trạng thái theo Partition. Một số chỉ số dùng [[dq-approximate|xấp xỉ]]. Có bản PyDeequ cho Python.

**Great Expectations** kết nối tới nguồn dữ liệu, chọn một Batch, chạy Expectation Suite và sinh Data Docs. Mạnh ở thư viện luật và tài liệu dễ đọc. Lưu ý tài liệu bản 0.x và GX Core 1.x dùng thuật ngữ khác nhau.

**Soda** chạy kiểm tra ngay trong nguồn dữ liệu qua kết nối tới Snowflake, BigQuery, Postgres, Spark và nhiều nguồn khác. Hợp đồng YAML dễ đọc với người ít viết code.

**dbt tests** là truy vấn tìm dòng lỗi, **không trả về dòng nào thì đạt**. Có sẵn 4 test: \`unique\`, \`not_null\`, \`accepted_values\`, \`relationships\`. \`relationships\` bỏ qua NULL, nên phải kèm \`not_null\`. Khóa mới là \`data_tests\`. Trên bảng lớn có thể dùng cấu hình \`where\` để giới hạn phạm vi, vì mặc định nó quét cả bảng.

Khác với các công cụ observability, xem [[arch-observability]], các công cụ này chủ yếu chạy luật do người viết chứ không tự học bất thường.`,

    example: `Một công ty có Data Lake 2 PB chạy Spark và Data Warehouse dùng dbt. Họ dùng Deequ cho các bảng thô rất lớn, vì đã có sẵn cụm Spark và cần tính tăng dần. Với các model trong Warehouse, họ dùng dbt tests, vì nằm ngay trong pipeline và đội phân tích tự viết được. Không có công cụ nào trong số này thay thế việc đánh giá [[dq-representativeness|tính đại diện]].`,

    prosCons: {
      pros: ['Luật nằm trong code, có review và chạy lại được.', 'Có sẵn báo cáo, lưu kết quả, và tích hợp với orchestrator.'],
      cons: ['Chỉ phát hiện những gì đã có luật, không tìm được vấn đề chưa nghĩ tới.', 'Duy trì nhiều công cụ song song tốn công, và API đổi nhanh giữa các phiên bản.'],
    },

    whenToUse: {
      use: ['Chọn theo nơi dữ liệu đang được xử lý và kỹ năng của đội.', 'Bắt đầu với vài luật quan trọng rồi mở rộng dần.'],
      avoid: ['Không chọn công cụ trước khi biết cần kiểm tra gì.', 'Không chạy test dbt cả bảng mỗi lần trên bảng rất lớn mà không giới hạn phạm vi.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Deequ', 'Great Expectations', 'Soda', 'dbt tests'],
      rows: [
        ['Chạy trên', 'Spark', 'Nhiều nền tảng qua Python', 'Nhiều nguồn dữ liệu', 'Warehouse mà dbt hỗ trợ'],
        ['Cách viết luật', 'Code Scala, Python', 'Code Python', 'YAML', 'YAML và SQL'],
        ['Mạnh nhất', 'Dữ liệu rất lớn, tăng dần', 'Thư viện luật, Data Docs', 'Dễ đọc, nhiều nguồn', 'Gắn liền với pipeline'],
        ['Phù hợp khi', 'Đã có cụm Spark', 'Đội mạnh về Python', 'Nhiều đội, nhiều nền tảng', 'Đã dùng dbt'],
      ],
      note: 'Tính năng thay đổi nhanh theo phiên bản, hãy đối chiếu với tài liệu chính thức trước khi chọn.',
    },

    misconceptions: [
      { myth: 'Có công cụ là có chất lượng dữ liệu.', truth: 'Công cụ chỉ chạy luật bạn đã viết. Luật nào đáng viết, xử lý ra sao khi lỗi vẫn là bài toán của quy trình.' },
      { myth: 'Test dbt đạt nghĩa là dữ liệu đúng.', truth: 'Nó chỉ cho biết không có dòng vi phạm luật đã viết. `relationships` còn bỏ qua NULL.' },
    ],
  },
})
