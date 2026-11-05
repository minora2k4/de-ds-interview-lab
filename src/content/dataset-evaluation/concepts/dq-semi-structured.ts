import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-semi-structured',
  summary:
    'Với JSON và các dữ liệu bán cấu trúc, cần đánh giá schema thay đổi giữa các bản ghi, kiểu không nhất quán và null trong cấu trúc lồng nhau. Phân biệt null, thiếu khóa và mảng rỗng, vì chúng mang ý nghĩa khác nhau.',
  tags: ['JSON', 'Schema', 'Bán cấu trúc'],
  related: ['dq-event-log', 'dq-profiling', 'dw-schema-evolution', 'etl-validation', 'db-relational-nosql'],
  sections: {
    definition: `**Semi-structured Data (Dữ liệu bán cấu trúc)** như JSON có cấu trúc nằm trong từng bản ghi, nên mỗi bản ghi có thể có một cấu trúc khác. Việc đánh giá phải làm **theo đường dẫn trường**, như \`user.address.city\`, thay vì theo cột cố định.`,

    origin: `JSON giúp bên gửi thay đổi dữ liệu mà không cần hỏi ai, không cần ALTER TABLE như cơ sở dữ liệu quan hệ. Cái giá là trách nhiệm chuyển sang bên đọc (schema-on-read): lỗi không bị chặn lúc ghi, mà chỉ lộ ra khi xử lý về sau.`,

    whyUse: `Công cụ thường tự suy luận schema, nên trường hiếm có thể bị bỏ sót và kiểu dữ liệu mâu thuẫn có thể bị nới lỏng thành chuỗi mà không báo. Kết quả là mất dữ liệu mà không có lỗi nào xuất hiện.`,

    mechanism: `- **Schema thay đổi giữa các bản ghi:** với mỗi đường dẫn, tính tỷ lệ bản ghi có trường đó, theo ngày và theo phiên bản nguồn. Trường tụt từ 99% xuống 60% là dấu hiệu nguồn đã thay đổi. Kỹ thuật này tương tự profiling, xem [[dq-profiling]].
- **Kiểu không nhất quán:** cùng một trường có thể là số trong bản ghi này, chuỗi trong bản ghi khác. Lập bảng tỷ lệ theo kiểu. Ép kiểu về sau có thể biến giá trị lỗi thành null.
- **Null trong cấu trúc lồng nhau:** phân biệt **giá trị null**, **thiếu khóa**, **mảng rỗng** và **đối tượng rỗng**. Ví dụ \`discount: null\` có thể là chưa biết, thiếu khóa có thể là phiên bản cũ, còn \`items: []\` là đơn không có hàng. Phải đo tỷ lệ riêng.
- **Mảng:** kiểm tra độ dài, vì khi bung mảng thì số dòng sẽ nhân lên.
- **Bản ghi hỏng:** đo số bản ghi không phân tích được, thay vì âm thầm bỏ qua.
- **Suy luận schema:** nếu chỉ suy luận trên mẫu, trường hiếm có thể bị mất. Với luồng quan trọng, nên dùng schema khai báo trước để lỗi xuất hiện sớm.`,

    example: `API trả về \`price\`, 98% là số. Một đối tác mới gửi chuỗi như \`"1,200"\`, chiếm 2%. Bộ suy luận nới cả cột thành chuỗi. Khi đội phân tích ép lại thành số, 2% đó thành null. Do các đơn này có giá trị lớn, doanh thu bị thiếu 11%, mà tỷ lệ null lại chỉ là 2%.`,

    prosCons: {
      pros: ['Bảng tỷ lệ theo đường dẫn tự động được và phát hiện thay đổi từ nguồn rất nhanh.', 'Không cần biết trước toàn bộ schema mới đánh giá được.'],
      cons: ['Số đường dẫn có thể rất lớn, nhất là khi khóa là giá trị động.', 'Cần quy ước rõ ràng về ý nghĩa của null và thiếu khóa, mà nguồn thường không ghi lại.'],
    },

    whenToUse: {
      use: ['Khi nhận dữ liệu từ API, log hoặc tài liệu NoSQL.', 'Khi nhiều phiên bản của bên gửi cùng tồn tại.'],
      avoid: ['Không xem mọi dạng thiếu là một.', 'Không dựa vào suy luận schema tự động cho luồng quan trọng.'],
    },

    comparison: {
      headers: ['Dạng', 'Thường có nghĩa', 'Khi xử lý'],
      rows: [
        ['`"a": null`', 'Có trường nhưng chưa có giá trị', 'Giữ, đếm riêng'],
        ['Thiếu khóa', 'Phiên bản cũ hoặc không áp dụng', 'Xem theo phiên bản nguồn'],
        ['`"a": []`', 'Tập rỗng thực sự', 'Bung mảng có thể làm mất dòng'],
      ],
    },

    misconceptions: [
      { myth: 'JSON không có schema.', truth: 'Luôn có schema ngầm trong code bên đọc. Không khai báo chỉ có nghĩa là không ai kiểm tra nó.' },
      { myth: 'Null và thiếu khóa là một.', truth: 'Nhiều công cụ gộp cả hai khi đọc, nên phải đo tại lớp thô nếu sự khác biệt có ý nghĩa nghiệp vụ.' },
    ],
  },
})
