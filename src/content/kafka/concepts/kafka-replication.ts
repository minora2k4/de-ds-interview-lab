import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-replication',
  summary:
    'Replication sao chép mỗi Partition ra nhiều Broker. Thông điệp là committed khi mọi bản sao trong ISR đã nhận. Bộ ba replication factor 3, min.insync.replicas 2 và acks=all là cấu hình phổ biến để cân bằng độ bền và tính sẵn sàng.',
  tags: ['Replication', 'ISR', 'Độ bền', 'First Principles'],
  related: [
    'kafka-leader-follower',
    'kafka-partition',
    'kafka-producer',
    'kafka-broker',
    'hadoop-block-replication',
    'cloud-replication',
    'cloud-cap',
  ],
  sections: {
    definition: `**Replication (Sao chép)** là việc giữ nhiều bản của mỗi [[kafka-partition|Partition]] trên nhiều [[kafka-broker|Broker]]. **Replication factor** là tổng số bản, tính cả Leader.

**ISR (In-Sync Replicas, tập bản sao đồng bộ)** là các bản sao đang theo kịp Leader. Thông điệp được xem là **committed** khi mọi bản sao trong ISR đã nhận, và chỉ thông điệp committed mới được trả cho Consumer.`,

    origin: `Máy hỏng là chuyện thường ở quy mô lớn. Nếu Partition chỉ nằm trên một Broker, máy hỏng nghĩa là mất dữ liệu hoặc ngừng phục vụ.

Cách phổ biến là bỏ phiếu đa số, nhưng muốn chịu 2 lỗi phải có 5 bản, tốn gấp 5 lần đĩa. Tài liệu Kafka cho rằng chi phí này không thực tế với dữ liệu lượng lớn. Kafka chọn **ISR**: tập bản sao thay đổi động, và chỉ thành viên ISR mới được làm Leader. Với f + 1 bản sao, Kafka chịu được f lỗi mà không mất dữ liệu committed.`,

    whyUse: `- **Không mất dữ liệu đã xác nhận** khi một Broker hỏng.
- **Sẵn sàng liên tục:** Leader mới được bầu sau một khoảng ngắn, nên bảo trì có thể làm lần lượt từng máy.
- **Không cần fsync mỗi lần ghi:** độ bền đến từ nhiều bản trên nhiều máy, nên hiệu năng cao hơn rất nhiều.`,

    mechanism: `1. **Ghi.** Producer gửi tới Leader, Leader nối vào log.
2. **Sao chép.** Follower chủ động kéo dữ liệu từ Leader như một Consumer, nên gom batch tự nhiên.
3. **Theo dõi ISR.** Follower bị loại khỏi ISR nếu mất phiên với Controller, hoặc không theo kịp Leader trong \`replica.lag.time.max.ms\` (mặc định 30 giây).
4. **Commit.** Khi mọi bản trong ISR đã nhận, high watermark tiến lên. Consumer chỉ đọc tới high watermark.
5. **Xác nhận.** Với \`acks=all\`, Producer nhận phản hồi sau bước trên.

**\`acks=all\` chưa đủ.** Nó chỉ chờ ISR **hiện tại**. Nếu ISR co còn mỗi Leader, một bản là đủ để xác nhận, và Leader chết sẽ mất dữ liệu. **\`min.insync.replicas\` mặc định là 1** nên không chặn được tình huống này. Đặt giá trị 2 thì Broker từ chối ghi khi ISR nhỏ hơn 2, và Producer nhận lỗi \`NotEnoughReplicas\`.

**Một điểm thường bị bỏ qua:** dù \`acks\` thế nào, thông điệp chỉ hiển thị cho Consumer khi đã có đủ ISR và ISR không nhỏ hơn \`min.insync.replicas\`.

**Khi mọi ISR cùng chết:** \`unclean.leader.election.enable\` mặc định \`false\`, nên Partition chờ thay vì để bản sao thiếu dữ liệu làm Leader. Từ 4.0 có **Eligible Leader Replicas**, bật mặc định trên cụm mới từ 4.1, giúp bầu được một số bản sao ngoài ISR mà vẫn an toàn.`,

    diagram: {
      mermaid: `flowchart TD
  A["Producer gửi với acks=all"] --> B["Leader ghi vào log"]
  B --> C["Follower 1 kéo dữ liệu"]
  B --> D["Follower 2 kéo dữ liệu"]
  C --> E["Mọi bản trong ISR đã nhận"]
  D --> E
  E --> F["High watermark tăng, Consumer đọc được"]
  E --> G["Producer nhận xác nhận"]`,
      caption:
        'Follower tự kéo dữ liệu. Thông điệp chỉ committed và hiển thị cho Consumer khi toàn bộ ISR đã có.',
    },

    example: `Một Topic thanh toán đặt replication factor 3, \`min.insync.replicas=2\`, \`acks=all\`.

- **Mất 1 Broker:** ISR còn 2, vẫn ghi và đọc bình thường, không mất dữ liệu committed.
- **Mất 2 Broker:** ISR còn 1, Producer nhận \`NotEnoughReplicas\`. Ghi dừng để tránh rủi ro, Consumer vẫn đọc được dữ liệu đã commit.

Một Topic khác dùng chung cụm nhưng giữ mặc định \`min.insync.replicas=1\`. Khi một Follower chậm, rồi Follower còn lại khởi động lại, ISR co về chỉ còn Leader. Producer vẫn nhận xác nhận thành công. Leader hỏng đúng lúc đó, các thông điệp vừa xác nhận bị mất, dù cấu hình \`acks=all\`.`,

    prosCons: {
      pros: [
        '**Chịu được f lỗi với f + 1 bản,** rẻ hơn bỏ phiếu đa số.',
        '**Độ trễ thấp khi bình thường,** không cần fsync từng lần ghi.',
        '**Có thể chọn đánh đổi theo từng Topic.**',
      ],
      cons: [
        '**Tốn đĩa và băng thông** theo replication factor.',
        '**Follower chậm kéo theo độ trễ ghi** của `acks=all`, cho tới khi bị loại khỏi ISR.',
        '**`min.insync.replicas` cao làm giảm tính sẵn sàng khi ghi.**',
      ],
    },

    whenToUse: {
      use: [
        'Dùng replication factor 3 và `min.insync.replicas=2` cho dữ liệu quan trọng.',
        'Đặt các bản sao trên nhiều rack hoặc vùng sẵn sàng.',
        'Cảnh báo khi có Partition thiếu bản sao.',
      ],
      avoid: [
        'Không đặt `min.insync.replicas` bằng replication factor, vì hỏng một máy là dừng ghi.',
        'Không bật unclean election cho dữ liệu không được phép mất.',
        'Không dùng replication factor 1 cho production, dù đây là mặc định của cụm.',
      ],
    },

    comparison: {
      intro: 'Tác động của từng cấu hình khi Broker hỏng, cùng dùng `acks=all`:',
      headers: ['Cấu hình', 'Mất 1 Broker', 'Mất 2 Broker', 'Nhận xét'],
      rows: [
        ['RF 3, min ISR 1', 'Vẫn ghi', 'Vẫn ghi, chỉ còn một bản', 'Sẵn sàng cao, có rủi ro mất dữ liệu'],
        ['RF 3, min ISR 2', 'Vẫn ghi', 'Dừng ghi', 'Cân bằng, phổ biến nhất'],
        ['RF 3, min ISR 3', 'Dừng ghi', 'Dừng ghi', 'Quá chặt'],
        ['RF 2, min ISR 2', 'Dừng ghi', 'Mất dịch vụ', 'Tốn ít đĩa, kém sẵn sàng'],
      ],
    },

    misconceptions: [
      {
        myth: '`acks=all` nghĩa là mọi bản sao được gán đều đã nhận.',
        truth: 'Chỉ cần các bản đang trong ISR. Phải kết hợp `min.insync.replicas` mới đảm bảo số bản tối thiểu.',
      },
      {
        myth: 'Kafka dùng bỏ phiếu đa số cho dữ liệu.',
        truth: 'Dữ liệu dùng ISR. Bỏ phiếu đa số qua Raft chỉ dùng cho metadata trong nhóm Controller.',
      },
      {
        myth: 'Kafka an toàn vì fsync mọi thông điệp xuống đĩa.',
        truth: 'Kafka không fsync từng lần ghi. Độ bền đến từ nhiều bản sao, và bản sao lỗi phải đồng bộ lại trước khi vào ISR.',
      },
      {
        myth: 'Có nhiều bản sao thì Consumer đọc được dữ liệu ngay khi Leader nhận.',
        truth: 'Consumer chỉ thấy dữ liệu tới high watermark, tức phần đã được toàn bộ ISR nhận.',
      },
    ],
  },
})
