import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-messaging',
  summary:
    'Hệ thống truyền thông điệp phân tán đặt một cụm trung gian giữa bên gửi và bên nhận, để hai bên không phụ thuộc nhau. Kafka gộp mô hình hàng đợi và publish-subscribe nhờ Consumer Group.',
  tags: ['Nhắn tin', 'Publish-Subscribe', 'Kiến trúc'],
  related: ['kafka-overview', 'kafka-consumer-group', 'kafka-delivery-semantics', 'kafka-vs-rabbitmq', 'arch-streaming'],
  sections: {
    definition: `**Distributed Messaging System (Hệ thống truyền thông điệp phân tán)** là cụm máy chủ trung gian nhận, lưu và chuyển thông điệp. Có hai mô hình: **point-to-point** (mỗi thông điệp cho một bên nhận, dùng để chia việc) và **publish-subscribe** (mỗi thông điệp cho mọi bên đăng ký, dùng để phát tán).`,

    origin: `Khi dịch vụ gọi trực tiếp nhau, bên nhận phải đang chạy, và N nguồn với M đích tạo ra gần N × M đường tích hợp. Broker trên một máy gỡ được ràng buộc này nhưng bị giới hạn sức chứa. Phân tán ra nhiều máy, như [[kafka-overview|Kafka]], gỡ tiếp giới hạn ấy.`,

    whyUse: `Bên nhận chậm hoặc đang bảo trì thì thông điệp nằm chờ, bên gửi không bị ảnh hưởng. Đỉnh tải chỉ làm backlog dài ra, không làm sập bên nhận.`,

    mechanism: `Bên gửi chuyển thông điệp cho cụm, cụm xác nhận đã lưu, rồi bên nhận lấy về và báo đã xử lý. Lỗi mạng ở các bước này có thể gây gửi lại, nên [[kafka-delivery-semantics|ngữ nghĩa giao nhận]] là vấn đề trung tâm.

Kafka gộp hai mô hình bằng [[kafka-consumer-group|Consumer Group]]: trong một nhóm, các Consumer chia việc. Giữa các nhóm, mỗi nhóm nhận đủ dữ liệu. Từ bản 4.2, **Share Group** bổ sung kiểu chia việc theo từng bản ghi.`,

    example: `Ứng dụng đặt vé nhận 1.000 đơn mỗi giây lúc mở bán, dịch vụ email chỉ gửi được 100 email mỗi giây. Có hệ thống nhắn tin ở giữa, 10 phút cao điểm tạo backlog 540.000 thông điệp, rồi giảm dần trong khoảng 90 phút. Người đặt vé không bị ảnh hưởng.`,

    prosCons: {
      pros: ['Thêm bên nhận mới mà không phải sửa bên gửi.'],
      cons: ['Luồng bất đồng bộ nên khó theo dõi và gỡ lỗi hơn.', 'Phải xử lý trùng lặp và vận hành thêm một cụm.'],
    },

    whenToUse: {
      use: ['Nhiều hệ thống cùng cần một sự kiện.', 'Bên nhận chậm hơn bên gửi.'],
      avoid: ['Cần kết quả ngay để trả lời người dùng: dùng API đồng bộ.'],
    },

    comparison: {
      intro: 'Các cách để hai hệ thống trao đổi dữ liệu:',
      headers: ['Tiêu chí', 'API đồng bộ', 'Hàng đợi', 'Kafka'],
      rows: [
        ['Bên nhận phải đang chạy', 'Có', 'Không', 'Không'],
        ['Sau khi nhận', 'Không lưu', 'Xóa khi xác nhận', 'Giữ theo Retention'],
      ],
    },

    misconceptions: [
      {
        myth: 'Hệ thống nhắn tin nhanh hơn gọi trực tiếp.',
        truth: 'Nó thêm một chặng nên độ trễ thường cao hơn. Lợi ích là giảm phụ thuộc và chịu tải.',
      },
      {
        myth: 'Kafka chỉ là publish-subscribe.',
        truth: 'Trong một nhóm, mỗi Partition giao cho một Consumer, nên các Consumer chia việc như hàng đợi.',
      },
    ],
  },
})
