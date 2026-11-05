import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-fault-tolerance',
  summary:
    'Fault Tolerance là khả năng tiếp tục chạy đúng khi một phần hỏng, dựa trên ba việc: dư thừa, phát hiện lỗi và phục hồi. Vì phục hồi thường là chạy lại, thao tác phải an toàn khi bị lặp.',
  tags: ['Chịu lỗi', 'Độ tin cậy', 'First Principles'],
  related: ['cloud-high-availability', 'cloud-replication', 'hadoop-fault-tolerance', 'kafka-replication', 'etl-idempotency', 'arch-reliability'],
  sections: {
    definition: `**Fault Tolerance (Khả năng chịu lỗi)** là khả năng tiếp tục hoạt động đúng khi một thành phần hỏng. Mục tiêu là ngăn lỗi của một thành phần (fault) biến thành lỗi của cả hệ thống (failure).

Đây là nguyên lý chung. Cách áp dụng cụ thể nằm ở [[hadoop-fault-tolerance]] và [[kafka-replication]].`,

    origin: `Cách cũ là mua phần cứng cao cấp để ít hỏng. Nhưng với 1.000 máy, mỗi máy hỏng một lần trong 3 năm, gần như ngày nào cũng có máy hỏng. Vì vậy lỗi phải được xử lý bằng phần mềm.`,

    whyUse: `Không có cơ chế này, mỗi lỗi nhỏ đều buộc job lớn chạy lại từ đầu, và job có thể không bao giờ xong.`,

    mechanism: `Mọi cơ chế đều gồm ba việc:

1. **Dư thừa:** giữ bản sao dữ liệu ([[cloud-replication|Replication]]) hoặc có máy dự phòng. Bản sao phải nằm ở các vùng lỗi khác nhau, như khác rack hoặc AZ.
2. **Phát hiện:** heartbeat và timeout. Đây là phỏng đoán: máy chậm có thể bị xem là đã chết.
3. **Phục hồi:** thử lại, chuyển sang bản sao, hoặc chạy lại từ checkpoint.

**Thử lại cần hai điều kiện.** Thao tác phải [[etl-idempotency|idempotent]], vì lần trước có thể đã thành công mà chỉ mất phản hồi. Thời gian chờ phải tăng dần và có ngẫu nhiên (exponential backoff và jitter), để các client không cùng thử lại một lúc.`,

    example: `Job 6 giờ trên 200 máy Spot, cứ 10 phút ghi checkpoint lên S3. Trong đêm có 15 máy bị thu hồi, nhưng job chỉ chậm thêm 20 phút thay vì chạy lại từ đầu.`,

    prosCons: {
      pros: ['Tự phục hồi, không cần người can thiệp.', 'Dùng được máy rẻ và dễ hỏng, như Spot.'],
      cons: ['Tốn thêm tài nguyên cho dư thừa và checkpoint.', 'Thử lại sai cách có thể gây ghi trùng hoặc làm lỗi lan rộng.'],
    },

    whenToUse: {
      use: ['Job dài, cụm lớn, hoặc dùng máy có thể bị thu hồi bất cứ lúc nào.'],
      avoid: ['Không dư thừa quá mức cho dữ liệu tái tạo được.'],
    },

    comparison: {
      headers: ['Hệ thống', 'Dư thừa', 'Phục hồi'],
      rows: [
        ['Nguyên lý chung', 'Bản sao, dự phòng', 'Thử lại, chuyển đổi, checkpoint'],
        ['[[hadoop-fault-tolerance|Hadoop]]', 'Bản sao block', 'Chạy lại task'],
        ['[[kafka-replication|Kafka]]', 'Bản sao Partition', 'Bầu leader mới'],
        ['[[spark-rdd|Spark]]', 'Không cần bản sao RDD', 'Tính lại theo lineage'],
      ],
    },

    misconceptions: [
      {
        myth: 'Có nhiều bản sao là đủ an toàn.',
        truth: 'Các bản sao cùng rack hoặc cùng một phần mềm lỗi có thể hỏng cùng lúc.',
      },
      {
        myth: 'Thử lại càng nhiều càng tốt.',
        truth: 'Thử lại dồn dập làm dịch vụ đang yếu quá tải thêm.',
      },
    ],
  },
})
