import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-resourcemanager',
  summary:
    'ResourceManager là bộ quản lý tài nguyên toàn cụm của YARN, gồm Scheduler và ApplicationsManager. Nó quyết định phân bổ tài nguyên nhưng không theo dõi task, và có thể chạy theo cặp Active/Standby.',
  tags: ['YARN', 'Lập lịch', 'HA'],
  related: ['hadoop-yarn', 'hadoop-nodemanager', 'hadoop-fault-tolerance', 'spark-cluster-manager', 'cloud-high-availability'],
  sections: {
    definition: `**ResourceManager (Bộ quản lý tài nguyên toàn cụm)** là nơi có quyền quyết định cuối cùng về việc chia tài nguyên trong [[hadoop-yarn|YARN]]. Nó có hai phần:

- **Scheduler:** cấp tài nguyên theo dung lượng và hàng đợi. Nó **không theo dõi** ứng dụng và không chạy lại task lỗi.
- **ApplicationsManager:** nhận ứng dụng, cấp Container đầu tiên để chạy ApplicationMaster, và khởi động lại ApplicationMaster khi nó hỏng.`,

    origin: `JobTracker của Hadoop 1 vừa cấp tài nguyên vừa theo dõi mọi task, nên trở thành nút nghẽn. ResourceManager chỉ giữ lại phần cấp tài nguyên và đẩy phần theo dõi sang ApplicationMaster. Trước Hadoop 2.4, ResourceManager vẫn là điểm lỗi đơn, nên tính năng HA được bổ sung sau đó.`,

    whyUse: `Vì chỉ có một nơi quyết định, cụm có thể áp dụng chính sách chung như hàng đợi, ưu tiên và giới hạn cho từng người dùng. Hiểu rõ vai trò này giúp xác định đúng chỗ khi điều tra: job chờ tài nguyên là chuyện của Scheduler, còn task lỗi thì nằm ở ApplicationMaster.`,

    mechanism: `**Cấp phát:** NodeManager gửi heartbeat, mặc định mỗi giây, kèm tài nguyên còn trống. ApplicationMaster gửi yêu cầu Container. Scheduler ghép hai bên theo chính sách, và mặc định là CapacityScheduler.

**Theo dõi sức khỏe:**

- NodeManager không có heartbeat sau **10 phút** bị xem là mất.
- ApplicationMaster không phản hồi sau **15 phút** bị xem là hỏng, và được thử lại tối đa theo \`yarn.resourcemanager.am.max-attempts\`, mặc định là **2 lần**.

**High Availability:** theo mô hình Active/Standby. Bộ bầu chọn dựa trên ZooKeeper nằm ngay trong ResourceManager, nên không cần tiến trình ZKFC riêng như NameNode. Client và các nút thử lần lượt từng ResourceManager cho tới khi gặp Active.

**Khôi phục sau khi khởi động lại:** \`yarn.resourcemanager.recovery.enabled\` mặc định **tắt**. Khi bật, có hai mức:

- **Không giữ công việc:** nạp lại trạng thái ứng dụng, các Container cũ bị giết rồi ứng dụng chạy lại.
- **Giữ công việc (work-preserving):** NodeManager không giết Container mà báo lại trạng thái, nên ứng dụng chạy tiếp. Đây là mức mặc định khi đã bật recovery.`,

    example: `Một cụm chạy 200 ứng dụng thì ResourceManager Active mất nguồn. Nhờ đã bật HA và recovery với ZooKeeper làm nơi lưu trạng thái, Standby lên làm Active trong khoảng vài chục giây. Các Container vẫn chạy và báo lại trạng thái, nên các job gần như không mất công việc. Nếu không bật recovery, HA chỉ giúp cụm nhận việc mới, còn ứng dụng đang chạy sẽ không được khôi phục.`,

    prosCons: {
      pros: [
        'Một nơi quyết định nên áp dụng chính sách chung dễ dàng.',
        'Không gánh trạng thái task nên mở rộng được xa hơn JobTracker.',
      ],
      cons: [
        'Nhẹ hơn JobTracker nhưng vẫn cần HA để không là điểm lỗi đơn.',
      ],
    },

    whenToUse: {
      use: [
        'Bật HA và recovery trên cụm production.',
        'Dùng ZKRMStateStore để chỉ một ResourceManager ghi trạng thái.',
      ],
      avoid: [
        'Không bật HA rồi cho rằng ứng dụng tự được giữ lại, khi recovery vẫn tắt.',
        'Không để Scheduler dùng cấu hình mặc định khi có nhiều phòng ban cùng chạy.',
      ],
    },

    comparison: {
      intro: 'Ba thành phần của YARN có trách nhiệm khác nhau:',
      headers: ['Tiêu chí', 'ResourceManager', 'NodeManager', 'ApplicationMaster'],
      rows: [
        ['Số lượng', 'Một Active cho cả cụm', 'Một trên mỗi máy', 'Một cho mỗi ứng dụng'],
        ['Quyết định', 'Cấp cho ai, bao nhiêu', 'Chạy và giám sát Container', 'Task nào chạy ở đâu'],
        ['Chạy lại task lỗi', 'Không', 'Không', 'Có'],
      ],
    },

    misconceptions: [
      {
        myth: 'ResourceManager chạy lại task khi task lỗi.',
        truth: 'Scheduler không biết gì về task. ApplicationMaster mới xin Container mới và chạy lại task.',
      },
      {
        myth: 'Bật HA là đủ để job đang chạy tiếp tục sau failover.',
        truth: 'Cần bật thêm recovery. Nếu không, ResourceManager mới không có trạng thái của các ứng dụng đang chạy.',
      },
    ],
  },
})
