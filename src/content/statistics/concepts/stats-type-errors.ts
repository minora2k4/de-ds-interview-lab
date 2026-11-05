import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-type-errors',
  summary:
    'Sai lầm loại I là báo hiệu ứng khi không có, sai lầm loại II là bỏ sót hiệu ứng có thật. Power là 1 - beta. So sánh nhiều lần làm sai lầm loại I tăng nhanh, và cỡ mẫu là đòn bẩy chính để giảm cả hai.',
  tags: ['Alpha', 'Beta', 'Power', 'So sánh bội', 'First Principles'],
  related: ['stats-hypothesis', 'stats-p-value', 'stats-confidence-interval', 'stats-bayes', 'stats-binomial', 'eval-precision', 'eval-recall'],
  sections: {
    definition: `Một kiểm định có thể sai theo hai cách:

- **Type I Error (Sai lầm loại I, dương tính giả):** bác bỏ H0 trong khi H0 đúng. \`alpha = P(bác bỏ|H0 đúng)\`.
- **Type II Error (Sai lầm loại II, âm tính giả):** không bác bỏ H0 trong khi có hiệu ứng thật. \`beta = P(không bác bỏ|H1 đúng)\`.
- **Statistical Power (Năng lực kiểm định):** \`1 - beta\`, xác suất phát hiện được một hiệu ứng có độ lớn xác định.`,

    origin: `Bài toán thực tế là mọi quyết định từ dữ liệu đều có rủi ro, và hai kiểu sai có chi phí khác nhau. Ra mắt một tính năng vô dụng tốn tiền vận hành, còn bỏ qua một tính năng tốt thì mất doanh thu.

Cách làm kém hơn là chỉ quan tâm đến ngưỡng p, rồi chạy thí nghiệm với bất kỳ lượng dữ liệu nào đang có. Nhiều thí nghiệm như vậy gần như không có khả năng phát hiện hiệu ứng thật. Neyman và Pearson (1933) đặt nền móng cho việc xem xét đồng thời cả hai loại sai lầm.`,

    whyUse: `- **Tính cỡ mẫu trước khi chạy,** để biết thí nghiệm có đáng làm không.
- **Chọn ngưỡng theo chi phí:** sàng lọc ban đầu chấp nhận báo nhầm, phê duyệt cuối thì không.
- **Đọc đúng kết quả không có ý nghĩa:** power thấp thì kết quả đó gần như không nói lên điều gì.`,

    mechanism: `**Đánh đổi khi n cố định.** Hạ alpha làm ngưỡng khắt khe hơn, nên báo nhầm ít đi nhưng bỏ sót nhiều lên. Chỉ dịch ngưỡng thì không giảm được cả hai.

**Cách giảm cả hai cùng lúc:** tăng cỡ mẫu, giảm phương sai của metric, hoặc nhắm tới hiệu ứng lớn hơn. Cả ba đều làm hai phân phối dưới H0 và H1 tách xa nhau, tính theo đơn vị SE.

**Tính cỡ mẫu.** Với hai nhóm và metric tỷ lệ:

\`n mỗi nhóm ≈ 2 × (z_alpha + z_beta)² × p(1 - p) / d²\`

Với alpha 5% hai phía và power 80%: \`(1,96 + 0,84)² = 7,84\`, nên công thức rút gọn là \`n ≈ 16 × p(1 - p) / d²\`. Vì d nằm ở mẫu số và được bình phương, hiệu ứng nhỏ đi một nửa thì cần gấp 4 lần mẫu.

**So sánh nhiều lần.** Mỗi phép thử có 5% báo nhầm khi H0 đúng. Với m phép thử độc lập: \`P(ít nhất một báo nhầm) = 1 - 0,95^m\`.

- **Bonferroni:** dùng ngưỡng \`alpha / m\`, kiểm soát xác suất có ít nhất một báo nhầm (FWER).
- **Benjamini-Hochberg:** kiểm soát tỷ lệ phát hiện sai (FDR), ít khắt khe hơn.

Xem kết quả giữa chừng cũng là một dạng so sánh nhiều lần: 5 lần xem cách đều nâng 5% lên khoảng 14%, 10 lần lên khoảng 19%.

**Alpha không phải xác suất kết quả sai.** Alpha là \`P(bác bỏ|H0)\`, còn điều người ra quyết định muốn biết là \`P(H0|bác bỏ)\`. Muốn đi từ cái này sang cái kia phải dùng [[stats-bayes|Bayes]].`,

    diagram: {
      mermaid: `flowchart TD
  A["Thực tế: H0 đúng, không có hiệu ứng"] --> B["Bác bỏ H0: sai lầm loại I, xác suất alpha"]
  A --> C["Không bác bỏ: đúng, xác suất 1 - alpha"]
  D["Thực tế: có hiệu ứng thật"] --> E["Bác bỏ H0: đúng, xác suất là power"]
  D --> F["Không bác bỏ: sai lầm loại II, xác suất beta"]`,
      caption:
        'Alpha và beta đều là xác suất có điều kiện theo thực tế, không phải xác suất kết luận đang có là sai.',
    },

    example: `**Tính cỡ mẫu.** Tỷ lệ gốc 10%, cần phát hiện mức tăng lên 11%, nên d = 1 điểm phần trăm và \`p\` trung bình là 10,5%:

\`n ≈ 16 × 0,105 × 0,895 / 0,01² ≈ 15.000\` người mỗi nhóm.

Muốn phát hiện mức tăng 0,5 điểm phần trăm thì cần khoảng 60.000 người mỗi nhóm.

**Power với số mẫu đang có.** Với hiệu ứng thật 1 điểm phần trăm, 10.000 người mỗi nhóm cho \`SE ≈ 0,434\`, nên power = \`P(Z > 1,96 - 2,31)\` ≈ 64%. Với 2.000 người mỗi nhóm thì power chỉ khoảng 18%, tức 82% số lần sẽ bỏ sót hiệu ứng thật.

**So sánh nhiều lần.** Theo dõi 20 metric độc lập, không có metric nào thật sự thay đổi: \`1 - 0,95^20 ≈ 64%\` khả năng ít nhất một metric "có ý nghĩa". Bonferroni hạ ngưỡng xuống 0,05 / 20 = 0,0025, nhưng khiến cỡ mẫu cần thiết tăng gần gấp đôi.

**Power thấp làm phóng đại hiệu ứng.** Với 2.000 người mỗi nhóm, kết quả chỉ có ý nghĩa khi hiệu quan sát từ 1,9 điểm phần trăm trở lên. Nên dù hiệu ứng thật chỉ là 1, những kết quả "thắng" đều gấp ít nhất 1,9 lần sự thật.`,

    prosCons: {
      pros: [
        '**Biến rủi ro thành con số** có thể thảo luận và lên kế hoạch.',
        '**Tính được cỡ mẫu trước,** tránh lãng phí lưu lượng vào thí nghiệm vô ích.',
        '**Có công cụ hiệu chỉnh** khi cần so sánh nhiều lần.',
      ],
      cons: [
        '**Power phụ thuộc vào hiệu ứng giả định,** vốn chưa biết trước khi chạy.',
        '**Hiệu chỉnh quá chặt** làm tăng sai lầm loại II và tốn thêm mẫu.',
        '**Các công thức dựa vào giả định,** như độc lập và phương sai ổn định.',
      ],
    },

    whenToUse: {
      use: [
        'Tính power trước mọi A/B test, từ hiệu ứng nhỏ nhất đáng quan tâm (MDE).',
        'Hiệu chỉnh khi kết luận dựa trên nhiều metric, biến thể hoặc phân khúc.',
        'Chọn alpha, beta theo chi phí thật của từng loại sai lầm.',
      ],
      avoid: [
        'Không tính power sau thí nghiệm từ hiệu ứng quan sát để giải thích kết quả.',
        'Không dùng alpha 5% một cách máy móc khi hai loại sai lầm có chi phí rất khác nhau.',
        'Không chạy thí nghiệm power thấp rồi chỉ tin vào kết quả thắng.',
      ],
    },

    comparison: {
      intro: 'Các cách xử lý khi so sánh nhiều lần:',
      headers: ['Cách làm', 'Kiểm soát', 'Độ khắt khe', 'Phù hợp khi'],
      rows: [
        ['Một metric chính, chốt trước', 'Sai lầm trên metric đó', 'Không cần hiệu chỉnh', 'Thí nghiệm sản phẩm thông thường'],
        ['Bonferroni', 'FWER', 'Rất cao', 'Ít phép thử, chi phí báo nhầm rất lớn'],
        ['Holm', 'FWER', 'Cao, nhưng luôn có power ít nhất bằng Bonferroni', 'Thay thế Bonferroni trong hầu hết trường hợp'],
        ['Benjamini-Hochberg', 'FDR', 'Vừa phải', 'Nhiều phép thử mang tính dò tìm'],
      ],
    },

    misconceptions: [
      {
        myth: 'Alpha 5% nghĩa là 5% số kết quả có ý nghĩa là sai.',
        truth: 'Alpha tính trên các trường hợp H0 đúng. Tỷ lệ sai trong số kết quả có ý nghĩa phụ thuộc vào tỷ lệ giả thuyết đúng và có thể lên tới 36% hoặc hơn.',
      },
      {
        myth: 'Không có ý nghĩa thống kê nghĩa là không có hiệu ứng.',
        truth: 'Với power 18%, thí nghiệm bỏ sót hiệu ứng thật trong 82% số lần. Hãy đọc khoảng tin cậy và power đã lên kế hoạch.',
      },
      {
        myth: 'Tính power từ hiệu ứng quan sát sau thí nghiệm sẽ cho biết kết quả có đáng tin không.',
        truth: 'Power đó chỉ là một phép biến đổi của p-value nên không thêm thông tin, theo Hoenig và Heisey (2001). Power có ích nhất ở bước thiết kế.',
      },
      {
        myth: 'Thí nghiệm power thấp mà vẫn có ý nghĩa thì càng chắc chắn.',
        truth: 'Ngược lại. Kết quả đó dễ là báo nhầm hơn, và hiệu ứng được báo cáo thường bị phóng đại, còn gọi là Winner\'s Curse.',
      },
    ],
  },
})
