import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-lineage',
  summary:
    'Data Lineage ghi lại dữ liệu đến từ đâu, qua phép biến đổi nào và đi đến đâu, để đánh giá ảnh hưởng trước khi đổi và tìm nguyên nhân khi có lỗi. OpenLineage là tiêu chuẩn mở để thu thập thông tin này.',
  tags: ['Lineage', 'OpenLineage'],
  related: ['etl-data-quality', 'etl-governance', 'etl-orchestration', 'arch-observability', 'dw-schema-evolution'],
  sections: {
    definition: `**Data Lineage (Dòng dõi dữ liệu)** là bản đồ dòng chảy của dữ liệu: nguồn gốc, phép biến đổi và nơi sử dụng. Có hai mức chi tiết: **theo bảng** và **theo cột**.`,

    origin: `Khi có hàng nghìn bảng, đổi một cột có thể làm hỏng báo cáo ở đội khác, và số sai phải đọc code từng bước để truy ngược. Mỗi công cụ lại thu thập theo cách riêng. OpenLineage ra đời để có một định dạng chung.`,

    whyUse: `- **Phân tích ảnh hưởng:** biết bảng và báo cáo nào phía sau bị tác động.
- **Tìm nguyên nhân:** số sai thì truy ngược lên phía trên.
- **Tuân thủ:** chứng minh dữ liệu cá nhân đi những đâu.`,

    mechanism: `**Hai cách thu thập:** **tĩnh** là phân tích code như SQL hay \`ref\` của dbt, có sớm nhưng khó với code động. **Khi chạy** là job phát sự kiện lúc thực thi, phản ánh điều đã xảy ra nhưng không biết code chưa từng chạy.

**OpenLineage** có ba thực thể: **Job** (quy trình), **Run** (một lần chạy) và **Dataset** (dữ liệu đọc, ghi). **Facet** là siêu dữ liệu gắn thêm, ví dụ \`columnLineage\` cho lineage theo cột.

Mỗi run phát sự kiện với trạng thái \`START\`, \`RUNNING\`, \`COMPLETE\`, \`ABORT\`, \`FAIL\` hoặc \`OTHER\`, gửi đến backend mà **Marquez** là bản tham chiếu. Airflow có provider \`apache-airflow-providers-openlineage\`.`,

    example: `Đội dữ liệu muốn đổi \`amount\` từ đồng sang nghìn đồng trong \`stg_payments\`. Lineage theo cột cho thấy 14 bảng và 6 dashboard phụ thuộc. Đội báo trước cho 3 đội, thêm cột mới và giữ cột cũ 30 ngày.`,

    prosCons: {
      pros: ['Giảm rủi ro khi đổi schema, rút ngắn thời gian tìm lỗi.'],
      cons: ['Khó đầy đủ với script tự viết hoặc SQL động.'],
    },

    whenToUse: {
      use: ['Khi nhiều đội dùng chung dữ liệu.'],
      avoid: ['Không cần công cụ riêng với vài pipeline của một đội, đồ thị của dbt có thể đủ.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Lineage tĩnh', 'Lineage khi chạy'],
      rows: [
        ['Nguồn thông tin', 'Phân tích code', 'Sự kiện lúc thực thi'],
        ['Có thông tin khi', 'Trước khi chạy', 'Sau khi chạy'],
        ['Điểm yếu', 'Code động', 'Code chưa từng chạy'],
      ],
    },

    misconceptions: [
      {
        myth: 'OpenLineage là sản phẩm có giao diện để xem lineage.',
        truth: 'OpenLineage là đặc tả và thư viện thu thập. Lưu trữ và hiển thị là việc của backend như Marquez.',
      },
      {
        myth: 'Lineage theo bảng là đủ để phân tích ảnh hưởng.',
        truth: 'Nó báo cả những bảng chỉ dùng cột khác, nên phạm vi rộng hơn thực tế.',
      },
    ],
  },
})
