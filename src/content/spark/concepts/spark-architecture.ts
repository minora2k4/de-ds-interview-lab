import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-architecture',
  summary:
    'Spark theo mô hình một Driver điều phối, nhiều Executor thực thi, còn Cluster Manager cấp tài nguyên. Mỗi ứng dụng có Driver và Executor riêng.',
  tags: ['Kiến trúc', 'Driver', 'Executor'],
  related: ['spark-driver', 'spark-executor', 'spark-cluster-manager', 'spark-dag', 'spark-task', 'spark-overview'],
  sections: {
    definition: `**Spark Architecture (Kiến trúc Spark)** là cách các thành phần phối hợp để chạy một ứng dụng trên cụm. Có ba vai trò chính:

- **[[spark-driver]]:** chạy chương trình của bạn, lập kế hoạch và phân việc.
- **[[spark-executor]]:** tiến trình chạy trên các máy worker, thực thi Task và giữ dữ liệu.
- **[[spark-cluster-manager]]:** cấp tài nguyên cho ứng dụng, ví dụ YARN hoặc Kubernetes.

Mỗi ứng dụng có **Driver và bộ Executor riêng**, nên các ứng dụng không dùng chung bộ nhớ với nhau.`,

    origin: `Trong Hadoop 1, JobTracker vừa quản lý tài nguyên toàn cụm vừa theo dõi từng task của mọi job, nên dễ thành nút nghẽn và điểm lỗi duy nhất. YARN sau đó tách hai trách nhiệm này ra.

Spark đi theo hướng tương tự: **tách việc lập kế hoạch khỏi việc cấp tài nguyên**. Driver lo logic của riêng một ứng dụng, Cluster Manager chỉ lo cấp tài nguyên. Nhờ tách như vậy, Spark chạy được trên nhiều loại cụm mà không đổi code, và lỗi của một ứng dụng không kéo theo các ứng dụng khác.`,

    whyUse: `Hiểu kiến trúc giúp bạn trả lời được những câu hỏi rất thực tế:

- **Lỗi OOM ở đâu?** Nếu ở Driver, thường do \`collect\` hoặc Broadcast quá lớn. Nếu ở Executor, thường do skew hoặc Partition quá to.
- **Vì sao thêm Executor mà không nhanh hơn?** Có thể vì nút nghẽn nằm ở Driver hoặc ở một Task bị lệch dữ liệu.
- **Nên cấp tài nguyên thế nào?** Số Executor, số core và bộ nhớ quyết định số Task chạy song song.`,

    mechanism: `Vòng đời của một ứng dụng diễn ra như sau:

1. **Khởi động.** \`spark-submit\` khởi chạy Driver. Driver tạo **SparkSession**, điểm vào của mọi thao tác.
2. **Xin tài nguyên.** Driver liên hệ Cluster Manager để xin Executor.
3. **Lập kế hoạch.** Khi gặp [[spark-action]], Driver tạo [[spark-dag]] và chia thành [[spark-stage]], mỗi Stage gồm nhiều [[spark-task]].
4. **Thực thi.** TaskScheduler gửi Task tới Executor, ưu tiên nơi đã có dữ liệu (Data Locality).
5. **Shuffle và kết quả.** Executor đọc dữ liệu, ghi file shuffle xuống đĩa cục bộ và trao đổi với nhau trực tiếp, không đi qua Driver.
6. **Kết thúc.** Khi ứng dụng xong, Executor được giải phóng.

Số Task chạy đồng thời trên một Executor bằng \`floor(số core / spark.task.cpus)\`, với \`spark.task.cpus\` mặc định là 1.

**Deploy Mode** quyết định Driver chạy ở đâu: **client** chạy trên máy gọi \`spark-submit\` (mặc định), còn **cluster** chạy Driver bên trong cụm.`,

    diagram: {
      mermaid: `flowchart TD
  D["Driver: SparkSession, DAGScheduler, TaskScheduler"] -->|"xin tài nguyên"| CM["Cluster Manager"]
  CM -->|"khởi chạy"| E1["Executor 1: Task, Cache"]
  CM -->|"khởi chạy"| E2["Executor 2: Task, Cache"]
  D -->|"gửi Task, nhận trạng thái"| E1
  D -->|"gửi Task, nhận trạng thái"| E2
  E1 <-->|"dữ liệu shuffle"| E2`,
      caption:
        'Driver giao việc trực tiếp cho Executor. Cluster Manager chỉ cấp tài nguyên, còn dữ liệu shuffle truyền thẳng giữa các Executor.',
    },

    example: `Một job tổng hợp hằng đêm đọc 2 TB chạy bằng 50 Executor, mỗi Executor 4 core, tức tối đa 200 Task đồng thời.

Job được gửi ở chế độ **cluster** từ máy lập lịch Airflow. Nếu dùng chế độ client, Driver sẽ nằm trên máy Airflow: máy đó khởi động lại là job chết, và lưu lượng giữa Driver với Executor phải đi qua mạng ngoài cụm. Vì vậy client thường dùng khi phân tích tương tác trên notebook, còn cluster dùng cho production.

Khi một Executor bị mất, Driver chạy lại các Task của nó ở Executor khác. Khi Driver chết, cả ứng dụng dừng, nên cấu hình tài nguyên cho Driver cũng quan trọng không kém.`,

    prosCons: {
      pros: [
        '**Tách lập kế hoạch khỏi cấp tài nguyên,** nên chạy được trên Standalone, YARN hoặc Kubernetes.',
        '**Cô lập giữa các ứng dụng** vì mỗi ứng dụng có Executor riêng.',
        '**Mở rộng ngang dễ dàng** bằng cách thêm Executor.',
      ],
      cons: [
        '**Driver là điểm lỗi duy nhất** của ứng dụng, chết là mất toàn bộ tiến trình.',
        '**Driver có thể thành nút nghẽn** khi có quá nhiều Task hoặc thu quá nhiều dữ liệu về.',
        '**Không chia sẻ dữ liệu trong bộ nhớ** giữa các ứng dụng, trừ khi ghi ra hệ thống ngoài.',
      ],
    },

    whenToUse: {
      use: [
        'Chế độ **cluster** cho job production để Driver nằm trong cụm, gần Executor.',
        'Chế độ **client** khi phân tích tương tác, cần xem kết quả ngay trên notebook.',
        'Dynamic Allocation khi tải thay đổi nhiều và cụm được dùng chung.',
      ],
      avoid: [
        'Không chạy Driver ở chế độ client trên máy yếu hoặc ở xa cụm cho job dài.',
        'Không đặt Executor quá to, vì heap lớn dễ gây dừng do GC. Nhiều Executor vừa phải thường ổn định hơn.',
      ],
    },

    comparison: {
      intro: 'So sánh hai chế độ triển khai Driver:',
      headers: ['Tiêu chí', 'Client mode', 'Cluster mode'],
      rows: [
        ['Driver chạy ở', 'Máy gọi spark-submit', 'Một node trong cụm'],
        ['Xem log, kết quả', 'Ngay trên máy gọi', 'Qua công cụ của cụm'],
        ['Máy gọi bị tắt', 'Ứng dụng chết', 'Ứng dụng vẫn chạy'],
        ['Độ trễ mạng tới Executor', 'Có thể cao nếu ở xa cụm', 'Thấp'],
        ['Phù hợp', 'Notebook, gỡ lỗi', 'Job production'],
      ],
    },

    misconceptions: [
      {
        myth: 'Cluster Manager là nơi lập lịch Task.',
        truth:
          'Cluster Manager chỉ cấp tài nguyên để chạy Executor. Việc chia và gửi Task do Driver đảm nhận thông qua DAGScheduler và TaskScheduler.',
      },
      {
        myth: 'Dữ liệu shuffle phải đi qua Driver.',
        truth: 'Các Executor trao đổi dữ liệu shuffle trực tiếp với nhau. Driver chỉ theo dõi vị trí của dữ liệu.',
      },
      {
        myth: 'Nhiều ứng dụng có thể dùng chung một Executor.',
        truth: 'Executor thuộc về đúng một ứng dụng, tồn tại trong suốt vòng đời ứng dụng đó trừ khi bị thu hồi hoặc lỗi.',
      },
    ],
  },
})
