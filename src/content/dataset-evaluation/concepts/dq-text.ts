import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-text',
  summary:
    'Dữ liệu văn bản cần kiểm tra encoding, ngôn ngữ, trùng lặp, phân phối độ dài, nhiễu nhãn và PII. Văn bản trùng giữa train và test là lỗi đắt nhất vì làm điểm đánh giá cao giả tạo.',
  tags: ['Văn bản', 'PII', 'Trùng lặp'],
  related: ['dq-overview', 'dq-label-quality', 'dq-image-audio', 'eda-leakage', 'etl-governance'],
  sections: {
    definition: `**Text Data (Dữ liệu văn bản)** là dữ liệu dạng chuỗi tự do, không có schema bên trong. Vì không có cột để áp luật, việc đánh giá dựa vào **phân phối của cả bộ dữ liệu**: ngôn ngữ, độ dài, độ trùng và nội dung nhạy cảm.`,

    origin: `Các luật về kiểu và miền giá trị gần như vô dụng với văn bản: mọi chuỗi đều "hợp lệ". Khi văn bản được thu thập hàng loạt từ web, mạng xã hội và hệ thống hỗ trợ khách hàng, các lỗi kiểu mới xuất hiện như nội dung trùng, mã HTML sót lại và thông tin cá nhân trong câu chữ.`,

    whyUse: `Lỗi trong văn bản thường không làm gì hỏng mà chỉ âm thầm đổi kết quả. Trùng lặp thổi phồng điểm đánh giá, còn PII trong dữ liệu có thể khiến mô hình làm lộ thông tin và gây vi phạm pháp lý.`,

    mechanism: `- **Encoding:** chuỗi như \`Viá»‡t\` là **mojibake**, do đọc UTF-8 bằng bảng mã khác. Đo tỷ lệ ký tự lạ và ký tự thay thế.
- **Ngôn ngữ:** chạy nhận diện ngôn ngữ để biết tỷ lệ, vì mô hình tiếng Việt học trên dữ liệu lẫn 15% tiếng Anh sẽ kém hơn dự kiến.
- **Trùng lặp:** tìm cả trùng chính xác (bằng hash) và **gần trùng** (bằng MinHash, vì chỉ khác vài từ). Phải kiểm tra riêng **giữa train và test**.
- **Phân phối độ dài:** văn bản rỗng, quá ngắn, hoặc quá dài như dấu hiệu dính mã HTML. Độ dài khác nhau giữa các lớp là tín hiệu giả mà mô hình có thể học.
- **Nhiễu nhãn:** xem [[dq-label-quality]].
- **PII (Thông tin định danh cá nhân):** tên, số điện thoại, email nằm trong câu chữ. Kết hợp mẫu định dạng với nhận diện thực thể, và lấy mẫu để kiểm tra thủ công, vì cả hai đều có thể bỏ sót.`,

    example: `Bộ 2 triệu bình luận sản phẩm cho mô hình phân tích cảm xúc đạt F1 0,94. Kiểm tra cho thấy 18% là gần trùng, do tài khoản rác đăng lại, và nhiều cặp nằm ở cả train lẫn test. Sau khi chia lại theo cụm gần trùng, F1 thực tế chỉ còn 0,86. Kiểm tra cũng tìm thấy số điện thoại trong 3,2% bình luận, cần che trước khi dùng.`,

    prosCons: {
      pros: ['Phần lớn kiểm tra không cần nhãn, nên làm được rất sớm.', 'Phát hiện được các nguyên nhân khiến điểm đánh giá cao giả tạo.'],
      cons: ['Tìm PII và gần trùng không có độ chính xác tuyệt đối.', 'So từng cặp để tìm gần trùng rất tốn kém, cần thuật toán như MinHash.'],
    },

    whenToUse: {
      use: ['Trước khi chia train và test.', 'Khi dữ liệu thu thập từ web hoặc nhiều nguồn khác nhau.'],
      avoid: ['Không chỉ tìm trùng chính xác.', 'Không đưa văn bản thô lên dịch vụ ngoài trước khi kiểm tra PII.'],
    },

    comparison: {
      headers: ['Kiểm tra', 'Phát hiện gì', 'Cách làm'],
      rows: [
        ['Encoding', 'Mojibake, ký tự lỗi', 'Tỷ lệ ký tự lạ'],
        ['Trùng lặp', 'Rò rỉ giữa train và test', 'Hash, MinHash'],
        ['Độ dài', 'Rỗng, dính HTML, tín hiệu giả', 'Phân phối theo lớp'],
        ['PII', 'Rủi ro pháp lý', 'Mẫu định dạng, nhận diện thực thể'],
      ],
    },

    misconceptions: [
      { myth: 'Chia ngẫu nhiên thì train và test độc lập nhau.', truth: 'Khi có văn bản trùng hoặc gần trùng, chia ngẫu nhiên đưa cùng nội dung vào cả hai tập. Phải chia theo cụm.' },
      { myth: 'Đã xóa cột tên thì không còn PII.', truth: 'PII trong văn bản nằm ngay trong câu chữ, không nằm trong một cột riêng.' },
    ],
  },
})
