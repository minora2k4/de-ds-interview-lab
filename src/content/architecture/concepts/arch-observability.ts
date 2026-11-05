import { defineConcept } from '../../define'

export default defineConcept({
  id: 'arch-observability',
  summary:
    'Data Observability là khả năng biết dữ liệu có khỏe không và giải thích được vì sao, dựa trên năm trụ cột: freshness, volume, schema, distribution, lineage. Monitoring báo các vấn đề đã biết trước, còn Observability giúp điều tra cả những vấn đề chưa ai lường tới.',
  tags: ['Vận hành', 'Observability', 'Chất lượng dữ liệu', 'First Principles'],
  related: ['arch-monitoring-logging', 'arch-reliability', 'etl-data-quality', 'etl-lineage', 'etl-validation', 'dw-schema-evolution', 'arch-pipeline-design'],
  sections: {
    definition: `**Data Observability (Khả năng quan sát dữ liệu)** là khả năng hiểu được tình trạng của dữ liệu và pipeline từ các tín hiệu chúng tạo ra, để phát hiện sớm dữ liệu sai, tìm ra chỗ hỏng và biết những ai bị ảnh hưởng.

Năm trụ cột thường được nhắc đến là **freshness (độ tươi)**, **volume (khối lượng)**, **schema (cấu trúc)**, **distribution (phân phối giá trị)** và **lineage (dòng dữ liệu)**.`,

    origin: `Observability vốn là khái niệm trong vận hành phần mềm. Nhưng công cụ giám sát phần mềm chỉ thấy job chạy hay lỗi, mà không biết dữ liệu có đúng không.

Barr Moses, đồng sáng lập Monte Carlo, cho biết bà đưa ra thuật ngữ này năm 2019 để áp dụng tư duy đó vào dữ liệu. Vấn đề cần giải quyết là **data downtime**: khoảng thời gian dữ liệu sai hoặc thiếu. Kiểm tra viết tay không theo kịp vì không thể viết trước cho mọi kiểu lỗi trên hàng trăm bảng.

Năm trụ cột là khung do một nhà cung cấp phổ biến, không phải tiêu chuẩn. Bản hiện tại của Monte Carlo dùng tên **quality** cho trụ cột mà nhiều tài liệu gọi là distribution.`,

    whyUse: `- **Phát hiện trước người dùng:** biết bảng sai trước cuộc họp, chứ không phải sau khi giám đốc hỏi.
- **Giảm thời gian tìm nguyên nhân:** lineage chỉ ra ngay đoạn nào bị lỗi đầu tiên, thay vì dò từng bảng.`,

    mechanism: `**Năm trụ cột trả lời năm câu hỏi khác nhau:**

| Trụ cột | Câu hỏi | Ví dụ lỗi |
|---|---|---|
| Freshness | Dữ liệu được cập nhật lúc nào? | Bảng dừng cập nhật từ 2 giờ sáng |
| Volume | Số dòng có như thường lệ không? | Số dòng giảm 70% do mất một vùng |
| Schema | Cấu trúc có đổi không? | Cột bị đổi tên hoặc đổi kiểu |
| Distribution | Giá trị có bình thường không? | Tỷ lệ null từ 0,1% tăng lên 18% |
| Lineage | Dữ liệu từ đâu đến, đi tới đâu? | 14 dashboard phụ thuộc bảng lỗi |

**Cách một hệ thống hoạt động:**

1. **Thu thập tín hiệu:** đọc metadata, query log, thống kê của bảng. Dùng metadata vì quét toàn bộ dữ liệu quá tốn kém.
2. **Học đường cơ sở:** dựa trên lịch sử, gồm cả chu kỳ theo ngày và theo tuần, vì đặt ngưỡng cố định cho hàng trăm bảng là không khả thi.
3. **Phát hiện bất thường:** so với đường cơ sở, rồi gửi cảnh báo cho đúng người chịu trách nhiệm.
4. **Khoanh vùng bằng lineage:** đi ngược lên để tìm điểm hỏng đầu tiên, đi xuôi xuống để biết ai bị ảnh hưởng.

**Monitoring khác Observability ở đâu:** Monitoring kiểm tra các điều kiện đã định trước, nên phát hiện được **điều đã biết là có thể sai**. Observability cung cấp đủ tín hiệu để hỏi những câu chưa nghĩ tới, nên giúp điều tra **điều chưa ai lường trước**. Observability dùng lại dữ liệu của [[arch-monitoring-logging|Monitoring]], chứ không thay thế nó.`,

    diagram: {
      mermaid: `flowchart TD
  A["Metadata, query log, thống kê bảng"] --> B["Tín hiệu: freshness, volume, schema, distribution"]
  B --> C["So với đường cơ sở đã học"]
  C --> D["Phát hiện bất thường"]
  D --> E["Lineage: tìm điểm hỏng đầu tiên"]
  D --> F["Lineage: tìm người bị ảnh hưởng"]
  E --> G["Xử lý và cập nhật đường cơ sở"]
  F --> G`,
      caption:
        'Bốn trụ cột đầu cho biết có gì bất thường. Lineage trả lời lỗi bắt đầu từ đâu và ai bị ảnh hưởng.',
    },

    example: `Bảng \`fact_orders\` thường có 3,2 triệu dòng mỗi ngày. Hôm nay job vẫn xanh, số dòng là 3,1 triệu, và bảng cập nhật đúng giờ. Các kiểm tra trạng thái không báo gì.

Lúc 6 giờ 40, hệ thống báo tỷ lệ null của cột \`currency\` từ 0,1% tăng lên 18%. Lineage cho thấy lỗi đến từ một dịch vụ vừa đổi tên cột \`currency\` thành \`currency_code\` đêm qua. Đi xuôi xuống có 14 dashboard, trong đó có báo cáo tài chính lúc 8 giờ.

Đội dữ liệu chặn công bố partition hôm nay, sửa ánh xạ rồi chạy lại, trước khi có ai đọc phải số sai.`,

    prosCons: {
      pros: [
        '**Bắt được lỗi chưa từng viết luật,** như một cột đột nhiên toàn null.',
        '**Rút ngắn thời gian tìm nguyên nhân** nhờ lineage, nhất là khi có hàng chục bước trung gian.',
      ],
      cons: [
        '**Có cảnh báo giả:** các đợt khuyến mãi hay ngày lễ cũng trông như bất thường.',
        '**Không hiểu nghiệp vụ:** doanh thu tính sai công thức nhưng vẫn phân phối bình thường thì không bắt được.',
      ],
    },

    whenToUse: {
      use: [
        'Có nhiều bảng và nhiều người dùng, nên không thể viết tay kiểm tra cho tất cả.',
      ],
      avoid: [
        'Không mua công cụ khi chỉ có vài bảng: vài kiểm tra về độ tươi và số dòng là đủ.',
        'Không xem đây là thay thế cho [[etl-data-quality|kiểm tra chất lượng]] theo luật nghiệp vụ.',
      ],
    },

    comparison: {
      intro: 'Phân biệt ba khái niệm hay bị dùng lẫn:',
      headers: ['Tiêu chí', 'Monitoring', 'Data Quality Test', 'Data Observability'],
      rows: [
        ['Câu hỏi chính', 'Hệ thống có đang chạy không?', 'Dữ liệu có đúng luật không?', 'Có gì bất thường, ở đâu, vì sao?'],
        ['Loại vấn đề', 'Đã biết trước', 'Đã biết trước, viết thành luật', 'Cả những vấn đề chưa lường trước'],
        ['Cách phát hiện', 'Ngưỡng cố định', 'Luật tường minh', 'Đường cơ sở và lineage'],
        ['Điểm yếu', 'Job xanh nhưng dữ liệu sai', 'Chỉ bắt lỗi đã nghĩ tới', 'Cảnh báo giả, không hiểu nghiệp vụ'],
      ],
    },

    misconceptions: [
      {
        myth: 'Observability chỉ là tên mới của Monitoring.',
        truth: 'Monitoring báo khi điều kiện định trước bị vi phạm. Observability cho phép đặt câu hỏi mới và lần ra nguyên nhân, và nó cần Monitoring chứ không thay thế.',
      },
      {
        myth: 'Có Observability thì không cần kiểm thử dữ liệu.',
        truth: 'Phát hiện bất thường không biết luật nghiệp vụ. Doanh thu không được âm, hay tổng phải khớp với sổ cái, vẫn cần kiểm tra tường minh.',
      },
      {
        myth: 'Bất thường nghĩa là dữ liệu sai.',
        truth: 'Số dòng tăng gấp năm lần ngày Black Friday có thể hoàn toàn đúng. Cảnh báo là điểm bắt đầu điều tra, chưa phải kết luận.',
      },
    ],
  },
})
