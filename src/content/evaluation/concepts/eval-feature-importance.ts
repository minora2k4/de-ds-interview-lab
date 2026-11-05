import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-feature-importance',
  summary:
    'Feature Importance đo mức mô hình dựa vào từng đặc trưng. Impurity Importance nhanh nhưng thiên về biến nhiều giá trị, Permutation Importance đo trên dữ liệu giữ lại, SHAP giải thích từng dự đoán. Không phương pháp nào cho biết nhân quả.',
  tags: ['Diễn giải', 'SHAP', 'Permutation', 'First Principles'],
  related: ['fe-selection', 'eda-leakage', 'eda-correlation', 'stats-correlation-causation', 'eval-overfitting'],
  sections: {
    definition: `**Feature Importance (Mức độ quan trọng của đặc trưng)** là nhóm phương pháp đo mô hình dựa vào mỗi đặc trưng đến đâu. Ba cách phổ biến:

- **Impurity Importance (MDI, Mean Decrease in Impurity):** tổng mức giảm độ lẫn nhờ đặc trưng trong các cây.
- **Permutation Importance:** điểm số giảm bao nhiêu khi xáo trộn một cột.
- **SHAP (SHapley Additive exPlanations):** chia phần đóng góp vào từng dự đoán cho các đặc trưng.`,

    origin: `Mô hình phức tạp không có hệ số để đọc như hồi quy tuyến tính. Breiman (2001) đưa ra cả MDI và Permutation cùng với Random Forest. Strobl và cộng sự (2007) chỉ ra MDI bị lệch về các biến có nhiều giá trị. Lundberg và Lee (2017) dựa trên giá trị Shapley của lý thuyết trò chơi để đưa ra SHAP, giải thích được từng dự đoán.`,

    whyUse: `- **Phát hiện rò rỉ:** một đặc trưng quan trọng bất thường thường là dấu hiệu của [[eda-leakage|rò rỉ dữ liệu]].
- **Giải thích từng quyết định,** như lý do từ chối một khoản vay.
- **Hỗ trợ [[fe-selection|chọn đặc trưng]].**`,

    mechanism: `**Impurity Importance** cộng mức giảm độ lẫn tại mọi lần tách dùng đặc trưng đó, có trọng số theo số mẫu. Nó gần như miễn phí nhưng có hai điểm yếu, được tài liệu scikit-learn nêu rõ:

- **Thiên về biến nhiều giá trị:** biến có nhiều giá trị khác nhau cho nhiều điểm tách để thử, nên dễ tìm được một điểm tốt do may rủi. Biến nhị phân chỉ có một điểm tách.
- **Tính trên Train:** khi mô hình overfit, đặc trưng vô nghĩa vẫn có điểm cao vì nó thực sự được dùng để khớp nhiễu.

**Permutation Importance** đo điểm số gốc trên tập giữ lại, xáo trộn một cột để phá quan hệ với nhãn, đo lại, rồi lấy độ giảm, lặp nhiều lần để có độ dao động. Nó dùng được cho mọi mô hình và mọi chỉ số, không có lệch về biến nhiều giá trị. Giới hạn:

- **Đặc trưng tương quan:** xáo một cột thì mô hình vẫn dùng được cột kia, nên cả hai đều có điểm thấp. Cách xử lý là gom cụm các biến tương quan và giữ một đại diện.
- **Tạo tổ hợp phi thực tế,** như người 5 tuổi có bằng đại học.
- **Chi phí** bằng số cột nhân số lần lặp nhân thời gian dự đoán.

**SHAP** tính đóng góp trung bình của đặc trưng trên mọi tập con đặc trưng có thể, sao cho \`dự đoán = giá trị cơ sở + tổng đóng góp\`. Tính chính xác cần duyệt theo cấp số mũ, nên có **TreeSHAP** cho cây và **KernelSHAP** để xấp xỉ. Lấy trung bình giá trị tuyệt đối sẽ có mức quan trọng toàn cục. Giới hạn: đặc trưng tương quan bị chia công theo cách phụ thuộc vào phương pháp, và với nhiều mô hình cây, giá trị cộng trên thang log-odds chứ không phải xác suất.`,

    diagram: {
      mermaid: `flowchart TD
  A["Câu hỏi cần trả lời là gì?"] --> B["Vì sao dự đoán này ra kết quả đó?"]
  A --> C["Đặc trưng nào giúp tổng quát hóa?"]
  A --> D["Cần xem nhanh trên cây?"]
  B --> E["SHAP"]
  C --> F["Permutation trên tập giữ lại"]
  D --> G["Impurity, biết rõ giới hạn"]`,
      caption: 'Ba phương pháp trả lời ba câu hỏi khác nhau, nên điểm số của chúng không so sánh trực tiếp được.',
    },

    example: `Mô hình dự đoán khách rời bỏ có 30 đặc trưng, trong đó có \`ma_khach_hash\` với 2 triệu giá trị khác nhau:

- **Impurity Importance** xếp cột này thứ 2, điểm 0,21.
- **Permutation trên Validation** cho độ giảm AUC là 0,001. Cột này được dùng để khớp nhiễu, không có giá trị tổng quát.
- Bỏ cột đi, AUC trên Validation gần như giữ nguyên.

Ví dụ Titanic của scikit-learn cũng vậy: một cột số ngẫu nhiên được MDI xếp vào nhóm quan trọng nhất.

Một trường hợp khác: \`so_ngay_tu_khi_yeu_cau_huy\` có độ giảm AUC 0,25, vượt xa các đặc trưng khác. Đặc trưng này chỉ có sau khi khách quyết định rời đi, nên đây là rò rỉ.

SHAP cho một khách: cơ sở 0,10, số lần khiếu nại +0,25, thời gian gắn bó -0,03, gói cước +0,02, nên dự đoán là 0,34.`,

    prosCons: {
      pros: [
        '**Impurity:** có sẵn sau khi huấn luyện.',
        '**Permutation:** phản ánh khả năng tổng quát, dùng được cho mọi mô hình.',
        '**SHAP:** giải thích từng dự đoán, có cơ sở lý thuyết rõ ràng.',
      ],
      cons: [
        '**Impurity:** có thể đề cao đặc trưng vô nghĩa.',
        '**Permutation:** cho điểm thấp với các biến tương quan.',
        '**SHAP:** tốn tài nguyên với mô hình không phải cây, dễ bị hiểu thành nhân quả.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng Permutation trên tập giữ lại làm mặc định.',
        'Dùng SHAP khi cần giải thích từng dự đoán.',
        'Thêm một cột ngẫu nhiên làm mốc: đặc trưng nào kém hơn mốc thì đáng nghi ngờ.',
      ],
      avoid: [
        'Không dùng Impurity Importance khi có biến nhiều giá trị hoặc mô hình đang overfit.',
        'Không đọc kết quả khi mô hình quá kém.',
        'Không dùng để kết luận nhân quả.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Impurity (MDI)', 'Permutation', 'SHAP'],
      rows: [
        ['Phạm vi', 'Toàn cục', 'Toàn cục', 'Từng dự đoán, gộp được thành toàn cục'],
        ['Dữ liệu dùng', 'Train', 'Tập giữ lại', 'Tùy chọn, thường là tập giữ lại'],
        ['Loại mô hình', 'Dạng cây', 'Mọi mô hình', 'Mọi mô hình, nhanh với cây'],
        ['Lệch về biến nhiều giá trị', 'Có, rất rõ', 'Không', 'Ít hơn MDI'],
        ['Biến tương quan', 'Chia điểm, khó đọc', 'Cả hai điểm thấp', 'Chia công, phụ thuộc phương pháp'],
        ['Chi phí', 'Rất thấp', 'Trung bình', 'Cao, trừ TreeSHAP'],
      ],
    },

    misconceptions: [
      {
        myth: 'Đặc trưng có mức quan trọng cao là nguyên nhân của kết quả.',
        truth: 'Feature Importance mô tả mô hình, không mô tả thế giới. Muốn biết tác động cần thí nghiệm.',
      },
      {
        myth: 'Permutation Importance thấp nghĩa là đặc trưng vô dụng.',
        truth: 'Có thể nó có một biến tương quan cao thay thế. Bỏ cả hai có thể làm mô hình giảm mạnh.',
      },
      {
        myth: 'SHAP chính xác nên không bị ảnh hưởng bởi biến tương quan.',
        truth: 'SHAP vẫn phải chọn cách chia công, nên kết quả phụ thuộc phương pháp.',
      },
    ],
  },
})
