import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eda-outliers',
  summary:
    'Ngoại lai là quan sát khác xa phần còn lại. IQR, Z-score và Isolation Forest chỉ đánh dấu điểm bất thường, còn lỗi hay tín hiệu thật phải kiểm tra bằng nghiệp vụ.',
  tags: ['Ngoại lai', 'Chất lượng dữ liệu'],
  related: ['eda-distribution', 'eda-skew-kurtosis', 'eda-leakage', 'fe-robust', 'stats-variance-std', 'dq-profiling'],
  sections: {
    definition: `**Outlier (Ngoại lai)** là quan sát khác xa phần còn lại, đến mức gợi ý nó đến từ một cơ chế khác. Phương pháp phát hiện chỉ trả lời "điểm nào bất thường theo tiêu chí này", không trả lời "có nên xóa không".`,

    origin: `Xóa điểm theo cảm tính khó tái lập. Tukey đưa ra hàng rào theo phân vị. IQR và Z-score chỉ xét từng biến, nên Isolation Forest (Liu, Ting, Zhou, 2008) ra đời cho dữ liệu nhiều chiều.`,

    whyUse: `Ngoại lai có thể kéo lệch trung bình và tương quan, nhưng cũng có thể là tín hiệu cần tìm.`,

    mechanism: `- **IQR:** gắn cờ ngoài \`[Q1 - 1,5 × IQR, Q3 + 1,5 × IQR]\`. Bền vì dùng phân vị, nhưng gắn cờ nhiều giá trị thật trên dữ liệu đuôi dài.
- **Z-score:** \`|z| > 3\`. Ngoại lai kéo cả trung bình và độ lệch chuẩn nên có thể tự che mình, gọi là **masking**. Modified Z-score dùng trung vị và MAD để khắc phục. 1 triệu dòng chuẩn vẫn có khoảng 2.700 điểm vượt ngưỡng.
- **Isolation Forest:** cắt ngẫu nhiên, điểm bất thường bị cô lập sau ít lần cắt hơn. Nó tìm được điểm bình thường ở từng biến nhưng lạ ở tổ hợp. \`contamination\` chỉ dùng để đặt ngưỡng, không cho biết tỷ lệ thật.

**Lỗi hay tín hiệu?** Giá trị không thể xảy ra, như tuổi 200, là lỗi: sửa hoặc coi là thiếu. Điểm từ nhóm khác, như khách doanh nghiệp: tách nhóm. Điểm thật cùng tổng thể: giữ, dùng biến đổi hoặc [[fe-robust|co giãn bền]]. Với gian lận, chúng chính là mục tiêu. Không xóa ngoại lai ở tập test để làm đẹp chỉ số.`,

    example: `Với 500.000 giao dịch, IQR gắn cờ 8% vì đuôi dài, sau log còn 0,6%. Isolation Forest đánh dấu 500 giao dịch. Kiểm tra 200 giao dịch: 31 gian lận, 40 lỗi nhập, còn lại là khách doanh nghiệp.`,

    prosCons: {
      pros: ['Không cần nhãn, tạo được danh sách ưu tiên kiểm tra.'],
      cons: ['Ngưỡng chỉ mang tính quy ước.'],
    },

    whenToUse: {
      use: ['Dùng làm bộ lọc để con người kiểm tra.'],
      avoid: ['Không tự động xóa mọi điểm bị gắn cờ.'],
    },

    comparison: {
      headers: ['Phương pháp', 'Giả định', 'Điểm yếu'],
      rows: [
        ['IQR', 'Không cần phân phối chuẩn', 'Một biến, nhiều cờ trên đuôi dài'],
        ['Z-score', 'Gần chuẩn', 'Một biến, bị masking'],
        ['Isolation Forest', 'Ngoại lai ít và khác biệt', 'Khó giải thích, kém với cụm dày'],
      ],
    },

    misconceptions: [
      {
        myth: 'Ngoại lai là dữ liệu xấu cần xóa.',
        truth: 'Nhiều ngoại lai là điểm thật. Xóa chúng làm đánh giá thấp rủi ro.',
      },
    ],
  },
})
