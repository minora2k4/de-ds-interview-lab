import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-hdfs',
  summary:
    'HDFS là hệ thống tệp phân tán, chia tệp thành các block mặc định 128 MB và sao chép 3 bản trên các DataNode, còn NameNode giữ metadata. Nó tối ưu cho đọc tuần tự tệp lớn, không hợp với nhiều tệp nhỏ.',
  tags: ['HDFS', 'Lưu trữ', 'Kiến trúc', 'Erasure Coding'],
  related: [
    'hadoop-namenode',
    'hadoop-datanode',
    'hadoop-block-replication',
    'hadoop-secondary-namenode',
    'hadoop-data-locality',
    'spark-small-files',
    'cloud-s3',
  ],
  sections: {
    definition: `**HDFS (Hadoop Distributed File System, Hệ thống tệp phân tán của Hadoop)** lưu tệp rất lớn trên nhiều máy thường, theo kiến trúc một nút quản lý và nhiều nút lưu trữ:

- **[[hadoop-namenode|NameNode]]** giữ metadata: cây thư mục, tệp gồm những block nào.
- **[[hadoop-datanode|DataNode]]** giữ dữ liệu thật dưới dạng các **block**, mặc định 128 MB.

Tệp theo mô hình **write-once-read-many (ghi một lần, đọc nhiều lần)**: đã ghi xong thì không sửa được ở giữa, chỉ có thể nối thêm vào cuối hoặc cắt bớt phần cuối. Tại một thời điểm, mỗi tệp chỉ có một người ghi.`,

    origin: `HDFS dựa trên ý tưởng của Google File System. Trước đó, dữ liệu lớn thường nằm trên kho lưu trữ tập trung như NAS hoặc SAN. Cách này đắt, và mọi máy tính phải kéo dữ liệu qua mạng về xử lý, nên đường truyền trở thành nút nghẽn.

HDFS đổi lại các giả định:

- Phần cứng hỏng là chuyện bình thường, nên phải tự phục hồi.
- Chuyển tính toán tới dữ liệu rẻ hơn chuyển dữ liệu tới tính toán.
- Không cần sửa giữa tệp, nên việc giữ nhất quán đơn giản đi rất nhiều.`,

    whyUse: `HDFS mang lại **thông lượng đọc rất cao** vì một tệp được đọc song song từ nhiều đĩa, **chịu lỗi tự động** vì có bản sao, và **chi phí thấp** vì dùng đĩa thường. Task còn có thể chạy ngay trên máy đang giữ block, gọi là [[hadoop-data-locality]].`,

    mechanism: `**Vì sao block lớn:** block lớn làm NameNode phải theo dõi ít đối tượng hơn, và đĩa dành phần lớn thời gian để đọc liên tục thay vì tìm vị trí. Một tệp 1 MB **không chiếm trọn 128 MB** trên đĩa, vì block được lưu như tệp thông thường, chỉ dùng đúng dung lượng thực.

**Luồng đọc:**

1. Client hỏi NameNode vị trí các block.
2. NameNode trả về danh sách DataNode, xếp theo độ gần với client.
3. Client đọc trực tiếp từ DataNode gần nhất và kiểm tra checksum. Nếu lỗi, nó đọc bản sao khác.

**Luồng ghi:**

1. Client xin NameNode tạo tệp và cấp danh sách DataNode cho mỗi block.
2. Client gửi dữ liệu tới DataNode đầu tiên. DataNode này vừa ghi vừa chuyển tiếp cho DataNode sau, tạo thành **pipeline (đường ống)**.
3. Xác nhận đi ngược lại từ DataNode cuối về client.

**Dữ liệu người dùng không bao giờ đi qua NameNode.** Nhờ vậy một NameNode phục vụ được cả cụm lớn.

**Tính sẵn sàng cao:** Hadoop 2 trở đi cho phép chạy **Active NameNode** cùng **Standby NameNode**, dùng chung edit log qua các JournalNode. Chi tiết ở [[hadoop-namenode]].

**Erasure Coding (Mã hóa xóa), từ Hadoop 3:** thay vì giữ 3 bản sao, tệp được chia sọc thành các ô 1 MB, rồi tính thêm khối chẵn lẻ. Chính sách mặc định **RS-6-3-1024k** dùng 6 khối dữ liệu và 3 khối chẵn lẻ, nên chi phí lưu trữ chỉ 50% thay vì 200%, mà vẫn chịu được mất 3 khối. Đổi lại, nó tốn CPU để mã hóa và giải mã, phần lớn thao tác phải đi qua rack khác, và không hỗ trợ \`hflush\`, \`hsync\`. Vì vậy nó hợp với dữ liệu ấm và lạnh.

**Vì sao sợ tệp nhỏ:** mỗi tệp và mỗi block là một đối tượng trong RAM của NameNode, theo kinh nghiệm khoảng 150 byte mỗi đối tượng. Áp lực bộ nhớ phụ thuộc vào **số tệp**, không phải dung lượng. Xem [[spark-small-files]].`,

    diagram: {
      mermaid: `flowchart TD
  C["Client"] -->|"xin danh sách DataNode"| N["NameNode"]
  N -->|"DN1, DN2, DN3"| C
  C -->|"gửi dữ liệu"| D1["DataNode 1"]
  D1 -->|"chuyển tiếp"| D2["DataNode 2, rack khác"]
  D2 -->|"chuyển tiếp"| D3["DataNode 3, cùng rack với DN2"]`,
      caption:
        'Luồng ghi một block với hệ số sao chép 3. NameNode chỉ quyết định vị trí, còn dữ liệu đi thẳng qua pipeline giữa các DataNode.',
    },

    example: `**Về tệp nhỏ:** một tệp 1 GB gồm 8 block, tức 1 tệp và 8 block, khoảng 9 đối tượng trên NameNode. Cùng 1 GB đó chia thành 1.024 tệp 1 MB sẽ tốn 1.024 tệp và 1.024 block, khoảng 2.048 đối tượng, nhiều gấp hơn 200 lần, dù dung lượng trên đĩa như nhau.

**Về Erasure Coding:** một công ty có 600 TB dữ liệu lịch sử, rất ít được đọc. Với 3 bản sao, dung lượng thực tế là 1,8 PB. Chuyển sang RS-6-3 chỉ còn 900 TB, tiết kiệm 900 TB đĩa. Họ giữ nguyên 3 bản sao cho dữ liệu 30 ngày gần nhất, vì phần này thường xuyên được đọc và cần locality.`,

    prosCons: {
      pros: [
        '**Thông lượng cao** nhờ đọc song song nhiều đĩa, phù hợp quét toàn bộ dữ liệu.',
        '**Tự phục hồi:** mất đĩa hay mất máy thì hệ thống tự sao chép lại các block thiếu.',
        '**Rename là thao tác metadata** nên nguyên tử và rất nhanh, điều mà nhiều job dựa vào khi ghi kết quả.',
      ],
      cons: [
        '**Không hợp với nhiều tệp nhỏ,** vì NameNode giữ metadata trong RAM.',
        '**Không sửa được giữa tệp,** nên muốn sửa thường phải ghi lại cả tệp.',
        '**Độ trễ cao với truy cập ngẫu nhiên,** không phù hợp để phục vụ từng dòng.',
      ],
    },

    whenToUse: {
      use: [
        'Lưu tệp lớn và đọc tuần tự cho các job theo lô như Spark hay Hive.',
        'Dùng Erasure Coding cho dữ liệu lạnh để giảm một nửa số đĩa.',
      ],
      avoid: [
        'Không dùng làm nơi lưu hàng trăm triệu tệp nhỏ. Nên gộp tệp trước, xem [[spark-small-files]].',
        'Không dùng cho ứng dụng cần sửa dữ liệu tại chỗ hoặc truy vấn từng dòng với độ trễ thấp.',
        'Không dùng Erasure Coding cho tệp phải gọi `hflush` hoặc `hsync` liên tục, ví dụ nhật ký ghi dần.',
      ],
    },

    comparison: {
      intro: 'So sánh HDFS với object storage và kho lưu trữ tập trung:',
      headers: ['Tiêu chí', 'HDFS', 'S3', 'NAS truyền thống'],
      rows: [
        ['Tính toán và lưu trữ', 'Có thể cùng máy', 'Tách rời', 'Tách rời'],
        ['Bản sao', 'Do cụm quản lý, mặc định 3', 'Dịch vụ tự lo', 'Thường dùng RAID'],
        ['Rename thư mục', 'Nguyên tử, rất nhanh', 'Sao chép rồi xóa', 'Nhanh'],
        ['Giới hạn số tệp', 'Theo RAM của NameNode', 'Không phải lo', 'Theo thiết bị'],
      ],
    },

    misconceptions: [
      {
        myth: 'Một tệp 1 MB chiếm trọn 128 MB trên đĩa.',
        truth: 'Block chỉ dùng đúng dung lượng thực. Vấn đề của tệp nhỏ nằm ở RAM của NameNode và chi phí mở tệp, không phải ở việc lãng phí đĩa.',
      },
      {
        myth: 'Tệp nhỏ tốn ít tài nguyên vì chúng nhỏ.',
        truth: 'Mỗi tệp và mỗi block đều tốn bộ nhớ trên NameNode bất kể kích thước. Cùng dung lượng, nhiều tệp nhỏ tạo áp lực lớn hơn nhiều so với vài tệp lớn.',
      },
      {
        myth: 'Client ghi dữ liệu qua NameNode.',
        truth: 'NameNode chỉ trả về danh sách DataNode. Dữ liệu đi từ client tới DataNode rồi qua pipeline, nếu không NameNode sẽ là nút nghẽn của cả cụm.',
      },
      {
        myth: 'Erasure Coding luôn tốt hơn sao chép vì tiết kiệm đĩa.',
        truth: 'Nó đổi đĩa lấy CPU và mạng, làm giảm locality và có giới hạn về API. Dữ liệu nóng thường vẫn hợp với 3 bản sao hơn.',
      },
    ],
  },
})
