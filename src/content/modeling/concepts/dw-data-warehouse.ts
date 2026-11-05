import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-data-warehouse',
  summary:
    'Data Warehouse tập trung dữ liệu đã tích hợp từ nhiều nguồn để phân tích, tách khỏi hệ giao dịch. Inmon xây kho chuẩn hóa toàn doanh nghiệp trước, Kimball xây các mô hình chiều nối với nhau bằng chiều dùng chung.',
  tags: ['Kiến trúc lưu trữ', 'Kimball', 'Inmon', 'Kho cột'],
  related: ['dw-data-mart', 'dw-star-schema', 'dw-data-lake', 'dw-data-lakehouse', 'db-oltp-olap', 'cloud-redshift', 'cloud-bigquery'],
  sections: {
    definition: `**Data Warehouse (Kho dữ liệu)** là hệ thống tập trung dữ liệu từ nhiều nguồn, được tích hợp và lưu lịch sử để phục vụ phân tích. Bill Inmon nêu bốn tính chất:

- **Subject-oriented (Theo chủ đề):** tổ chức theo khách hàng, doanh thu, không theo ứng dụng.
- **Integrated (Tích hợp):** mã, đơn vị và định nghĩa được thống nhất giữa các nguồn.
- **Time-variant (Có lịch sử):** dữ liệu gắn với thời gian, giữ được nhiều năm.
- **Non-volatile (Ổn định):** chủ yếu nạp thêm và đọc, không bị sửa liên tục như hệ giao dịch.`,

    origin: `Trước khi có kho, báo cáo chạy thẳng trên hệ giao dịch và gặp ba vấn đề: truy vấn quét lớn tranh tài nguyên với giao dịch, dữ liệu nằm rải rác với định nghĩa khác nhau, và hệ nguồn không giữ đủ lịch sử.

Khái niệm kho hình thành từ cuối thập niên 1980. Inmon phổ biến cách tiếp cận từ trên xuống với cuốn *Building the Data Warehouse*, còn Kimball đưa ra mô hình chiều với *The Data Warehouse Toolkit* năm 1996. Thế hệ sau khắc phục giới hạn của máy đơn: Redshift, BigQuery, Snowflake kết hợp lưu theo cột, xử lý song song, và nhiều hệ thống tách lưu trữ khỏi tính toán.`,

    whyUse: `- **Không ảnh hưởng hệ giao dịch:** báo cáo nặng chạy ở nơi khác, nên không làm chậm thanh toán.
- **Một phiên bản sự thật:** định nghĩa doanh thu nằm ở một chỗ, thay vì mỗi nhóm tự tính.
- **Trả lời câu hỏi lịch sử:** giữ được cả những gì hệ nguồn đã ghi đè hoặc đã xóa.`,

    mechanism: `**Vì sao kho cột quét nhanh:**

1. **Lưu theo cột:** câu hỏi chỉ cần 3 trong 100 cột thì chỉ đọc 3 cột.
2. **Nén tốt:** giá trị cùng kiểu đứng cạnh nhau, nên nén hiệu quả hơn nhiều so với lưu theo hàng.
3. **Bỏ qua dữ liệu:** thống kê min và max theo từng khối giúp không phải đọc các khối chắc chắn không khớp.
4. **Xử lý song song:** mỗi máy quét phần dữ liệu của mình rồi gộp kết quả.

**Tách lưu trữ khỏi tính toán** cho phép dữ liệu nằm trên object storage giá rẻ, còn cụm tính toán chỉ bật khi cần và co giãn theo tải.

**Hai trường phái thiết kế:**

**Inmon (từ trên xuống):** xây kho doanh nghiệp ở dạng chuẩn hóa trước, làm nguồn duy nhất, rồi dựng các [[dw-data-mart|Data Mart]] phụ thuộc cho từng phòng ban. Đầu tư ban đầu lớn, đổi lại tích hợp rất chặt.

**Kimball (từ dưới lên):** xây [[dw-star-schema]] theo từng quy trình nghiệp vụ, nối với nhau bằng [[dw-dimension-table|Conformed Dimension]] qua kiến trúc bus. Giao giá trị sớm, đổi lại phải giữ kỷ luật về chiều dùng chung.

Trong thực tế hai cách thường kết hợp: một lớp tích hợp sạch ở giữa, và lớp phục vụ dạng chiều ở trên. [[dw-medallion]] cũng theo tinh thần đó.`,

    diagram: {
      mermaid: `flowchart TD
  A["Hệ nguồn: bán hàng, CRM, kho vận"] --> B["Vùng tạm: dữ liệu gần như nguyên gốc"]
  B --> C["Lớp tích hợp: làm sạch, thống nhất mã"]
  C --> D["Lớp phục vụ: mô hình chiều, Data Mart"]
  D --> E["BI và phân tích"]`,
      caption: 'Dữ liệu đi qua các lớp, mỗi lớp giải quyết một vấn đề, trước khi đến tay người dùng.',
    },

    example: `Một chuỗi bán lẻ có 6 hệ thống nguồn. Báo cáo doanh thu chạy trực tiếp trên PostgreSQL, quét bảng 800 triệu dòng trong 40 phút, và làm thanh toán chậm mỗi sáng thứ Hai. Dùng read replica giúp hết ảnh hưởng tới thanh toán, nhưng báo cáo vẫn chậm vì dữ liệu lưu theo hàng, và vẫn thiếu dữ liệu của 5 hệ thống còn lại.

Sau khi đưa cả 6 nguồn vào kho cột và xây Star Schema, cùng báo cáo chỉ đọc 4 trong 60 cột và chạy trong 25 giây. Doanh thu lần đầu có một định nghĩa thống nhất.`,

    prosCons: {
      pros: [
        '**Truy vấn phân tích rất nhanh** trên dữ liệu đã mô hình hóa, kể cả nhiều người dùng đồng thời.',
        '**Chất lượng cao ở lớp phục vụ:** có schema, kiểm soát truy cập và định nghĩa rõ ràng.',
      ],
      cons: [
        '**Phải có schema trước khi nạp,** nên chậm với dữ liệu mới và không hợp dữ liệu phi cấu trúc.',
        '**Chi phí có thể tăng nhanh** nếu dùng cho dữ liệu thô rất lớn hoặc truy vấn không kiểm soát.',
        '**Định dạng riêng dễ gây phụ thuộc** nhà cung cấp, và engine khác khó đọc trực tiếp.',
      ],
    },

    whenToUse: {
      use: [
        'Báo cáo và dashboard nhiều người dùng, cần số liệu nhất quán.',
        'Dữ liệu có cấu trúc, đến từ nhiều hệ thống cần tích hợp.',
      ],
      avoid: [
        'Lưu ảnh, âm thanh hoặc log thô rất lớn: dùng [[dw-data-lake]].',
        'Phục vụ đọc ghi từng dòng với độ trễ mili giây: dùng cơ sở dữ liệu giao dịch.',
      ],
    },

    comparison: {
      intro: 'So sánh hai trường phái thiết kế kho:',
      headers: ['Tiêu chí', 'Inmon', 'Kimball'],
      rows: [
        ['Hướng xây dựng', 'Từ trên xuống', 'Từ dưới lên, theo quy trình'],
        ['Lớp trung tâm', 'Kho chuẩn hóa toàn doanh nghiệp', 'Các Star Schema nối bằng chiều dùng chung'],
        ['Data Mart', 'Phụ thuộc, dựng từ kho', 'Là phần trình bày của chính kho'],
        ['Thời gian có giá trị đầu tiên', 'Lâu hơn', 'Nhanh hơn'],
        ['Rủi ro chính', 'Dự án lớn, chậm đáp ứng', 'Chiều dùng chung bị lệch'],
        ['Phù hợp khi', 'Nhiều nguồn phức tạp, yêu cầu quản trị chặt', 'Cần kết quả nhanh theo từng quy trình'],
      ],
    },

    misconceptions: [
      {
        myth: 'Kimball không quan tâm đến tích hợp toàn doanh nghiệp.',
        truth: 'Kiến trúc bus và Conformed Dimension chính là cách Kimball tích hợp. Bỏ qua chúng mới tạo ra các silo.',
      },
      {
        myth: 'Read replica của hệ giao dịch đã đủ thay thế kho.',
        truth: 'Replica chỉ giải quyết việc tranh tài nguyên. Nó vẫn lưu theo hàng, chỉ có một nguồn và không giữ lịch sử đã ghi đè.',
      },
      {
        myth: 'Có Data Lake thì không cần Data Warehouse.',
        truth: 'Lake giải quyết việc lưu rẻ và linh hoạt, không tự tạo ra định nghĩa thống nhất hay tốc độ cho BI.',
      },
    ],
  },
})
