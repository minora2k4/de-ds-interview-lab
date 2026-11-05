import { defineConcept } from '../../define'

export default defineConcept({
  id: 'cloud-load-balancing',
  summary:
    'Load Balancer phân phối yêu cầu cho nhiều máy khỏe mạnh qua một địa chỉ duy nhất. L4 nhanh vì chỉ nhìn địa chỉ và cổng, L7 đọc được nội dung HTTP nên định tuyến linh hoạt hơn.',
  tags: ['Mạng', 'Mở rộng', 'High Availability'],
  related: ['cloud-scaling', 'cloud-high-availability', 'cloud-fault-tolerance', 'cloud-ec2', 'kafka-partition'],
  sections: {
    definition: `**Load Balancing (Cân bằng tải)** là phân phối yêu cầu tới nhiều máy để không máy nào quá tải, và tự loại máy hỏng. Client chỉ biết một địa chỉ, nên có thể thêm bớt máy mà client không hay biết.`,

    origin: `Trước đó, DNS round robin trả về nhiều địa chỉ IP cho một tên miền. DNS không biết máy nào hỏng và client còn giữ kết quả trong cache, nên yêu cầu vẫn tới máy chết. Load Balancer kiểm tra sức khỏe liên tục và quyết định theo từng kết nối.`,

    whyUse: `Đây là điều kiện để [[cloud-scaling|mở rộng ngang]] tầng ứng dụng, đồng thời tăng [[cloud-high-availability|tính sẵn sàng]].`,

    mechanism: `**Health Check (Kiểm tra sức khỏe):** gọi định kỳ từng máy, máy lỗi quá số lần quy định thì không nhận yêu cầu mới.

**Thuật toán chọn máy:**

- **Round Robin:** lần lượt, hợp khi các yêu cầu nặng như nhau.
- **Least Connections:** chọn máy ít kết nối nhất, hợp khi độ dài yêu cầu chênh lệch.
- **Consistent Hashing:** cùng key tới cùng máy, hợp với cache.

**L4** chỉ nhìn địa chỉ và cổng nên rất nhanh. **L7** đọc đường dẫn và header HTTP, nên định tuyến được theo nội dung nhưng tốn tài nguyên hơn.`,

    diagram: {
      mermaid: `flowchart TD
  A["Client"] --> B["Load Balancer"]
  B --> C["Máy 1: khỏe"]
  B --> D["Máy 2: khỏe"]
  B -.-> E["Máy 3: lỗi, không nhận yêu cầu"]
  F["Health Check định kỳ"] --> B`,
      caption: 'Client chỉ biết Load Balancer. Máy lỗi bị loại mà client không cần thay đổi gì.',
    },

    example: `API truy vấn chạy trên 10 máy, có truy vấn 50 ms, có truy vấn 30 giây. Với Round Robin, vài máy tích tụ nhiều truy vấn dài, độ trễ p99 lên 40 giây. Chuyển sang Least Connections, p99 còn 12 giây mà không thêm máy.`,

    prosCons: {
      pros: [
        'Che giấu số máy phía sau khỏi client.',
        'Tự loại máy hỏng, cho phép nâng cấp dần.',
      ],
      cons: [
        'Thêm một bước trên đường đi, và phải được thiết kế để không thành điểm lỗi duy nhất.',
        'Không chữa được điểm nghẽn phía sau, như cơ sở dữ liệu quá tải.',
      ],
    },

    whenToUse: {
      use: ['Tầng dịch vụ không giữ trạng thái, có nhiều máy giống nhau.'],
      avoid: [
        'Không dùng để chia việc ghi vào [[kafka-partition|Partition]] của Kafka: Producer phải gửi đúng tới leader.',
        'Hạn chế sticky session, vì nó làm lệch tải và mất phiên khi máy hỏng.',
      ],
    },

    comparison: {
      headers: ['Tiêu chí', 'L4', 'L7'],
      rows: [
        ['Căn cứ quyết định', 'Địa chỉ IP, cổng', 'Đường dẫn, header, cookie'],
        ['Tốc độ', 'Cao hơn', 'Thấp hơn do đọc nội dung'],
        ['Ví dụ', 'AWS NLB, Azure Load Balancer', 'AWS ALB, Azure Application Gateway'],
      ],
    },

    misconceptions: [
      {
        myth: 'Load Balancer giúp cơ sở dữ liệu ghi được nhiều hơn.',
        truth: 'Máy giữ trạng thái không thay thế được nhau. Ghi vẫn phải vào đúng nơi giữ dữ liệu.',
      },
    ],
  },
})
