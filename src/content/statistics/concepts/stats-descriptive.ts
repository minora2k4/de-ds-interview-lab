import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-descriptive',
  summary:
    'Thống kê mô tả tóm tắt dữ liệu đang có bằng con số và biểu đồ về trung tâm, độ phân tán và hình dạng. Nó chưa cho phép kết luận về tổng thể.',
  tags: ['Thống kê mô tả', 'Percentile', 'Phân phối'],
  related: ['stats-central-tendency', 'stats-variance-std', 'stats-distributions', 'stats-hypothesis', 'eda-overview', 'eda-distribution', 'dq-profiling'],
  sections: {
    definition: `**Descriptive Statistics (Thống kê mô tả)** tóm tắt một tập dữ liệu thành vài con số và biểu đồ, trả lời ba câu hỏi:

- **Trung tâm:** giá trị điển hình là bao nhiêu? ([[stats-central-tendency|mean, median, mode]])
- **Phân tán:** các giá trị cách nhau bao xa? ([[stats-variance-std|variance, std]], IQR)
- **Hình dạng:** lệch, đuôi dài hay nhiều đỉnh? (histogram, percentile)`,

    origin: `Không ai đọc được một bảng 10 triệu dòng. Cách làm kém hơn là xem vài dòng đầu, vốn không đại diện, hoặc chỉ báo một số trung bình, vốn che mất phân tán và phần đuôi. Bộ tứ Anscombe (1973) gồm bốn bộ dữ liệu cùng mean, variance, correlation nhưng vẽ ra rất khác nhau, nên bản tóm tắt cần đi kèm biểu đồ.`,

    whyUse: `Đây là bước đầu của mọi phân tích: phát hiện lỗi dữ liệu sớm, và cho biết nên dùng phương pháp nào tiếp theo.`,

    mechanism: `1. **Xác định kiểu biến,** vì nó quyết định phép tính nào có nghĩa: mã tỉnh là số nhưng lấy trung bình thì vô nghĩa.
2. **Tính trung tâm và phân tán,** vì cùng một mean có thể đi với độ biến động rất khác.
3. **Xem hình dạng** bằng histogram và percentile. Percentile dựa trên thứ hạng nên chịu được giá trị cực đoan và mô tả được phần đuôi.
4. **Chia theo nhóm,** vì con số tổng có thể che mất khác biệt.`,

    example: `Độ trễ của 1 triệu request: \`min\` = -1 ms, mean = 180 ms, median = 90 ms, p99 = 2.400 ms.

\`min\` âm là lỗi đồng hồ, cần làm sạch trước. Mean gấp đôi median cho thấy phân phối lệch phải. Chỉ báo 180 ms thì không ai biết 10.000 request chờ hơn 2,4 giây.`,

    prosCons: {
      pros: ['Nhanh, rẻ, không cần giả định về phân phối của dữ liệu.'],
      cons: ['Mất thông tin: nhiều phân phối khác nhau có cùng con số tóm tắt.'],
    },

    whenToUse: {
      use: ['Khi mới nhận dữ liệu, và khi theo dõi chất lượng dữ liệu định kỳ.'],
      avoid: ['Không dùng để kết luận hai nhóm khác nhau thật sự, việc đó cần [[stats-hypothesis|kiểm định]].'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Thống kê mô tả', 'Thống kê suy luận'],
      rows: [
        ['Câu hỏi', 'Dữ liệu này trông thế nào?', 'Điều gì đúng với tổng thể?'],
        ['Phạm vi', 'Chỉ dữ liệu đang có', 'Vượt ra ngoài mẫu'],
        ['Sự không chắc chắn', 'Không tính đến', 'Là trọng tâm'],
      ],
    },

    misconceptions: [
      {
        myth: 'Hai tập dữ liệu có cùng mean và std thì giống nhau.',
        truth: 'Bộ tứ Anscombe cho thấy các con số có thể trùng khớp trong khi hình dạng hoàn toàn khác.',
      },
      {
        myth: 'Mean của nhóm A cao hơn nhóm B nghĩa là A tốt hơn trong tổng thể.',
        truth: 'Đó chỉ là mô tả mẫu. Chênh lệch có thể do biến động ngẫu nhiên.',
      },
    ],
  },
})
