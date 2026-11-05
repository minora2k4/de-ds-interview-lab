import { defineConcept } from '../../define'

export default defineConcept({
  id: 'dq-time-series',
  summary:
    'Chuỗi thời gian cần kiểm tra trục thời gian trước (tần suất, khoảng trống, timestamp trùng, múi giờ), rồi tới cấu trúc (Stationarity, Seasonality), và cuối cùng là Look-ahead Bias. Lỗi trục thời gian làm sai mọi kiểm tra sau đó.',
  tags: ['Chuỗi thời gian', 'Look-ahead Bias', 'Stationarity', 'First Principles'],
  related: ['dq-overview', 'dq-drift', 'dq-event-log', 'eda-leakage', 'eval-train-val-test', 'stats-hypothesis'],
  sections: {
    definition: `**Time Series Data (Dữ liệu chuỗi thời gian)** là các quan sát có thứ tự theo thời gian, trong đó **thứ tự mang thông tin** và giá trị hiện tại thường phụ thuộc vào quá khứ.

**Stationarity (Tính dừng)** là khi các đặc tính thống kê như trung bình và phương sai không đổi theo thời gian. **Seasonality (Tính mùa vụ)** là mẫu lặp lại theo chu kỳ cố định. **Look-ahead Bias (Sai lệch nhìn trước)** là khi dữ liệu dùng để dự đoán chứa thông tin mà lúc đó chưa thể biết.`,

    origin: `Kiểm tra cho dữ liệu dạng bảng giả định các dòng độc lập nhau, nên không phát hiện được những lỗi chỉ tồn tại theo thứ tự. Một khoảng trống 6 giờ không tạo ra null nào, vì dòng đó đơn giản là không tồn tại. Chia ngẫu nhiên train và test thì vẫn chạy được, nhưng đã dùng tương lai để đoán quá khứ. Vì vậy chuỗi thời gian cần bộ kiểm tra riêng.`,

    whyUse: `Lỗi chuỗi thời gian thường **làm điểm đánh giá đẹp giả tạo**, thay vì gây ra lỗi rõ ràng. Mô hình giao dịch dùng giá đã điều chỉnh về sau có thể đạt kết quả rất tốt khi backtest và thua lỗ khi chạy thật. Vì vậy phải kiểm tra trước khi tin vào bất kỳ chỉ số nào.`,

    mechanism: `**Thứ tự kiểm tra rất quan trọng,** vì mỗi bước giả định bước trước đã đúng.

**Bước 1: Trục thời gian**
- **Tần suất lấy mẫu:** khoảng cách giữa hai quan sát có đều không. Cảm biến đổi từ 1 phút sang 5 phút sẽ làm hỏng mọi đặc trưng theo cửa sổ.
- **Khoảng trống:** so các mốc kỳ vọng với mốc thực tế. Điểm quan trọng là khoảng trống này ngẫu nhiên hay đúng vào lúc hệ thống quá tải, vì khi đó phần bị thiếu lại chính là phần quan trọng nhất.
- **Timestamp trùng:** cùng thiết bị, cùng thời điểm, hai giá trị. Phải biết nên lấy cái nào.
- **Múi giờ:** dữ liệu lưu theo giờ địa phương sẽ có ngày 23 giờ và ngày 25 giờ khi đổi giờ mùa hè. Nên lưu theo UTC và giữ múi giờ riêng.

**Bước 2: Giá trị:** giá trị đóng băng lặp lại nhiều lần thường là cảm biến hỏng. Dữ liệu được forward-fill có thể trông liền mạch nhưng đang che khoảng trống.

**Bước 3: Cấu trúc**
- **Seasonality:** vẽ theo chu kỳ, xem ACF. Thiếu một mùa trong dữ liệu thì mô hình chưa từng thấy mùa đó.
- **Stationarity:** dùng cùng lúc hai kiểm định có giả thuyết ngược nhau. **ADF** có H0 là chuỗi không dừng (có nghiệm đơn vị), **KPSS** có H0 là chuỗi dừng. Chuỗi không dừng không phải là chuỗi xấu, nó chỉ cần được biến đổi hoặc mô hình hóa phù hợp.

**Bước 4: Look-ahead Bias**
- Mỗi đặc trưng phải dùng dữ liệu **có sẵn tại thời điểm dự đoán**, tính cả độ trễ công bố. Số liệu tháng 3 thường đến tháng 4 mới có.
- Dữ liệu có thể bị sửa về sau. Cần giá trị **như đã biết lúc đó (point-in-time)**, không phải giá trị đã hiệu chỉnh.
- Tham số chuẩn hóa chỉ được tính trên phần quá khứ.
- Chia train và test theo thời gian, không ngẫu nhiên. Xem [[eval-train-val-test]].`,

    diagram: {
      mermaid: `flowchart TD
  A["Trục thời gian: tần suất, khoảng trống, trùng, múi giờ"] --> B["Giá trị: đóng băng, forward-fill, đột biến"]
  B --> C["Cấu trúc: Seasonality, Stationarity"]
  C --> D["Look-ahead Bias: mỗi đặc trưng có sẵn lúc dự đoán không"]
  D --> E["Chia train và test theo thời gian"]`,
      caption:
        'Sửa trục thời gian trước, vì Seasonality hay đặc trưng theo cửa sổ đều giả định khoảng cách giữa các điểm là đúng.',
    },

    example: `Công ty điện lực dự báo phụ tải theo giờ với dữ liệu 3 năm:

- **Múi giờ:** dữ liệu theo giờ địa phương, có 2 ngày mỗi năm bị sai số dòng khi đổi giờ. Chuyển sang UTC thì hết.
- **Khoảng trống:** thiếu 0,6% số giờ, nhưng 70% trong số đó rơi vào đợt nắng nóng, khi hệ thống đo quá tải. Đây là phần quan trọng nhất đối với dự báo đỉnh.
- **Forward-fill:** một đoạn 400 giờ có giá trị giống hệt nhau, do thiết bị hỏng, đã bị đội trước điền lại.
- **Look-ahead:** cột \`temperature\` là nhiệt độ thực đo. Lúc dự báo thật chỉ có **nhiệt độ dự báo**, nên mô hình được đánh giá quá lạc quan.

Sau khi sửa, sai số trên backtest tăng từ 2,1% lên 3,4%, sát với sai số thực tế 3,6% khi vận hành.`,

    prosCons: {
      pros: [
        '**Kiểm tra trục thời gian rẻ và tự động được,** chỉ cần cột thời gian.',
        '**Ngăn được kết quả ảo trong backtest,** vốn là rủi ro lớn nhất.',
      ],
      cons: [
        '**Look-ahead Bias khó tự động,** vì cần biết thời điểm từng giá trị được công bố.',
        '**Kiểm định tính dừng dễ bị nhiễu** bởi khoảng trống và đột biến, và với mẫu rất lớn thì khác biệt nhỏ cũng có ý nghĩa thống kê.',
        '**Dữ liệu point-in-time tốn kém,** vì phải lưu lại cả các phiên bản đã sửa.',
      ],
    },

    whenToUse: {
      use: [
        'Kiểm tra trục thời gian trước khi tính bất kỳ đặc trưng cửa sổ nào.',
        'Lập bảng độ trễ công bố của từng nguồn dữ liệu trước khi làm backtest.',
        'Đảm bảo dữ liệu bao phủ đủ mọi chu kỳ mùa vụ cần dự báo.',
      ],
      avoid: [
        'Không chia ngẫu nhiên train và test.',
        'Không forward-fill khoảng trống dài mà không đánh dấu lại.',
        'Không kết luận chỉ từ một kiểm định tính dừng.',
      ],
    },

    comparison: {
      intro: 'Khác biệt khi đánh giá so với dữ liệu dạng bảng:',
      headers: ['Tiêu chí', 'Dạng bảng', 'Chuỗi thời gian'],
      rows: [
        ['Giả định về các dòng', 'Thường xem là độc lập', 'Phụ thuộc theo thứ tự'],
        ['Dữ liệu thiếu', 'Thường thấy dưới dạng null', 'Thường là dòng không tồn tại'],
        ['Tính duy nhất', 'Khóa nghiệp vụ', 'Khóa thực thể cộng thời gian'],
        ['Chia train và test', 'Có thể ngẫu nhiên', 'Theo thời gian'],
        ['Dạng Leakage chính', 'Cột ghi sau khi có kết quả', 'Look-ahead Bias'],
      ],
    },

    misconceptions: [
      {
        myth: 'Chuỗi không dừng là dữ liệu xấu.',
        truth: 'Doanh thu có xu hướng tăng là chuyện bình thường. Tính dừng là giả định của một số mô hình, nên kết quả chỉ quyết định cách biến đổi, không quyết định chất lượng.',
      },
      {
        myth: 'Không có null nghĩa là chuỗi không có khoảng trống.',
        truth: 'Khoảng trống thường là dòng không tồn tại. Phải tạo danh sách mốc kỳ vọng và so với mốc thực tế.',
      },
      {
        myth: 'Chỉ cần chia train và test theo thời gian là hết Look-ahead Bias.',
        truth: 'Đặc trưng vẫn có thể chứa tương lai, như nhiệt độ thực đo, số liệu đã hiệu chỉnh, hoặc chuẩn hóa bằng thống kê của toàn chuỗi.',
      },
    ],
  },
})
