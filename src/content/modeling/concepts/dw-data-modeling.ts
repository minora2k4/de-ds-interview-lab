import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-data-modeling',
  summary:
    'Data Modeling là việc quyết định dữ liệu được tổ chức thế nào cho đúng cách dùng. Hệ giao dịch ưu tiên ghi an toàn, kho phân tích ưu tiên đọc nhanh.',
  tags: ['Mô hình hóa', 'Nền tảng', 'Kimball'],
  related: ['dw-fact-table', 'dw-dimension-table', 'dw-star-schema', 'db-normalization', 'db-denormalization', 'db-oltp-olap'],
  sections: {
    definition: `**Data Modeling (Mô hình hóa dữ liệu)** là việc xác định thực thể, quan hệ và quy tắc của dữ liệu, rồi biến chúng thành bảng và cột cụ thể. Công việc này thường đi qua ba mức: **Conceptual (khái niệm)**, **Logical (logic)** và **Physical (vật lý)**.`,

    origin: `[[db-normalization|Chuẩn hóa]] ra đời để hệ giao dịch ghi an toàn, mỗi sự thật chỉ nằm ở một nơi. Khi dùng chính schema đó làm báo cáo, người phân tích phải Join hàng chục bảng và rất dễ sai. Mô hình chiều của Kimball khắc phục điểm này bằng cách tổ chức dữ liệu theo câu hỏi nghiệp vụ.`,

    whyUse: `Schema sai rất khó sửa, vì nó lan ra mọi pipeline và báo cáo phía sau. Mô hình tốt giúp các nhóm có cùng định nghĩa số liệu và truy vấn ngắn hơn.`,

    mechanism: `Ba mức tách nhau để mỗi quyết định được đưa ra đúng lúc:

1. **Conceptual:** nghiệp vụ có những gì, như khách hàng và đơn hàng. Mức này để thống nhất ngôn ngữ với người dùng.
2. **Logical:** thuộc tính, khóa và quan hệ, chưa phụ thuộc công nghệ.
3. **Physical:** kiểu dữ liệu, partition, sort key. Mức này gắn với nền tảng, vì chi phí phụ thuộc vào engine.

Với kho phân tích, Kimball dùng bốn bước: chọn quy trình nghiệp vụ, khai báo [[dw-fact-table|grain]], xác định chiều, xác định fact.`,

    example: `Một chuỗi bán lẻ báo cáo trên schema 3NF: doanh thu theo vùng cần Join 9 bảng, chạy 40 phút. Sau khi xây [[dw-star-schema]] với một fact và 4 chiều, câu hỏi đó còn 2 Join và chạy dưới 1 phút.`,

    prosCons: {
      pros: ['Tách câu hỏi nghiệp vụ khỏi chi tiết kỹ thuật, nên dễ trao đổi và dễ đổi nền tảng.', 'Thống nhất định nghĩa, giảm cảnh hai báo cáo ra hai con số.'],
      cons: ['Tốn thời gian làm rõ nghiệp vụ trước khi có kết quả đầu tiên.'],
    },

    whenToUse: {
      use: ['Dữ liệu được nhiều nhóm dùng chung và phải tin cậy lâu dài.'],
      avoid: ['Không chép nguyên schema giao dịch sang kho rồi coi là đã mô hình hóa.'],
    },

    comparison: {
      intro: 'Cùng là mô hình, nhưng tối ưu cho hai cách dùng khác nhau:',
      headers: ['Tiêu chí', 'Mô hình giao dịch (3NF)', 'Mô hình chiều'],
      rows: [
        ['Mục tiêu', 'Ghi đúng, tránh dị thường', 'Đọc nhanh, dễ hiểu'],
        ['Số Join cho một báo cáo', 'Nhiều', 'Ít'],
        ['Dư thừa', 'Rất ít', 'Chấp nhận có chủ đích'],
      ],
    },

    misconceptions: [
      {
        myth: 'Có kho cột mạnh thì không cần mô hình hóa.',
        truth: 'Engine mạnh giúp chạy nhanh, nhưng không tự sửa được định nghĩa sai hoặc grain lẫn lộn.',
      },
    ],
  },
})
