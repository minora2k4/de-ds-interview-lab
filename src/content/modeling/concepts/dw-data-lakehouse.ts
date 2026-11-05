import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-data-lakehouse',
  summary:
    'Lakehouse thêm một lớp metadata lên các tệp mở trên object storage, để có giao dịch ACID, kiểm soát schema và time travel. Delta Lake, Apache Iceberg và Apache Hudi là ba định dạng bảng phổ biến.',
  tags: ['Kiến trúc lưu trữ', 'ACID', 'Delta Lake', 'Iceberg', 'Hudi', 'First Principles'],
  related: ['dw-data-lake', 'dw-data-warehouse', 'dw-medallion', 'dw-schema-evolution', 'arch-lakehouse', 'db-acid', 'cloud-s3', 'spark-small-files'],
  sections: {
    definition: `**Data Lakehouse** là kiến trúc đưa các tính năng của [[dw-data-warehouse|kho]], như giao dịch [[db-acid|ACID]] và kiểm soát schema, lên trên [[dw-data-lake|Data Lake]]. Dữ liệu vẫn là tệp mở như Parquet trên object storage. Phần mới là **định dạng bảng (table format)**: lớp metadata xác định chính xác những tệp nào thuộc về bảng ở mỗi phiên bản.`,

    origin: `Nhiều công ty từng vận hành hai tầng: lake để lưu rẻ, kho để phục vụ BI. Cách này phải chép dữ liệu hai lần, kho bị trễ so với lake, và tốn thêm pipeline chỉ để đồng bộ. Lake một mình lại thiếu giao dịch, nên job lỗi để lại tệp dở dang và rất khó cập nhật hay xóa từng dòng.

Ba dự án ra đời để sửa điều đó: Hudi từ Uber, Iceberg từ Netflix, Delta Lake từ Databricks. Thuật ngữ Lakehouse được phổ biến qua bài báo của Armbrust và cộng sự tại hội nghị CIDR 2021.`,

    whyUse: `- **Một bản dữ liệu cho nhiều engine:** Spark, Trino, Flink cùng đọc, không phải chép sang hệ riêng.
- **Cập nhật và xóa từng dòng:** cần cho CDC và các yêu cầu xóa dữ liệu cá nhân.
- **Time travel:** đọc lại phiên bản cũ để kiểm tra, khôi phục hoặc tái hiện kết quả.`,

    mechanism: `**Vì sao ACID làm được trên object storage:** object storage chỉ bảo đảm ghi nguyên tử **một đối tượng**, không có giao dịch nhiều tệp, và S3 không có rename nguyên tử. Ý tưởng cốt lõi là **quy việc commit nhiều tệp về một thao tác nguyên tử duy nhất**:

1. Ghi các tệp dữ liệu mới. Lúc này chưa ai thấy chúng, vì chưa có metadata nào trỏ tới.
2. Ghi metadata mô tả phiên bản mới.
3. Công bố bằng **một** thao tác nguyên tử. Hai bên cùng commit thì chỉ một bên thắng, bên thua kiểm tra xung đột rồi thử lại.

Vì người đọc chỉ tin metadata, job lỗi ở giữa không để lộ gì. Đây là **optimistic concurrency**: không khóa trước, chỉ kiểm tra lúc commit. Người đọc luôn thấy một snapshot hoàn chỉnh.

**Delta Lake** công bố bằng tệp JSON tiếp theo trong \`_delta_log\`, ví dụ \`00000000000000000010.json\`. Tệp này là đơn vị nguyên tử, ai tạo được trước thì thắng. Checkpoint gom lại log để đọc nhanh hơn. Điều này đòi hỏi kho lưu trữ có cách ngăn hai bên cùng tạo một tệp. Tài liệu Delta nêu: trên S3, mặc định chỉ một driver được ghi, còn ghi từ nhiều cụm cần LogStore dùng DynamoDB.

**Apache Iceberg** tổ chức theo cây: con trỏ trong catalog, tệp metadata, manifest list, manifest, tệp dữ liệu. Commit là đổi con trỏ trong catalog bằng phép check-and-put. Iceberg chỉ cần kho có ghi mới, đọc và xóa, không cần liệt kê nhất quán hay rename. Iceberg còn có hidden partitioning, và đổi cách phân vùng mà không ghi lại dữ liệu cũ.

**Apache Hudi** xoay quanh timeline ghi lại mọi hành động trên bảng, và mạnh về upsert và đọc gia tăng. Hudi có các dịch vụ bảng như compaction và clustering.

**Copy-on-Write và Merge-on-Read:** COW ghi lại tệp bị ảnh hưởng, nên đọc nhanh, ghi chậm. MOR ghi riêng phần thay đổi, nên ghi nhanh, đọc phải gộp, và cần compaction định kỳ.`,

    diagram: {
      mermaid: `flowchart TD
  A["Job ghi các tệp Parquet mới"] --> B["Ghi metadata của phiên bản mới"]
  B --> C["Một thao tác nguyên tử để công bố"]
  C --> D["Thắng: phiên bản mới xuất hiện"]
  C --> E["Thua: kiểm tra xung đột rồi thử lại"]
  D --> F["Người đọc thấy snapshot hoàn chỉnh"]`,
      caption: 'Nhiều tệp được công bố bằng đúng một thao tác nguyên tử, nên không ai thấy trạng thái dở dang.',
    },

    example: `Job ghi 800 tệp vào một bảng 300 TB và lỗi ở tệp thứ 500. Trên lake thuần, người đọc thấy 500 tệp mới và số liệu sai. Trên Delta Lake hoặc Iceberg, commit chưa xảy ra nên người đọc vẫn thấy phiên bản cũ, và các tệp mồ côi được dọn sau.

Cùng bảng đó nhận CDC 2 triệu dòng mỗi giờ, rải trên 40% số tệp. Với COW, mỗi giờ phải ghi lại rất nhiều tệp. Chuyển sang MOR giúp ghi nhanh hơn hẳn, nhưng truy vấn chậm dần khi phần thay đổi tích lũy, nên phải chạy compaction hằng đêm.`,

    prosCons: {
      pros: [
        '**Tệp mở, tránh phụ thuộc:** nhiều engine dùng chung dữ liệu.',
        '**Đơn giản hóa kiến trúc:** bớt việc chép và đồng bộ giữa lake và kho.',
        '**Giữ chi phí lưu trữ của lake,** vẫn có giao dịch.',
      ],
      cons: [
        '**Phải bảo trì bảng:** gộp tệp nhỏ, dọn tệp cũ, nếu không hiệu năng giảm dần.',
        '**Giao dịch thường chỉ trong một bảng:** Delta Lake không hỗ trợ giao dịch nhiều bảng.',
        '**Ghi đồng thời vào cùng tệp dễ xung đột,** phải thiết kế phân vùng và cơ chế thử lại.',
      ],
    },

    whenToUse: {
      use: [
        'Dữ liệu lớn dùng chung cho BI, kỹ thuật dữ liệu và học máy.',
        'Cần upsert từ CDC trên object storage.',
      ],
      avoid: [
        'Nhóm nhỏ, dữ liệu vừa phải, chỉ cần BI: kho quản lý sẵn thường đơn giản hơn.',
        'Giao dịch độ trễ mili giây: dùng cơ sở dữ liệu giao dịch.',
      ],
    },

    comparison: {
      intro: 'Đối chiếu ba định dạng bảng theo tài liệu chính thức:',
      headers: ['Tiêu chí', 'Delta Lake', 'Apache Iceberg', 'Apache Hudi'],
      rows: [
        ['Cấu trúc metadata', 'Log JSON và checkpoint', 'Metadata, manifest list, manifest', 'Timeline các hành động'],
        ['Cách commit', 'Tạo tệp log tiếp theo', 'Đổi con trỏ trong catalog', 'Hoàn tất hành động trên timeline'],
        ['Đổi tên cột', 'Cần column mapping', 'Có sẵn nhờ ID cột', 'Cần bật schema on read'],
        ['Thế mạnh', 'Tích hợp sâu với Spark', 'Đa engine, tiến hóa phân vùng', 'Upsert và đọc gia tăng'],
      ],
    },

    misconceptions: [
      {
        myth: 'Lakehouse là một sản phẩm hoặc một cơ sở dữ liệu mới.',
        truth: 'Đây là kiến trúc gồm tệp mở, định dạng bảng, catalog và engine, có thể đến từ nhiều bên.',
      },
      {
        myth: 'Bản thân Parquet đã có ACID.',
        truth: 'Parquet chỉ là định dạng tệp. ACID đến từ lớp metadata và thao tác commit nguyên tử bên trên nó.',
      },
      {
        myth: 'Có Lakehouse thì không cần mô hình hóa.',
        truth: 'Định dạng bảng giải quyết độ tin cậy lưu trữ, không giải quyết định nghĩa hay grain. [[dw-star-schema]] vẫn cần ở lớp phục vụ.',
      },
    ],
  },
})
