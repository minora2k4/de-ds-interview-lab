import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dw-data-lake',
  summary:
    'Data Lake lưu dữ liệu thô ở mọi định dạng trên kho giá rẻ, schema chỉ áp dụng khi đọc. Thiếu quản trị, lake dễ biến thành Data Swamp.',
  tags: ['Kiến trúc lưu trữ', 'Schema-on-read', 'Data Swamp'],
  related: ['dw-data-warehouse', 'dw-data-lakehouse', 'dw-medallion', 'cloud-s3', 'hadoop-hdfs', 'etl-governance'],
  sections: {
    definition: `**Data Lake (Hồ dữ liệu)** là nơi lưu dữ liệu ở dạng gốc, có cấu trúc lẫn phi cấu trúc, trên [[cloud-s3|object storage]] hoặc [[hadoop-hdfs|HDFS]]. Lake dùng **schema-on-read**: chỉ diễn giải cấu trúc lúc đọc. **Data Swamp (Đầm lầy dữ liệu)** là lake đã mất kiểm soát.`,

    origin: `[[dw-data-warehouse|Kho]] đòi hỏi schema trước khi nạp, tốn chi phí với dữ liệu lớn, và không hợp với log, ảnh, sự kiện thô. James Dixon đưa ra thuật ngữ này năm 2010 để mô tả cách giữ dữ liệu nguyên gốc, chưa cần biết trước sẽ dùng thế nào.`,

    whyUse: `Lake lưu rẻ và tách khỏi tính toán, nên nhiều engine cùng đọc được. Giữ dữ liệu gốc còn cho phép xử lý lại khi logic đổi.`,

    mechanism: `**Vì sao lake biến thành swamp:** ghi vào rất dễ vì không ai kiểm tra, nên chi phí nằm ở người đọc sau này.

- **Thiếu catalog:** không biết có dữ liệu gì, ý nghĩa ra sao.
- **Thiếu chủ sở hữu:** không ai chịu trách nhiệm về chất lượng hay việc xóa.
- **Thiếu kiểm tra:** schema đổi âm thầm, tệp lỗi nằm lẫn với tệp tốt.
- **Thiếu giao dịch:** object storage không có giao dịch nhiều tệp, nên job lỗi để lại dữ liệu dở dang.
- **Thiếu vòng đời:** không có quy tắc giữ và xóa, hàng triệu tệp nhỏ làm mọi truy vấn chậm.

Phòng tránh bằng catalog, chủ sở hữu rõ ràng, chia vùng theo mức độ tin cậy như [[dw-medallion]], kiểm tra chất lượng và định dạng bảng của [[dw-data-lakehouse]].`,

    example: `Sau 3 năm, một lake có 8 PB, nhưng 40% không rõ chủ sở hữu. Có 5 bản khác nhau của bảng khách hàng. Kiểm tra log truy cập thấy 60% dữ liệu không được đọc trong 12 tháng, nên nhóm chuyển phần này sang lớp lưu trữ lạnh và đưa phần còn lại vào catalog.`,

    prosCons: {
      pros: ['Chi phí lưu trữ thấp, chứa được mọi loại dữ liệu.'],
      cons: ['Tự thân không có giao dịch, cập nhật hay xóa từng dòng rất khó.'],
    },

    whenToUse: {
      use: ['Lưu dữ liệu thô để xử lý lại hoặc khám phá sau này.'],
      avoid: ['Không cho người dùng BI đọc trực tiếp vùng dữ liệu thô.'],
    },

    comparison: {
      intro: 'So sánh với Data Warehouse:',
      headers: ['Tiêu chí', 'Data Warehouse', 'Data Lake'],
      rows: [
        ['Schema', 'Khi ghi', 'Khi đọc'],
        ['Chi phí lưu trữ', 'Cao hơn', 'Thấp'],
        ['Giao dịch', 'Có', 'Không có sẵn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Schema-on-read nghĩa là không cần quan tâm đến schema.',
        truth: 'Schema vẫn tồn tại, chỉ chuyển trách nhiệm sang người đọc. Không ai quản lý thì mỗi người sẽ hiểu một kiểu.',
      },
    ],
  },
})
