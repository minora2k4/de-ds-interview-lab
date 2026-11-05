import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-performance',
  summary:
    'Tối ưu Spark nên đi từ đo đạc đến giảm dữ liệu, giảm shuffle, xử lý skew, rồi mới đến cấu hình tài nguyên. Phần lớn cải thiện đến từ việc thay đổi logic và cách tổ chức dữ liệu.',
  tags: ['Hiệu năng', 'Spark UI', 'Tối ưu'],
  related: ['spark-shuffle', 'spark-data-skew', 'spark-catalyst', 'spark-partition', 'spark-broadcast-join', 'spark-executor'],
  sections: {
    definition: `**Performance Optimization (Tối ưu hiệu năng)** trong Spark là quá trình tìm ra nút nghẽn thực sự của job, rồi loại bỏ bằng cách phù hợp nhất. Mục tiêu có thể là thời gian chạy, chi phí cụm hoặc sự ổn định.

Đây là **một quy trình**, không phải danh sách cấu hình để sao chép.`,

    origin: `Khi dữ liệu nhỏ, cách viết nào cũng chạy được. Ở quy mô lớn, cùng một logic có thể chạy trong 20 phút hoặc 20 giờ, tùy cách làm. Catalyst và AQE tự động xử lý được nhiều việc, nhưng không biết logic nghiệp vụ của bạn, không biết dữ liệu sẽ tăng như thế nào, và không thể thay đổi cách lưu trữ. Những phần đó cần người hiểu hệ thống.`,

    whyUse: `Tối ưu trực tiếp giảm chi phí và rủi ro. Một job chạy ngắn hơn sẽ tốn ít tiền hơn, có nhiều thời gian dự phòng hơn trước hạn báo cáo, và ít gặp lỗi hơn. Quan trọng hơn, tối ưu theo quy trình giúp tránh sai lầm phổ biến là **thêm tài nguyên cho một vấn đề mà tài nguyên không giải quyết được**, như skew hay chọn sai chiến lược Join.`,

    mechanism: `Trình tự tôi khuyên dùng, từ tác động lớn đến nhỏ:

**1. Đo trước.** Mở Spark UI, tìm Stage tốn thời gian nhất. Đọc \`explain\` và kế hoạch cuối của AQE. Không đổi gì khi chưa biết nút nghẽn ở đâu.

**2. Giảm dữ liệu.** Dùng định dạng cột như Parquet. Lọc theo cột phân vùng. Chọn đúng cột cần dùng. Kiểm tra \`PushedFilters\` có đúng không. Đây thường là việc có tác động lớn nhất.

**3. Giảm shuffle.** Dùng [[spark-broadcast-join]] khi một bảng nhỏ. Bỏ \`distinct\`, \`orderBy\` không cần. Dùng bucketing với bảng hay được join.

**4. Xử lý skew.** Xem phân vị Task. Xử lý theo trang [[spark-data-skew]].

**5. Chỉnh Partition.** Khoảng 100 đến 200 MB mỗi Partition. Để AQE gộp nếu có thể.

**6. Viết logic hiệu quả.** Dùng hàm tích hợp thay cho UDF. Không \`collect\` dữ liệu lớn. Chỉ cache khi dùng lại, và luôn unpersist.

**7. Chỉnh tài nguyên.** Cuối cùng mới chỉnh Executor, core và bộ nhớ, dựa trên GC time và spill.

**8. Giữ kết quả.** Kiểm tra đầu ra vẫn đúng, ghi lại số liệu trước và sau, và theo dõi khi dữ liệu tăng.`,

    diagram: {
      mermaid: `flowchart TD
  A["Job chậm: tìm Stage tốn thời gian nhất"] --> B{"Phân phối Task thế nào?"}
  B -->|"Vài Task chậm hơn hẳn"| C{"Dữ liệu của Task đó có nhiều hơn không?"}
  C -->|"Có"| D["Data Skew: AQE, Broadcast, Salting"]
  C -->|"Không"| E["Máy chậm: Speculative Execution"]
  B -->|"Mọi Task đều chậm"| F{"Spill hoặc GC cao không?"}
  F -->|"Có"| G["Tăng Partition, giảm core mỗi Executor"]
  F -->|"Không"| H["Giảm dữ liệu, giảm shuffle, xem UDF"]`,
      caption: 'Sơ đồ chẩn đoán nhanh dựa trên phân phối Task và các chỉ số trên Spark UI.',
    },

    example: `Job báo cáo chạy 6 giờ với 100 Executor. Đội ngũ định xin thêm máy, nhưng trước đó đọc Spark UI và phát hiện:

- Đọc toàn bộ 300 cột, trong khi chỉ cần 10 cột, vì một UDF chặn Column Pruning.
- Một bảng 40 MB bị Sort Merge Join do vượt ngưỡng 10 MB.
- Một Task chạy 2 giờ do key null.

Sau khi thay UDF bằng hàm tích hợp, thêm gợi ý Broadcast và lọc null, job còn 35 phút với 40 Executor. Chi phí cụm giảm khoảng 95%, mà không cần thêm máy nào. Trường hợp này cho thấy vì sao nên đo đạc trước khi thay đổi.`,

    prosCons: {
      pros: [
        '**Giảm trực tiếp chi phí** và thời gian chạy.',
        '**Tăng độ ổn định,** giảm lỗi OOM và trễ hạn.',
        '**Tận dụng tốt tài nguyên hiện có** trước khi phải mua thêm.',
      ],
      cons: [
        '**Tốn thời gian của kỹ sư,** nên không phải job nào cũng đáng làm.',
        '**Tinh chỉnh quá mức** có thể khiến job kém bền khi dữ liệu thay đổi.',
        '**Gợi ý cố định** trong code có thể gây hại về sau.',
      ],
    },

    whenToUse: {
      use: [
        'Ưu tiên các job tốn nhiều chi phí nhất hoặc có hạn chót sát nhất.',
        'Khi thấy thời gian chạy tăng nhanh hơn lượng dữ liệu tăng.',
      ],
      avoid: [
        'Không tinh chỉnh một job chạy ít, rẻ và đang đủ tốt.',
        'Không sao chép cấu hình từ blog mà không đo trên job của mình.',
        'Không thay đổi nhiều thứ cùng lúc: sẽ không biết thay đổi nào có tác dụng.',
      ],
    },

    comparison: {
      intro: 'Các vùng trên Spark UI cho biết điều gì:',
      headers: ['Chỉ số', 'Dấu hiệu', 'Thường là do'],
      rows: [
        ['Input Size', 'Lớn hơn dự kiến', 'Không có pushdown hoặc lọc phân vùng'],
        ['Shuffle Read/Write', 'Rất lớn', 'Join hoặc group trên dữ liệu chưa lọc'],
        ['Max so với Median', 'Chênh lệch nhiều lần', 'Data Skew'],
        ['Spill (Disk)', 'Cao', 'Partition quá lớn so với bộ nhớ Task'],
        ['GC Time', 'Trên 10% đến 20%', 'Quá nhiều đối tượng, bộ nhớ chịu áp lực'],
        ['Scheduler Delay', 'Cao', 'Quá nhiều Task nhỏ hoặc Driver quá tải'],
      ],
    },

    misconceptions: [
      {
        myth: 'Tối ưu Spark chủ yếu là chỉnh các tham số cấu hình.',
        truth: 'Phần lớn cải thiện đến từ giảm dữ liệu, giảm shuffle và xử lý skew. Cấu hình thường chỉ là bước cuối.',
      },
      {
        myth: 'Job chậm thì cần thêm máy.',
        truth: 'Với skew, Driver nghẽn, hoặc đọc thừa dữ liệu, thêm máy gần như không có tác dụng, chỉ tăng chi phí.',
      },
      {
        myth: 'Cache là cách tăng tốc phổ biến nhất.',
        truth: 'Cache chỉ có lợi khi dữ liệu được dùng lại. Dùng sai cách còn gây thêm áp lực bộ nhớ và làm mất Predicate Pushdown.',
      },
    ],
  },
})
