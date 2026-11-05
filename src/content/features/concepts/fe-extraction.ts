import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-extraction',
  summary:
    'Feature Extraction tạo ra đặc trưng số mới từ dữ liệu thô hoặc từ các cột sẵn có, như TF-IDF hay PCA. Khác với chọn đặc trưng, cách này tạo biểu diễn mới.',
  tags: ['Tạo đặc trưng', 'Văn bản', 'Giảm chiều'],
  related: ['fe-selection', 'fe-normalization', 'fe-standardization', 'eda-leakage'],
  sections: {
    definition: `**Feature Extraction (Trích xuất đặc trưng)** biến dữ liệu thô như văn bản, ảnh, nhật ký sự kiện thành các đặc trưng số mà mô hình dùng được. Theo nghĩa rộng, nó gồm cả việc tạo cột mới từ các cột sẵn có, như PCA.

Tài liệu scikit-learn phân biệt rõ: extraction biến đổi dữ liệu tùy ý thành số, còn [[fe-selection|selection]] là kỹ thuật áp dụng trên các đặc trưng đã có.`,

    origin: `Mô hình cần một vector có kích thước cố định, nhưng văn bản có độ dài khác nhau và nhật ký có số sự kiện khác nhau trên mỗi người dùng. Extraction đưa chúng về một dạng chung.`,

    whyUse: `Đặc trưng tốt thường đem lại nhiều giá trị hơn việc đổi mô hình. Ví dụ, tỷ lệ nợ trên thu nhập nói lên nhiều hơn từng cột riêng lẻ.`,

    mechanism: `**Các cách phổ biến:**

- **Văn bản:** đếm từ (bag-of-words), rồi TF-IDF để giảm trọng số của từ quá phổ biến. Hashing tiết kiệm bộ nhớ nhưng có thể va chạm.
- **Giảm chiều:** PCA tạo các thành phần là tổ hợp tuyến tính của các cột, theo hướng có phương sai lớn. Cần co giãn trước.
- **Theo nghiệp vụ:** tỷ lệ, số ngày kể từ lần mua cuối, tổng hợp theo cửa sổ thời gian.

**Rò rỉ theo thời điểm.** Đặc trưng tổng hợp chỉ được dùng dữ liệu **trước thời điểm dự đoán**. Phép biến đổi học từ dữ liệu, như PCA hay từ vựng TF-IDF, chỉ được \`fit\` trên train.`,

    example: `Dự đoán rời bỏ từ 80 triệu sự kiện. Đội tạo \`số phiên 30 ngày\`, và AUC đạt 0.97 vì cửa sổ lấy cả sự kiện sau ngày dự đoán. Sửa lỗi này xong, AUC còn 0.81.`,

    prosCons: {
      pros: ['Đưa dữ liệu phi cấu trúc vào mô hình.', 'Đưa kiến thức nghiệp vụ vào đặc trưng.'],
      cons: ['Dễ rò rỉ theo thời điểm.', 'PCA làm cột khó giải thích.'],
    },

    whenToUse: {
      use: ['Dữ liệu thô chưa có dạng bảng.', 'Có giả thuyết nghiệp vụ rõ ràng về tín hiệu.'],
      avoid: ['Dùng PCA khi cần giải thích từng biến gốc.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Feature Extraction', 'Feature Selection'],
      rows: [
        ['Kết quả', 'Đặc trưng mới', 'Tập con của cột cũ'],
        ['Giải thích', 'Tùy cách làm', 'Giữ nguyên ý nghĩa cột'],
      ],
    },

    misconceptions: [
      {
        myth: 'PCA luôn giữ lại phần có ích nhất cho dự đoán.',
        truth: 'PCA không dùng nhãn và chỉ tìm phương sai lớn. Hướng có phương sai nhỏ vẫn có thể rất quan trọng với nhãn.',
      },
    ],
  },
})
