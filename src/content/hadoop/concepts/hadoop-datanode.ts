import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-datanode',
  summary:
    'DataNode lưu block dưới dạng tệp cục bộ, phục vụ đọc ghi trực tiếp với client, gửi heartbeat mỗi 3 giây và block report mỗi 6 giờ cho NameNode.',
  tags: ['HDFS', 'Lưu trữ', 'Heartbeat'],
  related: ['hadoop-hdfs', 'hadoop-namenode', 'hadoop-block-replication', 'hadoop-fault-tolerance', 'hadoop-nodemanager'],
  sections: {
    definition: `**DataNode (Nút lưu dữ liệu)** chạy trên từng máy của cụm [[hadoop-hdfs|HDFS]], lưu các block thành tệp trong hệ thống tệp cục bộ. Nó **không biết khái niệm tệp HDFS**: với DataNode, mỗi block là một tệp độc lập. Chỉ [[hadoop-namenode|NameNode]] biết block nào thuộc về tệp nào.`,

    origin: `Kho lưu trữ tập trung cần thiết bị đắt tiền và tách xa nơi tính toán. DataNode dùng ngay đĩa của máy thường. Thay vì làm cho từng đĩa thật an toàn, Hadoop xem mỗi máy đều có thể hỏng và dựa vào nhiều bản sao trên các máy khác.`,

    whyUse: `Vì DataNode chỉ lo lưu và truyền block, nó đơn giản và dễ mở rộng: thêm máy là thêm dung lượng và thêm băng thông đọc. Chạy cùng [[hadoop-nodemanager|NodeManager]] trên một máy giúp task có thể đọc ngay trên đĩa cục bộ.`,

    mechanism: `DataNode giữ liên lạc với NameNode bằng ba cơ chế:

- **Heartbeat, mỗi 3 giây:** báo còn sống. NameNode không chủ động gọi DataNode, mà gửi lệnh như sao chép hay xóa block trong phản hồi của heartbeat.
- **Block report, mỗi 6 giờ:** danh sách đầy đủ các block đang giữ. Đây là nguồn sự thật để NameNode biết vị trí block.
- **Block scanner, mặc định mỗi 3 tuần:** quét đĩa để phát hiện block hỏng trước khi có người đọc.

**Khi DataNode mất liên lạc:** sau 30 giây không có heartbeat, nó bị xem là **stale (cũ)**. Sau khoảng 10 phút 30 giây, được tính bằng 2 lần 300 giây cộng 10 lần 3 giây, nó bị xem là **chết**, và NameNode bắt đầu sao chép lại các block thiếu. Thời hạn dài này là có chủ đích: một máy khởi động lại không nên kích hoạt việc sao chép hàng chục TB qua mạng.

**Lỗi đĩa:** mặc định \`dfs.datanode.failed.volumes.tolerated\` = 0, nghĩa là chỉ cần một đĩa hỏng thì DataNode sẽ dừng. Máy có nhiều đĩa thường nên tăng giá trị này.`,

    example: `Một máy giữ 40 TB dữ liệu HDFS bị mất nguồn, tức khoảng 330.000 block. Sau khoảng 10 phút 30 giây, NameNode đánh dấu máy này đã chết và yêu cầu các DataNode khác sao chép lại. Nếu máy khởi động lại sau 5 phút, không có việc sao chép nào xảy ra, vì nó quay lại trước khi hết hạn.`,

    prosCons: {
      pros: [
        'Đơn giản, thêm máy là thêm dung lượng và băng thông.',
        'Tự phát hiện block hỏng nhờ checksum và block scanner.',
      ],
      cons: [
        'Mất một máy gây tải mạng lớn khi sao chép lại.',
        'Đĩa dễ lệch giữa các máy, cần chạy Balancer định kỳ.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng nhiều đĩa thường ở chế độ JBOD, vì HDFS đã có bản sao ở mức block.',
        'Đặt thời hạn stale phù hợp cho hệ thống nhạy với độ trễ, để tránh đọc từ máy đang có vấn đề.',
      ],
      avoid: [
        'Không dùng RAID cho đĩa dữ liệu DataNode, vì lặp lại việc bản sao đã làm.',
        'Không rút nhiều máy cùng lúc mà không qua decommission, vì có thể mất mọi bản sao của một block.',
      ],
    },

    comparison: {
      intro: 'DataNode và NameNode có vai trò rất khác nhau:',
      headers: ['Tiêu chí', 'DataNode', 'NameNode'],
      rows: [
        ['Giữ', 'Nội dung block', 'Metadata'],
        ['Tài nguyên quan trọng', 'Đĩa và mạng', 'RAM'],
        ['Số lượng', 'Hàng chục đến hàng nghìn', '2 đến 5 khi bật HA'],
        ['Mất một nút', 'Tự phục hồi từ bản sao', 'Phải tiếp quản qua HA'],
      ],
    },

    misconceptions: [
      {
        myth: 'DataNode vừa chết thì NameNode sao chép lại ngay.',
        truth: 'NameNode chờ hơn 10 phút mới kết luận, để tránh bão sao chép khi máy chỉ gián đoạn ngắn.',
      },
      {
        myth: 'DataNode biết block của mình thuộc tệp nào.',
        truth: 'DataNode chỉ biết các block. Ánh xạ tới tệp nằm ở NameNode, nên mất metadata thì không ghép lại được tệp.',
      },
    ],
  },
})
