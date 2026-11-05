import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-representativeness',
  summary:
    'Tính đại diện là mức độ dữ liệu phản ánh đúng tổng thể và môi trường sẽ sử dụng. Selection Bias xảy ra khi cách thu thập khiến một số nhóm dễ vào dữ liệu hơn, và thêm dữ liệu cùng nguồn không sửa được lỗi này.',
  tags: ['Selection Bias', 'Tính đại diện', 'First Principles'],
  related: ['dq-overview', 'dq-distribution-comparison', 'dq-drift', 'dq-sampling', 'eda-sampling', 'eda-imbalanced', 'stats-confidence-interval'],
  sections: {
    definition: `**Representativeness (Tính đại diện)** là mức độ một bộ dữ liệu phản ánh đúng **tổng thể mục tiêu** và **môi trường sẽ sử dụng** nó.

**Selection Bias (Sai lệch chọn mẫu)** xảy ra khi cách dữ liệu đi vào bộ dữ liệu phụ thuộc vào chính điều đang nghiên cứu, khiến một số nhóm xuất hiện nhiều hoặc ít hơn thực tế.

Các dạng hay gặp: **Survivorship Bias** (chỉ thấy đối tượng còn tồn tại), **Non-response Bias** (chỉ nghe người chịu trả lời), và **Coverage Bias** (danh sách lấy mẫu vốn đã thiếu một nhóm).`,

    origin: `Bài học nổi tiếng là cuộc thăm dò của Literary Digest năm 1936: khoảng 2,3 triệu phiếu nhưng dự đoán sai người thắng cử, trong khi mẫu khoảng 50.000 người của Gallup đoán đúng. Danh sách gửi phiếu lệch về nhóm khá giả, và người không ưa Roosevelt chịu trả lời nhiều hơn.

Trong học máy, vấn đề này quay lại khi dữ liệu triển khai khác dữ liệu huấn luyện. Kiểm tra chất lượng thông thường không nhìn ra được, nên cần xét như một lớp riêng.`,

    whyUse: `Đây là lớp **không thể phát hiện chỉ bằng cách nhìn vào dữ liệu đang có**. Tệp hoàn toàn sạch, luật nào cũng đạt, nhưng những gì không được ghi lại thì không có cột nào báo lỗi. Mô hình cũng đạt điểm tốt lúc đánh giá, vì tập kiểm tra lệch cùng cách với tập huấn luyện.`,

    mechanism: `**Vì sao thêm dữ liệu không sửa được:** sai số của ước lượng gồm phần ngẫu nhiên và phần hệ thống. Phần ngẫu nhiên giảm theo căn bậc hai của cỡ mẫu, còn phần hệ thống giữ nguyên. Mẫu càng lớn thì [[stats-confidence-interval|khoảng tin cậy]] càng hẹp quanh **một giá trị sai**, nên càng dễ tin nhầm.

**Cách kiểm tra:**

1. **Định nghĩa tổng thể mục tiêu:** ai hoặc cái gì mà kết luận sẽ áp dụng lên. Chưa rõ điểm này thì không đánh giá được.
2. **Vẽ quy trình tạo dữ liệu:** từng bước nào có thể làm mất một nhóm, như đăng nhập, duyệt hồ sơ, gửi khảo sát, lọc dữ liệu.
3. **So sánh với nguồn bên ngoài:** so phân phối độ tuổi, khu vực, thiết bị với thống kê dân số, toàn bộ khách hàng hoặc dữ liệu triển khai, bằng các phép đo trong [[dq-distribution-comparison]].
4. **Xem độ phủ các nhóm nhỏ:** nhóm nào gần như không có mẫu thì mô hình không học được, dù trung bình toàn bộ vẫn đẹp.
5. **Kiểm tra quan hệ theo thời gian:** dữ liệu năm 2021 có còn đại diện cho năm nay không, xem [[dq-drift]].

**Cách khắc phục, từ tốt đến tạm thời:** thu thêm dữ liệu từ nhóm thiếu, chuyển sang [[eda-sampling|lấy mẫu]] có thiết kế, rồi mới tới **reweighting (gán lại trọng số)** theo phân phối mục tiêu. Reweighting chỉ giúp khi nhóm thiếu vẫn có một ít mẫu. Không thể gán trọng số cho một nhóm hoàn toàn vắng mặt.`,

    diagram: {
      mermaid: `flowchart TD
  A["Tổng thể mục tiêu: mọi người nộp hồ sơ"] --> B["Bước sàng lọc: chỉ duyệt 38%"]
  B --> C["Có nhãn trả nợ: chỉ nhóm được duyệt"]
  C --> D["Dữ liệu huấn luyện sạch nhưng lệch"]
  A --> E["Môi trường triển khai: chấm 100% hồ sơ"]
  D --> F["Mô hình học từ nhóm được duyệt rồi chấm cả nhóm chưa từng thấy"]
  E --> F`,
      caption:
        'Mỗi bước sàng lọc trong quy trình có thể làm dữ liệu khác với tổng thể mà mô hình sẽ gặp.',
    },

    example: `Một ứng dụng giao đồ ăn dự đoán thời gian giao hàng bằng 8 triệu đơn đã hoàn thành. Mọi kiểm tra chất lượng đều đạt. Khi triển khai, mô hình đoán thiếu trung bình 9 phút vào giờ mưa.

Xem lại quy trình, nhóm phân tích thấy dữ liệu **chỉ gồm đơn đã giao xong**. Đơn bị hủy vì giao quá lâu chiếm 11% vào ngày mưa, nhưng chỉ 2% vào ngày thường, và chúng không có thời gian giao. Đơn lâu nhất bị loại khỏi dữ liệu, nên mô hình học từ một thế giới lạc quan hơn thực tế.

Cách sửa là đưa đơn hủy vào với thông tin thời gian đã chờ, thay vì thêm 8 triệu đơn hoàn thành nữa.`,

    prosCons: {
      pros: [
        '**Phát hiện vấn đề mà luật dữ liệu không thấy được,** vì lỗi nằm ở thứ không được ghi lại.',
        '**Giải thích được khoảng cách** giữa kết quả đánh giá và kết quả triển khai.',
      ],
      cons: [
        '**Cần nguồn đối chiếu bên ngoài,** mà không phải lúc nào cũng có.',
        '**Khó định lượng đầy đủ:** không thể đo trực tiếp một nhóm chưa từng được ghi nhận.',
        '**Sửa thường tốn kém,** vì phải thu thêm dữ liệu hoặc đổi quy trình.',
      ],
    },

    whenToUse: {
      use: [
        'Khi dữ liệu đến từ một quy trình có bước sàng lọc, như duyệt hồ sơ hoặc đơn hoàn thành.',
        'Khi dùng dữ liệu của một thị trường hay một giai đoạn cho nơi khác, giai đoạn khác.',
      ],
      avoid: [
        'Không dùng số lượng lớn làm bằng chứng cho tính đại diện.',
        'Không so sánh train với test để kết luận đại diện: hai tập này thường lệch cùng cách. Hãy so với dữ liệu triển khai.',
      ],
    },

    comparison: {
      intro: 'Tính đại diện khác với các vấn đề thường bị nhầm lẫn với nó:',
      headers: ['Vấn đề', 'Câu hỏi', 'Dấu hiệu', 'Thêm dữ liệu cùng nguồn có giúp không?'],
      rows: [
        ['Selection Bias', 'Ai bị bỏ ngoài dữ liệu?', 'Phân phối khác với tổng thể mục tiêu', 'Không'],
        ['[[eda-imbalanced|Imbalanced Data]]', 'Nhóm nào hiếm?', 'Tỷ lệ lớp lệch, có thể đúng với thực tế', 'Có, thêm được ca hiếm'],
        ['[[dq-drift|Data Drift]]', 'Dữ liệu có đổi theo thời gian không?', 'Phân phối mới khác phân phối cũ', 'Chỉ khi thêm dữ liệu mới'],
        ['Sai số ngẫu nhiên', 'Mẫu có đủ lớn không?', 'Khoảng tin cậy rộng', 'Có'],
      ],
    },

    misconceptions: [
      {
        myth: 'Mẫu rất lớn thì tự động đại diện.',
        truth: 'Cỡ mẫu chỉ giảm sai số ngẫu nhiên. 2,3 triệu phiếu của Literary Digest vẫn thua một mẫu nhỏ hơn nhiều nhưng ít lệch hơn.',
      },
      {
        myth: 'Mất cân bằng lớp là một dạng Selection Bias.',
        truth: 'Không nhất thiết. Gian lận hiếm ngoài đời thì tỷ lệ 0,1% vẫn là đại diện. Lệch chọn mẫu là khi tỷ lệ trong dữ liệu khác với tỷ lệ thực tế.',
      },
      {
        myth: 'Tính đại diện chỉ quan trọng với khảo sát.',
        truth: 'Mọi dữ liệu đều có quy trình tạo ra. Log chỉ có người đã đăng nhập, ảnh chỉ chụp bằng một loại máy.',
      },
    ],
  },
})
