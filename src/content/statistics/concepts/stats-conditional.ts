import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-conditional',
  summary:
    'Xác suất có điều kiện P(A|B) là xác suất của A khi đã biết B xảy ra, tức thu hẹp không gian mẫu vào B. P(A|B) nói chung khác P(B|A).',
  tags: ['Xác suất có điều kiện', 'Độc lập', 'Xác suất toàn phần'],
  related: ['stats-probability', 'stats-bayes', 'stats-correlation-causation', 'stats-p-value', 'eval-precision', 'eval-recall'],
  sections: {
    definition: `**Conditional Probability (Xác suất có điều kiện)** \`P(A|B)\` là xác suất của A khi đã biết B xảy ra:

\`P(A|B) = P(A và B) / P(B)\`, với \`P(B) > 0\`.`,

    origin: `Thông tin mới phải làm thay đổi đánh giá. Cách làm kém hơn là dùng một tỷ lệ chung cho mọi trường hợp: tỷ lệ mua 30% là vô ích nếu máy tính mua 45% còn điện thoại chỉ 20%.`,

    whyUse: `Gần như mọi câu hỏi phân tích đều có điều kiện. [[eval-precision|Precision]] là \`P(đúng|dự đoán dương)\`, [[eval-recall|Recall]] là \`P(dự đoán dương|đúng)\`, và [[stats-p-value|p-value]] được tính khi giả định H0 đúng.`,

    mechanism: `**Vì sao chia cho P(B).** Biết B xảy ra thì mọi kết quả ngoài B bị loại, không gian mẫu chỉ còn B, nên phải chia cho \`P(B)\` để tổng xác suất lại bằng 1.

**Xác suất toàn phần:** \`P(A) = P(A|B) × P(B) + P(A|không B) × P(không B)\`. Tỷ lệ chung là trung bình có trọng số của từng nhóm, nên nó đổi khi cơ cấu nhóm đổi, dù từng nhóm không đổi.

**Độc lập** nghĩa là \`P(A|B) = P(A)\`: biết B không cho thêm thông tin về A.`,

    example: `1.000 phiên: 600 từ điện thoại, 400 từ máy tính. Có 300 phiên mua: 120 từ điện thoại, 180 từ máy tính.

- \`P(mua|điện thoại) = 120 / 600 = 20%\`, \`P(mua|máy tính) = 180 / 400 = 45%\`.
- \`P(điện thoại|mua) = 120 / 300 = 40%\`, khác hẳn 20%.

Kiểm tra: \`20% × 0,6 + 45% × 0,4 = 30%\`, đúng bằng 300 / 1.000.`,

    prosCons: {
      pros: ['Tách được khác biệt giữa các nhóm mà tỷ lệ chung che mất.'],
      cons: ['Điều kiện càng chi tiết càng ít dữ liệu, nên ước lượng càng dao động.'],
    },

    whenToUse: {
      use: ['Khi phân tích theo phân khúc, hoặc đọc kết quả mô hình phân loại.'],
      avoid: ['Không diễn giải khác biệt có điều kiện thành nhân quả khi chưa có thí nghiệm.'],
    },

    comparison: {
      intro: 'Ba xác suất từ cùng một bảng dữ liệu:',
      headers: ['Loại', 'Ký hiệu', 'Mẫu số', 'Giá trị'],
      rows: [
        ['Đồng thời', '`P(mua và điện thoại)`', 'Toàn bộ', '12%'],
        ['Có điều kiện', '`P(mua|điện thoại)`', 'Điện thoại', '20%'],
        ['Ngược chiều', '`P(điện thoại|mua)`', 'Người mua', '40%'],
      ],
    },

    misconceptions: [
      {
        myth: '`P(A|B)` và `P(B|A)` gần bằng nhau.',
        truth: 'Mẫu số khác nhau. Hầu hết người bị sốt xuất huyết có sốt, nhưng rất ít người bị sốt là do sốt xuất huyết.',
      },
      {
        myth: '`P(mua|máy tính)` cao hơn nên chuyển người dùng sang máy tính sẽ tăng doanh số.',
        truth: 'Đây là quan hệ quan sát. Người dùng máy tính có thể vốn đã muốn mua hơn, xem [[stats-correlation-causation]].',
      },
    ],
  },
})
