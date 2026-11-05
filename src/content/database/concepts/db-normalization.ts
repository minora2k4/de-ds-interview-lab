import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-normalization',
  summary:
    'Chuẩn hóa tổ chức lược đồ để mỗi sự thật chỉ lưu ở một nơi, qua đó loại bỏ dị thường khi thêm, sửa, xóa. Cái giá là truy vấn đọc phải Join nhiều bảng hơn.',
  tags: ['Thiết kế lược đồ', 'Chuẩn hóa', 'First Principles'],
  related: ['db-denormalization', 'db-oltp-olap', 'db-acid', 'db-query-optimization', 'dw-star-schema', 'dw-snowflake-schema'],
  sections: {
    definition: `**Database Normalization (Chuẩn hóa cơ sở dữ liệu)** là quá trình tổ chức lại lược đồ quan hệ dựa trên các **Functional Dependency (phụ thuộc hàm)**, để mỗi sự thật chỉ được lưu ở một nơi.

Phụ thuộc hàm \`A -> B\` nghĩa là biết A thì xác định được duy nhất B, ví dụ \`customer_id -> customer_name\`.`,

    origin: `Các hệ phân cấp và hệ mạng như IMS, CODASYL gắn dữ liệu với đường truy cập vật lý, nên đổi cấu trúc là phải sửa chương trình. Năm 1970, Edgar F. Codd đề xuất mô hình quan hệ để tách dữ liệu khỏi cách lưu trữ.

Tuy nhiên, bảng phẳng vẫn có thể lặp dữ liệu và tự mâu thuẫn. Các dạng chuẩn ra đời đầu thập niên 1970 để khắc phục điểm đó bằng quy tắc hình thức, thay vì cảm tính của người thiết kế.`,

    whyUse: `Chuẩn hóa loại bỏ ba loại **Anomaly (dị thường)**:

- **Dị thường cập nhật:** địa chỉ khách nằm trên 25 dòng đơn hàng, sửa sót một dòng là dữ liệu tự mâu thuẫn.
- **Dị thường thêm:** không thêm được khách mới nếu khách đó chưa có đơn hàng.
- **Dị thường xóa:** xóa đơn hàng cuối cùng làm mất luôn thông tin khách.`,

    mechanism: `Mỗi dạng chuẩn loại bỏ một kiểu phụ thuộc không mong muốn:

1. **1NF:** mỗi ô chứa một giá trị nguyên tử, không có nhóm lặp.
2. **2NF:** đạt 1NF, và mọi cột không khóa phụ thuộc vào **toàn bộ** khóa. Quy tắc này chỉ có tác dụng với khóa phức hợp. Với khóa \`(order_id, product_id)\`, cột \`product_name\` chỉ phụ thuộc \`product_id\` nên phải tách.
3. **3NF:** đạt 2NF, và không có **phụ thuộc bắc cầu**. Chuỗi \`order_id -> customer_id -> customer_city\` khiến thành phố lặp theo đơn hàng nên phải tách.
4. **BCNF:** vế trái của mọi phụ thuộc hàm đều là siêu khóa. Dạng này chặt hơn 3NF, xử lý trường hợp nhiều khóa ứng viên chồng lấn.

**Phép tách phải lossless (không mất thông tin):** Join lại ra đúng bảng gốc, không có dòng giả. BCNF đôi khi không giữ được mọi phụ thuộc hàm trong một bảng, nên nhiều hệ dừng ở 3NF.

**Vì sao chuẩn hóa làm chậm truy vấn phân tích:** truy vấn phân tích đọc hàng triệu dòng rồi gom nhóm. Trên lược đồ 3NF, một báo cáo có thể Join 5 đến 8 bảng. Mỗi Join phải ghép từng dòng qua hash hoặc index, tốn CPU, bộ nhớ và I/O. Số thứ tự Join tăng theo giai thừa của số bảng, nên [[db-query-optimization|optimizer]] khó chọn đúng hơn. Sai số ước lượng cũng nhân lên qua mỗi Join. Chuẩn hóa tối ưu cho việc ghi một dòng, không phải đọc nhiều dòng. Vì vậy, kho dữ liệu thường dùng [[dw-star-schema]].`,

    example: `Một cửa hàng lưu bảng \`orders\` phẳng gồm 5 triệu dòng, mỗi dòng lặp tên, địa chỉ khách, khoảng 300 byte. Có 200.000 khách, trung bình 25 đơn mỗi khách. Đổi địa chỉ phải sửa 25 dòng, và nếu ứng dụng lỗi giữa chừng thì khách có hai địa chỉ. Riêng phần lặp tốn 1,5 GB.

Sau khi tách thành \`customers\`, \`products\`, \`orders\`, \`order_items\`, đổi địa chỉ chỉ sửa 1 dòng, phần thông tin khách còn 60 MB. Đổi lại, báo cáo doanh thu theo tỉnh từ một bảng thành Join 4 bảng. Nhóm giữ nguyên lược đồ này cho nghiệp vụ, rồi đưa dữ liệu sang kho phân tích dưới dạng [[dw-star-schema]].

Lưu ý: \`order_items.unit_price\` vẫn được giữ, vì giá lúc mua là một sự thật khác với giá niêm yết hiện tại.`,

    prosCons: {
      pros: [
        '**Mỗi sự thật một nơi:** sửa một dòng là xong, các bản sao không thể mâu thuẫn vì không có bản sao.',
        '**Ghi nhỏ và ít khóa:** cập nhật chạm ít dòng, nên giao dịch đồng thời ít tranh chấp.',
        '**Cơ sở dữ liệu tự giữ toàn vẹn** qua khóa chính, khóa ngoại, thay vì dựa vào code ứng dụng.',
      ],
      cons: [
        '**Đọc tốn nhiều Join,** làm tăng CPU, bộ nhớ và rủi ro ước lượng sai.',
        '**Khó phân tán:** Join giữa các bảng trở nên đắt khi dữ liệu nằm trên nhiều [[db-sharding|shard]].',
      ],
    },

    whenToUse: {
      use: [
        'Hệ [[db-oltp-olap|OLTP]] có nhiều cập nhật đồng thời và cần toàn vẹn cao.',
        'Giai đoạn đầu, khi chưa rõ mẫu truy vấn: 3NF là điểm xuất phát an toàn.',
      ],
      avoid: [
        'Không ép 3NF cho kho phân tích, nơi đọc chiếm đa số và dữ liệu nạp theo lô.',
        'Không tách những giá trị phải giữ nguyên theo thời điểm, như giá lúc mua.',
      ],
    },

    comparison: {
      intro: 'Các dạng chuẩn thường gặp, mỗi dạng bao gồm yêu cầu của dạng trước:',
      headers: ['Dạng chuẩn', 'Yêu cầu', 'Loại bỏ', 'Ví dụ vi phạm'],
      rows: [
        ['1NF', 'Giá trị nguyên tử', 'Nhóm lặp trong một ô', 'Cột `phones` chứa `090,091`'],
        ['2NF', 'Phụ thuộc toàn bộ khóa', 'Phụ thuộc một phần khóa', '`product_name` trong `(order_id, product_id)`'],
        ['3NF', 'Không phụ thuộc bắc cầu', 'Cột phụ thuộc cột không khóa', '`dept_name` trong bảng nhân viên'],
        ['BCNF', 'Vế trái luôn là siêu khóa', 'Phụ thuộc từ cột không phải siêu khóa', '`teacher -> course` với khóa `(student, course)`'],
      ],
    },

    misconceptions: [
      {
        myth: 'Chuẩn hóa càng cao càng tốt.',
        truth: 'Phần lớn hệ dừng ở 3NF hoặc BCNF. Tách thêm làm tăng Join mà thường không còn loại bỏ được dị thường thực tế nào.',
      },
      {
        myth: 'Chuẩn hóa luôn làm hệ thống chậm.',
        truth: 'Nó làm chậm truy vấn đọc nhiều bảng, nhưng ghi thường nhanh hơn, và tra cứu một dòng qua index vẫn rất nhanh.',
      },
      {
        myth: 'Giá trị lặp lại trong một cột nghĩa là vi phạm dạng chuẩn.',
        truth: 'Nhiều khách cùng ở Hà Nội không vi phạm gì. Vi phạm được xác định bằng phụ thuộc hàm, không phải bằng việc giá trị trùng nhau.',
      },
    ],
  },
})
