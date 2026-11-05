import { defineConcept } from '../../define'

export default defineConcept({
  id: 'db-relational-nosql',
  summary:
    'CSDL quan hệ tổ chức dữ liệu thành bảng có schema, mạnh về Join và giao dịch. NoSQL là nhóm hệ phi quan hệ, thường đổi sự linh hoạt khi truy vấn để lấy khả năng mở rộng ngang.',
  tags: ['Hệ thống', 'NoSQL', 'Lựa chọn công nghệ'],
  related: ['db-acid', 'db-sharding', 'db-denormalization', 'cloud-cap', 'cloud-eventual-consistency'],
  sections: {
    definition: `**Relational Database (CSDL quan hệ)** lưu dữ liệu thành các bảng có schema cố định, liên kết bằng khóa, truy vấn bằng SQL.

**NoSQL (Not only SQL)** là tên chung cho các hệ không theo mô hình bảng quan hệ, gồm bốn nhóm chính: key-value, document, wide-column và graph.`,

    origin: `Khoảng những năm 2000, lượng dữ liệu web vượt khả năng của một máy, và Join cùng giao dịch trở nên rất đắt khi phân tán. Bigtable (2006) và Dynamo (2007) khắc phục bằng cách bỏ bớt các tính năng này để mở rộng ngang. Từ NoSQL phổ biến từ năm 2009.`,

    whyUse: `Phân biệt đúng giúp chọn hệ theo cách truy cập dữ liệu, thay vì theo trào lưu.`,

    mechanism: `**Quan hệ** thiết kế theo dữ liệu trước: chuẩn hóa rồi viết truy vấn tùy ý, optimizer tự chọn kế hoạch.

**NoSQL** thường thiết kế theo truy vấn trước: biết trước các mẫu đọc, rồi gom dữ liệu liên quan lại với nhau. Dữ liệu nằm cùng một shard thì không cần Join hay giao dịch xuyên máy, nên hai tính năng này hay bị hạn chế.

Ranh giới ngày càng mờ: MongoDB có giao dịch ACID nhiều document, PostgreSQL có \`JSONB\`.`,

    example: `Hệ IoT nhận 5 tỷ sự kiện mỗi ngày, luôn đọc theo \`(device_id, khoảng thời gian)\`, không cần Join, nên Cassandra rất phù hợp. Phần hóa đơn cần giao dịch và báo cáo tùy ý thì vẫn nên để trên PostgreSQL.`,

    prosCons: {
      pros: [
        '**Quan hệ:** truy vấn linh hoạt, ràng buộc và giao dịch mạnh.',
        '**NoSQL:** mở rộng ngang dễ hơn, schema linh hoạt, mô hình sát với dữ liệu.',
      ],
      cons: [
        '**Quan hệ:** khó mở rộng ghi vượt quá một máy.',
        '**NoSQL:** truy vấn ngoài thiết kế rất đắt.',
      ],
    },

    whenToUse: {
      use: ['Chọn quan hệ khi chưa rõ mẫu truy vấn, NoSQL khi mẫu ổn định và quy mô vượt một máy.'],
      avoid: ['Không chọn NoSQL chỉ để né thiết kế schema: schema sẽ nằm ngầm trong code.'],
    },

    comparison: {
      headers: ['Nhóm', 'Mô hình', 'Phù hợp', 'Ví dụ'],
      rows: [
        ['Key-value', 'Khóa trỏ tới giá trị', 'Cache, phiên đăng nhập', 'Redis, DynamoDB'],
        ['Document', 'JSON lồng nhau', 'Hồ sơ, danh mục', 'MongoDB'],
        ['Wide-column', 'Hàng theo khóa phân vùng', 'Sự kiện theo thời gian', 'Cassandra, HBase'],
        ['Graph', 'Nút và cạnh', 'Quan hệ nhiều bước', 'Neo4j'],
      ],
    },

    misconceptions: [
      {
        myth: 'NoSQL không có ACID.',
        truth: 'Tùy hệ. MongoDB có giao dịch nhiều document, và nhiều hệ đảm bảo nguyên tử trên một khóa.',
      },
      {
        myth: 'NoSQL luôn nhanh hơn.',
        truth: 'Nó nhanh với mẫu truy vấn được thiết kế sẵn. Truy vấn khác có thể phải quét toàn bộ.',
      },
    ],
  },
})
