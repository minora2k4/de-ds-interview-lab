import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-bigquery',
  summary:
    'BigQuery là kho dữ liệu serverless, tách lưu trữ khỏi tính toán. Mọi truy vấn đều dùng slot, nhưng on-demand tính tiền theo dữ liệu quét, còn capacity tính theo slot.',
  tags: ['Google Cloud', 'Data Warehouse', 'Serverless'],
  related: ['dw-data-warehouse', 'cloud-redshift', 'cloud-scaling', 'db-partitioning', 'dw-data-lakehouse', 'db-oltp-olap'],
  sections: {
    definition: `**Google BigQuery (Data Warehouse serverless)** là kho dữ liệu dạng cột không có cụm để quản lý. **Slot** là đơn vị tính toán ảo, BigQuery tự quyết định mỗi truy vấn dùng bao nhiêu slot.`,

    origin: `Google xây Dremel để truy vấn tương tác trên dữ liệu rất lớn mà không phải dựng cụm. BigQuery đưa nó thành dịch vụ. Người dùng không phải chọn số nút, và lưu trữ co giãn độc lập với tính toán.`,

    whyUse: `Không phải định cỡ, vá lỗi hay chia lại dữ liệu. Tải thất thường có thể chạy ngay, và lưu trữ giá rẻ giúp giữ dữ liệu lâu.`,

    mechanism: `**Kiến trúc:** Dremel thực thi, Colossus lưu dữ liệu theo cột (định dạng Capacitor), và mạng Jupiter nối hai bên. Truy vấn chia thành stage song song.

**On-demand:** tính theo byte logic mà truy vấn đọc, không phải theo kết quả trả về.

- **Chọn ít cột** giảm tiền, vì mỗi cột lưu riêng.
- **Partition và Clustering** bỏ qua phần không cần đọc.
- **\`LIMIT\`** không giảm tiền trên bảng thường, chỉ có thể giảm trên bảng có clustering.
- **Dry run** ước tính trước, đây là giới hạn trên. **\`maximum_bytes_billed\`** làm truy vấn thất bại mà không tính tiền nếu vượt mức.
- Kết quả lấy từ cache không tính tiền.

Mỗi project có khoảng 2.000 slot đồng thời cho on-demand. **Thiếu slot thì việc xếp hàng,** không lỗi và không tốn thêm, chỉ chậm hơn.

**Capacity:** trả theo slot-giờ qua Reservation với các edition Standard, Enterprise, Enterprise Plus. **Baseline** luôn được cấp và tính tiền, **autoscaling** tăng theo bội số 50 và tính theo số slot đã cấp, không phải số đã dùng.

**Lưu trữ:** chọn tính theo logic hoặc vật lý. Bảng hoặc partition không đổi 90 ngày liên tiếp được giảm giá lưu trữ.`,

    example: `Một báo cáo \`SELECT *\` trên bảng 40 TB chạy mỗi giờ. Thêm partition theo ngày, lọc 7 ngày, và chọn 6 trong 120 cột thì dữ liệu quét còn khoảng 50 GB, giảm hơn 800 lần.`,

    prosCons: {
      pros: ['Không vận hành cụm, co giãn tự động.', 'Tách lưu trữ và tính toán.'],
      cons: ['Một truy vấn xấu có thể rất đắt nếu không đặt giới hạn.', 'Thiếu slot làm chậm, và khó đoán trước thời gian chạy.'],
    },

    whenToUse: {
      use: ['On-demand: tải nhỏ, thất thường. Capacity: tải lớn, đều, cần chi phí dự đoán được.'],
      avoid: ['Không dùng cho truy vấn điểm với độ trễ mili giây, hay cập nhật từng dòng liên tục.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'On-demand', 'Capacity'],
      rows: [
        ['Tính tiền theo', 'Byte đã đọc', 'Slot-giờ'],
        ['Tối ưu quét dữ liệu', 'Giảm tiền trực tiếp', 'Giảm tranh chấp slot'],
        ['Nguy cơ', 'Truy vấn lớn bất ngờ', 'Trả cho slot nhàn rỗi'],
      ],
    },

    misconceptions: [
      {
        myth: 'Thêm `LIMIT 10` sẽ rẻ hơn.',
        truth: 'BigQuery vẫn đọc toàn bộ cột được chọn, trừ khi bảng có clustering.',
      },
      {
        myth: 'On-demand không dùng slot.',
        truth: 'Mọi truy vấn đều dùng slot. Hai mô hình chỉ khác cách tính tiền.',
      },
    ],
  },
})
