import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-etl-elt',
  summary:
    'ETL biến đổi dữ liệu trước khi nạp vào đích, ELT nạp dữ liệu thô trước rồi biến đổi ngay trong đích. Khác biệt cốt lõi là biến đổi chạy ở đâu và có giữ lại dữ liệu thô hay không.',
  tags: ['ETL', 'ELT', 'Kiến trúc', 'First Principles'],
  related: ['etl-transformation', 'etl-ingestion', 'etl-batch', 'etl-governance', 'dw-data-warehouse', 'dw-medallion', 'dw-data-lakehouse', 'cloud-bigquery'],
  sections: {
    definition: `**ETL (Extract, Transform, Load: trích xuất, biến đổi, nạp)** lấy dữ liệu từ nguồn, biến đổi ở một hệ thống trung gian, rồi nạp kết quả đã xử lý vào đích.

**ELT (Extract, Load, Transform)** nạp dữ liệu gần như nguyên bản vào đích trước, rồi dùng chính sức mạnh tính toán của đích để biến đổi.

Hai mô hình có cùng ba bước. Điểm khác là **vị trí chạy phép biến đổi**, và kéo theo đó là việc **đích có giữ dữ liệu thô** hay không.`,

    origin: `ETL ra đời khi [[dw-data-warehouse|Data Warehouse]] còn chạy trên phần cứng đắt và khó mở rộng. Lưu trữ và tính toán gắn liền nhau, nên không ai muốn đưa dữ liệu thừa vào kho, và không thể để các phép biến đổi nặng tranh tài nguyên với truy vấn báo cáo. Vì vậy dữ liệu được làm sạch ở một máy chủ ETL riêng, chỉ phần đã xử lý mới được nạp.

Điểm yếu là dữ liệu thô bị bỏ lại. Khi logic thay đổi, muốn tính lại phải quay về nguồn, mà nguồn có thể đã xóa lịch sử.

Kho cloud như Snowflake, BigQuery tách lưu trữ khỏi tính toán, làm lưu trữ rẻ và tính toán co giãn. Đưa thô vào trước trở nên hợp lý, và các công cụ như dbt chỉ tập trung vào chữ T.`,

    whyUse: `Chọn đúng mô hình ảnh hưởng trực tiếp đến ba việc:

- **Khả năng tính lại:** ELT giữ dữ liệu thô, nên sửa logic chỉ cần chạy lại biến đổi, không cần trích xuất lại từ nguồn.
- **Tốc độ thay đổi:** nhà phân tích có thể sửa mô hình bằng SQL trong kho, không phải chờ đội làm hạ tầng.
- **Tuân thủ:** ETL cho phép che dữ liệu nhạy cảm trước khi nó chạm vào kho, điều ELT thuần túy không làm được.`,

    mechanism: `**Luồng ETL:**

1. Trích xuất từ nguồn vào vùng tạm.
2. Biến đổi trên một engine riêng, ví dụ [[spark-overview|Spark]] hoặc công cụ ETL.
3. Nạp kết quả vào đích theo schema đã định trước. Đây là **schema-on-write**: dữ liệu phải khớp schema trước khi vào.

**Luồng ELT:**

1. Trích xuất và nạp nguyên trạng vào vùng thô. Bước này đơn giản nên ít lỗi và nhanh.
2. Chạy biến đổi ngay trong kho, tạo các lớp sạch rồi lớp phục vụ, thường theo [[dw-medallion|Medallion]].
3. Đích tự tối ưu thực thi, vì biến đổi được đẩy xuống engine của nó.

**ETL vẫn cần** khi đích không tính toán được, biến đổi không viết được bằng SQL, hoặc dữ liệu nhạy cảm không được vào kho. Nhiều hệ thống trộn cả hai: che dữ liệu trước khi nạp, phần nặng làm sau trong kho.`,

    diagram: {
      mermaid: `flowchart TD
  A["Nguồn dữ liệu"] --> B["ETL: engine biến đổi riêng"]
  B --> C["Kho: chỉ có dữ liệu đã xử lý"]
  A --> D["ELT: nạp thô vào kho"]
  D --> E["Vùng thô, giữ để phát lại"]
  E --> F["Biến đổi bằng tính toán của kho"]
  F --> G["Lớp phục vụ báo cáo"]`,
      caption: 'Khác biệt nằm ở nơi biến đổi và việc còn giữ dữ liệu thô hay không.',
    },

    example: `Một chuỗi bán lẻ có 40 nguồn, tổng 500 GB mỗi ngày. Hệ cũ dùng ETL trên một máy chủ riêng, chạy 6 giờ mỗi đêm và không giữ dữ liệu thô.

Khi công thức doanh thu thuần đổi, đội dữ liệu cần tính lại 2 năm. Nguồn chỉ giữ 90 ngày, nên phần lịch sử không tính lại được.

Sau khi chuyển sang ELT, nạp thô chỉ mất 30 phút. Lần đổi công thức sau chỉ cần chạy lại các mô hình dẫn xuất trên 2 năm dữ liệu thô. Đổi lại, chi phí tính toán kho tăng khoảng 20%, và đội phải thêm bước che số điện thoại trước khi nạp.`,

    prosCons: {
      pros: [
        '**ETL kiểm soát dữ liệu trước khi vào kho,** nên giảm rủi ro lộ dữ liệu nhạy cảm và giữ kho gọn.',
        '**ELT giữ dữ liệu thô,** nên tính lại và sửa lỗi không phụ thuộc vào nguồn.',
        '**ELT nạp nhanh và ít lỗi,** vì bước nạp không phụ thuộc logic nghiệp vụ.',
      ],
      cons: [
        '**ETL mất dữ liệu thô** nếu không chủ động lưu, nên sửa logic thường phải trích xuất lại.',
        '**ELT dễ làm bùng chi phí kho** nếu ai cũng dựng mô hình mà không kiểm soát.',
        '**ELT đưa dữ liệu nhạy cảm vào kho,** nên phải quản lý quyền truy cập vùng thô chặt hơn.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng ELT khi đích là kho cloud hoặc lakehouse có tính toán co giãn, và logic thay đổi thường xuyên.',
        'Dùng ETL khi quy định bắt buộc che hoặc loại bỏ dữ liệu nhạy cảm trước khi nạp.',
      ],
      avoid: [
        'Không chọn ELT chỉ vì xu hướng khi đích là hệ thống [[db-oltp-olap|OLTP]], vì biến đổi nặng sẽ ảnh hưởng ứng dụng.',
        'Không dùng ETL mà bỏ dữ liệu thô khi nguồn không giữ lịch sử lâu dài.',
      ],
    },

    comparison: {
      intro: 'So sánh hai mô hình theo các tiêu chí quyết định:',
      headers: ['Tiêu chí', 'ETL', 'ELT'],
      rows: [
        ['Biến đổi chạy ở', 'Engine riêng, trước khi nạp', 'Trong đích, sau khi nạp'],
        ['Schema', 'Schema-on-write', 'Thô linh hoạt, schema áp dụng ở các lớp sau'],
        ['Dữ liệu thô', 'Thường không giữ', 'Giữ ở vùng thô'],
        ['Tính lại khi đổi logic', 'Thường phải trích xuất lại', 'Chạy lại biến đổi'],
        ['Dữ liệu nhạy cảm', 'Che được trước khi vào đích', 'Vào đích trước, cần thêm kiểm soát'],
      ],
    },

    misconceptions: [
      {
        myth: 'ELT là phiên bản mới nên luôn tốt hơn ETL.',
        truth: 'ELT tốt khi đích có tính toán co giãn. Với yêu cầu che dữ liệu trước khi nạp, hoặc biến đổi không viết được bằng SQL, ETL vẫn là lựa chọn đúng.',
      },
      {
        myth: 'Dùng Spark nghĩa là đang làm ETL.',
        truth: 'Công cụ không quyết định mô hình. Spark đọc từ vùng thô đã nạp trong lakehouse rồi ghi lại vào đó thì vẫn là ELT. Điểm cần xét là thứ tự và nơi lưu kết quả.',
      },
      {
        myth: 'dbt là công cụ ELT đầy đủ.',
        truth: 'dbt chỉ đảm nhận chữ T, chạy biến đổi trong kho. Việc trích xuất và nạp do các công cụ khác làm.',
      },
    ],
  },
})
