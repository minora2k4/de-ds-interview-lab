import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-redshift',
  summary:
    'Redshift là kho dữ liệu dạng cột, xử lý song song trên nhiều nút. RA3 và RG tách lưu trữ khỏi tính toán, còn Serverless tự cấp năng lực theo RPU.',
  tags: ['AWS', 'Data Warehouse', 'MPP'],
  related: ['dw-data-warehouse', 'cloud-bigquery', 'cloud-s3', 'cloud-scaling', 'db-oltp-olap', 'dw-star-schema'],
  sections: {
    definition: `**Amazon Redshift (Data Warehouse trên AWS)** là kho dữ liệu lưu theo cột và xử lý song song trên nhiều nút (MPP). **Leader Node** nhận và lập kế hoạch truy vấn, **Compute Node** chia thành các **slice** để thực thi song song.`,

    origin: `Kho dữ liệu truyền thống đắt và khó mở rộng. Redshift ra đời để đưa MPP lên cloud. Các dòng máy cũ gắn liền lưu trữ với tính toán, nên dữ liệu tăng là phải thêm nút. RA3 giải quyết điều này bằng Managed Storage.`,

    whyUse: `Truy vấn phân tích chỉ cần vài cột, nên định dạng cột và xử lý song song giúp quét hàng tỷ dòng nhanh. Nó cũng tích hợp chặt với [[cloud-s3|S3]] và Glue.`,

    mechanism: `**Phân phối dữ liệu:** quyết định dòng nằm ở slice nào.

- **KEY:** cùng giá trị về cùng slice, nên join theo key đó không phải truyền qua mạng.
- **ALL:** chép cả bảng lên mọi nút, hợp với bảng nhỏ ít đổi.
- **EVEN:** chia đều theo vòng. **AUTO** (mặc định) tự chọn.

**Sort Key:** dữ liệu sắp theo khóa, mỗi block 1 MB lưu min và max (zone map), nên truy vấn theo khoảng bỏ qua được nhiều block.

**Managed Storage (RA3, RG):** dữ liệu lâu dài nằm trên S3, SSD trên nút làm cache, và hệ thống tự chuyển theo độ nóng của block. RG dựa trên Graviton là dòng mới, DS2 đã ngừng, còn AWS khuyến nghị chuyển khỏi DC2.

**Serverless:** năng lực tính bằng RPU, mỗi RPU có 16 GB bộ nhớ. Base mặc định 128 RPU, từ 4 đến 512, một số Region tới 1.024.

**Concurrency Scaling:** tự thêm cụm phụ khi có nhiều truy vấn đồng thời.`,

    diagram: {
      mermaid: `flowchart TD
  A["Client"] --> B["Leader Node: lập kế hoạch"]
  B --> C["Compute Node: slice 1, 2"]
  B --> D["Compute Node: slice 3, 4"]
  C --> E["SSD cache"]
  D --> E
  E --> F["Managed Storage trên S3"]`,
      caption: 'Dữ liệu nóng nằm trên SSD, dữ liệu còn lại trên S3, nên có thể đổi số nút mà không chia lại toàn bộ.',
    },

    example: `Bảng \`sales\` 50 tỷ dòng thường join với \`customers\` theo \`customer_id\`. Đặt DISTKEY là \`customer_id\` cho cả hai bảng và SORTKEY là \`sale_date\`, truy vấn theo tháng từ 90 giây còn 12 giây, vì dòng khớp đã nằm cùng slice.`,

    prosCons: {
      pros: ['Nhanh với truy vấn phân tích trên mô hình sao.', 'RA3 co giãn tính toán và lưu trữ riêng.'],
      cons: ['Chọn sai DISTKEY gây lệch dữ liệu giữa các slice.', 'Không hợp với cập nhật lẻ tần suất cao.'],
    },

    whenToUse: {
      use: ['Provisioned: tải đều, cần kiểm soát. Serverless: tải thất thường, ngắt quãng.'],
      avoid: ['Không dùng như cơ sở dữ liệu giao dịch ([[db-oltp-olap|OLTP]]).'],
    },

    comparison: {
      headers: ['Tiêu chí', 'RA3 Provisioned', 'Serverless'],
      rows: [
        ['Năng lực', 'Chọn số nút', 'Base và Max RPU'],
        ['Khi rảnh', 'Vẫn chạy nếu chưa tạm dừng', 'Chỉ tính khi đang dùng'],
        ['Hợp với', 'Tải đều', 'Tải ngắt quãng'],
      ],
    },

    misconceptions: [
      {
        myth: 'Thêm nút là luôn nhanh hơn.',
        truth: 'Nếu dữ liệu lệch vào một slice, truy vấn vẫn chờ slice chậm nhất.',
      },
    ],
  },
})
