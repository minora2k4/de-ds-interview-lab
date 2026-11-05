import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-stats-descriptive-01',
    topicId: 'statistics',
    category: 'stats-descriptive-group',
    conceptIds: ['stats-descriptive', 'stats-central-tendency'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Bạn nhận một bộ dữ liệu giao dịch mới. Bạn dùng thống kê mô tả thế nào, và vì sao không dừng ở mean và std?',
    referenceAnswer: `Tôi bắt đầu bằng kiểu của từng biến, vì nó quyết định phép tính nào có nghĩa: mã tỉnh là số nhưng lấy trung bình thì vô nghĩa. Với biến số, tôi xem \`min\`, \`max\`, mean, median, các percentile và tỷ lệ null. Với biến phân loại, tôi xem tần suất và số giá trị khác nhau.

Bước này trước hết để bắt lỗi: giá trị âm ở cột số tiền, \`max\` bất thường, hay ngày tháng ngoài khoảng hợp lệ.

Tôi không dừng ở mean và std vì hai con số này nén mất hình dạng. Bộ tứ Anscombe có bốn bộ dữ liệu cùng mean, variance và correlation nhưng vẽ ra rất khác nhau. Với giá trị giao dịch, phân phối thường lệch phải, nên mean có thể bị vài giao dịch lớn kéo lên. Ví dụ mean 500 nghìn đồng trong khi median chỉ 130 nghìn đồng. Vì vậy tôi luôn vẽ histogram và xem p95, p99, rồi chia theo nhóm như loại khách hàng, vì con số tổng có thể che mất khác biệt giữa các nhóm.`,
    keyPoints: [
      { text: 'Xác định kiểu biến trước khi tính', keywords: ['kiểu biến', 'định danh', 'phân loại'] },
      { text: 'Dùng để phát hiện lỗi dữ liệu', keywords: ['lỗi', 'null', 'bất thường', 'giá trị âm'], weight: 2 },
      { text: 'Mean và std che mất hình dạng phân phối', keywords: ['anscombe', 'hình dạng', 'histogram', 'biểu đồ'], weight: 2 },
      { text: 'Dùng percentile hoặc median cho dữ liệu lệch', keywords: ['percentile', 'median', 'trung vị', 'p95', 'p99'] },
    ],
    followUps: ['Khi nào mean vẫn là con số bạn cần, dù dữ liệu lệch?', 'Vì sao nên chia theo nhóm khi tóm tắt?'],
    commonMistakes: ['Chỉ liệt kê tên các chỉ số mà không nói mục đích của chúng.', 'Tính mean cho biến định danh được mã hóa thành số.'],
  },
  {
    id: 'iv-stats-central-tendency-01',
    topicId: 'statistics',
    category: 'stats-descriptive-group',
    conceptIds: ['stats-central-tendency'],
    interviewTypes: ['ds'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Khi nào nên dùng median thay vì mean? Có khi nào dữ liệu rất lệch mà vẫn phải dùng mean không?',
    referenceAnswer: `Sự khác biệt đến từ thông tin mà mỗi thước đo sử dụng. Mean dùng độ lớn của mọi giá trị nên một điểm cực đoan kéo cả kết quả. Median chỉ dùng thứ hạng nên gần như không đổi. Với 5 đơn hàng 100, 120, 130, 150, 2.000 nghìn đồng, mean là 500 còn median là 130.

Vì thế tôi dùng median khi câu hỏi là "trường hợp điển hình thế nào", như thu nhập, độ trễ hay giá trị đơn hàng.

Nhưng có lúc phải dùng mean dù dữ liệu rất lệch: khi cần suy ra **tổng**. Doanh thu dự kiến bằng số khách nhân với doanh thu trung bình mỗi khách, nên dùng median sẽ bỏ sót đúng nhóm khách lớn tạo ra phần lớn doanh thu. A/B test về doanh thu cũng thường so sánh mean vì lý do này, dù phải dùng nhiều mẫu hơn hoặc winsorize để giảm phương sai.

Về mặt tối ưu, mean làm nhỏ nhất tổng bình phương sai lệch, còn median làm nhỏ nhất tổng trị tuyệt đối sai lệch.`,
    keyPoints: [
      { text: 'Mean dùng độ lớn, median dùng thứ hạng', keywords: ['thứ hạng', 'độ lớn', 'vị trí'], weight: 2 },
      { text: 'Median cho trường hợp điển hình của dữ liệu lệch', keywords: ['điển hình', 'lệch', 'ngoại lai', 'outlier'], weight: 2 },
      { text: 'Mean cần thiết khi suy ra tổng', keywords: ['tổng', 'doanh thu', 'total'], weight: 2 },
      { text: 'Liên hệ với sai số bình phương và tuyệt đối', keywords: ['bình phương', 'trị tuyệt đối', 'mse', 'mae'] },
    ],
    followUps: ['Làm sao tính median trên dữ liệu phân tán?', 'Winsorize ảnh hưởng thế nào tới kết luận của A/B test?'],
    commonMistakes: ['Nói median luôn tốt hơn mean với dữ liệu lệch.', 'Tính trung bình của các trung bình khi các nhóm có kích thước khác nhau.'],
  },
  {
    id: 'iv-stats-variance-std-01',
    topicId: 'statistics',
    category: 'stats-descriptive-group',
    conceptIds: ['stats-variance-std', 'stats-confidence-interval'],
    interviewTypes: ['ds'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Phân biệt standard deviation và standard error. Vì sao phương sai mẫu lại chia cho n - 1?',
    referenceAnswer: `Standard deviation mô tả độ phân tán của từng quan sát: người dùng này khác người dùng kia bao nhiêu. Thêm dữ liệu không làm con số này giảm, nó chỉ ổn định dần quanh giá trị thật.

Standard error mô tả độ dao động của một ước lượng, ví dụ mean, nếu lấy mẫu lại nhiều lần: \`SE = s / sqrt(n)\`. Nó giảm khi n tăng, nhưng theo căn bậc hai, nên muốn giảm SE một nửa thì phải tăng mẫu gấp 4 lần. Đây là lý do A/B test phát hiện hiệu ứng nhỏ rất tốn lưu lượng.

Về \`n - 1\`: mean mẫu được tính từ chính dữ liệu đó, nên dữ liệu luôn nằm gần nó hơn so với mean thật, và tổng bình phương độ lệch bị thấp đi. Chia cho \`n - 1\` bù lại phần này, nên \`s²\` không thiên lệch. Nhìn theo bậc tự do, các độ lệch có tổng bằng 0, nên chỉ \`n - 1\` độ lệch là tự do. Với \`s\`, phép căn là phi tuyến nên vẫn còn thiên lệch nhỏ.`,
    keyPoints: [
      { text: 'Std đo độ phân tán của từng quan sát', keywords: ['phân tán', 'từng quan sát', 'dispersion'], weight: 2 },
      { text: 'SE đo độ dao động của ước lượng, giảm theo căn n', keywords: ['sqrt', 'căn', 'ước lượng', 'lấy mẫu lại'], weight: 2 },
      { text: 'Mean mẫu làm tổng bình phương bị thấp', keywords: ['mean mẫu', 'thấp', 'bessel', 'thiên lệch'], weight: 2 },
      { text: 'Bậc tự do', keywords: ['bậc tự do', 'degrees of freedom'] },
    ],
    followUps: ['Khi n rất lớn, chia cho n hay n - 1 có quan trọng không?', 'Vì sao giảm phương sai của metric lại giúp giảm cỡ mẫu?'],
    commonMistakes: ['Nói thêm dữ liệu thì std giảm.', 'Dùng std thay cho SE khi tính khoảng tin cậy của mean.'],
  },
])
