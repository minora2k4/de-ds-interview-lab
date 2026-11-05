import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-robust',
  summary:
    'Robust Scaling trừ median rồi chia cho IQR, nên tham số gần như không bị ngoại lai ảnh hưởng. Ngoại lai vẫn còn trong dữ liệu sau co giãn.',
  tags: ['Co giãn', 'Ngoại lai', 'First Principles'],
  related: ['fe-standardization', 'fe-minmax', 'eda-outliers', 'stats-central-tendency'],
  sections: {
    definition: `**Robust Scaling (Co giãn bền với ngoại lai)** biến đổi từng cột theo công thức:

\`x' = (x - median) / IQR\`

Trong đó \`IQR = Q3 - Q1\` là khoảng tứ phân vị. \`RobustScaler\` mặc định dùng \`quantile_range = (25, 75)\`.`,

    origin: `[[fe-standardization|Standardization]] và [[fe-minmax|Min-Max]] dùng thống kê phụ thuộc vào mọi giá trị hoặc cực trị, nên một ngoại lai đủ làm lệch cả thang đo. Robust Scaling thay chúng bằng thống kê dựa trên thứ hạng.`,

    whyUse: `Thang đo do phần dữ liệu bình thường quyết định, nên các giá trị thông thường vẫn phân biệt được với nhau.`,

    mechanism: `**Vì sao bền?** Median và các tứ phân vị chỉ phụ thuộc vào thứ hạng. Đổi giá trị lớn nhất từ 100 thành 1 tỷ không làm chúng thay đổi. Ngược lại, \`mean\` đổi ngay và \`std\` còn đổi mạnh hơn vì bình phương độ lệch.

**Ngoại lai vẫn còn** và vẫn có thể kéo lệch mô hình tuyến tính, nên có thể cần thêm log hoặc cắt ngưỡng, xem [[eda-outliers]].

**Điểm cần chú ý:**

- Tham số phải học trên train, như mọi phép co giãn khác.
- Cột có 80% giá trị bằng 0 sẽ có Q1 = Q3 = 0, tức IQR = 0, nên công thức không còn ý nghĩa. Hãy kiểm tra trước.`,

    example: `Cột gồm 20, 25, 30, 35, 40, 45, 50, 55, 60 và 2.000. Median là 42.5, IQR là 22.5.

| Cách co giãn | Giá trị 20 đến 60 | Ngoại lai 2.000 |
|---|---|---|
| Min-Max | 0 đến 0.02 | 1 |
| Standardization | -0.37 đến -0.30 | 3.00 |
| Robust Scaling | -1.00 đến 0.78 | 87.00 |

Chỉ Robust Scaling giữ được khoảng cách giữa các giá trị bình thường.`,

    prosCons: {
      pros: ['Tham số ổn định khi có ngoại lai.'],
      cons: ['Ngoại lai vẫn tồn tại với giá trị lớn.', 'Không dùng được khi IQR bằng 0.'],
    },

    whenToUse: {
      use: ['Cột có ngoại lai thật mà không muốn loại bỏ, như giá trị giao dịch.'],
      avoid: ['Cột phần lớn bằng một giá trị, vì IQR bằng 0.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Robust Scaling', 'Standardization'],
      rows: [
        ['Tâm', 'Median', 'Mean'],
        ['Thang đo', 'IQR', 'Độ lệch chuẩn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Robust Scaling loại bỏ ngoại lai.',
        truth: 'Nó chỉ làm tham số không bị ngoại lai ảnh hưởng. Ngoại lai vẫn nằm trong dữ liệu.',
      },
      {
        myth: 'Đã dùng Robust Scaling thì mô hình không còn nhạy với ngoại lai.',
        truth: 'Mô hình tuyến tính và KNN vẫn nhạy với giá trị 87 ở ví dụ trên.',
      },
    ],
  },
})
