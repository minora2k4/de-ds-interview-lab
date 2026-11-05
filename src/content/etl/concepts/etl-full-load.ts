import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-full-load',
  summary:
    'Full Loading đọc lại toàn bộ nguồn ở mỗi lần chạy rồi thay thế đích. Cách này đơn giản và tự phản ánh cả thao tác xóa, nhưng chi phí tăng theo kích thước bảng, không theo lượng thay đổi.',
  tags: ['Full Load', 'Nạp dữ liệu'],
  related: ['etl-incremental', 'etl-cdc', 'etl-idempotency', 'etl-ingestion', 'dw-dimension-table'],
  sections: {
    definition: `**Full Loading (Nạp toàn bộ)** là mỗi lần chạy đều đọc toàn bộ nguồn và thay thế dữ liệu ở đích. Sau mỗi lần chạy, đích khớp với nguồn tại thời điểm đọc.`,

    origin: `Đây là cách làm đầu tiên, phù hợp khi dữ liệu nhỏ và có khung giờ đêm. Khi bảng lớn đến mức chạy không kịp, [[etl-incremental|Incremental Loading]] xuất hiện để khắc phục.`,

    whyUse: `Giá trị lớn nhất là **không có trạng thái phải theo dõi**: không cần watermark, không lo bỏ sót, và dòng bị xóa ở nguồn tự biến mất khỏi đích.`,

    mechanism: `1. Đọc toàn bộ nguồn, tốt nhất từ bản sao và trên một ảnh chụp nhất quán.
2. Ghi vào bảng tạm hoặc vị trí mới.
3. Kiểm tra, ví dụ so số dòng với lần trước.
4. **Hoán đổi nguyên tử** bảng tạm thành bảng chính.

Nếu xóa rồi mới nạp, người dùng sẽ thấy bảng rỗng hoặc dở dang. Nạp vào chỗ mới làm cho cách này [[etl-idempotency|idempotent]].`,

    example: `Bảng \`stores\` có 800 dòng, không có \`updated_at\` và thỉnh thoảng có dòng bị xóa. Full load chỉ mất 5 giây nên là lựa chọn đúng.

Ngược lại, \`orders\` có 2 tỷ dòng với 5 triệu thay đổi mỗi ngày. Full load mất 6 giờ, nên cần incremental.`,

    prosCons: {
      pros: ['Đơn giản, không có trạng thái giữa các lần chạy.', 'Tự phản ánh dòng bị xóa và tự sửa sai lệch.'],
      cons: ['Chi phí tăng theo kích thước bảng dù ít dòng đổi.', 'Mất lịch sử nếu không lưu ảnh chụp theo ngày.'],
    },

    whenToUse: {
      use: ['Bảng nhỏ, hoặc nguồn không xác định được phần thay đổi.', 'Lần nạp đầu, và đối soát định kỳ cho incremental.'],
      avoid: ['Bảng lớn có tỷ lệ thay đổi nhỏ, khi khung giờ chạy không đủ.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Full load', 'Incremental'],
      rows: [
        ['Chi phí mỗi lần', 'Theo kích thước bảng', 'Theo lượng thay đổi'],
        ['Trạng thái phải giữ', 'Không có', 'Watermark hoặc vị trí log'],
        ['Xóa ở nguồn', 'Tự phản ánh', 'Cần cơ chế riêng'],
      ],
    },

    misconceptions: [
      {
        myth: 'Full load thiếu chuyên nghiệp, luôn nên chuyển sang incremental.',
        truth: 'Với bảng nhỏ, full load đáng tin hơn và không có độ phức tạp thừa. Chỉ chuyển khi chi phí đã thành vấn đề.',
      },
      {
        myth: 'Full load luôn cho dữ liệu đúng.',
        truth: 'Nó vẫn sai nếu đọc lúc nguồn đang ghi mà không có ảnh chụp nhất quán, hoặc nguồn trả thiếu dòng mà không có kiểm tra.',
      },
    ],
  },
})
