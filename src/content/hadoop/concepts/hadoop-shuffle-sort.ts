import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-shuffle-sort',
  summary:
    'Shuffle and Sort là pha chuyển đầu ra Map tới Reducer và sắp xếp theo key, để mỗi Reducer nhận được mọi giá trị của một key liền nhau. Đây thường là phần tốn kém nhất của job MapReduce.',
  tags: ['MapReduce', 'Shuffle', 'Hiệu năng'],
  related: ['hadoop-mapreduce', 'hadoop-nodemanager', 'spark-shuffle', 'spark-data-skew', 'hadoop-inputsplit'],
  sections: {
    definition: `**Shuffle and Sort (Xáo trộn và sắp xếp)** là pha nằm giữa Map và Reduce trong [[hadoop-mapreduce|MapReduce]]. **Shuffle** chuyển đầu ra Map tới đúng Reducer, còn **Sort** sắp xếp theo key. Tài liệu Hadoop nói rõ hai việc này diễn ra đồng thời: dữ liệu vừa được lấy về vừa được gộp.`,

    origin: `Muốn tổng hợp theo key thì mọi giá trị của một key phải về một nơi. Sắp xếp là cách đơn giản để làm việc đó khi dữ liệu lớn hơn bộ nhớ: khi đã sắp xếp, các giá trị cùng key nằm liền nhau, và có thể gộp nhiều tệp đã sắp xếp mà không cần nạp hết vào RAM.`,

    whyUse: `Hầu hết việc tinh chỉnh job MapReduce đều nhắm vào pha này, vì nó tốn CPU, đĩa, mạng và bộ nhớ cùng lúc. Nó cũng giúp hiểu [[spark-shuffle|shuffle của Spark]], vốn thừa hưởng ý tưởng này nhưng bỏ bắt buộc sắp xếp.`,

    mechanism: `**Phía Map:**

1. Đầu ra đi vào bộ đệm, mặc định **100 MB** (\`mapreduce.task.io.sort.mb\`).
2. Khi đầy **80%**, một luồng nền chia theo Partition, sắp xếp theo key, chạy Combiner nếu có, rồi **spill (tràn)** xuống đĩa cục bộ.
3. Khi Map xong, các tệp spill được gộp thành một tệp đã sắp xếp theo Partition. Mỗi lần gộp tối đa **10** luồng.

**Phía Reduce:**

1. Reducer được xếp lịch khi **5%** số Map đã xong (\`slowstart\`), rồi dùng **5** luồng lấy dữ liệu song song qua HTTP. Phía phục vụ là dịch vụ phụ trợ trên [[hadoop-nodemanager|NodeManager]], không phải Map task.
2. Dữ liệu vào bộ nhớ, tối đa 70% heap của Reducer. Khi dùng tới 66% vùng này thì gộp xuống đĩa.
3. Gộp lần cuối thành một luồng theo thứ tự key, rồi gọi hàm Reduce cho từng key.

**Thứ tự chỉ đúng trong từng Reducer.** Muốn có thứ tự toàn cục phải dùng \`TotalOrderPartitioner\`. Vì cùng key về cùng Reducer, [[spark-data-skew|lệch dữ liệu]] cũng xảy ra ở đây.`,

    diagram: {
      mermaid: `flowchart TD
  A["Map ghi vào bộ đệm 100 MB"] --> B["Đầy 80%: chia Partition, sắp xếp, spill"]
  B --> C["Gộp thành một tệp trên đĩa cục bộ"]
  C --> D["Reducer lấy dữ liệu qua HTTP"]
  D --> E["Gộp nhiều lần theo thứ tự key"]
  E --> F["Gọi Reduce cho từng key"]`,
      caption:
        'Sắp xếp diễn ra ở cả hai phía: Map sắp xếp phần của mình, còn Reducer chỉ cần gộp các luồng đã sắp xếp sẵn.',
    },

    example: `Một Map task phát ra 400 MB. Với bộ đệm 100 MB và ngưỡng 80%, nó spill 5 lần, rồi còn phải gộp 5 tệp. Tăng \`mapreduce.task.io.sort.mb\` lên 512 MB cùng với heap của Map, thì chỉ còn một lần ghi, và số byte đọc ghi đĩa giảm rõ rệt. Bộ đếm \`Spilled Records\` lớn hơn nhiều so với \`Map output records\` là dấu hiệu nên điều chỉnh.`,

    prosCons: {
      pros: [
        'Xử lý được dữ liệu lớn hơn bộ nhớ nhờ gộp ngoài trên đĩa.',
        'Reducer nhận sẵn giá trị đã nhóm theo key, không cần tự sắp xếp.',
      ],
      cons: [
        'Luôn sắp xếp, kể cả khi phép tính không cần đến thứ tự.',
        'Đọc ghi đĩa nhiều lần cùng truyền mạng làm job chậm.',
      ],
    },

    whenToUse: {
      use: [
        'Dùng Combiner khi có thể, để giảm dữ liệu trước khi truyền đi.',
      ],
      avoid: [
        'Không tăng bộ đệm sắp xếp mà quên tăng heap, vì sẽ gây thiếu bộ nhớ.',
        'Với job không cần tổng hợp, không nên dùng Reducer. Đặt số Reducer bằng 0 để bỏ hẳn pha này.',
      ],
    },

    comparison: {
      intro: 'Shuffle của MapReduce so với Spark:',
      headers: ['Tiêu chí', 'MapReduce', 'Spark'],
      rows: [
        ['Sắp xếp theo key', 'Luôn có', 'Chỉ khi phép tính cần'],
        ['Tổng hợp sơ bộ', 'Combiner, phải khai báo', 'Tự động với DataFrame'],
        ['Số Partition', 'Theo số Reducer, mặc định 1', '`spark.sql.shuffle.partitions`, mặc định 200'],
        ['Điều chỉnh khi chạy', 'Không có', 'AQE'],
      ],
    },

    misconceptions: [
      {
        myth: 'Kết quả của nhiều Reducer ghép lại sẽ có thứ tự toàn cục.',
        truth: 'Thứ tự chỉ đảm bảo trong một Reducer. HashPartitioner chia key theo băm, nên các tệp kết quả không nối tiếp nhau.',
      },
      {
        myth: 'Sắp xếp chỉ xảy ra ở phía Reducer.',
        truth: 'Map đã sắp xếp đầu ra của mình. Reducer chủ yếu gộp các luồng đã sắp xếp, nên chi phí nằm ở cả hai phía.',
      },
    ],
  },
})
