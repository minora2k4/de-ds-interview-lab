import { defineInterview } from '../../define'

export default defineInterview([
  {
    id: 'iv-spark-lazy-01',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation', 'spark-catalyst', 'spark-dag'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['fresher', 'junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: true,
    question: 'Tại sao Spark sử dụng Lazy Evaluation?',
    referenceAnswer: `Hãy bắt đầu từ bài toán: dữ liệu lớn hơn bộ nhớ một máy rất nhiều, nên mỗi phép tính thừa có thể tốn hàng giờ. Nếu chạy ngay từng dòng lệnh, hệ thống chỉ biết bước hiện tại và không thể biết bước sau sẽ loại bỏ phần lớn dữ liệu.

Spark vì vậy tách **mô tả công việc** khỏi **thực thi công việc**. Transformation chỉ xây Logical Plan, còn Action mới kích hoạt. Có ba lợi ích chính:

1. **Tối ưu toàn cục.** Catalyst thấy cả kế hoạch nên làm được Predicate Pushdown, Column Pruning, chọn chiến lược Join phù hợp. Đọc Parquet phân vùng theo ngày có thể giảm từ vài TB xuống vài chục GB.
2. **Gộp các bước.** Các Narrow Transformation liên tiếp chạy chung một Stage, không phải dừng lại ghi kết quả trung gian như giữa các job MapReduce.
3. **Chịu lỗi.** Kế hoạch được ghi lại chính là lineage, nên có thể tính lại đúng Partition bị mất thay vì sao chép mọi kết quả.

Đánh đổi là lỗi dữ liệu lộ ra muộn, và nếu quên cache thì mỗi Action sẽ tính lại từ đầu. Vì vậy cần đọc \`explain()\` và kiểm tra trên mẫu nhỏ trước khi chạy thật.`,
    keyPoints: [
      {
        text: 'Thấy toàn bộ kế hoạch để tối ưu toàn cục, nhắc đến Catalyst',
        keywords: ['toi uu', 'catalyst', 'optimize', 'toan bo ke hoach'],
        weight: 2,
      },
      {
        text: 'Giảm dữ liệu bằng Predicate Pushdown hoặc Column Pruning',
        keywords: ['pushdown', 'pruning', 'day dieu kien', 'chi doc cot'],
      },
      {
        text: 'Gộp các Narrow Transformation vào một Stage',
        keywords: ['narrow', 'stage', 'pipeline', 'gop'],
      },
      {
        text: 'Lineage giúp chịu lỗi bằng cách tính lại',
        keywords: ['lineage', 'chiu loi', 'fault', 'tinh lai'],
      },
      {
        text: 'Nêu đánh đổi: lỗi lộ muộn hoặc tính lại nếu không cache',
        keywords: ['cache', 'loi muon', 'tinh lai', 'kho debug', 'go loi'],
      },
    ],
    followUps: [
      'Vậy cache() có chạy ngay không? Tại sao?',
      'Có Transformation nào chạy job ngay không?',
      'Khi kế hoạch quá dài do vòng lặp thì bạn xử lý thế nào?',
    ],
    commonMistakes: [
      'Chỉ nói "để tối ưu" mà không nêu được tối ưu cụ thể là gì.',
      'Nghĩ rằng Spark tự lưu kết quả để dùng lại.',
    ],
  },
  {
    id: 'iv-spark-lazy-02',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation', 'spark-cache-persist'],
    interviewTypes: ['de', 'bigdata'],
    levels: ['junior', 'middle'],
    difficulty: 'trung-binh',
    firstPrinciples: false,
    question:
      'Pipeline của bạn gọi hai Action trên cùng một DataFrame và chạy lâu gấp đôi dự kiến. Bạn phân tích và xử lý thế nào?',
    referenceAnswer: `Nguyên nhân là mỗi Action tạo một job riêng và Spark không lưu kết quả trung gian, nên toàn bộ kế hoạch chạy lại từ nguồn. Có thể xác nhận trên Spark UI: tab Jobs hiện hai job với các Stage giống nhau, và tab SQL cho thấy nguồn dữ liệu được đọc hai lần.

Cách xử lý là \`persist\` DataFrame ở điểm chung **trước khi** nó được dùng lại, chọn Storage Level phù hợp: \`MEMORY_AND_DISK\` nếu dữ liệu có thể lớn hơn bộ nhớ. Vì \`cache\` cũng trì hoãn, việc nạp thật chỉ xảy ra ở Action đầu tiên. Sau khi xong phải \`unpersist\` để trả bộ nhớ cho Executor.

Nếu hai Action chỉ dùng lại rất ít và dữ liệu nguồn nhỏ, tính lại đôi khi rẻ hơn giữ bộ nhớ. Cũng nên cân nhắc gộp hai Action thành một, ví dụ tính nhiều chỉ số trong cùng một \`agg\`, vì đó thường là cách rẻ nhất.`,
    keyPoints: [
      {
        text: 'Mỗi Action là một job, kết quả không được giữ lại',
        keywords: ['moi action', 'job rieng', 'tinh lai', 'khong luu', 'hai job'],
        weight: 2,
      },
      {
        text: 'Dùng cache hoặc persist tại điểm dùng chung',
        keywords: ['cache', 'persist'],
        weight: 2,
      },
      {
        text: 'Biết cache cũng trì hoãn và cần unpersist',
        keywords: ['unpersist', 'tra bo nho', 'giai phong'],
      },
      {
        text: 'Xác nhận vấn đề bằng Spark UI',
        keywords: ['spark ui', 'tab jobs', 'explain'],
      },
    ],
    followUps: [
      'Khi nào cache lại làm chậm chương trình?',
      'MEMORY_ONLY và MEMORY_AND_DISK khác nhau thế nào khi thiếu bộ nhớ?',
    ],
    commonMistakes: ['Cache mọi DataFrame một cách máy móc.', 'Gọi cache nhưng quên unpersist.'],
  },
  {
    id: 'iv-spark-lazy-03',
    topicId: 'spark',
    category: 'spark-execution',
    conceptIds: ['spark-lazy-evaluation', 'spark-rdd'],
    interviewTypes: ['bigdata'],
    levels: ['middle', 'senior'],
    difficulty: 'nang-cao',
    firstPrinciples: true,
    question: 'Một vòng lặp 200 lần cứ thêm withColumn vào DataFrame làm job khởi động rất chậm. Vì sao, và bạn sửa thế nào?',
    referenceAnswer: `Nguyên nhân không nằm ở dữ liệu mà ở kế hoạch. Do trì hoãn, mỗi \`withColumn\` nối thêm một node vào Logical Plan, sau 200 vòng kế hoạch rất sâu. Mỗi lần gọi \`withColumn\`, Spark còn phân tích lại kế hoạch, nên chi phí trên driver tăng rất nhanh theo số vòng lặp. Khi có Action, Catalyst còn phải duyệt qua cây lớn nhiều lần. Triệu chứng là driver tốn CPU lâu trước khi có task nào chạy, và trên Spark UI chưa thấy Stage nào xuất hiện.

Có hai hướng sửa. Nếu là việc thêm cột, hãy dựng danh sách biểu thức trước rồi gọi một lần \`select\` hoặc \`withColumns\`, kế hoạch khi đó chỉ có một node chiếu. Nếu là thuật toán lặp mà mỗi vòng phụ thuộc vòng trước, hãy cắt lineage định kỳ bằng \`checkpoint\` hoặc \`localCheckpoint\`, để kế hoạch được rút ngắn lại, đồng thời không phải tính lại quá nhiều khi có lỗi. Đánh đổi của checkpoint là tốn thêm I/O và dung lượng lưu trữ.`,
    keyPoints: [
      {
        text: 'Kế hoạch trở nên rất sâu do mỗi vòng nối thêm một node',
        keywords: ['logical plan', 'ke hoach', 'sau', 'node'],
        weight: 2,
      },
      {
        text: 'Chi phí nằm ở driver khi phân tích và tối ưu',
        keywords: ['driver', 'catalyst', 'analyzer', 'phan tich'],
      },
      {
        text: 'Dùng một select hoặc withColumns thay vì lặp withColumn',
        keywords: ['select', 'withcolumns'],
        weight: 2,
      },
      {
        text: 'Cắt lineage bằng checkpoint với thuật toán lặp',
        keywords: ['checkpoint', 'cat lineage'],
      },
    ],
    followUps: ['checkpoint và cache khác nhau ở điểm nào?', 'localCheckpoint có rủi ro gì?'],
    commonMistakes: ['Tăng số Executor trong khi vấn đề nằm ở driver.'],
  },
])
