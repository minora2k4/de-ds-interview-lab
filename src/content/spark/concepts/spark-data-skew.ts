import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-data-skew',
  summary:
    'Data Skew xảy ra khi một số key chứa nhiều dữ liệu hơn hẳn, làm vài Task chạy rất lâu hoặc OOM. Cách xử lý gồm AQE, Broadcast, Salting và tách riêng key lớn.',
  tags: ['Hiệu năng', 'Shuffle', 'Join', 'First Principles'],
  related: ['spark-shuffle', 'spark-partition', 'spark-broadcast-join', 'spark-sort-merge-join', 'spark-task', 'spark-performance'],
  sections: {
    definition: `**Data Skew (Lệch dữ liệu)** là tình trạng dữ liệu phân bố không đều giữa các [[spark-partition|Partition]]: một vài Partition lớn hơn nhiều so với phần còn lại.

Vì mỗi Partition do một [[spark-task]] xử lý, và Stage chỉ xong khi Task cuối cùng xong, **một Task chậm có thể giữ chân cả job**, dù 199 Task khác đã hoàn thành từ lâu.`,

    origin: `Skew không phải là thiết kế của Spark, mà là **bản chất của dữ liệu thực tế**: dữ liệu thường theo phân phối đuôi dài. Một vài khách hàng lớn, sản phẩm nổi tiếng hoặc giá trị null chiếm rất nhiều dòng.

MapReduce cũng gặp tình trạng tương tự, nhưng giải pháp chủ yếu thủ công. Spark bổ sung AQE từ phiên bản 3.0 để tự động xử lý một phần vấn đề, đặc biệt với Sort Merge Join, nhờ có số liệu kích thước thật sau shuffle.`,

    whyUse: `Hiểu skew rất quan trọng vì **thêm tài nguyên không giải quyết được nó**: Task lệch vẫn nằm trên một core, dù cụm có bao nhiêu máy. Nó thường dẫn đến:

- Job chạy mãi ở 99%, và Task cuối cùng chạy hàng giờ.
- Lỗi OOM ở Executor, dù tổng bộ nhớ cụm còn rất nhiều.
- Tốn tiền vì giữ cả cụm chỉ để chờ một Task.`,

    mechanism: `**Vì sao xảy ra:** khi shuffle, Partition đích được tính bằng \`hash(key) % số Partition\`. Mọi dòng có cùng key luôn vào cùng một Partition. Vì vậy một key có 1 tỷ dòng sẽ nằm trọn trong một Partition, dù tổng số Partition lớn đến đâu.

**Với Join, skew còn nghiêm trọng hơn:** nếu một key xuất hiện nhiều ở cả hai bảng, số dòng đầu ra bằng **tích** số dòng của hai bên, nên một Task có thể bùng nổ về dữ liệu.

**Cách phát hiện trên Spark UI:** xem bảng phân vị của Stage. Max của Duration và Shuffle Read Size lớn gấp nhiều lần trung vị là dấu hiệu rõ nhất.

**Cách xử lý, theo thứ tự nên thử:**

1. **Bỏ dữ liệu không cần:** lọc null hoặc key mặc định, vì đây là nguyên nhân rất phổ biến.
2. **AQE Skew Join:** bật mặc định, tự chia Partition lớn. Partition bị xem là lệch khi lớn hơn 5 lần trung vị và trên 256 MB. Chỉ áp dụng với Sort Merge Join và Shuffle Hash Join.
3. **[[spark-broadcast-join]]:** nếu bên kia đủ nhỏ, bảng lớn không phải shuffle, nên hết skew.
4. **Tách riêng key lớn:** xử lý key lệch bằng Broadcast, phần còn lại bằng Sort Merge Join, rồi \`union\`.
5. **Salting:** thêm số ngẫu nhiên vào key để chia một key thành nhiều key.

**Salting cần giữ đúng kết quả.** Với Join, phải nhân bản bên còn lại theo số muối. Với tổng hợp, cần hai bước: tổng hợp theo key đã có muối, rồi tổng hợp lại theo key gốc. Hàm không có tính kết hợp như \`median\` không thể làm theo cách này.`,

    diagram: {
      mermaid: `flowchart TD
  A["Key lệch: 1 tỷ dòng"] --> B["hash(key) đưa về cùng một Partition"]
  C["Các key khác: vài nghìn dòng"] --> D["Phân bố đều trên 199 Partition"]
  B --> E["1 Task chạy 3 giờ, có thể OOM"]
  D --> F["199 Task xong trong 2 phút"]
  E --> G["Stage chỉ xong khi Task cuối cùng xong"]
  F --> G`,
      caption:
        'Một key lớn nằm trọn trong một Partition. Thêm máy hoặc thêm Partition không tách được nó.',
    },

    example: `Một sàn thương mại điện tử join \`clicks\` (20 TB) với \`products\` (800 GB) theo \`product_id\`. Job dừng ở 199/200 Task, rồi OOM. Spark UI cho thấy một Partition có 4 TB trong khi trung vị chỉ 30 GB.

Điều tra cho thấy 15% số dòng có \`product_id\` là null, do trang lỗi. Sau khi lọc null, Partition lớn nhất còn 120 GB, nhưng một số sản phẩm nổi tiếng vẫn gây lệch. AQE tự chia các Partition này nhỏ hơn và nhân bản phần tương ứng của \`products\`. Job chạy ổn định trong 50 phút, mà không cần Salting thủ công.`,

    prosCons: {
      pros: [
        '**AQE tự động xử lý** nhiều trường hợp Join mà không phải sửa code.',
        '**Broadcast loại bỏ skew** một cách đơn giản khi một bên nhỏ.',
        '**Salting xử lý được** các trường hợp khó mà AQE không với tới.',
      ],
      cons: [
        '**Salting làm code phức tạp,** tăng dữ liệu do nhân bản và dễ sai logic.',
        '**AQE có giới hạn:** không áp dụng cho mọi loại Join và không xử lý skew trong tổng hợp.',
        '**Skew có thể thay đổi theo thời gian,** nên giải pháp cố định có thể mất tác dụng.',
      ],
    },

    whenToUse: {
      use: [
        'Kiểm tra phân phối key trước khi Join, bằng cách đếm top key hoặc xem Spark UI.',
        'Luôn bật AQE, là tuyến phòng thủ đầu tiên.',
        'Dùng Salting khi key lệch nhiều ở cả hai bảng hoặc khi AQE chưa đủ.',
      ],
      avoid: [
        'Không tăng bộ nhớ Executor làm giải pháp lâu dài cho skew.',
        'Không Salting khi chưa thử các cách đơn giản hơn như lọc null hay Broadcast.',
        'Không Salting với hàm tổng hợp không có tính kết hợp như `median`.',
      ],
    },

    comparison: {
      intro: 'Các cách xử lý skew, phù hợp với từng tình huống:',
      headers: ['Cách làm', 'Phù hợp khi', 'Đánh đổi'],
      rows: [
        ['Lọc null, key rác', 'Key lệch không có giá trị nghiệp vụ', 'Phải chắc chắn logic cho phép bỏ'],
        ['AQE Skew Join', 'Sort Merge Join hoặc Shuffle Hash Join', 'Không xử lý được tổng hợp'],
        ['Broadcast Join', 'Một bảng đủ nhỏ', 'Tốn bộ nhớ, bảng có thể lớn dần'],
        ['Tách key lớn', 'Biết trước vài key lớn', 'Thêm logic, phải cập nhật danh sách key'],
        ['Salting', 'Key lệch ở cả hai bên, hoặc tổng hợp có tính kết hợp', 'Code phức tạp, tăng dữ liệu'],
      ],
    },

    misconceptions: [
      {
        myth: 'Tăng số Partition sẽ giải quyết được skew.',
        truth: 'Mọi dòng cùng key vẫn vào một Partition. Tăng số Partition chỉ giúp với va chạm giữa các key khác nhau, không tách được một key đơn lẻ.',
      },
      {
        myth: 'Thêm máy hoặc thêm bộ nhớ là đủ.',
        truth: 'Task lệch vẫn chỉ chạy trên một core. Tăng bộ nhớ chỉ tránh được OOM, Task đó vẫn rất chậm.',
      },
      {
        myth: 'Mọi trường hợp lệch đều có thể xử lý bằng Salting.',
        truth: 'Salting chỉ giữ đúng kết quả nếu làm đúng cách: Join phải nhân bản bên còn lại, còn tổng hợp cần hàm có tính kết hợp và làm hai bước.',
      },
    ],
  },
})
