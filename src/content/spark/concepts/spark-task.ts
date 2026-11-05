import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-task',
  summary:
    'Task là đơn vị công việc nhỏ nhất của Spark: áp dụng các phép tính của một Stage lên một Partition, chạy trên một core của Executor.',
  tags: ['Mô hình thực thi', 'Data Locality'],
  related: ['spark-stage', 'spark-partition', 'spark-executor', 'spark-data-skew', 'hadoop-data-locality'],
  sections: {
    definition: `**Task (Đơn vị công việc nhỏ nhất)** là công việc áp dụng toàn bộ phép tính của một [[spark-stage]] lên **đúng một [[spark-partition|Partition]]**. Một Task chạy trong một [[spark-executor]], và mặc định chiếm một core.

Ví dụ: job có 3 Stage, mỗi Stage 200 Partition thì có tổng cộng 600 Task.`,

    origin: `Khái niệm Task đã có từ MapReduce. Điểm khác là MapReduce thường chạy mỗi Task trong một JVM riêng, khởi động chậm. Spark chạy Task bằng các luồng trong Executor đã khởi động sẵn, nên có thể chạy rất nhiều Task ngắn mà không tốn thêm chi phí khởi động.`,

    whyUse: `Task quyết định mức song song thực tế: số Task chạy đồng thời bị giới hạn bởi tổng số core được cấp. Cũng vì Task là đơn vị cuối cùng, việc đọc phân phối thời gian Task giúp phân biệt được vấn đề lệch dữ liệu với vấn đề thiếu tài nguyên.`,

    mechanism: `Driver gửi Task tới Executor, ưu tiên nơi gần dữ liệu theo **Data Locality**: PROCESS_LOCAL, NODE_LOCAL, RACK_LOCAL, ANY. Nếu nơi tốt nhất đang bận, Spark chờ một lúc, mặc định \`spark.locality.wait\` = 3 giây, rồi hạ mức.

**Thử lại:** Task lỗi được chạy lại, tối đa \`spark.task.maxFailures\` = 4 lần, sau đó Stage và job thất bại.

**Speculative Execution** (mặc định tắt): chạy bản sao của Task chậm trên máy khác, lấy kết quả của bản xong trước. Cách này chữa được máy chậm, nhưng không chữa được lệch dữ liệu.`,

    example: `Một Task ghi dữ liệu ra API bên ngoài bằng \`foreach\`, chạy lỗi giữa chừng rồi được Spark thử lại. Kết quả là một số bản ghi được gửi hai lần. Vì Task có thể chạy nhiều lần, thao tác ghi ra ngoài phải được thiết kế [[etl-idempotency|idempotent]], ví dụ dùng khóa duy nhất để bản ghi trùng không bị tính hai lần.`,

    prosCons: {
      pros: [
        'Đơn vị nhỏ nên thử lại được mà không ảnh hưởng tới phần còn lại.',
        'Không tốn chi phí khởi động JVM cho mỗi Task.',
      ],
      cons: [
        'Task có thể chạy nhiều lần, tạo tác dụng phụ nếu ghi ra ngoài không cẩn thận.',
        'Quá nhiều Task nhỏ gây nghẽn ở Driver và tốn chi phí lập lịch.',
      ],
    },

    whenToUse: {
      use: [
        'Đặt số Partition sao cho mỗi Task xử lý khoảng 100 đến 200 MB.',
        'Bật Speculative Execution khi có máy chậm thất thường trên cụm, và thao tác ghi an toàn với chạy trùng.',
      ],
      avoid: [
        'Không bật Speculative Execution khi đầu ra không chịu được chạy trùng.',
        'Không tạo Task quá nhỏ, vì thời gian lập lịch có thể lớn hơn thời gian xử lý.',
      ],
    },

    comparison: {
      intro: 'Đọc phân phối thời gian Task giúp phân biệt các vấn đề:',
      headers: ['Dấu hiệu', 'Nhiều khả năng là', 'Hướng xử lý'],
      rows: [
        ['Max lớn hơn nhiều so với trung vị, và dữ liệu Task đó nhiều hơn', 'Data Skew', 'AQE, Broadcast, Salting'],
        ['Max lớn, dữ liệu như nhau, chỉ xảy ra trên một máy', 'Máy chậm', 'Speculative Execution, loại máy lỗi'],
        ['Mọi Task đều chậm và đều nhau', 'Quá tải đồng đều', 'Thêm tài nguyên, giảm dữ liệu'],
        ['GC time rất cao', 'Áp lực bộ nhớ', 'Giảm core, tăng Partition'],
      ],
    },

    misconceptions: [
      {
        myth: 'Task chỉ chạy đúng một lần.',
        truth: 'Task có thể chạy nhiều lần khi lỗi, khi mất Executor, hoặc khi có Speculative Execution. Vì vậy thao tác ghi cần an toàn khi lặp lại.',
      },
      {
        myth: 'Speculative Execution giải quyết được Data Skew.',
        truth: 'Không. Bản sao vẫn phải xử lý cùng lượng dữ liệu lớn đó, nên cũng chậm như bản gốc.',
      },
    ],
  },
})
