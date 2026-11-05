import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-label-quality',
  summary:
    "Chất lượng nhãn đo mức nhãn phản ánh đúng khái niệm cần học. Cohen's Kappa đo độ đồng thuận giữa hai người gán sau khi loại phần trùng hợp ngẫu nhiên, và ngay cả bộ dữ liệu chuẩn nổi tiếng vẫn có lỗi nhãn.",
  tags: ['Nhãn', "Cohen's Kappa", 'Nhiễu nhãn'],
  related: ['dq-overview', 'dq-sufficiency', 'dq-text', 'dq-image-audio', 'eval-confusion-matrix'],
  sections: {
    definition: `**Label Quality (Chất lượng nhãn)** là mức độ nhãn phản ánh đúng khái niệm mà mô hình cần học. **Label Noise (Nhiễu nhãn)** là phần nhãn sai so với sự thật.

**Cohen's Kappa** đo độ đồng thuận giữa hai người gán, sau khi trừ phần trùng hợp ngẫu nhiên: \`kappa = (po - pe) / (1 - pe)\`, với \`po\` là tỷ lệ đồng ý thực tế và \`pe\` là tỷ lệ đồng ý kỳ vọng do ngẫu nhiên.`,

    origin: `Nếu 95% mẫu là âm tính, hai người gán bừa theo tỷ lệ đó vẫn đồng ý khoảng 90%. Cohen đề xuất Kappa năm 1960 để khắc phục điểm này. Về sau, Northcutt và cộng sự cho thấy các tập kiểm tra chuẩn có trung bình ít nhất 3,3% nhãn sai.`,

    whyUse: `Nhãn đặt ra **giới hạn trên cho đánh giá**: nếu nhãn của tập test sai 5%, một mô hình hoàn hảo cũng không đạt 100%, và hai mô hình chênh nhau 1% có thể chẳng khác gì nhau.`,

    mechanism: `1. **Viết hướng dẫn gán nhãn** có ví dụ biên. Phần lớn bất đồng đến từ định nghĩa mơ hồ, không phải do người gán kém.
2. **Cho hai người gán chung một mẫu** rồi tính Kappa, hoặc Fleiss' Kappa khi nhiều người gán. Kappa thấp thì sửa hướng dẫn trước, sau đó mới gán đại trà.
3. **Dùng gold set:** một tập nhỏ đã có đáp án tin cậy để kiểm tra người gán.
4. **Tìm lỗi bằng mô hình:** Confident Learning ước lượng phân phối giữa nhãn đang có và nhãn thật, rồi xếp hạng các mẫu nghi ngờ để người kiểm tra lại.

Lưu ý: Kappa giảm mạnh khi một lớp rất phổ biến, dù đồng ý thô rất cao. Các mốc của Landis và Koch, như 0,61 đến 0,80 là "substantial", chỉ là quy ước, chính các tác giả cũng thừa nhận là tùy ý.`,

    example: `Hai người gán 1.000 bình luận cho mô hình phát hiện lời lẽ độc hại, trong đó 90% là bình thường. Họ đồng ý 92%, nghe có vẻ tốt. Nhưng \`pe\` vào khoảng 0,82, nên Kappa chỉ khoảng 0,56. Phần lớn bất đồng là câu châm biếm mà hướng dẫn không đề cập. Bổ sung quy tắc xong, Kappa tăng lên 0,78.`,

    prosCons: {
      pros: ['Kappa tính đến đồng thuận ngẫu nhiên, nên công bằng hơn tỷ lệ đồng ý thô.', 'Phát hiện sớm hướng dẫn mơ hồ, trước khi tốn tiền gán đại trà.'],
      cons: ['Kappa phụ thuộc vào tỷ lệ lớp, nên khó so sánh giữa hai bộ dữ liệu.', 'Đồng thuận cao chưa chắc đã đúng: hai người có thể cùng hiểu sai một cách.'],
    },

    whenToUse: {
      use: ['Trước khi gán nhãn đại trà, để kiểm tra hướng dẫn.', 'Khi mô hình chững lại ở một mức, nghi ngờ do nhãn.'],
      avoid: ['Không dùng ngưỡng Kappa cố định cho mọi bài toán.', 'Không xóa hết mẫu mà mô hình nghi ngờ: đó có thể là ca khó nhưng đúng.'],
    },

    comparison: {
      headers: ['Chỉ số', 'Dùng khi', 'Điểm yếu'],
      rows: [
        ['Tỷ lệ đồng ý thô', 'Xem nhanh', 'Bị thổi cao khi lệch lớp'],
        ["Cohen's Kappa", 'Hai người gán, nhãn phân loại', 'Phụ thuộc tỷ lệ lớp'],
        ['Gold set', 'Kiểm tra độ đúng của người gán', 'Tốn công tạo, có thể bị học thuộc'],
      ],
    },

    misconceptions: [
      { myth: 'Bộ dữ liệu chuẩn nổi tiếng thì nhãn chính xác.', truth: 'Theo Northcutt và cộng sự, ImageNet validation có khoảng 5,8% lỗi nhãn, QuickDraw khoảng 10%.' },
      { myth: 'Kappa cao chứng minh nhãn đúng.', truth: 'Kappa chỉ đo mức đồng thuận. Muốn biết độ đúng, phải so với chuyên gia hoặc gold set.' },
    ],
  },
})
