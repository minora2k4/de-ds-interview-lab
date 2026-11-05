import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-governance',
  summary:
    'Data Governance là khung quy định, vai trò và quy trình xác định ai sở hữu dữ liệu, ai được dùng và dùng thế nào. Nó trả lời câu hỏi về trách nhiệm, còn công cụ chỉ là phần thực thi.',
  tags: ['Governance', 'Tuân thủ', 'Bảo mật'],
  related: ['etl-lineage', 'etl-data-quality', 'etl-etl-elt', 'dw-data-lake', 'dq-datasheets', 'arch-reliability'],
  sections: {
    definition: `**Data Governance (Quản trị dữ liệu)** là các quy định, vai trò và quy trình để quản lý dữ liệu như tài sản: ai chịu trách nhiệm, ai được truy cập, dữ liệu được định nghĩa, phân loại và lưu giữ ra sao.`,

    origin: `Khi lake và kho dùng chung xuất hiện, đưa dữ liệu vào rất dễ nhưng không ai biết ai sở hữu. Các quy định như GDPR, với quyền được xóa dữ liệu cá nhân, biến đây thành yêu cầu pháp lý.`,

    whyUse: `Không có quản trị, mỗi đội định nghĩa một chỉ số một cách, không rõ ai sửa khi sai, và dữ liệu nhạy cảm bị nhiều người đọc được.`,

    mechanism: `**Vai trò:**

- **Data Owner (Chủ sở hữu):** phía nghiệp vụ, quyết định quyền truy cập.
- **Data Steward (Người quản lý):** duy trì định nghĩa và chất lượng.
- **Custodian (Người vận hành):** đội kỹ thuật, thực thi lưu trữ và bảo mật.

**Thành phần:** phân loại dữ liệu theo độ nhạy cảm; kiểm soát truy cập với quyền tối thiểu, che cột; data catalog; chính sách lưu giữ và xóa; kiểm toán kết hợp [[etl-lineage|lineage]].

Quy định nên được **thực thi tự động**, ví dụ gắn nhãn nhạy cảm thì tự che cột.`,

    example: `Một công ty có 4.000 bảng, không rõ bảng nào chứa số điện thoại. Yêu cầu xóa theo GDPR mất 3 tuần để xử lý. Sau khi gắn nhãn cột nhạy cảm, tự che theo vai trò và dùng lineage, cùng yêu cầu đó còn 2 ngày.`,

    prosCons: {
      pros: ['Giảm rủi ro pháp lý và làm rõ trách nhiệm.'],
      cons: ['Làm quá chặt khiến người dùng tìm đường vòng.'],
    },

    whenToUse: {
      use: ['Bắt đầu từ dữ liệu nhạy cảm và chỉ số quan trọng.'],
      avoid: ['Không áp quy trình phê duyệt nặng cho mọi bảng.'],
    },

    comparison: {
      headers: ['Khái niệm', 'Trả lời câu hỏi', 'Ví dụ'],
      rows: [
        ['Data Governance', 'Ai quyết định, theo quy định nào?', 'Ai được đọc cột lương'],
        ['Data Security', 'Thực thi bảo vệ thế nào?', 'Mã hóa, che cột, phân quyền'],
      ],
    },

    misconceptions: [
      {
        myth: 'Mua công cụ catalog là đã có quản trị dữ liệu.',
        truth: 'Không có vai trò, quy định và người chịu trách nhiệm thì catalog nhanh chóng lỗi thời.',
      },
      {
        myth: 'Quản trị dữ liệu chỉ là hạn chế quyền truy cập.',
        truth: 'Mục tiêu là dùng đúng, không phải dùng ít. Định nghĩa rõ ràng còn giúp dùng dữ liệu dễ hơn.',
      },
    ],
  },
})
