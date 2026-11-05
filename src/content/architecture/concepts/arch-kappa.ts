import { defineConcept } from '../../define'

export default defineConcept({
  id: 'arch-kappa',
  summary:
    'Kappa Architecture do Jay Kreps đề xuất năm 2014: bỏ nhánh batch, mọi xử lý là stream trên một log bất biến. Muốn tính lại thì phát lại log bằng một job mới với cùng bộ code.',
  tags: ['Kiến trúc', 'Streaming', 'Kafka', 'First Principles'],
  related: ['arch-lambda', 'arch-streaming', 'etl-stream', 'kafka-overview', 'kafka-retention', 'kafka-offset', 'etl-idempotency'],
  sections: {
    definition: `**Kappa Architecture (Kiến trúc Kappa)** chỉ có một đường xử lý là stream. Dữ liệu được giữ trong một **log (nhật ký) bất biến, có thứ tự**, và kết quả là các bảng được tính từ log đó. **Tính lại không cần hệ thống batch:** chỉ cần chạy một job mới, đọc lại log từ đầu. Dữ liệu mới và dữ liệu lịch sử đi qua cùng một bộ code, khác với [[arch-lambda]].`,

    origin: `Jay Kreps, đồng sáng tạo Apache Kafka tại LinkedIn, nêu ý tưởng này trong bài "Questioning the Lambda Architecture" trên O'Reilly Radar (2/7/2014). Ông gợi ý cái tên Kappa Architecture, và đùa rằng ý tưởng này có lẽ quá đơn giản để xứng với một chữ cái Hy Lạp.

Kreps giữ lại hai nguyên tắc của Marz: dữ liệu đầu vào bất biến, và có thể tính lại kết quả. Thứ ông phản đối là **viết một logic để nó cho cùng kết quả trên hai hệ thống phân tán phức tạp**. Framework như Summingbird chỉ bớt phần viết code, không bớt gánh nặng vận hành hai hệ thống.

Ông cũng bác bỏ quan điểm cho rằng [[arch-streaming|stream processing]] vốn chỉ xấp xỉ và dễ mất dữ liệu: đó là giới hạn của các framework lúc bấy giờ, không phải bản chất. Nếu engine stream đủ mạnh và log giữ đủ lâu, việc tính lại không còn cần đến nhánh batch.`,

    whyUse: `- **Một bộ code:** đổi logic chỉ phải sửa, kiểm thử và triển khai một nơi, nên hai nhánh không thể lệch nhau.`,

    mechanism: `Quy trình tính lại theo Kreps gồm các bước:

1. **Giữ log đủ lâu:** muốn tính lại 30 ngày thì đặt retention của Kafka là 30 ngày. Log phải cho phép nhiều subscriber đọc độc lập, vì job mới và job cũ cần đọc cùng lúc ở hai vị trí khác nhau.
2. **Chạy job thứ hai:** cùng code mới, đọc từ đầu dữ liệu còn giữ, và ghi vào **bảng đầu ra mới**. Tăng parallelism để đuổi kịp nhanh.
3. **Chờ bắt kịp:** khi job mới đọc đến gần cuối log, bảng mới đã có kết quả tương đương với bảng cũ theo logic mới.
4. **Chuyển ứng dụng sang bảng mới.**
5. **Dừng job cũ và xóa bảng cũ.** Giữ thêm một thời gian ngắn thì có thể quay lại phiên bản cũ ngay khi có lỗi.

**Vì sao ghi bảng mới thay vì ghi đè:** người dùng vẫn đọc được bảng cũ trong suốt quá trình phát lại, không thấy kết quả dở dang.

**Những chỗ khó:**

- **Thời gian:** khi phát lại, thời gian hệ thống vô nghĩa, nên logic phải dựa vào event time.
- **Tính tái lập:** logic gọi API ngoài hoặc đọc bảng tham chiếu hiện tại sẽ cho kết quả khác với lúc đầu.
- **Hiệu ứng phụ:** gửi email hay gọi hệ thống khác phải bị tắt khi phát lại.
- **Giới hạn của log:** Kafka mặc định giữ 7 ngày (\`log.retention.hours\` = 168). Giữ lâu tốn kém hơn, dù Tiered Storage, sẵn sàng cho production từ Kafka 3.9, giúp giảm chi phí.`,

    diagram: {
      mermaid: `flowchart TD
  A["Nguồn sự kiện"] --> B["Log bất biến, giữ đủ lâu"]
  B --> C["Job v1: đang phục vụ"]
  B --> D["Job v2: đọc lại từ đầu log"]
  C --> E["Bảng output_v1"]
  D --> F["Bảng output_v2"]
  E --> G["Ứng dụng đọc v1, chuyển sang v2 khi v2 bắt kịp"]
  F --> G`,
      caption:
        'Tính lại là chạy thêm một job trên cùng log. Hai phiên bản chạy song song cho đến khi ứng dụng chuyển sang bảng mới.',
    },

    example: `Một ứng dụng giao đồ ăn nhận 5.000 sự kiện mỗi giây, tức khoảng 430 triệu sự kiện mỗi ngày, và giữ log 30 ngày, khoảng 13 tỷ sự kiện. Đội dữ liệu đổi cách tính thời gian giao hàng.

Họ chạy job v2 với tốc độ 100.000 sự kiện mỗi giây, gấp 20 lần tốc độ dữ liệu đến. Phát lại 13 tỷ sự kiện mất khoảng 36 giờ. Trong lúc đó dashboard vẫn đọc bảng v1. Khi v2 bắt kịp, họ so sánh hai bảng rồi chuyển dashboard sang v2.

Nếu cần tính lại 2 năm với cùng tốc độ thì mất khoảng 5 tuần, và phải lưu log 2 năm.`,

    prosCons: {
      pros: [
        '**Không lệch logic:** chỉ có một bộ code nên không có hai nguồn số khác nhau.',
        '**Hệ thống đơn giản hơn:** chỉ cần vận hành một loại xử lý, một cách gỡ lỗi.',
      ],
      cons: [
        '**Phát lại chậm với lịch sử dài:** tốc độ bị giới hạn bởi log, state và đích ghi.',
        '**Tốn chi phí:** phải lưu log lâu và giữ job chạy liên tục.',
        '**Khó với logic nặng:** phép tính cần nhìn toàn bộ lịch sử hoặc join lớn khó làm bằng stream hơn so với batch.',
      ],
    },

    whenToUse: {
      use: [
        'Nghiệp vụ vốn là luồng sự kiện, và logic chủ yếu là cộng dồn, cửa sổ, làm giàu dữ liệu.',
      ],
      avoid: [
        'Thường xuyên phải tính lại nhiều năm dữ liệu.',
        'Logic phụ thuộc vào dịch vụ ngoài không thể tái lập khi phát lại.',
        'Nhu cầu chỉ là báo cáo hằng ngày: nên dùng [[arch-batch]].',
      ],
    },

    comparison: {
      intro: 'Kappa so với Lambda trên các điểm quyết định:',
      headers: ['Tiêu chí', 'Kappa', 'Lambda'],
      rows: [
        ['Người đề xuất', 'Jay Kreps, 2014', 'Nathan Marz, 2011'],
        ['Tính lại', 'Phát lại log bằng job mới', 'Chạy lại batch'],
        ['Điểm mạnh', 'Đơn giản, không lệch logic', 'Tính lại lịch sử rất dài, logic nặng'],
        ['Điểm yếu', 'Phát lại chậm, phụ thuộc retention', 'Vận hành hai hệ thống'],
      ],
    },

    misconceptions: [
      {
        myth: 'Kappa bắt buộc phải dùng Kafka.',
        truth: 'Yêu cầu là log có thứ tự, giữ được lâu và có nhiều người đọc. Kreps nêu rõ ý tưởng không gắn với Kafka.',
      },
      {
        myth: 'Tăng retention lúc phát hiện lỗi sẽ lấy lại được dữ liệu cũ.',
        truth: 'Dữ liệu đã bị xóa khỏi log thì không quay lại được. Retention phải được đặt trước, hoặc phải lưu log sang kho lâu dài.',
      },
      {
        myth: 'Kappa luôn rẻ hơn Lambda vì ít hệ thống hơn.',
        truth: 'Kappa bớt được công duy trì code, nhưng tốn tiền lưu log, giữ state và chạy liên tục. Tổng chi phí tùy vào quy mô và độ dài cần phát lại.',
      },
    ],
  },
})
