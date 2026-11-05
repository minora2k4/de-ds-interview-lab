import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-distributed-systems',
  summary:
    'Hệ thống phân tán là nhiều máy phối hợp qua mạng như một hệ thống duy nhất. Hadoop giải các bài toán cốt lõi của nó bằng chia khối, sao chép, heartbeat và quorum.',
  tags: ['Nền tảng', 'Hệ thống phân tán'],
  related: ['hadoop-overview', 'hadoop-fault-tolerance', 'hadoop-block-replication', 'cloud-cap', 'cloud-scaling', 'cloud-distributed-computing'],
  sections: {
    definition: `**Distributed System (Hệ thống phân tán)** là tập hợp nhiều máy độc lập, chỉ liên lạc với nhau qua mạng, nhưng phối hợp để người dùng thấy như một hệ thống duy nhất. Đặc trưng khó nhất của nó là **lỗi một phần**: một số máy hỏng trong khi phần còn lại vẫn chạy.`,

    origin: `Khi dữ liệu vượt khỏi một máy, cách cũ là mua máy lớn hơn, nhưng chi phí tăng rất nhanh và vẫn có giới hạn. Mở rộng ngang bằng [[cloud-scaling|nhiều máy thường]] rẻ hơn, nhưng đổi lại phải xử lý lỗi thường xuyên. Tài liệu thiết kế của HDFS xem hỏng phần cứng là trạng thái bình thường, không phải ngoại lệ.`,

    whyUse: `Hiểu các bài toán này giúp giải thích được vì sao Hadoop thiết kế như vậy, thay vì học thuộc từng thành phần. Cùng các bài toán đó cũng xuất hiện trong Spark, Kafka và mọi kho dữ liệu lớn.`,

    mechanism: `Hadoop giải bốn bài toán cốt lõi:

- **Chia dữ liệu:** tệp được cắt thành block để nhiều máy cùng xử lý.
- **Sao chép:** mỗi block có nhiều bản, nên mất một máy không làm mất dữ liệu.
- **Phát hiện lỗi:** qua mạng không phân biệt được máy chết hay máy chậm. Hadoop dùng heartbeat và thời hạn chờ, chấp nhận có độ trễ khi kết luận.
- **Thống nhất trạng thái:** để không có hai NameNode cùng ghi, mỗi thay đổi phải được đa số JournalNode xác nhận. Đây là **quorum**, nên 3 JournalNode chịu được 1 máy lỗi.

Theo góc nhìn [[cloud-cap|định lý CAP]], HDFS ưu tiên nhất quán: chỉ một NameNode Active quyết định metadata, và khi không có NameNode nào Active thì cụm từ chối thao tác thay vì trả về dữ liệu sai.`,

    example: `Một cụm có 2.000 ổ đĩa, tỷ lệ hỏng mỗi năm khoảng 3%, tức 60 ổ mỗi năm, hơn một ổ mỗi tuần. Nếu một phần mềm dừng lại mỗi khi có lỗi, cụm gần như không bao giờ chạy xong job dài. Vì vậy phải xem lỗi là tình huống thường ngày và xử lý tự động.`,

    prosCons: {
      pros: [
        'Mở rộng gần như không giới hạn bằng cách thêm máy.',
        'Một máy hỏng không làm dừng cả hệ thống.',
      ],
      cons: [
        'Phối hợp tốn chi phí: mạng, đồng bộ và shuffle khiến tốc độ không tăng tuyến tính theo số máy.',
        'Khó kiểm thử và khó tìm lỗi, vì lỗi chỉ xuất hiện theo thời điểm và theo tổ hợp máy.',
      ],
    },

    whenToUse: {
      use: [
        'Dữ liệu hoặc tải tính toán vượt quá khả năng của một máy mạnh.',
        'Hệ thống không được dừng khi một máy hỏng.',
      ],
      avoid: [
        'Bài toán vừa một máy, vì phân tán chỉ thêm độ phức tạp.',
        'Không tự viết cơ chế đồng thuận khi đã có ZooKeeper hoặc hệ thống tương tự.',
      ],
    },

    comparison: {
      intro: 'So sánh một máy lớn với một cụm nhiều máy:',
      headers: ['Tiêu chí', 'Một máy lớn', 'Cụm phân tán'],
      rows: [
        ['Cách mở rộng', 'Nâng cấp, có giới hạn', 'Thêm máy'],
        ['Khi có lỗi', 'Dừng toàn bộ', 'Lỗi một phần, tự xử lý'],
        ['Độ phức tạp', 'Thấp', 'Cao'],
        ['Độ trễ nội bộ', 'Rất thấp', 'Cao hơn do qua mạng'],
      ],
    },

    misconceptions: [
      {
        myth: 'Gấp đôi số máy thì job nhanh gấp đôi.',
        truth: 'Phần phối hợp và shuffle không giảm theo số máy, và phần không song song được vẫn giữ nguyên, nên mức tăng thường thấp hơn nhiều.',
      },
      {
        myth: 'Không nhận được heartbeat nghĩa là máy đã chết.',
        truth: 'Máy có thể chỉ đang chậm hoặc mất mạng tạm thời, và vẫn còn chạy. Vì thế cần thời hạn chờ dài và cơ chế fencing để máy cũ không gây sai lệch.',
      },
    ],
  },
})
