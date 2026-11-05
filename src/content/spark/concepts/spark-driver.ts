import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-driver',
  summary:
    'Driver là tiến trình chạy chương trình của bạn, biến code thành kế hoạch thực thi, phân Task cho Executor và theo dõi tiến độ.',
  tags: ['Kiến trúc', 'Driver'],
  related: ['spark-architecture', 'spark-executor', 'spark-dag', 'spark-action', 'spark-broadcast-join'],
  sections: {
    definition: `**Driver (Tiến trình điều khiển)** là JVM chạy hàm \`main\` của ứng dụng và giữ **SparkSession**. Driver không xử lý phần lớn dữ liệu, mà là "bộ não": lập kế hoạch, phân việc cho [[spark-executor]] và tổng hợp kết quả khi cần.`,

    origin: `Driver kế thừa vai trò theo dõi job từ JobTracker của Hadoop 1, nhưng giới hạn trong phạm vi **một ứng dụng**. Nhờ vậy lỗi hoặc quá tải ở một ứng dụng không ảnh hưởng tới các ứng dụng khác, khắc phục nhược điểm một JobTracker dùng chung cho cả cụm.`,

    whyUse: `Một hệ thống phân tán cần một nơi nắm cái nhìn tổng thể: cần chạy gì, dữ liệu nằm đâu, task nào đã xong. Tập trung phần này ở Driver giúp việc lập kế hoạch nhất quán và đơn giản, còn việc xử lý dữ liệu nặng được đẩy cho Executor.`,

    mechanism: `Driver lần lượt làm các việc:

1. **Biên dịch kế hoạch.** Chuyển code thành Logical Plan rồi Physical Plan qua [[spark-catalyst]].
2. **Chia việc.** DAGScheduler tạo [[spark-stage]], TaskScheduler gửi [[spark-task]] tới Executor, ưu tiên nơi có sẵn dữ liệu.
3. **Theo dõi.** Nhận trạng thái Task, chạy lại Task lỗi và phục vụ Spark UI.
4. **Thu kết quả.** Nhận kết quả của \`collect\`, \`take\`. Tổng kết quả vượt \`spark.driver.maxResultSize\` (mặc định 1g) thì job bị hủy.
5. **Tạo Broadcast.** Với [[spark-broadcast-join]], dữ liệu của bảng nhỏ được thu về Driver trước khi phát đi.`,

    example: `Một kỹ sư gọi \`collect\` trên kết quả 50 GB để ghi ra CSV bằng code Python. Driver có 4 GB nên báo lỗi OutOfMemory hoặc job bị hủy do vượt \`maxResultSize\`. Cách đúng là ghi trực tiếp bằng \`df.write\`, để mỗi Executor tự ghi phần của mình, thay vì gom hết về một máy.`,

    prosCons: {
      pros: [
        'Có cái nhìn toàn cục nên lập lịch và tối ưu được toàn bộ job.',
        'Giới hạn trong một ứng dụng nên lỗi không lan sang ứng dụng khác.',
      ],
      cons: [
        'Là điểm lỗi duy nhất: Driver chết thì ứng dụng chết.',
        'Dễ thành nút nghẽn khi có hàng trăm nghìn Task hoặc kế hoạch quá lớn.',
      ],
    },

    whenToUse: {
      use: [
        'Tăng `spark.driver.memory` khi có Broadcast lớn hoặc kế hoạch và danh sách tệp rất lớn.',
        'Đặt Driver gần cụm, dùng deploy mode cluster cho job production.',
      ],
      avoid: [
        'Không dùng `collect` trên dữ liệu lớn: hãy ghi ra kho lưu trữ hoặc dùng `take`.',
        'Không tăng bộ nhớ Driver để chữa triệu chứng khi nguyên nhân là thu quá nhiều dữ liệu về.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Driver', 'Executor'],
      rows: [
        ['Số lượng', 'Một cho mỗi ứng dụng', 'Nhiều cho mỗi ứng dụng'],
        ['Công việc chính', 'Lập kế hoạch, phân Task', 'Chạy Task, giữ cache'],
        ['Dữ liệu xử lý', 'Ít, trừ khi thu về', 'Phần lớn dữ liệu'],
        ['Khi hỏng', 'Ứng dụng dừng', 'Task được chạy lại nơi khác'],
      ],
    },

    misconceptions: [
      {
        myth: 'Mọi dòng code PySpark đều chạy trên Executor.',
        truth:
          'Code tạo kế hoạch và logic Python thông thường chạy trên Driver. Chỉ các hàm được gửi đi, như UDF, và các phép tính của kế hoạch mới chạy trên Executor.',
      },
      {
        myth: 'Driver càng nhiều bộ nhớ thì job càng nhanh.',
        truth: 'Bộ nhớ Driver chỉ tránh lỗi OOM ở Driver. Tốc độ xử lý dữ liệu chủ yếu phụ thuộc vào Executor và cách chia Partition.',
      },
    ],
  },
})
