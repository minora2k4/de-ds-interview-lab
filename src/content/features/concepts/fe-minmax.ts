import { defineConcept } from '../../define'

export default defineConcept({
  id: 'fe-minmax',
  summary:
    'Min-Max Scaling đưa mỗi cột về một khoảng cố định, thường là 0 đến 1, dựa trên min và max của tập train. Cách này rất nhạy với ngoại lai.',
  tags: ['Co giãn', 'Ngoại lai'],
  related: ['fe-standardization', 'fe-normalization', 'fe-robust', 'eda-outliers'],
  sections: {
    definition: `**Min-Max Scaling (Co giãn về khoảng cố định)** biến đổi từng cột theo công thức:

\`x' = (x - min) / (max - min)\`

Kết quả nằm trong khoảng 0 đến 1 trên tập train. \`MinMaxScaler\` của scikit-learn cho đổi khoảng này qua \`feature_range\`.`,

    origin: `Một số thuật toán và dữ liệu cần đầu vào có biên rõ ràng, điều mà [[fe-standardization]] không đảm bảo. Min-Max tạo ra biên đó mà vẫn giữ tỷ lệ tương đối giữa các giá trị.`,

    whyUse: `Hợp với dữ liệu có biên tự nhiên, như điểm ảnh từ 0 đến 255 hoặc điểm đánh giá từ 1 đến 5.`,

    mechanism: `Công thức chỉ dùng hai giá trị cực trị, nên có hai hệ quả:

- **Rất nhạy với ngoại lai.** Một giá trị cực lớn trở thành \`max\`, ép mọi giá trị còn lại vào một khoảng rất hẹp.
- **Dữ liệu mới có thể vượt khoảng.** \`min\` và \`max\` học từ train, nên giá trị lớn hơn \`max\` sẽ cho kết quả lớn hơn 1. Tham số \`clip\` mặc định tắt. Bật lên sẽ cắt về biên, nhưng không giải quyết được việc dữ liệu đã trôi.

Với ma trận thưa, tài liệu scikit-learn khuyên dùng \`MaxAbsScaler\`, vì cách này giữ nguyên số 0.`,

    example: `Cột thu nhập có giá trị từ 20 đến 60 triệu và một ngoại lai 2.000 triệu. Sau Min-Max, các giá trị bình thường chỉ nằm trong khoảng 0 đến 0.02, còn ngoại lai bằng 1. Mô hình gần như không còn phân biệt được người thu nhập 20 triệu và 60 triệu.`,

    prosCons: {
      pros: ['Có biên rõ ràng trên tập train.', 'Giữ nguyên hình dạng phân phối và tỷ lệ tương đối.'],
      cons: ['Hai giá trị cực trị quyết định toàn bộ thang đo.', 'Không đảm bảo dữ liệu mới nằm trong khoảng.'],
    },

    whenToUse: {
      use: ['Dữ liệu có biên tự nhiên, như ảnh hoặc điểm đánh giá.', 'Thuật toán yêu cầu đầu vào trong một khoảng cố định.'],
      avoid: ['Cột có ngoại lai chưa xử lý, xem [[fe-robust]].', 'Cột không có biên và trôi theo thời gian, như doanh thu.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Min-Max', 'Standardization'],
      rows: [
        ['Tham số', 'min, max', 'mean, std'],
        ['Khoảng kết quả', 'Có biên trên train', 'Không có biên'],
        ['Với ngoại lai', 'Rất nhạy', 'Nhạy'],
      ],
    },

    misconceptions: [
      {
        myth: 'Sau Min-Max, mọi giá trị đều chắc chắn nằm trong khoảng 0 đến 1.',
        truth: 'Chỉ đúng trên tập train. Test và production có thể vượt khoảng, vì không được học lại.',
      },
      {
        myth: 'Có thể tính lại min, max trên test cho khớp khoảng.',
        truth: 'Làm vậy sẽ đổi thang đo so với lúc huấn luyện.',
      },
    ],
  },
})
