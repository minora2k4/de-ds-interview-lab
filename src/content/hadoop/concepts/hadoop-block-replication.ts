import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-block-replication',
  summary:
    'HDFS mặc định giữ 3 bản sao mỗi block: một ở máy ghi, hai bản còn lại trên hai máy ở một rack khác. Thiếu bản sao thì NameNode tự sao chép lại. Erasure Coding là lựa chọn tiết kiệm đĩa hơn.',
  tags: ['HDFS', 'Sao chép', 'Rack Awareness'],
  related: ['hadoop-hdfs', 'hadoop-datanode', 'hadoop-namenode', 'hadoop-data-locality', 'cloud-replication'],
  sections: {
    definition: `**Block Replication (Sao chép khối dữ liệu)** là việc giữ nhiều bản của mỗi block trên các máy khác nhau, mặc định **3 bản** theo \`dfs.replication\`, có thể đặt riêng cho từng tệp. **Rack Awareness (Nhận biết rack)** là việc đặt các bản sao có tính đến sơ đồ mạng, để không mất hết khi cả một rack hỏng.`,

    origin: `Với hàng nghìn ổ đĩa thường, chắc chắn sẽ có ổ hỏng. RAID chỉ bảo vệ trong một máy, không chống được mất nguồn hay mất switch của cả rack. HDFS đưa bản sao lên mức toàn cụm, đồng thời tận dụng các bản sao đó để đọc song song và tính toán gần dữ liệu.`,

    whyUse: `Một cụm chịu được mất 2 bản bất kỳ của một block. Các bản sao cũng tạo thêm lựa chọn cho [[hadoop-data-locality]], và cho phép chạy thêm task trên cùng dữ liệu, nên tệp được đọc nhiều có thể đặt nhiều bản hơn.`,

    mechanism: `**Chính sách đặt bản sao khi hệ số là 3:**

1. Bản thứ nhất ở máy đang ghi, nếu máy đó là DataNode. Nếu không, chọn ngẫu nhiên một DataNode cùng rack với máy ghi.
2. Bản thứ hai ở một máy thuộc **rack khác**.
3. Bản thứ ba ở **một máy khác trong cùng rack với bản thứ hai**.

**Vì sao không rải ra ba rack:** mạng giữa các rack đắt và hẹp hơn. Cách này chỉ phải vượt rack một lần khi ghi, trong khi rack hỏng ít xảy ra hơn nhiều so với máy hỏng, nên độ an toàn vẫn đủ.

**Rack không tự được phát hiện.** Quản trị viên phải cấu hình \`net.topology.script.file.name\` hoặc một lớp Java. Nếu bỏ qua, mọi máy nằm trong \`/default-rack\`, và mất một rack thật có thể làm mất mọi bản sao.

**Khi thiếu bản sao:** NameNode theo dõi liên tục và lên lịch sao chép khi máy chết, đĩa hỏng, hoặc hệ số được tăng lên. Thừa bản sao thì nó yêu cầu xóa bớt.`,

    example: `Một tệp 10 TB với hệ số 3 chiếm 30 TB đĩa, tức tốn thêm 200%. Với Erasure Coding RS-6-3, tệp này chỉ chiếm 15 TB, tức tốn thêm 50%. Công ty giữ hệ số 3 cho bảng đang dùng hằng ngày, và chuyển dữ liệu trên một năm sang Erasure Coding.`,

    prosCons: {
      pros: [
        'Phục hồi bằng cách sao chép đơn giản, không tốn CPU để tính toán.',
      ],
      cons: [
        'Tốn gấp ba dung lượng đĩa.',
        'Mỗi lần ghi phải đi qua pipeline ba máy, tốn thêm mạng và thời gian.',
      ],
    },

    whenToUse: {
      use: [
        'Giữ hệ số 3 cho dữ liệu nóng và đang phục vụ nhiều job.',
        'Luôn cấu hình rack thật trên các cụm có nhiều rack.',
      ],
      avoid: [
        'Không giảm xuống 1 cho dữ liệu không thể tạo lại.',
        'Không xem bản sao là bản sao lưu: lệnh xóa nhầm được áp dụng cho mọi bản, hãy dùng thêm thùng rác và snapshot.',
      ],
    },

    comparison: {
      intro: 'So sánh sao chép với Erasure Coding của Hadoop 3:',
      headers: ['Tiêu chí', 'Sao chép 3 bản', 'RS-6-3'],
      rows: [
        ['Chi phí đĩa thêm', '200%', '50%'],
        ['Số khối mất được', '2', '3'],
        ['Khi phục hồi', 'Sao chép một bản', 'Đọc nhiều khối và giải mã'],
        ['Locality', 'Tốt', 'Kém, đa số đi qua rack khác'],
        ['Hợp với', 'Dữ liệu nóng', 'Dữ liệu ấm và lạnh'],
      ],
    },

    misconceptions: [
      {
        myth: 'Ba bản sao nằm trên ba rack khác nhau.',
        truth: 'Với chính sách mặc định, ba bản chỉ nằm trên hai rack: một rack có một bản, rack kia có hai bản.',
      },
      {
        myth: 'Hadoop tự biết máy nào thuộc rack nào.',
        truth: 'Phải cấu hình script hoặc lớp ánh xạ. Không có cấu hình thì mọi máy được xem như cùng một rack.',
      },
    ],
  },
})
