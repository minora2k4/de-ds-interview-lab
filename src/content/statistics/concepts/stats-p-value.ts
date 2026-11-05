import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-p-value',
  summary:
    'P-value là xác suất có dữ liệu cực đoan bằng hoặc hơn giá trị quan sát, khi giả định mô hình của H0 là đúng. Nó không phải xác suất H0 đúng, cũng không đo độ lớn của hiệu ứng.',
  tags: ['P-value', 'ASA', 'P-hacking', 'First Principles'],
  related: ['stats-hypothesis', 'stats-confidence-interval', 'stats-type-errors', 'stats-bayes', 'stats-conditional'],
  sections: {
    definition: `**P-value (Giá trị p)** là xác suất, **khi giả định một mô hình thống kê xác định là đúng**, để một đại lượng tóm tắt của dữ liệu bằng hoặc cực đoan hơn giá trị quan sát được.

Viết ngắn: \`p = P(dữ liệu cực đoan như vậy hoặc hơn | H0 và các giả định)\`.

Mô hình ở đây gồm H0 và mọi giả định còn lại, như độc lập hay phân tích đúng kế hoạch. Điều kiện nằm sau dấu \`|\`, nên p-value **không phải** \`P(H0|dữ liệu)\`.`,

    origin: `Bài toán thực tế là cần một thước đo chung cho câu hỏi: khác biệt này có bất thường so với dao động ngẫu nhiên không?

Cách làm kém hơn là đặt ngưỡng trên chênh lệch thô. Chênh 1 điểm phần trăm là rất lớn với 1 triệu người, nhưng chỉ là nhiễu với 1.000 người. P-value gộp cả hiệu ứng, độ biến động và cỡ mẫu vào một thang từ 0 đến 1.

Fisher phổ biến p-value từ những năm 1920. Việc dùng sai lan rộng đến mức năm 2016 American Statistical Association (ASA) phải ra một tuyên bố chính thức về cách dùng nó.`,

    whyUse: `- **Quy về một thang chung,** so được giữa các metric có đơn vị khác nhau.
- **Kiểm soát sai lầm dài hạn:** nếu H0 và các giả định đều đúng, tỷ lệ \`p ≤ 0,05\` chỉ khoảng 5%.
- **Phát hiện lỗi thiết kế:** ví dụ kiểm định tỷ lệ chia nhóm. Nếu thiết kế 50/50 mà p cực nhỏ thì việc chia nhóm có vấn đề.`,

    mechanism: `**Cách tính.** Giả định H0 đúng, xác định phân phối của thống kê kiểm định, rồi đo phần diện tích từ giá trị quan sát trở ra. Một cách hình dung là permutation: trộn ngẫu nhiên nhãn A và B nhiều lần, rồi đếm tỷ lệ số lần chênh lệch lớn bằng hoặc hơn chênh lệch thật.

**P-value phụ thuộc ba thứ:** cỡ hiệu ứng, độ biến động và cỡ mẫu. Vì vậy một mình nó không nói được hiệu ứng lớn hay nhỏ.

**Dưới H0, p-value phân phối đều từ 0 đến 1** (với thống kê liên tục). Đó là lý do ngưỡng 0,05 cho đúng 5% báo nhầm. Cũng vì thế, chạy nhiều phép thử gần như chắc chắn sẽ có vài p nhỏ.

**Sáu nguyên tắc trong tuyên bố của ASA (2016):**

1. P-value có thể cho biết dữ liệu không phù hợp với một mô hình thống kê xác định đến mức nào.
2. P-value không đo xác suất giả thuyết đúng, cũng không đo xác suất dữ liệu chỉ do ngẫu nhiên tạo ra.
3. Kết luận khoa học và quyết định kinh doanh không nên chỉ dựa vào việc p có vượt một ngưỡng hay không.
4. Suy luận đúng cần báo cáo đầy đủ và minh bạch. Chỉ báo những phân tích có p đẹp (p-hacking) làm các p-value gần như không diễn giải được.
5. P-value không đo độ lớn hay tầm quan trọng của hiệu ứng.
6. Riêng p-value không phải là thước đo bằng chứng tốt cho một mô hình hay giả thuyết.`,

    example: `A/B test: 10% và 11%, mỗi nhóm 10.000 người, \`z ≈ 2,31\`, \`p ≈ 0,021\`.

**Được nói:** nếu thật sự không có khác biệt và các giả định đều đúng, chênh lệch từ 1 điểm phần trăm trở lên theo cả hai chiều chỉ xảy ra khoảng 2,1% số lần.

**Không được nói:** "chỉ có 2,1% khả năng không có khác biệt", "97,9% B tốt hơn A", hay "hiệu ứng rất lớn".

**Vì sao không phải xác suất H0 đúng.** Giả sử trong 1.000 thí nghiệm chỉ 10% có hiệu ứng thật, với power 80% và alpha 5%:

- 100 thí nghiệm có hiệu ứng thật cho 80 kết quả có ý nghĩa.
- 900 thí nghiệm không có hiệu ứng cho 45 kết quả có ý nghĩa.

Trong 125 kết quả có ý nghĩa, có 45 / 125 = **36%** là nhầm, không phải 5%. Con số này phụ thuộc vào tỷ lệ giả thuyết đúng, đúng theo logic của [[stats-bayes|Base Rate Fallacy]].`,

    prosCons: {
      pros: [
        '**Tính được mà không cần prior,** nên không phải tranh luận về niềm tin ban đầu.',
        '**Thang chung,** dễ áp dụng trên nền tảng thí nghiệm tự động.',
        '**Cho phép kiểm soát** tỷ lệ báo nhầm dài hạn.',
      ],
      cons: [
        '**Rất dễ đọc sai,** kể cả với người có kinh nghiệm.',
        '**Không trả lời điều người ra quyết định cần:** giả thuyết có đúng không và hiệu ứng lớn bao nhiêu.',
        '**Mất ý nghĩa khi phân tích có chọn lọc,** mà người đọc không biết điều đó.',
      ],
    },

    whenToUse: {
      use: [
        'Khi đã chốt trước kế hoạch phân tích, và báo cáo kèm cỡ hiệu ứng, khoảng tin cậy.',
        'Khi kiểm tra chất lượng thí nghiệm, như lệch tỷ lệ chia nhóm.',
        'Khi báo cáo đầy đủ mọi phép thử đã chạy.',
      ],
      avoid: [
        'Không dùng làm tiêu chí duy nhất để ra quyết định.',
        'Không so sánh 0,049 và 0,051 như thể chúng khác nhau về bản chất.',
        'Không đọc p-value của phân tích dò tìm như thể đã chốt giả thuyết từ đầu.',
      ],
    },

    comparison: {
      intro: 'Mỗi đại lượng trả lời một câu hỏi riêng, không thay thế được nhau:',
      headers: ['Đại lượng', 'Trả lời câu hỏi', 'Không trả lời được'],
      rows: [
        ['P-value', 'Dữ liệu bất thường đến đâu nếu H0 đúng', 'Xác suất H0 đúng, độ lớn hiệu ứng'],
        ['Alpha', 'Tỷ lệ bác bỏ nhầm dài hạn khi H0 đúng', 'Xác suất kết quả này là nhầm'],
        ['Cỡ hiệu ứng', 'Chênh lệch lớn bao nhiêu', 'Chênh lệch có thể do ngẫu nhiên không'],
        ['[[stats-confidence-interval|Khoảng tin cậy]]', 'Những hiệu ứng nào phù hợp với dữ liệu', 'Xác suất giá trị thật nằm trong khoảng này'],
        ['Posterior', 'Xác suất giả thuyết đúng, khi có prior', 'Tỷ lệ báo nhầm dài hạn'],
      ],
    },

    misconceptions: [
      {
        myth: 'P = 0,02 nghĩa là có 2% khả năng H0 đúng.',
        truth: 'P-value được tính khi đã giả định H0 đúng, nên không thể là xác suất của H0. Tính xác suất đó cần prior, theo Bayes.',
      },
      {
        myth: 'P = 0,02 nghĩa là có 2% khả năng kết quả chỉ do ngẫu nhiên.',
        truth: 'ASA nêu rõ điều này là sai. P-value giả định ngẫu nhiên là cơ chế duy nhất, rồi hỏi dữ liệu hiếm đến đâu, chứ không tính xác suất của cơ chế đó.',
      },
      {
        myth: '1 - p là xác suất kết quả lặp lại được.',
        truth: 'Nếu hiệu ứng thật đúng bằng giá trị đo được ở mức p = 0,05, thí nghiệm giống hệt chỉ có khoảng 50% cơ hội lại đạt p < 0,05 cùng chiều.',
      },
      {
        myth: 'P càng nhỏ thì hiệu ứng càng lớn.',
        truth: 'Hiệu ứng rất nhỏ vẫn cho p rất nhỏ khi mẫu đủ lớn. Hiệu ứng lớn có thể cho p lớn khi mẫu nhỏ.',
      },
      {
        myth: 'P > 0,05 chứng tỏ không có hiệu ứng.',
        truth: 'P lớn không phải bằng chứng ủng hộ H0, vì nhiều giả thuyết khác cũng phù hợp với dữ liệu đó. ASA và Greenland cùng cộng sự (2016) đều nhấn mạnh điều này.',
      },
    ],
  },
})
