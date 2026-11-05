import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-eval-rmse-01',
    topicId: 'evaluation',
    category: 'eval-regression',
    conceptIds: ['eval-rmse', 'eval-mae', 'eda-outliers'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'RMSE và MAE khác nhau thế nào? Bạn chọn chỉ số nào cho một bài toán dự báo?',
    referenceAnswer: `Cả hai đều đo độ lớn sai số với cùng đơn vị như giá trị dự đoán. MAE lấy trung bình giá trị tuyệt đối. RMSE bình phương sai số trước khi lấy trung bình, rồi lấy căn.

Vì bình phương, **RMSE nhạy với ngoại lai hơn**. Với sai số 2, 2, 2, 2, 12, MAE là 4 và RMSE là 5,66. Đổi 12 thành 52 thì MAE là 12, còn RMSE là 23,3. RMSE luôn lớn hơn hoặc bằng MAE, và khoảng chênh cho biết sai số không đều đến mức nào.

Tôi chọn dựa vào chi phí và đại lượng cần dự đoán. Nếu một lỗi lớn đắt hơn nhiều lỗi nhỏ cộng lại, như dự báo tải điện, tôi dùng RMSE. Nếu chi phí tăng tuyến tính, hoặc ngoại lai là lỗi dữ liệu, tôi dùng MAE.

Ngoài ra, **RMSE gắn với trung bình, MAE gắn với trung vị**. Nếu cần tổng dự báo khớp với thực tế thì RMSE phù hợp hơn. Tôi luôn so với mô hình cơ sở, vì cả hai chỉ số đều phụ thuộc thang đo, và thường báo cáo cả hai.`,
    keyPoints: [
      { text: 'RMSE bình phương nên nhạy với ngoại lai hơn', keywords: ['bình phương', 'nhạy', 'ngoại lai', 'outlier'], weight: 2 },
      { text: 'Chọn theo chi phí của lỗi lớn', keywords: ['chi phí', 'lỗi lớn', 'tuyến tính'], weight: 2 },
      { text: 'RMSE gắn với trung bình, MAE gắn với trung vị', keywords: ['trung bình', 'trung vị', 'median'], weight: 2 },
      { text: 'RMSE luôn lớn hơn hoặc bằng MAE', keywords: ['lớn hơn hoặc bằng', 'khoảng chênh'] },
      { text: 'So với mô hình cơ sở, phụ thuộc thang đo', keywords: ['thang đo', 'mô hình cơ sở', 'baseline'] },
    ],
    followUps: ['Khi nào RMSE bằng MAE?', 'Dữ liệu có ngoại lai thật và quan trọng thì sao?'],
    commonMistakes: ['Nói RMSE là sai số trung bình.', 'So sánh RMSE giữa các bài toán có thang đo khác nhau.'],
  },
  {
    id: 'iv-eval-rmse-02',
    topicId: 'evaluation',
    category: 'eval-regression',
    conceptIds: ['eval-rmse', 'eval-mae', 'stats-central-tendency'],
    interviewTypes: ['ds'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Vì sao tối ưu sai số bình phương dẫn tới dự đoán trung bình, còn tối ưu sai số tuyệt đối dẫn tới dự đoán trung vị?',
    referenceAnswer: `Xét bài toán dự đoán một hằng số c.

**Sai số bình phương:** tổng \`(y - c)^2\` là hàm lồi, đạo hàm theo c bằng \`-2 x tổng (y - c)\`. Đặt bằng 0 được c là trung bình. Trực giác là mỗi điểm kéo c với lực tỷ lệ với khoảng cách, nên điểm xa kéo mạnh hơn.

**Sai số tuyệt đối:** đạo hàm của \`|y - c|\` là -1 hoặc +1, không phụ thuộc khoảng cách. Tổng bằng 0 khi số điểm hai bên c bằng nhau, tức c là trung vị. Điểm xa đến đâu cũng chỉ kéo với lực bằng 1, nên MAE bền với ngoại lai.

Mở rộng cho mô hình có đặc trưng, ta được trung bình có điều kiện và trung vị có điều kiện. Dưới góc độ xác suất, MSE tương ứng với hợp lý cực đại khi nhiễu phân phối chuẩn, MAE khi nhiễu phân phối Laplace.

Ý nghĩa thực tế là chọn chỉ số tức là chọn đại lượng. Ví dụ với 10, 10, 10, 10, 60: hằng số 20 tốt theo RMSE, hằng số 10 tốt theo MAE. Tài liệu scikit-learn khuyến nghị dùng hàm chấm điểm nhất quán với đại lượng cần dự đoán, cho cả huấn luyện lẫn đánh giá.`,
    keyPoints: [
      { text: 'Đạo hàm của sai số bình phương cho trung bình', keywords: ['đạo hàm', 'trung bình', 'mean'], weight: 2 },
      { text: 'Đạo hàm của sai số tuyệt đối cho trung vị', keywords: ['trung vị', 'số điểm hai bên', 'median'], weight: 2 },
      { text: 'Lực kéo tỷ lệ khoảng cách giải thích độ nhạy ngoại lai', keywords: ['lực kéo', 'tỷ lệ với khoảng cách', 'ngoại lai'] },
      { text: 'Liên hệ nhiễu chuẩn và Laplace', keywords: ['phân phối chuẩn', 'laplace', 'gaussian'] },
      { text: 'Chọn chỉ số là chọn đại lượng cần dự đoán', keywords: ['chọn đại lượng', 'nhất quán', 'consistent'] },
    ],
    followUps: ['Muốn dự đoán phân vị 90 thì dùng hàm mất mát nào?', 'Huber Loss nằm ở đâu giữa hai chỉ số này?'],
    commonMistakes: ['Chỉ nói MAE chống ngoại lai mà không biết nó nhắm tới trung vị.', 'Huấn luyện theo một mục tiêu nhưng đánh giá theo mục tiêu khác mà không biết.'],
  },
  {
    id: 'iv-eval-mae-01',
    topicId: 'evaluation',
    category: 'eval-regression',
    conceptIds: ['eval-mae', 'eda-skew-kurtosis'],
    interviewTypes: ['ds'],
    levels: ['middle'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Mô hình dự báo doanh số có MAE tốt hơn mô hình cũ, nhưng đội tài chính phàn nàn rằng tổng dự báo luôn thấp hơn thực tế. Bạn giải thích và xử lý thế nào?',
    referenceAnswer: `Doanh số thường lệch phải: đa số ngày ở mức thấp, một số ngày rất cao. Khi tối ưu MAE, mô hình hướng tới trung vị, và với dữ liệu lệch phải thì trung vị thấp hơn trung bình. Nên mỗi dự báo đều có xu hướng thấp hơn trung bình, cộng lại thành thiếu có hệ thống.

Ví dụ thực tế 10, 10, 10, 10, 60. Dự báo 10 có MAE 10 nhưng tổng là 50, trong khi thực tế là 100. Dự báo 20 có MAE 16 nhưng tổng khớp hoàn toàn.

Tôi xác nhận bằng cách tính sai số có dấu, xem tổng dự báo chia tổng thực tế, theo cả thời gian và từng nhóm sản phẩm.

Cách xử lý phụ thuộc vào mục đích. Tài chính cần tổng nên tôi đổi mục tiêu sang đại lượng trung bình, dùng sai số bình phương, hoặc Poisson, Tweedie với dữ liệu đếm và dữ liệu dương. Nếu mục đích là tồn kho, thực ra nên dự báo phân vị bằng Quantile Loss, theo chi phí thiếu hàng và dư hàng. Tôi báo cáo cả MAE lẫn độ lệch tổng, vì một chỉ số không nói được cả hai.`,
    keyPoints: [
      { text: 'MAE hướng tới trung vị', keywords: ['trung vị', 'median'], weight: 2 },
      { text: 'Dữ liệu lệch phải làm trung vị thấp hơn trung bình', keywords: ['lệch phải', 'thấp hơn trung bình'], weight: 2 },
      { text: 'Xác nhận bằng sai số có dấu hoặc tỷ lệ tổng', keywords: ['sai số có dấu', 'tỷ lệ tổng', 'bias'] },
      { text: 'Đổi mục tiêu sang trung bình', keywords: ['sai số bình phương', 'poisson', 'tweedie'] },
      { text: 'Dự báo phân vị cho tồn kho', keywords: ['quantile', 'phân vị', 'tồn kho'] },
    ],
    followUps: ['Làm sao chọn phân vị từ chi phí thiếu hàng và dư hàng?', 'Có thể hiệu chỉnh hậu kỳ để tổng khớp không?'],
    commonMistakes: ['Kết luận mô hình có lỗi mà không xét hàm mục tiêu.', 'Chỉ nhìn một chỉ số MAE để đánh giá mô hình dự báo.'],
  },
])
