import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-ingestion',
  summary:
    'Data Ingestion đưa dữ liệu từ nguồn vào nền tảng dữ liệu bằng cách kéo theo lịch, nhận đẩy, nhận tệp hoặc bắt thay đổi. Mục tiêu là không mất dữ liệu, không làm hại nguồn và giữ được bản gốc.',
  tags: ['Ingestion', 'Nguồn dữ liệu'],
  related: ['etl-cdc', 'etl-incremental', 'etl-full-load', 'etl-validation', 'dw-data-lake', 'kafka-overview', 'cloud-glue', 'cloud-adf'],
  sections: {
    definition: `**Data Ingestion (Thu nhận dữ liệu)** là chuyển dữ liệu từ nơi nó được tạo ra vào nền tảng dữ liệu, thường là vùng thô trong [[dw-data-lake|Data Lake]] hoặc kho. Bước này chưa áp dụng logic nghiệp vụ.`,

    origin: `Trước đây mỗi nguồn có một script riêng, nên một lần đổi schema làm hỏng nhiều nơi. Các nền tảng như Kafka Connect, Airbyte, [[cloud-glue|AWS Glue]] ra đời để chuẩn hóa kết nối, giữ vị trí đọc và xử lý thử lại.`,

    whyUse: `Lỗi ở đây lan xuống mọi bước sau. Dữ liệu thiếu ở bước này thường **không tính lại được**, vì nguồn có thể đã đổi trạng thái.`,

    mechanism: `Chọn cách theo khả năng của nguồn:

- **Kéo theo lịch:** gọi API hoặc truy vấn định kỳ. Phải tôn trọng giới hạn tốc độ và tránh giờ cao điểm.
- **Nhận đẩy:** nguồn gửi sự kiện hoặc webhook. Cần bộ đệm bền như [[kafka-overview|Kafka]].
- **Nhận tệp:** đối tác đặt tệp vào S3. Phải kiểm tra tệp đủ chưa và tránh xử lý trùng.
- **[[etl-cdc|CDC]]:** đọc log thay đổi của database.

Bản thu nhận nên kèm thời điểm nạp, nguồn và tên tệp để truy vết. Đa số đường truyền là at-least-once, nên khử trùng lặp phải có ở bước sau.`,

    example: `Một công ty nhận tệp từ 300 cửa hàng, khoảng 60 GB mỗi đêm. Vài cửa hàng gửi lại tệp đã sửa cùng tên, làm doanh thu trùng 3%. Đội dữ liệu lưu mỗi tệp cùng checksum và chỉ dùng phiên bản mới nhất.`,

    prosCons: {
      pros: ['Tách việc đưa dữ liệu về khỏi logic nghiệp vụ.', 'Giữ bản gốc để truy vết và chạy lại.'],
      cons: ['Schema và giới hạn API của nguồn nằm ngoài tầm kiểm soát.'],
    },

    whenToUse: {
      use: ['Dùng connector có sẵn, chỉ tự viết khi nguồn thật sự đặc thù.'],
      avoid: ['Không biến đổi nghiệp vụ ngay ở bước này, vì sai logic sẽ hỏng cả bản gốc.'],
    },

    comparison: {
      headers: ['Cách', 'Độ trễ', 'Điểm cần lo'],
      rows: [
        ['Kéo qua API', 'Phút đến giờ', 'Giới hạn tốc độ, phân trang'],
        ['Nhận đẩy qua log', 'Giây', 'Sự kiện trùng và trễ'],
        ['Nhận tệp', 'Giờ đến ngày', 'Tệp thiếu, gửi lại, sai định dạng'],
        ['CDC', 'Giây', 'Cần quyền đọc log, vận hành phức tạp'],
      ],
    },

    misconceptions: [
      {
        myth: 'Ingestion chỉ là sao chép nên không cần kiểm tra.',
        truth: 'Nên [[etl-validation|kiểm tra]] schema, số dòng và độ mới ngay tại đây, vì càng muộn thì càng nhiều bảng bị ảnh hưởng.',
      },
    ],
  },
})
