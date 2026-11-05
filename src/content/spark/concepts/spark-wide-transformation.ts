import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-wide-transformation',
  summary:
    'Trong Wide Transformation, một Partition cha đóng góp vào nhiều Partition con, nên dữ liệu phải qua shuffle và Spark cắt một Stage mới tại đây.',
  tags: ['Mô hình thực thi', 'Shuffle'],
  related: ['spark-narrow-transformation', 'spark-shuffle', 'spark-stage', 'spark-broadcast-join', 'spark-data-skew'],
  sections: {
    definition: `**Wide Transformation (Biến đổi rộng)** là phép biến đổi mà **một Partition cha có thể đóng góp dữ liệu cho nhiều Partition con**. Ví dụ: \`groupBy\`, \`join\` thông thường, \`distinct\`, \`orderBy\`, \`repartition\`.

Để gom các dòng cùng key về một nơi, dữ liệu phải di chuyển giữa các máy qua [[spark-shuffle]].`,

    origin: `Đây là bản chất của phép nhóm và phép nối trên dữ liệu phân tán, không phải do Spark tạo ra: dòng có cùng key nằm rải rác nên phải gom lại. Pha Shuffle của MapReduce làm đúng việc này. Spark tách riêng để xem nó như một loại dependency, từ đó biết cần cắt Stage ở đâu và cần ghi dữ liệu trung gian ở đâu.`,

    whyUse: `Thường đây là phần tốn kém nhất của job, nên nhận ra phép nào là Wide là bước đầu của mọi việc tối ưu. Mỗi phép Wide tốn mạng, đĩa, bộ nhớ và là nơi [[spark-data-skew]] xuất hiện.`,

    mechanism: `Khi gặp Wide Transformation:

1. Stage hiện tại kết thúc, Task ghi kết quả ra file shuffle, chia theo Partition đích.
2. Stage mới bắt đầu, Task đọc các khối dữ liệu của mình từ nhiều Executor.
3. Stage sau chỉ chạy khi Stage trước đã hoàn tất, nên đây cũng là nơi thời gian bị chờ.

**Không phải lúc nào cũng cần shuffle:** nếu hai bảng đã được chia theo cùng key và cùng số Partition (bucketing, hoặc do shuffle trước đó), \`join\` có thể bỏ qua shuffle.

Khi mất dữ liệu, một Partition con có thể cần dữ liệu từ nhiều Partition cha, nên việc tính lại đắt hơn nhiều so với Narrow. File shuffle trên đĩa giúp giảm bớt chi phí này.`,

    example: `Một báo cáo tính doanh thu theo khách hàng, chạy \`groupBy(customer_id)\` trên 2 TB. Spark UI hiển thị 400 GB dữ liệu shuffle. Kỹ sư lọc đơn đã hủy và chọn đúng 3 cột trước \`groupBy\`, lượng shuffle giảm còn 60 GB và thời gian chạy giảm một nửa, dù phép Wide vẫn còn đó. Bài học: khó bỏ phép Wide, nhưng thường giảm được lượng dữ liệu đi vào nó.`,

    prosCons: {
      pros: [
        'Là cách duy nhất để nhóm, nối và sắp xếp toàn cục trên dữ liệu phân tán.',
        'Có thể giúp phân bố lại dữ liệu cho đều hơn.',
      ],
      cons: [
        'Tốn mạng, đĩa, bộ nhớ và tuần tự hóa.',
        'Tạo ranh giới Stage, Stage sau phải chờ Stage trước.',
        'Có thể gây lệch dữ liệu khi có key xuất hiện quá nhiều.',
      ],
    },

    whenToUse: {
      use: [
        'Bắt buộc dùng khi cần nhóm hoặc nối theo key.',
        'Dùng [[spark-repartition-coalesce|repartition]] khi cần phân bố lại dữ liệu đang lệch.',
      ],
      avoid: [
        'Không `distinct` hay `orderBy` khi kết quả không thật sự cần.',
        'Khi một bảng đủ nhỏ, dùng [[spark-broadcast-join]] để tránh shuffle.',
      ],
    },

    comparison: {
      headers: ['Phép', 'Có gây shuffle không', 'Ghi chú'],
      rows: [
        ['`groupBy().agg()`', 'Có', 'Spark tổng hợp sơ bộ trước khi shuffle'],
        ['`join`', 'Thường có', 'Không shuffle khi Broadcast hoặc đã chia sẵn'],
        ['`orderBy`', 'Có', 'Lấy mẫu để chia khoảng rồi shuffle'],
        ['`repartition`', 'Có', 'Luôn shuffle, kể cả khi giảm Partition'],
        ['`coalesce`', 'Không', 'Là Narrow, chỉ gộp Partition'],
      ],
    },

    misconceptions: [
      {
        myth: 'Mọi `join` đều là Wide và đều gây shuffle.',
        truth: 'Broadcast Join không shuffle. Hai bảng đã được chia sẵn theo cùng key cũng có thể không cần shuffle.',
      },
      {
        myth: 'Wide nghĩa là kết quả có nhiều cột hơn.',
        truth: 'Wide nói về quan hệ giữa các Partition, không liên quan đến số cột của dữ liệu.',
      },
    ],
  },
})
