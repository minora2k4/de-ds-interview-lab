import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-executor',
  summary:
    'Executor là tiến trình JVM trên máy worker, chạy song song các Task bằng các core được cấp, đồng thời giữ dữ liệu cache và file shuffle.',
  tags: ['Kiến trúc', 'Executor', 'Bộ nhớ'],
  related: ['spark-architecture', 'spark-driver', 'spark-task', 'spark-cache-persist', 'spark-shuffle'],
  sections: {
    definition: `**Executor (Tiến trình thực thi)** là JVM chạy trên máy worker, được cấp riêng cho một ứng dụng. Executor làm hai việc: **chạy [[spark-task|Task]]** và **lưu dữ liệu**, gồm dữ liệu [[spark-cache-persist|cache]] và file [[spark-shuffle|shuffle]].`,

    origin: `Trong MapReduce, mỗi Task thường chạy trong một JVM riêng, khởi động chậm và không chia sẻ được dữ liệu trong bộ nhớ giữa các Task. Spark dùng Executor sống trong suốt ứng dụng, chạy nhiều Task bằng nhiều luồng trong cùng một JVM. Cách này vừa bỏ được chi phí khởi động lại, vừa giữ được cache để các bước sau dùng lại.`,

    whyUse: `Việc chia tài nguyên thành Executor quyết định mức song song và độ ổn định của job. Số core quyết định số Task chạy đồng thời, còn bộ nhớ quyết định lượng dữ liệu xử lý được mà không phải tràn ra đĩa.`,

    mechanism: `Bộ nhớ heap của Executor được chia theo **Unified Memory**:

- **300 MB** dành riêng cho hệ thống.
- **\`spark.memory.fraction\` = 0.6** của phần còn lại dùng cho **Execution** (shuffle, join, sort) và **Storage** (cache). Hai vùng này có thể mượn của nhau.
- **\`spark.memory.storageFraction\` = 0.5** là phần Storage không bị đẩy ra khi Execution cần thêm bộ nhớ.
- Phần 0.4 còn lại dành cho đối tượng người dùng và metadata.

Ngoài heap còn có **memory overhead** cho tiến trình Python, buffer mạng và phần off-heap. Thiếu overhead thường khiến YARN hoặc Kubernetes tự giết container, dù heap vẫn chưa đầy.

Các Task trên cùng Executor chia sẻ bộ nhớ Execution, nên càng nhiều core thì mỗi Task càng ít bộ nhớ.`,

    example: `Một Executor 16 GB với 8 core chạy Task sort liên tục bị tràn đĩa. Mỗi Task chỉ có khoảng 1/8 vùng Execution. Giảm xuống 4 core, đồng thời tăng số Executor, giúp mỗi Task có gấp đôi bộ nhớ mà tổng số Task đồng thời giữ nguyên. Thời gian chạy giảm rõ rệt vì không còn phải đọc ghi đĩa nhiều.`,

    prosCons: {
      pros: [
        'Tái sử dụng JVM nên giảm chi phí khởi động Task.',
        'Giữ được cache trong bộ nhớ để các bước sau dùng lại.',
      ],
      cons: [
        'Executor heap quá lớn dễ gây dừng lâu do GC.',
        'Các Task chia sẻ bộ nhớ nên một Task lớn có thể làm cả Executor gặp lỗi OOM.',
      ],
    },

    whenToUse: {
      use: [
        'Bắt đầu với Executor vừa phải, khoảng 3 đến 5 core, rồi tinh chỉnh theo Spark UI.',
        'Tăng memory overhead khi dùng nhiều UDF Python hoặc container bị giết do vượt giới hạn.',
      ],
      avoid: [
        'Không cấp quá nhiều core cho một Executor khi Task cần nhiều bộ nhớ.',
        'Không tăng bộ nhớ Executor để chữa skew: Task lệch vẫn sẽ thiếu bộ nhớ, cần xử lý [[spark-data-skew]].',
      ],
    },

    comparison: {
      intro: 'So sánh hai hướng cấp tài nguyên với cùng tổng tài nguyên:',
      headers: ['Tiêu chí', 'Ít Executor lớn', 'Nhiều Executor vừa'],
      rows: [
        ['Dừng do GC', 'Dài hơn do heap lớn', 'Ngắn hơn'],
        ['Mất một Executor', 'Mất nhiều Task và cache', 'Ảnh hưởng ít hơn'],
        ['Chi phí overhead', 'Thấp hơn', 'Cao hơn do nhiều JVM'],
        ['Broadcast', 'Ít bản sao hơn', 'Nhiều bản sao hơn'],
      ],
    },

    misconceptions: [
      {
        myth: 'Một Task tương ứng một Executor.',
        truth: 'Một Executor chạy nhiều Task đồng thời, số lượng phụ thuộc vào số core và `spark.task.cpus`.',
      },
      {
        myth: 'Toàn bộ bộ nhớ Executor đều dùng để cache.',
        truth: 'Chỉ một phần của vùng 60% dùng cho Storage, và phần lớn trong đó có thể bị Execution chiếm khi cần.',
      },
    ],
  },
})
