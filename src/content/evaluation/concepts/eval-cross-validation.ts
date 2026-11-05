import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-cross-validation',
  summary:
    'Cross Validation huấn luyện và đánh giá trên nhiều cách chia để có ước lượng ổn định hơn. Cách chia phải giống thực tế: có thứ tự thời gian dùng Time Series Split, có nhóm phụ thuộc dùng Group K-Fold.',
  tags: ['Chia dữ liệu', 'K-Fold', 'Time Series', 'First Principles'],
  related: ['eval-train-val-test', 'eval-overfitting', 'eda-leakage', 'eda-imbalanced', 'dq-time-series'],
  sections: {
    definition: `**Cross Validation (Kiểm định chéo)** ước lượng khả năng tổng quát bằng cách chia dữ liệu thành nhiều phần, rồi lần lượt dùng mỗi phần để đánh giá và phần còn lại để huấn luyện.

Dạng phổ biến nhất là **K-Fold:** chia thành K phần gọi là **fold**. Mỗi dòng được đánh giá đúng một lần, kết quả là trung bình và độ phân tán của K điểm số.`,

    origin: `Cách trước đó là chia một lần ([[eval-train-val-test|Hold-out]]), có hai điểm yếu: kết quả phụ thuộc vào việc dòng nào rơi vào đâu, và phần giữ lại không được dùng để học. Stone và Geisser hệ thống hóa ý tưởng thay thế vào giữa thập niên 1970: mọi dòng đều đóng cả hai vai trò, nhưng không dòng nào vừa học vừa kiểm tra trong cùng một lần.`,

    whyUse: `- **Giảm phụ thuộc vào một lần chia,** nhất là khi dữ liệu ít.
- **Thấy được độ dao động** giữa các fold, điều một lần chia không cho biết.
- **Có dự đoán ngoài fold** cho mọi dòng, dùng để chọn ngưỡng hoặc hiệu chỉnh xác suất.`,

    mechanism: `**K-Fold:** chia K fold, lặp K lần với một fold để đánh giá và K-1 fold để học, rồi tổng hợp. Grid Search 20 cấu hình với 5 fold cần 100 lần huấn luyện, chưa kể lần huấn luyện lại sau cùng.

**Giả định quan trọng:** K-Fold ngẫu nhiên xem các dòng là độc lập và cùng phân phối (i.i.d.). Khi dữ liệu không như vậy, cần đổi cách chia:

- **Stratified K-Fold:** giữ tỷ lệ lớp trong mỗi fold, vì với [[eda-imbalanced|dữ liệu mất cân bằng]] một fold có thể có quá ít ca dương. Trong scikit-learn, \`cv\` mặc định là 5 fold, và dùng Stratified khi mô hình là classifier với nhãn nhị phân hoặc đa lớp.
- **Group K-Fold:** cần khi nhiều dòng thuộc một nhóm phụ thuộc lẫn nhau, như bệnh nhân, khách hàng, thiết bị. Mỗi nhóm chỉ nằm ở một phía, để đo khả năng tổng quát sang **nhóm chưa từng thấy**.
- **Time Series Split:** cần khi dữ liệu có thứ tự thời gian và tự tương quan. Ở split thứ k, tập học là k phần đầu và tập đánh giá là phần ngay sau đó, nên không học từ tương lai. Tham số \`gap\` bỏ bớt các mẫu ngay trước tập đánh giá, hữu ích khi nhãn cần thời gian mới có. Các mẫu nên cách đều nhau để các fold so sánh được.

**Chọn thế nào?** Hãy hỏi: khi triển khai, mô hình sẽ gặp gì? Cách chia sai không báo lỗi, nó chỉ cho điểm đẹp hơn sự thật.

**Tránh rò rỉ trong fold:** co giãn, điền thiếu, Target Encoding, chọn đặc trưng đều phải fit lại trong từng fold, thường bằng Pipeline.

**Khi vừa tinh chỉnh vừa ước lượng:** điểm của cấu hình tốt nhất bị lạc quan, vì nó là giá trị lớn nhất trong nhiều phép đo có nhiễu. **Nested CV** dùng vòng trong để chọn cấu hình, vòng ngoài để đánh giá cả quy trình chọn.`,

    diagram: {
      mermaid: `flowchart TD
  A["Khi triển khai, mô hình sẽ gặp gì?"] --> B["Dữ liệu tương lai?"]
  B -->|"Có"| C["Time Series Split"]
  B -->|"Không"| D["Thực thể mới chưa từng thấy?"]
  D -->|"Có"| E["Group K-Fold"]
  D -->|"Không"| F["Lớp mất cân bằng?"]
  F -->|"Có"| G["Stratified K-Fold"]`,
      caption: 'Chọn cách chia theo môi trường triển khai. Không rơi vào nhánh nào thì K-Fold thông thường là đủ.',
    },

    example: `Mô hình đọc ảnh X-quang có 50.000 ảnh từ 2.000 bệnh nhân. K-Fold ngẫu nhiên cho AUC 0,97, vì ảnh của một người nằm ở cả hai phía và mô hình nhận ra người thay vì nhận ra bệnh. Group K-Fold theo mã bệnh nhân cho AUC 0,83, gần hơn với những gì bệnh viện sẽ thấy.

5 fold cho các điểm 0,82, 0,84, 0,81, 0,85 và 0,83: trung bình 0,83, độ lệch chuẩn khoảng 0,014. Một cấu hình khác cao hơn 0,002 thì chưa đủ để kết luận là tốt hơn.`,

    prosCons: {
      pros: [
        '**Tận dụng dữ liệu:** mọi dòng đều được học và được đánh giá.',
        '**Linh hoạt:** đổi cách chia để khớp với cấu trúc dữ liệu.',
      ],
      cons: [
        '**Tốn tài nguyên:** chi phí nhân theo K và số cấu hình.',
        '**Độ lệch chuẩn giữa các fold không phải sai số chuẩn thật,** vì các tập học chồng lấn nên dễ đánh giá thấp độ bất định.',
        '**Time Series Split có ít dữ liệu học ở các fold đầu,** nên điểm không đồng đều.',
      ],
    },

    whenToUse: {
      use: ['Dữ liệu vừa hoặc ít, một lần chia không ổn định.', 'So sánh mô hình hoặc tinh chỉnh siêu tham số.'],
      avoid: [
        'Không dùng K-Fold ngẫu nhiên cho chuỗi thời gian hoặc dữ liệu có nhóm phụ thuộc.',
        'Không cần khi dữ liệu rất lớn hoặc huấn luyện mất nhiều ngày.',
        'Không lấy điểm CV của cấu hình tốt nhất làm con số báo cáo cuối cùng.',
      ],
    },

    comparison: {
      headers: ['Cách chia', 'Khi nào cần', 'Bảo đảm điều gì', 'Đánh đổi'],
      rows: [
        ['K-Fold', 'Dòng gần như độc lập', 'Mỗi dòng đánh giá một lần', 'Sai nếu có thời gian hoặc nhóm'],
        ['Stratified K-Fold', 'Phân loại, lớp lệch', 'Tỷ lệ lớp giống nhau', 'Không xử lý nhóm, thời gian'],
        ['Group K-Fold', 'Nhiều dòng một thực thể', 'Nhóm không nằm ở cả hai phía', 'Fold có thể lệch kích thước'],
        ['Time Series Split', 'Có thứ tự thời gian', 'Không học từ tương lai', 'Fold đầu ít dữ liệu học'],
        ['Nested CV', 'Vừa tinh chỉnh vừa ước lượng', 'Không lạc quan do chọn', 'Rất tốn tài nguyên'],
      ],
    },

    misconceptions: [
      {
        myth: 'Cross Validation tạo ra mô hình cuối cùng.',
        truth: 'CV đánh giá một quy trình. Sau khi chốt cấu hình, ta huấn luyện lại trên toàn bộ dữ liệu học.',
      },
      {
        myth: 'Đã dùng Cross Validation thì không cần Test set.',
        truth: 'Nếu CV dùng để chọn cấu hình, điểm của nó đã bị ảnh hưởng bởi việc chọn. Vẫn cần Test độc lập, hoặc Nested CV.',
      },
      {
        myth: 'Group K-Fold luôn đúng hơn K-Fold.',
        truth: 'Nó đúng khi mô hình sẽ gặp nhóm mới. Nếu chỉ dự đoán tiếp cho khách hàng đã biết, chia theo nhóm có thể quá bi quan.',
      },
    ],
  },
})
