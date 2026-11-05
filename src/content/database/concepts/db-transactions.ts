import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-transactions',
  summary:
    'Giao dịch gom nhiều thao tác thành một đơn vị: cùng thành công hoặc cùng bị hủy. Giao dịch nên ngắn, vì giữ khóa và phiên bản cũ càng lâu thì càng hại cả hệ thống.',
  tags: ['Giao dịch', 'Khóa', 'Deadlock'],
  related: ['db-acid', 'db-isolation-levels', 'db-sharding', 'etl-idempotency'],
  sections: {
    definition: `**Transaction (Giao dịch)** là một đơn vị công việc gồm một hoặc nhiều câu lệnh, bắt đầu bằng \`BEGIN\` và kết thúc bằng \`COMMIT\` (hoàn tất) hoặc \`ROLLBACK\` (hủy). Đây là cách ứng dụng dùng các bảo đảm của [[db-acid]].`,

    origin: `Chương trình xử lý theo lô từng phải tự viết logic khôi phục khi lỗi giữa chừng. Hệ thống trực tuyến không thể dừng để sửa tay, nên cơ sở dữ liệu nhận việc bảo vệ ranh giới này.`,

    whyUse: `Không để lại trạng thái dở dang khi có lỗi.`,

    mechanism: `- **Autocommit:** không có \`BEGIN\`, PostgreSQL bọc mỗi câu lệnh trong một giao dịch ngầm. MySQL mặc định cũng bật autocommit.
- **Khóa giữ đến cuối:** khóa dòng do \`UPDATE\` tạo ra chỉ được nhả khi giao dịch kết thúc, nên giao dịch dài chặn người khác.
- **Giao dịch dài cản dọn dẹp:** PostgreSQL không \`VACUUM\` được các phiên bản mà snapshot cũ còn thấy, InnoDB không xóa được undo log tương ứng.
- **Deadlock:** hai giao dịch chờ khóa của nhau. Cơ sở dữ liệu hủy một bên, ứng dụng phải thử lại. Khóa theo cùng một thứ tự giúp giảm hiện tượng này.
- **DDL:** PostgreSQL rollback được \`ALTER TABLE\`, còn MySQL commit ngầm khi gặp DDL.`,

    example: `Giao dịch đặt hàng gọi API thanh toán mất 3 giây trong khi giữ khóa dòng tồn kho. Với 200 yêu cầu mỗi giây, connection pool cạn sau vài giây. Sửa bằng cách giữ chỗ trong giao dịch ngắn, gọi API bên ngoài, rồi xác nhận bằng giao dịch ngắn thứ hai.`,

    prosCons: {
      pros: ['Hủy được toàn bộ khi lỗi, và các thay đổi liên quan xuất hiện cùng lúc với người đọc.'],
      cons: ['Giao dịch dài giữ khóa và cản dọn dẹp. Ứng dụng phải có logic thử lại an toàn khi chạy nhiều lần.'],
    },

    whenToUse: {
      use: ['Nhiều thay đổi phải cùng thành công, như ghi đơn hàng và trừ kho.'],
      avoid: [
        'Không gọi API ngoài khi đang mở giao dịch.',
        'Không dùng một giao dịch hàng giờ cho job lớn, hãy chia lô.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Nhiều câu lệnh', 'Phân tán qua 2PC'],
      rows: [
        ['Phạm vi', 'Một máy chủ', 'Nhiều máy chủ'],
        ['Rủi ro chính', 'Giao dịch dài', 'Bị chặn khi bộ điều phối lỗi'],
      ],
    },

    misconceptions: [
      {
        myth: 'Giao dịch chỉ đọc thì không ảnh hưởng đến ai.',
        truth: 'Nó không chặn ghi, nhưng snapshot chạy lâu giữ lại phiên bản cũ làm bảng phình ra.',
      },
      {
        myth: 'ROLLBACK khôi phục mọi thứ.',
        truth: 'Sequence của PostgreSQL không quay lại, và API đã gọi hay email đã gửi không thể thu hồi.',
      },
    ],
  },
})
