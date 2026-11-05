import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-high-availability',
  summary:
    'High Availability là giữ dịch vụ phục vụ được trong tỷ lệ thời gian rất cao, thường đo bằng số chín. Cách làm là loại bỏ điểm lỗi duy nhất và tự động chuyển đổi khi có sự cố.',
  tags: ['Độ tin cậy', 'System Design', 'SLA'],
  related: ['cloud-fault-tolerance', 'cloud-replication', 'cloud-load-balancing', 'cloud-cap', 'hadoop-namenode', 'arch-reliability'],
  sections: {
    definition: `**High Availability (HA, Tính sẵn sàng cao)** là khả năng dịch vụ trả lời được trong một tỷ lệ thời gian rất cao, tính bằng \`thời gian hoạt động / tổng thời gian\`. Mức 99,9% cho phép dừng khoảng 8,76 giờ mỗi năm, 99,99% chỉ khoảng 52,6 phút.`,

    origin: `Một máy chủ đơn dừng lại khi hỏng hoặc bảo trì, và phải chờ người sửa. HA thay người bằng tự động hóa: có sẵn máy thay thế, phát hiện lỗi và chuyển đổi trong vài giây hoặc vài phút.`,

    whyUse: `Mỗi số chín thêm có thể tốn gấp nhiều lần, nên cần hỏi nghiệp vụ thật sự mất gì khi dừng.`,

    mechanism: `**Loại bỏ điểm lỗi duy nhất:** nhiều máy ở nhiều AZ, phía trước là [[cloud-load-balancing|Load Balancer]].

**Hai kiểu:** Active-Active cho mọi nơi cùng phục vụ. Active-Passive để máy dự phòng chờ sẵn.

**Tính toán:**

- **Nối tiếp:** nhân lại. Ba dịch vụ 99,9% cho khoảng 99,7%.
- **Song song:** \`1 - (1 - a)^n\`. Hai bản 99,9% cho 99,9999%, nhưng chỉ khi chúng hỏng độc lập, điều hiếm khi đúng hoàn toàn.

**RTO** là thời gian phục hồi tối đa. **RPO** là lượng dữ liệu được phép mất. [[cloud-replication|Sao chép]] bất đồng bộ làm RPO lớn hơn 0.

**Split-brain:** hai bên cùng tưởng mình là chính. Quorum ngăn điều này, vì chỉ bên có đa số được tiếp tục.`,

    example: `Pipeline gồm Kafka, Spark và kho dữ liệu, mỗi nơi 99,9%, nên tổng khoảng 99,7%, tức dừng 26 giờ mỗi năm. Spark chạy lại được, nên nhóm chỉ đầu tư thêm cho Kafka, nơi mất dữ liệu là mất luôn.`,

    prosCons: {
      pros: ['Giảm thời gian dừng và phục hồi không cần người.', 'Bảo trì không phải dừng dịch vụ.'],
      cons: ['Tốn thêm tài nguyên và tăng độ phức tạp.', 'Chuyển đổi tự động cũng là một nguồn lỗi.'],
    },

    whenToUse: {
      use: ['Dịch vụ phục vụ trực tiếp, hoặc nơi mất dữ liệu là mất luôn.'],
      avoid: ['Không theo đuổi 99,99% cho job theo lô chạy lại được.'],
    },

    comparison: {
      headers: ['Khái niệm', 'Câu hỏi trả lời', 'Thước đo'],
      rows: [
        ['High Availability', 'Dịch vụ có đang trả lời không?', 'Số chín'],
        ['[[cloud-fault-tolerance|Fault Tolerance]]', 'Lỗi có bị người dùng nhận ra không?', 'Số lỗi chịu được'],
        ['Disaster Recovery', 'Mất cả vùng thì sao?', 'RTO, RPO'],
      ],
    },

    misconceptions: [
      {
        myth: 'Thêm máy dự phòng là có 99,99%.',
        truth: 'Mọi thành phần nối tiếp đều kéo tỷ lệ tổng xuống, kể cả DNS và lỗi cấu hình dùng chung.',
      },
      {
        myth: 'Sẵn sàng cao nghĩa là không mất dữ liệu.',
        truth: 'Dịch vụ có thể chạy tiếp sau khi chuyển đổi nhưng vẫn mất các ghi chưa kịp sao chép.',
      },
    ],
  },
})
