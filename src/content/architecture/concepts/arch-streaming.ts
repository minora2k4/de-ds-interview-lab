import { defineConcept } from '../../define'

export default defineConcept({
  id: 'arch-streaming',
  summary:
    'Streaming Architecture xử lý dữ liệu liên tục ngay khi đến, qua một log bền vững và engine có state. Đổi lại độ trễ thấp là phải xử lý thứ tự, dữ liệu trễ, state và vận hành 24/7.',
  tags: ['Kiến trúc', 'Streaming', 'Kafka'],
  related: ['etl-stream', 'kafka-overview', 'kafka-delivery-semantics', 'kafka-exactly-once', 'arch-kappa', 'arch-lambda', 'arch-batch'],
  sections: {
    definition: `**Streaming Architecture (Kiến trúc xử lý luồng)** ghép các thành phần để xử lý dữ liệu **không có điểm kết thúc**: nguồn sự kiện, log bền vững như [[kafka-overview|Kafka]], engine có state như Flink, và kho phục vụ. Kỹ thuật xử lý xem ở [[etl-stream]].`,

    origin: `Batch không thể đưa ra quyết định trong vài giây. Hệ thống ban đầu còn hạn chế nên từng cần batch để sửa số, dẫn đến [[arch-lambda]]. Khi engine mạnh hơn, [[arch-kappa]] trở nên khả thi.`,

    whyUse: `Giá trị của nhiều dữ liệu giảm nhanh theo thời gian, như chặn gian lận hay cảnh báo sự cố.`,

    mechanism: `1. **Log bền vững** làm bộ đệm: engine lỗi hoặc chậm thì dữ liệu vẫn còn để đọc tiếp.
2. **Event time:** sự kiện có thể đến không theo thứ tự, nên phải tính theo lúc xảy ra.
3. **Watermark** ước lượng event time đã đến đâu, để biết khi nào đóng cửa sổ. Đặt chặt thì nhanh nhưng dễ bỏ sót, đặt lỏng thì đủ hơn nhưng trễ hơn. Với Flink, \`allowedLateness\` mặc định là 0, nên phần tử sau watermark bị bỏ nếu không cấu hình thêm.
4. **Checkpoint** lưu state cùng vị trí đọc. Khi lỗi, engine quay về đó và đọc lại, nên đích ghi phải có giao dịch hoặc idempotent mới đạt [[kafka-exactly-once|exactly-once]].`,

    example: `Một ví điện tử có 20.000 giao dịch mỗi giây. Flink đếm giao dịch theo thẻ trong 5 phút gần nhất, độ trễ khoảng 1 giây. Khi job dừng 10 phút để triển khai, 12 triệu sự kiện vẫn nằm trong Kafka, và job đọc tiếp từ checkpoint.`,

    prosCons: {
      pros: ['Độ trễ thấp, cho phép phản ứng ngay.', 'Log cho phép nhiều người đọc độc lập và đọc lại.'],
      cons: ['Khó hơn batch: thứ tự, dữ liệu trễ, state lớn.', 'Chạy 24/7 nên tốn tài nguyên và cần trực sự cố.'],
    },

    whenToUse: {
      use: ['Hành động phải diễn ra trong vài giây sau sự kiện.', 'Dữ liệu vốn là sự kiện liên tục, nhiều nơi cùng cần đọc.'],
      avoid: ['Người dùng chỉ xem báo cáo mỗi ngày: dùng [[arch-batch]].', 'Đội chưa đủ người trực: micro-batch vài phút thường đủ.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Micro-batch', 'Stream từng sự kiện'],
      rows: [
        ['Ví dụ', 'Spark Structured Streaming mặc định', 'Flink, Kafka Streams'],
        ['Độ trễ', 'Giây đến phút', 'Mili giây đến giây'],
      ],
    },

    misconceptions: [
      {
        myth: 'Engine có exactly-once thì đích ghi không bao giờ bị trùng.',
        truth: 'Đảm bảo chỉ phủ đến đích ghi khi đích có giao dịch hoặc idempotent. Gọi dịch vụ ngoài vẫn có thể lặp lại.',
      },
    ],
  },
})
