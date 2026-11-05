import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-orchestration',
  summary:
    'Workflow Orchestration điều phối thứ tự chạy, phụ thuộc, retry, backfill và cảnh báo của các task. Airflow là công cụ phổ biến, và bản thân nó không xử lý dữ liệu mà ra lệnh cho hệ thống khác làm.',
  tags: ['Airflow', 'Backfill', 'Orchestration'],
  related: ['etl-idempotency', 'etl-incremental', 'etl-batch', 'etl-lineage', 'arch-monitoring-logging', 'cloud-adf', 'spark-dag'],
  sections: {
    definition: `**Workflow Orchestration (Điều phối luồng công việc)** quản lý pipeline như đồ thị phụ thuộc: task nào chạy khi nào, sau task nào, lỗi thì thử lại ra sao. **Apache Airflow** biểu diễn pipeline bằng DAG (đồ thị có hướng không chu trình).`,

    origin: `Cron chỉ biết giờ, nên kỹ sư phải đoán job A xong trước 2 giờ để đặt job B lúc 2 giờ 30. Khi A chậm, B đọc dữ liệu thiếu mà không ai biết. Cron cũng không có retry và không chạy lại được một khoảng thời gian.`,

    whyUse: `Task chỉ chạy khi task trước đã xong, có retry tự động, có lịch sử chạy và chạy lại được quá khứ.`,

    mechanism: `Scheduler tạo DAG run theo lịch. Task chỉ ra lệnh cho [[spark-overview|Spark]] hoặc kho chạy. XCom chỉ dành cho dữ liệu nhỏ.

**Khoảng dữ liệu:** với \`CronDataIntervalTimetable\`, run của một ngày bắt đầu **sau khi ngày đó kết thúc**, và \`logical_date\` là đầu khoảng. Từ Airflow 3, chuỗi cron mặc định dùng \`CronTriggerTimetable\`, khi đó \`data_interval_start\` bằng \`data_interval_end\`, tức là không có khoảng trừ khi cấu hình thêm.

**Catchup** để scheduler tự tạo run còn thiếu, Airflow 3 mặc định \`catchup_by_default = False\`. **Backfill** chạy lại khoảng tùy chọn bằng \`airflow backfill create\`, với \`--reprocess-behavior\` (\`none\`, \`failed\`, \`completed\`) và \`--max-active-runs\`.

\`default_task_retries\` mặc định là 0, nên phải tự bật retry, và task phải [[etl-idempotency|idempotent]].`,

    example: `Spark lỗi ở task 7 lúc 3 giờ sáng, Airflow retry sau 10 phút và thành công. Tuần sau phát hiện lỗi logic trong 30 ngày gần nhất, đội backfill với \`--max-active-runs 3\` và \`--reprocess-behavior completed\`.`,

    prosCons: {
      pros: ['Phụ thuộc rõ ràng, task sau không đọc dữ liệu dở dang.', 'Có retry, cảnh báo và backfill sẵn.'],
      cons: ['Thêm một hệ thống phải vận hành.', 'Hiểu sai logical date sẽ xử lý nhầm ngày.'],
    },

    whenToUse: {
      use: ['Pipeline nhiều bước, cần retry và chạy lại lịch sử.'],
      avoid: ['Không xử lý dữ liệu lớn trong task hay qua XCom.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Cron', 'Airflow'],
      rows: [
        ['Phụ thuộc', 'Không có', 'Theo DAG giữa nhiều hệ thống'],
        ['Retry, backfill', 'Tự viết', 'Có sẵn'],
      ],
    },

    misconceptions: [
      {
        myth: '`logical_date` là thời điểm DAG thực sự chạy.',
        truth: 'Với data interval timetable, đó là đầu khoảng dữ liệu, run chạy sau khi khoảng kết thúc.',
      },
      {
        myth: 'Tắt catchup thì không chạy lại được lịch sử.',
        truth: 'Catchup chỉ quyết định scheduler có tự tạo run còn thiếu không. Backfill vẫn dùng được.',
      },
    ],
  },
})
