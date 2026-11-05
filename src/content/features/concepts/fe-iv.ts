import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-iv',
  summary:
    'IV đo khoảng cách giữa phân phối good và bad trên các nhóm của một biến, dùng để sàng lọc biến trong credit scoring. Ngưỡng chỉ là tham khảo, phụ thuộc cách chia nhóm, và IV cao bất thường thường là dấu hiệu rò rỉ.',
  tags: ['Chọn đặc trưng', 'Credit Scoring', 'Rò rỉ dữ liệu', 'First Principles'],
  related: ['fe-woe', 'fe-selection', 'fe-binning', 'eda-leakage', 'dq-distribution-comparison'],
  sections: {
    definition: `**Information Value (IV, Giá trị thông tin)** tóm tắt mức độ một biến tách được good và bad:

\`IV = Σ (%Good_i - %Bad_i) × ln(%Good_i / %Bad_i)\`

Thừa số thứ hai chính là [[fe-woe|WoE]] của nhóm i. Vì hai thừa số luôn cùng dấu, **mỗi nhóm đóng góp một giá trị không âm**. IV bằng 0 khi hai phân phối trùng nhau, và không có cận trên.`,

    origin: `Khi có hàng trăm biến ứng viên, người xây thẻ điểm cần sàng lọc nhanh trước khi lập mô hình. Hệ số tương quan chỉ đo quan hệ tuyến tính và không hợp với biến phân loại. IV làm việc trên các nhóm, nên bắt được quan hệ phi tuyến và dùng chung cho cả hai loại biến.

Về lý thuyết, IV là phân kỳ Jeffreys, tức tổng hai chiều của Kullback-Leibler divergence giữa phân phối good và bad.`,

    whyUse: `- **Xếp hạng nhanh** hàng trăm biến mà không cần huấn luyện mô hình.
- **Không phụ thuộc quy ước dấu của WoE:** đổi tử và mẫu thì cả hai thừa số cùng đổi dấu, nên IV không đổi.
- **Ít bị ảnh hưởng bởi lấy mẫu phân tầng theo nhãn,** vì tính trên phần trăm theo cột.`,

    mechanism: `**Cách đọc IV.** Các ngưỡng thường gặp, gốc từ sách của Siddiqi về thẻ điểm tín dụng:

| IV | Sức dự đoán |
|---|---|
| Dưới 0.02 | Gần như không có |
| 0.02 đến 0.1 | Yếu |
| 0.1 đến 0.3 | Trung bình |
| Từ 0.3 trở lên | Mạnh |

Nhiều tài liệu thực hành thêm một mức: **trên 0.5 là đáng nghi**, cần kiểm tra trước khi tin. Đây là quy ước kinh nghiệm, **không phải kiểm định thống kê**, và các tác giả còn gán nhãn khác nhau. Hãy dùng để so sánh tương đối, không dùng như luật.

**IV phụ thuộc cách chia nhóm.** Khi gộp hai nhóm, IV giảm, và chỉ giữ nguyên nếu hai nhóm có cùng odds. Ngược lại, chia càng nhỏ thì IV càng tăng, kể cả khi phần tăng chỉ là nhiễu. Vì vậy so sánh hai biến có số nhóm rất khác nhau dễ gây hiểu sai.

**Vì sao IV quá cao là dấu hiệu rò rỉ?** Trong tín dụng, một biến đơn lẻ hiếm khi tách gần như hoàn hảo good và bad. Khi điều đó xảy ra, câu hỏi đầu tiên là: **biến này có được ghi nhận sau thời điểm dự đoán không?** Các biến như trạng thái thu hồi nợ thực chất là hệ quả của nhãn, nên IV rất cao nhưng không tồn tại lúc ra quyết định. Xem [[eda-leakage]].

IV cao không tự nó chứng minh rò rỉ. Nguyên nhân còn có thể là chia nhóm quá nhỏ, lỗi điền dữ liệu, hoặc một biến thật sự mạnh như điểm tín dụng bên ngoài. Cần kiểm tra thời điểm phát sinh, cách tính biến, và IV trên giai đoạn sau đó.

**Giới hạn:** IV xét từng biến riêng lẻ, nên không thấy tương tác và không biết hai biến có trùng thông tin hay không.

**Liên hệ với PSI.** Population Stability Index có cùng dạng công thức. IV so sánh good với bad, còn PSI so sánh hai giai đoạn, xem [[dq-distribution-comparison]].`,

    example: `Tiếp ví dụ thâm niên ở trang [[fe-woe]] với 9.000 good và 1.000 bad. Ba nhóm đóng góp:

\`(0.1667 - 0.30) × (-0.588) = 0.078\`, \`0\`, và \`(0.3333 - 0.20) × 0.511 = 0.068\`.

Vậy IV = 0.146, ở mức trung bình.

Giả sử biến \`đã chuyển thu hồi nợ\` có 8.900 good, 50 bad ở nhóm Không và 100 good, 950 bad ở nhóm Có. IV xấp xỉ 6.98, cao hơn mọi mốc thông thường. Khoản vay được chuyển thu hồi nợ **vì đã quá hạn**, nên đây là hệ quả của nhãn và phải loại khỏi mô hình.`,

    prosCons: {
      pros: [
        '**Nhanh và dễ giải thích,** trên cùng một bảng với WoE.',
        '**Bắt được quan hệ phi tuyến** sau khi chia nhóm.',
        '**Giúp phát hiện sớm rò rỉ** nhờ các giá trị bất thường.',
      ],
      cons: [
        '**Phụ thuộc cách chia nhóm,** nên không so sánh được tuyệt đối.',
        '**Đơn biến:** bỏ qua tương tác và thông tin trùng lặp.',
        '**Dùng nhãn,** nên sàng lọc trên toàn bộ dữ liệu làm kết quả test quá lạc quan.',
      ],
    },

    whenToUse: {
      use: [
        'Sàng lọc biến cho mô hình logistic với nhãn nhị phân, nhất là trong tín dụng.',
        'Rà soát rò rỉ: xem từ trên xuống các biến có IV cao nhất.',
      ],
      avoid: [
        'Dùng làm tiêu chí duy nhất để chốt danh sách biến, xem [[fe-selection]].',
        'So sánh biến có số nhóm rất khác nhau mà không kiểm soát cách chia.',
      ],
    },

    comparison: {
      headers: ['Thước đo', 'Đo cái gì', 'Quan hệ phi tuyến', 'Điểm yếu chính'],
      rows: [
        ['IV', 'Khoảng cách phân phối good và bad', 'Có, sau khi chia nhóm', 'Phụ thuộc cách chia nhóm'],
        ['Hệ số tương quan', 'Quan hệ tuyến tính', 'Không', 'Bỏ sót quan hệ cong'],
        ['Mutual Information', 'Phụ thuộc thống kê nói chung', 'Có', 'Cần nhiều mẫu để ước lượng'],
      ],
    },

    misconceptions: [
      {
        myth: 'IV càng cao thì biến càng tốt.',
        truth: 'Đến một mức nào đó, IV cao là dấu hiệu cần điều tra: biến có sinh ra sau thời điểm dự đoán không, cách chia nhóm có quá nhỏ không.',
      },
      {
        myth: 'Các ngưỡng IV là tiêu chuẩn thống kê phải tuân theo.',
        truth: 'Đó là kinh nghiệm thực hành. Biến IV 0.05 vẫn có thể có ích khi kết hợp với biến khác.',
      },
      {
        myth: 'Tăng số nhóm là cách tốt để cải thiện biến.',
        truth: 'IV tăng khi chia nhỏ, một phần chỉ vì nhiễu. Sức dự đoán thật phải được xác nhận ngoài mẫu.',
      },
    ],
  },
})
