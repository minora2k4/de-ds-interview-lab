import { defineConcept } from '../../define'

export default defineConcept({
  id: 'arch-lakehouse',
  summary:
    'Kiến trúc Lakehouse tổ chức cả nền tảng quanh một bản dữ liệu mở trên object storage: thu thập, các lớp Medallion, catalog chung và nhiều engine. Cơ chế định dạng bảng nằm ở trang Data Lakehouse.',
  tags: ['Kiến trúc', 'Lakehouse', 'Nền tảng dữ liệu'],
  related: ['dw-data-lakehouse', 'dw-medallion', 'dw-data-warehouse', 'dw-data-lake', 'etl-governance', 'cloud-s3', 'arch-kappa'],
  sections: {
    definition: `**Data Lakehouse Architecture (Kiến trúc Lakehouse)** là cách ghép các thành phần của nền tảng dữ liệu quanh **một lớp lưu trữ dùng chung**, thường là bảng Delta Lake, Iceberg hoặc Hudi trên object storage. Trang này nói về bức tranh tổng thể. Cơ chế ACID và định dạng bảng xem ở [[dw-data-lakehouse]].`,

    origin: `Kiến trúc hai tầng dùng [[dw-data-lake|lake]] để lưu và [[dw-data-warehouse|kho]] để phục vụ BI, nên phải duy trì pipeline chép dữ liệu, và số ở hai nơi có thể lệch nhau. Định dạng bảng mở cho phép bỏ bản sao đó.`,

    whyUse: `Ít bản sao thì ít pipeline đồng bộ và ít tranh cãi về số liệu. Lưu trữ và tính toán tách rời, nên mỗi nhóm dùng engine phù hợp.`,

    mechanism: `1. **Thu thập:** batch, [[etl-cdc|CDC]] và stream cùng ghi vào một nơi.
2. **Lưu theo [[dw-medallion|Medallion]]:** Bronze giữ dữ liệu thô để tính lại, Silver làm sạch, Gold phục vụ nghiệp vụ.
3. **Catalog và quản trị:** một nơi ghi danh bảng và phân quyền, nếu không mỗi engine sẽ tự quyết định và dễ sai quyền.
4. **Tầng phục vụ khi cần:** dashboard cần phản hồi dưới một giây vẫn có thể cần kho OLAP.
5. **Bảo trì định kỳ:** gộp tệp nhỏ và xóa phiên bản cũ, vì object storage không tự làm.`,

    diagram: {
      mermaid: `flowchart TD
  A["Batch, CDC, stream"] --> B["Bronze: dữ liệu thô"]
  B --> C["Silver: đã làm sạch"]
  C --> D["Gold: dữ liệu nghiệp vụ"]
  E["Catalog và phân quyền"] --> D
  D --> F["BI và SQL"]
  C --> G["Data Science và khám phá"]`,
      caption: 'Một bản dữ liệu mở, được nhiều engine dùng chung qua một catalog.',
    },

    example: `Một công ty bán lẻ có 60 pipeline chỉ để chép dữ liệu giữa lake 200 TB và kho 40 TB. Sau khi chuyển sang Iceberg, BI và Data Science đọc cùng bảng Gold, và các pipeline này được bỏ. Dashboard điều hành vẫn giữ một kho OLAP nhỏ vì cần phản hồi dưới một giây.`,

    prosCons: {
      pros: ['Một bản dữ liệu cho nhiều nhu cầu, giảm số liệu lệch nhau.'],
      cons: ['Phải tự lo tệp nhỏ, phiên bản cũ, phân quyền giữa nhiều engine.', 'Truy vấn đồng thời cao, độ trễ rất thấp vẫn có thể cần tầng riêng.'],
    },

    whenToUse: {
      use: ['Nhiều nhóm cần cùng dữ liệu với các engine khác nhau.', 'Dữ liệu lớn và đa dạng, chi phí kho thuần túy quá cao.'],
      avoid: ['Chỉ cần BI trên dữ liệu vừa phải: một kho được quản lý là đủ.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Lake và kho hai tầng', 'Lakehouse'],
      rows: [
        ['Số bản dữ liệu', 'Hai, cần pipeline chép', 'Một'],
        ['Hiệu năng BI', 'Kho đã tối ưu sẵn', 'Tùy engine và bảo trì'],
      ],
    },

    misconceptions: [
      {
        myth: 'Lakehouse chỉ là đổi Parquet sang Iceberg hoặc Delta.',
        truth: 'Định dạng bảng chỉ là một phần. Kiến trúc còn cần catalog, phân quyền, các lớp dữ liệu và người chịu trách nhiệm bảo trì.',
      },
    ],
  },
})
