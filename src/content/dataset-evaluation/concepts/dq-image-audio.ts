import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-image-audio',
  summary:
    'Dữ liệu hình ảnh và âm thanh cần kiểm tra tệp lỗi, độ phân giải hoặc sample rate, gần trùng lặp, chất lượng gán nhãn và cân bằng lớp. Rủi ro lớn là mô hình học theo thiết bị hay phông nền thay vì đối tượng.',
  tags: ['Hình ảnh', 'Âm thanh', 'Gần trùng lặp'],
  related: ['dq-overview', 'dq-label-quality', 'dq-text', 'dq-representativeness', 'eda-imbalanced'],
  sections: {
    definition: `**Image and Audio Data (Dữ liệu hình ảnh và âm thanh)** là dữ liệu nhị phân dung lượng lớn, gần như không thể đọc trực tiếp bằng truy vấn. Việc đánh giá gồm **kiểm tra tệp**, **thống kê tín hiệu** từ nội dung và **kiểm tra nhãn**.`,

    origin: `Dữ liệu dạng này thường được gom từ nhiều nguồn, nhiều thiết bị và nhiều lần gán nhãn thuê ngoài. Khi đó người ta nhận ra mô hình có thể đạt điểm rất cao nhờ những tín hiệu ngoài lề, như loại máy chụp, thay vì học đặc điểm thực sự. Vì thế chỉ kiểm tra định dạng tệp là không đủ.`,

    whyUse: `Tệp lỗi làm hỏng hoặc làm chậm cả quá trình huấn luyện. Nghiêm trọng hơn, tín hiệu giả làm mô hình đạt điểm cao trong phòng thí nghiệm rồi thất bại khi đem ra dùng.`,

    mechanism: `- **Tệp lỗi:** thử giải mã từng tệp, không chỉ kiểm tra phần mở rộng. Có thể gặp tệp rỗng, tệp cắt ngang, hoặc ảnh một màu.
- **Độ phân giải và sample rate:** xem phân phối, vì trộn nhiều mức mà không đưa về chuẩn sẽ làm mô hình học nhầm. Ví dụ âm thanh 8 kHz và 44,1 kHz có dải tần khác nhau.
- **Gần trùng lặp:** ảnh sửa nhẹ hoặc các khung liền nhau của một video. Dùng **Perceptual Hash** hoặc so embedding. Phải **chia train và test theo nguồn** như theo video hoặc theo bệnh nhân.
- **Chất lượng gán nhãn:** độ đồng thuận giữa người gán. Với hộp bao, đo **IoU** giữa hai người. Xem [[dq-label-quality]].
- **Cân bằng lớp:** số mẫu mỗi lớp, cả theo nhóm con như điều kiện ánh sáng. Xem [[eda-imbalanced]].
- **Tín hiệu giả:** kiểm tra xem thiết bị, phông nền, tên tệp có tương quan với nhãn không, vì đây là một dạng [[dq-representativeness|sai lệch đại diện]].`,

    example: `Bộ 200.000 ảnh X-quang từ 3 bệnh viện đạt AUC 0,97. Kiểm tra cho thấy bệnh viện A chuyên ca nặng chiếm 80% ca dương tính, và ảnh của bệnh viện này có dấu đánh dấu ở góc. Mô hình đang nhận ra bệnh viện. Khi đánh giá trên một bệnh viện chưa từng thấy, AUC chỉ còn 0,71.`,

    prosCons: {
      pros: ['Kiểm tra tệp và phân phối kích thước tự động hoàn toàn.', 'Embedding giúp tìm gần trùng và cụm bất thường mà không cần nhãn.'],
      cons: ['Giải mã toàn bộ tệp tốn kém trên bộ dữ liệu rất lớn.', 'Tín hiệu giả khó phát hiện nếu không biết để tìm.'],
    },

    whenToUse: {
      use: ['Khi gom dữ liệu từ nhiều nguồn hay nhiều thiết bị.', 'Luôn chia tập theo nguồn gốc khi dữ liệu có cấu trúc nhóm.'],
      avoid: ['Không đánh giá chỉ bằng phần chia ngẫu nhiên.', 'Không chỉ kiểm tra phần mở rộng của tệp.'],
    },

    comparison: {
      headers: ['Kiểm tra', 'Hình ảnh', 'Âm thanh'],
      rows: [
        ['Tệp lỗi', 'Giải mã được không, ảnh một màu', 'Giải mã được không, đoạn im lặng'],
        ['Độ đo chất lượng', 'Độ phân giải, độ mờ', 'Sample rate, độ dài, mức nhiễu'],
        ['Gần trùng lặp', 'Perceptual Hash, embedding', 'Audio fingerprint, embedding'],
        ['Tín hiệu giả', 'Phông nền, loại máy', 'Micro, tiếng ồn nền'],
      ],
    },

    misconceptions: [
      { myth: 'Có nhiều ảnh thì mô hình sẽ học tốt.', truth: 'Hàng trăm nghìn khung từ vài video gần giống nhau chỉ mang lượng thông tin nhỏ.' },
      { myth: 'Điểm cao trên tập test ngẫu nhiên là đủ tin.', truth: 'Tập test có cùng thiết bị và cùng nguồn. Cần đánh giá trên nguồn chưa từng thấy.' },
    ],
  },
})
