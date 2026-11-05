import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-mae',
  summary:
    'MAE là trung bình của sai số tuyệt đối. MAE ít nhạy với ngoại lai hơn RMSE, và gắn với trung vị: tối ưu MAE là hướng tới dự đoán trung vị.',
  tags: ['Hồi quy', 'Ngoại lai'],
  related: ['eval-rmse', 'stats-central-tendency', 'eda-outliers', 'eda-skew-kurtosis'],
  sections: {
    definition: `**MAE (Sai số tuyệt đối trung bình)** là trung bình độ lớn sai số: \`MAE = trung bình |y - ŷ|\`. MAE có cùng đơn vị với giá trị cần dự đoán.`,

    origin: `Giá trị tuyệt đối là cách tự nhiên để bỏ dấu của sai số, nhưng đạo hàm không xác định tại 0 nên từng khó tính. Khi tối ưu số đã dễ dàng, MAE trở thành lựa chọn để giảm ảnh hưởng của ngoại lai so với [[eval-rmse|RMSE]].`,

    whyUse: `MAE phù hợp khi chi phí tăng tuyến tính theo độ lệch, ví dụ mỗi phút trễ tốn như nhau.`,

    mechanism: `**Ít nhạy với ngoại lai:** sai số tăng gấp đôi thì đóng góp vào MAE chỉ tăng gấp đôi, còn đóng góp vào MSE tăng gấp bốn.

**Gắn với trung vị:** với giá trị 10, 10, 10, 10, 60, dự đoán hằng số 10 (trung vị) cho MAE 10, còn 20 (trung bình) cho MAE 16. Tại trung vị, số điểm hai bên bằng nhau, nên dịch đi đâu tổng khoảng cách cũng tăng.

**Hệ quả với dữ liệu lệch phải:** trung vị nhỏ hơn trung bình, nên tổng dự báo bị thiếu có hệ thống.`,

    example: `Dự báo nhu cầu 5 ngày có thực tế 10, 10, 10, 10, 60. Luôn dự báo 10 có MAE 10, nhưng tổng dự báo là 50 trong khi tổng thực tế là 100. Luôn dự báo 20 có MAE 16, nhưng tổng lại khớp. Nếu đặt hàng theo tổng tháng, cách thứ hai mới đúng.`,

    prosCons: {
      pros: ['Dễ giải thích, cùng đơn vị với giá trị dự đoán.', 'Ít bị ngoại lai chi phối.'],
      cons: ['Không phân biệt nhiều lỗi nhỏ với vài lỗi rất lớn.', 'Đạo hàm không xác định tại 0.'],
    },

    whenToUse: {
      use: ['Chi phí tăng tuyến tính theo độ lệch.', 'Có ngoại lai không phản ánh điều cần dự đoán.'],
      avoid: ['Lỗi lớn đặc biệt nguy hiểm: dùng [[eval-rmse]].', 'Cần tổng dự báo khớp với thực tế trên dữ liệu lệch.'],
    },

    comparison: {
      headers: ['Với giá trị 10, 10, 10, 10, 60', 'Dự đoán 10 (trung vị)', 'Dự đoán 20 (trung bình)'],
      rows: [
        ['MAE', '10, tốt hơn', '16'],
        ['RMSE', '22,4', '20, tốt hơn'],
        ['Tổng dự báo so với thực tế', '50 so với 100', '100 so với 100'],
      ],
    },

    misconceptions: [
      {
        myth: 'MAE không bị ảnh hưởng bởi ngoại lai.',
        truth: 'Vẫn bị ảnh hưởng, nhưng theo tỷ lệ tuyến tính.',
      },
      {
        myth: 'Huấn luyện theo MSE nhưng báo cáo MAE là không có vấn đề gì.',
        truth: 'Hai chỉ số hướng tới trung bình và trung vị, nên cần nhất quán.',
      },
    ],
  },
})
