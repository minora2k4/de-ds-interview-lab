import { defineConcept } from '../../define'

export default defineConcept({
  id: 'kafka-leader-follower',
  summary:
    'Mỗi Partition có một Leader nhận mọi lần ghi, các Follower kéo dữ liệu từ Leader. Khi Leader hỏng, Controller bầu Leader mới từ ISR. Consumer mặc định đọc từ Leader, nhưng có thể cấu hình đọc từ Follower.',
  tags: ['Leader', 'Follower', 'Chịu lỗi'],
  related: ['kafka-replication', 'kafka-broker', 'kafka-partition', 'cloud-replication'],
  sections: {
    definition: `**Leader (Bản chính)** là bản sao nhận mọi lần ghi của một [[kafka-partition|Partition]]. **Follower (Bản sao)** kéo dữ liệu từ Leader để giữ log giống hệt, cùng Offset và cùng thứ tự. Đây là vai trò theo từng Partition, không phải theo từng máy.`,

    origin: `Nếu nhiều máy cùng nhận ghi, chúng phải thỏa thuận về thứ tự cho từng thông điệp, rất tốn kém. Một Leader duy nhất quyết định thứ tự, các Follower chỉ việc sao chép.`,

    whyUse: `Thiết kế này giữ thứ tự mà không tốn chi phí thỏa thuận, và Leader được chia đều giữa các Broker.`,

    mechanism: `- **Ghi.** Luôn đi tới Leader.
- **Đọc.** Mặc định từ Leader, nhưng có thể đọc từ Follower gần nhất để giảm chi phí truyền giữa các vùng.
- **Khi Leader hỏng.** Controller phát hiện qua heartbeat, rồi chọn Leader mới **từ ISR**, nên không mất dữ liệu committed.
- **Thứ tự bầu từ 4.0.** Trước tiên từ ISR, sau đó từ Eligible Leader Replicas, cuối cùng là Leader gần nhất nếu còn hoạt động.
- **Unclean election.** Nếu bật, bản sao ngoài ISR được làm Leader. Tính sẵn sàng tăng nhưng có thể mất dữ liệu. Mặc định tắt.`,

    example: `Cụm 6 Broker, mỗi máy làm Leader cho khoảng 200 Partition. Một máy hỏng, Controller chuyển 200 Leader sang các Follower trong ISR chỉ sau vài giây. Producer nhận lỗi tạm thời rồi tự gửi lại. Khi máy trở lại, nó phải đồng bộ xong mới vào ISR rồi mới nhận lại vai trò Leader.`,

    prosCons: {
      pros: ['Thứ tự rõ ràng, chi phí phối hợp thấp.', 'Bầu Leader nhanh vì đã có sẵn ISR.'],
      cons: ['Mỗi Partition chỉ có một điểm nhận ghi.', 'Leader phân bố lệch làm một Broker quá tải.'],
    },

    whenToUse: {
      use: ['Giữ unclean election tắt cho dữ liệu quan trọng.', 'Đọc từ Follower khi cụm trải trên nhiều vùng.'],
      avoid: ['Không bật unclean election chỉ để tăng tính sẵn sàng mà chưa tính tới mất dữ liệu.'],
    },

    comparison: {
      intro: 'Ba lựa chọn khi cần bầu Leader mới:',
      headers: ['Lựa chọn', 'Mất dữ liệu committed', 'Tính sẵn sàng'],
      rows: [
        ['Bầu từ ISR', 'Không', 'Chờ nếu ISR đều chết'],
        ['Eligible Leader Replicas', 'Không', 'Tốt hơn ISR đơn thuần'],
        ['Unclean election', 'Có thể', 'Cao nhất'],
      ],
    },

    misconceptions: [
      {
        myth: 'Follower chỉ để dự phòng, không bao giờ phục vụ đọc.',
        truth: 'Tài liệu cho biết đọc có thể đi tới Leader hoặc Follower, nhưng ghi thì luôn đi tới Leader.',
      },
      {
        myth: 'Có một Broker là Leader của cả cụm.',
        truth: 'Leader tính theo Partition. Vai trò điều phối cụm thuộc về Controller.',
      },
    ],
  },
})
