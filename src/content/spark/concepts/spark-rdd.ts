import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-rdd',
  summary:
    'RDD là tập dữ liệu phân tán, bất biến, có thể tính lại từ lineage khi mất. Đây là API tầng thấp, nền móng của Spark, nhưng không được Catalyst tối ưu.',
  tags: ['API', 'Lineage', 'Chịu lỗi'],
  related: ['spark-dataframe', 'spark-dataset', 'spark-lazy-evaluation', 'spark-dag', 'spark-partition'],
  sections: {
    definition: `**RDD (Resilient Distributed Dataset, tập dữ liệu phân tán có khả năng phục hồi)** là một tập phần tử **bất biến**, được chia thành nhiều [[spark-partition|Partition]] nằm trên nhiều máy.

Tên gọi nói lên ba tính chất: **Resilient** vì tính lại được khi mất dữ liệu, **Distributed** vì trải trên nhiều máy, **Dataset** vì là một tập dữ liệu. Với RDD, Spark không biết cấu trúc bên trong của mỗi phần tử.`,

    origin: `RDD ra đời để giải quyết mâu thuẫn của các hệ thống trước đó: muốn dùng bộ nhớ để chạy nhanh nhưng vẫn phải chịu lỗi.

Các cách cũ như nhân bản dữ liệu hoặc ghi log từng thay đổi rất tốn kém với dữ liệu lớn. RDD thay bằng cách **ghi lại phép biến đổi (lineage)**, tức cách tạo ra dữ liệu, thay vì chính dữ liệu. Nhờ vậy Spark vừa giữ được dữ liệu trong bộ nhớ, vừa khôi phục được khi lỗi mà không tốn chi phí nhân bản như MapReduce phải ghi HDFS.`,

    whyUse: `Hiện nay nên ưu tiên [[spark-dataframe]], nhưng RDD vẫn đáng học vì **mọi thứ của Spark đều chạy trên nền RDD**: hiểu RDD là hiểu lineage, dependency và Partition. Bạn cũng cần RDD khi muốn kiểm soát trực tiếp việc chia Partition, hoặc xử lý dữ liệu phi cấu trúc không thể biểu diễn thành bảng.`,

    mechanism: `Mỗi RDD được mô tả bằng năm thông tin:

1. Danh sách các **Partition**.
2. **Hàm tính** cho từng Partition.
3. **Dependency** tới các RDD cha, tức lineage.
4. **Partitioner** cho RDD dạng key-value (không bắt buộc).
5. **Vị trí ưu tiên** để chạy Task gần dữ liệu (không bắt buộc).

Khi mất một Partition, Spark dựa vào dependency để chạy lại đúng các bước cần thiết. RDD là [[spark-lazy-evaluation|trì hoãn]] và bất biến: mỗi phép biến đổi tạo RDD mới.`,

    example: `Một hệ thống cần phân tích log thô có nhiều định dạng khác nhau, không thể đưa ngay về dạng bảng. Kỹ sư đọc log thành RDD các dòng, dùng hàm riêng để tách từng loại, rồi chuyển phần đã làm sạch sang DataFrame để tổng hợp. Cách này tận dụng sự linh hoạt của RDD ở khâu làm sạch và sức mạnh tối ưu của DataFrame ở khâu tổng hợp.`,

    prosCons: {
      pros: [
        'Kiểm soát chi tiết việc xử lý và chia Partition.',
        'Xử lý được dữ liệu không có cấu trúc rõ ràng.',
        'Khôi phục khi lỗi nhờ lineage.',
      ],
      cons: [
        'Không được Catalyst và Tungsten tối ưu vì Spark không biết cấu trúc dữ liệu.',
        'Tốn bộ nhớ và GC do lưu nhiều đối tượng JVM.',
        'Code dài hơn, dễ viết kém hiệu quả, ví dụ dùng `groupByKey` thay vì `reduceByKey`.',
      ],
    },

    whenToUse: {
      use: [
        'Dữ liệu phi cấu trúc cần logic xử lý đặc thù.',
        'Cần kiểm soát Partitioner tùy chỉnh.',
        'Bảo trì hệ thống cũ đã viết bằng RDD.',
      ],
      avoid: [
        'Dữ liệu có cấu trúc: dùng DataFrame để được tối ưu tự động.',
        'Ứng dụng dùng Spark Connect, vì nó không hỗ trợ RDD.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'RDD', 'DataFrame', 'Dataset'],
      rows: [
        ['Schema', 'Không', 'Có', 'Có'],
        ['Tối ưu bằng Catalyst', 'Không', 'Có', 'Có, nhưng hạn chế với lambda'],
        ['Kiểm tra kiểu khi biên dịch', 'Có (Scala, Java)', 'Không', 'Có'],
        ['Ngôn ngữ', 'Scala, Java, Python', 'Scala, Java, Python, R', 'Scala, Java'],
        ['Hiệu năng', 'Thấp nhất', 'Cao', 'Cao, thấp hơn DataFrame khi dùng lambda'],
      ],
    },

    misconceptions: [
      {
        myth: 'RDD đã bị loại bỏ khỏi Spark.',
        truth: 'RDD vẫn là nền tảng của Spark. DataFrame cuối cùng cũng được chuyển thành RDD để thực thi, chỉ là không còn là API được khuyến khích cho dữ liệu có cấu trúc.',
      },
      {
        myth: 'Resilient nghĩa là dữ liệu được sao chép sang nhiều máy.',
        truth: 'Khả năng phục hồi đến từ lineage: Spark tính lại phần bị mất. Sao chép chỉ xảy ra khi bạn chọn Storage Level có hậu tố `_2`.',
      },
    ],
  },
})
