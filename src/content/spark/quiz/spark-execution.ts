import { defineQuiz } from '../../define'

export default defineQuiz([
  {
    id: 'q-spark-lazy-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation'],
    difficulty: 'co-ban',
    skill: 'essence',
    tags: ['Lazy Evaluation', 'Action'],
    type: 'single',
    prompt: 'Lý do cốt lõi khiến Spark trì hoãn Transformation đến khi gặp Action là gì?',
    options: [
      {
        id: 'a',
        text: 'Để thấy toàn bộ kế hoạch rồi tối ưu trước khi tốn tài nguyên cụm',
        explanation:
          'Đúng. Khi thấy cả pipeline, Catalyst có thể đẩy bộ lọc xuống nguồn, bỏ cột thừa và gộp các bước liên tiếp.',
      },
      {
        id: 'b',
        text: 'Để mỗi phép filter hoặc map tự chạy nhanh hơn',
        explanation:
          'Sai. Tốc độ của một phép tính riêng lẻ không đổi. Lợi ích đến từ việc giảm dữ liệu và công việc thừa.',
      },
      {
        id: 'c',
        text: 'Để kết quả của mỗi bước được tự động lưu vào RAM',
        explanation:
          'Sai. Mặc định Spark không lưu kết quả trung gian. Muốn lưu phải gọi cache hoặc persist.',
      },
      {
        id: 'd',
        text: 'Để giảm số Executor cần cấp cho ứng dụng',
        explanation: 'Sai. Số Executor do cấu hình và Dynamic Allocation quyết định, không phụ thuộc vào việc trì hoãn.',
      },
    ],
    correct: 'a',
    explanation:
      'Trì hoãn cho Spark cái nhìn toàn cục về pipeline. Đây là điều mà mỗi job MapReduce riêng lẻ không có được.',
  },
  {
    id: 'q-spark-lazy-02',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation', 'spark-cache-persist'],
    difficulty: 'trung-binh',
    skill: 'mechanism',
    tags: ['Lazy Evaluation', 'Cache'],
    type: 'true-false',
    prompt:
      'Gọi `df.count()` hai lần liên tiếp trên cùng một DataFrame chưa cache sẽ khiến Spark tính lại từ nguồn dữ liệu hai lần.',
    correct: true,
    explanation:
      'Mỗi Action tạo một job riêng. Kết quả không được giữ lại nên job thứ hai chạy lại toàn bộ kế hoạch. Với RDD, shuffle file của lần chạy trước có thể được dùng lại nên một số Stage được bỏ qua, nhưng đó không phải là lưu kết quả như cache.',
    wrongExplanation:
      'Spark không tự nhớ kết quả của lần `count` trước. Muốn dùng lại kết quả trung gian thì phải gọi `cache` hoặc `persist`.',
  },
  {
    id: 'q-spark-lazy-03',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation', 'spark-catalyst'],
    difficulty: 'trung-binh',
    skill: 'mechanism',
    tags: ['Lazy Evaluation', 'Catalyst'],
    type: 'multiple',
    prompt: 'Những tối ưu nào chỉ có thể làm được nhờ Spark thấy toàn bộ kế hoạch trước khi chạy?',
    options: [
      {
        id: 'a',
        text: 'Predicate Pushdown: đẩy điều kiện lọc xuống tầng đọc dữ liệu',
        explanation: 'Đúng. Spark phải biết phía sau có bộ lọc nào thì mới đẩy xuống được.',
      },
      {
        id: 'b',
        text: 'Column Pruning: chỉ đọc những cột thật sự được dùng',
        explanation: 'Đúng. Chỉ khi thấy các bước sau, Spark mới biết cột nào không còn cần.',
      },
      {
        id: 'c',
        text: 'Replication: giữ nhiều bản sao của Block trên HDFS',
        explanation: 'Sai. Đây là cơ chế của HDFS để chịu lỗi, không liên quan đến kế hoạch của Spark.',
      },
      {
        id: 'd',
        text: 'Gộp các Narrow Transformation liên tiếp vào một Stage',
        explanation: 'Đúng. Spark nhìn chuỗi phép tính và chạy chúng liền mạch trên từng Partition.',
      },
    ],
    correct: ['a', 'b', 'd'],
    explanation:
      'Các tối ưu này đều cần biết những gì sẽ xảy ra ở phía sau. Một hệ thống chạy ngay từng bước không có thông tin đó.',
  },
  {
    id: 'q-spark-lazy-04',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation', 'spark-action'],
    difficulty: 'co-ban',
    skill: 'recall',
    tags: ['Lazy Evaluation', 'Action'],
    type: 'fill-blank',
    prompt: 'Trong Spark, các phép biến đổi chỉ thực sự chạy khi gặp một ____.',
    acceptedAnswers: ['Action', 'phép Action', 'hành động'],
    explanation:
      'Action như `count`, `collect` hoặc `write` là điểm kích hoạt: Spark tạo job, tối ưu kế hoạch rồi đưa xuống cụm.',
  },
  {
    id: 'q-spark-lazy-05',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation', 'spark-transformation'],
    difficulty: 'nang-cao',
    skill: 'problem-solving',
    tags: ['Lazy Evaluation', 'Gỡ lỗi'],
    type: 'scenario',
    scenario:
      'Một pipeline ETL có 15 bước, trong đó có UDF ép kiểu số tiền. Job chạy 3 giờ rồi hỏng ở bước `write` với lỗi `NumberFormatException` từ UDF. Đồng nghiệp nói bước `write` bị lỗi nên cần sửa cấu hình ghi.',
    prompt: 'Đánh giá nào đúng nhất?',
    options: [
      {
        id: 'a',
        text: 'Lỗi nằm ở dữ liệu đi qua UDF. Nó chỉ lộ ra ở `write` vì đó là Action kích hoạt toàn bộ kế hoạch',
        explanation:
          'Đúng. Trì hoãn khiến lỗi dữ liệu xuất hiện ở Action, dù nguyên nhân nằm ở Transformation phía trước.',
      },
      {
        id: 'b',
        text: 'Lỗi do cấu hình `write`, vì stack trace xuất hiện ở bước này',
        explanation:
          'Sai. Thời điểm báo lỗi không phải nơi phát sinh lỗi. `write` chỉ là Action đã kích hoạt tính toán.',
      },
      {
        id: 'c',
        text: 'Lỗi do thiếu bộ nhớ Executor làm hỏng kiểu dữ liệu',
        explanation: 'Sai. Thiếu bộ nhớ gây lỗi OOM, không tạo ra `NumberFormatException`.',
      },
      {
        id: 'd',
        text: 'Spark không kiểm tra kiểu dữ liệu nên không thể biết lỗi ở đâu',
        explanation: 'Sai. Stack trace vẫn trỏ về UDF, và có thể kiểm tra bằng cách chạy thử trên một mẫu nhỏ.',
      },
    ],
    correct: 'a',
    explanation:
      'Khi làm việc với hệ thống trì hoãn, phải tách bạch nơi lỗi lộ ra và nơi lỗi phát sinh. Cách phòng tránh là kiểm tra dữ liệu sớm trên một mẫu nhỏ, hoặc viết UDF chịu được dữ liệu xấu.',
  },
  {
    id: 'q-spark-lazy-06',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation', 'spark-rdd'],
    difficulty: 'nang-cao',
    skill: 'essence',
    tags: ['Lazy Evaluation', 'Lineage', 'Fault Tolerance'],
    type: 'short-answer',
    prompt: 'Vì sao Lazy Evaluation giúp Spark chịu lỗi rẻ hơn so với việc sao chép mọi kết quả trung gian?',
    referenceAnswer:
      'Vì chuỗi biến đổi được ghi lại thành **lineage**. Khi mất một Partition do Executor hỏng, Spark chỉ cần chạy lại các bước để dựng lại đúng Partition đó từ nguồn hoặc từ dữ liệu shuffle còn lại. Nó không phải ghi hoặc sao chép mọi kết quả trung gian ra nhiều nơi như một hệ thống lưu trữ, nên tiết kiệm I/O và mạng khi không có lỗi.',
    keyPoints: [
      {
        text: 'Chuỗi biến đổi được ghi lại thành lineage',
        keywords: ['lineage', 'chuỗi biến đổi', 'dòng dõi', 'kế hoạch'],
      },
      {
        text: 'Chỉ cần tính lại đúng phần bị mất',
        keywords: ['tính lại', 'chạy lại', 'recompute', 'dựng lại', 'khôi phục'],
      },
      {
        text: 'Không tốn chi phí sao chép khi không có lỗi',
        keywords: ['sao chép', 'replication', 'không cần ghi', 'tiết kiệm', 'chi phí'],
      },
    ],
    explanation:
      'Đây là đánh đổi: tốn chi phí tính lại khi có lỗi, đổi lấy việc không tốn chi phí sao chép trong trường hợp bình thường. Với pipeline quá dài, nên checkpoint để việc tính lại không quá tốn.',
  },
])
