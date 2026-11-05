import { defineConcept } from '../../define'

export default defineConcept({
  id: 'stats-central-tendency',
  summary:
    'Mean là tổng chia số lượng, median là giá trị đứng giữa, mode là giá trị xuất hiện nhiều nhất. Dữ liệu lệch hoặc có ngoại lai thì median đại diện tốt hơn mean.',
  tags: ['Mean', 'Median', 'Mode', 'Ngoại lai'],
  related: ['stats-descriptive', 'stats-variance-std', 'eda-outliers', 'eda-skew-kurtosis', 'eda-distribution'],
  sections: {
    definition: `Ba thước đo vị trí trung tâm:

- **Mean (Trung bình cộng):** \`tổng các giá trị / số giá trị\`.
- **Median (Trung vị):** giá trị đứng giữa sau khi sắp xếp.
- **Mode (Yếu vị):** giá trị xuất hiện nhiều nhất, dùng được cả với dữ liệu phân loại.`,

    origin: `Cần một con số đại diện để so sánh và ra quyết định. Chỉ dùng mean là cách làm kém: một khách hàng rất lớn cũng kéo lệch "doanh thu điển hình". Median và mode trả lời những câu hỏi mà mean trả lời sai, như "người ở giữa chi bao nhiêu" hay "cỡ áo nào bán chạy nhất".`,

    whyUse: `Median cho biết trải nghiệm điển hình, còn mean cần cho việc suy ra tổng, ví dụ dự báo tổng doanh thu. Chọn sai thước đo dẫn tới quyết định sai.`,

    mechanism: `**Vì sao phản ứng khác nhau với ngoại lai.** Mean dùng độ lớn của mọi giá trị, nên một điểm cực đoan kéo cả kết quả. Median chỉ dùng thứ hạng. Về tối ưu, mean làm nhỏ nhất tổng bình phương sai lệch, median làm nhỏ nhất tổng trị tuyệt đối sai lệch.

**Khả năng cộng gộp.** Mean gộp được từ \`tổng\` và \`số lượng\` của từng partition. Median thì không, nên phải có toàn bộ dữ liệu hoặc dùng thuật toán xấp xỉ.

**Trung bình của các trung bình thường sai.** A có 1.000 đơn, trung bình 200 nghìn đồng. B có 100 đơn, trung bình 800 nghìn đồng. Đáp án đúng là 280.000 / 1.100 ≈ 254,5 nghìn đồng, không phải 500.`,

    example: `Năm đơn hàng (nghìn đồng): 100, 120, 130, 150, 2.000.

- Mean = 2.500 / 5 = **500**, không đơn nào gần con số này.
- Median = **130**, đúng với đơn điển hình.

Bỏ đơn 2.000: mean tụt xuống 125, median chỉ đổi từ 130 sang 125.`,

    prosCons: {
      pros: ['Mean dùng hết thông tin và gộp được.', 'Median chịu được ngoại lai, dễ giải thích.'],
      cons: ['Mean nhạy với ngoại lai và đuôi dài.', 'Median tốn kém trên dữ liệu lớn, không gộp được.'],
    },

    whenToUse: {
      use: ['Mean: dữ liệu gần đối xứng, hoặc khi cần suy ra tổng.', 'Median: thu nhập, độ trễ, giá trị đơn hàng.'],
      avoid: ['Không dùng mean cho biến định danh, kể cả khi đã mã hóa thành số.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Mean', 'Median', 'Mode'],
      rows: [
        ['Nhạy với ngoại lai', 'Rất nhạy', 'Gần như không', 'Không'],
        ['Kiểu dữ liệu', 'Số', 'Số, thứ bậc', 'Mọi kiểu'],
        ['Gộp từ các phần', 'Được', 'Không', 'Được, nếu giữ số đếm'],
      ],
    },

    misconceptions: [
      {
        myth: 'Median luôn tốt hơn mean.',
        truth: 'Median bỏ qua độ lớn của đuôi. Khi cần ước tính tổng doanh thu, mean mới đúng.',
      },
      {
        myth: 'Phân phối lệch phải thì luôn có mean lớn hơn median.',
        truth: 'Đây chỉ là xu hướng thường gặp, không phải định lý, nhất là với dữ liệu rời rạc.',
      },
    ],
  },
})
