import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-normalization',
  summary:
    'Normalization là thuật ngữ nhiều nghĩa: co giãn nói chung, Min-Max, hoặc đưa từng dòng về độ dài 1 như `Normalizer` của scikit-learn. Khi trao đổi, hãy nói rõ công thức.',
  tags: ['Co giãn', 'Thuật ngữ'],
  related: ['fe-standardization', 'fe-minmax', 'fe-robust', 'fe-extraction'],
  sections: {
    definition: `**Normalization (Đưa dữ liệu về cùng thang đo)** không có một nghĩa duy nhất:

- **Nghĩa rộng:** mọi phép co giãn để các cột so sánh được với nhau.
- **Nghĩa hẹp trong nhiều giáo trình:** chính là [[fe-minmax|Min-Max]].
- **Trong scikit-learn:** đưa **từng dòng** về chuẩn đơn vị, bằng \`Normalizer\`.

Ngoài ra, z-score normalization chính là [[fe-standardization|Standardization]]. Chuẩn hóa cơ sở dữ liệu ([[db-normalization]]) là khái niệm khác hẳn.`,

    origin: `Sự lẫn lộn đến từ việc nhiều cộng đồng cùng dùng một từ. Ngay trong tài liệu scikit-learn, Min-Max nằm ở mục Standardization, còn Normalization dành cho phép biến đổi theo dòng.`,

    whyUse: `Biến đổi theo dòng hữu ích khi chỉ quan tâm đến **hướng** của vector, không quan tâm độ lớn, như khi so sánh bằng tích vô hướng hoặc cosine similarity trong xử lý văn bản.`,

    mechanism: `**Khác biệt cốt lõi là chiều tính toán:**

- **Co giãn theo cột** so sánh một đặc trưng giữa các dòng, nên phải học tham số trên train.
- **Normalizer theo dòng** chia mỗi dòng cho độ dài của chính nó. Chuẩn mặc định là \`l2\`, ngoài ra có \`l1\`, \`max\`. Mỗi dòng được xử lý độc lập nên không cần học gì, và không có rò rỉ từ bước này.`,

    example: `Hai văn bản có số đếm từ \`[3, 4]\` và \`[30, 40]\`. Khoảng cách Euclid giữa chúng rất lớn chỉ vì văn bản sau dài hơn. Sau khi đưa về độ dài 1, cả hai đều thành \`[0.6, 0.8]\`, đúng với việc chúng có cùng tỷ lệ từ.`,

    prosCons: {
      pros: ['Loại bỏ ảnh hưởng của độ dài dòng.', 'Không có tham số cần học.'],
      cons: ['Làm mất thông tin về độ lớn.', 'Thuật ngữ dễ gây hiểu nhầm trong giao tiếp.'],
    },

    whenToUse: {
      use: ['Dữ liệu dạng vector như TF-IDF, khi so sánh bằng cosine similarity.'],
      avoid: ['Dữ liệu bảng có các cột khác đơn vị, vì cộng các đơn vị khác nhau trong một dòng là vô nghĩa.'],
    },

    comparison: {
      headers: ['Tên gọi', 'Công thức', 'Chiều'],
      rows: [
        ['Normalizer (L2)', 'x / độ dài của dòng', 'Dòng'],
        ['Min-Max', '(x - min) / (max - min)', 'Cột'],
        ['Standardization', '(x - mean) / std', 'Cột'],
      ],
    },

    misconceptions: [
      {
        myth: 'Normalization làm dữ liệu có phân phối chuẩn.',
        truth: 'Không. Tên gọi dễ gây hiểu nhầm, nhưng co giãn tuyến tính theo cột không đổi hình dạng phân phối.',
      },
      {
        myth: '`Normalizer` của scikit-learn chính là Min-Max.',
        truth: '`Normalizer` làm việc theo dòng, còn `MinMaxScaler` làm việc theo cột. Hai lớp cho kết quả khác hẳn nhau.',
      },
    ],
  },
})
