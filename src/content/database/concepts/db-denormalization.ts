import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-denormalization',
  summary:
    'Phi chuẩn hóa chủ động lưu dữ liệu dư thừa để đọc nhanh hơn, đổi lại phải tự giữ các bản sao đồng bộ. Cách này chuyển chi phí từ lúc đọc sang lúc ghi.',
  tags: ['Thiết kế lược đồ', 'Hiệu năng', 'Đánh đổi'],
  related: ['db-normalization', 'db-oltp-olap', 'db-sharding', 'etl-cdc', 'dw-star-schema'],
  sections: {
    definition: `**Denormalization (Phi chuẩn hóa)** là việc cố ý đưa dư thừa vào một lược đồ đã chuẩn hóa: sao chép cột, lưu sẵn kết quả Join hoặc tổng hợp, để truy vấn đọc ít bảng hơn.`,

    origin: `[[db-normalization]] giải quyết tính đúng đắn nhưng để lại chi phí Join lúc đọc. Khi index và phần cứng không còn đủ, phi chuẩn hóa khắc phục bằng cách tính sẵn lúc ghi, vì nhiều hệ có số lần đọc gấp hàng chục lần số lần ghi.`,

    whyUse: `Giảm độ trễ cho truy vấn lặp lại, giảm tải Join, và gần như bắt buộc khi đã [[db-sharding|sharding]], vì Join xuyên shard rất đắt.`,

    mechanism: `Bốn dạng thường gặp:

- **Sao chép cột:** lưu \`customer_name\` ngay trong \`orders\`.
- **Cột tổng hợp:** lưu \`post_count\` trong \`users\` để khỏi đếm lại.
- **Bảng rộng:** Join sẵn nhiều bảng thành một.
- **Materialized View (khung nhìn lưu sẵn):** lưu kết quả truy vấn. Với PostgreSQL, phải chạy \`REFRESH MATERIALIZED VIEW\` để làm mới.

Phần khó là **đồng bộ**. Cập nhật trong cùng giao dịch hoặc bằng trigger thì nhất quán ngay nhưng ghi chậm hơn. Cập nhật bất đồng bộ qua [[etl-cdc]] không ảnh hưởng đường ghi, nhưng dữ liệu trễ vài giây.`,

    example: `Trang hồ sơ được đọc 5.000 lần mỗi giây, mỗi lần đếm bài viết trên bảng 2 tỷ dòng, mất 80 ms. Thêm cột \`post_count\`, cập nhật cùng giao dịch khi đăng bài, thì đọc còn 2 ms. Đổi lại, tài khoản đăng liên tục gây tranh chấp khóa, và sau một lỗi triển khai, số đếm bị lệch nên phải có job đối soát.`,

    prosCons: {
      pros: ['Đọc nhanh và dễ đoán vì không phải Join hoặc tính lại.'],
      cons: ['Một thay đổi phải ghi nhiều nơi, nên ghi chậm và dễ lệch dữ liệu.'],
    },

    whenToUse: {
      use: ['Đã đo được Join là nút thắt, đọc nhiều hơn ghi rất nhiều, và dữ liệu sao chép ít thay đổi.'],
      avoid: ['Chưa thử index, viết lại truy vấn hoặc cache. Dữ liệu phải luôn đúng, như số dư tài khoản.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Chuẩn hóa', 'Phi chuẩn hóa'],
      rows: [
        ['Chi phí chính', 'Lúc đọc, do Join', 'Lúc ghi, do cập nhật nhiều nơi'],
        ['Phù hợp', '[[db-oltp-olap|OLTP]]', 'OLAP, đọc nhiều, dữ liệu đã shard'],
      ],
    },

    misconceptions: [
      {
        myth: 'Phi chuẩn hóa nghĩa là bỏ qua chuẩn hóa ngay từ đầu.',
        truth: 'Phải hiểu các phụ thuộc rồi mới biết mình dư thừa ở đâu, đồng bộ thế nào và bản nào là đúng.',
      },
      {
        myth: 'Phi chuẩn hóa luôn nhanh hơn.',
        truth: 'Nó chỉ nhanh với đúng các truy vấn được thiết kế cho nó.',
      },
    ],
  },
})
