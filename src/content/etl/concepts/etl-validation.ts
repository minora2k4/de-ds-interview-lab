import { defineConcept } from '../../define'

export default defineConcept({
  id: 'etl-validation',
  summary:
    'Data Validation là các kiểm tra tự động tại một điểm trong pipeline, quyết định dữ liệu có được đi tiếp hay không. Nó có thể dừng job, cách ly dòng lỗi hoặc chỉ cảnh báo.',
  tags: ['Validation', 'dbt', 'Kiểm thử'],
  related: ['etl-data-quality', 'etl-transformation', 'etl-ingestion', 'dq-tools', 'dq-incremental', 'dw-schema-evolution'],
  sections: {
    definition: `**Data Validation (Kiểm tra hợp lệ dữ liệu)** là kiểm tra dữ liệu theo quy tắc đã định tại một điểm cụ thể, rồi quyết định **dừng, cách ly hay cho đi tiếp**. Nó là cổng kiểm soát, còn [[etl-data-quality|Data Quality]] là mức độ phù hợp theo thời gian.`,

    origin: `Pipeline thường báo thành công cả khi dữ liệu sai, như nguồn gửi thiếu nửa số dòng. Các công cụ như dbt tests, Great Expectations đưa quy tắc vào pipeline như kiểm thử phần mềm.`,

    whyUse: `Phát hiện càng sớm thì càng ít bảng bị ảnh hưởng. Cổng kiểm tra trước khi công bố giúp người dùng thấy dữ liệu cũ nhưng đúng, thay vì mới nhưng sai.`,

    mechanism: `**Loại kiểm tra:** schema; giá trị (không null, trong khoảng); quan hệ (khóa duy nhất, khóa ngoại); thể tích và độ mới.

**Hành động khi lỗi:**

- **Dừng:** khi sai toàn cục, như thiếu cả nguồn.
- **Cách ly (quarantine):** chuyển dòng lỗi sang bảng riêng, phần còn lại đi tiếp.
- **Cảnh báo:** với vấn đề nhẹ hoặc quy tắc mới.

**Ghi, kiểm tra rồi mới công bố:** ghi vào vị trí tạm, đạt mới hoán đổi sang bảng chính.

**dbt** có sẵn 4 data test: \`unique\`, \`not_null\`, \`accepted_values\`, \`relationships\`. Mỗi test là truy vấn tìm dòng vi phạm, đạt khi không trả về dòng nào.`,

    example: `Một nguồn thường gửi 2 triệu dòng mỗi ngày, hôm đó chỉ có 300 nghìn. Kiểm tra thể tích so với trung bình 28 ngày phát hiện mức giảm 85%, job dừng trước khi công bố. Ngoài ra, 0,02% dòng có số tiền âm được cách ly thay vì dừng cả job.`,

    prosCons: {
      pros: ['Chặn dữ liệu sai trước khi lan xuống.'],
      cons: ['Quá nhiều cảnh báo làm người trực bỏ qua cảnh báo thật.', 'Chỉ bắt được điều đã viết thành quy tắc.'],
    },

    whenToUse: {
      use: ['Tại điểm vào để bắt lỗi nguồn, và trước khi công bố để bắt lỗi biến đổi.'],
      avoid: ['Không dừng cả pipeline vì một dòng lỗi khi có thể cách ly.'],
    },

    comparison: {
      headers: ['Tiêu chí', 'Data Validation', 'Data Quality'],
      rows: [
        ['Trả lời', 'Dữ liệu này có được đi tiếp?', 'Dữ liệu có phù hợp để dùng?'],
        ['Cách làm', 'Quy tắc biết trước', 'Đo theo các chiều, theo thời gian'],
      ],
    },

    misconceptions: [
      {
        myth: 'Test đạt nghĩa là dữ liệu đúng.',
        truth: 'Test chỉ cho biết các quy tắc đã viết không bị vi phạm.',
      },
    ],
  },
})
