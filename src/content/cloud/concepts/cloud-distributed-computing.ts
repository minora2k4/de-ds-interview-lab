import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-distributed-computing',
  summary:
    'Tính toán phân tán chia một công việc cho nhiều máy chạy song song qua mạng. Nó vượt được giới hạn của một máy, đổi lại phải trả chi phí phối hợp và xử lý lỗi một phần.',
  tags: ['Nền tảng', 'Hệ thống phân tán', 'First Principles'],
  related: ['cloud-scaling', 'cloud-fault-tolerance', 'cloud-cap', 'hadoop-distributed-systems', 'hadoop-mapreduce', 'spark-shuffle'],
  sections: {
    definition: `**Distributed Computing (Tính toán phân tán)** là chia một công việc cho nhiều máy độc lập, chỉ liên lạc qua mạng, chạy đồng thời rồi gộp kết quả. Cách Hadoop áp dụng nằm ở [[hadoop-distributed-systems]].`,

    origin: `Một máy có giới hạn về CPU, bộ nhớ và tốc độ đĩa, còn máy lớn hơn thì đắt rất nhanh. MapReduce (2004) cho thấy có thể dùng hàng nghìn máy thường, miễn phần mềm xử lý được lỗi. Cloud sau đó cho phép thuê hàng trăm máy trong vài phút.`,

    whyUse: `Xử lý được dữ liệu lớn hơn sức chứa của một máy, và rút ngắn thời gian.`,

    mechanism: `1. **Chia dữ liệu** để mỗi máy xử lý một phần độc lập. Phần này tăng tốc tốt nhất.
2. **Trao đổi dữ liệu** khi cần gom theo key, như [[spark-shuffle|shuffle]]. Mạng chậm hơn bộ nhớ nhiều bậc, nên đây thường là phần đắt nhất.
3. **Xử lý lỗi một phần:** một máy hỏng trong khi máy khác vẫn chạy, và không phân biệt được máy chết với máy chậm. Vì vậy cần timeout và [[cloud-fault-tolerance|cơ chế chịu lỗi]].

**Định luật Amdahl:** với \`s\` là phần phải chạy tuần tự, tốc độ tăng tối đa là \`1 / (s + (1 - s) / n)\`. Nếu \`s\` = 5%, 100 máy chỉ nhanh khoảng 17 lần, và không bao giờ vượt 20 lần.`,

    example: `Quét 30 TB log bằng một máy đọc 500 MB/s mất khoảng 17 giờ. Với 100 máy, phần quét còn 10 phút, nhưng cả job vẫn mất 25 phút do shuffle và phối hợp. Tốc độ tăng 40 lần, không phải 100 lần.`,

    prosCons: {
      pros: [
        'Vượt được giới hạn phần cứng của một máy.',
        'Một máy hỏng không làm mất toàn bộ công việc.',
      ],
      cons: [
        'Tốc độ không tăng tỷ lệ thuận, do chi phí mạng và phối hợp.',
        'Khó gỡ lỗi: lỗi một phần, đồng hồ không đồng bộ.',
      ],
    },

    whenToUse: {
      use: ['Dữ liệu hoặc thời gian xử lý vượt khả năng của một máy lớn.'],
      avoid: ['Dữ liệu vừa một máy: một máy tốt có thể nhanh và rẻ hơn một cụm nhỏ.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Song song trên một máy', 'Phân tán nhiều máy'],
      rows: [
        ['Liên lạc', 'Bộ nhớ chung, rất nhanh', 'Qua mạng, chậm và có thể lỗi'],
        ['Kiểu lỗi', 'Thường hỏng toàn bộ', 'Lỗi một phần'],
        ['Giới hạn', 'Phần cứng của máy', 'Chi phí phối hợp'],
      ],
    },

    misconceptions: [
      {
        myth: 'Gấp đôi số máy thì thời gian giảm một nửa.',
        truth: 'Phần tuần tự và chi phí phối hợp giới hạn tốc độ tăng. Qua một ngưỡng, thêm máy còn làm chậm đi.',
      },
    ],
  },
})
