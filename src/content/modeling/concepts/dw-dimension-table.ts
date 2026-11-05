import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-dimension-table',
  summary:
    'Dimension Table mô tả bối cảnh của sự kiện: ai, cái gì, ở đâu, khi nào. Bảng thường dùng Surrogate Key và được phi chuẩn hóa để lọc, nhóm dễ dàng.',
  tags: ['Mô hình chiều', 'Surrogate Key', 'Conformed Dimension'],
  related: ['dw-fact-table', 'dw-star-schema', 'dw-snowflake-schema', 'dw-scd', 'db-denormalization'],
  sections: {
    definition: `**Dimension Table (Bảng chiều)** chứa các thuộc tính mô tả bối cảnh của [[dw-fact-table|Fact Table]], như tên sản phẩm, danh mục, vùng. Thuộc tính chiều là thứ người dùng đưa vào \`WHERE\` và \`GROUP BY\`.`,

    origin: `Trên hệ nguồn, thông tin sản phẩm nằm ở nhiều bảng chuẩn hóa, mỗi hệ thống lại có mã riêng. Bảng chiều gom các mô tả này về một chỗ và dùng khóa độc lập với nguồn.`,

    whyUse: `Không có thuộc tính thì không thể cắt số liệu theo góc đó. Chiều dùng chung còn cho phép so sánh số liệu giữa các Fact Table.`,

    mechanism: `**Surrogate Key (Khóa thay thế)** là số nguyên do kho tự sinh, không mang nghĩa nghiệp vụ. Dùng nó vì ba lý do:

- [[dw-scd|SCD Type 2]] cần nhiều dòng cho cùng một khách hàng, nên mã gốc không còn là duy nhất.
- Gộp nhiều nguồn có thể trùng mã, hoặc nguồn đổi và tái sử dụng mã.
- Khóa số nhỏ giúp Join và nén tốt hơn chuỗi dài.

**Natural Key (Khóa tự nhiên)** vẫn được giữ để đối chiếu với nguồn và gom các phiên bản của một đối tượng.

**Conformed Dimension (Chiều dùng chung)** có cùng khóa, cùng ý nghĩa ở nhiều Fact Table. Nhờ vậy có thể so sánh doanh thu và lượt trả hàng theo cùng một danh mục.

**Date Dimension** lưu sẵn ngày lễ, kỳ tài chính, những thứ không suy ra được từ một mốc thời gian.`,

    example: `Ba hệ thống bán hàng cùng có mã khách 1001 nhưng là ba người khác nhau. Join theo mã gốc sẽ trộn số liệu. Bảng chiều sinh Surrogate Key riêng và lưu thêm hệ thống nguồn, nên 2,4 triệu khách được phân biệt đúng.`,

    prosCons: {
      pros: ['Phi chuẩn hóa nên người dùng chỉ cần Join một lần là có đủ thuộc tính.'],
      cons: ['Lặp giá trị nên đổi một thuộc tính có thể phải cập nhật nhiều dòng.', 'Phải tra cứu Surrogate Key khi nạp fact, làm pipeline phức tạp hơn.'],
    },

    whenToUse: {
      use: ['Dùng Surrogate Key khi có lịch sử thay đổi hoặc nhiều nguồn.'],
      avoid: ['Không tạo nhiều chiều khách hàng khác nhau cho từng phòng ban.'],
    },

    comparison: {
      intro: 'So sánh với Fact Table:',
      headers: ['Tiêu chí', 'Dimension Table', 'Fact Table'],
      rows: [
        ['Chứa gì', 'Thuộc tính mô tả', 'Khóa ngoại và số đo'],
        ['Số dòng', 'Thường ít', 'Thường rất nhiều'],
        ['Số cột', 'Thường nhiều', 'Thường ít hơn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Bảng chiều lúc nào cũng nhỏ nên luôn Broadcast được.',
        truth: 'Chiều khách hàng có SCD Type 2 có thể lên tới hàng trăm triệu dòng, khi đó [[spark-broadcast-join]] không còn phù hợp.',
      },
    ],
  },
})
