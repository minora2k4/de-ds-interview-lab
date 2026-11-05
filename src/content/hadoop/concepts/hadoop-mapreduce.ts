import { defineConcept } from '../../define'

export default defineConcept({
  id: 'hadoop-mapreduce',
  summary:
    'MapReduce là mô hình xử lý theo lô gồm hai hàm do người dùng viết: Map biến đổi từng bản ghi, Reduce tổng hợp theo key. Framework lo phần chia việc, shuffle và chạy lại khi lỗi, đổi lại là chậm với công việc nhiều bước.',
  tags: ['MapReduce', 'Xử lý theo lô', 'First Principles'],
  related: [
    'hadoop-inputsplit',
    'hadoop-shuffle-sort',
    'hadoop-yarn',
    'hadoop-fault-tolerance',
    'spark-overview',
    'spark-shuffle',
    'spark-lazy-evaluation',
  ],
  sections: {
    definition: `**MapReduce (Mô hình xử lý Map và Reduce)** vừa là mô hình lập trình, vừa là mô-đun xử lý theo lô của Hadoop, chạy trên [[hadoop-yarn|YARN]]. Người dùng chỉ viết hai hàm:

- **Map:** nhận từng bản ghi, phát ra các cặp key-value.
- **Reduce:** nhận một key cùng mọi giá trị của key đó, rồi tổng hợp.

Framework lo phần còn lại: chia dữ liệu, chạy song song, gom theo key qua [[hadoop-shuffle-sort|Shuffle and Sort]], và chạy lại khi có lỗi.`,

    origin: `Trước MapReduce, muốn xử lý dữ liệu trên hàng nghìn máy, lập trình viên phải tự chia việc, tự truyền dữ liệu, tự theo dõi máy hỏng. Mỗi bài toán lại viết lại phần phức tạp này. Thư viện như MPI có sẵn, nhưng không được thiết kế để chịu lỗi thường xuyên ở quy mô đó.

Năm 2004, Google công bố bài báo về MapReduce, chỉ ra rằng rất nhiều bài toán có thể quy về hai bước Map và Reduce, và khi đã quy được thì framework có thể tự xử lý phần phân tán. Hadoop hiện thực lại ý tưởng này dưới dạng mã nguồn mở.`,

    whyUse: `Giá trị lớn nhất của MapReduce là **giấu đi phần khó của hệ thống phân tán**. Người viết job không cần nghĩ tới máy hỏng hay truyền dữ liệu.

Hiện nay job mới hiếm khi chọn MapReduce, nhưng nó vẫn đáng học vì:

- Nhiều hệ thống cũ và công cụ vẫn dùng nó, ví dụ DistCp.
- Hiểu nó giúp hiểu vì sao [[spark-overview|Spark]] được thiết kế như hiện nay, và vì sao [[spark-shuffle|shuffle]] tốn kém đến vậy.`,

    mechanism: `**Một job chạy qua các bước:**

1. **Chia dữ liệu:** InputFormat cắt đầu vào thành các [[hadoop-inputsplit|InputSplit]]. Mỗi split tương ứng một Map task, và MRAppMaster ưu tiên chạy task gần dữ liệu.
2. **Map:** hàm Map chạy trên từng bản ghi. Đầu ra được đưa vào bộ đệm trong bộ nhớ.
3. **Chia và sắp xếp:** Partitioner, mặc định là HashPartitioner, quyết định mỗi key đi về Reducer nào. Dữ liệu được sắp xếp theo key rồi ghi xuống **đĩa cục bộ**, không phải HDFS.
4. **Combiner, tùy chọn:** tổng hợp sơ bộ để giảm dữ liệu truyền đi.
5. **Shuffle:** mỗi Reducer lấy phần của mình từ mọi Map task qua HTTP, rồi gộp lại theo thứ tự key.
6. **Reduce:** hàm Reduce chạy cho từng key, kết quả ghi ra **HDFS** với đầy đủ bản sao, thành một tệp cho mỗi Reducer.

**Vì sao đầu ra Map nằm trên đĩa cục bộ:** đây là dữ liệu tạm, xong job là bỏ. Ghi lên HDFS với 3 bản sao sẽ rất tốn. Cái giá là nếu mất máy trước khi Reducer lấy xong, Map task đó phải chạy lại, kể cả khi nó đã hoàn thành.

**Số Reducer không tự động:** \`mapreduce.job.reduces\` mặc định là **1**. Không đặt lại thì mọi dữ liệu đổ về một Reducer. Có thể đặt bằng 0 cho job chỉ có Map, khi đó không cần shuffle.

**Combiner chỉ đúng khi** phép tính có tính kết hợp và giao hoán, như tổng hoặc max, vì nó có thể chạy không lần, một lần hoặc nhiều lần. Trung bình không dùng được trực tiếp, mà phải truyền cả tổng và số lượng.

**Vì sao chậm với công việc nhiều bước:** mỗi job chỉ có một lần Map và một lần Reduce. Pipeline nhiều bước phải nối nhiều job, mỗi job lại ghi kết quả ra HDFS rồi job sau đọc lại. Mỗi task thường chạy trong một JVM riêng nên khởi động cũng chậm. Spark khắc phục bằng [[spark-dag|DAG]] và giữ dữ liệu trong bộ nhớ khi có thể.`,

    diagram: {
      mermaid: `flowchart TD
  I["Tệp trên HDFS"] --> S["InputSplit"]
  S --> M["Map task: phát ra key-value"]
  M --> L["Sắp xếp, ghi đĩa cục bộ"]
  L --> F["Shuffle: Reducer lấy qua HTTP"]
  F --> R["Reduce task: tổng hợp theo key"]
  R --> O["Kết quả trên HDFS, có bản sao"]`,
      caption:
        'Đầu vào và đầu ra nằm trên HDFS, còn dữ liệu trung gian nằm trên đĩa cục bộ. Đây là lý do mất máy có thể làm Map task đã xong phải chạy lại.',
    },

    example: `Một trang tin cần đếm lượt xem theo bài báo từ 10 TB nhật ký truy cập. Với block 128 MB, job có khoảng 82.000 Map task. Map đọc từng dòng, phát ra cặp \`(id_bài, 1)\`.

Nếu không có Combiner, số cặp gửi qua mạng bằng đúng số lượt xem. Với Combiner cộng dồn trong từng Map, lượng dữ liệu shuffle giảm từ 800 GB xuống còn 40 GB, vì một bài báo được xem nhiều lần trong cùng một split.

Nhóm đặt 200 Reducer, mỗi Reducer nhận khoảng 200 MB. Kết quả là 200 tệp \`part-r-*\` trên HDFS. Nếu quên đặt, job chỉ có 1 Reducer, nhận cả 40 GB, và chạy chậm hơn rất nhiều.`,

    prosCons: {
      pros: [
        '**Chịu lỗi rất tốt:** task lỗi được chạy lại, nên job dài hàng giờ vẫn hoàn thành.',
        '**Dữ liệu lớn hơn bộ nhớ không phải vấn đề,** vì mọi thứ đều dựa trên đĩa.',
        '**Mô hình đơn giản, dễ hiểu,** tự mở rộng khi thêm máy.',
      ],
      cons: [
        '**Chậm với công việc lặp hoặc nhiều bước,** vì phải ghi ra HDFS giữa các job.',
        '**Độ trễ cao,** không phù hợp truy vấn tương tác hay xử lý luồng.',
        '**Viết dài dòng:** Join hay các phép tính phức tạp cần rất nhiều code.',
      ],
    },

    whenToUse: {
      use: [
        'Đang duy trì các job cũ chạy ổn định, chưa có lý do đủ lớn để viết lại.',
        'Job một lần duyệt rất lớn, trên cụm có ít bộ nhớ.',
        'Dùng các công cụ dựa trên MapReduce như DistCp để sao chép dữ liệu giữa các cụm.',
      ],
      avoid: [
        'Job mới, khi Spark có sẵn và dễ viết, dễ tối ưu hơn nhiều.',
        'Thuật toán lặp, phân tích tương tác hoặc xử lý luồng.',
      ],
    },

    comparison: {
      intro: 'So sánh với Spark, engine đã thay thế MapReduce trong phần lớn các job mới:',
      headers: ['Tiêu chí', 'MapReduce', 'Spark'],
      rows: [
        ['Mô hình', 'Đúng hai bước, nối nhiều job', 'DAG nhiều Stage'],
        ['Dữ liệu trung gian giữa các bước', 'Ghi ra HDFS', 'Đi qua shuffle, có thể cache'],
        ['Thực thi task', 'Thường một JVM cho mỗi task', 'Nhiều luồng trong Executor sống lâu'],
        ['Tối ưu', 'Không có tối ưu toàn cục', 'Catalyst, AQE'],
        ['Sắp xếp khi shuffle', 'Luôn sắp xếp theo key', 'Chỉ khi phép tính cần'],
        ['Chịu lỗi', 'Chạy lại task từ dữ liệu đã ghi', 'Tính lại từ lineage và file shuffle'],
        ['API', 'Map và Reduce mức thấp', 'SQL, DataFrame'],
      ],
    },

    misconceptions: [
      {
        myth: 'Đầu ra của Map được ghi lên HDFS với 3 bản sao.',
        truth: 'Đầu ra Map là dữ liệu tạm nằm trên đĩa cục bộ. Chỉ đầu ra của Reduce, hoặc của Map nếu job không có Reduce, mới ghi lên HDFS.',
      },
      {
        myth: 'MapReduce tự chọn số Reducer theo kích thước dữ liệu.',
        truth: 'Số Map phụ thuộc vào số split, nhưng số Reducer do người dùng đặt, và mặc định là 1.',
      },
      {
        myth: 'Có thể bật Combiner cho mọi job để tăng tốc.',
        truth: 'Combiner có thể chạy nhiều lần hoặc không chạy, nên chỉ đúng với phép tính có tính kết hợp và giao hoán. Dùng sai sẽ cho kết quả sai mà không báo lỗi.',
      },
    ],
  },
})
