import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-overview',
  summary:
    'Không có bộ dữ liệu tốt tuyệt đối, chỉ có bộ dữ liệu phù hợp với mục đích sử dụng. Đánh giá theo 4 lớp: chất lượng nội tại, tính đại diện, giá trị cho bài toán, và khả năng vận hành, tuân thủ.',
  tags: ['Tổng quan', 'Fitness for Purpose', 'First Principles'],
  related: ['dq-dimensions', 'dq-representativeness', 'dq-label-quality', 'dq-sufficiency', 'dq-datasheets', 'dq-scale-strategy', 'etl-data-quality', 'eda-overview'],
  sections: {
    definition: `**Fitness for Purpose (Phù hợp với mục đích)** nghĩa là một bộ dữ liệu được xem là tốt khi nó đủ tin cậy cho **một quyết định hoặc bài toán cụ thể**, với mức rủi ro chấp nhận được.

Chất lượng vì vậy không phải thuộc tính riêng của dữ liệu, mà là quan hệ giữa dữ liệu và cách dùng. Cùng một bảng giao dịch có thể đủ tốt cho báo cáo doanh thu tháng, nhưng chưa đủ tốt cho mô hình phát hiện gian lận nếu nhãn gian lận về trễ 60 ngày.`,

    origin: `Cách làm cũ đo chất lượng bằng tỷ lệ lỗi, ví dụ "99% số dòng hợp lệ". Nhưng dữ liệu sạch vẫn có thể lệch so với thực tế, và một con số không cho biết dữ liệu dùng được vào việc gì.

Năm 1996, Wang và Strong định nghĩa chất lượng từ phía người dùng, là dữ liệu "fit for use". Khi dữ liệu trở thành đầu vào của mô hình, có thêm hai câu hỏi: dữ liệu có đại diện không, và nhãn có đáng tin không.`,

    whyUse: `- **Tránh kết luận sai:** bảng không có lỗi nào vẫn có thể cho mô hình kém khi triển khai.
- **Đặt công sức đúng chỗ:** biết mục đích thì biết luật nào phải chặt, luật nào có thể nới.
- **Có ngôn ngữ chung:** DE, DS và nghiệp vụ cùng trả lời một danh sách câu hỏi.`,

    mechanism: `**Bước 1: Viết rõ mục đích.** Dữ liệu phục vụ quyết định gì, sai thì mất gì. Câu trả lời này đặt ra ngưỡng cho các bước sau.

**Bước 2: Xét lần lượt 4 lớp.** Lỗi ở lớp sau không sửa được bằng cách làm sạch ở lớp trước, nên phải xét đủ:

1. **Chất lượng nội tại:** dữ liệu có đúng với chính nó không. Gồm 6 [[dq-dimensions|chiều chất lượng]]: Completeness, Accuracy, Consistency, Validity, Uniqueness, Timeliness.
2. **[[dq-representativeness|Tính đại diện]]:** dữ liệu có phản ánh đúng tổng thể và môi trường sử dụng thật không, có Selection Bias không.
3. **Giá trị cho bài toán:** có [[dq-sufficiency|đủ tín hiệu và đủ số lượng]] không, [[dq-label-quality|nhãn]] có đáng tin không.
4. **Vận hành và tuân thủ:** độ tươi, [[etl-lineage|lineage]], [[dq-datasheets|tài liệu mô tả]], giấy phép, quyền riêng tư. Dữ liệu tốt nhưng không được phép dùng, hoặc không tái tạo được, thì vẫn không dùng được lâu dài.

**Bước 3: Kiểm tra riêng theo loại dữ liệu,** vì mỗi loại có kiểu lỗi riêng. Xem bảng tra cứu ở mục So sánh.

**Bước 4: Kết luận có điều kiện.** Không kết luận bằng một điểm số. Hãy viết: dùng được cho việc X, chưa dùng được cho việc Y, cần khắc phục Z.`,

    diagram: {
      mermaid: `flowchart TD
  A["Mục đích: quyết định gì, sai thì mất gì"] --> B["Lớp 1: Chất lượng nội tại"]
  B --> C["Lớp 2: Tính đại diện"]
  C --> D["Lớp 3: Giá trị cho bài toán"]
  D --> E["Lớp 4: Vận hành và tuân thủ"]
  E --> F["Kết luận: dùng được cho việc gì, với điều kiện nào"]`,
      caption:
        'Mục đích đặt ra ngưỡng cho cả 4 lớp. Kết quả là một kết luận có điều kiện, không phải một điểm số.',
    },

    example: `Một công ty tài chính có 2 triệu hồ sơ vay và muốn xây mô hình duyệt vay.

- **Lớp 1:** 99,2% trường bắt buộc có giá trị, khóa không trùng. Rất tốt.
- **Lớp 2:** chỉ có hồ sơ **đã được duyệt**, chiếm 38% số người nộp. Mô hình sẽ phải chấm cả nhóm 62% chưa từng có trong dữ liệu.
- **Lớp 3:** tỷ lệ vỡ nợ 1,4%, tức 28.000 ca, đủ để học. Nhưng nhãn cần 12 tháng quan sát, nên 400.000 hồ sơ mới nhất chưa có nhãn đáng tin.
- **Lớp 4:** có số giấy tờ tùy thân, phải che trước khi đưa cho đội phân tích.

Kết luận: dùng được ngay cho báo cáo danh mục. Với mô hình duyệt vay thì chỉ phù hợp có điều kiện: loại hồ sơ chưa đủ 12 tháng và thử nghiệm thêm trên nhóm từng bị từ chối.`,

    prosCons: {
      pros: [
        '**Kết luận gắn với quyết định,** nên người đọc biết phải làm gì tiếp theo.',
        '**Phát hiện lỗi mà số liệu sạch che giấu,** như lệch chọn mẫu hay nhãn chưa trưởng thành.',
      ],
      cons: [
        '**Không cho một điểm số đơn giản** để so sánh nhanh giữa các bộ dữ liệu.',
        '**Lớp 2 và lớp 3 khó tự động,** cần hiểu nghiệp vụ và thường cần chuyên gia.',
      ],
    },

    whenToUse: {
      use: [
        'Trước khi đưa một bộ dữ liệu mới vào phân tích hoặc mô hình.',
        'Khi dùng lại dữ liệu cũ cho một mục đích khác với mục đích ban đầu.',
      ],
      avoid: [
        'Không thay thế kiểm tra tự động hằng ngày, phần đó thuộc [[etl-data-quality]] và [[arch-observability]].',
        'Không kết luận "dữ liệu tốt" mà không nói rõ tốt cho việc gì.',
      ],
    },

    comparison: {
      intro: 'Bảng tra cứu theo loại dữ liệu. Mỗi loại có điểm kiểm tra riêng, ngoài 4 lớp chung:',
      headers: ['Loại dữ liệu', 'Điểm cần kiểm tra riêng', 'Lỗi hay bị bỏ sót', 'Chi tiết'],
      rows: [
        ['Dạng bảng', 'Khóa chính, ràng buộc tham chiếu, kiểu dữ liệu, cardinality, MCAR/MAR/MNAR, Data Leakage', 'Join làm nhân dòng, cột được tính sau thời điểm dự đoán', '[[dq-tabular]]'],
        ['Chuỗi thời gian', 'Tần suất đều, khoảng trống, timestamp trùng, múi giờ, Stationarity, Seasonality, Look-ahead Bias', 'Giờ trùng khi đổi giờ mùa hè, đặc trưng dùng thông tin tương lai', '[[dq-time-series]]'],
        ['Văn bản', 'Encoding, ngôn ngữ, trùng lặp, phân phối độ dài, nhiễu nhãn, PII', 'Văn bản trùng nằm ở cả train và test', '[[dq-text]]'],
        ['Hình ảnh và âm thanh', 'Tệp lỗi, độ phân giải hoặc sample rate, gần trùng lặp, chất lượng gán nhãn, cân bằng lớp', 'Thiết bị hoặc phông nền tương quan với nhãn', '[[dq-image-audio]]'],
        ['Log và sự kiện', 'Event Time và Processing Time, dữ liệu đến trễ, sự kiện trùng, Schema Drift, độ đầy đủ của phiên', 'Sự kiện gửi lại khi retry, phiên đứt do mất sự kiện', '[[dq-event-log]]'],
        ['Bán cấu trúc (JSON)', 'Schema thay đổi giữa các bản ghi, kiểu không nhất quán, null trong cấu trúc lồng nhau', 'Coi null, thiếu khóa và mảng rỗng là như nhau', '[[dq-semi-structured]]'],
      ],
      note: 'Muốn biết đo bằng chỉ số nào, xem [[dq-metrics]]. Dữ liệu quá lớn để quét toàn bộ, xem [[dq-scale-strategy]].',
    },

    misconceptions: [
      {
        myth: 'Dữ liệu sạch là dữ liệu tốt.',
        truth: 'Sạch chỉ là lớp 1. Một khảo sát không có lỗi nhập liệu nhưng chỉ hỏi người dùng ở thành phố lớn vẫn không dùng được để nói về cả nước.',
      },
      {
        myth: 'Càng nhiều dữ liệu thì càng tốt.',
        truth: 'Thêm dữ liệu giảm sai số ngẫu nhiên, nhưng không sửa được sai lệch hệ thống.',
      },
      {
        myth: 'Điểm chất lượng 95% nghĩa là dùng được.',
        truth: 'Điểm tổng hợp có thể che lỗi nghiêm trọng ở một cột quan trọng. Ngưỡng dùng được phụ thuộc vào mục đích, nên phải xem theo từng luật.',
      },
      {
        myth: 'Đánh giá một lần là xong.',
        truth: 'Kết luận hôm nay có thể không còn đúng sau khi [[dq-drift|dữ liệu trôi]], nên phải theo dõi liên tục.',
      },
    ],
  },
})
