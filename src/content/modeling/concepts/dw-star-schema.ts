import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-star-schema',
  summary:
    'Star Schema đặt một Fact Table ở giữa, nối trực tiếp với các Dimension Table đã phi chuẩn hóa. Kho dạng cột làm chi phí dư thừa rất thấp, nên đây vẫn là lựa chọn mặc định cho phân tích.',
  tags: ['Mô hình chiều', 'Kimball', 'Phi chuẩn hóa', 'First Principles'],
  related: ['dw-fact-table', 'dw-dimension-table', 'dw-snowflake-schema', 'dw-data-warehouse', 'db-denormalization', 'db-oltp-olap', 'spark-broadcast-join'],
  sections: {
    definition: `**Star Schema (Lược đồ hình sao)** là mô hình gồm một [[dw-fact-table|Fact Table]] ở trung tâm và các [[dw-dimension-table|Dimension Table]] nối trực tiếp với nó. Mỗi chiều chỉ cách fact **đúng một lần Join**, vì các thuộc tính đã được [[db-denormalization|phi chuẩn hóa]] vào cùng một bảng.`,

    origin: `Schema 3NF của hệ giao dịch tối ưu cho việc ghi: mỗi sự thật nằm ở một nơi, nên cập nhật không gây dị thường. Khi đem schema đó làm phân tích, báo cáo phải Join rất nhiều bảng. Người viết truy vấn khó hiểu, bộ tối ưu khó chọn thứ tự Join và thời gian chạy tăng nhanh.

Ralph Kimball phổ biến mô hình chiều trong cuốn *The Data Warehouse Toolkit* (1996) để khắc phục điều đó. Star Schema chuyển độ phức tạp từ lúc đọc sang lúc nạp dữ liệu: pipeline làm nhiều hơn một lần, đổi lại mọi truy vấn sau đó đều đơn giản.`,

    whyUse: `- **Dễ đọc:** người phân tích nhìn vào là thấy số đo và các góc cắt, không cần hiểu hệ nguồn.
- **Truy vấn có khuôn mẫu:** lọc ở chiều, Join vào fact, rồi tổng hợp. Engine và công cụ BI tối ưu rất tốt cho khuôn này.`,

    mechanism: `**Vì sao phi chuẩn hóa lại hợp lý trong kho phân tích:**

Chuẩn hóa tồn tại để tránh dị thường khi cập nhật. Điều kiện này ở kho phân tích đã khác:

1. **Ít cập nhật tùy ý:** dữ liệu do một pipeline nạp theo lô hoặc theo luồng, không phải hàng nghìn giao dịch đồng thời. Rủi ro dị thường được kiểm soát tại một chỗ.
2. **Đọc nhiều hơn ghi rất nhiều:** tiết kiệm được vài Join cho mỗi truy vấn đáng giá hơn tiết kiệm một lần cập nhật.
3. **Dư thừa rất rẻ trong kho cột:** giá trị lặp được nén bằng dictionary và run-length encoding, nên cột \`category\` lặp hàng triệu lần chỉ tốn rất ít. Kho cột cũng chỉ đọc đúng các cột truy vấn cần.
4. **Join tốn kém trong hệ phân tán:** Join bảng lớn có thể cần [[spark-shuffle|shuffle]] qua mạng, chi phí này lớn hơn nhiều so với phần đĩa tiết kiệm được.

**Truy vấn chạy thế nào:**

1. Lọc trên chiều, ví dụ \`quarter = 'Q1'\`, thu được một tập khóa nhỏ.
2. Dùng tập khóa này cắt bớt dữ liệu của fact trước khi Join, bằng partition pruning hoặc dynamic filtering.
3. Join với các chiều nhỏ, thường bằng [[spark-broadcast-join|Broadcast]] nên không phải shuffle bảng fact.
4. Tổng hợp theo các thuộc tính chiều.

**Đánh đổi:** đổi một thuộc tính dùng chung, như tên danh mục, phải sửa nhiều dòng trong chiều. Pipeline phải chịu trách nhiệm giữ nhất quán, vì không còn ràng buộc nào của schema làm hộ.`,

    diagram: {
      mermaid: `flowchart TD
  A["dim_date"] --> F["fact_order_line: một dòng cho mỗi dòng hàng"]
  B["dim_product"] --> F
  C["dim_customer"] --> F
  D["dim_store"] --> F
  F --> G["Lọc ở chiều, tổng hợp số đo ở fact"]`,
      caption: 'Mỗi chiều chỉ cách fact một lần Join, nên truy vấn nào cũng có cùng một khuôn.',
    },

    example: `Một sàn thương mại điện tử có \`fact_order_line\` 5 tỷ dòng, 20 cột, 2 TB dạng Parquet. Các chiều gồm \`dim_date\` 3.650 dòng, \`dim_store\` 500 dòng, \`dim_product\` 200.000 dòng.

Câu hỏi "doanh thu theo danh mục trong quý 1 năm nay" lọc \`dim_date\` trước, nên fact phân vùng theo ngày chỉ phải đọc khoảng 90 partition. Kho cột đọc 2 cột thay vì 20, nên lượng dữ liệu đọc giảm thêm nhiều lần. \`dim_product\` đủ nhỏ để Broadcast, nên không cần shuffle fact.

Cột \`category\` có 300 giá trị, lặp trên 200.000 dòng, được dictionary encoding đưa về mã số nhỏ nên chỉ tốn vài trăm KB. Tách ra bảng riêng sẽ thêm một Join cho mọi truy vấn theo danh mục.`,

    prosCons: {
      pros: [
        '**Một lần Join tới mỗi chiều** nên truy vấn ngắn, dễ viết đúng và dễ tối ưu.',
        '**Công cụ BI hiểu sẵn** mô hình fact và chiều, nên tạo được phép đo và bộ lọc nhất quán.',
      ],
      cons: [
        '**Pipeline phức tạp hơn:** phải tra Surrogate Key, xử lý [[dw-scd|SCD]] và dữ liệu đến trễ.',
        '**Không tự bảo vệ nhất quán:** kho phân tích thường không ép khóa ngoại, nên phải kiểm tra bằng [[etl-validation]].',
        '**Kém linh hoạt với quan hệ nhiều-nhiều:** cần bảng cầu nối, dễ gây tính trùng nếu dùng sai.',
      ],
    },

    whenToUse: {
      use: [
        'Lớp phục vụ BI, nơi nhiều người cùng truy vấn theo các chiều quen thuộc.',
        'Khi nhiều Fact Table cần so sánh qua Conformed Dimension.',
        'Lớp Gold trong [[dw-medallion]].',
      ],
      avoid: [
        'Hệ giao dịch ghi nhiều, cần ràng buộc chặt: dùng [[db-normalization|chuẩn hóa]].',
        'Một bảng phẳng cho một dashboard duy nhất, đơn giản và ít thay đổi: không cần thêm chiều.',
      ],
    },

    comparison: {
      intro: 'So sánh Star Schema với hai cách tổ chức thường được đem ra cân nhắc:',
      headers: ['Tiêu chí', 'Star Schema', 'Snowflake Schema', 'Một bảng phẳng'],
      rows: [
        ['Số lần Join', 'Một lần cho mỗi chiều', 'Nhiều lần cho mỗi chiều', 'Không có'],
        ['Dễ hiểu với người dùng', 'Cao', 'Thấp hơn', 'Cao, nhưng rất nhiều cột'],
        ['Đổi một thuộc tính chiều', 'Sửa bảng chiều', 'Sửa một bảng nhỏ', 'Ghi lại rất nhiều dòng fact'],
        ['Tái sử dụng giữa các fact', 'Tốt', 'Tốt', 'Kém, mỗi bảng tự chép lại'],
      ],
    },

    misconceptions: [
      {
        myth: 'Kho cột hiện đại đã nhanh nên Star Schema không còn cần thiết.',
        truth: 'Kho cột làm giảm lợi ích về tốc độ, nhưng Star Schema còn đem lại định nghĩa chung, chiều dùng chung và lịch sử thay đổi. Những thứ này engine không tự làm được.',
      },
      {
        myth: 'Star Schema tốn nhiều dung lượng vì dữ liệu bị lặp.',
        truth: 'Phần lặp nằm ở bảng chiều, vốn nhỏ hơn fact nhiều, và lại nén rất tốt. Phần lớn dung lượng nằm ở fact, nơi cả Star và Snowflake đều giống nhau.',
      },
      {
        myth: 'Phi chuẩn hóa nghĩa là gộp tất cả vào một bảng.',
        truth: 'Star Schema chỉ phi chuẩn hóa bên trong từng chiều, còn fact và chiều vẫn tách riêng. Nhờ vậy đổi một thuộc tính chiều không phải ghi lại hàng tỷ dòng fact.',
      },
    ],
  },
})
