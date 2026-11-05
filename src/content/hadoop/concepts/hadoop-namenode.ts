import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-namenode',
  summary:
    'NameNode giữ metadata của HDFS trong RAM, ghi bền vững bằng fsimage và edit log. Vị trí block không được lưu mà dựng lại từ block report. Cụm HA có Active và Standby NameNode.',
  tags: ['HDFS', 'Metadata', 'HA'],
  related: ['hadoop-hdfs', 'hadoop-datanode', 'hadoop-secondary-namenode', 'spark-small-files', 'cloud-high-availability'],
  sections: {
    definition: `**NameNode (Nút quản lý metadata)** là nút chủ của [[hadoop-hdfs|HDFS]]. Nó giữ cây thư mục, quyền truy cập, danh sách block của mỗi tệp và vị trí các block, phần lớn **trong RAM**. Nó không chứa dữ liệu người dùng.`,

    origin: `Thiết kế một nút quản lý giúp việc đặt block và nhất quán metadata trở nên đơn giản. Cái giá là điểm lỗi đơn: ở Hadoop 1, NameNode hỏng nghĩa là cả cụm dừng. Hadoop 2 thêm **High Availability (Tính sẵn sàng cao)** để khắc phục, và Hadoop 3 cho phép nhiều hơn hai NameNode.`,

    whyUse: `Giữ metadata trong RAM giúp trả lời hàng chục nghìn yêu cầu mỗi giây. Hiểu NameNode cũng giải thích được vì sao tệp nhỏ nguy hiểm, và vì sao mất metadata đồng nghĩa với mất khả năng đọc dữ liệu, dù các block vẫn còn trên đĩa.`,

    mechanism: `**Ghi bền vững bằng hai tệp:**

- **fsimage:** ảnh chụp toàn bộ namespace tại một thời điểm.
- **edit log:** nhật ký mọi thay đổi kể từ ảnh chụp đó. Mỗi thay đổi được ghi vào đây trước khi xác nhận với client.

Sửa trực tiếp fsimage cho từng thay đổi sẽ rất chậm, nên chỉ cần nối thêm vào edit log. Khi khởi động, NameNode nạp fsimage rồi chạy lại edit log.

**Vị trí block không được lưu trong fsimage.** NameNode dựng lại từ **block report** của DataNode, vì DataNode mới là nơi biết chắc mình đang giữ gì. Trong lúc này cụm ở **Safemode** và chưa sao chép block, cho tới khi 99,9% block đủ số bản sao tối thiểu, cộng thêm 30 giây.

**High Availability:**

- Chỉ một NameNode là **Active**, các NameNode khác là **Standby**.
- Active ghi edit log vào đa số **JournalNode**, ít nhất 3 máy. Standby đọc và áp dụng, nên trạng thái luôn gần như mới nhất.
- DataNode gửi heartbeat và block report tới mọi NameNode, nhờ đó Standby đã biết sẵn vị trí block.
- JournalNode chỉ cho một NameNode ghi, nên tránh được **split-brain (hai nút cùng làm chủ)**. Vẫn cần **fencing (cách ly)** vì nút cũ có thể còn trả lời đọc với dữ liệu cũ.`,

    example: `Một cụm có 100 triệu tệp nhỏ, mỗi tệp một block, tức khoảng 200 triệu đối tượng. Với mức ước lượng 150 byte mỗi đối tượng, heap NameNode cần khoảng 30 GB chỉ cho metadata. Heap lớn làm GC dừng lâu và khởi động lại mất nhiều thời gian. Gộp thành các tệp 256 MB giúp giảm số đối tượng đi hàng chục lần, trong khi dung lượng không đổi.`,

    prosCons: {
      pros: [
        'Metadata tập trung nên quyết định đặt block đơn giản và nhất quán.',
        'Không phải truyền dữ liệu qua nó, nên một nút phục vụ được cụm lớn.',
      ],
      cons: [
        'RAM giới hạn số tệp, cần Federation nếu namespace quá lớn.',
      ],
    },

    whenToUse: {
      use: [
        'Luôn bật HA với cụm production, và ít nhất 3 JournalNode trên các máy khác nhau.',
        'Theo dõi số tệp, số block và thời gian dừng do GC như các chỉ số quan trọng.',
      ],
      avoid: [
        'Không chạy cụm production với một NameNode và không có HA.',
        'Không tăng heap mãi để chữa tệp nhỏ. Hãy gộp tệp trước.',
      ],
    },

    comparison: {
      intro: 'Ba vai trò dễ bị nhầm lẫn, xem thêm [[hadoop-secondary-namenode]]:',
      headers: ['Tiêu chí', 'Active', 'Standby', 'Secondary'],
      rows: [
        ['Phục vụ client', 'Có', 'Không', 'Không'],
        ['Biết vị trí block', 'Có', 'Có', 'Không'],
        ['Tiếp quản khi lỗi', 'Không áp dụng', 'Có', 'Không'],
        ['Làm checkpoint', 'Không', 'Có', 'Có'],
      ],
    },

    misconceptions: [
      {
        myth: 'fsimage lưu cả vị trí của từng block.',
        truth: 'fsimage chỉ lưu tệp nào gồm block nào. Vị trí block được dựng lại từ block report mỗi khi khởi động.',
      },
      {
        myth: 'Tăng dung lượng đĩa sẽ giải quyết được vấn đề tệp nhỏ.',
        truth: 'Giới hạn nằm ở RAM của NameNode. Cụm có thể đầy metadata trong khi đĩa còn trống rất nhiều.',
      },
    ],
  },
})
