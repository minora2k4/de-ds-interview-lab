import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-repartition-coalesce',
  summary:
    'repartition luôn shuffle để phân bố đều và có thể tăng hoặc giảm số Partition. coalesce chỉ giảm số Partition bằng cách gộp, không shuffle nên rẻ hơn nhưng có thể không đều.',
  tags: ['Partition', 'Shuffle'],
  related: ['spark-partition', 'spark-shuffle', 'spark-small-files', 'spark-narrow-transformation', 'spark-wide-transformation'],
  sections: {
    definition: `**Repartition** và **Coalesce** đều dùng để đổi số [[spark-partition|Partition]], nhưng theo hai cách khác nhau:

- **\`repartition(n)\`** chia lại toàn bộ dữ liệu bằng [[spark-shuffle]], có thể tăng hoặc giảm, và phân bố gần đều.
- **\`coalesce(n)\`** chỉ gộp các Partition có sẵn lại với nhau, thường là không shuffle, nên chỉ dùng để giảm.`,

    origin: `Sau khi lọc mạnh, dữ liệu có thể chỉ còn rất ít nhưng vẫn nằm trong hàng nghìn Partition gần như rỗng. \`repartition\` xử lý được nhưng phải shuffle toàn bộ, khá lãng phí nếu chỉ cần gộp lại. \`coalesce\` ra đời để giải quyết tình huống này bằng cách rẻ hơn: gộp các Partition sẵn có trên cùng máy mà không truyền dữ liệu qua mạng nhiều.`,

    whyUse: `Hai phép này điều khiển trực tiếp mức song song và số tệp đầu ra. Dùng đúng sẽ tránh được tệp nhỏ và các Task quá nặng. Dùng sai có thể thêm một lần shuffle thừa, hoặc vô tình làm toàn bộ tính toán phía trước chạy trên rất ít Task.`,

    mechanism: `**\`repartition(n)\`** là [[spark-wide-transformation]]: dùng round-robin để phân bố đều. **\`repartition(col)\`** băm theo cột, đưa các dòng cùng giá trị về một Partition, hữu ích trước \`partitionBy\` hoặc join. **\`repartitionByRange\`** chia theo khoảng giá trị.

**\`coalesce(n)\`** là [[spark-narrow-transformation]]: gộp Partition nên nằm cùng Stage với các bước trước. Đây là điểm cần chú ý: \`df.filter(...).coalesce(1)\` có thể làm **cả bước \`filter\` cũng chỉ chạy trên một Task**, vì không có ranh giới Stage ở giữa. Trong khi đó, \`repartition(1)\` tốn một lần shuffle nhưng giữ được mức song song cho các bước trước.

Với AQE, Spark tự gộp các Partition nhỏ sau shuffle. Có thể dùng gợi ý \`REBALANCE\` để yêu cầu cân bằng lại theo kích thước mục tiêu.`,

    example: `Một job lọc 5 TB log xuống còn 50 GB rồi ghi ra S3, tạo ra 8.000 tệp rất nhỏ. Kỹ sư thử \`coalesce(1)\` để có một tệp, nhưng cả job chạy trên một Task và mất nhiều giờ.

Cách đúng là chọn số tệp hợp lý: 50 GB chia cho 256 MB một tệp thì được khoảng 200 tệp. Với \`coalesce(200)\` hoặc \`repartition(200)\`, bước lọc phía trước vẫn chạy song song tốt, trong khi đầu ra gọn gàng. Vì lọc xong dữ liệu có thể lệch giữa các Partition, \`repartition\` cho tệp đều hơn nhưng tốn thêm một lần shuffle.`,

    prosCons: {
      pros: [
        '`repartition` cho phân bố đều và có thể tăng số Partition.',
        '`coalesce` rẻ vì không truyền dữ liệu qua mạng.',
        'Cả hai đều giúp kiểm soát số tệp đầu ra.',
      ],
      cons: [
        '`repartition` tốn chi phí shuffle.',
        '`coalesce` có thể tạo ra Partition lệch và làm giảm mức song song của các bước phía trước.',
        'Số cố định trong code có thể không còn phù hợp khi dữ liệu tăng.',
      ],
    },

    whenToUse: {
      use: [
        '`coalesce` khi cần giảm nhẹ số Partition trước khi ghi, sau khi dữ liệu đã giảm.',
        '`repartition` khi dữ liệu đang lệch, cần tăng số Partition, hoặc cần gom theo cột trước `partitionBy`.',
      ],
      avoid: [
        'Không `coalesce(1)` trên dữ liệu lớn: gây nghẽn và tạo một tệp khổng lồ.',
        'Không `repartition` trước `groupBy` cùng key, vì `groupBy` đã tự shuffle, trừ khi có lý do rõ ràng.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'repartition', 'coalesce'],
      rows: [
        ['Có shuffle không', 'Luôn có', 'Mặc định không'],
        ['Tăng số Partition', 'Được', 'Không, trừ khi bật shuffle trên RDD'],
        ['Phân bố dữ liệu', 'Gần đều', 'Có thể lệch'],
        ['Loại phép biến đổi', 'Wide', 'Narrow'],
        ['Ảnh hưởng tới bước trước', 'Không, vì có ranh giới Stage', 'Có thể làm giảm mức song song'],
        ['Chi phí', 'Cao hơn', 'Thấp hơn'],
      ],
    },

    misconceptions: [
      {
        myth: '`coalesce` lúc nào cũng tốt hơn vì rẻ hơn.',
        truth: 'Khi dữ liệu lệch hoặc cần giảm mạnh, `coalesce` có thể khiến job chậm hơn nhiều vì tính toán phía trước bị dồn vào ít Task. Khi đó `repartition` lại tốt hơn.',
      },
      {
        myth: '`coalesce(1)` chỉ ảnh hưởng tới bước ghi.',
        truth: 'Do không có ranh giới Stage, nó có thể kéo các bước phía trước trong cùng Stage về chạy trên một Task.',
      },
    ],
  },
})
