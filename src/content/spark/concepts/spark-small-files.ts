import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-small-files',
  summary:
    'Small Files Problem là tình trạng có quá nhiều tệp nhỏ, làm chậm việc liệt kê và đọc, tăng tải cho Driver và NameNode. Cách xử lý chính là kiểm soát số tệp khi ghi và gộp định kỳ.',
  tags: ['Hiệu năng', 'Lưu trữ', 'Parquet'],
  related: ['spark-partition', 'spark-repartition-coalesce', 'hadoop-namenode', 'cloud-s3', 'etl-stream'],
  sections: {
    definition: `**Small Files Problem (Vấn đề nhiều tệp nhỏ)** là tình trạng dữ liệu bị chia thành quá nhiều tệp có kích thước rất nhỏ so với mức hợp lý, thường dưới vài chục MB, thay vì khoảng 128 MB đến 1 GB mỗi tệp.

Tổng dung lượng không đổi, nhưng **chi phí mở và theo dõi từng tệp** tăng lên, làm đọc dữ liệu chậm đi rất nhiều.`,

    origin: `Vấn đề bắt nguồn từ **HDFS**, nơi NameNode giữ metadata của mọi tệp trong RAM, nên hàng trăm triệu tệp nhỏ có thể làm NameNode quá tải. Với đám mây như S3, không còn NameNode, nhưng mỗi tệp vẫn tốn lệnh gọi API và thời gian liệt kê. Xử lý luồng làm vấn đề nặng hơn, vì mỗi micro-batch lại sinh thêm tệp mới.`,

    whyUse: `Xử lý tệp nhỏ thường mang lại cải thiện rõ rệt cho **toàn bộ các truy vấn đọc bảng đó**, không chỉ riêng một job. Đây cũng là nguyên nhân âm thầm: job vẫn chạy thành công nhưng ngày càng chậm, nên khó phát hiện.`,

    mechanism: `**Vì sao chậm:** liệt kê nhiều tệp tốn thời gian trên Driver. Mỗi lần đọc có chi phí mở tệp và đọc metadata. Spark tính chi phí này bằng \`spark.sql.files.openCostInBytes\` = 4 MB khi gom tệp vào Partition. Định dạng Parquet đọc footer của từng tệp, nên nén kém hơn và mất đi hiệu quả khi tệp quá nhỏ.

**Nguyên nhân thường gặp:**

- Số Partition lớn khi ghi: mỗi Partition tạo ít nhất một tệp.
- \`partitionBy\` theo cột có quá nhiều giá trị: số tệp có thể bằng số Task nhân số giá trị.
- Streaming với chu kỳ ngắn.

**Cách xử lý:**

1. \`repartition\` hoặc \`coalesce\` trước khi ghi, tính số tệp từ tổng dung lượng.
2. \`repartition(col)\` theo cột phân vùng trước \`partitionBy\`, để mỗi thư mục có ít tệp.
3. AQE có thể gộp Partition nhỏ sau shuffle.
4. Giới hạn bằng \`maxRecordsPerFile\` nếu cần tránh tệp quá lớn.
5. Gộp định kỳ (Compaction): \`OPTIMIZE\` của Delta Lake, \`rewrite_data_files\` của Iceberg.`,

    example: `Một job streaming ghi Parquet ra S3 mỗi phút, với 200 Partition sau shuffle, tức 288.000 tệp mỗi ngày, mỗi tệp chỉ vài KB. Sau 3 tháng, truy vấn đọc một ngày mất 25 phút, và phần lớn thời gian là liệt kê và mở tệp.

Nhóm kỹ sư đổi sang Delta Lake, chạy \`OPTIMIZE\` hằng đêm để gộp thành các tệp khoảng 1 GB, đồng thời giảm số Partition khi ghi. Cùng truy vấn đó còn dưới 1 phút.`,

    prosCons: {
      pros: [
        'Xử lý tốt sẽ giúp tăng tốc mọi truy vấn trên bảng đó.',
        'Giảm tải cho NameNode, giảm chi phí gọi API trên đám mây.',
      ],
      cons: [
        'Compaction tốn tài nguyên và cần lập lịch.',
        'Việc ghi lại tệp có thể xung đột với các job đang đọc, nếu không có định dạng bảng hỗ trợ.',
        'Tệp quá lớn cũng không tốt, vì khó tận dụng song song và tốn nhiều khi tính lại.',
      ],
    },

    whenToUse: {
      use: [
        'Theo dõi số tệp và kích thước trung bình của các bảng quan trọng.',
        'Chạy Compaction định kỳ cho các bảng ghi liên tục.',
        'Chọn chu kỳ trigger của streaming dựa trên nhu cầu thực tế về độ trễ.',
      ],
      avoid: [
        'Không `partitionBy` theo cột có quá nhiều giá trị.',
        'Không ghi từng dòng hay từng lô rất nhỏ trực tiếp vào bảng dữ liệu lớn mà không có bước gộp.',
      ],
    },

    comparison: {
      headers: ['Cách xử lý', 'Thời điểm', 'Ưu điểm', 'Hạn chế'],
      rows: [
        ['`repartition` trước khi ghi', 'Lúc ghi', 'Đơn giản, đều', 'Tốn một lần shuffle'],
        ['`coalesce` trước khi ghi', 'Lúc ghi', 'Rẻ hơn', 'Có thể lệch, giảm song song'],
        ['AQE gộp Partition', 'Sau shuffle', 'Tự động', 'Chỉ khi có shuffle'],
        ['Compaction', 'Định kỳ', 'Xử lý cả dữ liệu cũ', 'Tốn tài nguyên, cần lập lịch'],
      ],
    },

    misconceptions: [
      {
        myth: 'Dùng S3 thì không cần lo về tệp nhỏ vì không có NameNode.',
        truth: 'Không còn áp lực NameNode, nhưng việc liệt kê, gọi API và đọc metadata của từng tệp vẫn tốn thời gian và tiền.',
      },
      {
        myth: 'Tệp càng lớn càng tốt.',
        truth: 'Tệp quá lớn sẽ khó xử lý song song nếu không chia được, và tốn kém khi phải ghi lại. Mức phổ biến là khoảng 128 MB đến 1 GB.',
      },
    ],
  },
})
