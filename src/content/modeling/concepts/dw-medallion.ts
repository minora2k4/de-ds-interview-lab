import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-medallion',
  summary:
    'Medallion Architecture tổ chức dữ liệu thành ba tầng: Bronze giữ dữ liệu thô, Silver làm sạch và thống nhất, Gold phục vụ nghiệp vụ. Nhờ giữ Bronze, có thể xử lý lại khi logic thay đổi.',
  tags: ['Kiến trúc lưu trữ', 'Lakehouse', 'Bronze Silver Gold', 'First Principles'],
  related: ['dw-data-lakehouse', 'dw-data-lake', 'dw-star-schema', 'dw-schema-evolution', 'etl-incremental', 'etl-idempotency', 'etl-cdc', 'etl-data-quality'],
  sections: {
    definition: `**Medallion Architecture (Kiến trúc Bronze, Silver, Gold)** là mẫu tổ chức dữ liệu trong [[dw-data-lakehouse|Lakehouse]] thành các tầng có chất lượng tăng dần. Mẫu này còn được gọi là **multi-hop architecture**. Mỗi tầng trả lời một câu hỏi: dữ liệu đã đến chưa, dữ liệu có đáng tin không, và dữ liệu có sẵn sàng cho nghiệp vụ không.`,

    origin: `[[dw-data-lake|Data Lake]] kiểu cũ đổ mọi thứ vào một chỗ, nên người đọc không biết tệp nào đáng tin, và lake dễ thành Data Swamp. Pipeline kiểu một bước, biến đổi thẳng từ nguồn sang báo cáo, lại không để lại gì để sửa khi logic sai.

Databricks phổ biến tên gọi này, nhưng ý tưởng không mới: kho truyền thống đã có vùng tạm, lớp tích hợp và lớp trình bày. Medallion là cách gọi rõ ràng cho cùng tư duy đó trên nền lakehouse.`,

    whyUse: `- **Xử lý lại được:** Bronze giữ dữ liệu gốc, nên sửa logic rồi chạy lại mà không cần lấy lại từ nguồn.
- **Khoanh vùng lỗi:** lỗi ở Silver không làm mất dữ liệu đã nhận, và không lan ra Gold nếu kiểm tra chặn lại.
- **Phân quyền và người dùng rõ ràng:** mỗi tầng phục vụ một nhóm, nên dễ kiểm soát dữ liệu nhạy cảm.`,

    mechanism: `**Bronze: giữ nguyên để có đường lui**

Lưu dữ liệu gần như nguyên gốc, chủ yếu chỉ thêm, kèm thời điểm nạp và nguồn. Không làm sạch ở đây, vì mọi phép làm sạch đều có thể sai. Tầng này cho phép schema lỏng hơn để không mất dữ liệu khi nguồn đổi cấu trúc. Người dùng chính là kỹ sư dữ liệu và đội kiểm toán.

**Silver: một phiên bản đáng tin**

Khử trùng lặp, ép kiểu, chuẩn hóa mã, loại bản ghi lỗi hoặc đưa vào vùng cách ly, áp dụng thay đổi từ [[etl-cdc|CDC]]. Dữ liệu vẫn ở mức chi tiết và theo thực thể, chưa gắn với báo cáo nào. Khử trùng lặp phải dựa trên khóa và thứ tự sự kiện, để [[etl-idempotency|chạy lại vẫn ra cùng kết quả]].

**Gold: sẵn sàng cho nghiệp vụ**

Mô hình chiều như [[dw-star-schema]] và các bảng tổng hợp theo chủ đề. Định nghĩa như doanh thu thuần nằm ở đây. Theo tài liệu Databricks, tầng này dành cho mô hình chiều và tổng hợp.

**Vì sao dữ liệu đi tăng dần:** mỗi tầng dùng [[etl-incremental|nạp tăng dần]] từ tầng trước, nên chỉ xử lý phần mới. Khi cần sửa, có thể chạy lại từ đúng tầng bị sai, không phải từ đầu.

**Đây là mẫu, không phải luật:** tài liệu Databricks nêu đây là khuyến nghị, không phải yêu cầu. Có thể thêm tầng trung gian, hoặc gộp bớt khi dữ liệu đơn giản. Điều cần giữ là ý nghĩa của từng tầng.`,

    diagram: {
      mermaid: `flowchart TD
  A["Nguồn: CDC, sự kiện, tệp"] --> B["Bronze: dữ liệu gốc, chỉ thêm"]
  B --> C["Silver: làm sạch, khử trùng, thống nhất"]
  C --> D["Gold: Star Schema, bảng tổng hợp"]
  D --> E["BI, báo cáo"]
  C --> F["Khoa học dữ liệu, phân tích chi tiết"]
  B -->|"Xử lý lại khi logic thay đổi"| C`,
      caption: 'Chất lượng tăng dần theo tầng. Mũi tên từ Bronze sang Silver cũng là đường để chạy lại khi có lỗi.',
    },

    example: `Một sàn thương mại điện tử nạp 2 TB sự kiện mỗi ngày qua Kafka, và Kafka chỉ giữ 7 ngày. Sau 3 tháng, nhóm phát hiện logic khử trùng ở Silver loại nhầm các đơn thanh toán lại, làm doanh thu thấp hơn 1,5%.

Nhờ Bronze giữ đủ 90 ngày dữ liệu gốc, nhóm sửa logic, chạy lại Silver và Gold của khoảng thời gian đó trong 6 giờ. Nếu chỉ lưu Silver, dữ liệu đã bị loại sẽ mất hẳn, vì nguồn không còn giữ nữa.

Chi phí là lượng lưu trữ tăng, nên nhóm chuyển Bronze cũ hơn 30 ngày sang lớp lưu trữ rẻ và xóa sau thời hạn đã thống nhất.`,

    prosCons: {
      pros: [
        '**Sửa lỗi lịch sử được** mà không phụ thuộc vào thời hạn lưu của nguồn.',
        '**Ai cũng hiểu tầng nào đáng tin,** nên giảm nguy cơ báo cáo chạy trên dữ liệu thô.',
        '**Dễ tích hợp kiểm tra chất lượng** tại ranh giới giữa các tầng.',
      ],
      cons: [
        '**Tăng lưu trữ và số pipeline,** vì dữ liệu tồn tại ở nhiều tầng.',
        '**Dữ liệu tới Gold chậm hơn,** nên không hợp với yêu cầu độ trễ rất thấp nếu làm theo lô.',
        '**Xóa dữ liệu cá nhân phức tạp hơn,** vì phải xóa ở mọi tầng, kể cả Bronze.',
      ],
    },

    whenToUse: {
      use: [
        'Nền tảng dữ liệu có nhiều nguồn và nhiều nhóm dùng chung.',
        'Nguồn không giữ dữ liệu lâu, nên cần bản gốc riêng để xử lý lại.',
        'Có yêu cầu kiểm toán, phải truy ngược được về dữ liệu gốc.',
      ],
      avoid: [
        'Không dựng đủ ba tầng cho một vài bảng đơn giản, ít thay đổi.',
        'Không cho dashboard đọc trực tiếp Bronze.',
        'Không để Silver thành bản chép của Bronze chỉ để cho đủ tầng.',
      ],
    },

    comparison: {
      intro: 'So sánh ba tầng:',
      headers: ['Tiêu chí', 'Bronze', 'Silver', 'Gold'],
      rows: [
        ['Việc chính', 'Nhận dữ liệu thô', 'Làm sạch và kiểm tra', 'Mô hình chiều và tổng hợp'],
        ['Mức chi tiết', 'Như nguồn', 'Chi tiết theo thực thể', 'Theo nhu cầu nghiệp vụ'],
        ['Kiểm soát schema', 'Lỏng', 'Chặt', 'Rất chặt, có cam kết'],
        ['Người dùng chính', 'Kỹ sư dữ liệu, kiểm toán', 'Kỹ sư, phân tích viên, nhà khoa học dữ liệu', 'Người dùng BI, lãnh đạo'],
        ['Khi có lỗi logic', 'Là nguồn để chạy lại', 'Chạy lại từ Bronze', 'Chạy lại từ Silver'],
      ],
    },

    misconceptions: [
      {
        myth: 'Medallion thay thế cho mô hình chiều.',
        truth: 'Hai khái niệm ở hai góc khác nhau. Medallion nói về các tầng chất lượng, còn mô hình chiều là cách tổ chức bên trong tầng Gold.',
      },
      {
        myth: 'Bắt buộc phải có đúng ba tầng và chép dữ liệu ba lần.',
        truth: 'Đây là khuyến nghị, không phải yêu cầu. Gold có thể là view, và số tầng nên theo nhu cầu thực tế.',
      },
      {
        myth: 'Bronze phải giữ dữ liệu vĩnh viễn.',
        truth: 'Thời hạn giữ là một quyết định về chi phí và pháp lý. Dữ liệu cá nhân ở Bronze vẫn phải tuân theo yêu cầu xóa.',
      },
    ],
  },
})
