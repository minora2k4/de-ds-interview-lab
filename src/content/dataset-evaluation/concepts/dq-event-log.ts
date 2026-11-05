import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-event-log',
  summary:
    'Dữ liệu log và sự kiện cần kiểm tra Event Time và Processing Time, dữ liệu đến trễ, sự kiện trùng, Schema Drift và độ đầy đủ của phiên. Số liệu của ngày hôm qua có thể chưa đủ, vì sự kiện còn đang trên đường đến.',
  tags: ['Sự kiện', 'Event Time', 'Schema Drift'],
  related: ['dq-streaming', 'dq-semi-structured', 'dq-time-series', 'etl-stream', 'kafka-at-least-once', 'dw-schema-evolution'],
  sections: {
    definition: `**Event and Log Data (Dữ liệu log và sự kiện)** ghi lại những việc đã xảy ra, thường chỉ thêm mà không sửa. **Event Time** là lúc sự kiện xảy ra, **Processing Time** là lúc hệ thống xử lý nó. Hai mốc này có thể lệch nhau từ vài giây đến vài ngày.`,

    origin: `Log ban đầu chỉ dùng để gỡ lỗi nên mất vài dòng không sao. Khi log trở thành nguồn của chỉ số kinh doanh và đặc trưng cho mô hình, những giả định cũ không còn đúng: sự kiện có thể đến trễ, đến hai lần, hoặc đổi cấu trúc khi một đội phát hành phiên bản mới.`,

    whyUse: `Sự kiện không có khóa tự nhiên hay giao dịch như bảng thông thường, và hệ thống phân tán đưa chúng đến không theo thứ tự. Nếu không đánh giá, chỉ số như số phiên hoặc tỷ lệ chuyển đổi có thể sai mà không ai biết.`,

    mechanism: `- **Event Time và Processing Time:** phân phối độ trễ giữa hai mốc cho biết nên chờ bao lâu. Luôn tính chỉ số theo Event Time. Đồng hồ trên thiết bị có thể sai, nên kiểm tra cả sự kiện có thời gian ở tương lai.
- **Dữ liệu đến trễ:** app ngoại tuyến gửi sự kiện sau vài giờ. Số liệu của một ngày chỉ nên chốt sau một **cửa sổ ổn định**.
- **Sự kiện trùng:** cơ chế [[kafka-at-least-once|At-least-once]] có thể gửi lại. Đo tỷ lệ trùng theo \`event_id\`. Nếu nguồn không có ID thì khử trùng rất khó.
- **Schema Drift:** trường mới, trường biến mất, đổi kiểu sau khi phát hành. So theo phiên bản app để tìm đúng nguyên nhân. Liên quan [[dw-schema-evolution]].
- **Độ đầy đủ của phiên:** kiểm tra theo chuỗi, ví dụ mọi \`payment\` phải có \`checkout\` trước đó. Vì mọi sự kiện đơn lẻ đều hợp lệ, cách này mới phát hiện được phần bị mất. Tỷ lệ phiên mất sự kiện tăng là dấu hiệu rõ.
- **Đối chiếu:** so số đơn trong log với số đơn trong bảng giao dịch, nhằm ước lượng tỷ lệ mất sự kiện.`,

    diagram: {
      mermaid: `flowchart TD
  A["Sự kiện xảy ra: Event Time"] --> B["Ứng dụng giữ lại khi ngoại tuyến: đến trễ"]
  B --> C["Gửi lại khi lỗi mạng: sự kiện trùng"]
  C --> D["Hàng đợi và xử lý: Processing Time"]
  D --> E["Bảng phân tích: chỉ chốt sau cửa sổ ổn định"]`,
      caption: 'Mỗi chặng trên đường đi có thể làm sự kiện trễ, trùng hoặc mất.',
    },

    example: `Một app có 40 triệu sự kiện mỗi ngày. Số đơn trong log thấp hơn bảng giao dịch 6%. Xem theo phiên bản thì chỉ riêng bản Android 5.2 lệch 31%, do lỗi gửi sự kiện. Ngoài ra, số liệu ngày hôm qua luôn tăng thêm 4% sau 3 ngày, nên báo cáo được đổi sang chốt sau 72 giờ.`,

    prosCons: {
      pros: ['Có thể tự động đo độ trễ, tỷ lệ trùng và thay đổi schema.', 'Đối chiếu với bảng giao dịch cho biết tỷ lệ mất dữ liệu.'],
      cons: ['Cửa sổ ổn định dài thì làm chậm số liệu.', 'Sự kiện mất hẳn thì không để lại dấu vết trong log, nên cần nguồn khác để đối chiếu.'],
    },

    whenToUse: {
      use: ['Khi chỉ số quan trọng được tính từ log.', 'Sau mỗi lần phát hành phiên bản app mới.'],
      avoid: ['Không tính chỉ số theo Processing Time cho báo cáo kinh doanh.', 'Không so sánh ngày hôm nay với hôm qua khi dữ liệu chưa ổn định.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Event Time', 'Processing Time'],
      rows: [
        ['Ý nghĩa', 'Lúc sự việc xảy ra', 'Lúc hệ thống xử lý'],
        ['Chỉ số kinh doanh', 'Phù hợp', 'Sai khi có trễ hoặc xử lý lại'],
        ['Rủi ro', 'Đồng hồ thiết bị sai, đến trễ', 'Thay đổi khi chạy lại'],
      ],
    },

    misconceptions: [
      { myth: 'Số liệu hôm qua đã đầy đủ vào sáng hôm nay.', truth: 'Sự kiện vẫn có thể đang trên đường đến. Chỉ nên chốt sau khi đo phân phối độ trễ.' },
      { myth: 'Mọi sự kiện đều hợp lệ thì dữ liệu đầy đủ.', truth: 'Kiểm tra từng sự kiện không thấy được phần đã mất. Phải kiểm tra theo chuỗi và đối chiếu với nguồn khác.' },
    ],
  },
})
