import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-inputsplit',
  summary:
    'InputSplit là phần dữ liệu logic mà một Map task xử lý, còn Block là phần dữ liệu vật lý trên đĩa. Split chỉ mô tả vị trí và độ dài, RecordReader đảm bảo không làm vỡ bản ghi.',
  tags: ['MapReduce', 'InputSplit', 'Hiểu sai phổ biến'],
  related: ['hadoop-mapreduce', 'hadoop-hdfs', 'hadoop-data-locality', 'spark-partition', 'spark-small-files'],
  sections: {
    definition: `**InputSplit (Phần dữ liệu đầu vào của một Map task)** là mô tả **logic** về phần dữ liệu một Map task sẽ xử lý: đường dẫn tệp, vị trí bắt đầu, độ dài, và các máy đang giữ dữ liệu đó. Nó **không chứa dữ liệu**.

Điểm dễ nhầm: **Block là vật lý, InputSplit là logic.** Block là cách HDFS cắt byte để lưu trữ, còn split là cách job chia việc.`,

    origin: `HDFS cắt tệp theo số byte chính xác, không quan tâm nội dung, nên một dòng có thể nằm vắt qua hai block. Nếu mỗi Map task đọc đúng một block thì bản ghi sẽ bị vỡ. MapReduce cần một lớp logic riêng để chia việc mà không phụ thuộc vào cách HDFS cắt byte.`,

    whyUse: `Số split quyết định số Map task, tức mức song song của pha Map. Hiểu split giúp giải thích các hiện tượng như một tệp gzip chỉ có một Map task, hay hàng nghìn tệp nhỏ tạo ra hàng nghìn task.`,

    mechanism: `**Kích thước split:** FileInputFormat tính bằng \`max(minSize, min(maxSize, blockSize))\`, nên mặc định bằng block. Khi phần còn lại không vượt quá 1,1 lần kích thước split, nó được giữ thành một split để tránh tạo split quá nhỏ.

**Bản ghi vắt qua ranh giới:** **RecordReader** biến byte thành bản ghi. Với tệp văn bản, split không phải đầu tệp sẽ bỏ qua dòng dở đầu tiên, và mọi split đọc thêm cho hết dòng cuối, kể cả khi phải đọc sang block kế tiếp qua mạng. Nhờ vậy mỗi dòng được xử lý đúng một lần.

**Khi không chia được:** tệp \`.gz\` phải đọc từ đầu mới giải nén được, nên cả tệp là một split, dù nó nằm trên rất nhiều block.

**Tệp nhỏ:** mỗi tệp tạo ít nhất một split, nên 10.000 tệp 1 MB tạo 10.000 Map task. \`CombineFileInputFormat\` gộp nhiều tệp vào một split để tránh việc này.`,

    example: `Với block 128 MB:

- **Tệp 300 MB:** có 3 block và 3 split, gồm 128, 128 và 44 MB.
- **Tệp 140 MB:** có **2 block nhưng chỉ 1 split**, vì 140 / 128 nhỏ hơn 1,1. Một Map task xử lý cả hai block.
- **Tệp gzip 10 GB:** có 80 block nhưng 1 split, và Map task đó phải đọc hầu hết dữ liệu qua mạng.`,

    prosCons: {
      pros: [
        'Tách việc chia công việc khỏi cách lưu trữ.',
        'Có thể điều chỉnh mức song song mà không phải ghi lại dữ liệu.',
      ],
      cons: [
        'Bản ghi vắt qua block và split lớn làm giảm locality.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng định dạng chia được như Parquet, ORC, hoặc nén bzip2 cho dữ liệu lớn.',
        'Dùng `CombineFileInputFormat` khi buộc phải đọc nhiều tệp nhỏ.',
      ],
      avoid: [
        'Không dùng một tệp gzip rất lớn làm đầu vào cho job.',
        'Không đặt `split.minsize` rất lớn nếu không cần, vì sẽ mất locality.',
      ],
    },

    comparison: {
      intro: 'Khác biệt giữa hai khái niệm thường bị nhầm:',
      headers: ['Tiêu chí', 'Block', 'InputSplit'],
      rows: [
        ['Bản chất', 'Vật lý, là dữ liệu thật', 'Logic, chỉ là mô tả'],
        ['Do ai tạo', 'HDFS khi ghi tệp', 'InputFormat khi chạy job'],
        ['Tôn trọng bản ghi', 'Không, cắt theo byte', 'Có, nhờ RecordReader'],
        ['Quyết định', 'Cách lưu và bản sao', 'Số Map task'],
        ['Tương đương trong Spark', 'Block trên HDFS', '[[spark-partition|Partition]] lúc đọc'],
      ],
    },

    misconceptions: [
      {
        myth: 'InputSplit và Block là một, nên mỗi block luôn có một Map task.',
        truth: 'Chỉ trùng nhau trong trường hợp thường gặp. Tệp 140 MB có 2 block nhưng 1 split, và tệp gzip có nhiều block vẫn chỉ có 1 split.',
      },
      {
        myth: 'InputSplit chứa dữ liệu được gửi tới Map task.',
        truth: 'Split chỉ gồm đường dẫn, vị trí, độ dài và các máy gợi ý. Map task tự đọc dữ liệu thông qua RecordReader.',
      },
    ],
  },
})
