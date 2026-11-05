import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-cloud-distributed-01',
    topicId: 'cloud',
    category: 'cloud-compute',
    conceptIds: ['cloud-distributed-computing', 'cloud-fault-tolerance'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: true,
    question: 'Vì sao lại phải dùng tính toán phân tán, và điều gì làm nó khó hơn xử lý trên một máy?',
    referenceAnswer: `Một máy có giới hạn về CPU, bộ nhớ và tốc độ đĩa. Quét 30 TB với tốc độ 500 MB/s mất khoảng 17 giờ, nên phải chia việc cho nhiều máy, và cũng vì một máy lớn đắt hơn nhiều so với năng lực của nó.

Cái khó không nằm ở việc chia việc, mà ở ba điều chỉ có khi đi qua mạng. Thứ nhất là **lỗi một phần**: một máy hỏng trong khi máy khác vẫn chạy, và không phân biệt được máy chết với máy chậm, nên phải dùng timeout. Thứ hai là **chi phí phối hợp**: dữ liệu phải trao đổi qua mạng, chậm hơn bộ nhớ nhiều bậc. Thứ ba là **giới hạn tốc độ tăng**: theo định luật Amdahl, 5% công việc tuần tự làm tốc độ không bao giờ vượt 20 lần.

Vì vậy tôi chỉ phân tán khi một máy không đủ, và khi thiết kế sẽ giảm tối đa phần phải trao đổi giữa các máy.`,
    keyPoints: [
      { text: 'Vượt giới hạn một máy về dữ liệu và thời gian', keywords: ['giới hạn', 'một máy', 'không đủ'], weight: 2 },
      { text: 'Lỗi một phần, không phân biệt máy chết với máy chậm', keywords: ['lỗi một phần', 'partial failure', 'timeout', 'máy chậm'], weight: 2 },
      { text: 'Chi phí mạng và phối hợp', keywords: ['phối hợp', 'qua mạng', 'shuffle', 'coordination'] },
      { text: 'Định luật Amdahl giới hạn tốc độ tăng', keywords: ['amdahl', 'tuần tự'] },
    ],
    followUps: ['Vì sao đồng hồ giữa các máy không đáng tin?', 'Bạn sẽ dùng một máy thay vì một cụm trong trường hợp nào?'],
    commonMistakes: ['Chỉ nói về lợi ích mà không nói đến lỗi một phần.', 'Cho rằng thêm máy thì nhanh tỷ lệ thuận.'],
  },
  {
    id: 'iv-cloud-scaling-01',
    topicId: 'cloud',
    category: 'cloud-compute',
    conceptIds: ['cloud-scaling'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['fresher', 'junior'],
    difficulty: 'co-ban',
    firstPrinciples: false,
    question: 'Horizontal Scaling và Vertical Scaling khác nhau thế nào? Khi nào bạn chọn cách nào?',
    referenceAnswer: `Vertical Scaling là thay máy hiện tại bằng máy mạnh hơn. Ứng dụng không phải sửa, giao dịch và join vẫn nằm trong một máy, nên rất đơn giản. Đổi lại có trần phần cứng, giá tăng nhanh ở cấu hình cao, và hệ thống vẫn là một điểm lỗi duy nhất.

Horizontal Scaling là thêm máy và chia việc. Nó gần như không có trần, mất một máy chỉ mất một phần năng lực, và co giãn được theo tải. Đổi lại phải xử lý mạng, lỗi một phần, di chuyển dữ liệu và tính nhất quán.

Tôi chọn theo điểm nghẽn và kiểu trạng thái. Tầng ứng dụng không giữ trạng thái thì mở rộng ngang, vì chỉ cần thêm máy sau Load Balancer. Cơ sở dữ liệu quan hệ thì thường nâng máy và thêm bản sao đọc trước, vì Sharding làm join và giao dịch khó đi nhiều. Chỉ khi lượng ghi vượt khả năng một máy, tôi mới chia dữ liệu.`,
    keyPoints: [
      { text: 'Vertical đơn giản nhưng có trần và là điểm lỗi duy nhất', keywords: ['trần', 'điểm lỗi', 'single point', 'giới hạn phần cứng'], weight: 2 },
      { text: 'Horizontal không có trần nhưng phức tạp hơn', keywords: ['phức tạp', 'thêm máy', 'hệ phân tán', 'lỗi một phần'], weight: 2 },
      { text: 'Tầng không giữ trạng thái dễ mở rộng ngang', keywords: ['stateless', 'không giữ trạng thái', 'load balancer'] },
      { text: 'Cơ sở dữ liệu nâng máy và bản sao đọc trước khi Sharding', keywords: ['bản sao đọc', 'read replica', 'sharding'] },
    ],
    followUps: ['Bản sao đọc có tăng năng lực ghi không?', 'Thêm máy có làm thông lượng giảm được không?'],
    commonMistakes: ['Nói Horizontal Scaling luôn tốt hơn.', 'Không hỏi điểm nghẽn nằm ở đâu.'],
  },
  {
    id: 'iv-cloud-scaling-02',
    topicId: 'cloud',
    category: 'cloud-compute',
    conceptIds: ['cloud-scaling', 'db-sharding', 'cloud-replication'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Cơ sở dữ liệu của bạn đang quá tải. Bạn đi từng bước thế nào trước khi quyết định Sharding?',
    referenceAnswer: `Tôi bắt đầu bằng cách đo, vì đọc và ghi quá tải cần hai hướng khác nhau. Tôi xem CPU, I/O, tỷ lệ đọc ghi, các truy vấn đắt nhất và tình trạng chờ khóa.

Tiếp theo tôi đi từ cách rẻ đến cách đắt. Trước hết là sửa truy vấn và thêm chỉ mục, vì một truy vấn xấu có thể chiếm phần lớn tải. Nếu đọc chiếm phần lớn, tôi thêm cache và bản sao đọc, và chấp nhận độ trễ sao chép với dashboard. Phần phân tích nặng tôi đưa sang kho dữ liệu, thay vì chạy trên cơ sở dữ liệu giao dịch. Nâng máy cũng là lựa chọn tốt khi còn dư địa, vì không phải sửa kiến trúc.

Sharding là bước cuối, chỉ khi lượng ghi hoặc kích thước dữ liệu vượt khả năng một máy lớn. Nó làm join và giao dịch qua nhiều shard rất khó, cần chọn key cẩn thận để tránh lệch tải, và việc chia lại về sau rất đắt. Chi phí này tồn tại suốt đời hệ thống, nên chỉ nên trả khi thật sự cần.`,
    keyPoints: [
      { text: 'Đo trước để tìm điểm nghẽn, phân biệt đọc và ghi', keywords: ['đo', 'điểm nghẽn', 'tỷ lệ đọc ghi', 'monitor'], weight: 2 },
      { text: 'Tối ưu truy vấn, chỉ mục', keywords: ['chỉ mục', 'index', 'truy vấn đắt', 'tối ưu truy vấn'] },
      { text: 'Cache và bản sao đọc cho tải đọc', keywords: ['cache', 'bản sao đọc', 'read replica'], weight: 2 },
      { text: 'Đưa phân tích sang kho dữ liệu', keywords: ['kho dữ liệu', 'data warehouse', 'olap'] },
      { text: 'Sharding là bước cuối, nêu rõ chi phí', keywords: ['sharding', 'bước cuối', 'chia dữ liệu', 'join'], weight: 2 },
    ],
    followUps: ['Bạn chọn shard key thế nào?', 'Độ trễ sao chép ảnh hưởng tới người dùng ra sao?'],
    commonMistakes: ['Đề xuất Sharding hoặc đổi sang NoSQL ngay.', 'Thêm bản sao đọc để giải quyết quá tải ghi.'],
  },
  {
    id: 'iv-cloud-scaling-03',
    topicId: 'cloud',
    category: 'cloud-compute',
    conceptIds: ['cloud-scaling', 'cloud-bigquery', 'cloud-redshift'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Vì sao các kho dữ liệu hiện đại tách lưu trữ khỏi tính toán? Điều đó thay đổi cách mở rộng ra sao?',
    referenceAnswer: `Khi lưu trữ và tính toán nằm chung một máy, hai nhu cầu bị buộc với nhau. Dữ liệu tăng thì phải thêm máy, kể cả khi CPU đang rảnh. Tải truy vấn tăng cũng phải thêm máy, kèm theo việc chia lại dữ liệu rất tốn thời gian. Hai thứ này thực tế tăng với tốc độ khác nhau.

Khi tách ra, dữ liệu nằm trên lưu trữ bền, rẻ như object storage, còn tính toán là cụm riêng co giãn độc lập. Có thể tăng năng lực vào giờ cao điểm rồi giảm xuống mà không phải di chuyển dữ liệu. Nhiều cụm cũng đọc được cùng một dữ liệu, nên tách được tải ETL khỏi tải BI.

Đánh đổi là đọc qua mạng chậm hơn đĩa cục bộ. Vì vậy các hệ thống này dùng SSD làm cache, như Redshift RA3, và dựa nhiều vào định dạng cột và cắt bớt dữ liệu cần đọc. BigQuery đẩy xa hơn: người dùng không quản lý máy, truy vấn chỉ dùng slot khi chạy. Với job dài trên dữ liệu đã nạp vào cache, lợi ích về hiệu năng so với kiến trúc cũ không còn rõ ràng như lợi ích về vận hành.`,
    keyPoints: [
      { text: 'Lưu trữ và tính toán tăng với tốc độ khác nhau', keywords: ['tốc độ khác nhau', 'độc lập', 'buộc với nhau'], weight: 2 },
      { text: 'Co giãn tính toán không phải chia lại dữ liệu', keywords: ['không phải di chuyển', 'chia lại', 'co giãn'], weight: 2 },
      { text: 'Nhiều cụm cùng đọc một dữ liệu để tách tải', keywords: ['tách tải', 'nhiều cụm', 'data sharing'] },
      { text: 'Đánh đổi về độ trễ, bù bằng cache', keywords: ['cache', 'ssd', 'độ trễ', 'qua mạng'] },
    ],
    followUps: ['RA3 quyết định dữ liệu nào nằm trên SSD thế nào?', 'Khi nào kiến trúc gắn liền vẫn có lợi?'],
    commonMistakes: ['Chỉ nói là để rẻ hơn mà không giải thích vì sao.', 'Quên chi phí đọc qua mạng.'],
  },
  {
    id: 'iv-cloud-scaling-04',
    topicId: 'cloud',
    category: 'cloud-compute',
    conceptIds: ['cloud-scaling', 'cloud-ec2'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: false,
    question: 'Thiết kế Auto Scaling cho một nhóm worker xử lý sự kiện từ hàng đợi. Bạn dựa vào chỉ số nào và lưu ý điều gì?',
    referenceAnswer: `CPU thường là chỉ số sai ở đây, vì worker có thể đang chờ một dịch vụ phía sau và CPU vẫn thấp trong khi hàng đợi tăng. Tôi dựa vào **tồn đọng trên mỗi worker**, hoặc thời gian chờ của thông điệp cũ nhất, vì nó gắn trực tiếp với mục tiêu độ trễ. Ví dụ mỗi worker xử lý 100 sự kiện mỗi giây và mục tiêu chờ dưới 60 giây, thì giữ tồn đọng dưới 6.000 sự kiện mỗi worker.

Các lưu ý gồm: máy mới mất vài phút mới chạy được, nên phải tăng sớm hơn hoặc giữ sẵn một ít dư thừa. Cần thời gian nghỉ để tránh dao động. Khi giảm máy phải dừng nhẹ nhàng để không bỏ dở việc, và việc xử lý phải [[etl-idempotency|idempotent]] vì thông điệp có thể bị xử lý lại.

Quan trọng nhất là kiểm tra phía sau: nếu cơ sở dữ liệu đích là điểm nghẽn, thêm worker chỉ làm nó tệ hơn. Tôi đặt giới hạn tối đa cho số worker. Với phần tải dư có thể dùng Spot, vì worker không giữ trạng thái chịu được việc bị thu hồi.`,
    keyPoints: [
      { text: 'Dùng tồn đọng hoặc tuổi thông điệp thay vì CPU', keywords: ['tồn đọng', 'độ dài hàng đợi', 'backlog', 'tuổi thông điệp', 'lag'], weight: 2 },
      { text: 'Máy mới khởi động chậm', keywords: ['khởi động', 'vài phút', 'tăng sớm'] },
      { text: 'Thời gian nghỉ, tránh dao động', keywords: ['thời gian nghỉ', 'cooldown', 'dao động'] },
      { text: 'Xử lý idempotent và dừng nhẹ nhàng', keywords: ['idempotent', 'dừng nhẹ nhàng', 'graceful'] },
      { text: 'Giới hạn trên để bảo vệ hệ thống phía sau', keywords: ['giới hạn tối đa', 'điểm nghẽn', 'phía sau'], weight: 2 },
    ],
    followUps: ['Dùng Spot cho nhóm này thế nào?', 'Nếu sự kiện phải theo đúng thứ tự thì sao?'],
    commonMistakes: ['Dùng CPU làm chỉ số duy nhất.', 'Không nghĩ đến dịch vụ phía sau.'],
  },
  {
    id: 'iv-cloud-lb-01',
    topicId: 'cloud',
    category: 'cloud-compute',
    conceptIds: ['cloud-load-balancing', 'cloud-high-availability'],
    interviewTypes: ['de', 'bigdata', 'system-design'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question: 'Load Balancer hoạt động thế nào? L4 và L7 khác nhau ra sao, và bạn chọn thuật toán dựa vào đâu?',
    referenceAnswer: `Load Balancer nhận yêu cầu tại một địa chỉ duy nhất, kiểm tra sức khỏe các máy phía sau theo định kỳ, và chỉ chuyển yêu cầu tới máy đang khỏe. Nhờ vậy client không cần biết số máy, và có thể thêm bớt hoặc nâng cấp dần từng máy.

L4 chỉ nhìn địa chỉ và cổng, nên nhanh và dùng được cho mọi giao thức TCP. L7 đọc nội dung HTTP nên định tuyến được theo đường dẫn, header, nhưng tốn tài nguyên hơn. Tôi chọn L7 khi cần định tuyến theo nội dung, và L4 khi cần hiệu năng cao hoặc giao thức không phải HTTP.

Thuật toán phụ thuộc vào đặc điểm yêu cầu. Yêu cầu đều nhau thì Round Robin là đủ. Độ dài chênh lệch lớn thì Least Connections, vì nó tránh máy đang bận. Dịch vụ có cache theo key thì Consistent Hashing, vì giữ được cache đã nạp khi đổi số máy.

Nó không phù hợp với hệ thống mà máy không thay thế được nhau, như việc ghi vào broker Kafka, vì Producer phải nói chuyện đúng với leader của Partition.`,
    keyPoints: [
      { text: 'Health Check và loại máy hỏng', keywords: ['health check', 'kiểm tra sức khỏe', 'máy hỏng'], weight: 2 },
      { text: 'L4 nhìn địa chỉ và cổng, L7 đọc nội dung', keywords: ['địa chỉ', 'cổng', 'đường dẫn', 'header', 'http'], weight: 2 },
      { text: 'Chọn thuật toán theo đặc điểm yêu cầu', keywords: ['round robin', 'least connections', 'consistent hashing'] },
      { text: 'Không phù hợp khi máy không thay thế được nhau', keywords: ['kafka', 'leader', 'không thay thế', 'giữ trạng thái'] },
    ],
    followUps: ['Vì sao nên hạn chế sticky session?', 'Làm sao để Load Balancer không thành điểm lỗi duy nhất?'],
    commonMistakes: ['Cho rằng Load Balancer tăng được năng lực ghi của cơ sở dữ liệu.'],
  },
])
