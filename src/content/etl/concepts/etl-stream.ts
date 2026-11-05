import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-stream',
  summary:
    'Stream Processing xử lý liên tục luồng dữ liệu không có điểm kết thúc. Vì sự kiện có thể đến trễ, hệ thống dùng event time, watermark và window để quyết định khi nào có thể chốt kết quả.',
  tags: ['Streaming', 'Watermark', 'Window', 'First Principles'],
  related: ['etl-batch', 'etl-cdc', 'etl-idempotency', 'arch-streaming', 'kafka-overview', 'kafka-exactly-once', 'kafka-vs-spark-streaming', 'dq-streaming'],
  sections: {
    definition: `**Stream Processing (Xử lý luồng)** là xử lý liên tục **dữ liệu không có giới hạn**, kết quả được cập nhật dần khi sự kiện đến.

Vì luồng không bao giờ kết thúc, hệ thống không thể đợi có đủ dữ liệu rồi mới tính. Câu hỏi trung tâm là: **khi nào có thể xem một khoảng thời gian đã đủ dữ liệu?**`,

    origin: `Với batch, muốn có số liệu mới phải đợi lô kế tiếp, mà dữ liệu trễ vẫn không được xử lý đúng. Các hệ thống đời đầu như Storm có độ trễ thấp nhưng kết quả xấp xỉ, nên [[arch-lambda|Lambda]] phải chạy thêm một nhánh batch để sửa lại.

Các engine như Flink và Spark Structured Streaming giải quyết đúng điểm đó: thêm khái niệm thời gian sự kiện, state chịu lỗi và checkpoint, để stream cho kết quả đúng ngay cả khi sự kiện đến lệch thứ tự.`,

    whyUse: `Stream cần thiết khi giá trị của dữ liệu giảm nhanh theo thời gian: phát hiện gian lận trước khi giao dịch hoàn tất, cảnh báo sự cố, đồng bộ thay đổi từ [[etl-cdc|CDC]].`,

    mechanism: `**Hai loại thời gian.** **Event time (thời gian sự kiện)** là lúc sự kiện xảy ra tại nơi tạo ra nó, gắn trong bản ghi. **Processing time (thời gian xử lý)** là đồng hồ của máy đang xử lý. Processing time đơn giản và độ trễ thấp nhất, nhưng kết quả phụ thuộc tốc độ đến của dữ liệu, nên không tái lập được khi phát lại hay khi có sự cố. Event time cho kết quả ổn định, đổi lại phải chờ sự kiện lệch thứ tự.

**Watermark** là tín hiệu tiến độ của event time. Trong Flink, Watermark(t) tuyên bố event time đã đến t, tức **không nên còn** sự kiện có timestamp nhỏ hơn hoặc bằng t. Cách tính thường gặp là thời gian sự kiện lớn nhất đã thấy trừ đi một khoảng cho phép lệch. Đây là ước lượng, không phải sự thật: sự kiện vẫn có thể đến sau đó và gọi là **late data (dữ liệu trễ)**.

**Đánh đổi của watermark:** khoảng cho phép càng lớn thì kết quả càng đầy đủ, nhưng phải chờ lâu hơn và giữ state nhiều hơn. Khoảng nhỏ thì nhanh nhưng bỏ sót nhiều.

**Toán tử có nhiều đầu vào** lấy giá trị **nhỏ nhất** của các đầu vào. Vì vậy một partition không có dữ liệu có thể làm watermark đứng yên và window không đóng, Flink có \`withIdleness\` để xử lý. Spark cũng mặc định lấy nhỏ nhất với nhiều luồng.

**Các loại window (cửa sổ):**

- **Tumbling:** kích thước cố định, không chồng lấn, mỗi sự kiện thuộc đúng một window.
- **Sliding:** kích thước cố định, trượt theo bước nhỏ hơn kích thước, một sự kiện có thể thuộc nhiều window.
- **Session:** không có kích thước cố định, đóng sau một khoảng không có hoạt động.
- **Global (Flink):** gom tất cả phần tử cùng key, phải có custom trigger, nếu không sẽ không bao giờ tính.

**Xử lý dữ liệu trễ:** trong Flink, allowed lateness mặc định bằng 0, nên phần tử trễ bị bỏ. Có thể đặt thêm thời gian cho phép để window tính lại, hoặc đưa phần quá trễ ra side output. Trong Spark, trễ dưới ngưỡng watermark được bảo đảm xử lý, còn trễ hơn thì **có thể được hoặc không**.

**Chịu lỗi:** state và vị trí đọc được lưu trong checkpoint, khi lỗi sẽ khôi phục rồi đọc lại. Exactly-once đầu cuối còn cần nguồn phát lại được và đích idempotent hoặc có giao dịch.`,

    diagram: {
      mermaid: `flowchart TD
  A["Sự kiện có event time, có thể lệch thứ tự"] --> B["Gán watermark: max event time trừ độ lệch"]
  B --> C["Gom vào window theo event time"]
  C --> D{"Watermark đã qua cuối window?"}
  D -->|"Chưa"| C
  D -->|"Rồi"| E["Phát kết quả, dọn dần state"]
  E --> F["Sự kiện quá trễ: bỏ hoặc đưa ra side output"]`,
      caption: 'Watermark quyết định khi nào chốt window, cũng là nơi đánh đổi giữa độ trễ và độ đầy đủ.',
    },

    example: `Một ứng dụng giao đồ ăn tính doanh thu theo từng phút. 98% sự kiện đến trong 30 giây, nhưng 1,5% từ điện thoại mất sóng có thể trễ đến 10 phút.

Dùng processing time, đơn trễ bị tính vào sai phút, nên chạy lại ra số khác. Chuyển sang event time với watermark 2 phút, phần 0,5% trễ hơn được ghi riêng và một job batch mỗi đêm sửa lại số liệu.`,

    prosCons: {
      pros: [
        '**Độ trễ thấp,** kết quả có sau vài giây hoặc nhanh hơn.',
        '**Event time cho kết quả ổn định** dù dữ liệu đến lệch thứ tự.',
      ],
      cons: [
        '**Vận hành phức tạp:** state lớn, checkpoint, nâng cấp job có state, backpressure.',
        '**Tính đầy đủ chỉ là ước lượng,** phải chọn giữa bỏ sót và chờ lâu.',
      ],
    },

    whenToUse: {
      use: [
        'Khi quyết định phải có trong vài giây, như gian lận, cảnh báo, cá nhân hóa tức thời.',
        'Dùng event time cho số liệu nghiệp vụ. Processing time hợp với giám sát vận hành.',
      ],
      avoid: [
        'Không dùng khi người dùng chỉ xem báo cáo mỗi sáng: batch rẻ và đơn giản hơn nhiều.',
      ],
    },

    comparison: {
      intro: 'Chế độ continuous của Spark vẫn là thử nghiệm và chỉ có at-least-once.',
      headers: ['Tiêu chí', 'Flink', 'Spark Structured Streaming'],
      rows: [
        ['Mô hình', 'Xử lý từng bản ghi', 'Micro-batch là mặc định'],
        ['Độ trễ', 'Rất thấp', 'Khoảng 100 ms ở mức tốt nhất với micro-batch'],
        ['Window', 'Tumbling, sliding, session, global', 'Tumbling, sliding, session'],
      ],
    },

    misconceptions: [
      {
        myth: 'Watermark bảo đảm không còn sự kiện nào đến muộn hơn nó.',
        truth: 'Watermark chỉ là ước lượng. Sự kiện vẫn có thể đến muộn hơn, và hệ thống phải có chính sách cho chúng: bỏ, tính lại, hoặc ghi riêng.',
      },
      {
        myth: 'Trong Spark, dữ liệu trễ hơn ngưỡng watermark chắc chắn bị bỏ.',
        truth: 'Bảo đảm chỉ một chiều: trễ dưới ngưỡng không bị bỏ. Trễ hơn có thể vẫn được tính, càng trễ thì khả năng càng thấp.',
      },
      {
        myth: 'Exactly-once nghĩa là mỗi sự kiện chỉ được xử lý đúng một lần về mặt vật lý.',
        truth: 'Sự kiện có thể được xử lý lại sau lỗi. Exactly-once nói về hiệu ứng lên state và đầu ra, nhờ checkpoint cộng đích idempotent hoặc có giao dịch.',
      },
    ],
  },
})
