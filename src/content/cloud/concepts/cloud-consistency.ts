import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-consistency',
  summary:
    'Consistency trong hệ phân tán là hợp đồng về việc một lần đọc được phép thấy giá trị nào khi có nhiều bản sao. Các mức đi từ Linearizability đến Eventual, càng mạnh càng dễ lập trình nhưng càng tốn độ trễ.',
  tags: ['Nhất quán', 'Hệ thống phân tán', 'First Principles'],
  related: ['cloud-cap', 'cloud-eventual-consistency', 'cloud-replication', 'db-acid', 'db-isolation-levels', 'cloud-s3', 'kafka-replication'],
  sections: {
    definition: `**Consistency (Tính nhất quán)** trong hệ phân tán là hợp đồng giữa hệ thống và client: khi có nhiều bản sao, một lần đọc được phép thấy giá trị nào.

Từ này có nhiều nghĩa, nên phải nói rõ đang dùng nghĩa nào:

- **Trong [[cloud-cap|CAP]]:** là Linearizability, tức hệ thống hoạt động như chỉ có một bản dữ liệu.
- **Trong [[db-acid|ACID]]:** là giao dịch giữ cho dữ liệu thỏa các ràng buộc nghiệp vụ.

Trang này nói về nghĩa thứ nhất và các mức yếu hơn của nó.`,

    origin: `Với một máy và một bản dữ liệu, đọc luôn thấy giá trị mới nhất, nên vấn đề không tồn tại. [[cloud-replication|Replication]] tạo ra nó: chuyển thay đổi sang bản khác luôn mất thời gian.

Giữ các bản giống hệt nhau nghĩa là mỗi lần ghi phải chờ mạng. Dynamo (2007) chọn nới lỏng để có độ trễ thấp, và sau đó nhiều mức ở giữa ra đời.`,

    whyUse: `Chọn sai mức gây ra hai loại thiệt hại. Mạnh quá thì trả giá bằng độ trễ và tính sẵn sàng cho dữ liệu không cần đến mức đó. Yếu quá thì gặp lỗi nghiệp vụ khó tái hiện: bán quá số tồn kho, người dùng vừa lưu xong đã thấy dữ liệu "biến mất". Với pipeline, đọc từ bản sao có thể bỏ sót các dòng vừa ghi.`,

    mechanism: `**Các mức, từ mạnh đến yếu:**

- **Linearizability (Strong):** mọi thao tác như xảy ra trên một bản duy nhất, theo đúng thứ tự thời gian thực. Ghi xong thì mọi người đều đọc thấy.
- **Sequential:** mọi client thấy cùng một thứ tự, nhưng thứ tự đó có thể đi sau thời gian thực.
- **Causal:** các thao tác có quan hệ nhân quả được thấy đúng thứ tự, nên câu trả lời không hiện trước câu hỏi.
- **Session:** đảm bảo trong một phiên, gồm **Read-your-writes** (thấy ghi của chính mình) và **Monotonic Reads** (không đọc lùi về quá khứ).
- **Eventual:** ngừng ghi thì các bản sẽ hội tụ, xem [[cloud-eventual-consistency]].

**Vì sao mức mạnh lại đắt:** phải đi qua một leader hoặc đồng thuận với đa số nút (Paxos, Raft), nên mỗi thao tác tốn ít nhất một vòng mạng. Giữa hai vùng xa nhau, vòng mạng tốn hàng chục đến hàng trăm mili giây, và không phần mềm nào vượt được giới hạn vật lý này. Đây chính là phần \`ELC\` trong [[cloud-cap|PACELC]].

**Vì sao mức Session lại rẻ:** client giữ một token phiên bản, và chỉ đọc từ bản sao đã bắt kịp token đó. Không cần mọi bản giống nhau, chỉ cần đủ mới với người đang hỏi.

**Trong các dịch vụ thật:**

- **DynamoDB:** mặc định đọc eventual. Đặt \`ConsistentRead\` để đọc mạnh trên bảng và LSI, còn GSI luôn là eventual.
- **Cosmos DB:** năm mức là Strong, Bounded Staleness, Session (mặc định), Consistent Prefix, Eventual.
- **Cassandra:** chọn theo từng thao tác, như \`ONE\`, \`QUORUM\`, \`ALL\`.
- **[[cloud-s3|S3]]:** strong read-after-write với object từ tháng 12/2020, nhưng cấu hình bucket vẫn là eventual.

**Khác với Isolation:** [[db-isolation-levels|Isolation]] nói về giao dịch nhiều thao tác, còn Linearizability nói về từng đối tượng. Một hệ thống có thể Serializable mà không Linearizable, nếu giao dịch được xếp thứ tự không theo thời gian thực. Có cả hai thì gọi là Strict Serializable.`,

    example: `Một trang bán vé có 500 vé, kiểm tra tồn kho bằng cách đọc từ bản sao có độ trễ 3 giây, rồi mới ghi đơn. Lúc mở bán, nhiều người cùng thấy "còn vé" và hệ thống bán 540 vé.

Cách sửa không phải là đổi mọi thứ sang Strong. Nhóm chia theo thao tác:

- **Trừ tồn kho:** ghi có điều kiện trên leader, chỉ thành công khi còn vé. Mức Strong.
- **Hiển thị số vé còn lại:** vẫn đọc từ bản sao. Eventual, sai vài giây không sao.
- **Trang đơn hàng của người vừa mua:** Read-your-writes.

95% lượng đọc vẫn nhanh, trong khi đúng ở nơi thực sự cần đúng.`,

    prosCons: {
      pros: [
        '**Mức mạnh:** dễ lập trình, không phải nghĩ tới các trạng thái bất thường.',
        '**Mức yếu:** độ trễ thấp, vẫn phục vụ được khi mạng có sự cố.',
      ],
      cons: [
        '**Mức mạnh:** độ trễ cao, nhất là khi trải nhiều vùng, và có thể từ chối khi mất đa số.',
        '**Mức yếu:** ứng dụng phải tự xử lý dữ liệu cũ và xung đột.',
      ],
    },

    whenToUse: {
      use: [
        '**Strong:** tiền, tồn kho, ngăn trùng, bầu leader, khóa.',
        '**Session:** dữ liệu người dùng tự sửa, như hồ sơ, giỏ hàng.',
        '**Eventual:** lượt thích, số liệu, dữ liệu phân tích, cache.',
      ],
      avoid: [
        'Không chọn một mức cho toàn hệ thống. Hãy chọn theo từng thao tác.',
        'Không kiểm tra rồi mới ghi dựa trên đọc eventual. Hãy dùng ghi có điều kiện.',
      ],
    },

    comparison: {
      intro: 'So sánh các mức theo điều client được đảm bảo:',
      headers: ['Mức', 'Đảm bảo', 'Chi phí', 'Hợp với'],
      rows: [
        ['Linearizability', 'Luôn thấy giá trị mới nhất', 'Cao nhất', 'Khóa, tồn kho'],
        ['Causal', 'Đúng thứ tự nhân quả', 'Trung bình', 'Bình luận, nhắn tin'],
        ['Session', 'Thấy ghi của chính mình', 'Thấp', 'Hồ sơ người dùng'],
        ['Eventual', 'Hội tụ khi ngừng ghi', 'Thấp nhất', 'Lượt thích, số liệu'],
      ],
    },

    misconceptions: [
      {
        myth: 'Consistency trong CAP và trong ACID là một.',
        truth: 'CAP nói về các bản sao có trả lời như một bản hay không. ACID nói về việc dữ liệu thỏa ràng buộc nghiệp vụ. Hệ thống có thể đạt cái này mà không đạt cái kia.',
      },
      {
        myth: 'Eventual consistency nghĩa là dữ liệu sai.',
        truth: 'Dữ liệu chỉ có thể cũ trong một khoảng thời gian, thường rất ngắn.',
      },
      {
        myth: 'Đọc mạnh là đủ để tránh bán quá số tồn kho.',
        truth: 'Giữa lúc đọc và lúc ghi vẫn có người khác ghi. Cần ghi có điều kiện hoặc giao dịch, không chỉ cần đọc mạnh.',
      },
    ],
  },
})
