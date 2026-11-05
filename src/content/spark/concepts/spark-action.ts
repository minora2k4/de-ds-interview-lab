import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-action',
  summary:
    'Action là phép kích hoạt tính toán thật sự. Nó trả kết quả về Driver hoặc ghi ra hệ thống ngoài, và mỗi Action tạo ít nhất một job.',
  tags: ['Mô hình thực thi', 'Lazy Evaluation'],
  related: ['spark-transformation', 'spark-lazy-evaluation', 'spark-driver', 'spark-cache-persist', 'spark-dag'],
  sections: {
    definition: `**Action (Phép kích hoạt tính toán)** là phép tính buộc Spark thực thi kế hoạch đã xây dựng. Có hai nhóm:

- **Trả kết quả về Driver:** \`count\`, \`collect\`, \`take\`, \`first\`, \`show\`.
- **Ghi ra bên ngoài:** \`write\`, \`foreach\`, \`saveAsTextFile\`.`,

    origin: `Khi đã tách phần mô tả ra thành [[spark-transformation]], Spark cần một điểm báo hiệu "đã đến lúc chạy". Điểm này chính là Action: lúc đó người dùng thật sự cần kết quả. Đây là điều khác biệt so với MapReduce, nơi mỗi job được chạy ngay khi gửi đi và không có khái niệm trì hoãn.`,

    whyUse: `Việc biết chính xác Action nằm ở đâu rất quan trọng, vì **đó là nơi chi phí thật sự phát sinh**. Mỗi Action có thể chạy lại toàn bộ pipeline. Nhận diện được Action giúp bạn đặt [[spark-cache-persist]] đúng chỗ, và tránh gom quá nhiều dữ liệu về [[spark-driver]].`,

    mechanism: `Khi gọi Action:

1. Driver gửi kế hoạch tới Catalyst để tối ưu.
2. DAGScheduler tạo một hoặc nhiều **job**, cắt thành các [[spark-stage]].
3. Task chạy trên Executor. Kết quả được ghi ra ngoài trực tiếp từ Executor, hoặc gửi về Driver nếu là \`collect\`.

Một lưu ý thực tế: một câu SQL có thể tạo **nhiều job** trên Spark UI, ví dụ thêm job để gom bảng Broadcast hoặc lấy mẫu để sắp xếp. \`show\` và \`take\` được tối ưu theo kiểu chỉ quét dần vài Partition đầu, nên thường rất nhanh.`,

    example: `Một kỹ sư viết \`print(df.count())\` để kiểm tra số dòng, ngay trước \`df.write.parquet(...)\`. Hai Action này khiến toàn bộ pipeline nặng 3 giờ chạy hai lần, tổng cộng 6 giờ. Cách sửa là bỏ \`count\` đi, hoặc persist DataFrame trước Action đầu tiên, hoặc đọc số dòng từ metric sau khi ghi.`,

    prosCons: {
      pros: [
        'Tạo ra điểm rõ ràng để Spark tối ưu và bắt đầu chạy.',
        'Các Action dạng lấy mẫu như `take`, `show` rất tiết kiệm.',
      ],
      cons: [
        'Dễ vô tình tạo nhiều Action khiến pipeline chạy lại nhiều lần.',
        '`collect` có thể làm Driver hết bộ nhớ.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng `write` để lưu kết quả cuối, để mỗi Executor tự ghi phần của mình.',
        'Dùng `take` hoặc `show` khi cần xem thử dữ liệu.',
      ],
      avoid: [
        'Không dùng `collect` hay `toPandas` trên dữ liệu lớn.',
        'Không rải `count` để gỡ lỗi trong code production: mỗi lần gọi là một lần chạy pipeline.',
      ],
    },

    comparison: {
      intro: 'Các Action thường dùng có chi phí rất khác nhau:',
      headers: ['Action', 'Dữ liệu về Driver', 'Chi phí'],
      rows: [
        ['`write`', 'Gần như không', 'Xử lý toàn bộ, ghi từ Executor'],
        ['`count`', 'Một con số', 'Thường phải quét toàn bộ dữ liệu'],
        ['`show`, `take`', 'Vài dòng', 'Thường chỉ quét vài Partition'],
        ['`collect`', 'Toàn bộ kết quả', 'Rủi ro OOM ở Driver'],
      ],
    },

    misconceptions: [
      {
        myth: 'Mỗi Action luôn tạo đúng một job.',
        truth: 'Một Action có thể tạo nhiều job, ví dụ khi cần gom bảng Broadcast, lấy mẫu để sắp xếp, hoặc tính lại theo AQE.',
      },
      {
        myth: '`cache()` là một Action.',
        truth: '`cache()` chỉ đánh dấu DataFrame cần giữ lại và vẫn trì hoãn. Dữ liệu thực sự được nạp vào cache ở Action đầu tiên.',
      },
    ],
  },
})
