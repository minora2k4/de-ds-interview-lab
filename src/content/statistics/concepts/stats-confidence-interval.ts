import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-confidence-interval',
  summary:
    'Khoảng tin cậy 95% do một quy trình tạo ra, mà khi lặp lại lấy mẫu nhiều lần thì khoảng 95% số khoảng chứa giá trị thật. Con số 95% thuộc về quy trình, không thuộc về một khoảng cụ thể.',
  tags: ['Khoảng tin cậy', 'Tần suất', 'Standard Error', 'First Principles'],
  related: ['stats-hypothesis', 'stats-p-value', 'stats-variance-std', 'stats-normal', 'stats-binomial', 'stats-bayes'],
  sections: {
    definition: `**Confidence Interval (Khoảng tin cậy)** là khoảng ước lượng tính từ mẫu, bằng một quy trình mà nếu lặp lại lấy mẫu rất nhiều lần thì một tỷ lệ xác định số khoảng tạo ra sẽ chứa giá trị thật.

Dạng phổ biến: \`ước lượng ± giá trị tới hạn × SE\`, với mức 95% thì \`ước lượng ± 1,96 × SE\`.

**Con số 95% là tính chất của quy trình,** không phải của một khoảng đã tính xong.`,

    origin: `Bài toán thực tế là một con số đơn lẻ không cho biết nó chắc chắn đến đâu. Mức tăng 1 điểm phần trăm từ 100 người rất khác mức tăng đó từ 1 triệu người.

Cách làm kém hơn là chỉ báo ước lượng điểm, hoặc chỉ báo p-value, vốn không nói hiệu ứng lớn bao nhiêu. Neyman xây dựng lý thuyết khoảng tin cậy năm 1937 để đưa ra một khoảng, với tỷ lệ bao phủ được kiểm soát trong dài hạn.`,

    whyUse: `- **Cho cả độ lớn và độ không chắc chắn** trong một kết quả, điều [[stats-p-value|p-value]] không làm được.
- **So được với ngưỡng nghiệp vụ:** cả khoảng có vượt mức hòa vốn không?
- **Phân biệt được hai kiểu "không có ý nghĩa":** khoảng rộng nghĩa là chưa biết gì, khoảng hẹp quanh 0 nghĩa là khá chắc không có hiệu ứng lớn.`,

    mechanism: `**Cách hiểu theo tần suất.** Giá trị thật là cố định, còn khoảng mới là ngẫu nhiên, vì nó phụ thuộc vào mẫu lấy được. Hãy tưởng tượng lấy 100 mẫu và tính 100 khoảng: khoảng 95 khoảng sẽ chứa giá trị thật. Sau khi đã tính xong một khoảng, nó hoặc chứa, hoặc không chứa giá trị thật. Sổ tay thống kê của NIST và Greenland cùng cộng sự (2016) đều nói rõ điều này.

Muốn phát biểu "95% xác suất giá trị thật nằm trong khoảng này", phải dùng **Credible Interval (Khoảng khả tín)** của [[stats-bayes|Bayes]], với một prior.

**Vì sao là 1,96.** Theo [[stats-normal|CLT]], ước lượng xấp xỉ chuẩn quanh giá trị thật, và 95% diện tích nằm trong ±1,96 SE.

**Độ rộng phụ thuộc gì.** Độ rộng tỷ lệ với \`1 / sqrt(n)\`, nên muốn hẹp một nửa phải tăng mẫu gấp 4 lần. Mức tin cậy càng cao thì khoảng càng rộng: 99% dùng 2,576 thay vì 1,96.

**Đối ngẫu với kiểm định.** Khoảng 95% của hiệu không chứa 0 tương đương với \`p < 0,05\` hai phía, nếu dùng cùng một cách tính SE. Khoảng còn cho biết thêm những giá trị nào phù hợp với dữ liệu.

**Hai khoảng chồng nhau vẫn có thể khác biệt có ý nghĩa.** SE của hiệu là \`sqrt(SE₁² + SE₂²)\`, nhỏ hơn \`SE₁ + SE₂\`. Vì vậy phải tính khoảng cho chính hiệu số, thay vì nhìn hai khoảng riêng.

**Tỷ lệ gần 0 hoặc 1.** Công thức ± ở trên hoạt động kém: 0 người mua trên 100 người cho khoảng [0; 0], rất vô lý. Nên dùng khoảng Wilson. Mẹo nhanh là "quy tắc số 3": cận trên 95% xấp xỉ \`3 / n\`, ở đây là 3%.`,

    example: `A/B test: A 10%, B 11%, mỗi nhóm 10.000 người. Hiệu là 1 điểm phần trăm.

- \`SE = sqrt(0,1 × 0,9 / 10.000 + 0,11 × 0,89 / 10.000) ≈ 0,433\` điểm phần trăm.
- Sai số biên: \`1,96 × 0,433 ≈ 0,85\`.
- Khoảng 95%: **từ 0,15 đến 1,85 điểm phần trăm.**

Khoảng không chứa 0, nên khớp với \`p ≈ 0,021\`. Nhưng nếu tính năng cần tăng ít nhất 0,5 điểm phần trăm để hòa vốn, khoảng này chứa cả giá trị dưới và trên mức đó, nên chưa đủ để quyết định.

Tăng mỗi nhóm lên 40.000 người: sai số biên còn khoảng 0,42. Nếu ước lượng vẫn là 1, khoảng sẽ từ 0,58 đến 1,42, nằm trọn trên mức hòa vốn.

**Ví dụ về chồng nhau:** A là 10% ± 1, B là 11,8% ± 1, nên [9; 11] và [10,8; 12,8] chồng nhau. Mỗi nhóm có SE ≈ 0,51, nên SE của hiệu ≈ 0,72, \`z = 1,8 / 0,72 ≈ 2,5\`, \`p ≈ 0,013\`. Khác biệt vẫn có ý nghĩa.`,

    prosCons: {
      pros: [
        '**Nhiều thông tin hơn p-value:** cho cả độ lớn và độ chính xác.',
        '**Dùng trực tiếp cho quyết định,** bằng cách so với ngưỡng nghiệp vụ.',
        '**Lộ ra thí nghiệm thiếu mẫu** qua độ rộng của khoảng.',
      ],
      cons: [
        '**Rất dễ đọc sai** thành xác suất của giá trị thật.',
        '**Chỉ tính sai số do lấy mẫu,** không tính thiên lệch như lỗi đo hay mẫu không đại diện.',
        '**Công thức đơn giản kém chính xác** với mẫu nhỏ, tỷ lệ cực đoan, hoặc dữ liệu đuôi dài.',
      ],
    },

    whenToUse: {
      use: [
        'Khi báo cáo mọi kết quả A/B test, kèm theo hoặc thay cho p-value.',
        'Khi kết quả không có ý nghĩa và cần biết là không có hiệu ứng hay chưa đủ dữ liệu.',
        'Khi cần so sánh với mức hòa vốn hoặc biên tương đương.',
      ],
      avoid: [
        'Không so sánh hai nhóm bằng cách nhìn hai khoảng có chồng nhau không.',
        'Không dùng công thức xấp xỉ chuẩn cho tỷ lệ rất nhỏ với mẫu nhỏ.',
        'Không dùng khoảng của mẫu thiên lệch để suy ra tổng thể.',
      ],
    },

    comparison: {
      intro: 'Ba loại khoảng thường bị nhầm lẫn:',
      headers: ['Loại khoảng', 'Nói về', 'Cách hiểu đúng', 'Khi tăng n'],
      rows: [
        ['Confidence Interval', 'Tham số, như mean', '95% số khoảng từ quy trình chứa giá trị thật', 'Hẹp dần về 0'],
        ['Credible Interval', 'Tham số, theo Bayes', '95% xác suất giá trị thật nằm trong, theo prior và dữ liệu', 'Hẹp dần về 0'],
        ['Prediction Interval', 'Một quan sát mới', '95% khả năng quan sát mới nằm trong, nếu mô hình đúng', 'Không hẹp về 0'],
      ],
    },

    misconceptions: [
      {
        myth: 'Có 95% xác suất giá trị thật nằm trong khoảng [0,15; 1,85].',
        truth: 'Theo nghĩa tần suất, giá trị thật là cố định và khoảng này hoặc chứa, hoặc không chứa nó. 95% là tỷ lệ thành công dài hạn của quy trình.',
      },
      {
        myth: '95% dữ liệu nằm trong khoảng tin cậy.',
        truth: 'Khoảng tin cậy nói về tham số, không nói về từng quan sát. Nó hẹp dần khi tăng n, còn độ phân tán của dữ liệu thì không.',
      },
      {
        myth: 'Làm lại thí nghiệm thì 95% khả năng ước lượng mới rơi vào khoảng này.',
        truth: 'Trong trường hợp đơn giản nhất, con số này chỉ khoảng 83%, như Greenland cùng cộng sự (2016) đã chỉ ra, vì cả hai ước lượng đều dao động.',
      },
      {
        myth: 'Hai khoảng chồng nhau nghĩa là hai nhóm không khác nhau.',
        truth: 'Không suy ra được. Với cùng SE, hai khoảng tách rời ứng với mức `p` khoảng 0,006, nghiêm ngặt hơn nhiều so với 0,05.',
      },
    ],
  },
})
