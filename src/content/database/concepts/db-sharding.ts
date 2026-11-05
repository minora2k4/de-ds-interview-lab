import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-sharding',
  summary:
    'Sharding chia dữ liệu theo dòng ra nhiều máy chủ độc lập để vượt giới hạn ghi và dung lượng của một máy. Cái giá là giao dịch và Join xuyên shard trở nên khó, và việc chọn shard key rất khó đổi về sau.',
  tags: ['Mở rộng', 'Hệ thống phân tán', 'System Design', 'First Principles'],
  related: ['db-partitioning', 'db-transactions', 'db-denormalization', 'cloud-replication', 'cloud-cap', 'spark-data-skew'],
  sections: {
    definition: `**Sharding (Phân mảnh ngang giữa nhiều máy chủ)** chia dữ liệu của bảng theo dòng ra nhiều máy chủ, mỗi máy gọi là một **shard** và chỉ giữ một phần dữ liệu. **Shard key** quyết định mỗi dòng nằm ở shard nào.`,

    origin: `Nâng cấp máy chủ sẽ chạm giới hạn phần cứng và giá thành. Read replica chỉ mở rộng được đọc, vì mọi lần ghi vẫn đi qua primary và mỗi replica vẫn chứa đủ dữ liệu. [[db-partitioning]] vẫn nằm trên một máy. Sharding khắc phục cả giới hạn ghi và dung lượng. Các hệ như Vitess, Citus, MongoDB đóng gói cách làm này thay vì để ứng dụng tự xử lý.`,

    whyUse: `Thêm máy là tăng được thông lượng ghi và dung lượng, và mỗi máy làm việc với tập dữ liệu nhỏ hơn nên index vừa bộ nhớ. Sự cố của một shard cũng chỉ ảnh hưởng đến phần dữ liệu trên đó.`,

    mechanism: `**Chọn shard key** là quyết định quan trọng nhất và khó đổi nhất. Key tốt có nhiều giá trị khác nhau, phân bố đều, và xuất hiện trong đa số truy vấn.

**Các cách chia:**

- **Hash:** phân bố đều, nhưng truy vấn theo khoảng phải hỏi mọi shard.
- **Range:** quét khoảng rất tốt, nhưng key tăng dần như thời gian làm mọi lần ghi dồn vào shard cuối, gọi là **hot shard**.
- **Directory:** bảng tra cứu ánh xạ key sang shard, linh hoạt nhưng thêm một thành phần phải luôn sẵn sàng.

**Định tuyến:** truy vấn có shard key đi thẳng đến một shard. Truy vấn thiếu shard key thành **scatter-gather**: gửi đến mọi shard rồi gộp lại, nên chậm theo shard chậm nhất.

**Thêm shard:** với \`hash(key) % N\`, tăng N từ 4 lên 5 làm khoảng 80% key đổi chỗ. Consistent hashing hoặc chia trước thành nhiều shard logic, ví dụ 1.024 shard logic trên 16 máy, giúp chỉ phải di chuyển một phần nhỏ.

**Vì sao giao dịch khó:** trên một máy, commit là một lần ghi vào một log, còn khóa và snapshot nằm chung bộ nhớ. Qua nhiều máy thì không có gì chung, và mạng có thể lỗi bất cứ lúc nào. Để nguyên tử phải dùng **2PC (Two-Phase Commit)**: thêm các vòng mạng, và nếu bộ điều phối lỗi sau bước prepare thì các shard phải giữ khóa để chờ. Vitess còn nêu rõ TwoPC chỉ đảm bảo nguyên tử, người đọc vẫn có thể thấy commit dở dang giữa các shard. Saga thay thế bằng các bước bù trừ, nhưng mất tính cô lập.

**Vì sao Join khó:** các dòng cần ghép nằm trên nhiều máy, nên phải kéo qua mạng, tương tự [[spark-shuffle]]. Cách tránh là **co-location** (các bảng cùng shard key để Join trong một shard), **reference table** (sao chép bảng nhỏ đến mọi shard) và [[db-denormalization]]. \`UNIQUE\` toàn cục và khóa ngoại xuyên shard cũng khó thực thi vì cùng lý do.`,

    diagram: {
      mermaid: `flowchart TD
  A["Ứng dụng"] --> B["Router: tính shard từ shard key"]
  F["Metadata: key thuộc shard nào"] --> B
  B --> C["Shard 1 và replica"]
  B --> D["Shard 2 và replica"]
  B --> E["Shard 3 và replica"]`,
      caption:
        'Truy vấn có shard key chỉ đi đến một shard. Thiếu shard key thì Router phải hỏi tất cả. Mỗi shard vẫn cần replica riêng.',
    },

    example: `Một SaaS có 40 TB dữ liệu và 30.000 lượt ghi mỗi giây, vượt quá khả năng của một máy. Gần như mọi truy vấn đều theo khách hàng, nên nhóm chọn \`tenant_id\`, chia hash thành 1.024 shard logic trên 16 máy, và co-location các bảng theo \`tenant_id\`.

Một khách hàng lớn chiếm 12% dữ liệu làm một shard quá tải. Hash không tách được một key, nên nhóm chuyển khách này sang máy riêng. Báo cáo trên toàn bộ khách hàng không chạy trên shard nữa, mà đưa sang kho dữ liệu qua [[etl-cdc]].`,

    prosCons: {
      pros: [
        '**Mở rộng được ghi và dung lượng,** điều replica và máy lớn hơn không làm được mãi.',
        '**Giới hạn phạm vi sự cố:** mất một shard không làm mất toàn hệ thống.',
        '**Hiệu quả khi truy vấn theo một key:** thêm máy gần như tăng tuyến tính thông lượng.',
      ],
      cons: [
        '**Giao dịch và Join xuyên shard đắt,** và thường phải thiết kế lại ứng dụng.',
        '**Vận hành phức tạp:** chia lại dữ liệu, sao lưu nhất quán, đổi schema trên nhiều máy.',
        '**Shard key khó đổi:** chọn sai thì phải di chuyển lại toàn bộ dữ liệu.',
      ],
    },

    whenToUse: {
      use: [
        'Đã tối ưu truy vấn, dùng replica, partition và máy lớn hơn mà ghi hoặc dung lượng vẫn vượt giới hạn.',
        'Truy vấn tự nhiên xoay quanh một key, như khách hàng hoặc người dùng.',
      ],
      avoid: [
        'Dữ liệu còn vừa một máy: chi phí phức tạp là có thật, còn lợi ích thì chưa.',
        'Nghiệp vụ cần nhiều giao dịch và Join giữa các thực thể không có key chung.',
      ],
    },

    comparison: {
      intro: 'Ba kỹ thuật này giải quyết ba vấn đề khác nhau và thường được dùng cùng nhau:',
      headers: ['Tiêu chí', 'Replication', 'Partitioning', 'Sharding'],
      rows: [
        ['Giải quyết', 'Mở rộng đọc, sẵn sàng', 'Bảng lớn trên một máy', 'Giới hạn ghi và dung lượng'],
        ['Mỗi dòng nằm ở', 'Mọi bản sao', 'Một partition', 'Một shard'],
        ['Giao dịch, Join', 'Giữ nguyên', 'Giữ nguyên', 'Khó khi xuyên shard'],
        ['Độ phức tạp', 'Thấp', 'Trung bình', 'Cao'],
      ],
    },

    misconceptions: [
      {
        myth: 'Cơ sở dữ liệu chậm thì nên sharding.',
        truth: 'Sharding là bước gần cuối. Đa số trường hợp chậm là do thiếu index, truy vấn kém hoặc thiếu cache.',
      },
      {
        myth: 'Thêm shard làm mọi truy vấn nhanh hơn.',
        truth: 'Chỉ truy vấn có shard key mới có lợi. Scatter-gather còn chậm hơn, vì phải chờ shard chậm nhất.',
      },
      {
        myth: 'Hash key giải quyết được mọi hot shard.',
        truth: 'Hash chia đều các key, nhưng không tách được một key lớn, giống [[spark-data-skew]].',
      },
      {
        myth: 'Sharding thay thế được replication.',
        truth: 'Hai kỹ thuật độc lập. Mất một shard không có replica là mất dữ liệu, nên MongoDB bắt buộc mỗi shard là một replica set.',
      },
    ],
  },
})
