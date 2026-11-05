import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-streaming',
  summary:
    'Trong dữ liệu luồng, không bao giờ có "toàn bộ dữ liệu" để kiểm tra, nên chia thành kiểm tra từng bản ghi lúc xử lý, chỉ số theo cửa sổ thời gian, và đối soát định kỳ với batch. Độ đầy đủ chỉ biết sau Watermark.',
  tags: ['Streaming', 'Watermark', 'Cửa sổ'],
  related: ['dq-event-log', 'dq-incremental', 'etl-stream', 'arch-streaming', 'kafka-at-least-once', 'kafka-vs-spark-streaming'],
  sections: {
    definition: `**Streaming Data Quality (Chất lượng dữ liệu luồng)** là đánh giá dữ liệu trong khi nó vẫn đang chảy. Dữ liệu không có điểm kết thúc, nên các chỉ số phải tính theo **cửa sổ thời gian**, và kết quả chỉ mang tính tạm thời cho đến khi dữ liệu trễ đã về đủ.`,

    origin: `Kiểm tra theo batch chạy sau khi dữ liệu đã ghi xong. Với hệ thống cần phản ứng trong vài giây như phát hiện gian lận, đợi đến cuối ngày đồng nghĩa dữ liệu hỏng đã được dùng để ra quyết định. Vì vậy phải kiểm tra ngay trên luồng, với giới hạn về độ trễ và bộ nhớ.`,

    whyUse: `Lỗi trong luồng lan đi rất nhanh tới mọi Consumer. Phát hiện trong vài phút thay vì vài giờ sẽ giảm nhiều lượng dữ liệu cần xử lý lại. Xem các kiểu lỗi đặc trưng ở [[dq-event-log]].`,

    mechanism: `Chia theo chi phí và thời điểm biết kết quả:

1. **Từng bản ghi, ngay khi xử lý:** schema, trường bắt buộc, miền giá trị. Rất rẻ và không cần trạng thái. Bản ghi hỏng đưa sang **Dead Letter Queue (Hàng đợi bản ghi lỗi)** để xử lý sau, thay vì làm dừng cả luồng hoặc bỏ đi âm thầm.
2. **Theo cửa sổ:** số sự kiện mỗi phút, tỷ lệ null, độ trễ giữa Event Time và Processing Time, so với cùng khung giờ tuần trước. Cần trạng thái, nên phải giới hạn bộ nhớ, thường dùng [[dq-approximate|sketch]].
3. **Sau Watermark:** Watermark là mốc mà hệ thống giả định dữ liệu trễ hơn sẽ không đến nữa. Chỉ sau mốc này mới kết luận về độ đầy đủ. Đặt dài thì chờ lâu và tốn bộ nhớ, đặt ngắn thì mất dữ liệu trễ. Nên đo số sự kiện bị loại vì đến quá trễ.
4. **Đối soát với batch:** định kỳ so số liệu luồng với bản batch đầy đủ hơn. Đây là cách duy nhất phát hiện sự kiện đã mất trên đường đi.

Tính duy nhất trên toàn bộ lịch sử là không khả thi vì cần trạng thái vô hạn. Thực tế chỉ khử trùng trong một khoảng thời gian giới hạn.`,

    example: `Luồng thanh toán có 2 triệu sự kiện mỗi phút. Một bản phát hành khiến \`amount\` thành chuỗi: kiểm tra từng bản ghi đưa chúng sang Dead Letter Queue, chỉ số tỷ lệ lỗi theo phút tăng từ 0,01% lên 22%, và có cảnh báo sau 2 phút. Sau khi sửa lỗi, 11 triệu bản ghi lỗi được phát lại mà không mất dữ liệu nào.`,

    prosCons: {
      pros: ['Phát hiện trong vài phút, trước khi lỗi lan xa.', 'Dead Letter Queue giữ được bản ghi lỗi để xử lý lại.'],
      cons: ['Kiểm tra làm tăng độ trễ và cần trạng thái.', 'Kết quả chỉ tạm thời vì vẫn có thể có dữ liệu đến trễ.'],
    },

    whenToUse: {
      use: ['Khi quyết định dựa trên dữ liệu trong vài giây đến vài phút.', 'Khi lỗi lan nhanh tới nhiều Consumer.'],
      avoid: ['Không đặt kiểm tra đắt, cần trạng thái lớn ngay trong đường xử lý chính.', 'Không dùng khi số liệu chỉ cần cập nhật theo ngày, vì batch rẻ và đơn giản hơn.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Theo batch', 'Theo luồng'],
      rows: [
        ['Phạm vi', 'Một Partition đã đóng', 'Một cửa sổ, có thể thay đổi'],
        ['Khi nào biết đủ', 'Sau cửa sổ ổn định', 'Sau Watermark, và là giả định'],
        ['Khi có lỗi', 'Chặn công bố', 'Đưa sang Dead Letter Queue'],
        ['Tính duy nhất', 'Toàn bộ Partition', 'Trong một khoảng thời gian'],
      ],
    },

    misconceptions: [
      { myth: 'Đã có kiểm tra trên luồng thì không cần batch.', truth: 'Luồng khó phát hiện sự kiện đã mất và dữ liệu đến rất trễ. Đối soát batch vẫn cần thiết.' },
      { myth: 'Watermark đảm bảo dữ liệu đã đủ.', truth: 'Watermark chỉ là giả định. Dữ liệu vẫn có thể đến sau mốc đó và bị loại, nên phải đo phần bị loại này.' },
    ],
  },
})
