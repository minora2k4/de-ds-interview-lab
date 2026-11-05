import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-data-quality',
  summary:
    'Data Quality là mức độ dữ liệu phù hợp với mục đích sử dụng, đo qua các chiều như tính đầy đủ, chính xác, nhất quán, kịp thời, hợp lệ và duy nhất. Muốn cải thiện phải đo liên tục và sửa từ gốc, không chỉ lọc ở cuối pipeline.',
  tags: ['Data Quality', 'Chỉ số', 'First Principles'],
  related: ['etl-validation', 'etl-lineage', 'etl-governance', 'dq-dimensions', 'dq-metrics', 'dq-tools', 'arch-observability', 'arch-reliability'],
  sections: {
    definition: `**Data Quality (Chất lượng dữ liệu)** là mức độ dữ liệu **phù hợp với mục đích sử dụng**. Cùng một bảng có thể đủ tốt cho báo cáo xu hướng theo tháng, nhưng không đủ tốt cho đối soát tài chính.

Vì vậy chất lượng không phải một con số tuyệt đối, mà được xác định theo **yêu cầu của người dùng dữ liệu** và đo qua nhiều chiều.`,

    origin: `Khi dữ liệu đi qua nhiều lớp và đội ngũ, lỗi ở nguồn lan xuống nhiều dashboard mà không ai thấy. Cách làm cũ là sửa tay khi có người phàn nàn, lúc đó quyết định sai đã được đưa ra. Ngành dần xem dữ liệu như sản phẩm: có chỉ tiêu, được đo tự động và có người chịu trách nhiệm.`,

    whyUse: `Dữ liệu sai gây hại theo cách khó nhìn thấy, vì **không có lỗi nào được báo**:

- Quyết định kinh doanh dựa trên số sai.
- Mô hình học máy học từ dữ liệu lệch, xem [[dq-overview]].
- Mất niềm tin: khi người dùng đã thấy số sai vài lần, họ tự làm bảng tính riêng, và nền tảng dữ liệu mất giá trị.`,

    mechanism: `**Sáu chiều phổ biến,** chi tiết hơn ở [[dq-dimensions]]:

- **Completeness (Đầy đủ):** có thiếu dòng hoặc thiếu giá trị không.
- **Accuracy (Chính xác):** giá trị có đúng với thực tế không. Chiều này khó đo nhất, vì cần nguồn đối chiếu.
- **Consistency (Nhất quán):** các hệ thống có khớp nhau không.
- **Timeliness (Kịp thời):** dữ liệu có đến đúng lúc cần không.
- **Validity (Hợp lệ):** có đúng định dạng và quy tắc không.
- **Uniqueness (Duy nhất):** có bản trùng không.

**Quy trình vận hành:**

1. **Xác định yêu cầu:** hỏi người dùng cần gì và sai thì ảnh hưởng gì. Ưu tiên các bảng quan trọng.
2. **Chuyển thành số đo:** ví dụ tỷ lệ null dưới 0,1%, hoặc dữ liệu có trước 7 giờ. Đây là các SLI và SLO, xem [[dq-metrics]].
3. **Đo tự động:** [[etl-validation|kiểm tra theo quy tắc]] cho điều đã biết, ví dụ dbt tests hay kiểm tra độ mới bằng \`dbt source freshness\`. Phát hiện bất thường theo thống kê cho điều chưa lường trước, như số dòng tụt so với xu hướng.
4. **Phản ứng:** có người chịu trách nhiệm, có mức độ nghiêm trọng, dùng [[etl-lineage|lineage]] để biết bảng nào bị ảnh hưởng.
5. **Sửa từ gốc:** nếu lỗi sinh ở nguồn, chỉ lọc trong pipeline sẽ làm mỗi đội tự xử lý theo cách khác nhau. Cần trao đổi với đội nguồn, có thể bằng một cam kết rõ ràng về schema và ý nghĩa dữ liệu.`,

    example: `Một công ty thương mại điện tử có bảng \`fact_orders\` dùng cho báo cáo doanh thu. Đội dữ liệu đặt các chỉ tiêu: có trước 7 giờ sáng, lệch tổng tiền với hệ thống kế toán dưới 0,1%, không trùng \`order_id\`.

Sau 2 tháng, chỉ số cho thấy 6% đơn có \`shipping_fee\` null, tăng mạnh từ một ngày cụ thể. Lineage và lịch sử thay đổi chỉ về một phiên bản ứng dụng mới bị lỗi. Đội ứng dụng sửa từ gốc, đội dữ liệu backfill 12 ngày bị ảnh hưởng. Trước khi có đo lường, lỗi tương tự từng tồn tại 3 tháng mới có người phát hiện.`,

    prosCons: {
      pros: [
        '**Phát hiện sớm,** trước khi người dùng thấy và trước khi lỗi lan rộng.',
        '**Tạo niềm tin** nhờ có số đo và chỉ tiêu rõ ràng, thay vì cảm tính.',
      ],
      cons: [
        '**Tốn công thiết lập và duy trì,** nhất là khi có nhiều bảng.',
        '**Cảnh báo quá nhiều** làm mọi người bỏ qua.',
        '**Không bắt được mọi thứ:** chiều chính xác cần nguồn đối chiếu, mà không phải lúc nào cũng có.',
      ],
    },

    whenToUse: {
      use: [
        'Bắt đầu từ các bảng quan trọng nhất, dựa trên người dùng và ảnh hưởng của lỗi.',
        'Kết hợp kiểm tra theo quy tắc với phát hiện bất thường.',
        'Gán chủ sở hữu cho mỗi bộ dữ liệu quan trọng.',
      ],
      avoid: [
        'Không đặt cùng một mức nghiêm ngặt cho mọi bảng, vì tốn kém và ồn ào.',
        'Không cố đạt 100% mọi chiều, nên đặt mức theo nhu cầu thật.',
        'Không chỉ sửa ở lớp cuối khi lỗi đến từ nguồn.',
      ],
    },

    comparison: {
      intro: 'Ba khái niệm dễ dùng lẫn lộn:',
      headers: ['Tiêu chí', 'Data Quality', 'Data Validation', 'Data Observability'],
      rows: [
        ['Bản chất', 'Tính chất của dữ liệu theo mục đích', 'Cổng kiểm tra tại một điểm', 'Khả năng hiểu tình trạng hệ thống dữ liệu'],
        ['Câu hỏi', 'Dữ liệu có đủ tốt để dùng?', 'Dữ liệu này có được đi tiếp?', 'Cái gì đang sai, ở đâu, từ khi nào?'],
        ['Công cụ', 'Chỉ tiêu, báo cáo chất lượng', 'dbt tests, Great Expectations', 'Theo dõi độ mới, thể tích, schema, lineage'],
      ],
    },

    misconceptions: [
      {
        myth: 'Chất lượng dữ liệu là việc riêng của đội dữ liệu.',
        truth: 'Nhiều lỗi sinh ở nguồn, nơi đội dữ liệu không kiểm soát. Cần có chủ sở hữu ở cả nguồn lẫn người dùng, đội dữ liệu không thể sửa hết ở phía sau.',
      },
      {
        myth: 'Tất cả test đều đạt nghĩa là chất lượng tốt.',
        truth: 'Test chỉ phủ các quy tắc đã viết. Giá trị có thể hợp lệ nhưng sai với thực tế, như đơn vị bị đổi mà số vẫn dương.',
      },
      {
        myth: 'Chất lượng dữ liệu là một con số tuyệt đối, càng cao càng tốt.',
        truth: 'Mức cần đạt phụ thuộc mục đích. Theo đuổi độ chính xác cao hơn nhu cầu chỉ làm tăng chi phí và độ trễ.',
      },
    ],
  },
})
