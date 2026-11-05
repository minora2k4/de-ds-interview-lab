import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-s3',
  summary:
    'S3 là dịch vụ lưu trữ đối tượng với độ bền thiết kế 11 số 9 và strong read-after-write từ tháng 12/2020. Nó là nền của data lake, nhưng không phải hệ thống tệp: đổi tên không nguyên tử và không có giao dịch nhiều object.',
  tags: ['AWS', 'Object Storage', 'Data Lake', 'First Principles'],
  related: ['dw-data-lake', 'dw-data-lakehouse', 'hadoop-hdfs', 'spark-small-files', 'cloud-consistency', 'cloud-eventual-consistency', 'cloud-glue', 'cloud-redshift'],
  sections: {
    definition: `**Amazon S3 (Simple Storage Service, Dịch vụ lưu trữ đối tượng)** lưu dữ liệu dưới dạng **object** trong **bucket**, mỗi object có một **key** duy nhất.

Không gian tên là phẳng: "thư mục" \`logs/2026/\` trong \`logs/2026/a.parquet\` chỉ là **prefix** của key. Không sửa được một phần object, mỗi lần ghi thay thế cả object.`,

    origin: `Trước khi có S3, muốn lưu trữ bền thì phải tự vận hành máy chủ, lo đĩa hỏng và dung lượng. Với [[hadoop-hdfs|HDFS]], cụm phải chạy liên tục để giữ dữ liệu, nên muốn thêm dung lượng phải thêm cả CPU.

S3 ra mắt năm 2006 và biến lưu trữ thành dịch vụ trả theo mức dùng. Cụm tính toán có thể tắt mà dữ liệu vẫn còn, đây là nền tảng của việc tách lưu trữ và tính toán. Trước tháng 12/2020, ghi đè và xóa chỉ là eventual, nên pipeline phải có thêm lớp bù như S3Guard. Giờ không còn cần nữa.`,

    whyUse: `Dung lượng gần như không giới hạn và không phải quản lý máy. Spark, Athena, Redshift Spectrum và [[cloud-glue|Glue]] cùng đọc được một dữ liệu, nên S3 là lớp lưu trữ của [[dw-data-lake|Data Lake]] và [[dw-data-lakehouse|Lakehouse]].`,

    mechanism: `**Độ bền:** mọi storage class được thiết kế cho độ bền 99,999999999% (11 số 9). Trừ các lớp One Zone, dữ liệu nằm trên ít nhất 3 AZ nên chịu được mất cả một AZ.

**Nhất quán:** từ tháng 12/2020, S3 có **strong read-after-write** với PUT, ghi đè và DELETE, ở mọi Region. GET, HEAD và LIST bắt đầu sau khi ghi thành công đều thấy thay đổi. Vẫn còn các giới hạn:

- **Cấu hình bucket là eventual:** sau khi bật versioning lần đầu, AWS khuyên chờ 15 phút trước khi ghi.
- **Ghi đồng thời vào một key:** yêu cầu có thời gian mới nhất thắng, tức last-writer-wins.
- **Không có cập nhật nguyên tử qua nhiều key.**
- **Replication là bất đồng bộ,** nên bản ở Region khác có thể đi sau.

**Ghi có điều kiện:** \`If-None-Match\` chặn ghi đè key đã có, \`If-Match\` chỉ ghi khi ETag còn khớp, nếu không trả lỗi 412. Đây là cách tránh last-writer-wins.

**Hiệu năng:** ít nhất 3.500 PUT và 5.500 GET mỗi giây trên mỗi prefix phân vùng. S3 tự tăng dần theo tải, và trong lúc đó có thể trả lỗi 503 Slow Down. Một PUT tối đa 5 GB, object tối đa 50 TB qua multipart upload, và AWS khuyên dùng multipart từ 100 MB.

**Không phải hệ thống tệp:** đổi tên là sao chép rồi xóa, nên không nguyên tử và tốn thời gian với nhiều object. Một job ghi nhiều tệp có thể bị nhìn thấy khi mới xong một nửa. Định dạng bảng như Iceberg và Delta Lake giải quyết việc này bằng cách commit qua metadata. Nhiều [[spark-small-files|tệp nhỏ]] cũng làm LIST và đọc chậm đi.

**Lifecycle (Vòng đời):** quy tắc tự chuyển object sang class rẻ hơn hoặc xóa theo tuổi.`,

    example: `Một công ty giữ 500 TB log, trong đó chỉ dữ liệu 30 ngày gần nhất được truy vấn thường xuyên, và phải giữ 7 năm để kiểm toán.

- **0 đến 30 ngày:** S3 Standard.
- **30 đến 365 ngày:** Standard-IA, vì vẫn cần đọc nhanh khi có sự cố.
- **Sau 1 năm:** Glacier Deep Archive, vì chấp nhận chờ tới 48 giờ khi kiểm toán.

Nhóm gộp các tệp 50 KB thành Parquet 256 MB trước khi chuyển. Nếu không, mỗi tệp vẫn bị tính tối thiểu 128 KB ở IA, và tốn thêm metadata ở Glacier. Chi phí lưu trữ giảm hơn một nửa mà truy vấn hằng ngày không bị ảnh hưởng.`,

    prosCons: {
      pros: [
        '**Độ bền rất cao** mà không phải tự quản lý bản sao.',
        '**Tách khỏi tính toán:** nhiều engine dùng chung, và tắt cụm được mà không mất dữ liệu.',
        '**Nhiều class** để chi phí khớp với tần suất đọc.',
      ],
      cons: [
        '**Không có giao dịch nhiều object,** nên cần thêm định dạng bảng.',
        '**Độ trễ cao hơn đĩa cục bộ** và tính phí theo số yêu cầu, nên ghét tệp nhỏ.',
        '**Class lưu trữ có điều kiện:** thời gian tối thiểu, phí lấy dữ liệu, chờ khôi phục.',
      ],
    },

    whenToUse: {
      use: [
        'Data Lake, lưu trữ lâu dài, tệp đầu vào và đầu ra của pipeline.',
      ],
      avoid: [
        'Không dùng như cơ sở dữ liệu cho các cập nhật nhỏ từng dòng.',
        'Không dùng One Zone cho dữ liệu không tái tạo được.',
      ],
    },

    comparison: {
      intro: 'Mọi class đều thiết kế cho 11 số 9. Khác nhau ở số AZ, tính sẵn sàng và cách lấy dữ liệu:',
      headers: ['Storage class', 'AZ', 'Sẵn sàng', 'Lưu tối thiểu', 'Lấy dữ liệu'],
      rows: [
        ['Standard', 'Từ 3', '99,99%', 'Không', 'Mili giây'],
        ['Intelligent-Tiering', 'Từ 3', '99,9%', 'Không', 'Mili giây, tầng lưu trữ tùy chọn thì lâu hơn'],
        ['Express One Zone', '1', '99,95%', 'Rất ngắn', 'Vài mili giây'],
        ['Standard-IA', 'Từ 3', '99,9%', '30 ngày', 'Mili giây'],
        ['One Zone-IA', '1', '99,5%', '30 ngày', 'Mili giây'],
        ['Glacier Instant Retrieval', 'Từ 3', '99,9%', '90 ngày', 'Mili giây'],
        ['Glacier Flexible Retrieval', 'Từ 3', '99,99% sau khôi phục', '90 ngày', 'Vài phút đến 12 giờ'],
        ['Glacier Deep Archive', 'Từ 3', '99,99% sau khôi phục', '180 ngày', '9 đến 48 giờ'],
      ],
      note: 'Reduced Redundancy là class cũ, AWS khuyên không dùng.',
    },

    misconceptions: [
      {
        myth: 'S3 chỉ là eventual, nên phải chờ một lúc mới LIST được tệp mới.',
        truth: 'Đó là thông tin từ trước tháng 12/2020. Trong một Region, GET và LIST đều thấy ngay sau khi ghi thành công.',
      },
      {
        myth: 'One Zone cũng 11 số 9 nên an toàn như Standard.',
        truth: 'Con số đó không tính việc mất AZ. Mất AZ thì dữ liệu trong One Zone có thể mất luôn.',
      },
      {
        myth: 'Có strong consistency thì ghi nhiều tệp cũng nguyên tử.',
        truth: 'Strong chỉ áp dụng cho từng key. Người đọc vẫn có thể thấy một phần các tệp của job đang ghi.',
      },
    ],
  },
})
