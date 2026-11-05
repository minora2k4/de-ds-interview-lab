import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-bayes',
  summary:
    'Định lý Bayes đảo chiều xác suất có điều kiện: từ P(bằng chứng|giả thuyết) và tỷ lệ nền, tính ra P(giả thuyết|bằng chứng). Bỏ qua tỷ lệ nền là lỗi Base Rate Fallacy.',
  tags: ['Bayes', 'Base Rate Fallacy', 'Prior', 'Posterior', 'First Principles'],
  related: ['stats-conditional', 'stats-probability', 'stats-p-value', 'stats-type-errors', 'eval-precision', 'eval-recall', 'eval-calibration', 'eda-imbalanced'],
  sections: {
    definition: `**Bayes' Theorem (Định lý Bayes)** cho phép tính xác suất của một giả thuyết H sau khi thấy bằng chứng E:

\`P(H|E) = P(E|H) × P(H) / P(E)\`

- **Prior (Xác suất tiên nghiệm)** \`P(H)\`: niềm tin trước khi thấy bằng chứng, hay **tỷ lệ nền** (base rate).
- **Likelihood (Khả năng)** \`P(E|H)\`: mức độ bằng chứng này xuất hiện khi H đúng.
- **Posterior (Xác suất hậu nghiệm)** \`P(H|E)\`: niềm tin sau khi cập nhật.
- **Evidence** \`P(E)\`: xác suất chung của bằng chứng, tính bằng [[stats-conditional|xác suất toàn phần]].`,

    origin: `Bài toán thực tế là **xác suất ngược**. Ta thường biết nguyên nhân sinh ra dấu hiệu với tỷ lệ bao nhiêu, nhưng cái cần lại là chiều ngược lại: có dấu hiệu rồi thì khả năng có nguyên nhân là bao nhiêu.

Bài viết của Thomas Bayes được Richard Price công bố năm 1763, sau khi Bayes mất, và Laplace phát triển nó thành phương pháp tổng quát.

Cách làm kém hơn là đọc thẳng độ nhạy của bộ lọc thành xác suất đúng của báo động, tức bỏ qua tỷ lệ nền. Kahneman và Tversky đã ghi nhận từ thập niên 1970 rằng con người rất hay mắc lỗi này. Nó được gọi là **Base Rate Fallacy (Ngụy biện tỷ lệ nền)**.`,

    whyUse: `Bayes cho câu trả lời đúng với câu hỏi mà người làm quyết định thật sự quan tâm:

- **Đánh giá hệ thống cảnh báo:** có bao nhiêu báo động là thật, trước khi đưa vào vận hành.
- **Gộp bằng chứng:** cập nhật dần khi có thêm tín hiệu, thay vì coi mỗi tín hiệu là một kết luận riêng.
- **Đưa kiến thức trước vào phân tích:** khi ít dữ liệu, prior giúp ước lượng ổn định hơn.
- **Đọc đúng kết quả kiểm định:** [[stats-p-value|p-value]] là xác suất của dữ liệu khi giả định H0, không phải xác suất của H0.`,

    mechanism: `**Suy ra từ định nghĩa.** \`P(H và E)\` viết được theo hai cách: \`P(H|E) × P(E)\` và \`P(E|H) × P(H)\`. Cho hai vế bằng nhau rồi chia cho \`P(E)\` là ra định lý. Vì vậy Bayes không phải một giả định, mà là hệ quả trực tiếp của xác suất có điều kiện.

**Vì sao tỷ lệ nền quan trọng.** Báo động đến từ hai nguồn: các ca thật và các ca nhầm. Khi sự kiện hiếm, nhóm bình thường đông áp đảo, nên một tỷ lệ báo nhầm nhỏ vẫn tạo ra rất nhiều ca nhầm. Mẫu số \`P(E)\` phản ánh chính điều này.

**Cách tính dễ nhất là dùng số đếm.** Chuyển xác suất thành số người trên một tổng cố định rồi đếm, sẽ dễ thấy sai sót hơn công thức.

**Dạng odds:** \`odds sau = odds trước × tỷ số khả năng\`, với tỷ số khả năng là \`P(E|H) / P(E|không H)\`. Dạng này cho thấy bằng chứng chỉ **nhân** niềm tin ban đầu, không thay thế nó.

**Cập nhật tuần tự:** posterior hôm nay là prior của ngày mai. Phép nhân liên tiếp chỉ đúng khi các bằng chứng độc lập có điều kiện theo H.`,

    diagram: {
      mermaid: `flowchart TD
  A["100.000 giao dịch"] --> B["1.000 gian lận (tỷ lệ nền 1%)"]
  A --> C["99.000 bình thường (99%)"]
  B --> D["900 báo động đúng (độ nhạy 90%)"]
  B --> E["100 bị bỏ sót"]
  C --> F["4.950 báo động nhầm (5%)"]
  C --> G["94.050 không báo động"]`,
      caption:
        'Có 5.850 báo động, chỉ 900 là thật, tức 15,4%. Nhóm bình thường đông áp đảo nên báo nhầm nhiều hơn báo đúng.',
    },

    example: `Bộ lọc gian lận có độ nhạy 90% và tỷ lệ báo nhầm 5%. Tỷ lệ gian lận là 1%. Nhiều người sẽ nói báo động đúng khoảng 90%.

Tính trên 100.000 giao dịch: 1.000 gian lận cho 900 báo động đúng, 99.000 bình thường cho 4.950 báo động nhầm. Vậy:

\`P(gian lận|báo động) = 900 / (900 + 4.950) ≈ 15,4%\`

Khoảng 6 trong 7 báo động là nhầm, dù bộ lọc trông rất tốt. Tỷ lệ nền thay đổi kết quả rất mạnh, cùng bộ lọc đó:

- Tỷ lệ nền 10%: posterior là 66,7%.
- Tỷ lệ nền 1%: posterior là 15,4%.
- Tỷ lệ nền 0,1%: posterior là 1,8%.

**Thêm bằng chứng thứ hai** độc lập, cùng chất lượng: tỷ số khả năng là 0,9 / 0,05 = 18. Odds sau bước đầu là 900 : 4.950 ≈ 0,182, nhân 18 được 3,27, tương ứng xác suất 3,27 / 4,27 ≈ 76,6%. Đây là lý do hệ thống hai lớp hiệu quả, nếu hai lớp thật sự độc lập.`,

    prosCons: {
      pros: [
        '**Trả lời trực tiếp** xác suất của giả thuyết, điều mà p-value không làm được.',
        '**Công khai giả định** qua prior, người khác có thể kiểm tra và tranh luận.',
        '**Cập nhật tự nhiên** khi có thêm dữ liệu.',
      ],
      cons: [
        '**Phụ thuộc prior** khi ít dữ liệu, và prior chọn sai sẽ làm lệch kết quả.',
        '**Tỷ lệ nền hay thay đổi,** nên kết quả tính trên dữ liệu cũ có thể không còn đúng.',
        '**Tính toán nặng** với mô hình phức tạp, thường cần phương pháp xấp xỉ.',
      ],
    },

    whenToUse: {
      use: [
        'Khi đánh giá hệ thống phát hiện sự kiện hiếm như gian lận, lỗi, xâm nhập.',
        'Khi muốn gộp nhiều bằng chứng, hoặc đưa kiến thức có trước vào phân tích.',
        'Khi người ra quyết định cần xác suất của giả thuyết, không phải xác suất của dữ liệu.',
      ],
      avoid: [
        'Không dùng tỷ lệ nền từ tập dữ liệu đã cân bằng lại, vì nó khác tỷ lệ thật khi vận hành, xem [[eda-imbalanced]].',
        'Không nhân liên tiếp các bằng chứng có chung nguồn gốc, vì chúng không độc lập.',
        'Không dùng prior quá chắc chắn: prior bằng 0 thì không bằng chứng nào cập nhật được.',
      ],
    },

    comparison: {
      intro: 'Suy luận Bayes và suy luận tần suất đặt câu hỏi khác nhau trên cùng dữ liệu:',
      headers: ['Tiêu chí', 'Tần suất', 'Bayes'],
      rows: [
        ['Tham số', 'Cố định, chưa biết', 'Được mô tả bằng phân phối xác suất'],
        ['Câu hỏi', '`P(dữ liệu|H0)`', '`P(giả thuyết|dữ liệu)`'],
        ['Kết quả chính', 'P-value, khoảng tin cậy', 'Posterior, khoảng khả tín'],
        ['Kiến thức trước', 'Không đưa vào công thức', 'Đưa vào qua prior'],
        ['Rủi ro chính', 'Đọc sai ý nghĩa kết quả', 'Chọn prior không phù hợp'],
      ],
    },

    misconceptions: [
      {
        myth: 'Bộ lọc có độ nhạy 90% thì mỗi báo động đúng với xác suất 90%.',
        truth: 'Đó là nhầm `P(báo động|gian lận)` với `P(gian lận|báo động)`. Với tỷ lệ nền 1%, con số đúng chỉ là 15,4%.',
      },
      {
        myth: 'Prior là chủ quan nên Bayes không khoa học.',
        truth: 'Mọi phân tích đều có giả định, Bayes chỉ ghi chúng ra rõ ràng. Có nhiều dữ liệu thì prior ảnh hưởng ít dần, và có thể kiểm tra độ nhạy với các prior khác nhau.',
      },
      {
        myth: 'Định lý Bayes và Naive Bayes là một.',
        truth: 'Định lý luôn đúng về mặt toán học. Naive Bayes thêm giả định các đặc trưng độc lập có điều kiện, và giả định đó thường không đúng.',
      },
      {
        myth: 'Tăng độ nhạy là cách tốt nhất để có báo động đáng tin hơn.',
        truth: 'Với sự kiện hiếm, giảm báo nhầm thường hiệu quả hơn nhiều. Tăng độ nhạy từ 90% lên 100% chỉ đưa posterior lên 16,8%, còn giảm báo nhầm từ 5% xuống 1% đưa nó lên 47,6%.',
      },
    ],
  },
})
