import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eda-missing-values',
  summary:
    'Với giá trị thiếu, điều quan trọng là vì sao thiếu, không chỉ thiếu bao nhiêu. Ba cơ chế MCAR, MAR, MNAR quyết định cách xử lý nào còn cho kết quả không lệch.',
  tags: ['Chất lượng dữ liệu', 'Giá trị thiếu', 'First Principles'],
  related: ['fe-imputation', 'eda-leakage', 'dq-dimensions', 'dq-representativeness', 'eda-overview', 'eda-sampling'],
  sections: {
    definition: `**Missing Values (Giá trị thiếu)** là ô không có giá trị quan sát. Rubin (1976) chia nguyên nhân thành ba cơ chế, theo việc xác suất thiếu phụ thuộc vào điều gì:

- **MCAR (Missing Completely At Random, thiếu hoàn toàn ngẫu nhiên):** không phụ thuộc vào bất kỳ giá trị nào. Ví dụ: gói tin cảm biến rớt do lỗi mạng không liên quan đến giá trị đo.
- **MAR (Missing At Random, thiếu ngẫu nhiên có điều kiện):** chỉ phụ thuộc vào dữ liệu đã quan sát được. Ví dụ: người trẻ ít khai thu nhập hơn, có cột tuổi, và trong cùng độ tuổi việc khai không liên quan đến mức thu nhập.
- **MNAR (Missing Not At Random, thiếu không ngẫu nhiên):** vẫn phụ thuộc vào chính giá trị bị thiếu hoặc yếu tố không quan sát được, sau khi đã xét dữ liệu đang có. Ví dụ: cảm biến ngừng ghi khi nhiệt độ vượt 120 độ.`,

    origin: `Xóa dòng và điền trung bình đều ngầm giả định về nguyên nhân thiếu mà không nói ra. Khung của Rubin trả lời câu hỏi: khi nào có thể bỏ qua nguyên nhân thiếu mà không sai kết luận. Multiple Imputation (Rubin, 1987) sau đó cho phép điền mà vẫn giữ được độ bất định.`,

    whyUse: `Mỗi cách xử lý chỉ đúng dưới một giả định về cơ chế. Chọn sai thì kết quả lệch mà không có cảnh báo nào, vì phần mềm vẫn chạy bình thường. Hiểu cơ chế giúp chọn cách đơn giản nhất còn hợp lệ.`,

    mechanism: `1. **Tìm nguyên nhân từ quy trình sinh dữ liệu.** Ai nhập, hệ thống nào ghi? Đây là bằng chứng mạnh nhất. Số năm quản lý của người chưa từng làm quản lý là **thiếu cấu trúc**: không có giá trị thật nào để điền.
2. **So sánh nhóm thiếu với nhóm không thiếu** trên các biến khác. Khác biệt rõ thì bác bỏ MCAR. **Little's MCAR Test** làm việc này một cách chính thức, nhưng kết quả không có ý nghĩa thống kê không chứng minh được MCAR.
3. **Chấp nhận giới hạn.** Không kiểm định nào tách được MAR và MNAR từ dữ liệu đang có, vì khác biệt nằm ở chính các giá trị không quan sát được. Cần hiểu biết nghiệp vụ, hoặc thu thập lại trên một mẫu nhóm không trả lời. Thêm một cột giải thích được việc thiếu có thể đưa MNAR về gần MAR.
4. **Chọn cách xử lý theo cơ chế và mục tiêu,** xem bảng so sánh. Suy luận cần ước lượng không lệch. Dự đoán chỉ cần cơ chế thiếu giữ nguyên lúc triển khai, nên điền hằng số có thể đủ tốt với mô hình đủ mạnh (Josse và cộng sự).

Kỹ thuật điền cụ thể nằm ở [[fe-imputation]]. Phép điền chỉ được fit trên tập train, nếu không sẽ gây [[eda-leakage|rò rỉ]].`,

    diagram: {
      mermaid: `flowchart TD
  A["Tìm nguyên nhân thiếu từ quy trình sinh dữ liệu"] --> B["Ngẫu nhiên thật sự: MCAR"]
  A --> C["Giải thích được bằng biến đang có: MAR"]
  A --> D["Phụ thuộc chính giá trị bị thiếu: MNAR"]
  B --> E["Xóa dòng được nếu đủ mẫu"]
  C --> F["MICE, giữ các biến giải thích việc thiếu"]
  D --> G["Thu thập thêm, phân tích độ nhạy"]`,
      caption: 'Cách xử lý đi theo cơ chế. Chỉ MCAR có thể bị bác bỏ bằng dữ liệu, còn MAR và MNAR phải dựa vào hiểu biết về quy trình.',
    },

    example: `Khảo sát 10.000 khách: 25% là quản lý, thu nhập trung bình 60 triệu; 75% còn lại, 15 triệu. Trung bình thật là 26,25 triệu. Quản lý bỏ trống 60%, nhóm còn lại 10%, tổng cộng thiếu 22,5%.

- **Xóa dòng:** còn 1.000 quản lý và 6.750 người khác, trung bình 20,8 triệu, thấp hơn thật 21%.
- **Có cột chức vụ và trong mỗi nhóm việc thiếu không phụ thuộc thu nhập (MAR):** tính theo nhóm rồi gộp theo tỷ trọng sẽ thu lại 26,25 triệu.
- **Trong mỗi nhóm, người thu nhập càng cao càng giấu (MNAR):** dữ liệu đang có không sửa được. Cần gọi lại một mẫu người không trả lời, hoặc báo cáo một khoảng kết quả theo các giả định.`,

    prosCons: {
      pros: [
        '**Biết trước rủi ro** lệch của từng cách xử lý.',
      ],
      cons: [
        '**Không kiểm chứng trọn vẹn được:** phân biệt MAR và MNAR vẫn dựa vào giả định.',
        '**Cơ chế có thể đổi** khi biểu mẫu hay hệ thống ghi nhận thay đổi.',
      ],
    },

    whenToUse: {
      use: [
        'Thêm cờ thiếu khi việc thiếu mang thông tin và cơ chế còn giữ nguyên lúc dự đoán.',
        'Phân tích độ nhạy khi nghi ngờ MNAR và quyết định có tác động lớn.',
      ],
      avoid: [
        'Không dùng ngưỡng cố định như "thiếu trên 50% thì bỏ cột".',
        'Không điền trung bình khi cần phân tích phương sai hay tương quan.',
        'Không thêm cờ thiếu khi trường đó chỉ được điền sau sự kiện cần dự đoán.',
      ],
    },

    comparison: {
      intro: 'Hệ quả của từng cách xử lý theo cơ chế:',
      headers: ['Cách xử lý', 'MCAR', 'MAR', 'MNAR'],
      rows: [
        ['Xóa dòng', 'Không lệch, mất độ chính xác', 'Thường lệch với ước lượng như trung bình', 'Thường lệch'],
        ['Điền trung bình, trung vị', 'Phương sai và tương quan bị thu nhỏ', 'Lệch, vì bỏ qua biến giải thích', 'Lệch, và tạo cảm giác chắc chắn giả'],
        ['MICE, Maximum Likelihood', 'Hợp lệ, giữ được dữ liệu', 'Hợp lệ nếu mô hình đúng và có biến giải thích', 'Vẫn lệch nếu không có giả định thêm'],
        ['Thêm cờ thiếu', 'Gần như không có tín hiệu', 'Có thể giúp dự đoán, không sửa suy luận', 'Có thể giúp dự đoán nếu cơ chế ổn định, không sửa suy luận'],
      ],
      note: 'Ngoại lệ: với hồi quy, xóa dòng có thể không lệch cho hệ số khi việc thiếu chỉ phụ thuộc biến giải thích, không phụ thuộc nhãn.',
    },

    misconceptions: [
      {
        myth: 'MAR nghĩa là dữ liệu thiếu một cách ngẫu nhiên theo nghĩa thông thường.',
        truth: 'MAR cho phép việc thiếu có quy luật rõ ràng, miễn là quy luật đó được giải thích bằng biến quan sát được.',
      },
      {
        myth: 'Little\'s Test không có ý nghĩa thống kê thì dữ liệu là MCAR.',
        truth: 'Đó chỉ là chưa đủ bằng chứng để bác bỏ.',
      },
      {
        myth: 'Điền trung bình là an toàn khi dữ liệu MCAR.',
        truth: 'Trung bình của cột giữ nguyên, nhưng điền 20% dòng làm phương sai giảm khoảng 20% và tương quan giảm khoảng 10%.',
      },
    ],
  },
})
