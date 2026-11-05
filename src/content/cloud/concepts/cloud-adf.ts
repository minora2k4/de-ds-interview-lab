import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-adf',
  summary:
    'Azure Data Factory là dịch vụ điều phối và tích hợp dữ liệu trên Azure. Pipeline gom các Activity, Integration Runtime cung cấp nơi chạy, còn dữ liệu nằm ở kho bên ngoài.',
  tags: ['Azure', 'ETL', 'Orchestration'],
  related: ['etl-etl-elt', 'etl-orchestration', 'etl-incremental', 'etl-ingestion', 'cloud-glue'],
  sections: {
    definition: `**Azure Data Factory (ADF, Dịch vụ tích hợp dữ liệu trên Azure)** điều phối việc di chuyển và biến đổi dữ liệu, dùng được cho cả ETL và ELT. Bản thân ADF giữ metadata, còn dữ liệu nằm ở các kho bên ngoài.`,

    origin: `SSIS chạy trên máy chủ riêng và khó xử lý dữ liệu hỗn hợp giữa on-premises và cloud. ADF đưa việc này lên dạng dịch vụ, có hàng trăm connector, và vẫn chạy được gói SSIS cũ. Microsoft hiện giới thiệu Fabric Data Factory là thế hệ tiếp theo, nhưng các tài liệu đã đọc chưa nêu ngày ngừng ADF.`,

    whyUse: `Kết nối nhiều nguồn mà ít phải viết code, kể cả nguồn nằm sau tường lửa. Thích hợp khi hệ sinh thái chính là Azure.`,

    mechanism: `**Thành phần:**

- **Pipeline:** nhóm logic các Activity, là đơn vị để triển khai và lập lịch.
- **Activity:** một bước, gồm di chuyển, biến đổi hoặc điều khiển.
- **Linked Service:** giống chuỗi kết nối. **Dataset:** cấu trúc của dữ liệu cần dùng.
- **Trigger:** quyết định khi nào pipeline chạy.

**Integration Runtime (IR)** là nơi chạy, chia ba loại trong bảng so sánh. Self-hosted IR chỉ tạo kết nối đi ra, nên không phải mở cổng vào mạng nội bộ.

**Mapping Data Flow:** biến đổi kéo thả, chạy trên cụm Spark do ADF quản lý, và chỉ chạy trên Azure IR.

**Copy Activity:** tính bằng DIU trên Azure IR. Có thể đặt kho trung gian (staged copy) và bỏ qua dòng lỗi.

**Trigger:** Schedule chạy theo lịch và không chạy bù. **Tumbling Window** có các khung liên tiếp, có trạng thái, chạy bù được quá khứ và tự thử lại, hợp với nạp tăng dần.`,

    diagram: {
      mermaid: `flowchart TD
  A["Trigger"] --> B["Pipeline"]
  B --> C["Activity"]
  C --> D["Integration Runtime"]
  D --> E["Linked Service"]
  E --> F["Kho dữ liệu nguồn và đích"]`,
      caption: 'ADF chỉ điều phối. Việc chạy thuộc về Integration Runtime, còn dữ liệu nằm ở kho bên ngoài.',
    },

    example: `Cần nạp 200 bảng từ SQL Server sau tường lửa lên ADLS mỗi giờ. Nhóm cài Self-hosted IR trong mạng nội bộ, dùng Tumbling Window 1 giờ để có \`WindowStart\` và \`WindowEnd\`. Khi một đêm bị lỗi, các khung đó được chạy lại đúng khoảng thời gian, nên không thiếu cũng không trùng.`,

    prosCons: {
      pros: ['Nhiều connector, ít phải viết code.', 'Nối được on-premises mà không mở cổng vào.'],
      cons: ['Logic phức tạp khó kiểm thử và khó xem thay đổi.', 'Trả theo nhiều loại đơn vị, khó ước tính chi phí.'],
    },

    whenToUse: {
      use: ['Hệ sinh thái Azure, nguồn hỗn hợp, cần điều phối là chính.'],
      avoid: ['Biến đổi rất phức tạp: dùng ADF gọi Databricks thay vì nhồi vào pipeline.'],
    },

    comparison: {
      headers: ['Loại IR', 'Chạy được', 'Dùng khi'],
      rows: [
        ['Azure', 'Copy, Data Flow, điều phối', 'Nguồn và đích trên cloud'],
        ['Self-hosted', 'Copy, điều phối', 'Nguồn trong mạng riêng'],
        ['Azure-SSIS', 'Gói SSIS', 'Chuyển gói SSIS lên cloud'],
      ],
    },

    misconceptions: [
      {
        myth: 'ADF lưu dữ liệu đã nạp.',
        truth: 'ADF chỉ điều phối và giữ metadata. Dữ liệu nằm ở kho nguồn, đích và kho trung gian của bạn.',
      },
    ],
  },
})
