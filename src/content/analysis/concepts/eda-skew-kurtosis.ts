import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eda-skew-kurtosis',
  summary:
    'Skewness đo mức bất đối xứng, Kurtosis đo độ nặng của đuôi so với phân phối chuẩn. Cả hai rất nhạy với giá trị cực đoan, và nên đọc cùng biểu đồ.',
  tags: ['EDA', 'Phân phối', 'Thống kê'],
  related: ['eda-distribution', 'eda-outliers', 'stats-normal', 'stats-central-tendency', 'fe-robust'],
  sections: {
    definition: `**Skewness (Độ lệch)** đo mức bất đối xứng của phân phối. **Kurtosis (Độ nhọn)** đo độ nặng của đuôi so với [[stats-normal|phân phối chuẩn]]. Tên "độ nhọn" dễ gây hiểu sai, vì kurtosis phản ánh đuôi, gần như không cho biết hình dạng đỉnh.`,

    origin: `Trung bình và phương sai không phân biệt được phân phối đối xứng với phân phối đuôi dài. Pearson đưa ra moment bậc ba và bậc bốn để đo phần còn thiếu này.`,

    whyUse: `Hai chỉ số này cho biết khi nào trung bình và độ lệch chuẩn không còn đại diện tốt, và khi nào nên cân nhắc biến đổi dữ liệu.`,

    mechanism: `Với \`z = (x - mean) / sd\`:

- **Skewness** là trung bình của \`z³\`. Lũy thừa lẻ giữ dấu, nên đuôi phải và đuôi trái triệt tiêu nhau. Giá trị dương là đuôi kéo về phải.
- **Kurtosis** là trung bình của \`z⁴\`. Lũy thừa 4 khuếch đại điểm xa tâm: một điểm có z = 20 trong 10.000 dòng đã đóng góp 16 đơn vị.

Phân phối chuẩn có skewness 0 và kurtosis 3. Nhiều phần mềm báo **excess kurtosis** (kurtosis trừ 3), nên phân phối chuẩn thành 0. Phải kiểm tra phần mềm dùng định nghĩa nào.

Do đã chuẩn hóa, cả hai không đổi khi đổi đơn vị, ví dụ từ VND sang USD.`,

    example: `Chi tiêu của 100.000 khách có trung bình 1,2 triệu, trung vị 300 nghìn, skewness 9. Báo cáo "khách chi 1,2 triệu" sai với số đông, vì vài khách lớn kéo trung bình lên. Sau biến đổi \`log(1 + x)\`, skewness còn 0,2, hợp hơn cho mô hình tuyến tính.`,

    prosCons: {
      pros: ['Ngắn gọn, dễ dùng để lọc nhanh các cột có đuôi dài.'],
      cons: ['Rất nhạy với vài điểm cực đoan.'],
    },

    whenToUse: {
      use: ['Quét nhanh nhiều cột để chọn cột cần vẽ biểu đồ và cân nhắc biến đổi.'],
      avoid: ['Không biến đổi log chỉ vì skewness cao khi dùng mô hình cây, vì cây chỉ dựa vào thứ tự giá trị.'],
    },

    comparison: {
      headers: ['Phân phối', 'Skewness', 'Excess kurtosis'],
      rows: [
        ['Chuẩn', '0', '0'],
        ['Đều', '0', '-1,2'],
        ['Laplace', '0', '3'],
        ['Mũ', '2', '6'],
      ],
      note: 'Skewness bằng 0 không có nghĩa là phân phối chuẩn, thậm chí không bảo đảm đối xứng.',
    },

    misconceptions: [
      {
        myth: 'Kurtosis cao nghĩa là đỉnh nhọn.',
        truth: 'Kurtosis cao nghĩa là có giá trị xa tâm (Westfall, 2014). Các điểm gần tâm có z⁴ rất nhỏ, nên đỉnh gần như không đóng góp.',
      },
      {
        myth: 'Lệch phải thì trung bình luôn lớn hơn trung vị.',
        truth: 'Đây là quy tắc kinh nghiệm, có thể sai với dữ liệu rời rạc.',
      },
    ],
  },
})
