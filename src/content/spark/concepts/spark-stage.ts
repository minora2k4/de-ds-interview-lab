import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-stage',
  summary:
    'Stage là nhóm Task chạy cùng một chuỗi phép tính trên các Partition khác nhau, không có shuffle ở giữa. Mỗi lần shuffle sẽ cắt ra Stage mới.',
  tags: ['Mô hình thực thi', 'Lập lịch'],
  related: ['spark-task', 'spark-dag', 'spark-shuffle', 'spark-narrow-transformation', 'spark-wide-transformation'],
  sections: {
    definition: `**Stage (Giai đoạn thực thi)** là một phần của job, gồm chuỗi phép tính có thể chạy liền nhau mà **không cần shuffle ở giữa**. Một Stage gồm nhiều [[spark-task]] giống hệt nhau, mỗi Task xử lý một [[spark-partition|Partition]].

Có hai loại: **ShuffleMapStage** ghi kết quả ra file shuffle, và **ResultStage** là Stage cuối cùng, tạo ra kết quả của Action.`,

    origin: `Ranh giới Stage tương ứng với ranh giới giữa pha Map và Reduce của MapReduce, nhưng tổng quát hơn: Spark có thể có bao nhiêu Stage tùy ý trong cùng một job. Cách chia này giúp tách phần chạy liền mạch trong bộ nhớ khỏi phần buộc phải trao đổi dữ liệu.`,

    whyUse: `Stage là đơn vị đọc hiệu năng trên Spark UI. Mỗi Stage cho bạn biết thời gian chạy, lượng dữ liệu đọc, lượng shuffle và độ lệch giữa các Task. Khi job chậm, việc đầu tiên là tìm Stage chiếm nhiều thời gian nhất.`,

    mechanism: `[[spark-dag|DAGScheduler]] cắt Stage tại mỗi Shuffle Dependency. **Số Stage bằng số lần shuffle cộng một** với job dạng chuỗi đơn giản, và nhiều hơn khi job có nhiều nhánh.

**Số Task của Stage bằng số Partition của nó.** Ví dụ Stage đọc tệp có 800 Partition thì có 800 Task. Stage sau shuffle mặc định có \`spark.sql.shuffle.partitions\` = 200 Partition, trừ khi AQE gộp lại.

Stage con chỉ bắt đầu khi tất cả Task của Stage cha đã xong. Vì vậy một Task chậm do lệch dữ liệu có thể giữ chân cả job.`,

    example: `Job gồm: đọc đơn hàng, lọc, \`groupBy(user)\`, rồi \`orderBy(total)\`, cuối cùng \`write\`. Có hai lần shuffle nên có ba Stage. Trên Spark UI, Stage 1 chạy 800 Task, Stage 2 chạy 200 Task, Stage 3 chạy 200 Task. Stage 2 chiếm 80% thời gian với một Task chạy lâu gấp 30 lần trung vị: đây là dấu hiệu [[spark-data-skew]] rất rõ.`,

    prosCons: {
      pros: [
        'Gộp được các bước liên tiếp thành một khối chạy hiệu quả.',
        'Ranh giới rõ ràng giúp khôi phục khi có lỗi và điều chỉnh bằng AQE.',
      ],
      cons: [
        'Stage sau phải chờ Stage trước xong hoàn toàn.',
        'Một Task chậm có thể làm chậm cả Stage và toàn bộ job.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng Stage làm đơn vị phân tích đầu tiên khi tối ưu hiệu năng.',
        'So sánh số liệu thời gian theo phân vị (min, trung vị, max) để phát hiện skew.',
      ],
      avoid: [
        'Không suy ra chi phí chỉ từ số Stage: một Stage lớn có thể tốn hơn nhiều Stage nhỏ.',
      ],
    },

    comparison: {
      headers: ['Khái niệm', 'Là gì', 'Quan hệ'],
      rows: [
        ['Job', 'Toàn bộ công việc của một Action', 'Gồm nhiều Stage'],
        ['Stage', 'Đoạn không có shuffle', 'Gồm nhiều Task'],
        ['Task', 'Xử lý một Partition', 'Chạy trên một core của Executor'],
      ],
    },

    misconceptions: [
      {
        myth: 'Số Stage bằng số phép biến đổi trong code.',
        truth: 'Số Stage phụ thuộc vào số lần shuffle, không phụ thuộc vào số dòng code hay số Transformation.',
      },
      {
        myth: 'Các Stage luôn chạy tuần tự.',
        truth: 'Các Stage không phụ thuộc nhau, ví dụ hai nhánh đọc của một Join, có thể chạy song song.',
      },
    ],
  },
})
