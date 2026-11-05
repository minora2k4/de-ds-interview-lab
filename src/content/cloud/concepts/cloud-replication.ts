import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-replication',
  summary:
    'Replication giữ nhiều bản sao dữ liệu trên nhiều máy để tăng độ bền, tính sẵn sàng và năng lực đọc. Đồng bộ thì an toàn nhưng chậm, bất đồng bộ thì nhanh nhưng có độ trễ và có thể mất dữ liệu.',
  tags: ['Bản sao', 'Độ tin cậy', 'First Principles'],
  related: ['cloud-fault-tolerance', 'cloud-consistency', 'cloud-eventual-consistency', 'cloud-cap', 'kafka-replication', 'hadoop-block-replication', 'db-sharding'],
  sections: {
    definition: `**Replication (Sao chép dữ liệu)** là giữ cùng một dữ liệu trên nhiều máy và giữ cho chúng được cập nhật. Đây là nguyên lý chung. [[kafka-replication]] và [[hadoop-block-replication]] là hai cách áp dụng cụ thể.`,

    origin: `Một bản dữ liệu thì đĩa hỏng là mất. Sao lưu định kỳ thì phục hồi chậm. Replication giữ sẵn một bản gần như mới nhất.`,

    whyUse: `Tăng độ bền và [[cloud-high-availability|tính sẵn sàng]], tăng năng lực đọc, và đưa dữ liệu lại gần người dùng ở vùng khác. Nó không tăng năng lực ghi.`,

    mechanism: `**Ba mô hình:**

- **Single-leader:** mọi ghi qua một leader, rồi chuyển cho follower. Đơn giản và không có xung đột ghi.
- **Multi-leader:** nhiều nơi nhận ghi, hợp với nhiều vùng, nhưng phải xử lý xung đột.
- **Leaderless:** ghi và đọc trên nhiều bản sao theo quorum. Nếu \`R + W > N\` thì tập đọc và tập ghi giao nhau.

**Đồng bộ hay bất đồng bộ:** đồng bộ chờ bản sao xác nhận rồi mới báo thành công, nên chậm hơn và bản sao lỗi có thể chặn việc ghi. Bất đồng bộ báo thành công ngay, nên có **độ trễ sao chép**, và leader hỏng lúc đó sẽ mất các ghi chưa kịp chuyển. Kafka dung hòa bằng \`acks=all\` với tập ISR.`,

    diagram: {
      mermaid: `flowchart TD
  A["Client ghi"] --> B["Leader"]
  B --> C["Follower đồng bộ"]
  C --> D["Xác nhận cho Leader"]
  D --> E["Báo thành công cho Client"]
  B -.-> F["Follower bất đồng bộ"]
  F --> G["Đọc có thể thấy dữ liệu cũ"]`,
      caption: 'Client chỉ chờ follower đồng bộ. Follower bất đồng bộ đi sau, nên đọc từ đó có thể thấy dữ liệu cũ.',
    },

    example: `Cơ sở dữ liệu ghi 2.000 giao dịch mỗi giây, sao chép bất đồng bộ với độ trễ 5 giây. Leader hỏng thì có thể mất tới 10.000 giao dịch. Chuyển một follower sang đồng bộ thì độ trễ ghi tăng 2 ms nhưng hết rủi ro đó.`,

    prosCons: {
      pros: ['Mất máy không mất dữ liệu và vẫn phục vụ được.', 'Chia được tải đọc cho nhiều bản sao.'],
      cons: ['Tốn gấp nhiều lần dung lượng.', 'Phải đánh đổi giữa [[cloud-consistency|tính nhất quán]], độ trễ và tính sẵn sàng.'],
    },

    whenToUse: {
      use: ['Dữ liệu quan trọng, tải đọc lớn, hoặc người dùng ở nhiều vùng.'],
      avoid: ['Không dùng để thay sao lưu: lệnh xóa nhầm cũng được sao chép ngay.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Replication', 'Sharding', 'Backup'],
      rows: [
        ['Mục đích', 'Sẵn sàng, tăng đọc', 'Tăng ghi và dung lượng', 'Quay lại quá khứ'],
        ['Mỗi máy giữ', 'Toàn bộ phần dữ liệu đó', 'Một phần dữ liệu', 'Bản chụp ngoại tuyến'],
        ['Chống xóa nhầm', 'Không', 'Không', 'Có'],
      ],
    },

    misconceptions: [
      {
        myth: 'Có Replication thì không cần Backup.',
        truth: 'Xóa nhầm cũng được chép sang mọi bản.',
      },
      {
        myth: 'R + W > N nghĩa là luôn đọc được giá trị mới nhất.',
        truth: 'Ghi đang dở hoặc sloppy quorum vẫn có thể làm đọc thấy giá trị cũ.',
      },
    ],
  },
})
