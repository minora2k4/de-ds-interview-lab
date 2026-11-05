import { defineConcept } from '../../define'

export default defineConcept({
  id: 'eval-rmse',
  summary:
    'RMSE là căn bậc hai của trung bình sai số bình phương. RMSE nhạy với ngoại lai hơn MAE, và gắn với trung bình: tối ưu RMSE là hướng tới dự đoán trung bình.',
  tags: ['Hồi quy', 'Ngoại lai'],
  related: ['eval-mae', 'eval-bias-variance', 'stats-central-tendency', 'eda-outliers'],
  sections: {
    definition: `**RMSE (Căn bậc hai sai số bình phương trung bình)** đo độ lớn sai số của mô hình hồi quy: \`RMSE = căn của trung bình (y - ŷ)^2\`. RMSE có cùng đơn vị với giá trị cần dự đoán.`,

    origin: `Cộng sai số thô thì âm và dương triệt tiêu nhau, nên cần bỏ dấu. Bình phương dễ tính, có đạo hàm mượt và gắn với giả định nhiễu phân phối chuẩn. MSE có đơn vị bình phương nên người ta lấy căn.`,

    whyUse: `RMSE phù hợp khi lỗi lớn gây hại nhiều hơn tỷ lệ, như dự báo tải điện.`,

    mechanism: `**Nhạy với ngoại lai:** sai số được bình phương trước khi lấy trung bình. Với sai số 2, 2, 2, 2, 12: MAE là 4, RMSE là 5,66. Đổi 12 thành 52: MAE là 12, RMSE là 23,3.

**RMSE luôn lớn hơn hoặc bằng MAE,** khoảng chênh càng lớn thì sai số càng không đều.

**Gắn với trung bình:** với giá trị 10, 10, 10, 10, 60, dự đoán hằng số 20 (trung bình) cho RMSE 20, còn 10 (trung vị) cho RMSE 22,4. Vì vậy tối ưu theo sai số bình phương là hướng tới trung bình có điều kiện của y.`,

    example: `Dự báo thời gian giao hàng, sai số theo phút. Mô hình A có sai số 4, 4, 4, 4, 4. Mô hình B có sai số 1, 1, 1, 1, 16. Cả hai đều có MAE 4, nhưng RMSE của A là 4, của B là 7,2. Nếu trễ quá 10 phút thì khách hủy đơn, A tốt hơn.`,

    prosCons: {
      pros: ['Cùng đơn vị với giá trị dự đoán.', 'Phạt mạnh lỗi lớn, có đạo hàm mượt nên dễ tối ưu.'],
      cons: ['Vài ngoại lai có thể chi phối cả chỉ số.', 'Phụ thuộc thang đo.'],
    },

    whenToUse: {
      use: ['Lỗi lớn đắt hơn nhiều so với lỗi nhỏ.', 'Cần tổng dự báo khớp với tổng thực tế.'],
      avoid: ['Dữ liệu có [[eda-outliers|ngoại lai]] do lỗi mà chưa xử lý.', 'Chi phí tăng tuyến tính: dùng [[eval-mae]].'],
    },

    comparison: {
      headers: ['Tiêu chí', 'RMSE', 'MAE'],
      rows: [
        ['Gắn với', 'Trung bình', 'Trung vị'],
        ['Nhạy với ngoại lai', 'Cao', 'Thấp hơn'],
        ['Giả định nhiễu phù hợp', 'Phân phối chuẩn', 'Phân phối Laplace'],
      ],
    },

    misconceptions: [
      {
        myth: 'RMSE là sai số trung bình của mô hình.',
        truth: 'RMSE 7,2 trong ví dụ không có nghĩa là mỗi đơn lệch khoảng 7 phút, vì 4 trong 5 đơn chỉ lệch 1 phút.',
      },
      {
        myth: 'RMSE nhỏ hơn thì mô hình tốt hơn, bất kể dữ liệu nào.',
        truth: 'Chỉ so sánh được trên cùng dữ liệu và thang đo.',
      },
    ],
  },
})
