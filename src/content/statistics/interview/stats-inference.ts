import { defineInterview } from '../../define'

export default defineInterview([
  /* ---------- stats-hypothesis ---------- */
  {
    id: 'iv-stats-hypothesis-01',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-hypothesis', 'stats-p-value'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Mô tả các bước kiểm định giả thuyết qua một ví dụ A/B test có số liệu cụ thể.',
    referenceAnswer: `Giả sử muốn biết trang thanh toán mới B có làm tăng tỷ lệ mua không.

Đầu tiên, chốt trước khi xem dữ liệu: H0 là tỷ lệ của A và B bằng nhau, H1 là khác nhau, alpha 5% hai phía, metric chính và cỡ mẫu. Việc này phải làm trước, vì quyết định sau khi xem dữ liệu làm alpha mất ý nghĩa.

Sau đó thu dữ liệu: mỗi nhóm 10.000 người, A có 10%, B có 11%. Tôi tính thống kê kiểm định. Tỷ lệ gộp là 10,5%, \`SE = sqrt(0,105 × 0,895 × 2 / 10.000) ≈ 0,434\` điểm phần trăm, nên \`z = 1 / 0,434 ≈ 2,31\`. Việc chia cho SE đưa chênh lệch về đơn vị độ dao động.

Từ z tính được \`p ≈ 0,021\`, nhỏ hơn 5% nên bác bỏ H0. Nhưng tôi chưa dừng ở đó. Tôi báo cáo khoảng tin cậy từ 0,15 đến 1,85 điểm phần trăm, và so với mức hòa vốn của tính năng để ra quyết định.`,
    keyPoints: [
      { text: 'Đặt H0, H1, alpha trước khi xem dữ liệu', keywords: ['h0', 'alpha', 'chốt trước', 'trước khi'], weight: 2 },
      { text: 'Tính thống kê kiểm định theo SE', keywords: ['thống kê kiểm định', 'z test', 'chia cho se', 'sai số chuẩn'] },
      { text: 'So p-value với alpha', keywords: ['p value', 'bác bỏ'], weight: 2 },
      { text: 'Đọc cỡ hiệu ứng hoặc khoảng tin cậy', keywords: ['khoảng tin cậy', 'cỡ hiệu ứng', 'hòa vốn', 'effect size'] },
    ],
    followUps: ['Vì sao phải chốt cỡ mẫu trước?', 'Khi nào dùng kiểm định một phía?'],
    commonMistakes: ['Dừng ở "p < 0,05 nên B tốt hơn" mà không nói hiệu ứng lớn bao nhiêu.', 'Nói "chấp nhận H0" khi không bác bỏ được.'],
  },
  {
    id: 'iv-stats-hypothesis-02',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-hypothesis', 'stats-confidence-interval', 'stats-type-errors'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao "không bác bỏ H0" không có nghĩa là "chấp nhận H0"? Nếu thật sự muốn chứng tỏ hai phiên bản tương đương thì làm thế nào?',
    referenceAnswer: `Kiểm định được xây dựng để tìm bằng chứng chống lại H0, không phải để ủng hộ nó. P lớn chỉ nói rằng dữ liệu không mâu thuẫn với H0, nhưng dữ liệu đó cũng có thể không mâu thuẫn với nhiều giả thuyết khác.

Về mặt logic, nếu coi không bác bỏ là chấp nhận, thì cách dễ nhất để "chứng minh" hai bên giống nhau là chạy thí nghiệm thật nhỏ, vì mẫu nhỏ gần như không bao giờ bác bỏ. Ví dụ: 10% và 11% với 2.000 người mỗi nhóm cho \`p ≈ 0,30\`. Khoảng tin cậy từ -0,9 đến +2,9 điểm phần trăm vẫn chứa những hiệu ứng rất lớn, và power chỉ khoảng 18%. Kết luận đúng là chưa đủ dữ liệu.

Muốn chứng tỏ tương đương, trước hết phải định nghĩa "tương đương" bằng nghiệp vụ, ví dụ chênh lệch không quá 0,5 điểm phần trăm. Sau đó dùng kiểm định tương đương, thường là TOST, trong đó giả thuyết cần bác bỏ là "chênh lệch vượt biên". Cách trực quan là kiểm tra khoảng tin cậy 90% có nằm trọn trong biên không. Cách này đòi hỏi cỡ mẫu lớn, vì khoảng phải đủ hẹp.`,
    keyPoints: [
      { text: 'Kiểm định chỉ tìm bằng chứng chống H0', keywords: ['chống lại h0', 'không mâu thuẫn', 'giả thuyết khác'], weight: 2 },
      { text: 'Mẫu nhỏ dễ không bác bỏ, power thấp', keywords: ['power', 'mẫu nhỏ', 'thiếu dữ liệu'], weight: 2 },
      { text: 'Dùng kiểm định tương đương với biên cho phép', keywords: ['tương đương', 'tost', 'equivalence', 'biên'], weight: 2 },
      { text: 'Đọc khoảng tin cậy', keywords: ['khoảng tin cậy', 'confidence interval'] },
    ],
    followUps: ['Vì sao TOST thường dùng khoảng 90% thay vì 95%?', 'Làm sao chọn biên tương đương một cách hợp lý?'],
    commonMistakes: ['Dùng p > 0,05 để kết luận thay đổi không có hại.', 'Chọn biên tương đương sau khi đã xem kết quả.'],
  },
  {
    id: 'iv-stats-hypothesis-03',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-hypothesis', 'stats-p-value'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'A/B test với 10 triệu người mỗi nhóm cho tỷ lệ tăng từ 10,00% lên 10,05%, p = 0,0002. Sếp muốn ra mắt ngay vì "kết quả có ý nghĩa rất mạnh". Bạn tư vấn thế nào?',
    referenceAnswer: `Tôi tách hai câu hỏi: hiệu ứng có thật không, và nó có đáng giá không. P nhỏ chỉ trả lời câu đầu. Với mẫu cực lớn, SE chỉ khoảng 0,013 điểm phần trăm, nên hiệu ứng rất nhỏ vẫn cho z ≈ 3,7. ASA cũng nói rõ p-value không đo độ quan trọng của kết quả.

Sau đó tôi quy đổi hiệu ứng thành tiền. Khoảng tin cậy khoảng từ 0,024 đến 0,076 điểm phần trăm. Tôi nhân với số người dùng và giá trị mỗi đơn, rồi so với chi phí hạ tầng, bảo trì và độ phức tạp của tính năng. Với quy mô rất lớn, 0,05 điểm phần trăm vẫn có thể đáng giá, nên không thể bác bỏ theo cảm tính.

Tôi cũng kiểm tra thêm vì với mẫu lớn, một lỗi nhỏ về thiết kế đủ để tạo ra p nhỏ: tỷ lệ chia nhóm có đúng không, các metric bảo vệ có xấu đi không, có hiệu ứng mới lạ không. Lý tưởng nhất là đã chốt trước hiệu ứng nhỏ nhất đáng quan tâm, để quy tắc quyết định rõ ràng ngay từ đầu.`,
    keyPoints: [
      { text: 'Phân biệt ý nghĩa thống kê và ý nghĩa thực tế', keywords: ['ý nghĩa thực tế', 'practical significance', 'đáng giá'], weight: 2 },
      { text: 'Mẫu lớn làm hiệu ứng nhỏ vẫn có p nhỏ', keywords: ['mẫu lớn', 'cỡ mẫu', 'se nhỏ'], weight: 2 },
      { text: 'Quy đổi hiệu ứng ra giá trị và chi phí', keywords: ['chi phí', 'doanh thu', 'quy đổi'], weight: 2 },
      { text: 'Kiểm tra lỗi thiết kế và metric bảo vệ', keywords: ['tỷ lệ chia nhóm', 'srm', 'metric bảo vệ', 'guardrail', 'mới lạ'] },
    ],
    followUps: ['Hiệu ứng nhỏ nhất đáng quan tâm nên được chọn thế nào?', 'Sample Ratio Mismatch được phát hiện ra sao?'],
    commonMistakes: ['Coi p rất nhỏ là hiệu ứng rất lớn.', 'Bác bỏ hiệu ứng nhỏ mà không quy đổi theo quy mô.'],
  },

  /* ---------- stats-p-value ---------- */
  {
    id: 'iv-stats-p-value-01',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-p-value', 'stats-hypothesis'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'P-value là gì? Hãy nói rõ cả những điều nó không phải.',
    referenceAnswer: `P-value là xác suất, khi giả định một mô hình thống kê là đúng, gồm H0 và các giả định khác, để có dữ liệu cực đoan bằng hoặc hơn giá trị quan sát. Ví dụ A/B test có \`p ≈ 0,021\`: nếu thật sự không có khác biệt, chênh lệch cỡ này trở lên chỉ gặp khoảng 2,1% số lần.

Theo tuyên bố của ASA năm 2016, nó **không phải** là xác suất giả thuyết đúng, cũng không phải xác suất dữ liệu chỉ do ngẫu nhiên tạo ra. Lý do: phép tính đã giả định H0 đúng, nên không thể cho biết xác suất của chính H0. Đó là \`P(dữ liệu|H0)\`, không phải \`P(H0|dữ liệu)\`. Muốn có chiều sau phải dùng Bayes với prior.

Nó cũng không đo độ lớn của hiệu ứng, vì hiệu ứng rất nhỏ vẫn cho p rất nhỏ khi mẫu đủ lớn. Và p lớn không chứng minh không có hiệu ứng. Vì vậy tôi luôn báo cáo p-value kèm cỡ hiệu ứng và khoảng tin cậy, không ra quyết định chỉ dựa vào ngưỡng 0,05.`,
    keyPoints: [
      { text: 'Xác suất của dữ liệu cực đoan, khi giả định H0', keywords: ['cực đoan', 'giả định h0', 'nếu h0 đúng', 'h0 đúng'], weight: 2 },
      { text: 'Không phải xác suất H0 đúng', keywords: ['không phải xác suất', 'p(h0', 'xác suất h0'], weight: 2 },
      { text: 'Không đo độ lớn hiệu ứng', keywords: ['độ lớn', 'cỡ hiệu ứng', 'effect size'], weight: 2 },
      { text: 'P lớn không chứng minh không có hiệu ứng', keywords: ['không chứng minh', 'không bác bỏ', 'không có nghĩa'] },
    ],
    followUps: ['Vì sao 1 - p không phải xác suất H1 đúng?', 'Ngưỡng 0,05 có gì đặc biệt không?'],
    commonMistakes: ['Nói p là xác suất kết quả do ngẫu nhiên.', 'Nói p nhỏ nghĩa là hiệu ứng lớn.'],
  },
  {
    id: 'iv-stats-p-value-02',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-p-value', 'stats-bayes', 'stats-type-errors'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Đồng nghiệp nói: "p = 0,03 nên chỉ có 3% khả năng đây là dương tính giả." Bạn đính chính thế nào, có ví dụ số?',
    referenceAnswer: `Câu đó đảo chiều xác suất có điều kiện. P-value tính dữ liệu khi giả định H0 đúng, còn đồng nghiệp đang nói về \`P(H0 đúng|kết quả có ý nghĩa)\`. Hai đại lượng có mẫu số khác nhau, và muốn đi từ cái này sang cái kia cần tỷ lệ nền, giống như Base Rate Fallacy trong Bayes.

Tôi dùng ví dụ đếm: công ty chạy 1.000 thí nghiệm, chỉ 10% có hiệu ứng thật, power 80%, alpha 5%. Trong 100 thí nghiệm có hiệu ứng, 80 cái có ý nghĩa. Trong 900 thí nghiệm không có hiệu ứng, 45 cái vẫn có ý nghĩa. Vậy trong 125 kết quả có ý nghĩa, 45 cái là báo nhầm, tức **36%**, không phải 5%.

Nếu tỷ lệ giả thuyết đúng chỉ 1%, con số đó còn cao hơn nhiều. Thực tế, các nền tảng thí nghiệm lớn thường báo cáo tỷ lệ ý tưởng thành công khá thấp, nên điều này rất đáng lưu ý.

Hệ quả thực tế: kết quả bất ngờ cần được kiểm chứng lại, power thấp làm tình hình xấu đi, và nên dùng dữ liệu lịch sử để ước lượng tỷ lệ này.`,
    keyPoints: [
      { text: 'Đảo chiều xác suất có điều kiện', keywords: ['đảo chiều', 'có điều kiện', 'p(h0', 'p(dữ liệu'], weight: 2 },
      { text: 'Cần tỷ lệ nền để tính, liên hệ Bayes', keywords: ['tỷ lệ nền', 'base rate', 'bayes', 'prior'], weight: 2 },
      { text: 'Tính được ví dụ 36%', keywords: ['45 / 125', '36 phần trăm', '45 kết quả'], weight: 2 },
      { text: 'Khuyến nghị kiểm chứng lại, chú ý power', keywords: ['kiểm chứng', 'lặp lại', 'power'] },
    ],
    followUps: ['Nếu power giảm xuống 20% thì tỷ lệ báo nhầm thay đổi thế nào?', 'Làm sao ước lượng tỷ lệ giả thuyết đúng ở công ty bạn?'],
    commonMistakes: ['Đồng ý với đồng nghiệp vì nghĩ alpha chính là tỷ lệ báo nhầm.', 'Biết là sai nhưng không giải thích được bằng số.'],
  },
  {
    id: 'iv-stats-p-value-03',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-p-value', 'stats-type-errors'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'P-hacking là gì? Nó xuất hiện thế nào trong công việc phân tích hằng ngày, và bạn ngăn nó bằng cách nào?',
    referenceAnswer: `P-hacking là chọn cách phân tích hoặc chọn kết quả để báo cáo dựa trên chính p-value. Nó làm p-value mất ý nghĩa, vì phép tính giả định phân tích đã được định trước. ASA nhấn mạnh rằng vấn đề này xuất hiện ngay cả khi người phân tích không cố ý, và không chính thức chạy nhiều phép thử.

Trong công việc, nó thường trông rất bình thường: dừng thí nghiệm khi p vừa đẹp, thử nhiều metric rồi chọn cái tốt nhất, chia theo phân khúc sau khi tổng thể thất bại, đổi cách loại ngoại lai cho đến khi có ý nghĩa. Với 14 phân khúc độc lập đã có khoảng 51% khả năng ít nhất một phân khúc đạt \`p < 0,05\` dù không có gì thật.

Tôi ngăn bằng quy trình hơn là bằng ý thức cá nhân. Thứ nhất, chốt trước metric chính, cỡ mẫu và phân khúc trên nền tảng thí nghiệm. Thứ hai, ghi lại mọi phân tích đã thử. Thứ ba, tách rõ phân tích kiểm chứng và phân tích khám phá: kết quả khám phá chỉ là giả thuyết, phải được thử lại trên dữ liệu mới. Khi cần kết luận trên nhiều phép thử, tôi dùng Bonferroni hoặc Benjamini-Hochberg.`,
    keyPoints: [
      { text: 'Chọn phân tích hoặc kết quả dựa trên p-value', keywords: ['chọn lọc', 'chọn kết quả', 'chọn cách phân tích', 'cherry picking', 'data dredging'], weight: 2 },
      { text: 'Ví dụ thực tế: phân khúc, peeking, metric', keywords: ['phân khúc', 'peeking', 'dừng', 'nhiều metric'], weight: 2 },
      { text: 'Chốt trước kế hoạch phân tích', keywords: ['chốt trước', 'pre registration', 'định trước', 'kế hoạch'], weight: 2 },
      { text: 'Tách khám phá và kiểm chứng, hiệu chỉnh', keywords: ['khám phá', 'kiểm chứng', 'bonferroni', 'benjamini', 'dữ liệu mới'] },
    ],
    followUps: ['Khi nào xem phân khúc sau thí nghiệm là chấp nhận được?', 'Làm sao thiết kế nền tảng thí nghiệm để hạn chế p-hacking?'],
    commonMistakes: ['Nghĩ chỉ có người cố ý gian lận mới p-hacking.', 'Coi kết quả ở một phân khúc được tìm ra sau là một kết luận chắc chắn.'],
  },
  {
    id: 'iv-stats-p-value-04',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-p-value', 'stats-confidence-interval', 'stats-bayes'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: false,
    question: 'Một số người muốn bỏ hẳn p-value. Bạn có đồng ý không? Nếu xây dựng quy tắc ra quyết định từ thí nghiệm cho công ty, bạn sẽ làm thế nào?',
    referenceAnswer: `Tôi không bỏ p-value, nhưng không để nó đứng một mình. Tuyên bố của ASA cũng không kêu gọi bỏ nó, mà nêu sáu nguyên tắc, như p-value không đo xác suất giả thuyết đúng, và quyết định không nên chỉ dựa vào một ngưỡng. P-value vẫn hữu ích để kiểm soát báo nhầm dài hạn và phát hiện lỗi hệ thống như lệch tỷ lệ chia nhóm. Vấn đề chủ yếu nằm ở cách dùng, nên đổi sang công cụ khác cũng có thể gặp lỗi tương tự, ví dụ dùng Bayes Factor như một ngưỡng cứng.

Tôi xây quy tắc theo các lớp. **Trước khi chạy:** chốt metric chính, metric bảo vệ, MDE theo giá trị kinh doanh, cỡ mẫu. **Khi chạy:** kiểm tra chất lượng như lệch tỷ lệ chia nhóm, dùng kiểm định tuần tự nếu cần xem sớm. **Khi đọc kết quả:** báo cáo cỡ hiệu ứng và khoảng tin cậy, so với mức hòa vốn thay vì so với số 0. **Khi quyết định:** cân nhắc chi phí mỗi loại sai lầm, kết hợp bằng chứng trước đó. **Theo dõi dài hạn:** dùng nhóm giữ lại để đo tổng hiệu quả thật, và so sánh với tổng hiệu ứng đã công bố để phát hiện phóng đại.`,
    keyPoints: [
      { text: 'Vấn đề ở cách dùng, không chỉ ở công cụ', keywords: ['cách dùng', 'không bỏ', 'đứng một mình', 'asa'], weight: 2 },
      { text: 'Báo cáo cỡ hiệu ứng và khoảng tin cậy, so với hòa vốn', keywords: ['cỡ hiệu ứng', 'khoảng tin cậy', 'hòa vốn'], weight: 2 },
      { text: 'Chốt trước kế hoạch, kiểm định tuần tự', keywords: ['chốt trước', 'tuần tự', 'sequential', 'mde'] },
      { text: 'Quyết định theo chi phí và nhóm giữ lại', keywords: ['chi phí', 'nhóm giữ lại', 'holdout', 'bằng chứng trước'] },
    ],
    followUps: ['Bạn xử lý thế nào khi đội sản phẩm muốn chạy nhanh hơn kế hoạch?', 'Holdout dài hạn có những đánh đổi gì?'],
    commonMistakes: ['Trả lời theo phe: hoặc bỏ hẳn hoặc giữ nguyên.', 'Nói Bayes tự động giải quyết mọi vấn đề của p-value.'],
  },

  /* ---------- stats-confidence-interval ---------- */
  {
    id: 'iv-stats-confidence-interval-01',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-confidence-interval'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Khoảng tin cậy 95% nghĩa là gì? Vì sao câu "có 95% xác suất giá trị thật nằm trong khoảng này" lại không đúng theo nghĩa tần suất?',
    referenceAnswer: `Khoảng tin cậy 95% là kết quả của một quy trình: nếu lặp lại việc lấy mẫu và tính khoảng rất nhiều lần, khoảng 95% số khoảng sẽ chứa giá trị thật.

Trong tư duy tần suất, giá trị thật là một số cố định, dù ta chưa biết. Thứ ngẫu nhiên là khoảng, vì nó phụ thuộc vào mẫu lấy được. Sau khi đã tính ra một khoảng cụ thể, ví dụ từ 0,15 đến 1,85 điểm phần trăm, nó hoặc chứa, hoặc không chứa giá trị thật, không còn phép tính xác suất nào để nói 95%. Sổ tay thống kê của NIST cũng ghi rõ độ tin cậy gắn với phương pháp tính.

Một phép so sánh dễ hiểu: người ném vòng có tỷ lệ trúng 95%. Vòng đã rơi xuống thì hoặc trúng, hoặc trượt, còn 95% là chất lượng của người ném.

Muốn có phát biểu về xác suất của tham số, phải dùng khoảng khả tín của Bayes, với một prior. Về thực hành, với prior phẳng và mẫu lớn, hai khoảng này thường gần trùng về số, nhưng ý nghĩa vẫn khác nhau.`,
    keyPoints: [
      { text: '95% là tính chất của quy trình lặp lại', keywords: ['quy trình', 'lặp lại', 'nhiều lần', 'dài hạn'], weight: 2 },
      { text: 'Giá trị thật cố định, khoảng mới ngẫu nhiên', keywords: ['cố định', 'khoảng ngẫu nhiên', 'phụ thuộc vào mẫu'], weight: 2 },
      { text: 'Khoảng cụ thể hoặc chứa hoặc không chứa', keywords: ['hoặc chứa', 'không chứa', 'chứa hoặc'], weight: 2 },
      { text: 'Khoảng khả tín mới là phát biểu xác suất', keywords: ['khả tín', 'credible', 'bayes', 'prior'] },
    ],
    followUps: ['Với prior phẳng, khoảng khả tín và khoảng tin cậy có trùng nhau không?', 'Khoảng 95% có chứa 95% dữ liệu không?'],
    commonMistakes: ['Nói có 95% xác suất tham số nằm trong khoảng đã tính.', 'Nói 95% dữ liệu nằm trong khoảng.'],
  },
  {
    id: 'iv-stats-confidence-interval-02',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-confidence-interval', 'stats-p-value'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Khoảng tin cậy và p-value liên hệ thế nào? Vì sao khi báo cáo A/B test nên có khoảng tin cậy? Tính thử với ví dụ cụ thể.',
    referenceAnswer: `Hai khái niệm là đối ngẫu: khoảng 95% của hiệu không chứa 0 tương ứng với \`p < 0,05\` hai phía, khi dùng cùng một cách tính SE. Nhưng khoảng cho nhiều thông tin hơn.

Ví dụ A có 10%, B có 11%, mỗi nhóm 10.000 người. \`SE = sqrt(0,09 / 10.000 + 0,0979 / 10.000) ≈ 0,433\` điểm phần trăm. Khoảng 95% là \`1 ± 1,96 × 0,433\`, tức từ 0,15 đến 1,85. P-value khoảng 0,021 chỉ cho biết hiệu khó có thể bằng 0.

Khoảng cho thêm ba điều. Thứ nhất là độ lớn: hiệu có thể gần như không đáng kể, cũng có thể gần 2 điểm phần trăm. Thứ hai là so sánh với nghiệp vụ: nếu cần tăng 0,5 điểm phần trăm để hòa vốn thì khoảng này chưa đủ để quyết định. Thứ ba là đọc được kết quả không có ý nghĩa: khoảng rộng nghĩa là chưa đủ dữ liệu, còn khoảng hẹp quanh 0 nghĩa là khá chắc không có hiệu ứng lớn. Hai trường hợp đó đều có \`p > 0,05\`, nhưng dẫn đến hai hành động khác nhau.`,
    keyPoints: [
      { text: 'Đối ngẫu: không chứa 0 ứng với p < 0,05', keywords: ['không chứa 0', 'đối ngẫu', 'chứa 0'], weight: 2 },
      { text: 'Tính đúng khoảng từ SE', keywords: ['1,96', 'sai số chuẩn', '0,433'] },
      { text: 'Khoảng cho biết độ lớn hiệu ứng', keywords: ['độ lớn', 'cỡ hiệu ứng', 'effect size'], weight: 2 },
      { text: 'So với mức hòa vốn, hoặc đọc kết quả không có ý nghĩa', keywords: ['hòa vốn', 'nghiệp vụ', 'khoảng rộng', 'chưa đủ dữ liệu'], weight: 2 },
    ],
    followUps: ['Vì sao đôi khi khoảng và p-value có vẻ mâu thuẫn trong phần mềm?', 'Nên báo cáo hiệu tuyệt đối hay tương đối?'],
    commonMistakes: ['Chỉ xem khoảng có chứa 0 không, rồi đối xử với nó như p-value.', 'So hai khoảng riêng thay vì tính khoảng cho hiệu.'],
  },
  {
    id: 'iv-stats-confidence-interval-03',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-confidence-interval', 'stats-variance-std', 'stats-binomial'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Dashboard hiển thị khoảng tin cậy của từng nhóm, và cả đội thường kết luận "chồng nhau là không khác nhau". Bạn giải thích và sửa dashboard thế nào? Ngoài ra, công thức ± có hỏng khi nào?',
    referenceAnswer: `Quy tắc chồng nhau là sai, vì nó so sánh \`SE₁ + SE₂\` trong khi SE của hiệu là \`sqrt(SE₁² + SE₂²)\`, nhỏ hơn. Với cùng SE, hai khoảng tách rời ứng với \`z ≈ 2,77\`, tức \`p ≈ 0,006\`, chặt hơn nhiều so với 0,05. Ví dụ A là 10% ± 1, B là 11,8% ± 1: hai khoảng chồng nhau, nhưng SE của hiệu ≈ 0,72, \`z ≈ 2,5\`, \`p ≈ 0,013\`. Hơn nữa, nếu hai nhóm có tương quan như cùng một người đo trước và sau, cách tính còn khác. Tôi sửa dashboard bằng cách hiển thị thẳng hiệu số và khoảng tin cậy của hiệu.

Công thức ± hỏng trong một số trường hợp. **Tỷ lệ gần 0 hoặc 1:** 0 trên 100 cho khoảng [0; 0], nên dùng Wilson, hoặc quy tắc \`3 / n\` làm cận trên. **Mẫu nhỏ, dữ liệu lệch mạnh:** CLT chưa đủ tốt, nên dùng bootstrap. **Quan sát không độc lập:** SE bị thấp, phải dùng SE cụm hoặc delta method. **Mẫu thiên lệch:** khoảng chỉ tính sai số ngẫu nhiên, không tính thiên lệch, nên càng nhiều dữ liệu càng hẹp quanh một giá trị sai.`,
    keyPoints: [
      { text: 'SE của hiệu nhỏ hơn tổng hai SE', keywords: ['sqrt', 'se của hiệu', 'không phải tổng', 'phương sai cộng'], weight: 2 },
      { text: 'Hiển thị khoảng cho chính hiệu số', keywords: ['khoảng của hiệu', 'hiệu số', 'cho hiệu'], weight: 2 },
      { text: 'Tỷ lệ cực đoan cần Wilson', keywords: ['wilson', '3 / n', 'quy tắc số 3', 'rule of three'] },
      { text: 'Không độc lập hoặc thiên lệch làm khoảng sai', keywords: ['không độc lập', 'bootstrap', 'thiên lệch', 'bias'] },
    ],
    followUps: ['Bootstrap tính khoảng tin cậy thế nào?', 'Khoảng rất hẹp từ dữ liệu rất lớn có thể gây hiểu nhầm ra sao?'],
    commonMistakes: ['Dùng quy tắc chồng nhau thay cho kiểm định.', 'Tin vào khoảng hẹp mà không kiểm tra độ đại diện của mẫu.'],
  },

  /* ---------- stats-type-errors ---------- */
  {
    id: 'iv-stats-type-errors-01',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-type-errors'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Phân biệt sai lầm loại I và loại II, kèm ví dụ thực tế. Chọn ngưỡng thế nào khi chi phí hai loại khác nhau?',
    referenceAnswer: `Sai lầm loại I là báo có hiệu ứng khi thực tế không có, xác suất là alpha nếu H0 đúng. Sai lầm loại II là bỏ sót hiệu ứng có thật, xác suất là beta. Power bằng \`1 - beta\`.

Ví dụ trong A/B test: loại I là ra mắt một tính năng vô dụng, tốn chi phí bảo trì. Loại II là bỏ đi một tính năng tốt, mất doanh thu mà không hề biết.

Với cỡ mẫu cố định, hai loại đánh đổi nhau: ngưỡng khắt khe hơn thì ít báo nhầm hơn nhưng bỏ sót nhiều hơn. Vì vậy phải chọn theo chi phí. Sàng lọc gian lận ban đầu chấp nhận nhiều báo nhầm hơn vì bỏ sót rất đắt, và đã có người kiểm tra lại ở bước sau. Ngược lại, thay đổi trang thanh toán có rủi ro cao thì cần alpha chặt.

Muốn giảm cả hai cùng lúc, phải tăng cỡ mẫu hoặc giảm phương sai của metric. Mức 5% và 80% chỉ là quy ước, không phải luật.`,
    keyPoints: [
      { text: 'Loại I là dương tính giả, loại II là âm tính giả', keywords: ['dương tính giả', 'false positive', 'báo nhầm'], weight: 2 },
      { text: 'Có ví dụ thực tế cho từng loại', keywords: ['ra mắt', 'bỏ sót', 'gian lận', 'tính năng'], weight: 2 },
      { text: 'Đánh đổi khi cỡ mẫu cố định', keywords: ['đánh đổi', 'trade off', 'tradeoff'] },
      { text: 'Chọn ngưỡng theo chi phí', keywords: ['chi phí', 'cost'], weight: 2 },
    ],
    followUps: ['Precision và Recall liên hệ thế nào với hai loại sai lầm này?', 'Vì sao thường đặt alpha nhỏ hơn beta?'],
    commonMistakes: ['Nhầm lẫn loại I và loại II.', 'Coi 5% và 80% là bắt buộc trong mọi tình huống.'],
  },
  {
    id: 'iv-stats-type-errors-02',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-type-errors', 'stats-binomial'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Statistical power là gì? Hãy ước tính cỡ mẫu bằng tay cho A/B test với tỷ lệ gốc 10%, muốn phát hiện mức tăng 1 điểm phần trăm. Điều gì xảy ra nếu chạy với ít người hơn?',
    referenceAnswer: `Power là xác suất thí nghiệm phát hiện được một hiệu ứng có độ lớn xác định, nếu hiệu ứng đó có thật, bằng \`1 - beta\`. Nó phụ thuộc vào tỷ số giữa hiệu ứng và SE, cùng với alpha.

Công thức xuất phát từ yêu cầu: khoảng cách giữa phân phối dưới H0 và dưới H1 phải bằng \`z_alpha + z_beta\` lần SE. Từ đó \`n ≈ 2 × (z_alpha + z_beta)² × p(1 - p) / d²\`. Với alpha 5% hai phía, power 80%: \`(1,96 + 0,84)² = 7,84\`, nên \`n ≈ 16 × p(1 - p) / d²\`.

Với \`p\` trung bình 10,5% và d = 1 điểm phần trăm: \`16 × 0,094 / 0,0001 ≈ 15.000\` người mỗi nhóm. Hiệu ứng nhỏ đi một nửa thì cần gấp 4 lần, khoảng 60.000 người.

Với ít người hơn, thí nghiệm thường bỏ sót: 10.000 người mỗi nhóm cho power khoảng 64%, 2.000 người chỉ khoảng 18%. Tệ hơn, những lần có ý nghĩa thường phóng đại hiệu ứng. Khi thiếu lưu lượng, tôi chọn metric nhạy hơn, giảm phương sai bằng CUPED, nhắm đến thay đổi lớn hơn, hoặc không chạy thí nghiệm đó nữa.`,
    keyPoints: [
      { text: 'Power là xác suất phát hiện hiệu ứng có thật', keywords: ['1 - beta', 'phát hiện', 'xác suất phát hiện'], weight: 2 },
      { text: 'Công thức hoặc rút gọn số 16', keywords: ['7,84', 'z alpha', 'p(1 - p)', 'công thức cỡ mẫu'], weight: 2 },
      { text: 'Kết quả khoảng 15.000 người mỗi nhóm', keywords: ['15.000', '15000', '15 nghìn'], weight: 2 },
      { text: 'Hiệu ứng nhỏ một nửa cần gấp 4 lần mẫu', keywords: ['gấp 4', '4 lần', 'bình phương'] },
      { text: 'Giải pháp khi thiếu mẫu', keywords: ['cuped', 'giảm phương sai', 'metric nhạy'] },
    ],
    followUps: ['Chọn MDE thế nào cho hợp lý?', 'CUPED giảm phương sai theo cơ chế nào?'],
    commonMistakes: ['Quên số 2 cho hai nhóm hoặc quên bình phương d.', 'Chọn MDE theo số người hiện có thay vì theo giá trị kinh doanh.'],
  },
  {
    id: 'iv-stats-type-errors-03',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-type-errors', 'stats-p-value'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao so sánh nhiều lần làm tăng sai lầm loại I? Với thí nghiệm có 3 biến thể và 5 metric, bạn xử lý thế nào?',
    referenceAnswer: `Mỗi phép thử có 5% báo nhầm khi H0 đúng. Có m phép thử độc lập thì xác suất không báo nhầm lần nào là \`0,95^m\`, nên \`P(ít nhất một báo nhầm) = 1 - 0,95^m\`. Với 20 phép thử đã là 64%. Mức 5% chỉ bảo vệ từng phép thử, trong khi quyết định lại dựa trên kết quả tốt nhất của cả nhóm.

Với 3 biến thể và 5 metric, có 15 so sánh, nên \`1 - 0,95^15 ≈ 54%\`, nếu coi là độc lập. Các metric thường tương quan nên con số thật thấp hơn, nhưng vẫn cao hơn 5% rất nhiều.

Tôi không hiệu chỉnh máy móc mà phân lớp. Chốt một metric chính cho quyết định, và các metric bảo vệ chỉ dùng để ngăn tác hại. Với 3 biến thể so với đối chứng, tôi hiệu chỉnh theo số so sánh, bằng Holm vì nó có power tốt hơn Bonferroni. Các metric còn lại và phân khúc là khám phá, nên dùng Benjamini-Hochberg để kiểm soát FDR, và kiểm chứng lại sau. Đánh đổi cần nói rõ: hiệu chỉnh chặt làm power giảm. Bonferroni với 20 phép thử cần gần gấp đôi cỡ mẫu, nên phải tính ngay ở bước thiết kế.`,
    keyPoints: [
      { text: 'Công thức 1 - 0,95^m', keywords: ['0,95^', '1 - 0,95', 'ít nhất một', 'fwer'], weight: 2 },
      { text: 'Tính được khoảng 54% cho 15 so sánh', keywords: ['54 phần trăm', '15 so sánh', '0,95^15'] },
      { text: 'Chốt metric chính', keywords: ['metric chính', 'primary metric'], weight: 2 },
      { text: 'Dùng Bonferroni, Holm hoặc Benjamini-Hochberg', keywords: ['bonferroni', 'holm', 'benjamini', 'fdr'], weight: 2 },
      { text: 'Hiệu chỉnh làm giảm power', keywords: ['giảm power', 'power', 'cỡ mẫu'] },
    ],
    followUps: ['Metric tương quan với nhau thì phép hiệu chỉnh thay đổi thế nào?', 'FWER và FDR khác nhau ra sao về ý nghĩa nghiệp vụ?'],
    commonMistakes: ['Cộng thẳng 5% × 20 = 100%.', 'Hiệu chỉnh mọi metric như nhau, không phân biệt metric chính và metric khám phá.'],
  },
  {
    id: 'iv-stats-type-errors-04',
    topicId: 'statistics',
    category: 'stats-inference',
    conceptIds: ['stats-type-errors', 'stats-p-value'],
    interviewTypes: ['ds'],
    levels: ['senior'],
    difficulty: 'chuyen-sau',
    firstPrinciples: true,
    question: 'Một đội có nhiều thí nghiệm power thấp, chỉ ra mắt những thí nghiệm thắng, và tổng hiệu quả sau ra mắt luôn thấp hơn dự kiến. Giải thích và đề xuất thay đổi. Tính power sau thí nghiệm có giúp không?',
    referenceAnswer: `Đây là Winner's Curse. Ở thí nghiệm power thấp, chỉ những ước lượng cao bất thường mới vượt ngưỡng. Ví dụ hiệu ứng thật 1 điểm phần trăm, 2.000 người mỗi nhóm, SE ≈ 0,97: kết quả chỉ có ý nghĩa khi hiệu quan sát từ 1,9 trở lên, nên hiệu ứng được báo cáo luôn gấp ít nhất 1,9 lần sự thật. Cộng các con số đã bị chọn lọc đó lại, tổng dự kiến phải cao hơn thực tế. Ngoài ra, power thấp còn làm tỷ lệ báo nhầm trong số kết quả thắng tăng lên, theo logic Bayes.

Tính power từ hiệu ứng quan sát sau thí nghiệm không giúp được, vì đó chỉ là phép biến đổi của p-value, như Hoenig và Heisey (2001) chỉ ra.

Tôi đề xuất: tính power trước với MDE có ý nghĩa kinh doanh, và không chạy thí nghiệm thiếu power. Giảm phương sai bằng CUPED. Hiệu chỉnh ước lượng bằng shrinkage, với prior từ các thí nghiệm trước, thay vì báo cáo số thô. Giữ lại một nhóm holdout dài hạn để đo tổng hiệu quả thật. Với các quyết định lớn, chạy lại một thí nghiệm xác nhận, vì lần chạy mới không bị chọn lọc.`,
    keyPoints: [
      { text: 'Winner\'s Curse: chỉ ước lượng cao mới vượt ngưỡng', keywords: ['winner', 'type m', 'phóng đại', 'chọn lọc'], weight: 2 },
      { text: 'Power thấp làm tăng tỷ lệ báo nhầm trong kết quả thắng', keywords: ['báo nhầm', 'false discovery', 'tỷ lệ phát hiện sai'] },
      { text: 'Post-hoc power không thêm thông tin', keywords: ['biến đổi của p', 'post hoc', 'hoenig'], weight: 2 },
      { text: 'Giải pháp: power trước, shrinkage, holdout, chạy lại', keywords: ['shrinkage', 'holdout', 'chạy lại', 'xác nhận', 'cuped'], weight: 2 },
    ],
    followUps: ['Shrinkage hoạt động thế nào với dữ liệu các thí nghiệm trước?', 'Chi phí của holdout dài hạn là gì?'],
    commonMistakes: ['Giải thích bằng hiệu ứng mới lạ mà không nhắc đến chọn lọc.', 'Tính post-hoc power để bào chữa cho kết quả.'],
  },
])
