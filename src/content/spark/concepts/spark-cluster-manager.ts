import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-cluster-manager',
  summary:
    'Cluster Manager cấp tài nguyên để chạy Driver và Executor. Spark hỗ trợ Standalone, Hadoop YARN và Kubernetes.',
  tags: ['Kiến trúc', 'YARN', 'Kubernetes'],
  related: ['spark-architecture', 'spark-driver', 'spark-executor', 'hadoop-yarn', 'spark-shuffle'],
  sections: {
    definition: `**Cluster Manager (Bộ quản lý cụm)** là dịch vụ bên ngoài ứng dụng, chịu trách nhiệm cấp phát CPU và bộ nhớ trên cụm. Tài liệu Spark hiện liệt kê ba loại: **Standalone**, **Hadoop YARN** và **Kubernetes**. Mesos từng được hỗ trợ nhưng không còn trong danh sách này.`,

    origin: `Spark cần chạy được trên hạ tầng sẵn có của doanh nghiệp thay vì bắt buộc một cụm riêng. Vì vậy Spark tách phần xin tài nguyên thành một lớp giao tiếp riêng. Cách này tránh được hạn chế của Hadoop 1, nơi việc cấp tài nguyên và theo dõi job gắn chặt trong JobTracker.`,

    whyUse: `Cụm thường được chia sẻ cho nhiều nhóm và nhiều ứng dụng, nên cần một bên trung gian để phân bổ tài nguyên công bằng theo hàng đợi hoặc namespace. Nhờ tách lớp này, cùng một ứng dụng có thể chuyển từ YARN sang Kubernetes mà gần như không đổi logic.`,

    mechanism: `Driver gửi yêu cầu số lượng và kích thước Executor tới Cluster Manager, nơi này khởi chạy Executor trên các máy còn trống. **Sau khi được cấp, Driver làm việc trực tiếp với Executor.**

Với **Dynamic Allocation** (mặc định tắt), số Executor tăng khi có Task chờ và giảm khi Executor rảnh, sau 60 giây theo mặc định. Vì Executor có thể bị thu hồi trong khi vẫn giữ file shuffle, cần bật một trong các cơ chế: External Shuffle Service, Shuffle Tracking, hoặc Decommission. Lưu ý Kubernetes chưa hỗ trợ External Shuffle Service.`,

    example: `Một công ty đang có cụm Hadoop chạy job Spark trên YARN với hàng đợi riêng cho từng phòng ban. Khi chuyển sang đám mây, họ chạy Spark trên Kubernetes, lưu dữ liệu ở S3 và mở Dynamic Allocation với Shuffle Tracking, vì không thể dùng External Shuffle Service. Logic của job gần như không phải sửa, chủ yếu thay đổi cấu hình triển khai.`,

    prosCons: {
      pros: [
        'Chạy được trên nhiều loại hạ tầng mà không đổi code.',
        'Chia sẻ tài nguyên giữa nhiều ứng dụng theo chính sách của cụm.',
      ],
      cons: [
        'Mỗi loại có cách cấu hình và giám sát riêng.',
        'Nếu cấu hình hàng đợi không tốt, job có thể phải chờ tài nguyên lâu.',
      ],
    },

    whenToUse: {
      use: [
        'YARN khi đã có sẵn hệ sinh thái Hadoop.',
        'Kubernetes khi hạ tầng đã container hóa và muốn dùng chung cụm với các dịch vụ khác.',
        'Standalone khi cần cụm riêng đơn giản cho Spark, hoặc để thử nghiệm.',
      ],
      avoid: [
        'Không nên dựng thêm cụm riêng khi đã có sẵn YARN hoặc Kubernetes được vận hành tốt.',
        'Không dùng Dynamic Allocation khi chưa cấu hình cách giữ file shuffle.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Standalone', 'YARN', 'Kubernetes'],
      rows: [
        ['Cài đặt', 'Đơn giản, đi kèm Spark', 'Cần cụm Hadoop', 'Cần cụm Kubernetes'],
        ['Chia sẻ tài nguyên', 'Cơ bản', 'Hàng đợi, Capacity Scheduler', 'Namespace, quota'],
        ['Cô lập môi trường', 'Thấp', 'Trung bình', 'Cao nhờ container'],
        ['External Shuffle Service', 'Có', 'Có', 'Chưa hỗ trợ'],
      ],
    },

    misconceptions: [
      {
        myth: 'Cluster Manager gửi Task tới Executor.',
        truth: 'Cluster Manager chỉ cấp tài nguyên. Driver mới là bên gửi Task và theo dõi chúng.',
      },
      {
        myth: 'Spark bắt buộc phải có Hadoop.',
        truth: 'Spark có thể chạy Standalone hoặc trên Kubernetes và đọc dữ liệu từ S3, không cần HDFS hay YARN.',
      },
    ],
  },
})
