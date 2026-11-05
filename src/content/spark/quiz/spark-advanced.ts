import { defineQuiz } from '../../define'

/** Câu mức Chuyên sâu, kết hợp nhiều khái niệm trong cùng một tình huống. */
export default defineQuiz([
  {
    id: 'q-spark-deep-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation', 'spark-cache-persist'],
    difficulty: 'chuyen-sau',
    skill: 'problem-solving',
    tags: ['Lazy Evaluation', 'Cache', 'Tính nhất quán'],
    type: 'scenario',
    scenario:
      'Code đọc bảng nguồn, thêm cột bằng `current_timestamp()` và một cột bằng `rand()`, rồi ghi ra hai nơi bằng hai lệnh `write` liên tiếp. Khi đối chiếu, hai đích có giá trị `rand` khác nhau, và một đích có thêm dòng mới vì bảng nguồn vừa được nạp thêm.',
    prompt: 'Nguyên nhân gốc và cách sửa phù hợp nhất là gì?',
    options: [
      {
        id: 'a',
        text: 'Hai lệnh `write` tạo hai job tính lại từ nguồn, nên hàm không tất định và dữ liệu nguồn đều có thể đổi. Hãy `persist` rồi nạp hẳn trước khi ghi, hoặc ghi một lần rồi đọc lại',
        explanation: 'Đúng. Dữ liệu trung gian không được giữ lại, nên mỗi job có thể cho kết quả khác nhau.',
      },
      {
        id: 'b',
        text: '`rand()` luôn cho cùng một kết quả, nên lỗi nằm ở tầng lưu trữ của đích',
        explanation: 'Sai. `rand()` không tất định nếu không có seed, và mỗi lần tính lại có thể khác đi.',
      },
      {
        id: 'c',
        text: 'Do Catalyst gộp hai lệnh `write` thành một và làm mất dữ liệu',
        explanation: 'Sai. Hai Action luôn là hai job riêng, Catalyst không gộp chúng lại.',
      },
      {
        id: 'd',
        text: 'Chỉ cần đặt seed cho `rand()` là hai đích sẽ giống hệt nhau',
        explanation: 'Sai. Seed chỉ xử lý một phần, vì dữ liệu nguồn mới vẫn làm kết quả khác đi.',
      },
    ],
    correct: 'a',
    explanation:
      'Khi một kết quả phải nhất quán giữa nhiều đích, không thể dựa vào việc tính lại. Cần cố định dữ liệu tại một điểm. Lưu ý cache có thể bị mất khi mất Executor, nên nếu yêu cầu rất chặt thì nên ghi ra rồi đọc lại.',
  },
  {
    id: 'q-spark-deep-02',
    topicId: 'spark',
    category: 'spark-join',
    conceptIds: ['spark-sort-merge-join', 'spark-data-skew'],
    difficulty: 'chuyen-sau',
    skill: 'mechanism',
    tags: ['Join', 'Skew', 'Nhân dòng'],
    type: 'scenario',
    scenario:
      'Join hai bảng theo `user_id`. Một `user_id` xuất hiện 2 triệu lần ở bảng trái và 50.000 lần ở bảng phải. Đầu vào của Task đó chỉ khoảng 3 GB, nhưng Task chạy rất lâu rồi OOM, trong khi ghi spill rất nhiều.',
    prompt: 'Điều gì giải thích tốt nhất việc này?',
    options: [
      {
        id: 'a',
        text: 'Đầu vào 3 GB là quá lớn so với mọi Executor',
        explanation: 'Sai. 3 GB là lớn nhưng không giải thích được mức bùng nổ này.',
      },
      {
        id: 'b',
        text: 'Sort Merge Join luôn tốn bộ nhớ gấp đôi đầu vào',
        explanation: 'Sai. Không có quy tắc như vậy.',
      },
      {
        id: 'c',
        text: 'Số dòng đầu ra của key này là tích 2 triệu nhân 50.000, tức 100 tỷ dòng',
        explanation: 'Đúng. Join nhiều-nhiều làm dòng nhân lên, nên đầu ra lớn hơn đầu vào rất nhiều.',
      },
      {
        id: 'd',
        text: 'Do AQE gộp nhầm các Partition lại với nhau',
        explanation: 'Sai. AQE không phải nguyên nhân tạo ra lượng dòng đầu ra này.',
      },
    ],
    correct: 'c',
    explanation:
      'Khi phân tích skew của Join, phải nhìn cả đầu ra chứ không chỉ đầu vào. Nên kiểm tra xem Join nhiều-nhiều có đúng nghiệp vụ không. Thường đây là dấu hiệu thiếu điều kiện Join hoặc sai độ chi tiết của dữ liệu.',
  },
  {
    id: 'q-spark-deep-03',
    topicId: 'spark',
    category: 'spark-data',
    conceptIds: ['spark-shuffle', 'spark-cluster-manager'],
    difficulty: 'chuyen-sau',
    skill: 'problem-solving',
    tags: ['Shuffle', 'FetchFailedException', 'Spot'],
    type: 'scenario',
    scenario:
      'Job chạy trên máy spot, thường xuyên báo `FetchFailedException`. Các Stage liên tục chạy lại, nên thời gian chạy tăng gấp ba. Dữ liệu không lệch và không có OOM.',
    prompt: 'Hướng xử lý nào giải quyết đúng gốc rễ?',
    options: [
      {
        id: 'a',
        text: 'Tăng `spark.task.maxFailures` lên 100',
        explanation: 'Sai. Lỗi nằm ở dữ liệu shuffle đã mất, thử lại Task của Stage sau vẫn không có dữ liệu để đọc.',
      },
      {
        id: 'b',
        text: 'Bật Speculative Execution',
        explanation: 'Sai. Bản sao Task cũng không đọc được file shuffle đã mất.',
      },
      {
        id: 'c',
        text: 'Tăng bộ nhớ Executor',
        explanation: 'Sai. Không có dấu hiệu nào về thiếu bộ nhớ.',
      },
      {
        id: 'd',
        text: 'Giữ file shuffle sống lâu hơn Executor, ví dụ bằng Decommission hoặc External Shuffle Service, và cân nhắc dùng máy ổn định cho phần giữ dữ liệu',
        explanation: 'Đúng. Khi máy spot bị thu hồi, file shuffle không còn. Cần giúp dữ liệu không mất theo máy.',
      },
    ],
    correct: 'd',
    explanation:
      'Máy spot rẻ nhưng làm file shuffle trên đĩa cục bộ dễ mất. Decommission giúp di chuyển dữ liệu đi khi máy sắp bị thu hồi. External Shuffle Service không có trên Kubernetes, nên trên đó phải chọn cách khác.',
  },
  {
    id: 'q-spark-deep-04',
    topicId: 'spark',
    category: 'spark-engine',
    conceptIds: ['spark-catalyst', 'spark-partition'],
    difficulty: 'chuyen-sau',
    skill: 'mechanism',
    tags: ['Catalyst', 'Partition Pruning', 'Join'],
    type: 'single',
    prompt:
      'Bảng `sales` phân vùng theo `date` được join với bảng `calendar` nhỏ, có điều kiện lọc `calendar.is_holiday = true`. `sales` không có điều kiện lọc nào theo `date`, nhưng Spark vẫn chỉ đọc vài thư mục. Cơ chế nào làm được việc này?',
    options: [
      {
        id: 'a',
        text: 'Column Pruning, vì Spark chỉ đọc các cột được dùng',
        explanation: 'Sai. Column Pruning chỉ bỏ cột, không bỏ qua các thư mục phân vùng.',
      },
      {
        id: 'b',
        text: 'Dynamic Partition Pruning: dùng kết quả lọc của bảng nhỏ lúc chạy để bỏ qua phân vùng của bảng lớn',
        explanation: 'Đúng. Giá trị `date` chỉ biết được khi chạy, nên Spark dùng chúng để lọc phân vùng của `sales`.',
      },
      {
        id: 'c',
        text: 'Partition Pruning thông thường, vì đã có điều kiện lọc tĩnh trên `sales.date`',
        explanation: 'Sai. Trên `sales` không có điều kiện lọc tĩnh theo `date`.',
      },
      {
        id: 'd',
        text: 'Bucketing tự động theo `date`',
        explanation: 'Sai. Bucketing phải được thiết lập khi ghi, và không có tác dụng bỏ qua thư mục.',
      },
    ],
    correct: 'b',
    explanation:
      'Dynamic Partition Pruning đặc biệt hữu ích với mô hình Star Schema, nơi bộ lọc thường nằm trên bảng Dimension còn phân vùng nằm trên bảng Fact.',
  },
  {
    id: 'q-spark-deep-05',
    topicId: 'spark',
    category: 'spark-performance-group',
    conceptIds: ['spark-performance', 'spark-partition'],
    difficulty: 'chuyen-sau',
    skill: 'design',
    tags: ['Hiệu năng', 'Thiết kế'],
    type: 'short-answer',
    prompt:
      'Một job chạy trên dữ liệu thay đổi từ 50 GB đến 5 TB tùy ngày. Làm sao để cấu hình Partition và tài nguyên không phải sửa tay cho mỗi ngày?',
    referenceAnswer:
      'Không dùng con số cố định. Đặt `spark.sql.shuffle.partitions` đủ cao cho ngày lớn nhất, rồi để **AQE gộp bớt** Partition nhỏ ở ngày ít dữ liệu, vì AQE chỉ gộp chứ không tự chia. Tính **số tệp đầu ra theo dung lượng** thay vì một hằng số. Dùng **Dynamic Allocation** để số Executor tăng giảm theo tải, nhớ bật cơ chế giữ file shuffle. Cuối cùng **giám sát** thời gian và spill theo kích thước đầu vào để phát hiện điểm gãy.',
    keyPoints: [
      { text: 'Đặt số Partition đủ cao và để AQE gộp lại', keywords: ['aqe', 'gộp', 'đủ cao'], weight: 2 },
      { text: 'Tính số tệp đầu ra theo dung lượng', keywords: ['theo dung lượng', 'số tệp', 'kích thước tệp'] },
      { text: 'Dùng Dynamic Allocation', keywords: ['dynamic allocation', 'tăng giảm'], weight: 2 },
      { text: 'Giám sát theo kích thước đầu vào', keywords: ['giám sát', 'điểm gãy', 'theo dõi'] },
    ],
    explanation:
      'Thiết kế cho dữ liệu thay đổi quan trọng hơn việc tìm ra một cấu hình tối ưu cho một ngày cụ thể.',
  },
  {
    id: 'q-spark-deep-06',
    topicId: 'spark',
    category: 'spark-arch',
    conceptIds: ['spark-executor', 'spark-pyspark'],
    difficulty: 'chuyen-sau',
    skill: 'tradeoff',
    tags: ['Executor', 'Bộ nhớ', 'Pandas UDF'],
    type: 'multiple',
    prompt:
      'Một job dùng Pandas UDF chạy theo nhóm, mỗi nhóm khoảng 2 GB. Executor có heap 8 GB, overhead mặc định và 4 core. Container bị giết thường xuyên. Những thay đổi nào có cơ sở?',
    options: [
      {
        id: 'a',
        text: 'Tăng memory overhead, vì dữ liệu của Pandas UDF nằm trong tiến trình Python, ngoài heap',
        explanation: 'Đúng. Bốn nhóm 2 GB đồng thời có thể vượt xa phần overhead mặc định.',
      },
      {
        id: 'b',
        text: 'Giảm số core mỗi Executor để ít nhóm được xử lý đồng thời hơn',
        explanation: 'Đúng. Ít Task đồng thời hơn nghĩa là ít tiến trình Python giữ dữ liệu cùng lúc hơn.',
      },
      {
        id: 'c',
        text: 'Tăng `spark.memory.fraction` lên 0.9',
        explanation: 'Sai. Tham số này chia lại heap, không tăng bộ nhớ cho tiến trình Python.',
      },
      {
        id: 'd',
        text: 'Xem lại vì sao mỗi nhóm lớn tới 2 GB, có thể chia nhóm nhỏ hơn không',
        explanation: 'Đúng. Mỗi nhóm phải nằm trọn trong bộ nhớ của một tiến trình Python, nên kích thước nhóm mới là gốc của vấn đề.',
      },
    ],
    correct: ['a', 'b', 'd'],
    explanation:
      'Với UDF theo nhóm, cả nhóm phải được đưa vào bộ nhớ Python. Khác với hàm tích hợp, Spark không thể tràn dữ liệu ra đĩa ở đây.',
  },
])
