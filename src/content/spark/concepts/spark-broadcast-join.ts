import { defineConcept } from '../../define'

export default defineConcept({
  id: 'spark-broadcast-join',
  summary:
    'Broadcast Join gửi bảng nhỏ tới mọi Executor, nên bảng lớn không phải shuffle. Đây thường là tối ưu Join hiệu quả nhất khi một bảng đủ nhỏ.',
  tags: ['Join', 'Shuffle', 'Hiệu năng'],
  related: ['spark-sort-merge-join', 'spark-shuffle', 'spark-driver', 'spark-data-skew', 'spark-catalyst'],
  sections: {
    definition: `**Broadcast Join (Join bằng cách phát bảng nhỏ)** là chiến lược Join trong đó **một bản sao của bảng nhỏ được gửi tới mọi Executor**. Mỗi Task của bảng lớn dò trực tiếp trên bảng băm tại chỗ, nên **bảng lớn không phải [[spark-shuffle]]**.

Tên kỹ thuật trên kế hoạch thực thi là \`BroadcastHashJoin\`.`,

    origin: `Join thông thường cần đưa các dòng cùng key về một nơi, tức phải shuffle cả hai bảng, kể cả khi một bảng chỉ có vài MB. Với bảng dữ liệu lớn, việc này cực kỳ lãng phí. MapReduce có **Map-side Join** với ý tưởng tương tự. Broadcast Join tận dụng nhận xét: **di chuyển bảng nhỏ rẻ hơn rất nhiều so với di chuyển bảng lớn**.`,

    whyUse: `Lợi ích rất rõ khi bảng nhỏ thực sự nhỏ:

1. **Bỏ hẳn shuffle của bảng lớn,** tiết kiệm mạng, đĩa và bộ nhớ.
2. **Tránh được [[spark-data-skew]]** từ phía bảng lớn, vì dữ liệu không bị gom theo key.
3. **Giữ nguyên số Partition** của bảng lớn và không cần thêm Stage.

Trường hợp điển hình là bảng Fact lớn nối với bảng Dimension nhỏ như danh mục, quốc gia.`,

    mechanism: `Quá trình gồm các bước:

1. **Quyết định.** Catalyst chọn Broadcast nếu ước tính kích thước một bảng dưới \`spark.sql.autoBroadcastJoinThreshold\` = 10 MB, hoặc có gợi ý \`broadcast()\`. Với AQE, Spark có thể đổi sang Broadcast lúc chạy nếu kích thước thật đủ nhỏ.
2. **Gom về Driver.** Bảng nhỏ được thu về [[spark-driver]] và xây thành bảng băm. Đây là lý do Broadcast lớn có thể gây OOM ở Driver.
3. **Phát đi.** Bảng băm được phát tới các Executor theo kiểu BitTorrent để giảm tải, có giới hạn thời gian \`spark.sql.broadcastTimeout\` = 300 giây.
4. **Dò khớp.** Mỗi Executor giữ một bản, và các Task của bảng lớn dò vào đó.

**Hạn chế về loại Join:** chỉ phát được phía không được bảo toàn. \`LEFT JOIN\` thì chỉ phát được bảng bên phải, và không dùng được với \`FULL OUTER JOIN\`. Có giới hạn cứng 8 GB cho bảng Broadcast.`,

    diagram: {
      mermaid: `flowchart TD
  S["Bảng nhỏ: country"] --> D["Driver gom dữ liệu, xây bảng băm"]
  D -->|"phát tới mọi Executor"| E1["Executor 1: bảng băm"]
  D -->|"phát tới mọi Executor"| E2["Executor 2: bảng băm"]
  B1["Partition bảng lớn"] -->|"dò tại chỗ"| E1
  B2["Partition bảng lớn"] -->|"dò tại chỗ"| E2`,
      caption: 'Bảng lớn đứng yên, chỉ bảng nhỏ di chuyển. Vì vậy không có shuffle ở phía bảng lớn.',
    },

    example: `Bảng \`transactions\` 3 TB được join với bảng \`merchant\` 50 MB. Do vượt ngưỡng 10 MB, Spark chọn Sort Merge Join, shuffle cả 3 TB, chạy 2 giờ và có skew ở những merchant lớn.

Kỹ sư kiểm tra: 50 MB rõ ràng là nhỏ so với bộ nhớ Executor 16 GB, nên thêm gợi ý \`broadcast(merchant)\`. Job còn 20 phút và hết skew. Sáu tháng sau, bảng \`merchant\` tăng lên 3 GB, Driver bắt đầu OOM. Vì vậy cần theo dõi kích thước bảng này, thay vì coi gợi ý là cố định mãi.`,

    prosCons: {
      pros: [
        '**Bỏ được shuffle bảng lớn,** thường giảm thời gian rất nhiều.',
        '**Tránh skew** từ phía bảng lớn.',
        '**Không cần sắp xếp,** dò trên bảng băm rất nhanh.',
      ],
      cons: [
        '**Tốn bộ nhớ:** mỗi Executor giữ một bản, Driver cũng phải giữ tạm.',
        '**Rủi ro khi bảng lớn dần,** gây OOM hoặc quá thời gian.',
        '**Không dùng được với mọi loại Join,** ví dụ `FULL OUTER JOIN`.',
        '**Phụ thuộc vào ước lượng kích thước,** thống kê sai có thể chọn sai.',
      ],
    },

    whenToUse: {
      use: [
        'Một bảng nhỏ hơn đáng kể so với bộ nhớ Executor và Driver, thường đến vài trăm MB.',
        'Join bảng Fact với bảng Dimension.',
        'Khi bảng lớn có skew trên key Join.',
      ],
      avoid: [
        'Bảng nhỏ có thể tăng nhanh theo thời gian mà không được giám sát.',
        'Cả hai bảng đều lớn: dùng [[spark-sort-merge-join]].',
        'Driver có bộ nhớ thấp hoặc Executor đang chịu áp lực bộ nhớ cao.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'Broadcast Hash Join', 'Sort Merge Join', 'Shuffle Hash Join'],
      rows: [
        ['Shuffle', 'Không ở bảng lớn', 'Cả hai bảng', 'Cả hai bảng'],
        ['Sắp xếp', 'Không', 'Cả hai bên', 'Không'],
        ['Bộ nhớ', 'Bảng nhỏ phải vừa bộ nhớ', 'Có thể tràn ra đĩa', 'Một bên phải vừa bộ nhớ'],
        ['Kích thước phù hợp', 'Một bảng rất nhỏ', 'Hai bảng lớn', 'Một bảng vừa'],
        ['`FULL OUTER JOIN`', 'Không', 'Có', 'Có'],
      ],
    },

    misconceptions: [
      {
        myth: 'Ngưỡng 10 MB là kích thước tối đa có thể Broadcast.',
        truth: 'Đó chỉ là ngưỡng tự động chọn. Có thể dùng gợi ý `broadcast()` với bảng lớn hơn nhiều, miễn là vừa bộ nhớ. Giới hạn cứng là 8 GB.',
      },
      {
        myth: 'Broadcast chỉ tốn bộ nhớ của Executor.',
        truth: 'Dữ liệu được gom về Driver trước, nên Driver cũng cần đủ bộ nhớ. Đây là nguyên nhân OOM ở Driver rất thường gặp.',
      },
      {
        myth: 'Tăng ngưỡng càng cao càng tốt.',
        truth: 'Ngưỡng quá cao có thể khiến Spark phát những bảng lớn do ước lượng, gây OOM và quá thời gian. Nên dùng gợi ý rõ ràng cho từng trường hợp đã biết.',
      },
    ],
  },
})
