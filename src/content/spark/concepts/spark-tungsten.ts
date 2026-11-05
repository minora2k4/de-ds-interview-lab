import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-tungsten',
  summary:
    'Tungsten là tầng thực thi tối ưu CPU và bộ nhớ của Spark: lưu dữ liệu ở dạng nhị phân gọn thay vì đối tượng JVM, và sinh mã cho cả Stage.',
  tags: ['Tối ưu', 'Bộ nhớ', 'Code Generation'],
  related: ['spark-catalyst', 'spark-dataframe', 'spark-executor', 'spark-sql', 'spark-dataset'],
  sections: {
    definition: `**Tungsten Engine** là dự án tối ưu tầng thực thi của Spark, tập trung vào **hiệu quả sử dụng CPU và bộ nhớ**. Nếu [[spark-catalyst]] trả lời câu hỏi "chạy cái gì", thì Tungsten trả lời "chạy thế nào cho nhanh nhất trên phần cứng".

Có hai ý tưởng chính: lưu dữ liệu ở **dạng nhị phân gọn** và **sinh mã cho cả Stage** (Whole-Stage Code Generation).`,

    origin: `Khoảng năm 2015, mạng và đĩa đã nhanh hơn rất nhiều, nên CPU và bộ nhớ trở thành nút nghẽn chính. Có hai nguyên nhân:

- **Đối tượng JVM tốn kém.** Mỗi đối tượng có header và con trỏ, nên chiếm nhiều hơn dữ liệu thực và gây áp lực GC.
- **Mô hình Volcano chậm.** Mỗi phép tính gọi hàm ảo để lấy dòng tiếp theo, gây nhiều lần gọi hàm và làm mất tối ưu của CPU.

Tungsten ra đời để loại bỏ các chi phí này.`,

    whyUse: `Khi đã tận dụng DataFrame, bạn gần như được Tungsten tự động xử lý mà không cần cấu hình. Hiểu Tungsten giúp bạn biết vì sao DataFrame nhanh hơn RDD hoặc lambda trên Dataset, và vì sao UDF Python làm giảm hiệu năng rõ rệt.`,

    mechanism: `Có ba thành phần chính:

1. **Quản lý bộ nhớ.** Dữ liệu được lưu ở định dạng nhị phân **UnsafeRow** thay vì đối tượng JVM, vì schema đã cho biết vị trí từng trường. Có thể dùng bộ nhớ off-heap, bật qua \`spark.memory.offHeap.enabled\`, giúp giảm GC.
2. **Tận dụng cache của CPU.** Các thuật toán sắp xếp và bảng băm được thiết kế để dữ liệu nằm liền nhau, giảm cache miss.
3. **Whole-Stage Code Generation.** Thay vì gọi hàm cho từng phép tính, Spark sinh một hàm Java duy nhất cho cả chuỗi, tương tự vòng lặp viết tay. Trong kết quả \`explain\`, các bước được sinh mã có dấu \`*\` phía trước.

Với Parquet, **Vectorized Reader** đọc theo từng lô giá trị dạng cột, nhanh hơn đọc từng dòng.`,

    example: `Một job tính tổng theo nhóm trên hàng tỷ dòng. Viết bằng RDD các đối tượng, Spark tạo hàng tỷ đối tượng JVM, với GC chiếm 30% thời gian chạy. Chuyển sang DataFrame với hàm tích hợp, dữ liệu nằm ở dạng nhị phân, không tạo đối tượng cho từng dòng, và chuỗi lọc, tính toán, tổng hợp được sinh mã thành một vòng lặp. GC gần như không đáng kể, và thời gian chạy giảm 5 lần, trên cùng phần cứng.`,

    prosCons: {
      pros: [
        'Giảm mạnh dung lượng bộ nhớ và GC.',
        'Tận dụng CPU tốt hơn nhờ sinh mã và cache.',
        'Tự động áp dụng cho DataFrame và SQL.',
      ],
      cons: [
        'Không áp dụng được cho RDD, và bị hạn chế với lambda và UDF.',
        'Biểu thức quá lớn có thể vượt giới hạn 64 KB của hàm JVM, khi đó phải quay lại cách chạy chậm hơn.',
        'Mã sinh tự động khó đọc khi cần gỡ lỗi.',
      ],
    },

    whenToUse: {
      use: [
        'Ưu tiên DataFrame và hàm tích hợp để được Tungsten hỗ trợ.',
        'Xem dấu `*` trong `explain` để biết phần nào được sinh mã.',
      ],
      avoid: [
        'Tránh UDF Python khi đã có hàm tích hợp, vì dữ liệu phải chuyển đổi khỏi định dạng nhị phân.',
        'Không bật off-heap nếu chưa có nhu cầu, vì phải tính toán lại phần bộ nhớ được cấp.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Catalyst', 'Tungsten'],
      rows: [
        ['Tầng', 'Tối ưu kế hoạch truy vấn', 'Tối ưu việc thực thi'],
        ['Câu hỏi trả lời', 'Nên chạy những gì', 'Chạy thế nào cho hiệu quả'],
        ['Ví dụ', 'Đẩy bộ lọc, chọn chiến lược Join', 'UnsafeRow, sinh mã cho Stage'],
        ['Mục tiêu', 'Giảm dữ liệu và công việc', 'Dùng tốt CPU và bộ nhớ'],
      ],
    },

    misconceptions: [
      {
        myth: 'Tungsten là một engine riêng để bạn chọn dùng.',
        truth: 'Tungsten là một phần của Spark SQL và tự động hoạt động. Không có công tắc chọn engine Tungsten.',
      },
      {
        myth: 'Tungsten chỉ là việc dùng bộ nhớ off-heap.',
        truth: 'Off-heap là tùy chọn và mặc định tắt. Phần cốt lõi là định dạng nhị phân và sinh mã, luôn hoạt động.',
      },
    ],
  },
})
