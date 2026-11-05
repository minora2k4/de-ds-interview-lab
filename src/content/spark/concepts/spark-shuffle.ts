import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-shuffle',
  summary:
    'Shuffle là quá trình phân phối lại dữ liệu giữa các Executor để các dòng cùng key về một nơi. Đây thường là phần tốn kém nhất của một job Spark.',
  tags: ['Shuffle', 'Hiệu năng', 'First Principles'],
  related: ['spark-wide-transformation', 'spark-stage', 'spark-partition', 'spark-data-skew', 'spark-broadcast-join', 'hadoop-shuffle-sort'],
  sections: {
    definition: `**Shuffle** là quá trình phân phối lại dữ liệu giữa các [[spark-partition|Partition]], thường là giữa các máy, để **các dòng có cùng key nằm cùng một chỗ**. Nó xuất hiện ở các [[spark-wide-transformation]] như \`groupBy\`, \`join\`, \`orderBy\`, \`distinct\`, \`repartition\`.

Có thể hình dung như chia lại bài: mỗi người đang giữ một chồng lộn xộn, và phải chuyển cho nhau để mỗi người giữ đúng các lá cùng chất.`,

    origin: `Shuffle không phải là phát minh của Spark, mà là hệ quả tất yếu khi xử lý dữ liệu phân tán: muốn tính tổng theo khách hàng thì mọi dòng của khách đó phải về cùng một nơi. MapReduce gọi đây là pha [[hadoop-shuffle-sort]].

Spark cải tiến phần này để bớt tốn kém: dùng file shuffle được sắp xếp theo Partition thay vì mỗi cặp một tệp, có thể tổng hợp sơ bộ trước khi gửi đi, và AQE có thể điều chỉnh Partition sau khi biết kích thước thật.`,

    whyUse: `Không ai muốn shuffle, nhưng phải hiểu nó, vì **shuffle thường là thứ quyết định thời gian chạy và chi phí của job**. Nó tốn đồng thời bốn nguồn lực: CPU để tuần tự hóa và nén, đĩa để ghi file, mạng để truyền, và bộ nhớ để sắp xếp hoặc xây bảng băm.

Shuffle còn tạo ra ranh giới [[spark-stage]], là nơi [[spark-data-skew]] xuất hiện. Phần lớn công việc tối ưu Spark quy về một câu hỏi: **có thể shuffle ít đi không**.`,

    mechanism: `Shuffle gồm hai phía, thuộc hai Stage khác nhau:

**Phía ghi (Shuffle Write), cuối Stage trước:**

1. Mỗi Task tính Partition đích của từng dòng, mặc định bằng băm key.
2. Có thể tổng hợp sơ bộ nếu là phép tổng hợp.
3. Dữ liệu được sắp xếp theo Partition đích, nén và ghi xuống **đĩa cục bộ** thành một tệp dữ liệu và một tệp chỉ mục cho mỗi Task.

**Phía đọc (Shuffle Read), đầu Stage sau:**

1. Mỗi Task hỏi vị trí các khối dữ liệu của mình.
2. Lấy các khối từ nhiều Executor qua mạng.
3. Gộp lại để nhóm, sắp xếp hoặc Join. Nếu thiếu bộ nhớ, dữ liệu tràn xuống đĩa (**Spill**).

Vì file shuffle nằm trên đĩa, Stage sau có thể đọc lại khi Task lỗi. Nếu mất Executor mà chưa có External Shuffle Service, Task sẽ gặp \`FetchFailedException\` và Stage trước phải chạy lại phần liên quan.

Số Partition sau shuffle theo mặc định là \`spark.sql.shuffle.partitions\` = 200. AQE có thể gộp các Partition nhỏ lại dựa trên kích thước thật. Mốc tham khảo là 64 MB, nhưng mặc định \`parallelismFirst\` đang bật nên Spark ưu tiên giữ mức song song hơn là đạt đúng mốc này.`,

    diagram: {
      mermaid: `flowchart TD
  subgraph W["Stage trước: Shuffle Write"]
    A["Task 1"] --> F1["File shuffle trên đĩa"]
    B["Task 2"] --> F2["File shuffle trên đĩa"]
  end
  subgraph R["Stage sau: Shuffle Read"]
    C["Task A: key 1, 2"]
    D["Task B: key 3, 4"]
  end
  F1 -->|"qua mạng"| C
  F1 -->|"qua mạng"| D
  F2 -->|"qua mạng"| C
  F2 -->|"qua mạng"| D`,
      caption:
        'Mỗi Task phía ghi chia dữ liệu theo Partition đích. Mỗi Task phía đọc lấy phần của mình từ tất cả Task phía ghi.',
    },

    example: `Job tính doanh thu theo khách hàng trên 2 TB chạy 4 giờ. Spark UI cho thấy một Stage có \`Shuffle Read\` là 800 GB và \`Spill (Disk)\` là 1,2 TB.

Kỹ sư làm ba việc theo thứ tự. Một, lọc bỏ đơn đã hủy trước \`groupBy\`, giảm shuffle còn 300 GB. Hai, phát hiện bảng \`country\` được join mỗi dòng với kích thước chỉ 2 MB, chuyển sang Broadcast để bỏ thêm một lần shuffle. Ba, tăng số Partition sau shuffle để mỗi Task xử lý dữ liệu vừa bộ nhớ, hết spill. Thời gian còn 40 phút, không cần thêm máy.`,

    prosCons: {
      pros: [
        '**Giúp thực hiện được** các phép nhóm, nối và sắp xếp toàn cục trên dữ liệu phân tán.',
        '**File trên đĩa** giúp không phải tính lại toàn bộ khi Stage sau gặp lỗi.',
        '**Có thể cân bằng lại** dữ liệu đang phân bố không đều.',
      ],
      cons: [
        '**Tốn kém:** CPU, đĩa, mạng và bộ nhớ cùng lúc.',
        '**Dễ lệch dữ liệu** nếu có key xuất hiện quá nhiều.',
        '**Phụ thuộc đĩa cục bộ:** mất Executor có thể làm phải chạy lại Stage trước.',
        '**Số Partition cố định** dễ không phù hợp với dữ liệu thật nếu không có AQE.',
      ],
    },

    whenToUse: {
      use: [
        'Khi logic nghiệp vụ thật sự cần nhóm hoặc nối mà dữ liệu chưa nằm đúng chỗ.',
        'Khi cần phân bố lại dữ liệu, ví dụ `repartition` trước khi ghi để tránh tệp lệch kích thước.',
      ],
      avoid: [
        'Bảng nhỏ khi join: dùng [[spark-broadcast-join]] thay vì shuffle cả hai bên.',
        'Không dùng `distinct` hoặc `orderBy` khi kết quả không cần.',
        'Không `repartition` thừa khi `coalesce` đã đủ.',
      ],
    },

    comparison: {
      intro: 'Các cách giảm chi phí shuffle, xếp theo thứ tự nên thử:',
      headers: ['Cách làm', 'Vì sao hiệu quả', 'Điều kiện hoặc lưu ý'],
      rows: [
        ['Lọc và chọn cột trước', 'Giảm dữ liệu đi vào shuffle', 'Hầu như luôn áp dụng được'],
        ['Broadcast Join', 'Bỏ hẳn shuffle của Join', 'Một bên đủ nhỏ'],
        ['Tổng hợp sơ bộ', 'Giảm số dòng trước khi gửi', 'DataFrame tự làm, RDD nên dùng `reduceByKey`'],
        ['Bucketing', 'Dữ liệu đã nằm đúng chỗ', 'Tốn công thiết lập, hợp với bảng join thường xuyên'],
        ['Bật AQE', 'Gộp Partition và xử lý skew', 'Mặc định bật từ Spark 3.2'],
      ],
    },

    misconceptions: [
      {
        myth: 'File shuffle được lưu trên HDFS hoặc S3.',
        truth: 'Mặc định chúng nằm trên đĩa cục bộ của Executor và bị xóa khi không còn cần. Vì vậy mất Executor có thể làm mất dữ liệu shuffle.',
      },
      {
        myth: 'Tăng `spark.sql.shuffle.partitions` sẽ giảm lượng dữ liệu shuffle.',
        truth: 'Tổng dữ liệu truyền đi vẫn vậy, chỉ được chia nhỏ hơn. Cách này giúp giảm spill và áp lực bộ nhớ mỗi Task, không giảm dữ liệu.',
      },
      {
        myth: 'Spark luôn cần sắp xếp mỗi khi shuffle.',
        truth: 'File được sắp theo Partition đích, nhưng dữ liệu không nhất thiết được sắp theo key. Phép tổng hợp dùng bảng băm thường không cần sắp theo key.',
      },
    ],
  },
})
