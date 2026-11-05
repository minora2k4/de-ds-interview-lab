import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-hypothesis',
  summary:
    'Kiểm định giả thuyết đánh giá xem một khác biệt quan sát được có thể chỉ do biến động ngẫu nhiên hay không. Không bác bỏ H0 không có nghĩa là chấp nhận H0, và có ý nghĩa thống kê chưa chắc đã quan trọng.',
  tags: ['Kiểm định', 'H0', 'A/B test', 'First Principles'],
  related: ['stats-p-value', 'stats-confidence-interval', 'stats-type-errors', 'stats-normal', 'stats-binomial', 'stats-correlation-causation', 'eda-sampling'],
  sections: {
    definition: `**Hypothesis Testing (Kiểm định giả thuyết)** là quy trình dùng dữ liệu mẫu để đánh giá một khác biệt có thể được giải thích bằng biến động ngẫu nhiên hay không.

- **H0 (Giả thuyết không):** thường phát biểu là không có hiệu ứng, ví dụ tỷ lệ chuyển đổi của A và B bằng nhau.
- **H1 (Giả thuyết đối):** có hiệu ứng.
- **Alpha (Mức ý nghĩa):** tỷ lệ [[stats-type-errors|sai lầm loại I]] chấp nhận được, chốt trước khi xem dữ liệu.`,

    origin: `Bài toán thực tế là mẫu nào cũng dao động. B cao hơn A 1 điểm phần trăm có thể là thật, cũng có thể chỉ là may.

Cách làm kém hơn là nhìn dashboard thấy số nào cao hơn thì chọn, hoặc đặt ngưỡng cảm tính như "chênh trên 5% là thật". Cả hai đều không tính đến cỡ mẫu và độ biến động, nên thường ra mắt những thay đổi không có tác dụng.

Fisher (1925) dùng p-value như một thước đo bằng chứng. Neyman và Pearson (1933) đặt vấn đề thành bài toán quyết định với hai loại sai lầm. Quy trình phổ biến ngày nay là sự pha trộn của hai cách nghĩ này.`,

    whyUse: `- **Tách tín hiệu khỏi nhiễu** trước những quyết định tốn kém, như ra mắt tính năng hay đổi giá.
- **Tạo kỷ luật:** chốt trước metric, alpha và cỡ mẫu, nên khó chọn kết quả đẹp sau khi đã xem số liệu.
- **Tạo ngôn ngữ chung:** nhiều đội có thể đánh giá thí nghiệm theo cùng một quy tắc.`,

    mechanism: `Logic giống chứng minh phản chứng, nhưng theo xác suất: giả định H0 đúng, rồi xem dữ liệu có hiếm dưới giả định đó không.

**Vì sao H0 thường là "không có hiệu ứng".** Giả thuyết này đủ cụ thể để tính được phân phối của dữ liệu. Còn "có hiệu ứng" bao gồm vô số giá trị khác nhau.

**Các bước:**

1. **Chốt H0, H1, metric, alpha và cỡ mẫu trước.** Quyết định sau khi xem dữ liệu làm alpha mất ý nghĩa.
2. **Tính thống kê kiểm định:** \`z = hiệu quan sát / SE\`. Hiệu được đo theo đơn vị độ dao động, vì cùng 1 điểm phần trăm là lớn hay nhỏ tùy vào SE.
3. **Tính [[stats-p-value|p-value]]** dưới mô hình của H0.
4. **So sánh:** \`p ≤ alpha\` thì bác bỏ H0, ngược lại là không bác bỏ.
5. **Đọc cỡ hiệu ứng và [[stats-confidence-interval|khoảng tin cậy]]** để ra quyết định.

**Không bác bỏ không có nghĩa là chấp nhận.** P lớn chỉ cho biết dữ liệu không mâu thuẫn với H0, nhưng dữ liệu cũng có thể không mâu thuẫn với nhiều giả thuyết khác. Mẫu càng nhỏ càng dễ không bác bỏ. Muốn kết luận "không có khác biệt đáng kể", phải đặt biên cho phép rồi chứng tỏ khoảng tin cậy nằm trọn trong biên, gọi là **Equivalence Test (Kiểm định tương đương)**.

**Một phía hay hai phía.** Kiểm định một phía chỉ hợp lệ khi đã chốt trước và chiều còn lại không ảnh hưởng đến quyết định. Đổi sang một phía sau khi thấy kết quả thực chất là nhân đôi alpha.

**Xem giữa chừng (Peeking).** Xem nhiều lần rồi dừng khi có ý nghĩa sẽ tạo thêm cơ hội báo nhầm: 5 lần xem cách đều nâng 5% lên khoảng 14%. Muốn xem sớm thì phải dùng kiểm định tuần tự.`,

    diagram: {
      mermaid: `flowchart TD
  A["Chốt H0, H1, alpha và cỡ mẫu trước"] --> B["Thu dữ liệu theo thiết kế"]
  B --> C["Tính thống kê kiểm định"]
  C --> D["Tính p-value dưới mô hình của H0"]
  D --> E["p nhỏ hơn hoặc bằng alpha: bác bỏ H0"]
  D --> F["p lớn hơn alpha: không bác bỏ, chưa phải chấp nhận"]
  E --> G["Đọc cỡ hiệu ứng và khoảng tin cậy để quyết định"]
  F --> G`,
      caption:
        'Kết quả của kiểm định chưa phải là quyết định. Cả hai nhánh đều phải đọc tiếp cỡ hiệu ứng và độ không chắc chắn.',
    },

    example: `A/B test trang thanh toán, alpha = 5%, hai phía.

**Trường hợp 1:** mỗi nhóm 10.000 người, A có 1.000 người mua (10%), B có 1.100 người mua (11%). Tỷ lệ gộp là 10,5%, nên:

- \`SE = sqrt(0,105 × 0,895 × 2 / 10.000) ≈ 0,434\` điểm phần trăm.
- \`z = 1 / 0,434 ≈ 2,31\`, cho \`p ≈ 0,021\`. Bác bỏ H0.

**Trường hợp 2:** cùng tỷ lệ 10% và 11%, nhưng mỗi nhóm chỉ 2.000 người. SE tăng lên 0,97, nên \`z ≈ 1,03\` và \`p ≈ 0,30\`. Không bác bỏ. Khoảng tin cậy từ -0,9 đến +2,9 điểm phần trăm vẫn chứa những hiệu ứng rất có giá trị, nên kết luận đúng là chưa đủ dữ liệu, không phải tính năng vô dụng.

**Trường hợp 3:** mỗi nhóm 10 triệu người, 10,00% và 10,05%. \`z ≈ 3,73\`, \`p ≈ 0,0002\`. Có ý nghĩa thống kê rất mạnh, nhưng 0,05 điểm phần trăm có thể không đủ bù chi phí vận hành.`,

    prosCons: {
      pros: [
        '**Kiểm soát được tỷ lệ báo nhầm dài hạn** khi các giả định đúng.',
        '**Quy trình rõ ràng,** tự động hóa được trên nền tảng thí nghiệm.',
        '**Buộc phải nghĩ trước** về cỡ mẫu và tiêu chí thành công.',
      ],
      cons: [
        '**Kết luận nhị phân** làm mất thông tin về độ lớn của hiệu ứng.',
        '**Dễ bị dùng sai:** peeking, chọn phân khúc sau, đổi metric sau.',
        '**Với mẫu rất lớn,** hiệu ứng nhỏ không đáng kể vẫn có ý nghĩa thống kê.',
      ],
    },

    whenToUse: {
      use: [
        'Khi so sánh hai phương án trong thí nghiệm ngẫu nhiên và cần một quyết định.',
        'Khi kiểm tra chất lượng thí nghiệm, như tỷ lệ chia nhóm có đúng thiết kế không.',
        'Khi có thể chốt trước kế hoạch phân tích.',
      ],
      avoid: [
        'Không dùng trên dữ liệu quan sát để kết luận nhân quả, xem [[stats-correlation-causation]].',
        'Không dùng khi đã có toàn bộ tổng thể và không cần suy rộng.',
        'Không dò hàng trăm giả thuyết rồi chỉ báo những cái có ý nghĩa.',
      ],
    },

    comparison: {
      intro: 'Chọn phép kiểm định theo kiểu dữ liệu và giả định có thể chấp nhận:',
      headers: ['Phép kiểm định', 'Dùng khi', 'Giả định chính'],
      rows: [
        ['Z-test hai tỷ lệ', 'Metric tỷ lệ, mẫu lớn', 'Độc lập, `np` đủ lớn'],
        ['T-test hai mean', 'Metric liên tục', 'Độc lập, mean mẫu gần chuẩn'],
        ['Chi-square', 'Bảng tần suất nhiều loại', 'Độc lập, tần suất kỳ vọng đủ lớn'],
        ['Permutation test', 'Metric phức tạp hoặc phân phối lạ', 'Hoán đổi được nhãn dưới H0'],
      ],
    },

    misconceptions: [
      {
        myth: 'Không bác bỏ H0 nghĩa là H0 đúng, hai phiên bản như nhau.',
        truth: 'Có thể chỉ là mẫu quá nhỏ. Với n = 2.000, chênh lệch 1 điểm phần trăm vẫn cho `p ≈ 0,30`. Cần đọc khoảng tin cậy.',
      },
      {
        myth: 'Bác bỏ H0 nghĩa là H1 đã được chứng minh.',
        truth: 'Dữ liệu chỉ không phù hợp với mô hình của H0. Nguyên nhân có thể là hiệu ứng thật, may rủi, hoặc một giả định bị vi phạm như lỗi chia nhóm.',
      },
      {
        myth: 'Có ý nghĩa thống kê nghĩa là quan trọng.',
        truth: 'Với 10 triệu người mỗi nhóm, chênh lệch 0,05 điểm phần trăm vẫn cho `p ≈ 0,0002`. Tầm quan trọng phải đánh giá bằng cỡ hiệu ứng và chi phí.',
      },
      {
        myth: 'Có thể xem kết quả mỗi ngày và dừng ngay khi p nhỏ hơn 0,05.',
        truth: 'Mỗi lần xem là một cơ hội báo nhầm. Tỷ lệ sai lầm loại I thật sẽ cao hơn 5% nhiều, trừ khi dùng thiết kế tuần tự.',
      },
    ],
  },
})
